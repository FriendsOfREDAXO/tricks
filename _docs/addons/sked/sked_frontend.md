---
title: "Sked im Frontend"
authors: [joachimdoerr,skerbis]
prio:
---

# Sked im Frontend

inkl. Anzeige einer Detailseite 

## CSS und Javascript 

Zunächst erstellt man ein Javascript zur Initialisierung des Kalenders. Dieses verwendet die API um sich die Termine des Kalenders zu holen. 
Es sucht auf der Website einen Container mit der ID #sked in dem der Kalender ausgegeben wird. Hier wird ein Kalender inkl. Terminlsute ausgegeben. 
Dies lässt sich leicht anpassen und den eigenen Wünschen entsprechend anpassen. Weitere Infos dazu hier: [FullCalendar - JavaScript Event Calendar](https://fullcalendar.io/) 

Das Skript legt man z.B. unter '/assets/js/sked.js' ab 

```js
$(function () {
    sked_init();
});

function sked_init() {
    var sked = $('#sked');

    if (sked.length) {
        sked_fullcalendar(sked);
    }

}

function sked_fullcalendar(sked) {
    var noTime = $.fullCalendar.moment(sked.data('date')),
        csrf_token = sked.data('csrf'),
        base_link = sked.data('link');

    sked = sked.fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,listFourMonth'
        },
        views: {
            listFourMonth: {
                type: 'list',
                duration: { month: 1 },
                buttonText: 'Terminübersicht'
            }
        },
        locale: 'de',
        weekNumbers: true,
        weekNumbersWithinDays:true,
        defaultDate: noTime,
        dragScroll: true,
        eventLimit: true, // allow "more" link when too many events
        eventDrop: function(event, delta, revertFunc) {
        },
        eventResize: function(event, delta, revertFunc) {
        },
        eventClick: function(calEvent, jsEvent, view) {
            window.location.replace(base_link + '?event_id=' + calEvent.id);
        },
        events: {
            url: '/index.php?rex-api-call=sked_exchange&_csrf_token=' + csrf_token,
            cache: true,
            error: function(xhr, type, exception) {
                 console.log("Error: " + exception);
            },
            success: function(doc) {
                // add plus circle
            }
        }
    });
}

```

> wird kein Rewriter verwendet muss 'window.location.replace(base_link + `?event_id=' + calEvent.id);` in `window.location.replace(base_link + '&event_id=' + calEvent.id);`
geändert werden. 

Anschließend bindet man die erforderlichen JS und CSS für die Frontendausgabe im Template ein. 

### CSS

```html
<link rel="stylesheet" href="<?= rex_url::base('assets/addons/sked/vendor/fullcalendar/fullcalendar.min.css') ?>"> 
```


### Javascript 

JQuery sollte auch eingebunden sein. Die Skripte sollten im Header oder vor dem schließenden body Tag eingebunden werden.  

```html
<script type="text/javascript" src="<?= rex_url::base('assets/addons/sked/vendor/fullcalendar/lib/moment.min.js') ?>"></script>
<script type="text/javascript" src="<?= rex_url::base('assets/addons/sked/vendor/fullcalendar/fullcalendar.min.js') ?>"></script>
<script type="text/javascript" src="<?= rex_url::base('assets/addons/sked/vendor/fullcalendar/locale-all.js') ?>"></script>
<script type="text/javascript" src="<?= rex_url::base('assets/js/sked.js') ?>"></script>
```


## Das Modul für die Ausgabe. 

Es besteht nur aus einem Ausgabecode

```php 
<?php
// Ausgabe der Detail-Seite
if(!is_null(rex_request::get('event_id', integer, null))) {
    $data = \Sked\Handler\SkedHandler::exchangeEntry(rex_request::get('event_id'), false);
    // dump($data);
    $header = '<div class="newsheader">';
    $header .= '<h1>'.$data['title'].'</h1>';
    $header .= '<span class="newsmeta small">'.\Sked\Utils\SkedDateTimeHelper::getFromToDate(new \DateTime($data['start']), new \DateTime($data['end'])). ' ' . \Sked\Utils\SkedDateTimeHelper::getFromToTime(new \DateTime($data['start']), new \DateTime($data['end'])) . '</span> ';
    // $header .= '<span class="newsmeta small">'.fvn_newscat($cat).'</span>';
    $header .= '<hr style="border-color:'.$data['color'].'"> ';
    $header .= '<div class="pull-left">
    <a class="btn btn-primary" href="'.rex_getUrl('REX_ARTICLE_ID', rex_clang::getCurrentId()).'">
    <i class="fa fa-chevron-left" aria-hidden="true"></i> Kalender</a>
    </div>';
    if (!empty($data['entries_image'])) {
        $header .= '<img class="img-responsive" src="/media/'.$data['entries_image'].'">';
    }
    $header .= '</div>';
    $teaser = '<div class="teaser">'.$data['teaser'].'</div>';
    echo $header.$teaser.'<article class="newstext">'.$data['text'].'</article>';
} 
// Kalender ausgeben
else {
?>
<div id="sked" class="sked" data-link="<?php echo rex_getUrl('REX_ARTICLE_ID', rex_clang::getCurrentId());?>"></div>
<?php } ?>

```


