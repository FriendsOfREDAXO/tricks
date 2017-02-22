# Kopieren eines YForm-Datensatzes

    1. Das Skript als yform_copy.php im Project-AddOn im Ordner **backend** speichern.
    2. YForm Feld "php" in der gewünschten Tabelle anlegen und dort die 3 Zeilen notieren 

```php
<?php
include (rex_path::addon('project', 'backend/yform_copy.php'));
?>
```

> **Hinweis** 
Das hier abgebildete Skript ändert Felder ab. Hier: name und status. 
Die Zeilen 19 `case: 'name'` und 22 `case: 'status'` müssten ggf. von Tabelle zu Tabelle angepasst werden. Dort wird dem Feld "name" das Wort " Kopie" angehangen und das Feld "status" wird fest auf "0" gesetzt

```php
<?php
$orgTable = rex_request('table_name', 'string', '');
$orgId = rex_request('data_id', 'int', 0);

if (rex_request('copy', 'bool')) {

    if ($orgTable != '' && $orgId > 0) {
        $sql = rex_sql::factory();
        $data = $sql->getArray('SELECT * FROM ' . $orgTable . ' WHERE `id` = :id', ['id' => $orgId]);
        if ($sql->getRows() == 1) {
            $data = $data[0];

            $sql = rex_sql::factory();
            $sql->setTable($orgTable);
            foreach ($data as $fieldName => $fieldValue) {
                switch ($fieldName) {
                    case 'id':
                        break;
                    case 'name':
                        $sql->setValue($fieldName, 'Kopie ' . $fieldValue);
                        break;
                    case 'status':
                        $sql->setValue($fieldName, '0');
                        break;
                    default:
                        $sql->setValue($fieldName, $fieldValue);
                        break;
                }
            }
            $sql->insert();
            $newId = $sql->getLastId();
        }
    }

    while(@ob_end_clean()){}

    $context = rex_context::fromGet();
    header('Location: ' . $context->getUrl(['data_id' => $newId, 'func' => 'edit', 'copy' => 0], false));
    exit();
}

if ($orgId > 0) {
    $context = rex_context::fromGet();
    echo '<a class="btn btn-primary pull-right" href="' . $context->getUrl(['copy' => 1]) . '">Datensatz kopieren</a>';
}

```
