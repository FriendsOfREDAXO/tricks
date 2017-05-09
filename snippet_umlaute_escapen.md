# Umlaute (Ää,Üü,Öö,ß) mit R5 Boardmittel umschreiben

```php 
<?php
$string = "Über uns hängen Äpfel";
$new_string = rex_string::normalize($string);
# Result: ueberuns-haengen-aepfel
?>
´´´
