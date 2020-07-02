---
title: Sicherheitsempfehlungen
authors: [engel4u]
prio:
---

# Sicherheitsempfehlungen

Die nachfolgenden Tipps sind nicht als Empfehlung zu verstehen. Vielmehr sollen diese für das Thema Sicherheit sensibilisieren und aufzeigen, mit welchen Themen man sich beschäftigen kann und sollte. 

## HTTP Strict Transport Security (HSTS)

HTTP Strict Transport Security (HSTS) ist ein Webserver Verzeichnis, das Benutzer und Webbrowser informiert, wie die Verbindung zwischen Response Header, der ganz am Anfang gesendet und später zurück zum Browser gesendet wird, zu handhaben ist.

Damit wird der `Strict-Transport-Security`-Parameter festgelegt. Es zwingt diese Verbindungen zur HTTPS Verschlüsselung, und ignoriert jedes Skript, das Ressourcen der Domain über HTTP laden will. HSTS ist ein Teil eines großen Bündels an Sicherheitsmaßnahmen, das Sie für Ihren Webserver oder Webhosting-Dienst nutzen können.

Um HSTS zu aktivieren gibt es mehrere Möglichkeiten. 

Wir empfehlen die Einstellung auf dem Server oder dem Zertifikat vorzunehmen. Dazu wende Dich bitte an Deinen Hoster. 

Alternativ kannst Du HSTS auch in Redaxo aktivieren (entweder während des Setups oder nachträglich in der config.yml):  
`use_hsts: true`
`hsts_max_age: 63072000`

Es ist auch eine Aktivierung über .htaccess (bei Apache-Servern) möglich. Davon raten wir ab, da z. B. bei Einsatz von yRerwrite bei einer Aktualisierung die .htaccess überschrieben und HSTS dadurch deaktiviert wird. 

Hat man HSTS aktiviert, kann man seine Domain auch in eine Preload-Liste aufnehmen lassen. Dadurch werden die Browser Chrome, Firefox und Safari gezwungen, für die  Domain HTTPS zu nutzen.

> **Wichtig:** für HSTS muss die Domain (und alle eingebundenen URLs wie z. B. Google-Fonts) über HTTPS laufen und ein Zertifikat installiert sein.


> **Tipp:** Online-Tool zum Prüfen, ob HSTS-Header gesetzt ist: https://gf.dev/hsts-test 

## Assets

Der Einsatz der vom REDAXO core im Backend verwendeten Assets wie JQuery,JQueryUi, Font-Awsome usw. sollte 
im Frontend vermieden werden. Diese Assets werden für das Backend aktualsiert, abhängige Frontend-PlugIns könnten ggf. nicht funktionieren, sollte für das Backend das Major-Release gewechselt werden. 

Wir empfehlen diese Assets separat für für das Frontend einzubinden und die Sicherheitshinweise zu den Skripten regelmäßig zu beachten.  


## Session Hijacking

Beim Session-Hijacking wird eine gültige Session von einem Angreifer entführt (daher das Hijacking). Nach erfolgreicher Entführung kann der Angreifer im schlimmsten Fall die Identität des Nutzers übernehmen und die Anwendung in dessen Namen nutzen. 
Verhindern kann man das, indem man für Cookies das Secure Flag sowie die Option httpOnly aktiviert. In Redaxo dazu die `config.yml` öffnen und die Parameter auf true setzen:

`cookie: { lifetime: null, path: null, domain: null, secure: true, httponly: true, samesite: Strict }`
Prüfen, ob Secure Flag und httpOnly aktiv sind: https://gf.dev/secure-cookie-test

## TLS
Transport Layer Security (TLS, englisch für Transportschichtsicherheit), weitläufiger bekannt unter der Vorgängerbezeichnung Secure Sockets Layer (SSL), ist ein hybrides Verschlüsselungsprotokoll zur sicheren Datenübertragung im Internet. Die letzte Version des SSL-Protokolls war die Version 3.0; danach wurde es unter dem neuen Namen TLS, beginnend mit Version 1.0, weiterentwickelt und standardisiert. Auf vielen Servern laufen die Versionen 1.0, 1.1, 1.2 und 1.3 parallel, um alle gängigen (und auch veralteten Browser) zu unterstützen. 
Die meisten Browser unterstützen bereits TLS 1.3. Die Version 1.0 ist veraltet und sollte am Server deaktiviert werden. Dazu muss man sich an den Hoster wenden. 

Prüfen, ob TLS 1.0 deaktiviert ist: https://gf.dev/tls-test 

## XSS und SQL-Injections verhindern

Die Daten, die in die DB geschrieben oder im Frontend aus der DB angezeigt werden, sollten in der weiteren Verarbeitung „gesäubert“ werden. Zum Beispiel sollten mit rex_get(), rex_post() und rex_request() übernommene Strings vor der Ausgabe auf der Website escaped werden, um mögliches HTML oder anderen Code umzuwandeln.

`rex_escape($string)`

Beim Schreiben in die DB ist außerdem folgendes falsch: `setQuery("SELECT * FROM table WHERE id ='.$_GET['id'].'')`

Richtig ist: `setQuery("SELECT * FROM table WHERE id =:id', array(":id" => rex_request('id', "int", 0)))`

Ersetzt den Platzhalter `:id` mit dem Wert aus dem assoziativen Array. So behältst du den besten Überblick, wenn es darum geht, mehrere Parameter zu übergeben. Dabei werden die Werte sauber übergeben und eingesetzt, eine SQL-Injection ist dann nicht möglich.

## Content Security Policy (CSP) 

Content Security Policy (CSP) ist eine zusätzliche Sicherheitsebene, die dazu beiträgt, bestimmte Arten von Angriffen, einschließlich Cross Site Scripting (XSS) und Data-Injection-Angriffe, zu erkennen und abzuschwächen. Diese Angriffe werden für alles mögliche verwendet, vom Datendiebstahl über die Verunstaltung von Websites bis hin zur Verbreitung von Malware.
<i>Quelle (englisch): https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP</i>

CSP können als Header oder als Meta im Website-Code übergeben werden. 

Hilfen zur Generierung und Test der Policy bieten u.a.:

- [Firefox Extension: Laboratory (Content Security Policy / CSP Toolkit)](https://addons.mozilla.org/de/firefox/addon/laboratory-by-mozilla/)

- https://observatory.mozilla.org

- [Content Security Policy (CSP) Generator](https://csper.io/generator)


## X-Powered-By verstecken

X-Powered kann kann sensible Informationen über die verwendete PHP, APACHE oder nginx übermitteln. Die Ausgabe der Versionen sollte vermieden werden. 

Folgende Header Anweisung sollte hierbei helfen

`Header unset X-Powered-By`



## Grundsätzlich

Schwachstellen lassen sich mit vielen kostenlosen Tests aufspüren. Hier ein paar Beispiele:

- [https://observatory.mozilla.org](https://observatory.mozilla.org)
- [https://gf.dev/toolbox](https://gf.dev/toolbox)
- [https://securityheaders.com/](https://securityheaders.com/)
- [https://detectify.com/](https://detectify.com/)

Allgemeine Tipps:
* Redakteure sollten keine Möglichkeit haben, PHP-Code direkt einzugeben
