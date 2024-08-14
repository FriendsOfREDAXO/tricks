---
title: "Artikel einbinden"
authors: [skerbis]
prio:
---

# Artikel einbinden mit `rex_article::get`

Hin und wieder möchte man auf zentrale Daten zurückgreifen. Das können beispielsweise Öffnungszeiten oder Adressen sein. 
Eine Möglichkeit ist das Einbinden zentral abgelegter Artikel. 

Das nachfolgende Beispiel bindet den ausgewählten Artikel als Block ein. Darüber hinaus wird für eingeloggte Redakteure ein Bearbeitungssymbol (fontawsome) im Frontend eingebaut. Dadurch kann der Redakteur leicht erkennen, dass es sich um einen eingebundenen Artikel handelt und kann direkt ins Backend zur Bearbeitung springen. 

Die Abfrage ob wir uns im Backend oder Frontend befinden erfolgt durch `if (rex::isBackend() == 1) {...`

## Moduleingabe

```html
<div class="form-horizontal">
	<div class="form-group">
		<label class="col-sm-2 control-label">Artikelauswahl:</label>
		<div class="col-sm-8">
			REX_LINK[id=1 widget=1]
		</div>
	</div>
</div>
```

## Modulausgabe

```php
<?php
// Prüfen ob der aktuelle Artikel mit sich selbst verlinkt ist
if ("REX_ARTICLE_ID" != "REX_LINK[id=1]" && "REX_LINK[id=1]" != "") {

	// Artikeldatensatz ermitteln
	$art = rex_article::get('REX_LINK[id=1]');
	
	// Artikelinhalt auslesen inkl. aktuelle Sprache
	$article = new rex_article_content($art->getId() , $art->getClang());
	
	// Weitere Informationen auslesen z.B. Titel, Beschreibung
	$art_title = $art->getName();
	
	// Weitere Daten der MetaInfos können wie folgt ausgelesen werden
	// z.B. Beschreibung
	// $art_description =  $art->getValue('art_description');
}

// Ausgabe Backend
if (rex::isBackend() == 1) {

	// Es handelt sich nicht um denselben Artikel
	if ("REX_ARTICLE_ID" != "REX_LINK[id=1]" && "REX_LINK[id=1]" != "") {
		echo '
			<div class="alert alert-info">
				<a href="' . rex_url::backendPage('content/edit',
					['mode' => 'edit',
					'clang' => rex_clang::getCurrentId() ,
					'article_id' => 'REX_LINK[id=1]']) . '">
					<i class="fa fa-pencil-square-o" aria-hidden="true"></i>
					Eingebundener Artikel: ' . $art->getName() . '
				</a>
			</div>';
	}

	// Es handelt sich um denselben Artikel
	else {

		// Was soll passieren wenn der Artikel nicht eingebunden werden kann?
		echo "Bitte prüfe den ausgewählten Artikel. Du scheinst auf diesen Artikel hier zu verlinken.";
	}
}

// Ausgabe Frontend
else {

	// Es handelt sich nicht um denselben Artikel
	if ("REX_ARTICLE_ID" != "REX_LINK[id=1]" && "REX_LINK[id=1]" != "") {

		// Artikel ausgeben, für andere ctypes Zahl ändern.
		// Für den gesamten Artikel inkl. aller Ctypes, die 1 entfernen
		echo $article->getArticle(1);
	}
}
```
