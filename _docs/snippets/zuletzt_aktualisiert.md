---
title: Zuletzt aktualisiert
authors: [polarpixel, madiko]
prio:
---

# Letzte Aktualisierung

Auslesen und anzeigen der letzten Aktualisierung für 

- [Artikel bzw. Website insgesamt](#article)
- [Tabelle bzw. Tabellen](#tables) (gesucht wird der jüngste Eintrag in der Liste)
- [einzelne Datensätze einer YForm-Tabelle](#items)

<a name="article"></a>

## Letzte Aktualisierung einer Website anzeigen

- [SQL-Abfrage](#articlesql)
- [Formatierung](#article_formatierung)
- [YForm Tabellen einbeziehen](#article_yform)


<a name="articlesql"></a>

### SQL-Abfrage

Für die Frontend-Anzeige der letzten Aktualisierung einer Website kann das Feld `updatedate` der Tabelle `rex_article` verwendet werden. Dieses Feld speichert immer einen timestamp der letzten Aktualisierung.

Folgende Datenbankabfrage liest das Feld `updatedate` aus der rex_article-Tabelle. Durch die Limitierung auf nur einen Datensatz und die absteigende Sortierung wird immer der Datensatz der letzten Aktualisierung ausgewählt.
Da es nur einen Datensatz gibt, kann man mit `$update[0]` auf das erste Element des Arrays zugreifen.  

```php
$query = 'SELECT updatedate FROM rex_article ORDER BY updatedate desc LIMIT 1';
$update = rex_sql::factory()->getArray($query);
echo 'Zuletzt aktualisiert am '.$update[0]['updatedate'];
```

<a name="article_formatierung"></a>

### Formatierung

Um die Standard-Datumsanzeige von `yyyy-mm-dd hh:mm:ss` zu beeinflussen, könnte man bereits direkt in der SQL-Abfrage das Datum wie gewünscht formatieren:  

```php
$query = 'SELECT updatedate, date_format(updatedate, "%d.%m.%Y") as last_update FROM rex_article ORDER BY updatedate desc LIMIT 1';
$update = rex_sql::factory()->getArray($query);
echo 'Zuletzt aktualisiert am '.$update[0]['last_update'];
```


<a name="article_yform"></a>

### YForm-Tabellen einbeziehen

Sofern es weitere - z.B. über YForm erzeugte - Tabellen in der Website gibt, will man auch deren Aktualisierung berücksichtigen. In jeder der Tabellen wird ein Feld vom Typ `datestamp` und mit dem Namen `updatedate`angelegt. Sodann können mittels UNION die Abfragen aller Tabellen kombiniert werden. Das Beispiel zeigt die Kombination mit einer Tabelle `rex_projects`.

```php
$query = '
SELECT updatedate, date_format(updatedate, "%d.%m.%Y") as last_update FROM rex_article
UNION SELECT updatedate, date_format(updatedate, "%d.%m.%Y") FROM rex_projects
ORDER BY updatedate desc LIMIT 1';
$update = rex_sql::factory()->getArray($query);
echo 'Zuletzt aktualisiert am '.$update[0]['last_update'];
```



<a name="tables"></a>

## Letzte Aktualisierung einer Tabelle 

- [Klasse + Funktionen](#tables_class_functions)
- [Aufruf der Funktion in einem Modul](#tables_return)

Um auszulesen, wann die Datensätze einer Tabelle das letzte Mal aktualisiert wurden, empfehlen wir Dir, diese Code-Snippets in den `/lib` Ordner von `theme/private` oder auch ins Projekt-AddOn zu übernehmen. In der ersten Version wird **ein** Tabellen-Name übergeben. Wenn Du **mehrere Tabellen über Relationen verbunden** hast und für alle zusammen das neueste Datum wünschst, nimm die zweite Version.

Nicht benötigt wird die Relations-Tabelle selbst. Die lasse bitte weg (dort wird nach aktuellem Stand auch kein Zeit-Stempel gesetzt).


>**Hinweis**: Bitte stelle sicher, dass die jeweiligen Tabellen alle ein `updatedate`-Feld haben. Verwende in YForm dafür ein Feld `datestamp`und stelle die Eigenschaften auf `Wert soll immer gesetzt werden` mit Feld-Typ `datetime`.


<a name="tables_class_functions"></a>

### Klassen und Funktionen zum Auslesen der Info aus der Datenbank

```php
<?php 

/*******************************************************
 * REDAXO Helferlein
 * letzte Aktualisierung auslesen für Tabellen und Daten-Sätze
 * Autor / Copyrights (MIT): Franziska Köppe, madiko
 * 
 * Change-Log (stets anpassen, damit theme/developer synchronisieren)
 * siehe [ BITTE FÜGE DEIN REPO EIN ]
 * letzte Änderung: 2026-09-03
 * letzte Prüfung: 2026-09-03

*******************************************************/

//================================================================================
// Table of contents
//================================================================================

// NameSpace

// get_last_update // Klassen zum Auslesen der letzten Aktualisierung

     // table($TableName) // Liest das Datum der letzten Aktualisierung für die gesamte Tabelle aus

     // tables($TableNames) // Liest das Datum der letzten Aktualisierung für mehrere Tabelle aus 
     // (relevant z. B. wenn sie miteinander verknüpft sind über Relationen)

//================================================================================


//================================================================================
// NameSpace
//================================================================================

     use rex_yform_manager_table;


//================================================================================
// get_last_update // Klassen zum Auslesen der letzten Aktualisierung
//================================================================================
class get_last_update {

     //---------------------------------------------------------------------------
     // table($TableName)
     //---------------------------------------------------------------------------
     /**
      * Liest das Datum der letzten Aktualisierung für die gesamte Tabelle aus
      * @param string $TableName – Name der Tabelle (z. B. 'rex_products')
      * @return string Gibt zurück "aktualisiert JJJJ-MM-DD"
      */
     public static function table (string $TableName) {

          // Abfrage vorbereiten
          $sql = rex_sql::factory();

          // query zusammensetzen und auslesen
          $query = "SELECT updatedate FROM ". $TableName ." ORDER BY updatedate desc LIMIT 1";
          $data_row = $sql->getArray($query);
          $date_row = $data_row[0]['updatedate'];

          // Formatieren
          $date = date_format(new DateTime($date_row), "Y-m-d");

          // Ausgabe
          $ausgabe = "aktualisiert ". $date;
          return $ausgabe;

     } // end table($TableName)


     //---------------------------------------------------------------------------
     // tables($TableNames) 
     //---------------------------------------------------------------------------
     /**
      * Liest das Datum der letzten Aktualisierung für mehrere Tabelle aus 
      * (relevant z. B. wenn sie miteinander verknüpft sind über Relationen)
      * @param array $TableNames - Name der Tabellen als array (z. B. ['rex_products', 'rex_product_categories', 'rex_orders'])
      * @return string Gibt zurück "aktualisiert JJJJ-MM-DD"
      */
     public static function tables (array $TableNames) {

          // Abfrage vorbereiten
          $sql = rex_sql::factory();

          // query zusammensetzen und auslesen
          $UnionQueries = [];

               // UNION ALL Abfrage dynamisch bauen
               foreach ($TableNames as $TableName) {
                    $UnionQueries[] = "(SELECT updatedate FROM $TableName ORDER BY updatedate DESC LIMIT 1)";
                    
               }
               $UnionQuery = implode(" UNION ALL ", $UnionQueries);

          // Führe die Abfrage aus und hole das neueste Datum
          $query = "SELECT MAX(updatedate) AS latest_date FROM ($UnionQuery) AS combined_dates";
          $data_row = $sql->getArray($query);
          $latestDate = $data_row[0]['latest_date'];

          // Formatieren
          $date = date_format(new DateTime($latestDate), "Y-m-d");

          // Ausgeben
          $ausgabe = "aktualisiert ". $date;
          return $ausgabe;          

     } // end tables($TableNames)

} // end class get_last_update

?>

```

<a name="tables_return"></a>

### Nutzen der Funktion auf der jeweiligen Seite bzw. im Modul

Und so rufst Du die Funktion dann auf:

#### für eine einzelne Tabelle

```php

// letzte Aktualisierung
$TableName = 'rex_products';
$aktualisiert = get_last_update::table($TableName);

```

#### für mehrere Tabellen

```php

// letzte Aktualisierung
$TableNames = [
   'rex_products',
   'rex_product_categories',
   'rex_orders'
];
$aktualisiert = get_last_update::tables($TableNames);

```


<a name="items"></a>

## Letzte Aktualisierung für einzelne Datensätze einer YForm-Tabelle

Um nun das Datum der letzten Aktualisierung für einen spezifischen Datensatz aus Deiner (YForm)Tabelle aufzurufen, nutze dies:

- [Klasse + Funktionen](#items_class_functions)
- [Aufruf der Funktion in einem Modul](#items_return)

>**Hinweis**: Bitte stelle sicher, dass die jeweiligen Tabellen alle ein `updatedate`-Feld haben. Verwende in YForm dafür ein Feld `datestamp`und stelle die Eigenschaften auf `Wert soll immer gesetzt werden` mit Feld-Typ `datetime`.


<a name="items_class_functions"></a>

### Klasse + Funktionen

```php
<?php 

/*******************************************************
 * REDAXO Helferlein
 * letzte Aktualisierung auslesen für Tabellen und Daten-Sätze
 * Autor / Copyrights (MIT): Franziska Köppe, madiko
 * 
 * Change-Log (stets anpassen, damit theme/developer synchronisieren)
 * siehe https://...  [ BITTE FÜGE DEIN REPO EIN ]
 * letzte Änderung: 2026-09-02
 * letzte Prüfung: 2026-09-02

*******************************************************/

//================================================================================
// Table of contents
//================================================================================

// NameSpace

// get_last_update // Klassen zum Auslesen der letzten Aktualisierung

     // item($TableName, $item) // Liest das Datum der letzten Aktualisierung für eine gewählte ID in einer spezifizierten Tabelle aus

//================================================================================


//================================================================================
// NameSpace
//================================================================================

     use rex_yform_manager_table;


//================================================================================
// get_last_update // Klassen zum Auslesen der letzten Aktualisierung
//================================================================================
class get_last_update {

     //---------------------------------------------------------------------------
     // item($TableName, $item) // Liest das Datum der letzten Aktualisierung für eine gewählte ID in einer spezifizierten Tabelle aus
     //---------------------------------------------------------------------------
     /**
      * Liest das Datum der letzten Aktualisierung für den gewählten Datensatz aus
      * @param string $TableName – Name der Tabelle (z. B. 'rex_wm_experiments')
      * @param string $item – ID des Datensatzes, bitte vorab prüfen, ob die ID existiert!
      * @return string Gibt zurück "aktualisiert JJJJ-MM-DD"
      */
     public static function item (string $TableName, string $item) {

          // Abfrage vorbereiten
          $dataset = rex_yform_manager_table::get($TableName)->query()->findId($item);
          $date_row = $dataset->getValue('updatedate');
          $date = date_format($date_row, "Y-m-d");

          // Ausgabe
          $ausgabe = "aktualisiert ". $date;
          return $ausgabe;

     } // end item($TableName, $item)


} // end class get_last_update


?>

```


<a name="items_return"></a>

### Aufruf der Funktion in einem Modul

und so holst Du es Dir in Dein Modul oder auf die Seite:

```php

$TableName = 'rex_thingy';
$item = '1';
$item_aktualisiert = get_last_update::item($TableName, $item);

```

Viel Erfolg!
