---
title: XAMPP mit mehreren PHP-Versionen (Windows)
authors: [aeberhard]
prio:
---

[ letztes update: 2022-12-25 ]

# XAMPP mit mehreren PHP-Versionen (Windows)

Unter Windows ist m. E. [**XAMPP**](https://www.apachefriends.org/) (Apache + MariaDB + PHP + Perl) die einfachste Basis für die REDAXO-Entwicklung. Ich selbst (@aeberhard) verwende XAMPP schon seit sehr vielen Jahren.

Hier eine Anleitung um **XAMPP** mit mehreren PHP-Versionen und SSL-Verschlüsselung einzurichten!

> **Hinweis:** Bei Installation in einem anderen Ordner als `c:\work` müssen die Pfade entsprechend angepasst werden.

- [XAMPP installieren](#xamppinstall)
- [XAMPP Setup](#xamppsetup)
- [Anpassung der php.ini](#xamppphpini)
- [SSL Zertifikat einrichten](#xamppssl)
- [Zusätzliche PHP-Versionen installieren](#xamppphpversions)
- [Apache konfigurieren](#xamppapache)
- [REDAXO installieren](#xamppredaxo)

---

<a name="xamppinstall"></a>

## XAMPP installieren

**Download** unter folgender URL: [https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/](https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/)

Hier die gewünschte PHP-Version auswählen und eine `portable` ZIP-Version verwenden.

> **Hinweis:** Beispielhaft wird hier die letzte PHP 7.4.33 Version verwendet und im Ordner `c:\work\xampp` installiert. Diese PHP-Version ist dann auch die Standard-Version des lokalen XAMPP.

**Download-Link:** [https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/7.4.33/](https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/7.4.33/)

Screenshot:

![XAMPP Download](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-Download.png "XAMPP Download")

> **Hinweis:** Download Visual C++ Redistributable für Visual Studio 2015 falls noch nicht auf dem System vorhanden [https://www.microsoft.com/de-de/download/details.aspx?id=48145](https://www.microsoft.com/de-de/download/details.aspx?id=48145)

### Installation

1. XAMPP-Archiv in den gewünschten Ordner `c:\work` herunterladen
2. XAMPP-Archiv entpacken
3. In den entpackten Ordner `C:\Work\xampp-portable-windows-x64-7.4.33-0-VC15` wechseln
4. Das Verzeichnis `xampp` **ausschneiden** und unter `c:\work` wieder **einfügen**
5. Ordner `C:\Work\xampp-portable-windows-x64-7.4.33-0-VC15` kann jetzt gelöscht werden

XAMPP ist jetzt im Verzeichnis `c:\work\xampp` installiert.

> **Hinweis:** Alle im folgenden angepassten bzw. notwendigen Dateien können hier heruntergeladen werden: [https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9](https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9)

---

<a name="xamppsetup"></a>

## XAMPP Setup

Das **Setup** mit der Datei `c:\work\xampp\setup_xampp.bat` im XAMPP-Verzeichnis starten.

![XAMPP Setup](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-setup-bat.png "XAMPP Setup")

Jetzt kann bereits mit Start des **Control-Panels** `c:\work\xampp\xampp-control.exe` und Auswahl der Sprache

![XAMPP Sprachauswahl](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-control-lang.png "XAMPP Sprachauswahl")

* der Apache Webserver `(1)`
* und MySQL `(2)`

durch Klick auf die Buttons `Starten` gestartet werden ....

![XAMPP starten](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-control-start.png "XAMPP starten")

> **Heureka!** XAMPP ist jetzt installiert und bereits unter `http://localhost` erreichbar (Port 80)!

![XAMPP localhost](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-control-localhost.png "XAMPP localhost")

Apache und Mysql jetzt wieder durch klick auf die Buttons `Stoppen` beenden.

---

<a name="xamppphpini"></a>

## Anpassung der php.ini

Durch das Script `setup_xampp.bat` wurden bereits einige Einstellungen geändert.

Folgende Einträge in der `php.ini` müssen noch angepasst bzw. auskommentiert und kontrolliert werden:

* error_log="\Work\xampp\php\logs\php_error_log"
* include_path = \Work\xampp\php\PEAR
* extension_dir = "\Work\xampp\php\ext"
* sys_temp_dir = "\Work\xampp\tmp"
* upload_tmp_dir = "\Work\xampp\tmp"
* date.timezone=Europe/Berlin
* browscap = "\Work\xampp\php\extras\browscap.ini"
* session.save_path = "\Work\xampp\tmp"
* curl.cainfo = "\Work\xampp\apache\bin\curl-ca-bundle.crt"
* openssl.cafile = "\Work\xampp\apache\bin\curl-ca-bundle.crt"

Folgende Extensions aktivieren (auskommentieren):

* extension=ftp
* extension=intl
* extension=openssl

Folgende Einträge können bei Bedarf noch angepasst werden:

* max_execution_time = 120
* max_input_time = 120
* memory_limit = 1024M
* post_max_size = 120M
* upload_max_filesize = 120M

> **Hinweis:** Eine angepasste `php.ini` (php74.ini) kann hier heruntergeladen werden: [https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9](https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9)

---

<a name="xamppssl"></a>

## SSL Zertifikat einrichten

### SSL Zertifikat erstellen

Die bestehende Datei `c:\work\xampp\apache\makecert.bat` im XAMPP-Verzeichnis durch folgenden Inhalt **ersetzen**.

```Sh
@echo off
set OPENSSL_CONF=.\conf\openssl.cnf

if not exist .\conf\ssl.crt mkdir .\conf\ssl.crt
if not exist .\conf\ssl.key mkdir .\conf\ssl.key

bin\openssl req -config cert.conf -new -sha256 -newkey rsa:2048 -nodes -keyout server.key -x509 -days 3650 -out server.crt

set OPENSSL_CONF=.\conf\openssl.cnf
del server-key.pem

move /y server.crt .\conf\ssl.crt
move /y server.key .\conf\ssl.key

echo.
echo -----
echo Das Zertifikat wurde erstellt.
echo The certificate was provided.
echo.
pause
```

Datei `c:\work\xampp\apache\cert.conf` im XAMPP-Verzeichnis mit folgendem Inhalt **anlegen** und ggf. anpassen.

```INI
[ req ]

default_bits        = 2048
default_keyfile     = server-key.pem
distinguished_name  = subject
req_extensions      = req_ext
x509_extensions     = x509_ext
string_mask         = utf8only

[ subject ]

countryName                 = Country Name (2 letter code)
countryName_default         = DE

stateOrProvinceName         = State or Province Name (full name)
stateOrProvinceName_default = BY

localityName                = Locality Name (eg, city)
localityName_default        = Munich

organizationName            = Organization Name (eg, company)
organizationName_default    = XAMPP for REDAXO

commonName                  = Common Name (e.g. server FQDN or YOUR name)
commonName_default          = localhost

emailAddress                = Email Address
emailAddress_default        = test@example.com

[ x509_ext ]

subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid,issuer

basicConstraints       = CA:FALSE
keyUsage               = digitalSignature, keyEncipherment
subjectAltName         = @alternate_names
nsComment              = "OpenSSL Generated Certificate"

[ req_ext ]

subjectKeyIdentifier = hash

basicConstraints     = CA:FALSE
keyUsage             = digitalSignature, keyEncipherment
subjectAltName       = @alternate_names
nsComment            = "OpenSSL Generated Certificate"

[ alternate_names ]

DNS.1       = localhost
```

> **Hinweis:** Die beiden Dateien `makecert.bat` und `cert.conf` findest Du auch in diesem Gist [https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9](https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9)

Datei `c:\work\xampp\apache\makecert.bat` **ausführen** und alle Eingaben einfach mit Enter bestätigen.
Siehe folgender Screenshot.

![XAMPP makecert](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-makecert-bat.png "XAMPP makecert")

### SSL Zertifikat importieren

In den Ordner `C:\Work\xampp\apache\conf\ssl.crt` wechseln und **Doppelklick** auf die Datei `server.crt`

Im folgenden Dialog auf den Button `Zertifikat installieren...` klicken.

![Zertifikat installieren](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-zertifikat-1.png "Zertifikat installieren")

Im folgenden Dialog `Lokaler Computer` auswählen und auf `Weiter` klicken.

![Zertifikat installieren](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-zertifikat-2.png "Zertifikat installieren")

Im folgenden Dialog `Alle Zertifikate in folgenden Speicher speichern` auswählen (1)
den Button `Durchsuchen` klicken (2) und dann `Vertrauenswürdige Stammzertifizierungsstellen` auswählen (3) und mit `Ok` bestätigen.
Danach auf den Button `Weiter` klicken

![Zertifikat installieren](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-zertifikat-3.png "Zertifikat installieren")

Im folgenden Dialog auf `Fertig stellen` klicken, es kann dann einen Moment dauern bis die Erfolgsmeldung erscheint.

Fertig. Das Zertifikat sollte jetzt korrekt importiert sein!

![Zertifikat installieren](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-zertifikat-4.png "Zertifikat installieren")

> **Tadaaa!** XAMPP ist jetzt mit gültigem Zertifikat installiert und kann, nach Neustart des Apachen (Stoppen / Starten über das Control-Panel), mit **https** aufgerufen werden: [https://localhost](https://localhost).

![XAMPP localhost mit SSL](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-localhost-ssl.png "XAMPP localhost mit SSL")

Apache und Mysql jetzt wieder durch klick auf die Buttons `Stoppen` beenden.

---

<a name="xamppphpversions"></a>

## Zusätzliche PHP-Versionen installieren

Im folgenden werden die PHP Versionen **8.0.x**, **8.1.x** und **8.2.x** heruntergeladen und in XAMPP integriert.

### Download der PHP-Versionen

Die PHP Versionen von der offiziellen PHP-Homepage herunterladen.

**Link zu den PHP-Windows-Downloads:** [https://windows.php.net/download/](https://windows.php.net/download/)

> **Hinweis:** Bei den Downloads die **NTS-Varianten** (*Non Thread Safe*) im **ZIP-Format** auswählen!

![XAMPP PHP Download](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-PHP-download.png "XAMPP PHP Download")

Die gewünschten PHP-Versionen in das Verzeichnis `C:\Work\xampp` herunterladen und entpacken.

Nach dem Entpacken die Verzeichnisse umbenennen (bzw. beim Entpacken bereits die kurzen Verzeichnis-Namen angeben).

**z.B.**

`php-8.0.26-nts-Win32-vs16-x64` in `php80`

`php-8.1.13-nts-Win32-vs16-x64` in `php81`

`php-8.2.0-nts-Win32-vs16-x64` in `php82`

Das Verzeichnis `C:\Work\xampp` sollte jetzt so aussehen ...

![XAMPP Struktur](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/xampp/XAMPP-struktur.png "XAMPP Struktur")

> **Hinweis:** Die heruntergeladenen und entpackten ZIP-Archive der PHP-Versionen können wieder gelöscht werden!

> **Hinweis:** Die angepassten `php.ini`-Dateien können hier heruntergeladen werden: [https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9](https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9)

### Anpassung der php.ini-Dateien

In den drei Verzeichnissen `php80`, `php81` und `php82` jeweils die Datei `php.ini-development` in `php.ini` umbenennen.

**php.ini für PHP 8.0.x anpassen**

Folgende Einträge in der `php.ini` müssen noch angepasst bzw. auskommentiert und kontrolliert werden:

* error_log="\Work\xampp\ `php80` \logs\php_error_log"
* include_path = \Work\xampp\php\PEAR
* extension_dir = "\Work\xampp\ `php80` \ext"
* sys_temp_dir = "\Work\xampp\tmp"
* upload_tmp_dir = "\Work\xampp\tmp"
* date.timezone=Europe/Berlin
* browscap = "\Work\xampp\php\extras\browscap.ini"
* session.save_path = "\Work\xampp\tmp"
* curl.cainfo = "\Work\xampp\apache\bin\curl-ca-bundle.crt"
* openssl.cafile = "\Work\xampp\apache\bin\curl-ca-bundle.crt"

Folgende Extensions aktivieren (auskommentieren):

* extension=bz2
* extension=curl
* extension=ftp
* extension=fileinfo
* extension=gd
* extension=gettext
* extension=intl
* extension=mbstring
* extension=exif
* extension=mysqli
* extension=openssl
* extension=pdo_mysql
* extension=pdo_sqlite

Folgende Einträge können bei Bedarf noch angepasst werden:

* max_execution_time = 120
* max_input_time = 120
* memory_limit = 1024M
* post_max_size = 120M
* upload_max_filesize = 120M

> **Hinweis:** Eine angepasste `php.ini` (php80.ini) kann hier heruntergeladen werden: [https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9](https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9)

**php.ini für PHP 8.1.x**

Folgende Einträge in der `php.ini` müssen noch angepasst bzw. auskommentiert und kontrolliert werden:

* error_log="\Work\xampp\ `php81` \logs\php_error_log"
* include_path = \Work\xampp\php\PEAR
* extension_dir = "\Work\xampp\ `php81` \ext"
* sys_temp_dir = "\Work\xampp\tmp"
* upload_tmp_dir = "\Work\xampp\tmp"
* date.timezone=Europe/Berlin
* browscap = "\Work\xampp\php\extras\browscap.ini"
* session.save_path = "\Work\xampp\tmp"
* curl.cainfo = "\Work\xampp\apache\bin\curl-ca-bundle.crt"
* openssl.cafile = "\Work\xampp\apache\bin\curl-ca-bundle.crt"

Folgende Extensions aktivieren (auskommentieren):

* extension=bz2
* extension=curl
* extension=ftp
* extension=fileinfo
* extension=gd
* extension=gettext
* extension=intl
* extension=mbstring
* extension=exif
* extension=mysqli
* extension=openssl
* extension=pdo_mysql
* extension=pdo_sqlite

Folgende Einträge können bei Bedarf noch angepasst werden:

* max_execution_time = 120
* max_input_time = 120
* memory_limit = 1024M
* post_max_size = 120M
* upload_max_filesize = 120M

> **Hinweis:** Eine angepasste `php.ini` (php81.ini) kann hier heruntergeladen werden: [https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9](https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9)

**php.ini für PHP 8.2.x**

Folgende Einträge in der `php.ini` müssen angepasst bzw. auskommentiert werden:

* error_log="\Work\xampp\ `php82` \logs\php_error_log"
* include_path = \Work\xampp\php\PEAR
* extension_dir = "\Work\xampp\ `php82` \ext"
* sys_temp_dir = "\Work\xampp\tmp"
* upload_tmp_dir = "\Work\xampp\tmp"
* date.timezone=Europe/Berlin
* browscap = "\Work\xampp\php\extras\browscap.ini"
* session.save_path = "\Work\xampp\tmp"
* curl.cainfo = "\Work\xampp\apache\bin\curl-ca-bundle.crt"
* openssl.cafile = "\Work\xampp\apache\bin\curl-ca-bundle.crt"

Folgende Extensions aktivieren (auskommentieren):

* extension=bz2
* extension=curl
* extension=ftp
* extension=fileinfo
* extension=gd
* extension=gettext
* extension=intl
* extension=mbstring
* extension=exif
* extension=mysqli
* extension=openssl
* extension=pdo_mysql
* extension=pdo_sqlite

Folgende Einträge können bei Bedarf noch angepasst werden:

* max_execution_time = 120
* max_input_time = 120
* memory_limit = 1024M
* post_max_size = 120M
* upload_max_filesize = 120M

> **Hinweis:** Eine angepasste `php.ini` (php82.ini) kann hier heruntergeladen werden: [https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9](https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9)

---

<a name="xamppapache"></a>

## Apache konfigurieren

XAMPP liefert standardmäßig PHP als Modul aus. Wir ändern hier zuerst die Standard-PHP-Version (7.4.33) auf CGI.

Dazu muss die Datei `c:\work\xampp\apache\conf\extra\httpd-xampp.conf` wie folgt angepasst werden.

(**PHP-Module setup** kommentieren, **PHP-CGI setup** auskommentieren)

```
#
# PHP-Module setup
#
#LoadFile "/Work/xampp/php/php7ts.dll"
#LoadFile "/Work/xampp/php/libpq.dll"
#LoadFile "/Work/xampp/php/libsqlite3.dll"
#LoadModule php7_module "/Work/xampp/php/php7apache2_4.dll"
#
#<FilesMatch "\.php$">
#    SetHandler application/x-httpd-php
#</FilesMatch>
#<FilesMatch "\.phps$">
#    SetHandler application/x-httpd-php-source
#</FilesMatch>

#
# PHP-CGI setup
#
<FilesMatch "\.php$">
    SetHandler application/x-httpd-php-cgi
</FilesMatch>
<IfModule actions_module>
    Action application/x-httpd-php-cgi "/php-cgi/php-cgi.exe"
</IfModule>
```

Die neuen PHP-Versionen in der Datei `c:\work\xampp\apache\conf\extra\httpd-xampp.conf`
am Dateiende hinzufügen,

```
ScriptAlias /php80 "/work/xampp/php80"
Action application/x-httpd-php80-cgi /php80/php-cgi.exe
<Directory "/work/xampp/php80">
    AllowOverride None
    Options None
    Require all denied
    <Files "php-cgi.exe">
        Require all granted
    </Files>
</Directory>

Listen 8000
<VirtualHost *:8000>
    <FilesMatch "\.php$">
        SetHandler application/x-httpd-php80-cgi
    </FilesMatch>
</VirtualHost>

ScriptAlias /php81 "/work/xampp/php81"
Action application/x-httpd-php81-cgi /php81/php-cgi.exe
<Directory "/work/xampp/php81">
    AllowOverride None
    Options None
    Require all denied
    <Files "php-cgi.exe">
        Require all granted
    </Files>
</Directory>

Listen 8100
<VirtualHost *:8100>
    <FilesMatch "\.php$">
        SetHandler application/x-httpd-php81-cgi
    </FilesMatch>
</VirtualHost>

ScriptAlias /php82 "/work/xampp/php82"
Action application/x-httpd-php82-cgi /php82/php-cgi.exe
<Directory "/work/xampp/php82">
    AllowOverride None
    Options None
    Require all denied
    <Files "php-cgi.exe">
        Require all granted
    </Files>
</Directory>

Listen 8200
<VirtualHost *:8200>
    <FilesMatch "\.php$">
        SetHandler application/x-httpd-php82-cgi
    </FilesMatch>
</VirtualHost>
```

Jetzt ändern wir noch die Datei `c:\work\xamppapache\conf\extra\httpd-ssl.conf` um die PHP-Versionen auch per SSL erreichbar zu machen.

Dazu folgenden Code am Dateieende der Datei `c:\work\xamppapache\conf\extra\httpd-ssl.conf` einfügen.

```
Listen 8003 https
Listen 8103 https
Listen 8203 https

<VirtualHost *:8003>
	SSLEngine on
	SSLCertificateFile "conf/ssl.crt/server.crt"
	SSLCertificateKeyFile "conf/ssl.key/server.key"
	<FilesMatch "\.(cgi|shtml|phtml|php)$">
		SSLOptions +StdEnvVars
	</FilesMatch>
	<Directory "/Work/xampp/apache/cgi-bin">
		SSLOptions +StdEnvVars
	</Directory>
	BrowserMatch "MSIE [2-5]" \
			 nokeepalive ssl-unclean-shutdown \
			 downgrade-1.0 force-response-1.0
	CustomLog "/Work/xampp/apache/logs/ssl_request.log" \
			  "%t %h %{SSL_PROTOCOL}x %{SSL_CIPHER}x \"%r\" %b"
	<FilesMatch "\.php$">
		SetHandler application/x-httpd-php80-cgi
	</FilesMatch>
</VirtualHost>

<VirtualHost *:8103>
	SSLEngine on
	SSLCertificateFile "conf/ssl.crt/server.crt"
	SSLCertificateKeyFile "conf/ssl.key/server.key"
	<FilesMatch "\.(cgi|shtml|phtml|php)$">
		SSLOptions +StdEnvVars
	</FilesMatch>
	<Directory "/Work/xampp/apache/cgi-bin">
		SSLOptions +StdEnvVars
	</Directory>
	BrowserMatch "MSIE [2-5]" \
			 nokeepalive ssl-unclean-shutdown \
			 downgrade-1.0 force-response-1.0
	CustomLog "/Work/xampp/apache/logs/ssl_request.log" \
			  "%t %h %{SSL_PROTOCOL}x %{SSL_CIPHER}x \"%r\" %b"
	<FilesMatch "\.php$">
		SetHandler application/x-httpd-php81-cgi
	</FilesMatch>
</VirtualHost>

<VirtualHost *:8203>
	SSLEngine on
	SSLCertificateFile "conf/ssl.crt/server.crt"
	SSLCertificateKeyFile "conf/ssl.key/server.key"
	<FilesMatch "\.(cgi|shtml|phtml|php)$">
		SSLOptions +StdEnvVars
	</FilesMatch>
	<Directory "/Work/xampp/apache/cgi-bin">
		SSLOptions +StdEnvVars
	</Directory>
	BrowserMatch "MSIE [2-5]" \
			 nokeepalive ssl-unclean-shutdown \
			 downgrade-1.0 force-response-1.0
	CustomLog "/Work/xampp/apache/logs/ssl_request.log" \
			  "%t %h %{SSL_PROTOCOL}x %{SSL_CIPHER}x \"%r\" %b"
	<FilesMatch "\.php$">
		SetHandler application/x-httpd-php82-cgi
	</FilesMatch>
</VirtualHost>
```

Hinweis: Die angepassten Apache-conf-Dateien können hier heruntergeladen werden: https://gist.github.com/aeberhard/a208fd67d7f0e28ad7ec9239117fe8c9

Jetzt den Apache neu starten und dann sollten folgende Links alle funktionieren!

PHP 7.4.33

* [http://localhost/dashboard/](http://localhost/dashboard/)
* [https://localhost/dashboard/](https://localhost/dashboard/)

PHP 8.0.x

* [http://localhost:8000/dashboard/](http://localhost:8000/dashboard/)
* [https://localhost:8003/dashboard/](https://localhost:8003/dashboard/)

PHP 8.1.x
* [http://localhost:8100/dashboard/](http://localhost:8100/dashboard/)
* [https://localhost:8103/dashboard/](https://localhost:8103/dashboard/)

PHP 8.2.x

* [http://localhost:8200/dashboard/](http://localhost:8200/dashboard/)
* [https://localhost:8203/dashboard/](https://localhost:8203/dashboard/)

---

<a name="xamppredaxo"></a>

## REDAXO installieren

verzeichnis htdocs/REDAXO anleen und loader herunterladen

https://github.com/FriendsOfREDAXO/redaxo_loader

http://localhost/REDAXO/redaxo_loader.php

---




