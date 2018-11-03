---
title: Startseite überschreiben
authors: []
prio:
---

# Startseite überschreiben

Mit dem nachfolgenden Code kann die Startseite abseits der Systemkonfiguration geändert werden, z.B. für einen Saisonalen Wechsel. 

```php
// in die Boot eines AddOns, z.B. projekt setzen

$structureAddon = rex_addon::get('structure');

// $id durch einen Config-Wert oder durch eine Property vorher setzen

 $structureAddon->setProperty('start_article_id', $id);
 
 if (rex_request('article_id', 'int') == 0) {
    $structureAddon ->setProperty('article_id', rex_article::getSiteStartArticleId());
} else {
    $article_id = rex_request('article_id', 'int');
    $article_id = rex_article::get($article_id) ? $article_id : rex_article::getNotfoundArticleId();
     $structureAddon ->setProperty('article_id', $article_id);
}
```
