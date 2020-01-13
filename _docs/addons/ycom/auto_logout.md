---
title: YCom Auto-Logout mit PHP und/oder JavaScript
authors: [elricco]
prio:
---

# YCom Auto-Logout mit PHP und/oder JavaScript

- [mit PHP](#mitphp)
- [mit JavaScript](#mitjs)

Will man verhindern, dass bestimmte Daten gesehen oder manipuliert werden (z.B. wenn ein User nicht am Rechner ist), kann ein Auto-Logout hilfreich sein. Dafür gibt es zwei Möglichkeiten, die sich auch miteinander kombinieren lassen.

Die PHP-Methoden erlauben es, den User nach Abwesenheit beim nächsten Klick auszuloggen. Diese Methode ist hilfreich, wenn ein User den Tab / das Fenster im Browser schließt, aber nicht den Browser beendet, da die Session dann noch erhalten bleibt. Kehrt man dann zum geschützten Bereich zurück, wird man ausgeloggt, da die Session inzwischen ausgelaufen ist.

Die JavaScript-Methode zeigt vorher einen Hinweis (hier: nach 14 Minuten) und loggt den User ggf. nach einer kurzen Zeit aus (hier: 1 Minute). Diese Methode ist hilfreich, wenn ein User den Tab / das Fenster offen lässt während einer Sitzung und das Ausloggen dadurch verhindern kann.

Welche Methode für den jeweiligen Anwendugsfall besser ist, muss man selbst entscheiden. Eine Kombination der beiden Methoden kann aber sinnvoll sein, sollte z.B. kein JavaScript aktiviert sein.

Es kann natürlich bei der Kombination der Methoden passieren, dass ein User trotzdem ausgeloggt wird (per PHP), wenn keine "Aktion" wie Navigation oder Formularübermittlung stattfindet, nachdem auf "Eingeloggt bleiben" in der JavaScript Methode geklickt wurde.

Beide Lösungen sind auf 15 Minuten eingestellt - PHP in Sekunden, JS in Millisekunden (14 + 1 Minute).

<a name="mitphp"></a>
## mit PHP

Dieser Code muss (mindestens) in alle Templates, die dem User im geschützten Bereich angezeigt werden. Hier liegt es natürlich nahe, diesen in ein eigenes Template auszulagern und dieses dann an entsprechender Stelle einzubinden.

    
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

Es geht auch, den User nach Inaktivität per JavaScript auszuloggen. Dafür den Codeschnipsel in den Footer der Seite einbauen.

Hier braucht es einige zusätzliche Elemente:

  - Logout-Link mit `id="logout"`
  - Ein zusätzliches Modal, um den Hinweis anzuzeigen (hier als Beispiel auf Bootstrap-4-Basis)
  - Damit der JavaScript-Code nur im geschützen Bereich ausgeführt wird, greift die `id=app` nur bei z.B. einem Wrapper-Element

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

Wie bereits bei der Einletung zum JavaScript-Teil erwähnt, ist hier ein Beispiel-Modal, welches auf Bootstrap 4 basiert. Es kann aber auch jegliches andere Framework wie Foundation ode UiKit oder eine komplette eigene Lösung zum Anzeigen des Hinweises genutzt werden.

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
                <p>Sie werden in einer Minute ausgeloggt, da Sie seit mehreren Minuten keine Aktivität gezeigt haben.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Schließen</button>
                <button type="button" class="btn btn-primary" id="btnStayLoggedIn">Eingeloggt bleiben</button>
            </div>
        </div>
    </div>
</div>
```
