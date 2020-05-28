---
title: Editor-Einstellungen Visual Studio Code (VSCode)
authors: []
prio:
---



# Editor-Einstellungen Visual Studio Code (VSCode)

- [PHP - REDAXO-Coding-Standards](#vscode-php)
- [YAML - Schema für config.yml und package.yml](#vscode-yaml)
- [Nützliche Erweiterungen für VSCode](#vscode-erweiterungen)



<a name="vscode-php"></a>
## PHP - REDAXO-Coding-Standards

**Folgende Steps zur Umsetzung**
1. Pfad zum PHP-Executable einstellen
2. Erweiterung `junstyle.php-cs-fixer` installieren
3. REDAXO-Coding-Standards lokal als Datei `.php_cs.dist` speichern
4. Settings für die Erweiterung anpassen



### **Step 1**: Pfad zum PHP-Executable einstellen

Falls noch nicht geschehen muss VSCode der Pfad zum PHP-Executable mitgeteilt werden.

Folgende Einstellung in die VSCode Konfigurationsdatei `settings.json` kopieren
```
"php.validate.executablePath": "C:\\xampp\\php\\php.exe",
```

> **Hinweis:** Pfad an die eigene PHP-Umgebung anpassen!



### **Step 2**: Erweiterung `junstyle.php-cs-fixer` installieren

Die Erweiterung `junstyle.php-cs-fixer` PHP CS Fixer for Visual Studio Code [(github)](https://github.com/junstyle/vscode-php-cs-fixer.git) enthält den PHP Coding Standards Fixer [(github)](https://github.com/FriendsOfPHP/PHP-CS-Fixer)

> **Hinweis:** Die richtige Erweiterung installieren! (Suche nach _junstyle.php-cs-fixer_)



### **Step 3**: REDAXO-Coding-Standards lokal als Datei `.php_cs.dist` speichern

Aus der [REDAXO .php_cs.dist](https://raw.githubusercontent.com/redaxo/redaxo/master/.php_cs.dist) den unteren Block ab `return PhpCsFixer\Config::create()` kopieren und lokal abspeichern.

> **Hinweis:** Am besten im Extension-Verzeichnis des VSCode, z.b. `C:\Users\USERID\.vscode\extensions\.php_cs.dist`

Die folgenden Zeilen oben am Code einfügen ...
```
$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__]);
```

Und hier der gesamte Code für die `.php_cs.dist` zum CopyPasten ...
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

Die lokal abgespeicherte Datei wird im folgenden Step für die Einstellungen der Erweiterung verwendet.
Eine Kopie der Datei kann aber auch z.B. direkt im eigenen Addon-Verzeichnis gespeichert werden.



### **Step 4**: Settings für die Erweiterung anpassen

Folgende Einstellung in die VSCode Konfigurationsdatei `settings.json` kopieren

```
    "php-cs-fixer.config": ".php_cs;.php_cs.dist;C:\\Users\\USERID\\.vscode\\extensions\\.php_cs.dist",
```

> **Hinweis:** hier wird die Suchreihenfolge für die Config-Datei festgelegt, als letzter Datei-Name inkl. Pfad der oben bereits genannte.

Die Erweiterung arbeitet wie gewünscht wenn z.B. aus

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

> **Letzter Hinweis:** Die sonstigen Einstellungen für die Erweiterung nach eigenem Wohlbefinden vornehmen :)



<a name="vscode-yaml"></a>
## YAML - Schema für config.yml und package.yml

**Folgende Steps zur Umsetzung**

1. Erweiterung `redhat.vscode-yaml` installieren
2. Settings für die Erweiterung anpassen

### **Step 1**: Erweiterung `redhat.vscode-yaml` installieren

Im Marketplace nach `redhat.vscode-yaml` suchen und installieren.

YAML Language Support by Red Hat ([github](https://github.com/redhat-developer/vscode-yaml))

### **Step 2**: Settings für die Erweiterung anpassen

```
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

* `ms-ceintl.vscode-language-pack-de` - Deutsches Sprachpaket für VS Code
* `shan.code-settings-sync` - Settings Sync
* `adamvoss.vscode-languagetool` - LanguageTool Extension for Visual Studio Code
* `adamvoss.vscode-languagetool-en` - English Support for LanguageTool
* `adamvoss.vscode-languagetool-de` - German Support for LanguageTool
* `davidanson.vscode-markdownlint` - markdownlint
* `bierner.github-markdown-preview` - Github Markdown Preview
* `felixfbecker.php-intellisense` - PHP IntelliSense
* `ikappas.phpcs` - PHP CodeSniffer for Visual Studio Code



