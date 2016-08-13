# Modul Minibeispiel - Kategorieliste mit getChildren()

- [Beschreibung](#beschreibung)
- [Moduleingabe](#moduleingabe)
- [Modulausgabe](#modulausgabe)

<a name="beschreibung"></a>
## Beschreibung

Ausgabe der Kategorien der aktuellen Ebene

Nach dem Auslesen der aktuellen Kategorie, kann man leicht mit getChildren() die Unterkategorien ermitteln und auflisten. 
Im Ausgabe-Code finden Sie Kommentare, die das hier vorgestellte Modul erklären. 

<a name="moduleingabe"></a>
## Moduleingabe

    <div class="panel panel-primary">
        <div class="panel-heading"><i class="fa fa-question-circle" aria-hidden="true"></i> Kategorieliste</div>
        <div class="panel-body">
            Erstellt eine Liste aller Unterkategorien dieser Kategorie-Ebene
        </div>
    </div>


<a name="modulausgabe"></a>
## Modulausgabe


    <?php
    // Variablen setzen: 
    $catoutput = $cat = $cats = $catName = $catId = $catUrl = "";
    
    // Aktuelle Kategorie ermitteln
    $cat = rex_category::getCurrent();
   
    // Alternativ für eine bestimmte Kategorie, XX steht für die ID der Kategorie, diese kann ggf. durch ein REX_VALUE übergeben werden. 
    // $cat = rex_category::get(XX);
   
    // Kinder ermitteln
    $cats = $cat->getChildren();
    
    // Prüfen ob ein Ergebnis vorliegt
    if ($cats) {
        // Auslesen der Kategorien
        foreach ($cats as $cat) {
            if ($cat->isOnline()) {
                
                // ID ermitteln
                $catId = $cat->getId();
                
                // Name der Kategorie
                $catName = $cat->getName();
                
                // Url anhand ID ermitteln
                $catUrl =  rex_getUrl($catId);
                
                // Zwischenspeichern des Ergebnisses
                $catoutput .= '<li><a href="' . $catUrl . '">' . $catName . '<a></li>' . "\n";
            }
        }
        
        // Ausgabe 
        echo '<ul class="catlist">'.$catoutput.'</ul>';
        unset ($cats);
    }
    ?>

