---
title: "URL aus String mit Umlauten (z. B. ä, Ü, ß) generieren"
authors: []
prio:
---

# URL aus String mit Umlauten (z. B. ä, Ü, ß) generieren

```php
$string = "Über uns hängen Äpfel";
$new_string = rex_string::normalize($string);

# Result: ueberuns-haengen-aepfel
```
