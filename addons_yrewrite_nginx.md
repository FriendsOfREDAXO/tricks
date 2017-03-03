# NGINX Konfiguration für YRewrite

Eine vollständige nginx config für YRewrite. Hierbei werden auch die Ordner ***/redaxo/src, /redaxo/cache und /redaxo/addons*** geschützt.


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
		location ~ /\. { deny  all; }

		# Zugriff auf diese Verzeichnisse verbieten
		location ^~ /redaxo/src { deny  all; }
		location ^~ /redaxo/data { deny  all; }
		location ^~ /redaxo/cache { deny  all; }```
