---
title: Custom Link auslesen
authors: [joachimdoerr,skerbis]
prio:
---

# Custom Link auslesen

> *Hinweis:* In [mform](https://github.com/FriendsOfREDAXO/mform/blob/076836a26b39770754fc99eeb409afb7e341dfb2/lib/classes/Utils/MFormOutputHelper.php#L30) ist eine solche Methode bereits integriert. Der nachfolgende Code kann aber dafür verwendet werden, um eigene Lösungen zu entwickeln.

Die nachfolgende Funktion dient dazu den von MForm / Mblock generierten CustomLink auszulesen und korrekt zu verlinken. Die Funktion kann in der Ausgabe eines Moduls genutzt werden oder ggf. im Theme- oder Projektaddon verwendet werden. Sie kann auch allgemein dazu verwendet werden, einen unbekannten Link zu identifizieren

```php
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
        // Ist es keine Mediendatei oder URL, dann als REDAXO-Artikel-ID behandeln
        if (filter_var($url, FILTER_VALIDATE_URL) === FALSE and is_numeric($url)) {
            $url = rex_getUrl($url);
        }
    }

    // wurde ein Linktext übergeben?
    if ($text!='') {
        $linkText = $text;
    }
    else {
      $linkText = 'Es wurde kein Linktext oder Inhalt übergeben';
    }

    // Beipiel für die Rückgabe , gerne selbst anpassen
    $link = '<a class="link" href="'.$url.'">'.$linkText.'</a>';
    return $link;
   }
  }
}
```

## Anwendungsbeispiel

```php
echo getcustomLink($url='10',$text='Hallo ich bin ein Link');
```
