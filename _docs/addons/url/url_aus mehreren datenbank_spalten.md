---
title: URL aus mehreren Datenbank-Spalten
authors: [polarpixel]
prio:
---

# URLs mit dem URL-AddOn

Das URL-AddOn ist dafür gedacht, aus yForm-Tabellen sprechende URLs zu generieren. Es sieht bereits die Möglichkeit vor, die URL aus bis zu drei Datenbankspalten zusammenzusetzen. Hat man also z.B. eine Musiker-Tabelle mit den Spalten Name (sowohl Bandname als auch Nachname eines Einzelmusikers), Vorname und Formation, so könnte man daraus eine schöne URL wie `/artist/jan-garbarek-quintet/` erzeugen.

## Leere erste Spalte oder mehr als vier Spalten

Da das erste Feld zwingend erforderlich ist, kann das URL-AddOn in diesem Fall eine URL wie `/àrtist/sigur-ros/` nicht generieren, wo nur der Bandname hinterlegt wurde und der Vorname leer wäre. Auch eine vierte Spalte in die URL-Generierung mit einzubeziehen ist nicht möglich.

## Der Trick: Index-Spalte in yForm

Für diese Fälle kann man in der entsprechenden yForm-Tabelle ein weiteres Feld anlegen vom Typ Index. Unter "Felder" trägt man dort eine kommaseparierte Liste  der Felder ein, die der Index mit einbeziehen soll, z.B. `vorname,name,formation`. Nun kann man dieses neue Index-Feld im URL-AddOn als erstes und einziges Feld zur URL-Generierung auswählen.

> **Hinweis:** Das Indexfeld wird nur beim Speichern des Datensatzes gefüllt. Will man für alle bereits bestehenden Datensätze diese Generierung des Index durchführen, könnte man dies durch die Funktion der Massenbearbeitung in der yForm-Tabelle erreichen.  
> Bei zu vielen Datensätzen bricht die Massenbearbeitung jedoch ab. In diesem Fall kann man den Index einfach selbst in das Feld schreiben mit einem SQL-Befehl wie  
> ```UPDATE rex_artist SET index_url = CONCAT_WS(' ', NULLIF(vorname, ''), NULLIF(name, ''), NULLIF(formation, ''))```