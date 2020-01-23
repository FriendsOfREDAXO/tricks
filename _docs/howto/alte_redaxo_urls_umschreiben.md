---
title: Alte (und andere) REDAXO-URLs automatisch umschreiben
authors: [dtpop]
prio:
---

# Alte (und andere) REDAXO-URLs automatisch umschreiben

- [Einleitung](#einleitung)
- [Lösung](#loesung)

<a name="einleitung"></a>
## Einleitung

Manche Rewrites lassen sich nur schwer per htaccess lösen. Auch eine Tabelle von alten und neuen URLs zu erstellen ist manchmal mühsam. Dies betrifft auch die alte URL-Form `15-0-Ich-bin-der-tollste-REDAXOtipp.html`.
Wenn sich so ein Artikel irgendwo in der Struktur versteckt, kommt man so gut wie gar nicht an die neue URL dran. Es geht doch - man braucht dazu einen Dreizeiler.

<a name="loesung"></a>
## Lösung

Die Lösung kommt in den 404er-Artikel. Entweder als PHP-Modul oder als eigenes Modul. Wenn der 404er-Artikel ausgeführt wird, ist der Statuscode ja noch nicht verschickt. Da können wir uns also noch eben schnell einklinken und schauen, ob noch was zu retten ist.
Diese Lösung funktioniert natürlich nur, wenn die Artikel-Ids von alter Seite zur neuen Seite gleich geblieben sind, also eine Migration von R4 zur R5 mit dem YConverter durchgeführt wurde.

```php
$url = trim($_SERVER['REQUEST_URI'],'/');
if (preg_match('%(\d+)-(\d+)-.*?\.html%',$url,$matches)) {
    // Die alte Artikel-Id steht jetzt in $matches[1], die Sprache steht in $matches[2]
    // Achtung! - falls die Sprache benötigt wird, REX5 fängt mit Id 1 an, REX4 war es noch die 0
    // hier eventuell eine weitere Prüfung durchführen, ob der Artikel existiert, online ist usw.
    rex_response::setStatus(301);
    rex_redirect($matches[1]);
}
```

Man kann diesen Trick auch für andere URL-Umschreibungen verwenden.
