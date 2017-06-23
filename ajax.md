# AJAX mit rex_api

Wie kann man in Backend oder Frontend Daten zwischen der aktuellen Seite im Browser
und dem Server austauschen? Dafür bietet sich rex_api an, aber wie klappt das genau?

Hier der Versuch einer Antwort.

<a name="plan"></a>
## Was ist der Plan bzgl. AJAX.

Die Anforderung ist eine ganz einfache: klickt man auf einen Button oder ein anderes Element der Seite
soll etwas passieren, das Datenaustausch mit dem Server umfasst. Es werden Daten an den Server
geschickt (Anfrage) und der Server schickt zumindest einen Statuscode, oft auch Daten, zurück.

Konkrete Beispiele:

* Nachladen von HTML z.B. für Jalousien, Tabs oder Listen)
* Abruf von Datensätzen (JSON) z.B. für Formulare
* Serverseitige Verarbeitung auslösen und das Ergebnis zurückbekommen

Redaxo als CMS ist dafür gebaut, Seiten zu generieren und an den Browser zu senden. Keine Seite
ausgewählt? Dann wird die Startseite geschickt. Eine normale Seite mit zusätzlichen Parametern
aufzurufen, wäre also erst einmal nicht so geschickt. Ein AJAX-Aufruf müsste entweder an eine andere
Instanz als index.php gehen oder index.php muss AJAX-Aufrufe erkennen und anders behandeln.

Kann rex\_api die Lösung bieten?
