---
title: Github Pull-Request testen
authors: [bloep]
prio:
---

# Github Pull-Request testen

- [Beschreibung](#beschreibung)
- [Pull-Reuqest auschecken](#pr-auschecken)
- [Fehler mitteilen](#fehler-mitteilen)
	- [Codezeile kommentieren](#codezeile-kommentieren)
	- [Anderungen gutheißen](#aenderungen-gutheissen)


<a name="beschreibung"></a>
## Beschreibung

Nachfolgend möchte ich zeigen, wie einfach es ist, mit dem Tool [**hub**](https://hub.github.com/) Pull-Requests von Github in die lokale Entwicklungsversion von REDAXO zu laden, damit diese getestet werden können.


**Für die nächsten Schritte wird vorrausgesetzt, dass [hub](https://hub.github.com/) installiert ist.**

<a name="pr-auschecken"></a>
## Pull Request auschecken

In der REDAXO Entwicklungsversion folgenden Befehl im Terminal/Kommandozeile ausführen:

`git checkout https://github.com/<OWNER>/{REPOSITORY}/pull/{PRNUMMER}`

In diesem Beispiel:
`git checkout https://github.com/redaxo/redaxo/pull/1835`


Diese URL kann auch aus der Browser Adresszeile kopiert werden, wenn der Pull-Request geöffnet ist.


![Checkout eines Pull-Requests](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/github_pr/checkout-pr.gif "Checkout eines Pull-Requests")


**Das wars schon.**

Das Programm legt selbstständig alle notwendigen Einstellungen fest und macht einen checkout des Pull-Requests.

Im Anschluss kann direkt drauf los getestet werden.



<a name="fehler-mitteilen"></a>
## Fehler mitteilen

Es gibt mehrere Möglichkeiten gefundene Fehler in einem PullRequests mittzuteilen.

Wenn ein Fehler entdeckt wird, die Ursache aber unbekannt ist, kann einfach ein entsprechender allgemeiner Kommentar verfasst werden.


<a name="codezeile-kommentieren"></a>
### Codezeile kommentieren
Wenn man jedoch eine Idee hat oder den genauen Fehler gefunden hat, bietet es sich an, direkt den Kommentar an die entsprechende Code-Zeile zu heften.

![Code-Zeile kommentieren](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/github_pr/comment-line-plus.png "Code-Zeile kommentieren")

Dies kann über den Reiter __Files changed__ geschehen. Hier kann für die entsprechende Zeile mit dem Klick auf das "+" zeichen ein Kommentar-Bereich geöffnet werden. Hier können Probleme, die mit dieser Zeile enstehen genau diskutiert werden. Im optimalfall schlägt man direkt seine Korrektur vor.

![Code-Zeile kommentieren](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/github_pr/comment-line-filled.png "Code-Zeile kommentieren")

<a name="aenderungen-gutheissen"></a>
### Änderungen gutheißen
Wenn keine Fehler gefunden wurden kann ein Pull-Request approved werden. Dies gibt den Maintainer eine RÜckmeldung darüber, dass man mit dem PR einverstanden ist. Wenn man nicht nur den Diff nach Fehlern durchsucht hat und zusätzlich das hier beschriebene Auschecken und Testen durchgeführt hat, kann man als Kommentar für das "approven" dazu schreiben, dass man diese Änderungen getestet hat.

![Änderungen approven](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/github_pr/approve-pr.png "Änderungen approven")

