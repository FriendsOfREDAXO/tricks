---
title: "Erweiterter Schutz vor dem Löschen von Daten"
authors: [dpf-dd,skerbis]
prio:
---

# Erweiterter Schutz vor dem Löschen von Medien oder Artikel

REDAXO prüft nicht ob Medien oder Artikel in anderen Tabellen als den Artikeln und Metas verlinkt sind. Daher können Medien gelöscht werden, die in YForm verlinkt sind

## Beispiel

Es existiert z.B. ein yForm-Formular, mit dessen Hilfe ein Frontend-User Bilder hochlädt und zum Medienpool hinzufügt.
Da der Dateiname des hochgeladenen Bildes in der yForm-Tabelle gespeichert wird, kann der Medienpool das entsprechende Bild von Haus aus **NICHT** vor dem Löschen schützen. Das Bild kann somit im Medienpool gelöscht werden, obwohl es sich noch in Benutzung befindet. 

## AddOn Yakme

[Das AddOn Yakme](https://github.com/yakamara/yakme) liefert eine fertige Lösung für diesen Fall. Es verhindert, das die verwendeten Bilder gelöscht werden. 

> Yakme ist ein Sammel-AddOn für Projekte der Firma Yakamara und liefert noch einige weitere Erweiterungen. Da diese meist alle aktiv nach der Installation sind, kann es sein, dass sich REDAXO nicht wie gewohnt verhält. 

## Lösung aus Yakme isolieren

Falls man Yakme nicht nutzen möchte oder die Prüfung erweitern möchte, kann man sich die entsprechende Class YForm aus Yakme kopieren, umbenennen, anpassen und z.B. im Projekt-AddOn verwenden. 

https://github.com/yakamara/yakme/blob/master/lib/Yakme/Extension/YForm.php

- Zur Verwendung im eigenen Projekt kopiert man die Class als neue Datei in den lib-Ordner des Project-AddOns (z.B. als media_in_use_check.php)
- Entfernt oder ändert den Namespace
- Ändert den Class-Namen z.B. auf: MediaInUseCheck

Also aus: 

```php 
namespace Yakme\Extension;
class YForm
```

wird z.B. 

```
class MediaInUseCheck
```

### Installation

Folgende zwei Zeilen der `boot.php` im `project`-Addon hinzufügen

```php
// prüft ob ein Medium in Verwendung ist
rex_extension::register('MEDIA_IS_IN_USE', 'MediaInUseCheck::isMediaInUse');
// prüft ob ein Artikel in Verwendung ist
\rex_extension::register('PACKAGES_INCLUDED', 'MediaInUseCheck::isArticleInUse');
```

Es sind dann keine weiteren Schritte erforderlich. 
