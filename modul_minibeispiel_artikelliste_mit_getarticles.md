# Modul Minibeispiel - Einfache Artikelliste mit getArticles

- [Beschreibung](#beschreibung)
- [Moduleingabe](#moduleingabe)
- [Modulausgabe](#modulausgabe)

<a name="beschreibung"></a>
## Beschreibung

Dieses Modul erstellt eine eine Artikelliste der aktuellen Kategorie. Es wird überprüft ob die Artikel online geschaltet ist und ob es sich beim Artikel um einen Startartikel handelt. 

<a name="moduleingabe"></a>
## Moduleingabe

	<div class="panel panel-primary">
		<div class="panel-heading"><i class="fa fa-question-circle" aria-hidden="true"></i> Artikelliste</div>
		<div class="panel-body">
		 Erstellt eine Liste aller Artikel dieser Ebene. Der Aktuelle Artikel, Offline-Artikel und der Startartikel werden ausgeblendet.
		</div>
	</div>


<a name="modulausgabe"></a>
## Modulausgabe

An die aktuelle Kategorie gelangen wir mit `rex_category::getCurrent()`.
Mit `->getArticles()`werden die Artikel der aktuellen Kategorie ausgelesen. 
Kombiniert: `rex_category::getCurrent()->getArticles();`. 

In einer foreach-Schleife werden die einzelnen Artikel abgearbeitet und deren Eigenschaften (z.B. Metadaten) ausgelesen. 

Hier erstellen wir eine UL-LI-Liste (unordered List) als Ausgabe. Die einzelnen Listenpunkte werden in der Variable $artOutput zwischengespeichert und später ausgegeben. 
So ist es später einfach einen eigenen Wrapper oder andere Formatierungen anzuwenden. 

	<?php 
	$articleId = $articleName =  $artOutput = "";  
	
	// Aktuelle Kategorie ermitteln und Artikel auslesen
	$articles = rex_category::getCurrent()->getArticles();
	
	// Prüfen ob das Ergebnis gefüllt ist
	if ( is_array( $articles) && count( $articles) > 0) 
	{
	 // Einzelne Artikel auslesen
	 foreach ( $articles as $article )
	 {
	   
	   if ($article->isOnline())
	   {
	    // Überspringen wenn aktueller Artikel gefunden. 
	    if ( $article->getId() == 'REX_ARTICLE_ID') continue; 
	    
	    // Überspringen wenn Startartikel gefunden 
	    if ( $article->isStartArticle()) continue;
	
	    // ID des Artikels ermitteln
	    $articleId = $article->getId();
	    
	    // Name des Artikels ermitteln
	    $articleName = $article->getName();
	    
	    // Weitere Daten  der Metainfos können wie folgt abgerufen werden:     
	    // Beispiel für eine Meta-Info art_file
	    // $articleImage = $article->getValue("art_Image");
	    
	    // Ausgabe erstellen 
	    $artOutput .= '<li><a href="'.rex_getUrl($articleId).'">'.$articleName.'<a></li>'."\n"; 
	   }
	
	 }
	// Ausgabe 
	 echo '<ul class="catlist">'.$artOutput.'</ul>';
	 unset ($articles);
	}
	?>
