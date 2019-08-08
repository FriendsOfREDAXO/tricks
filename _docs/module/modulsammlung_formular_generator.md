---
title: Modulsammlung Formulargenerator
authors: [skerbis]
prio:
---

# Formulargenerator

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

•	UPLOADS true oder false
•	SESSIONS AKTIVIEREN true oder false
•	BCC AKTIVIEREN true oder false
•	SSL-Umschalter - Muss in der Ausgabe angepasst werden (nicht in do form! 6.x)

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





