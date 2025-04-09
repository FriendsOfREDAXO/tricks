---
title: "YForm Tablemanager: Zuletzt angelegten Datensatz aktualisieren"
authors: [omphteliba]
prio:
---


# YForm Tablemanager: Zuletzt angelegten Datensatz aktualisieren

Um dem Datensatz, der via YForm und Tabelmanager neu erzeugt wurde, noch etwas hinzuzufügen (z.B. Status einer Fremd-API Aktion) will man die ID des just erstellen Datensatzes haben. 

## Extensionpoint 'YFORM_SAVED' erweitern
```php
rex_extension::register('YFORM_SAVED', ['klasse', 'methode'], rex_extension::LATE);
```
Kann irgendwo stehen; geht direkt in dem Modul Output oder im `boot.php` eines AddOns. Muss nur vor dieser Zeile ausgeführt werden:
```php
echo $yform->getForm();
```
## Methode deklarieren
Egal wohin, muss nur erreichbar sein von `rex_extension::register`.
```php
class klasse{
	public function methode($ep) {
   		$lastId = $ep->getSubject()->getLastId();
   		$table  = $ep->getParam('table');

   		\rex::setProperty('lastId',$lastId);
   		\rex::setProperty('table',$table);

   		return TRUE;
	}
}
```

## Datenbank aktualisieren
Im gleichen Modul, in dem auch die yForm ausgegeben wird, aber nach `echo $yform->getForm();`.
```php
$update = rex_sql::factory();
$table  = rex::getProperty('table'); // der Tabellenname, nur zur Sicherheit
$lastId = rex::getProperty('lastId'); // die gesuchte Datensatz ID
$update->setDebug(FALSE);
$update->setQuery('UPDATE ' . $table . ' SET bla="foo" WHERE ID = ' . $lastId);
```
