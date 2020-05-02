---
title: REDAXO mit DDEV Installieren
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

DDEV ist ein auf Docker basierendes Open-Source-Tool. Es ermöglicht es, ganz schnell und einfach eine Lokale PHP Entwicklung aufzubauen. Standardmäßig gibt es in DDEV auch andere Vorkonfigurationen, für andere Systeme. Man kann aber auch einfach sein eigenes PHP Projekt mit DDEV Betreiben.

<a name="ddev-voraussetzungen"></a>
## DDEV Voraussetzungen

- [Homebrew](https://brew.sh/index_de)
- [Docker Desktop (Mac & Windows 10 Pro](https://www.docker.com/products/docker-desktop)
- [Docker Toolbox (Windows 10 Home)](https://github.com/docker/toolbox/releases)
- [DDEV Anleitung](https://ddev.readthedocs.io/en/stable/)

<a name="redaxo-klonen"></a>
## REDAXO Klonen

Als erstes, erstellt man sich ein Projekt Verzeichnis für das REDAXO Projekt. Dann klont man sich REDAXO in das Projekt Verzeichnis und führt im Terminal folgenden Befehl aus: `git clone https://github.com/redaxo/redaxo.git .`.

<a name="ddev-konfigurieren"></a>
## DDEV Konfigurieren

Als nächstes muss DDEV noch Konfiguriert werden, das machen wir mit Folgendem Befehl:
`ddev config --project-type=php --webserver-type=apache-fpm`. Alternativ hätten wir auch einfach nur `ddev config` ausführen können und die schritte durchgehen können, aber so geht es ein wenig schneller.

- `--project-type=php` Legt denn Typ des Projektes fest.
- `--webserver-type=apache-fpm` Legt denn Webserver Typ fest.

<a name="projekt-starten"></a>
## Projekt Starten

- `ddev start` Damit wird das Projekt gestartet. (Beim Ersten mal kann es etwas dauern, da noch die ganzen Pakete heruntergeladen und installiert werden.)

- Die Projekt URL Aufrufen (HTTP): `http://ORDNERNAME.ddev.site:8000`
 - Falls man nach der DDEV Installation `mkcert -install` ausgeführt hat, kann man sein Projekt auch über HTTPS Aufrufen: `https://ORDNERNAME.ddev.site:8443`.

<a name="redaxo-setup"></a>
## REDAXO Setup

Man Installiert REDAXO wie gewohnt, und gibt bei den Datenbank Einstellungen folgendes ein:

- Datenbank Host: `db`
- Datenbank Username: `db`
- Datenbank Passwort: `db`
- Datenbank Name: `db`

<a name="geschafft"></a>
## Geschafft 🎉

![](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/redaxo_ddev/redaxo_ddev_tada.png)

<a name="tipps"></a>
## Tipps

Mit dem Befehl `ddev describe` Kannst du dir die Informationen zu deinem Projekt anzeigen lassen.
![](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/redaxo_ddev/redaxo_ddev_projekt_infos.png)

### PHP Version ändern

In deiner DDEV Konfiguration `.ddev/config.yml`:

```yaml
php_version: "7.3"
```

Kannst du Ganz einfach deine PHP Version ändern. Unterstützt sind aktuell folgende PHP Versionen: `5.6`, `7.0`, `7.1`, `7.2`, `7.3`, und `7.4`. 

Danach startest du dein Projekt mit `ddev restart` neu, und alles sollte wieder laufen.

### DDEV Projekt Stoppen

Wenn du dein DDEV Projekt stoppen möchtest, kannst du dies ganz einfach mit `ddev stop` tun. Und beim nächsten mal wieder mit `ddev start` Starten.
