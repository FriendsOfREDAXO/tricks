---
title: Nützliche YForm-Snippets
authors: [isospin,netzproductions,pschuchmann,rotzek]
prio:
---

# Nützliche YForm-Snippets

- [Table Manager: Spalte ausblenden](#spalteausblenden)
- [Table Manager: Spalteninhalt vor Anzeige in Übersicht ändern](#Spalteninhalt)
- [Table Manager: Bilderspalte in Tabellenansicht (Bild statt Dateiname)](#ytbilder)
- [Table Manager: Extensionpoint / Listensortierung beeinflussen)](#ytlistsort)
- [Choice Feld Optionen holen](#Choicefieldoptionen)
- [YFORM-Menüpunkt ausblenden bei Redakteuren](#yform_menu)

>Hinweis: Teile dieses Abschnitts werden ggf. in die YFORM-Doku übernommen und können daher verschwinden. Sollte das gewünschte Snippet nicht mehr hier zu finden sein, bitte in die YFORM-Doku schauen.  

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
	});
});

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
        // die Liste holen
        $list = $ep->getSubject();
        // die Spalte bild (ggf. eigenen Spaltennamen verwenden) soll mit einer custom Funktion umformatiert werden
        $list->setColumnFormat('bild', 'custom', function ($params ) {
            // das passiert hier. Ggf. eigenen Medientyp setzen.
            return '<img src="/images/rex_medialistbutton_preview/'.$params['list']->getValue('bild').'">';                
        });            
    });        
}
```

<a name="ytlistsort"></a>
## Table Manager: Extensionpoint | Listensortierung beeinflussen

Im Table Manager lässt sich _ein_ DB-Feld für die Sortierung der Backendausgabe festlegen. 
Manchmal ist eine komplexere Sortierung sinnvoll: `ORDER BY column1, column2`

>Hinweis: Das geht nur, solange keine andere Spalte zum Sortieren ausgewählt wird. Will man eine andere Spalte zum sortieren auswählen wirft der EP nicht das passende Query aus.

Folgendes Snippet kann im Projekt Addon oder Theme Addon platziert werden und ermöglicht es die Sortierung zu erweitern:

### Ausführliches Beispiel

```php
if(rex::isBackend() && rex_addon::get('yform')->isAvailable() && rex_plugin::get('yform', 'manager')->isAvailable() &&
   rex_be_controller::getCurrentPage() == 'yform/manager/data_edit' && rex_request('table_name') == '<TABLE_NAME>') {
	rex_extension::register('YFORM_DATA_LIST_SQL', function(rex_extension_point $ep){
		$sortField = $ep->getParam('table')->getSortFieldName();
		$sortOrder = $ep->getParam('table')->getSortOrderName();
		$fields = $ep->getParam('table')->getFields();

		// dont prevent sorting of other columns
		if(rex_request("sort") != "" && rex_request("sort") != $sortField) {
			return;
		}

		$subject = preg_replace(
			"@ORDER BY `id` ASC$@i", "ORDER BY <SOMETHING ELSE>",
			$ep->getSubject()
		);

		$ep->setSubject($subject);
	}, rex_extension::LATE);
}
```
`<TABLE_NAME>` und `<SOMETHING ELSE>` austauschen und  darauf achten das in der Tabellen Konfiguration die Standardsortierung auf `id` und die Richtung auf  `aufsteigend` steht.


### Einfaches Beispiel zur Verwendung des EP

```php
rex_extension::register('YFORM_DATA_LIST_SQL', function ($ep) {
  $params  = $ep->getParams(); // EP Params holen
  $subject = $ep->getSubject(); // EP Subject (SQL) holen
  // dump($subject); //SQL der rex_list ausgeben lassen

  if ($params['table'] == rex::getTable('my_table')) {

    $sql = 'my_sql_query'; // SQL neu sortieren

    $subject = $ep->setSubject($sql); // neue Liste setzen

  }

  return $subject; // neue Liste zurück geben

});
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
    $options = $choice->getArrayFromString((rex_yform_manager_table::get(rex::getTable($table_name))->getValueField($field_name)->getElement('choices')));
    $options = rex_i18n::translateArray($options);
    
    return $options;

  }

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

```
