---
title: REDAXO-Klassen ausserhalb Redaxo Kontext nutzen 
authors: [IngoWinter]
prio:
---

# REDAXO Klassen ausserhalb Redaxo Kontext nutzen 

```php
$REX['REDAXO'] = false;
// hier den korrekten Pfad zum Document-Root setzen
$REX['HTDOCS_PATH'] = '../../../../';
$REX['BACKEND_FOLDER'] = 'redaxo';
$REX['LOAD_PAGE'] = false;

// REDAXO einbinden
require $REX['HTDOCS_PATH'].$REX['BACKEND_FOLDER'].'/src/core/boot.php';
```
