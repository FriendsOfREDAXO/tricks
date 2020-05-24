---
title: Kopieren eines YForm-Datensatzes
authors: [tbaddade]
prio:
---

# YForm - Datensätze auf Validierungen prüfen

## Hintergrund:

Validierungen können auch dann erstellt werden, wenn bereits vom Redakteur Datensätze erfasst wurden. Damit der Redakteur nicht jeden einzelnen Datensatz durchgehen muss, kann man per Klick auf einen Button alle Datensätzen auf einmal überprüfen lassen. Besteht ein Datensatz die Validierungen nicht, so wird dieser als Warnung mit einem Link zum Bearbeiten angezeigt.

### Methode für die eigene Model Class

**Diese Methode in die Model Class hinterlegen:**
_Der Aufruf `getName()` müsste ggf. angepasst werden_

```php
    public static function checkDatasets()
    {
        $context = new \rex_context([
            'page' => 'yform/manager/data_edit',
            'table_name' => self::getTableName(),
            'func' => 'edit',
        ]);
        $messages = [];
        $items = self::findAll();
        foreach ($items as $item) {
            if (!$item->save()) {
                $messages[] = sprintf('<p>Der Datensatz <a href="%s">%s</a> hat folgende Fehler</p><ul><li>%s</li></ul>', $context->getUrl(['data_id' => $item->getId()]), $item->getName(), implode('</li><li>', $item->getMessages()));
            }
        }
        return $messages;
    }
```

## boot.php ergänzen

**In der boot.php diese Zeile notieren**

_Anzupassen sind `[TABLE_NAME]` und `[MODEL_CLASS]` wo die obige Methode enthalten ist_
```php
if (rex::isBackend() && rex::getUser()) {
    rex_extension::register('PAGE_TITLE', function(\rex_extension_point $extensionPoint) {
        $subject = $extensionPoint->getSubject();
        if (\rex_be_controller::getCurrentPage() == 'yform/manager/data_edit' && rex_request('table_name') == '[TABLE_NAME]') {
            $context = rex_context::fromGet();
            $subject = sprintf('<a class="btn btn-primary btn-xs" style="float: right;" href="%s">Datensätze überprüfen</a>', $context->getUrl(['check' => 'datasets'])).$subject;
        }

        return $subject;
    });

    rex_extension::register('PAGE_TITLE_SHOWN', function(\rex_extension_point $extensionPoint) {
        $subject = $extensionPoint->getSubject();
        if (rex_request('check', 'string', '') === 'datasets' && rex_request('table_name') == '[TABLE_NAME]') {
            $messages = [MODEL_CLASS]::checkDatasets();
            if (count($messages)) {
                foreach ($messages as $message) {
                    $subject .= rex_view::warning($message);
                }
            }
        }

        return $subject;
    });
}
```
