## Neue Kategorien immer mit Priorität 1 anlegen

Möchte man neue Kategorien immer mit einer Priorität von 1 erstellen, kann man folgendes Snippet in die boot.php des project-Addons oder eines eigenen AddOns einfügen:

```php
rex_extension::register('CAT_ADDED', function (rex_extension_point $ep) {
    \rex_category_service::newCatPrio($ep->getParam('parent_id'), $ep->getParam('clang'), 1, $ep->getParam('priority'));
    \rex_category_service::editCategory($ep->getParam('id'), $ep->getParam('clang'), array('catpriority' => 1, 'catname' => $ep->getParam('name')));
});
```
