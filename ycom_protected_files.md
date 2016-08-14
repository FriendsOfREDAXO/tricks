# Geschütze Dateien mit YCom

Wie kann man Dateien in Verbindung mit YCom (Community Addon) einfach schützen?
Da Redaxo aktuell nur einen Medienordner hat und so von außen alle Dateien in diesem Ordner öffentlich zugänglich sind, benötigt man eine Lösung die den Dateiaufruf überprüft und entscheidet, ob es sich um eine geschützte Datei oder einer öffentlichen Datei handelt. 

Hier verwenden wir eine .htaccess Rewrite-Rule und ein Template um dies zu realisieren.  Dateien, die in einer bestimmten Hauptkategorie und deren Unterkategorien im Medienpool liegen, können so vor unerlaubten Zugriff geschützt werden. 

----------
**Achtung**
Diese Lösung, schützt nur Dateien die über /media/dateiname.xyz und über /index.php?fileName=dateiname.xyz aufgerufen werden. Eine Ausweitung auf z.B: Mediamanager Urls ist denkbar. Eine Unterscheidung nach Nutzergruppen findet nicht statt. 

----------


1. Medienkategorie anlegen
2. ID der Kategorie merken 
3. Nachfolgendes Template anlegen (Kommentare beachten): 

		<?php
		$ycom_user = rex_ycom_auth::getUser();
		$fileName= $_REQUEST['fileName'];
		// Redaxo Outputbuffer löschen
		rex_response::cleanOutputBuffers();
		 
		if ($fileName!='')
		{
			// Datensatz auslesen und Eigenschaften ermitteln
			$fileInfo = rex_media::get($fileName);
			// Aktuelle Medienkategorie ermitteln
			$cat = $fileName2->getCategory();
			// ID der Medienkategorie ermitteln
			$filecat = $fileInfo->getValue('category_id');
			// Hauptkategorie ermitteln, hierzu wird der aktuelle Pfad ausgelesen.
			$cattree = $cat->getPathAsArray();
			$parentID = $cattree[0];
		}
		// Welche Medienkategorie beinhaltet die geschützten Dateien
		// bei beiden Abfragen die ID der Kategorie eintragen 
		if ($parentID =='4' or $filecat=='4')
		{
			if ($ycom_user)
			{
			// Dinge die passieren könnten wenn jemand eingeloggt ist. 
			}
		else
			{
			// Artikel-ID auf den umgeleitet werden soll, wenn der User nicht angemeldet ist.
			rex_redirect(98);
			exit();
			}
		}                             
		
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
		    exit;
		}
		
		?>

**Jetzt muss die .htaccess-Datei ergänzt werden**

Bei Verwendung von yrewrite direkt nach `RewriteBase /`
    
	RewriteRule ^/?media/(.*\.(pdf|doc|zip))$ /index.php?fileName=$1 [L]

Hier wurde festgelegt welche Dateien geschützt sein sollen.
Weitere Endungen können beliebig hinzugefügt werden z.B:  |eps|pptx|docx …

Fügt man nun das Template in allen Ausgabe-Templates am Anfang ein, sind die Dateien geschützt. 
XX steht für die ID des Templates

REX_TEMPLATE[XX]
