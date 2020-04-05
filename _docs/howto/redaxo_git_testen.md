---
title: REDAXO Entwicklerversion testen mit PLESK
authors: [skerbis]
prio:
---

# REDAXO Entwicklerversion testen mit PLESK

In PLESK kann man mit wenigen Schritten die Entwicklerversion von REDAXO aus GitHub installieren und auf den aktuellen Stand halten. 
Man kann auch zwischen den Branches switchen um schnell mal einen offenen PR zu testen.  

![Screenshot](https://github.com/FriendsOfREDAXO/tricks/blob/master/screenshots/rex_git1.png?raw=true)

Bei der Einrichtung einer Domains / Webspace skrollt man nach unten und wählt:
- `Unterstützung von Git aktivieren` 
- anschließend `Git Remote-Hosting wie GitHub oder Bitbucket`
- unter `Git Remote-Repository` gibt man https://github.com/redaxo/redaxo ein
 
 Jetzt muss noch der Zielordner festgelegt werden und damit die Website immer synchron mit dem REDAXO Repo bleibt wählt man: `Dateien aus dem Repository werden automatisch bereitgestellt

Nach Bestätigung mit OK, werden der Webspace angelegt und die Dateien aus dem REPO abgeholt. 

Jetzt kann nach Anlage der Datenbank die Installation ausgeführt werden. 

Die REDAXO-Einstellungen und auch AddOn-Installationen werden nicht durch den Sync überschreiben. 

![Screenshot](https://github.com/FriendsOfREDAXO/tricks/blob/master/screenshots/rex_git2.png?raw=true)

Möchte man einen aktuellen PR testen kann man vom Master-Branch zum PR-Barnch wechseln wie auch wieder zurück. 
Per Pull holt man sich dann den gewünschen Branch. 
Bislang habe ich hierbei "noch" keine Probleme feststellen können. 



