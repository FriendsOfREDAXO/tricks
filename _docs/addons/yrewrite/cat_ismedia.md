---
title: Was tun, wenn man auf der Website eine Kategorie Media benötigt?
authors: [IngoWinter]
prio:
---

# Was tun, wenn man auf der Website eine Kategorie Media benötigt?


Wenn es auf der Website einen Hauptmenüpunkt "Media" gibt und yrewrite die Url dafür zu `http://domain.tld/media/` umschreibt, landet man im Verzeichnis `/media`. Um das zu verhindern muss in der `.htaccess` die Zeile

- `RewriteCond %{REQUEST_FILENAME} !-d` entfernt 

- und die Zeile `RewriteCond %{REQUEST_URI} !^redaxo/.*` zu `RewriteCond %{REQUEST_URI} !^/?redaxo/?$` geändert werden.

Die zu entfernende Zeile besagt: nicht umschreiben wenn ein existierendes Verzeichnis aufgerufen wird.  

Die zu ändernde Zeile sorgt dafür, dass beim Aufruf von `http://domain.tld/redaxo` trotz der vorher entfernten Anweisung das Verzeichnis `redaxo` aufgerufen wird (und man sich somit noch im Backend einloggen kann).
