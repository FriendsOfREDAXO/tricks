---
title: Website sperren / Wartungsarbeiten
authors: [alexplusde,skerbis]
prio:
---

# Website sperren / Wartungsarbeiten

Wenn sich eine REDAXO-Website in der Entwicklung befindet, kann es sein, dass der Kunde bereits einen Blick auf die Website werfen will, ohne, dass die Website für Unbefugte erreichbar ist. Da auf unbestimmtem Wege auch eine halbfertige Website im Google-Index landen kann, sollte eine (Redaxo-)Website vor der Veröffentlichung durch einen der nachfolgendenen Techniken geschützt werden.

> Tipp: Für die Entwicklungs-Website nutzen viele Redaxo-Entwickler eine Subdomain, z. B. `neu.domain.de`, `dev.domain.de`, `beta.domain.de`. 

## via Maintenance-AddOn
https://github.com/FriendsOfREDAXO/maintenance

## via XOutputFilter

im Frontend-Plugin folgende Einstellungen setzen:

Name: Wartungsmodus

aktiviert: ja

Ersetzungstyp: PHP-Code

Marker: `<html>`

Ersetzung:
```php
<?php
$session = rex_backend_login::hasSession();
if (!$session) {
    echo 'Wartungsmodus';
    exit;
}
?>
```

## via .htpasswd

1. vollständigen Pfad der Redaxo-Installation auf dem Webserver ausfindig machen.
2. .htpasswd-Datei genereieren, z. B. über einen [Online-htpasswd-Generator](http://www.htaccesstools.com/htpasswd-generator/)
3. .htpasswd-Datei in das Verzeichnis der Redaxo-Installation hochladen 
4. Pfad zur .htpasswd-Datei innerhalb der .htaccess-Datei hinzufügen.

> **Tipp:** Viele Hoster bieten in ihrem Webspace-Kundenmenü ebenfalls die Möglichkeit, ein Verzeichnis via .htpasswd heraus zu schützen. 

> **Hinweis:** Beim Einsatz Rewrite-AddOns (z. B. YRewrite) wird empfohlen, die .htaccess-Datei zu sichern. Bei einer erneuten Generierung der .htaccess-Datei muss auch Schritt 4 wiederholt werden.

> **Hinweis:** Dieser Schutz funktioniert bei einem Apache-Server, jedoch nicht bei einem IIS-Server.

## Via PHP http-auth

Siehe http://php.net/manual/de/features.http-auth.php, Beispiel 3.

## Via Redaxo-Login

Diesen Code am Anfang des aktivierten Templates einbauen. Hierbei muss für den Kunden ein Redaxo-Benutzer angelegt sein. Der Kunde muss sich zunächst in Redaxo einloggen, anschließend kann er die Website aufrufen. 

```PHP
<?php
if (!rex::isBackend()) {
	if ($this->getConfig('status') != 'deaktiviert') {
		$session = rex_backend_login::hasSession();
		if (!$session) {
			header('Location: ' . $this->getConfig('url'));
			exit;
  		}
  	}
}
?>
```

## Via GET-Parameter im Template

Diesen Code am Anfang der aktiven Templates einbauen, dem Kunden anschließend die URL `meine-website.de/?vorschau=abc123` übermitteln.
Die hier gezeigte Lösung erlaubt es auch Nutzern, die sich im Backend eingeloggt haben die Seiten zu sehen, da der Status von `rex_backend_login::hasSession()`überprüft wird. 

```PHP
<?php 

session_start();
// Festlegen des Sicherheitscodes
$code = "abc123";
// GET-Parameter abfragen
$code2 = rex_request('vorschau', 'string', 0);

// speichert den Code in der Session
if ($code2) {
  $_SESSION['vorschau'] = $code2;
}

// Ausgabe abbrechen, wenn der übermittelte Code nicht stimmt. 
if ($_SESSION['vorschau'] !== $code and !rex_backend_login::hasSession()) {
 echo '<strong>Unberechtigter Zugriff</strong>';
 exit();
}

?>
```

## Siehe auch

[Diskussion auf GitHub](https://github.com/FriendsOfREDAXO/tricks/issues/8)
