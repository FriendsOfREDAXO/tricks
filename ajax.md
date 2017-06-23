# AJAX mit rex_api

Wie kann man in Backend oder Frontend Daten zwischen der aktuellen Seite im Browser
und dem Server austauschen? Dafür bietet sich rex_api an, aber wie klappt das genau?

Hier der Versuch einer Antwort.


- [Was ist der Plan bzgl. AJAX](#plan)
- [Wie funktioniert rex_api - Chronologie einer gestörten Erwartungshaltung](#api)
- [Wenn Du den Ausgang sucht, nimm die Tür - Die Exit-Strategie](#exit)
- [Es geht besser - sinnvolle Erweiterungen](#besser)
	- [## Was will der denn? - frag die Parameter](#besser-parameter)
	- [Fehlercodes und Erfolgsmeldungen - auf den Header koomt es an](#besser-returncode)
	- [Text oder JSON - was erwartet der Client](#besser-mime)
	- [Darf der das - Rechte abprüfen](#besser-permit)
- [JS-Jalousie mit Selbstbedienung - ein Beispiel](#demo)
        - [Das HTML](#demo-html)
        - [Das CSS](#demo-css)
        - [Das JS](#demo-js)
        - [Das MODUL](#demo-modul)
        - [rex_api_xyz - Der PHP-Code des API](#demo-api)
        - [Die Sprachdatei(en)](#demo-lang)
- [Frontend vs. Backend - Merkwürdige Dinge geschehen](#febe)


<a name="plan"></a>
## Was ist der Plan bzgl. AJAX

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

<a name="api"></a>
## Wie funktioniert rex\_api - Chronologie einer gestörten Erwartungshaltung

Eigentlich sollte es recht einfach sein. Über eine passend gestaltete
URL an das Ziel "index.php" wird das gewünscht API ausgewählt. Zusätzliche Parameter präzisieren die Anfrage.

**Das kann so aussehen:**

    index.php?rex_api_call=xyz&id=17

Im Beispiel wird das API **xyz** aufgerufen und zusätzlich der Parameter **id=17** mitgegeben.

In Frontend wie Backend sorgt der jeweilige Prozessor dafür, dass über ein paar
Zwischenschritte die Methode `execute()` der Klasse **rex\_api\_xyz** ausgeführt wird.

Die Klasse für das eigene API wird von **rex\_api\_function** abgeleitet. Nur `execute()` muss
überschrieben werden und den nötigen Programmcode erthalten:

**Hier ein ganz rudimentäres Code-Skelet für rex\_api\_xyz:**

    class rex_api_xyz extends rex_api_function
    {
        protected $published = true;

        function execute()
        {
            echo '<p>mach mal was sinnvolles</p>';
            return;
        }
    }

Womit wir bei der gestörten Erwartungshaltung sind. Beim Browser landet zwar *auch* der Text, aber zudem
Kauderwelsch in der Art

    <p>mach mal was sinnvolles</p>../%?)=((=)&(&%/&(%(&
    
Analyse von Beispielen zeigt am Ende, dass dem `return` eigentlich ein Objekt der Klasse
**rex\_api\_result** mitgegeben werden soll. Aber die weiteren Tests führten am Ende zur Erkenntnis, dass nach
dem `rex\_api\_xyz->execute()` noch viel passiert und je nach Konstellation ganze Seiten mitgeneriert werden.

Wie man es dreht und wendet - beim Browser landet viel mehr als erwartet.

<a name="exit"></a>
## Wenn Du den Ausgang suchst, nimm die Tür - Die Exit-Strategie

Was passiert eigentlich, wenn man **rex\_api\_xyz** vorzeitig abwürgt, bevor der unerwünsche Output erzeugt wird?
Wenn man die Funktion mit `exit;` oder `die();` statt des `return;` bendet?

    class rex_api_xyz extends rex_api
    {
        function execute()
	{
            echo '<p>mach mal was sinnvolles</p>';
            exit;
        }
    }

Ziel erreicht! Beim Browser kommt genau die eine, erwartete Zeile als
AJAX-Rückgabe an:

    <p>mach mal was sinnvolles</p>

Ziel erreicht? Im Prinzip ja, aber es geht besser und richtiger.

<a name="besser"></a>
## Es geht besser - sinnvolle Erweiterungen

<a name="besser-parameter"></a>
## Was will der denn? - frag die Parameter

Wie schon [oben](#api) in der Beispiel-URL dargestellt, kann dem AJAX-Aufruf auch über Parameter mitgegeben werden,
was im Detail zu tun und zu beachten ist.

In der API-Funktion werden die Parameter abgefragt, ausgewertet und steuern dann das weitere Procedere.

Es kann sinnvoll sein, bei fehlerhaften Parameter-Konstellationen die Verarbeitung abzubrechen und einen
Fehlercode an den Client zurückzusenden. Dazu mehr im [nächsten Kapitel](#besser-returncode).

**Hier ein Beispiel:**

	class rex_api_xyz extends rex_api_function
	{
	    protected $published = true;  // Aufruf aus dem Frontend erlaubt

	    function execute()
	    {
	        // Parameter abrufen und auswerten
	        $id = rex_request( 'id','string','' );
	        if ( !$id )
	        {
	            // Fehlermeldung
		    // Abbruch
	        }

	        // Inhalt zusammenbauen
	        $content = '<p>mach mal was sinnvolles (' . $id . ')</p>';

		// Inhalt ausgeben
		echo $content;
	        exit;
	    }
	}

<a name="besser-returncode"></a>
## Fehlercodes und Erfolgsmeldungen - auf den Header kommt es an

Im JavaScript kann abgefragt werden, ob ein AJAX-Call erfolgreich war oder nicht. Das klappt mit
nativem JS ebenso wie mit JQuery. Ob ein Aufruf erfolgreich war oder nicht, wird mittels
Codes im HTML-Header übermittelt. (Nun kann man trefflich streiten, ob HTML-Header-Codes nicht eigentlich
nur dazu da sind, das Ergebnis des Datentransports zu berichten. Trotzdem werden sie oft genutzt,
um auch inhaltsbezogene Fehlercodes zu übermitteln.)

Liegt kein Fehler vor, wird das Ergebnis einfach an den Client zurückgesandt. Der Datenstrom
wird automatisch mit dem Header

	HTTP/1.1 200 OK

versehen. Im Fehlerfall bietet sich der allgemeiner Fehlercode 500 an:

	HTTP/1.1 500 Internal Server Error

Ergänzend sollte dann auch ein "verständlicher" Fehlercode und/oder eine Klartext-Meldung zum Client
geschickt werden. Es ist auch möglich, Fehlermeldungen zu sammeln und als Array an den Client zu
übermitteln.

Serverseitig ist es wesentlich einfacher, in mehrsprachigen Applikaionen den jeweils passenden Text zu generieren. Der Text sollte daher immer geschickt werden und nicht im JS-Code stehen.

**Unser Beispiel sieht jetzt so aus:**

    class rex_api_xyz extends rex_api_function
    {
        protected $published = true;  // Aufruf aus dem Frontend erlaubt

        function execute()
        {
            // Parameter abrufen und auswerten
            $id = rex_request( 'id','string','' );
            if ( !$id )
            {
                echo 'HTTP/1.1 500 Internal Server Error';
                $result = [ 'errorcode' => 1, 'message' => rex_i18n::msg('my_api_xyz_no_id',$article_id ) ];
                die( json_encode( $result ) );
            }

            // Inhalt zusammenbauen
            $content = '<p>mach mal was sinnvolles (' . $id . ')</p>';

            // Inhalt ausgeben
            echo $content;
            exit;
        }
    }

<a name="besser-mime"></a>
## Text oder JSON - was erwartet der Client

Ebenfalls über die Header kann dem Client mitgeteilt werden, welche Art Daten er geschickt
bekommt (Mime-Type). Das ist kein Muss, erleichtert aber dem Client-Browser die Arbeit. Im Beispiel wird die
Fehlermeldung als JSON und das Ergebnis als Text übermittelt

    class rex_api_xyz extends rex_api_function
    {
        protected $published = true;  // Aufruf aus dem Frontend erlaubt

        function execute()
        {
            // Parameter abrufen und auswerten
            $id = rex_request( 'id','string','' );
            if ( !$id )
            {
                header( 'HTTP/1.1 500 Internal Server Error' );
                header( 'Content-Type: application/json; charset=UTF-8' );
                $result = [ 'errorcode' => 1, 'message' => 'Parameter "id" is missing' ];
                die( json_encode( $result ) );
            }

            // Inhalt zusammenbauen
            $content = '<p>mach mal was sinnvolles (' . $id . ')</p>';

            // Inhalt ausgeben
            header('Content-Type: text/html; charset=UTF-8');
            echo $content;
            exit;
        }
    }


<a name="besser-permit"></a>
## Darf der das? - Rechte abprüfen

Redaxo verfügt über eine Zugriffsverwaltung. Evtl. ist es ja nötig und sinnvoll, auch in der
API-Funktion die Rechte zu überprüfen und ggf. den Zugriff abzulehnen. (Das Beispiel ist jetzt sehr unkonkret.)


    class rex_api_xyz extends rex_api_function
    {
        protected $published = true;  // Aufruf aus dem Frontend erlaubt

        function execute()
        {
            // Parameter abrufen und auswerten
            $id = rex_request( 'id','string','' );
            if ( !$id )
            {
                header( 'HTTP/1.1 500 Internal Server Error' );
                header( 'Content-Type: application/json; charset=UTF-8' );
                $result = [ 'errorcode' => 1, 'message' => 'Parameter "id" is missing' ];
                die( json_encode( $result ) );
            }

            // Zugriffsrechte prüfen
            //...
            if ( $no_permission )
                header( 'HTTP/1.1 500 Internal Server Error' );
                header( 'Content-Type: application/json; charset=UTF-8' );
                $result = [ 'errorcode' => 1, 'message' => 'No permisson on object "'.$id.'"' ];
                die( json_encode( $result ) );
            }

            // Inhalt zusammenbauen
            $content = '<p>mach mal was sinnvolles (' . $id . ')</p>';

            // Inhalt ausgeben
            header('Content-Type: text/html; charset=UTF-8');
            echo $content;
            exit;
        }
    }

<a name="demo"></a>
# JS-Jalousie mit Selbstbedienung - ein Beispiel

Und damit kommen wir zu einem Anwendungsbeispiel für eine Redaxo-Seite. Das Ziel ist ein Modul, das

* die Artikel der aktuellen Kategorie auflistet (Überschriften)
* bei Klick auf die Überschrift den Artikel vom Server nachlädt (AJAX) - aber nur einmal!
* bei Klick auf die Überschrift den Artikel anzeigt
* das mehrere Artikel anzeigt - also keine echte "Jalousie"
* Verkomplikationen wie mehr als ein **ctype** ignoriert - man kann das natürlich auch einbauen.

Das Beispiel ist rudimentär, um die Funktion zu zeigen. Hier kommt auch kein Bootstrap zum Einsatz, um das Beispiel unabhängig von Frameworks zu halten. Nur JQuery ist im Spiel.

Getestet in einer Rudimentär-Umgebung aus

* Redaxo 5.3
* Addon MarkItUp
* Addon Demo-Base

Für Kategorie **Addons** wird ein neuer Startartikel mit dem Beispiel-Modul geschrieben. So sieht das Ergebnis aus:

![AJAX-Demo](assets/ajax_mit_rexapi.jpg "AJAX-Demo")


<a name="demo-html"></a>
## Das HTML

Das Modul soll HTML-Code generieren, der ungefähr so aussieht:

    <div class="klapp-auf-und-zu">
        <h2 ref="105">Das erste Kapitel</h3>
        <div></div>
        <h2 ref="107">Das zweite Kapitel</h3>
        <div></div>
        <h2 ref="108">Das dritte Kapitel</h3>
        <div></div>
    </div>

<a name="demo-css"></a>
## Das CSS

Formatiert wird natürlich mittels CSS. Das hier soll einfach nur für die nette Optik sorgen.

    .klapp-auf-und-zu > h2 {
        color: #0f0f0f;
        background: linear-gradient(135deg, rgba(238,238,238,1) 0%,rgba(204,204,204,1) 100%);
        border-left: 1px solid #404040;
        border-top: 1px solid #404040;
        margin: 1em 5%;
        padding: 0.5em;
        cursor: pointer;
    }
    .klapp-auf-und-zu > h2 + * {
        margin: 0 5% 0 10%;
    }

Nun kommt das funktionale CSS, das für die Jalousie-Effekte benötigt wird.

* Die Überschrift wird je nach Klapp-Status mit einem Pfeil nach oben oder unten versehen.
* Der Textblock selbst wird ein oder ausgeblendet.

Die Steuerung erfolgt über die Klasse **mach-zu** im H2-Element.

    .klapp-auf-und-zu > h2.mach-zu + * {
        display: none;
    }
    .klapp-auf-und-zu > h2:after{
        content: "\f106";
        font-family: "FontAwesome";
        float: right;
        margin-right: 5em;
    }
    .klapp-auf-und-zu > h2.mach-zu:after{
        content: "\f107";
    }

Außerdem können nicht aktive Elemente ausgegraut werden. Das passiert im [JS-Teil](#demo-js) über die Klasse **ich-bin-raus**.

    .klapp-auf-und-zu > h2.ich-bin-raus {
        opacity:0.5;
        cursor: inherit;
    }
    .klapp-auf-und-zu > h2.ich-bin-raus:after {
        content: '';
    }

<a name="demo-js"></a>
## Das JS

Die Überschriften erhalten eine Click-Funktion zugewiesen, die zwei Aufgaben erfüllt:

* Die Klasse **mach-zu** hinzufügen oder entfernen
* Falls noch nicht geschehen den Artikel per Ajax-Call vom Server abrufen und im Erfolgsfall in den Container hinter der Überschrift packen. Wenn h2 kein Attribut **ref** mehr hat, gilt der Inhalt als geladen.
* Im Fehlerfall die Fehlermeldung anzeigen und die Überschrift für weitere Aufrufe sperren (**ich-bin-raus**)

**So sieht das Ergebnis aus:**

    $(document).ready( function() {
        $(".klapp-auf-und-zu > h2").click( klapp_auf_und_zu );
    });

    function klapp_auf_und_zu ()
    {
        hook = $(this);
        ref = hook
                .toggleClass( "mach-zu" )
                .attr( "ref" );
        if ( ref ) {
            hook.next().load(
                "index.php",
                 "rex-api-call=xyz&article_id="+ref,
                 function( responseText,textStatus ) {
                     hook.removeAttr( 'ref' );
                     if ( textStatus == "success") return;
                     responseText = JSON.parse(responseText);
                     alert(responseText.message);
                 }
            );
        }
        return false;
    }

Es ist nur eine von mehreren Möglichkeiten, AJAX mittels **$.load** zu nutzen.

> **Bitte beachten!** Zum Aufbau der URL und der Parameter gibt es [Besonderheiten](#febe) für das Backend.


<a name="demo-modul"></a>
## Das Modul

Seine Aufgabe ist einfach. Für die aktuelle Kategorie (**REX\_CATEGORY\_ID**) werden alle Artikel und Startartikel der Unterkategorien ermittelt und der (oben)[#demo-html] beschriebene HTML-Code generiert.

    <div class="klapp-auf-und-zu">
    <?php
    $cat = rex_category::get( 'REX_CATEGORY_ID');
    $articles = array_merge ( $cat->getArticles(), $cat->getChildren() );
    $startarticle = $cat->getStartArticle()->getId();

    foreach( $articles as $article )
    {
        if ( $article->getId() == $startarticle ) continue;
        echo '    <h2 class="mach-zu" ref="' . $article->getId() . '">' . $article->getName() . '</h2><div></div>' . PHP_EOL;
    }
    ?>
    </div>

<a name="demo-api"></a>
## rex\_api\_xyz - Der PHP-Code des API

Im Kern ist die API-Funktion aus dem obigen Kapiteln bekannt. Die wesentliche Erweiterung besteht in der zusätzlichen Methode zum Senden der Fehlermeldung: **httpError**. Es soll den Code etwas übersichtlicher machen.

    <?php

    class rex_api_xyz extends rex_api_function
    {
        protected $published = true;

        function execute()
        {
            // Parameter abrufen und auswerten
            $article_id = rex_request( 'article_id','int',0 );
            if ( !$article_id )
            {
                $result = [ 'errorcode' => 1, rex_i18n::msg('my_api_xyz_no_id') ];
                self::httpError( $result );
            }

            // Artikel abrufen
            $article = new rex_article_content( $article_id );

            // Aufruf mit eingelogtem Backend-User? Dann auch Offline-Artikel anzeigen
            // sonst abwürgen
            if (!$article->getArticleId() || (!rex_backend_login::hasSession() && $article->getValue('status') == 0))
            {
                $result = [ 'errorcode' => 2, 'message' => rex_i18n::msg('my_api_xyz_no_article',$article_id) ];
                self::httpError( $result );
            }

            // Zugriffsrechte prüfen
            //...
            $no_permission = false;
            if ( $no_permission )
            {
                $result = [ 'errorcode' => 3, 'message' => rex_i18n::msg('my_api_xyz_no_permission',$article_id) ];
                self::httpError( $result );
            }

            // Artikel senden
            $content = $article->getArticle();
            self::httpSuccess( $content,'text/html' );
        }

        public static function httpError( $result )
        {
            header( 'HTTP/1.1 500 Internal Server Error' );
            header('Content-Type: application/json; charset=UTF-8');
            die( json_encode( $result ) );
        }
    }
    ?>

Diese API-Klasse muss an einer Stelle platziert werden, an der sie auch gesehen und geladen wird. Das kann z.B. im Project-Addon erfolgen (Verzeichnis **lib**).

<a name="demo-lang"></a>
## Die Sprachdatei(en)

Etwas fehlt noch. Oben wurde ja schon beschrieben, dass es sinnvoller ist, die Fehlermeldungen vom Server in der eingestellten Sprache generieren zu lassen.  

Im API-Code ist das bereits mit

    rex_i18n::msg('my_api_xyz_no_id')
    ...
    rex_i18n::msg('my_api_xyz_no_article',$article_id)
    ...
    rex_i18n::msg('my_api_xyz_no_permission',$article_id)

eingebaut. Die korespondierenden **.lang**-Einträge können ebenfalls im Project-Addon platziert werden (Verzeichnis **lang**).

**Hier das Beispiel für de_de.lang:**

    api_xyz_no_id = Parameter 'id' fehlt
    api_xyz_no_article = Artikel '{0}' nicht gefunden
    api_xyz_no_permission = Zugriff auf Artikel '{0}' nicht möglich

<a name="febe"></a>
# Frontend vs. Backend - Merkwürdige Dinge geschehen

Nur um es erwähnt zu haben.

Es müssen ja nicht ganze Artikel sein, die mittels API abgerufen werden. Für andere Fälle wäre auch ein Einsatz im Backend sinnvoll, aber da gibt es Merkwürdigkeiten.

**Beim Aufruf aus dem Frontend funktionierten**

    hook.next().load(
        "index.php",
        "rex-api-call=xyz&article_id="+ref,

und

    hook.next().load(
        "",
        "rex-api-call=xyz&article_id="+ref,

gleichwertig. Oder doch nicht?

Da der Browser fehlende Angaben, hier die Zieladresse, aus der aktuelle URL ergänzt, wird tatsächlich die Abruf-URL für die zweite Variante lauten:

    index.php?article_id=16&clang=1&rex_api_call=xyz&article_id=5

Das kann auch zu Problemen führen. In der ersten, vorzuziehenden Variante wäre die URL korrekter:

    index.php?rex_api_call=xyz&article_id=5

Aus Backend-Seiten führt die erste Variante dazu, dass noch vor der Ausführung von **rex\_api\_xyz->execute()** auf die Default-Seite **page=structure** umgeleitet wird. Wählt man die zweite Variante, unterbleibt die Umleitung und das API wird ausgeführt.

Der Grund ist wieder die automatische URL-Ergänzung, über die eine gültige Seitenangabe in die URL gelangt.

    index.php?page=irgendwas&rex_api_call=xyz&article_id=5

Alternativ kann die Seite **page=structure** auch in die Paramaterzeile geschrieben werden:

**Die Backend-Varianten sind also**

    hook.next().load(
        "index.php",
        "page=structure&rex-api-call=xyz&article_id="+ref,

bzw.

    hook.next().load(
        "",
        "rex-api-call=xyz&article_id="+ref,

Um unerwartete Seiteneffekte durch weitere Parameter aus der Seiten-URL zu vermeiden, sollte die erste Variante genutzt werden.
