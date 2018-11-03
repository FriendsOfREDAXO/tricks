---
title: Blockauswahl mit Vorschau
authors: [tbaddade]
prio:
--- 

# Blockauswahl mit Vorschau

**Screenshots**
Screenshots des Layouts machen und speichern als
`/src/addons/project/assets/module-id-5.png`
`/src/addons/project/assets/module-id-6.png`

**CSS Datei** anlegen und speichern als `/src/addons/project/assets/module-dropdown.css`

```css
.rex-slice-select .dropdown-menu > li > a {
    padding-top: 6px;
    padding-bottom: 6px;
}
.rex-slice-select .dropdown-menu > li + li > a {
    position: relative;
    border-top: 1px solid #f7f7f7;
}

.rex-slice-select .dropdown-menu > li > a:before {
    content: '';
    display: inline-block;
    width: 100px;
    margin-right: 10px;
    background: #fff 50% 50% no-repeat;
    background-size: contain;
    vertical-align: middle;
}
.rex-slice-select .dropdown-menu > li > a:after {
    content: '';
    position: absolute;
    left: 122px; /* Breite von :before + padding-left vom a */
    top: 50%;
    z-index: 2000;
    transform: translateX(-100%) translateY(-50%);
    display: inline-block;
    width: 300px;
    background: #fff 50% 50% no-repeat;
    background-size: contain;
    vertical-align: middle;
    opacity: 0;
}
.rex-slice-select .dropdown-menu > li > a:hover:after {
    opacity: 1;
}

.rex-slice-select .dropdown-menu > li > a[href*="module_id=5"]:before,
.rex-slice-select .dropdown-menu > li > a[href*="module_id=6"]:before {
    height: 50px;
    border: 1px solid #f7f7f7;
}
.rex-slice-select .dropdown-menu > li > a[href*="module_id=5"]:after,
.rex-slice-select .dropdown-menu > li > a[href*="module_id=6"]:after {
    height: 200px;
    border: 1px solid #d7d7d7;
}

.rex-slice-select .dropdown-menu > li > a[href*="module_id=5"]:before,
.rex-slice-select .dropdown-menu > li > a[href*="module_id=5"]:after {
    background-image: url('module-id-5.png');
}
.rex-slice-select .dropdown-menu > li > a[href*="module_id=6"]:before,
.rex-slice-select .dropdown-menu > li > a[href*="module_id=6"]:after {
    background-image: url('module-id-6.png');
}

```

**boot.php** Datei des project AddOns öffnen und das einsetzen

```php
// Module
// - - - - - - - - - - - - - - - - - - - - - - - - - -
if (\rex::isBackend() && \rex_plugin::get('structure', 'content')->isAvailable()) {
    \rex_view::addCssFile($this->getAssetsUrl('module-dropdown.css'));
}
```

AddOn project re-installieren, damit die assets übertragen werden.

Das war es.
