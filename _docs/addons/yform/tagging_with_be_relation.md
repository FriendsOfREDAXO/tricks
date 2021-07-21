---
title: Tagging in YForm per AJAX und select2 
authors: [dtpop]
prio:
---

# Datensatz-Tagging in YForm per AJAX und select2

- [Einleitung](#einleitung)
- [YForm-Tabellen](#yformtabellen)
- [Ajax-Funktion](#ajax)
- [Eingabefeld per JS](#eingabe)
- [Funktionsweise](#funktion)

<a name="Einleitung"></a>
## Einleitung

![Screenshot](https://github.com/FriendsOfREDAXO/tricks/blob/3bacb1d899836fd764e54e1753283a2015110158/screenshots/yform_tagging_be-relation.gif?raw=true)

Die Umsetzung dieser Tagging Funktion basiert maßgeblich auf dem Trick des Taggings in einem Meta-Info Feld (siehe hier: https://friendsofredaxo.github.io/tricks/addons/structure/be_yform_meta_ajax)

Dieses Tagging setzt auf das im Tools Plugin von yform enthaltenen select2 und einer be-relation Tabelle. Die Funktionsweise ist allerdings ziemlich gleich. Man kann innerhalb des Tag-Feldes sowohl aus vorhandenen Tags auswählen als auch direkt neue Tags anlegen.

<a name="yformtabellen"></a>
## YForm-Tabellen

Über den **YForm-Tablemanager** legt man eine Tabelle mit dem Namen `rex_tags` an. Die Tabelle benötigt mindestens die Felder `id` (wird automatisch von YForm vergeben) und `tag_1` (als Name für den Tag in der Basissprache).
So ist man flexibel und kann später noch tag_2 ... tag_n für weitere Sprachen anlegen.

In der Tabelle, in der die Tags zugeordnet werden sollen, legt man ein be-relation Feld an, gibt als Wert das Feld `tag_1` an und gibt diesem Feld eine eindeutige Id (Individuelle Attribute: `{"id":"tagselect2"}`). Die Mehrfachauswahl wird auf `select (multiple)` eingestellt.

 
<a name="ajax"></a>
## Ajax

Damit man inenrhalb des Tag-Feldes bequem neue Tags in die YForm-Tabelle speichern kann, ohne extra die Tabelle aufzurufen, wird Ajax genutzt. Wenn das Theme Addon verwendet wird (empfehlenswert), legen wir im Verzeichnis `/theme/private/lib` eine PHP-Datei mit dem Dateinamen `rex_api_new_tag.php` ab.

Der Inhalt dieser Datei ist wie folgt und legt einen neuen Datensatz in der YForm-Tabelle an, wenn der Tag dort noch nicht enthalten ist:

```php
<?php
// Der Code wurde hauptsächlich aus diesem Trick übernommen
// https://friendsofredaxo.github.io/tricks/addons/structure/be_yform_meta_ajax

class rex_api_new_tag extends rex_api_function
{
    protected $published = true;

    function execute()
    {
        $tag_table = 'rex_tags';  // Hier den Namen der Tag-Tabelle eintragen!
        // Parameter abrufen und auswerten
        $tag 	= rex_request( 'tag','string','' );
        $code = 0; // 1 = eingefügt, 2 = gefunden

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
		$sql->setTable($tag_table);
        $sql->setWhere('tag_1 = :tag',['tag'=>$tag]);
        $sql->select();
        $res = $sql->getArray();

        // Hier wird unterschieden, ob es den gesuchten Tag bereits gibt.        
        if ($res) {
            // wenn er bereits vorhanden ist, wird die passende Id und der code=2 zurückgegeben
            $lastId = $res[0]['id'];
            $code = 2;
        } else {
            // wenn nicht, wird er neu angelegt, die Id und der code = 1
            $sql->setTable($tag_table);
            $sql->setValue('tag_1', $tag);
            $sql->insert();
            $lastId = $sql->getLastId();
            $code = 1;
        }

        // Inhalt zusammenbauen
        $content = [ 'code' => $code, 'message' => 'success', 'dataId' => $lastId ];

        // Inhalt ausgeben
        header( 'Content-Type: application/json; charset=UTF-8' );
        exit( json_encode( $content ) );
    }
}

?>
```

<a name="js"></a>
## Eingabefeld per JS

### Der Inhalt der JS-Datei

Der Javascript Code wird sinnvollerweise z.B. in `/theme/public/assets/backend/backend.js` abgelegt, wenn das Theme AddOn verwendet wird (empfehlenswert!). In den Einstellungen des AddOns muss dann der Haken bei JS/CSS-Dateien im Backend laden gesetzt sein. Beim Code habe ich mich auch an dem Code des erwähnten Tricks orientiert.

```js
$(document).on("rex:ready", function (event, container) {
    // Hier wird das select2 auf #tagselect2 angewendet.
    $("#tagselect2").select2({
        tags: true,
        multiple: true,
    });

    $("#tagselect2").on("select2:select", function (e) {
        var data = e.params.data;
        // Der Nachrichtenblock wird zunächst entfernt, falls vorhanden
        $('.tag-info-block').remove();
        // Wenn die Id gleich ist wie der eingegebene Text, wird das gerade hinzugefügte Element zunächst wieder entfernt und die Ajax Funktion ausgeführt
        if (data.id == data.text) {
            $('#tagselect2 option[value="' + data.text + '"]').detach();
            addNewTag(data.text);
        }
    });

    // Ajax Funktion aufrufen
    function addNewTag(tag) {
        // Der Nachrichtenblock wird hier definiert
        var added_text = '<p class="help-block tag-info-block">Tag <strong>'+tag+'</strong> wurde der Datenbank hinzugefügt.</p>';
        // Der code wird zur Steuerung verwendet, ob das hinzugefügte Element in der db ist oder nicht.
        var code = 0;
        $.ajax({
            // Aufruf der Ajax Funktion
            url: "/index.php?rex-api-call=new_tag&tag=" + tag,
            type: "get",
            success: function (response) {
                // Strato lieferte einen String, auf meiner dev habe ich gleich das Objekt bekommen.
                if (typeof response == 'string') {
                    response = JSON.parse(response);
                }
                var id = response.dataId;
                var data = {
                    id: id,
                    text: tag,
                };
                code = response.code;
                if (code == 1) {
                    // Wenn der Tag neu in die Datenbank eingetragen wurde (code = 1) wird dem Select eine neue Option mit selected=true hinzugefügt und change getriggert.
                    var newOption = new Option(data.text+' [id='+data.id+']', data.id, false, true);
                    $("#tagselect2").append(newOption).trigger("change");
                } else if (code == 2) {
                    // Wenn der Tag in der db gefunden wurde, wird die entsprechende Option auf selected gesetzt und change getriggert.
                    $('#tagselect2 option[value="'+data.id+'"]').prop('selected',true);
                    $("#tagselect2").trigger("change");
                }
            },
            error: function (response) {},
            complete: function (response) {
                // Wenn der Tag neu in die Datenbank eingetragen wurde, wird eine entsprechende Meldung unter dem Select angezeigt.
                if (code == 1) {
                    $('#tagselect2').parent().append(added_text);
                }
            },
        }); // EoF Ajax
    } // EoF addNewTag
}); // Ende rex ready
```

<a name="funktion"></a>
## Funktionsweise

Wenn man nun aus der Tabelle, in der die Tags verwendet werden sollen einen Datensatz aufruft, kann man im Feld Tags anfangen zu tippen. select2 sucht dann in den bereits definierten Options nach passenden Tags. Die Tags werden per Wildcard gefiltert. Eine Eigenheit von select2 ist, dass es einen eingetippten Tag stets als neuen Tag behandelt. Deswegen unterscheidet die api Funktion, ob ein Tag in der db gefunden wurde oder nicht. Man kann also sowohl eintippen und bestätigen oder aus den Optionen auswählen. Beides funktioniert korrekt. Wenn ein Tag nicht in der Datenbank gefunden wurde, so wird er eingetragen und eine entsprechende Meldung unterhalb des Selectfeldes angezeigt.
