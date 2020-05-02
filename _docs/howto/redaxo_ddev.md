---
title: REDAXO mit DDEV installieren
authors: [crydotsnake]
prio:
---

# REDAXO mit DDEV Installieren

> Entwicklerversionen aus GitHub sollten ausschließlich zu Testzwecken und zur Unterstützung bei der Entwicklung installiert werden. Ein produktiver Einsatz wird nicht empfohlen. Für einen produktiven Einsatz bitte die ZIP Version von REDAXO.org downloaden.

- [Was ist DDEV?](#was-ist-ddev)
- [DDEV Voraussetzungen](#ddev-voraussetzungen)
- [REDAXO Klonen](#redaxo-klonen)
- [DDEV Konfigurieren](#ddev-konfigurieren)
- [Projekt Starten](#projekt-starten)
- [REDAXO Setup](#redaxo-setup)
- [Geschafft](#geschafft)
- [Tipps](#tipps)

<a name="was-ist-ddev"></a>
## Was ist DDEV ?

DDEV ist ein auf Docker basierendes Open-Source-Tool. Es ermöglicht, ganz schnell und einfach eine lokale PHP-Entwicklung aufzubauen. Standardmäßig gibt es in DDEV auch andere Vorkonfigurationen, für andere Systeme. Du kannst aber auch einfach dein eigenes PHP-Projekt mit DDEV betreiben.

<a name="ddev-voraussetzungen"></a>
## DDEV Voraussetzungen

- [Homebrew](https://brew.sh/index_de)
- [Docker Desktop (Mac & Windows 10 Pro)](https://www.docker.com/products/docker-desktop)
- [Docker Toolbox (Windows 10 Home)](https://github.com/docker/toolbox/releases)
- [DDEV-Anleitung](https://ddev.readthedocs.io/en/stable/)

<a name="redaxo-klonen"></a>
## REDAXO klonen

Als erstes erstellst du dir ein Projektverzeichnis für das REDAXO-Projekt. Dann klonst du REDAXO in das Projektverzeichnis, indem du im Terminal folgenden Befehl ausführst:

    $ git clone https://github.com/redaxo/redaxo.git

<a name="ddev-konfigurieren"></a>
## DDEV konfigurieren

Als nächstes muss DDEV noch konfiguriert werden, das machen wir mit folgendem Befehl:

    $ ddev config --project-type=php --webserver-type=apache-fpm
  
Alternativ hätten wir auch einfach nur `ddev config` ausführen und die Schritte durchgehen können, aber so geht es ein wenig schneller.

- `--project-type=php` legt den Typ des Projektes fest.
- `--webserver-type=apache-fpm` legt den Webserver-Typ fest.

<a name="projekt-starten"></a>
## Projekt starten

    $ ddev start
  
Damit wird das Projekt gestartet. (Beim ersten Mal kann es etwas dauern, weil noch die ganzen Pakete heruntergeladen und installiert werden.)

Die Projekt-URL Aufrufen: `http://ORDNERNAME.ddev.site:8000`

Falls du nach der DDEV-Installation `mkcert -install` ausgeführt hast, kannst du dein Projekt auch über HTTPS aufrufen: `https://ORDNERNAME.ddev.site:8443`.

<a name="redaxo-setup"></a>
## REDAXO-Setup

Du installierst REDAXO wie gewohnt und verwendest für die Datenbank-Einstellungen folgende Angaben:

- Datenbank Host: `db`
- Datenbank Username: `db`
- Datenbank Passwort: `db`
- Datenbank Name: `db`

<a name="geschafft"></a>
## Geschafft 🎉

![Screenshot](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/redaxo_ddev/redaxo_ddev_tada.png)

<a name="tipps"></a>
## Tipps

Mit dem Befehl `ddev describe` Kannst du dir die Informationen zu deinem Projekt anzeigen lassen.
![Screenshot](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/redaxo_ddev/redaxo_ddev_projekt_infos.png)

### PHP-Version ändern

In deiner DDEV-Konfiguration `.ddev/config.yml`:

```yaml
php_version: "7.3"
```

Dort kannst du ganz einfach deine PHP-Version ändern. Unterstützt sind aktuell folgende PHP-Versionen: `5.6`, `7.0`, `7.1`, `7.2`, `7.3`, und `7.4`. 

Danach startest du dein Projekt mit `ddev restart` neu, und alles sollte wieder laufen.

### DDEV-Projekt stoppen

Wenn du dein DDEV-Projekt stoppen möchtest, kannst du dies ganz einfach mit `ddev stop` tun. Und beim nächsten mal wieder mit `ddev start` starten.
