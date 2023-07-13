---
title: YForm-Datensatz über die Struktur bearbeiten
authors: [alxndr-w]
prio:
---

# YForm-Datensatz über die Struktur bearbeiten

Anders als Metainfos bietet YForm durch die Menge an verfügbaren Feldtypen, Aktionen und Validierungen, einen Artikel mit Zusatzinformationen anzureichern. Wäre es dann nicht genial, direkt über die Struktur diese Informationen bearbeiten zu können?

Nachfolgend Codebeispiele, die das Prinzip verdeutlichen. Zum Ausprobieren folgenden Code in das installierte und aktivierte Project-Addon oder ein eigenes Addon kopieren.

## 1. Unterseite `pages/content.yform.php` erstellen

```php
<?php
$articleId = rex_request('article_id', 'int');
$categoryId = rex_request('category_id', 'int');
$clang = rex_request('clang', 'int');
$ctype = rex_request('ctype', 'int');

$context = new rex_context([
    'page' => rex_be_controller::getCurrentPage(),
    'article_id' => $articleId,
    'category_id' => $categoryId,
    'clang' => $clang,
    'ctype' => $ctype,
]);

$yform = new rex_yform();
$yform->setObjectparams('form_name', 'table-rex_yform_test');
$yform->setObjectparams('form_ytemplate', 'bootstrap');
$yform->setObjectparams('form_showformafterupdate', 1);
$yform->setValueField('text', ['name','Name']);

$fragment = new rex_fragment();
$fragment->setVar('class', 'edit', false);
$fragment->setVar('title', "Mein Titel", false);
$fragment->setVar('body', $yform->getForm(), false);

return $fragment->parse('core/page/section.php') ?>
```

2. Hilfsklasse / Methode in `lib/content_yform.php` anlegen:

```php
<?php

class content_yform
{
    public static function addYFormPage()
    {
        rex_extension::register('PAGES_PREPARED', function () {
            $page = new rex_be_page('test', rex_i18n::msg('Mein Test'));
            $page->setSubPath(rex_addon::get('project')->getPath('pages/content.yform.php'));
            $page_controller = rex_be_controller::getPageObject('content');
            $page->setItemAttr('class', "pull-left");
            $page_controller->addSubpage($page);
        });
    }
}
```

3. Aufruf in der `boot.php` starten

```php
<?php

content_yform::addYFormPage();
```

Das Ergebnis ist ein eigener Reiter neben dem "Editiermodus" in einem REDAXO-Artikel mit eingebautem YForm-Formular.
