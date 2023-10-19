---
title: Formulardaten vor dem Ausführen manipulieren
authors: [marcohanke]
prio:
---

# Formulardaten vor dem Ausführen abfangen


## Beschreibung
Manchmal möchte man Daten, die im Frontend in ein YForm Formular eingetragen wurde vor dem Ausführen der Action abfangen oder manipulieren. Man kann die Daten zum Beispiel über eine eigene Klasse versenden, eigene E-Mail Anhänge anhängen oder die Daten in eine PDF schreiben und diese dann direkt in die Mail anhängen.

Ein fertiges Formular lässt man in der Regel mit `echo $yform->getForm()` anzeigen. Im Hintergrund wird ein Extensionpoint erstellt, die Felder werden initialisiert `$yform->executeFields()` und die Actions werden ausgeführt `$yform->executeActions()`
Die Methoden lassen sich aber auch einzeln ausführen. So kann man zuerst die Felder initialisieren um auf die entsprechenden Werte zu zugreifen (`$yform->objparams['value_pool']`) und nach eigenen Wünschen verarbeiten. Anschließend kann man mit `$yform->executeActions()` die Aktionen ausführen, oder einfach wie gewohnt `echo $yform->getForm()` ausführen.
Möchte man die Daten manipulieren und wieder zurück ins Formular packen, oder weitere Felder anhängen, gibt es noch eine Kleinigkeit zu beachten. Wurden die Felder mit `$yform->executeFields()` einmal initialisiert, wird diese Methode zukünftig ignoriert.
Man muss also nach dem manipulieren `$yform->initializeFields(false);` setzen, dann werden mit `echo $yform->getForm()` die Felder ein zweites mal initalisiert und so sind auch die nachträglich angefügten Felder dabei.

## Beispiel

### Vorher

```php
// Aufbau des Formulars mit den gewünschten Objectparams und Valuefields
$yform = new rex_yform();
$yform->setObjectparams();
$yform->setValueField();
//Formular Aktionen definieren
$yform->setActionField('html', '<h1>Formular Versand</h1>');
$yform->setActionField('tpl2email', ["template-name", "email@reciptient.de"]);

//Ausgabe des Formular
echo '<div class="output">'.$yform->getForm().'</div>';
```

### Nachher

```php
// Aufbau des Formulars mit den gewünschten Objectparams und Valuefields
$yform = new rex_yform();
$yform->setObjectparams();

$yform->setValueField();

//Felder werden intialisiert und sind damit im ValuePool
$yform->executeFields();

//Dann erst die Validates einbauen! Nicht nach dem ValueField!!!
$yform->setValidateField();

//Felder/Werte ausgeben
dump($yform->objparams['value_pool']);
//Mit den Daten kann man zum Beispiel mit dem AddOn PDFOupt ein PDF generieren und im Filesystem ablegen.

//Anschließend kann man die Datei wieder ans Formular übergeben
$yform->setValueField('php', array('php_attach', 'Datei anhängen', '<?php $this->params[\'value_pool\'][\'email_attachments\'][\'pdf\'] = [\'dateiname.pdf\', rex_path::data(\'/addons/yform/plugins/manager/upload/temp/datei.pdf\')]; ?>'));

//Formular Aktionen definieren
$yform->setActionField('html', '<h1>Formular Versand</h1>');
$yform->setActionField('tpl2email', ["template-name", "email@reciptient.de"]);

 //Damit das neue ValueField auch verarbeitet wird muss initializeFields() zurückgesetzt werden
 $yform->initializeFields();

//Bei der Ausgabe werden die Felder jetzt erneut initalisiert und anschließend die Actions ausgeführt
echo '<div class="output">'.$yform->getForm().'</div>';
```
