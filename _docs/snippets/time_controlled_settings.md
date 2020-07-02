---
title: Einstellungen eines AddOns zeitgesteuert ändern
authors: [skerbis]
prio:
---

# Einstellungen eines AddOns zeitgesteuert ändern

Manchmal möchte man bestimmte Funktionen eines AddOns zeitsteuern. 

Beispiel: 

Die **Errormail-Funktion** des PHPMailers kennt keine zeitlichen Grenzen zum Versand der Fehler-E-Mails. Dies kann man über einen Cron-Job oder im Project-AddOn (in der boot.php) wie folgt bewerkstelligen. 


```php 
$addon = rex_addon::get('phpmailer');
// lese die aktuelle Stunde aus
$time = date("H");
// Prüfe das Zeitfenster wo das neue Setting gelten soll
if ($time >= 23 or $time <=4) {
// setze die config und deaktiviere so den Versand der Error-Mails. 
$addon->setConfig('errormail', 0);
}
else {
// Sonst aktiviere den Versand
$addon->setConfig('errormail', 1);
}
```

> Hinweis: Hierbei wird nicht beachtet was im System als Einstellung hinterlegt ist. 
