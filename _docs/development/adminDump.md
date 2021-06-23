---
title: Daten Dump nur für Admins
authors: [marcohanke]
prio:
---

# Dump
Zum Entwicklen aber auch zum debuggen gibt es in Redaxo die nette Function `dump();`. Mit `dump($deineVariable)` bekommt man die Daten der Variable (oder auch eines Arrays) schick formatiert angezeigt. Arbeite man im Livesystem oder deployed eine Website sollten alle dumps auskommentiert oder gelöscht werden da sie sonst für den Website Besucher sichtbar sind.


## Dump nur für Admins
`dump()` ist nicht nur zum Entwickeln sondern auch beim Debuggen hilfreich.
Mit der folgenden Funkton wird die Ausgabe nur angemeldeten Administratoren angezeigt.

```
$var, $public = false) {
    if ($public == true) {
        dump($var);
    } elseif (rex_backend_login::createUser() && rex::getUser()->isAdmin()) {
        dump($var);
    }
}
```
Im Code nutzt man statt `dump()` nun `adump()` um die Ausgabe auch für andere Besucher sichtbar zu machen hängt man den Paramter `true`an. `dump($variable, true);`
