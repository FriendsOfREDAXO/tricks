---
title: YForm-Tabellen und Formulare im eigenen Addon einbinden
authors: [christophboecker]
prio:
---

# YForm-Tabellen und Formulare im eigenen Addon einbinden

- [Zielsetzung](#a)
- [Die ganz schnelle und einfache Lösung](#b)
- [Die große Lösung](#c)
    - [**package.yml**](#c1)
    - [Das Aufruf-Script **yform.php**](#c2)
- [Changelog](#changelog)

<a name="a"></a>
## Zielsetzung

Statt der klassischen Variante mit `rex_list` und `rex_form` steht mit dem Addon **YForm** eine Alternative
zur Verfügung, die über wesentlich mehr Datentypen und weitere Features (z.B. Suchfunktion,
Massenänderung) verfügt. Der Artikel befasst sich mit YForm-Tabellen, die mit dem Table-Manager
angelegt und verwaltet werden.

**Hier soll gezeigt werden, wie einfach es möglich ist, per YForm verwaltete Tabellen
so zu nutzen, als seien es originäre Listen- und Formular-Seiten des eigenen Addons im Backend.** Es erfordert nur
wenig Aufwand. Im Endergebnis kann es z.B. so aussehen:

![Beispiel](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yform_im-addon_screenhot_01.png "Beispiel")

In den folgenden Beschreibungen und Code-Beispielen steht
- `meinaddon` für den Package-Namen des Addons,
- `seitenname` für den internen Namen der Sub-Seite innerhalb des Addons,
- `rex_meinaddon_tabelle` für den Tabellennamen in der Datenbank.

Im Geolocation-Addon, aus dem die Bilder stammen, wäre das
- `meinaddon` ==> `geolocation`
- `seitenname`==> `mapset` bzw. `layer`
- `rex_meinaddon_tabelle` ==> `rex_geolocation_mapset` bzw. `rex_geolocation_layer`

<a name="b"></a>
## Die ganz schnelle und einfache Lösung

Die Einbindung basiert auf zwei Komponenten:
- in der **package.yml** des eigenen Addons wird eine Sub-Seite für die Tabelle definiert
- Ein (optionaler) Eintrag in der **boot.php** des Addons.

Den Seitenaufbau an sich übernimmt ein Original-Script des YForm-Addons: **data_edit.php**

Ein ganz rudimentäres Beispiel zeigt die nötigsten Einträge in der **package.yml**:

**für YForm 4.0:**
```yml
package: meinaddon
version: 1.0.0

page:
    title: Mein Addon
    subpages:
        seitenname:
            title: Tabellentitel
            subPath: ../yform/plugins/manager/pages/data_edit.php
            href: ?page=meinaddon/seitenname?table_name=rex_meinaddon_tabelle

requires:
    packages:
        yform: ^4.0.0
```

**für YForm ab 5.0:**
```yml
package: meinaddon
version: 1.0.0

page:
    title: Mein Addon
    subpages:
        seitenname:
            title: Tabellentitel
            subPath: ../yform/pages/manager.data_edit.php
            href: ?page=meinaddon/seitenname&table_name=rex_meinaddon_tabelle

requires:
    packages:
        yform: '>=5.0.0'
```

Wie man sehen kann wird für (jede) einzubindende Tabelle unter `subpages: ...` ein Seiteneintrag erstellt. Der Eintrag benötigt mindestens drei Elemente:
- `title: ...` für den Menüpunkt im Addon,
- `subPath: ...` um an Stelle des Scriptes **pages/seitenname.php** den Aufruf auf **data_edit.php** umzubiegen.
- `href: ...` um die Seite (`page=meinaddon/seitenname`) initial mit der gewünschten Tabelle (`table_name=rex_meinaddon_tabelle`) zu verbinden.

> Ab YForm 5.0 gilt `subPath: ../yform/pages/manager.data_edit.php`, da die Plugins aufgelöst wurden. Soll sowohl YForm 4 als auch YForm 5 addressiert werden, ist dieses einfache Verfahren nicht einsetzbar. In dem Fall muss auf die nachstehend beschriebene ["Große Lösung"](#c) zurückgegriffen werden.

Das Ergebnis hat noch einen kleinen Schönheitsfehler. Zwischen dem Seitenmenü des Addons und der Tabelle wird auch noch die Tabellenüberschrift eingeblendet, die **data_edit.php** üblicherweise erzeugt (siehe rote Markierung).

![Beispiel mit Zwischenüberschrift](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yform_im-addon_screenhot_02.png "Beispiel mit Zwischenüberschrift")

Wenn die Überschrift stört, kann man sie über den ExtensionPoint `YFORM_MANAGER_DATA_PAGE_HEADER` ausblenden. Der einfachste Weg führt über ein paar Zeilen Code in der **boot.php** des Addons die bei Tabellenaufrufen aus dem Addon heraus (`page=meinaddon/...`) die Überschrift ausgeblenden.

**boot.php:**
```php
if (str_starts_with(rex_be_controller::getCurrentPage(), 'meinaddon/')) {
    rex_extension::register(
        'YFORM_MANAGER_DATA_PAGE_HEADER',
        static function (rex_extension_point $ep) {
            if ($ep->getParam('yform')->table->getTableName() === 'rex_meinaddon_tabelle') {
                return '';
            }
        },
        rex_extension::EARLY,
    );
}
```

<a name="c"></a>
## Die große Lösung

Mehr Flexibiliät bietet eine universelle Lösung, die am Ende nur über die **package.yml** konfiguriert wird. Die Tabellen-bezogenen Angaben müssen - REDAXO lässt anderes nicht zu - über eine eigene Sektion der **package.yml** erfolgen.

Die Einbindung basiert auf zwei Komponenten:
- In der **package.yml** des Addons erfolgen die Seiten-Definition und die zugehörige Tabellen-Konfiguration.
- Ein Script **pages/yform.php** steuert die weitere Verarbeitung auf Basis der Einträge in der **package.yml**.

Den Seitenaufbau an sich übernimmt ein über **yform.php** includiertes Original-Script des YForm-Addons: **data_edit.php**

<a name="c1"></a>
### package.yml

```yml
package: meinaddon
version: 1.0.0

page:
    title: Mein Addon
    subpages:
        seitenname:
            title: Tabellentitel
            subPath: pages/yform.php

yform:
    meinaddon/seitenname:
        table_name: rex_meinaddon_tabelle
```

Der Eintrag in der yform-Sektion erfolgt pro Seite, wobei als Seitenname der Name steht, den die zugehörige Seite im Addon hat. Im Beispiel ist das `meinaddon/seitenname`.  

In der YForm-Sektion der **package.yml** sind drei Parameter je Tabelle möglich

```yml
yform:
    meinaddon/seitenname:
        table_name: rex_meinaddon_tabelle         # Pflicht
        show_title: false                         # optional
        wrapper_class: meinaddon_tabsonderlayout    # optional
```

#### `table_name`  (Pflichtangabe)

In diesem Pflichteintrag wird die Tabelle benannt, die auf der Addon-Seite angezeigt werden soll. Verschiedene Schreibweisen sind möglich:
- vollständiger Tabellenname (Bsp.: `rex_meinaddon_tabelle`), also den Tabellennamen inkl. Prefix, das in den meisten Fällen `rex_`lauten dürfte.
- verkürzter Tabellenname (Bsp.: `meinaddon_tabelle`), also ohne Prefix. Der für die Installation gültige Prefix wird automatisch ergänzt.
- Falls YOrm zum Einsatz kommt ist u.U. die Angabe der Modell-Class (aka Dataset-Klasse) möglich. Die Modell-Class muss inkl. ihres ggf. bestehenden Namespace angegeben werden. In dem Fall wird aus der Modell-Class die zugeordnete Tabelle abgerufen. (`MeinRepository\MeinAddon\ModelClassName`).

#### `show_title` (optional)

Die von **data_edit.php** ausgegebene Titelzeile wird normalerweise über den EP unterdrückt. Falls sie in Einzelfällen doch erwünscht ist, kann sie mit dem optionalen Parameter `show_title: true` reaktiviert werden.

#### `wrapper_class` (optional)

Falls eigene CSS-Formatierungen gezielt für einzelne Tabellen gewünscht sind, kann ein DIV mit einer entsprechenden CSS-Klasse um das von **data_edit.php** generierte HTML gelegt werden. Das erleichtert nicht nur Tabellen-individuelle Formatierungen, sondern auch die Suche in Output-Filtern und im JS.

<a name="c2"></a>
### Das Aufruf-Script yform.php 

Nachstehend ist inklusive aller Kommentare das Script **yform.php** aus Geolocation aufgeführt. Das Script wertet die drei obigen Parameter aus, führt nötige Einstellungen durch (z.B. Belegung des EP `YFORM_MANAGER_DATA_PAGE_HEADER`) und ruft das Script **data_edit.php** aus YForm auf:

```php
<?php
/**
 * Ruft Seiten des YForm-Tablemanagers als native Addon-Seiten auf.
 *
 * Dies ist eine allgemeine Routine und bildet eine Klammer um den Aufruf der data_edit.php
 * aus yform. Details sind in den FOR-Tricks zu finden.
 *
 * Die Seiten sind in der package.yml des Addons definiert:
 *
 *      ...
 *      subpage:
 *          mytable1:
 *              title: 'Cest moi'
 *              subPath: pages/yform.php
 *
 *      yform:
 *          «addon»/mytable1:
 *              table_name: mytable_a         mandatory; sieh Anmerkung unten!!!
 *              show_title: FALSE/true        optional; default ist false!
 *              wrapper_class: myclass        optional
 *
 * "table_name" entweder als Tabellenname mit oder ohne den Prefix angegeben werden oder
 * als Model-Class/Dataset-Class:
 *      tabelle:            wird über rex::getTable($table_name) zu rex_tabelle
 *      Namespace\Tabelle:  wird über $table_name::table()->getTableName() zu rex_tabelle
 *
 * @see https://friendsofredaxo.github.io/tricks/addons/yform/im-addon
 * @var rex_addon $this
 */

$yform = $this->getProperty('yform', []);
$yform = $yform[rex_be_controller::getCurrentPage()] ?? [];

if (isset($yform['table_name'])) {
    $table_name = $yform['table_name'];
    if (is_subclass_of($table_name, rex_yform_manager_dataset::class)) {
        // table_name ist eine Dataset-Klasse
        $table_name = $table_name::table()->getTableName();
    } elseif (!str_starts_with($table_name, rex::getTablePrefix())) {
        // table_name ist ein Tabellenname
        $table_name = rex::getTable($table_name);
    }
} else {
    $table_name = '';
}

$table_name = rex_request('table_name', 'string', $table_name);
$show_title = true === ($yform['show_title'] ?? false);
$wrapper_class = $yform['wrapper_class'] ?? '';

if ('' !== $table_name) {
    /**
     * STAN: Using $_REQUEST is forbidden, use rex_request::request() or rex_request() instead.
     * NOTE: Hierfür gibt es keinen Ersatz durch eine REX-Methode/Funktion.
     * @phpstan-ignore-next-line
     */
    $_REQUEST['table_name'] = $table_name;
}

if (!$show_title) {
    rex_extension::register(
        'YFORM_MANAGER_DATA_PAGE_HEADER',
        static function (rex_extension_point $ep) {
            if ($ep->getParam('yform')->table->getTableName() === $ep->getParam('table_name')) {
                return '';
            }
        },
        rex_extension::EARLY, ['table_name' => $table_name],
    );
}

if ('' !== $wrapper_class) {
    echo '<div class="',$wrapper_class,'">';
}

if (is_file(rex_path::addon('yform', 'pages/manager.data_edit.php'))) {
    include rex_path::addon('yform', 'pages/manager.data_edit.php'); // YForm 5
} else {
    include rex_path::plugin('yform', 'manager', 'pages/data_edit.php'); // YForm 4
}

if ('' !== $wrapper_class) {
    echo '</div>';
}
```

Das Script muss im Addon als `pages/yform.php` gespeichert werden, damit es gemäß `package.yml` (siehe `subPath: pages/yform.php`) gefunden wird.

<a name="changelog"></a>
## Changelog:
- **V 3.0 / 10.07.2025**
  - Neu erstellt (einfache Lösung vorab ohne viel Erklärung)
  - Berücksichtigt YForm-Versionen mit Plugins (bis V4) und ohne (ab V5).
- **V 2.0 / 30.01.2021**
  - benötigt YForm ab V3.4: Titel per EP ausblenden
  - neue Struktur der Properties in *package.yml*
  - Text und Musterscript komplett neu



