---
title: RSS mit YORM und SimpleXML
authors: [skerbis]
prio:
---

# RSS mit YORM und [SimpleXML](https://www.php.net/manual/de/book.simplexml.php)



```php
<?php rex_response::cleanOutputBuffers(); rex_response::sendContentType('application/xml; charset=utf-8');
// Document Header definieren
$xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom"></rss>');

// Channel.Deklaration
$channel = $xml->addChild("channel");

$xml->addAttribute('version', '2.0');
$atom = $xml->channel->addChild('atom:atom:link'); //atom node
// Url zum Feed
$base = 'https://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
$atom->addAttribute('href', $base); // atom node attribut
$atom->addAttribute('rel', 'self');
$atom->addAttribute('type', 'application/rss+xml');

// RSS Titel
$channel->addChild("title", "News");
// URL der Website
$channel->addChild("link", "https://domain.tld");
// RSS Bescheibung
$channel->addChild("description", "NEWS Der Website XYZ");
// Sprache
$channel->addChild("language", "de-de");
// Generator
$channel->addChild('generator', 'REDAXO rss');

// YFORM Daten auslesen per YORM
$children = rex_yform_manager_table::get('rex_news')
    ->query()
    ->whereRaw('date <= NOW() AND status = "1"')
    ->orderBy('date', 'DESC')
    ->limit(1000)
    ->find();

/*
Die YFORM Tabelle liefert die Felder:
- id
- title
- description

Zur Auflösung der URL verwenden wir das URL-AddOn
*/

foreach ($children as $child) {
    $date = $url = '';
    $url = rex_getUrl('', '', ['news' => $child->id]);
    $item  = $channel->addChild("item");
    // Titel des Artikels auslesen
    $item->addChild("title", rex_escape($child->title));
    $item->addChild("description", rex_escape($child->teaser));
    // Link des Artikels generieren
    $item->addChild("link", $url);
    $item->addChild("guid", $url);
    $date = $child->date;
    // Datum und Uhrezeit des Postings
    $rssdate = $date;
    $item->addChild('pubDate', $rssdate);
}


// Ausgabe des RSS-Feeds
echo $xml->asXML();
die();

```
