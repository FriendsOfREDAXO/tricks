---
title: Suchspalte ein- und ausblenden
authors: [christophboecker]
prio:
---
# Suchspalte ein- und ausblenden

YForm verfügt über eine nützliche Suchfunktion, deren Formular links neben der
der Tabelle oder dem Datensatzformular eingeblendet wird. 

Nur - sie belegt ca. 25% des Fensters. Das kann Platz sein, den man auch gerne für die
Tabelle und das Datensatzformular hätte. Geht nicht beides? 
- Maximaler Platz für Tabelle bzw. Datensatzformular und 
- Suchspalte verfügbar wenn benötigt?

Von Hause aus ist das aktuell nicht möglich. Mit den beiden Helferlein JS und CSS kann die
Funktionalität nachgerüstet werden.

## Lösungsidee

Per Klick auf den Header der Suchspalte wird die Suchspalte aus- oder eingeblendet. Im ausgeblendeten
Zustand ist nur ein Pfeil (Einblenden-Icon) sichtbar.

Die Lösung basiert im Kern auf CSS-Klassen und etwas JS.

Die Klassen müssen beim Start der Seite an geeigneter Stelle eingefügt werden. Außerdem muss beim Start
eine entsprechende Click-Funktion zum Umschalten eingefügt werden.

Am Ende sieht es so aus:

![Suchspalte ausgeblendet](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yf_search_toggle_a.png "Suchspalte ausgeblendet")

![Suchspalte eingeblendet](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/yf_search_toggle_b.png "Suchspalte eingeblendet")


## Der von YForm generierte Code 

Das von YForm generierte HTML bietet keinen Zugriff auf einer oberen Ebene, mit der man zuverlässig
die Kombination aus Suchspalte und Inhaltsspalte erkennen könnte. Es gibt eine `.row` und darunter
zwei `div` als Spalten. 

Als vermutlich eindeutiger Anker kann die **ID** des Suchformulars dienen, die mit **rex_yform_searchvars**
beginnt. Auf `<div class="col-sm-3 col-md-3 col-lg-2">` kann man nicht setzen da nicht eindeutig genug.

```php
<div class="rex-page-main">
   <section class="rex-page-main-inner" id="rex-js-page-main">
      <header class="rex-page-header">...</header>
      <div class="row">
         <div class="col-sm-3 col-md-3 col-lg-2">
            <section class="rex-page-section">
               <div class="panel panel-edit">
                  <header class="panel-heading">
                     <div class="panel-title">Suche</div>
                  </header>
                  <div class="panel-body">
                     <div id="rex-yform" class="yform">
                        <form action="/lboote/recherche/redaxo/index.php" method="get" id="rex_yform_searchvars-rex_kv30_lboot" class="rex-yform" enctype="multipart/form-data">
                        ... das Suchformular
                        </form>
                     </div>
                  </div>
               </div>
            </section>
         </div>
         <div class="col-sm-9 col-md-9 col-lg-10">
            <section class="rex-page-section">
               <div class="panel panel-edit">
                  <header class="panel-heading">
                     <div class="panel-title">Datensatz editieren [id: 11]</div>
                  </header>
                  <div class="panel-body">
                     <div id="rex-yform" class="yform">
                     ... Liste oder Datensatzformular
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </div>
   </section>
</div>
```

## Die Lösung

### CSS

Das CSS formatiert im `.kv30-yf-searchform .panel-heading` das Pseudoelement `:after`. `display` muss angepasst werden, da vorher auf `table` eingestellt.

Im ausgeblendeten Status wird die Suchspalte auf 35px verkleinert, Padding weggenommen und um 20px nach
rechts verschoben - als "Quasi-Button" über die Kopfspalte der Liste bzw. des Formulars. Der Z-Index stellt die Anzeige über deren Kopfzeile
sicher. 

Der Panel-Body der Suchspalte wird ausgeblendet, der Header muss bleiben, sein Inhalt wird 
unsichtbar gemacht. (`.panel-title{display:none}` ist einfacher, hat aber unerwünschte Nebenffekte).

Die Liste (bzw. das Datensatzformular) rechts daneben wird auf die fast volle Breite erweitert, der 
Header-Inhalt wird etwas nach rechts geschoben, um Platz für den "Quasi-Button" zu machen. 

```CSS
.kv30-yf-searchform .panel-heading:after {
    display:inherit;
    content: "\f0d9";
    font-family: "FontAwesome";
    position: absolute;
    font-size:2.5em;
    right: 20px;
    top: 0px;
    color: white;
}
.kv30-yf-searchform-hidden .panel-heading:after {
    content: "\f0da";
    right: 4px;
}
.kv30-yf-searchform-hidden {
    width:35px;
    padding-right: 0;
    z-index: 10;
    margin-right: -20px;
}
.kv30-yf-searchform-hidden .panel-body {
    display: none;
}
.kv30-yf-searchform-hidden .panel-heading  {
    color:transparent;
    width: 0;
    padding-right:3px;
    border-width: 0;
}
.kv30-yf-searchform-hidden ~ .kv30-yf-searchlist {
    width: calc(100% - 15px);
    padding-left: 0;
}
.kv30-yf-searchform-hidden ~ .kv30-yf-searchlist .panel-heading  {
    padding-left: 30px;
}
```

### JS

Das JS sucht `form[id^="rex_yform_searchvars"]`, hangelt sich dann hoch zum Knoten
(eine Ebene unterhalb von `.row`)
Die (hoffentlich) nur zwei Kind-Knoten erhalten die Kennzeichnungs-Klasse `kv30-yf-searchform`
bzw. `kv30-yf-searchlist`. Das Suchformular wird initial ausgeblendet: `kv30-yf-searchform-hidden`.

Der Header des Suchformulars wird mit einem Click-Handler versehen, der `kv30-yf-searchform-hidden`
toggelt.

```js
$(document).ready( function(){
    let search, data;
    for( search of document.querySelectorAll('form[id^="rex_yform_searchvars"]') ) {
        search = search.closest('section').parentNode;
        search.classList.add( 'kv30-yf-searchform' );
        search.classList.add( 'kv30-yf-searchform-hidden' );
        data = search.nextElementSibling;
        data.classList.add( 'kv30-yf-searchlist' );
        search.querySelector( 'section > .panel > .panel-heading').addEventListener( 'click', function(e){search.classList.toggle('kv30-yf-searchform-hidden');},false);
    }
});
```

## Der geänderte HTML-Code

Das HTML ist hier nur noch einmal aufgeführt, um die Platzierung der neuen Klassen zu zeigen.

```php
<div class="rex-page-main">
   <section class="rex-page-main-inner" id="rex-js-page-main">
      <header class="rex-page-header">...</header>
      <div class="row">
         <div class="col-sm-3 col-md-3 col-lg-2 kv30-yf-searchform kv30-yf-searchform-hidden">
            <section class="rex-page-section">
               <div class="panel panel-edit">
                  <header class="panel-heading">
                     <div class="panel-title">Suche</div>
                  </header>
                  <div class="panel-body">
                     <div id="rex-yform" class="yform">
                        <form action="/lboote/recherche/redaxo/index.php" method="get" id="rex_yform_searchvars-rex_kv30_lboot" class="rex-yform" enctype="multipart/form-data">
                        ... das Suchformular
                        </form>
                     </div>
                  </div>
               </div>
            </section>
         </div>
         <div class="col-sm-9 col-md-9 col-lg-10 kv30-yf-searchlist">
            <section class="rex-page-section">
               <div class="panel panel-edit">
                  <header class="panel-heading">
                     <div class="panel-title">Datensatz editieren [id: 11]</div>
                  </header>
                  <div class="panel-body">
                     <div id="rex-yform" class="yform">
                     ... Liste oder Datensatzformular
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </div>
   </section>
</div>
```

## Die Grenzen

Klar, sobald in YForm anderer Code generiert wird, bricht die Logik zusammen.
 
