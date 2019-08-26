---
title: "YForm Formulare: Attribute für Input-Elemente in PHP-Schreibweise"
authors: [danspringer]
prio:
---


# YForm Formulare: Attribute für Input-Elemente in PHP-Schreibweise

Um einen eigenen Submit-Button per PHP in yForm-Formularen anzuzeigen, muss man in den Formular-Parametern den automatisch generierten Submit-Button unterdrücken und kann anschließend per HTML-Element einen eigenen Button hinzufügen. 

## Attribute an YForm-Element anfügen

Hinweis: Die ursprünglich von YForm erzeugte Klasse 'form-control' werden z.B. bei Nutzung eigener CSS-Klassen durch die eigenen ersetzt.

```php
$yform->setValueField('textarea', array('name"=> "message",'label' => "label", 'attributes' => '{"placeholder":"Geben Sie eine Nachricht ein", "class":"css-klassenname", "id":"form-id"}'));
```

