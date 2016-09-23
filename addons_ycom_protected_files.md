# Geschütze Dateien mit YCom

###Wie kann man Dateien in Verbindung mit YCom (Community Addon) einfach schützen?
Da Redaxo aktuell nur einen Medienordner hat und so von außen alle Dateien in diesem Ordner öffentlich zugänglich sind, benötigt man eine Lösung, die den Dateiaufruf überprüft und entscheidet ob es sich um eine geschützte Datei oder einer öffentlichen Datei handelt. 

Hier verwenden wir eine .htaccess Rewrite-Rule und ein Template um dies zu realisieren.  Dateien, die in einer bestimmten Medienpool-Hauptkategorie und deren Unterkategorien im Medienpool liegen, können so vor unerlaubten Zugriff geschützt werden. 

----------
**Achtung**
Diese Lösung, schützt nur Dateien die über /media/dateiname.xyz und über /index.php?fileName=dateiname.xyz aufgerufen werden. Eine Ausweitung auf z.B: Mediamanager Urls ist denkbar. Eine Unterscheidung nach Nutzergruppen findet nicht statt. 

----------
Geeignet für Redaxo 5.2

1. Medienkategorie anlegen
2. ID der Kategorie merken 
3. Nachfolgendes Template anlegen (Kommentare beachten): 

		<?php
		// Welche Medienkategorie beinhaltet die geschützten Dateien? (Medienpool-Kategorie-ID)
		$mediacatID = '4';
		// Wohin soll bei einem unberechtigten Zugriff umgeleitet werden? (Artikel ID) 
		$redirectArticle = '99'; 
		
		$ycom_user = rex_ycom_auth::getUser();
		// Auslesen des Dateinamens mit rex_get
		$fileName = rex_get('fileName', 'string');
		
		if ($fileName!='')
		{
			// Datensatz auslesen und Eigenschaften ermitteln
			$fileInfo = rex_media::get($fileName);
			// Aktuelle Medienkategorie ermitteln
			$cat = $fileInfo->getCategory();
			// ID der Medienkategorie ermitteln
			$filecat = $fileInfo->getValue('category_id');
		        
		        // Wenn Datei in "Keine Kategorie" abgelegt ist. 
			 if ($filecat == 0) 
			    {
			    	$parentID = 0;
			    }
			// Sonst: Hauptkategorie ermitteln, hierzu wird der aktuelle Pfad ausgelesen. 
			    else
			    { 
			  
				    $cattree = $cat->getPathAsArray();
				    $parentID = $cattree[0];
			    }
		
		
		
		if ($parentID ==$mediacatID or $filecat==$mediacatID)
		{
			if ($ycom_user)
			{
			// Dinge die passieren könnten wenn jemand eingeloggt ist. 
			}
		else
			{
			// Umleitung auf die Fehlerseite
			rex_redirect($redirectArticle);
			exit();
			}
		}                             
		// Redaxo Outputbuffer löschen
		rex_response::cleanOutputBuffers();

		// Ausgabe des Mediums
		$file = rex_path::media().$fileName;
		if (file_exists($file)) {
		    $fileType = 'application/octet-stream';
		    header('Content-Description: File Transfer');
		    header('Content-Type: application/octet-stream');
		    header("Cache-Control: private");
		    header("Pragma: no-cache");
		    // Download erzwingen
		    header('Content-Disposition: attachment; filename="'.basename($file).'"');
		    header("Expires: Mon, 01 Jan 2000 05:00:00 GMT"); // Date in the past
		    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");// always modified
		    header('Cache-Control: must-revalidate');
		    header('Pragma: public');
		    header('Content-Length: ' . filesize($file));
		    readfile($file);
		    exit();
		}
		}	
		?>

**Jetzt muss die .htaccess-Datei ergänzt werden**

Bei Verwendung von yrewrite direkt nach `RewriteBase /`
    
	RewriteRule ^/?media/(.*\.(pdf|doc|zip))$ /index.php?fileName=$1 [L]

Hier wurde festgelegt welche Dateien geschützt sein sollen.
Weitere Endungen können beliebig hinzugefügt werden z.B:  |eps|pptx|docx …


Fügt man nun das Template in allen Ausgabe-Templates **am Anfang** ein, sind die Dateien geschützt. 
XX steht für die ID des Templates
REX_TEMPLATE[XX]


----------
**Achtung!** Vor dem Template darf auf keinem Fall eine Ausgabe von Inhalten erfolgen.
Bei Problemen bitte unbedingt prüfen ob sich Leerzeichen / -zeilen vor und nach dem Template eingeschlichen haben.  

