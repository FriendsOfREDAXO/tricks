# URL_Schemes für YRewrite

## URL-Replacer

Ersetzt die URLs leerer Elternkategorien mit den URLs der nächsten inhaltversehenen Kindkategorien
der Elternkategorie hinterlegt sind.
Basiert auf: https://gist.github.com/gharlan/a70704b1c309cb1281c1

**Installation**
- Als Datei im Projekt-AddOn-Lib-Ordner ablegen. 
- Dateiname: rex_yrewrite_scheme_gh.php
- In die boot.php des project-AddOns: `rex_yrewrite::setScheme(new rex_yrewrite_scheme_gh());` einsetzen


### Weiterleitung egal ob Inhalt in Startartikel der Elternkategorie
      <?php

      class rex_yrewrite_scheme_gh extends rex_yrewrite_scheme
      {
          protected $suffix = '/';

          public function getRedirection(rex_article $art, rex_yrewrite_domain $domain)
          {

              if ($art->isStartArticle() && ($cats = $art->getCategory()->getChildren(true))) {
                  return $cats[0];
              }

              return false;
          }
      }

### Weiterleitung nur wenn kein Inhalt im Startartikel der Elternkategorie

      <?php

      class rex_yrewrite_scheme_gh extends rex_yrewrite_scheme
      {
          protected $suffix = '/';

          public function getRedirection(rex_article $art, rex_yrewrite_domain $domain)
          {

              if ($art->isStartArticle() && ($cats = $art->getCategory()->getChildren(true)) && !rex_article_slice::getFirstSliceForCtype(1, $art->getId(), rex_clang::getCurrentId())) {
                  return $cats[0];
              }

              return false;
          }
      }
