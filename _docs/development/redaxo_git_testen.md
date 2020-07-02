---
title: REDAXO Entwicklerversion testen mit PLESK
authors: [skerbis]
prio:
---

# REDAXO Entwicklerversion testen mit PLESK

> Entwicklerversionen aus GitHub sollten ausschließlich zu Testzwecken und zur Unterstützung bei der Entwicklung installiert werden. Ein produktiver Einsatz wird nicht empfohlen. 

In PLESK kann man mit wenigen Schritten die Entwicklerversion von REDAXO aus GitHub installieren und auf den aktuellen Stand halten. 
Man kann auch zwischen den Branches switchen um schnell mal einen offenen PR zu testen.  

![Screenshot](https://github.com/FriendsOfREDAXO/tricks/blob/master/screenshots/rex_git1.png?raw=true)

Bei der Einrichtung einer Domain / Webspace skrollt man nach unten und wählt:
- `Unterstützung von Git aktivieren` 
- anschließend `Git Remote-Hosting wie GitHub oder Bitbucket`
- unter `Git Remote-Repository` gibt man https://github.com/redaxo/redaxo ein
 
 - Jetzt muss noch der Zielordner festgelegt werden. 
 - Damit die Website immer synchron mit dem REDAXO Repo bleibt wählt man: `Dateien aus dem Repository werden automatisch bereitgestellt

Nach Bestätigung mit OK, werden der Webspace angelegt und die Dateien aus dem REPO abgeholt. 

Jetzt kann nach Anlage der Datenbank die Installation wie gewohnt ausgeführt werden. 

Die REDAXO-Einstellungen und auch AddOn-Installationen werden nicht durch den Sync überschrieben. 

![Screenshot](https://github.com/FriendsOfREDAXO/tricks/blob/master/screenshots/rex_git2.png?raw=true)

Möchte man einen aktuellen PR testen kann man vom Master-Branch zum PR-Branch wechseln wie auch wieder zurück. 
Per Pull holt man sich dann den gewünschen Branch. 
Bislang habe ich hierbei "noch" keine Probleme feststellen können. Es empfiehlt sich dennoch einen Backupjob in Plesk anzulegen. 

![Screenshot](https://github.com/FriendsOfREDAXO/tricks/blob/master/screenshots/plesk_composer.png?raw=true)
Tipp: 
Da Plesk auch Composer unterstützt, kann es sich auch um die Vendoren kümmern. So kann man auch ein Vendor-Update testen. 
