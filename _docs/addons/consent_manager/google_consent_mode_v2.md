---
title: Google Consent Mode V2 Integration
authors: [bitshiftersgmbh]
prio:
---

# Umsetzung des Google Consent Mode V2

## Voraussetzungen

Für die Umsetzung dieses Tricks wird von **Version 4.3+** des REDAXO Consent Manager AddOns ausgegangen. Diese ist zum Zeitpunkt
der Erstellung dieses Tricks unter Umständen noch nicht veröffentlicht worden. Wichtigste Neuerung und Teil dieses Tricks
ist die Erweiterung der Dienst-Konfiguration um _Skripte, die nach Abwahl eines Dienstes geladen werden_ sollen. Dies
wird für die Umsetzung von Opt-Out-Szenarien benötigt und agiert insofern wie eine Art Event Handler.

## Integration

### Hinzufügen einer JS-Datei

Essenziell ist das Hinzufügen der nachfolgenden JavaScript-Datei **im Frontend**. Wichtig dabei ist, dass diese zwingend
**vor** der Einbindung des Consent Manager Platzhalters (oder PHP-Codes) eingebunden wird. Um dies sicherzustellen,
wird empfohlen, den Code **inline** direkt im Template auszugeben.

Dazu legt man z.B. die Datei `google.consent.mode.v2.js` an unter `/redaxo/src/addons/project/assets/js/` an, speichert
den unten stehenden Code darin und gibt deren Inhalt im Template im Bereich `<head>` **minifiziert**
(z.B. über `composer require tedivm/jshrink`) aus:
```php
echo Minifier::minify(
    "<script>".
    rex_file::get(rex_addon::get('project')->getAssetsPath('js/google.consent.mode.v2.js')).
    "</script>"
);

// ab hier oder später Code für den Consent Manager
echo consent_manager_frontend::getFragment(false, false, 'consent_manager_box_cssjs.php').PHP_EOL;
```

#### Der Inhalt der Datei `google.consent.mode.v2.js`

```javascript
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

let GOOGLE_CONSENT_V2_DEFAULT_STATE = 'denied';
let GOOGLE_CONSENT_V2_STORAGE_KEY = 'consentMode';

let GOOGLE_CONSENT_V2_FIELDS = [
    'ad_storage', // adwords
    'ad_user_data', // adwords
    'ad_personalization', // adwords
    'analytics_storage', // analytics
    'personalization_storage', // necessary
    'functionality_storage', // necessary
    'security_storage', // necessary
];

// sample for custom event handlers
let GOOGLE_CONSENT_V2_FIELDS_EVENTS = {
    'analytics_storage': {
        'on_granted': function() {},
        'on_denied': function() {}
    }
}

// get current settings
let consentStorage= localStorage.getItem(GOOGLE_CONSENT_V2_STORAGE_KEY);

if(consentStorage === null) {
    // init of consent settings
    let defaultSettings = array_combine(GOOGLE_CONSENT_V2_FIELDS, array_fill(0, GOOGLE_CONSENT_V2_FIELDS.length, GOOGLE_CONSENT_V2_DEFAULT_STATE));

    if(defaultSettings !== false) {
        gtag('consent', 'default', defaultSettings);
        localStorage.setItem(GOOGLE_CONSENT_V2_STORAGE_KEY, JSON.stringify(defaultSettings));
    }
} else {
    // check if array is consistent (if new entries appear in the future)
    let storedSettings = JSON.parse(consentStorage);

    if(Object.keys(storedSettings).length !== GOOGLE_CONSENT_V2_FIELDS.length) {
        GOOGLE_CONSENT_V2_FIELDS.forEach((field) => {
            if (typeof storedSettings[field] == "undefined") {
                storedSettings[field] = GOOGLE_CONSENT_V2_DEFAULT_STATE;
            }
        });

        gtag('consent', 'default', storedSettings);
        localStorage.setItem(GOOGLE_CONSENT_V2_STORAGE_KEY, JSON.stringify(storedSettings));
    }
}

if(localStorage.getItem('userId') != null) {
    window.dataLayer.push({'user_id': localStorage.getItem('userId')});
}

function setConsent(consent) {
    let consentSettings = JSON.parse(localStorage.getItem(GOOGLE_CONSENT_V2_STORAGE_KEY));

    for (const [key, value] of Object.entries(consentSettings)) {
        if (typeof consent[key] !== "undefined") {
            if(typeof(GOOGLE_CONSENT_V2_FIELDS_EVENTS[key]) != 'undefined') {
                if(consent[key] === true && consentSettings[key] === 'denied') {
                    GOOGLE_CONSENT_V2_FIELDS_EVENTS[key]['on_granted']();
                } else if (consent[key] === false && consentSettings[key] === 'granted') {
                    GOOGLE_CONSENT_V2_FIELDS_EVENTS[key]['on_denied']();
                }
            }

            consentSettings[key] = (consent[key] === true ? 'granted' : 'denied');
        }
    }

    gtag('consent', 'update', consentSettings);
    localStorage.setItem(GOOGLE_CONSENT_V2_STORAGE_KEY, JSON.stringify(consentSettings));
}

/**
 * helper to bring in PHP's array_combine function
 * @param keys
 * @param values
 * @return {{}|boolean}
 */
function array_combine(keys, values) {
    const newArray = {}
    let i = 0

    if (
        typeof keys !== 'object' ||
        typeof values !== 'object' ||
        typeof keys.length !== 'number' ||
        typeof values.length !== 'number' ||
        !keys.length ||
        !values.length ||
        keys.length !== values.length
    ) {
        return false;
    }

    for (i = 0; i < keys.length; i++) {
        newArray[keys[i]] = values[i]
    }

    return newArray;
}

/**
 * helper to bring in PHP's array_fill function
 * @param startIndex
 * @param num
 * @param mixedVal
 * @return {{}}
 */
function array_fill(startIndex, num, mixedVal) {
    let key;
    const tmpArr= [];

    if (!isNaN(startIndex) && !isNaN(num)) {
        for (key = 0; key < num; key++) {
          tmpArr[(key + startIndex)] = mixedVal
        }
    }

    return tmpArr;
}
```

Wer auf Re-Installieren des project-AddOns verzichten möchte, um immer die aktuellen Assets auch verfügbar zu haben,
kann natürlich auch einen eigenen Assets-Ordner oder die Struktur des Theme-AddOns nutzen und den Pfad dann mit 
`theme_path::assets('frontend/js/google.consent.mode.v2.js')` abrufen.

### Dienst anlegen für Google Analytics

Im Backend wird nun die Verwaltung des **Consent Managers** betreten und ein neuer Dienst angelegt oder ein bereits bestehender
Dienst für Google Analytics angepasst. In der nachfolgenden Konfiguration wird der Name für den Schlüssel so gewählt, dass
der **Multi-Domain-Einsatz** berücksichtigt wird. Es schadet nicht, dass immer so zu handhaben, da man nie wissen kann, ob
später weitere Domains mit eigenen Consent-Einstellungen hinzukommen.

#### Konfiguration des Dienstes

Die Inhalte können 1:1 übernommen werden. Lediglich die Stelle `GTM-XXXXXXX` muss durch die eigene Google Tag Manager ID ersetzt
werden.

<table>
    <thead><tr><th>Feld</th><th>Wert</th></tr></thead>
    <tbody>
        <tr><td>Schlüssel [a-z0-9-]</td><td>google-analytics-domain-x</td></tr>
        <tr><td>Dienst- / Cookiename</td><td>Google Analytics</td></tr>
        <tr>
            <td>Definitionen (YAML)</td>
<td>

```
-
 name: _ga
 time: "2 Jahre"
 desc: "Wird verwendet, um Nutzer zu unterscheiden."
-
 name: _gid
 time: "1 Tag"
 desc: "Speichert für jeden Besucher der Website eine anonyme ID. Anhand der ID können Seitenaufrufe einem Besucher zugeordnet werden."
-
 name: _ga_<container-id>
 time: "2 Jahre"
 desc: "Wird verwendet, um den Sitzungsstatus zu erhalten."
-
 name: consentMode
 time: "unbegrenzt"
 desc: "Speichert Einstellungen zur Einwilligung in die Nutzung von Google Diensten im lokalen Speicher des Browsers (Local Storage)."
```

</td>
        </tr>
        <tr><td>Anbieter</td><td>Google</td></tr>
        <tr><td>Link Datenschutzerklärung</td><td> 

*leer weil in DSE enthalten*

</td></tr>
<tr><td>Skripte, die nach Einverständnis geladen werden</td>
<td>

```javascript
<script> setConsent({
    analytics_storage: true
}); </script>

<!-- Google Tag Manager -->
<script>
    // flag needed since code is also embedded in adwords service and we need to prevent duplicate calls
    if(typeof(window.gtm_init) == 'undefined') {
        window.gtm_init = true;
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-XXXXXXX');
    }
</script>
<!-- End Google Tag Manager -->
```

</td></tr>
<tr><td>Skripte, die nach Widerrufen des Einverständnisses geladen werden<br />(ab 4.3+)</td>
<td>

```javascript
<script> setConsent({
    analytics_storage: false
}); </script>
```

</td></tr>
    </tbody>
</table>

Anschließend wird nach bekannter Vorgehensweise eine Gruppe angelegt (in diesem Fall namentlich `"Statistik"`), der Dienst
und die Domain zugewiesen.

### Dienst anlegen für Google AdWords (und weitere Google Ad-Tools)

Die Einstellungen für diesen Dienst ähneln der o.g. Analytics-Konfiguration sehr. Wichtigste Änderung ist hier die Einstellung
für den Local Storage. Statt `analytics_storage` wird hier verwendet:

```javascript
<script> setConsent({
    ad_storage: true,
    ad_user_data: true,
    ad_personalization: true
}); </script>
```

... bzw. alles aus `false` im Bereich `"Skripte, die nach Widerrufen des Einverständnisses geladen werden"` der Dienst-
Konfiguration.

### Die anderen Consent Mode Flags ...

Eine (automatisch übersetzte) Übersicht über die Flags und deren Bedeutung findet sich hier:

| Flag               | Beschreibung                                                                |
|--------------------|-----------------------------------------------------------------------------|
| `ad_storage`         | Ermöglicht die Speicherung (z. B. von Cookies) im Zusammenhang mit Werbung. |
| `ad_user_data`       | Legt die Zustimmung zur Übermittlung von Nutzerdaten im Zusammenhang mit Werbung an Google fest. |
| `ad_personalization` | Legt die Zustimmung für personalisierte Werbung fest. |
| `analytics_storage`  | Ermöglicht die Speicherung (z. B. von Cookies) im Zusammenhang mit der Analyse, z. B. der Besuchsdauer. |

Zusätzlich zu den Parametern für den Zustimmungsmodus gibt es die folgenden Datenschutzparameter:

| Flag                      | Beschreibung                                                                                                               |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------|
| `functionality_storage`   | Ermöglicht die Speicherung von Daten, die die Funktionalität der Website oder App unterstützen, z. B. Spracheinstellungen. |
| `personalization_storage` | Ermöglicht die Speicherung im Zusammenhang mit der Personalisierung, z. B. Videoempfehlungen.                              |
| `security_storage`        | Ermöglicht die Speicherung von sicherheitsrelevanten Daten wie Authentifizierungsfunktionen, Betrugsprävention und sonstigem Benutzerschutz. |

Es wird wohl empfohlen (?), die Zusatz-Flags (2. Tabelle) immer mit `true` zu versehen. Man kann nachfolgenden Code
daher entweder an einen Dienst hängen, der mit einer Consent Gruppe im Bereich `Notwendig` verknüpft ist (z.B. `phpsessid`)
oder ihn direkt nach Einbindung des oben genannten Snippets ins Template ausführen.

```javascript
<script>setConsent({
    functionality_storage: true,
    personalization_storage: true,
    security_storage: true
});</script>
```

## Im Einsatz

Der Ausgangszustand sollte so aussehen:

![Bild 1](/screenshots/cm_google_cm_v2_01_initial_state.png "01 - Ausgangszustand")

-----

Wählt man nur **notwendige Dienste** aus, werden `functionality_storage`, `personalization_storage` und `security_storage`
auf `true` gesetzt:

![Bild 2](/screenshots/cm_google_cm_v2_02_additional_flags.png "02 - Einschalten notwendiger Werte")

-----

Wählt man die **Statistik-Gruppe** aus, werden die Flags gesetzt, der Tag Manager eingeladen und (wegen der aktivierten
Flags) auch Google Analytics geladen:

![Bild 3](/screenshots/cm_google_cm_v2_03_analytics_group.png "03 - Einschalten Statistik-Gruppe / Laden des Tag Managers und Aktivierung Analytics")

