---
title: Nützliche YForm-Snippets
authors: [skerbis,isospin,netzproductions,pschuchmann,rotzek,alxndr-w,danspringer,christophboecker]
prio:
---

# Nützliche YForm-Snippets

- [Table Manager: Ansicht und Eingabe nach Userrechten einschränken](#rights)
- [Table Manager: Spalte ausblenden](#spalteausblenden)
- [Table Manager: Spalteninhalt vor Anzeige in Übersicht ändern](#Spalteninhalt)
- [Table Manager: Bilderspalte in Tabellenansicht (Bild statt Dateiname)](#ytbilder)
- [Table Manager: Extensionpoint / Listensortierung beeinflussen)](#ytlistsort)
- [Table Manager: Paginierung auch am Tabellenende](#yform_table_manager_paginierung)
- [Choice Feld Optionen holen](#Choicefieldoptionen)
- [YForm Menüpunkt für Redakteure ausblenden](#yform_menu)
- [Details zum Datensatz nach dem Erstellen erhalten](#yform_created)
- [Formular: Berechnung der Value Pools-Werte / Datenbank nach Absenden](#yform_valuepool)

>Hinweis: Teile dieses Abschnitts werden ggf. in die YFORM-Doku übernommen und können daher verschwinden. Sollte das gewünschte Snippet nicht mehr hier zu finden sein, bitte in die YFORM-Doku schauen.  


<a name="rights"></a>
## Table Manager: Ansicht und Eingabe nach Userrechten einschränken

Manchmal ist es erforder lich das Nutzer:innen nur festgelegte Felder oder Ansichten erhalten sollen. 
Das folgende Beispiel schränkt die Ansicht auf die Kategorie 2 einer Newstabelle ein und erlaubt nur die Erstellung der News der Kategorie 2. 
Zur Erkennung der Nutzer:innen greifen wir auf die Rolle in der Benutzerverwatltung zurück. 


```php
<?php

// Filter für Rolle 4 
// Es sollen nur Datensätze der Kategorie 2 angezeigt werden
// Es sollen nur Datensätze der Kategorie 2 erstellt werden können

// Prüfe ob wir uns in der Tabelle rex_news befinden
if (rex::isBackend() && rex::getUser() && rex_request('table_name') == 'rex_news') {
    // Setze Filter
    rex_extension::register('YFORM_MANAGER_DATA_EDIT_FILTER', function ($ep) {      
        $filter = $ep->getSubject();
        // Lese Rollen aus
        $role =  rex::getUser()->getValue('role');
        $roles = [];
        $roles =  array_map('intval', explode(',', $role));
        // hat User Rolle 4?
        if (in_array(4, $roles)) {
            // Setze Listen-Filter auf Kategorie 2
            $filter = ['cat' => '2'];
        }
        return $filter;
    });
    
    // Lege Felder und Werte Fest, die durch die User nicht bearbeitet werden können. 
    rex_extension::register('YFORM_MANAGER_DATA_EDIT_SET', function ($ep) {
        $editset = $ep->getSubject();
        $role =  rex::getUser()->getValue('role');
        $roles = [];
        $roles =  array_map('intval', explode(',', $role));
        if (in_array(4, $roles)) {
            // Lege die Kategrie fest, die für diese Rolle erlaubt ist
            // User kann die Kategorie nicht mehr wählen, sie ist festgelegt
            $editset = ['cat' => '2'];
        }
        return $editset;
    });
}
```



<a name="spalteausblenden"></a>
## Table Manager: Spalte ausblenden

Beim Einsatz einer YForm-Tabelle im eigenen AddOn können beliebige Spalten über den Einsatz des folgenden Extension points ausgeblendet werden (hier als Beispiel die Spalte ID):

```php

if (rex::isBackend())
{
	rex_extension::register("YFORM_DATA_LIST", function( $ep ) {  

	if ($ep->getParam("table")->getTableName()=="gewuenschte_tabelle"){
		$list = $ep->getSubject();

		$list->removeColumn("id");
		}
	});
}


``` 

<a name="Spalteninhalt"></a>
## Table Manager: Spalteninhalt vor Anzeige in Übersicht ändern

Beim Einsatz einer YForm-Tabelle im eigenen AddOn kann für beliebige Spalten vor der Anzeige in der Übersicht der Wert manipuliert und ggf. mit Werten aus derselben Tabellenzeile kombiniert werden. Konkret wird hier in der Anzeige der Spalte "title" der Wert der Spalte "name" angehängt.

```php 
if (rex::isBackend())
{
	rex_extension::register('YFORM_DATA_LIST', function( $ep ) {  

		if ($ep->getParam('table')->getTableName()=="gewuenschte_tabelle"){
			$list = $ep->getSubject();

			$list->setColumnFormat(
				'title', // Spalte, für die eine custom function aktiviert wird
				'custom', // festes Keyword
				function($a){ 

					// Generierung des auszugebenden Werts unter Einbeziehung beliebiger anderer Spalten
					// $a['value'] enthält den tatsächlichen Wert der Spalte
					// $a['list']->getValue('xyz') gibt den Wert einer anderen Spalte ("xyz) zurück.

					$neuer_wert=$a['value']." ".$a['list']->getValue('xyz');

					return $neuer_wert;
				}
			);
		}
	});
}
```

Das Snippet kommt am besten in die boot.php des project-AddOns.

<a name="ytbilder"></a>
## Table Manager: Bilderspalte in Tabellenansicht (Bild statt Dateiname)

Der Code kommt entweder in die boot Datei des Projekt AddOns oder in die Boot Datei des Theme Addons (wer damit arbeitet) oder in eine anderweitige Boot Datei.

```php 
// Es soll nur im Backend passieren und nur, wenn der table_name rex_test requestet wird (ggf. eigenen table_name verwenden)
if (rex::isBackend() && rex_request('table_name') == 'rex_test') {
    // am Extensionpoint YFORM_DATA_LIST einklinken
    rex_extension::register('YFORM_DATA_LIST', function( $ep ) {
        $fieldName = 'bild';
        // die Liste holen
        $list = $ep->getSubject();
        // die Spalte  soll mit einer custom Funktion umformatiert werden
        $list->setColumnFormat($fieldName, 'custom', function ($params ) {
            // das passiert hier. Ggf. eigenen Medientyp setzen.
            $mediaUrl = rex_media_manager::getUrl('rex_media_small',$params['list']->getValue($fieldName));
            return '<img src="'.$mediaUrl.'">';                
        });            
    });        
}
```

<a name="ytlistsort"></a>
## Table Manager: Extensionpoint | Listensortierung beeinflussen

Im Table Manager lässt sich _ein_ DB-Feld für die Sortierung der Backendausgabe festlegen. 
Manchmal ist eine komplexere Sortierung sinnvoll: `ORDER BY column1, column2`

Folgendes Snippet kann im Projekt Addon oder Theme Addon platziert werden und ermöglicht es die Sortierung zu erweitern:

### Ausführliches Beispiel

```php
if (
	rex::isBackend() && rex_addon::get('yform')->isAvailable() && rex_plugin::get('yform', 'manager')->isAvailable() && rex_request('table_name') == '<TABLE_NAME>'
) {
	rex_extension::register('YFORM_DATA_LIST_QUERY', function (rex_extension_point $ep) {

		// dont prevent sorting of other columns
		$manual_sort = rex_request('sort', 'string', '');
		if ($manual_sort) {
			return;
		}

		$query = $ep->getSubject();
		$alias = $query->getTableAlias();
		$query->resetOrderBy();
		$query->orderByRaw('`' . $alias . '`.<SOMETHING ELSE>', 'DESC');
		$ep->setSubject($query);
    
	}, rex_extension::LATE);
}

```
Einfach `<TABLE_NAME>` und `<SOMETHING ELSE>` wie gewünscht austauschen.

<a name="yform_table_manager_paginierung"></a>
## Table Manager: Paginierung auch am Tabellenende
In der boot.php des project-Addons oder wo es sonst passt:
```php
rex_yform_list::setFactoryClass(RexYformList::class);
```
Und im Lib-Verzeichnis diese Klasse:
```php
class RexYformList extends rex_yform_list
{
    /**
     * @return string
     */
    public function get()
    {
        return parent::get() . $this->getPagination();
    }
}
```


<a name="Choicefieldoptionen"></a>
### Choice Feld Optionen im Frontend verwenden

Mit dieser Funktion lassen sich die Optionen eines Choice Feldes auslesen. Zu übergebende Parameter sind der Name der Tabelle und der Name des Feldes.
```php
  function getYFormChoices(string $table_name, string $field_name) {

    if (empty($table_name)) {
      return rex_view::error('Bitte Parameter $table_name prüfen!');
    }

    if (empty($field_name)) {
      return rex_view::error('Bitte Parameter $field_name prüfen!');
    }

    $choice  = new rex_yform_value_choice();
    $options = $choice->getArrayFromString(rex_yform_manager_table::get($table_name)->getValueField($field_name)->getElement('choices'));
    $options = rex_i18n::translateArray($options);
    
    return $options;

  }

// Aufruf mit Tabellen-Prefix:
getYFormChoices('rex_table_name','field_name');

// Aufruf ohne Tabellen-Prefix: 
getYFormChoices(rex::getTable('table_name'),'field_name');

```


<a name="yform_menu"></a>
### YForm Menüpunkt für Redakteure ausblenden

Redakteure sehen einen Menüpunkt Yform, der jedoch nach Aufruf den Fehler wirft: Tabelle nicht gefunden. 
Dies ist ein Bug in YForm der sich bis Version 3.4.1 wie folgt beheben lässt. 

Diesen Code in die boot.php des Project-AddOns einsetzen: 

```php

if (( rex::isBackend() ) && rex::getUser() && ( !rex::getUser()->isAdmin()) ) {
rex_extension::register('PAGES_PREPARED', function (rex_extension_point $ep) {	
  $page = rex_be_controller::getPageObject('yform');
  $page->setHidden(true);
});
}

```
<a name="yform_created"></a>
### Details zum Datensatz nach dem Erstellen erhalten

Manchmal möchte man im Frontend im Nachgang noch Informationen zum erstellten Datensatz erhalten. Dieser Trick erfordert u.a. eine db-Action.

```php
$yform = new rex_yform();

// [...]
echo $yform->getForm();


if ($yform->getObjectparams('send') && !$yform->getObjectparams('warning')) {
    // Hier weitere Ausgabe außerhalb des Formulars durchführen
    dump($yform->getObjectparams('value_pool'));
}
```

Wichtig ist nur, dass man die Abfrage nach `getForm()` durchführt.

<a name="yform_valuepool"></a>
### Formular: Berechnung der Value Pools-Werte / Datenbank nach Absenden

 YForm Frage: wie kann ich beim Speichern eines Formulares den Wert für ein Feld berechnen und setzen, so dass es in die Datenbank gespeichert wird?

```php
$yform->setActionField('callback', [
    function (rex_yform_base_abstract $form) {
        $form->params['value_pool']['sql']['field_c'] = $form->params['value_pool']['sql']['field_a'] + $form->params['value_pool']['sql']['field_b'];
    }
]);
```
