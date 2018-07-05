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
