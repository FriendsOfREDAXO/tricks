---
title: NGINX-Konfiguration für YRewrite
authors: []
prio:
---

# NGINX-Konfiguration für YRewrite

Eine vollständige nginx config für YRewrite. Hierbei werden auch die Ordner ***/redaxo/src, /redaxo/cache und /redaxo/addons*** geschützt.
Die Direktiven wurden nicht in einer Multidomainumgebung getestet. 

> Hinweis für PLESK-Websites: Die Direktiven können unter ***Einstellungen für Apache & nginx*** der gewünschten Domain im Abschnitt ***Zusätzliche nginx-Anweisungen*** hinterlegt werden. 


	charset utf-8;

		# OPTIONAL von HTTP auf HTTPS weiterleiten, Kommentare entfernen falls nötig
		#if ($https !~ "on"){
		#	set $rule_8 1;
		#}
		#if ($rule_8 = "1"){
		#	rewrite ^(.*)$ https://$server_name$request_uri permanent;
		#}

		rewrite ^/sitemap\.xml$ /index.php?rex_yrewrite_func=sitemap last;
		rewrite ^/robots\.txt$ /index.php?rex_yrewrite_func=robots last;
		rewrite ^/download[s]?/([^/]*) /index.php?download_utility=download&file=$1 last;
		rewrite ^/media[0-9]*/imagetypes/([^/]*)/([^/]*) /index.php?rex_media_type=$1&rex_media_file=$2&$args ;
		rewrite ^/images/([^/]*)/([^/]*) /index.php?rex_media_type=$1&rex_media_file=$2&$args ;
		rewrite ^/imagetypes/([^/]*)/([^/]*) /index.php?rex_media_type=$1&rex_media_file=$2 ;
		if ($uri !~ "^redaxo/.*"){
			set $rule_6 4$rule_6;
		}
		if ($uri !~ "^media/.*"){
			set $rule_6 5$rule_6;
		}

		if (!-e $request_filename){
			rewrite "^(.*)$" /index.php?$query_string last;
		}

		#!!! WICHTIG !!! Zugriff auf alle Dateien mit . verbieten (könnte ja eine alte .htpasswd enthalten sein)
		# ACHTUNG: nicht nutzen, falls auf der selben Instanz Let's Encrypt läuft, da ansonsten .acme-challange fehlschlägt.
		# In diesem Fall bitte die nächste Zeile mit # auskommentieren
		location ~ /\. { deny  all; }

		# Zugriff auf diese Verzeichnisse verbieten
		location ^~ /redaxo/src { deny  all; }
		location ^~ /redaxo/data { deny  all; }
		location ^~ /redaxo/cache { deny  all; }
		# Ab REDAXO 5.4 muss folgende Zeile dazu
		location ^~ /redaxo/bin { deny  all; }
		

		# In einigen Fällen könnte folgende Anweisung zusätlich sinnvoll sein. 

		location ~ /\.(ttf|eot|woff|woff2)$ {
			add_header Access-Control-Allow-Origin *;
			expires 604800s;
		}
