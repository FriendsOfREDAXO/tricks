# Addons entwickeln

- [Allgemein](#allgemein)
- [Tools](#tools)
- [Struktur](#struktur)
- [Code](#code)

<a name="allgemein"></a>

## Allgemein

Für die Entwicklung von Addons stehen zahlreiche Tools bereit, sowohl im Core als auch als Addon. 

<a name="tools"></a>

## Tools

Nützliche Addons:
- [Demo Addon](https://github.com/FriendsOfREDAXO/demo_addon)
- [Addon Viewer](https://github.com/gupi/addon_viewer)
- [Addon Template](https://redaxo.org/download/addons/template/) - legt eine komplette Struktur an, mit der man dann weiterarbeiten kann

<a name="struktur"></a>

## Struktur

Folgendes Beispiel zeigt die Struktur beispielhaft:

**Beispiel**

    # Folderstruktur
    
    - assets - Container für alle Dateien, die bei der Nutzng des Addons benötigt werden.
    - scss - Container für alle CSS Dateien, die von dem Addon im Betrieb benötigt werden.
    - functions -	Dieser Ordner wird derzeit in den System-Addons "mediapool" und "structure" genutzt. Die enthaltenen Dateien werden über "boot.php" nur im Backend eingebunden. Möglicherweise ist dies der Grund weshalb die enthaltenen Date nicht im Odner "lib" abgelegt wird.
    - vendor - Container für fremde Klassenbiblitheken und Frameworks, die das Addon benötigt bzw. zur Verfügung stellt. Dies geschieht nicht automatisch, die Inhalte müssen über "boot.php" bereitgestellt werden.
    - lib - Alle hier enthaltenen PHP-Dateien werden automatisch eingebunden. Deshalb gehören die Klassen- und Funktionsdateien in diesen Ordner. Für die automatische Einbindung sind keine besonderen Namensregeln zu beachten.
    - lang - Container für alle Übersetzungstabellen, die von dem Addon bei der Installation und der späteren Ausführung benötigt werden.
    - pages
        - index.php (wird automatisch ausgeführt)
    - plugins - Container für alle "Plugin"- Ordner, also Erweiterungen/Addons zu diesem Addon.
    - module - Transportcontainer für Module, die das Addon benötigt. Die Module müssen manuell (siehe yform-Addon) oder über die install.sql in die Datenbanktabelle rex_module übertragen werden.
    - data - Dies ist der Transportcontainer für alle Dateien und Ordner, die das Addon in "redaxo/data/addons/$addon" ablegen möchte. Das "Ablegen" der Daten wird mit "install.php" gesteuert: rex_dir::copy($this->getPath('data'), $this->getDataPath());
    
    ## Dateien
    
    - help.php - Diese Datei steuert die Hilfe-Ausgabe in "Backend/Hauptmenü/AddOns"
    - install.php	- Diese Datei wird bei der Installation des Addons abgearbeitet
    - install.sql	Diese Datei steuert den Umgang mit Datenbanken für das Addon, natürlich nur wenn das Addon auch Datenbanktabellen anlegen, ändern und/oder befüllen muss.
    - uninstall.sql	Diese Datei bereinigt Datenbanken bei der de-Installation des Addons, löscht Daten und/oder Tabellen bzw. macht bei der Installation vorgenommene Feldänderungen rückgängig.
    - package.yml - (notwendig) Diese Datei enthält die benötigeten Informationen zur Konfiguration des Addons
    - boot.php - Diese Datei steuert beim Start des Addons alle weiteren, über "package.yml" hinausgehenden, benötigten Aktivitäten. Hier werden, bei Bedarf, auch eigene Funktionen an vorhandene Extension-Points gebunden (registriert). Siehe:Dokumentation

<a name="code"></a>

## Code

**Beispiel info.php**
    
        <?php
        // Der Key der Subpage in der package.yml musst mit dem Dateinamen übereinstimmen, damit die Seite aufgerufen wird
        includeCurrentPageSubPath();
        


