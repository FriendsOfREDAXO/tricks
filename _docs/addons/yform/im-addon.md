---
title: YForm-Tabellen und Formulare im eigenen Addon einbinden
authors: [christophboecker]
prio:
---

# YForm-Tabellen und Formulare im eigenen Addon einbinden

* [1. Zielsetzung](#ziel)
* [2. Zwei Schritte zum Glück](#schritte)
* [2.1 Die einfache Lösung](#einfach)
* [2.2 Die perfekte(?) Lösung](#komplex)
* [3. Anmerkungen](#anmerkung)
* [4. Testumgebung](#MD)

<a name="ziel"></a>
## 1. Zielsetzung

YForm bietet sich an, Tabellen zu verwalten. Damit stehen auch jede Menge Feldtypen
und Validierungen zur Verfügung. Man findet dort auch so schöne Feldtypen wie
google_geomap bzw. osm_geomap zur Karteneinbindung. Und es gib eine Suchfunktion, und die Massenänderung,
 ...

Viele Addon basieren auf eigenen Tabellen und bauen sie z.B. mit rex_form und rex_list zusammen.
Nichts spricht gegen diese Vorgehensweise. Aber muss man *immer*
auf selbstgebaute Tabellen und Formulare aufsetzen? Oder lässt sich YForm elegant nutzen? So z.B.

![Beispiel](screenshots/yform_im-addon_screenhot_01.png "Beispiel")

**Hier soll gezeigt werden, wie einfach es möglich ist, per YForm verwaltete
Tabellen in einem Addon so zu nutzen, als seien es originäre Listen- und Formular-Seiten des Addons.**

<a name="schritte"></a>
## 2. Zwei Schritte zum Glück

Die Lösung besteht aus zwei Teilen

1. Addon-Menü konfigurieren
1. Helper-Funktion (page) für das Addon-Menü schreiben

Im ersten Schritt wird die Tabelle als Seitenaufruf im Menü des eigenen Addons eingebaut. Über den Menüpunkt
wird eine Seite aufgerufen, die von einer dafür vorgesehenen PHP-Datei (zweiter Schritt) im Verzeichnis `myaddon/pages`
erzeugt wird.

Nachfolgend werden zwei Varianten beschrieben. Die [einfache](#einfach) basiert auf einer je YForm-Tabelle individuell
konfigurierten PHP-Page, die zweite zeigt eine [universelle Version](#komfort), die über `package.yml` konfiguriert wird.

Die eigentlich ausführende Funktion in YForm - das Original - findet sich in der Datei
[`yform/plugins/manager/pages/data_edit.php`](https://github.com/yakamara/redaxo_yform/blob/master/plugins/manager/pages/data_edit.php).
Sie kann mit geringem Aufwand als Blaupause für eine eigene Aufrufseite dienen:


```php
<?php
$table_name = rex_request('table_name', 'string');
$table = rex_yform_manager_table::get($table_name);

if ($table && rex::getUser() && (rex::getUser()->isAdmin() || rex::getUser()->getComplexPerm('yform_manager_table')->hasPerm($table->getTableName()))) {
    try {
        $page = new rex_yform_manager();
        $page->setTable($table);
        $page->setLinkVars(['page' => 'yform/manager/data_edit', 'table_name' => $table->getTableName()]);
        echo $page->getDataPage();
    } catch (Exception $e) {
        $message = nl2br($e->getMessage()."\n".$e->getTraceAsString());
        echo rex_view::warning($message);
    }
} else {
    if (!$table) {
        echo rex_view::warning(rex_i18n::msg('yform_table_not_found'));
    }
}
```

<a name="einfach"></a>
## 2.1 Die einfache Lösung

Konkret sind zwei Schritte notwendig:

1. [Addon-Menü konfigurieren](#einfachA)
1. [Helper-Funktion für das Addon-Menü schreiben](#einfachB)

<a name="einfachA"></a>
### 2.1.1 Addon-Menü konfigurieren

In der `package.yml` des Addons wird das Menü um Einträge erweitert, die jeweils eine
Tabelle anzeigen und die Bearbeitung ermöglichen:

```yml
page:
    title: 'Addon-Titel'
    subpages:
        orte:
            title: 'Orte'
            icon: rex-icon fa-map-marker
        termine:
            title: 'Termine'
            icon: rex-icon fa-calendar
```

Das führt dazu, dass für `orte` eine Datei `myaddon/pages/orte.php` und für `termine` eine Datei
`myaddon/pages/orte.php` aufgerufen werden. Beide müssen existieren.


<a name="einfachB"></a>
### 2.1.2 Helper-Funktion für das Addon-Menü schreiben

Die beiden Dateien `myaddon/pages/orte.php` bzw. `myaddon/pages/orte.php` werden Varianten der
`data_edit.php`. Zwei Änderungen sind zwingend notwendig.

1. **$table_name fest vorgeben**

    Im Originalcode wird der Tabellenname aus den Request-Parametern abgelesen
    (`$table_name = rex_request('table_name', 'string');`). Das funktioniert beim ersten
    Aufruf aus dem Menü noch nicht; daher wird der Name der zu bearbeitenden Tabelle
    (im Beispiel "rex_myaddon_orte" bzw. "rex_myaddon_termine" ) fest eingegeben.

2. **YForm mitteilen, dass die Tabellen/Formulare im Addon angezeigt werden**

    Für alle Folgeaufrufe ist im Original die Zielseite mit `yform/manager/data_edit` fest angegeben.
    Dort muss entweder der eigene Seitenname fest eingetragen werden (im Beispiel: 'myaddon/orte' bzw. 'myaddon/termine') oder
    noch besser ganz allgemein der Seitenpfad, über den die Datei eh grade aufgerufen wurde
    (also `rex_request('page', 'string')`).

Die einfachste Lösung besteht also darin, je zu bearbeitender Tabelle eine eigene Variante der
`data_edit.php` im pages-Verzeichnis des Addons abzulegen.

```PHP
<?php
$table_name = 'rex_myaddon_orte';
$table = rex_yform_manager_table::get($table_name);

if ($table && rex::getUser() && (rex::getUser()->isAdmin() || rex::getUser()->getComplexPerm('yform_manager_table')->hasPerm($table->getTableName()))) {
    try {
        $page = new rex_yform_manager();
        $page->setTable($table);
        $page->setLinkVars(['page' => rex_request('page', 'string'), 'table_name' => $table->getTableName()]);
        echo $page->getDataPage();
    } catch (Exception $e) {
        $message = nl2br($e->getMessage()."\n".$e->getTraceAsString());
        echo rex_view::warning($message);
    }
} else {
    if (!$table) {
        echo rex_view::warning(rex_i18n::msg('yform_table_not_found'));
    }
}
```

Das Verfahren ist einfach, hat jedoch noch einen Schönheitsfehler. Die YForm-Seiten werden immer mit der
Seiten-Titelzeile angezeigt. Sie kann auch nicht wirksam über Parameter oder Extension-Points unterdrückt
werden. Wie man sie trotzdem loswerden kann, wird in einem [späteren Kapitel](#titelzeile) beschrieben.


<a name="komplex"></a>
## 2.2 Die perfekte(?) Lösung

Nachfolgend wird beschrieben, wie man statt mit separaten Dateien pro Tabelle mit einer universellen
Page-Datei die Tabellen einbinden kann. Wieder sind es zwei Schritte:

1. [Addon-Menü konfigurieren](#komplexA)
1. [Helper-Funktion für das Addon-Menü schreiben](#komplexB)

Im Unterschied zur einfachen Version erfolgt die komplette Konfiguration der Aufrufe über `package.yml`.

<a name="komplexA"></a>
### 2.1 Addon-Menü konfigurieren

In der `package.yml` des Addons wird das Menü um Einträge erweitert, die jeweils eine Tabelle anzeigen und die Bearbeitung ermöglichen:

```yml
page:
    title: 'Addon-Titel'
    subpages:
        orte:
            title: 'Orte'
            icon: rex-icon fa-map-marker
            subPath: pages/data_edit.php
            yformTable: rex_myaddon_orte
            yformClass: myaddon-yform
        termine:
            title: 'Termine'
            icon: rex-icon fa-calendar
            subPath: pages/data_edit.php
            yformTable: rex_myaddon_termine
            yformClass: myaddon-yform
            yformTitle: true
```

"Normale" Menüpunkte würden zur Bearbeitung die Datei `myaddon/pages/orte.php` bzw.
`myaddon/pages/termine.php` heranziehen.
Aber `subPath: pages/data_edit.php` leitet den Aufruf auf die Datei
`myaddon/pages/data_edit.php` um.

Es kann auch ein anderes Verzeichnis als `myaddon/pages` sein (z.B. `project/pages`), das ist nur ein Beispiel.

Damit `myaddon/pages/data_edit.php` unterscheiden kann, was eigentlich zu tun ist, wird mit zusätzlichen
Parametern die Anforderung spezifiziert:

Property | Beschreibung
---| ---
yformTable | Der Name der Tabelle, die bearbeitet werden soll (notwendig).
yformClass | CSS-Klassename für einen `<div>`-Tag, der um die generierte Seite gelegt wird. Das erleichtert die Suche in Output-Filtern und ermöglicht individuelle CSS-Konfigurationen (default: keine `<div>`-Klammer).
yformTitle | Wenn angegeben und auf `true` gesetzt wird die (eigentlich im Addon überflüssige) Titelzeile doch eingeblendet (default: false).

Eine Lösung für die in einem [späteren Kapitel](#titelzeile) beschriebene Kopfzeilenproblematik ist
hier schon mal vorweggenommen.

<a name="komplexB"></a>
### 2.2 Helper-Funktion für das Addon-Menü schreiben


1. **$table_name aus der package.yml nehmen**

    Im Originalcode wird der Tabellenname aus den Request-Parametern abgelesen
    (`$table_name = rex_request('table_name', 'string');`). Das funktioniert beim ersten
    Aufruf aus dem Menü noch nicht; statt dessen soll die Property `yformTable` herangezogen werden.

2. **YForm mitteilen, dass die Tabellen/Formulare im Addon angezeigt werden**

    Dazu reicht es aus, in ```setLinkVars``` den Url-Parameter "page" auf den Wert aus der
    URL zu setzen.

Die neue, eigene `myaddon/pages/data_edit.php` könnte in der Basisversion so aussehen:

```PHP
<?php
if( isset( $this->getProperty('page')['subpages'][rex_be_controller::getCurrentPagePart(2)] ) )
{
    $properties = $this->getProperty('page')['subpages'][rex_be_controller::getCurrentPagePart(2)];
    if( $sub=rex_be_controller::getCurrentPagePart(3) ) $properties = $properties['subpages'][$sub];
    $table_name = isset( $properties['yformTable'] ) ? $properties['yformTable'] : '';
    $target_page = rex_request('page', 'string');
}
else
{
    $table_name = '';
}

$table = rex_yform_manager_table::get($table_name);

if ($table && rex::getUser() && (rex::getUser()->isAdmin() || rex::getUser()->getComplexPerm('yform_manager_table')->hasPerm($table->getTableName()))) {
    try {
        $page = new rex_yform_manager();
        $page->setTable($table);
        $page->setLinkVars([ 'page' => $target_page, 'table_name' => $table->getTableName()]);
        echo $page->getDataPage();
    } catch (Exception $e) {
        $message = nl2br($e->getMessage()."\n".$e->getTraceAsString());
        echo rex_view::warning($message);
    }
} else {
    if (!$table) {
        echo rex_view::warning(rex_i18n::msg('yform_table_not_found'));
    }
}
```

Die Version ist der allgemeinere Ansatz ggü. der [einfachen Lösung](#einfach), hat aber noch nicht alle angestrebten Features.
Um die beiden Parameter ```yformTitle``` und ```yformClass``` zu berücksichtigen, ist etwas mehr Code erforderlich:

Hier ist der vollständige Code der perfekten(?) Lösung:
<a href="final"></a>
```php
<?php
$target_page = rex_request( 'page', 'string' );

if( $target_page == 'yform/manager/data_edit' )
{
    $table_name = rex_request( 'table_name', 'string' );
    $wrapper = '';
    $show_title = true;
}
elseif( isset( $this->getProperty('page')['subpages'][rex_be_controller::getCurrentPagePart(2)] ) )
{
    # page-Properties allgemein abrufen
    $properties = $this->getProperty('page')['subpages'][rex_be_controller::getCurrentPagePart(2)];
    if( $sub=rex_be_controller::getCurrentPagePart(3) ) $properties = $properties['subpages'][$sub];
    # yform-properties
    $table_name = isset( $properties['yformTable'] ) ? $properties['yformTable'] : '';
    $wrapper = isset( $properties['yformClass'] ) ? $properties['yformClass'] : '';
    $show_title = isset( $properties['yformTitle'] ) && $properties['yformTitle'] == true;
}
else
{
    $table_name = '';
}

$table = rex_yform_manager_table::get($table_name);

if ($table && rex::getUser() && (rex::getUser()->isAdmin() || rex::getUser()->getComplexPerm('yform_manager_table')->hasPerm($table->getTableName())))
{
    try {

        $page = new rex_yform_manager();
        $page->setTable( $table );
        $page->setLinkVars( ['page' => $target_page, 'table_name' => $table->getTableName()] );

        if( $wrapper ) echo "<div class=\"$wrapper\">";

        if( $show_title )
        {
            echo $page->getDataPage();
        }
        else
        {
            # Seite erzeugen und abfangen
            ob_start();
            echo $page->getDataPage();
            $page = ob_get_clean();
            # Such den Header - Fall 1: mit Suchspalte?
            $p = strpos( $page,'</header>'.PHP_EOL.'<div class="row">' );
            # Such den Header - Fall 2: ohne Suchspalte
            if( $p === false ) $p = strpos( $page,'</header>'.PHP_EOL.'<section class="rex-page-section">' );
            # Header rauswerfen
            if( $p !== false ) $page = substr( $page, $p );
            # ausgabe
            echo $page;
        }

        if( $wrapper ) echo '</div>';

    } catch (Exception $e) {
        $message = nl2br($e->getMessage()."\n".$e->getTraceAsString());
        echo rex_view::warning($message);
    }

} elseif ( !$table ) {

    echo rex_view::warning(rex_i18n::msg('yform_table_not_found'));

}
```


<a name="MC"></a>
## 3. Anmerkungen

### 3.1 Titelzeile

Die Titelzeile kann via EP "PAGE_TITLE" auf "leer" gesetzt werden. Der entsprechende `<header>`-Tag wird trotzdem eingebaut. Er wäre zwar nicht sichtbar, aber in Installationen mit dem Addon [quick_navigation](https://github.com/FriendsOfREDAXO/quick_navigation) hilft das
nicht weiter, da die Quick-Navigation in den `<header>`-Tag gehängt wird.

Andere vorgegebene Möglichkeiten, die Headerzeile zu beeinflussen oder auszublenden, bestehen nicht.

Somit bleibt nur, die Titelzeile entweder per CSS auszublenden oder wie oben beschrieben herauszulöschen. Schöner wäre es, wenn sie gar nicht erst erzeugt werden würde.
Dazu bedarf es aber Änderungen in der Klasse ```rex_yform_manager``` z.B. in Form einer Methode, die ein Flag `showTitle=false` setzen würde.

### 3.2 Idee: Integration in YForm

Die [oben beschriebene](#final) `data_edit.php` ist geeeignet, die originale `yform/plugins/manager/pages/data_edit.php` zu ersetzen.

Der Aufruf in der package.yml des Addons wäre dann

```
    subPath: ../yform/plugins/manager/pages/data_edit.php
```

Zudem würde der Code etwas entlastet, wenn der Klasse ```rex_yform_manager``` ein Mechanismus spendiert wird, der die Ausgabe der Titelzeile unterdrückt. Dies kann z.B. durch eine Methode, die ein Flag `showTitle=false` setzt, realisiert werden.

<a name="MD"></a>
## 4. Testumgebung

* REDAXO 5.5.1
* YFORM 2.3
