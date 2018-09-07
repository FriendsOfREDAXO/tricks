---
title: Eigene JS/CSS-Dateien im Addon 'project'
authors: []
prio:
---

# Eigene JS/CSS-Dateien im Addon 'project'

Um eigene JS/CSS Dateien in das Backend/Frontend des REDAXO CMS zur Verfügung zu stellen, sollte man das Addon __project__ nutzen. Das Addon wird bei einem Update des System nicht berücksichtig, somit bleiben die projektbezogenen Änderungen erhalten.

**Hinweis**  
Das AddOn wird im REDAXO CMS im Bereich Addons angezeigt.
Die Daten des AddOns befinden sich unter `/redaxo/src/addons/project`.

## Struktur

	/boot.php
	/package.yml
	/lib/.redaxo
    
## Assets

Das `/assets/` Verzeichnis muss noch angelegt werden. Darin können die JS/CSS Dateien abgelegt werden.

Nach einem Reinstall des AddOns werden alle dort abgelegten Dateien zusätzlich auch im Verzeichnis `/assets/addons/project/` abgelegt. Somit können diese, bei Bedarf, auch innerhalb des Frontends verwendet werden.

## Eigene JS/CSS Dateien includen

Die im `project/assets/` Verzeichnis abgelegten Dateien in der boot.php einfügen

`/redaxo/src/addons/project/boot.php`

```php
<?php
// add Files to Backend
if (rex::isBackend() && rex::getUser()) {
    // add CSS File to backend
    rex_view::addCssFile($this->getAssetsUrl('my_backend.css'));
    // add JS File to backend
    rex_view::addJsFile($this->getAssetsUrl('my_backend.js'));
}
?>
```

Anschließend das AddOn: project im REDAXO CMS Backend **re-installieren**.

Danach stehen die Dateien im Backend zur Verfügung.
