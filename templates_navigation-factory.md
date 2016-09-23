# Navigationen erstellen mittels `rex_navigation::factory()`

- [Beispiel 1: Einfache Navigation](#beispiel-1)
- [Beispiel 2: Sitemap](#beispiel-2)
- [Beispiel 3: Breadcrumbs](#beispiel-3)
- [Beispiel 4: Komplexe Navigation](#beispiel-4)

REDAXO bietet mit der `rex_navigation::factory()` die Möglichkeit, verschiedenste Seitennavigationen zu erstellen.

Die Factory ist Teil des Structure-Addons und befindet sich in `redaxo/src/addons/structure/lib/navigation.php`. Der Code ist gut dokumentiert, so dass es sinnvoll ist, dort nachzuschauen, wenn z. B. Parameter nicht bekannt sind oder die Funktionalität näher betrachtet werden möchte.

Das [Beispiel 4](#beispiel-4) verwendet alle aktuell verfügbaren Methoden der Factory, um eine sehr umfangreiche Navigation zu erstellen. Beachte die Kommentare im Code, sie erklären die einzelnen Methoden und ihre Parameter.

<a name="beispiel-1"></a>
## Beispiel 1: Einfache Navigation

    $nav = rex_navigation::factory();
    $nav->show();

Werden keine Parameter angegeben, startet die Navigation mit der Wurzelkategorie, durchläuft bis zu 3 Ebenen, zeigt nur den aktuellen Zweig geöffnet und zeigt auch Offline-Artikel an.

<a name="beispiel-2"></a>
## Beispiel 2: Sitemap

    $nav = rex_navigation::factory();
    $nav->show(0, -1, TRUE, TRUE);

Um eine Sitemap zu erzeugen, müssen alle Ebenen durchlaufen (2. Parameter: `-1`) und alle Zweige geöffnet angezeigt werden (3. Parameter: `TRUE`). In diesem Beispiel werden Offline-Artikel nicht angezeigt (4. Parameter: `TRUE`).
 
<a name="beispiel-3"></a>
## Beispiel 3: Breadcrumbs

    $nav = rex_navigation::factory();
    $nav->showBreadcrumb(true);
    
Für die Ausgabe von Breadcrumbs gibt es die separate Methode `showBreadcrumb`.

<a name="beispiel-4"></a>
## Beispiel 4: Komplexe Navigation

    $nav = rex_navigation::factory();
    
    // Füge eigene Klassen den Listenelementen (<li>) hinzu
    $nav->setClasses(array('level-1', 'level-2', 'level-3'));
    
    // Füge eigene Klassen den Links (<a>) hinzu
    $nav->setLinkClasses(array('link-1', 'link-2', 'link-3'));
    
    // Filter: Schließe einzelne Artikel oder Kategorien von der Navigation aus
    $nav->addFilter('id', 6, '!=', '');
    $nav->addFilter('id', 13, '!=', '');
    
    // Filter: Schließe einzelne Artikel oder Kategorien von der Navigation aus (mittels RegExp)
    $ignoreArticles = array(6, 13, 16, 127);
    $nav->addFilter('id', '/^(?!(' . implode('|', $ignoreArticles) . ')$)\d+/', 'regex', '');
    
    // Beispiele für Callbacks
    $nav->addCallback(function (rex_category $category, $depth, &$li, &$a) {
    
        // Ergänze eigene Klasse, wenn ein Listenelement über Kindelemente verfügt
        if ($category->getChildren()) {
            $li['class'][] = 'item-has-children';
        }
    
        // Ergänze data-Attribute für <li> und <a>
        $li['data-foo'][] = 'foo';
        $a['data-bar'][] = 'bar';
    
        return true;
    });
    
    // Generiere Navigation
    // Parameter:
    // 1. ID der Wurzelkategorie (Standard: 0)
    // 2. Anzahl der Ebenen die angezeigt werden sollen (Standard: 3. -1 bedeutet beliebig viele Ebenen.)
    // 3. Zeige den gesamten Baum (Standard: FALSE, zeige also nur den aktiven Zweig)
    // 4. Zeige Offline-Elemente (Standard: FALSE, Offline-Elemente werden also angezeigt)
    $navHtml = $nav->get(0, -1, TRUE, TRUE);
    
    // Gebe die Navigation aus
    // Alternativ hättest du zuvor auch `$nav->show(…)` verwenden können 
    echo $navHtml;
    
Beachte die Kommentare im Code, sie erklären die einzelnen Methoden und ihre Parameter.
