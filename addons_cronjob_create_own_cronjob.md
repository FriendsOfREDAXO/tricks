# Eigenen Redaxo Cronjob erstellen

**Ziel: Archivieren von Artikeln mit dem ADDON:CRONJOB (nach vorgegeben Zeitraum)** 

Was wird benötigt:
- MetaInfoFeld: (select) Zur Auswahl des Zeitraums, ab wann archiviert werden soll
- eigene Cronjob Datei (cronjob.php)
- 2 Kategorien im Redaxo CMS: News + News-Archiv (wobei die Kategorienamen frei gewählt werden können!)

**Schritt-für-Schritt-Anleitung**

1. Werden die beiden Kategorien im Redaxo CMS angelegt:
- Kategorie: "News"
- Kategorie: "News-Archiv"

2. Im Addon `Meta Infos` unter `Artikel` ein neues Feld `archive_period` einfügen:

```
  Spaltenname: archive_period
  Feldbezeichnung: Archivieren nach Zeitraum (Tagen) ausgehend vom Erstelldatum:
  Feldtyp: select
  Parameter: 0:nicht archivieren|7:7|14:14|30:30|60:60|90:90
  In allen Kategorien verfügbar: Neine (abgehakt)
  Nur in folgenden Kategorien verfügbar: News, News-Archiv
```
Nun könnt Ihr ein paar Test-Artikel in der Kategorie "News" anlegen und den jeweiligen Zeitraum unterschiedlich einstellen (rein zum testen)

3. Datei cronjob.php anlegen und im CMS Dateisystem ablegen

In diesem Beispiel wird dazu das AddOn:project verwendet. In dem `project`-Addon (redaxo/src/addons/project/) eine Datei (cronjob.php) in das Unter-Verzeichnis /lib/ erstellen bzw. hochladen.
Info: Die Datei muss nicht zwingend cronjob.php lauten. Wird aber i.R. so auch bei anderen Addons verwendet


4. Im `project`-Addon in der /lib/`cronjob.php` wird der Code für den eigenen CRONJOB eingefügt:
Als erstes extenden wir die CLASS rex_cronjob und vergebn hier den erweiterten CLASS-Name an

```
class rex_cronjob_archive_status extends rex_cronjob
{
}
```

folgende Methoden werden benötigt
- execute() Das eigentliche Script, was ausgeführt werden soll
- getTypeName() = Bezeichnung des CronJobScripts in der Auswahl des AddOns:Cronjob
- getParamFields() = Hier können weitere Felder dem CronJob im backend hinzugefügt werden
In diesem Beispiel werden 3 ParamFields an den CRONjob hinzugefügt:
-- LINK-Auswahl "News Artikel/Kategorie"
-- LINK-Auswahl "News-Archiv Artikel/Kategorie"
-- CHECKBOX - mail an Admin versenden (ja/nein)

**Was passiert in dem Script**
Im ersten Abschnitt wird überprüft ob das `MetaInfo`-Feld "art_archive_period" vorhanden ist. Wenn ja gehts weiter, wenn nein wird ein Fehler ausgegeben.
Im zweiten Schritt wird das eigentlich Vorhaben (Artikel zu archivieren) abgehandelt. Am Ende des Scripts (getParamFields) werden die zusätzlichen Felder für Link-Auswahl (News, News-Archiv, Mail Checkbox) in einem Array() definiert.

Info: Diversen Typen (type) können dafür verwendet werden:
- text
- textarea
- media
- medialist
- link
- linklist
- select
- checkbox
- radio

Beispiel type:`text`
```
'label' => 'Die URL',
'name' => 'url',
'type' => 'text',
'default' => 'http://',
```

Beispiel type:`select`
```
'label' => rex_i18n::msg('search_it_generate_actions_title'),
'name' => 'action',
'type' => 'select',
'options' => [
    1 => rex_i18n::msg('search_it_generate_full'),
    2 => rex_i18n::msg('search_it_generate_columns'),
    3 => rex_i18n::msg('search_it_generate_articles')],
'default' => '1',
'notice' => rex_i18n::msg('search_it_generate_actions_title')
```


5. Der komplette Code der cronjob.php (redaxo/src/addons/project/lib/cronjob.php)
```
<?php
class rex_cronjob_archive_status extends rex_cronjob
{
    public function execute()
    {
        $metaInfoField_Select = 'art_archive_period';

        $sql = rex_sql::factory();
        $sql->setQuery('
            SELECT  name
            FROM    ' . rex::getTablePrefix() . 'metainfo_field
            WHERE   name="'.$metaInfoField_Select.'"
        ');
        $rows = $sql->getRows();
        if ($rows < 1) {
            if ($rows == 0) {
                $msg = 'Metainfo field "' . $metaInfoField_Select . '" not found';
            }
            $this->setMessage($msg);
            return false;
        }

        $newsArticleCategoryId = $this->getParam('newsid');
        $newsArchiveCategoryId = $this->getParam('newsarchiveid');

        $time = time();
        $sql->setQuery('
            SELECT  id, clang_id, createdate, parent_id, '.$metaInfoField_Select.'
            FROM    ' . rex::getTablePrefix() . 'article
            WHERE
                parent_id = '.$newsArticleCategoryId .'
            AND '.$metaInfoField_Select.' != ""
            AND status = 1');

        $rows = $sql->getRows();

        if($rows > 0) {

          for ($i = 0; $i < $rows; ++$i) {

                if ($sql->getValue($metaInfoField_Select) == 0) {
                    # mach nichts;
                } else {

                    $createDate = strtotime($sql->getValue('createdate'));
                    $archiveTime = $createDate + ($sql->getValue($metaInfoField_Select) * 24 * 60 * 60);

                    if ($time >= $archiveTime) {
                        rex_article_service::moveArticle($sql->getValue('id'), $sql->getValue('parent_id'),
                            $newsArchiveCategoryId);
                    }
                }
                $sql->next();
            }

            $this->setMessage('Updated articles: ' . $rows );
            if ($this->getParam('error-mail') == '|1|') {
                mail(rex::getErrorEmail(), "REDAXO CMS CRONJOB - Artikel-Archiv-Status - ndbde", "Der REDAXO CMS CRONJOB 'Artikel-Archiv-Status' wurde ausgeführt! (" . rex::getServer() . ")");
            }
            return true;
        } else {
            $this->setMessage("Keine Artikel für das Archiv gefunden!");
            return true;
        }
    }

    public function getTypeName()
    {
        return 'Artikel-Archiv-Status';
    }


    public function getParamFields()
    {
        $fields = [
            [
                'label' => 'News Kategorie',
                'name' => 'newsid',
                'type' => 'link',
                'notice' => 'Artikel/Kategroie-ID zu den News mit dem MetaInfoFeld: art_archive_period',
            ],
            [
                'label' => 'Archiv Kategorie',
                'name' => 'newsarchiveid',
                'type' => 'link',
                'notice' => 'Artikel/Kategroie-ID zum Archiv mit dem MetaInfoFeld: art_archive_period',
            ],
            [
                'name' => 'error-mail',
                'type' => 'checkbox',
                'options' => [1 => 'E-Mail Benachrichtgung erhalten'],
                'notice' => 'Die Nachricht wird an die im <a href="index.php?page=system/settings">System</a> hinterlegte Admin E-Mail Adresse gesendet ('.rex::getErrorEmail().')'
            ]
        ];

        return $fields;
    }


}
?>
```

6. Im `project`-Addon in der `boot.php` noch folgenden Code einfügen um das Script noch am AddOn-CRONJOB zu registrieren
```
if (rex_addon::get('cronjob')->isAvailable() && !rex::isSafeMode()) {
rex_cronjob_manager::registerType('rex_cronjob_archive_status');
}
```


**Neuen CronJob im AddOn anlegen**
Nun sollte im AddOn:CRONJOB (im redaxo Backend -> neue Cronjob erstellen (+) ) in der Auswahl der gerade erstellte CRONJOB "Artikel-Archiv-Status stehen.


**Fertig**
