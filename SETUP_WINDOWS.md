# Setup für Windows 10

Dieses Tutorial zeigt, wie ihr Ruby inkl. erforderlicher Zusatzpakete unter Windows 10 installiert. Ein Account mit Admin-Rechten wird dabei vorausgesetzt. Entsprechend finde

1. __Ruby__ herunterladen und installieren, falls noch nicht vorhanden

    https://rubyinstaller.org/downloads/

    Am besten das empfohlene Paket nehmen. Im Installationsprozess werden ggf. Auswahl-Optionen angezeigt. Wenn ihr euch nicht auskennt, führt das aus, was vorgeschlagen wird.

    Im Standard-Prozess wird Ruby unter **C:\Ruby26-x64** installiert, wobei die 26 für Version 2.6 steht. Für die weiteren Schritte wird in diesem Tutorial von diesem Speicherort ausgegangen.

2. __Ruby Konsole__ öffnen

    Falls das Konsolen-Fenster nach der Installation nicht mehr offen ist, müsst ihr es neu öffnen. Im Windows-Startmenü solltet ihr unter _"Zuletzt hinzugefügt"_ finden: _"Start Command Prompt with Ruby"_.

    Wenn ihr ein alphabetisch gruppiertes Startmenü nutzt, findet ihr diesen Shortcut auch unter _"R"_ > _"Ruby xxx with MSYS2"_.

    Sollte auch das nicht gehen, legt euch einen neuen Shortcut (auf dem Desktop) an mit folgendem Ziel:
    `C:\Windows\System32\cmd.exe /E:ON /K C:\Ruby26-x64\bin\setrbvars.cmd` wobei entsprechend euer installierten Version natürlich der Pfad angepasst werden muss.

3. __Bundler__ installieren, falls noch nicht vorhanden

     In der Ruby-Konsole folgendes ausführen:

        > gem install bundler

4. __Bundles__ installieren

        > bundle install

5. __Jekyll starten__

     Jekyll ist ein Ruby-Server, der mit den zuvor installierten Zusatzpaketen (bundler) mit installiert wurde.

     In der Ruby-Konsole: Wechselt zunächst in das Verzeichnis wo euer Tricks-Projekt (oder -Ordner) liegt. Anschließend führt folgendes aus:

        > bundle exec jekyll serve

    Falls folgender Fehler ausgegeben wird ...

    ```
    jekyll 3.8.5 | Error:  No source of timezone data could be found.
    Please refer to http://tzinfo.github.io/datasourcenotfound for help resolving this error.
    ```

    ... macht folgendes:

    Zunächst muss ein weiterer Gem zum Timezone-Handling installiert werden:

    ```
    gem install tzinfo-data
    ```

    dann öffnet ihr die Datei **Gemfile** im Tricks-Projekt (Root) und ergänzt folghendes:

    ```
    # Windows does not include zoneinfo files, so bundle the tzinfo-data gem
    gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
    ```

    Wenn alles glatt geht, müsstet ihr eine Ausgabe ähnlich der folgenden erhalten:

    ```
    Configuration file: C:/Tricks-Projekt/_config.yml
                Source: C:/Tricks-Projekt/
           Destination: C:/Tricks-Projekt/_site
     Incremental build: disabled. Enable with --incremental
          Generating...
       GitHub Metadata: No GitHub API authentication could be found. Some fields may be missing or have incorrect data.
                        done in 8.895 seconds.
      Please add the following to your Gemfile to avoid polling for changes:
        gem 'wdm', '>= 0.1.0' if Gem.win_platform?
     Auto-regeneration: enabled for 'C:/Tricks-Projekt'
        Server address: http://127.0.0.1:4000/tricks/
      Server running... press ctrl-c to stop.
    ```

    Danach ist die Website unter `http://localhost:4000/tricks/` verfügbar.


---

Weitere Infos zur Installation, zu Updates und Weiterem findet ihr ganz unten im Original-Tutorial (SETUP.md), welches für Unix/Mac geschrieben wurde.
