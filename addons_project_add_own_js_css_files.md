# Eigene JS/CSS Dateien im Addon:projects

Um eigene JS/CSS Dateien in das Backend/Frontend des REDAXO CMS zur Verfügung zu stellen, sollte man das Addon: project nutzen. Das Addon: project wird bei einem Update des System nicht berücksichtig und somit bleiben die projektbezogenen Änderungen erhalten.

----------
Geeignet für Redaxo 5.x

----------

**Hinweis**

Das AddOn wird nur im Bereich **Addons** im Backend angezeigt. Die Dateien des Addons befinden sich unter
/redaxo/src/addons/project.

----------

**Addon: project - Struktur**

/boot.php
/package.yml
/lib/.redaxo
    
----------

**Addon: project /assets/**

Das /assets/ Verzeichnis muss noch angelegt werden. Dort können die JS/CSS Dateien abgelegt werden. Nach einen Re-Install des AddOns: project im Backend /AddOns/ werden alle dort abgelegten Dateien zusätzlich auch in das (root) /assets/addons/project/ - Verzeichnis abgelegt. Somit könenn diese, bei Bedarf auch für das Frontend verwendet werden.

----------

**Eigene JS/CSS Dateien includen**

<?php
echo 'foo';

?>

