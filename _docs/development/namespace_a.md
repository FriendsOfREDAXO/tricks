---
title: Das Addon hat "Namespace"! Und nun?
authors: [christophboecker]
prio:
---

# Oh! Das Addon hat "Namespace"! Und nun?

> **Ruhe bewahren. Keine Panik. Tief durchatmen. Ommmmmmm!**

Nehmen wir an, dass der Maintainer nett ist und nicht sofort ein neues Major-Release gebaut hat, sondern ...

1. im Changelog Hinweise zur Umstellung auf die Namespace-Variante gibt und
2. alle alten Klassen und Funktionen weiterhin funktionieren, aber als "deprecated" markiert sind.

Das Addon sollte also mit hoher Wahrscheinlichkeit auch so funktionieren. Aber dennoch sollte die Umstellung auf die Namespace-Variante halbwegs zügig erfolgen. Irgendwann kommt das Major-Release und dann geht nur noch "mit Namespace". 

_Disclaimer: Diese Beschreibung richtet sich insbesondere an diejenigen, die bisher noch keine Erfahrungen mit Namespaces haben bzw. bei der Programmierung mit PHP nicht ganz so sattelfest sind. Sie ist weder eine Anleitung zum Umgang mit Namespaces an sich (bitte die PHP-Dokumentation oder Marjorie, die allwissende Müllhalde, fragen) noch erhebt sie den Anspruch, alle vorkommenden Fallvarianten in jeder Hinsicht vollständig darzustellen._

## Muss ich überhaupt etwas ändern?

Gute Frage, hängt davon ab, was es für ein Addon ist und wie man es einsetzt.

Es gibt Addons, die eher im Hintergrund arbeiten und deren Methoden wahrscheinlich gar nicht außerhalb des Addons genutzt werden. Hier sind wohl keine Anpassungen im eigenen Code erforderlich.

>**Faustregel:** Du nutzt im Modul-Code, Template-Code oder Projekt-Code keine Klassen, Methoden und Funktionen des Addons? Dann musst du vermutlich nichts ändern.

>**Faustregel:** Du nutzt im Modul-Code, Template-Code oder Projekt-Code Klassen, Methoden und Funktionen des Addons? Dann musst du vermutlich etwas ändern.

>**Tipp:** Nutze eine IDE oder einen Editor mit statischer Codeanalyse, z.B. PHPStorm oder VS Code mit entsprechenden Plugins oder über [rexstan](https://github.com/FriendsOfREDAXO/rexstan). Sie zeigen dir, welche Methoden deprecated sind. Weitere Hinweise dazu nachfolgend.

### Beispiel _Focuspoint out-of-the-box_

Bei den Medien wird interaktiv der Fokuspunkt gesetzt. Die Medienausgabe erfolgt über einen MediaManager-Typ mit Effekt `focuspoint_fit`. Hier sind keine Anpassungen erforderlich.

### Beispiel _Focuspoint mit eigenen Erweiterungen_

Manche nutzen Focuspoint im Medienpool zur Erfassung und Verwaltung der Fokuspunke. Die Werte werden z.B. in CSS oder in eigenen Effekten verwendet. In so einem Fall müssen alle vorkommenden Stellen identifiziert und angepasst werden.

## Wie finde ich anzupassende Stellen

Fundstellen können z.B. sein:

- Programmcode  
  - `$media = focuspoint_media::get($medianame);`
  - `echo markitup::parseOutput ('markdown', $text);`
- Literale im Programmcode
  - `is_a($media,'focuspoint_media')`
  - `rex_yform_manager_dataset::setModelClass('rex_geolocation_mapset', 'mapset')`;
- Callbacks in Formularen
  - yform-Formulare (für Values, Actions, und Validates) im Table-Manager erfasst
  - yform-Tableset-Dateien (aus exports)
  - rex_form
- Beispiele in Dokumentationen und READMEs.

### Textsuche

Auf jeden Fall wird eine Textsuche mit der IDE in den relevanten Verzeichnissen helfen. 

- Developer-Addon: Data-Verzeichnis für Module und Templates
- Project-Addon
- Theme-Addon
- evtl. weitere eigene Addons, abhängige Addons die nicht auf die Umstellung vorbereitet sind
- evtl. auch Data-Verzeichnisse?

Da die meisten Addons ohne Namespace eindeutige Namen über einen Namens-Präfix hergestellt haben (z.B. MarkItUp, Focuspoint) bietet sich die Suche nach diesem Präfix an. Leider wird man auch genügend Stellen finden, in denen das Wort in einem ganz anderen Kontext steht (z.B. Kommentare und mitunter sogar zufällig in Vendor-Verzeichnissen).

Aus den Fundstellen müssen die relevanten herausgesucht und bearbeitet werden. 

Die Textsuche findet auch Stellen in Dokumenationen und YForm-Tablesets (JSON). Stellen in Datenbanken (z.B. `rex_yform_fields`) müssen separat gesucht werden.

### Statische Codeanalyse

Wenn der Autor nett war, sind die alten Funktionen und Klassen noch vorhanden, aber als
"deprecated" markiert. Man kann z.B. [rexstan](https://github.com/FriendsOfREDAXO/rexstan)
über die in Frage kommenden Addons laufen lassen (Developer, Project, Theme, ...).
Als Analyseumfang wählt man nur die Extension "Deprecation Warnings".

Für Klassen und Funktionen, die "deprecated" sind, listet rexstan entsprechende Hinweise auf.
Aus der Liste kann man gezielt an die Code-Stelle springen.

Bitte beachten: für Literale in Code-Stellen, Passagen in Dokumenationen, Callbacks in YForm-Tablesets (JSON) oder
Datenbanken (z.B. `rex_yform_fields`) muss auf die Textsuche bzw. Adminer|PhpMyAdmin zurückgegriffen werden.

### Entwicklungsumgebung (IDE)

Auch die IDE führt Code-Analysen durch und hebt als "deprecated" eingestufte Elemente hervor.

Auch hier gilt: für Code-Stellen (Literale), Passagen in Dokumentationen, Callbacks in YForm-Tablesets (JSON) oder
Datenbanken (z.B. `rex_yform_fields`) muss auf die Textsuche bzw. Adminer|PhpMyAdmin zurückgegriffen werden.

## Was muss wie geändert werden?

Im Grunde gibt es zwei Punkte zu beachten

Klassennamen haben sich in die CamelCase-Schreibweise geändert und möglicherweise ihren nun
überflüssigen Namens-Präfix verloren. Beispiele:

  - aus `focuspoint_media` wird `FocuspointMedia`
  - aus `markitup_textile` wird `Textile`

Die Klassen liegen nun im Namespace. Der vollständige Klassenname ist der Namespace + Klasse.

- Namespace: `FriendsOfRedaxo\Focuspoint`
- Klasse: `FocuspointMedia`
- vollständiger Name: `FriendsOfRedaxo\Focuspoint\FocuspointMedia`

Für Funktionen gelten keine neuen Namensregeln. Gleichwohl müssen sie den vollständigen Namen mit Namespace bekommen.

### Änderungen im Code

Es gibt zwei Varianten, von denen die USE-Variante meist die bessere ist. An den Anfang des eigenen
Codes in Modulen, Templates etc., der Objekte aus dem Addon nutzt, wird ein Use-Statement für die
jeweilige Klasse gesetzt. Die Klasse kann danach ohne den Namespace-Zusatz benutzt werden.

Hier ein Beispiel für eine Geolocation-Code im Modul:

```php
use FriendsOfRedaxo\Geolocation\Mapset;
use FriendsOfRedaxo\Geolocation\Calc\Box;
use FriendsOfRedaxo\Geolocation\Calc\Point;

$konstanz = Point::byLatLng([47.658968, 9.178456]);

$bounds = Box::byInnerCircle($konstanz,5000);

echo Mapset::take()
    ->dataset('bounds',$bounds->latLng())
    ->dataset('positionplus',$konstanz->latLng())
    ->parse();
```

Alternativ kann wie oben beschrieben der vollständige Name genutzt werden. Der resultierende Code
wird schnell unübersichtlich, insbesondere wenn Klassen mehrfach benutzt werden.

```php
$konstanz = FriendsOfRedaxo\Geolocation\Calc\Point::byLatLng([47.658968, 9.178456]);

$bounds = FriendsOfRedaxo\Geolocation\Calc\Box::byInnerCircle($konstanz,5000);

echo FriendsOfRedaxo\Geolocation\Mapset::take()
    ->dataset('bounds',$bounds->latLng())
    ->dataset('positionplus',$konstanz->latLng())
    ->parse();
```

> Good Practice: nutze USE-Statements

### Änderungen in Literalen

Klassen- und Methoden-Namen in Literalen müssen etwas anders gehandhabt werden.
Ein vorgeschaltetes `use ...` wirkt sich nicht auf Literale aus. Eine einfache
Lösung wäre, den vollständihen Namen einzusetzen:

- alt: `is_a($media,'focuspoint_media')`
- neu: `is_a($media,'FriendsOfRedaxo\Focuspoint\FocuspointMedia')`

Bitte macht das nicht! Das Grundproblem ist, dass diese Literale von der Code-Analyse
der IDE oder RexStan nicht als Klassen erkannt werden. Die Code-Analyse kann Fehler an
solchen Stellen nicht erkennen!

Die Literale sollte immer in eine moderne, genau dafür geschaffene Variante geändert werden:

- alt: `is_a($media,'focuspoint_media')`
- neu: `is_a($media,FriendsOfRedaxo\Focuspoint\FocuspointMedia::class)`

Dann ist es kein Literal mehr, sondern eine reguläre Klassen-Referenz. Die IDE bzw. RexStan
können die Stellen erkennen und machen auf Fehler aufmerksam.

In der Variante greif auch das Use-Statement:

```php
use FriendsOfRedaxo\Focuspoint\FocuspointMedia;
...
if (is_a($media,FocuspointMedia::class)) {
    ...
}
```

### Änderungen bei Callbacks im Code

Typische Schreibweisen sind:

- `array('klasse', 'methode')`
- `['klasse', 'methode']`
- `'klasse::methode'`
- mitunter auch schon `[klasse::class, 'methode']`

Hier gibt es sei PHP 8.1 die "First class callable syntax" bzw. "Callback-Funktionen als Objekte erster Klasse".
In der Schreibweise kann die Code-Analyse nicht nur die Klasse berücksichtigen (`klasse::class`), sondern auch
die Methode. Das erweitert noch einmal die Möglichkeiten der Code-Analyse durch IDE und RexStan.

- First class callable syntax: `klasse::methode(...)`
- Beispiel: `rex_extension::register('EP_NAME', klasse::methode(...));` 

### Änderungen bei Callback in Formularen usw.

In Tablesets (Yform, JSON-Format) in interaktiv verwalteten YForm-Felddefinitionen, in
Tabellen wie `rex_yform_fields` usw. muss generell der komplette Namespace mit aufgenommen
werden. Die "First class callable syntax" funktioniert nicht.

## Bei der Gelegenheit: den Code modernisieren

Es hat gute Gründe, warum sich Schreibweisen im Code ändern. Trotzdem haben alte Schreibweisen
ein langes Leben. Wie oben beschrieben sind neue Variaten sehr hilfreich und erleichtern
Änderungen. 

Wenn man eh den Code anfassen muss, kann man mindestens diese Stellen auf die aktuelle Schreibweise
bringen. Spätestens bei der statischen Code-Analyse (RexStan) und bei der Code-Überprüfung in der IDE
ergeben sich handfeste Vorteile: Fehler werden besser gefunden, der Code ist zukunftfähiger.

Beispiele:

- aus `'meine_klasse'` wird `MeineKlasse::class`
- aus `'meine_klasse::methode'`, `array('MeineKlasse','Methode')` oder `['meine_klasse','methode']` wird `MeineKlasse::methode(...)`
- aus `array(...)` sollte man `[...]` machen.

Die Suche mit RexStan nach "Deprecation Warnings" wird u.U. noch weitere Fundstellen generieren, z.B.
PHP-Funktionen oder Hinweise auf weitere modernisierte Addons. Auch an diesen Stellen sollte
der Code bereinigt werden.
