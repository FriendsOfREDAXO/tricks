
Modul-Eingabe:

<?php
// Sked-Kategorien zur Auswahl stellen. 
// ------------------------------------
$select = new rex_select();
$select->setId('sked_category');
$select->setAttribute('class', 'selectpicker form-control');
$select->setName('REX_INPUT_VALUE[1]');
$select->addOption('Alle', '');
$select->addSqlOptions('SELECT `name_1`, `id` FROM `' . rex::getTablePrefix() . 'sked_categories` ORDER BY `name_1` ASC');
$select->setSelected('REX_VALUE[1]');
$catselect = $select->get();
?>
<fieldset class="form-horizontal">
    <div class="form-group">
        <label class="col-sm-2 control-label" for="category">Kategorie</label>
        <div class="col-sm-10">
            <?= $catselect ?>
        </div>
    </div>
</fieldset>


Modul-Ausgabe:

<?php
// Sprache festlegen ... ggf. aus Sprachmetas auslesen 
setlocale(LC_ALL, 'de_DE.utf8');

$categoryId = '';
$venueId = '';
$filter_date = "";
$today = date("Y-m-d H:i:s");
$today = strtotime($today);

//init start date and get end date
$start = date("Y-m-d H:i:s");
$end = "all";

//get CategoryID
$categoryId = REX_VALUE[1];

if ($categoryId == '') {
    $categoryId = 0;
} else {
    $categoryId = REX_VALUE[1];
}
?>

<div id="calendar"></div>
<script>
    var cat = <?php echo $categoryId; ?>;

</script>
