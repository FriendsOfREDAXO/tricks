---
title: YForm-Datensätze klonen ("Add" mit Vorbelegung)
authors: [christophboecker]
prio:
---

# YForm-Datensätze klonen ("Add" mit Vorbelegung)

Es kann recht lästig sein, wenn komplexe Datensätze immer wieder ähnlich zu einem anderen erfasst werden müssen. Die
Übernahme von Inhalten aus bestehenden Datensätzen ist in YForm wie in rex_form nicht per se
vorgesehen.

In diesem Beitrag wird ein Weg aufgezeigt, wie neue Datensätze aus bestehenden geklont werden.


* [1. Das Problem beim Klonen](#problem)
* [2. Die zwei Varianten des Klonens](#variante)
* [2.1 Datensatz kopieren, dann editieren](#variante-a)
* [2.2 Leeren Datensatz vorbefüllen und editieren](#variante-b)
* [3. Eine einfache Lösung für einfache Tabellen](#einfach)
* [4. Die Lösung für komplexe Relationen-Formulare](#yorm)
* [4.1 Die Datenliste erweitern: Spalte "Klonen"](#ep)
* [4.2 Den Klon-Dataset bereitstellen (YOrm)](#dataset)
* [4.3 Die Tabellen auf die neue Dataset-Klasse umleiten](#boot)
* [4.4 Extension-Points beim Klonen](#ep-mismatch)
* [**Warnung**](#warnung)

<a name="problem"></a>
## 1. Das Problem beim Klonen   

In YForm ist es nicht unüblich, über den Datentyp `be_manager_relation` verknüpfte Daten in und aus
anderen Tabellen einzubeziehen. Alle Varianten, die lediglich Referenzen (einzelne Id oder komma-separierte Liste)
in der Haupttabelle einfügen, sind zu unkritisch, da die Daten Teil der Haupttabelle sind.

Kniffelig sind Relationen, die die Sätze der anderen Tabelle als Relation verknüpfen.
In dem Fall findet sich innerhalb des generierten HTML entweder eine Referenz auf einen vorhandenen
Datensatz (z.B. bei n:m-Relationen) oder gleich ganze Datensätze (Variante "inline") mit der zugehörigen id 
als "Hidden Input".


<a name="variante"></a>
## 2. Die zwei Varianten des Klonens

<a name="variante-a"></a>
### 2.1 Datensatz kopieren, dann editieren

In der Variante wird der Datensatz und ggf. Einträge in Relationentabellen dupliziert. Anschließend stehen zwei
inhaltlich identische Datensätze in der Tabelle und ggf. auch in Relationentabellen.

* Das Verfahren kann relativ leicht mit einem passenden Script für die Tabelle realisiert werden (z.B. im ExtensionPoint `YFORM_DATA_ADD`)
* Da es dabei zu doppelten Schlüsselwerten kommen kann, die im Falle eines "Unique"-Schlüssels kollidieren,
ist es nicht ohne Risiko. 
* Nach dem Dulizieren muss das Editieren als zweiter Schritt aufgerufen werden; (z.B. per Redirect)
* Wird der Satz doch nicht benötigt (Abbruch) muss man unbedingt daran denken, den Datensatz auch wieder zu löschen!

<a name="variante-b"></a>
### 2.2 Leeren Datensatz vorbefüllen und editieren

Das zweite Verfahren basiert auf der Idee, einen neuen Datensatz anzulegen ("add"), dabei aber die
Daten eines Referenzsatzes komplett zu übernehmen als Vorbefüllung des Formulars.

* Doppelte Schlüsselwerte werden beim Speichern (idealerweise über einen Validator) erkannt und im Formular mitgeteilt
* Ein Abbruch tut nicht weh, da noch keine Daten gespeichert sind.
* Look and Feel wie bei einem normalen "Add".
* Problem: Relationendatensätze in einer verknüpften Tabelle können nicht einfach so mitkopiert werden. 

> Im weiteren Verlauf wird nur diese Idde weiterverfolgt.


<a name="einfach"></a>
## 3. Eine einfache Lösung für einfache Tabellen

Ein einfacher Fall liegt dann vor, wenn Tabellen ohne inline-Relationen oder n:m-Relationentabellen auskommen.
Die Referenzen auf die weiteren Tabellen speichert `be_manager_relation` direkt im Datensatz der Haupttabelle,
sie werden also einfach mitkopiert.

Es reicht aus, die normale Add-URL um einen Parameter "data_id=xyz" zu ergänzen. xyz ist die Id des
zu klonenden Datensatzes. YForm wird damit gewissermaßen überlistet. Der vorhandene Datensatz wird in das Formular
geladen, trotzdem läuft das Add-Prozedere ab. Das klappt ähnlich auch mit rex_list/rex_form. 

Alternativ wird in der Edit-URL der Parameter `func=`auf "add" gesetzt, wie im Beispiel.

Die Lösung kann über den EP `YFORM_DATA_LIST` aktiviert werden. Nach der ersten Spalte (Add/Edit) wird die Klon-Spalte eingefügt.

```php
\rex_extension::register('YFORM_DATA_LIST',
    function( \rex_extension_point $ep )
    {
        $rex_list = $ep->getSubject();

        $name = $rex_list->getColumnNames()[0];
        if( substr($name,0,27) != '<a href="index.php?func=add' ) return;

        $rex_list->addColumn('clone', '<i class="fa fa-clone"></i>', 1);
        $rex_list->setColumnLayout('clone', ['<th></th>', '<td class="rex-table-icon">###VALUE###</td>']);
        $params = $rex_list->getColumnParams($name);
        $params['func'] = 'add';
        $rex_list->setColumnParams('clone', $params );
    }
);
```

Sobald aber andere Relationen inline eingebunden sind, bleibt der geklonte Inhalt unvollständig, da die
Relationendaten nicht geladen werden.

<a name="yorm"></a>
## 4. Die Lösung für komplexe Relationen-Formulare 

In diesem Fall kann man über YOrm zum Ziel kommen. Der YOrm-Kosmos stellt eine Klasse `rex_yform_manager_dataset`
zur Verfügung, die innerhalb von YForm der Datensatzverwaltung dient. Ein Formular wird mit der Methode
```php
$datensatz->executeForm( $yform, $afterFieldsExecuted )
```
ausgeführt. Das umfasst einerseits den Aufbau des gesamten HTML für das Formular, aber auch die
Nachbearbeitung des abgeschickten Formulars. Der Table_Manager ruft `executeForm`  auf und gibt auch
noch eine Callback-Funktion `$afterFieldsExecuted` mit, die nach allen anderen ExtensionPoints und 
kurz vor dem Aufbau des finalen HTML ausgeführt wird.

An dieser Stelle greifen wir in den Ablauf ein.

* Eine von `rex_yform_manager_dataset` abgeleitete Klasse überschreibt die Methode `executeForm` und
schleust den Code für das Klonen ein. Ziel:
    * Der Datensatz wird mit allen Elementen inkl. verlinkten (inline) Datensätzen vorbereitet.
    * Aus dem Formular werden die Referenzen auf die existenten Datensätze entfernt, die Daten können
      also beim Speichern nicht **zurück**geschrieben werden.
    * Kleine weitere Anpassungen, damit das Formular vom "Edit-Formular" zum "Add-Formular" wird.
* Die Klasse wird allen Tabellen, die die Klon-Fuktionalität erhalten sollen, als Datensatz-Klasse zugewiesen
* Via Extension-Point `YFORM_DATA_LIST` wird eine Aktionsspalte "Klonen" eingefügt, die je Datensatz
den Klonvorgang startet.

<a name="ep"></a>
### 4.1 Die Datenliste erweitern: Spalte "Klonen"

I.d.R. ist die erste Spalte der Tabelle mit dem "+"-Symbol im Header für "Neuer Datensatz" und in den
Zeilen mit einem Formularsymbol für "Datensatz editieren" versehen. 

Wir erzeugen eine neue zweite Spalte mit einen Duplizier-Symbol und packen darauf den Editier-Link
der ersten Spalte, aber ergänzt um den Parameter `clone=1`:

```php
\rex_extension::register('YFORM_DATA_LIST',
    function( \rex_extension_point $ep )
    {
        $rex_list = $ep->getSubject();

        $name = $rex_list->getColumnNames()[0];
        if( substr($name,0,27) != '<a href="index.php?func=add' ) return;

        $rex_list->addColumn('clone', '<i class="rex-icon rex-icon-duplicate"></i>', 1);
        $rex_list->setColumnLayout('clone', ['<th></th>', '<td class="rex-table-icon">###VALUE###</td>']);
        $params = $rex_list->getColumnParams($name);
        $params['clone'] = 1;
        $rex_list->setColumnParams('clone', $params );
    }
);

```
Klickt man diesen Link an, wird der Datensatz zunächst wie bei jedem Editiervorgang behandelt.
Dann übernimmt der Klon-Dataset.


<a name="dataset"></a>
### 4.2 Den Klon-Dataset bereitstellen  
 
In der Methode `executeForm` wird zuerst geprüft, ob der URL-Parameter `clone=1` gesetzt ist. Wenn
nein wird ganz normal `parent::executeForm` abgearbeitet.

Im anderen Fall wird eine neue Callback-Funktion an Stelle von `$afterFieldsExecuted` vorbereitet,
die folgende Aktionen ausführt:

**Da es keinen anderen Einstieg gibt, um den Formulartitel von "Datensatz editieren" auf "Datensatz anlegen" zu ändern, wird die
i18n-Übersetzung manipuliert:**
```php
rex_i18n::addMsg('yform_editdata','Datensatz klonen [Original: {0}]');
```
Idealerweise wird auch der neue Text über .lang-Dateien zur Verfügung gestellt.

**Damit das Formular beim Speichern auch wirklich als "Add"-Formular arbeitet, werden die als
"Hidden Input" vorgesehenen Werte verändert. Die Datensatznummer wird entfernt, der Funktionstyp
von "edit" auf "add" gesetzt**
```php
$yform->objparams['form_hiddenfields']['func'] = 'add';
unset( $yform->objparams['form_hiddenfields']['data_id'] );
```

**In den Value-Feldern des Formulars, deren HTML bereits generiert ist (`$yform->objparams['form_output'][$k]`),
wird für be_manager_relation-Felder des Typs 5 (inline) ebenfalls der "Hidden Input" mit der Satznummer entfernt.**
Das ist hier etwas komplizierter, da das HTML bereits generiert ist. Der Input-Tag wird komplett entfernt.
```php
if( $v instanceof rex_yform_value_be_manager_relation && 5 == $v->getElement('type') )
{
    $fieldName = preg_quote ( $v->getFieldName() );
    $pattern = '/<input type="hidden" name="'.$fieldName.'(\[\d+\])*\[id\]" value="\d+" \/>/';
    $yform->objparams['form_output'][$k] = preg_replace( $pattern, '', $yform->objparams['form_output'][$k] );
}
```

Auch die Submit-Button werden noch überarbeitet, um die Add-spezifischen Texte auszugeben.
```php
$yform->objparams['form_output'][$k] = str_replace(
    [ rex_i18n::msg('yform_save').'</button', rex_i18n::msg('yform_save_apply').'</button' ],
    [ rex_i18n::msg('yform_add').'</button', rex_i18n::msg('yform_add_apply').'</button' ],
    $yform->objparams['form_output'][$k]
);
```

Zum Schluß ruft die neue Callback-Funktion die ursprüngliche auf.

Hier der komplette Code:

```php
class klon_dataset extends \rex_yform_manager_dataset
{

    public function executeForm(rex_yform $yform, callable $afterFieldsExecuted = null)
    {
        // clone angefordert? Wenn nein: normale Bearbeitung
        if( 1 !== rex_request('clone','integer',0) )
        {
            return parent::executeForm($yform, $afterFieldsExecuted);
        }

        // clone angefordert! afterFieldsExecuted wird durch ein eigenes Callback ersetzt,
        
        $callback = function( rex_yform $yform ) use ( $afterFieldsExecuted )
        {
            // Titelzeile frisieren: mangels EP wird die i18n-Tabelle geändert. 
            rex_i18n::addMsg('yform_editdata','Datensatz klonen [Original: {0}]');

            // Für das Formular an sich: Auf "Add" umschalten, indem func auf "add" gesetzt und 
            // die Datensatznummer entfernt wird.
            $yform->objparams['form_hiddenfields']['func'] = 'add';
            unset( $yform->objparams['form_hiddenfields']['data_id'] );

            // Änderungen in den Values: jeweils den vorgenerierten HTML-Code ändern 
            foreach( $yform->objparams['values'] as $k=>$v )
            {
                // Submit-Buttons von "Edit" auf "Add" zurückstellen
                if( $v instanceof rex_yform_value_submit )
                {
                    $yform->objparams['form_output'][$k] = str_replace(
                        [ rex_i18n::msg('yform_save').'</button', rex_i18n::msg('yform_save_apply').'</button' ],
                        [ rex_i18n::msg('yform_add').'</button', rex_i18n::msg('yform_add_apply').'</button' ],
                        $yform->objparams['form_output'][$k]
                    );
                    continue;
                }

                // im Feldtyp be_manager_relation / Typ 5 (=inline) ebenfalls die hidden-inputs mit
                // der Datensatz-ID der verbundenen Sätze entfernen
                // Nur "inline" ist problematisch;
                if( $v instanceof rex_yform_value_be_manager_relation && 5 == $v->getElement('type') )
                {
                    $fieldName = preg_quote ( $v->getFieldName() );
                    $pattern = '/<input type="hidden" name="'.$fieldName.'(\[\d+\])*\[id\]" value="\d+" \/>/';
                    $yform->objparams['form_output'][$k] = preg_replace( $pattern, '', $yform->objparams['form_output'][$k] );
                }
            }
            
            call_user_func( $afterFieldsExecuted, $yform );
        };
        
        return parent::executeForm($yform, $callback);
    }

}
```

<a name="boot"></a>
### 4.3 Die Tabellen auf die neue Dataset-Klasse umleiten

Zu guter Letzt muss für alle Tabellen, die den Klon-Mechanismus nutzen sollen, die neue Dataset-Klasse als
Standard zugewiesen werden. Das kann z.B. in einer `boot.php` geschehen:
```php
rex_yform_manager_dataset::setModelClass('rex_my_yform_table', klon_dataset::class);
```

<a name="ep-mismatch"></a>
### 4.4 Extension-Points beim Klonen

Da hier ein Editier-Prozedere nachträglich in ein Hinzufügen-Prozedere umgebaut wird, werden die
ExtensionsPoints nicht wie zu erwarten aufgerufen.

Beim Aufbau des Formulars nach Klick auf den Klon-Button, wird der EP `YFORM_DATA_UPDATE` aufgerufen und nicht
`YFORM_DATA_ADD`. Daher muss man ggf. im EP abfragen, ob der URL-Parameter `clone=1` gesetzt ist.

Beim Speichern des Datensatzes greifen wieder die regulären EPs `YFORM_DATA_ADD` und `YFORM_DATA_ADDED`.


<a name="warnung"></a>
# Warnung 

Verfahren wie

* i18n-Einträge ändern
* HTML umbauen
* das große YForm-Array (hier als `$yform->objparams`) nutzen/verändern 

sind immer riskant, da Seiteneffekte nie auszuschließen sind und das generierte HTML auch schon mal
anders aussehen kann als gedacht, z.B. wenn ein anderes Template/Fragment zum Einsatz kommt.

Es besteht immer auch das Risiko, das sich in YForm etwas ändert - und sei es nur marginal. Für "Hacks"
wie hier beschreben gibt es keinen Bestandsschutz gegen Breaking-Changes!

Für das Verfahren wurden mehrere be_manager-relation-Varianten untersucht, aber lange nicht alle
theoretisch denkbaren. Untersucht wurde:
* __Tabelle A hat eine Relation "inline(multiple 1-n)" auf Tabelle B__:
Der Fall wird wie oben beschrieben behandelt.
* __Tabelle A hat eine n:m-Beziehung zu Tabelle B über eine Relationen-Tabelle "popup (multiple)"__:
Der Fall hat sich als unkritisch erwiesen.
* __Diverse einfache Varianten ohne Relationen-Tabelle, die ihre Daten direkt in der Haupttabelle ablegen__:
Alle unkritisch.

Nicht erfasst sind "private" Datentypen (nicht mit YForm bereitgestellt), die Relationen aufbauen und verwalten. Hier ist Eigeninitiative nötig.

