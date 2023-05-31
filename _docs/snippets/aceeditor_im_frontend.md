---
title: AceEditor im Frontend einbinden
authors: [aeberhard]
prio:
---

# AceEditor im Frontend einbinden

Das AddOn **aceeditor** (https://github.com/FriendsOfREDAXO/aceeditor) muss natürlich installiert sein. Getestet mit der Version 1.0.3.

Das AddOn **aceeditor** hat keine Abhängigkeiten zu jQuery (nur im Backend) und kann daher recht einfach auch im Frontend ohne jQuery verwendet werden.

> **Hinweis:** Weitere Informationen zum AceEditor gibt es hier: [https://ace.c9.io/](https://ace.c9.io/)

## CSS einbinden

Falls der **Fullscreen-Modus** benötigt wird muss auf der Website zusätzlich im HEAD-Bereich das dafür notwendige Stylesheet geladen werden.

Entweder als externes Stylesheet mit <link>

```php
<link rel="stylesheet" type="text/css" href="<?= rex_addon::get('aceeditor')->getAssetsUrl('css/aceeditor.min.css') ?>" />
```

oder als Inline-Style mit

```php
<style><?= rex_file::get(rex_addon::get('aceeditor')->getAssetsPath('css/aceeditor.min.css')) ?></style>
```

## Optionen für den AceEditor

Im Backend werden die Standard-Optionen aus den AddOn-Einstellungen verwendet. Diese stehen nicht automatisch im Frontend zur Verfügung.

Die Standard-Optionen können über folgendes Snippet für die Website gesetzt und entsprechend angepasst werden (im HEAD-Bereich)

```js
<script>
    var rex = '{"aceeditor_defaulttheme": "eclipse", "aceeditor_defaultdarktheme": "dracula", "aceeditor_options": { "showLineNumbers": true, "showGutter": true, "showInvisibles": false, "fontSize": 15, "mode": "ace/mode/php", "displayIndentGuides": false, "highlightIndentGuides": false}}';
</script>
```

## Textarea für den AceEditor definieren

Im Backend werden die entsprechenden Textareas automatisch umgewandelt z.B. bei Themes und Modulen.

Im Frontend bietet es sich an auch über die Klasse `aceeditor` die Textareas für den AceEditor auszuwählen.

```html
<textarea id="phpinput" class="aceeditor"
    rows="10" cols="50" readonly
    aceeditor-width="800px" aceeditor-height="300px"
    aceeditor-theme="chaos" aceeditor-mode="php"
    aceeditor-options='{"showLineNumbers": true, "showGutter": true}'
>Hier der PHP-Code ...</textarea>
```

Über Attribute der Textarea kann das Verhalten und Aussehen des AceEditors geändert werden.

**Mögliche Attribute**

| Attribut | Mögliche Werte |
|--------- | -------------- |
| aceeditor-theme | Name des Themes z.B. `eclipse` (ohne ace/theme) |
| aceeditor-themedark | Name des Themes im Dark-Mode z.B. `dracula` (ohne ace/theme) |
| aceeditor-mode | Sprache für das Syntax-Highlighting z.B. `php`, `json`, `html` (ohne ace/mode) |
| aceeditor-options | Weitere Optionen für den AceEditor.<br>Achtung: Die Optionen müssen im korrekten JSON-Format angegeben werden!<br>z.B. `{"showLineNumbers": true, "showGutter": true}` |
| aceeditor-width | Breite des Editors, z.B. `800px`, `100%` |
| aceeditor-height | Höhe des Editors, z.B. `500px` |
| readonly | Durch das Attribut `readonly` wird der ReadOnly-Modus gesetzt |
| cols | Anzahl Spalten, wenn keine Breite angegeben wird (`aceeditor-width`), wird die Breite anhand der FontSize errechnet |
| rows | Anzahl Zeilen, wenn keine Höhe angegeben wird (`aceeditor-height`), wird die Höhe anhand der FontSize errechnet |

> **Hinweis:** Wird keine Breite angegeben (`aceeditor-width` oder `cols`) wird `100%` als Default verwendet. Wird keine Höhe angegeben (`aceeditor-height` oder `rows`) wird `200px` als Default verwendet.

## AceEditor-Scripte einbinden

Um den AceEditor nutzen zu können müssen noch die beiden folgenden Scripte eingebunden werden.

```php
<script src="<?= rex_addon::get('aceeditor')->getAssetsUrl('vendor/aceeditor/ace.js') ?>"></script>
<script src="<?= rex_addon::get('aceeditor')->getAssetsUrl('js/aceeditor.min.js') ?>"></script>
```

> **Hinweis:** `ace.js` stellt den Editor bereit. `aceeditor.min.js` stellt die Function `textAreaToAceEditor(textarea)` bereit um Textareas in einen AceEditor umzuwandeln.

## AceEditor anwenden

Den AceEditor auf eine Textarea mit ID `phpinput` anwenden

Beispiel:

```js
<!-- AceEditor auf eine Textarea über die ID `phpinput` anwenden -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    editor = textAreaToAceEditor(document.getElementById('phpinput'));
    // hier können noch weitere Optionen gesetzt werden
    // z.B. editor.setOptions()
});
</script>
```

Den AceEditor auf alle Textareas mit der Klasse `aceeditor` anwenden

Beispiel:

```js
<!-- AceEditor auf alle Textareas mit der Klasse `aceeditor` anwenden -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    let aceTextAreas = document.querySelectorAll('textarea.aceeditor');
    if (aceTextAreas.length > 0) {
        for (var i = 0; i < aceTextAreas.length; i++) {
            let textArea = aceTextAreas[i];
            editor = textAreaToAceEditor(textArea);
            // hier können noch weitere Optionen gesetzt werden
            // z.B. editor.setOptions()
        }
    }
});
</script>
```

## HTML-Beispiel

Hier für die bessere Übersicht ein komplettes HTML-Beispiel für die Einbindung des AceEditors im Frontend.

```html
<!DOCTYPE html>
<html lang="de">
<head>

    <meta charset="utf-8" />
    <title>Titel der Website</title>

    <!-- AceEditor-Style für Fullscreen-Modus (optional) -->
    <style><?= rex_file::get(rex_addon::get('aceeditor')->getAssetsPath('css/aceeditor.min.css')) ?></style>

    <!-- Optionen für den AceEditor (optional) -->
    <script>
        var rex = '{"aceeditor_defaulttheme": "eclipse", "aceeditor_defaultdarktheme": "dracula", "aceeditor_options": { "showLineNumbers": true, "showGutter": true, "showInvisibles": false, "fontSize": 15, "mode": "ace/mode/php", "displayIndentGuides": false, "highlightIndentGuides": false}}';
    </script>

</head>

<body>

    <div class="content">

        <!-- Textarea für den AceEditor mit ID `phpinput` -->
        <textarea id="phpinput"
            rows="10" cols="50" readonly
            aceeditor-width="800px" aceeditor-height="300px"
            aceeditor-theme="eclipse" aceeditor-mode="php"
            aceeditor-options='{"showLineNumbers": true, "showGutter": true}'
        >&lt;?php
function nfact($n) {
    if ($n == 0) {
        return 1;
    }
    else {
        return $n * nfact($n - 1);
    }
}

echo "\n\nPlease enter a whole number ... ";
$num = trim(fgets(STDIN));

// ===== PROCESS - Determing the factorial of the input number =====
$output = "\n\nFactorial " . $num . " = " . nfact($num) . "\n\n";
echo $output;</textarea>

        <!-- Textarea für den AceEditor mit Class `aceeditor` -->
        <textarea class="aceeditor"
            rows="10" cols="50"
            aceeditor-width="100%" aceeditor-height="500px"
            aceeditor-theme="dracula" aceeditor-mode="php"
            aceeditor-options='{"showLineNumbers": true, "showGutter": true}'
        >&lt;?php
function nfact($n) {
    if ($n == 0) {
        return 1;
    }
    else {
        return $n * nfact($n - 1);
    }
}

echo "\n\nPlease enter a whole number ... ";
$num = trim(fgets(STDIN));

// ===== PROCESS - Determing the factorial of the input number =====
$output = "\n\nFactorial " . $num . " = " . nfact($num) . "\n\n";
echo $output;</textarea>

    </div>

<!-- AceEditor-Scripte  -->
<script src="<?= rex_addon::get('aceeditor')->getAssetsUrl('vendor/aceeditor/ace.js') ?>"></script>
<script src="<?= rex_addon::get('aceeditor')->getAssetsUrl('js/aceeditor.min.js') ?>"></script>

<!-- AceEditor auf eine Textarea über die ID `phpinput` anwenden -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    editor = textAreaToAceEditor(document.getElementById('phpinput'));
    // hier können noch weitere Optionen gesetzt werden
    // z.B. editor.setOptions()
});
</script>

<!-- AceEditor auf alle Textareas mit der Klasse `aceeditor` anwenden -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    let aceTextAreas = document.querySelectorAll('textarea.aceeditor');
    if (aceTextAreas.length > 0) {
        for (var i = 0; i < aceTextAreas.length; i++) {
            let textArea = aceTextAreas[i];
            editor = textAreaToAceEditor(textArea);
            // hier können noch weitere Optionen gesetzt werden
            // z.B. editor.setOptions()
        }
    }
});
</script>

</body>
</html>
```
