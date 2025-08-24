---
title: YForm - Erweiterte Konfiguration und Tricks
authors: []
prio:
---

# YForm - Erweiterte Konfiguration und Tricks

- [Einleitung](#einleitung)
- [Pipe-Notation für flexible Feldkonfiguration](#pipe-notation)
- [Select-Optionen aus der Konfiguration lesen](#select-optionen)
- [Custom Validatoren erstellen](#custom-validatoren)
- [Bedingte Feldanzeige mit JavaScript](#bedingte-felder)
- [Performante Datenabfragen](#performante-abfragen)
- [Debugging von YForm-Problemen](#debugging)

<a name="einleitung"></a>
## Einleitung

YForm ist eines der mächtigsten REDAXO-AddOns, aber seine Flexibilität kann manchmal überwältigend sein. Hier sind erweiterte Tricks und Konfigurationen, die in der Community häufig diskutiert werden.

<a name="pipe-notation"></a>
## Pipe-Notation für flexible Feldkonfiguration

Die Pipe-Notation ermöglicht es, Felder flexibler zu konfigurieren, ohne alle Parameter in der korrekten Reihenfolge anzugeben:

### Normale Notation vs. Pipe-Notation

**Standard:**
```
select|name|label|Opt1=opt1,Opt2=opt2,Opt3=opt3|||1
```

**Mit Pipe-Notation:**
```
select|name|label|Opt1=opt1,Opt2=opt2,Opt3=opt3|#multiple:1
```

### Erweiterte Attribute setzen

```
text|vorname|Vorname*|#attributes:{"required":"","autofocus":"","placeholder":"z.B. Max"}
select|anrede|Anrede*|Bitte wählen=,Frau=Frau,Herr=Herr|#attributes:{"required":""}
email|email|E-Mail*|#grid:,datepicker|#attributes:{"required":""}
```

<a name="select-optionen"></a>
## Select-Optionen aus der Konfiguration lesen

Um Select-Definitionen im Frontend zu verwenden, ohne sie doppelt zu definieren:

```php
<?php
// Select-Optionen aus YForm-Konfiguration lesen
$table = rex_yform_manager_table::get(rex::getTablePrefix().'my_table');
$field = $table->getValueField('my_field');
$options = $field->getElement('options');

// Optionen parsen
$parsed_options = [];
$option_pairs = explode(',', $options);
foreach ($option_pairs as $pair) {
    if (strpos($pair, '=') !== false) {
        list($label, $value) = explode('=', $pair, 2);
        $parsed_options[$value] = $label;
    }
}

// Verwendung im Template
foreach ($parsed_options as $value => $label) {
    echo '<option value="'.$value.'">'.$label.'</option>';
}
?>
```

<a name="custom-validatoren"></a>
## Custom Validatoren erstellen

Für spezielle Validierungslogik können eigene Validatoren erstellt werden:

```php
<?php
// In der boot.php des Projekts oder AddOns
class rex_yform_validate_custom_iban extends rex_yform_validate_abstract
{
    public function enterObject()
    {
        $value = $this->getElement(2);
        if ($this->getValue() == '') {
            return;
        }

        if (!$this->isValidIBAN($this->getValue())) {
            $this->params['warning'][$this->getId()] = $this->params['error_class'];
            $this->params['warning_messages'][$this->getId()] = 
                $this->getElement(3) ?: 'Bitte geben Sie eine gültige IBAN ein.';
        }
    }

    private function isValidIBAN($iban)
    {
        $iban = strtoupper(str_replace(' ', '', $iban));
        if (strlen($iban) < 15 || strlen($iban) > 34) {
            return false;
        }
        
        // IBAN-Prüfalgorithmus
        $rearranged = substr($iban, 4) . substr($iban, 0, 4);
        $numeric = '';
        
        for ($i = 0; $i < strlen($rearranged); $i++) {
            $char = $rearranged[$i];
            if (ctype_alpha($char)) {
                $numeric .= (ord($char) - ord('A') + 10);
            } else {
                $numeric .= $char;
            }
        }
        
        return bcmod($numeric, '97') === '1';
    }
}
?>
```

Verwendung in YForm:
```
validate|custom_iban|iban||Ungültige IBAN
```

<a name="bedingte-felder"></a>
## Bedingte Feldanzeige mit JavaScript

Felder abhängig von anderen Feldern anzeigen/verstecken:

```javascript
$(document).ready(function() {
    // Feld verstecken/anzeigen basierend auf Select-Auswahl
    $('select[name="kategorie"]').change(function() {
        var selectedValue = $(this).val();
        var targetField = $('.form-group').has('input[name="spezial_feld"]');
        
        if (selectedValue === 'special') {
            targetField.show();
            targetField.find('input').prop('required', true);
        } else {
            targetField.hide();
            targetField.find('input').prop('required', false);
        }
    }).trigger('change'); // Initial ausführen
});
```

<a name="performante-abfragen"></a>
## Performante Datenabfragen

### Eager Loading für Relationen

```php
<?php
// Langsam - N+1 Problem
$articles = rex_yform_manager_dataset::getAll('rex_articles');
foreach ($articles as $article) {
    echo $article->getRelatedDataset('author')->getValue('name');
}

// Schnell - mit Eager Loading
$articles = rex_yform_manager_dataset::queryAll('
    SELECT a.*, au.name as author_name 
    FROM rex_articles a 
    LEFT JOIN rex_authors au ON a.author_id = au.id
', [], 'rex_articles');

foreach ($articles as $article) {
    echo $article->author_name;
}
?>
```

### Indizes für bessere Performance

```sql
-- Für häufig abgefragte Felder
ALTER TABLE `rex_my_table` ADD INDEX `idx_status_date` (`status`, `created_date`);

-- Für Volltextsuche
ALTER TABLE `rex_my_table` ADD FULLTEXT(`title`, `description`);
```

<a name="debugging"></a>
## Debugging von YForm-Problemen

### Debug-Modus aktivieren

```php
<?php
// In der boot.php oder im Template
if (rex::isBackend() && rex::getUser() && rex::getUser()->isAdmin()) {
    // YForm Debug-Modus
    rex_yform::setDebug(true);
    
    // SQL-Queries anzeigen
    rex_sql::setDebug(true);
}
?>
```

### Häufige Probleme und Lösungen

**Problem: Felder werden nicht gespeichert**
```php
// Überprüfen ob alle Required-Validierungen erfüllt sind
if ($yform->objparams['form_show']) {
    echo 'Formular hat Fehler:';
    print_r($yform->objparams['warning_messages']);
}
```

**Problem: Datei-Uploads funktionieren nicht**
```php
// Überprüfen der Ordner-Berechtigungen
$upload_dir = rex_yform_manager_field::getUploadDir();
if (!is_writable($upload_dir)) {
    echo 'Upload-Ordner nicht beschreibbar: ' . $upload_dir;
}
```

**Problem: E-Mail-Actions senden nicht**
```php
// E-Mail-Konfiguration prüfen
$mailer = rex_mailer::factory();
try {
    $mailer->Subject = 'Test';
    $mailer->Body = 'Test-E-Mail';
    $mailer->addAddress('test@example.com');
    if (!$mailer->send()) {
        echo 'E-Mail-Fehler: ' . $mailer->ErrorInfo;
    }
} catch (Exception $e) {
    echo 'Fehler: ' . $e->getMessage();
}
```

> **Tipp:** Für komplexe YForm-Konfigurationen ist es oft hilfreich, die Konfiguration Schritt für Schritt aufzubauen und jeden Schritt einzeln zu testen.
