---
title: FullCalendar mit ForCal >= 5
authors: [skerbis]
prio:
---

# FOR calendar - FullCalendar Modul

Frameworkunabhängige Umsetzung. 

> Achtung, für einen produktiven Einsatz sollte man FullCalendar lokal installieren. 

## Eingabe 

```php
<?php
// Eingabe-Code für das REDAXO-Modul

/* Eingabe */
?>
<div class="form-group">
  <label>Zeitraum für initiale Ladung (in Monaten)</label>
  <input type="number" name="REX_INPUT_VALUE[1]" value="<?= htmlspecialchars(rex_escape('REX_VALUE[1]')) ?>" min="1" max="24" class="form-control">
</div>

<div class="form-group">
  <label>Kategorien (optional, leer = alle anzeigen)</label>
  <?php
  // Kategorien-Auswahl generieren
  $sql = rex_sql::factory();
  $categories = $sql->getArray('SELECT id, name_' . rex_clang::getCurrentId() . ' as name FROM ' . rex::getTable('forcal_categories') . ' WHERE status = 1 ORDER BY name');

  ?>
  <select name="REX_INPUT_VALUE[2][]" class="form-control" multiple>
    <?php
    $selected_categories = explode('|', 'REX_VALUE[2]');
    foreach ($categories as $category) {
        $selected = in_array($category['id'], $selected_categories) ? 'selected' : '';
        echo '<option value="' . $category['id'] . '" ' . $selected . '>' . htmlspecialchars(rex_escape($category['name'])) . '</option>';
    }
    ?>
  </select>
  <p class="help-block">Mehrere mit STRG/CMD-Taste auswählen, keine Auswahl = alle Kategorien</p>
</div>

<div class="form-group">
  <label>Initiale Ansicht</label>
  <select name="REX_INPUT_VALUE[3]" class="form-control">
    <option value="dayGridMonth" <?= 'REX_VALUE[3]' == "dayGridMonth" ? "selected" : "" ?>>Monatsansicht</option>
    <option value="timeGridWeek" <?= 'REX_VALUE[3]' == "timeGridWeek" ? "selected" : "" ?>>Wochenansicht</option>
    <option value="timeGridDay" <?= 'REX_VALUE[3]' == "timeGridDay" ? "selected" : "" ?>>Tagesansicht</option>
    <option value="listMonth" <?= 'REX_VALUE[3]' == "listMonth" ? "selected" : "" ?>>Listenansicht (Monat)</option>
    <option value="listWeek" <?= 'REX_VALUE[3]' == "listWeek" ? "selected" : "" ?>>Listenansicht (Woche)</option>
  </select>
</div>

<div class="form-group">
  <label>Kalender-Höhe (in Pixel, leer = auto)</label>
  <input type="number" name="REX_INPUT_VALUE[4]" value="<?= htmlspecialchars(rex_escape('REX_VALUE[4]')) ?>" min="300" class="form-control">
  <p class="help-block">Empfohlen: 600-800 für Monats- und Wochenansicht, leer lassen für automatische Höhe</p>
</div>

<div class="form-group">
  <label>Weitere Einstellungen</label>
  <div class="checkbox">
    <label>
      <input type="checkbox" name="REX_INPUT_VALUE[5]" value="1" <?= 'REX_VALUE[5]' == 1 ? "checked" : "" ?>> Wochenenden hervorheben
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input type="checkbox" name="REX_INPUT_VALUE[6]" value="1" <?= 'REX_VALUE[6]' == 1 ? "checked" : "" ?>> Navigationsbuttons anzeigen
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input type="checkbox" name="REX_INPUT_VALUE[7]" value="1" <?= 'REX_VALUE[7]' == 1 ? "checked" : "" ?>> Heute-Button anzeigen
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input type="checkbox" name="REX_INPUT_VALUE[8]" value="1" <?= 'REX_VALUE[8]' == 1 ? "checked" : "" ?>> Ansichts-Wechsler anzeigen
    </label>
  </div>
</div>
```

## Ausgabe

```php
<?php
/* Ausgabe */
?>

<div class="forcal-fullcalendar REX_ARTICLE_ID REX_CLANG_ID">
  <!-- Der Kalender wird hier eingefügt -->
  <div id="forcal-calendar-REX_ARTICLE_ID-REX_CLANG_ID"></div>

  <!-- Details-Modal -->
  <div class="modal" id="forcal-event-modal-REX_ARTICLE_ID-REX_CLANG_ID">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title event-title"></h4>
          <button type="button" class="close-button" aria-label="Schließen">
            <span>×</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="event-date"></div>
          <div class="event-time"></div>
          <div class="event-category"></div>
          <div class="event-venue"></div>
          <div class="event-teaser"></div>
          <div class="event-description"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="close-button">Schließen</button>
        </div>
      </div>
    </div>
  </div>
</div>

<?php
// Monate für initiale Ladung (Standard: 3)
$months = (int)'REX_VALUE[1]' > 0 ? (int)'REX_VALUE[1]' : 3;

// Ausgewählte Kategorien
$categories = 'REX_VALUE[2]' != '' ? explode('|', 'REX_VALUE[2]') : null;

// Initiale Ansicht
$initialView = 'REX_VALUE[3]' != '' ? 'REX_VALUE[3]' : 'dayGridMonth';

// Kalender-Höhe
$calendarHeight = 'REX_VALUE[4]' != '' ? (int)'REX_VALUE[4]' : 'auto';

// Weitere Einstellungen
$highlightWeekends = 'REX_VALUE[5]' == 1;
$showNavButtons = 'REX_VALUE[6]' == 1;
$showTodayButton = 'REX_VALUE[7]' == 1;
$showViewSwitcher = 'REX_VALUE[8]' == 1;

// CSS für den Kalender und das Modal
$css = '
<style>
/* FullCalendar Styling */
.forcal-fullcalendar .fc-event {
    cursor: pointer;
}
.forcal-fullcalendar .fc-day-sat, .forcal-fullcalendar .fc-day-sun {
    ' . ($highlightWeekends ? 'background-color: rgba(0,0,0,0.02);' : '') . '
}
.event-date, .event-time, .event-category, .event-venue {
    margin-bottom: 10px;
}
.event-teaser {
    margin-bottom: 15px;
    font-style: italic;
}
.event-description {
    margin-top: 20px;
}

/* Modal Styling */
.modal {
    display: none; /* Versteckt das Modal standardmäßig */
    position: fixed;
    z-index: 1000; /* Oberhalb des restlichen Inhalts */
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto; /* Ermöglicht Scrollen, falls der Inhalt zu groß ist */
    background-color: rgba(0, 0, 0, 0.4); /* Hintergrund mit Transparenz */
}

.modal.show {
    display: block; /* Zeigt das Modal an */
}

.modal-dialog {
    position: relative; /* Für absolute Positionierung des Inhalts */
    margin: 100px auto; /* Zentriert das Modal */
    width: 80%; /* Breite des Modals */
    max-width: 800px; /* Maximale Breite */
}

.modal-content {
    background-color: #fff;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19); /* Schatten */
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
}

.modal-title {
    font-size: 1.5rem;
    margin: 0;
}

.close-button {
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
}

.close-button:hover,
.close-button:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

.modal-body {
    padding: 10px 0;
}

.modal-footer {
    text-align: right;
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #ddd;
}
</style>';

// JavaScript-Code
$js = '
<script>
document.addEventListener("DOMContentLoaded", function() {
    // Kalenderelement
    const calendarEl = document.getElementById("forcal-calendar-REX_ARTICLE_ID-REX_CLANG_ID");

    // API-Basis-URL
    const apiBaseUrl = window.location.origin + "/index.php?rex-api-call=forcal_exchange";

    // Aktuelle Sprache fest auf Deutsch setzen
    let locale = "de";
    // Die folgende Zeile auskommentiert, damit die Sprache immer Deutsch bleibt
    // ' . (rex_clang::getCurrentId() > 1 ? 'locale = "en";' : '') . '

    // Startdatum (heute)
    const today = new Date();
    const startDate = today.toISOString().split("T")[0];

    // Enddatum (X Monate in der Zukunft)
    const endDate = new Date(today.getFullYear(), today.getMonth() + ' . $months . ', today.getDate()).toISOString().split("T")[0];

    // API-URL mit Parametern
    let apiUrl = apiBaseUrl + "&start=" + startDate + "&end=" + endDate + "&short=0";

    // Kategoriefilter hinzufügen, falls vorhanden
    ' . ($categories ? 'apiUrl += "&category=' . implode(',', $categories) . '";' : '') . '

    // FullCalendar initialisieren
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "' . $initialView . '",
        height: ' . ($calendarHeight !== 'auto' ? $calendarHeight : '"auto"') . ',
        headerToolbar: {
            left: "' . ($showNavButtons ? 'prev,next' : '') . ' ' . ($showTodayButton ? 'today' : '') . '",
            center: "title",
            right: "' . ($showViewSwitcher ? 'dayGridMonth,timeGridWeek,timeGridDay,listMonth' : '') . '"
        },
        locale: "de",  // Fest auf Deutsch setzen
        firstDay: 1, // 1 = Montag als erster Tag der Woche
        buttonText: {
            today: "Heute",
            month: "Monat",
            week: "Woche",
            day: "Tag",
            list: "Liste"
        },
        dayHeaderFormat: { weekday: "short", day: "numeric" },
        titleFormat: { year: "numeric", month: "long" },
        events: function(info, successCallback, failureCallback) {
            // Events von der forCal-API laden
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    // Events formatieren
                    const events = data.map(event => {
                        return {
                            id: event.id,
                            title: event.title,
                            start: event.start,
                            end: event.end,
                            allDay: event.date_time.full_time,
                            backgroundColor: event.color || "#3788d8",
                            borderColor: event.color || "#3788d8",
                            // Zusätzliche Daten für das Modal speichern
                            extendedProps: {
                                date: event.date_time.date,
                                time: event.date_time.time,
                                category: event.category_name,
                                venue: event.venue_name,
                                teaser: event.teaser,
                                description: event.text
                            }
                        };
                    });
                    successCallback(events);
                })
                .catch(error => {
                    console.error("Fehler beim Laden der Events:", error);
                    failureCallback(error);
                });
        },
        eventClick: function(info) {
            // Event-Details im Modal anzeigen
            const modal = document.getElementById("forcal-event-modal-REX_ARTICLE_ID-REX_CLANG_ID");
            const modalTitle = modal.querySelector(".event-title");
            const modalDate = modal.querySelector(".event-date");
            const modalTime = modal.querySelector(".event-time");
            const modalCategory = modal.querySelector(".event-category");
            const modalVenue = modal.querySelector(".event-venue");
            const modalTeaser = modal.querySelector(".event-teaser");
            const modalDescription = modal.querySelector(".event-description");
            const closeModalButtons = modal.querySelectorAll(".close-button");  // Beides auswählen
            // Modal-Inhalt füllen
            modalTitle.textContent = info.event.title;
            modalDate.innerHTML = "<strong>' . rex_i18n::msg('forcal_entry_date') . ':</strong> " + info.event.extendedProps.date;

            if (info.event.extendedProps.time) {
                modalTime.innerHTML = "<strong>' . rex_i18n::msg('forcal_starttime') . ':</strong> " + info.event.extendedProps.time;
            } else {
                modalTime.innerHTML = "<strong>' . rex_i18n::msg('forcal_starttime') . ':</strong> ' . rex_i18n::msg('forcal_checkbox_full_time') . '";
            }

            modalCategory.innerHTML = "<strong>' . rex_i18n::msg('forcal_category') . ':</strong> " + (info.event.extendedProps.category || "");

            if (info.event.extendedProps.venue) {
                modalVenue.innerHTML = "<strong>' . rex_i18n::msg('forcal_entry_venue') . ':</strong> " + info.event.extendedProps.venue;
                modalVenue.style.display = "block"; // Vanilla JS equivalent to show()
            } else {
                modalVenue.style.display = "none";  // Vanilla JS equivalent to hide()
            }

            if (info.event.extendedProps.teaser) {
                modalTeaser.innerHTML = info.event.extendedProps.teaser;
                modalTeaser.style.display = "block"; // Vanilla JS equivalent to show()
            } else {
                modalTeaser.style.display = "none";  // Vanilla JS equivalent to hide()
            }

            if (info.event.extendedProps.description) {
                modalDescription.innerHTML = info.event.extendedProps.description;
                modalDescription.style.display = "block"; // Vanilla JS equivalent to show()
            } else {
                modalDescription.style.display = "none";  // Vanilla JS equivalent to hide()
            }

            // Modal anzeigen
            modal.classList.add("show");

             // Event-Listener für das Schließen des Modals (mit Klick auf den Close-Button)
            const hideModal = () => {
                modal.classList.remove("show");
            };
            closeModalButtons.forEach(button => {  // Für alle Buttons hinzufügen
                button.addEventListener("click", hideModal);
            });
            // Event-Listener für das Schließen des Modals (mit Klick außerhalb des Modals)
            window.addEventListener("click", (event) => {
                if (event.target === modal) {
                    hideModal();
                }
            });
        }
    });

    // Kalender rendern
    calendar.render();
});
</script>';
?>

<!-- FullCalendar 6.x via CDN - cdnjs.com -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/6.1.15/index.global.min.js" integrity="sha512-PneTXNl1XRcU6n5B1PGTDe3rBXY04Ht+Eddn/NESwvyc+uV903kiyuXCWgL/OfSUgnr8HLSGqotxe6L8/fOvwA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<?= $css ?>
<?= $js ?>
```
