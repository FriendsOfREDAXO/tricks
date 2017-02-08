# Kategorie duplizieren mit allen Inhalten

* Untenstehendes Skript in eine Datei im Projektroot speichern
* `$categoryId` und `$targetId` anpassen
* Skript über die Konsole aufrufen
* Skript wieder entfernen

```php
<?php

// hier IDs anpassen
$categoryId = 0;
$targetId = 0;

// REDAXO laden
unset($REX);
$REX['REDAXO'] = false;
$REX['HTDOCS_PATH'] = './';
$REX['BACKEND_FOLDER'] = 'redaxo';

require $REX['BACKEND_FOLDER'] . '/src/core/boot.php';
require rex_path::core('packages.php');

// Funktionen

function copy_category($categoryId, $targetId)
{
    $category = rex_category::get($categoryId);

    $targetId = copy_article($categoryId, $targetId);

    foreach ($category->getArticles() as $article) {
        if (!$article->isStartArticle()) {
            copy_article($article->getId(), $targetId);
        }
    }

    foreach ($category->getChildren() as $child) {
        copy_category($child->getId(), $targetId);
    }

    return $targetId;
}

// Kopie von https://github.com/redaxo/redaxo/blob/58e5696f0b257e038af227fce3689819ef3c4951/redaxo/src/addons/structure/lib/service_article.php#L708-L790
// in der verlinkten Version
// Änderungen sind mit *CHANGED* markiert
function copy_article($id, $to_cat_id)
{
    $id = (int) $id;
    $to_cat_id = (int) $to_cat_id;
    $new_id = '';

    // *CHANGED*
    //$user = rex::isBackend() ? null : 'frontend';
    $user = 'copy-script';

    // Artikel in jeder Sprache kopieren
    foreach (rex_clang::getAllIds() as $clang) {
        // validierung der id & from_cat_id
        $from_sql = rex_sql::factory();
        $qry = 'select * from ' . rex::getTablePrefix() . 'article where clang_id="' . $clang . '" and id="' . $id . '"';
        $from_sql->setQuery($qry);

        if ($from_sql->getRows() == 1) {
            // validierung der to_cat_id
            $to_sql = rex_sql::factory();
            $to_sql->setQuery('select * from ' . rex::getTablePrefix() . 'article where clang_id="' . $clang . '" and startarticle=1 and id="' . $to_cat_id . '"');

            if ($to_sql->getRows() == 1 || $to_cat_id == 0) {
                if ($to_sql->getRows() == 1) {
                    $path = $to_sql->getValue('path') . $to_sql->getValue('id') . '|';
                    // *CHANGED*
                    // $catname = $to_sql->getValue('catname');
                    $catname = $from_sql->getValue('name');
                } else {
                    // In RootEbene
                    $path = '|';
                    $catname = $from_sql->getValue('name');
                }

                $art_sql = rex_sql::factory();
                $art_sql->setTable(rex::getTablePrefix() . 'article');
                if ($new_id == '') {
                    $new_id = $art_sql->setNewId('id');
                }
                $art_sql->setValue('id', $new_id); // neuen auto_incrment erzwingen
                $art_sql->setValue('parent_id', $to_cat_id);
                $art_sql->setValue('catname', $catname);
                // *CHANGED*
                // $art_sql->setValue('catpriority', 0);
                $art_sql->setValue('catpriority', $from_sql->getValue('catpriority'));
                $art_sql->setValue('path', $path);
                // *CHANGED*
                // $art_sql->setValue('name', $from_sql->getValue('name') . ' ' . rex_i18n::msg('structure_copy'));
                $art_sql->setValue('name', $from_sql->getValue('name'));
                // *CHANGED*
                // $art_sql->setValue('priority', 99999); // Artikel als letzten Artikel in die neue Kat einfügen
                // $art_sql->setValue('status', 0); // Kopierter Artikel offline setzen
                // $art_sql->setValue('startarticle', 0);
                $art_sql->setValue('priority', $from_sql->getValue('priority'));
                $art_sql->setValue('status', $from_sql->getValue('status'));
                $art_sql->setValue('startarticle', $from_sql->getValue('startarticle'));
                $art_sql->addGlobalUpdateFields($user);
                $art_sql->addGlobalCreateFields($user);

                // schon gesetzte Felder nicht wieder überschreiben
                $dont_copy = ['id', 'pid', 'parent_id', 'catname', 'name', 'catpriority', 'path', 'priority', 'status', 'updatedate', 'updateuser', 'createdate', 'createuser', 'startarticle'];

                foreach (array_diff($from_sql->getFieldnames(), $dont_copy) as $fld_name) {
                    $art_sql->setValue($fld_name, $from_sql->getValue($fld_name));
                }

                $art_sql->setValue('clang_id', $clang);
                $art_sql->insert();

                $revisions = rex_sql::factory();
                $revisions->setQuery('select revision from ' . rex::getTablePrefix() . "article_slice where priority=1 AND article_id='$id' AND clang_id='$clang' GROUP BY revision");
                foreach ($revisions as $rev) {
                    // FIXME this dependency is very ugly!
                    // ArticleSlices kopieren
                    rex_content_service::copyContent($id, $new_id, $clang, $clang, $rev->getValue('revision'));
                }

                // Prios neu berechnen
                // *CHANGED*
                // self::newArtPrio($to_cat_id, $clang, 1, 0);
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // Caches des Artikels löschen, in allen Sprachen
    rex_article_cache::delete($id);

    // Caches der Kategorien löschen, da sich derin befindliche Artikel geändert haben
    rex_article_cache::delete($to_cat_id);

    return $new_id;
}

// Kopiervorgang starten
$categoryId = copy_category($categoryId, $targetId);

// Nachträgliche Korrekturen an der neuen Oberkategorie
rex_sql::factory()
    ->setTable(rex::getTable('article'))
    ->setWhere(['id' => $categoryId])
    ->setRawValue('catname', 'CONCAT(catname, " Copy")')
    ->setValue('catpriority', 999999)
    ->update();

foreach (rex_clang::getAllIds() as $clangId) {
    rex_category_service::newCatPrio($targetId, $clangId, 1, 0);
}
```
