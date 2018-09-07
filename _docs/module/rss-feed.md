---
title: "Artikelliste als RSS-FEED"
authors: []
prio:
---

# Artikelliste als RSS-FEED

- Erstellt eine Artikelliste als RSS-Feed. 
- Listet Seitentitel und Beschreibung des Artikels auf. 
- Die Sortierung erfolgt nach PRIO

> Ein Metainfofeld art_description wird benötigt. 

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
<?php
/*
 *=============================================
 * REDAXO-Modul: rss! make 
 * Bereich: Ausgabe
 * Redaxo Version: 5.x
 *=============================================

 Anleitung
 Als Block einsetzen und mit einem Template mit folgendem Inhalt verbinden. 

 rex_response::sendContentType('application/xml; charset=utf-8');
 print $this->getArticle(1);
 */

// Sortierfunktion by Prio
if (!function_exists('sortArticlesByPrio')) {
	function sortArticlesByPrio($artA, $artB) {
		$prioA = $artA->getPriority();
		$prioB = $artB->getPriority();
		if ($prioA == $prioB) {
			return 0;
		}
		return $prioA > $prioB ? -1 : 1;
	}
}

// Url zum Feed
$base='http://'.$_SERVER[HTTP_HOST].$_SERVER[REQUEST_URI]; 

// Document Header definieren
$xml = new SimpleXMLElement('<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom"></rss>');

// Channel.Deklaration 
$channel = $xml->addChild("channel");

$xml->addAttribute('version', '2.0'); 
$atom = $xml->channel->addChild('atom:atom:link'); //atom node
$atom->addAttribute('href', $base); // atom node attribut
$atom->addAttribute('rel', 'self');
$atom->addAttribute('type', 'application/rss+xml');

// Seitentitel
$channel->addChild("title", "REX_VALUE[2]");

// URL der Website
$channel->addChild("link", "REX_VALUE[3]");
$channel->addChild("description", "REX_VALUE[4]");
$channel->addChild("language", "de-de");
$channel->addChild('generator', 'REDAXO rss'); // generator node
$cat = rex_category::get('REX_VALUE[1]');
$children = $cat->getArticles();

// Sortieren nach PRIO / Funktion weiter oben
// usort($children, 'sortArticlesByPrio');

if (is_array($children)) {
	foreach ($children as $child) {

		//Nur wenn Artikel online
		if ($child->isOnline()):

			$item  = $channel->addChild("item");
			$artId = $child->getId();

			// Ermitteln der URL des Posting-Artikels
			$url = rex_getUrl($artId);
			
			// Titel des Artikels auslesen
			$item->addChild("title", $child->getName());
			
			// Link des Artikels generieren
			$item->addChild("link", 'REX_VALUE[3]' . $url);
			$item->addChild("guid", 'REX_VALUE[3]' . $url);

			// Datum und Uhrezeit des Postings
			$rssdate = date("D, d M Y H:i:s +0100", $child->getCreateDate());
			$item->addChild('pubDate', $rssdate);

			// Achtung die Beschreibung sollte mittels Metainfo-Addon angelegt sein           
			$item->addChild("description", $child->getValue('art_description'));
		endif;
	}
}

// Ausgabe des RSS-Feeds
echo $xml->asXML();
```
