---
title: "Slice einbinden mit rex_article_slice"
authors: [skerbis]
prio:
---

# Slice einbinden mit `rex_article_slice`

Manchmal benötigt man eine Information, die bereits in einem Artikel eingepflegt ist. Natürlich kann man diese kopieren oder doppelt pflegen, was jedoch dazu führen kann, dass diese Informationen nicht immer auf dem aktuellen  Stand sind. Eine Lösung hierfür ist die Einbindung zentral gepflegter Artikel oder Tabellendaten. Eine andere ist die Einbindung eines Slices. 

Mit diesem Modul bindet man einen ausgewählen Slice eines anderen Artikels ein oder bei Bedarf einen ganzen Artikel. Das Modul basiert auf das Slice-HiJacker-Modul von Mirco Brandes/Gerald Rusche für REDAXO 4.x.
Es wird zusätzlich eine Presave-Aktion benötigt. 

## Moduleingabe

```php
<?php
//------------------------------------------------------------------------------------------
// Ursprung: Slice-HiJacker für Redaxo 4.3.2
// von: Mirco Brandes/Gerald Rusche GERUWEB
// Umsetzung für REDAXO 5: Thomas Skerbis
//-------------------------------------------------------------------------------------------
?>
<div class="alert alert-dismissible alert-info"> Mit diesem Block können Sie Inhalte anderer Artikel veröffentlichen bzw. einbinden. Bitte beachten Sie: Wenn das Original gelöscht wird wirkt sich dies auch auf den Inhalt des Artikels, in dem der Inhalt eingebunden ist, aus. Es wird keine Kopie erstellt. Die Daten sind miteinander verknüpft. Wird im Original was verändert sieht man die Änderung auch an dieser Stelle. </div>
<input type="hidden" name="REX_INPUT_VALUE[2]" value="0" />
<div class="form-horizontal">
    <div class="form-group">
        <label class="col-sm-2 control-label">Artikel ausw&auml;hlen</label>
        <div class="col-sm-10">
            REX_LINK[id=1 widget=1]
        </div>
     </div>
</div>
<?php
if( "REX_LINK[id=1 output=id]" == "" )
{
  echo "Kein Artikel ausgewaehlt";
}
else if ( "REX_LINK[id=1 output=id]" == $this->getValue("article_id") )
{
  echo "Der ausgewaehlte Artikel muss ein anderer sein, als der aktuelle !!!";
}
else
{
  // Radio-Button - kompletten Artikel einbinden ???
  echo '<div class="form-horizontal">';
    print "<input ";
  if("REX_VALUE[2]" == "kompletter_artikel") print "checked";
  print " type='radio'  name='REX_INPUT_VALUE[2]' id='kompletter_artikel' value='kompletter_artikel' /> Artikel komplett einbinden ?";
echo '</div>';

  // Alle Slice/Bloecke anzeigen
  print "<h2>Slice/Block auswählen:</h2>"; 

  $article_id = "REX_LINK[id=1 output=id]"; 
  $clang = rex_clang::getCurrentId(); 

  // Den ersten Slice/Block des Artikelt holen
  $slice = rex_article_slice::getFirstSliceForArticle($article_id, $clang); 
	
  do
  {
    // Slice-ID zwischenspeichern
    $slice_id = $slice->getId(); 

    // Radio-Button zur Auswahl
print "<div style='background-color: #fff ;border: 1px solid #333; display:block; width: 100%; padding: 5px; margin: 10px;'>"; 
        echo '<div class="form-horizontal">';
print "<input ";
    if("REX_VALUE[2]" == $slice_id) print "checked";
    print " type='radio'  name='REX_INPUT_VALUE[2]' id='".$slice_id."' value='".$slice_id."' /> (Slice-ID: ". $slice_id .")</div><hr/>";
    // Den Slice/Block ausgeben
    print $slice->getSlice() ."<div style='display:block;clear:both;'></div></div>";
		

  } while (($slice = $slice->getNextSlice()) !== null);
}
```

## Modulausgabe

```php
<?php 
if( "REX_VALUE[2]" != "" )
{
  // Im Backend den Link zur Quelle anzeigen
  if(rex::isBackend())
  {
    $master = rex_article::get(REX_LINK[id=1 output=id]);
    print '<div class="alert alert-dismissible alert-info">
	<strong>Eingebundener Inhalt aus: </strong> <a type="button" class="btn btn-primary" href="index.php?page=content&article_id=REX_LINK[id=1 output=id]&mode=edit&clang=1">';
    print $master->getName().'</a></div>';
  }

  
  if ( "REX_VALUE[2]" == "kompletter_artikel" ) 
  {
    // kompletten Artikel einbinden
      
    $art = rex_article::get('REX_LINK[id=1]'); 
  
          // Artikelinhalt auslesen inkl. aktuelle Sprache    
          $article = new rex_article_content($art->getId(), $art->getClang());  
    echo $article->getArticle(1);
  }
  else
  {
    // Den Slice/Block laden und anzeigen
    if (rex_article_slice::getArticleSliceById( "REX_VALUE[2]" ))
    {
    $slice = rex_article_slice::getArticleSliceById( "REX_VALUE[2]" ); 
    print $slice->getSlice();
    }
  }
}
else
{
  // Im Backend kurzen (Fehler-)Text ausgeben
  if(rex::isBackend())
{
    print "<p>Noch keinen Slice/Block ausgew&auml;hlt.</p>";
  }
}
```


## Aktion

```php
<?php
if ($this->getValue(2) == '0') {
   // Der Block wird nicht gespeichert
   $this->save = false;
   // Meldung ausgeben
   $this->messages[] = 'Bitte noch einen Slice/Block auswaehlen';   
}
```

