# Sicherheitsempfehlungen

## HTTP Strict Transport Security (HSTS)

HTTP Strict Transport Security (HSTS) ist ein Webserver Verzeichnis, das Benutzer und Webbrowser informiert, wie die Verbindung zwischen Response Header, der ganz am Anfang gesendet und später zurück zum Browser gesendet wird, zu handhaben ist.

Damit wird der `Strict-Transport-Security`-Parameter festgelegt. Es zwingt diese Verbindungen zur HTTPS Verschlüsselung, und ignoriert jedes Skript, das Ressourcen der Domain über HTTP laden will. HSTS ist ein Teil eines großen Bündels an Sicherheitsmaßnahmen, das Sie für Ihren Webserver oder Webhosting-Dienst nutzen können.
Hier ein Beispiel, wie das unter einem Apache-Webserver aussieht (Code für die .htaccess):

```text
Header set Strict-Transport-Security: "max-age=63072000; includeSubDomains; preload"
```

Wert für `max-age`: minimum `10886400`, optimal `63072000`

> **Wichtig:** für HSTS muss die Domain (und alle eingebundenen URLs wie z. B. Google-Fonts) über HTTPS laufen und ein Zertifikat installiert sein.

> **Hinweis:** HSTS kann auch über die config.yml (redaxo/data/core/) aktiviert werden: `use_hsts: true`, `hsts_max_age: 63072000`. Die Variante über .htaccess ist jedoch zu empfehlen.

> **Tipp:** Online-Tool zum Prüfen, ob HSTS-Header gesetzt ist: https://gf.dev/hsts-test 

## jQuery

Oftmals wird jQuery verwendet. Viele legen dazu eine jQuery-Klasse im Dateisystem ab und binden dieses im Template ein. Leider vergessen viele, jQuery regelmäßig zu aktualisieren.

Darum ist es besser, man bindet die jQuery-Klasse aus Redaxo ein, die bei einem Core-Update in der Regel mit aktualisiert wird:

```html
<script src="<?= rex_url::base('assets/core/jquery.min.js') ?>"></script>
```

## Session Hijacking

Beim Session-Hijacking wird eine gültige Session von einem Angreifer entführt (daher das Hijacking). Nach erfolgreicher Entführung kann der Angreifer im schlimmsten Fall die Identität des Nutzers übernehmen und die Anwendung in dessen Namen nutzen. 
Verhindern kann man das, indem man für Cookies das Secure Flag sowie die Option httpOnly aktiviert. In Redaxo dazu die config.yml öffnen und die Parameter auf true setzen:
cookie: { lifetime: null, path: null, domain: null, secure: true, httponly: true, samesite: Strict }
Prüfen, ob Secure Flag und httpOnly aktiv sind: https://gf.dev/secure-cookie-test

## TLS

Transport Layer Security (TLS, englisch für Transportschichtsicherheit), weitläufiger bekannt unter der Vorgängerbezeichnung Secure Sockets Layer (SSL), ist ein hybrides Verschlüsselungsprotokoll zur sicheren Datenübertragung im Internet. Die letzte Version des SSL-Protokolls war die Version 3.0; danach wurde es unter dem neuen Namen TLS, beginnend mit Version 1.0, weiterentwickelt und standardisiert. Auf vielen Servern laufen die Versionen 1.0, 1.1, 1.2 und 1.3 parallel, um alle gängigen (und auch veralteten Browser) zu unterstützen.

Die meisten Browser unterstützen bereits TLS 1.3. Die Version 1.0 ist veraltet und sollte am Server deaktiviert werden. Dazu muss man sich an den Hoster wenden. 

Prüfen, ob TLS 1.0 deaktiviert ist: https://gf.dev/tls-test 

## XSS und SQL-Injections verhindern
Die Daten, die in die DB geschrieben oder im Frontend aus der DB angezeigt werden, sollten in der weiteren Verarbeitung „gesäubert“ werden. Zum Beispiel sollten mit rex_get(), rex_post() und rex_request() übernommene Strings vor der Ausgabe auf der Website escaped werden, um mögliches HTML oder anderen Code umzuwandeln. 
rex_escape($string)
Beim Schreiben in die DB ist außerdem folgendes falsch:
setQuery("SELECT * FROM table WHERE id ='.$_GET['id'].'')
Richtig ist:
setQuery("SELECT * FROM table WHERE id =:id', array(":id" => rex_request('id', "int", 0)))
Ersetzt den Platzhalter :id mit dem Wert aus dem assoziativen Array. So behältst du den besten Überblick, wenn es darum geht, mehrere Parameter zu übergeben. Dabei werden die Werte sauber übergeben und eingesetzt, eine SQL-Injection ist dann nicht möglich.

**Grundsätzlich: **
Schwachstellen lassen sich mit vielen kostenlosen Tests aufspüren. Hier ein paar Beispiele:
https://observatory.mozilla.org
https://gf.dev/toolbox
https://securityheaders.com/
Allgemeine Tipps:
•	Redakteure sollten keine Möglichkeit haben, PHP-Code direkt einzugeben


