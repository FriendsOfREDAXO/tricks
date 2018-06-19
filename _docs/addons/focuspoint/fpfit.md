---
title: Fokuspoint und der MM-Effekt Fokuspoint-Fit
authors: [christophboecker]
prio:
---

# Fokuspoint und der MM-Effekt Fokuspoint-Fit

CSS-gesteuertes Layout ist an sich eine feine Sache. Aber wenn die Bilder
unvorhersehbare Größen und Formate haben, wird es schon mal schwierig. Schnell ist das Layout zerschossen. 
Nicht dass es gar keine Lösung gäbe, aber ob das Ergebnis gefällt und der Aufwand tragbar ist, sei 
dahingestellt. 

Hier mal eine Beschreibung, wie mit dem Addon [**Focuspoint**](https://github.com/FriendsOfREDAXO/focuspoint/)
und dem darin enthalten Effekt **Focuspoint-Fit** der MediaManager verlässlichen Bilder-Input für das Layout erzeugt. 

- [Das Problem - warum ein neuer MM-Effekt **Fit** entstand](#A)
- [Die Sache mit dem Fokuspunkt](#B)
- [Anforderungen an den neuen Effekt **Focuspoint-Fit**](#C)
- [Wie **Focuspoint-Fit** rechnet](#D)
- [Fit ohne Fokuspunkt?](#E)
- [Höhe und Breite steuern das Ergebnis](#H)
- [Typische Anwendungen](#F)
- [**Focuspoint-Fit** ohne **Focuspoint-Addon**](#G)


<a name="A"></a>
## Das Problem - warum ein neuer MM-Effekt **Fit** entstand

Bei einem Projekt wurden für Teaser quadratische Bilder benötigte. So in der Art sollte es aussehen:

![Beispiel](assets/addons_focuspoint_fpfit/beispiel.jpg "Beispiel")

Das Quell-Material war jedoch wild gemischt was Größe und Format (Aspect-Ratio, AR) anbelangt. 

Eine Lösung wäre gewesen, bearbeitete Kopien der Originalbilder einzusetzen. Das fand ich
vom Workflow her schon immer lästig und per Saldo fehleranfällig - abgesehen davon, dass
am Ende mehrere Versionen eines Bildes im Medienpool stehen. Und was ist bei Layout-Änderungen? 

Eine andere Variante wäre, den dafür vorgesehenen MediaManager die Arbeit erledigen zu lassen. Bei wirrem
Ausgangsmaterial-Mix kommen die mitgelieferten Effekte an Ihre Grenzen.

So entstand die Idee für einen neuen Effekt "Fit", bei dem ein verlässliches Zielformat (AR)
oder noch besser eine genau vorgegebene Zielbildgröße sichergestellt wird. 
Der Preis dafür: Teile des Quellbildes müssen abgeschnitten werden, wenn die Aspect-Ratios (AR) nicht übereinstimmen. 

Der Fit-Effekt wäre somit eine intelligente Mischung aus Resize und Crop mit den Vorteilen

- verlässliches Ziel-Format, also kein zerschossenes Layout
- geringer Qualitätsverlust, da nur eine Bildumwandlung nötig ist


<a name="B"></a>
## Die Sache mit dem Fokuspunkt

Mit dem Kappen der Überstände ist es so eine Sache. Wie soll die Kappung eigentlich verteilt werden?
Verbreitet sind die Methoden

- "gleichverteilt", also links/rechts bzw. oben/unten je 50% des Überstandes
- "einseitig", also den gesamten Überstand an einer Seite. 

| einseitig<br />oben | gleichverteilt<br />oben und unten | einseitig<br />unten |
| ---- | ----- | -------------- |
| ![oben abschneiden](assets/addons_focuspoint_fpfit/test_crop_oben.jpg "oben abschneiden") | ![oben/unten abschneiden](assets/addons_focuspoint_fpfit/test_crop_beide.jpg "oben/unten abschneiden") | ![unten abschneiden](assets/addons_focuspoint_fpfit/test_crop_unten.jpg "unten abschneiden") |

Die Meisten würden sich wohl für "gleichverteilt" entscheiden - aber 
mit hoher Wahrscheinlichkeit trifft man bei jeder Variante schnell auf Bilder und Formate, in denen das gewählte Verfahren
zu einem eher ungünstigen Bildauschnitt führt. Hier mal ein schmaler mittiger Auschnitt (gleichverteilt) für einen
Seitentitel.

![Banner mit Segel](assets/addons_focuspoint_fpfit/test_banner_a.jpg "Banner mit Segel") 

Besser wäre dieser Auschnitt:

![Banner mit Rumpf](assets/addons_focuspoint_fpfit/test_banner_b.jpg "Banner mit Rumpf") 

Es geht also um die Frage, wo eigentlich der Teil des Bildes ist, der unbedingt sichtbar sein sollte. 

Das Addon [**Focuspoint**](https://github.com/FriendsOfREDAXO/focuspoint/) ermöglicht, für ein Bild im Medienpool
festzulegen, wo der optischen Mittelpunkt des Bildes liegt. Um genau diesen Punkt herum sollten
Bildauschnitte platziert werden. So läßt sich die Kappungs-Verteilung elegant steuern. 

Aus dem Effekt **Fit** wird der Effekt **Focuspoint-Fit**.

> Ja, das Beispiel mit dem Bootsbild zeigt auch, dass je nach Zielsetzung auch andere Fokuspunkte sinnvoll sein können:
das ganze Boot, nur der Rumpf, Segelnummer, Personen, .... Man muss sich halt für einen FP entscheiden.


<a name="C"></a>
## Anforderungen an den neuen Effekt **Focuspoint-Fit**

Die Anforderungen waren also:

- Arbeite mit beliebigen Bildgrößen und Formaten (Aspect-Ratio)
- Erstelle ein Zielbild in verlässlicher Größe und damit Format.
- Das Zielformat hat **immer** Priorität, ggf. werden überstehende Teile abgeschnitten.
- Ermögliche Zoom bzw. Auschnittsvergrößerung
- Orientierung am Fokuspunkt des Bildes (z.B. mit dem Addon **Focuspoint** zugewiesen)
- Fallback für den Fall, das Bilder keinen zugewiesenen Fokuspunkt haben.


<a name="D"></a>
## Wie **Focuspoint-Fit** rechnet

Ausgangspunkt ist ein Beispielbild in den Abmessungen 3072x2304 mit einem AR von 1,33 ( 4:3). 
Der Fokuspunkt ist gelb markiert und liegt bei 46% horizontal und 81% vertikal. 

![Demo-Bild](assets/addons_focuspoint_fpfit/demo_fp.jpg "Demo-Bild") 

Das Beispiel erzeugt quadratische Teaser-Bilder im Format 300x300 mit einem AR von 1:1 (also 1).
Die Einzelheiten werden jetzt Schritt für Schritt erklärt.

![Eingabemaske](assets/addons_focuspoint_fpfit/eingabe.jpg "Eingabemaske") 

Die Zielbildgröße wird fest vorgegeben. Es geht auch anders, zu diesem Sonderfall [später](#H) mehr. 

### Den Engpass ermitteln

Im ersten Rechenschritt wird ermittelt, welche Dimension eigentlich den Engpass bildet. Im Beispiel 
(Original quer, Ziel quadratisch) ist offensichtlich, dass die Höhe den Engpass bildet. Konkret wird die
Engpass-Dimension aus den Aspect-Ratios errechnet:

- Original-AR > Ziel-AR: Engpass ist die Höhe
- Original-AR < Ziel-AR: Engpass ist die Breite
- Original-AR = Ziel-AR: egal; nimm Höhe

### Den Ausschnitt berechnen

Im zweiten Rechenschritt wird der Ausschnittsrahmen genau in der Größe des Zielbildes definiert, 
also hier 300 x 300 groß. Zur Visualisierung legen wir
ihn erst einmal oben links in die Ecke des Originalbildes (roter Rahmen):

![Step 2: Ausschnitt einfügen](assets/addons_focuspoint_fpfit/demo_step2.jpg "Step 2: Ausschnitt einfügen") 

Der gelbe senkrechte Strich markiert in der Engpass-Dimension den Platz, der zwischen Ausschnittshöhe und Originalhöhe verbleibt. 
Dieser Restplatz, im Beispiel 2004px, kann mit der Einstellung __"Zoom des Ausschnitts"__ in das Zielbild genommen weren. 
Die jeweils andere Dimension des Ausschnitts wird auch neu berechnet werden, denn der AR des Zielbildes 
ist unbedingt einzuhalten.

![Eingabemaske Zoom](assets/addons_focuspoint_fpfit/eingabe_zoom.jpg "Eingabemaske Zoom") 

| Auswahl | Auswirkung | Beispiel |
| ------- | ---------- | -------- |
| 0% | Es bleibt beim Zielausschnitt | 300x300 |
| 25% | 25% vom Rest wird mit in das Zielild genommen | 801x801 |
| 50% | 50% vom Rest wird mit in das Zielild genommen | 1302x1302 |
| 75% | 75% vom Rest wird mit in das Zielild genommen | 1803x1803 |
| 100% | Der komplette Rest wird mit in das Zielild genommen | 2304x2304 |

Im weiteren Verlauf des Beispiels rechnen wir mit der Variante "50%" weiter.

![Ausschnitt auf 50%](assets/addons_focuspoint_fpfit/demo_50.jpg "Ausschnitt auf 50%") 

### Den Auschnittsrahmen um den Fokuspunkt positionieren

Im vierten Rechenschritt wird der Ausschnittsrahmen genau mittig auf den Fokuspunkt geschoben. Da der Fokuspunkt relativ weit
in der unteren Bildhälfte liegt, ragt der Rahmen folgerichtig über die Bildabmessungen hinaus. (Ah, deshalb 50%!). 

![Ausschnitt am Fokuspunkt](assets/addons_focuspoint_fpfit/demo_fp50.jpg "Ausschnitt am Fokuspunkt") 

Das entstandene Problem lässt sich - wir wollen unbedingt den AR des Zielbildes erreichen - nur auf zwei Arten lösen:

- Verkleinere den Rahmen, so dass er komplett ins Bild passt; Fokuspunkt bleibt in der Mitte des Zielbildes
- Verschiebe den Bildrahmen soweit, dass er wieder innerhalb des Bildes liegt. Der Fokuspunkt liegt dann nicht mehr in der Mitte
des Zielbildes.

Die erste Variante kommt sehr schnell an Grenzen, wenn der Fokuspunkt nah am Bildrand liegt. Daher geht Focuspoint-Fit
den zweiten Weg. Nach dem fünften Rechenschritt haben wir also folgende Ausschnittsposition:

![Ausschnitt final](assets/addons_focuspoint_fpfit/demo_target.jpg "Ausschnitt final") 

> *Achtung - Nebenwirkung "Vergrößerung"*: Was pssiert eigentlich, wenn schon der ursprüngliche Ausschnittsrahmen (=Zielgröße) 
größer ist als das Originalbild?
Dann wird der Ausschittsrahmen unter Einhaltung des Ziel-AR soweit verkleinert, dass er in der Engpass-Dimmension wieder passt. 
Die Wirkung wäre also faktisch die Vergrößerung des Originalbildes. Der Zoom-Faktor bleibt dabei ohne Wirkung, logisch.  

### Zielbild erzeugen

Zum Schluß wird per **imagecopyresampled** in nur einem Transformations-Schritt aus dem Originalbild das Zielbild errechnet.

![Zielbild](assets/addons_focuspoint_fpfit/demo_final.jpg "Zielbild") 


<a name="E"></a>
## Fit ohne Fokuspunkt

Die Sache mit dem Fokuspunkt setzt voraus, dass die Bilder auch einen Fokuspunkt
haben. Und wenn nicht? Die einfachste Variante ist wieder die Annahme, dass der Fokuspunkt in der 
Bildmitte liegt (50%/50%). Aber das wäre ja zu einfach. 

Tatsächlich bietet die Effekt-Parametrisierung an, Fallback-Werte selbst festzulegen und deren Gültigkeit zu steuern.

![Fallback](assets/addons_focuspoint_fpfit/fallback.jpg "Fallback") 

<a name="H"></a>
## Das Zielformat festlegen: Breite und Höhe

Focuspoint-Fit soll Bilder in verlässlicher Größe erzeugen. Dazu müssen Breite und Höhe des 
Zielbildes bekannt sein. Als Größenangaben sind dennoch auch variable Werte möglich. In dem Fall wird 
die Zielformatgröße aus Abmessungen des Originalbildes abgeleitet.

Was in welcher Kombination passiert zeigt die nachfolgende Tabelle. Die Beispielberechnungen beruhen
auf einem Originalbild der Abmessungen 1600x1200 (AR 4:3) bzw. 1200x1600 (AR 3:4). Das angestrebte Zielformat ist 300x300.

| Nr | Breite | Höhe | Erklärung | Zielformat<br />quer | Zielformat<br />hoch |
| --- | --- | --- | --- | --- | --- |
| 1 | 300 | 300 | Normalfall wie oben beschrieben | 300 x 300 | 300 x 300 |
| 2a | 300 | | Höhe wird über den AR des Bildes ermittelt | 300 x 225 | 300 x 400 |
| 2b | | 300 | Breite wird über den AR des Bildes ermittelt | 400 x 300 | 225 x 300 |
| 3a | 300 | 20% | Höhe ist 20% der Höhe des Originalbildes | 300 x 240 | 300 x 320 |
| 3b | 20% | 300 | Breite ist 20% der Breite des Originalbildes | 320 x 300 | 240 x 300 |
| 4a | 20% | | Breite ist 20% der Breite des Originalbildes<br />Höhe wird über den AR des Bildes ermittelt<br />(wirkt also wie "20%, 20%") | 320 x 240 | 240 x 320 |
| 4b | | 20% | Höhe ist 20% der Höhe des Originalbildes<br />Breite wird über den AR des Bildes ermittelt<br />(wirkt also wie "20%, 20%") | 320 x 240 | 240 x 320 |
| 5 | 40% | 20% | Höhe und Breite sind jeweils x% der Abmessung des Originalbildes | 640 x 240 | 480 x 320 |
| 6 | 16fr | 9fr | Kappt das Bild in das Format 16:9 | 1600 x 900 | 1200 x 675 |

### Bilder fester Größe (1)

Nur in Variante 1 wird die angestrebte verlässliche Zielgröße erzeugt. Dies ist auch der Hauptanwendungszweck für Focuspoint-Fit.

### Bild im vorgegebenen Format/Aspect-Ratio (6)

Hiermit wird ein Bild mit einem fest vorgegebenen Aspect-Ratio erzeugt.
Mangels Angabe einer Zielgröße (dann würde Variante 1 greifen) wird das Bild maximal groß werden.

**Beide** Eingabefelder müssen einen fr-Wert aufweisen. Der voreingestellte Wert des Zoom-Faktors wird ignoriert. Statt
dessen wird intern mit 100% gerechnet, um ein maximal großes Bild zu erzielen.

Dies ist die zweitbeste Variante bezogen auf die angestrebte Zielsetzung, zumindest ein verlässliches Format (AR) zu erzeugen.

### Bilder fester Breite oder Höhe (2,3)

In diesen Varianten ist eine Dimension fest vorgegeben. Bilder fester Breite eignen sich für vertikale Anordnung 
direkt untereinander, Bilder fester Höhe für zeilenweise Anordnung nebeneinander.

### Ausschnitte (4,5)

Die Größen werden in Prozent der Originaldimension angegeben. Ansonsten funktioniert es wie Variante 2. Der Ergebnisse sind, betrachtet 
man die absolute Größe, nur schwer vorher abschätzbar, wenn das Ausgangsgmaterial sich stark unterscheidet.

In der Variante 4 ist die Zoom-Option 100% sinnlos, da am Ende wieder das Originalbild entstehen würde.

<a name="F"></a>
## Typische Anwendungen

### Bilder größtmöglich auf ein Zielformat bringen

Breite und Höhe werden fest vorgegeben und der Zoom-Faktor auf 100% gestellt, um möglichst viel vom Originalbild in das Zielbild zu 
überführen. Dank des Fokuspunktes wird dort gekappt wird, wo es am wenigsten weh tut.

Das obige Beispiel mit Zoom = 100% ergibt

![Zielbild maximiert](assets/addons_focuspoint_fpfit/demo_final_100.jpg "Zielbild maximiert") 

### Bilder für Kopfzeilen/Banner erstellen

Die Bilder werden breit, aber nicht hoch mit einem AR von z.B. 4:1 oder 5:1. Zur Umsetzung gibt es zwei Varianten:

- Ein Bild fester Größe erzeugen, indem die Abmessungen vorgegeben und der Zoomfaktor z.B. auf 75% oder 100% gestellt wird.
- Alternativ kann auch nur der Aspect-Ratio angegeben werden. Die Breite wäre z.B. als 4fr und die Höhe als 1fr anzugeben.
	
### Details herausheben

Das ist ein Anwendungsfall für Zoom-Faktoren unter 100%. Wenn das Zielformat und das Quellformat sehr deutlich voneinander
abweichen, kann ein Zoom-Faktor von 0% problematisch werden, da der Ausschnitt sehr klein wäre.

Sind die Originalbilder nur wenig (na ja, so bis 20%) größer als das Zielformat, bietet sich die oft eh die 0%-Variante an.

### Passbilder

Liegen die Quellbilder in einem verlässlichen Format vor und haben einen sehr ähnlichen Fokuspunkt (z.B. eine Reihe Portrait-Fotos)
kann man auch ohne bildindividuellen Fokuspunkt zum Ziel kommen. Angenommen die "Passbilder" liegen im Format 3:4 vor und sollen
auf 1:1 gekappt werden mit 10% Kappung oben.

Rechenbeispiel? Die Original-Bilder sind in der Größe 900x1200, das Zielformat ist 300x300, der Zoom-Faktor 100%. 
Der Bildausschnitt ist also 900x960. Der verbleibende Rest von 300 px 
in der Höhe muss gekappt werden. Oben werden 10% des Bildes gekappt = 120px. Der Rest (180px) wird unten gekappt. 
Das entspricht einem Fokuspunkt vertikal von 47%; der horizontale ist 50%.

![Fallback-Parameter](assets/addons_focuspoint_fpfit/fallback_para.jpg "Fallback-Parameter") 

| Original | Ziel |
| -------- | ---- |
| ![cb](assets/addons_focuspoint_fpfit/cb.jpg "bc") | ![cb](assets/addons_focuspoint_fpfit/cb2.jpg "cb")  |

### Gleich breite Bilder für Spalten, bzw. gleich hohe Bilder für Zeilen

Die Bildgröße kann auch relativ angegeben werden. Allerdings sind relative Werte immer bezogen auf das Originalbild. Damit ist
am Ende kein verlässliches Zielformat zu erzeugen. Dennoch kann es tricky sein, diese Variante zu nutzen.

**Nur Breite angeben**

Setze man die Zielbreite fest und gibt keine Zielhöhe an, wird ein Zielbild erzeugt, dass eben genau die Zielbreite
aufweist. Der Aspect-Ratio ergibt sich aus dem AR des Originalbildes. Alle Blder haben also unabhängig vom Original-AR immer die gleiche Breite. Nur die Höhe variiert. 

(funktioniert auch mit vorgegebener Höhe; dann variiert die Breite. Nüzlich für Bilder in einer Zeile)


<a name="G"></a>
## **Focuspoint-Fit** ohne **Focuspoint-Addon**

Mit etwas Handarbeit ist auch das möglich. Es sei hier nur der Vollständigkeit halber beschrieben. 

Der Effekt Focuspoint-Fit ist zwar Teil des Addons, wird aber faktisch in den MediaManager eingebunden. Man kann also das 
Focuspoint-Addon herunterladen, die Effekt-Datei in ein anderes Addon (z.B. Projekt-Addon) kopieren und über dessen `boot.php`
aktivieren. Hier die Schritte im Detail:

- Kopiere `focuspoint/lib/class.rex_effect_focuspoint_fit.php` nach `project/lib/`.
- Übertrage die zum Effekt gehörenden Texte aus `focuspoint/lang/xx_xx.lang` in die lang-Datei des Projektes.
- Aktiviere den Effekt in der `project/boot.php` mit dem Befehl `rex_media_manager::addEffect('rex_effect_focuspoint_fit');`.

Ab dieser Stelle ist der Effekt verfügbar. Allerdings kann er nur auf Basis der vorab eingestellten Fallback-Werte
für Bilder ohne Fokuspunkt eingesetzt werden.  

Bildindividuelle Fokuspunkte werden möglich, wenn die Tabelle rex\_media mit einem zusätzlichen Meta-Feld versehen wird.
Von den zwei Feldern, die das Fokuspoint-Addon hinzufügt, nutzt Focuspoint-Fit nur den %-Wert im Feld `med_focuspoint_css`.
Feldinhalte müssen das Format `x%, y%` habe. X und Y sind ganze Zahlen. Wenn man sich nicht an das Format hält -> kann klappen, kann auch nicht - im Zweifel "Pech gehabt".

Dieses Feld müsste also angelegt werden. Wie es bearbeitet wird, ist eine andere Sache. Auch dazu müsste ersteinmal Code geschrieben und aktiviert werden. 

> Fazit: Ja, es geht. Aber es ist wesentlich einfacher und im Handling komfortabler, das Fokuspoint-Addon zu installieren. 
Und Updates spielen sich auch einfacher ein.
