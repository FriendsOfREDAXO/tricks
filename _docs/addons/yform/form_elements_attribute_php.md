---
title: "YForm Formulare: Attribute für Input-Elemente in PHP-Schreibweise"
authors: [danspringer]
prio:
---


# Attribute an YForm-Element anfügen

Hinweis: Die ursprünglich von YForm erzeugte Klasse 'form-control' werden z.B. bei Nutzung eigener CSS-Klassen durch die eigenen ersetzt.

```php
$yform->setValueField('textarea', 
array(
      'name'=> "message",
      'label' => "label",
      'attributes' => '{"placeholder":"Geben Sie eine Nachricht ein", "class":"css-klassenname", "id":"form-id"}')
      );
```
