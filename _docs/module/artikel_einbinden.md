---
title: "Artikel einbinden"
authors: [skerbis]
prio:
---

# Artikel einbinden mit `rex_article::get`

Zentrale Daten wie Öffnungszeiten oder Adressen lassen sich effizient durch das Einbinden zentral abgelegter Artikel wiederverwenden.

Das folgende Beispiel bindet den ausgewählten Artikel als Block ein. Für eingeloggte Redakteure wird zusätzlich ein Bearbeitungssymbol (FontAwesome) im Frontend angezeigt. Dadurch lässt sich leicht erkennen, dass es sich um einen eingebundenen Artikel handelt, und ermöglicht direkten Zugang zur Backend-Bearbeitung.

Die Unterscheidung zwischen Backend und Frontend erfolgt über `rex::isBackend()`.

## Moduleingabe

```html
<div class="form-horizontal">
    <div class="form-group">
        <label class="col-sm-2 control-label">Artikelauswahl:</label>
        <div class="col-sm-8">
            REX_LINK[id=1 widget=1]
        </div>
    </div>
</div>
```

## Modulausgabe

```php
<?php
// Variablen initialisieren
$art = null;
$article = null;
$editUrl = '';
$showError = false;
$isValidArticle = false;

// Prüfen ob der Artikel existiert und nicht mit sich selbst verlinkt ist
if ("REX_ARTICLE_ID" != "REX_LINK[id=1]" && "REX_LINK[id=1]" != "") {
    // Artikel laden
    $art = rex_article::get('REX_LINK[id=1]');
    
    if ($art) {
        $isValidArticle = true;
        // Artikelinhalt auslesen
        $article = new rex_article_content($art->getId(), $art->getClang());
        
        // Edit-URL für Backend vorbereiten
        if (rex::isBackend()) {
            $editUrl = rex_url::backendPage('content/edit', [
                'mode' => 'edit',
                'clang' => rex_clang::getCurrentId(),
                'article_id' => $art->getId()
            ]);
        }
        
        // Weitere Informationen bei Bedarf:
        // $art_title = $art->getName();
        // $art_description = $art->getValue('art_description');
    }
} else {
    $showError = true;
}
?>

<!-- Fehlerausgabe für Backend -->
<?php if ($showError && rex::isBackend()): ?>
    <div class="alert alert-warning">
        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
        Bitte einen gültigen Artikel auswählen. Selbstreferenzierung ist nicht möglich.
    </div>
<?php endif; ?>

<!-- Backend-Ausgabe mit Edit-Link -->
<?php if ($isValidArticle && rex::isBackend()): ?>
    <div class="alert alert-info">
        <a href="<?= $editUrl ?>" class="alert-link">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            Eingebundener Artikel: <?= $art->getName() ?>
        </a>
    </div>
<?php endif; ?>

<!-- Frontend-Ausgabe -->
<?php if ($isValidArticle && rex::isFrontend()): ?>
    <?= $article->getArticle(1) ?>
<?php endif; ?>
```
