# Minibeispiel Kopfzeilenbild

Sucht, ausgehend vom aktuellen Artikel, rekursiv alle übergeordneten Artikel / Kategorien nach einem Kopfzeilen-Bild ab.

## Voraussetzungen

* Ein Meta-Feld namens `art_image`, mit dem sich ein Bild aus dem Medienpool auswählen lässt (`REX_MEDIA_WIDGET`)
* Ein Media-Manager-Profil namens `hero`, das die Bilder wie gewünscht verkleinert und ggf. zuschneidet.

## Template-Ausgabe (einzelnes Bild)

```
<?php
$image = false; // Kein Bild gesetzt.
$image = rex_article::getCurrent()->getValue('art_image'); // Bild aus dem aktuellen Artikel laden   
$rex_category = rex_category::getCurrent();   // Aktuelle Kategorie laden

while (!$image) { // So lange es kein Bild

    $image = $rex_category->getValue('art_image'); // 
    
    if(is_object($rex_category->getParent())) {
        $rex_category = $rex_category->getParent();
    } else {
        $image = "default.jpg"; // oder false
    }

}
?>
<img src="/imagetypes/hero/<?php echo $image ?>" alt="" />
```

> Hinweis: Dies ist nur ein Minimal-Beispiel. Das `alt`-Attribut des Bildes könnte bspw. über den Titel im Medienpool ausgefüllt werden.

## Template-Ausgabe (Slideshow)

Erweitere dieses Beispiel auf [GitHub/FriendsOFRedaxo/Tricks](https://github.com/FriendsOfREDAXO/tricks).

## Autor

@alexplusde - Alexander Walther
