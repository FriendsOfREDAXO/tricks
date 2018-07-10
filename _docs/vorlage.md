---
title: Seitenüberschrift
authors: []
prio:
---

# Seitenüberschrift

- [Kopfbereich](#kopfbereich)
- [Überschriften](#ueberschriften)
- [Links](#links)
- [Bilder](#bilder)
- [Listen](#listen)
- [Tabellen](#tabellen)
- [Code](#code)
- [Hinweise](#hinweise)
- [Anker 3](#anker-3)
    - [Anker 3a](#anker-3a)
    - [Anker 3b](#anker-3b)
    - [Anker 3c](#anker-3c)
- [Anker 4](#anker-4)


<a name="kopfbereich"></a>
## Kopfbereich

1. Seitenüberschrift als h1 auszeichnen
2. TOC Liste mit Anker erstellen, Die erste Ebene wird im Text mit `h2` die zweite Ebene mit `h3` ausgezeichnet

**Beispiel**

    # Seitenüberschrift
    
    - [Überschrift](#anker-zur-ueberschrift)
    - [Anker 2](#anker-2)
        - [Anker 2a](#anker2a)
    - [Anker 3](#anker-3)
        - [Anker 3a](#anker-3a)
        - [Anker 3b](#anker-3b)
        - [Anker 3c](#anker-3c)
    - [Anker 4](#anker-4)


<a name="ueberschriften"></a>
## Überschriften mit Anker setzen

**Beispiel**

    <a name="anker-zur-ueberschrift"></a>
    ## Überschrift

 
<a name="links"></a>
## Links
Links bitte immer mit Beschreibung angeben

**Beispiel**

    [REDAXO Loader - REDAXO laden und entpacken](install_redaxo_loader.md)


<a name="bilder"></a>
## Bilder

Bilder bitte im Ordner `/screenshots` hinterlegen. Damit sie danach sowohl auf der Tricks-Website als auch in der Artikelansicht auf GitHub funktionieren, müssen sie mit absoluter URL referenziert werden. Die Basis-URL dafür lautet __`https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/`__, und ein Bild würdest du etwa so referenzieren:

	![Bild 1](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/bild1.jpg "Bild 1")


<a name="listen"></a>
## Listen

**Beispiel**

    - Listenpunkt 1
    - Listenpunkt 2
    - Listenpunkt 3
    - Listenpunkt 4


<a name="tabellen"></a>
## Tabellen

**Beispiel**

```
Alt                   | Neu
--------------------- | -----------------------
`$REX['SERVERNAME']`  |  `rex::getServername()`
```


<a name="code"></a>
## Code

    Zur Code-Auszeichnung bitte ``` verwenden

**Beispiel Code Block**
    
```php 
<?php
$article = rex_article::get();
```
   
**Beispiel Code Inline**

Code innerhalb eines Text wird `ganz normal` ausgezeichnet
 

<a name="hinweise"></a>
## Hinweise

Hinweise werden später blau unterlegt.

    > **Hinweis:** Zweitens: ich habe erklärt mit diese zwei Spieler: nach Dortmund brauchen vielleicht Halbzeit Pause. Ich habe auch andere Mannschaften gesehen in Europa nach diese Mittwoch. Ich habe gesehen auch zwei Tage die Training.

> **Hinweis:** Zweitens: ich habe erklärt mit diese zwei Spieler: nach Dortmund brauchen vielleicht Halbzeit Pause. Ich habe auch andere Mannschaften gesehen in Europa nach diese Mittwoch. Ich habe gesehen auch zwei Tage die Training.


