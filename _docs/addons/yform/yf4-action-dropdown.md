---
title: YForm-Listen - Aktion-Menü in Listen zeilenweise anpassen (YF4)
authors: [christophboecker]
prio:
---

# YForm-Listen - Aktion-Menü in Listen zeilenweise anpassen (YF4)

## Dropdown-Menü "Aktion"

Seit YForm 4.0-beta5 sind die Aktions-Buttons der Datenlisten in einem Dropdown-Menü "Aktion"
platzsparend zusammengefasst. 

![Beispiel](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yf4_actionmenu_01.jpg "Beispiel")

Es gibt zwei Möglichkeiten, eigene Button einzufügen

1. Button wie gehabt via EP als Spalte einbauen (`$list->addColumn(...)`)
2. Button via EP in das Dropdown-Menü "Aktion" einhängen

Hier geht es um die neue zweite Methode.

Das Dropdown-Menü kann über den ExtensionPoint **"YFORM_DATA_LIST_ACTION_BUTTONS"** angepasst werden.
Der EP-Callback erhält als Subject ein Array mit dem HTML der Buttons:

```
^ array:1 [▼
    "ep" => rex_extension_point {#664 ▼
        -name: "YFORM_DATA_LIST_ACTION_BUTTONS"
        -subject: array:2 [▼
            "edit" => "<a href="..... ▶"
            "delete" => "<a onclick="return confirm(' id=___id___ löschen ?')" href="..... ▶"
        ]
        -params: array:3 [▶]
        -extensionParams: []
        -readonly: false
    }
]
```

Das Menü wird unmittelbar nach dem EP-Aufruf mit dem Fragment `action_buttons.php` in HTML umgesetzt und
sieht so aus:

```html
<div class="dropdown">
    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
        Aktion<span class="caret"></span>
    </button>
    <ul class="dropdown-menu dropdown-menu-right">
        <li>
            <a href="....."><i class="rex-icon rex-icon-edit"></i> editieren</a>
        </li>
        <li>
            <a onclick="return confirm(' id=___id___ löschen ?')" href="....."><i class="rex-icon rex-icon-delete"></i> löschen</a>
        </li>
    </ul> ▶
</div>
```

Das Dropdown-Menü kann im EP einfach verändert werden, indem das Subject-Array verändert wird (A-Tag
einfügen, löschen, ändern). Aber: diese Anpassungen erfolgen **vor** dem Aufbau der Liste **einmalig**,
sind also für alle Zeilen/Datensätze der Liste unverändert. Meist reicht das aus, da ohnehin jeder
Button Feldinhalte in der Form `___feldname___` enthalten kann. Im obigen Beispiel ist das
`___id___`. Als Beispiel für eine Änderung könnte im delete-Button `id=___id___` durch
`___name___ [id=___id___]` ersetzt werden. 


## Datensatz-individuelle Aktions-Buttons

Aber Buttons an sich abhängig vom Datensatz einfügen oder entfernen will mit der Standardmethode nicht
gelingen. Hierzu sind ein paar Klimmzüge erforderlich und das Zusammenspiel des EPs YFORM_DATA_LIST_ACTION_BUTTONS
mit YFORM_DATA_LIST.

Das Beispiel zielt darauf ab, für Datensätze mit bestimmten Merkmalen das Löschen zu unterbinden.
Neben dem obligatorischen InUse-Test vor dem Löschen selbst, soll in der Liste der delete-Button
garnicht erst angeboten werden.

Der Lösungsweg besteht im Kern darin, die Spalte "Funktion", die das Aktions-Dropdown ausgibt, mit
einem Custom-Callback zu versehen. Die Callback-Funktion erhält als `$params['value']` das
Dropdown-HTML vor Austausch der Platzhalter. In Zeilen/Datensätzen mit entsprechendem Merkmal wird
das HTML `<li><a confirm ....></li>` entfernt und das verbleibende HTML zurückgegeben.

Die Crux ist, im HTML den richtigen Listeneintrag für den delete-Button zu finden. Das könnte über
REGEX oder eine andere Form der Mustererkennung erfolgen. 

Hier wenden wir einen anderen Trick an. Im EP YFORM_DATA_LIST_ACTION_BUTTONS
wird der Text des delete-Buttons in einer statischen Variablen der Datensatzklasse abgelegt. Der
zeitlich danach aufgerufene EP YFORM_DATA_LIST greift darauf zu und entfernt - wenn der Datensatz
zum Löschen gesperrt ist - den Text inkl. umgebendem `<li></li>` aus dem HTML.

(Achtung: Werbung für YOrm) Das Beispiel setzt auf einer eigenen YOrm-Datensatzklasse (`mytable`) auf,
die auf `rex_yform_manager_dataset` basiert.

Damit YForm die private Dataset-Klasse statt der Default-Klasse verwendet, muss sie dem System
z.B. in einer `boot.php` bekannt gemacht werden. Die beiden EPs werden mit den zugehörigen
statischen Methoden der Klasse gekoppelt:

```php
\rex_yform_manager_dataset::setModelClass('rex_mytable', mytable::class);

\rex_extension::register('YFORM_DATA_LIST','mytable::YFORM_DATA_LIST');
\rex_extension::register('YFORM_DATA_LIST_ACTION_BUTTONS','mytable::YFORM_DATA_LIST_ACTION_BUTTONS');
```

Die EPs rufen die Callback-Funktionen für jede Tabelle auf. Die Funktion soll aber konkret nur
für `mayclass` tätig werden. Die beiden Methoden prüfen ab, ob sie für "ihre" Tabelle aufgerufen
wurden und beenden, wenn sie nicht gemeint sind. 

```php
class mytable extends rex_yform_manager_dataset
{

    static $action_delete = null;

    static public function YFORM_DATA_LIST( \rex_extension_point $ep )
    {
        // kein Text gemerkt: dann keine Aktion erforderlich
        if( null === self::$action_delete ) return;

        // nur wenn diese Tabelle im Scope ist, sonst Abbruch
        $table_name = $ep->getParam('table')->getTableName();
        if( self::class != self::getModelClass( $table_name ) ) return;
        
        $list = $ep->getSubject();

        $toDelete = '<li>'.self::$action_delete.'</li>';
        $list->setColumnFormat(
            rex_i18n::msg('yform_function').' ',
            'custom',
            function( $params ) use( $toDelete ){
                return $params['list']->getValue('gesperrt') // hier die "ist-gesperrt"-Bedingung
                    ? str_replace($toDelete,'',$params['value'])
                    : $params['value'];
            }
        );
    }

    static public function YFORM_DATA_LIST_ACTION_BUTTONS( \rex_extension_point $ep )
    {
        // nur wenn diese Tabelle im Scope ist, sonst Abbruch
        $table_name = $ep->getParam('table')->getTableName();
        if( self::class != self::getModelClass( $table_name ) ) return;

        // Button-Code abspeichern für YFORM_DATA_LIST
        self::$action_delete = $ep->getSubject()['delete'] ?? null;
    }

}
```
