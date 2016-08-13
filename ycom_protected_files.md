Geschütze Dateien mit YCom
=======================

Wie kann man Dateien in Verbindung mit Com einfach schützen?
Da Redaxo aktuell nur einen Medienordner hat und so von außen alle Dateien in diesem Ordner öffentlich zugänglich sind, benötigt man eine Lösung die den Dateiaufruf überprüft und entscheidet, ob es sich um eine geschützte Datei oder einer öffentlichen Datei handelt. 

Hier verwenden wir eine .htaccess Rewrite-Rule und ein Template um dies zu realisieren.  Dateien, die in einer bestimmten Hauptkategorie und deren Unterkategorien im Medienpool liegen, können so vor unerlaubten Zugriff geschützt werden. 

----------
**Achtung**
Diese Lösung schützt nur Dateien die über /media/dateiname.xyz und über /index.php?fileName=dateiname.xyz aufgerufen werden. Eine Unterscheidung nach Nutzergruppen findet nicht statt. 

----------


 1. Als erstes richten wir die Medienkategorie an.
 2. Wir merken uns die ID der Kategorie 
 3. Wir legen nachfolgendes Template an: 

		<?php
		$ycom_user = rex_ycom_auth::getUser();
		$fileName= $_REQUEST['fileName'];
		 
		if ($fileName!='')
		{
		$fileName2 = rex_media::get($fileName);
		$cat = $fileName2->getCategory();
		$filecat = $fileName2->getValue('category_id');
		$cattree = $cat->getPathAsArray();
		$parentID = $cattree[0];
		}
		// Welche Medienkategorie beinhaltet die geschützten Dateien
		// bei beiden Abfragen die ID der Kategorie eintragen 
		if ($parentID =='4' or $filecat=='4')
		{
		if ($ycom_user)
		{
		
		}
		else
		{
		// Artikel auf den umgeleitet werden soll, wenn der User nicht angemeldet ist.
		rex_redirect(98);
		exit();
		}
		}                             
		
		?>
		
		<?php 
		$filePath = rex_path::media().$fileName;
		$finfo = finfo_open(FILEINFO_MIME_TYPE);
		$fileType = finfo_file($finfo, $filePath);
		finfo_close($finfo);
		rex_response::cleanOutputBuffers();
		$file = $filePath;
		
		if (file_exists($file)) {
		    $fileType = 'application/octet-stream';
		     header('Content-Description: File Transfer');
		    header('Content-Type: application/octet-stream');
		    header("Cache-Control: private");
		    header("Pragma: no-cache");
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

Bei Verwendung von yrewrite direkt nach RewriteBase /
    
	RewriteRule ^/?media/(.*\.(pdf|xlsx|xls|docx|ppt|pptx|rar|mpp|eps|txt|rtf|pub|pubx|doc|zip))$ /index.php?fileName=$1 [L]

Hier haben wir auch festgelegt welche Dateien geschützt sein  sollen. 

Fügt man nun das Template in allen Ausgabe-Template ein, sind die Dateien geschützt. 
XX steht für die ID des Templates

REX_TEMPLATE[XX]
