# Custom Link auslesen

Die nachfolgende Funktion dient dazu den von MForm / Mblock generierten CustomLink auszulesen und korrekt zu verlinken. 
Die Funktion kann in der Ausgabe eines Moduls genutzt werden oder ggf. im Theme- oder Projektaddon verwendet werden. 
Sie kann auch allgemein dazu verwendet werden, einen unbekannten Link zu identifizieren

    // CustomLink-Funktion REX5 / mform / mblock


    if (!function_exists('getcustomLink')) {
      function getcustomLink($url,$text) {

      // Wurde ein Wert für $url übergeben?
      if ($url) {

        // Prüfe ob es sich um eine URL handelt, dann weiter
        if (filter_var($url, FILTER_VALIDATE_URL) === FALSE) {
        }
        // Ist es eine Mediendatei?
        if (file_exists(rex_path::media($url)) === true) {
           $url = rex_url::media($url);
        } 
        
        else {
            // Ist es keine Mediendatei oder URL, dann als Redaxo-Artikel-ID behandeln
                if (filter_var($url, FILTER_VALIDATE_URL) === FALSE and is_numeric($url)) {
                $url = rex_getUrl($url);
            }
        }
        // wurde ein Linktext übergeben?  
        if ($text!='') {
            $linkText = $text;
        }
        else 
        {
          $linkText = 'Es wurde kein Linktext oder Inhalt übergeben';
        }
        // Beipiel für die Rückgabe , gerne selbst anpassen
        $link = '<a class="link" href="'.$url.'">'.$linkText.'</a>';
        return $link; 
    }



      }
    }
    
// Anwendungsbeispiel: 
    echo getcustomLink($url='10',$text='Hallo ich bin ein Link');
