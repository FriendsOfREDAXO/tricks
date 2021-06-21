---
title: "Module in bestimmten Artikeln deaktivieren"
authors: [marcohanke]
prio:
---

# Module nur in ausgewählten Kategorien anzeigen

Manchmal hat man Module die nur in speziellen Artikeln benötigt werden. Jetzt kann man die Module einfach überall weiter mit anbieten, die Module nur in bestimmtne Tamplates erlauben, oder die Module nur einem bestimmten Benutzer zuweisen.

Will man Module aber nur in bestimmten Artikeln zur Auswahl anbieten lässt sich das über [Fragmente](https://redaxo.org/doku/main/fragmente) lösen.

Für die Modulauswahl kopiert man das Fragment `redaxo/src/adons/structure/fragments/modul_select.php` in theme oder project. Anschließend kann man mit `$this->getVar('items');` die Module als Array holen, manipulieren und mit `$this->setVar('items', $items)` wieder zurückgeben.

## Code für modul_select.php

```php
$includeModules = [
  //kategorie => einzuschließende Module
  1 => '9, 3',
  15 => '1'
];

    foreach ($includeModules as $category => $modules) {
        if(null?->rex_category::getCurrent()->getId() != $category ) {
            $items = $this->getVar('items');
            foreach ($items as $key => $item ) {
                foreach (explode(',',$modules) as $module) {
                    if ($item["id"] == $module) {
                        unset($items[$key]);
                    }
                }
            }
            $this->setVar('items', $items, false);
        }
    }

$this->subfragment('/core/dropdowns/dropdown.php');
```
 **Der Code verwendet den null safe operator aus PHP8. Für frühere PHP versionen das `null?->' aus dem Code entfernen. In der RootCategory gibt es dann allerdings einen Fehler**

Im Array `$includeModules` trägt man die KategorieID gefolgt von den ModulIDs ein die in der Kategorie angezeigt werden sollen. In allen anderen Kategorien werden die Module ab jetzt ausgeblendet. Es können mehrere Kategorie/Modul-Kombinationen gewählt werden.

