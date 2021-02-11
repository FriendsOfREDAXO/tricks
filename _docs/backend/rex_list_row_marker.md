---
title: REX_LIST-Zeilen datenabhängig formatieren
authors: [christophboecker]
prio:
---

# REX_LIST-Zeilen datenabhängig formatieren

Einzelne Zellen können per Callback bei der Ausgabe der rex_list angepasst und bedingt formatiert werden. Aber die ganze Zeile anders einfärben wenn bestimmte Werte im Datensatz stehen? 
Geht? Geht! Auch für YForm.

- [Grundannahmen und Beispiel](#basic)
- [Lösungsweg](#weg)
    - [\<td>-Tag um eine Klasse erweitern](#weg_class)
        - [Aufruf des EP](#weg_class_ep)
        - [Die Callback-Funktion *rex_list_set_row_class*](#weg_class_cb)
        - [Das CSS](#weg_class_css)
    - [\<td>-Tag um ein Attribut erweitern](#weg_attr)
        - [Aufruf des EP](#weg_attr_ep)
        - [Die Callback-Funktion *rex_list_set_row_class*](#weg_attr_cb)
        - [Das CSS](#weg_attr_css)

- [Optionen](#opt)
    - [YForm](#yform)
    - [Komplexe Basisdaten](#kompl)

<a name="basic"></a>
## Grundannahmen und Beispiel

Die *rex_list* wird wie üblich als Tabelle (*\<table>*) erstellt; die Spalten werden als *\<td>*
formatiert.

In der Beispieltabelle gibt es ein Feld `privacy` mit den Werten `public`, `internal` und 
`classified`. Die Zeilen sollen entsprechend der Klassifizierung eingefärbt werden (standard, beige
und rot).

![Beispiel](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/rex_list_row_marker.jpg "Beispiel")


<a name="weg"></a>
## Lösungsweg

Der ideale Weg, über eine optionale Klasse auf der Zeile (`<tr class="xyz">`) die gewünschte
Formatierung zu erhalten, ist mangels Einstiegspunkt verwehrt. Allerdings kann man per Extension-Point
(EP) *REX_LIST_GET* den Aufbau der Zeile auf Spaltenebene verändern.

Ob man die Callback-Funktion des EP als anonyme Funktion, als benannte Funktion oder als (statische)
Methode eine Klasse anlegt, ist dabei irrelevant. Das Beispiel geht von einer benannten Funktion aus.

Für eine ansprechende Optik muss die Tabellenzelle (*\<td>*) formatiert werden, nicht der Inhalt.
Die dafür zuständigen Angaben sind im `columnLayout` der *rex_list* abrufbar und änderbar. Für
die Änderung ist kein Callback auf eine Custom-Funktion möglich wie beim Zellinhalt (`columnFormat`).

Durch Änderung des `columnLayout` können gezielt Feldwerte in den *\<td>*-Tag eingeschleust und
darüber CSS-Formatierungen gesteuert werden. Der Klassenname im CSS sollte - sofern die Feldwerte
nicht bereits als Klassenname geeignet sind - aus einem Prefix mit angehängtem Feldwert gebildet
werden: `css-prefix-###feldname###`. Als Attribut: `attributname="###feldname###"`. 

Es reicht aus, der ersten Spalte eine zusätzliche Markierung (Attribut oder Klasse) mitzugeben,
anhand derer per CSS die Zeile formatiert wird. Die Formatierung lässt sich im CSS einfach per
Siblings-Selektor auf die nachfolgenden Spalten erweitern. 

Die Markierung selbst kann nur ein Feldwert der der aktuellen Zeile zugrunde liegenden Abfrage
sein.

Die Callback-Funktion ist allgemein gehalten. Das Feld, auf dem die Formatierung beruht (im Beispiel:
`privacy`) wird als Parameter im EP übergeben, ebenso der ein CSS-Name, an den der Feldwert als
unterscheidendes Merkmal angefügt wird. (Beispiel: `xyz-privacy-` wird zu `xyz-privacy-public`,
`xyz-privacy-internal` bzw. `xyz-privacy-classified`).
> Selbstverständlich spricht nichts dagegen, die Funktion spezialisiert zu schreiben.

Um den Parameter von Feldwerten unterscheiden zu können, muss er eindeutig sein und nicht mit
Fednamen des Datensatzes in Konflikt geraten. Im Beispiel sind die Werte in einem Array 
*rex_list_row_marker* gebündelt.

<a name="weg_class"></a>
### \<td>-Tag um eine Klasse erweitern

<a name="weg_class_ep"></a>
#### Aufruf des EP

Der EP wird mit der Callback-Funktion *rex_list_set_row_class* aufgerufen. Feldname (`privacy`) und
das Prefix des CSS-Klassennamens (`xyz-privacy-`) werden als Parameter übergeben. Der EP wird "spät"
aufgerufen - nur für den Fall dass ein anderer EP-Aufruf die erste Spalte löscht.

```php
\rex_extension::register(
    'REX_LIST_GET',
    'rex_list_set_row_class',
    \rex_extension::LATE,
    ['rex_list_row_marker'=>['field'=>'privacy','name'=>'xyz-privacy-']]
);
```

<a name="weg_class_cb"></a>
#### Die Callback-Funktion *rex_list_set_row_class*

```php
function rex_list_set_row_class (\rex_extension_point $ep)
{
    // Abruf der Parameter
    $row_marker = $ep->getParam('rex_list_row_marker');
    if( !is_array($row_marker) ) return;

    // Layout der ersten rex_list-Spalte abrufen 
    $list = $ep->getSubject();
    $name = $list->getColumnNames()[0];
    $layout = $list->getColumnLayout($name);

    // Falls der TD-Tag eine class= hat die Klasse erweitern, sonst class= einfügen
    $ok = preg_match( '/(?<td>\<td\s+).*?(class="(?<class>.*?)")*.*?\>/',$layout[1],$match,PREG_OFFSET_CAPTURE );
    if( $ok && $match ){
        $class = $row_marker['name'] . '###' . $row_marker['field'] . '###';
        if( isset($match['class']) ) {
            $pos = $match['class'][1]+strlen($match['class'][0]);
            $class = ' ' . $class;
        } else {
            $pos = $match['td'][1]+strlen($match['td'][0]);
            $class = 'class="' . $class . '" ';
        }
        $layout[1] = substr_replace($layout[1],$class,$pos,0);
        $list->setColumnLayout($name,$layout);
    }
}
```

<a name="weg_class_css"></a>
#### Das CSS

Das CSS muss zunächst eine Klasse bestehend aus dem CSS-Prefix (`xyz-privacy-`) und den zu
formatierenden Feldwerten aufweisen. Die nachfolgenden Sibling-Klassen erhalten dieselbe 
Formatierung. 

Problematisch ist der Hover-Effekt. Er ist im allgemeinen CSS auf der Zeile (*\<tr>*-Tag) zugewiesen
und wird nun durch die nachgelagerte *\<td>*-Formatierung übrschrieben. Daher muss **nach** den
Formatierungsklassen den *\<td>* eine Hover-Farbe zugewiesen werden.

```CSS
.xyz-privacy-internal, .xyz-privacy-internal ~ td {background-color: ivory;}
.xyz-privacy-classified, .xyz-privacy-classified ~ td {background-color: coral;}
.table-hover tbody td:hover {background-color: #e0f5ee;}
```

<a name=""></a>
### \<td>-Tag um ein Attribut erweitern

<a name="weg_attr_ep"></a>
#### Aufruf des EP

Der EP wird mit der Callback-Funktion *rex_list_set_row_attr* aufgerufen. Feldname (`privacy`) und
der Attributname (`data-privacy`) werden als Parameter übergeben. Der EP wird "spät" aufgerufen -
nur für den Fall dass ein anderer EP-Aufruf die erste Spalte löscht.

```php
\rex_extension::register(
    'REX_LIST_GET',
    'rex_list_set_row_attr',
    \rex_extension::LATE,
    ['rex_list_row_marker'=>['field'=>'privacy','name'=>'data-privacy']]
);
```

<a name="weg_attr_cb"></a>
#### Die Callback-Funktion *rex_list_set_row_attr*

```php
function rex_list_set_row_attr (\rex_extension_point $ep)
{
    // Abruf der Parameter
    $row_marker = $ep->getParam('rex_list_row_marker');
    if( !is_array($row_marker) ) return;

    // Layout der ersten rex_list-Spalte abrufen
    $list = $ep->getSubject();
    $name = $list->getColumnNames()[0];
    $layout = $list->getColumnLayout($name);

    // Attribut als erstes nach <td in den Tag eintragen
    $layout[1] = str_replace(
        '<td ',
        '<td ' . $row_marker['name'] . '="###' . $row_marker['field'] . '###" ',
        $layout[1]
    );
    $list->setColumnLayout($name,$layout);
}
```

<a name="weg_attr_css"></a>
#### Das CSS

Das CSS muss zunächst eine *\<td>*-Formatierung mittels Attribut-Selektor auf dem zu formatierenden Feldwerten aufweisen. Die nachfolgenden Sibling-Klassen erhalten dieselbe Formatierung. 

Problematisch ist der Hover-Effekt. Er ist im allgemeinen CSS auf der Zeile (*\<tr>*-Tag) zugewiesen
und wird nun durch die nachgelagerte *\<td>*-Formatierung übrschrieben. Daher muss **abschließend**
den *\<td>* eine Hover-Farbe zugewiesen werden.

```CSS
td[data-privacy="internal"], td[data-privacy="internal"] ~ td {background-color: ivory;}
td[data-privacy="classified"], td[data-privacy="classified"] ~ td {background-color: coral;}
.table-hover tbody td:hover {background-color: #e0f5ee;}
```

<a name="opt"></a>
## Optionen

<a name="yform"></a>
### YForm

Die Datentabellen in YForm basieren auf *rex_list*, damit greift auch der EP *REX_LIST_GET*. Im
Kontext von YForm sollte aber der EP *YFORM_DATA_LIST* genutzt werden, der zusätzliche Informationen
zur Tabelle enthält. Über den Tabellennamen kann im EP geprüft werden, ob die beabsichtigte 
*rex_list* geändert wird.
 
<a name="kompl"></a>
### Komplexe Basisdaten

Wie beschrieben sind nur Formatierungen auf Feldwerte möglich. Komplexe Kriterien (größer, kleiner,
Wertebereiche etc.) sind mit dem beschriebenen Mechanismus nicht abdeckbar, da immer nur ein
konkreter **Feldwert** herangezogen werden kann.

Dennoch sind auch komplexe Auswertungen möglich, wenn es gelingt der Tabelle ein entsprechendes
berechnetes Feld einzumischen. Dazu muss die SQL-Abfrage um ein berechnetes Feld erweitert werden.

```php
$query = "SELECT *, IF(entfernung<50,'0',IF(entfernung>100,'3','1')) as tdcolor FROM demo";

\rex_extension::register(
    'REX_LIST_GET',
    'rex_list_set_row_class',
    \rex_extension::LATE,
    ['rex_list_row_marker'=>['field'=>'tdcolor','name'=>'xyz-distanz-']]
);

$list = rex_list::factory( $query );
```

Für YForm-Tabellen gibt es den EP *YFORM_DATA_LIST_SQL*, über den die SQL-Abfrage verändert werden
kann.
