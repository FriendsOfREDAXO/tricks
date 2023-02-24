---
title: Editor-Einstellungen Visual Studio Code (VSCode)
authors: [aeberhard,alxndr-w,crydotsnake,madiko,skerbis,christophboecker]
prio:
---

# Editor-Einstellungen Visual Studio Code (VSCode)

[ letztes update: 2023-02-06 ]

[Visual Studio Code](https://code.visualstudio.com/) ist ein Quelltext-Editor von Microsoft. Er kann plattformübergreifend und kostenfrei genutzt werden (Windows, macOS, Linux). 

Anfangs als schlanker Editor für die Quellcode-Entwicklung gedacht, hat sich VS Code durch seine vielen Erweiterungen zu einer vollständigen und modularen integrierten Entwicklungsumgebung (IDE) entwickelt. Durch den Verzicht auf Projektdateien kann VSCode wie ein einfacher Editor aufgerufen werden, bietet jedoch durch Quellcode-Analyse des aktuellen Ordners den Komfort großer Projektverwaltungen mit Code-Vervollständigung und Fehleranalyse.

Für die Software-Entwicklung im Kontext von REDAXO empfehlen wir:  

- [PHP - REDAXO-Coding-Standards](#vscode-php)
- [YAML - Schema für config.yml und package.yml](#vscode-yaml)
- [Nützliche Erweiterungen für VSCode](#vscode-erweiterungen)




<a name="vscode-php"></a>

## PHP - REDAXO-Coding-Standards

**Zusammenfassend werden 5 Schritte benötigt, diese werden nachfolgend genauer erläutert.**

1. [Pfad zur PHP-Executable einstellen](#vscode-php-1)
2. [Erweiterung **junstyle.php-cs-fixer** installieren](#vscode-php-2)
3. [**REDAXO-Coding-Standards** lokal im VSCode-Extension-Verzeichnis speichern](#vscode-php-3)
4. [**PHP CS Fixer: custom fixers** lokal im VSCode-Extension-Verzeichnis speichern](#vscode-php-4)
5. [Einstellungen der Erweiterungen wie gewünscht anpassen](#vscode-php-5)




<a name="vscode-php-1"></a>

### **Schritt 1**: Pfad zur PHP-Executable einstellen

Falls noch nicht geschehen muss VSCode der Pfad zur PHP-Executable mitgeteilt werden.

Folgende Einstellung in die VSCode Konfigurationsdatei `settings.json` kopieren

```
"php.validate.executablePath": "C:\\xampp\\php\\php.exe",
```

> **Hinweis:** Passe den Pfad an Deine eigene PHP-Umgebung an. Die aktuellen REDAXO-Coding-Standards erfordern PHP 8.1!




<a name="vscode-php-2"></a>

### **Schritt 2**: Erweiterung Junstyle PHP CS Fixer installieren    

Die Erweiterung [PHP CS Fixer von Junstyle](https://marketplace.visualstudio.com/items?itemName=junstyle.php-cs-fixer) für Visual Studio Code enthält den [PHP Coding Standards Fixer](https://github.com/FriendsOfPHP/PHP-CS-Fixer).

> **Hinweis:** Die richtige Erweiterung installieren! (Suche nach _junstyle.php-cs-fixer_)

![junstyle - PHP CS Fixer for Visual Studio Code](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/vscode/junstyle_phpcsfixer.png "junstyle - PHP CS Fixer for Visual Studio Code")

Die Erweiterung enthält bereits die notwendige Datei `php-cs-fixer.phar`. Diese wird als Standard verwendet.

> **Hinweis:** Unter Windows werden VSCode-Erweiterungen im folgenden Verzeichnis gespeichert: `C:\Users\[USERNAME]\.vscode\extensions\`




<a name="vscode-php-3"></a>

### **Schritt 3**: REDAXO-Coding-Standards lokal im VSCode-Extension-Verzeichnis speichern

Für die REDAXO-Coding-Standards gibt es ein eigenes Github-Repo: [https://github.com/redaxo/php-cs-fixer-config](https://github.com/redaxo/php-cs-fixer-config).

Komplettes Repo im Zip-Format unter [https://github.com/redaxo/php-cs-fixer-config/tags](https://github.com/redaxo/php-cs-fixer-config/tags) herunterladen und entpacken. 

Das entpackte Repo umbenennen in `php-cs-fixer-config` und in das VSCode-Extension-Verzeichnis kopieren/verschieben -> `C:\Users\[USERNAME]\.vscode\extensions\php-cs-fixer-config`.

Im Verzeichnis `C:\Users\[USERNAME]\.vscode\extensions\php-cs-fixer-config` eine PHP-Datei `.php-cs-fixer.php` mit folgendem Inhalt anlegen:

```php
<?php

// Custom Fixer
require __DIR__ . '/php-cs-fixer-custom-fixers/bootstrap.php';

// REDAXO Fixer
foreach( scandir($home . '/src/Fixer/') as $file ) {
    if( !str_starts_with($file,'.') && str_ends_with($file,'.php')) {
        require $home . '/src/Fixer/' . $file;
    }
}

include __DIR__ . '/src/Config.php';
$config = include __DIR__ . '/.php-cs-fixer.dist.php';
$rules = $config->getRules();

// rules al gusto verändern

$config->setRules($rules);
return $config;
```

![Verzeichnis php-cs-config-fixer](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/vscode/directory-php-cs-config-fixer.png "Verzeichnis php-cs-config-fixer")

> **Hinweis:** Den Pfad zur soeben angelegten Datei benötigen wir in Schritt 5 für die Einstellungen der Erweiterung.




<a name="vscode-php-4"></a>

### **Schritt 4**: PHP CS Fixer: custom fixers lokal im VSCode-Extension-Verzeichnis speichern

In den REDAXO-Coding-Standards sind einige Funktionen der Custom Fixers im Einsatz.
Github-Repo: [https://github.com/kubawerlos/php-cs-fixer-custom-fixers/](https://github.com/kubawerlos/php-cs-fixer-custom-fixers/)

Download im Zip-Format unter [https://github.com/kubawerlos/php-cs-fixer-custom-fixers/tags](https://github.com/kubawerlos/php-cs-fixer-custom-fixers/tags) herunterladen und entpacken.

Das entpackte Repo umbenennen in `php-cs-fixer-custom-fixers` und komplett in das Verzeichnis `C:\Users\[USERNAME]\.vscode\extensions\php-cs-fixer-config\` kopieren/verschieben.

![Verzeichnis php-cs-custom-fixers](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/vscode/directory-php-cs-custom-fixers.png "Verzeichnis php-cs-custom-fixers")




<a name="vscode-php-5"></a>

### **Schritt 5**: Settings für die Erweiterung anpassen

In den Einstellungen von VSCode nach php suchen und PHP CS Fixer auswählen.

Hier muss bei **Config** der Pfad der in Schritt 4 angelegten Datei angegeben werden

`C:\Users\[USERNAME]\.vscode\extensions\php-cs-fixer-config\.php-cs-fixer.php`

Unter **Executable Path** muss der Pfad zur Datei `php-cs-fixer.phar` angegeben werden. Siehe Screenshot.

![Einstellungen php cs fixer](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/vscode/junstyle_phpcsfixer_settings.png "Einstellungen php cs fixer")

Die Erweiterung arbeitet wie gewünscht, wenn z.B. folgender PHP-Code

```php
if ($file->getExtension()==='php') {
echo "blafasel";
}
```

wie folgt ersetzt wird ...

```php
if ('php' === $file->getExtension()) {
    echo 'blafasel';
}
```

Screenshot Ausgabe der Erweiterung

![Ausgabe php cs fixer](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/vscode/output-php-cs-fixer.png "Ausgabe php cs fixer")

> **Tipp:** Es gibt noch einige weitere Einstellungen für die Erweiterung - diese einfach nach den eigenen Wünschen konfigurieren :)





<a name="vscode-yaml"></a>

## YAML - Schema für config.yml und package.yml

**Zusammenfassend werden 2 Schritte benötigt, diese werden nachfolgend genauer erläutert.**

1. Erweiterung `redhat.vscode-yaml` installieren
2. Einstellungen für die Erweiterung anpassen

### **Schritt 1**: Erweiterung `redhat.vscode-yaml` installieren

Im Marketplace nach `redhat.vscode-yaml` suchen und installieren.

 [YAML Language Support by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)

### **Schritt 2**: Settings für die Erweiterung anpassen

```json
    "yaml.schemas": {
        "https://raw.githubusercontent.com/redaxo/redaxo/master/redaxo/src/core/schemas/config.json": [
            "/redaxo/data/core/config.yml"
        ],
        "https://raw.githubusercontent.com/redaxo/redaxo/master/redaxo/src/core/schemas/package.json": [
            "package.yml"
        ],
    },
```

> **Hinweis:** Die Schema-Dateien können auch lokal gespeichert werden und müssen dann mit `"file://C:\\Ordner\\package.json"` angegeben werden.



<a name="vscode-erweiterungen"></a>

## Nützliche Erweiterungen für VSCode

Die im Folgenden genannten PlugIns von VSCode dienen Anfänger:innen als Einstiegshilfe &mdash; ohne Anspruch auf Vollständigkeit.  
Letztes Update: 2022-07-04

### Bedien-Oberfläche

- [German Language Pack (Deutsches Sprachpaket)](https://marketplace.visualstudio.com/items?itemName=ms-ceintl.vscode-language-pack-de) von Microsoft
- [Settings Sync](https://marketplace.visualstudio.com/items?itemName=shan.code-settings-sync) (via GitHub Gist) von Shan Khan
- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) von Philipp Kief

### Rechtschreib-/Grammatik-Korrekturen für Texte

- [LanguageTool Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=adamvoss.vscode-languagetool) von Adam Voss
- [English Support for LanguageTool](https://marketplace.visualstudio.com/items?itemName=adamvoss.vscode-languagetool-en) von Adam Voss
- [German Support for LanguageTool](https://marketplace.visualstudio.com/items?itemName=adamvoss.vscode-languagetool-de) von Adam Voss
- [Simple German Support for LanguageTool (Leichte Sprache)](https://marketplace.visualstudio.com/items?itemName=adamvoss.vscode-languagetool-de-DE-x-simple-language) von Adam Voss
- weitere Sprachen suchen: [Visual Studio Code LanguageTool](https://marketplace.visualstudio.com/search?term=LanguageTool&target=VSCode&category=Other&sortBy=Name)

### Programmiersprachen übergreifend

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) von Prettier (JavaScript, TypeScript, Flow, JSX, JSON, CSS, SCSS, Less, HTML, Vue, Angular HANDLEBARS, Ember, Glimmer, GraphQL, Markdown, YAML)


### HTML und CSS

- [HTMLHint (Static Code Analysis Tool for HTML)](https://marketplace.visualstudio.com/items?itemName=HTMLHint.vscode-htmlhint) von [HTMLHint](https://github.com/htmlhint/vscode-htmlhint)

### JavaScript

- [ESLint JavaScript](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) von Microsoft


### PHP

- [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client) von Ben Mewburn
- [PHP CodeSniffer for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ikappas.phpcs) von Ioannis Kappas
- [Psalm (PHP Static Analysis Linting Machine)](https://marketplace.visualstudio.com/items?itemName=getpsalm.psalm-vscode-plugin) von Psalm
- [php cs fixer](https://marketplace.visualstudio.com/items?itemName=junstyle.php-cs-fixer) von junstyle

### MySQL

- [MySQL Management Tool](https://marketplace.visualstudio.com/items?itemName=formulahendry.vscode-mysql) von Jun Han


### Dokumentation

- [markdownlint](https://marketplace.visualstudio.com/items?itemName=davidanson.vscode-markdownlint) von David Anson
- [GitHub Markdown Preview](https://marketplace.visualstudio.com/items?itemName=bierner.github-markdown-preview) von Matt Bierner


### Datentransfer

- [sFTP](https://marketplace.visualstudio.com/items?itemName=Natizyskunk.sftp) von Natizyskunk


### Git und GitHub

- [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) von GitKraken
