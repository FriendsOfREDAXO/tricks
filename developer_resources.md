# Nützliches für Developer

- [Beschreibung](#beschreibung)
- [Nützliche AddOns](#addons)
  - [Adminer](#adminer)
  - [Cheatsheat für Extensionpoints](#cheatsheet)
  - [Developer - Module, Templates und Aktionen syncen](#developer)
  - [Project - Schnell mal eine PHP-Class einbinden](#project)
  - [Strukturierte Daten - HilfsAddOn für Jason-LD](#strucdata)
  - [Theme - Verwalten aller Projektdateien für Frontend und Backend](#theme)
  - [YConverter - Migration REDAXO 4.x zu 5.x](#yconverter)
  - [YTraduko - Übersetzungshelfer](#ytraduko)
  - [ZIP-Install](#zip)
  
- [Software und Workflows](#swork)
  - [REDAXO mit Bimmelbam](#bimmelbam)
  - [REDAXO mit Docker](#docker)

- [Nützliche Links](#)
  - [Front-End Checklist](https://github.com/thedaviddias/Front-End-Checklist)
  - Weitere AddOns 
    - [Demo Addon - Zeigt den Aufbau und Basisfunktionalität von AddOns](https://github.com/FriendsOfREDAXO/demo_addon)
    - [Addon Viewer - Durch AddOns browsen](https://github.com/gupi/addon_viewer)
    - [Addon Template - AddOn-Struktur Generator](https://redaxo.org/download/addons/template/)

<a name="beschreibung"></a>
## Beschreibung

Nachfolgend listen wir hier nützliche Informationen, AddOns und Links, die die Entwicklung eines AddOns oder des geplanten Projektes erleichtern. Wer mitmachen möchte, sendet bitte seine Ergänzungen als PR. 

<a name="addons"></a>
## AddOns

<a name="addons"></a>
### Cheatsheet

Das Cheatsheet-AddOn scant die REDAXO-Installation nach Extension-Points im Core und den installierten AddOns und listet deren Position im Quellcode auf. 

[**Installation aus Github-Repo:**](https://github.com/tbaddade/redaxo_cheatsheet)

<a name="developer"></a>
### Adminer

Adminer für REDAXO. Seit Version 1.3.0 kann der rex_sql_table code für die ausgewählte Tabelle in der Tabellenstruktur angezeigt werden. Sehr hilfreich bei der AddOn-Erstellung für die install.php. 

**Installation per Installer**

[**Github-Repo**]https://github.com/FriendsOfREDAXO/adminer)

<a name="developer"></a>
### Developer

Developer kopiert und synct Module, Templates und Aktionen zwischen Dateisystem und Datenbank, so werden diese leicht für externe Editoren und per FTP zugänglich.

**Installation per Installer**

[**Github-Repo**](https://github.com/FriendsOfREDAXO/developer)

<a name="project"></a>
### Project

In REDAXO bereits vorhanden, ist das Project-AddOn. Hier können einfach eigene PHP-Classes und Assets eingebunden werden, die nach einem Update nicht gelöscht werden. Man erspart sich so also die Entwicklung eines eigenen AddOns, wenn man das System einfach nur mit einer PHP-Class bereichern möchte. 

**Installation in der AddOn-Verwaltungr**


<a name="strucdata"></a>
### Strukturierte Daten (JSON-LD)

Gerne vergessen, von Google aber gern gesehen. JSON-LD - Informationen auf der Website. Dieses AddOn hilft bei der Erstellung. 

[**Github-Repo**](https://github.com/eaCe/strucdata)



<a name="theme"></a>
### Theme

Das Theme-AddOn erleichtert die Verwaltung aller für das Projekt erforderlichen Prajektdateien in einem zusätzlichen /theme-Ordner im Web-Root. Theme erlaubt es auch das System oder die Website mit zusätzlichen CSS, JS und PHP-Classes zu breichern. Ist das Developer-AddOn installiert, synct es sich mit diesem um die Modul- und Template-Dateien an einer zugänglicheren Stelle bereitzustellen. 

**Installation per Installer**

[**Github-Repo**](https://github.com/FriendsOfREDAXO/theme)

<a name="yconverter"></a>
### YConverter

Eine REDAXO 4.x - Datenbank kann mit Hilfe dieses AddOns für REDAXO 5.x vorbereitet werden und migriert werden. Hierbei werden bekannte Class- und Methodenaufrufe, REX_VARS für REDAXO 5.x vorbereitet und sogar xform-Tabellen nach yform konvertiert. 

[**Github-Repo**](https://github.com/yakamara/yconverter)

<a name="ytraduko"></a>
### YTraduko - Übersetzungshelfer 

Ytraduko hilft bei der Übersetzung der eigenen AddOns. Anstelle selbst für die weiteren Sprachen neue .lang - Dateien anzulegen, erledigt dieses AddOn es selbst. Die Übersetzungen können übersichtlich und schnell eingepflegt werden. 

[**Installation aus Github-Repo**](https://github.com/yakamara/ytraduko)

<a name="zip"></a>
### ZIP-Install 

Das ZIP-Install ermöglicht es gezippte AddOns ohne Umweg per FTP auf den Server zu laden und zu entpacken. Ganz praktisch vor allem, wenn es sich um AddOns handelt, die es nur als GitHub-Repo gibt und nicht im Installer zur Vefügung stehen.  

**Installation per Installer**

[**GitHub-Repo**](https://github.com/FriendsOfREDAXO/zip_install)


## Software und Workflows

<a name="bimmelbam"></a>
### REDAXO mit Gulp, Browserify, PostCSS und Bimmelbam

Ein Frontend-Workflow auch für REDAXO

Frontendentwicklung wird immer aufwändiger, SCSS wollen kompiliert werden, Bilder komprimiert werden, JS schöner werden, HTML-Prototypen wollen erzeugt werden. ***REDAXO mit Bimmelbam*** zeigt hierfür einen ausbaufähigen Weg. 

[**GitHub-Repo**](https://github.com/FriendsOfREDAXO/redaxo-mit-bimmelbam)


<a name="docker"></a>
### REDAXO mit Docker

***MAMP und XAMPP waren gestern!*** REDAXO kann leicht, systemunabhängig mit Docker verwendet werden. Die Vorteile: Möglichkeit der zentralen Installation und Bearbeitung, Versionierbarkeit, Ausbaufähigkeit. REDAXO-mit-Docker liefert alle Ressourcen und eine einsteigergeignete Anleitung. Und damit man nicht bei Null anfangen muss, kann eine Demo gleich automatisiert installiert werden. ***REDAXO mit Docker und Bimmelbam*** sind übrigens leicht miteinander kombinierbar. Weitere Infos in den jeweiligen REPOS. 

[**GitHub-Repo**](https://github.com/FriendsOfREDAXO/redaxo-mit-docker)
