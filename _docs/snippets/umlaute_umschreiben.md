---
title: "String ( z.B. mit Ää,Üü,Öö,ß) mit R5 Boardmittel url-geeignet umschreiben"
authors: []
prio:
---

# String ( z.B. mit Ää,Üü,Öö,ß) mit R5 Boardmittel url-geeignet umschreiben

```php
$string = "Über uns hängen Äpfel";
$new_string = rex_string::normalize($string);
# Result: ueberuns-haengen-aepfel
```
