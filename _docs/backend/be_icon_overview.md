---
title: Durchsuchbare Icon-Übersicht
authors: [christophboecker]
prio:
---

## Durchsuchbare Icon-Übersicht

In der CSS-Datei `style.css`, die vom Addon 'be_style' bereitgestellt wird, sind Icons aus mehreren
Quellen enthalten.

* FontAwesome (`.fa`)
* Glyhicons aus Bootstrap (`.glyphicon`)
* Redaxo-Icons (`.rex-icon`) auf Basis von FontAwesome

Aber welche gibt es denn nun? Und wie sehen sie aus? Dazu kann man z.B. auf die Webseiten von 
[FontAwesome](https://fontawesome.com/) oder [Bootstrap](https://getbootstrap.com/) gehen und suchen -
aber bitte die richtige Version auswählen, die auch in Redaxo im Einsatz ist. Und wo findet sich die Übersicht der rex-icon?

Eine Hilfsseite im Redaxo-Backend soll schnelle Übersicht über die tatsächlich vorhandenen
Icons der `style.css` schaffen und auch die rex-icon ausweisen.

`style.css` ist per SCSS erzeugt, daher sehr klar aufgebaut und leicht durchsuchbar. Die Einträge
für Icons sehen z.B. so aus:

```css
.fa-user:before,.rex-icon-user:before,.rex-icon-userrole:before{content:"\f007"}
```

Sie lassen sich leicht herausfiltern und aufbereitet als Page ausgeben. Zusätzlich wird eine Such- und
Selektier-Möglichkeit geschaffen: 

* Per Checkbock selektieren, welche Gruppe angezeigt wird (`.fa`, `.glyphicon`, `.rex-icon`)
* Volltextsuche in den Icon-Bezeichnern (Im Beispiel: "user,userrole").

![](https://user-images.githubusercontent.com/10065904/51799583-01265580-2223-11e9-9746-b32004ea5edf.png)

Zudem kann mit Doppelklick auf den Namen der zugehörige HTML-Tag generiert und ins Clipboard übertragen werden.
Beispiel: Doppelklick auf das Wort "times" im rechten Kästchen erzeugt `<i class=fa fa-times"></i>`.

Die `style.css` wird nur einmal durchsucht und der HTML-Code zur Anzeige aufbereitet im Cache-Verzeichnis
abgelegt. Die Icons sind nach Unicode aufsteigend sortiert. 

Das Script ist konzipiert als Seite in einem Service-Addon - z.B. im "Projekt-Addon".

* Script speichern als `«domain»/redaxo/src/addons/project/pages/icons.php` (falls der Ordner `pages` nicht vorhanden ist, diesen vorher erstellen)
* Script `icons.php` jetzt in der `index.php` des `pages`-Orders einbinden (falls die Datei `index.php` nicht vorhanden ist, diese neu erstellen)
  ```php
  <?php

  echo rex_view::title('AddOn: project');
  include('icons.php');

  ?>
  ```

* Seite über `package.yml` einbinden
    ```yml
    page:
        title: 'Projekt-Addon'
        perm: project[]
        subpages:
            icons:
                title: 'Icons'
                icon: fa fa-table
    ```
Und hier das Script inklusive CSS und JS:

```php
<?php

$types = ['FontAwesome'=>'fa','REX'=>'rex-icon','Glyphicons'=>'glyphicon'];
$filename = $this->getCachePath('icons.html');

//------ Typen einlesen oder neu generieren
$html = @file_get_contents($filename);

if( !$html ) {

    // styles.css einlesen, Kommentare rauswerfen
    $styles = preg_replace('~\/\*[^*]*\*+([^/*][^*]*\*+)*\/~m','',file_get_contents( rex_path::addonAssets('be_style','css/styles.css') ));
    // in Definitionen aufsplitten (schließendes '}' fällt dabei raus, is egal.)
    $styles = explode('}',$styles);
    // alle Zeilen rauswerfen, die nicht mit ".rex-icon-", ".glyphicon-" oder ".fa-" beginnen
    $referenz = [];
    foreach( $types as $v ) $referenz[".$v-"] = strlen($v) + 2;
    $styles = array_filter($styles,function($v) use($referenz){foreach($referenz as $t=>$l){ if( substr($v,0,$l)==$t ) return true;} return false;} );
    // Restzeilen, die den korrekten Grundaufbau haben, in ein Icon-Array überführen (je Unicode ein Eintrag)
    // .fa-name:before,.rex-icon-name{content:"\A234"
    $patternA = '/^(\.[\w\-]+)\:before(\,(\.[\w\-]+)\:before)*\{content\:"\\\(?<unicode>[a-z\d]{4})"$/';
    $patternB = '/\.(?<klasse>(?<typ>'.implode('|',$types).')\-(?<name>[\w\-]+))\:before/';
    $icons = [];
    foreach( $styles as $k=>$v ) {
        if( preg_match($patternA,$v,$match) ) {
            $unicode = $match['unicode'];
            if( preg_match_all($patternB,substr($v,0,-16),$match) && count($match)) {
                foreach( $match['typ'] as $k=>$typ ) {
                    if( !isset($icons[$unicode]['html']) ) $icons[$unicode]['html'] = "<i class=\"$typ $typ-{$match['name'][$k]}\"></i>";
                    $icons[$unicode]['name'][$match['name'][$k]] = $match['name'][$k];
                    $icons[$unicode]['class'][$match['klasse'][$k]] = $match['klasse'][$k];
                    $icons[$unicode]['type'][$typ] = "x-$typ";
                }
            }
        }
    }
    unset($styles);
    ksort($icons);

    //------ Section zusammenbauen
    // Auswahl des Anzeigeumfangs ($types)
    $umfang = new rex_fragment();
    $elements = [];
    foreach( $types as $k=>$v ) {
        $elements[] = [
            'label' => '<label class="control-label">' . $k . '</label>',
            'field' => '<input onchange="f_select(this);" type="checkbox" id="scope-' . $v . '" value="x-' . $v . '" checked />',
        ];
    }
    $umfang->setVar('elements', $elements, false);
    $umfang->setVar('grouped', true);
    $umfang->setVar('inline', true);
    // Suchfeld für textbasierte Selektion
    $search = new rex_fragment();
    $elements = [
            'field' => '<input onchange="f_search(this.value)" type="text" class="form-control" placeholder="Search for..." id="search">',
            'right' => '<button onclick="f_reset()"class="btn btn-default" type="button"><i class="fa fa-close"></i></button>',
        ];
    $search->setVar('elements', [$elements], false);
    // Heading-Grid, Zeile 1: $umfang und $search
    $row1 = new rex_fragment();
    $row1->setVar('content', [$umfang->parse('core/form/checkbox.php'),$search->parse('core/form/input_group.php')], false);
    unset($umfang,$search,$elements);
    // Heading-Grid, Zeile 2: Muster-Code für Icons
    $row2 = new rex_fragment();
    $row2->setVar('content', array_map(function($v){return "&lt;i class=\"$v $v-«name»\"&gt;&lt;/i&gt;";},$types), false);
    // Section insgesamt mit allen Icons ausgeben.
    $section = new rex_fragment();
    $content = '<div ondblclick="f_copy(event)" class="'.implode(' ',array_map(function($v){return "x-$v";},$types)).'" id="iconlist">';
    foreach( $icons as $k=>$v ) {
        $type = implode(' ',$v['type']);
        $name = implode(',',$v['name']);
        $class = implode('</span><br><span>',$v['class']);
        $content .= "<div class=\"panel panel-default $type\" data-search=\"$name\"><div class=\"panel-heading\"><small>$k</small>{$v['html']}</div><div class=\"panel-body\"><span>$class</span></div></div>";
    }
    $content .= '</div';
    $section->setVar('heading', $row1->parse('core/page/grid.php').$row2->parse('core/page/grid.php'), false);
    $section->setVar('body',$content,false);
    $html = $section->parse('core/page/section.php');
    unset($row,$row2,$content,$section);

    // generiertes HTML abspeichern
    rex_dir::create($this->getCachePath());
    file_put_contents($filename, $html);
}
echo $html;

//------ Style und Script
?>
<style>
    #iconlist { display: flex; flex-wrap: wrap; justify-content: center;}
    #iconlist .panel { display: none; margin: 1em; width: 14em; font-size: 1em; }
    #iconlist .panel-heading { font-size: 2rem; text-align: center; position: relative; }
    #iconlist .panel-body { padding: 0.1rem 0.2rem; }
    #iconlist small { padding: 0.1rem; position: absolute; top:0; left:0; font-size: 1rem; }
    <?= implode(',',array_map(function($v){return "#iconlist.x-$v .panel.x-$v";},$types)) ?> { display: block; }
</style>
<script>
var iconlist = document.getElementById('iconlist');
var search = document.getElementById('search');
var typeList = ['<?= implode('\',\'',$types) ?>'];
function f_select( node ) {
    iconlist.classList.toggle(node.value,node.checked);
}
function f_reset() {
    search.value = '';
    f_search( search.value );
}
function f_search( pattern ) {
    if( pattern ) {
        var hidden;
        for( var node of iconlist.children ) {
            hidden = !node.dataset.search.includes(pattern.toLowerCase());
            if( node.classList.contains('hidden') != hidden ) node.classList.toggle('hidden',hidden);
        }
        return;
    }
    for( var node of iconlist.children ) {
        if( node.classList.contains('hidden') ) node.classList.remove('hidden');
    }
}
function f_copy( event ) {
    var target = event.target;
    if( target.tagName.toLowerCase() != 'span' ) return;
    for( var type of typeList ) {
        if( target.innerText.startsWith(type) ) {
            var node = document.createElement('textarea');
            node.value = '<i class="'+type+' '+target.innerText+'"></i>';
            node.style = {position: 'absolute', left: '-9999px'};
            document.body.appendChild(node);
            node.select();
            document.execCommand('copy');
            alert('HTML für "'+target.innerText+'" in das Clipboard kopiert ("'+node.value+'")');
            document.body.removeChild(node);
            event.preventDefault();
            return;
        }
    }
}
</script>
```
