# Slice-/Modulspezifisches JS/CSS im Template sammeln

## Situation

Im Slack-Channel (https://friendsofredaxo.slack.com/) kommt immer mal wieder die Frage auf, wie im 
Template für einen Slice gezielt JS und CSS aktiviert bzw. eingesammelt werden kann. 
Hier mal eine Lösung, die ganz ohne Addons, spezielle Klasse oder gar weiteres JS auskommt.

Der Möglichkeiten gibt es viele, JS/CSS in eine generierte Seite einzubauen.

Der Standardfall ist zweifellos, die nötigen Komponenten an einer als geeignet empfundenen Stelle
(meist im <head>) *komplett* zu laden. Das ist einfach, bedeutet aber auch Overhead, wenn nicht 
alle Komponenten auf der generierten Seite benötigt werden. Wäre doch schön, nur das JS/CSS einzubauen, 
dass auch wirklich nötig ist.

Im gegenteiligen Fall wird der JS/CSS betreffende Code individuell im Modul-Output generiert und
ausgegeben. Der Code liegt dann irgendwo im Seiten-Code eingestreut. Das ist auf jeden Fall 
unübersichtlich. Zudem besteht das Risiko doppelt eingebauter Aufrufe und daraus resultierend 
Funktionseinbußen.


## Take $this

Der aktuell aufzubauende Artikel wird durch eine Instanz der Klasse `rex_article_content` 
repräsentiert. Sowohl im Template als auch im Modul-Output ist die Instanz verfügbar und kann 
über die Pseudovariable `$this` angesprochen werden. 

PHP erlaubt, zu Instanzen jederzeit eigene Eigenschaften ("Variablen", skalar oder array) hinzufügen, 
zu ändern und auswerten. Da die `rex_article_content`-Instanz als `$this` im Template und im Modul 
verfügbar ist, stellt sie die einfachste und fast ideale Kommunikationsmöglichkeit zwischen Modul 
und Temnplate dar.

Startpunkt im Ablauf ist das Template. Von dort wird mittels `$this->getArticle()` der Inhalt 
generiert. Jeder Slice wird abgearbeitet und der zugehörige HTML-Code durch das zugewiesene Modul 
(bzw. dessen Output-Code) erzeugt. Danach wird der Rest des Template abgearbeitet.

Im Modul wird z.B. ein Flag gesetzt, das im Template ausgewertet wird.

```php
<?php
...
modulcode
...
$this->requireUniteGallery = 1;
```

Abhängig vom Flag werden im Template JS/CSS-Komponenten eingesteuert.

```php
<?php
...
echo $this->getArticle(), PHP_EOL;
...
echo '<script src="assets/core/jquery.min.js" type="text/javascript"></script>', PHP_EOL;
if( isset($this->requireUniteGallery) && $this->requireUniteGallery )
{
    echo '<script src='./assets/unitegallery/js/unitegallery.min.js' type='text/javascript'></script>', PHP_EOL;
    echo '<link href='./assets/unitegallery/css/unite-gallery.css' type='text/css' rel='stylesheet' />', PHP_EOL;
}
```

Das Prinzip ist einfach, die Umsetzung kann man beliebig granular gestalten.


## Flags und Code-Sammler

Ein Flag wird einfach nur auf true oder 1 gesetzt, um zugehörigen Code anzufordern. Das kann gerne 
mehrfach passieren in verschiedenen Slices. Am Ende wird das Template darauf genau einmal reagieren.

Der Code-Sammler wird sinnvoll als Array organisiert. Jeder Slice schreibt seinen mehr oder weniger 
individuell generieren JS/CSS-Code in ein Element des Array. Im Template werden die Elemente in einer 
`<script>`-Klammer bzw. `<style>`-Klammer ausgegeben.

Über den idealen Key im Array lohnt sich etwas nachzudenken.

Ist der Code wirklich komplett individuell (referenziert z.B. auf eine eindeutige Html-Id, die der 
Slice festgelegt hat), bietet sich ein Key an, der auf der eindeutigen REX_SLICE_ID beruht.

Es mag auch Code-Schnipsel geben (z.B. für Funktionen), die zu klein sind, um sie in eine eigene 
JS-Datei zu packen. Die würden einen sprechenden Key erhalten ohne Referenz auf
REX_SLICE_ID o.ä. Werden also Code-Blöcke in unterschiedlichen Slices unter demselben Namen 
eingebaut, bleibt am Ende nur einer übrig - ähnlich wie bei der Flag-Variante.

Hier ein Beispiel für die UniteGallery. Die Aktivierung enthält u.a. Parameter, die aus dem Slice 
kommen. Sie müssen vom Template in eine Document-Ready-Klammer gesetzt werden. Um das zu signalisieren nutz das Beispiel die Eigenschaft `requireJSDR` mit **DR** für Document-Ready:

```php
<?php

...

$this->requireJSDR[REX_SLICE_ID] = '
    $("#slice-REX_SLICE_ID").unitegallery({
        gallery_theme: "'.REX_VALUE[3].'",
        tiles_col_width: '.REX_VALUE[4].',
        tile_enable_textpanel: true,
        tile_textpanel_source: "'.REX_VALUE[2].'",
        lightbox_textpanel_enable_title: true,
        lightbox_textpanel_enable_description: true
    });
';
```

## Muster-Layout für das Template

Im Template werden vor dem Aufruf von `getArticle()` die vorgesehenen Eigenschaften initialisiert. Damit existieren 
sie und im weiteren Verlauf kann die `isset()`-Abfrage entfallen. Via `getArticle()` aufgerufen 
modifiziert der Modul-Output-Code die Eigenschaften. Anschließend baut das Template abhängig von den 
aktuellen Werten den JS/CSS-Teil des HTML-Output zusammen.

Das Beispiel zeigt sowohl den Einsatz von Einzelwerten als Anforderungs-Flags (requireGallery, 
requireTabs) als auch den Einsatz von Code-Sammlern (requireCode...). 

Mit dieser Struktur dürften die meisten Fälle abgedeckt sein.

```php
<?php 

...

$this->requireGallery = 0;      // Galerie-Modul erfordert JS und CSS
$this->requireTabs = 0;         // Tab-Modul erfordert JS und CSS
$this->requireCodeJS = [];      // Sammler für individuellen JS-Code aus Slices
$this->requireCodeJSDR = [];    // Sammler für individuellen JS-Code in $(document).ready()
$this->requireCodeCSS = [];     // Sammler für individuelles CSS

....

$inhalt = $this->getArticle( );

....

// JS einbauen
if( $this->requireGallery || $this->requireTabs || $this->requireCodeJS || $this->requireCodeJSDR )
{
    echo '<script src="assets/core/jquery.min.js" type="text/javascript"></script>', PHP_EOL;
}
if( $this->requireGallery )
{
    echo '<script src='./assets/unitegallery/js/unitegallery.min.js' type='text/javascript'></script>', PHP_EOL;
}
if( $this->requireTabs )
{
    echo '<script src="assets/tabs.js" type="text/javascript"></script>', PHP_EOL;
}
if( $this->requireCodeJS || $this->requireCodeJSDR )
{
    echo '<script>';
    if( $this->requireCodeJSDR )
    {
        echo '$(document).ready( function(){', PHP_EOL;
        foreach( $this->requireCodeJSDR as $code ) echo $code, PHP_EOL;
        echo '});', PHP_EOL;
    }
    if( $this->requireCodeJS )
    {
        foreach( $this->requireCodeJS as $code ) echo $code, PHP_EOL;
    }
    echo '</script>', PHP_EOL;
}
// CSS einbauen
echo '<link href='./assets/basis.css' type='text/css' rel='stylesheet' />', PHP_EOL;
if( $this->requireGallery )
{
    echo '<link href='./assets/unitegallery/css/unite-gallery.css' type='text/css' rel='stylesheet' />', PHP_EOL;
}
if( $this->requireTabs )
{
    echo '<link href='./assets/tabs.css' type='text/css' rel='stylesheet' />', PHP_EOL;
}
if( $this->requireCodeCSS )
{
    echo '<style>', PHP_EOL;
    foreach( $this->requireCodeCSS as $code ) echo $code, PHP_EOL;
    echo '</style>', PHP_EOL;
}
...
```

## Die Grenzen des Verfahrens

Die Instanz von `rex_article_content` steht im Template und den Modulen zur Verfügung. HTML-Ausgaben bzgl.
JS und CSS, die von aus dem Modul oder dem Template heraus aufgerufenen Funktionen, Methoden oder Fragmenten 
direkt erfolgen, werden nicht erfasst.

Da wäre etwas Zusatzaufwand erforderlich, um den Code bzw. die Flags zunächst in das Modu zu transferieren. 


## Alternative und Ergänzung: eine statische Sammelbüchse

Eine weitere Lösung kann mit einer Klasse statischer Funktionen und Eigenschaften aufgebaut werden.

```
class js_css
{
    static codeJS = [];
    static codeJSDR = [];
    static codeCSS = [];
    static require = [];
}
```

Rudimentär reicht das schon, um eine ähnliche Lösung wie mit der `rex_article_content`-Instanz aufzubauen.
(Grobe Abweichung: die Flags müssen Elemente im Array `js_css::require` werden).

Mit weiteren get- und set-Methoden lässt sich die Klasse aufhübschen. 

Über dieses Verfahren können auch Flags und Code aus Methoden, Funktionen und Fragmenten eingesammelt werden.
