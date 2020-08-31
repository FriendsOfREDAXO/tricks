---
title: Ycom Login bei Wechsel der Subdomain erhalten
authors: [staabm, dtpop]
prio: 1
---

# Ycom Login bei Wechsel der Subdomain erhalten

Bei der Webentwicklung hat man es nicht nur mit HTML und CSS, ein bisschen PHP, Datenbanken und Javascript zu tun. Manchmal kommen einem so Sachen wie Authentifizierung und Cookies in die Quere.

## Die Aufgabenstellung

Sprache 1: de.diedomain.de

Sprache2: en.diedomain.de

Wenn man sich in der Sprache 1 in die Community (ycom) eingeloggt hat, war man nach dem Wechsel in die Sprache 2 wieder ausgeloggt.

## Die Lösung

Markus schrieb auf meine Frage:

> „Domain vs. Subdomain kannst du erreichen wenn du in der config im redaxo die Session Domain richtig einstellst
d.h. dass der Cookie nur auf die Top-Domain gesetzt wird und somit auch für Dubdomains gültig ist.“

Toll, dass es Slack gibt und toll, dass es Markus gibt. Danke!

Die fragliche und anzupassende Datei findet sich unter
`redaxo/data/core/config.yml`

Dort findet ihr folgende zwei Zeilen:
```
frontend:
        cookie: { lifetime: null, path: null, domain: null, secure: null, httponly: true, samesite: Strict }
```
        
Die zweite Zeile ändert ihr in
        `cookie: { lifetime: null, path: null, domain: diedomain.de, secure: null, httponly: true, samesite: Lax }`

Dann funktioniert euer Community Login schonmal. Auch über den Sprachwechsel hinweg. Das könnt ihr im Browser prüfen. Der Cookie wird jetzt nicht mehr auf de.diedomain.de gesetzt, sondern auf .diedomain.de.

Eigenartigerweise funktioniert jetzt der Backend Login nicht mehr. Damit dieser wieder funktioniert, ändert ihr bitte die Zeile, die für das Backend gilt identisch ab.

Umgebung war hier REDAXO 5.11 und ycom 4.0.3.
