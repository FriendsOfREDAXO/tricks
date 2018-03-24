# Sked - Individuelle Konfiguration

- [Einleitung](#einleitung)
- [Überschriften](#ueberschriften)
- [Links](#links)
- [Bilder](#bilder)
- [Listen](#listen)
- [Tabellen](#tabellen)
- [Code](#code)
- [Hinweise](#hinweise)
- [Anker 3](#anker-3)
    - [Anker 3a](#anker-3a)
    - [Anker 3b](#anker-3b)
    - [Anker 3c](#anker-3c)
- [Anker 4](#anker-4)

<a name="einleitung"></a>
## Einleitung

Sked, das ist das universelle und flexible Kalender AddOn für REDAXO. Bevor man sich dran macht und selber einen Kaleder programmiert, sollte man auf jeden Fall prüfen, ob sich Sked nicht vielleicht für die eigenen Bedürfnisse anpassen lässt.
Sked kann ...
- mit beliebigen Datenfeldern in den bestehenden Tabellen erweitert werden
- um weitere Tabellen ergänzt werden
- das Backend kann nach eigenen Bedürfnissen umgestaltet werden
- die Ausgabe kann über yorm Objekte und Fragmente gelöst werden

Das soll hier an einem Beispiel gezeigt werden.

Zunächst die Aufgabenbeschreibung:
Es soll ein Veranstaltungskalender für ein Museum erstellt werden. Es gibt keine von-bis-Termine sondern nur Termine an einer Startzeit. Alle Termine finden an einem Ort statt. Es gibt viele gleichartige Termine, es sollen dafür nicht jedesmal alle Angaben neu erfasst werden. Es sollen aber Varianten möglich sein.

Die Website ist 2-sprachig.

<a name="datenstruktur"></a>
## Datenstruktur

Damit die gleichartigen Termine verwaltet werden können, müssen in den Kategorien und den Veranstaltungen die jeweiligen Felder doppelt vorhanden sein. Beim Erfassen des Termins wird der Standardtext aus der Kategorie angzeigt, kann aber überschrieben werden.

Die Kategorien von Sked werden verwendet, um Veranstaltungsgruppen zu definieren. Zusätzlich soll es Veranstaltungstypen geben. Hierfür wird eine eigene yform-Tabelle angelegt.

Die Custom Definitionen liegen in `data/addons/sked/definitions`.

### custom_entries.yml

```yml
langfields:
  - name: 'subtitle'
    type: 'text'
    label_de: 'Untertitel'
    label_en: 'Subtitle'
    attribute:
      class: form-control sked_subtitle
  - name: 'subline'
    type: 'text'
    label_de: 'Subline'
    label_en: 'Subline'
    attribute:
      class: form-control sked_subline
  - panel: 'infos'
    label_de: 'Infos'
    label_en: 'Infos'
    fields:
      - name: time_text
        type: text
        label_de: Optionale Zeitangabe
        label_en: Optionale Zeitangabe        
        attribute:
          class: form-control sked_time_text
      - name: 'lang_image'
        type: 'media'
        label_de: 'Bild'
        label_en: 'Image'
      - name: info_meetingpoint
        type: text
        label_de: Treffpunkt
        label_en: Meeting point
        attribute:
          class: form-control sked_info_meetingpoint
      - name: info_duration
        type: text
        label_de: Dauer
        label_en: Duration
        attribute:
          class: form-control sked_info_duration
      - name: info_price
        type: text
        label_de: Kosten
        label_en: Price
        attribute:
          class: form-control sked_info_price
      - name: info_registration
        type: text
        label_de: Anmeldung
        label_en: Registration
        attribute:
          class: form-control sked_info_registration
      - name: info_contact
        type: text
        label_de: Kontakt
        label_en: Contact    
        attribute:
          class: form-control sked_info_contact
      - name: info_1_label
        type: text
        label_de: Info 1 Name
        label_en: Info 1 Name
        attribute:
          class: form-control sked_info_1_label
      - name: info_1_value
        type: text
        label_de: Info 1 Beschreibung
        label_en: Info 1 Description    
        attribute:
          class: form-control sked_info_1_value  
```
Das ist weitgehend selbsterklärend. Es gibt für einzelne Infoangaben (Dauer, Anmeldung, Preis, Kontakt) definierte Felder sowie ein zusätzliches frei definierbares Feld.
Die jeweiligen Klassen-Angaben werden ergänzt, um die Felder mit Placeholdern aus den Kategorien befüllen zu können.

### custom_categories.yml

```yml
langfields:
  - name: subtitle
    type: text
    label_de: Untertitel
    label_en: Subtitle
  - name: subline
    type: text
    label_de: Subline
    label_en: Subline
  - name: description
    type: textarea
    label_de: Beschreibung
    label_en: Description
    attribute:
      class: tinyMCEEditor
  - name: time_text
    type: text
    label_de: Optionale Zeitangabe
    label_en: Optionale Zeitangabe
  - name: 'lang_image'
    type: 'media'
    label_de: 'Bild'
    label_en: 'Image'
  - name: info_meetingpoint
    type: text
    label_de: Treffpunkt
    label_en: Meeting point    
  - name: info_duration
    type: text
    label_de: Dauer
    label_en: Duration
  - name: info_price
    type: text
    label_de: Kosten
    label_en: Price
  - name: info_registration
    type: text
    label_de: Anmeldung
    label_en: Registration
  - name: info_contact
    type: text
    label_de: Kontakt
    label_en: Contact    
  - name: info_1_label
    type: text
    label_de: Info 1 Name
    label_en: Info 1 Name
  - name: info_1_value
    type: text
    label_de: Info 1 Beschreibung
    label_en: Info 1 Description    

fields:
  - name: category_id
    type: selectsql
    label_de: 'Kategorie'
    label_en: 'Category'
    qry: 'SELECT id, name_1 name FROM rex_sked_event_categories ORDER BY name_1'
    attribute:
      class: selectpicker
  - name: rex_article_id
    type: link
    label_de: Artikel
    label_en: Article
```
Die Felder sind weitestgehend gleich wie bei den Einträgen. Als Editor für die Beschreibung wird der TinyMCE Editor benutzt, das AddOn muss in diesem Falle ebenfalls installiert sein.

Die Veranstaltungskategorie wird über ein `selectsql`-Feld realisiert.

## Das Backend umbauen

Das Backend wird an die eigenen Bedürfnisse angepasst.

- Die Terminwiederholungsfelder werden nicht gebraucht und einfach ausgeblendet
- Die bis-Felder werden nicht gebraucht und ausgeblendet
- Der Ort-Tab wird ausgeblendet
- verschiedene Felder werden umarrangiert

Da wir weiterhin an Sked-Updates interessiert sind, können wir natürlich nicht im AddOn selber rumschreiben. Der Einfachheit halber bedienen wir uns daher des genialen Theme-AddOns (Danke an Daniel Weitenauer!).
Wir arbeiten in der Datei `theme/public/assets/backend/backend.js`. Diese Datei wird standardmäßig im Backend geladen.

### backend.js

```js
$(function () {
    // Diese Felder werden im Termineintrag aus der Kategorie befüllt
    var sked_fill_fields = [
        'info_meetingpoint',
        'info_duration',
        'info_price',
        'info_registration',
        'info_contact',
        'info_1_label',
        'info_1_value',
        'subtitle',
        'subline',
        'time_text'
    ];
    
    function sked_init_entries_form (update_name) {
        var sked_cat_id = $('select.sked_category_select').find('option:selected').val();
        
        // Die Kategorie-Einträge werden für die Termineinträge gelesen und eingesetzt
        $.getJSON('/redaxo/index.php?sked_cat_id='+sked_cat_id, function (data) {
            $.each(sked_fill_fields, function(key,val) {
                $('#lang1 .sked_'+val).prop('placeholder',data[0][val+'_1']);                
                $('#lang2 .sked_'+val).prop('placeholder',data[0][val+'_2']);                
            });
            
            // Beschreibungstext wird unterhalb des Textfeldes angezeigt
            $('.description_master').remove();
            $('#lang1').append('<dl class="rex-form-group form-group description_master"><dt>Beschreibung (Standard)</dt><dd>'+data[0]['description_1']+'</dd></dl>');
            $('#lang2').append('<dl class="rex-form-group form-group description_master"><dt>Beschreibung (Standard)</dt><dd>'+data[0]['description_2']+'</dd></dl>');
            
            if (update_name) {
                $('#lang1 input.sked_entry_name').val(data[0].name_1);
                $('#lang2 input.sked_entry_name').val(data[0].name_2);
            }
            
            // Some Styling
            $('.sked_repeats_show + dl.rex-form-group').css('margin-top','15px'); 
        });        
    }
    
    if ($('body#rex-page-sked-entries #rex-addon-editmode').length) {
        $('.sked_clangtabs').appendTo('form#rex-addon-editmode > fieldset:first-child');
        $('.rex-form-panel-footer').appendTo('form#rex-addon-editmode > fieldset:first-child');
        
        // Subtitle an den Anfang
        $('#lang1 .sked_subtitle').parents('.rex-form-group').prependTo('#lang1');
        $('#lang2 .sked_subtitle').parents('.rex-form-group').prependTo('#lang2');
        
        // Text an den Schluss
        $('#lang1 textarea.sked_entry_text').parents('.rex-form-group').appendTo('#lang1');
        $('#lang2 textarea.sked_entry_text').parents('.rex-form-group').appendTo('#lang2');
        
        
        $('.sked_repeat_fields').hide();
        $('input#dpd2').parents('table.skeddatepicker').hide();        
        $('select.sked_venue_select').parents('.rex-form-group').hide();
        $('textarea.sked_entry_teaser').parents('.rex-form-group').hide();
        $('textarea.sked_entry_text').addClass('tinyMCEEditor');
        
        sked_init_entries_form(false);
    }
    // Der Tab Orte wird ausgeblendet
   $('.nav-tabs .item_venues').hide();
    
    
    $('body').on('change','.sked_category_select',function() {
        sked_init_entries_form(true);
    });


    
    

});
```





1. Seitenüberschrift als h1 auszeichnen
2. TOC Liste mit Anker erstellen, Die erste Ebene wird im Text mit `h2` die zweite Ebene mit `h3` ausgezeichnet

**Beispiel**

    # Seitenüberschrift
    
    - [Überschrift](#anker-zur-ueberschrift)
    - [Anker 2](#anker-2)
        - [Anker 2a](#anker2a)
    - [Anker 3](#anker-3)
        - [Anker 3a](#anker-3a)
        - [Anker 3b](#anker-3b)
        - [Anker 3c](#anker-3c)
    - [Anker 4](#anker-4)


<a name="ueberschriften"></a>
## Überschriften mit Anker setzen

**Beispiel**

    <a name="anker-zur-ueberschrift"></a>
    ## Überschrift
 
<a name="links"></a>
## Links
Links bitte immer mit Beschreibung angeben

**Beispiel**

    [REDAXO Loader - REDAXO laden und entpacken](install_redaxo_loader.md)

<a name="bilder"></a>
## Bilder
Bilder bitte im Assets-Ordner hinterlegen. 
1200px breit


<a name="listen"></a>
## Listen

**Beispiel**

    - Listenpunkt 1
    - Listenpunkt 2
    - Listenpunkt 3
    - Listenpunkt 4


<a name="tabellen"></a>
## Tabellen

**Beispiel**
```
Alt| Neu
------------- | -------------
`$REX['SERVERNAME']`  |  `rex::getServername()`
```


<a name="code"></a>
## Code
    Zur Code-Auszeichnung bitte ``` verwenden

**Beispiel Code Block**
    
        ```php 
        $article = rex_article::get();
        
        ```
        
        
**weiteres Beispiel**
        
        /**
         * Code wird einfach nur eingerückt
         *
         * @var bool
         */
        public $code = true;
   
**Beispiel Code Inline**

Code innerhalb eines Text wird `ganz normal` ausgezeichnet
 

<a name="hinweise"></a>
## Hinweise

Hinweise werden später blau unterlegt.

    > **Hinweis:** Zweitens: ich habe erklärt mit diese zwei Spieler: nach Dortmund brauchen vielleicht Halbzeit Pause. Ich habe auch andere Mannschaften gesehen in Europa nach diese Mittwoch. Ich habe gesehen auch zwei Tage die Training.

> **Hinweis:** Zweitens: ich habe erklärt mit diese zwei Spieler: nach Dortmund brauchen vielleicht Halbzeit Pause. Ich habe auch andere Mannschaften gesehen in Europa nach diese Mittwoch. Ich habe gesehen auch zwei Tage die Training.


