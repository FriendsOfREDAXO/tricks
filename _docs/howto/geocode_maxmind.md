---
title: Automatische Sprachweiterleitung
authors: []
prio:
---

# Automatische Sprachweiterleitung

In diesem Trick geht es darum, die Sprache des Clients automatisch zu erkennen und auf die richtige Sprache in REDAXO weiterzuleiten.

> Hinweis: Nicht vergessen: Sprachen und Staaten sind zwei paar Schuhe. Hier geht es um die Zuordnung der richtigen Sprache. Es gibt genügend Staaten, die ein oder mehrere Sprachen kennen, bspw. Schweiz, Luxemburg oder Belgien.

## Vorbereitung

### Sprachen in REDAXO anlegen

Im Backend unter System > Sprachen die gewünschten Sprachen hinzufügen. Im Feld `code` den ISO_CODE der Sprache eintragen, bspw. `de`, `en` oder `fr`.

### Maxmind GeoIP-Account

Browser liefern bereits von Haus aus Informationen über die Sprach-Einstellungen des Clients. Diese sind jedoch nicht immer zuverlässig. 

Für eine zuverlässige Erkennung der richtigen Sprache wird der GeoIP-Dienst von Maxmind verwendet. Deshalb ist zunächst ein Konto und ein API-Zugang bei Maxmind notwendig: https://www.maxmind.com/de/geoip2-services-and-databases?pkit_lang=de

Die API-Zugangsdaten müssen dann im nachfolgendenen Template eingetragen werden, siehe:

```php
    $query = 'https://apiuser:apipasswordhash@geoip.maxmind.com/geoip/v2.1/country/' . $_SERVER['REMOTE_ADDR'];
```

### IP-Cache der erkannten Sprache

In der Praxis ist es leider notwendig, sich vor automatischen Bot-Besuchen zu schützen. Diese können mehrere Besuche pro Sekunde auslösen und dadurch innerhalb eines Tages das Guthaben des Maxmind-Accounts aufbrauchen. Auch das Zwischenspeichern in der `$SESSION`-Variable hilft nicht, da diese möglicherweise vor jedem Besuch eines Bots geleert wird.

Um dieses Problem zu umgehen, wird eine Datenbanktabelle (hier: `rex_maxmind_geoip`) verwendet, die die IP-Adresse und die zugehörige Abfrage bei Maxmind zwischenspeichert (hier: `6 Stunden`). Diese kann in der Datenbank von Hand, oder via YForm, erstellt werden. Sie benötigt folgende Felder:

* `id` 
* `ip` (text)
* `clang_id` (text)
* `raw` (textarea)
* `createdate` (createdate)

## Template

Dieses Beispiel-Template als seperates Template hinzufügen und bspw. über `REX_TEMPLATE[#]` im Haupt-Template an allererster Stelle referenzieren:

```php

<?php
session_start();

if(!isset($_SESSION['clang_id'])) {

    $_SESSION['clang_id'] = 1; // zunächst den Standard-Fall abfangen: Auf erste Sprache weiterleiten

    $sql = rex_sql::factory();
    $geoip_cache = array_shift(array_filter($sql->getArray('SELECT * FROM rex_maxmind_geoip WHERE createdate > NOW() - INTERVAL 6 HOUR AND ip = :ip'), array(':ip' => $_SERVER['REMOTE_ADDR']))); // nach 6 Stunden erneut abfragen.

    if($geoip_cache['clang_id']) { // Falls die IP in den letzten 6 Stunden bereits angefragt hatte, gecachte Infos verwenden
         $_SESSION['clang_id'] = $geoip_cache['clang_id'];

    } else { // !$geoip_cache['clang_id'] andernfalls die Erkennung neu durchlaufen

        // Hier apiuser:apipasswordhash anpassen
        $query = 'https://apiuser:apipasswordhash@geoip.maxmind.com/geoip/v2.1/country/' . $_SERVER['REMOTE_ADDR'];
        $curl = curl_init();
        curl_setopt_array($curl,array(CURLOPT_URL => $query, CURLOPT_RETURNTRANSFER => true));
        $resp = curl_exec($curl);

        if (!curl_errno($curl)) { 
            $maxmind = json_decode($resp, true);
            $iso_code = strtolower($maxmind['country']['iso_code']);

            if($iso_code) {
 
                // Korrekte clang-id anhand Sprachcode abrufen
                $sql = rex_sql::factory();
                $clang = array_shift(array_filter($sql->getArray('SELECT * FROM rex_clang WHERE status = 1 AND rex_clang.code = :code'), array(':code' => $iso_code)));
            
                if($clang['clang']) {
                    $_SESSION['clang_id'] = $clang['id'];

                    // Abfrage von Maxmind anhand IP zwischenspeichern
                    $sql = rex_sql::factory();
                    $sql->setTable('rex_maxmind_geoip');
                    $sql->setValue('ip', $_SERVER['REMOTE_ADDR']);
                    $sql->setValue('clang_id', $_SESSION['clang_id']);
                    $sql->setValue('raw', $resp);
                    $sql->setValue('createdate', date("Y-m-d H:i:s"));
                    $sql->insert();

                }
            } // $iso_code
        } // !curl_errno($curl)       
    } // !$geoip_cache['clang_id']
    
     header('Location: '.rex_getUrl(REX_ARTICLE_ID, $_SESSION['clang_id']).'');
     exit;
}

?>
```