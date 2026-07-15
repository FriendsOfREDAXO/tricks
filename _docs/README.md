# Tricks

Im Ordner _docs/ befinden sich die Tricks. Folgende Dinge solltest du wissen, wenn du die Tricks in diesem Ordner bearbeitest:

1. [Die Vorlage beachten](#vorlage)
2. [Metadaten für einen Trick anlegen](#metadaten)
3. [Automatisches Inhaltsverzeichnis](#toc)
4. [Navigation anpassen](#navigation)
5. [Website aktualisieren](#website-update)


<a name="vorlage"></a>
## 1. Die Vorlage beachten

Dieser Ordner enthält eine Vorlage (`vorlage.md`), in der du verschiedene Beispiele findest, wie man Tricks richtig formatiert: Überschriften, Links, Listen, Bilder, Anmerkungen, usw.


<a name="metadaten"></a>
## 2. Metadaten für einen Trick anlegen

Jeder Trick benötigt ein paar Metadaten für die Ausgabe auf der Website. Diese stehen am Anfang des Dokuments und sehen so aus:

```yaml
---
title: Überschrift des Tricks
authors: [dergel, gharlan]
prio: 1
---

# Überschrift des Tricks
```

* __`title`__  
   Entspricht der Überschrift des Tricks. Wir brauchen ihn an dieser Stelle zusätzlich zur `<h1>` im Text, damit die Website ihn einfach erfassen kann.
* __`authors`__ _(optional)_  
  Hier können bei Bedarf die Autoren des Tricks angegeben werden. GitHub-Namen, durch Komma getrennt. Wir nutzen diese Möglichkeit in der Regel nur dann, wenn Personen besonders umfangreich an einem Trick beteiligt waren, wenn sie also viel Aufwand damit hatten und wir ihnen dafür danken möchten. Alles kann, nichts muss.
* __`prio`__ _(optional)_  
  Artikel werden alphabetisch sortiert. Falls du in die Sortierung eingreifen möchtest, kannst du das mittels Prio machen, wie von REDAXO gewohnt.

Die Metadaten müssen von jeweils drei Strichen `---` eingeschlossen werden (für Details siehe [Front Matter](https://jekyllrb.com/docs/frontmatter/)) und stehen immer am Anfang des Tricks. Erst nach diesem Block folgt die Überschrift und der restliche Inhalt.


<a name="toc"></a>
## 3. Automatisches Inhaltsverzeichnis

Für ein automatisches Inhaltsverzeichnis muss in der Front-Matter eines Artikels nur `toc: true` gesetzt werden:

```yaml
---
title: Durchsuchbare Icon-Übersicht
authors: [christophboecker]
toc: true
prio:
---
```

Die Website erzeugt dann automatisch direkt nach der ersten `h1` ein Inhaltsverzeichnis aus den Überschriften `h2` und `h3`. Bestehende Anker wie `<a name="..."></a>` werden dabei weiterverwendet.


<a name="navigation"></a>
## 4. Navigation anpassen

Die Tricks-Website erkennt Artikel innerhalb der Unterordner automatisch. Wenn du aber die Ordnerstruktur anpassen möchtest, musst du dies in der Konfiguration machen:

`_data/navigation.yml`

Beispiel:

```yaml
- title: Startseite
  url: /
- title: AddOns
  url: /addons
  subitems:
  - title: Cronjob
    url: /addons/cronjob
  - title: Focuspoint
    url: /addons/focuspoint
  - title: MForm
    url: /addons/mform
…
```

Die Angabe für `url` entspricht der Ordnerstruktur, `title` wird als Bezeichnung verwendet. Kindelemente werden jeweils als `subitems` erfasst.


<a name="website-update"></a>
## 5. Website aktualisieren

Dieser Teil ist einfach, denn die Website wird bei jeder Änderung, also jedem Commit ins Repo, automatisch von GitHub aktualisiert. Dieser Absatz ist vor allem dafür da, dich zu informieren, dass es 1–2 Minuten dauern kann, bis die neuen Inhalte live sind. ¯\\\_(ツ)_/¯ 

Du kannst die Website übrigens mit recht wenig Aufwand lokal auf deinem Computer laufen lassen, um z. B. größere Anpassungen zu prüfen, bevor du sie ins GitHub-Repo gibst. Ein Anleitung dazu findest du in `SETUP.md`.
