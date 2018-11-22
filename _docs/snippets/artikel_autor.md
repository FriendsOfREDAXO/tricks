---
title: Artikel-Autor auslesen
authors: []
prio:
---

# Artikel-Autor auslesen

In REDAXO werden der ursprüngliche Autor (CreateUser) und die Person die den Artikel zuletzt aktualisiert hat (UpdateUser) im Artikel hinterlegt. Möchte man diese auslesen, erhält man deren Logins wie folgt: 

## User ermitteln

**geeignete Methoden:** `->getCreateUser()` oder  `->getUpdateUser()`

Für den aktuellen Artikel

`$author = rex_article::getCurrent()->`**Methode();**

Für einen bestimmten Artikel 

`$author = rex_article::get($artikelID)->`**Methode();**

## Funktion zum Auslesen des Benutzernamens

Meist möchte man nicht die Logins der Autoren, sondern den vollständigen in der Benutzerverwaltung hinterlegten Namen des Autors. Hierzu bietet sich folgende PHP-Function an, um je Autor-Typ den Namen auszulesen. Wird die Function oft benötigt, bietet es sich an, diese zentral im Theme-AddOn oder Project-AddOn abzulegen. Der hier gezeigte Code zeigt ein Beispiel für die Verwendung innerhalb eines Moduls oder Templates: 

```php 
if (!function_exists('getAuthor')) {

  function getAuthor($author) {

    // Neue rex_sql Instanz
    $user_sql = rex_sql::factory(); 

    // aus der sql-DB den Namen des Nutzers auslesen
    $user_sql->setQuery("SELECT name FROM " . rex::getTable('user') . " WHERE login = :login",  array(":login" => $art_author)); 

    // Übergabe
    return rex_escape($user_sql->getValue('name')); 
  }
}
```

**Aufruf**

`$author` ermitteln mit einem der vorherigen Codes, dann kann man den Benutzernamen wie folgt ermitteln: 
 
```php
$username = getAuthor($author);
```
