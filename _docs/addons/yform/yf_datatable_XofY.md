---
title: Gefilterte Liste - Anzahl Sätze anzeigen (x von Y)
authors: [christophboecker]
prio:
---

# Gefilterte Liste: Anzahl Sätze anzeigen (x von Y)

YForm bietet die Möglichkeit, links neben der Tabelle ein Suchformular anzuzeigen. Das Ergebnis der
Suche ist eine mehr oder weniger lange Liste. Jedoch gibt es keine Information zur Einordnung des
Filterergebnisses, also wie viel Sätze herausgefiltert bzw. tatsächlich vorhanden sind. Aus 
Tabellenkalkulationen wie Excel kennt man beim Filtern die Rückmeldung "x von y Zeilen" - geht das
nicht auch für gefilterte YForm-Tabellen? So zum Beispiel:

![Beispiel](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yf_datatable_XofY.png "Beispiel")

## Der Trick: rex_i18n::addMsg

Nein, es gibt keinen Extension-Point, über den die Überschrift der Datentabelle vor der Ausgabe 
gezielt angepasst werden kann. Das geht nur über einen kleinen Trick in der Sprachverwaltung
`rex_i18n` und Verwendung eines EP kurz vor der Ausgabe.

Die Überschrift ("**Datentabelle**") wird über die Sprachdateien bereitgestellt. Die Texte
lassen sich nicht nur in den .lang-Dateien setzen, sondern auch progammatisch per PHP:

```php
rex_i18n::addMsg( 'key', 'value' );
```

Vorhandene Texte werden ersetzt, wenn `'key'` schon existiert. Das machen wir uns zunutze und
ändern kurz vor der Ausgabe der Tabelle den Text des Schlüssels `'yform_tabledata_overview'`
in "**Datentabelle (x von y)**").

```php
rex_i18n::addMsg( 'yform_tabledata_overview', "$Datentabelle ($lines von $total)" );
```

## Basisversion (keine Sprachvarianten)

Der obige Code sowie die Ermittlung der Anzahl Datensätze in der Tabelle und die Anzahl der
Datensätze in der Anzeige werden im Extension-Point `YFORM_DATA_LIST` platziert, der als letzter
YForm-EP vor der Tabellenausgabe angezogen wird.

```php
\rex_extension::register('YFORM_DATA_LIST',
    function( \rex_extension_point $ep )
    {
        // Anzahl Zeilen in der Query
        $lines = $ep->getSubject()->getRows();

        // Anzahl Zeilen in der Tabelle
        $sql = \rex_sql::factory();
        $sql->setQuery('select count(*) FROM '.$ep->getParams()['table']['table_name']);
        $total = $sql->getValue('count(*)');

        // Tabellentitel nur erweitern wenn gefiltert.
        if( $lines < $total )
        {
            \rex_i18n::addMsg( 'yform_tabledata_overview', "Datentabelle ($lines von $total)" );
        }
    }
);
```

I.d.R. wird das Verfahren so ausreichen, wenn die REDAXO-Instanz mit nur einer Sprachversion arbeitet.
Auch die eher seltene Ausgabe mehrerer Tabellen in einer Page bereitet keine Probleme.

Schwieriger wird es, wenn Mehrsprachigkeit gefordert ist.

## Mehrsprachige Version

Wie man schon am Term `"Datentabelle ($lines von $total)"` sieht, sind zwei Wörter relevant:

- "**Datentabelle**": Der Text ist der Originaltext des .lang-Spracheintrags `'yform_tabledata_overview'`.
  Er kann abgerufen und statt "Datentabelle" in den Text eingebaut werden.
  
  ```php
  $label = \rex_i18n::rawMsg( 'yform_tabledata_overview' );
  \rex_i18n::addMsg( 'yform_tabledata_overview', "$label ($lines von $total)" );
  ```
  
- "**von**": Für diesen Textteil ("von", "of", ...) gibt es noch keinen nutzbaren Eintrag. Somit
  bleibt als Lösung, das Wort zu neutralisieren ("x/y", sieht nicht so schön aus) oder ebenfalls
  via eigenem .lang-Eintrag sprachspezifisch bereitzustellen.

Da `'yform_tabledata_overview'` verändert wird, ergibt sich bei (seltenen) Pages mit mehreren
Tabellen ein zusätzliches Problem: Wenn zwei Listen gefiltert sind, wird
`'yform_tabledata_overview'` mehrfach erweitert (z.B. "**Datentabelle (x1 von y1) (x2 von y2)**").

Plant man ohnehin eigene .lang-Einträge für "von", kann das auch genutzt werden, um den kompletten
Titel bereitzustellen und die wiederholte Erweiterung zu vermeiden.

Dazu bedarf es .lang-Dateien im eigenen Projekt z.B. mit diesem Inhalt:

- de_de.lang: `yform_tabledata_overview_xy = Datentabelle ({0} von {1})`
- en_gb.lang: `yform_tabledata_overview_xy = Data tables ({0} of {1})`
- es_es.lang: `yform_tabledata_overview_xy = Tabla de datos ({0} de {1})`
- pt_br.lang: `yform_tabledata_overview_xy = Tabelas de dados ({0} de {1})`
- sv_se.lang: `yform_tabledata_overview_xy = Datatabell ({0} av {1})`

Die Originaltexte zu `yform_tabledata_overview` sind unter `redaxo/src/addons/yform/plugins/manager/lang/*.lang` zu finden.

Der Code ändert sich nur geringfügig:

```php
\rex_extension::register('YFORM_DATA_LIST',
    function( \rex_extension_point $ep )
    {
        // Anzahl Zeilen in der Query
        $lines = $ep->getSubject()->getRows();

        // Anzahl Zeilen in der Tabelle
        $sql = \rex_sql::factory();
        $sql->setQuery('select count(*) FROM '.$ep->getParams()['table']['table_name']);
        $total = $sql->getValue('count(*)');

        // Tabellentitel nur erweitern wenn gefiltert.
        if( $lines < $total )
        {
            $yform_tabledata_overview = \rex_i18n::rawMsg( 'yform_tabledata_overview_xy', $lines, $total );
            \rex_i18n::addMsg( 'yform_tabledata_overview', $yform_tabledata_overview );
        }
    }
);
```
