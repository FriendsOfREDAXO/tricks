---
title: REX_LIST-Zeilen datenabhängig formatieren
authors: [christophboecker]
prio:
---

# REX_LIST-Zeilen datenabhängig formatieren

Einzelne Zellen können per Callback bei der Ausgabe der rex_list angepasst und bedingt formatiert werden. Aber die ganze Zeile anders einfärben wenn bestimmte Werte im Datensatz stehen? 
Geht? Geht! Auch für YForm.

- [Grundannahmen und Beispiel](#basic)
- [Ab REDAXO 5.12](#neu)
    - [Eine Klasse mit Feldwerten zuweisen](#neu1)
    - [Eine Klasse aus komplexen Abfragen zuweisen](#neu2)
    - [YForm-Beispiel: den aktuellen Datensatz markieren](#neu3)
- [Bis REDAXO 5.11.2](#alt)
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

Für die Beschriebenen Verfahren gilt, dass sie entweder in der Listendefinition (sofern man sie
selbst vornimmt) eingebaut werden oder in an anderer Stelle generierten Listen mittels Extension-Point
(EP) *REX_LIST_GET*. Für YForm-Listen, die auf *rex_list* basieren, solte der EP *YFORM_DATA_LIST*
genutzt werden.

![Beispiel](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/rex_list_row_marker.jpg "Beispiel")

<a name="neu"></a>
## Ab REDAXO 5.12.0

Seit Version REDAXO 5.12.0 verfügt *rex_list* über eine Methode _setRowAttributes_, mit der Attribute
auf Zeilenebene (\<tr>-Tag) gesetzt werden können. In den Attributen sind Feld-Platzhalter möglich.
So könnte z.B. die Satznummer in den tr-Tag übernommen werden (`$list->setRowAttributes(['data-id','###id###']);`).

Alternativ kann eine Callback-Funktion angegeben werden, die Attribute auf Basis der Zeilenwerte
erstellt.

<a name="neu1"></a>
### Eine Klasse mit Feldwerten zuweisen

Da die Attribute auch Platzhalter für Zeilenwerte enthalten dürfen, kann ein mit *$list->setRowAttributes*
erstelltes *class*-Attribut zusammengesetzt werden aus einem festen Teil und einem variablen Teil
aus dem Datensatz:

```php
$list->setRowAttributes(['class'=>'xyz-privacy-###privacy###']);
```

```css
tr.xyz-privacy-internal:not(:hover) {background-color: ivory;}
tr.xyz-privacy-classified:not(:hover) {background-color: coral;}
```

<a name="neu2"></a>
### Eine Klasse aus komplexen Abfragen zuweisen

Das obige Beispiel ist nicht immer anwendbar. Was bei einer sehr geringen Anzahl Werten, die zudem
statisch sind, noch funktioniert, gerät bei dynamischen Werten schnell an Grenzen.

Alternativ werden die Daten per Callback-Funktion ausgewertet und dann gezielt Attribute gesetzt.
Im Beispiel werden veraltete Dokumente (älter als 1 Jahr) orange markiert:

```php
$list->setRowAttributes(function($list){
    if( $list->getValue('lastupdate') < time() ) {
        return 'class="xyz-oudated"';
    }
    return '';
});
```

```css
tr.xyz-oudated:not(:hover) {background-color: orange;}
```

<a name="neu3"></a>
### YForm-Beispiel: den aktuellen Datensatz markieren

Ansatzpunkt ist der EP *REX_YFORM_SAVED*, der sowohl beim Hinzufügen als auch beim Ändern eines
Datensatzes durchlaufen wird. Er stellt über die Parameter die Datensatznummer zur Verfügung.

Damit wird der Folge-EP *YFORM_DATA_LIST* aktiviert, der der Liste per *setRowAttributes* eine
Callback-Funktion zuweist. Die Funktion prüft, ob die ID des geänderten Datensatzes mit der ID des
angezeigten übereinstimmt und entsprechend eine Klasse zuweist oder nicht.

```php
\rex_extension::register('REX_YFORM_SAVED',
    function( \rex_extension_point $ep )
    {
        \rex_extension::register('YFORM_DATA_LIST',
            function( \rex_extension_point $ep)
            {
                if( $ep->getParam('table')->getTablename() == $ep->getParam('__TABLE') ) {
                    $list = $ep->getSubject();
                    $id = $ep->getParam('__ID');
                    $list->setRowAttributes( function($list) use ($id) {
                        if ($id === $list->getValue('id')) {
                            return 'class="highlight-last-updated"';
                        }
                    });
                }
            },
            rex_extension::NORMAL,
            ['__TABLE' => $ep->getParam('table'), '__ID' => $ep->getParam('id')]
        );
    }
);
```

```css
tr.highlight-last-updated:not(:hover) {background-color: ivory;}
```


<a name="alt"></a>
## Bis REDAXO 5.11.2

Der ideale Weg, über eine Methode wie *setRowAttributes* auf der Zeile (`<tr class="xyz">`) die
gewünschte Formatierung zu erhalten, fehlt. NAchfolgend wird direkt der komplexe Weg, Listen via EP
zu ändern, beschrieben. Ob man die Callback-Funktion des EP als anonyme Funktion, als benannte
Funktion oder als (statische) Methode eine Klasse anlegt, ist dabei irrelevant. Das Beispiel geht
von einer benannten Funktion aus.

Die Lösung für selbsterstellte Liste läßt sich daraus ableiten.

Für gewünschte Optik muss die Tabellenzelle (*\<td>*) formatiert werden, nicht der Inhalt.
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
.table-hover tbody tr:hover td {background-color: #e0f5ee;}
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
.table-hover tbody tr:hover td {background-color: #e0f5ee;}
```

<a name="opt"></a>
### Optionen

<a name="yform"></a>
#### YForm

Die Datentabellen in YForm basieren auf *rex_list*, damit greift auch der EP *REX_LIST_GET*. Im
Kontext von YForm sollte aber der EP *YFORM_DATA_LIST* genutzt werden, der zusätzliche Informationen
zur Tabelle enthält. Über den Tabellennamen kann im EP geprüft werden, ob die beabsichtigte 
*rex_list* geändert wird.
 
<a name="kompl"></a>
#### Komplexe Basisdaten

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

Für YForm-Tabellen gibt es den EP *YFORM_DATA_LIST_SQL*, über den die SQL-Abfrage verändert werden. Hier ein komplexes Beispiel
kann.

```php

rex_extension::register('YFORM_DATA_LIST_SQL', function( $ep ){

    switch( substr($ep->getParams()['table']['table_name'],strlen(rex::getTablePrefix())) ) {
        case 'tabelle_1':
            # Liste umbauen
            rex_extension::register('YFORM_DATA_LIST', function( $ep ) {
                $list = $ep->getSubject();
                $list->removeColumn('id');
                $list->addColumn('Anschrift','###strasse###<br>###land###-###plz### ###ort###',3);
                $list->removeColumn(rex_i18n::msg('yform_delete'));
                $list->setColumnFormat('bild','custom', function( $params ) {
                    if (!$params["value"]) return '';
                    if( !is_file( rex_path::media($params["value"])) ) return '';
                    return '<img src="'.rex_url::backendController( ['rex_media_type'=>'rex_mediapool_preview','rex_media_file'=>$params["value"]] ).'" />';
                });
                return $list;
            });
            # Abfrage umbauen
            return str_replace (',`name`',',concat (`name`,", ",`vorname`) as `name`,',$ep->getSubject());
            break;
        case 'tabelle_2':
            break;
    }
});

```
