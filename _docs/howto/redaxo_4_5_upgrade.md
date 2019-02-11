---
title: Konvertierung von REDAXO 4.x zu 5 und weiterführende Tipps
authors: [skerbis,alexplusde]
prio:
--- 

# Schritt-für-Schritt-Anleitung YConverter

**Alte R4-Live-Seite**

* Backup der Datenbank machen (mit User-Tabelle!)
* Kopie der Live-Seite herunterladen vom Server per FTP herunterladen
* Projekt „entmüllen“ – ungenutzte Kategorien, Artikel, Bilder, Module und Templates entfernen

**R4.7-Konverter-Website**

* REDAXO 4.7 herunterladen Subdomain rex4.meine-website.de erstellen und R4.7 hochladen
* YConverter von GitHub herunterladen https://github.com/yakamara/yconverter und in Addons-Verzeichnis hochladen (Verzeichnis muss yconverter heißen, nicht yconverter-master)
* REDAXO 4.7 installieren – mit der Datenbank der Live-Seite verbinden (oder, wenn man auf Nummer sicher gehen will, eine neue Datenbank verwenden und das Backup dort einspielen)

**R5.6-Website (neue Website)**

* Aktuelles REDAXO 5 herunterladen
* Subdomain rex5.meine-website.de erstellen und R5 hochladen
* Datenbank für REDAXO 5 erstellen
* Setup komplett ausführen

**R4.7-Konverter-Website**

* Den konvertieren-Button fürs REDAXO drücken
* Die Daten an REDAXO 5 übertragen
* Den konvertierten-Button für XForm drücken
* Die XForm-Tabellen an REDAXO 5 übertragen

** R5.6-Website (neue Website)**

* Cache löschen – alle Inhalte sind jetzt da
* YRewrite einrichten
* * Domain hinzufügen
* * Setup ausführen
* * Template-Code aus der Setup-Seite kopieren und im Template unter ersetzen.
* files-Ordner in media-Ordner kopieren, ggf. zusätzliche Ordner wie assets oder ressources mitkopieren.

* In Addons den customizer aktivieren und unter System einrichten
* Die Website im Frontend aufrufen und schauen, welche Teile in Modulen und Templates nicht mehr funktionieren (z.B. Navigation) und diese händisch anpassen

**R4.7-Konverter-Website**

* Die Installation kann jetzt entfernt werden (Verzeichnis / Subdomain löschen – nicht die Live-Datenbank!)


# Weiterführende Tipps nach Konvertierung von REDAXO 4.x zu 5

## Fehler erkennen und Beseitigen

Durch Verwendung des Cache Warm-Up AddOns ist es nicht nötig die Website "abzusurfen" um eventuelle Fehler zu finden. Wenn Cache-Warm-Up einen fehler findet bricht es ab und bietet an sich den Fehler anzuschauen. Man erhält dann die gewohnte Whoops-Meldung. 

## Addons und Module

Einige AddOns wurden bislang nicht nach REDAXO 5 überführt und stehen nicht mehr zur Verfügung. Nachfolgend listen wir einen Überblick darüber welche AddOns gleiche oder ähnliche Funktionen liefern: 

### SEO42
Nach der Konvertierung sollten sämtliche SEO42:: Codes in den Templates und Modulen entfernt werden. YConverter wird diese nicht konvertieren, so dass dies manuell durchgeführt werden muss.  

SEO42 kann durch **YRewrite** in Kombination mit **YRewrite Scheme** oder in Kombination mit **XCore** ersetzt werden. XCORE ist vom selben Entwickler von SEO42, das einige bekannte Funktionalitäten von SEO42 bereitstellt. 

## Slice on / off

Dies Funktion wird in REDAXO 5 vom Addon `bloecks` übernommen 
* `bloecks` installieren und unter Addons das bloecks-plugin `status` installieren.
* Über die Datenbank (PHPMyAdmin oder REDAXO 5-Addon `adminer`) die alten Werte kopieren: `UPDATE rex_article_slice SET status = a356_is_online`
* Anschließend kann das Feld „a356_is_online“ in der Tabelle `rex_article_slice` entfernt werden

### Editoren
Die in REDAXO 4 bekannten Text-Editoren finden sich auch im REDAXO 5-Installer. 

- Für die Verwendung von **Textile oder Markdown** steht das **Markitup-AddOn** zur Verfügung.
- Als WYSIWYG-Editoren bieten sich **CKEDITOR 4, CKE5, Redactor2** und **TinyMCE** an. 

### Suchmaschine
Nutzer der Suchmaschine xsearch und rex_search finden mit search_it einen geeigneten Ersatz. Wer von REX_Search kommt, muss nur den Aufruf der PHP Class ändern, dann funktioniert die Suche meist wie gewohnt. 

### Formulare

Der Nachfolger von **XForm** heißt in REDAXO 5 **YForm**. Die Tabellen und Einstellungen werden bei der xform-Konvertierung im YConverter übernommen und importiert. Nutzer von **do form!**, finden bei [GitHub](https://github.com/skerbis/doform-6) einen Nachfolger. Wenn nur wenige Formulare verwendet werden, sollte man über einen Umbau nach YForm nachdenken.  

### Multiuploads

Als Lösung und Ersatz des Multiuploader-AddOn stehen die AddOns ***uploader*** und **multiuploader** zur Verfügung. 
