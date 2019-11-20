---
title: NGINX-Konfiguration für YRewrite
authors: [skerbis,hirbod]
prio:
---

# NGINX-Konfiguration für YRewrite

Eine vollständige nginx config für YRewrite. Hierbei werden auch die Ordner `/redaxo/src`, `/redaxo/cache` und `/redaxo/addons` geschützt. Die Direktiven wurden nicht in einer Multidomainumgebung getestet. 

> Hinweis für PLESK-Websites: Die Direktiven können unter ***Einstellungen für Apache & nginx*** der gewünschten Domain im Abschnitt ***Zusätzliche nginx-Anweisungen*** hinterlegt werden. 

```nginx
charset utf-8;

location / {
  try_files $uri $uri/ /index.php$is_args$args;
}

rewrite ^/sitemap\.xml$                           /index.php?rex_yrewrite_func=sitemap last;
rewrite ^/robots\.txt$                            /index.php?rex_yrewrite_func=robots last;
rewrite ^/media[0-9]*/imagetypes/([^/]*)/([^/]*)  /index.php?rex_media_type=$1&rex_media_file=$2&$args;
rewrite ^/images/([^/]*)/([^/]*)                  /index.php?rex_media_type=$1&rex_media_file=$2&$args;
rewrite ^/imagetypes/([^/]*)/([^/]*)              /index.php?rex_media_type=$1&rex_media_file=$2;

if ($uri !~ "^redaxo/.*") {
  set $rule_6 4$rule_6;
}

if ($uri !~ "^media/.*"){
  set $rule_6 5$rule_6;
}


#!!! WICHTIG !!! Falls Let's Encrypt fehlschlägt, diese Zeile auskommentieren (sollte jedoch funktionieren)
location ~ /\. { deny  all; }

# Zugriff auf diese Verzeichnisse verbieten
location ^~ /redaxo/src { deny  all; }
location ^~ /redaxo/data { deny  all; }
location ^~ /redaxo/cache { deny  all; }
location ^~ /redaxo/bin { deny  all; }


# In einigen Fällen könnte folgende Anweisung zusätlich sinnvoll sein.

location ~ /\.(ttf|eot|woff|woff2)$ {
  add_header Access-Control-Allow-Origin *;
  expires 604800s;
}
```
