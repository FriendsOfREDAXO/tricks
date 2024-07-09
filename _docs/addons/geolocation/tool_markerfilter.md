---
title: Custom-Tools - Markerliste mit interaktivem Filter
authors: [christophboecker]
prio:
---

# Custom-Tools zur Kartengestaltung

## Lies mich

[Geolocation](https://github.com/FriendsOfREDAXO/geolocation) liefert nur wenige
fest installierte JS-Tools mit aus, über die Karten-Elemente via Leaflet eingeblendet
werden können. Aber: das System kann einfach erweitert werden, um die vielen
verschiedenen individuellen Anforderungen passgenau zu bedienen.

Wie, dass ist in der [Tool-Dokumentation](https://github.com/FriendsOfREDAXO/geolocation/blob/master/docs/devtools.md)
beschrieben. Im JS-Source-Code [`install/geolocation.js`](https://github.com/FriendsOfREDAXO/geolocation/blob/master/install/geolocation.js)
findet man die Default-Tools; in [`docs/example/geolocation.js`](https://github.com/FriendsOfREDAXO/geolocation/blob/master/docs/example/geolocation.js)
stehen die Beispiele für Custom-Tools aus der Dokumentation.
Im FOR-Trick [Custom-Tools zur Kartengstaltung](https://friendsofredaxo.github.io/tricks/addons/geolocation/add_infobox)
sind weitere spezialisierte Tools zu finden.

Dieser Trick ist etwas aufwendiger und erhält einen eigenen Artikel spendiert.

## **Custom-Tool: Markerliste mit interaktivem Filter**

### Kurzbeschreibung

Auf der Karte werden mehrere Marker angezeigt. Über Eingabefelder (`<select>`,
`<input>`) können verschiedene Filter additiv (`&&`) zur Feinauswahl benutzt werden.
Änderungen der Filter werden unmittelbar in der Karte sichtbar. 

Das Tool selbst ist generisch; der Vergleich Filter-Einstellung vs. Marker-Parameter
erfolgt durch eine fallspezifische Callback-Funktion.

### PHP-Datensatz

Der Datensatz enthält neben dem Angaben für Koordinate, Popup-Text und Farbe
ein Array mit den Filter-Kriterien bzw. den Eigenschaften dieses Markers

```php
$dataset = [
    [
        [breitengrad,längengrad],  // übliche Koordinatenangabe
        popup_text,                // Der anzuzeigende Popup-Text
        [ filter1, ...]            // Array mit Filterwerten
        marker_farbe               // optional die Markerfarbe; Default: Geolocation.default.positionColor
    ],
    ....
];
```

Hier wird vereinfachend davon ausgegangen, dass die Filterwerte im Array stets
belegt sind, also ein leerer Wert als leerer String.

### Der JS-Code für das Tool

Der wesentliche Punkt hier: wenn das Tool auf die Karte gelegt wird (`show`),
wird auch ein Event-Listener eingerichtet. Bei jeder Änderung des Filtersatzes
wird später über diesen Event die Methode `evtFilter` ausgelöst. Per Callback
ermittelt `evtFilter`, welche Marker angezeigt werden und welche nicht.
Die fallspezifische Callback-Funktion wird in `event.detail` übermittelt.

```js
Geolocation.Tools.MarkerFilter = class extends Geolocation.Tools.Template{
    setValue( dataset ) {
        if( this.map ) {
            let map = this.map;
            this.remove();
            this.map = map;
        }
        this.markerGroup = L.layerGroup();
        dataset.forEach( (data) => {
            let pos = L.latLng( data[0] );
            if( !pos ) return;
            let marker = L.marker( pos );
            if( !marker ) return;
            marker.setIcon( Geolocation.svgIconPin( data[3] || Geolocation.default.markerColor ) );
            // Filterkriterien im Marker selbst speichern
            // Alle Filter-Kriterien haben valide Werte
            marker._filter = data[2];
            // Popup-Text (Firmenname, ...)
            marker.bindPopup(data[1]);
            marker.on('click', function (e) {
                // NOTE: ja, ist so - isPopupOpen liefert true wenn geschlossen.
                if( this.isPopupOpen() ) {
                    this.openPopup();
                } else {
                    this.closePopup();
                }
            });
            this.markerGroup.addLayer( marker );
        } );
        if( this.map ) this.show( this.map );
        return this;
    }
    show (map) {
        super.show( map );
        if( this.markerGroup instanceof L.LayerGroup ) {
            this.markerGroup.addTo( map );
            document.addEventListener('Geolocation:MarkerFilter.filter',this.evtFilter.bind(this));
        }
        return this;
    }
    remove(){
        if( this.markerGroup instanceof L.LayerGroup ) {
            this.markerGroup.removeFrom(this.map);
        }
        document.removeEventListener('Geolocation:MarkerFilter.filter',this.evtFilter.bind(this));
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
    // Event-Handler für Änderungen der Filter. In event.detail kommt
    // eine Funktion mit, die als Callback auf jeden Marker angewandt wird
    evtFilter(event) {
        this.markerGroup.eachLayer( (marker) => {
            if(event.detail(marker._filter)) {
                marker.addTo(this.map) // auf die Karte packen
            } else {
                marker.remove();       // von der Karte nehmen
            }
        });
    }
};
Geolocation.tools.markerfilter = function(...args) { return new Geolocation.Tools.MarkerFilter(args); };
```

### Beispieldaten

Für dieses Beispiel ist ein größerer Datenbestand hilfreich.
Die [Demodaten](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/files/GeolocationMarkerFilter.yml)
bitte nach `redaxo/data/addons/geolocation` kopieren, denn dort sucht der
Beispielcode nach der Datei.

Die Datei enthält drei Arrays:
- Bundesländer
- Branchen
- Firmen 

### Beispiel

Der Code umfasst drei Hauptsegmente:

- Einlesen und Aufbereiten der Beispieldaten

- Aufbau und Ausgabe der Filterfelder

  Die Felder sind einfach gehalten und über eine ID identifizierbar.

- Aufbereiten der Kartendaten und Ausgabe der Karte

  Die Marker werden als Array bereitgestellt. Die Filter-Daten je Marker bestehen
  aus

  - [0] ID des jeweiligen Bundeslangds (siehe `$demodaten['bundesland']`)
  - [1] Array mit einer oder mehreren Branchen-IDs (siehe `$demodaten['branche']`)
  - [2] Firmennamen für Freitextsuche

- Ausgabe des JS zur Initialisierung

    Die Initialisierung erfolgt mit einer selbstausführenden anonymen Funktion,
    so dass die Variablen nicht im allgemeinen Namensraum angelegt werden, um
    Namenskonflikte zu vermeiden.

    1) die Inputs über ihre IDs ausfindig machen
    2) eine Vergleichsfunktion aufsetzen, die per Custopm-Event bei Änderungen der 
       Filterfelder an das Tool geschickt wird, um die Marker abzugleichen
    3) Einen Event-Handler aufsetzen, der eben diese Vergleichsfunktion bei 
       Feldänderungen verschickt
    4) Den Event-Handler auf die Filterfelder hängen 

```php
use FriendsOfRedaxo\Geolocation\Calc\Box;
use FriendsOfRedaxo\Geolocation\Calc\Point;
use FriendsOfRedaxo\Geolocation\Mapset;

/**
 * Demodaten einlesen.
 */
$demoFile = rex_path::addonData('geolocation', 'GeolocationMarkerFilter.yml');
$demodaten = rex_file::getConfig($demoFile, '[]');

/**
 * Filterfelder aufbauen.
 */
$htmlKey = uniqid('geolocation-markerfilter-');
?>
<fieldset class="form-horizontal">
    <legend>Tolle Firmen in D</legend>

    <div class="form-group">
        <label class="col-sm-2 control-label" for="<?= $htmlKey ?>bula">Bundesland</label>
        <div class="col-sm-10">
            <select id="<?= $htmlKey ?>bula" class="form-control">
            <option value="">(alle)</option>
            <?php
            foreach ($demodaten['bundesland'] as $k => $v) {
                echo '<option value="',$k,'">',$v,'</option>';
            }
            ?>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-sm-2 control-label" for="<?= $htmlKey ?>branche">Branche</label>
        <div class="col-sm-10">
            <select id="<?= $htmlKey ?>branche" class="form-control">
            <option value="">(alle)</option>
            <?php
            foreach ($demodaten['branche'] as $k => $v) {
                echo '<option value="',$k,'">',$v,'</option>';
            }
            ?>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-sm-2 control-label" for="<?= $htmlKey ?>name">Firma/Name</label>
        <div class="col-sm-10">
            <input class="form-control" id="<?= $htmlKey ?>name" type="text" value="" />
        </div>
    </div>

</fieldset>
<?php

/**
 * Marker für die Karte zusammenbauen.
 */
$marker = [];
foreach ($demodaten['firma'] as $k => $v) {
    $v['branche'] = '' === $v['branche'] ? [] : explode(',',$v['branche']);
    $popup = sprintf(
        '%s<br>%s<br>%s',
        $v['name'],
        implode(', ',array_intersect_key($demodaten['branche'],array_flip($v['branche']))),
        $v['stadt'],
    );
    $marker[] = [
        $v['latlng'],               // 0: Koordinate [längengrad,breitengrad]
        $popup,                     // 1: Popup-text
        [                           // 2: Filter
            $v['bundesland'],       //    0: Bundesland-ID
            $v['branche'],          //    1: Branchen-ID
            strtolower($v['name'])  //    2: Name (muss lowercase sein!) 
        ],
    ];
}

/**
 * die Mindestabmessung des Anzeigebereichs aus den Koordinaten errechnen.
 * 
 * @var Box|null $bounds
 */
$bounds = null;
foreach ($marker as $v) {
    $point = Point::byLatLng($v[0]);
    if (null === $bounds) {
        $bounds = Box::factory([$point]);
    } else {
        $bounds->extendBy($point);
    }
}

echo Mapset::take()
    ->dataset('bounds', $bounds->latLng())
    ->dataset('markerfilter', $marker)
    ->parse();

?>
<script>
/**
 * Script zur Verwaltung der Filter-Felder
 */
(function () {

    // Die Eingabefelder für Filterkriterien identifizieren.
    let bundeslandFilter = document.getElementById('<?= $htmlKey ?>-bula');
    let branchenFilter = document.getElementById('<?= $htmlKey ?>-branche');
    let firmenFilter = document.getElementById('<?= $htmlKey ?>-name');

    // Mit dieser Funktion werden die Filterwerte der einzelnen Marker gegen die
    // Feldwerte geprüft; TRUE = Marker anzeigen
    let visibilityChecker = (filter) => {
        // Bundesland nicht angegeben (alle) oder mit Marker-Wert übereinstimmend
        ok = (bundeslandFilter.value == '' || bundeslandFilter.value == filter[0]);
        // Branche nicht angegeben (alle) oder in der Branchenliste (Array) des Markers
        ok = ok && (branchenFilter.value == '' || filter[1].includes(branchenFilter.value));
        // Firmenname nicht angegeben (alle) oder mit der Zeichenkette im Marker-Namen
        ok = ok && (firmenFilter.value == '' || filter[2].includes(firmenFilter.value.toLowerCase()));
        return ok;
    };

    // dieser Eventhandler wird ausgelöst, wenn die Filterfelder sich verändern
    // Übermittelt "visibilityChecker" an das Tool
    let evtHandler = (event) => {
        let options = {
            bubbles: true,
            cancelable: true,
            detail: visibilityChecker
        };
        document.dispatchEvent(new CustomEvent('Geolocation:MarkerFilter.filter', options));
    }

    // Eventhandler an die Filterfelder hängen
    bundeslandFilter.addEventListener('change', evtHandler);
    branchenFilter.addEventListener('change', evtHandler);
    firmenFilter.addEventListener('input', evtHandler);

    // Einmalig mit den aktuellen Werten in den Filterfeldern synchronisieren
    evtHandler();
})();
</script>
```

### Kartenanzeige

#### Beispiel: ein Kriterium (Branche)

![MarkerFilter Beispiel 1](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/geolocation_05.jpg)

#### Beispiel: zwei Kriterien (Bundesland, Freitext)

![MarkerFilter Beispiel 1](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/geolocation_06.jpg)
