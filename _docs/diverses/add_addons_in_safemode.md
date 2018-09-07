---
title: Zusätzliche AddOns im Safemode starten
authors: [dtpop, alexplusde, gharlan]
prio:
---

# Zusätzliche AddOns im Safemode starten

In bestimmten Situationen kann es sinnvoll sein im Safemode zusätzliche AddOns zur Verfügung zu haben. Dies kann beispielsweise der Adminer sein.

Der Safemode startet AddOns, die als `setup_addons` in der Datei `data/core/config.yml` eingetragen sind. Wird hier ein zusätzliches AddOn eingetragen, steht es auch im Safemode zur Verfügung.

## Beispiel

```yml
setup_addons:
    - backup
    - be_style
    - adminer
```

Die Datei `config.yml` steht dem Entwickler für eigene Einträge zur Verfügung und wird weder durch den Installer noch das Setup überschrieben.

Damit dieser tolle Tipp nicht ganz so leer bleibt, noch etwas Text dazu ...

Man sollte es nicht übertreiben mit den zusätzlichen AddOns im Safemode, schließlich kann jedes AddOn einen Ooops erzeugen und dann ist der Safemode auch kein Safemode mehr.
