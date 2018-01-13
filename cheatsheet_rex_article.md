# Artikel Cheatsheet

### Klassenmethoden

```php
$articles         = rex_article::getRootArticles();
$article          = rex_article::get($article_id);
$article          = rex_article::getCurrent();
```
### Objektmethoden

```php
$category         = $article->getCategory();
$categoryId       = $article->getCategoryId()
```

### Beispiele

```php
// Artikelnamen ausgeben
echo rex_article::getCurrent()->getName()

// Artikel nach Erstellungsdatum sortieren
$articles = rex_article::getRootArticles();
usort($articles, function ($a, $b) {
    return $a->getCreateDate() > $b->getCreateDate();
});
```
