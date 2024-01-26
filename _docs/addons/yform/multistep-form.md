---
title: "YForm: Mehrstufige Formulare (Steps, Wizard, ...)"
authors: [alexplusde]
prio:
---

# YForm: Mehrstufige Formulare (Steps, Wizard, ...)

Mehrstufige Formulare in YForm lassen sich sowohl clientseitig mit JS, als auch serverseitig realisieren.

## Wann verwende ich serverseitige, wann clientseitige mehrstufige Formulare?

Der Vorteil von clientseitigen mehrstufigen Formularen ist die Geschwindigkeit: Man gelangt ohne Ladezeitverzögerung zum nächsten Schritt. Klassischerweise unterteilt man die einzelnen Schritte durch `<div>`, `<section>` oder `<fieldset>` und blendet diese bei Bedarf ein bzw. aus. Dazu gibt es auch diverse fertige Skripte. 

Der Nachteil von clientseitigen mehrstufigen Formularen ist der zusätzliche Aufwand für die Validierung: Da HTML5-Forms-Validierung bei ausgeblendeten Feldern dazu führen kann, dass die Browser entsprechende Validierungs-Fehlermeldungen nicht ausgegeben werden oder man sich darum kümmern muss, dass man erst auf den nächsten Schritt gelangt, wenn in diesem Schritt alle Felder ordnungsgemäß ausgefüllt sind.

**Der Vorteil von serverseitigen mehrstufigen Formularen ist daher die Robustheit beim Ausfüllen und Validieren**. Es wird nur das ausgegeben und validiert, was in diesem Schritt erforderlich ist und serverseitig beim Absenden validiert.

## Wie baue ich das mehrstufige Formular mit YForm auf?

Zunächst halten wir uns an die PHP-Schreibweise, da die Pipe-Schreibweise für diese Aufgabenform zu komplex ist.

> **Tipp:** Nutze den YForm Tablemanager und den Formbuilder, um die passende Felddefintion für dein mehrstufiges Formular zu erstellen und gleichzeitig das Tabellenschema so zu definieren, dass die Formulareingaben hinterher in der Datenbanktabelle gespeichert werden können.

Benötigt wird zunächst das Gerüst für die einzelnen Schritte:

```php

    /* Wir benötigen im Folgenden immer wieder Tabellenname, Formularname und einen Schlüssel, an dem wir den aktuellen Datensatz identifizieren können, sowie die einzelnen Schritte */

    rex_login::startSession();

    $table_name = 'rex_my_table';
    $form_name = 'multistep-id-1';
    $step = rex_get('step','int',1);

    $key = rex_session($form_name, 'string');
    if(!$key) {
        $key = bin2hex(random_bytes(24));
        rex_set_session($form_name, $key);
    }
    
    $url = rex_getUrl(rex_article::getCurrent()->getId(), null, ['step' => $step]);
    $url_next = rex_getUrl(rex_article::getCurrent()->getId(), null, ['step' => $step + 1]);

```

Als nächstes definieren wir das Grundgerüst des YForm-Formulars.

```php
    $yform = new rex_yform();

    $yform->setObjectparams('form_name', $form_name);
    $yform->setObjectparams('form_ytemplate', 'bootstrap');
    $yform->setObjectparams('form_showformafterupdate', 1);
    $yform->setObjectparams('real_field_names', true);

    /* Hier laden wir den Datensatz, wenn dieser im ersten Schritt bereits erstellt wurde. */
    $dataset = rex_yform_manager_table::get($table_name)->query()->where('key', $key)->findOne();

    if($dataset) {
        $yform->setActionField('db', [$table_name, '`key`="'.$key.'"']);
        $yform->setObjectparams('getdata', TRUE);
        $yform->setObjectparams('main_where', '`key`="'.$key.'"');
        $yform->setObjectparams('main_table', $table_name);
    } else {
        $yform->setActionField('db', array($table_name));
        $yform->setObjectparams('getdata', FALSE);
    }

    /* Hier Felder definieren, die überall mitgegeben werden sollen. z.B. der Schlüssel, aber auch Felder wie datestamp-Felder */
    $yform->setValueField('hidden', array("key", $key));

    if ($step === 1) {

        $yform->setValueField('text', array('text1','Beispiel-Textfeld aus Schritt 1'));
        /* Füge hier die passenden Felder und serverseitigen Validierungen zu Schritt 1 ein */

        $yform->setObjectparams('submit_btn_label','weiter');
        $yform->setObjectparams("form_action", $url);
        $yform->setActionField('redirect', [$url_next]);

        echo $yform->getForm();

    } else if ($step === 2) {

        $yform->setValueField('text', array('text1','Beispiel-Textfeld aus Schritt 2'));
        /* Füge hier die passenden Felder und serverseitigen Validierungen zu Schritt 2 ein */

        $yform->setObjectparams('submit_btn_label','weiter');

        $yform->setObjectparams("form_action", $url);
        $yform->setActionField('redirect', [$url_next]);

        echo $yform->getForm();

    } else if ($step === 3) {

        $yform->setValueField('text', array('text1','Beispiel-Textfeld aus Schritt 3'));
        /* Füge hier die passenden Felder und serverseitigen Validierungen zu Schritt 3 ein */

        $yform->setObjectparams('submit_btn_label','Speichern');

        $yform->setObjectparams("form_action", $url);
        $yform->setActionField('redirect', [$url_next]);

    } else if ($step === 4) {

        // Ausgabe einer Dankesmeldung oder Weiterleitung auf eine andere Seite mit der Artikel-ID 1. 
        echo ("<p>Vielen Dank</p>");
        // rex_response::sendRedirect(rex_getUrl(1));

    }

```

Natürlich kann dieses Gerüst um beliebig viele Schritte erweitert werden und die einzelnen Schritte werden um die gewünschten Felddefinitionen erweitert.

> **Wichtig**: Nur Felder, die definiert sind, werden auch gespeichert. Unter Umständen müssen Felder, die in jedem Schritt aktualisiert werden sollen, z.B. ein `datestamp`-Feld mit der letzten Änderung, dort hin, wo auch das `key`-Feld definiert wird.
