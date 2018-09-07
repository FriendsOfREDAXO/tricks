---
title: YForm Tabellen oberhalb der AddOns platzieren
authors: [tbaddade]
prio:
---

## YForm Tabellen oberhalb der AddOns platzieren

**Folgenden Code in die boot.php des Project-AddOns platzieren**


```php
if (\rex::isBackend() && \rex::getUser() && \rex_plugin::get('yform', 'manager') && count(\rex_yform_manager_table::getAll()) > 0) {
    \rex_extension::register('PAGES_PREPARED', function (\rex_extension_point $ep) {
        $pages = $ep->getSubject();

        $addonPages = [];
        /* @var $page \rex_be_page_main */
        foreach ($pages as $index => $page) {
            if ($page instanceof \rex_be_page_main && $page->getBlock() == 'addons') {
                $page->setBlock('z_addons');
                $addonPages[$page->getKey()] = $page;
                unset($pages[$index]);
            }
        }
        $pages = array_merge($pages, $addonPages);
        $ep->setSubject($pages);
    }, \rex_extension::LATE);

    \rex_extension::register('OUTPUT_FILTER', function(\rex_extension_point $ep) {
        $ep->setSubject(
            str_replace(
                '[translate:navigation_z_addons]',
                \rex_i18n::msg('navigation_addons'),
                $ep->getSubject()
            )
        );
    });
}
```
