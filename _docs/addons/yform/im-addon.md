---
title: YForm-Tabellen und Formulare im eigenen Addon einbinden
authors: [christophboecker]
prio:
---

# YForm-Tabellen und Formulare im eigenen Addon einbinden

- [Zielsetzung](#a)
- [Wie macht das YForm?](#b)
- [Kann man das adaptieren?](#c)
- [Umsetzung](#d)
    - [package.yml](#d1)
        - [YForm-Tabellen als Seiten festlegen](#d1a)
        - [YForm-Seiten konfigurierten](#d1b)
    - [pages/yform.php](#d2)
- [Testumgebung](#e)

Changelog:
- **V 2.0 / 30.01.2021**
  - benötigt YForm ab V3.4: Titel per EP ausblenden
  - neue Struktur der Properties in *package.yml*
  - Text und Musterscript komplett neu

<a name="a"></a>
## Zielsetzung

Statt der klassischen Variante mit rex_list/rex_form steht mit dem Addon **YForm** eine Alternative
zur Verfügung, die über wesentlich mehr Datentypen und weitere Features (z.B. Suchfunktion,
Massenänderung) verfügt. Der Artikel befasst sich mit YForm-Tabellen, die mit dem Table-Manager
angelegt und verwaltet werden.

**Hier soll gezeigt werden, wie einfach es möglich ist, per YForm verwaltete Tabellen in einem Addon
so zu nutzen, als seien es originäre Listen- und Formular-Seiten des Addons.** Es erfordert nur
wenig Aufwand. Im Endergebnis kann es z.B. so aussehen:

![Beispiel](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yform_im-addon_screenhot_01.png "Beispiel")

<a name="b"></a>
## Wie macht das YForm?

Das Manager-Plugin für den Table-Manager stellt ein Seiten-Script zum Aufruf einer Tabelle zur
Verfügung: [yform/plugins/manager/pages/data_edit.php](https://github.com/yakamara/redaxo_yform/blob/master/plugins/manager/pages/data_edit.php).

Der unbedingt notwendige Aufruf-Parameter ist der Tabellenname (`$table_name`), der aus der URL
übernommenen wird (`...&table_name=«tabellenmane»`). *data_edit.php* ruft den Tabellennamen aus
`$_REQUEST['table_name']` ab.

Zum Ausgabestandard gehört auch die Titelzeile. Innerhalb eines Addon ist sie meist redundant, wenn
das Addon seine Seiten über eine übliche *pages/index.php* verwaltet und mit einem Titel versieht.

<a name="c"></a>
## Kann man das adaptieren?

Eine relativ einfache Variante ist, *data_edit.php* in das *pages*-Verzeichnis des Addons zu
kopieren und so anzupassen, dass der initiale Tabellenname fest vorgegeben ist. Unerwünschte
Titelzeilen können per EP `YFORM_MANAGER_DATA_PAGE_HEADER` unterdrückt werden.

Mehrere Tabellen erfordern mehrere Adaptionen der *data_edit.php*. Zudem müssen Änderung in der
Originaldatei erkannt und ggf. nachgezogen werden.

Die folgende Lösung arbeitet mit einem standardisierten Script im Addon, dass seine Parameter wie
z.B. den Tabellennamen aus der *package.yml* entnimmt.

<a name="d"></a>
## Umsetzung

Der Vorschlag beruht auf zwei Teilen:
- In der *package.yml* werden die Seiten für YForm-Tabellen konfiguriert
- Den Seitenaufbau übernimmt ein vorgeschaltetes Script (*pages/yform.php*), das auf Basis der
  *package.yml* den Aufruf der *data_edit.php* vorbereitet und durchführt.

<a name="d1"></a>
### package.yml

Der einfache erste Gedanke, in der *package.yml* die Seitendefinition um Tabellenangaben zu
erweitern, ist grundsätzlich machbar. Leider sind die Daten in den Properties schwierig auffindbar,
da REDAXO nur ausgewählte Seiten-Properties direkt abrufbar in die Page-Properties lädt.

Um den einfachen Zugriff zu ermöglichen, wird ein eigener Zweig `yform:` angelegt. Zu jeder Seite
gibt es einen eigenen Eintrag mit den Tabellen-Parametern.

<a name="d1a"></a>
#### YForm-Tabellen als Seiten festlegen

Im folgenden Beispiel wird eine Seitenstruktur gezeigt, deren erste Seite (`...&page=«addon»/config`)
klassisch auf ein Script *pages/config.php* verweist. Die Seiten `...&page=«addon»/mapset` und
`...&page=«addon»/layer` hingegen greifen auf das im [nächsten Absatz](#d2) beschriebene Script
*pages/yform.php* zu.

```YML
page:
    title: translate:geolocation_title
    subpages:
        config:
            title: translate:geolocation_config
        mapset:
            title: translate:geolocation_mapset
            subPath: pages/yform.php
        layer:
            title: translate:geolocation_layer
            subPath: pages/yform.php
```

<a name="d1b"></a>
#### YForm-Seiten konfigurierten

Die YForm-Tabellen werden über den Seitennamen, der sich aus der Page-Definiton ergibt, im Zweig
`yform:` identifiziert (Beispiel: `«addon»/mapset`). Mögliche Properties sind

Property | Beschreibung | Typ | Default
---| --- | --- | ---
table_name | Der Name der Tabelle, die bearbeitet werden soll | notwendig |
wrapper_class | CSS-Klassename für einen `<div>`-Tag, der um das von *data_edit.php* generierte HTML gelegt wird. Das erleichtert die Suche in Output-Filtern und ermöglicht individuelle CSS-Konfigurationen | optional | keine `<div>`-Klammer
show_title | Wenn angegeben und auf `true` gesetzt wird die (meist im Addon überflüssige) Titelzeile doch eingeblendet. | optional | `false`

```YML
yform:
    «addon»/mapset:
        table_name: rex_geolocation_mapset
    «addon»/layer:
        table_name: rex_geolocation_layer
```

Das Script *pages/yform.php* sucht im Zweig `yform:` den Eintrag zur aktuellen Seite wie von
`\rex_be_controller::getCurrentPage()` ermittelt.

<a name="d2"></a>
### pages/yform.php

Die eigentliche Seitensteuerung bleibt beim Script *data_edit.php*. Das im Addon vorgeschaltete
Script *pages/yform.php* hat vier Aufgaben:

- Platziere den Parameter `...&table_name=«tabellenmane»` in der URL per Simulation.
    ```PHP
    $_REQUEST['table_name'] = $table_name;
    ```
- Erzeuge das YForm-HTML für die Tabellenseite via *data_edit.php*.
    ```PHP
    include \rex_path::plugin('yform','manager','pages/data_edit.php');
    ```
- Optional: blende die YForm-Titelzeile aus.
    ```PHP
    if( !$show_title ){
        \rex_extension::register(
            'YFORM_MANAGER_DATA_PAGE_HEADER',
            function( \rex_extension_point $ep ) {
                if ($ep->getParam('yform')->table->getTableName() === $ep->getParam('table_name')) {
                    return '';
                }
            },
            \rex_extension::EARLY,['table_name'=>$table_name]
        );
    }
    ```
- Optional: setze eine DIV-Klammer mit eigener Klasse um das YForm-HTML.
    ```PHP
    if( $wrapper_class ){
        echo '<div class="',$wrapper_class,'">';
    }
    include \rex_path::plugin('yform','manager','pages/data_edit.php');
    if( $wrapper_class ) {
        echo '</div>';
    }
    ```

Die Parameter werden der *package.yml* entnommen. Die YML-Struktur ist [oben beschrieben](#d1).

```PHP
$yform = $this->getProperty('yform',[]);
$yform = $yform[\rex_be_controller::getCurrentPage()] ?? [];

$table_name = $yform['table_name'] ?? '';
$show_title = true === ($yform['show_title'] ?? false);
$wrapper_class = $yform['wrapper_class'] ?? '';

if( $table_name ) {
    $_REQUEST['table_name'] = $table_name;
}

if( !$show_title ){
    \rex_extension::register(
        'YFORM_MANAGER_DATA_PAGE_HEADER',
        function( \rex_extension_point $ep ) {
            if ($ep->getParam('yform')->table->getTableName() === $ep->getParam('table_name')) {
                return '';
            }
        },
        \rex_extension::EARLY,['table_name'=>$table_name]
    );
}

if( $wrapper_class ){
    echo '<div class="',$wrapper_class,'">';
}

include \rex_path::plugin('yform','manager','pages/data_edit.php');

if( $wrapper_class ) {
    echo '</div>';
}
```

<a name="e"></a>
## Testumgebung

* REDAXO 5.11
* YFORM 3.4
