---
title: Adminer in YForm verlinken
authors: [christophboecker]
prio:
---

# Adminer in YForm verlinken

[Auch als AddOn erhältlich](https://github.com/FriendsOfREDAXO/yform_adminer)

Es könnte ja sein, dass man als Entwickler bzw. Admin mal eben in der Datenbank selbst nach dem
Rechten sehen, Ergebnisse kontrollieren oder sonstwie eingreifen möchte oder muss. 
Das empfehlenswerte Addon ["Adminer"](https://github.com/FriendsOfREDAXO/adminer) bietet hierfür
zahlreiche Möglichkeiten.

In diesem Trick wird beschrieben, wie der Adminer direkt aus einer YForm-Tabelle heraus aufgerufen werden
kann. Dazu werden Buttons an den passenden Stellen im Table-Manager und der Datentabelle eingebaut.

![Übersicht im Table-Manager](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yform_adminer_01.jpg)

1. Aus der Tabellenübersicht des YForm-Table-Manager direkt in den Adminer springen (analog zum
   Adminer-Button im Hauptmenü). [Beispiel](#1)
2. Aus der Tabellenübersicht des YForm-Table-Manager im Adminer die Tabelle `rex_yform_field` anzeigen. [Beispiel](#2)
3. Aus der Tabellenübersicht des YForm-Table-Manager im Adminer die jeweilige Tabelle anzeigen. [Beispiel](#3)
4. Aus der Tabellenübersicht des YForm-Table-Manager im Adminer die Tabelle `rex_yform_field` anzeigen,
   jedoch auf die Felder der jeweiligen Tabelle gefiltert. [Beispiel](#4)

![Datensatz-Ansicht der Tabelle](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yform_adminer_02.jpg)

5. Aus der Datensatz-Ansicht der Tabelle im Adminer die jeweilige Tabelle anzeigen (analog zu 3.). [Beispiel](#3)
6. Aus der Datensatz-Ansicht der Tabelle im Adminer in den Datensatz springen (Edit). [Beispiel](#6)

Das Verfahren ist kompatibel zum Trick [YForm-Tabellen und Formulare im eigenen Addon einbinden](https://friendsofredaxo.github.io/tricks/addons/yform/im-addon) 

## Einschränkungen

Der Adminer ist ein reines Admin-Tool, wie der Name schon nahelegt. Im Beispielcode werden
die Button nur eingebaut, wenn der eingeloggte Beutzer Admin-Rechte hat und der Adminer verfügbar ist.

## Andockpunkte

Die Button werden über Extension-Points eingehängt. Die Buttons rufen letztlich nur eine
URL in einem neuen Fenster auf, wie sie der Adminer intern benutzt.

### page=yform/manager/table_edit und EP REX_LIST_GET

Die Liste der YForm-Tabellen wird per `rex_list` aufgebaut. Über den EP REX_LIST_GET erhält die Liste
eine zusätzliche Spalte mit zwei Button. Im Spaltentitel werden der Adminer allgemein (1.) und die
Tabelle `rex_form_field` im Adminer (2.) aufgerufen In den Zeilen wird der Adminer für die jeweilige
Tabelle (3.) bzw. `rex_form_field` gefiltert auf die Tabelle (4.) aufgerufen.

### EP YFORM_DATA_LIST_LINKS

Der EP ermöglicht, die Buttons in der Tabellen-Kopfzeile zu beeinflussen. Für den Adminer wird ein
zusätzlicher Button am Anfang der Liste eingefügt, der die angezeigte Tabelle im Adminer öffnet (5.).

### EP YFORM_DATA_LIST_ACTION_BUTTONS

Der EP ergänzt das Submenü mit Datensatz-Aktionen um eine weiteren Button, der genau diesen Datensatz
im Adminer zum Editieren öffnet (6.).

## PHP-Code

Der Code kann z.B. via `boot.php` der Projekt-Addons für das Backend ausgeführt werden.

```php
/**
 *      Adminer-Buttons in YForm-Tabellen einbauen
 */

if( ($user = \rex::getUser()) && $user->isAdmin() && \rex_addon::get('adminer')->isAvailable() ) {

    \rex_extension::register('YFORM_DATA_LIST_LINKS', function( \rex_extension_point $ep){
        if( !$ep->getParam('popup') ) {
            $item = [
                'label'      => '<i class="rex-icon rex-icon-database" title="Adminer"></i>',
                'url'        => \rex_url::backendPage('adminer',['select'=>$ep->getParams()['table']->getTableName()]),
                'attributes' => [
                    'class'  => ['btn-default'],
                    'target' => ['_blank']
                ]
            ];
            $links = $ep->getSubject();
            array_unshift( $links['table_links'], $item );
            $ep->setSubject($links);
        }
    });

    \rex_extension::register('YFORM_DATA_LIST_ACTION_BUTTONS',function( \rex_extension_point $ep){
        $url = \rex_url::backendPage(
            'adminer',
            [
                'edit'=>$ep->getParam('table')->getTableName(),
                'where[id]'=>'___id___',
                'username' => ''
            ]);
        $buttons = $ep->getSubject();
        $buttons['adminer'] = '<a href="'.$url.'" target="_blank"><i class="rex-icon rex-icon-database"></i> Adminer</a>';
        return $buttons;
    });

    if( 'yform/manager/table_edit' === \rex_be_controller::getCurrentPage() ) {
        \rex_extension::register('REX_LIST_GET', function( \rex_extension_point $ep){
            $list = $ep->getSubject();
            $page = $list->getParams()['page'] ?: '';
            if( 'yform/manager/table_edit' === $page ){ # sicher ist sicher
                // Namen, Urls und Icons vorab festlegen
                $columnName = md5('Adminer');
                $tableIcon = '<i class="rex-icon rex-icon-database"></i>';
                $fieldIcon = '<i class="rex-icon rex-icon-template"></i>';
                $tableUrl = \rex_url::backendPage(
                    'adminer',
                    [
                        'username' => '',
                        'db' => \rex::getDbConfig(1)->name,
                    ]);
                $fieldUrl = \rex_url::backendPage(
                    'adminer',
                    [
                        'username' => '',
                        'db' => \rex::getDbConfig(1)->name,
                        'select'=>'rex_yform_field',
                        'where[0][col]'=>'table_name',
                        'where[0][op]'=>'=',
                    ]);
                // Spalte in die Liste einbauen
                $list->addColumn( md5('Adminer'),'',-1, [
                    '<th class="rex-table-icon">'.
                        '<a href="'.$tableUrl.'" target="_blank" title="Adminer">'.$tableIcon.'</a>'.
                        '<a href="'.$tableUrl.'&select=rex_yform_field" target="_blank" title="Adminer: YForm-Felder">'.$fieldIcon.'</a>'.
                    '</th>',
                    '<td class="rex-table-icon">'.
                        '<a href="'.$tableUrl.'&select=###table_name###" target="_blank" title="Adminer: Tabelle ###table_name###">'.$tableIcon.'</a>'.
                        '<a href="'.$fieldUrl.'&where[0][val]=###table_name###" target="_blank" title="Adminer: YForm-Felder der Tabelle ###table_name###">'.$fieldIcon.'</a>'.
                    '</td>'
                ]);
            }
        });
    }
}
```

## Beispiele 

Passend zu den obigen Nummern hier die Ergebnisse 

<a name="1"></a>
### 1 Adminer allgemein
![1](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yform_adminer_11.jpg)

<a name="2"></a>
### 2 Tabelle rex_yform_field
![1](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yform_adminer_12.jpg)

<a name="3"></a>
<a name="5"></a>
### 3 Die ausgewählte Tabelle
![1](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yform_adminer_13.jpg)

<a name="4"></a>
### 4 Tabelle rex_yform_field für die ausgewählte Tabelle
![1](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yform_adminer_14.jpg)

<a name="6"></a>
### 6 Den aktuellen Datensatz der ausgewählten Tabelle
![1](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yform_adminer_16.jpg)

