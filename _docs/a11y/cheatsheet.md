---
title: Cheatsheet Barrierefreiheit
authors: [FriendsOfREDAXO,skerbis,KLXM]
prio: 0
---

# Cheatsheet: Barrierefreies Webdesign

| **Kategorie**                      | **Best Practice**                                                                                         | **Beispiel/Code**                                                                 |
|------------------------------------|-----------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| **HTML Struktur**                  | Verwende semantische HTML5-Elemente wie `<header>`, `<main>`, `<footer>`, `<nav>`, etc.                      | `<main>` für Hauptinhalt, `<nav>` für Navigation                                |
| **Überschriftenhierarchie**        | Verwende `<h1>` bis `<h6>` in logischer Reihenfolge                                                        | `<h1>Seitenüberschrift</h1> <h2>Untertitel</h2>`                                |
| **ARIA-Landmarks**                 | Nutze Landmark-Rollen wie `role="main"` für wichtigen Inhalt                                                | `<main></main> <div role="main"></div>`                                                     |
| **Bilder**                         | Füge beschreibende Alt-Texte hinzu                                                                         | `<img src="bild.jpg" alt="Beschreibung">`                                        |
| **Links**                          | Beschreibende Linktexte, keine generischen wie "Hier klicken"                                               | `<a href="seite.html">Produktseite besuchen</a>`                                |
| **Formulare**                      | Immer `<label>` mit Formularfeldern verwenden, Pflichtfelder kennzeichnen                                  | `<label for="email">E-Mail</label> <input type="email" id="email" required>`    |
| **Tastaturfokus**                  | Sichtbarer Fokus-Indikator für fokussierbare Elemente                                                       | `:focus { outline: 2px solid #000; }`                                           |
| **Skiplinks**                      | Skiplinks einbauen, um direkt zum Hauptinhalt zu springen                                                   | `<a href="#main-content" class="skip-link">Zum Inhalt springen</a>`             |
| **Farben und Kontrast**            | Mindestens 4.5:1 Kontrast für Text, 3:1 für große Texte                                                     | WebAIM Contrast Checker nutzen                                                  |
| **Responsive Design**              | Verwende flexible Layouts, die sich an verschiedene Bildschirmgrößen anpassen                               | `display: flex;`, `@media`-Queries für verschiedene Breakpoints                 |
| **Schriftgrößen**                  | Verwende relative Einheiten wie `rem` für Schriftgrößen                                                     | `body { font-size: 16px; } h1 { font-size: 2rem; }`                             |
| **Zeilenabstand**                  | Zeilenhöhe mindestens 1.5 für bessere Lesbarkeit                                                            | `line-height: 1.5;`                                                             |
| **Video-Untertitel**               | Füge Untertitel zu Videos hinzu mit `<track>`                                                               | `<track kind="captions" src="subtitles.vtt" srclang="de">`                      |
| **Fehlerbehandlung in Formularen** | Klar sichtbare und ansagebare Fehlermeldungen                                                               | `<input aria-invalid="true" aria-describedby="error-id"> <div id="error-id">Fehler</div>` |
| **Automatisierte Tests**           | Tools wie axe, Lighthouse oder WAVE verwenden, um Barrierefreiheitsprüfungen durchzuführen                  | `axe.run().then(results => console.log(results))`                               |
| **Screenreader-Funktion**          | Nutze `aria-live` für dynamische Inhalte, um Screenreader-Nutzer zu informieren                             | `<div aria-live="polite">Inhalt wurde aktualisiert</div>`                       |
| **Tabellenstruktur**               | Korrekte Nutzung von `<th>` mit `scope` für Überschriften und `<caption>` für eine Beschreibung              | `<table> <caption>Übersicht</caption> <th scope="col">Spalte</th></table>`      |
| **JavaScript und Barrierefreiheit**| Fokusmanagement sicherstellen bei dynamischen Inhalten, z.B. Modals                                         | `document.getElementById('close-button').focus();`                              |


## Inhaltsverzeichnis: Barrierefreies Webdesign Cheatsheet
<a name="inhaltsverzeichnis"></a>

1.  [Struktur und Semantik](#1-struktur-und-semantik)
    -   [Grundlegende HTML-Struktur](#11-grundlegende-html-struktur)
    -   [Überschriftenhierarchie](#12-überschriftenhierarchie)
    -   [Landmarks](#13-landmarks)
    -   [Von Screenreadern ignorierte oder speziell behandelte Tags](#14-von-screenreadern-ignorierte-oder-speziell-behandelte-tags)

2.  [Inhalte](#2-inhalte)
    -   [Bilder](#21-bilder)
    -   [Links](#22-links)
    -   [Tabellen](#23-tabellen)

3.  [Formulare](#3-formulare)
    -   [Grundstruktur](#31-grundstruktur)
    -   [Fehlerbehandlung](#32-fehlerbehandlung)

4.  [Tastaturzugänglichkeit](#4-tastaturzugänglichkeit)
    -   [Fokus-Management](#41-fokus-management)
    -   [Skiplinks](#42-skiplinks)

5.  [ARIA (Accessible Rich Internet Applications)](#5-aria-accessible-rich-internet-applications)
    -   [Dynamischer Inhalt](#51-dynamischer-inhalt)
    -   [Erweiterte Widgets](#52-erweiterte-widgets)

6.  [Visuelles Design](#6-visuelles-design)
    -   [Farben und Kontrast](#61-farben-und-kontrast)
    -   [Responsive Design](#62-responsive-design)
    -   [Schriftgrößen](#63-schriftgrößen)
    -   [Zeilenabstand und Textausrichtung](#64-zeilenabstand-und-textausrichtung)

7.  [Multimedia](#7-multimedia)
    -   [Video-Untertitel](#71-video-untertitel)
    -   [Audiobeschreibungen](#72-audiobeschreibungen)

8.  [Testing](#8-testing)
    -   [Automatisierte Tests](#81-automatisierte-tests)
    -   [Manuelle Tests](#82-manuelle-tests)
    -   [Nutzertests](#83-nutzertests)

9.  [Fortgeschrittene ARIA-Techniken](#9-fortgeschrittene-aria-techniken)
    -   [Komplexe Interaktive Komponenten](#91-komplexe-interaktive-komponenten)
    -   [Dynamische Inhalte und Single-Page Applications (SPAs)](#92-dynamische-inhalte-und-single-page-applications-spas)

10. [Internationalisierung und Lokalisierung](#10-internationalisierung-und-lokalisierung)
    - [Sprachunterstützung](#101-sprachunterstützung)

11. [Performance und Barrierefreiheit](#11-performance-und-barrierefreiheit)
    - [Ladezeiten und Nutzererfahrung](#111-ladezeiten-und-nutzererfahrung)

12. [Rechtliche Aspekte und Richtlinien](#12-rechtliche-aspekte-und-richtlinien)
    - [Compliance und Standards](#121-compliance-und-standards)
    - [Dokumentation und Erklärungen](#122-dokumentation-und-erklaerungen)

13. [Barrierefreiheit mit CSS-Frameworks und Komponentenbibliotheken](#13-barrierefreiheit-mit-css-frameworks-und-komponentenbibliotheken)
    - [Tailwind CSS](#131-tailwind-css)
    - [Shoelace](#132-shoelace)
    - [Bootstrap](#133-bootstrap)
    - [UIkit 3](#134-uikit-3)
    - [Allgemeine Tipps für die Arbeit mit CSS-Frameworks](#135-allgemeine-tipps-für-die-arbeit-mit-css-frameworks)

14. [Open-Source-Lösungen für Barrierefreiheitstests und -verbesserungen](#14-open-source-lösungen-für-barrierefreiheitstests-und--verbesserungen)
    - [Übersicht der Tools](#141-übersicht-der-tools)
    - [Detaillierte Beschreibungen und Tipps](#142-detaillierte-beschreibungen-und-tipps)
    - [Allgemeine Tipps zur Nutzung von Open-Source-Barrierefreiheitstools](#143-allgemeine-tipps-zur-nutzung-von-open-source-barrierefreiheitstools)

15. [JavaScript und Screenreader](#15-javascript-und-screenreader)
    - [Unterstützung von JavaScript durch Screenreader](#151-unterstützung-von-javascript-durch-screenreader)
    - [Best Practices für barrierefreies JavaScript](#152-best-practices-für-barrierefreies-javascript)

## <a name="1-struktur-und-semantik"></a>1. Struktur und Semantik

### <a name="11-grundlegende-html-struktur"></a>1.1 Grundlegende HTML-Struktur
- Verwenden Sie semantische HTML5-Elemente

| Element | Zweck | Tipps |
|---------|-------|-------|
| `<header>` | Kopfbereich der Seite oder eines Abschnitts | Kann mehrfach auf einer Seite verwendet werden |
| `<nav>` | Hauptnavigation | Verwenden Sie `aria-label`, wenn mehrere `<nav>` vorhanden sind |
| `<main>` | Hauptinhalt der Seite | Sollte nur einmal pro Seite verwendet werden |
| `<article>` | In sich abgeschlossener Inhalt | Ideal für Blog-Posts, Nachrichtenartikel etc. |
| `<aside>` | Nebeninhalte | Für Sidebars, Werbung, verwandte Links |
| `<footer>` | Fußbereich | Kann Kontaktinformationen, Copyright etc. enthalten |

```html
<header>
  <nav>
    <!-- Navigationsinhalt -->
  </nav>
</header>
<main>
  <article>
    <h1>Hauptüberschrift</h1>
    <!-- Hauptinhalt -->
  </article>
</main>
<footer>
  <!-- Fußzeileninhalt -->
</footer>
```

### <a name="12-überschriftenhierarchie"></a>1.2 Überschriftenhierarchie
- Verwenden Sie `<h1>` bis `<h6>` in korrekter Reihenfolge

| Überschrift | Verwendung | Tipp |
|-------------|------------|------|
| `<h1>` | Hauptüberschrift der Seite | Nur einmal pro Seite verwenden |
| `<h2>` | Hauptabschnitte | Für wichtige Themenbereiche |
| `<h3>` - `<h6>` | Unterabschnitte | Logisch strukturieren, keine Ebenen überspringen |

```html
<h1>Haupttitel</h1>
<h2>Untertitel</h2>
<h3>Abschnittsüberschrift</h3>
```

### <a name="13-landmarks"></a>1.3 Landmarks
- Nutzen Sie ARIA-Landmarks für wichtige Seitenabschnitte

| Landmark Role | Verwendung | HTML5 Äquivalent |
|---------------|------------|-------------------|
| `banner` | Globale Kopfzeile | `<header>` |
| `navigation` | Hauptnavigation | `<nav>` |
| `main` | Hauptinhalt | `<main>` |
| `contentinfo` | Fußzeileninformationen | `<footer>` |
| `search` | Suchfunktionalität | Kein direktes HTML5-Äquivalent |
| `form` | Wichtige Formulare | `<form>` |
| `complementary` | Ergänzende Inhalte | `<aside>` |

```html
<header role="banner">
<nav role="navigation">
<main role="main">
<footer role="contentinfo">
```

Tipp: Bei semantischen HTML5-Elementen ist die explizite Angabe der Landmark-Rolle oft redundant. Verwenden Sie sie nur, wenn nötig oder zur Verdeutlichung.

## <a name="14-von-screenreadern-ignorierte-oder-speziell-behandelte-tags"></a>1.4 Von Screenreadern ignorierte oder speziell behandelte Tags

Screenreader behandeln verschiedene HTML-Tags unterschiedlich. 

### Üblicherweise ignorierte Tags:
- `<style>`
- `<script>`
- `<noscript>`
- `<canvas>` (ohne entsprechende Beschreibung)
- `<svg>` (ohne entsprechende Beschreibung oder Titel)

### Speziell behandelte Tags:
- `<iframe>` (der Inhalt wird ignoriert, aber der Titel wird gelesen)
- `<br>` (wird als kurze Pause interpretiert)
- `<hr>` (kann je nach Screenreader als "horizontale Linie" oder Trennung angekündigt werden)
- `<i>`, `<b>`, `<u>` (werden normalerweise ignoriert, es sei denn, sie sind mit ARIA-Rollen versehen)

### Tags, die je nach Kontext und Inhalt behandelt werden:
- `<div>` und `<span>` (normalerweise ignoriert, es sei denn, sie enthalten Text oder haben ARIA-Attribute)
- `<table>` (wird gelesen, aber die Darstellung hängt von der Komplexität und Struktur ab)

### Wichtige Hinweise:
1. `<img>` ohne Alt-Text wird unterschiedlich behandelt (manche Screenreader lesen den Dateinamen, andere ignorieren das Bild komplett)
2. Dekorative Elemente wie `::before` und `::after` in CSS werden normalerweise ignoriert
3. Versteckte Elemente (`display: none` oder `visibility: hidden`) werden in der Regel übersprungen

Tipp: Verwenden Sie semantisches HTML und ARIA-Attribute, um sicherzustellen, dass Ihre Inhalte korrekt interpretiert werden. Testen Sie mit verschiedenen Screenreadern, da es Unterschiede in der Behandlung geben kann.

## <a name="2-inhalte"></a>2. Inhalte

### <a name="21-bilder"></a>2.1 Bilder
- Fügen Sie alternative Texte hinzu

| Attribut | Verwendung | Tipp |
|----------|------------|------|
| `alt` | Beschreibung des Bildinhalts | Kurz und prägnant, aber informativ |
| `title` | Zusätzliche Informationen | Wird als Tooltip angezeigt, nicht für kritische Infos verwenden |
| `aria-labelledby` | Verweis auf separate Beschreibung | Für komplexere Beschreibungen |

```html
<img src="bild.jpg" alt="Beschreibung des Bildinhalts">
```
- Für dekorative Bilder:
```html
<img src="hintergrund.jpg" alt="">
```

Tipp: Verwenden Sie leere `alt`-Attribute nur für rein dekorative Bilder, die keine relevanten Informationen vermitteln.

### <a name="22-links"></a>2.2 Links
- Verwenden Sie beschreibende Linktexte

| Attribut | Verwendung | Tipp |
|----------|------------|------|
| `href` | Ziel-URL | Verwenden Sie relative URLs für interne Links |
| `rel` | Beziehung zum Ziel | `external` für externe Links, `noopener` für Sicherheit |
| `target` | Öffnungsverhalten | Vorsichtig verwenden, kann Nutzererfahrung beeinträchtigen |

```html
<a href="produkte.html">Unsere Produktpalette ansehen</a>
```
- Für externe Links:
```html
<a href="https://example.com" rel="external noopener">Partnerwebsite besuchen <span class="sr-only">(öffnet in neuem Tab)</span></a>
```

Tipp: Vermeiden Sie generische Linktexte wie "Klicken Sie hier" oder "Mehr". Der Linktext sollte das Ziel oder den Zweck des Links klar beschreiben.

### <a name="23-tabellen"></a>2.3 Tabellen
- Strukturieren Sie Tabellen korrekt

| Element | Verwendung | Tipp |
|---------|------------|------|
| `<caption>` | Titel der Tabelle | Kurze Beschreibung des Tabelleninhalts |
| `<thead>` | Kopfzeile der Tabelle | Enthält die Spaltenüberschriften |
| `<tbody>` | Hauptinhalt der Tabelle | Enthält die Datenzeilen |
| `<th>` | Überschriftenzellen | Verwenden Sie `scope="col"` oder `scope="row"` |
| `<td>` | Datenzellen | Für den eigentlichen Tabelleninhalt |

```html
<table>
  <caption>Produktübersicht</caption>
  <thead>
    <tr>
      <th scope="col">Produkt</th>
      <th scope="col">Preis</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Produkt A</th>
      <td>10 €</td>
    </tr>
  </tbody>
</table>
```

Tipp: Verwenden Sie Tabellen nur für tabellarische Daten, nicht für Layout-Zwecke.

## <a name="3-formulare"></a>3. Formulare

### <a name="31-grundstruktur"></a>3.1 Grundstruktur
- Verwenden Sie Labels und gruppieren Sie Formularelemente

| Element/Attribut | Verwendung | Tipp |
|------------------|------------|------|
| `<label>` | Beschriftung für Formularelemente | Immer mit `for`-Attribut verwenden |
| `<fieldset>` | Gruppierung verwandter Formularelemente | Besonders nützlich für Radiobuttons und Checkboxen |
| `<legend>` | Beschreibung für `<fieldset>` | Kurz und informativ halten |
| `required` | Kennzeichnung von Pflichtfeldern | Mit visueller Indikation kombinieren |
| `aria-describedby` | Verknüpfung mit zusätzlichen Beschreibungen | Für Hilfetexte oder Fehlermeldungen |

```html
<form>
  <fieldset>
    <legend>Persönliche Informationen</legend>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    
    <label for="email">E-Mail:</label>
    <input type="email" id="email" name="email" required>
  </fieldset>
</form>
```

### <a name="32-fehlerbehandlung"></a>3.2 Fehlerbehandlung
- Verknüpfen Sie Fehlermeldungen mit den entsprechenden Feldern

| Attribut | Verwendung | Tipp |
|----------|------------|------|
| `aria-invalid` | Kennzeichnung ungültiger Eingaben | Auf `true` setzen bei Fehler |
| `aria-describedby` | Verknüpfung mit Fehlermeldung | ID der Fehlermeldung angeben |
| `role="alert"` | Kennzeichnung von Fehlermeldungen | Für wichtige, zeitkritische Meldungen |

```html
<label for="password">Passwort:</label>
<input type="password" id="password" name="password" aria-describedby="password-error" required>
<p id="password-error" role="alert">Das Passwort muss mindestens 8 Zeichen lang sein.</p>
```

Tipp: Geben Sie klare Anweisungen zur Fehlerbehebung und positionieren Sie Fehlermeldungen nahe den betroffenen Feldern.

## <a name="4-tastaturzugänglichkeit"></a>4. Tastaturzugänglichkeit

### <a name="41-fokus-management"></a>4.1 Fokus-Management
- Stellen Sie eine logische Tab-Reihenfolge sicher
- Implementieren Sie einen sichtbaren Fokus-Indikator

| CSS-Selektor | Verwendung | Tipp |
|--------------|------------|------|
| `:focus` | Stil für fokussierte Elemente | Deutlich sichtbar, aber nicht störend gestalten |
| `:focus-visible` | Nur bei Tastaturfokus | Für differenzierte Fokus-Stile |
| `outline` | Umrandung für fokussierte Elemente | Kontrastreiche Farbe wählen |
| `box-shadow` | Alternative zu `outline` | Kann für weichere Effekte verwendet werden |

```css
:focus {
  outline: 3px solid #4A90E2;
  outline-offset: 2px;
}
```

Tipp: Entfernen Sie niemals den Fokus-Indikator vollständig. Wenn Sie ihn anpassen, stellen Sie sicher, dass er gut sichtbar bleibt.

### <a name="42-skiplinks"></a>4.2 Skiplinks
- Bieten Sie Skiplinks für Screenreader-Nutzer an

| Attribut | Verwendung | Tipp |
|----------|------------|------|
| `class="skip-link"` | Styling des Skiplinks | Normalerweise visuell versteckt, bei Fokus sichtbar |
| `href="#main-content"` | Ziel des Skiplinks | ID des Hauptinhaltsbereichs |

```html
<a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>
```

Tipp: Positionieren Sie Skiplinks als erste fokussierbare Elemente auf der Seite.

## <a name="5-aria-accessible-rich-internet-applications"></a>5. ARIA (Accessible Rich Internet Applications)

### <a name="51-dynamischer-inhalt"></a>5.1 Dynamischer Inhalt
- Verwenden Sie `aria-live` für dynamische Inhalte

| Attribut | Wert | Verwendung |
|----------|------|------------|
| `aria-live` | `off` | Standardwert, keine Ankündigung |
| | `polite` | Ankündigung, wenn der Benutzer pausiert |
| | `assertive` | Sofortige Ankündigung, wichtige Updates |
| `aria-atomic` | `true`/`false` | Gesamten Inhalt oder nur Änderungen ankündigen |
| `aria-relevant` | `additions`/`removals`/`text`/`all` | Art der relevanten Änderungen |

```html
<div aria-live="polite" aria-atomic="true">
  <!-- Dynamisch aktualisierter Inhalt -->
</div>
```

Tipp: Verwenden Sie `aria-live="assertive"` sparsam, da es die aktuelle Benutzeraktion unterbricht.

### <a name="52-erweiterte-widgets"></a>5.2 Erweiterte Widgets
- Nutzen Sie ARIA-Attribute für komplexe Komponenten

| Attribut | Verwendung | Tipp |
|----------|------------|------|
| `aria-expanded` | Zustand von ausklappbaren Elementen | `true` wenn geöffnet, sonst `false` |
| `aria-controls` | ID des kontrollierten Elements | Verknüpft Steuerung mit Inhalt |
| `aria-haspopup` | Zeigt an, dass ein Popup geöffnet werden kann | Wert kann `true`, `menu`, `listbox`, etc. sein |
| `role` | Definiert die Rolle eines Elements | Nur verwenden, wenn HTML-Semantik nicht ausreicht |

```html
<button aria-expanded="false" aria-controls="dropdown-menu">
  Menü öffnen
</button>
<ul id="dropdown-menu" role="menu" hidden>
  <li role="menuitem"><a href="#">Option 1</a></li>
  <li role="menuitem"><a href="#">Option 2</a></li>
</ul>
```

Tipp: Testen Sie komplexe Widgets gründlich mit verschiedenen Screenreadern, da die Unterstützung variieren kann.

## <a name="6-visuelles-design"></a>6. Visuelles Design

### <a name="61-farben-und-kontrast"></a>6.1 Farben und Kontrast
- Stellen Sie ausreichenden Farbkontrast sicher

| Kontrastwert | Verwendung | Tipp |
|--------------|------------|------|
| 4.5:1 | Mindestkontrast für normalen Text | Gilt für Text unter 18pt oder 14pt fett |
| 3:1 | Mindestkontrast für großen Text | Gilt für Text über 18pt oder 14pt fett |
| 3:1 | Mindestkontrast für UI-Komponenten | Gilt für Ränder von Eingabefeldern, Icons, etc. |

```css
body {
  color: #333; /* Dunkler Text */
  background-color: #fff; /* Heller Hintergrund */
}
```

Tipp: Verwenden Sie Tools wie den WebAIM Contrast Checker, um Ihre Farbkombinationen zu testen.

### <a name="62-responsive-design"></a>6.2 Responsive Design
- Implementieren Sie ein flexibles Layout

| CSS-Eigenschaft | Verwendung | Tipp |
|-----------------|------------|------|
| `display: flex` | Flexibles Box-Layout | Gut für eindimensionale Layouts |
| `display: grid` | Rasterbasiertes Layout | Ideal für zweidimensionale Layouts |
| `@media` | Medienabfragen für responsive Designs | Definieren Sie Breakpoints für verschiedene Geräte |

```css
.container {
  display: flex;
  flex-wrap: wrap;
}
.column {
  flex: 1 1 300px;
}
```

Tipp: Testen Sie Ihr Design auf verschiedenen Geräten und Bildschirmgrößen.

### <a name="63-schriftgrößen"></a>6.3 Schriftgrößen
- Verwenden Sie relative Einheiten für Schriftgrößen

| Einheit | Beschreibung | Tipp |
|---------|--------------|------|
| `rem` | Relativ zur Wurzel-Schriftgröße | Ideal für konsistente Skalierung |
| `em` | Relativ zur Eltern-Schriftgröße | Nützlich für komponenten-basiertes Styling |
| `%` | Prozentual zur Eltern-Schriftgröße | Ähnlich wie `em`, aber oft intuitiver |
| `vw` | Relativ zur Viewportbreite | Vorsichtig verwenden, kann zu extremen Größen führen |

```css
body {
  font-size: 16px; /* Basis-Schriftgröße */
}
h1 {
  font-size: 2rem; /* Relativ zur Basis-Schriftgröße */
}
```

Tipp: Eine Basis-Schriftgröße von 16px ist ein guter Ausgangspunkt. Stellen Sie sicher, dass Text auch bei 200% Zoom noch lesbar ist.

### <a name="64-zeilenabstand-und-textausrichtung"></a>6.4 Zeilenabstand und Textausrichtung

| Eigenschaft | Empfehlung | Tipp |
|-------------|------------|------|
| `line-height` | Mindestens 1.5 | Verbessert die Lesbarkeit, besonders bei längeren Texten |
| `text-align` | Linksbündig für längere Texte | Zentrierter Text kann für Nutzer mit Leseschwäche schwierig sein |
| `max-width` | Ca. 60-80 Zeichen pro Zeile | Verbessert die Lesbarkeit und verhindert zu lange Zeilen |

```css
body {
  line-height: 1.5;
  text-align: left;
}
p {
  max-width: 60ch; /* ch-Einheit entspricht der Breite der "0" im aktuellen Font */
}
```

Tipp: Vermeiden Sie vollständig gerechtfertigten Text (`text-align: justify`), da ungleichmäßige Wortabstände die Lesbarkeit beeinträchtigen können.

## <a name="7-multimedia"></a>7. Multimedia

### <a name="71-video-untertitel"></a>7.1 Video-Untertitel
- Fügen Sie Untertitel zu Videos hinzu

| Attribut/Element | Verwendung | Tipp |
|------------------|------------|------|
| `<track>` | Definiert Text-Tracks für `<video>` | Kann für Untertitel, Beschreibungen etc. verwendet werden |
| `kind` | Art des Text-Tracks | `"captions"` für Untertitel, `"descriptions"` für Audiobeschreibungen |
| `srclang` | Sprache des Tracks | Verwenden Sie standardisierte Sprachcodes (z.B. "de" für Deutsch) |
| `label` | Beschriftung für die Auswahl des Tracks | Sollte die Sprache oder Art des Tracks klar benennen |

```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="de" label="Deutsch">
</video>
```

Tipp: Bieten Sie, wenn möglich, Untertitel in mehreren Sprachen an. Stellen Sie sicher, dass die Untertitel synchron zum Gesprochenen sind.

### <a name="72-audiobeschreibungen"></a>7.2 Audiobeschreibungen
- Bieten Sie Transkripte für Audioinhalte an

| Element/Attribut | Verwendung | Tipp |
|------------------|------------|------|
| `<audio>` | Einbettung von Audiodateien | Immer mit Bedienelementen (`controls`) versehen |
| `<source>` | Quelldatei für Audio | Bieten Sie mehrere Formate für bessere Kompatibilität |
| `type` | MIME-Typ der Audiodatei | Hilft Browsern, das richtige Format zu wählen |

```html
<audio controls>
  <source src="podcast.mp3" type="audio/mpeg">
  <source src="podcast.ogg" type="audio/ogg">
  Ihr Browser unterstützt das Audio-Element nicht.
</audio>
<a href="transcript.html">Transkript lesen</a>
```

Tipp: Stellen Sie Transkripte in einem zugänglichen Textformat bereit, idealerweise auf derselben Seite wie der Audioinhalt.

## <a name="8-testing"></a>8. Testing

### <a name="81-automatisierte-tests"></a>8.1 Automatisierte Tests
- Nutzen Sie Tools wie axe oder WAVE für erste Überprüfungen

| Tool | Verwendung | Tipp |
|------|------------|------|
| axe DevTools | Browser-Erweiterung für Entwickler | Integriert sich gut in den Entwicklungsprozess |
| WAVE | Online-Tool und Browser-Erweiterung | Bietet visuelle Feedback direkt auf der Webseite |
| Lighthouse | Integriert in Chrome DevTools | Prüft Barrierefreiheit zusammen mit Performance und SEO |

Tipp: Automatisierte Tests sind ein guter Ausgangspunkt, ersetzen aber keine manuellen Tests und Nutzertests.

### <a name="82-manuelle-tests"></a>8.2 Manuelle Tests
- Führen Sie Tastatur-Navigation-Tests durch
- Testen Sie mit Screenreadern (z.B. NVDA, JAWS)

| Testmethode | Was zu prüfen ist | Tipp |
|-------------|-------------------|------|
| Tastatur-Navigation | Fokusreihenfolge, Erreichbarkeit aller Funktionen | Testen Sie ohne Maus, nur mit Tastatur |
| Screenreader-Test | Verständlichkeit der Inhalte, korrekte Ankündigungen | Lernen Sie die Grundlagen eines Screenreaders |
| Zoom-Test | Lesbarkeit und Layout bei 200% Zoom | Prüfen Sie auf horizontales Scrollen und überlappendes Layout |
| Farbkontrast-Check | Lesbarkeit von Text und Erkennbarkeit von UI-Elementen | Nutzen Sie Tools wie den WebAIM Contrast Checker |

Tipp: Erstellen Sie eine Checkliste für manuelle Tests und führen Sie diese regelmäßig durch, besonders nach größeren Änderungen.

### <a name="83-nutzertests"></a>8.3 Nutzertests
- Beziehen Sie Menschen mit Behinderungen in Ihre Testprozesse ein

| Testgruppe | Fokus | Tipp |
|------------|-------|------|
| Screenreader-Nutzer | Navigation, Verständlichkeit von Inhalten | Testen Sie mit verschiedenen Screenreader-Kombinationen |
| Tastatur-Nutzer | Bedienbarkeit ohne Maus | Achten Sie auf Fallstricke wie versteckte Inhalte |
| Nutzer mit eingeschränktem Sehvermögen | Lesbarkeit, Kontraste, Zoom-Funktionalität | Testen Sie verschiedene Kontrasteinstellungen und Zoomstufen |
| Nutzer mit kognitiven Einschränkungen | Klarheit der Sprache, Struktur der Inhalte | Achten Sie auf klare, einfache Anleitungen und konsistentes Design |

Tipp: Planen Sie Nutzertests frühzeitig ein und führen Sie sie regelmäßig durch. Das Feedback von echten Nutzern ist unersetzlich für die Verbesserung der Barrierefreiheit.

## <a name="9-fortgeschrittene-aria-techniken"></a>9. Fortgeschrittene ARIA-Techniken

### <a name="91-komplexe-interaktive-komponenten"></a>9.1 Komplexe Interaktive Komponenten

| ARIA-Attribut | Verwendung | Tipp |
|---------------|------------|------|
| `aria-hidden="true"` | Elemente von Screenreadern verstecken | Vorsichtig verwenden, nicht für fokussierbare Elemente |
| `aria-label` | Kurze Beschriftung für Elemente | Nützlich für Elemente ohne sichtbaren Text |
| `aria-labelledby` | Verknüpft Element mit seiner Beschriftung | Verwendet IDs anderer Elemente als Beschriftung |
| `aria-describedby` | Verknüpft Element mit ausführlicher Beschreibung | Gut für zusätzliche Kontextinformationen |

```html
<button aria-label="Menü schließen" class="close-button">×</button>

<h2 id="section-title">Produktübersicht</h2>
<div aria-labelledby="section-title">
  <!-- Inhalt der Produktübersicht -->
</div>
```

Tipp: Verwenden Sie ARIA sparsam und nur dann, wenn native HTML-Elemente nicht ausreichen. Zu viel ARIA kann die Zugänglichkeit verschlechtern.

### <a name="92-dynamische-inhalte-und-single-page-applications-spas"></a>9.2 Dynamische Inhalte und Single-Page Applications (SPAs)

| Technik | Verwendung | Tipp |
|---------|------------|------|
| `aria-live` Regionen | Für dynamisch aktualisierte Inhalte | Verwenden Sie `polite` für die meisten Updates |
| Fokusmanagement in SPAs | Setzen des Fokus bei Seitenwechseln | Fokussieren Sie das Hauptelement nach Navigation |
| Verlauf-Management | Ermöglicht Vor- und Zurücknavigation | Nutzen Sie die History API für bessere Zugänglichkeit |

```javascript
// Beispiel für Fokusmanagement in einer SPA
function navigateToPage(pageId) {
  // Aktualisiere den Inhalt
  updatePageContent(pageId);
  
  // Setze den Fokus auf den Hauptinhalt
  document.getElementById('main-content').focus();
}
```

Tipp: Testen Sie SPAs gründlich mit Screenreadern, um sicherzustellen, dass Seitenwechsel und dynamische Updates korrekt angekündigt werden.

## <a name="10-internationalisierung-und-lokalisierung"></a>10. Internationalisierung und Lokalisierung

### <a name="101-sprachunterstützung"></a>10.1 Sprachunterstützung

| Attribut/Technik | Verwendung | Tipp |
|------------------|------------|------|
| `lang` Attribut | Definiert die Sprache des Dokuments oder Abschnitts | Immer auf dem `<html>`-Element setzen, für Abschnitte in anderen Sprachen wiederholen |
| Zeichenkodierung | UTF-8 für universelle Zeichenunterstützung | Immer in der Kopfzeile des HTML-Dokuments angeben |
| Bidirektionaler Text | Unterstützung für LTR und RTL Sprachen | Verwenden Sie `dir` Attribut und CSS `direction` Eigenschaft |

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <!-- ... -->
</head>
<body>
    <p>Deutscher Text</p>
    <p lang="en">English text</p>
    <p lang="ar" dir="rtl">نص عربي</p>
</body>
</html>
```

Tipp: Berücksichtigen Sie bei der Gestaltung des Layouts, dass sich Textlängen in verschiedenen Sprachen stark unterscheiden können.

## <a name="11-performance-und-barrierefreiheit"></a>11. Performance und Barrierefreiheit

### <a name="111-ladezeiten-und-nutzererfahrung"></a>11.1 Ladezeiten und Nutzererfahrung

| Technik | Verwendung | Tipp |
|---------|------------|------|
| Lazy Loading | Verzögertes Laden von Inhalten | Implementieren Sie für Bilder und Videos, aber beachten Sie die Auswirkungen auf Screenreader |
| Progressive Enhancement | Grundfunktionalität ohne JavaScript | Stellen Sie sicher, dass kritische Funktionen auch ohne JS funktionieren |
| Komprimierung | Reduzieren der Dateigröße | Komprimieren Sie Bilder und CSS/JS-Dateien für schnellere Ladezeiten |

```html
<img src="placeholder.jpg" data-src="large-image.jpg" alt="Beschreibung" loading="lazy">
```

Tipp: Schnelle Ladezeiten sind besonders wichtig für Nutzer mit langsamen Internetverbindungen oder älteren Geräten. Optimieren Sie die Performance, ohne die Zugänglichkeit zu beeinträchtigen.

## <a name="12-rechtliche-aspekte-und-richtlinien"></a>12. Rechtliche Aspekte und Richtlinien

### <a name="121-compliance-und-standards"></a>12.1 Compliance und Standards

| Standard/Richtlinie | Beschreibung | Tipp |
|---------------------|--------------|------|
| WCAG 2.1 | Web Content Accessibility Guidelines | Streben Sie mindestens Level AA an |
| EN 301 549 | EU-Standard für Barrierefreiheit | Relevant für öffentliche Einrichtungen und Behörden |
| Section 508 | US-Bundesgesetz zur Barrierefreiheit | Wichtig für US-Regierungswebsites und -anwendungen |

Tipp: Halten Sie sich über Aktualisierungen der Richtlinien auf dem Laufenden. WCAG 2.2 ist in Vorbereitung und wird neue Erfolgskriterien einführen.

### <a name="122-dokumentation-und-erklaerungen"></a>12.2 Dokumentation und Erklärungen

| Dokument | Zweck | Tipp |
|----------|-------|------|
| Barrierefreiheitserklärung | Informiert über den Stand der Barrierefreiheit | Aktualisieren Sie regelmäßig und seien Sie transparent über bekannte Probleme |
| Feedback-Mechanismus | Ermöglicht Nutzern, Probleme zu melden | Stellen Sie einen einfachen Weg bereit, Barrierefreiheitsprobleme zu melden |

```html
<footer>
  <a href="/barrierefreiheitserklaerung">Barrierefreiheitserklärung</a>
  <a href="/feedback">Feedback zur Barrierefreiheit geben</a>
</footer>
```

Tipp: Eine offene und transparente Kommunikation über den Stand der Barrierefreiheit kann das Vertrauen der Nutzer stärken und hilft bei der kontinuierlichen Verbesserung.

## <a name="13-barrierefreiheit-mit-css-frameworks-und-komponentenbibliotheken"></a>13. Barrierefreiheit mit CSS-Frameworks und Komponentenbibliotheken

### <a name="131-tailwind-css"></a>13.1 Tailwind CSS

| Aspekt | Tipp | Beispiel |
|--------|------|----------|
| Farben | Nutzen Sie Tailwinds Kontrastklassen | `text-gray-900 bg-gray-100` für guten Kontrast |
| Schriftgrößen | Verwenden Sie responsive Größenklassen | `text-base md:text-lg lg:text-xl` |
| Fokus-Stile | Passen Sie Fokus-Ringe an | `focus:ring-2 focus:ring-blue-500 focus:outline-none` |
| Screenreader-only Text | Nutzen Sie die `sr-only` Klasse | `<span class="sr-only">Menü öffnen</span>` |

```html
<button class="bg-blue-500 text-white py-2 px-4 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none">
  <svg class="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20">
    <!-- Icon-Pfad hier -->
  </svg>
  <span class="sr-only">Menü öffnen</span>
</button>
```

Tipp: Tailwind bietet viele nützliche Utility-Klassen für Barrierefreiheit. Nutzen Sie diese, aber achten Sie darauf, die semantische Struktur Ihres HTML nicht zu vernachlässigen.

### <a name="132-shoelace"></a>13.2 Shoelace

| Komponente | Barrierefreiheits-Tipp | Beispiel |
|------------|------------------------|----------|
| Buttons | Nutzen Sie das `label` Attribut für Icon-Buttons | `<sl-button label="Schließen">×</sl-button>` |
| Formulare | Verwenden Sie `sl-form` für eingebaute Validierung | `<sl-form>...</sl-form>` |
| Modals | Setzen Sie den Fokus beim Öffnen | Nutzen Sie das `sl-initial-focus` Event |
| Tabs | Stellen Sie korrekte ARIA-Attribute sicher | Shoelace handhabt dies automatisch |

```html
<sl-form class="form-login">
  <sl-input label="Benutzername" required></sl-input>
  <sl-input label="Passwort" type="password" required toggle-password></sl-input>
  <sl-button type="submit">Anmelden</sl-button>
</sl-form>
```

Tipp: Shoelace-Komponenten sind standardmäßig barrierefrei gestaltet. Achten Sie trotzdem darauf, Labels und Beschreibungen korrekt zu setzen.

### <a name="133-bootstrap"></a>13.3 Bootstrap

| Komponente | Barrierefreiheits-Tipp | Beispiel |
|------------|------------------------|----------|
| Navbars | Nutzen Sie `aria-current="page"` für aktive Seiten | `<a class="nav-link" aria-current="page" href="#">Home</a>` |
| Formulare | Verwenden Sie `form-label` Klasse für Labels | `<label class="form-label" for="inputEmail">Email</label>` |
| Modals | Setzen Sie `aria-labelledby` | `<div class="modal" aria-labelledby="modalTitle">...</div>` |
| Carousel | Fügen Sie alternative Texte für Bilder hinzu | `<img src="..." class="d-block w-100" alt="Beschreibung">` |

```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Logo</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <!-- Weitere Menüpunkte -->
      </ul>
    </div>
  </div>
</nav>
```

Tipp: Bootstrap bietet viele eingebaute Barrierefreiheitsfunktionen. Stellen Sie sicher, dass Sie die empfohlenen ARIA-Attribute und Klassen verwenden.

### <a name="134-uikit-3"></a>13.4 UIkit 3

| Komponente | Barrierefreiheits-Tipp | Beispiel |
|------------|------------------------|----------|
| Off-canvas | Nutzen Sie `aria-label` für den Schließen-Button | `<button class="uk-offcanvas-close" type="button" uk-close aria-label="Schließen"></button>` |
| Dropdown | Verwenden Sie `aria-expanded` | `<button aria-expanded="false">Dropdown</button>` |
| Tabs | Stellen Sie sicher, dass Tabs mit Pfeiltasten bedienbar sind | UIkit handhabt dies automatisch |
| Modals | Setzen Sie den Fokus auf den ersten interaktiven Element | Nutzen Sie das `shown` Event |

```html
<div uk-dropdown="mode: click">
    <button class="uk-button uk-button-default" type="button" aria-expanded="false">Dropdown</button>
    <div class="uk-dropdown">
        <ul class="uk-nav uk-dropdown-nav">
            <li><a href="#">Option 1</a></li>
            <li><a href="#">Option 2</a></li>
            <li><a href="#">Option 3</a></li>
        </ul>
    </div>
</div>
```

Tipp: UIkit 3 bietet gute Grundlagen für Barrierefreiheit, aber überprüfen Sie immer die generierten ARIA-Attribute und passen Sie sie bei Bedarf an.

### <a name="135-allgemeine-tipps-für-die-arbeit-mit-css-frameworks"></a>13.5 Allgemeine Tipps für die Arbeit mit CSS-Frameworks

1.  **Semantisches HTML**: Achten Sie darauf, dass die Verwendung von Framework-Klassen nicht die semantische Struktur Ihres HTML beeinträchtigt.

2.  **Anpassung der Farbschemata**: Überprüfen Sie immer die Kontrastwerte, auch wenn Sie vordefinierte Farbschemata verwenden.

3.  **Responsive Design**: Nutzen Sie die responsive Funktionen der Frameworks, um eine gute Benutzererfahrung auf allen Geräten sicherzustellen.

4.  **Tastaturnavigation**: Testen Sie gründlich, ob alle interaktiven Elemente mit der Tastatur bedienbar sind.

5.  **ARIA-Attribute**: Ergänzen Sie bei Bedarf ARIA-Attribute, besonders bei komplexen, interaktiven Komponenten.

6.  **Screenreader-Tests**: Führen Sie regelmäßige Tests mit Screenreadern durch, um sicherzustellen, dass die Framework-Komponenten wie erwartet funktionieren.

7.  **Dokumentation**: Lesen Sie die Barrierefreiheits-Dokumentation des jeweiligen Frameworks sorgfältig.

8.  **Customizing**: Beim Anpassen von Komponenten achten Sie darauf, keine Barrierefreiheitsfunktionen zu beeinträchtigen.

## <a name="14-open-source-lösungen-für-barrierefreiheitstests-und--verbesserungen"></a>14. Open-Source-Lösungen für Barrierefreiheitstests und -verbesserungen

### <a name="141-übersicht-der-tools"></a>14.1 Übersicht der Tools

| Tool | Typ | Hauptfunktionen | Anwendungsbereich |
|------|-----|-----------------|-------------------|
| Sa11y | In-Browser-Tester | Automatische visuelle Prüfung, einfache Integration | Entwicklung, Content-Management |
| Pa11y | Kommandozeilen-Tool & CI-Integration | Automatisierte Prüfung, CI/CD-Integration | Entwicklung, kontinuierliche Integration |
| axe-core | JavaScript-Bibliothek | Umfassende Regelsätze, API für Entwickler | Entwicklung, benutzerdefinierte Tools |
| WAVE | Browser-Erweiterung & API | Visuelle Feedback, detaillierte Berichte | Entwicklung, Qualitätssicherung |
| Lighthouse | Integriert in Chrome DevTools | Performance, SEO und Barrierefreiheit | Entwicklung, Audits |
| tota11y | JavaScript-Plugin | Visuelle Annotationen, leichtgewichtig | Entwicklung, schnelles Feedback |

### <a name="142-detaillierte-beschreibungen-und-tipps"></a>14.2 Detaillierte Beschreibungen und Tipps

#### Sa11y

Sa11y ist ein in-Browser-Barrierefreiheitstester, der sich leicht in Content-Management-Systeme integrieren lässt.

**Tipps zur Verwendung:**
- Integrieren Sie Sa11y in Ihr CMS für Echtzeit-Feedback an Content-Ersteller.
- Nutzen Sie die visuellen Indikatoren, um Probleme schnell zu identifizieren.

**Beispiel-Integration:**
```html
<script src="https://cdn.jsdelivr.net/npm/sa11y@latest/dist/sa11y.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new Sa11y();
  });
</script>
```

#### Pa11y

Pa11y ist ein leistungsstarkes Kommandozeilen-Tool für automatisierte Barrierefreiheitstests.

**Tipps zur Verwendung:**
- Integrieren Sie Pa11y in Ihre CI/CD-Pipeline für automatische Tests bei jedem Build.
- Nutzen Sie benutzerdefinierte Konfigurationen für spezifische Projektanforderungen.

**Beispiel-Verwendung:**
```bash
npm install -g pa11y
pa11y https://example.com
```

#### axe-core

axe-core ist eine JavaScript-Bibliothek für Barrierefreiheitstests, die von vielen anderen Tools verwendet wird.

**Tipps zur Verwendung:**
- Integrieren Sie axe-core in Ihre Unit-Tests für kontinuierliche Barrierefreiheitsprüfungen.
- Nutzen Sie die API, um benutzerdefinierte Prüfungen zu erstellen.

**Beispiel-Integration in Tests:**
```javascript
import { axe } from 'axe-core';

test('Prüfe Barrierefreiheit der Hauptseite', async () => {
  const results = await axe(document.body);
  expect(results.violations).toHaveLength(0);
});
```

#### WAVE

WAVE (Web Accessibility Evaluation Tool) ist sowohl als Browser-Erweiterung als auch als API verfügbar.

**Tipps zur Verwendung:**
- Nutzen Sie die Browser-Erweiterung für schnelle, visuelle Prüfungen während der Entwicklung.
- Verwenden Sie die API für automatisierte Tests in größeren Projekten.

**Beispiel-API-Nutzung:**
```javascript
const WAVE = require('wave-api');
WAVE.evaluate('https://example.com')
  .then(report => console.log(report))
  .catch(error => console.error(error));
```

#### Lighthouse

Lighthouse ist in Chrome DevTools integriert und bietet umfassende Audits für Websites.

**Tipps zur Verwendung:**
- Führen Sie regelmäßige Lighthouse-Audits durch, um Barrierefreiheit zusammen mit Performance und SEO zu überprüfen.
- Nutzen Sie die CI-Integration für automatisierte Prüfungen.

**Beispiel-Verwendung in CI:**
```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v8
  with:
    urls: |
      https://example.com
    budgetPath: ./budget.json
    uploadArtifacts: true
```

#### tota11y

tota11y ist ein leichtgewichtiges JavaScript-Plugin, das visuelle Annotationen für Barrierefreiheitsprobleme bietet.

**Tipps zur Verwendung:**
- Integrieren Sie tota11y in Ihre Entwicklungsumgebung für schnelles visuelles Feedback.
- Nutzen Sie es als Schulungstool für Entwickler und Designer.

**Beispiel-Integration:**
```html
<script src="https://cdn.jsdelivr.net/npm/tota11y@0.1.6/build/tota11y.min.js"></script>
```

### <a name="143-allgemeine-tipps-zur-nutzung-von-open-source-barrierefreiheitstools"></a>14.3 Allgemeine Tipps zur Nutzung von Open-Source-Barrierefreiheitstools

1.  **Kombination von Tools**: Verwenden Sie mehrere Tools, da jedes seine Stärken und Schwächen hat.
2.  **Regelmäßige Tests**: Integrieren Sie Barrierefreiheitstests in Ihren regulären Entwicklungsprozess.
3.  **Automatisierung**: Nutzen Sie CI/CD-Integrationen für kontinuierliche Überwachung.
4.  **Manuelle Überprüfung**: Verlassen Sie sich nicht ausschließlich auf automatisierte Tests. Manuelle Prüfungen bleiben wichtig.
5.  **Schulung**: Nutzen Sie diese Tools, um Ihr Team in Barrierefreiheitspraktiken zu schulen.
6.  **Dokumentation**: Halten Sie die Ergebnisse Ihrer Tests fest und dokumentieren Sie Verbesserungen.
7.  **Community-Engagement**: Beteiligen Sie sich an den Open-Source-Communities dieser Tools, um von Erfahrungen anderer zu profitieren und beizutragen.

## <a name="15-javascript-und-screenreader"></a>15. JavaScript und Screenreader

### <a name="151-unterstützung-von-javascript-durch-screenreader"></a>15.1 Unterstützung von JavaScript durch Screenreader

Die Unterstützung von JavaScript durch Screenreader hat sich in den letzten Jahren erheblich verbessert, aber es gibt immer noch einige wichtige Punkte zu beachten:

- Die meisten modernen Screenreader unterstützen JavaScript.
- Die Unterstützung kann je nach Screenreader, Browser und Betriebssystem variieren.
- Einige Nutzer deaktivieren JavaScript aus Sicherheits- oder Performance-Gründen.
- Dynamisch generierte Inhalte können übersehen werden, wenn sie nicht korrekt implementiert sind.

| Screenreader | JavaScript-Unterstützung |
|--------------|--------------------------|
| JAWS         | Gut                      |
| NVDA         | Sehr gut                 |
| VoiceOver    | Gut                      |
| Narrator     | Verbessert sich stetig   |

### <a name="152-best-practices-für-barrierefreies-javascript"></a>15.2 Best Practices für barrierefreies JavaScript

1. **Progressive Enhancement**
   - Stellen Sie sicher, dass die Kernfunktionalität ohne JavaScript verfügbar ist.
   - Verwenden Sie JavaScript, um die Benutzererfahrung zu verbessern, nicht um sie zu ermöglichen.

   ```html
   <button onclick="submitForm()" type="submit">Senden</button>
   ```

2. **ARIA Live Regions**
   - Verwenden Sie `aria-live` für dynamisch aktualisierte Inhalte.
   - Wählen Sie den passenden Wert: `polite`, `assertive` oder `off`.

   ```html
   <div aria-live="polite" id="status-message"></div>
   ```

   ```javascript
   document.getElementById('status-message').textContent = 'Formular erfolgreich gesendet';
   ```

3. **Fokusmanagement**
   - Setzen Sie den Fokus nach dynamischen Änderungen korrekt.
   - Vermeiden Sie unerwartete Fokuswechsel.

   ```javascript
   function openModal() {
     const modal = document.getElementById('modal');
     modal.style.display = 'block';
     document.getElementById('modal-close-btn').focus();
   }
   ```

4. **Tastaturunterstützung**
   - Stellen Sie sicher, dass alle JavaScript-gesteuerten Interaktionen auch mit der Tastatur möglich sind.
   - Implementieren Sie benutzerdefinierte Tastatursteuerungen für komplexe Widgets.

   ```javascript
   element.addEventListener('keydown', function(event) {
     if (event.key === 'Enter' || event.key === ' ') {
       // Aktion ausführen
     }
   });
   ```

5. **Vermeiden Sie automatische Aktualisierungen**
   - Geben Sie Nutzern die Kontrolle über Inhaltsaktualisierungen.
   - Wenn automatische Updates notwendig sind, informieren Sie die Nutzer darüber.

   ```html
   <div aria-live="polite">
     Neue Nachrichten werden alle 5 Minuten geladen. 
     <button onclick="toggleAutoUpdate()">Automatische Updates deaktivieren</button>
   </div>
   ```

6. **Fehlerbehandlung und Feedback**
   - Kommunizieren Sie Fehler und Statusänderungen klar und zugänglich.
   - Verwenden Sie ARIA-Attribute wie `aria-invalid` und `aria-describedby`.

   ```html
   <input type="text" id="username" aria-describedby="username-error">
   <div id="username-error" aria-live="polite"></div>
   ```

   ```javascript
   function validateUsername() {
     const input = document.getElementById('username');
     const error = document.getElementById('username-error');
     if (input.value.length < 3) {
       input.setAttribute('aria-invalid', 'true');
       error.textContent = 'Benutzername muss mindestens 3 Zeichen lang sein.';
     } else {
       input.removeAttribute('aria-invalid');
       error.textContent = '';
     }
   }
   ```

7. **Dynamische Inhalte**
   - Verwenden Sie `aria-busy="true"`, während Inhalte geladen werden.
   - Aktualisieren Sie den Seitentitel (`<title>`), wenn sich der Hauptinhalt ändert.

   ```html
   <div id="content" aria-busy="false">
     <!-- Inhalt hier -->
   </div>
   ```

   ```javascript
   async function loadContent() {
     const content = document.getElementById('content');
     content.setAttribute('aria-busy', 'true');
     // Inhalt laden
     content.setAttribute('aria-busy', 'false');
     document.title = 'Neue Seite - Meine Website';
   }
   ```

8. **Testing**
   - Testen Sie mit verschiedenen Screenreadern (JAWS, NVDA, VoiceOver, etc.).
   - Führen Sie Tests mit deaktiviertem JavaScript durch.
   - Nutzen Sie automatisierte Testing-Tools wie axe-core.

   ```javascript
   import { axe } from 'axe-core';

   axe.run().then(results => {
     console.log(results.violations);
   });
   ```

Tipp: Orientieren Sie sich an den WAI-ARIA Authoring Practices für die Implementierung komplexer Widgets und Interaktionen. Diese bieten detaillierte Anleitungen für die Erstellung barrierefreier interaktiver Elemente.
