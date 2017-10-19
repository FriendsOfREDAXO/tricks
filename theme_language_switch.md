# Theme AddOn - Language Switcher

> Benötigt das [Theme Addon](https://github.com/FriendsOfREDAXO/theme)

- [Was macht es?](#was-macht-es)
- [Die Funktion](#die-funktion)
- [Einbinden in Theme](#einbinden-in-theme)
- [Ausgabe im Template](#ausgabe-im-template)
- [Theme Debug Module](#theme-debug-module)

<a name="was-macht-es"></a>
## Was macht es?

Eine kleine Funktion um die Sprachen im Frontend als stylebare Liste auszugeben.

<a name="die-funktion"></a>
## Die Funktion

Lege eine Datei namens `clang_switch.php` im [Theme Addon](https://github.com/FriendsOfREDAXO/theme) im Ordner `theme/private/inc/frontend` an.

**Inhalt der Datei**
    
```php
<?php
/* ----- Language Switch -----
$showCurLang : true / false - if the current language shall be displayed
$wrappingList: true / false - adds wrapping ul with extra css if given
$countryCode : true / false - Shows Country Code as Name
$css_extra   : adds extra css classes
   ----- Language Switch ----- */

if(!function_exists("getLangNav"))
{
    function getLangNav($showCurLang = true, $wrappingList = true, $countryCode = true, $css_extra = '')
    {
        $langOutput = '';

        $langOutput  .= ($wrappingList ? '<ul class="lang--nav '.$css_extra.'">' : '');
        foreach(rex_clang::getAll() as $lang) {
            if(rex_clang::getCurrentId() == $lang->getId()) {
                if($showCurLang) {
                    $langOutput .= '<li class="lang--item lang--item__active lang--'.$lang->getCode().'">'.($countryCode ? $lang->getCode() : $lang->getName()).'</li>';
                }
            }
            else {
                if($lang->isOnline()) {
                    $langOutput .= '<li class="lang--item lang--item__inactive lang--'.$lang->getCode().'"><a title="'.$lang->getName().'" href="'.rex_getUrl('',$lang->getId()).'">'.($countryCode ? $lang->getCode() : $lang->getName()).'</a></li>';
                }
            }
        }
        $langOutput .= ($wrappingList ? '</ul>' : '');
        //return languagelist
        return $langOutput;
    }
}
```

<a name="einbinden-in-theme"></a>
## Einbinden in Theme

Anschließend wird die Datei `clang_switch.php` in die `functions.php` im Ordner `theme/private/inc`ein.

**z.B so:**

```php
<?php

if (!rex::isBackend()) {
    // Frontend 

    include('frontend/clang_switch.php');

} else {
    // Backend 

    //get REDAXO config file
    $configFile = rex_path::coreData('config.yml');
    $config = rex_file::getConfig($configFile);

    if (isset($config['debug']) && $config['debug'] === true) {
        // Optional Debug Module Function - Infos: https://github.com/FriendsOfREDAXO/tricks/blob/master/theme_debug_module.md
        //include('backend/debug_module.php');
    }
}
```

<a name="ausgabe-im-template"></a>
## Ausgabe im Template

Jetzt kann die Ausgabe der Funktion an beliebiger Stelle im Template ausgegeben werden.

```php
<?php

echo getLangNav(true, true, true, 'my--class');
```

<a name="theme-debug-module"></a>
## Theme Debug Module

Eine kleine Funktion um die Inhalte der REX_VALUES auszugeben. Vor allem hilfreich beim Einsatz von [mform](https://github.com/FriendsOfREDAXO/mform) und [mblock](https://github.com/FriendsOfREDAXO/mblock). Zur Anleitung: [Theme Debug Module](https://github.com/FriendsOfREDAXO/tricks/blob/master/theme_debug_module.md)
