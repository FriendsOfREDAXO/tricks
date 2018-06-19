---
title: YForm-Daten konvertieren
authors: []
prio:
---

# YForm-Daten konvertieren

## Version 1.x auf 2.x

### Uploads

> **Hinweis** Das [Skript](#skript) ist nur ein Beispiel, wie man die Upload-Dateien für eine 2.x Version konvertiert. Daher muss das zuvor Skript der jeweiligen Instanz angepasst werden.

#### Was macht das Skript

1. Es holt Datensätze einer Datenbank und liest das Upload-Feld aus
2. Es wird geprüft, ob die Datei physisch auf dem Server liegt
3. Ist dies der Fall, wird die Datei in den Upload-Ordner für die Version 2.x kopiert und der Dateiname entsprechend angepasst.
4. Wurde die Datei erfolgreich kopiert, wird im Datensatz der Dateiname angepasst.

> **Hinweis** `$sqlLastId` wird verwendet, da es in der Zwischenzeit Uploads mit der Version 2.x geben könnte. Ist sozusagen der Breakpoint zwische Daten der 1.x und 2.x Version


<a name="skript"></a>

```php

$func = rex_request('func', 'string');


if ($func == 'menueplaene' || $func == 'bewerbungen') {
    switch ($func) {
        case 'menueplaene':
            $sqlTable = 'rex_project_menuplaene';
            $sqlLastId = 3983;
            $sqlField = 'media';
            $oldDir = 'uploads/menueplaene/';
            $newDir = 'upload/rex_project_menuplaene/media/';
            break;
        case 'bewerbungen':
            $sqlTable = 'rex_project_bewerbungen';
            $sqlLastId = 3697;
            $sqlField = 'bewerbung';
            $oldDir = 'uploads/bewerbungen/';
            $newDir = 'upload/rex_project_bewerbungen/bewerbung/';
            break;
    }

    $sql = rex_sql::factory();
    $items = $sql->getArray('SELECT * FROM ' . $sqlTable . ' WHERE id <= ' . $sqlLastId);

    if (count($items)) {
        foreach ($items as $item) {
            $oldFieldName = $item[$sqlField];

            $oldFile = rex_path::pluginData('yform','manager', $oldDir . $oldFieldName);

            if (trim($oldFieldName != '') && file_exists($oldFile)) {
                $parts = explode('_', $oldFieldName, 2);
                $newFieldName = $parts[1];
                $newFileName = $item['id'] . '_' . $parts[1];
                $newFile = rex_path::pluginData('yform','manager', $newDir . $newFileName);

                if (rex_file::copy($oldFile, $newFile)) {
                    $update = rex_sql::factory();
                    $update->setTable($sqlTable);
                    $update->setWhere('id=' . $item['id']);
                    $update->setValue($sqlField, $newFieldName);
                    $update->update();
                } else {
                    echo rex_view::error('Datei konnte nicht kopiert werden. <br />Alt: ' . $oldFile . '<br />Neu: ' . $newFile);
                }
            }
        }
    }
}


echo '<a class="btn btn-primary" href="' . rex_getUrl('', '', ['func' => 'menueplaene']) . '">Menüpläne aktualisieren</a>';
echo '<a class="btn btn-primary" href="' . rex_getUrl('', '', ['func' => 'bewerbungen']) . '">Bewerbungen aktualisieren</a>';
```
