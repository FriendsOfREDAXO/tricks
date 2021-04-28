---
title: Assets mit einem Timestamp ausliefern
authors: [polarpixel]
prio:
---

# Assets mit einem Timestamp ausliefern

> Die hier genannte Lösung ist sinnvoll bei REDAXO (Backend) vor Version 5.3 und für das Frontend alle Versionen

Bei sich häufiger ändernden Assets wie CSS- oder Javascript-Dateien hat man gelegentlich das Problem, dass der Besucher noch eine alte Version sieht, die sich in seinem Browser-Cache befindet. Hier hilft es, einen Cachebuster zu nutzen, also den Zeitpunkt der letzten Änderung mit an den Dateinamen anzuhängen. Wenn dann der Browser beim Laden der Seite eine vermeintliche andere Datei findet, wird er diese neu laden.

## Funktion einbinden

Diese Funktion wird am besten in die `boot.php` des Project-AddOn hinterlegt oder in der `functions.php` des Theme-AddOns:

```php
function stamp_file ($filename_with_path) {    
    $file = rtrim(rex_path::base(),'/').$filename_with_path;    
    if (!$ftime = @filemtime($file)) {
        return $filename_with_path;
    }
    return $filename_with_path.'?time='.$ftime;

}
```

## Asset-Datei mit Timestamp aufrufen

Die CSS- oder JS-Datei kann so aufgerufen werden:

```php
<link rel="stylesheet" href="<?= stamp_file('/css/styles.css') ?>" media="screen,print">
```

## Ausgabe

In der Ausgabe erscheint dann z.B. Folgendes:

```php
<link rel="stylesheet" href="/css/styles.css?time=1555251723" media="screen,print">
```
