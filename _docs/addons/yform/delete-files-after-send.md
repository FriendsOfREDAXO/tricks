---
title: E-Mail Anhänge nach Versand löschen
authors: [TobiasKrais, marcohanke]
prio:
---

# E-Mail Anhänge nach Versand automatisch löschen


## Beschreibung

Die DSGVO verlangt grundsätzlich Datensparsamkeit. Daten sollen nur zweckgebunden gespeichert werden, nur so lange wie nötig und technisch so sicher wie möglich. Wurde mit Redaxo eine E-Mail mit Anhang versandt ist in der Regel keine Speicherung auf dem Server mehr nötig. Mit diesem Snippet werden Anhänge nach erfolgreichem Versand automatisch gelöscht.

> **Hinweis** Es werden alle hochgeladenen Anhänge gelöscht.

> **Hinweis** Die Aktion wird nur nach einem bestimmten yform-E-Mail Template ausgeführt. Bitte im Code `email-template-key` durch den eigenen key ersetzen.

<a name="skript"></a>

Folgenden Code bitte in der boot.php im project Addon oder in der functions.php im Theme Addon ablegen, e-mail-template-key ersetzen, fertig.
```php
if(rex::isFrontend()) {
    // Delete attachments after sending e-mails
    rex_extension::register('YFORM_EMAIL_SENT', function (rex_extension_point $ep_yform_sent) {
      if($ep_yform_sent->getSubject() == 'email-template-key') {
        rex_extension::register('RESPONSE_SHUTDOWN', function (rex_extension_point $ep_response_shutdown) {
          $folder = rex_path::pluginData('yform', 'manager') .'upload/frontend';
          if(file_exists($folder)) {
            $objects = scandir($folder);
            foreach ($objects as $object) {
              if ($object != "." && $object != "..") {
                unlink($folder ."/". $object);
              }
            }
          }
        });
      }
    });
}
```
