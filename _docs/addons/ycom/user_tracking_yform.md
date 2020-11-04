---
title: YCom-User in YForm Tabellen-History
authors: [skerbis]
prio:
---

# YCom-User in YForm Tabellen-History

Für YForm > 3.4.1 // oder aktuelle GitHub-Version

Bei Aktionen im Frontend werden in der Tabellen-History von YForm die User aus YCom nicht erfasst. Stattdessen steht dort FrontendUser. Über den Extensionpoint `YCOM_HISTORY_USER` lässt sich der User überschreiben, der vom System vorgegeben ist. 

- Eine Class im Ordner Lib des Project-AddOns anlegen. 

`my_ycom.php`

```php
class my_ycom {
    public static function getTheUser() {
        $ycom_user = rex_ycom_auth::getUser();
        $subject = rex_ycom_auth::getUser()->getValue('login');
        return $subject ;
    }
}
```

- In die boot.php folgenden Code einsetzen: 


```php
rex_extension::register('PACKAGES_INCLUDED', static function () {
   if(!rex::isBackend() && rex_ycom_auth::getUser())
   {
   rex_extension::register('YCOM_HISTORY_USER', 'my_ycom::getTheUser');   
   }
});
```
