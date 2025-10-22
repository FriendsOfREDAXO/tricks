---
title: MForm CustomLink Converter 
authors: [skerbis]
prio:
---

# MForm CustomLink Converter 

Mit diesem Skript können alte Custom-Links in das neue Format ab MForm 8 konvertieert werden. 

1. **DB-Backup** anlegen
2. Modul oder Template mit dem nachfolgenden SkriptCode anlegen
3. Lege in `$column` das REDAXO Value fest in dem gesucht werden soll
4. Wähle das `$node` das konvertiert werden soll. Angenommen das Feld war so definiert `$mform->addCustomLinkField("$id.0.mylink", array('label' => 'Link'));`, dann lautet das node: `mylink`
5. Lege die `$moduleId` fest des Moduls in dem gesucht werden soll. 

```php
<?php
// Define the parameters
$column = 'value1'; // column
$node = 'customlink'; //  node
$moduleId = 48; // module_id

// Fetch all records from the rex_article_slice table where module_id is the specified value
$sql = rex_sql::factory();
$sql->setQuery("SELECT id, $column FROM rex_article_slice WHERE module_id = ?", [$moduleId]);

foreach ($sql as $row) {
    $id = $row->getValue('id');
    $jsonData = $row->getValue($column);

    // Decode JSON data
    $data = json_decode($jsonData, true);

    // Check if decoding was successful and if the data is an array
    if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
        $modified = false;

        // Traverse the JSON array and modify customlink nodes
        foreach ($data as &$item) {
            if (isset($item[$node])) {
                $value = $item[$node];
                
                // Check if the value is already in the desired format
                $isNewFormat = is_array($value) && isset($value['name']) && isset($value['id']);

                if (!$isNewFormat) {
                    if ((is_array($value) && empty($value)) || $value === '') {
                        $item[$node] = [
                            'name' => '',
                            'id' => ''
                        ];
                    } else if (is_numeric($value)) {

                        $articleId = (int)$value;
    
                        // Artikelobjekt laden
                        $article = rex_article::get($articleId);
                        $articleName = "article not found redaxo://$value";
                        if ($article) {
                            // Artikelname abrufen
                            $articleName = $article->getName();
                        }
                        $item[$node] = [
                            'name' => "$articleName",
                            'id' => "redaxo://$value"
                        ];
                    } else {
                        $item[$node] = [
                            'name' => "$value",
                            'id' => "$value"
                        ];
                    }
                    $modified = true;
                }
            }
        }

        // If data was modified, update the database
        if ($modified) {
            $updatedJsonData = json_encode($data);
            $updateSql = rex_sql::factory();
            $updateSql->setTable('rex_article_slice');
            $updateSql->setWhere(['id' => $id]);
            $updateSql->setValue($column, $updatedJsonData);
            $updateSql->update();
            echo "Updated record ID $id<br>";
        }
    } else {
        // Log or handle invalid JSON data if necessary
        echo "Invalid JSON data in record ID $id<br>";
    }
}
echo "Conversion completed.<br>";
?>

<?php
echo '<pre>';
print_r(rex_var::toArray("REX_VALUE[1]"));
echo '</pre>';
?>
```
