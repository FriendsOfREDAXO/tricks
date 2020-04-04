---
title: Blockauswahl mit Vorschau
authors: [tbaddade,anveno]
prio:
--- 

# Variante 1: Blockauswahl mit Vorschau via CSS

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

# Variante 2: Blockauswahl mit Bildern via Fragmente

Eine weitere Möglichkeit besteht darin via Fragmente das Dropdown seinen eigenen Wünschen anzupassen.

Das folgende Fragment soll überschrieben werden:
`redaxo/src/addons/structure/plugins/content/fragments/module_select.php`

Mit dem Addon themes reicht es die Datei in folgenden Ordner zu kopieren:
`theme/private/fragments/module_select.php`

Im neuen module_select.php-Fragment wird nun das Subfragment dropdown.php auskommentiert und stattdessen die Inhalte der Orginial-dropdown.php hineinkopiert und den eigenen Wünschen angepasst. Nachfolgend ein einfaches Beispiel in dem der Part *foreach ($this->items as $item)* angepasst wurde.

```php
<?php
/**
 * Discussion Issue #1174
 * Manipulate this fragment to influence the selection of modules on the slice.
 * By default the core fragment is used.
 *
 * @var bool   $block
 * @var string $button_label
 * @var array  $items        array contains all modules
 *             [0]        the index of array
 *             - [id]     the module id
 *             - [title]  the module name
 *             - [href]   the module url
 */
 
//$this->subfragment('/core/dropdowns/dropdown.php');
?>

<?php
    $toolbar = isset($this->toolbar) && $this->toolbar ? true : false;
    $group = isset($this->group) && $this->group ? true : false;
?>

<?php if (!$toolbar && !$group): ?>
<div class="dropdown<?= (isset($this->block) ? ' btn-block' : '')?><?= ((isset($this->class) && '' != $this->class) ? ' ' . $this->class : '') ?>">
<?php endif; ?>

    <?php if ($toolbar): ?>
    <a class="dropdown-toggle" href="#" role="button" data-toggle="dropdown"<?= ((isset($this->disabled) && $this->disabled) ? ' disabled' : '') ?>>
    <?php else: ?>
    <button class="btn btn-default<?= (isset($this->block) ? ' btn-block' : '')?> dropdown-toggle" type="button" data-toggle="dropdown"<?= ((isset($this->disabled) && $this->disabled) ? ' disabled' : '') ?>>
    <?php endif; ?>
        <?php if (isset($this->button_prefix) && '' != $this->button_prefix): ?>
        <?= $this->button_prefix ?>
        <?php endif; ?>
        <?php if (isset($this->button_label) && '' != $this->button_label): ?>
        <?= ' <b>' . $this->button_label . '</b>' ?>
        <?php endif; ?>
        <span class="caret"></span>
    <?php if ($toolbar): ?>
    </a>
    <?php else: ?>
    </button>
    <?php endif; ?>
    <ul class="dropdown-menu<?= (isset($this->right) ? ' dropdown-menu-right' : '')?><?= (isset($this->block) ? ' btn-block' : '')?>" role="menu">
        <?php if (isset($this->header) && '' != $this->header): ?>
            <li class="dropdown-header"><?= $this->header ?></li>
        <?php endif; ?>
		<?php
		foreach ($this->items as $item) {
			echo '<li' . ((isset($item['active']) && $item['active']) ? ' class="active"' : '') . (isset($item['attributes']) ? ' ' . trim($item['attributes']) : '') . '>';
			echo '<div class="col-sm-4 col-md-2">';
			if(isset($item['href']) && '' != $item['href']) { echo '<a href="' . $item['href'] . '" class="img-thumbnail">'; }
			echo '<div class="text-center">';
			// prüfen ob es ein Bild mit der ID des Modules gibt
			$modul_image_path = 'theme/public/assets/modules/';
			if (file_exists(rex_url::base($modul_image_path.$item['id'].'.png'))) {
				echo '<img src="'.rex_url::base($modul_image_path.$item['id'].'.png').'">';
			}
			else {
				echo '<img src="'.rex_url::base($modul_image_path.'module_image_missing.png').'">';
			}	
			echo '</div>';		
			if(isset($item['href']) && '' != $item['href']) { echo '</a>'; }	
			echo '<p class="text-muted text-center" style="min-height: 45px;">'.$item['title'].'</p>';		
			echo '</div>';
			echo '</li>';
		}
		?>
        <?php if (isset($this->footer) && '' != $this->footer): ?>
            <li class="divider"></li>
            <li><?= $this->footer ?></li>
        <?php endif; ?>
    </ul>
<?php if (!$toolbar && !$group): ?>
</div>
<?php endif;
```

Und so kann es am Ende aussehen:

![Beispiel Blockauswahl mit Bildern](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/Blockauswahl_mit_Bild.png "Blockauswahl mit Bildern")

Die Icons im Beispiel stammen von Icons made by <a href="https://www.flaticon.com/authors/iconixar" title="iconixar">iconixar</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>