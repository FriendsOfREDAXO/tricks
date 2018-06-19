---
title: "Minibeispiel: Interne Linkliste mit REX_LINKLIST"
authors: []
prio:
---

# Minibeispiel: Interne Linkliste mit REX_LINKLIST

- [Beschreibung](#beschreibung)
- [Moduleingabe](#moduleingabe)
- [Modulausgabe](#modulausgabe)

<a name="beschreibung"></a>
## Beschreibung

Einzelne Artikel können durch den Redakteur ausgewählt werden und so als Liste ausgegeben werden. 

Das Modul erstellt ein Bootstrap-Panel mit einer Artikelliste. 

<a name="moduleingabe"></a>
## Moduleingabe

	<fieldset class="form-horizontal">
	  <div class="form-group">
	        <label class="col-sm-2 control-label">Interne Links</label>
	        <div class="col-sm-10">
	            REX_LINKLIST[id="1" widget="1"]
	        </div>
	  </div>
	</fieldset>

In der REX_Linklist werden die Werte (Artikel-IDs) kommasepariert gespeichert. 

<a name="modulausgabe"></a>
## Modulausgabe

In der Modulausgabe werden die Werte mitels explode (http://php.net/manual/de/function.explode.php) in einer foreach-Schleife ausgelesen.
Anhand der ID holt man sich den Datensatz des Artikels. Wenn nur ein Link erzeugt werden soll, bietet sich die direkte Umwandlung des Datensatzes in einen Link mittels `->toLink()` an. 


	<div class="panel panel-default">
		<div class="panel-heading"><i class="fa fa-paperclip"></i> Linkliste</div>
		<div class="panel-body">
			<div class="body-wrapper">
	<?php
	if ("REX_LINKIST[1]" != "")
	{
	  $menu = array();
		foreach(explode(',', 'REX_LINKLIST[1]') as $articleId)
		{
		    // Artikeldatensatz auslesen
		    $article = rex_article::get($articleId);
		    if ($article)
		    {
			// Erstelle Link aus aktuellem Artikel
			$menu[$articleId] = $article->toLink();
		    }
		    
		}
		// Ausgabe mit implode: http://php.net/manual/de/function.implode.php
		if (! empty($menu))
		{
		   echo '<ul><li>', implode('</li><li>', $menu), '</li></ul>';
		}
	}
	
	?>
			</div>
		</div>
	</div>

