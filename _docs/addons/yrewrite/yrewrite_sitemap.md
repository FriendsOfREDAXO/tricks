---
title: yrewrite - sitemap.xml um zusätzliche Seiten erweitern
authors: [aeberhard]
prio:
---

# yrewrite - sitemap.xml um zusätzliche Seiten erweitern

> **Hinweis** Diese Kurzanleitung gilt für YRewrite ab Version 2.7

Falls in der `sitemap.xml` einzelne Seiten fehlen (aus welchem Grund auch immer) oder z.B. Seiten/Urls aus eigenen Tabellen zusätzlich in die Sitemap eingefügt werden sollen kann dies über die beiden Extensionpoints `YREWRITE_DOMAIN_SITEMAP` (Domainabfrage möglich) und `YREWRITE_SITEMAP` (für alle Domains) erreicht werden.

Beim Extensionpoint `YREWRITE_SITEMAP` wird das Array sitemap übergeben.

Beim Extensionpoint `YREWRITE_DOMAIN_SITEMAP` wird das Array sitemap, und zusätzlich als Parameter ein Objekt `rex_yrewrite_domain` übergeben.

## Beispiel für Extensionpoint YREWRITE_DOMAIN_SITEMAP

> **Hinweis** Der Beispiel-Code kann Syntax-Fehler enthalten (da er natürlich nicht genau so im Projekt vorhanden war) und muss an die eigenen Bedürfnisse angepasst werden!

```php
<?php
// YRewrite - sitemap.xml erweitern

rex_extension::register('YREWRITE_DOMAIN_SITEMAP', static function (rex_extension_point $ep) {
    $sitemap = $ep->getSubject();

    // Domainabfrage
    $params = $ep->getParam('domain'); // Objekt rex_yrewrite_domain
    $domain = $params->getName();
    if ('MeineDomain' != $domain) { // nur bei MeineDomain
        return;
    }

    // einzelnen Artikel zur Sitemap hinzufügen, ID 999 anpassen
    $article = rex_article::get(999);
    if ($article) {
        $arturl = rex_yrewrite::getFullUrlByArticleId($article->getId(), rex_clang::getCurrentId());
        $artdate = $article->getValue('updatedate');
        $sitemap[] =
            "\n".'<url>'.
            "\n".'<loc>' . $arturl . '</loc>'.
            "\n".'<lastmod>'.date(DATE_W3C, $artdate).'</lastmod>'.
            "\n".'<changefreq>weekly</changefreq>'.
            "\n".'<priority>1.0</priority>'.
            "\n".'</url>';
    }

    // Seiten aus z.B. eigener Tabelle hinzufügen
    $sql = rex_sql::factory();
    $sql->setDebug(false);

    // Hier SQL mit Query-Parametern 
    $_query = 'SELECT `url`, `updatedate` FROM `' . rex::getTable('meineTabelle') . '` WHERE `meinfeld` = :meinesuche ';
    $_queryparams = [];
    $_queryparams['meinesuche'] = 'meinSuchwert';
    $sql->setQuery($_query, $_queryparams);

    if ($sql->getRows() > 0) {
        for ($i = 0; $i < $sql->getRows(); ++$i) {
            $meineUrl = $sql->getValue('url'); // nur ein Beispiel
            $meinDatum = $sql->getValue('updatedate'); // nur ein Beispiel
            $sitemap[] =
                "\n".'<url>'.
                "\n".'<loc>' . $meineUrl . '</loc>'.
                "\n".'<lastmod>'.date(DATE_W3C, $meinDatum).'</lastmod>'.
                "\n".'<changefreq>weekly</changefreq>'.
                "\n".'<priority>1.0</priority>'.
                "\n".'</url>';
            $sql->next();
        }
    }

    // sitemap-Array zurückgeben 
    $ep->setSubject($sitemap);
});
```

Das obige Beispiel kann auch für den Extensionpoint `YREWRITE_SITEMAP` verwendet werden, allerding ohne den Bereich mit der Domainabfrage.
