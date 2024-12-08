---
title: YForm YOrm-Tutorial
authors: [skerbis]
prio:
---

<!-- TOC --><a name="yorm-tutorial"></a>
# YORM Tutorial

<!-- TOC --><a name="yorm-tutorial-inhaltsverzeichnis"></a>
# YORM Tutorial - Inhaltsverzeichnis

- [YORM Tutorial](#yorm-tutorial)
   * [Teil 1: Grundlagen mit rex_yform_manager_dataset](#teil-1-grundlagen-mit-rex_yform_manager_dataset)
      + [Datensätze laden und auslesen](#datensätze-laden-und-auslesen)
      + [Mit Collections arbeiten](#mit-collections-arbeiten)
      + [Filtern und Sortieren](#filtern-und-sortieren)
      + [Mit Relationen arbeiten](#mit-relationen-arbeiten)
      + [Komplexe Abfragen](#komplexe-abfragen)
      + [Datensätze zählen und prüfen](#datensätze-zählen-und-prüfen)
      + [Pagination](#pagination)
   * [Teil 2: Arbeiten mit Model-Classes](#teil-2-arbeiten-mit-model-classes)
      + [Vergleich: Ohne vs. Mit Model-Class](#vergleich-ohne-vs-mit-model-class)
      + [Eine Model-Class erstellen](#eine-model-class-erstellen)
      + [Die Model-Class verwenden](#die-model-class-verwenden)
      + [Praktisches Beispiel: News-Ausgabe](#praktisches-beispiel-news-ausgabe)
   * [Teil 3: Komplettes News-System & Tipps](#teil-3-komplettes-news-system-tipps)
      + [Table Manager Setup](#table-manager-setup)
      + [Die erweiterte Model-Class](#die-erweiterte-model-class)
      + [Frontend Module](#frontend-module)
   * [Tipps & Tricks](#tipps-tricks)
      + [Performance Optimierung](#performance-optimierung)
      + [Debugging](#debugging)
      + [Nützliche Queries](#nützliche-queries)
      + [Utility Methoden](#utility-methoden)
      + [Häufige Probleme](#häufige-probleme)
      + [Best Practices](#best-practices)



<!-- TOC --><a name="teil-1-grundlagen-mit-rex_yform_manager_dataset"></a>
## Teil 1: Grundlagen mit rex_yform_manager_dataset

YORM (YForm Object-Relational Mapping) ermöglicht dir den einfachen Zugriff auf deine REDAXO-Datenbanktabellen. Los geht's mit den Grundlagen!

<!-- TOC --><a name="datensätze-laden-und-auslesen"></a>
### Datensätze laden und auslesen

```php
// Einzelnen Datensatz laden
$article = rex_yform_manager_dataset::get(5, 'rex_news');

// Alle News-Artikel laden
$articles = rex_yform_manager_dataset::query('rex_news')->find();

// Werte auslesen
$title = $article->getValue('title');        // Titel ausgeben
$description = $article->getValue('text');   // Text ausgeben

// Mehrere Datensätze durchlaufen
foreach($articles as $article) {
    echo $article->getValue('title');
}
```

<!-- TOC --><a name="mit-collections-arbeiten"></a>
### Mit Collections arbeiten

```php
// Collection von Artikeln laden
$articles = rex_yform_manager_dataset::query('rex_news')->find();

// Collection filtern
$activeArticles = $articles->filter(function($article) {
    return $article->getValue('status') == 1;
});

// Werte aus Collection extrahieren
$titles = $articles->map(function($article) {
    return $article->getValue('title');
});

// Collection gruppieren
$articlesByCategory = $articles->groupBy(function($article) {
    return $article->getValue('category_id');
});

// Collections aufteilen
$chunks = $articles->split(3);  // Teilt in Gruppen von je 3 Artikeln

// Ersten/Letzten Eintrag holen
$first = $articles->first();
$last = $articles->last();

// Prüfen ob Collection leer ist
if (!$articles->isEmpty()) {
    // Collection verarbeiten
}

// IDs aus Collection holen
$ids = $articles->getIds();

// Key-Value Paare erstellen
$titleList = $articles->toKeyValue('id', 'title');

// Collection nach Wert sortieren
$articles->sort(function($a, $b) {
    return strcmp($a->getValue('title'), $b->getValue('title'));
});

// Collection slice
$subset = $articles->slice(0, 5);  // Erste 5 Einträge
```

<!-- TOC --><a name="filtern-und-sortieren"></a>
### Filtern und Sortieren

```php
// Aktive Artikel nach Datum sortiert
$articles = rex_yform_manager_dataset::query('rex_news')
    ->where('status', 1)                     // Nur aktive Artikel
    ->where('createdate', '>', '2023-01-01') // Ab einem Datum
    ->orderBy('createdate', 'DESC')          // Neueste zuerst
    ->find();

// Mit mehreren Bedingungen
$articles = rex_yform_manager_dataset::query('rex_news')
    ->where('category_id', 5)               // Bestimmte Kategorie
    ->whereNull('deleted_at')               // Nicht gelöscht
    ->orderBy('title', 'ASC')              // Nach Titel sortiert
    ->find();
```

<!-- TOC --><a name="mit-relationen-arbeiten"></a>
### Mit Relationen arbeiten

```php
// Artikel mit ID 5 laden
$article = rex_yform_manager_dataset::get(5, 'rex_news');

// Autor-Relation auflösen (1:1 Relation)
$author = $article->getRelatedDataset('author_id');
$authorName = $author->getValue('name');     // Name des Autors

// Kategorie laden (1:1 Relation)
$category = $article->getRelatedDataset('category_id');
$categoryName = $category->getValue('name'); // Name der Kategorie

// Kommentare laden (1:n Relation)
$comments = $article->getRelatedCollection('comments');
foreach($comments as $comment) {
    echo $comment->getValue('text');         // Text des Kommentars
}

// Mit Relation-Collection arbeiten
$comments = $article->getRelatedCollection('comments');
$publishedComments = $comments->filter(function($comment) {
    return $comment->getValue('status') == 1;
});
```

<!-- TOC --><a name="komplexe-abfragen"></a>
### Komplexe Abfragen

```php
// News mit Autor und Kategorie laden
$articles = rex_yform_manager_dataset::query('rex_news')
    ->alias('n')                            // Alias für News-Tabelle
    ->joinRelation('author_id', 'a')        // Join mit Autor
    ->joinRelation('category_id', 'c')      // Join mit Kategorie
    ->select('a.name', 'author_name')       // Autor-Name auswählen
    ->select('c.name', 'category_name')     // Kategorie-Name auswählen
    ->where('n.status', 1)
    ->orderBy('n.createdate', 'DESC')
    ->find();

// Ausgabe der Ergebnisse
foreach($articles as $article) {
    echo "Titel: " . $article->getValue('title') . "\n";
    echo "Autor: " . $article->getValue('author_name') . "\n";
    echo "Kategorie: " . $article->getValue('category_name') . "\n";
}
```

<!-- TOC --><a name="datensätze-zählen-und-prüfen"></a>
### Datensätze zählen und prüfen

```php
// Anzahl aktiver Artikel ermitteln
$count = rex_yform_manager_dataset::query('rex_news')
    ->where('status', 1)
    ->count();

// Prüfen ob Datensätze existieren
$exists = rex_yform_manager_dataset::query('rex_news')
    ->where('status', 1)
    ->exists();

// Ersten passenden Datensatz finden
$article = rex_yform_manager_dataset::query('rex_news')
    ->where('status', 1)
    ->findOne();
```

<!-- TOC --><a name="pagination"></a>
### Pagination

```php
// Pagination einrichten
$page = rex_request('page', 'int', 1);
$items_per_page = 10;

$pager = new rex_pager($items_per_page);
$pager->setCurrentPage($page);

// Query mit Pagination
$query = rex_yform_manager_dataset::query('rex_news');
$articles = $query->paginate($pager);

// Pagination Info
echo "Seite " . $pager->getCurrentPage() . " von " . $pager->getLastPage();
echo "Insgesamt " . $pager->getRowCount() . " Artikel";
```

Das waren die Grundlagen! Im nächsten Teil schauen wir uns an, wie wir mit einer eigenen Model-Class arbeiten können.

<!-- TOC --><a name="teil-2-arbeiten-mit-model-classes"></a>
## Teil 2: Arbeiten mit Model-Classes

Eine Model-Class macht deinen Code übersichtlicher, wartbarer und wiederverwendbar. Sie kapselt die Logik für eine bestimmte Tabelle und bietet eine saubere API.

<!-- TOC --><a name="vergleich-ohne-vs-mit-model-class"></a>
### Vergleich: Ohne vs. Mit Model-Class

Ohne Model-Class:
```php
// Artikel laden und verarbeiten
$article = rex_yform_manager_dataset::get(5, 'rex_news');
$date = date('d.m.Y', strtotime($article->getValue('createdate')));
$teaser = substr(strip_tags($article->getValue('text')), 0, 200) . '...';
$author = $article->getRelatedDataset('author_id');
$authorName = $author->getValue('name');

if($article->getValue('status') == 1) {
    // Artikel verarbeiten
}
```

Mit Model-Class:
```php
// Artikel laden und verarbeiten
$article = News::get(5);
$date = $article->getFormattedDate();
$teaser = $article->getTeaser(200);
$authorName = $article->getAuthor()->name;

if($article->isOnline()) {
    // Artikel verarbeiten
}
```

<!-- TOC --><a name="eine-model-class-erstellen"></a>
### Eine Model-Class erstellen

1. Erstelle die Datei `lib/News.php`:

```php
class News extends \rex_yform_manager_dataset
{
    // Basis-Methoden für Relationen
    public function getAuthor()
    {
        return $this->getRelatedDataset('author_id');
    }

    public function getCategory()
    {
        return $this->getRelatedDataset('category_id');
    }

    public function getTags()
    {
        return $this->getRelatedCollection('tags');
    }

    // Formatierungs-Methoden
    public function getTeaser($length = 200)
    {
        return substr(strip_tags($this->text), 0, $length) . '...';
    }

    public function getFormattedDate($format = 'd.m.Y')
    {
        return date($format, strtotime($this->createdate));
    }

    // Status-Methoden
    public function isOnline()
    {
        return $this->status == 1;
    }

    // Statische Methoden für häufige Abfragen
    public static function getLatestNews($limit = 5)
    {
        return self::query()
            ->where('status', 1)
            ->orderBy('createdate', 'DESC')
            ->limit($limit)
            ->find();
    }

    public static function getByCategory($categoryId)
    {
        return self::query()
            ->where('category_id', $categoryId)
            ->where('status', 1)
            ->orderBy('createdate', 'DESC')
            ->find();
    }

    public static function getRelatedNews(self $article, $limit = 3)
    {
        return self::query()
            ->where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->where('status', 1)
            ->limit($limit)
            ->find();
    }

    public static function search($term)
    {
        return self::query()
            ->where('status', 1)
            ->whereRaw('(title LIKE ? OR text LIKE ?)', 
                ['%' . $term . '%', '%' . $term . '%'])
            ->orderBy('createdate', 'DESC')
            ->find();
    }
}
```

2. Registriere die Model-Class in der `boot.php`:

```php
rex_yform_manager_dataset::setModelClass('rex_news', News::class);
```

<!-- TOC --><a name="die-model-class-verwenden"></a>
### Die Model-Class verwenden

```php
// Einzelnen Artikel laden
$article = News::get(5);

// Die neuesten Artikel laden
$latestNews = News::getLatestNews(10);

// Artikel einer bestimmten Kategorie laden
$categoryNews = News::getByCategory(3);

// Artikel suchen
$searchResults = News::search('REDAXO');

// Verwandte Artikel finden
$relatedNews = News::getRelatedNews($article);

// Mit Collections arbeiten
$articles = News::query()->find();
$onlineArticles = $articles->filter(function($article) {
    return $article->isOnline();
});

// Artikel nach Kategorie gruppieren
$articlesByCategory = $articles->groupBy(function($article) {
    return $article->getCategory()->name;
});
```

<!-- TOC --><a name="praktisches-beispiel-news-ausgabe"></a>
### Praktisches Beispiel: News-Ausgabe

```php
// News-Übersicht
$articles = News::getLatestNews(10);

foreach($articles as $article) {
    echo '<article>';
    echo '<h2>' . $article->title . '</h2>';
    
    echo '<div class="meta">';
    echo 'Von: ' . $article->getAuthor()->name . ' | ';
    echo 'Datum: ' . $article->getFormattedDate() . ' | ';
    echo 'Kategorie: ' . $article->getCategory()->name;
    echo '</div>';
    
    echo '<div class="teaser">';
    echo $article->getTeaser();
    echo '</div>';
    
    if($tags = $article->getTags()) {
        echo '<div class="tags">';
        foreach($tags as $tag) {
            echo '<span class="tag">' . $tag->name . '</span>';
        }
        echo '</div>';
    }
    
    echo '</article>';
}

// Verwandte Artikel in der Sidebar
echo '<aside class="related">';
echo '<h3>Verwandte Artikel</h3>';

foreach(News::getRelatedNews($article) as $related) {
    echo '<div class="related-item">';
    echo '<h4>' . $related->title . '</h4>';
    echo '<p>' . $related->getTeaser(100) . '</p>';
    echo '</div>';
}
echo '</aside>';
```

Im nächsten Teil schauen wir uns fortgeschrittene Techniken und ein komplettes News-System an.

<!-- TOC --><a name="teil-3-komplettes-news-system-tipps"></a>
## Teil 3: Komplettes News-System & Tipps

<!-- TOC --><a name="table-manager-setup"></a>
### Table Manager Setup

Tableset: 

```JSON
{
    "rex_news": {
        "table": {
            "name": "rex_news",
            "description": "News-Artikel",
            "status": 1
        },
        "fields": [
            {
                "name": "title",
                "type": "text",
                "label": "Titel",
                "required": true,
                "notice": "Der Titel des Artikels"
            },
            {
                "name": "text",
                "type": "textarea",
                "label": "Inhalt",
                "attributes": "{\"class\":\"tinyMCEEditor\"}",
                "notice": "Der Hauptinhalt des Artikels"
            },
            {
                "name": "category_id",
                "type": "be_manager_relation",
                "label": "Kategorie",
                "table": "rex_news_category",
                "field": "name",
                "empty_option": true,
                "notice": "Die Kategorie des Artikels"
            },
            {
                "name": "tags",
                "type": "be_manager_relation",
                "label": "Tags",
                "table": "rex_news_tag",
                "field": "name",
                "multiple": true,
                "notice": "Tags für den Artikel (Mehrfachauswahl möglich)"
            },
            {
                "name": "images",
                "type": "be_media",
                "label": "Bilder",
                "multiple": true,
                "types": "jpg,png",
                "preview": true,
                "notice": "Bilder für den Artikel (jpg, png)"
            },
            {
                "name": "author_id",
                "type": "be_manager_relation",
                "label": "Autor",
                "table": "rex_user",
                "field": "login",
                "empty_option": false,
                "default": "REX_USER_ID",
                "notice": "Der Autor des Artikels"
            },
            {
                "name": "status",
                "type": "choice",
                "label": "Status",
                "choices": {
                    "0": "Entwurf",
                    "1": "Online",
                    "2": "Archiv"
                },
                "default": "0",
                "notice": "Der Status des Artikels"
            },
            {
                "name": "createdate",
                "type": "datetime",
                "label": "Erstellt am",
                "default": "NOW()",
                "no_db": false,
                "notice": "Erstellungsdatum"
            },
            {
                "name": "updatedate",
                "type": "datetime",
                "label": "Aktualisiert am",
                "default": "NOW()",
                "no_db": false,
                "notice": "Letztes Aktualisierungsdatum"
            },
            {
                "name": "publishdate",
                "type": "datetime",
                "label": "Veröffentlichen am",
                "notice": "Datum, ab dem der Artikel online erscheint"
            }
        ]
    },
    "rex_news_category": {
        "table": {
            "name": "rex_news_category",
            "description": "News-Kategorien",
            "status": 1
        },
        "fields": [
            {
                "name": "name",
                "type": "text",
                "label": "Name",
                "required": true,
                "notice": "Name der Kategorie"
            },
            {
                "name": "description",
                "type": "textarea",
                "label": "Beschreibung",
                "notice": "Beschreibung der Kategorie"
            },
            {
                "name": "status",
                "type": "choice",
                "label": "Status",
                "choices": {
                    "0": "Inaktiv",
                    "1": "Aktiv"
                },
                "default": "1"
            }
        ]
    },
    "rex_news_tag": {
        "table": {
            "name": "rex_news_tag",
            "description": "News-Tags",
            "status": 1
        },
        "fields": [
            {
                "name": "name",
                "type": "text",
                "label": "Name",
                "required": true,
                "notice": "Name des Tags"
            },
            {
                "name": "status",
                "type": "choice",
                "label": "Status",
                "choices": {
                    "0": "Inaktiv",
                    "1": "Aktiv"
                },
                "default": "1"
            }
        ]
    }
}
```

<!-- TOC --><a name="die-erweiterte-model-class"></a>
### Die erweiterte Model-Class

```php
class News extends \rex_yform_manager_dataset
{
    // Basis-Methoden für Relationen
    public function getAuthor()
    {
        return $this->getRelatedDataset('author_id');
    }

    public function getCategory()
    {
        return $this->getRelatedDataset('category_id');
    }

    public function getTags()
    {
        return $this->getRelatedCollection('tags');
    }

    // Media handling
    public function getImages()
    {
        $images = [];
        $imageList = explode(',', $this->images);
        foreach($imageList as $image) {
            if($media = rex_media::get($image)) {
                $images[] = $media;
            }
        }
        return $images;
    }

    public function getMainImage($type = 'news_detail')
    {
        $images = $this->getImages();
        if(isset($images[0])) {
            return rex_media_manager::getUrl($type, $images[0]->getFileName());
        }
        return null;
    }

    // Status handling
    public function isOnline()
    {
        if($this->status != 1) return false;
        if($this->publishdate && strtotime($this->publishdate) > time()) return false;
        return true;
    }

    // Formatierung
    public function getTeaser($length = 200)
    {
        return substr(strip_tags($this->text), 0, $length) . '...';
    }

    public function getFormattedDate($format = 'd.m.Y')
    {
        return date($format, strtotime($this->createdate));
    }

    // URL generierung
    public function getUrl()
    {
        return rex_getUrl('', '', ['news-id' => $this->id]);
    }

    // Statische Methoden
    public static function getLatestNews($limit = 5)
    {
        return self::query()
            ->where('status', 1)
            ->where('publishdate', '', '<=')
            ->orderBy('publishdate', 'DESC')
            ->limit($limit)
            ->find();
    }

    public static function getFeatured()
    {
        return self::query()
            ->where('status', 1)
            ->where('featured', 1)
            ->orderBy('publishdate', 'DESC')
            ->find();
    }

    public static function getByCategory($categoryId, $limit = null)
    {
        $query = self::query()
            ->where('category_id', $categoryId)
            ->where('status', 1)
            ->where('publishdate', '', '<=')
            ->orderBy('publishdate', 'DESC');

        if($limit) {
            $query->limit($limit);
        }

        return $query->find();
    }

    public static function getArchive($year, $month = null)
    {
        $query = self::query()
            ->where('status', 1)
            ->where('publishdate', '', '<=');

        if($month) {
            $start = "$year-$month-01 00:00:00";
            $end = "$year-$month-31 23:59:59";
        } else {
            $start = "$year-01-01 00:00:00";
            $end = "$year-12-31 23:59:59";
        }

        return $query
            ->where('createdate', $start, '>=')
            ->where('createdate', $end, '<=')
            ->orderBy('createdate', 'DESC')
            ->find();
    }
}
```

<!-- TOC --><a name="frontend-module"></a>
### Frontend Module

```php
// News Liste
$limit = 10;
$page = rex_request('page', 'int', 1);

$pager = new rex_pager($limit);
$pager->setCurrentPage($page);

$articles = News::query()
    ->where('status', 1)
    ->where('publishdate', '', '<=')
    ->orderBy('publishdate', 'DESC')
    ->paginate($pager);

foreach($articles as $article): ?>
    <article class="news-item">
        <?php if($image = $article->getMainImage('news_list')): ?>
            <img src="<?= $image ?>" alt="<?= $article->title ?>">
        <?php endif; ?>

        <h2><a href="<?= $article->getUrl() ?>"><?= $article->title ?></a></h2>
        
        <div class="meta">
            <span class="author">Von <?= $article->getAuthor()->name ?></span>
            <span class="date">am <?= $article->getFormattedDate() ?></span>
            <span class="category">in <?= $article->getCategory()->name ?></span>
        </div>

        <div class="teaser">
            <?= $article->getTeaser() ?>
        </div>

        <?php if($tags = $article->getTags()): ?>
            <div class="tags">
                <?php foreach($tags as $tag): ?>
                    <span class="tag"><?= $tag->name ?></span>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </article>
<?php endforeach;

// Pagination ausgeben
if($pager->getLastPage() > 1) {
    $fragment = new rex_fragment();
    $fragment->setVar('urlprovider', rex_article::getCurrent());
    $fragment->setVar('pager', $pager);
    echo $fragment->parse('core/navigations/pagination.php');
}
```

<!-- TOC --><a name="tipps-tricks"></a>
## Tipps & Tricks

<!-- TOC --><a name="performance-optimierung"></a>
### Performance Optimierung

1. **Eager Loading für Relationen**
```php
// Schlecht - N+1 Queries
$articles = News::query()->find();
foreach($articles as $article) {
    echo $article->getAuthor()->name;  // Zusätzliche Query pro Artikel
}

// Besser - Alle Autoren in einer Query laden
$articles = News::query()
    ->alias('n')
    ->joinRelation('author_id', 'a')
    ->select('a.name', 'author_name')
    ->find();
foreach($articles as $article) {
    echo $article->author_name;  // Kein zusätzlicher Query
}
```

2. **Collection Caching**
```php
class News extends \rex_yform_manager_dataset
{
    private $tagNames = null;

    public function getTagNames()
    {
        if($this->tagNames === null) {
            $this->tagNames = $this->getTags()->map(function($tag) {
                return $tag->name;
            });
        }
        return $this->tagNames;
    }
}
```

3. **Selektives Laden von Feldern**
```php
// Nur benötigte Felder laden
$titles = News::query()
    ->resetSelect()
    ->select('id')
    ->select('title')
    ->find();
```

<!-- TOC --><a name="debugging"></a>
### Debugging

```php
// SQL Debug
$query = News::query()
    ->where('status', 1);
    
$sql = rex_sql::factory();
$sql->setDebug(true);
$sql->getArray($query->getQuery(), $query->getParams());

// Collection Debug
dump($articles->toArray());
```

<!-- TOC --><a name="nützliche-queries"></a>
### Nützliche Queries

1. **WHERE IN mit Array**
```php
$ids = [1, 2, 3, 4, 5];
$articles = News::query()
    ->where('id', $ids, 'IN')
    ->find();
```

2. **Complex Joins**
```php
$articles = News::query()
    ->alias('n')
    ->joinRelation('category_id', 'c')
    ->joinRelation('author_id', 'a')
    ->selectRaw('COUNT(DISTINCT c.id) as category_count')
    ->selectRaw('GROUP_CONCAT(DISTINCT a.name) as authors')
    ->groupBy('n.id')
    ->having('category_count', '>', 1)
    ->find();
```

3. **Raw SQL wenn nötig**
```php
$articles = News::query()
    ->whereRaw('YEAR(createdate) = ?', [2023])
    ->whereRaw('MONTH(createdate) = ?', [6])
    ->find();
```

<!-- TOC --><a name="utility-methoden"></a>
### Utility Methoden

1. **Handliche Sortier-Methode**
```php
public static function getSortedByTitle()
{
    return self::query()
        ->orderBy('title', 'ASC')
        ->find()
        ->map(function($item) {
            return [$item->id => $item->title];
        });
}
```

2. **Status Check Methoden**
```php
public function isDraft()
{
    return $this->status == 0;
}

public function isArchived()
{
    return $this->status == 2;
}

public function isScheduled()
{
    return $this->status == 1 && strtotime($this->publishdate) > time();
}
```

3. **URL Generator**
```php
public function getShareUrl()
{
    return rex_yrewrite::getFullUrlByArticleId(rex_config::get('news', 'detail_page'), '', ['id' => $this->id]);
}
```

<!-- TOC --><a name="häufige-probleme"></a>
### Häufige Probleme

1. **Relationen sind null**
- Überprüfe die Relation im Table Manager
- Stelle sicher, dass die Fremdschlüssel korrekt sind
- Prüfe ob die verknüpfte Tabelle existiert

2. **Collection Methoden funktionieren nicht**
- Stelle sicher, dass du `find()` aufgerufen hast
- Beachte dass Methoden wie `filter()` eine neue Collection zurückgeben

3. **Performance Probleme**
- Nutze `select()` um nur benötigte Felder zu laden
- Verwende Joins statt einzelner Relation-Queries
- Implementiere Caching für häufig genutzte Daten

<!-- TOC --><a name="best-practices"></a>
### Best Practices

1. **Zentrale Konfiguration**
```php
class News extends \rex_yform_manager_dataset
{
    const STATUS_DRAFT = 0;
    const STATUS_ONLINE = 1;
    const STATUS_ARCHIVED = 2;

    public static function getStatusLabels()
    {
        return [
            self::STATUS_DRAFT => 'Entwurf',
            self::STATUS_ONLINE => 'Online',
            self::STATUS_ARCHIVED => 'Archiv'
        ];
    }
}
```

2. **Wartbare Queries**
```php
class News extends \rex_yform_manager_dataset
{
    public static function getBaseQuery()
    {
        return self::query()
            ->where('status', self::STATUS_ONLINE)
            ->where('publishdate', '', '<=');
    }

    public static function getLatestNews($limit = 5)
    {
        return self::getBaseQuery()
            ->orderBy('publishdate', 'DESC')
            ->limit($limit)
            ->find();
    }
}
```

3. **Saubere API**
```php
// Gut
$article->isOnline();
$article->getFormattedDate();
$article->getTeaser();

// Schlecht
$article->getValue('status') == 1;
date('d.m.Y', strtotime($article->getValue('createdate')));
substr(strip_tags($article->getValue('text')), 0, 200);
```

4. **Collections effektiv nutzen**
```php
// Kategorien mit Artikel-Anzahl
$categories = NewsCategory::query()->find()->map(function($category) {
    return [
        'name' => $category->name,
        'count' => News::query()
            ->where('category_id', $category->id)
            ->where('status', News::STATUS_ONLINE)
            ->count()
    ];
});
```


<!-- TOC --><a name="collection-methode-map-im-detail"></a>
### Collection Methode `map()` im Detail

Die `map()`-Methode ist ein mächtiges Werkzeug zur Transformation von Collections. Sie wendet eine Funktion auf jedes Element an und erstellt ein neues Array.

```php
// Grundlegende Verwendung
$articles = News::query()->find();

// 1. Einfache Transformation: Nur Titel extrahieren
$titles = $articles->map(function($article) {
    return $article->title;
});
// Ergebnis: ['Titel 1', 'Titel 2', 'Titel 3', ...]

// 2. Key-Value Paare für Select-Felder erstellen
$categories = NewsCategory::query()->find();
$categoryList = $categories->map(function($category) {
    return [$category->id => $category->name];
});
// Ergebnis: [1 => 'Kategorie 1', 2 => 'Kategorie 2', ...]

// 3. Komplexe Datenstrukturen aufbauen
$articleData = $articles->map(function($article) {
    return [
        'id' => $article->id,
        'title' => $article->title,
        'author' => $article->getAuthor()->name,
        'date' => $article->getFormattedDate(),
        'url' => $article->getUrl()
    ];
});

// 4. Berechnungen für jedes Element
$articleStats = $articles->map(function($article) {
    return [
        'title' => $article->title,
        'wordCount' => str_word_count(strip_tags($article->text)),
        'commentCount' => $article->getRelatedCollection('comments')->count(),
        'imageCount' => count($article->getImages())
    ];
});

// 5. Mit Index arbeiten
$numbered = $articles->map(function($article, $index) {
    return ($index + 1) . '. ' . $article->title;
});

// 6. Kombiniert mit anderen Collection-Methoden
$recentArticleTitles = $articles
    ->filter(function($article) {
        return $article->isOnline();
    })
    ->sortBy('createdate', 'DESC')
    ->map(function($article) {
        return $article->title;
    })
    ->slice(0, 5);

// 7. JSON-Vorbereitung für APIs
$apiData = $articles->map(function($article) {
    return [
        'id' => $article->id,
        'title' => $article->title,
        'url' => $article->getUrl(),
        'tags' => $article->getTags()->map(function($tag) {
            return $tag->name;
        })
    ];
});

// 8. Frontend-Daten vorbereiten
$menuItems = $categories->map(function($category) {
    return [
        'name' => $category->name,
        'url' => $category->getUrl(),
        'count' => News::query()
            ->where('category_id', $category->id)
            ->where('status', News::STATUS_ONLINE)
            ->count()
    ];
});

// 9. Datums-Gruppierung
$articlesByMonth = $articles
    ->sortBy('createdate', 'DESC')
    ->groupBy(function($article) {
        return date('Y-m', strtotime($article->createdate));
    })
    ->map(function($articles, $month) {
        return [
            'month' => $month,
            'count' => count($articles),
            'articles' => $articles->map(function($article) {
                return $article->title;
            })
        ];
    });
