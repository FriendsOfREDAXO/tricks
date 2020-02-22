---
title: Weiterführende Tipps nach Konvertierung von REDAXO 4.x zu 5
authors: [skerbis,alexplusde]
prio:
--- 

# Weiterführende Tipps nach Konvertierung von REDAXO 4.x zu 5

## Fehler erkennen und Beseitigen

Durch Verwendung des Cache Warm-Up AddOns ist es nicht nötig die Website "abzusurfen" um eventuelle Fehler zu finden. Wenn Cache-Warm-Up einen fehler findet bricht es ab und bietet an sich den Fehler anzuschauen. Man erhält dann die gewohnte Whoops-Meldung. 

## Addons und Module

Einige AddOns wurden bislang nicht nach REDAXO 5 überführt und stehen nicht mehr zur Verfügung. Nachfolgend listen wir einen Überblick darüber welche AddOns gleiche oder ähnliche Funktionen liefern: 

### SEO42
Nach der Konvertierung sollten sämtliche SEO42:: Codes in den Templates und Modulen entfernt werden. YConverter wird diese nicht konvertieren, so dass dies manuell durchgeführt werden muss.  

SEO42 kann durch **YRewrite** in Kombination mit **YRewrite Scheme** oder in Kombination mit **XCore** ersetzt werden. 

X-CORE ist vom selben Entwickler wie SEO42, das viele Funktionalitäten von SEO42 bereitstellt. 
Meist reicht hier ein Ersetzen der `seo42::` - Aurufe durch die entsprechenden `rexx::` Aufrufe um wieder die gewünschte Funktionalität zu erreichen. 

### Slice on / off

Dies Funktion wird in REDAXO 5 vom Addon `bloecks` übernommen 
* `bloecks` installieren und unter Addons das bloecks-plugin `status` installieren.
* Über die Datenbank (PHPMyAdmin oder REDAXO 5-Addon `adminer`) die alten Werte kopieren: `UPDATE rex_article_slice SET status = a356_is_online`
* Anschließend kann das Feld „a356_is_online“ in der Tabelle `rex_article_slice` entfernt werden


### Editoren
Die in REDAXO 4 bekannten Text-Editoren finden sich auch im REDAXO 5-Installer. 

- Für die Verwendung von **Textile oder Markdown** steht das **Markitup-AddOn** zur Verfügung.
- Als WYSIWYG-Editoren bieten sich **CKEDITOR 4, CKE5, Redactor2** und **TinyMCE** an. 

### Suchmaschine
Nutzer der Suchmaschine xsearch und rex_search finden mit search_it einen geeigneten Ersatz. Wer von REX_Search kommt, muss nur den Aufruf der PHP Class ändern, dann funktioniert die Suche meist wie gewohnt. Es empfieht sich jedoch, im Anschluss die Dokumentation zu konsultieren, da es dort einige wichtige Hinweise zur Code-Anpassung hinsichtlich Sicherheit gibt. 

### Formulare

Der Nachfolger von **XForm** heißt in REDAXO 5 **YForm**. Die Tabellen und Einstellungen werden bei der xform-Konvertierung im YConverter übernommen und importiert. Nutzer von **do form!**, finden bei [GitHub](https://github.com/skerbis/doform-6) einen Nachfolger. Wenn nur wenige Formulare verwendet werden, sollte man über einen Umbau nach YForm nachdenken.  

### Multiuploads

Als Lösung und Ersatz des Multiuploader-AddOn stehen die AddOns ***uploader*** und **multiuploader** zur Verfügung. 

### Benutzer Passwörter in REDAXO 5 importieren
- **WICHTIG: rex_user / rex_xcom_user Tabelle zu Beginn sichern!** 
- **WICHTIG: Alte Passwortverschlüsselung auf Typ prüfen**

Passwörter aus REDAXO 4 können mit folgendem Snippet REDAXO 5 kompatibel gemacht werden.

#### Schritt 1: Tabelle
Folgende Schritte sind notwendig um alte Passwörter aus REDAXO 4 auch in REDAXO 5 verwenden zu können.

- Zunächst wird der Export der `rex_user`, bzw. `rex_xcom_user`, Datenbank aus der REDAXO 4 Instanz benötigt. Der könnte beispielsweise so aussehen:

```mysql
INSERT INTO `rex_user` (`user_id`, `name`, `description`, `login`, `psw`, `status`, `rights`, `login_tries`, `createuser`, `updateuser`, `createdate`, `updatedate`, `lasttrydate`, `session_id`) VALUES
(2, 'REDAXO 4 Redakteur', '', 'redaktion', 'f616d7c4c54614b51f5d0bfa877e1a3ae63d31e3', '1', '#admin[]#clang[0]#', 0, 'admin', '', 1574436072, 0, 0, '');
```

  - Das Feld `rights` kann entfernt werden. REDAXO 5 verwendet nun Rollen um die Rechte der Nutzer zu verwalten.
  - Das Feld `user_id` heißt in REDAXO 5 nun `id` und ist unique. Sollte eine Id bereits vorhanden sein, wird der Insert nicht klappen. Entweder wird die Id selbst vergeben oder entfernt.
  - Das Feld `psw` heißt in REDAXO 5 nun `password`
  - Die Felder `createdate`, `updatedate`, `lasttrydate` sind nun `datetime` Felder und müssen von Unix Timestamp umgewandelt werden.
  - `session_id` sollte entfernt werden.
  
Beispiel Insert:
```mysql
INSERT INTO `rex_user` (`id`, `name`, `description`, `login`, `password`, `status`, `login_tries`, `createuser`, `updateuser`, `createdate`, `updatedate`, `lasttrydate`) VALUES
(2, 'REDAXO 4 Redakteur', '', 'redaktion', 'f616d7c4c54614b51f5d0bfa877e1a3ae63d31e3', '1', 0, 'admin', '', FROM_UNIXTIME(1574436072), 0, 0);
```
Beispiel minimaler Insert:
```mysql
INSERT INTO `rex_user` (`login`, `password`) VALUES
('redaktion', 'f616d7c4c54614b51f5d0bfa877e1a3ae63d31e3');
```

Der Insert kann jetzt in die REDAXO 5 Tabelle eingespielt werden. Die Ids der neuen Datensätze sollte man sich merken, da sie später für das Update der Passwörter gebraucht werden.

#### Schritt 2: Template / Module
- `$users` **muss** in der setWhere() Funktion beschränkt werden! Es dürfen nur die Ids mit REDAXO 4 Passwörtern selektiert werden, andernfalls werden bereits korrekte Passwörter erneut gehasht und funktionieren nicht mehr.
- Das Snippet darf nur einmal aufgerufen werden, innerhalb eines Modules oder Templates.
- Sollten bereits gehashte als auch ungehashte Passwörter vorlieren, empfiehlt es sich `$users` bereits entsprechend zu selektieren für den nächsten Schritt.


```php
<?php
$users = rex_sql::factory()
    ->setDebug(true)
    ->setTable(rex::getTable('user'))
     //REDAXO 4 Redakteur aus dem Beispiel wurde mit der Id 2 in die Tabelle rex_user importiert
     //natürlich sind auch mehrere Datensätze gleichzeitig selektierbar, es dürfen allerdings nur die importierten REDAXO 4 User sein!
    ->setWhere(['id' => 2])
    ->select();
```
Sobald `$users` alle zu migrierenden REDAXO 4 Accounts enthält, kann folgendes Script in einem Modul oder Template **einmalig** ausgeführt werden. Alte Passwörter aus REDAXO 4 werden dadurch umgewandelt. Sollten die Passwörter nicht verschlüsselt vorliegen, muss mittels der Umstellung der Variable `$isPreHashed = false;` eine Vorverschlüsselung vorgenommen werden.
```php

$isPreHashed = true;
foreach ($users as $user) {
    $sql = rex_sql::factory()
        ->setDebug(true)
        ->setTable(rex::getTable('user'))
        ->setWhere(['login' => $user->getValue('login')])
        ->setValue('password', rex_login::passwordHash($user->getValue('password'), $isPreHashed))
        ->update();
}

```
