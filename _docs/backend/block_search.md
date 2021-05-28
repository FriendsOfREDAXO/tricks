---
title: Durchsuchbare Blockauswahl
authors: [danspringer]
prio:
--- 

# Durchsuchbare Blockauswahl / Modulauswahl

Wenn man in einer REDAXO-Installation viele Module angelegt hat, kann es anstregend sein,bei der Eingabe von neuem Content, schnell das richtige Modul in der Auswahlliste zu finden. Dieser Trick beschreibt, wie man die Modulauswahl im Editiermodus durchsuchbar macht. Natürlich kann man die Auwahl der Module pro Template oder Benutzerrolle einschränken, dennoch hilft dieser Trick beim schnellen Finden von Modulnamen.

***Das Fragment `module_select.php` kopieren***
Es muss der folgende Code als `module_select.php`-Fragment updatesicher angelegt werden. Hierzu eignet sich das Theme-AddOn oder das project-Addon.

```
<?php
    $toolbar = isset($this->toolbar) && $this->toolbar ? true : false;
    $group = isset($this->group) && $this->group ? true : false;
	$module_dropdown_id = 'module-dropdown-'.rand(999,999999999);
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
    <ul id="<?= $module_dropdown_id ?>" class="dropdown-menu<?= (isset($this->right) ? ' dropdown-menu-right' : '')?><?= (isset($this->block) ? ' btn-block' : '')?>" role="menu">
    	
        <div class="form-group alert alert-warning" style="padding: 10px 15px 10px 15px;">
        	<label class="control-label"><i class="fa fa-search"></i> Module durchsuchen</label>
        	<span class="clearable">
            	<input type="text" class="live-search-box clearable form-control" placeholder="Suchbegriff eingeben">
                <!--<i class="clearable__clear fa fa-times"></i>-->
            </span>
            <div class="live-suchergebnis"><small><span class="anzahl-live"><?= count($this->items) ?></span> Module <span class="thema-live"></span></small></div>
        </div>
        
        <?php if (isset($this->header) && '' != $this->header): ?>
            <li class="dropdown-header"><?= $this->header ?></li>
        <?php endif; ?>
        <?php
        foreach ($this->items as $item) {
            echo '<li' . ((isset($item['active']) && $item['active']) ? ' class="active"' : '') . (isset($item['attributes']) ? ' ' . trim($item['attributes']) : '') . '>';
            echo(isset($item['href']) && '' != $item['href']) ? '<a href="' . $item['href'] . '">' . $item['title'] . '</a>' : $item['title'];
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

***Zusätzliches JavaScript im Backend einbinden***
Der folgende Schnipsel JavaScript muss noch ins Backend eingebunden werden. Hierzu eignet sich das Theme-AddOn.

```
/* LiveSearch */
$('.live-search-box').on('keyup', function() {
    var dropdownId = $(this).closest('ul').attr('id');
    //console.log(dropdownId);
    var searchTerm = $(this).val().toLowerCase();
    var searchTermOriginal = $(this).val();

    $('#' + dropdownId + ' li').each(function() {
        var moduleName = $(this).text();
        console.log(moduleName + ' | Suchbegriff: ' + searchTerm);

        if (moduleName.toLowerCase().indexOf(searchTerm) >= 0) {
            $(this).show();
        } else {
            $(this).hide();
        }
    }); /* EoF each */

    var n = $('#' + dropdownId + ' li:visible').length;
    //console.log('Es gibt ' + n + ' Listenpunkte'); 
    $('#' + dropdownId + ' .anzahl-live').html(n);
    $('#' + dropdownId + ' .thema-live').html(' mit der Bezeichnung <strong><em>' + searchTermOriginal + '</em></strong>');

    if (searchTerm == "") {
        $('#' + dropdownId + ' .thema-live').html('');
    }

}); /* EoF on keyup */
```