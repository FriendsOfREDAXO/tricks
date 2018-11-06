---
title: Weiterführende Tipps nach Konvertierung von REDAXO 4.x zu 5
authors: [skerbis,alexplusde]
prio:
--- 

# Weiterführende Tipps nach Konvertierung von REDAXO 4.x zu 5

## Fehler erkennen und Beseitigen

Durch Verwendung des Cache Warm-Up AddOns ist es nicht nötig die Website "abzusurfen" um eventuelle Fehler zu finden. Wenn Cache-Warm-Up einen fehler findet bricht es ab und bietet an sich den Fehler anzuschauen. Man erhält dann die gewohnte Whoops-Meldung. 

## Addons und Module

Einige AddOns wurden bislang nicht nach REDAXO 5 überführt und stehen nicht mehr zur Verfügung. Nachfolgend listen wir einen Überblick darüber welche AddOns gleiche oder ähnliche Funktionen liefern: 

### SEO42
Nach der Konvertierung sollten sämtliche SEO42:: Codes in den Templates und Modulen entfernt werden. YConverter wird diese nicht konvertieren, so dass dies manuell durchgeführt werden muss.  

SEO42 kann durch **YRewrite** in Kombination mit **YRewrite Scheme** oder in Kombination mit **XCore** ersetzt werden. XCORE ist vom selben Entwickler von SEO42, das einige bekannte Funktionalitäten von SEO42 bereitstellt. 

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
