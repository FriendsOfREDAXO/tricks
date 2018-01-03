# Geschütze Dateien mit YCom

Benötigte AddOns: 
- YRewrite
- YCom

### Wie kann man Dateien in Verbindung mit YCom (Community Addon) einfach schützen?
Da Redaxo aktuell nur einen Medienordner hat und so von außen alle Dateien in diesem Ordner öffentlich zugänglich sind, benötigt man eine Lösung, die den Dateiaufruf überprüft und entscheidet ob es sich um eine geschützte Datei oder einer öffentlichen Datei handelt. 

Hier verwenden wir eine Rewrite-Direktive und ein Template um es zu realisieren.  Dateien, die in einer festgelegten Medienpool-**Hauptkategorie** und deren Unterkategorien im Medienpool liegen, können so vor unerlaubtem Zugriff geschützt werden. 

----------
**Achtung**
Diese Lösung, schützt nur Dateien die über /media/dateiname.xyz und über /index.php?fileName=dateiname.xyz aufgerufen werden. Eine Ausweitung auf z.B: Mediamanager Urls ist über einen entsprechenden Effekt denkbar. Eine Unterscheidung nach Nutzergruppen findet nicht statt. Es wird nur überprüft ob der User in YCOM eingeloggt ist. 

----------
Geeignet für Redaxo ab 5.2

1. Medienkategorie erster Ebene anlegen
2. ID der Kategorie merken 
3. Nachfolgendes Template anlegen (Kommentare beachten): 

```php
<?php
    // Prüfe ob eine Datei übergeben wurde
	if (rex_get('fileName', 'string')!='')
    {
		
		// Welche Medienkategorie beinhaltet die geschützten Dateien? (Medienpool-Kategorie-ID)
		
		$mediacatID = '4';
		
		// Wohin soll bei einem unberechtigten Zugriff umgeleitet werden? (Artikel ID)
		
		$redirectArticle = '99';
		$ycom_user = rex_ycom_auth::getUser();
		
		// Auslesen des Dateinamens mit rex_get
		
		$fileName = rex_get('fileName', 'string');
		
		// Was passiert, wenn Datei nicht existiert?
		
		if (!file_exists(rex_path::media($fileName)))
			{
		
			// Weiterleitung zum $redirectArticle
		
			rex_redirect($redirectArticle);
			}
		  else
			{
		
			// nicht ändern
		
			$parentID = 0;
		
			// Datensatz auslesen und Eigenschaften ermitteln
		
			$fileInfo = rex_media::get($fileName);
		
			// Aktuelle Medienkategorie ermitteln
		
			$cat = $fileInfo->getCategory();
		
			// ID der Medienkategorie ermitteln
		
			$filecat = $fileInfo->getValue('category_id');
		
			// Wenn die ermittelte Kategorie nicht gleich "keine Kategorie" ist
		
			if ($filecat != 0)
				{
				$cattree = $cat->getPathAsArray();
				$parentID = $cattree[0];
				}
		
			// Überprüfe ob sich die Datei in einer geschützten Kategorie befindet
		
			if ($parentID == $mediacatID or $filecat == $mediacatID)
				{
		
				// Prüfe ob User eingeloggt
		
				if ($ycom_user)
					{
		
					// Dinge die passieren könnten wenn jemand eingeloggt ist.
		
					}
				  else
					{
		
					// Umleitung auf die Fehlerseite
		
					rex_redirect($redirectArticle);
					}
				}
		
			// Ausgabe des Mediums
		
			$file = rex_path::media() . $fileName;
			$contenttype = 'application/octet-stream';
		
			// soll kein Download erzwungen werden, ändere attachment in inline
		
			rex_response::sendFile($file, $contenttype, $contentDisposition = 'attachment');
			}
		}
?>
```

**Jetzt müssen Rewrite-Direktiven ergänzt werden**

APACHE in die .htacces von YRewrite:

> Bei Verwendung von yrewrite direkt nach `RewriteRule ^imagetypes/…`
    
	RewriteRule ^/?media/(.*\.(pdf|doc|zip))$ /index.php?fileName=$1 [L]

NGINX Direktive:

	location / {
	rewrite ^/?media/(.*\.(pdf|doc|zip))$ /index.php?fileName=$1 break;
	}

Hier wurde festgelegt welche Dateien geschützt sein sollen.
Weitere Endungen können beliebig hinzugefügt werden z.B:  |eps|pptx|docx …


Wenn man nachfolgenden Code in allen Ausgabe-Templates **am Anfang** einfügt, sind die Dateien geschützt. 
XX steht für die ID des Templates

	REX_TEMPLATE[XX]


----------
**Achtung!** Vor dem Template darf auf keinen Fall eine Ausgabe von Inhalten erfolgen.
Bei Problemen bitte unbedingt prüfen ob sich Leerzeichen / -zeilen vor und nach dem Template eingeschlichen haben.  

