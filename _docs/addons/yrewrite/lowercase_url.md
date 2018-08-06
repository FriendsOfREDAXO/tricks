---
title: Weiterleitungen: Benutzerdefinierte URLs in Kleinbuchstaben
authors: [omphteliba]
prio: 3
---

# Weiterleitungen: Benutzerdefinierte URLs in Kleinbuchstaben

Wenn man bei der Eingabe der Benutzerdefnierten URLs in den Weiterleitungen nur Kleinbuchstaben zulassen will, so kann man dies über ein YRewrite Plugin erreichen.

## Dateien anlegen
1. In `redaxo/src/addons/yrewrite/plugins` ein neues Verzeichnis anlegen; z.B. lowercase-url
2. In dem neuen Verzeichnis ein Unterverzeichnis `lib` und folgende drei Dateien anlegen:
- boot.php
- package.yml
- README.md
3. Im Unterverzeichnis `lib` die Datei `yrewrite_lc_url.php` anlegen.

## boot.php
In die Datei `boot.php` kommt Folgendes

```php
<?php
rex_extension::register('YFORM_GENERATE', array('yrewrite_lc_url', 'lc_url'), rex_extension::LATE);
```

## package.yml
In die Datei `package.yml` kommt Folgendes

```yml
package: yrewrite/lowercase-url
version: '1.0'
author: 'Oliver Hörold'

requires:
  packages:
    yrewrite: '>=1.0.0'
```

## yrewrite_lc_url.php
In die Datei `yrewrite_lc_url.php` kommt Folgendes

```php
<?php

class yrewrite_lc_url {

	public static function lc_url($ep) {

		$subject = $ep->getSubject();

		if ($subject->objparams['form_name'] === 'yrewrite_forward_form') {
			$subject->objparams['form_elements'][3][3] = "@^([%_\.+\-a-z0-9]){1}[/%_\.+\-a-z0-9]+([%_\.+\-a-z0-9]){1}$@";
			$subject->objparams['form_elements'][3][4] = 'Die URL ist nicht korrekt. Schreibweise beachten. Nur &quot;a-z/0-9 -&quot;, kein / am Anfang und am Ende, nur Kleinbuchstaben';
		}

		return $ep;
	}
}
```

