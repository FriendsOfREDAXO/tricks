---
title: Geschütze Dateien mit YCom - per Template
authors: []
prio:
---

# Geschütze Dateien mit YCom - per Template

### Wie kann man Dateien in Verbindung mit YCom (Community Addon) einfach schützen?
Da Redaxo aktuell nur einen Medienordner hat und so von außen alle Dateien in diesem Ordner öffentlich zugänglich sind, benötigt man eine Lösung, die den Dateiaufruf überprüft und entscheidet ob es sich um eine geschützte Datei oder einer öffentlichen Datei handelt. 

Hier verwenden wir eine Rewrite-Direktive und ein Template um es zu realisieren.  Dateien, die in einer festgelegten Medienpool-**Hauptkategorie** und deren Unterkategorien im Medienpool liegen, können so vor unerlaubtem Zugriff geschützt werden. 

----------
**Achtung**
Diese Lösung, schützt nur Dateien die über /media/dateiname.xyz und über /index.php?fileName=dateiname.xyz aufgerufen werden. Eine Ausweitung auf z.B: Mediamanager Urls ist über einen entsprechenden Effekt denkbar.

----------
### Voraussetzungen
Damit dieser Trick funktioniert müssen zunächst einige Vorbereitungen getroffen werden.

#### 1. (optional) Nutzergruppen erstellen
Im Backend müssen bei den Gruppen einzelne Nutzergruppen angelegt werden. Die Nutzergruppen müssen dann den einzelnen nutzern zugewiesen werden - diese Zuweisung erfolgt über das Nutzerfeld ```ycom_groups```.

#### 2. Meta Infos anlegen
Über das Meta Infos Addon werden zwei Metafelder für Medien angelegt:

```
Spaltenname : ycom_users
Feldbezeichnung : translate:ycom_user
Feldtyp : select
Parameter : SELECT email AS label, id FROM rex_ycom_user
Feldattribute : multiple="multiple"
```

_bei "Nur in folgenden Kategorien verfügbar" noch die festgelegte Medienpool-Kategorien der geschützten Dateien angeben_

Wenn Benutzergruppen verwendet werden, sollte noch das folgende Metafeld angelegt werden:

```
Spaltenname : ycom_groups
Feldbezeichnung : translate:ycom_groups
Feldtyp : select
Parameter : SELECT name AS label, id FROM rex_ycom_group
Feldattribute : multiple="multiple"
```

_bei "Nur in folgenden Kategorien verfügbar" noch die festgelegte Medienpool-Kategorien der geschützten Dateien angeben_

**Unbedingt auf die korrekten Tabellenprefixe bei den Parameter-Selects achten!**

Nun können Dateien in den oben definierten Medienkategorien mit entsprechenden Nutzer- und Gruppenzuweisungen ausgestattet werden.

#### 3. Nachfolgendes Template anlegen (Kommentare beachten): 

```php
<?php
  $requested_file = trim(rex_get('fileName', 'string', ''));
  $file_ok = false;

  // Welche Medienkategorien beinhaltet die geschützten Dateien? (Medienpool-Kategorie-ID)
  $secured_categories = [1];
    
  // Wohin soll bei einem unberechtigten Zugriff umgeleitet werden? (Artikel ID)
  $redirect_article = rex_article::getNotfoundArticleId();

  $metafield_ycom_file_users = 'med_ycom_users'; // das Metafeld mit den Nutzerzuordnungen
  $metafield_ycom_file_groups = 'med_ycom_groups'; // das Metafeld mit den Gruppenzuordnungen

  // Prüfe ob eine Datei übergeben wurde
  if ($requested_file !== '')
  {    
    // Was passiert, wenn Datei nicht existiert?
    if (file_exists(rex_path::media($requested_file)))
    {
      $file_ok = true;

      // Datensatz auslesen und Eigenschaften ermitteln
      $file_info = rex_media::get($requested_file);

      if($file_info)
      {
        // Aktuelle Medienkategorie ermitteln
        $file_categories = [(int) $file_info->getCategoryId()];

        if(!in_array(0, $file_categories))
        {
          $file_categories = array_merge($file_categories, $file_info->getCategory()->getPathAsArray());
        }

        if ( count ( array_intersect($file_categories, $secured_categories) ) > 0 )
        {
          // Datei ist in einer geschützten Kategorie, also per se erstmal verbieten
          $file_ok = false;

          $ycom_user = class_exists('rex_ycom_auth') ? rex_ycom_auth::getUser() : null;
          $ycom_auth = rex_addon::get('ycom') ? rex_addon::get('ycom')->getPlugin('auth') : null;

          if($ycom_auth)
          {
            $redirect_article = $ycom_auth->getConfig('article_id_jump_denied');
          }

          if($ycom_user)
          {
            $valid_user = true;
            $valid_group = true;

            // nach Nutzerzuordnungen suchen wenn Datei nicht erlaubt ist...
            if($file_info->hasValue($metafield_ycom_file_users))
            {
              // Nutzerzuordnung der Datei aus dem Feld med_ycom_users auslesen
              $ycom_file_users = explode(',', str_replace('|', ',', $file_info->getValue($metafield_ycom_file_users)));
              $ycom_file_users = array_filter($ycom_file_users);

              if(!empty($ycom_file_users))
              {
                // Nutzer erlauben wenn in Nutzerzuordnung enthalten 
                $valid_user =  in_array($ycom_user->getValue('id'), $ycom_file_users);
              }
              unset($valid_file_users);
            }

            // nach Gruppenzuordnungen suchen
            if($ycom_user->hasValue('ycom_groups') && $file_info->hasValue($metafield_ycom_file_groups))
            {
              // Gruppenzuordnung der Datei aus dem Feld med_ycom_groups auslesen
              $ycom_file_groups = explode(',', str_replace('|', ',', $file_info->getValue($metafield_ycom_file_groups)));
              $ycom_file_groups = array_filter($ycom_file_groups);

              if(!empty($ycom_file_groups))
              {
              // Nutzergruppen auslesen
              $ycom_user_groups = explode(',', $ycom_user->getValue('ycom_groups'));
              $ycom_user_groups = array_filter($ycom_user_groups);

              // Wenn mindestens eine Gruppe übereinstimmt, dann erlauben!
              $valid_group = count ( array_intersect($ycom_user_groups, $ycom_file_groups) ) > 0;
              }
              unset($ycom_file_groups);
            }

            $file_ok = $valid_user && $valid_group;

            unset($valid_user, $valid_group);
          }

          unset($ycom_user, $ycom_auth);
        }

        unset($file_categories);
      }

      unset($file_info);
    }

    if($file_ok)
    {
      // Nutzer darf auf die Datei zugreifen...
      $file = rex_path::media() . $requested_file;
      $contenttype = 'application/octet-stream';

      // soll kein Download erzwungen werden, ändere attachment in inline    
      rex_response::sendFile($file, $contenttype, $contentDisposition = 'attachment');
      exit();
    }

    // um Endlosweiterleitungen zu verhindern prüfen, ob die Weiterleitungs-ID unterschiedlich vom aktuellen Artikel ist
    if($redirect_article != rex_article::getCurrentId())
    {
      $url = rex_getUrl($redirect_article);
      $url = preg_replace('/^\.\//','../',$url); // sonst würde man auf /media/index.php weitergeleitet werden...

      rex_response::sendRedirect($url);
    }

    // bei ungültigen Weiterleitungszielen einfach einen Fehler auswerfen.
    throw new rex_exception('Datei ' . $requested_file . ' wurde nicht gefunden');

    exit;
}
?>
```

**Jetzt müssen Rewrite-Direktiven ergänzt werden**

APACHE:

/.htaccess editieren

> Bei Verwendung von yrewrite direkt nach `RewriteRule ^imagetypes/…`
    
```apacheconf
RewriteRule ^/?media/(.*\.(pdf|doc|zip))$ /index.php?fileName=$1 [L]
```

> Bei Verwendung ohne Rewriter, eine .htaccess-Datei im Root der Website anlegen und folgenden Inhalt einfügen. 

```apacheconf
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^/?media/(.*\.[^\.]+)$ /index.php?fileName=$1 [L]
</IfModule>
```

NGINX Direktive:

```nginx
location / {
  rewrite ^/?media/(.*\.(pdf|doc|zip))$ /index.php?fileName=$1 break;
}

Hier wurde festgelegt welche Dateien geschützt sein sollen.
Weitere Endungen können beliebig hinzugefügt werden z.B:  |eps|pptx|docx …

Wenn man nachfolgenden Code in allen Ausgabe-Templates **am Anfang** einfügt, sind die Dateien geschützt. 
XX steht für die ID des Templates

```php
REX_TEMPLATE[XX]
```

----------
**Achtung!** Vor dem Template darf auf keinen Fall eine Ausgabe von Inhalten erfolgen.
Bei Problemen bitte unbedingt prüfen ob sich Leerzeichen / -zeilen vor und nach dem Template eingeschlichen haben.  
