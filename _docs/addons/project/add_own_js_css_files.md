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

	/redaxo/src/addons/project/boot.php
	/redaxo/src/addons/project/package.yml
	/redaxo/src/addons/project/lib/.redaxo
    
## Eigene JS/CSS Dateien includen

Unter /assets/addons/project/ (also vom Webroot ausgehend – anlegen, wenn noch nicht vorhanden) können die JS-/CSS-Dateien abgelegt werden.

Diese Dateien in der boot.php (`/redaxo/src/addons/project/boot.php`) so einfügen:

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
