---
title: Eine „stille” Mail mit YForm verschicken
authors: [dtpop]
prio:
---

# Eine „stille” Mail mit YForm verschicken

- [Einleitung](#einleitung)
- [Umsetzung](#umsetzung)

<a name="einleitung"></a>
## Einleitung

Manchmal muss eine Mail verschickt werden, ohne dass jemand auf "absenden" oder "jetzt Mail schicken" klickt. Das ist beispielsweise der Fall, wenn man für eine Newsletteranmeldung eine Bestätigungsseite macht und der Betreiber möchte eine Mail wenn jemand seine Newsletteranmeldung bestätigt. Das geht eigentlich einfach. Ohne diesen Tipp können einem dann schon mal die Haare zu Berge stehen ...

<a name="umsetzung"></a>
## Umsetzung

Im Grunde ist die Umsetzung wirklich trivial. Zunächst muss man natürlich sicher stellen, dass die Seite nicht sonst irgendwie aufgerufen wird, daher muss man zunächst die Aufrufparameter prüfen. Wenn das alles geschehen ist, holt man sich den passenden Datensatz nochmal aus der Datenbank und schreibt folgendes yform:

```php
$res = rex_sql::factory()->getArray('SELECT * FROM rex_newsletteranmeldungen WHERE email = :email AND `key` = :key',['email'=>rex_get('email'),'key'=>rex_get('key')]);
$res = $res[0];
$yf = new rex_yform();
$yf->setObjectparams('csrf_protection',false);
$yf->setValueField('hidden', ['salutation',$res['salutation']]);
$yf->setValueField('hidden', ['company',$res['company']]);
// und weitere Felder ...
$yf->setValueField('hidden', ['email',$res['email']]);
$yf->setActionField('tpl2email', ["newsletter_registration","email",'newsletteranmeldungen@deinkun.de']);            
$yf->getForm();
$yf->setObjectparams('send',1);
$yf->executeActions();
```
