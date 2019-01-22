---
title: "YForm Formulare: Eigener Submit-Button mit PHP"
authors: [danspringer]
prio:
---


# YForm Formulare: Eigener Submit-Button mit PHP

Um einen eigenen Submit-Button per PHP in yForm-Formularen anzuzeigen, muss man in den Formular-Parametern den automatisch generierten Submit-Button unterdrücken und kann anschließend per HTML-Element einen eigenen BUtton hinzufügen. 

## Automatisch generierten Submit-Button ausschalten
```php
$yform->setObjectparams('submit_btn_show',false); 
```

## Eigenen Button per HTML-Value einfügen
Egal wohin, muss nur erreichbar sein von `rex_extension::register`.
```php
$yform->setValueField('html', array("html","HTML",'<button type="submit" class="btn btn-info btn-block">Jetzt absenden</button>'));
```