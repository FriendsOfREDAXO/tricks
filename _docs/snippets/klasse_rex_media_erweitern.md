---
title: Die Klasse rex_media erweitern
authors: [DanielWeitenauer]
prio:
---

# Die Klasse rex_media erweitern

Seit REDAXO Version 5.3 kann die Klasse `rex_media` erweitert werden. Damit ist es möglich, fehlende Funktionen über eine Kind-Klasse nachzurüsten.

## Beispiel

### Erweitern der Klasse `rex_media` um eine Methode, die eine Datei-URL mit Medientyp ausgibt 

```php
// Das in REX_MEDIA[1] gespeicherte Bild wird mit dem Medientyp 'bootstrap_jumbotron' ausgegeben
// da die Ausgabe wahrscheinlich recht groß für das Backend ist, wird das Bild im Backend als Thumbnail ausgegeben
$media = new my_media(REX_MEDIA[1]); 
$url = $media->getMediaUrl('bootstrap_jumbotron', true)
```

### Erweitern der Klasse `rex_media` um eine Methode, um mehrsprachige Medien-Metadaten abzufragen 

```php
$media = new my_media(REX_MEDIA[1]); 
// Das Feld 'metafield_1' wird ausgegeben
$metafield = $media->getValueTranslated('metafield', 1);  

// Das Feld 'metafield' wird abhängig von der aktuellen Sprache zurückgegeben
// Ist die Sprach-ID 1, also 'metafield_1', ist die Sprach-ID 2, 'metafield_2',
// ist die Sprach-ID 1 und 'metafield_1' existiert nicht, wird 'metafield' zurückgegeben,
// so kann die Methode auch mit nachträglich mehrsprachig erweiterten Websites arbeiten
$media = new my_media(REX_MEDIA[1]); 
$metafield = $media->getValueTranslated('metafield'); 

// Falls das Metafeld 'metafield_*' leer ist, wird ein Default-Wert zurückgegeben
$media = new my_media(REX_MEDIA[1]);  
$metafield = $media->getValueTranslated('metafield',, 'Das Feld ist leer'); 
```

```php
class my_media extends rex_media
{
    /**
     * Necessary for PHP 5.6
     */
    public function __construct()
    {
    }
    
    /**
     * Extended getUrl method, that allows the passing of a mediatype into the method,
     * as well as into the extension point. The Url will be prettyfied if yrewrite is available.
     * In addition it is possible to force a thumbnail-sized output in the backend.
     *
     * @param string $media_type  The desired mediatype as 
     * @param bool $backend_thumbnail  True, if the image shall be output as thumbnail in the backend
     * @return string
     */
    public function getMediaUrl($media_type = '', $backend_thumbnail = false)
    {
        // Resize to thumbnail in backend
        if ($backend_thumbnail) {
            $media_type = 'rex_mediapool_preview';
        }

        // Same EP as in url method, but media_type is passed in addition
        $url = rex_extension::registerPoint(new \rex_extension_point('MEDIA_URL_REWRITE', '', [
            'media' => $this,
            'media_type' => $media_type,
        ]));

        // Beautify url
        if (!$url && $media_type) {
            if (rex_addon::get('yrewrite')->isAvailable() && !rex::isBackend()) {
                $url = rex_url::frontend('images/'.$media_type.'/'.$this->getFileName());
            } else {
                $url = rex_url::frontend('index.php?rex_media_type='.$media_type.'&rex_media_file='.$this->getFileName());
            }
        }

        return $url ?: rex_url::media($this->getFileName());
    }

    /**
     * The accepted way to allow multilanguage metadata on media files is to 
     * append the clang id with an underscore to meta value names.
     * You simply hav to pass the meta value name to this method and it tries 
     * to get the appropriate value from metadata. If the metafield does not exist, 
     * it gradually falls back to a non-suffixed name and finally apassed default value.    
     *
     * @param string $value  The name of the meta value
     * @param int $clang_id  The optional clang id, if none is passed, the current id is used
     * @param string|null $default  An optional default value
     * @return string
     */
    public function getValueTranslated($value, $clang_id = 0, $default = null)
    {
        $return = '';

        // Normalize
        if ($clang_id < 1) {
            $clang_id = rex_clang::getCurrentId();
        }

        if ($clang_id >= 1) {
            $return = $this->getValue($value.'_'.$clang_id);
        }

        // Fallback
        if (!$return && $clang_id == 1) {
            $return = $this->getValue($value);
        }

        if (!$return) {
            $return = $default;
        }

        return $return;
    }
}
```
