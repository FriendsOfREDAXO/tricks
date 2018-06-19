---
title: Argumente für REDAXO
authors: [alexplusde]
prio:
---

# Argumente für REDAXO

Kunden, die REDAXO nicht kennen, erkundigen sich nach den Vorteilen von REDAXO. Sei es, weil sie von REDAXO noch nicht gehört haben, oder ein anderes CMS bereits kennen / einsetzen.

## Bedienung

> "Ich kenne nur CMS XYZ, mit REDAXO kenne ich mich nicht aus." 

> "Wir möchten unsere Website selbst pflegen. Wie hoch ist der Schulungsaufwand?"

REDAXO hat eine sehr schlichte und aufgeräumte Benutzeroberfläche. Mit [Benutzerrollen](https://redaxo.org/doku/master/benutzerverwaltung) kann man einzelne Funktionen für Endanwender freischalten und unnötige Funktionen ausblenden. Dadurch ist die Oberfläche für Endanwender besonders übersichtlich und der Schlungsaufwand gering. Für einfache Aufgaben wie Textänderungen genügt eine telefonische Einweisung.

## Erweiterbarkeit

> "Für CMS XYZ gibt es viel mehr Addons, Plugins und Erweiterungen als bei REDAXO!"

REDAXO füllt eine Nische aus, die andere CMS nicht bedienen. Bei CMS XYZ ist es so, dass es zwar viel mehr Erweiterungen gibt, doch nur bestimmte Erweiterungen werden auch regelmäßig gewartet und sind unter Unständen nicht kompatibel zueinander.

Für REDAXO gibt es ausreichende und praxiserprobte Erweiterungen für die meisten Anwendungsfälle. 

Außerdem haben sich einige Entwickler in der REDAXO-Community zu einer Gruppe zusammengeschlossen: FriendsOfREDAXO. Diese Gruppe ist darauf bedacht, dass es nützliche Erweiterungen gibt, die auch untereinander kompatibel bleiben und reagieren auf Wünsche der Nutzer.

## Mehrsprachigkeit

> "Unsere Website muss mehrsprachig sein. Geht das mit REDAXO?" 

> "Wieso REDAXO? CMS XYZ ist bekannt dafür, gut mit mehreren Sprachen umzugehen."

REDAXO verfügt von Haus aus über eine Verwaltung von Sprachen, sodass bei enstprechender Planung mit geringem Aufwand eine einsprachige Website um beliebig viele Sprachen erweitert werden kann. 

Wird eine Übersetzungsagentur beauftragt oder werden widerkehrende Textbausteine verwendet, so können Addons wie [Sprog](https://github.com/tbaddade/redaxo_sprog) oder [XOutputFilter](https://github.com/FriendsOfREDAXO/xoutputfilter) (FriendsOfREDAXO) die Verwaltung von Textbausteinen erleichtern. Beide Addons sind praxiserprobt.

## Suchmaschinen-Optimierung

> "Wir wollen auf Platz 1 bei Google. Für CMS XYZ gibt es Addon/Plugin ABC, gibt es das auch bei REDAXO?"

Suchmaschinen-Optimierung ist ein weites Feld und heutzutage mehr eine konzeptionelle Aufgabe, als eine technische Aufgabe. Entsprechend sind SEO-Erweiterungen für ein CMS nur dann wirksam, wenn sie entsprechend vorbereitet sind. Hier die Fakten:

### Allgemein
* Mit REDAXO lassen sich responsive Webdesigns umsetzen
* Mit REDAXO lassen sich unterschiedliche Tempaltes und Module verwalten, um Landing Pages zu erstellen
* Mit REDAXO können entsprechende Meta-Informationen und OpenGraph-Daten ausgegeben werden, die von Google berücksichtigt werden

### Google Search Console
* Mit dem Addon YForm verwaltete Datenbank-Tabellen können bei entsprechender Umsetzung Structured Data für Google ausgeben
* Mit dem Addon YRewrite werden sprechende URLs erzeugt, z.B. `website.de/produkte/` sowie eine sitemap.xml erzeugt und Weiterleitungen verwaltet. Auch können Seiten vom Google-Index ausgeschlossen werden oder die Indexierungsfrequenz pro Seite festgelegt werden.
* Mit dem Addon YForm und URL lassen sich zusätzliche sprechende URLs anhand von Datensätzen generieren, z.B. `website.de/produkte/mein-produkt/`

### Google PageSpeed 
* Mit REDAXO behält man die volle Kontrolle über die Ausgabe des HTML-Codes, sodass der Entwickler Optimierungen direkt selbst vornehmen kann. 
* Mit dem Addon Minify lassen sich optimierte Javascript und CSS-Dateien ausgeben, um die Ladezeit zu verrringern.
* Mit dem Addon Media Manager lassen sich Bildprofile erzeugen, um die Dateigröße der Bilder zu verringern und die Ladezeit zu verringern.

### Tracking
* Mit REDAXO kann an beliebiger Stelle, je nach Vorgabe der Tracking-Software (bspw. Piwik oder Google Analytics) Tracking-Code eingebunden werden.

Was REDAXO nicht kann, ist guten Content zu erstellen und Offpage-Optimierung durchzuführen. Beides ist für SEO wichtig und unabhängig von der Wahl des CMS.

## Wartung und Updates

> "Wie modern ist REDAXO?"

> "Gibt es für REDAXO Updates?"

> "Mit welchen Folgekosten für REDAXO muss ich rechnen?"

REDAXO wird stetig weiterentwickelt. Das heißt jedoch nicht, dass es einen Update-Zwang gibt. Aktuell erhält der REDAXO-Core alle 6-9 Monate ein sog. Core-Update. Neue Funktionen (bspw. zusätzliche Editoren, Funktions-Erweiterungen) werden zumeist als Addon veröffentlicht, deren Nutzung freiwillig ist und die oftmals auch mit älteren Core-Versionen kompatibel sind. 

Im Prinzip kann ein REDAXO, einmal eingerichtet, über viele Jahre nahezu wartungsfrei verwendet werden. Die Erfahrung aus der Community, die heute noch REDAXO-Installationen der 2000er-Jahre einsetzt, bestätigen dies. Änderungen an der Plattform - bspw. die PHP-Version, das verwendete Datenbank-System oder eine geänderte Server-Konfiguration) - oder können einen Eingriff vom Entwickler nötig machen. 

Core-Updates können jedoch die Sicherheit erhöhen. Hierfür gibt es in REDAXO 5 einen Update-Workflow über das Installer-Addon. Updates innerhalb einer Hauptversion, also im Moment in Version 5.x, sind in der Regel rückwärtskompatibel. Ausgenommen von sind kritische Sicherheitspatchs, für die ein Update dringend empfohlen wird. Hier hat Yakamara, der Haupt-Entwickler hinter REDAXO, in der Vergangenheit vorbildlich und zeitnah informiert und Patches zur Verfügung gestellt.


## Datenschutz, Sicherheit und Backups

> "Wie sicher ist REDAXO?" 

> "Für CMS XYZ gibt es Virenschutz-Funktionen, gibt es diese auch für REDAXO?"

> "Gibt es automatische Backups?"

> "Was gilt es bei REDAXO im Zuge der DSGVO zu beachten?" [todo]

### Sicherheitslücken 
Hinter REDAXO stehen zahlreiche Entwickler und die Agentur Yakamara, die federführend die Entwicklung von REDAXO vorantreibt. In der Vergangenheit wurden Sicherheitslücken nach Bekanntgabe zeitnah und zuverlässig geschlossen.

Ein Vergleich mit Wordpress zeigt, dass REDAXO zum einen nicht das große Angriffsziel ist, es zum anderen nur geringe Sicherheitslücken gab und diese zeitnah geschlossen wurden:

https://www.cvedetails.com/vulnerability-list/vendor_id-4626/Redaxo.html
https://www.cvedetails.com/vulnerability-list/vendor_id-2337/product_id-4096/

Inoffizielle Audits, die innerhalb der Community durchgeführt wurden, bestätigen die Robustheit des REDAXO CMS in puncto Sicherheit.

Die letztendliche Sicherheit der Website hängt von vielen Faktoren ab, die über das CMS hinaus gehen:
* bspw. der professionelle Umgang mit Zugangsdaten,
* Schadsoftware, die möglicherweise beim Nutzer installiert ist,
* Einstellungen am Webserver, 
* die Qualität der Addons/Erweiterungen, die installiert werden, und
* die Qualität des Konzepts und des Programmiercodes eines Entwicklers, der REDAXO einrichtet.

### Backups

REDAXO kommt von Haus aus mit einer eingebauten Backup-Funktion. Mit dieser lassen sich, über das Cronjob-Addon, zeitgesteuerte und regelmäßige Sicherungen der Datenbank vornehmen. Sicherungen der Dateien, bspw. dem Medienpool, lassen sich über FTP oder SSH vornehmen. 

Darüber hinaus können Sicherungen auch eigenständig oder durch den Hoster vorgenommen werden. Die regelmäßige Sicherung einer Website wird, unabhängig vom CMS, dringend empfohlen.

### DSGVO

Hierzu werden zeitnah unverbindliche Empfehlungen veröffentlicht, die beschreiben, wie REDAXO einen verantwortungsbewussten Umgang mit Daten unterstützt und welche Maßnahmen vom Entwickler ergriffen werden können.

## Schutz vor Spam

> "Wir möchten keine Spam-Mails bekommen, gibt es einen entsprechenden Schutz für REDAXO?"

REDAXO bietet von Haus aus keinen zusätzlichen Spamschutz. Für einen ausreichenden Schutz vor Spam gilt es, folgende Dinge konsequent zu beachten:

1. Alle auf der Website verwendeten E-Mail-Adressen sollten bereits am Postfach einen aktivierten Spam-Filter besitzen. Dies geschieht beim Hoster / Mailserver und hat mit REDAXO nichts zu tun.
2. Alle auf der Website verwendeten Kontakt-Formulare sollten über Spamschutz-Maßnahmen verfügen. Es gibt hierfür bessere Optionen, als ein Captcha. [Für mit YForm erzeugte Kontaktformulare gibt es eine Anleitung](https://github.com/yakamara/redaxo_yform_docs/blob/master/de_de/demo_kontakt-spamschutz.md)
3. Als Faustregel für die meisten Fälle gilt: Die im PHPMailer hinterlegten Verbindungsdaten sollten so eingerichtet sein, dass Mails authentifiziert über ein SMTP-Postfach versendet werden und nicht über den Webserver. Der Webserver sollte den ungefragten Versand von E-Mails unterbinden. Näheres hierzu kann beim gewählten Hosting-Anbieter erfragt werden. 
4. Die Zugangsdaten zu REDAXO sowie dem Webserver und dem Mail-Postfach sollten vertraulich behandelt werden, um nicht in fremde Hände zu geraten.

Zudem kann ein Addon zur sog. "E-Mail obfuscation" eingesetzt werden. Dabei wird die E-Mail-Adresse vor der Ausgabe verschlüsselt und mittels JavaScript entschlüsselt. Hierfür bietet REDAXO 5 derzeit 2 Addons. Die Verwendung wird für barrierefreie Websites jedoch nicht empfohlen.

## Weitere Argumente / Ergänzungen

Vorschläge werden gerne bei [FriendsOfREDAXO auf GitHub](https://github.com/FriendsOfREDAXO/tricks/issues/) als Issue entgegengenommen.
