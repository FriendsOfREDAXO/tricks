---
title: Offline-Artikel/Kategorien in der Opacity reduzieren
authors: [danspringer]
prio:
---

# Offline-Artikel/Kategorien in der Opacity reduzieren

Sind Artikel oder Kategorien offline, so kann man deren Darstellung seit REDAXO 5.13 in der Strukturverwaltung beeinflussen.
Mit diesem Trick kann man offline-Artikel/Kategorien in der Deckkraft reduzieren, um auf einen Blick eine bessere Übersicht über online und offline-Artikel und Kategorien zu bekommen.

![115735934-27e47f80-a38b-11eb-89c4-b8d991462ef5](https://user-images.githubusercontent.com/16903055/145254117-14a2e543-8378-4dc4-a1f5-8833808a5cef.png)

Dazu muss man im Backend ein CSS-Schnipsel unterbringen. Am einfachsten funktioniert das mit dem Theme-AddOn. Hier nutzt man die backend.css in `theme/public/assets/backend/backend.css` und ergänzt sie um folgenden CSS-Teil:

```
.rex-status[data-status="0"] td:not(.rex-table-action-no-dropdown, .rex-table-action-dropdown) {
	opacity: 0.5;
}

.rex-status[data-status="0"] td:not(.rex-table-action-no-dropdown, .rex-table-action-dropdown):hover {
	opacity: 1;
}
```

Anschließend werden die offline-Artikel/Kategorien reduziert dargestellt, werden bei einem Maus-Hover aber wieder auf 100% verstärkt.
