---
title: Modulsammlung Formulargenerator
authors: [skerbis]
prio:
---

# Formulargenerator

Das Modul ist Teil der Modulsammlung

Basiert auf den Formular-Generator aus Redaxo 3.2 und do form! 

-	Es werden E-Mails wahlweise im HTML oder Text-Format erstellt.
-	Eine automatische (personalisierbare) Bestätigungs-E-Mail an den Absender steht als Option zur Verfügung.
-	Die Danke-Meldung auf der Website kann mittels WYSIWYG-Editor frei gestaltet werden.
-	Es gibt verschiedene Spamschutz-Lösungen, die verwendet werden können.
-	do form! unterstützt per SSL verschlüsselte E-Mails.
-	Die Übergabe von Post- oder Session-Variablen ist möglich.
-	Auch eine Übertragung von Dateien vom und zum Absender ist möglich.
-	Die Dateien werden wahlweise per E-Mail mit verschickt.

Das Modul ist sehr flexibel in der Konfiguration und Gestaltung. 

## Mindest-Systemvoraussetzungen:

- REDAXO 5.x
- AddOn PHPMailer
- YForm (nur wg. einer einzigen Funktion) 
- Addon: ein WYSIWYG-Editor, default ist cke5, ist einstellbar in der Modulausgabe

## Konfiguration

### Konfiguration der Eingabe 

Die Moduleingabe bietet Möglichkeit Funktionen ein- bzw. auszublenden. 

-	UPLOADS true oder false
-	SESSIONS AKTIVIEREN true oder false
-	BCC AKTIVIEREN true oder false
-	SSL-Umschalter - Muss in der Ausgabe angepasst werden (nicht in do form! 6.x)

### Konfiguration der Ausgabe

Bitte Kommentare im Quellcode oder in der Eingabe beachten.


## Hinweise 

Absender-Adresse / WICHTIG!
Die Absendermail sollte unbedingt festgelegt werden wenn die E-Mail automatisch (optional) beantwortet werden soll. Das geht über die Validierungseinstellung `sender`.

Schreibweise:

```
text|E-Mail|1|||sender
```

## Feldaufbau

typ|bezeichnung|pflicht|default|value|validierung

- An erster Stelle definiert man den Feldtyp
- Pflichtfelder werden mit einer 1 an der 3. Stelle deklariert.
- Defaultwerte können an 4. Stelle eingegeben werden.
- Bei einigen Feldern (z.B. date und select) haben die Stellen 4 und 5 eine andere Bedeutung.
- An letzter Stelle kann bei Textfeldern die Validierung festgelegt werden. (Textfelder sind u.a. auch date, email, IBAN)

## Beispiel einer Formulardefinition

```
fieldstart|Kontaktdaten
text|Name|1|||checkfield
text|Vorname|1|||name
text|Firma |
text|Straße|
text|PLZ|1|||plz
text|Ort|1|||
text|Telefon||||tel
text|Telefax||||tel
email|E-Mail|1|||sender
fieldend|
radio|Geschlecht|0|Mann;Frau|m;w|
url|Website|1|||url
IBAN|Ihre IBAN|1|DE||iban
BIC|BIC|1|||bic
date|Datum der Meldung|1|today||date
textarea|Ihre Nachricht:|1| 
upload|ZIP-Upload|0||zip||12.5m
upload|Bild-Upload|0||png;jpg;gif||5.0m
text|Bitte geben Sie nochmals Ihren Namen ein|1|||check
info|Felder mit * sind Pflichtfelder
hidden|Produkt:|1|GET_produkt
```

## Textfelder im Formulargenerator

CSS-Klasse: `.formtext` / Je nach Feld kommen noch die Klassen: `.ftext`, `.fIBAN`, `.fIBAN`, `.femail`,`.fplz` usw. hinzu.

Die Textfelder mit der Bezeichnung "Vorname" und "Nachname" können in der Bestätigungsmail mit den Platzhaltern %Vorname% und %Nachname% eingesetzt werden.

```
text|Name|1|||checkfield 
text|Vorname|1|||name 
text|Firma | 
text|Straße| 
text|PLZ|1|||plz
text|Ort|1||| 
text|Telefon||||tel 
text|Telefax||||tel 
email|E-Mail|1|||sender 
```

### GET-Variablen können 

über ein Textfeld ausgelesen werden

```
text|Titel:|1|GET_Variablenname|
```

Alternativ kann man die Variable versteckt übertragen

```
hidden|Titel:|1|GET_Variablenname|
```

### Passwörter 

```
password|Ihre Passwort|1|||
```

### Textfelder für Bankdaten 

Die IBAN wird in der Bestätigungsmail anonymisiert

```
IBAN|Ihre IBAN|1|DE||iban 
BIC|BIC|1|||bic 
```

### URL-Texteingabe 

Prüft eine URL http://*

```
url|Website|1|||url 
```

 ### Datumsfeld

Durch Eingabe von „today“ wird das aktuelle Datum als Default-Wert gesetzt.
HTML5-fähige Browser zeigen auch den Placeholder dd.mm.jjjj an.

```
date|Datum der Meldung|1|today||date 
```


## Texarea

Textblock z.B. zur Erfassung einer Nachricht, CSS-Klasse: `.formtextfield`

```
textarea|Ihre Nachricht:|1|  
```

## Radio-Buttons und Select-Felder

## Radio-Buttons

Hiermit kann man den Besuchern eine Optionsauswahl präsentieren. Die Werte werden per Semikolon getrennt.

CSS-Klasse: `.formradio`

```
radio|Geschlecht|0|Mann;Frau|m;w| 
```

### Select-Felder

Hiermit kann man den Besuchern ein Auswahlmenü präsentieren. Die Werte werden per Semikolon getrennt.
Wird das Select wie nachfolgend als Anrede-Auswahl genutzt, kann in der Bestätigungsmail %Anrede% als Platzhalter verwendet werden.

CSS-Klasse: `.formselect`

```
select|Anrede|1||;Herr;Frau
```


## Upload durch User

*upload* stellt eine Upload-Möglichkeit zur Verfügung.
Diese Funktion muss im Eingabe-Modul aktiviert sein. (siehe Quellcode)
Bei den erlaubten Dateien kann jede beliebige Endung angegeben werden. Die Werte werden per Semikolon getrennt. Bei der Angabe zur Dateigröße können die Kürzel k = Kilobyte, m = Megabyte und g = Gigabyte verwendet werden. Die maximal mögliche Uploadgröße wird aus der php.ini-Datei ermittelt und in der Moduleingabe unterhalb der Angabe zum Uploadordner eingeblendet.

```
upload|ZIP-Upload|0||zip||12.5m 
upload|Bild-Upload|0||png;jpg;gif||5.0m 
```

## Spezielles:

Sessionvariable do form! kann den Inhalt einer Sessionvariable in einem hidden-Field übertragen. Diese muss in der Eingabe definiert werden. (Aktivierung erforderlich)

```
svar|bezeichnung
```

Die Validierung `check` 
prüft ob die Eingabe dem Feld mit der Validierung „checkfield“ oder "Sendercheck" entspricht.

```
text|Bitte geben Sie nochmals Ihren Namen ein|1|||check 
info Hinweis an den Erfasser (wird nicht übertragen) CSS-Klasse: .formhinweis
info|Felder mit * sind Pflichtfelder 
```

### ilink / exlink

Interner Link: ilink

Link im neuen Fenster: exlink

CSS-Klasse: `.formlink`

Anwendung:

Der Aufbau unterscheidet sich stark von den anderen Feldern:

`ilink|id|parameter(& = & amp;)|CSS-Klasse|Bezeichnung`

Beispiel: `exlink|24|Unsere AGB`

### trennelement 

Mit diesem Feld kann man einen Abstand zwischen den einzelnen Feldern schaffen. 

CSS-Klasse: `.formtrenn` 

Verwendung: trennelement|


### headline / info 

Hiermit können Sie Zwischenüberschriften oder Hinweise erstellen headline kann auch verwendet werden um die endgültige E-Mail zu strukturieren. headline dient hierbei als Zwischenüberschrift der 2. Ebene (h2) in der E-Mail
Info wird nur auf der Website angezeigt

Verwendung:

```
headline|text der erscheinen soll
info|text der erscheinen soll
```


## Gestaltungsmöglichkeiten 

Das Formular hat die Klasse .formgen. Die CSS-Klassen der Eingabefelder entnehmen Sie bitte den Feldbeschreibungen. Jedes Feld inkl. Label ist zudem innerhalb eines DIVs mit der CSS-Kalsse .formfiled untergebracht. Dieses DIV wird bei einem Fehler (wie auch die Label) mit einer zusätzlichen CSS-Klasse belegt. Standard: .formerror. Die Klassenbezeichnung lässt sich in der Ausgabe des Moduls leicht anpassen.

### Fieldset

`fieldstart|Kontaktdaten`

`fieldend|` beendet ein fieldset


### DIV

`divstart|cssklasse` oder `divstart|#cssID`

`divend|` beendet ein DIV


## Validierung von Text-Feldern

(text, IBAN, BIC, email, date, url...) Validierungen werden auch durchgeführt, wenn das Feld kein Pflichtfeld ist.

Zur Validierung stehen folgende Funktionen zur Verfügung:

-	url - prüft die eingegebene URL
-	date - prüft das Datum
-	time - prüft die eingegebene Uhrzeit
-	name - prüft ob ein Name eingegeben wurden (bestimmte Zeichen wie - und . sind erlaubt)
-	alpha - prüft ob "nur" Buchstaben eingegeben wurden
-	digit - prüft ob eine Zahl eingegeben wurde
-	plz - 5-stellige Postleitzahlen
-	plz4 - 4-stellige Postleitzahlen (z.B. Schweiz)
-	tel - prüft ob mindestens 6 Zahlen eingegeben wurden
-	email - prüft ob eine korrekte E-Mail-Adresse eingegeben wurde
-	sender - prüft und legt die Absenderadresse des Besuchers fest
-	bic - Prüft eine BIC-Eingabe
-	iban - Prüft eine IBAN-Eingabe
-	checkfield - Festlegung des Feldes das wiederholt werden soll
-	sendercheck - Festlegung des E-Mail-Feldes das wiederholt werden soll und als Absender (sender) definiert werden soll
-	check - Prüft ob die Eingabe dem checkfield entspricht
