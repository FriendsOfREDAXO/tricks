---
title: Editor-Einstellungen Visual Studio Code (VSCode)
authors: [aeberhard,alxndr-w,crydotsnake,madiko,skerbis]
prio:
---

# Editor-Einstellungen Visual Studio Code (VSCode)

[ letztes update: 2022-07-04 ]

[Visual Studio Code](https://code.visualstudio.com/) ist ein Quelltext-Editor von Microsoft. Er kann plattformübergreifend und kostenfrei genutzt werden (Windows, macOS, Linux). 

Anfangs als schlanker Editor für die Quellcode-Entwicklung gedacht, hat sich VS Code durch seine vielen Erweiterungen zu einer vollständigen und modularen integrierten Entwicklungsumgebung (IDE) entwickelt. Durch den Verzicht auf Projektdateien kann VSCode wie ein einfacher Editor aufgerufen werden, bietet jedoch durch Quellcode-Analyse des aktuellen Ordners den Komfort großer Projektverwaltungen mit Code-Vervollständigung und Fehleranalyse.

Für die Software-Entwicklung im Kontext von REDAXO empfehlen wir:  
- [PHP - REDAXO-Coding-Standards](#vscode-php)
- [YAML - Schema für config.yml und package.yml](#vscode-yaml)
- [Nützliche Erweiterungen für VSCode](#vscode-erweiterungen)


<a name="vscode-php"></a>

## PHP - REDAXO-Coding-Standards

**Zusammenfassend werden 4 Schritte benötigt, diese werden nachfolgend genauer erläutert.**

1. [Pfad zur PHP-Executable einstellen](#vscode-php-1)
2. [Erweiterung **junstyle.php-cs-fixer** installieren](#vscode-php-2)
3. [REDAXO-Coding-Standards lokal als Datei **.php_cs.dist** speichern](#vscode-php-3)
4. [Einstellungen der Erweiterungen wie gewünscht anpassen](#vscode-php-4)


<a name="vscode-php-1"></a>

### **Schritt 1**: Pfad zur PHP-Executable einstellen

Falls noch nicht geschehen muss VSCode der Pfad zur PHP-Executable mitgeteilt werden.

Folgende Einstellung in die VSCode Konfigurationsdatei `settings.json` kopieren

```
"php.validate.executablePath": "C:\\xampp\\php\\php.exe",
```

> **Hinweis:** Passe den Pfad an Deine eigene PHP-Umgebung an.


<a name="vscode-php-2"></a>

### **Schritt 2**: Erweiterung **PHP CS Fixer** installieren

Die Erweiterung [PHP CS Fixer von Junstyle](https://marketplace.visualstudio.com/items?itemName=junstyle.php-cs-fixer) für Visual Studio Code enthält den [PHP Coding Standards Fixer](https://github.com/FriendsOfPHP/PHP-CS-Fixer).

> **Hinweis:** Die richtige Erweiterung installieren! (Suche nach _junstyle.php-cs-fixer_)


<a name="vscode-php-3"></a>

### **Schritt 3**: REDAXO-Coding-Standards lokal als Datei `.php_cs.dist` speichern

Aus der [REDAXO .php_cs.dist](https://raw.githubusercontent.com/redaxo/redaxo/master/.php_cs.dist) den unteren Block ab `return PhpCsFixer\Config::create()` kopieren und lokal abspeichern.

// NOTIZ [madiko]: Bitte Link aktualisieren //

> **Hinweis:** Am besten im Extension-Verzeichnis des VSCode, z.b. `C:\Users\USERID\.vscode\extensions\.php_cs.dist`

Die folgenden Zeilen oben am Code einfügen ...

```php
$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__]);
```

Nachfolgenden Code in die **.php_cs.dist** zum kopieren;

```php
<?php

// REDAXO-Coding-Standards
// kann z.B. mit PHPStorm, oder mit VS Code mit der Extension `php cs fixer` verwendet werden
// https://github.com/redaxo/redaxo/blob/master/.php_cs.dist

$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__]);

return PhpCsFixer\Config::create()
    ->setUsingCache(true)
    ->setRiskyAllowed(true)
    ->setRules([
        '@Symfony' => true,
        '@Symfony:risky' => true,
        '@PHP71Migration' => true,
        '@PHP71Migration:risky' => true,
        '@PHPUnit75Migration:risky' => true,
        'array_indentation' => true,
        'blank_line_before_statement' => false,
        'braces' => ['allow_single_line_closure' => false],
        'comment_to_phpdoc' => true,
        'concat_space' => false,
        'declare_strict_types' => false,
        'function_to_constant' => ['functions' => ['get_class', 'get_called_class', 'php_sapi_name', 'phpversion', 'pi']],
        'heredoc_to_nowdoc' => true,
        'list_syntax' => ['syntax' => 'short'],
        'logical_operators' => true,
        'native_constant_invocation' => false,
        'no_blank_lines_after_phpdoc' => false,
        'no_null_property_initialization' => true,
        'no_php4_constructor' => true,
        'no_superfluous_elseif' => true,
        'no_unreachable_default_argument_value' => true,
        'no_useless_else' => true,
        'no_useless_return' => true,
        'ordered_class_elements' => ['order' => [
            'use_trait',
            'constant_public',
            'constant_protected',
            'constant_private',
            'property',
            'construct',
            'phpunit',
            'method',
        ]],
        'php_unit_internal_class' => true,
        'php_unit_method_casing' => true,
        'php_unit_set_up_tear_down_visibility' => true,
        'php_unit_test_case_static_method_calls' => true,
        'phpdoc_no_package' => false,
        'phpdoc_order' => true,
        'phpdoc_types_order' => false,
        'phpdoc_var_annotation_correct_order' => true,
        'phpdoc_var_without_name' => false,
        'psr4' => false,
        'semicolon_after_instruction' => false,
        'static_lambda' => true,
        'string_line_ending' => true,
        'void_return' => false,
        'yoda_style' => true,
    ])
    ->setFinder($finder)
;
```

Die lokal abgespeicherte Datei wird im folgenden Schritt für die Einstellungen der Erweiterung verwendet.  
Eine Kopie der Datei kann aber auch z.B. direkt im eigenen Addon-Verzeichnis gespeichert werden.


<a name="vscode-php-4"></a>

### **Schritt 4**: Settings für die Erweiterung anpassen

Folgende Einstellung in die VSCode Konfigurationsdatei `settings.json` kopieren

```
    "php-cs-fixer.config": ".php_cs;.php_cs.dist;C:\\Users\\USERID\\.vscode\\extensions\\.php_cs.dist",
```

> **Hinweis:** hier wird die Suchreihenfolge für die Config-Datei festgelegt, als letzter Datei-Name inkl. Pfad der oben bereits genannte.

Die Erweiterung arbeitet wie gewünscht, wenn z.B. aus

```php
if ($file->getExtension()==='php') {
echo "blafasel";
}
```

folgendes ersetzt wird

```php
if ('php' === $file->getExtension()) {
    echo 'blafasel';
}
```

> **Tipp:** Es gibt noch einige weitere Einstellungen für die Erweiterung  - diese einfach nach den eigenen Wünschen konfigurieren :)


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
