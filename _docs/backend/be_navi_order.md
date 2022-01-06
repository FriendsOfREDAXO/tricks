---
title: Reihenfolge der Backend Navigation ändern
authors: [IngoWinter]
prio:
---

## Reihenfolge der Backend Navigation ändern

In der Backend Navigation steht immer der Abschnitt "Hauptmenü" an erster Stelle, gefolgt vom Abschnitt "Addons". Danach werden benutzerdefinierte Abschnitte eingefügt, z.B. ein eigenes Addon "tricks" oder die YCom Tabellen. 
Diese Reihenfolge kann man über den EP `PAGE_NAVIGATION` anpassen. Ein Dump des Nav Objekts in diesem EP sieht so aus:

![be_nav_order](https://user-images.githubusercontent.com/7223820/148100261-606e6c7b-fb4c-4af3-af8d-fcb369a5dfc5.png)

"Hauptmenü" und "Addons" haben eine definierte Priorität und werden deswegen zuerst dargestellt. Der Rest hat keine Priorität und kommt danach.
Folgender Code weist dem Addon "tricks" die Prio 1 zu - damit wird es oberhalb des Hauptmenüs dargestellt:

```php
rex_extension::register('PAGE_NAVIGATION', function (rex_extension_point $ep) {
    /** @var $nav rex_be_navigation */
    $nav = $ep->getSubject();
    $nav->setPrio('tricks', 1);
    $ep->setSubject($nav);
});
```
## Backend-Navigation im eigenen Addon festlegen

In der `package.yml` eines jeden Addons lassen sich beliebige Backend-Seiten erstellen, die dann im Addon-Bereich oder sogar als Eintrag im Hauptemnü erscheinen. Beispiel:

```yml
pages:
    project:
        title: translate:project
        main: true
        block: system
        prio: 15
        subpages: 
            settings:
            ...
```

> Hinweis: Das Hauptmenü (`block: system`) hat Menüpunkte im Abstand von 10er-Schritten. `prio: 15` fügt den eigenen Menüpunkt als zweites zwsichen Struktur und Medienpool.

> Hinweis: Ein eigener Abschnitt mit Zwischenüberschrift wird im Hauptmenü erzeugt, wenn man einen eigenen neuen `block`-Eintrag definiert. YCom macht z.B. davon Gebrauch.
