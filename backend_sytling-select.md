# Select-Felder Styling

## Bootstrap-Select
In Redaxo ist bereits Bootstrap-Select https://silviomoreto.github.io/bootstrap-select/ integriert. 
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

### Anwendung in yForm
Anwendung unter **Individuelle Attribute**: 
{"class": "selectpicker", "data-live-search": "true"}

> Die Selects können mit noch weitaus mehr Funktionen ausgestattet werden, mehr dazu unter: https://silviomoreto.github.io/bootstrap-select/examples/



## Select2 
Im Tools-Plugin von yForm wird select2 mitgeliefert. Dieses bietet ebenfalls weitreichende Lösungen zur Verbesserung der Selects. 
Eine Anleitung findet man in der Dokumentation von yForm. 
