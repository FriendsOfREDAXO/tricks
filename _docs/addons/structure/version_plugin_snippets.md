---
title: Snippets zum Version-Plugin
authors: [skerbis]
prio:
---

# Snippets zum Version-Plugin

## Beibehalten der Arbeitsversion-Ansicht nach Veröffentlichung in der Live Version per ExensionPoint

In die boot.php des project-AddOns einsetzen: 

```php
rex_extension::register(rex_extension_point_art_content_updated::NAME, function (rex_extension_point_art_content_updated $ep) {
        if ('work_to_live' === $ep->getAction()) {
            rex_article_revision::setSessionArticleRevision($ep->getArticle()->getId(), rex_article_revision::WORK);
        }
    });
```

## Löschen der Arbeitsversion nach Live-Schaltung per ExensionPoint

In die boot.php des project-AddOns einsetzen: 

```php 
rex_extension::register(rex_extension_point_art_content_updated::NAME, function (rex_extension_point_art_content_updated $ep) {
    if ('work_to_live' === $ep->getAction()) {
        rex_article_revision::clearContent($ep->getArticle()->getId(), $ep->getArticle()->getClangId(), rex_article_revision::WORK);
    }
});
```
