
Beschreibung kommt noch


## Moduleingabe

```php
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
```

## Modulausgabe

```php
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
```

## JS
```js
/* 
 * scripterweiterungen von javanita
 */

$(document).ready(function () {
    
    // Kalender


      $('#calendar').fullCalendar({
        defaultView: 'month',
        height: 450,
        aspectRatio: 1.0,
         header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek'
        },
        locale: 'de',       
        events:
            {
                url: 'index.php?rex-api-call=sked_events&category=' + cat,
                type: 'POST',
                dataType: 'json',
                cache: true,
                error: function (xhr, type, exception) {
                    // todo later show warning field
                    // $('#script-warning').show();
                    alert("Error: " + exception);
                }
            }      

    });   
    
});
```

## Klasse
```php
<?php
/**
 * Klasse zum Auslesen Events
 *
 * @author javanita
 */
class Events {
     const table = 'rex_sked_entries';
    const cat_table = 'rex_sked_categories';
    public function getEntries($category_id) {
        $sql = rex_sql::factory();
        $sql->debugsql = true;
        $events = array();
        if ($category_id == 0) {
            $daten = $sql->getArray('SELECT * FROM ' . self::table);
        if (is_array($daten)) {
            foreach ($daten as $value) {
                $sql->setQuery('SELECT color FROM ' . self::cat_table . ' WHERE id = :id', ['id' => $value['category']]);
                $rows = $sql->getRow();
                if ($rows != 0) {
                    $farbe = $sql->getValue('color');
                }
                $e = array();
                $e['title'] = $value['name_1'];
                $e['start'] = $value['start_date'];
                $e['end'] = $value['end_date'];
                $e['allDay'] = false;
                $e['color'] = $farbe;
                array_push($events, $e);
            }
        }
        }   
            
            else {
            $sql->setQuery('SELECT color FROM ' . self::cat_table . ' WHERE id = :id', ['id' => $category_id]);
            $rows = $sql->getRow();
            if ($rows != 0) {
                $farbe = $sql->getValue('color');
            }
            $daten = $sql->getArray('SELECT * FROM ' . self::table . ' WHERE category = :category', ['category' => $category_id]);
            if (is_array($daten)) {
                foreach ($daten as $value) {
                    $e = array();
                    $e['title'] = $value['name_1'];
                    $e['start'] = $value['start_date'];
                    $e['end'] = $value['end_date'];
                    $e['allDay'] = false;
                    $e['color'] = $farbe;
                    array_push($events, $e);
                }
            }
        }
            
        return($events);
    }
}
```

## API

kommt bald
