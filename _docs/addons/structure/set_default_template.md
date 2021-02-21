---
title: Immer Standard-Template verwenden
authors: [dtpop]
prio:
---

# Vererbung des Templates in Kategorien umgehen und Standard-Template festlegen

- Einbinden des Skripts über Projekt- oder Theme-Addon
- In der letzten Programmzeile die gewünschte Template-Id eintragen (hier: 1)

```js
$(document).on('rex:ready', function (event, container) {

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    var func = getUrlParameter('function');
    if (func == 'add_art') {
        $('select[name="template_id"]').selectpicker('val','1');
    }
    
});
```
