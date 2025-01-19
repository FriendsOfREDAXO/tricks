---
title: REDAXO CMS + Laragon = 🦖💚 Lokale Entwicklung in Windows
authors: [alxndr-w]
prio:
---

# REDAXO CMS + Laragon = 🦖💚

Laragon ist eine Alternative zu XAMPP/MAMP unter Windows, um eine lokale Entwicklungsumgebung für PHP-Projekte zu erstellen. 

In diesem Tutorial zeigen wir, wie du Laragon einrichtest und REDAXO CMS unter Laragon installierst.

## Vorteile

✅ Kinderleichte Installation
✅ Automatische Einrichtung der Windows .hosts-Datei und Hosts-Konfiguration in Apache
✅ Automatische SSL-Aktivierung (lokale SSL-Nutzung)
✅ Leichter Wechsel und Update der PHP-Version
✅ Serverseitige Crons mit Cronical
✅ Zuverlässiger Betrieb

Wer in XAMPP damit zu kämpfen hat, PHP zu updaten, die MySQL-Datei reparieren zu müssen und Performance-Probleme hatte, sowie lokales SSL benötigt hätte, wird in Laragon Frieden finden. :) 

## Voraussetzungen

* Windows 10ff
* Laragon >=6.0

> Hinweis: Laragon bis einschließlich Version 6 war kostenlos. Ab Version 7 gibt es eine kostenpflichtige Pro-Version. Die kostenlose Version reicht für die meisten Anwendungsfälle aus, benötigt jedoch Anpassungen, um einen Aktuellen AMP-Stack (Apache, MySQL, PHP) zu benutzen.

## Installation und Einrichtung

Nach dem [Laragon herunterladen](https://github.com/leokhoa/laragon/) und installiert ist, starte Laragon und führe folgende empfohlene Konfiguration durch:

### Einstellungen (Allgemein)

Starte Laragon automatisch mit Windows.

![image](https://github.com/user-attachments/assets/21a5b0a9-5502-4f17-829f-23262a0ee48b)

### Einstellugnen (Dienste)

Aktiviere SSL

![image](https://github.com/user-attachments/assets/46768b67-31d5-4d14-8f36-b06659e15ace)

### SSL lokal einrichten

Menü > Apache > SSL > Add Laragon to Trust Store

![image](https://github.com/user-attachments/assets/713fa18c-ebc7-4ec1-894e-1c976fa6ef9c)

### Cronical - serverseitige Cronjobs

Menü > Tools > Cron > cron.dat öffnen

![image](https://github.com/user-attachments/assets/9dcd0381-3347-41e6-8017-cdcf1388c29c)

So legst du einen Cron für REDAXO an, der jede Minute REDAXO Cronjobs triggert:

```
* * * * * C:\laragon\bin\php\php-8.3.7-Win32-vs16-x64\php.exe C:\laragon\www\example.org\bin\console cronjob:run
```

### REDAXO mit einem Klick installieren - Einrichtung

Menü > Neue Website erstellen > Konfiguration

![image](https://github.com/user-attachments/assets/6656d9d7-f718-436f-bb99-e468385ed206)

In der Textdatei folgende Zeile hinzufügen:

```
# REDAXO
REDAXO=https://redaxo.org/download/redaxo/5.18.1.zip
```

Im Dialog dann das gewünschte Projekt angeben, empfohlen ist die Domain, z.B. `example.org` - anschließend ist das Projekt unter `https://example.org.test/` erreichbar.

## PHP und andere Komponenten updaten

Variante 1: Tools > Quick Add > gewünschte PHP-Version auswählen.
Variante 2: Siehe [Laragon Wiki](https://github.com/leokhoa/laragon/wiki)

![image](https://github.com/user-attachments/assets/735d5ff6-da88-4c86-9626-10bf3d68c617)


## Abschließende Worte

Es spricht aktuell nichts dagegen, die kostenlose Variante von Laragon (Laragon 6) zu verwenden, dabei müssen die Komponenten (PHP, MySQL, Apache) jedoch manuell geupdatet werden. 

Die FriendsOfREDAXO-Community kann von einem Rabatt auf die Lifetime-Lizenz für Laragon 7 profitieren, dazu einfach [@alxndr-w](https://www.alexplus.de/) ansprechen.
