# Eigene JS/CSS Dateien im Addon:projects

Um eigene JS/CSS Dateien in das Backend/Frontend des REDAXO CMS zur Verfügung zu stellen, sollte man das Addon: project nutzen. Das Addon: project wird bei einem Update des System nicht berücksichtig und somit bleiben die projektbezogenen Änderungen erhalten.

----------
Geeignet für Redaxo 5.x

----------

**Hinweis**

Das AddOn wird im REDAXO CMS **nur im Bereich Addons** angezeigt.

Die Daten des AddOns befinden sich unter
/redaxo/src/addons/project.

----------

**Addon: project - Struktur**

/boot.php

/package.yml

/lib/.redaxo
    
----------

**Addon: project /assets/**

Das /assets/ Verzeichnis muss noch angelegt werden

Dort können die JS/CSS Dateien abgelegt werden. Nach einen Re-Install des AddOns: project im Backend /AddOns/ werden alle dort abgelegten Dateien zusätzlich auch in das (root) /assets/addons/project/ - Verzeichnis abgelegt. Somit können diese, bei Bedarf, auch für das Frontend verwendet werden.

----------

**Eigene JS/CSS Dateien includen**

Die im project/assets/ Verzeichnis abgelegten Dateien in der boot.php einfügen

/redaxo/src/addons/project/boot.php

    <?php
    // add Files to Backend
    if (rex::isBackend() && rex::getUser()) {
        // add CSS File to backend
        rex_view::addCssFile($this->getAssetsUrl('my_backend.css'));
        // add JS File to backend
        rex_view::addJsFile($this->getAssetsUrl('my_backend.js'));
    }
    ?>

**Addon im REDAXO CMS Backend re-install**

Anschließend das AddOn: project im REDAXO CMS Backend **re-installieren**.

Danach stehen die Dateien im Backend zur Verfügung.
