# Tricks und Kniffe mit `rex_form` und `rex_list`

## rex_form

Eine Klasse, um Formulare und Formular-Elemente im Backend zu generieren. Die Bearbeitungs-Ansicht eines Templates oder eines Moduls im Backend sind Beispiele von rex_form.

Doku: https://redaxo.org/doku/master/formulare
API-Referenz: https://redaxo.org/api/master/class-rex_form_element.html

### 

Anwendungsfall:

```
```

### 

Anwendungsfall:

```
```


## rex_form

Eine Klasse, um eine tabellarische Liste anhand einer SQL-Ergebnistabelle darzustellen. Die Struktur-Übersicht oder die Liste der Templates und Module im Backend sind  Beispiele von rex_list.


### Zusätzliche Spalte mit Informationen

Anwendungsfall: In einer tabellarischen Darstellung einen Link oder eine Zusatzinformation hinzufügen, die nicht in der SELECT-Abfrage vorkommt.

```
    $list = rex_list::factory('SELECT `id`, `name` FROM `rex_template`', 10, $listName, $debug);

    $list->addColumn('edit_template', '');
    $list->setColumnLabel('edit_template', $this->i18n('edit_template_label'));
    $list->setColumnFormat('edit_template', 'custom', function ($params) {
            // Hier könnte auch eine andere Information anstelle eines Links ausgegeben werden.
            return '<a href="index.php?page=templates&start=0&function=edit&template_id=###id###">'.$this->i18n('edit_template_title').'</a>';
    });
    
    $fragment = new rex_fragment();

    $fragment->setVar('title', $this->i18n('edit_template_title');
    $fragment->setVar('body', $list->get(), false);
    echo $fragment->parse('core/page/section.php');

```

### Container je nach Ergebnis der SELECT-Abfrage einfärben

Anwendungsfall: Wenn die SELECT-Abfrage kein Ergebnis hat, dann das Container-Panel umfärben:

```
$sql = rex_sql::factory();
$query = 'SELECT `id`, `name` FROM `rex_template`';
$templates = array_filter($sql->setDebug(0)->getArray(%query));

if(count($templates)) {
    $class = " panel-danger";
} else {
    $class = " panel-success";
}

$list = rex_list::factory($query, 10, $listName, $debug);

$fragment = new rex_fragment();

$fragment->setVar('title', $this->i18n('title');
$fragment->setVar('body', $list->get(), false);
$fragment->setVar('class', $class, false);
echo $fragment->parse('core/page/section.php');
```

### Spalte in der Ausgabe entfernen

Anwendungsfall: Eine Datenbank-Spalte, die für den Nutzer nicht von Relevanz ist, ausblenden. Hier: `raw`

```
$query = 'SELECT `id`, `name` FROM `rex_template`';
$list = rex_list::factory($query, 10, $listName, $debug);
$list->removeColumn('raw');

$fragment = new rex_fragment();
$fragment->setVar('title', $this->i18n('title');
$fragment->setVar('body', $list->get(), false);
echo $fragment->parse('core/page/section.php');
```

### 

Anwendungsfall:

```
```
