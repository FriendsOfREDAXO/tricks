---
title: "Artikelliste als RSS-FEED"
authors: [skerbis]
prio:
---

# Artikelliste als RSS-FEED

- Erstellt eine Artikelliste als RSS-Feed.
- Listet Seitentitel und Beschreibung des Artikels auf.
- Die Sortierung erfolgt nach PRIO

> Ein Metainfofeld `art_description` wird benötigt.

## Anleitung
**Mögliche Vorgehensweise für die Ausgabe:**
Als Block einsetzen und mit einem Template mit folgendem Inhalt verbinden:

```php
// Senden des Headers mit korrekter Kodierung mittels rex_response
rex_response::sendContentType('application/xml; charset=utf-8');
print $this->getArticle(1);
```

## Eingabe

```php
<div class="form-group">
	<label class="col-sm-5 control-label">Kategorie mit News</label>
	<div class="col-sm-7">
		<?php
		// Bereitstellen einer Kategorieauswahl
		// Siehe http://www.redaxo.org/docs/master/class-rex_category_select.html
		$select = new rex_category_select($ignore_offlines = false, $clang = false, $check_perms = true, $add_homepage = false);
		$select->setName("REX_INPUT_VALUE[1]");

		// Legt fest welcher Wert ausgewählt werden soll, hier der Wert von REX_VALUE[1]
		$select->setSelected("REX_VALUE[1]");
		$select->setAttribute('class', 'form-control');
		$select->setSize(20);

		echo $select->get();
		?>
	</div>
</div>

<div class="form-group">
	<label class="col-sm-5 control-label">Titel des Feeds</label>
	<div class="col-sm-7">
		<input class="form-control" placeholder="Die XY Nachrichten"
			type="text" name="REX_INPUT_VALUE[2]" value="REX_VALUE[2]">
	</div>
</div>

<div class="form-group">
	<label class="col-sm-5 control-label">URL der Website</label>
	<div class="col-sm-7">
		<input class="form-control" placeholder="http://domain.xy"
			type="text" name="REX_INPUT_VALUE[3]" value="REX_VALUE[3]">
	</div>
</div>

<div class="form-group">
	<label class="col-sm-5 control-label">Beschreibung des Feeds</label>
	<div class="col-sm-7">
		<input class="form-control" placeholder="Unsere aktuellen Meldungen"
			type="text" name="REX_INPUT_VALUE[4]" value="REX_VALUE[4]">
	</div>
</div>
```

## Ausgabe

```php
// REDAXO-Modul: RSS Feed Erstellung

// Document Header definieren und initialisieren
$xml = new SimpleXMLElement('<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom"></rss>');
$xml->addAttribute('version', '2.0');

// Channel-Deklaration
$channel = $xml->addChild("channel");
$base = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$channel->addChild('title', "REX_VALUE[2]")
        ->addChild("link", "REX_VALUE[3]")
        ->addChild("description", "REX_VALUE[4]")
        ->addChild("language", "de-de")
        ->addChild('generator', 'REDAXO rss');

$atom = $xml->channel->addChild('atom:link');
$atom->addAttribute('href', $base);
$atom->addAttribute('rel', 'self');
$atom->addAttribute('type', 'application/rss+xml');

// Artikel holen
$cat = rex_category::get('REX_VALUE[1]');
$children = $cat->getArticles();

// Sortieren nach Erstellungsdatum
usort($children, function($a, $b) {
    return $a->getCreateDate() < $b->getCreateDate();
});

foreach ($children as $child) {
    if ($child->isOnline()) {
        $item = $channel->addChild("item");
        $url = rex_getUrl($child->getId());

        $item->addChild("title", $child->getName())
             ->addChild("link", "REX_VALUE[3]" . $url)
             ->addChild("guid", "REX_VALUE[3]" . $url)
             ->addChild('pubDate', date("D, d M Y H:i:s +0100", $child->getCreateDate()))
             ->addChild("description", $child->getValue('art_description'));
    }
}

// Ausgabe des RSS-Feeds
echo $xml->asXML();
```
