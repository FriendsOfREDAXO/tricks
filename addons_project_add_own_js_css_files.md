# Eigene JS/CSS Dateien im Addon:projects

Um eigene JS/CSS Dateien in das Backend/Frontend des REDAXO CMS zur Verfügung zu stellen, sollte man das Addon: project nutzen. Das Addon: project wird bei einem Update des System nicht berücksichtig und somit bleiben die projektbezogenen Änderungen erhalten.

----------
Geeignet für Redaxo 5.x

----------
**Hinweis**
Das AddOn wird nicht im Backend angezeigt und befindet sich unter
/redaxo/src/addons/project.

----------
**Addon: project - Struktur**

/boot.php
/package.yml
/lib/.redaxo
    
----------
**Addon: project /assets**
Das /assets/ Verzeichnis muss noch angelegt werden. Dort werden die JS/CSS Dateien abgelegt. Nach einen Re-Install des AddOns: project im Backend /AddOns/ werden alle dort abgelegten Dateien auch in das (root) /assets/addons/project/ - Verzeichnis abgelegt.

