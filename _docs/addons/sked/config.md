---
title: Individuelle Konfiguration
authors: [dtpop]
prio:
---

# Sked - Individuelle Konfiguration

- [Einleitung](#einleitung)
- [Datenstruktur](#datenstruktur)
    - [custom_entries.yml](#custom_entries)
    - [custom_categories.yml](#custom_categories)
- [Das Backend umbauen](#backend)
    - [backend.js](#backend-js)
- [Ajax](#ajax)
    - [boot.php](#boot)
- [YForm](#yform)
- [Frontend](#frontend)
    - [functions.php](#functions)
    - [my_sked.php](#mysked)
- [Modul](#modul)
- [Fragment](#fragment)
- [Credits](#credits)

<a name="einleitung"></a>
## Einleitung

Sked, das ist das universelle und flexible Kalender AddOn für REDAXO. Bevor man sich dran macht und selber einen Kalender programmiert, sollte man auf jeden Fall prüfen, ob sich Sked nicht vielleicht für die eigenen Bedürfnisse anpassen lässt.
Sked kann...

- mit beliebigen Datenfeldern in den bestehenden Tabellen erweitert werden
- um weitere Tabellen ergänzt werden
- das Backend kann nach eigenen Bedürfnissen umgestaltet werden
- die Ausgabe kann über yorm Objekte und Fragmente gelöst werden

Das soll hier an einem Beispiel gezeigt werden.

Zunächst die Aufgabenbeschreibung:  
Es soll ein Veranstaltungskalender für ein Museum erstellt werden. Es gibt keine von-bis-Termine sondern nur Termine an einer Startzeit. Alle Termine finden an einem Ort statt. Es gibt viele gleichartige Termine, es sollen dafür nicht jedesmal alle Angaben neu erfasst werden. Es sollen aber Varianten möglich sein.

Die Website ist 2-sprachig.

Die in dieser Konfiguration verwendeten AddOns sind:

- Sked
- yform
- theme
- TinyMCE

<a name="datenstruktur"></a>
## Datenstruktur

Damit die gleichartigen Termine verwaltet werden können, müssen in den Kategorien und den Veranstaltungen die jeweiligen Felder doppelt vorhanden sein. Beim Erfassen des Termins wird der Standardtext aus der Kategorie angzeigt, kann aber im Termin überschrieben werden.

Die Kategorien von Sked werden verwendet, um Veranstaltungsgruppen zu definieren. Zusätzlich soll es Veranstaltungstypen geben. Hierfür wird eine eigene yform-Tabelle angelegt.

Die Custom Definitionen liegen in `data/addons/sked/definitions`.

<a name="custom_entries"></a>
### custom_entries.yml

```yaml
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
Die jeweiligen Klassen-Angaben (`class`) werden ergänzt, um die Felder mit Placeholdern aus den Kategorien befüllen zu können.
Das schöne an der yml-Konfiguration ist, dass man diese Dateien einfach bearbeiten kann. Beim nächsten Aufruf prüft Sked selbständig, ob die Felder in der Datenbank vorhanden sind und legt gegebenenfalls neue Felder an. Die Felder werden aber nicht gelöscht, wenn die Definition in der yml-Datei gelöscht wird.

<a name="custom_categories"></a>
### custom_categories.yml

```yaml
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

<a name="backend"></a>
## Das Backend umbauen

Das Backend wird an die eigenen Bedürfnisse angepasst.

- Die Terminwiederholungsfelder werden nicht gebraucht und einfach ausgeblendet
- Die bis-Felder werden nicht gebraucht und ausgeblendet
- Der Ort-Tab wird ausgeblendet
- verschiedene Felder werden umarrangiert

Da wir weiterhin an Sked-Updates interessiert sind, können wir natürlich nicht im AddOn selber rumschreiben. Der Einfachheit halber bedienen wir uns daher des genialen Theme-AddOns (Danke an Daniel Weitenauer!).
Wir arbeiten in der Datei `theme/public/assets/backend/backend.js`. Diese Datei wird standardmäßig im Backend geladen.

<a name="backend-js"></a>
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
        
        // Felder für Wiederholungstermine ausblenden
        $('.sked_repeat_fields').hide();
        
        // bis-Felder ausblenden
        $('input#dpd2').parents('table.skeddatepicker').hide();
        
        // Ort Select Feld ausblenden
        $('select.sked_venue_select').parents('.rex-form-group').hide();
        
        // Teasertextfeld ausblenden
        $('textarea.sked_entry_teaser').parents('.rex-form-group').hide();
        
        // tinyMCE Editor verwenden
        $('textarea.sked_entry_text').addClass('tinyMCEEditor');
        
        // Felder aus Kategorie aktualisieren
        sked_init_entries_form(false);
    }
    // Der Tab Orte wird ausgeblendet
   $('.nav-tabs .item_venues').hide();
    
    // Wenn eine andere Veranstaltungskategorie gewählt wird, Felder aktualisieren
    $('body').on('change','.sked_category_select',function() {
        sked_init_entries_form(true);
    });    

});
```

<a name="ajax"></a>
## Ajax

Die Werte der Veranstaltungskategorie werden als JSON ausgelesen. Hierfür bietet sich die Datei `theme/private/inc/boot.php`

<a name="boot"></a>
### boot.php

```php
// nur im Backend ausführen, nur bei eingeloggtem User und nur wenn der Get Parameter sked_cat_id übergeben wurde
if (rex::isBackend() && rex_get('sked_cat_id') && rex::getUser()) {
    if (rex_request::isXmlHttpRequest()) {
        $sked_cat_id = rex_get('sked_cat_id','int');
        $res = rex_sql::factory()->getArray('SELECT * FROM rex_sked_categories WHERE id = :id',['id'=>$sked_cat_id]);
        echo json_encode($res);
        exit;
    }
}
```

<a name="yform"></a>
## yform

In yform muss noch die Kategorientabelle `rex_sked_event_categories` über den Tablemanager angelegt werden. In unserem Falle benötigen wir lediglich die Felder `name_1` und `name_2`, also die Namen für die Sprache 1 und Sprache 2.

Damit ist die Backendkonfiguration abgeschlossen und das Backend sollte funktionieren.

<a name="frontend"></a>
## Frontend

Die Frontendausgabe ist natürlich auch sehr individuell und von Projekt zu Projekt verschieden. Deswegen ist hier lediglich ein Beispiel wiedergegeben - zur eigenen Verwendung bzw. Variation. Bei mir hat es sich als sinnvoll erwiesen möglichst viel mit yorm abzudecken. YORM nimmt einem viel Arbeit ab und erlaubt den flexiblen Zugriff auf die Datenbankausgabe. Man kann das natürlich alles mit rex_sql abbilden, das ist aber mehr Codieraufwand und es wird auch nicht so übersichtlich. Deswegen werde ich hier die YORM Variante zeigen.

Voraussetzung für YORM ist, dass die Tabellen yform Tabellen sind. Deswegen migrieren wir per Mausklick im yform Tablemanager die Sked Tabellen zu yform Tabellen. Dabei werden die Tabellen nicht verändert. Es wird lediglich die Tabellenkonfiguration in den yform Tabellendefinitionen abgelegt. Die Tabellen stellen wir dann auf "in Navigation versteckt".

<a name="functions"></a>
### functions.php

Wir schreiben in die Datei `theme/private/inc/functions.php` die Initialisierung für das Model:

```php
rex_yform_manager_dataset::setModelClass('rex_sked_categories', rex_sked_categories::class);
rex_yform_manager_dataset::setModelClass('rex_sked_entries', rex_sked_entries::class);
```

<a name="mysked"></a>
### my_sked.php

Nun brauchen wir noch die Klassen und Funktionen für den Zugriff. Hierzu legen wir uns die Datei `theme/private/lib/my_sked.php` an.

```php
<?php

// Die Klasse für die Veranstaltungskategorie 

class rex_sked_categories extends \rex_yform_manager_dataset {
    
    /**
     * Funktion prüft, ob es einen überschriebenen Wert in entries gibt und gibt diesen zurück
     * ansonsten wird der Wert aus category zurückgegeben.
     * 
     * @param type $key
     * @return string
     */
    public function get_val($key): string
    { 
        $entry_key = 'se_'.$key;
        $category_key = $key.'_'.rex_clang::getCurrentId();
        if ($this->{$entry_key}) {
            return $this->{$entry_key};
        } elseif ($this->{$category_key}) {
            return $this->{$category_key};
        }
        return '';
    }
    
    /**
     * Liefert das Sprachbild. Fallback: Bild aus der Sprache 1
     * @return string
     */
    public function get_img(): string
    {
        if ($this->{'lang_image_'.rex_clang::getCurrentId()}) {
            return $this->{'lang_image_'.rex_clang::getCurrentId()};
        }
        if ($this->lang_image_1) {
            return $this->lang_image_1;
        }
        return '';
    }
    
    
    /**
     * Datumsfunktion - nach Belieben und eigenen Bedürfissen anpassen
     * @return string
     */
    public function get_formatted_date_and_time(): string
    {
        $day = explode('-',$this->se_start_date);
        if ($this->get_val('time_text')) {
            $time = $this->get_val('time_text');
        } else {
            $time = str_replace(':00','',$this->se_start_time).'  '.[1=>'Uhr',2=>'h'][rex_clang::getCurrentId()];
        }
        
        return $day[2].'.'.$day[1].', '.$time;
    }    
}

// Klasse für die Einträge

class rex_sked_entries extends \rex_yform_manager_dataset {
    
}

// 

class my_sked {
    
    var $where_raw_string;
    
    public function get_entries () {
        $clang = rex_clang::getCurrentId();

        // Datenbankzugriff jeweils auf die Sprachfelder
        // se steht für Sked-Entry, sc für Sked-Category
        
        $data = rex_sked_categories::query()
            ->alias('sc')
            ->leftJoin('rex_sked_entries','se','sc.id','se.category')
            ->leftJoin('rex_sked_event_categories','sec','sc.category_id','sec.id')
            ->select('sec.name_'.$clang, 'sec_name')
            ->select('se.start_date', 'se_start_date')
            ->select('se.start_time', 'se_start_time')
            ->select('se.description_'.$clang, 'se_description')
            ->select('se.info_meetingpoint_'.$clang, 'se_info_meetingpoint')
            ->select('se.info_duration_'.$clang, 'se_info_duration')
            ->select('se.info_price_'.$clang, 'se_info_price')
            ->select('se.info_registration_'.$clang, 'se_info_registration')
            ->select('se.info_contact_'.$clang, 'se_info_contact')
            ->select('se.info_1_label_'.$clang, 'se_info_1_label')
            ->select('se.info_1_value_'.$clang, 'se_info_1_value')
            ->select('se.subtitle_'.$clang, 'se_subtitle')
            ->select('se.subline_'.$clang, 'se_subline')
            ->select('se.time_text_'.$clang, 'se_time_text')
            ->orderBy('se.start_date')
            ->where('se.start_date',date('Y-m-d'),'>=')
            ->where('sc.status', 1);
        
        if ($this->where_raw_string) {
            $data->whereRaw($this->where_raw_string);
        }

        return $data->find();
        
    }
    
}
```

<a name="modul"></a>
## Modul

Das Modul ist in diesem Falle nicht besonders aufwändig, da die ganze Logik bereits programmiert und abrufbar ist.

```php
$my_sked = new my_sked();
$res = $my_sked->get_entries();

$fragment = new rex_fragment();
$fragment->setVar('termine',$res);
echo $fragment->parse('sked_terminliste.php');
```

<a name="fragment"></a>
## Fragment

Das Fragment legen wir unter `theme/private/fragments/sked_terminliste.php` ab.

```php
<ul>
<?php foreach ($this->termine as $i=>$item) : ?>
    <li>
        <a href="event-detail.html">
            <div class="event__date"><?= $item->get_formatted_date_and_time() ?></div>
            <div class="event__category"><?= $item->sec_name ?></div>
            <div class="event__title" style="color: <?= $item->color ?>"><?= $item->{'name_'.rex_clang::getCurrentId()} ?></div>
            <div class="event__subtitle"><?= $item->get_val('subtitle') ?></div>
            <div class="event__description"><?= $item->get_val('subline') ?></div>
        </a>
        <?= $item->get_val('description') ?>
        <dl class="uk-description-list ">
           <?php if ($item->get_val('info_meetingpoint')) : ?>
             <dt>{{ Treffpunkt }}</dt>
             <dd><?= $item->get_val('info_meetingpoint') ?></dd>
           <?php endif ?>
           <?php if ($item->get_val('info_duration')) : ?>
             <dt>{{ Dauer }}</dt>
             <dd><?= $item->get_val('info_duration') ?></dd>
           <?php endif ?>
           <?php if ($item->get_val('info_price')) : ?>
             <dt>{{ Kosten }}</dt>
             <dd><?= $item->get_val('info_price') ?></dd>
           <?php endif ?>
           <?php if ($item->get_val('info_registration')) : ?>
             <dt>{{ Anmeldung }}</dt>
             <dd><?= $item->get_val('info_registration') ?></dd>
           <?php endif ?>
           <?php if ($item->get_val('info_contact')) : ?>
             <dt>{{ Kontakt }}</dt>
             <dd><?= $item->get_val('info_contact') ?></dd>
           <?php endif ?>

           <?php if ($item->get_val('info_1_value')) : ?>
             <dt><?= $item->get_val('info_1_label') ?></dt>
             <dd><?= $item->get_val('info_1_value') ?></dd>
           <?php endif ?>
         </dl>             
         <img src="/images/content/<?= $item->get_img() ?>" alt="">
    </li>
<?php endforeach ?>
```

<a name="credits"></a>
## Credits

Sked (Joachim Dörr, Thomas Skerbis), YFORM (Jan Kristinus, Gregor Harlan), Theme (Daniel Weitenauer), Tinymce (Azular GmbH)
