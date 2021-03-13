# Setup

Alles Nachfolgende muss in einer Konsole ausgeführt werden.

Um die Website lokal einzurichten, sind folgende Schritte notwendig:

1. __Ruby >= 2.1__ installieren, falls noch nicht vorhanden

    ⚠️ Hinweis für Mac-User: macOS Sierra bringt leider nur Ruby 2.0 mit. Du musst dir deshalb manuell ein neueres installieren. Am besten geht das mit Tools wie [Rbenv](http://rbenv.org) oder [RVM](https://rvm.io) (siehe [Kurzanleitung](#ruby-installieren-oder-aktualisieren) unten).

    So kannst du prüfen, welche Ruby-Version bei dir gerade läuft:

        $ ruby --version


2. __Librarys__ installieren, falls noch nicht vorhanden

        $ apt install build-essential patch ruby-dev libffi-dev zlib1g-dev liblzma-dev

3. __Bundler__ installieren, falls noch nicht vorhanden

        $ gem install bundler

    Sollte es zu einer Fehlermeldung wie dieser kommen:

        ERROR:  While executing gem ... (Gem::FilePermissionError)
        You don't have write permissions for the /var/lib/gems/2.3.0 directory.

    sind Root-Rechte für die Installation notwendig.
    Für alle weiteren Befehle sind keine Root-Rechte mehr notwendig.

4. __Bundles__ installieren

        $ bundle install

    Sollte es zu einer Fehlermeldung wie dieser kommen:

        Your user account isn't allowed to install to the system RubyGems.
        You can cancel this installation and run:

        bundle install --path vendor/bundle

    starte die Installation wie angegeben mit:

        $ bundle install --path vendor/bundle

    Damit wird im aktuellen Verzeichnis ein Verzeichnis `vendor/bundle` angelegt und die Installation darin durchgeführt.

5. __Jekyll starten__ - startet den Server für das aktuelle Projekt

        $ bundle exec jekyll serve

    Danach ist die Website unter `http://localhost:4000/tricks/` verfügbar.

Weitere Dokumentation zur Verwendung von Jekyll findet sich hier: https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/

## Ruby installieren oder aktualisieren

- **Ruby Aktualisierung auf dem Mac**

    Terminal öffnen und folgenden Befehl eingeben

        $ \curl -sSL https://get.rvm.io | bash -s stable --ruby

    Wenn die Installation durch ist, ein neues Terminalfenster öffnen und den Befehl `rvm list known` absetzen. Das zeigt eine Liste aller Ruby Versionen. Ist die Version 2.4 nicht dabei, kann man mit `rvm install ruby-2.4.0` diese installieren. Mit `ruby -v` erfährt man die aktuell genutzte Version. Sollte es eine ältere Version als 2.4 sein, kann man mit `rvm use ruby-2.4.0` das anpassen.

    Sollte die Installation schieflaufen, überprüfe, ob die _XCode Command Line Developer Tools_ installiert sind:

        $ xcode-select --install

## Anmerkungen

* ⚠️ Diese Warnung im Terminal beim Start von Jekyll kannst du normalerweise ignorieren:

        GitHub Metadata: No GitHub API authentication could be found. Some fields may be missing or have incorrect data.

    Sie erscheint, weil der Zugriff auf die API limitiert ist, wenn du die Seite lokal ausführst. Alle für uns relevanten Daten sind jedoch bereits vorhanden, und es ist normalerweise nicht nötig, sich für den API-Zugriff zu authorisieren.

* Sollte deine IP jedoch ins API-Limit gelaufen sein, kommst du leider nicht darum herum, einen __Personal access token__ zu erstellen. Die Option dafür findest du innerhalb der Settings deines GitHub-Profils ([Anleitung bei GitHub](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)), und der Token benötigt lediglich den Scope für `public_repo`.

    Den Token benutzt du am einfachsten so, dass du ihn beim Start von Jekyll verwendest:

        $ JEKYLL_GITHUB_TOKEN=DEIN_TOKEN bundle exec jekyll serve

* Hier findest du eine Dokumentation bei GitHub darüber, wie man Jekyll lokal verwendet: https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/


## GitHub Actions

Wir nutzen GitHub Actions, um in regelmäßigen Abständen (`schedule`) die Website zu aktualisieren.

Zu beachten ist dabei, dass der [`GITHUB_TOKEN`](https://docs.github.com/en/actions/reference/authentication-in-a-workflow#about-the-github_token-secret) nicht über die notwendigen Rechte verfügt, um die Aktualisierung anzustoßen. Es muss stattdessen ein Personal Access Token (PAT) von einem Nutzer mit Schreibrechten (`write`) auf das Repo — wir benutzen dazu üblicherweise den [FOR Bot](https://github.com/FriendsOfREDAXO-T) — eingerichtet werden. Dieser benötigt lediglich den Scope `public_repo` und wird anschließend als __Repository Secret__ hinterlegt, so dass er innerhalb der GitHub Actions benutzt werden kann.


## Travis CI

_(Update 2021: Statt Travis CI nutzen wir inzwischen GitHub Actions.)_

Bei Travis läuft ein täglicher Cronjob, um die Website zu aktualisieren, auch wenn keine Commits gemacht worden sind. Damit Travis auf die GitHub-Metadaten des Repositorys zugreifen kann, muss ein GitHub-Token angegeben werden. Dieser kann in einem der verknüpften GitHub-Accounts (also jedem FOR-Mitglied) angelegt werden unter »Settings > Developer settings > [Personal access tokens](https://github.com/settings/tokens)«. Er benötigt lediglich die Permission `public_repo`.

Wir benutzen die Travis CLI, um damit ein Secret zu generieren, der in der `.travis.yml` im Repo hinterlegt wird. Die Anleitung davon gibt es hier: [Encryption keys](https://docs.travis-ci.com/user/encryption-keys).  
In Kurzform:

```bash
travis encrypt GITHUB_TOKEN="{hier der GitHub Token}" --add
```
