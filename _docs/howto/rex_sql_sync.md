---
title: Website sperren / Wartungsarbeiten
authors: [alexplusde]
prio:
---

# Datensätze per rex_sql synchronisieren

## Einführung

Beispielsweise beim Einspielen externer Daten wie Termine ist es mitunter erforderlich, Datensätze zu synchronisieren - d.h. bestehende Daten aktualisieren, neue Daten hinzufügen und überflüssige Daten entfernen.

Dies lässt sich mit rex_sql und zwei Befehlen ermöglichen. Voraussetzungen:

* Es gibt ein unique-Feld in der Datenbank — also einen Schlüssel, mit dem man vorhandene Datensätze identifizieren kann, hier als Kombination der Felder `date`, `hour` und `class`.
* Es gibt einen Zeitstempel in der Zieldatenbank, anhand der festgestellt werden kann, welche Datensätze nicht mehr existieren und damit gelöscht werden können, z.B. `updatedate`

Dieses beispiel stammt aus einem Projekt füreine Schule, bei der Vertretungspläne zuvor per CSV importiert wurden und dann per Extension Point beim Aktualisieren der CSV-Datei ausgeführt wurden.

## Datensätze importieren

Neue Datensätze werden per foreach durchlaufen und eingefügt. Gibt es bereits eine Kombination aus `date`, `hour` und `class`, wird dieser Datensatz aktualisiert - hier: wenn sich der vertrendende Lehrer geändert hat.

```php
$now = date('Y-m-d H:i:s');

foreach($entries as $entry) {

  $sql->setQuery('INSERT INTO rex_yf_vertretungsplan
      (`date`,`hour`,`class`,`teacher`,`createdate`,`updatedate`,`status`) 

      VALUES 
      (:date,:hour,:class,:teacher,:createdate,:updatedate,1)

      ON DUPLICATE KEY UPDATE 
      `date`=:date, `hour`=:hour, `class`=:class, `teacher`=:teacher, `updatedate`=:updatedate', [":date" => $entry['date'], ":hour" => $entry['hour'], ":class" => $entry['class'], ":teacher" => $entry['teacher'], ":updatedate" => $now]);
  }

}
```

## Nicht mehr vorhandene Datensätze löschen

Datensätze, die nicht aktualisiert oder eingefügt wurden, haben kein aktuelles `updatedate`. Sie sind im Import nicht mehr vorhanden und können daher gelöscht werden.

```php
rex_sql::factory()->setDebug(0)->setQuery("DELETE FROM rex_yf_vertretungsplan WHERE updatedate < ?", [$now]);
```
