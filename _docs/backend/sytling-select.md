---
title: Select-Felder Styling
authors: [skerbis]
prio:
---

# Select-Felder Styling

## REDAXO eigener Select-Stil rex-select-style

Zur Anwendung des REDAXO-Stils für Selects muss im übergeordneten DIV die CSS-Class **rex-select-style** eingesetzt werden.

Beispiel:
```php
<div class="col-sm-3">
    <div class="rex-select-style">
        <select id="REX_INPUT_VALUE[12]" class="form-control" name="REX_INPUT_VALUE[12]">
        <option value="nein">nicht anzeigen</option>
        <option value='ja' <?php if ("REX_VALUE[12]" == 'ja') echo 'selected'; ?>>anzeigen </option>
        </select>
    </div>
</div>
```

## Bootstrap-Select

In REDAXO ist bereits [Bootstrap-Select](https://silviomoreto.github.io/bootstrap-select/) integriert.
Hiermit können die Select-Felder schöner in REDAXO gestaltet werden. Darüber hinaus ist es möglich auch eine Suche leicht in die Selects zu integrieren.

### Grundlegende Verwendung

Um den Bootstrap-Select-Stil anzuwenden, muss das Select mit der CSS-Class **selectpicker** ausgestattet werden:

```html
<select class="selectpicker">
  <option>Irgendwas</option>
  <option>Noch ein Punkt</option>
  <option>und so weiter</option>
</select>
```

### Erweiterte Funktionen

#### Live-Suche

Für eine Suche fügt man das Attribut **data-live-search="true"** hinzu:

```html
<select class="selectpicker" data-live-search="true">
  <option>Irgendwas</option>
  <option>Noch ein Punkt</option>
  <option>und so weiter</option>
</select>
```

#### Mehrfachauswahl

Für eine Mehrfachauswahl kann das `multiple`-Attribut verwendet werden:

```html
<select class="selectpicker" multiple>
  <option>Option 1</option>
  <option>Option 2</option>
  <option>Option 3</option>
</select>
```

#### Gruppierung von Optionen

Optionen können mit `optgroup` gruppiert werden:

```html
<select class="selectpicker">
  <optgroup label="Gruppe 1">
    <option>Option 1.1</option>
    <option>Option 1.2</option>
  </optgroup>
  <optgroup label="Gruppe 2">
    <option>Option 2.1</option>
    <option>Option 2.2</option>
  </optgroup>
</select>
```

#### Individuelles Styling

Optionen können mit Icons und Badges versehen werden:

```html
<select class="selectpicker">
  <option data-icon="fa fa-globe">Mit Icon</option>
  <option data-content="Text <span class='badge bg-primary'>NEU</span>">Mit Badge</option>
</select>
```

### Anwendung in MForm

Beispiele für verschiedene MForm-Implementierungen:

```php
<?php
use FriendsOfRedaxo\MForm;
$mform = MForm::factory();

// Einfaches Select mit Suche
$mform->addSelectField("2.0", 
    array(1 => 'option 1', 2 => 'option 2'), 
    array(
        'label'=>'Select Label',
        'class'=>'selectpicker',
        'data-live-search'=>'true',
        'default-value'=>2
    )
);

// Multiple Select mit Gruppierung
$mform->addSelectField("2.1",
    array(
        'Gruppe 1' => array(
            1 => 'Option 1.1',
            2 => 'Option 1.2'
        ),
        'Gruppe 2' => array(
            3 => 'Option 2.1',
            4 => 'Option 2.2'
        )
    ),
    array(
        'label'=>'Gruppiertes Select',
        'class'=>'selectpicker',
        'data-live-search" => 'true',
        'data-actions-box' => 'true',
        'multiple'=>'true'
    )
);

echo $mform->show();
```

### Anwendung in yForm

#### Basis-Konfiguration
Anwendung unter **Individuelle Attribute**:

```json
{"class": "form-control selectpicker","data-live-search": "true"}
```

#### Erweiterte Konfiguration
Für komplexere Anforderungen können weitere Attribute hinzugefügt werden:

```json
{
    "class": "form-control selectpicker",
    "data-live-search": "true",
    "data-actions-box": "true",
    "data-selected-text-format": "count > 3",
    "multiple": "true"
}
```

### Nützliche data-Attribute

- `data-size="5"`: Begrenzt die Anzahl der sichtbaren Optionen
- `data-actions-box="true"`: Fügt "Alles auswählen/abwählen" Buttons hinzu (nur bei multiple)
- `data-selected-text-format="count"`: Zeigt die Anzahl der ausgewählten Optionen an
- `data-show-subtext="true"`: Ermöglicht die Anzeige von Subtext
- `data-width="auto"`: Steuert die Breite des Select-Feldes
- `data-style="btn-primary"`: Ändert das Aussehen des Select-Buttons

### JavaScript Events

Bootstrap-Select bietet verschiedene Events, die für eigene Funktionen genutzt werden können:

```javascript
$('select').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    // Code der bei Änderung ausgeführt wird
});
```

Verfügbare Events:
- `show.bs.select`: Wird ausgelöst, wenn die Dropdown-Liste geöffnet wird
- `shown.bs.select`: Wird ausgelöst, nachdem die Dropdown-Liste geöffnet wurde
- `hide.bs.select`: Wird ausgelöst, wenn die Dropdown-Liste geschlossen wird
- `hidden.bs.select`: Wird ausgelöst, nachdem die Dropdown-Liste geschlossen wurde
- `loaded.bs.select`: Wird ausgelöst, nachdem die Bootstrap-Select Instanz erstellt wurde
- `refreshed.bs.select`: Wird ausgelöst, nachdem die Bootstrap-Select Instanz aktualisiert wurde
- `changed.bs.select`: Wird ausgelöst, wenn eine Option ausgewählt wird

### Refresh nach dynamischen Änderungen

Wenn Optionen dynamisch hinzugefügt oder entfernt werden, muss der Selectpicker aktualisiert werden:

```javascript
$('.selectpicker').selectpicker('refresh');
```

### Mobile Optimierung

Bootstrap-Select passt sich automatisch an mobile Geräte an. Für eine bessere mobile Nutzung können zusätzliche Optionen gesetzt werden:

```html
<select class="selectpicker" 
        data-mobile="true" 
        data-live-search="true" 
        data-size="7">
    <!-- Optionen -->
</select>
```

> **Hinweis**: Die Selects können mit weitaus mehr Funktionen ausgestattet werden. Die vollständige Dokumentation unter: [https://developer.snapappointments.com/bootstrap-select/](https://developer.snapappointments.com/bootstrap-select/)
