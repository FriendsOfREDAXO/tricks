# MetaInfos nur für bestimmte Ebenen einblenden

REDAXO bietet aktuell zwar die Möglichkeit Meta-Felder ab einer bestimmten Kategorie darzustellen. Mit der nachfolgenden Lösung ist es möglich, Metafelder nur in einem festgelegten Level der Struktur anzuzeigen. Zur Steuerung der Dartsellung werden hier Fieldsets verwendet, die nur eingeblendet werden, wenn man sich im gewünschten Level befindet. 

>**Achtung!** Die Felder werden nur per CSS ausgeblendet. Es sollten ggf. Maßnahmen ergriffen werden ein Autofill zu vermeiden. 

## Metainfo

**MetaInfo**
Feld `legend` anlegen mit den Feldattributen `data-hide-levels data-show-level="1"`
Damit sagt man, dass alles was in diesem `fieldset` liegt, nur auf der **ersten Ebene** angezeigt wird.
Bei anderen Ebenen entsprechend das Level anpassen. 

**Wichtig:** 
Ganz am Ende ein Feld `legend` anlegen damit der Button `Metadaten aktualisieren` nicht verschwindet sobald die MetaInfos versteckt werden.

## CSS

**CSS-Datei** `meta-info.css`

im Assets-Ordner des Projekt-AddOns anlegen.

```css
.rex-main-sidebar [data-hide-levels],
.rex-main-sidebar [data-hide-levels] ~ * {
    display: none;
}

[data-structure-level="1"] .rex-main-sidebar [data-show-level="1"],
[data-structure-level="1"] .rex-main-sidebar [data-show-level="1"] ~ * {
    display: block;
}

[data-structure-level="2"] .rex-main-sidebar [data-show-level="2"],
[data-structure-level="2"] .rex-main-sidebar [data-show-level="2"] ~ * {
    display: block;
}

[data-structure-level="3"] .rex-main-sidebar [data-show-level="3"],
[data-structure-level="3"] .rex-main-sidebar [data-show-level="3"] ~ * {
    display: block;
}

[data-structure-level="4"] .rex-main-sidebar [data-show-level="4"],
[data-structure-level="4"] .rex-main-sidebar [data-show-level="4"] ~ * {
    display: block;
}

[data-structure-level="5"] .rex-main-sidebar [data-show-level="5"],
[data-structure-level="5"] .rex-main-sidebar [data-show-level="5"] ~ * {
    display: block;
}
```

## boot.php

Den nachfolgenden Code in der boot.php des project-AddOns einsetzen.

```php
if (\rex::isBackend()) {
    if (\rex_be_controller::getCurrentPage() == 'content/edit') {
        \rex_view::addCssFile($this->getAssetsUrl('css/meta-info.css'));
        \rex_extension::register('OUTPUT_FILTER', function(\rex_extension_point $ep) {
            $article = \rex_article::get(rex_request('article_id', 'int'));
            if ($article) {
                $level = count($article->getPathAsArray());
                $ep->setSubject(
                    str_replace(
                        'class="rex-main-frame"',
                        'class="rex-main-frame" data-structure-level="' . $level . '"',
                        $ep->getSubject()
                    )
                );
            }
        });
    }
}
```


  
