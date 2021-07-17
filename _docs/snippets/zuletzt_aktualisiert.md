---
title: Zuletzt aktualisiert
authors: [polarpixel]
prio:
---

# Letzte Aktualisierung einer Website anzeigen

- [SQL-Abfrage](#sql)
- [Formatierung](#formatierung)
- [YForm Tabellen einbeziehen](#yform)


<a name="sql"></a>
## SQL-Abfrage

Für die Frontend-Anzeige der letzten Aktualisierung einer Website kann das Feld `updatedate` der Tabelle `rex_article` verwendet werden. Dieses Feld speichert immer einen timestamp der letzten Aktualisierung.

Folgende Datenbankabfrage liest das Feld `updatedate` aus der rex_article-Tabelle. Durch die Limitierung auf nur eine Datensatz und die absteigende Sortierung wird immer der Datensatz der letzten Aktualisierung ausgewählt.
Da es nur einen Datensatz gibt, kann man mit `$update[0]` auf das erste Element des Arrays zugreifen.  

```php
$query = 'SELECT updatedate FROM rex_article ORDER BY updatedate desc LIMIT 1';
$update = rex_sql::factory()->getArray($query);
echo 'Zuletzt aktualisiert am '.$update[0]['updatedate'];
```

<a name="formatierung"></a>
## Formatierung

Um die Standard-Datumsanzeige von `yyyy-mm-dd hh:mm:ss` zu beeinflussen, könnte man bereits direkt in der SQL-Abfrage das Datum wie gewünscht formatieren:  

```php
$query = 'SELECT updatedate, date_format(updatedate, "%d.%m.%Y") as last_update FROM rex_article ORDER BY updatedate desc LIMIT 1';
$update = rex_sql::factory()->getArray($query);
echo 'Zuletzt aktualisiert am '.$update[0]['last_update'];
```


<a name="yform"></a>
## YForm-Tabellen einbeziehen

Sofern es weitere - z.B. über YForm erzeugte - Tabellen in der Website gibt, will man auch deren Aktualisierung berücksichtigen. In jeder der Tabellen wird ein Feld vom Typ `datestamp` und mit dem Namen `updatedate`angelegt. Sodann können mittels UNION die Abfragen aller Tabellen kombiniert. Das Beispiel zeigt die Kombination mit einer Tabelle `rex_projects`.

```php
$query = '
SELECT updatedate, date_format(updatedate, "%d.%m.%Y") as last_update FROM rex_article
UNION SELECT updatedate, date_format(updatedate, "%d.%m.%Y") FROM rex_projects
ORDER BY updatedate desc LIMIT 1';
$update = rex_sql::factory()->getArray($query);
echo 'aktualisiert am '.$update[0]['last_update'];
```


