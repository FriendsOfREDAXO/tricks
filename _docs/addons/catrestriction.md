---
title: Kategorien auf ausgewählte Mime-Typen einschränken
authors: [christophboecker]
prio: 1
---

# Kategorien auf ausgewählte Mime-Typen einschränken

## Ausgangslage

Im Normalzustand gelten für alle Kategorien im Medienpool die gleichen Regeln bzgl. zulässiger Dateitypen (Mime-Typ).

Die Aufgabe ist einen Weg zu finden, wie man gezielt für einzelne Kategorien des Medienpools andere Regeln für nur dort
zulässige Dateitypen implementieren kann. 

Als Beispiel dient Kategorie mit der ID "2" für PDFs und eine mit der ID "3" für Bilder (jpg,png).

## Wie arbeitet der Medienpool?

Die Liste zulässiger und geblockter Typen ist in der `package.yml` des Medienpool zu finden:
```yml
blocked_extensions: [php, php3, php4, php5, php6, php7, phar, pht, phtml, hh, pl, asp, aspx, cfm, jsp, jsf, bat, sh, cgi, htaccess, htpasswd]
allowed_doctypes: [bmp, css, doc, docx, eps, gif, gz, jpg, jpeg, mov, mp3, mp4, ogg, pdf, png, ppt, pptx, pps, ppsx, rar, rtf, svg, swf, tar, tif, tiff, txt, webp, wma, xls, xlsx, zip]

```
Die Steuerung erfolgt also über die Extensions.

Während eines Uploads wird geprüft, dass die Extension 
- nicht in der Liste "blocked_extensions" vorkommt
- in der Liste "allowed_doctypes" vorkommt.

## Lösungsumfang

Im Medienpool wird nur beim Upload geprüft, ob Dateien den Regeln entsprechen. Da alle Kategorien dieselben
Regeln haben, muss danach keine weitere Prüfung erfolgen.

Sobald Kategorien begrenzt sind, sieht die Sache anders aus. Jetzt muss auch geprüft werden, ob Dateien z.B.
aus einer unbeschränkten Kategorie in eine beschränkte Kategorie verschoben werden.

## Wo einklinken? Lösungsidee!

Eigentlich nutzt man in REDAXO die ExtensionPoints, um in den Ablauf einzugreifen. Der Upload selbst erfolgt
über `mediapool/pages/upload.php`. Dort findet sich kein ExtensionPoint.

In den Programmcode einzugreifen, ist auch keine kluge Lösung, da nicht update-sicher.

Ein anderer Ansatz ist der Eingriff in die Liste der "allowed_doctypes". Dabei verbietet sich die
grundlegende Änderung der `package.yml`, denn das hätte wieder Auswirkung auf alle Kategorien. Aber man
kann die Liste, nachdem sie geladen wude, kategoriebezogen austauschen.

Dazu muss das System - und zwar bevor der Upload durchgeführt wird - erkennen, dass
- ein Upload in der Medienpool erfolgt und
- das Ablageziel eine beschränkte Kategorie ist.

In dem Fall wird die Liste der "allowed_doctypes" gegen die kategoriebezogene Liste ausgetauscht.

## Umsetzung: Upload

Der Code kann in einer beliebigen `boot.php` stehen bzw. aus ihr heraus aufgerufen werden (z.B. Projekt-Addon).

Ob ein Upload in eine begrenzte Kategorie vorliegt, kann aus den Request-Parametern abgelesen werden:
- page=mediapool/upload
- rex_file_category=«id_begrenzte_kategorie»

Bereits diesem Punkt die Property 'allowed_doctypes' zu verändern, ist nicht zielführend. Der Medienpool
wird evtl. erst danach initialisiert wird und setzt es die Änderungen zurück. Der Eingriff darf erst erfolgen, wenn
der Medienpool initialisiert ist. Hierzu klinkt man sich in den ExtensionPoint 'PACKAGES_INCLUDED'
ein.

Im EP kommt es letztlich auf zwei Zeilen an:
```php
$mp = rex_package::get('mediapool');
$mp->setProperty('allowed_doctypes',$neueListe);
```
Alles weitere dient nur der Absicherung:
- verlagere 'allowed_doctypes', die nicht in `$neueListe` stehen, nach 'blocked_extensions'
- die neue Liste darf nur ein Teilmenge der originalen 'allowed_doctypes' sein

Der eigentliche Upload mittels `page/upload.php` läuft danach ganz normal ab.

## Umsetzung: Verschieben

In ähnlicher Weise kann man erkennen, ob eine Datei in eine beschränkte Kategorie verschoben wird. 
- page=mediapool/media
- rex_file_category=«id_begrenzte_kategorie»
- btn_update=rex_i18n::msg('pool_file_update')
- file_id=«id_des_bilddatensatzes»

Die 'rex_file_category' ist die ID der Kategorie, in der Mediendatei zukünftig liegen soll.
Handlungsbedarf besteht nur, wenn die Datei aktuell in einer anderen Kategorie als 'rex_file_category' liegt.
Ergibt die Prüfung, dass der Datei-Suffix nicht in der Liste der für die Zielkategorei zulässigen ist,
wird die Änderung unterbunden.

Über den EP 'PAGE_TITLE_SHOWN' wird eine Fehlermeldung eingeschleust. So erfährt der Nutzer
von der Beschränkung. 

Leider wird immer noch von `page/media.php` das Update durchgeführt. Auslöser ist der Request-Parameter 'btn_update'.
Wird 'btn_update' aus '$\_POST' entfernt, trickst das `media.php` aus und die Medien-Seite wird
_normal_ angezeigt. 

## Kategoriebeschränkung erfassen 

Im Beispielcode im nächsten Kapitel wird ein Array `$catRestriction` mit den zulässigen Dateitypen
für ausgewählte Kategorien in der `boot.ini` gepflegt. Die Daten werden per USE an die 
EP-Funktionen übergeben.

Im praktischen Laben könnten die Daten z.B. in der Systemkonfiguration, in der `package.yml`
des Projekt-Addons oder in einem Data-Verzeichnis stehen.
 
## Beispiel-Code

Neben der Abfrage auf Backend könnte man auch Benutzerrechte abfragen oder dass der User eingelogged ist.
Der Code ist für eine `boot.ini` vorgesehen.

```php
if( rex::isBackend() ) {
    $catRestriction = [
            2 => ['pdf'],			    // PDF-Dokumente
            3 => ['jpg','jpeg','png'],	// Bilder
        ];

    $page = rex_request('page','string','');
    $cat = rex_request('rex_file_category','integer',-1);

    if( $page == 'mediapool/upload'
        && $_FILES['file_new']['name']
        && array_key_exists( $cat,$catRestriction ) )
    {
        $catsAllowed = $catRestriction[$cat];
        rex_extension::register('PACKAGES_INCLUDED', function ($ep) use($catsAllowed) {
            $mp = rex_package::get('mediapool');
            $ext = array_diff( $mp->getProperty('allowed_doctypes'),$catsAllowed );
            $ext = array_merge($mp->getProperty('blocked_extensions'),$ext);
            $mp->setProperty('blocked_extensions', $ext);
            $ext = array_intersect( $mp->getProperty('allowed_doctypes'),$catsAllowed );
            $mp->setProperty('allowed_doctypes',$ext);
        });
    }
    elseif( $page == 'mediapool/media'
        && rex_post('btn_update','string','') == rex_i18n::msg('pool_file_update')
        && array_key_exists( $cat,$catRestriction )
        && ( $id=rex_request('file_id','integer',-1) ) != -1 )
    {
        $bild = rex_sql::factory()->getArray('SELECT id,filename FROM '.rex::getTable('media').' WHERE id=:id AND category_id <> :cid',[':id'=>$id,':cid'=>$cat], PDO::FETCH_KEY_PAIR);
        if( $bild ) {
            $catsAllowed = array_intersect( rex_package::get('mediapool')->getProperty('allowed_doctypes'),$catRestriction[$cat] );
            $extension = rex_file::extension($bild[$id]);
            if( !in_array($extension,$catsAllowed) ) {
                unset( $_POST['btn_update'] );
                $mcat = rex_media_category::get($cat);
                $result = rex_i18n::msg('pool_file_file') .
                    " \"<strong>{$bild[$id]}</strong>\" " . 
                    rex_i18n::msg('pool_changecat_selectedmedia_prefix') .
                    " \"<strong>{$mcat->getName()} [{$mcat->getId()}]</strong>\" " .
                    rex_i18n::msg('pool_changecat_selectedmedia_suffix') .
                    ' - ' .
                    rex_i18n::msg('pool_file_mediatype_not_allowed') . 
                    " \"<strong>$extension</strong>\"";
                rex_extension::register('PAGE_TITLE_SHOWN', function($ep) use ($result) {
                    $ep->setSubject(rex_view::error($result) . $ep->getSubject());
                });
            }
        }
    }
}
```
