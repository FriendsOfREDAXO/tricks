---
title: "YForm Formulare: Eigener Submit-Button mit PHP"
authors: [danspringer, alexplusde]
prio:
---


# YForm Formulare: Eigener Submit-Button mit PHP

Um einen eigenen Submit-Button per PHP in yForm-Formularen anzuzeigen genügt es, das value `submit` zu verwenden. Dabei wird der Standard-Button automatisch ausgeblendet. 

## Eigenen Button einfügen

```php
$yform->setValueField('submit', array('buy','Jetzt zahlungspflichtig bestellen','1','0'));
```

```
submit|buy|Jetzt zahlungspflichtig bestellen|1|0|
```

Um das Formular nur abzuschicken, jedoch ohne einen Wert im E-Mail-Template oder der `db`-Action zu übermitteln, muss der Parameter als `[no_db]` bekannte Parameter auf `1`stehen:

```php
$yform->setValueField('submit', array('buy','Jetzt zahlungspflichtig bestellen','1','1'));
```

```
submit|buy|Jetzt zahlungspflichtig bestellen|1|1|
```

## Mehr als einen Button für das Absenden definieren

Dabei wird je nach Button ein anderer Wert übertragen - z.B. für vor und zurück unterschiedliche Werte bei einem mehrstufigen Formular:

```php
$yform->setValueField('submit', array('steps','zurück,weiter','-1,1','0'));
```

```
submit|steps|zurück,weiter|-1,1|0|
```

## YForm-Submit-Button manuell ausschalten

optional, falls nur der Submit-Button ausgeblendet werden soll.

```php
$yform->setObjectparams('submit_btn_show',false); 
```
