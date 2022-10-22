---
title: Geolocation: Infobox zum Marker hinzufügen
authors: [tobiaskrais, christophboecker]
prio:
---

# Infobox zum Marker hinzufügen

Folgender JavaScript Code sollte nach den Assets und vor dem PHP Code eingebunden werden um einen Marker mit Infobox hinzuzufügen: 

```html
<script>
    Geolocation.Tools.Infobox = class extends Geolocation.Tools.Position{
        setValue( dataset ) {
            // keine Koordinaten => Abbruch
            if( !dataset[0] ) return this;

            // GGf. Default-Farbe temporär ändern, normalen Position-Marker erzeugen
            let color = Geolocation.default.positionColor;
            Geolocation.default.positionColor = dataset[2] || Geolocation.default.positionColor;
            super.setValue(dataset[0]);
            Geolocation.default.positionColor = color;

            // Wenn angegeben: Text als Popup hinzufügen
            if( this.marker && dataset[1] ) {
                this.marker.bindPopup(dataset[1]);
                this.marker.on('click', function (e) {
                    this.openPopup();
                });
            }
            return this;
        }
    };
    Geolocation.tools.infobox = function(...args) { return new Geolocation.Tools.Infobox(args); };
</script>
```

Dieser JavaScript Code kann nun wie folgt aufgerufen werden:

```php
<?php
echo Geolocation\Mapset::take()
    ->dataset('bounds',[[52.59,13.45],[52.41,13.15]])
    ->dataset('infobox|a',[[52.5,13.3],'Berlin! Berlin!','green'])
    ->dataset('infobox|b',[[52.6,13.3],'Berlin! Berliiiiin!','red'])
    ->dataset('infobox|c',[[52.5,13.2],'Berlin! Berlin?','blue'])
    ->parse();
```
