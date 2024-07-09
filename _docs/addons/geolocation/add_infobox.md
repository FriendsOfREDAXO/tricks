---
title: Custom-Tools zur Kartengstaltung
authors: [tobiaskrais, christophboecker]
prio:
---

# Custom-Tools zur Kartengestaltung

> Dieser Trick-Artikel ist als ein Sammelbecken für Custom-Tools gedacht. Es muss ja nicht jeder das Rad neu erfinden. Wenn ihr was Tolles habt: bitte gerne teilen.
> - [Lies mich](#readme)
> - [Einzel-Marker mit Popup-Text](#positionplus)
> - [Markerliste mit Popup-Text](#markerplus)
> - [Nummerierte Markerliste mit Popup-Text](#nrmarkerplus)
> - [Markerliste als Karten-Overlay](#markeroverlay)
> - [Markerliste mit interaktivem Filter](tool_markerfilter.md)

(In Geolocation 2.0 wurde der Namespace von `Geolocation` in `FriendsOfRedaxo\Geolocation` geändert!)

<a name="readme"></a>
## Lies mich

[Geolocation](https://github.com/FriendsOfREDAXO/geolocation) liefert nur wenige fest installierte JS-Tools mit aus, über die Karten-Elemente
via Leaflet eingeblendet werden können
- `position`: einen einfachen roten Marker.
- `marker`: eine Liste einfacher, blauer Marker.
- `bounds`: rechteckiger Bereich, der die initial angezeigte Karte über Kordinaten definiert.
- `geojson`: ein rudimentäres geoJson-Tool

Aber: das System kann einfach erweitert werden, um die vielen verschiedenen individuellen Anforderungen passgenau zu bedienen.
Wie, dass ist in der [Tool-Dokumentation](https://github.com/FriendsOfREDAXO/geolocation/blob/master/docs/devtools.md)
beschrieben. Im JS-Source-Code [`install/geolocation.js`](https://github.com/FriendsOfREDAXO/geolocation/blob/master/install/geolocation.js)
findet man die Default-Tools; in [`docs/example/geolocation.js`](https://github.com/FriendsOfREDAXO/geolocation/blob/master/docs/example/geolocation.js)
stehen die Beispiele für Custom-Tools aus der Dokumentation, darunter
- `center`: Kartenmittelpunkt/Zoom-Level; ohne Marker, als klassische Alternative zu `bounds`.
- `nrmarker`: Eine Markerliste (`marker`), aber mit Nummer im Marker.

<a name="positionplus"></a>
## Einzel-Marker mit Popup-Text

### Kurzbeschreibung

Im Grunde handelt es sich um einen Position-Marker  (Tool: `position`). Die Klasse `Geolocation.Tools.Position` wird um
einen Popup-Text erweitert. Es reicht aus, die SetValue-Methode zu überschreiben. Wurde der Position-Marker erfolgreich
angelegt (gültige Koordinaten), hängt die Methode den Popup-Text an den Marker.

### PHP-Datensatz

```php
$dataset = [
    [breitengrad,längengrad],  // übliche Koordinatenangabe
    popup_text,                // optionaler Text; ohne Text ein normaler Marker ohne Popup
    marker_farbe               // optional die Markerfarbe; Default: Geolocation.default.positionColor 
];
```

### Der JS-Code für das Tool

```js
Geolocation.Tools.PositionPlus = class extends Geolocation.Tools.Position{
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
                // NOTE: ja, ist so - isPopupOpen liefert true wenn geschlossen.
                if( this.isPopupOpen() ) {
                    this.openPopup();
                } else {
                    this.closePopup();
                }
            });
        }
        return this;
    }
};
Geolocation.tools.positionplus = function(...args) { return new Geolocation.Tools.PositionPlus(args); };
```

### Beispiel

```php
use FriendsOfRedaxo\Geolocation\Mapset;
use FriendsOfRedaxo\Geolocation\Calc\Box;
use FriendsOfRedaxo\Geolocation\Calc\Point;

$konstanz = Point::byLatLng([47.658968, 9.178456]);

$bounds = Box::byInnerCircle($konstanz,5000);

$position = [
    $konstanz->latLng(),
    '<strong>Konstanz:</strong> '.$konstanz->text(Point::DMS),
];

echo Mapset::take()
    ->dataset('bounds',$bounds->latLng())
    ->dataset('positionplus',$position)
    ->parse();
```

### Kartenanzeige

![positionplus](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/geolocation_01.jpg)


<a name="markerplus"></a>
## Markerliste mit Popup-Text

### Kurzbeschreibung

Im Grunde handelt es sich um eine Marker-Liste (Tool: `marker`). Die Klasse `Geolocation.Tools.Marker`
wird um Popup-Texte je Marker erweitert. Es reicht aus, die SetValue-Methode zu überschreiben. Wurde ein
Marker erfolgreich angelegt (gültige Koordinaten), hängt die Methode den Popup-Text an den Marker.

### PHP-Datensatz

```php
$dataset = [
    [
        [breitengrad,längengrad],  // übliche Koordinatenangabe
        popup_text,                // optionaler Text; ohne Text ein normaler Marker ohne Popup
        marker_farbe               // optional die Markerfarbe; Default: Geolocation.default.markerColor 
    ],
    ...
];
```

### Der JS-Code für das Tool

```js
Geolocation.Tools.MarkerPlus = class extends Geolocation.Tools.Marker{
    setValue( markerArray ) {
        if( this.map ) {
            let map = this.map;
            this.remove();
            this.map = map;
        }
        this.marker = [];
        markerArray.forEach( (data) => {
            let pos = L.latLng( data[0] );
            if( !pos ) return;
            let marker = L.marker( pos );
            if( !marker ) return;
            marker.setIcon( Geolocation.svgIconPin( data[2] || Geolocation.default.markerColor ) );
            if( data[1] ) {
                marker.bindPopup(data[1]);
                marker.on('click', function (e) {
                    // NOTE: ja, ist so - isPopupOpen liefert true wenn geschlossen.
                    if( this.isPopupOpen() ) {
                        this.openPopup();
                    } else {
                        this.closePopup();
                    }
                });    
            }
            this.marker.push( marker );
        } );
        if( this.map ) this.show( this.map );
        return this;
    }
};
Geolocation.tools.markerplus = function(...args) { return new Geolocation.Tools.MarkerPlus(args); };
```

### Beispiel

```php
use FriendsOfRedaxo\Geolocation\Calc\Box;
use FriendsOfRedaxo\Geolocation\Calc\Point;
use FriendsOfRedaxo\Geolocation\Mapset;

$konstanz = Point::byLatLng([47.658968, 9.178456]);
$kressbronn = Point::byLatLng([47.586204, 9.560653]);
$friedrichshafen = Point::byLatLng([47.651695, 9.485064]);

$bounds = Box::factory([$konstanz, $friedrichshafen, $kressbronn]);

$marker = [
    [$konstanz->latLng(), '<strong>Konstanz:</strong> ' . $konstanz->text(Point::DMS), 'DarkSeaGreen'],
    [$friedrichshafen->latLng(), '<strong>Friedrichshafen:</strong> ' . $friedrichshafen->text(Point::DMS), 'ForestGreen'],
    [$kressbronn->latLng(), '<strong>Konstanz:</strong> ' . $kressbronn->text(Point::DMS)],
];

echo Mapset::take()
    ->dataset('bounds', $bounds->latLng())
    ->dataset('markerplus', $marker)
    ->parse();
```

### Kartenanzeige

![markerplus](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/geolocation_02.jpg)


<a name="nrmarkerplus"></a>
## Nummerierte Markerliste mit Popup-Text

### Kurzbeschreibung

Im Grunde handelt es sich um eine nummerierte Marker-Liste (Tool: `nrmarker` aus den
([Beispielen](https://github.com/FriendsOfREDAXO/geolocation/blob/master/docs/devtools.md#nrmarker)).
Die Klasse `Geolocation.Tools.Marker` wird um Popup-Texte und die Nummer je Marker erweitert. Es reicht aus,
die SetValue-Methode zu überschreiben. Wurde ein Marker erfolgreich angelegt (gültige Koordinaten), hängt die
Methode den Popup-Text an den Marker. Die Nummer ist ein optionaler Parameter bei `Geolocation.svgIconPin(..)`.

### PHP-Datensatz

```php
$dataset = [
    [
        [breitengrad,längengrad],  // übliche Koordinatenangabe
        popup_text,                // optionaler Text; ohne Text ein normaler Marker ohne Popup
        marker_nr                  // optional die Nummer des Markers; Default: ohne
        marker_farbe               // optional die Markerfarbe; Default: Geolocation.default.markerColor
    ],
   ...
];
```

### Der JS-Code für das Tool

```js
Geolocation.Tools.NrMarkerPlus = class extends Geolocation.Tools.Marker{
    setValue( markerArray ) {
        if( this.map ) {
            let map = this.map;
            this.remove();
            this.map = map;
        }
        this.marker = [];
        markerArray.forEach( (data) => {
            let pos = L.latLng( data[0] );
            if( !pos ) return;
            let marker = L.marker( pos );
            if( !marker ) return;
            marker.setIcon( Geolocation.svgIconPin( data[3] || Geolocation.default.markerColor, data[2] || '', 'darkred' ) );
            if( data[1] ) {
                marker.bindPopup(data[1]);
                marker.on('click', function (e) {
                    // NOTE: ja, ist so - isPopupOpen liefert true wenn geschlossen.
                    if( this.isPopupOpen() ) {
                        this.openPopup();
                    } else {
                        this.closePopup();
                    }
                });
            }
            this.marker.push( marker );
        } );
        if( this.map ) this.show( this.map );
        return this;
    }
};
Geolocation.tools.nrmarkerplus = function(...args) { return new Geolocation.Tools.NrMarkerPlus(args); };
```

### Beispiel

```php
use FriendsOfRedaxo\Geolocation\Calc\Box;
use FriendsOfRedaxo\Geolocation\Calc\Point;
use FriendsOfRedaxo\Geolocation\Mapset;

$konstanz = Point::byLatLng([47.658968, 9.178456]);
$kressbronn = Point::byLatLng([47.586204, 9.560653]);
$friedrichshafen = Point::byLatLng([47.651695, 9.485064]);

$bounds = Box::factory([$konstanz,$friedrichshafen,$kressbronn]);

$marker = [
    [$konstanz->latLng(), '<strong>Konstanz:</strong> '.$konstanz->text(Point::DMS), 1, 'DarkSeaGreen'],
    [$friedrichshafen->latLng(),'<strong>Friedrichshafen:</strong> '.$friedrichshafen->text(Point::DMS), 2, 'ForestGreen'],
    [$kressbronn->latLng(),'<strong>Konstanz:</strong> '.$kressbronn->text(Point::DMS), 3],
];

echo Mapset::take()
    ->dataset('bounds',$bounds->latLng())
    ->dataset('nrmarkerplus',$marker)
    ->parse();
```

### Kartenanzeige

![nrmarkerplus](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/geolocation_03.jpg)


<a name="markeroverlay"></a>
## Nummerierte Markerliste mit Popup-Text als Karten-Overlay

### Kurzbeschreibung

(benötigt Geolocation ab Version 2.3.0)

Diese Weiterentwicklung des Tools [MarkerPlus](#nrmarkerplus) fasst die Marker in einer Leaflet-LayerGroup zusammen.
Die LayerGroup erhält einen Eintrag in der Karten-Auswahl, genauer: Auswahl der Overlay-Karten. Wie das genau funktioniert
ist in der LeafLet-Dokumentation beschrieben ([Layer Groups and Layers Control](https://leafletjs.com/examples/layers-control/)).

Das Tool basisiert diesmal auf dem `Geolocation.Tools.Template`, da ohnehin alle Methoden überschrieben werden.
In `setValue` wird das Dataset-Array ausgewertet, die Marker erzeugt und in der LAyerGroup zusammengefasst. In `show`
und `remove` wird zusätzlich der Eintrag im Overlay-Menü verwaltet.

### PHP-Datensatz

```php
$dataset = [
    label,                         // Titel für den Oberlay-Layer im Overlay-Menü
    aktiviert,                     // true oder false; wenn true wird der Layer sofort aufgeblendet
    [
        [breitengrad,längengrad],  // übliche Koordinatenangabe
        popup_text,                // optionaler Text; ohne Text ein normaler Marker ohne Popup
        marker_nr                  // optional die Nummer des Markers; Default: ohne
        marker_farbe               // optional die Markerfarbe; Default: Geolocation.default.markerColor
    ],
   ...
];
```

### Der JS-Code für das Tool

```js
Geolocation.Tools.MarkerOverlay = class extends Geolocation.Tools.Template{
    setValue( overlayArray ) {
        if( this.map ) {
            let map = this.map;
            this.remove();
            this.map = map;
        }
        this.label = overlayArray[0];
        this.active = overlayArray[1] === true;
        this.markerGroup = L.layerGroup();
        overlayArray[2].forEach( (data) => {
            let pos = L.latLng( data[0] );
            if( !pos ) return;
            let marker = L.marker( pos );
            if( !marker ) return;
            marker.setIcon( Geolocation.svgIconPin( data[2] || Geolocation.default.markerColor ) );
            if( data[1] ) {
                marker.bindPopup(data[1]);
                marker.on('click', function (e) {
                    // NOTE: ja, ist so - isPopupOpen liefert true wenn geschlossen.
                    if( this.isPopupOpen() ) {
                        this.openPopup();
                    } else {
                        this.closePopup();
                    }
                });
            }
            this.markerGroup.addLayer( marker );
        } );
        if( this.map ) this.show( this.map );
        return this;
    }
    show (map) {
        super.show( map );
        if( this.markerGroup instanceof L.LayerGroup ) {
            if( this.active) {
                this.markerGroup.addTo( map );
            }
            let layerControl = map._container.__rmMap.layerControl;
            layerControl.addOverlay( this.markerGroup, this.label );
        }
        return this;
    }
    remove(){
        if( this.markerGroup instanceof L.LayerGroup ) {
            this.markerGroup.removeFrom(this.map);
            let layerControl = map._container.__rmMap.layerControl;
            layerControl.removeLayer( this.markerGroup );
        }
        super.remove();
        return this;
    }
    getCurrentBounds(){
        let rect = L.latLngBounds();
        if( this.markerGroup instanceof L.LayerGroup ) {
            this.markerGroup.eachLayer( (marker) => {
                rect.extend( marker.getLatLng() );
            });
        }
        return rect;
    }
};
Geolocation.tools.markeroverlay = function(...args) { return new Geolocation.Tools.MarkerOverlay(args); };
```

### Beispiel

```php
use FriendsOfRedaxo\Geolocation\Calc\Box;
use FriendsOfRedaxo\Geolocation\Calc\Point;
use FriendsOfRedaxo\Geolocation\Mapset;

$konstanz = Point::byLatLng([47.658968, 9.178456]);
$kressbronn = Point::byLatLng([47.586204, 9.560653]);
$friedrichshafen = Point::byLatLng([47.651695, 9.485064]);

$bounds = Box::factory([$konstanz, $friedrichshafen, $kressbronn]);

$overlay = [
    'Häfen',
    false,
    [
        [$konstanz->latLng(), '<strong>Konstanz:</strong> ' . $konstanz->text(Point::DMS), 'Red'],
        [$friedrichshafen->latLng(), '<strong>Friedrichshafen:</strong> ' . $friedrichshafen->text(Point::DMS), 'ForestGreen'],
        [$kressbronn->latLng(), '<strong>Konstanz:</strong> ' . $kressbronn->text(Point::DMS)],
    ],
];

echo Mapset::take()
    ->dataset('bounds', $bounds->latLng())
    ->dataset('markeroverlay', $overlay)
    ->parse();
```

### Kartenanzeige

![markeroverlay](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/geolocation_04.jpg)
