---
title: Soziale Netzwerke ausgeben mit MBlock
authors: [crydotsnake]
prio:
---

# Soziale Netzwerke ausgeben mit MBlock

> Setzt das FOR-AddOn MBlock voraus!

- [Beschreibung](#beschreibung)
- [Moduleingabe](#moduleingabe)
- [Modulausgabe](#modulausgabe)

<a name="beschreibung"></a>
## Beschreibung

Mit diesem Modul kann man soziale Netzwerke anlegen mit einem Namen, einer URL, und einer Icon-Klasse, z. B. von FontAwesome.

<a name="moduleingabe"></a>
# Moduleingabe

```php
  
<?php

// base ID
$id = 1;

// html form
$form = <<<EOT
    <fieldset class="form-horizontal ">
        <legend>Soziales Netzwerk</legend>
        <div class="form-group">
            <div class="col-sm-2 control-label"><label for="rv2_1_0_name">Name</label></div>
            <div class="col-sm-10"><input id="rv2_1_0_name" type="text" name="REX_INPUT_VALUE[$id][0][name]" value="" class="form-control "></div>
        </div>
        
        <div class="form-group">
            <div class="col-sm-2 control-label"><label for="rv2_1_0_name">Icon-Klasse</label></div>
            <div class="col-sm-10"><input id="rv2_1_0_name" type="text" name="REX_INPUT_VALUE[$id][0][icon]" value="" class="form-control "></div>
        </div>
        <div class="form-group">
            <div class="col-sm-2 control-label"><label>URL</label></div>
            <div class="col-sm-10"><input id="rv2_1_0_name" type="text" name="REX_INPUT_VALUE[$id][0][url]" value="" class="form-control "></div>
            </div>
        </div>
    </fieldset>
EOT;

// parse form
echo MBlock::show($id, $form);
```

<a name="modulausgabe"></a>
# Modulausgabe

```php

<?php

$items = rex_var::toArray('REX_VALUE[id=1]'); // wandle modulinput in ein array um
$out = ''; // $out als leeren string initiieren
foreach ($items as $item) { // durchlaufe alle eingaben aus dem modulinput
    $out .= '<li><a target="_blank" href="'.$item['url'].'" class="icon brands '.$item['icon'].'"><span class="label">'.$item['name'].'</span></a></li>';
    
}
?>
<nav>
    <ul>
        <?php
            echo $out; // <li>s ausgeben
        ?>
    </ul>
</nav>
```
