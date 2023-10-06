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
		<option value='ja' <?php if ("REX_VALUE[12]" == 'ja') echo 'selected'; ?>>anzeigen </option >
		</select>
	</div>
</div>

```

## Bootstrap-Select
In REDAXO ist bereits [Bootstrap-Select](https://silviomoreto.github.io/bootstrap-select/) integriert.
Hiermit können die Select-Felder schöner in REDAXO gestaltet werden. Darüber hinaus ist es möglich auch eine Suche leicht in die Selects zu integrieren.
Um den Stil anzuwenden muss das Select mit der CSS-Class **selectpicker** ausgestattet werden:

Beispiel:

```html
<select class="selectpicker">
  <option>Irgendwas</option>
  <option>Noch ein Punkt</option>
  <option>und so weiter</option>
</select>
```
Für eine Suche fügt man das Attribut **data-live-search="true"** hinzu.

Beispiel:

```html
<select class="selectpicker" data-live-search="true">
  <option>Irgendwas</option>
  <option>Noch ein Punkt</option>
  <option>und so weiter</option>
</select>
```
### Anwendung in MForm

```PHP
$mform = new MForm();
// select use add method attributes parameter
$mform->addSelectField("2.0", array(1 => 'option 1', 2 => 'option 2'), array(
    'label'=>'Select Label',
    'class'=>'selectpicker',
    'data-live-search'=>'true',
    'default-value'=>2));
echo $mform->show();
```


### Anwendung in yForm
Anwendung unter **Individuelle Attribute**:

```json
{"class": "form-control selectpicker","data-live-search": "true"}
```

> Die Selects können mit weitaus mehr Funktionen ausgestattet werden, mehr dazu unter: [
https://developer.snapappointments.com/bootstrap-select/](https://developer.snapappointments.com/bootstrap-select/)



## Select2
Im Tools-Plugin von yForm wird select2 mitgeliefert. Dieses bietet ebenfalls weitreichende Lösungen zur Verbesserung der Selects.
Eine Anleitung findet man in der Dokumentation von yForm.
