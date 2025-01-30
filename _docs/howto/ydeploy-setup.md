---
title: REDAXO mit YDeploy
authors: [alxndr-w,iriswerner]
prio:
---
 

# REDAXO mit GitHub, YDeploy und Co.

## Motivation

### 1. Warum ein Workflow mit Git(Hub)? 

Git ist ein Werkzeug zur Versionierung und kollaborativen Zusammenarbeit. Das heißt:
* Damit ist es möglich, dass mehrere Entwickler*innen an mehreren Geräten gleichzeitig am Projekt zusammenarbeiten, ohne sich zu überschreiben.
* Durch die Versionierung lassen sich Probleme im Vorfeld erkennen oder nachträglich rückgängig machen.
* Es gibt Prozesse zur Dokumentation und Nachvollziehbarkeit, in Form von Pull Requests und Commits.
* GitHub als Service ermöglicht über eine Weboberfläche und zusätzliche Bereiche wie "Issues" das Verwalten und Tracken von Aufgaben, Bugs und deren Umsetzung / Lösung.

### 2. Warum lokale Entwicklung? 

Lokale Entwicklung ermgöglicht, unabhängig vom Live-Server Programmcode und Datenbank zu überarbeiten. Das heißt:

* Eine Störung der Internetverbindung, ggf. auch unterwegs, hindert einen nicht an der Abarbeitung von Aufgaben.
* Eine IDE oder Editoren wie VSCode haben Vollzugriff auf den Code und können beim Programmieren assistieren.
* Ein Programmierfehler macht sich nicht auf der Live-Seite bemerkbar, es können gefahrlos Debug-Modus und Parameter wie `throw_always_exception` aktiviert werden.

Die lokalen Änderungen wieder ins Projekt einzuspielen, dafür ist u.a. der Deployment-Prozess gedacht.

### Warum ein Deployment-Prozess? 

* Live-Seite soll immer funktional bleiben
* Ein vorgegebener Prozess mit einfachem "Rollback" im Fehlerfall
* Staging auf einer Präsentations-Instanz möglich
* Synchronisierung von Programmcode, Datenbankstrukturen und Migration von Daten in einem Rutsch

Beispielsweise kann man auch lokal WYSIWYG-Editor-Profile und Mediamanager-Profile anlegen, die dann beim Deployment auf der Live-Seite eingerichtet werden. Das spart Zeit und vermeidet Fehler.

## Wie funktioniert YDeploy?

YDeploy ist ein Addon, das auf Deployer aufbaut und bei der Synchronisation von Daten auf dem lokalen System ins Live-System (und ggf. an andere Entwickler*innen, Stage-System) kümmert.

### Was wird synchronisiert? 

1. Alle Datenbanktabellen (Struktur, Felder)
2. Auf Wunsch Daten innerhalb der Datenbanktabellen (z.B. die Daten der Tabelle `rex_media_manager` oder `rex_redactor_profile`, ...)

### Was wird **nicht** synchronisiert?

1. Datensätze aller anderen Tabellen, also auch keine Slices, keine Artikel, ...
2. Dateien im Media-Ordner
3. Data-Verzeichnisse
4. Cache-Verzeichnisse


## Lokale Entwciklungsumgebung einrichten

### Mac OS

Empfehlung: MAMP

1. Installieren: Downloads - MAMP & MAMP PRO 
2. Anleitung in Screenshots: siehe Notizblatt 
3. Kurzer Test mit PHP (`<?php php_info() ?>`) 
4. Ggf. Test-Domain einrichten hier: (example.org.test:8888) 
5. Datenbank einrichten 
6. opt. SSL aktivieren 

-- Ab hier weitere Erklärungen und Screesnhots nötig --
* Für die weiteren Schritte muss PHP verfügbar gemacht sein und mysqldump: 
* Übers Terminal den Ordner user/local/bin anlegen: 
* `sudo mkdir -p /usr/local/bin`
* Bash-Profile Datei Editieren: `sudo nano ~/.bash_profile` und `alias php="/usr/local/bin/php"`-> Datei schließen mit Tastenkombination "Contro" + "X" (MAC) 
* `sudo ln -s /Applications/MAMP/bin/php/php8.3.14/bin/php /usr/local/bin/php` # PHP Verzeichnis durch aktuell verwendete Version ersetzen 
* prüfen ob die Verlinkung geklappt hat 
* `php –version`
* 5.4 MSQL DUMP Verlinken -> wird nur für das erste Deployment benöötigt um die Datenbank von lokal nach Live zu schieben, kann ansonsten ignoriert werden `sudo ln -s /Applications/MAMP/Library/bin/mysqldump /usr/local/bin/mysqldump `
6. Deployer installieren und global verfügbar machen:  `curl -LO https://deployer.org/deployer.phar` `sudo mv deployer.phar /usr/local/bin/dep` `sudo chmod +x /usr/local/bin/dep`

### IDE / Editor installieren

Am Beispiel von VSCode:

1. Download Visual Studio Code - Mac, Linux, Windows 
2. Arbeitsbereich / Ordner einrichten 
3. Passende Plugins installieren:
4. * Intelliphense
   * php-cs-fixer
   * PHP CS Fixer ggf. Konfigurieren
   * VSCode-Profilsynchronisation aktivieren
   * ... (Todo @alxndr-w)

#### VSCode Terminal einrichten

1.  SSH-Key im Hosting-Paket hinterlegen 
2. Verbindung Testen

## REDAXO auf YDeploy-Struktur umbauen

Die gewohnte Dateistruktur von REDAXO 5.x wird dabei aufgegeben, unter anderem aus Sicherheitsgründen - aber auch, weil 

1. Verweis auf: `yakamara/yak`: Yak - REDAXO mit YDeploy, Developer, Gulp, Browserify, PostCSS und Yimmelyam (github.com) 
2. yakamara/ydeploy: Deployment von REDAXO-Projekten (github.com) installieren

[Hier war ein Verzeichnis-Screenshot]

### Yak verwenden

1. YAK clonen (bzw. downloaden und ins Site-Verzeichnis packen, z.B. wisotel-dbn) 
2. setup/presetup in der Konsole ausführen 
3. GitHub Repository initialisieren 
4. Lokale Entwicklungsumgebung zum Laufen bringen (REDAXO Setup durchführen, das Passwort für root in MAMP/MySQL ist "root") 
5. YDeploy-Addon installieren 

### Bei bestehenden Projekten Archiv vom Live-System holen: 

1.       Media-Ordner 
2.       /src/addons-Ordner 
3.       /data/addons-Ordner 
4.       Config.yml Website-Name übertragen (mehr nicht) 
5.       /assets/addons/-Ordner in /public/assets/addons übertragen 
6.       Datenbank importieren (über PHPMyAdmin) 
7.       YDeploy reinstallieren (wegen Schritt 6 fehlen die Datenbanktabellen) 
8.       Ggf. Views nachreichen 
9.       YRewrite Setup ausführen  

### YDeploy konfigurieren

1. deploy.php anpassen (repository, host) 
2. In boot.php einfügen (developer-Pfade umbauen) 

```
if (\rex_addon::get('developer')->isAvailable()) { 
\rex_developer_manager::setBasePath(\rex_path::src()); 
} 
```

Im VS-Code in das gewünschte Projekt wechseln, Terminal im VS-Code öffnen und node_js installieren 

```
Apple Developer Umgebung laden aus Internet, folgenden Befehl ausführen: 
xcode-select --install 
```

Dann die folgenden Schritte einzeln ausführen 

```
# installs nvm (Node Version Manager) 
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash 
 
# download and install Node.js (you may need to restart the terminal) 
nvm install 20 
 
# verifies the right Node.js version is in the environment 
node -v # should print `v20.17.0` 
 
# verifies the right npm version is in the environment 
npm -v # should print `10.8.2` 
```
 
2.       yarn installieren Installation | Yarn (yarnpkg.com) npm install --global yarn 
3.        Projektdaten herunterladen, lokal zum Laufen bringen 
4.        deployer.php konfigurieren 
5.        project-Addon für YDeploy konfigurieren 

### composer installieren: 

Befehle einzeln ausführen: 

`php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" `

`php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"`
 
`php composer-setup.php`

`php -r "unlink('composer-setup.php');"`

`sudo mv composer.phar /usr/local/bin/composer`

### Deployer installieren 

composer global require deployer/deployer 

### Gulp installieren 

npm install --global gulp-cli 

### Yarn ausführen mit dem Befehl  

yarn 

### Test-Deployment auf separater Stage-Domain 

1. Stage-Subdomain eingerichtet? (z.B. stage.example.org oder next.example.org)

### Die wichtigsten Befehle 

 

### Diff ausführen

Migration ausführen - Änderungen an Datenbankfeldern und bestimmten Tabellen in Projektcode speichern: 

`redaxo/bin/console ydeploy:diff`

Es entstehen bis zu 3 neue Dateien: 

ig rations\2023-07-24 08-40-46.289831. php

Diese committen.
 
## Das Deployment 

`gulp` (im Workflow von Yakamara): updatet CSS, JS in deinem eigenen Projekt 

`dep deploy`

`bin/console ydeploy:diff`
`bin/console ydeploy:migrate`

### Was, wenn etwas schief geht?

Beschreiben, wie ein Rollback durchzuführen ist oder was gängige Fehlermeldungen sind
1. SSH-Key nicht korrekt
2. Verbindungsdaten nicht korrekt
3. MariaDB vs. MySQL (doppelt escapte `\\` statt `null` - manuelles editieren der fixtures/migrations)

Update-Befehle 

`yarn update` – nur, wenn man Ressourcen updaten will! 
`npm update`  - wann? 

`dep build` + `dep release` = `dep deploy`
