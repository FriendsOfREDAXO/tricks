---
title: Tagging Artikel-Metadaten mit YForm per Ajax im Artikel hinzufügen
authors: [danspringer]
prio:
---

# Inhalt

- [Einleitung](#einleitung)
- [YForm-Tabelle](#yformtabelle)
- [Metadaten](#links)
- [Ajax-Funktion](#ajax)
- [Eingabefeld per JS](#eingabe)
- [Funktionsweise](#funktion)

<a name="Einleitung"></a>
## Einleitung

![Screenshot](https://github.com/FriendsOfREDAXO/tricks/blob/12221fef91c200bc561123fb8c8fed5c24a441f5/screenshots/122577838-878d9d00-d053-11eb-9615-0981d57dff7b.gif?raw=true)

Manchmal möchte man REDAXO-Artikeln Artikel-Metadaten per Checkbox hinzufügen (z.B. für Tags, Farben, etc.). Im Beispiel möchten wir REDAXO-Artikeln verschiedene, in einer YForm-Tabelle vorgehaltene, Tags hinzufügen. Damit ein Redakteuer nun zur Ergänzung von neuen Tags seinen Workflow bei der Bearbeitung eines Artikels nicht unterbrechen muss, um neue Tags in der YForm-Tabelle anzulegen eignet sich dieser Trick. Er zeigt, wie man im Bearbeiten-Modus des REDAXO-Artikels neue Tags "on-the-fly" per Ajax anlegen kann.

![Tags per Ajax hinzufügen](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/be_yform_meta_ajax.gif "Tags per Ajax hinzufügen")


<a name="yformtabelle"></a>
## YForm-Tabelle

Über den **YForm-Tablemanager** legt man eine Tabelle mit dem Namen `rex_tags` an. Die Tabelle benötigt mindestens die Felder `id` (wird automatisch von YForm vergeben) und `tag` (als Name des Tags).

 
<a name="metadaten"></a>
## Metadaten

Damit man die Metadaten im Artikel auswählen kann, legt man im AddOn **Meta Infos** ein Metafeld `art_tags` als Checkbox an. Als Parameter trägt man folgendes ein: `SELECT tag,id FROM rex_tags`.
Jetzt stehen die Werte aus der YForm-Tabelle per Checkbox in den Metadaten eines Artikels zur Verfügung.


<a name="ajax"></a>
## Ajax

Damit man inenrhalb eines Artikels bequem neue Tags in die YForm-Tabelle speichern kann, ohne extra die Tabelle aufzurufen, wird Ajax genutzt. Hierzu legen wir updatesicher im `lib`-Verzeichnis des **Project-AddOns** `/redaxo/src/addons/project/lib` eine PHP-Datei mit dem Dateinamen `rex_api_add_tag.php` ab.

Der Inhalt dieser Datei ist wie folgt und legt einen neuen Datensatz in der YForm-Tabelle an:

```
<?php

class rex_api_add_tag extends rex_api_function
{
    protected $published = true;  

    function execute()
    {
        // Parameter abrufen und auswerten
        $tag 	= rex_request( 'tag','string','' );
		
		// Alle Parameter prüfen ob gesetzt
        if ( !$tag )
        {
            header( 'HTTP/1.1 400 Bad Request' );
            header( 'Content-Type: application/json; charset=UTF-8' );
            $result = [ 'errorcode' => 1, 'message' => 'A parameter is missing' ];
            exit( json_encode( $result ) );
        }
       
		
		//// SQL-OPTION //////			
		$sql = rex_sql::factory();
		$sql->setDebug(false);
		$sql->setTable('rex_tags');
		$sql->setValue('tag', $tag);
		$sql->insert();
		$lastId = $sql->getLastId();


        // Inhalt zusammenbauen
        $content = [ 'code' => 1, 'message' => 'success', 'dataId' => $lastId ];

        // Inhalt ausgeben
        header( 'Content-Type: application/json; charset=UTF-8' );
        exit( json_encode( $content ) );
    }
}
?>
```

<a name="eingabe"></a>
## Eingabefeld per JS

Damit in der Bearbeiten-Maske des REDAXO-Artikels auch das Eingabefeld für die neuen Tags in einem Bootstrap-Modal auftaucht, hängen wir im Backend ein kleines JavaScript ein, welches das DOM entsprechend verändert.
>Wie genau du im Backend eine JavaScript-Datei einbindest, kannst du hier nachlesen: <a href="https://www.redaxo.org/doku/main/addon-assets#einbinden">https://www.redaxo.org/doku/main/addon-assets#einbinden</a>. Empfehlenswert für die einfache Einbindung ist das Theme-AddOn.

### Der Inhalt der JS-Datei

Der JS-Code ist in diesem Beispiel auf den Metanamen `rex_tags` ausgerichtet. Wenn dein Metafeld anders heisst, musst du den JS-Code entsprechend anpassen, damit das JS den Button und das Modal, etc. entsprechend einfügen kann.
Im Beispiel hängt es an das Label von `rex-metainfo-art_tags` den entsprechenden HTML-Code.

```
$(document).on('rex:ready', function(event, container) {
    
	
	// Input-Feld
	var modalInput = '<label for="add-tag">Neues Tag anlegen</label><input type="text" class="form-control" name="add-tag" id="add-tag" placeholder="Neues Tag" />';
	
	// Ajax Funktion aufrufen
	function addMetaTag(tag) {
		//alert(tag);
		var result = '';
		$.ajax({
		   url: "/index.php?rex-api-call=add_tag&tag="+tag,
		   type: 'get',
		   beforeSend: function(){
		   		result = '<div class="alert alert-notice">Tag: <strong>' + tag + '</strong> wird hinzugefügt</div>';
		   },
		   success: function(response){
			   result = '<div class="alert alert-success">Tag: <strong>' + tag + '</strong> wurde hinzugefügt </div>';
			   // Neues Tag in die Sidebar hängen
			   console.log(response);
			   var id = response.dataId;
			   var newEl = '<div class="checkbox"><label for="rex-metainfo-art_tags-'+id+'"><input type="checkbox" name="art_tags[]" value="'+id+'" id="rex-metainfo-art_tags-'+id+'">'+tag+'</label></div>';
			   $('.metainfo-sidebar label[for="rex-metainfo-art_tags"]').closest('dl').find('dd').last('.checkbox').append(newEl);
		   },
		   error:function(response){
				result = '<div class="alert alert-danger">Tag: <strong>' + tag + '</strong> konnte nicht hinzugefügt werden</div>';
		   },
		   complete: function(response){
		   		$( "#tag-modal .modal-stage" ).html(result);
				$( "#tag-modal .modal-stage" ).append(modalInput);
		   }
		  }); // EoF Ajax
		  
		} // EoF addMetaTag
		
	
	var tagModal =
	'<div class="modal" id="tag-modal" tabindex="-1" role="dialog">' +
	  '<div class="modal-dialog" role="document">' +
		'<div class="modal-content">' +
		  '<div class="modal-header">' + 
			'<h5 class="modal-title">Neues Tag anlegen</h5>' +
			'<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
			  '<span aria-hidden="true">&times;</span>' +
			'</button>' +
		  '</div>' +
		  '<div class="modal-body">' +
		  	'<div class="modal-stage">' +
				modalInput +
		  	'</div>' + 
		  '</div>' + 
		  '<div class="modal-footer">' +
			'<button type="button" class="btn btn-primary" id="btn-add-tag">Tag hinzufügen</button>' +
			'<button type="button" class="btn btn-secondary" data-dismiss="modal">Abbrechen</button>' +
		  '</div>' +
		'</div>' + 
	  '</div>'+ 
	'</div>';
	
	// Button und Modal hinzufügen
	$('.metainfo-sidebar label[for="rex-metainfo-art_tags"]').append('<br><a href="#" class="btn btn-save" id="btn-open-tag-modal">Neues Tag anlegen</button>');
	$('#rex-js-main-sidebar').append(tagModal);
	
	// Modal öffnen
	$("#btn-open-tag-modal").on('click', function(e) {
			$('#tag-modal').modal('show');
			// Im Modal arbeiten
			$( "#btn-add-tag" ).click(function() {
			  var tag = $( "#add-tag" ).val();
			  addMetaTag(tag);
			});
			e.preventDefault();
	}); // Ende on click()
	
	
});// Ende rex ready
```

<a name="funktion"></a>
## Funktionsweise

Der obige JavaScript-Code hängt ein Modal in die Bearbeiten-Maske. Das Modal kann über den Button **Tag hinzufügen** aufgerufen werden. Wenn ein tag eingetragen wurde, wird per Ajax die PHP-Funktion `add_tag` aufgerufen, welche ein neues Tag in die YForm-Tabelle schreibt. Gleichzeitig aktualisiert das JS-Script die aktuelle Ansicht der Metadaten um das neue Tag, damit es dem Redakteur dann sofort als Checkbox zur Verfügung steht.
