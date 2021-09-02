---
title: Versionsnummer (semver) und Changelog
authors: [marcohanke]
prio:
---

# Versionsnummer (nach semver) und Changelog richtig pflegen

- [Einleitung](#intro)
- [Versionsnummer vergeben](#version)
- [Changelog pflegen](#changelog)
- [Alles viel zu aufwändig? Nein!](#ablauf)
- [Versionsnummern und Changelogs in FOR Projekten](#for)

<a name="intro"></a>
## semver, changelog - Was soll der Quatsch?
Richtig gepflegte Versionsnummern und ein vernünftiger gepflegter Changelog gehören nicht nur zum guten Ton der Softwarentwicklung, sondern sparen oft Zeit und Ärger. Es lohnt sich also die richtige Verwendung zu verinnerlichen.

<a name="version"></a>
## Versionsnummer
Versionsnummern nach [semver (semantic versioning)](https://semver.org/lang/de/) zu vergeben ist super einfach und super hilfreich.
Die Versionsnummer ist 3 geteilt also zum Beispiel **1.0.0** die erste Stelle beschreibt ein **Major Update** die zweite Stelle ein **Minor Update** und die dritte Stelle einen **Patch**.

### Patch (Bugfix)
Wird im Projekt ein Fehler behoben der sonst keine Auswirkung auf das Projekt hat, also alles noch so funktioniert wie zuvor und es keine neuen Funktionaliäten gibt, spricht man von einem Patch. Die dritte Stelle der Version wird um einen Zähler erhöht. *Beispiel: Ein Icon saß nicht auf der richtigen Höhe*
> Aus Version 1.0.0 wird Version 1.0.1
>**Das Update kann bedenkenlos durchgeführt werden**

### Minor (Neues Feature)
Wird im Projekt ein neues Feautre integriert, das sonst keine Auswirkung auf das Projekt hat, also alles noch so funktioniert wie zuvor, spricht man von einem Minor Update. Diee zweite Stelle der Version wird um einen Zähler erhöht. *Beispiel: Es gibt ein neues Icon im Set*
> Aus Version 1.0.0 wird Version 1.1.0
>**Das Update kann bedenkenlos durchgeführt werden, ggf. schaut man sich die neuen Features an.**

### Major (Breaking Changes)
Jede Anpassung (egal wie banal) die bestehende Funktionalitäten so verändert, dass sie nicht mehr wie zuvor funktionieren (ein Breaking Change) führt zu einem Major Update. *Beispiel: Ein altes, vermutlich nicht verwendetes Icon wird gelöscht* Vielleicht hat irgendwer das Icon doch im Einsatz und für Ihn ist es essentiell zu erfahren dass es nun nicht mehr da ist.
> Aus Version 1.0.0 wird Version 2.0.0
>**Vor einem Update solltem man sich in jedem Fall den Changelog ansehen und die Breaking Changes prüfen**

### Pre-Release (beta Versionen)
Wird eine Beta oder Alpha Version veröffentlicht, hängt man die Information zusätzlich mit einem Bindestrich an die Versionsnummer an
> Aus Version 1.0.0 wird Version 2.0.0-beta.1
> **Achtung: Beta Versionen sind noch nicht final getestet und können sich bis zum Release noch erheblich ändern**


<a name="changelog"></a>
## Changelog
Oft wird das pflegen eines Changelogs als nervig empfunden, trotzdem überwiegen hier hoft die Vorteile. Es lässt sich jederzeit schnell nachvollziehen, wann welche Änderungen vorgenommen wurden und man kann im Zweifel auf eine älter Version ausweichen. Außerdem kann man Teile des changelogs anschließend als release note verwenden.

### Changelog vorgaben
Theoretisch kann man Changelogs pflegen wie man möchte, es haben sich aber ein paar Dinge etabliert.
- Die Datei CHANGELOG.md sollte im Root des Projektes liegen und in Markdown geschrieben werden.
- Am Anfang steht der Projekt Name
- Jedes Release erhält einen eigenen Abschnitt mit Versionsnummer und Datum
- Im Abschnitt sollten die Änderungen kurz, gut verständlich und strukturiert aufgeführt werden
- Breaking Changes, Features und Bugfixes (wie oben Beschrieben) sollten so beschrieben werden.
- Optional kann man weitere Dinge mit auflisten bzw. Gliedern. (Zum Beispiel Deprecated - Funktionalitäten die in Zukunft entfernt werden)

### Changelog Beispiel
```
# Changelog - www.project.tld

##[UNRELEASED] - 21-12-31
### 💥 Breaking changes
* Klasse **my-class** entfernt

### 💣 Deprecated *(wird im nächstene Release entfernt)*

### 🚀 Features

### 🐛 Bugfixes

### 📄 Dokumentation

### 📎 Vendor Updates

 ---

 ##[3.0.0] - 21-12-01
### 💥 Breaking changes
* Klasse **my-class** entfernt

### 💣 Deprecated *(wird im nächstene Release entfernt)
* Klasse **my-class** wird entfernt

### 🚀 Features
* Neuer MM-Effekt *Funny* hinzugefügt
* Neue Schrift *Redaxo-Sans* hinzugefügt

### 📎 Vendor Updates
* jQuery 3.5 -> 3.6 aktualisiert

 ---

```
<a name="ablauf"></a>
## Alles viel zu Aufwändig? Nein !
1. Am Anfang des Changelogs ist ein Abschnitt [UNRELEASED]
2. Nach jeder fertigen Änderung schreibt man eine Zeile in den entsprechenden Bereich (Der Text kann ggf. gleichzeitig als CommitMessage genutzt werden)
3. Beim Release schaut man im Changelog ob es BreakingChanges, Features oder Bugfixes gab, passt die Versionsnummer und das Datum an.
**Kein Grübeln mehr über die Versionsnummer mehr und als Sahnehäubchen hat man schon eine (fast) fertige Releasenote.**


<a name="for"></a>
## Versionsnummern und Changelogs in FOR Projekten
Richtig geführte Versionsnummern und sauber gepflegte Changelogs verbessern die Qualität der FOR Projekte. Es wäre wünschenswert wenn man sich auf einen Changelog-Standard einigen könnte und danach arbeitet.
