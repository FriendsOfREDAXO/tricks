# Artikeleigenschaften / Kategorieeigenschaften

Die Sammelstelle für Artikel- und Kategorie-Tricks. Anwendungen entsprechend https://redaxo.org/api/master/class-rex_article.html 

- Artikel
-   [Autoren auslesen](#autoren)


<a name="autoren"></a>
## Autoren auslesen

In REDAXO werden der ursprüngliche Autor (CreateUser) und die Person die den Artikel zuletzt aktualisiert hat (UpdateUser) im Artikel hinterlegt. 
Möchte man diese auslesen erhält man deren Logins wie folgt: 

### 1. CreateUser des aktuellen Artikels

```php
$author = rex_article::getCurrent()->getCreateUser();
```

### 2. CreateUser eines bestimmten Arikels

```php
$author = rex_article::get($id_des_artikels)->getCreateUser();
```

### 3. UpdateUser des aktuellen Arikels

```php
$author = rex_article::getCurrent()->getUpdateUser();
```

### 4. UpdateUser eines bestimmten Arikels

```php
$author = get($id_des_artikels)->getUpdateUser();
```


### Function zum auslesen des Benutzernamens

Meist möchte man nicht die Logins der Autorenm, sondern den vollständigen in der Benutzerverwaltung hinterlegten Namen des Autors. 
Hierzu bietet sich folgende PHP-Function an um je Autor-Typ den Namen auszulesen. Wird die Function oft benötigt, bietet es sich an diese zentral im Theme-AddOn oder Projekt-AddOn abzulgen. Der hier gezeigte Code zeigt ein Beispiel für die Verwendung innerhalb eines Moduls oder Templates: 

```php 
if (!function_exists('getAuthor'))
{
   function getAuthor($author){
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

`$author` ermitteln mit einem der vorherigen Codes aus 1.- 4., dann kann man den Benutzernamen wie folgt ermitteln: 
 
```php
$username = getAuthor($author);
```




