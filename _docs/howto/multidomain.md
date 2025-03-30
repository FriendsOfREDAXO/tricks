---
title: REDAXO Multidomain-Setup - Aufbau und Tipps
authors: [alexplusde]
prio:
---

# Multidomain-Setup - Aufbau und Tipps

REDAXO ist standardmäßig als Single-Domain CMS konzipiert, kann aber durch entsprechende AddOns zu einer vollwertigen Multidomain-Lösung erweitert werden. Diese Dokumentation beschreibt die technischen Konzepte, Möglichkeiten und Grenzen von Multidomain-Setups in REDAXO.

## Core-Funktionalitäten

* REDAXO verwaltet Inhalte in einer hierarchischen Kategorien- und Artikel-Struktur
* Alle Inhalte liegen in einer gemeinsamen Datenbank
* Mehrsprachigkeit ist durch das integrierte Clang-System bereits im Core verfügbar

## YRewrite als Basis für Multidomain

YRewrite ist die zentrale Komponente für Multidomain-Setups in REDAXO und Voraussetzung für viele weitere Erweiterungen.

Das Add-on YRewrite ist ebenfalls von den Core-Entwicklern und ermöglicht den Betrieb von Multidomain-Setups in REDAXO.

### Funktionsweise

* YRewrite leitet Anfragen anhand von Regeln auf die entsprechenden Artikel um
* YRewrite kann auch für URL-Umschreibungen und Weiterleitungen genutzt werden
* YRewrite kann auch für die Generierung von XML-Sitemaps und robots.txt-Dateien genutzt werden
* YRewrite kann auch für die Generierung von Canonical-Links genutzt werden
* YRewrite kann auch für die Generierung von OpenGraph- und anderen Meta-Tags genutzt werden

### Best Practice für YRewrite

Von Anfang an empfiehlt es sich, in der REDAXO Struktur auf Root-Kategorien für jede Domain zu setzen. Unsere Empfehlung:

1. Der Mountpoint-Artikel ist der Startpunkt für die Domain - nutze den Startartikel der Root-Kategorie als Mountpoint-Artikel.
2. Als Startartikel kann ebenfalls der Startartikel der Root-Kategorie genutzt werden, muss jedoch nicht.
3. Es können unterhalb eines Mountpoint-Artikels beliebig viele Kategorien und Artikel angelegt werden.
4. Es können ebenfalls Mountpoint-Artikel anderer Domains unterhalb einer Root-Kategorie angelegt werden - dies ist dann praktisch, wenn es eine spezifische Landingpage innerhalb einer Website mit anderer Domain geben soll.

## Medienpool & Berechtigungen

Aktueller Nachteil in REDAXO ist der gemeinsame Medienpool über alle Websites hinweg. Hier gibt es jedoch bereits Lösungsansätze. Das Berechtigungskonzept ermöglicht:

* Rollenbasierte Zugriffssteuerung auf Kategorien
* Beschränkung auf Struktur-Bereiche pro Nutzer
* Medienkategorien können Nutzern/Rollen zugewiesen werden
* Effektive Trennung durch Berechtigungsmanagement

Mit einer vertrauensvollen Nutzerverwaltung und klaren Strukturvorgaben kann der gemeinsame Medienpool auch in Multidomain-Setups effektiv genutzt werden.

## Erweiterungen für Multidomain

### Native Multidomain-Unterstützung

Folgende AddOns bieten eingebaute Multidomain-Funktionen:

* [FriendsOfREDAXO/maintenance](https://github.com/FriendsOfREDAXO/maintenance): Wartungsmodus pro Domain konfigurierbar, Domains können vom Wartungsmodus ausgeschlossen werden.

* [FriendsOfREDAXO/yrewrite_metainfo](https://github.com/FriendsOfREDAXO/yrewrite_metainfo): Meta-Informationen auf Domain-Ebene, z.B. für Domainspezifische Anpassungen (Logos, Farben, Footer etc.)


### Add-ons, die den Multidomain-Betrieb verbessern

* [FriendsOfREDAXO/mailer_profile](https://github.com/FriendsOfREDAXO/mailer_profile): Domain-spezifische Mail-Konfigurationen, z.B. für unterschiedliche SMTP-Profile

* [novinet-git/nv_categorymanager](https://github.com/novinet-git/nv_categorymanager): Kopieren kompletter Strukturbäume, sodass eine domainspezifische Root-Kategorie dupliziert werden kann und an die neue Domain angepasst werden kann.

* [tbaddade/redaxo_url](https://github.com/tbaddade/redaxo_url): Datensatz-Trennung nach Domain, Domain-spezifische URL-Generierung möglich.


