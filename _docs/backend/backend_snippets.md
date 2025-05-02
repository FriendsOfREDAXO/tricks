---
title: Backend Snippets
authors: [alexplusde,ansichtsache,eaCe,skerbis,]
prio:
---

# Backend Snippets

Snippets und Tweaks zur Modifikation des Backends
1. [Navigation ausblenden](#navhide)
1. [AddOn ausblenden](#addonhide)
2. [Seite eines AddOns durch eigene austauschen/ersetzen](#replacepage)
3. [Subpage eines AddOns durch eigene entsprechend Recht austauschen/ersetzenn](#replacepage2)
4. [Sortierung des Medienpools ändern](#mediasort)
5. [Nur zugelassenen IPs Zugriff aufs Backend gewähren](#blockIP)
6. [Theme erzwingen ohne config.yml zu ändern](#theme)


<a name="navhide"></a>
## Navigation ausblenden

Es ist möglich, die Hauptnavigation und die AddOns auszublenden. Nutzt die Bootstrap-Funktionen.

**Folgenden Code in die boot.php des Project-AddOns platzieren:**

```php
if (rex::isBackend() && rex_backend_login::hasSession()) {
    rex_extension::register('OUTPUT_FILTER', static function (rex_extension_point $ep) {
        $search = '<h4 class="rex-nav-main-title">' . rex_i18n::msg('navigation_addons') . '</h4>' . "\n        " . '<ul class="rex-nav-main-list nav nav-pills nav-stacked">';
        $replace = '<h4 class="rex-nav-main-title" data-toggle="collapse" data-target="#'.rex_i18n::msg('navigation_addons').'" style="cursor: pointer;" onclick="$(\'#collapsed-chevron\').toggleClass(\'fa-rotate-180\')">'.rex_i18n::msg('navigation_addons').'<i class="fa fa-chevron-circle-down pull-right" id="collapsed-chevron"></i></h4><ul class="rex-nav-main-list nav nav-pills nav-stacked collapse" id="'.rex_i18n::msg('navigation_addons').'">';
        $subject = str_replace($search, $replace, $ep->getSubject());
        $ep->setSubject($subject);
    });
}
```

<a name="addonhide"></a>
## AddOn ausblenden

Es ist möglich, einzelne AddOns (auch für Administratoren) auszublenden. In diesem Beispiel werden der Installer und die Systemverwaltung ausgeblendet.

### Möglichkeit 1: Direkt via rex_be_controller

**Folgenden Code in die boot.php des Project-AddOns platzieren:**

```php
if (rex::isBackend() && rex_backend_login::hasSession()) {
  $page = rex_be_controller::getPageObject('system');
  $page->setHidden(true);
  $page->setPath('...');

  $page = rex_be_controller::getPageObject('packages');
  $page->setHidden(true);
  $page->setPath('...');
}
```

### Möglichkeit 2: Via Extension Point PAGES_PREPARED

Möchte man auch Systemseiten individualisiert ausgeben, kann man über den Extension Point.

In diesem Ausgangsszenario von Simon waren für Benutzer Admin-Rechte notwendig, aber diese Benutzer sollen dennoch nicht alles sehen und machen können. Diese Benutzer sollen bspw. Templates bearbeiten können, jedoch keine Module. Das war notwendig, da auf Grundlage der Templates von der Drittagentur eine Erweiterung geschrieben werden sollte, die sich am Grundtemplate der Seite orientiert.

Reines Ausblenden per CSS erfüllt diesen Zweck nicht.

Folgenden Snippet in die boot.php des Project-AddOns eingebunden.

**Ausblenden für einen bestimmten User und URL aufheben:** 

```php
if ( ( rex::isBackend() ) && ( rex::getUser()->getLogin() == 'LOGINNAME' ) ) {
   rex_extension::register('PAGES_PREPARED', function (rex_extension_point $ep) {
      $page = rex_be_controller::getPageObject( 'modules' );
      $page->setHidden( true );
      $page->setPath( '...' );
      });
}
```

**Hier z.B. Menüpunkt verstecken bei allen Nicht-Admins, aber weiterhin verfügbar** 

```php
if (( rex::isBackend() ) && ( !rex::getUser()->isAdmin()) ) {
rex_extension::register('PAGES_PREPARED', function (rex_extension_point $ep) {	
  $page = rex_be_controller::getPageObject('yform');
  $page->setHidden(true);
});
}
```



<a name="replacepage"></a>
## Seite eines AddOns durch eigene austauschen/ersetzen

Will man eine alternative Seite in einem AddOn darstellen und die vorhandene ersetzen, kann dies mit dem nachfolgenden Codes erfogen. In diesem Beispiel wird die `index.php` des Struktur-AddOns ausgetauscht. 

### Startseite eines Addons zur Laufzeit verändern

```php 
$addon = rex_addon::get('addonname');
$page = $addon->getProperty('page');
$page['href'] = ['page' => 'cronjob/log'];
$addon->setProperty('page', $page);
```


### Ersetzen durch Seite eines anderen AddOns 

**Folgenden Code in die boot.php des Project-AddOns platzieren:**

```php
rex_extension::register('PAGES_PREPARED',function($ep) {
  if (rex_be_controller::getCurrentPage() == 'structure') {
    $Page = rex_be_controller::getCurrentPageObject();
    $Page->setPath($this->getPath('pages/index.php'));
  }
});
```
Verwendeter Extension point: [PAGES_PREPARED](https://github.com/redaxo/redaxo/blob/591146a1dc60e8aacefd58dc9b7e9c307c0983b9/redaxo/src/core/backend.php#L132)


<a name="replacepage2"></a>
## Subpage eines AddOns durch eigene entsprechend Recht austauschen/ersetzen

```php
if (is_object(rex::getUser()) && rex::getUser()->hasPerm('addonname[recht]') && !rex::getUser()->isAdmin()):
$addon = rex_addon::get('addonname');
$page = $addon->getProperty('page');
        $page['subpages']['config'] = [
        'title' => 'Mein neuer Menüpunkt', 
        'icon' => 'rex-icon fa-wrench'
        ];  //neuen Menüpunkt nachträglich einfügen
        
        unset($page['subpages']['default']); //alten Menüpunkt nachträglich entfernen
$addon->setProperty('page', $page);

endif;
```

<a name="mediasort"></a>
## Sortierung des Medienpools ändern

Die Standard-Sortierung im Medienpool ist immer chronologisch. Die folgende Lösung sorgt für eine alphabetische Sortierung. 

Verwendeter Extension point: [MEDIA_LIST_QUERY](https://github.com/redaxo/redaxo/blob/0b624db20ce0baab171ff054d975645e22eceed8/redaxo/src/addons/mediapool/pages/media.php#L637-L642)

**Folgenden Code in die boot.php des Project-AddOns platzieren:**

### Bis REDAXO 5.12.1

```php
// Sortierung Medienpool aufsteigend
if (rex::isBackend() && rex::getUser()) {
  rex_extension::register('MEDIA_LIST_QUERY', function (rex_extension_point $ep) {
    $subject = $ep->getSubject();
    $subject = str_replace("f.updatedate", "f.filename, f.updatedate", $subject);
    $subject = str_replace("desc", "asc", $subject);
    return $subject;
  });
}
```

Danach gabe es einen Bug der dazu führte dass es erst ab 5.13.3 wieder genutzt werden kann. 

### Ab REDAXO 5.13.3

> Seit Vesion 8.2.0 im QuickNavigation-AddOn enthalten. 

```php
// Sortierung Medienpool aufsteigend
if (rex::isBackend() && rex::getUser()) {
  rex_extension::register('MEDIA_LIST_QUERY', function (rex_extension_point $ep) {
    $subject = $ep->getSubject();
    $subject = str_replace("m.updatedate", "m.filename, m.updatedate", $subject);
    $subject = str_replace("desc", "asc", $subject);
    return $subject;
  });
}
```

<a name="blockIP"></a>

## Nur zugelassenen IPs Zugriff aufs Backend gewähren

Den nachfolgenden Code in die `boot.php` des **project-Addons** kopieren und IPs anpassen: 

```php
	if (rex::isBackend())
	{
	  $ips= array("00.00.00.00", "00.00.00.00");	
	   if (!in_array(rex_server('REMOTE_ADDR'),$ips)) {
	      rex_response::sendRedirect('https://google.com');
	      }
	}
```

<a name="theme"></a>

## Theme erzwingen ohne config.yml zu ändern

In die boot.php des projekt-Addons oder eines eigenen AddOns: 

```php
if (rex::isBackend())
{ 
   rex_extension::register('PACKAGES_INCLUDED', static function (rex_extension_point $ep) {
   rex::setProperty('theme', 'light');
   // CKE5 fix   
   rex_view::setJsProperty('cke5theme', 'light');   
   }, rex_extension::EARLY);  
}

```
oder für dunkel

```php
<?php
if (rex::isBackend())
{ 
   rex_extension::register('PACKAGES_INCLUDED', static function (rex_extension_point $ep) {
   rex::setProperty('theme', 'dark');
   // CKE5 fix   
   rex_view::setJsProperty('cke5theme', 'dark');   
   }, rex_extension::EARLY);  
}

```

