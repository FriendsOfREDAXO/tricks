---
title: YCom Auto-Logout mit PHP und/oder JavaScript
authors: [elricco]
prio:
---

# YCom Auto-Logout mit PHP und/oder JavaScript

- [mit PHP](#mitphp)
- [mit JavaScript](#mitjs)

Will man verhindern, dass bestimmte Daten gesehen oder manipuliert werden (z.B. wenn ein User nicht am Rechner ist), kann ein Auto-Logout hilfreich sein. Dafür gibt es zwei Möglichkeiten, die sich auch miteinander kombinieren lassen.

Die PHP-Methoden erlaubt es den User nach Abwesenheit beim nächsten Klick auszuloggen.

Die JavaScript-Methode zeigt vorher einen Hinweis (hier nach 14min) und loggt den User nach Voreinstellung aus (hier 1min).

Welche Methode für den jeweiligen Anwendugsfall besser ist, muss man selbst entscheiden. Eine Komnbination der beiden Methoden ist aber sinnvoll, sollte z.B. keine JavaScript aktiviert sein.

    Beide Codeschnipsel sind auf 15min eingestellt - PHP in Sekunden, JS in Millisekunden (14min + 1min).


<a name="mitphp"></a>
## mit PHP

Dieser Code-Schnipsel muss (mindestens) in alle Templates, die dem User im geschützten Bereich angezeigt werden -
hier liegt es natürlich nahe, diesen in ein Template auszulagern und dieses dann an entsprechender Stelle einzubinden.

    
```php 
<?php
if(time() == strtotime(rex_ycom_auth::getUser()->getValue('last_login_time'))) {
    rex_set_session('timestamp', strtotime(rex_ycom_auth::getUser()->getValue('last_login_time')));
}
if(time() - rex_session('timestamp') > 900) { //subtract new timestamp from the old one
    header("Location: ". rex_getUrl(---id-zum-logout-artikel---)); //redirect to logout
    exit;
} else {
    rex_set_session('timestamp', time()); //set new timestamp
}
?>
```

<a name="mitjs"></a>
## mit JavaScript

Es geht auch den User nach Inaktivität per JavaScript auszuloggen. Dafür den Codeschnipsel in den Footer der Seite einbauen.

Hier braucht es einige zusätzliche Elemente:

  - Logout Link mit id **logout**
  - Ein zusätzliches Modal um den Hinweis anzuzeigen (hier als Beispiel auf Bootstrap4-Basis)
  - Damit der JS Code nur im geschützen Bereich greift die id **app** an z.B. einem Wrapper-Element

```js
let warningTimeout = 840000;
let timeoutNow = 60000;
let warningTimerID,timeoutTimerID;

function startTimer() {
    // window.setTimeout returns an Id that can be used to start and stop a timer
    warningTimerID = window.setTimeout(warningInactive, warningTimeout);
}

function warningInactive() {
    window.clearTimeout(warningTimerID);
    timeoutTimerID = window.setTimeout(IdleTimeout, timeoutNow);
    $('#modalAutoLogout').modal('show');
}

function resetTimer() {
    window.clearTimeout(timeoutTimerID);
    window.clearTimeout(warningTimerID);
    startTimer();
}

// Logout the user.
function IdleTimeout() {
    window.location = document.getElementById('logout').href;
}

function setupTimers () {
    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);
    document.addEventListener("onscroll", resetTimer, false);
    startTimer();
}

$(document).on('click','#btnStayLoggedIn',function(){
    resetTimer();
    $('#modalAutoLogout').modal('hide');
});

$(document).ready(function(){
    let app = document.getElementById("app");
    if(app) {
        setupTimers();
    }
});
```

**Code für das Modal**

Wie bereits bei der Einletung zum JavaScript Teil erwähnt, ist hier ein Beispiel Modal, welches auf Bootstrap4 basiert. Es kann aber auch jegliches andere Framework wie Foundation ode UIkit oder eine komplette eigene Lösung zum Anzeigen des Hinweises genutzt werden.

```html
<div class="modal fade" id="modalAutoLogout" tabindex="-1" role="dialog" aria-labelledby="modalAutoLogoutTitle" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalAutoLogoutTitle">Auto Logout</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Sie werden in 1 Minute ausgeloggt, da Sie seit mehreren Minuten keine Aktivität gezeigt haben.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="btnStayLoggedIn">Eingeloggt bleiben</button>
            </div>
        </div>
    </div>
</div>
```
