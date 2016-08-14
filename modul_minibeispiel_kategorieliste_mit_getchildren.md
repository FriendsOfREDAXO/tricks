# Modul Minibeispiel - Kategorielisten mit getChildren()

- [Beschreibung](#beschreibung)
- [Moduleingabe](#moduleingabe)
- [Modulausgabe](#modulausgabe)
- [Modul erweitern](#erweitern)

<a name="beschreibung"></a>
## Beschreibung

Ausgabe der Kategorien der aktuellen Ebene oder einer ausgewählten Kategorie (siehe [Modul erweitern](#erweitern))

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
           // Prüfen ob die Kategorie online ist
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

<a name="erweitern"></a>
## Modul erweitern

Evtl. möchte man nicht die Unterkategorien der aktuellen Kategorie, sondern die Unterkategorien einer bestimmten Kategorie ausgeben. 

Hierzu muss man das Modul ein wenig verändern. 

Zunächst benötigt mann eine Lösung eine Kategorie auswählen zu können. 

Redaxo bietet hierzu jedoch kein fertiges Widget an. Man kann zwar auf die Linklist zurückgreifen und dann die Startartikel der jeweiligen Kategorie auswählen, dies erschließt sich jedoch einem Redakteur nicht unbedingt. Besser ist es eine reine Kategorieauswahl anzubieten. 

Code für die Kategorie-Auswahl (Moduleingabe): 

    <div class="form-group">
    	            <label class="col-sm-5 control-label">Kategorieauswahl</label>
    	            <div class="col-sm-7">
                          <?php 
                          // Bereitstellen einer Kategorieauswahl
                          // Siehe http://www.redaxo.org/docs/master/class-rex_category_select.html
                          $select = new rex_category_select($ignore_offlines = false, $clang = false,  $check_perms = true, $add_homepage = false); 
                          $select->setName("REX_INPUT_VALUE[1]"); 
                          // Legt fest welcher Wert ausgewählt werden soll, hier der Wert von REX_VALUE[1]
                          $select->setSelected("REX_VALUE[1]"); 
                          $select->setAttribute('class', 'form-control');
                          $select->setSize(20); 
                          echo $select->get(); 
                          ?>
                    </div>
    </div>

Anschließend muss der Ausgabecode des Moduls so verändert werden, dass die hier ausgewählte Kategorie übernommen wird. 

Dazu verwenden wir `$cat = rex_category::get('REX_VALUE[1]');`

Die neue Ausgabe sieht also wie folgt aus: 


    <?php
    $catoutput = $cat = $cats = $catName = $catId = $catUrl = "";
    
    // Übergeben der Kategorie aus Moduleingabe
    $cat = rex_category::get('REX_VALUE[1]'); 
    
    $cats = $cat->getChildren();
    
    if ($cats) {
        foreach ($cats as $cat) {
            if ($cat->isOnline()) {
                $catId = $cat->getId();
                $catName = $cat->getName();
                $catUrl =  rex_getUrl($catId);
                $catoutput .= '<li><a href="' . $catUrl . '">' . $catName . '<a></li>' . "\n";
            }
        }
        echo '<ul class="catlist">'.$catoutput.'</ul>';
        unset ($cats);
    }
    ?>


    
    



