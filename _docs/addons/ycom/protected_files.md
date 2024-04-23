---
title: Dateischutz YCom
authors: [skerbis,IngoWinter]
prio:
---

# Geschütze Dateien mit YCom

Benötigte AddOns:
- YRewrite
- YCom

### Wie kann man Dateien in Verbindung mit YCom (Community Addon) einfach schützen?

> Diese Anleitung ist veraltet: Seit YCOM 4.x ist dieser Trick nicht mehr nötig.

Da REDAXO aktuell nur einen Medienordner hat und so von außen alle Dateien in diesem Ordner öffentlich zugänglich sind, benötigt man eine Lösung, die den Dateiaufruf überprüft und entscheidet ob es sich um eine geschützte Datei oder einer öffentlichen Datei handelt.


Geeignet für REDAXO ab 5.2

1. Medienkategorie(n) erster Ebene anlegen
2. ID(s) der Kategorie(n) merken und bei `$mediacats2protect=` hinterlegen
3. Nachfolgenden Code in die boot.php des Projekt-AddOn einbinden

```php
<?php
function ycom_check_fileperm($filename, $do_ycom_login = false)
{
    // zu schuetzende mediacats, bitte nach bedarf anpassen
    $mediacats2protect = [14, 15];

    // eltern mediacat der datei holen
    $media = rex_media::get($filename);
    $mediacat2check = $media->getCategoryId();
    $mediacat = $media->getCategory();
    if (is_object($mediacat) && count($mediacat->getPathAsArray()))
    {
        $mediacat2check = $mediacat->getPathAsArray()[0];
    }
    // datei ist nicht zu schuetzen
    if (!in_array($mediacat2check, $mediacats2protect))
    {
        return true;
    }

    // bei aufruf ueber media manager ycom nutzer einloggen
    if ($do_ycom_login)
    {
        rex_ycom::addTable('rex_ycom_user');
        rex_yform_manager_dataset::setModelClass('rex_ycom_user', rex_ycom_user::class);
        $auth = rex_ycom_auth::login([]);
    }

    $ycom_user = rex_ycom_auth::getUser();

    if ($ycom_user)
    {
        // hier ggfs weitere abfragen
        return true;
    }
    return false;
}

// check fileperm fuer direkte dateiaufrufe
rex_extension::register('FE_OUTPUT', function () {
    $filename = rex_get('ycom_file', 'string');
    if ($filename && file_exists(rex_path::media($filename)))
    {
        if (!ycom_check_fileperm($filename))
        {
            rex_redirect(rex_plugin::get('ycom', 'auth')->getConfig('article_id_jump_denied'));
        }
        $managed_media = new rex_managed_media(rex_path::media($filename));
        (new rex_media_manager($managed_media))->sendMedia();
    }
});

// check fileperm fuer media manager dateiaufrufe
if (!rex_backend_login::hasSession())
{
    $filename = rex_get('rex_media_file', 'string');
    if ($filename && file_exists(rex_path::media($filename)))
    {
        if (!ycom_check_fileperm($filename, true))
        {
            header('HTTP/1.1 403 Forbidden');
            exit;
        }
    }
}
```

**Jetzt müssen Rewrite-Direktiven ergänzt werden**

**APACHE** in die .htacces von YRewrite:

> Bei Verwendung von yrewrite direkt nach `RewriteRule ^imagetypes/…`

	RewriteRule ^/?media/(.*)$ /index.php?ycom_file=$1 [L]

Variante wenn nur bestimmte Dateitypen geschützt werden sollen

	# RewriteRule ^/?media/(.*\.(pdf|doc|zip))$ /index.php?ycom_file=$1 [L]

**NGINX**

Direktive für bestimmte Dateitypen:

	location / {
	rewrite ^/?media/(.*\.(pdf|doc|zip))$ /index.php?fileName=$1 break;
	}

Hier wurde festgelegt welche Dateien geschützt sein sollen.
Weitere Endungen können beliebig hinzugefügt werden z.B:  |pdf|doc|zip …


