YForm-Datensätze duplizieren ("Add" mit Vorbelegung)
Es kann recht lästig sein, wenn komplexe Datensätze immer wieder ähnlich zu einem anderen erfasst werden müssen. Die Übernahme von Inhalten aus bestehenden Datensätzen ist in YForm nicht per se vorgesehen.

In diesem Beitrag wird ein Weg aufgezeigt, wie neue Datensätze aus bestehenden dupliziert werden.

Ein bestehender Datensatz erhält über den EP YFORM_DATA_LIST (bzw. YFORM_DATA_LIST_ACTION_BUTTONS) in der Listenansicht einen Duplizier-Button bzw. eine Duplizier-Aktion.
Dahinter verbirgt sich ein Editier-Button (Editier-Aktion) mit zusätzlichem Url-Parameter &clone=1.
Das Formular wird zunächst als normales Edit-Formular aufgebaut.
Unmittelbar vor der Anzeige wird das Edit-Formular durch kleinere Änderungen zu einem Add-Formular.
Ohne Einsatz einer Dataset-Klasse für die Tabelle, die auf rex_yform_manager_dataset beruht, geht es nicht. Alle anderen Eingriffspunkte (z.B. EPs) liegen zu früh. Der späteste Eingriffspunkt vor der Anzeige ist in der Callback-Funktion afterFieldsExecuted von function executeForm(..).
TOC
Basislösung
Erweiterung 1: Basis-Dataset-Klasse und und individuelle Klassen für Tabellen
Erweiterung 2: Trait zur Nutzung in Dataset-Klassen
Warung, bitte beachten!

Basis-Lösung
Step 1: Aufruf
Im Beispiel werden zwei i18n-Einträge gesetzt (kann man auch in eine .lang-Datei packen), eine Tabelle wird mit der Dataset-Klasse gekoppelt und die EPs YFORM_DATA_LIST und YFORM_DATA_LIST_ACTION_BUTTON werden belegt.

rex_i18n::addMsg('yform_clonedata','Datensatz klonen [Original: {0}]');
rex_i18n::addMsg('my_yform_duplicate_action','Duplizieren');

rex_yform_manager_dataset::setModelClass('rex_myfirsttable', Dataset::class);

rex_extension::register(['YFORM_DATA_LIST', 'YFORM_DATA_LIST_ACTION_BUTTONS'],
    static function (rex_extension_point $ep) {
        /** @var rex_yform_manager_table $table */
        $table = $ep->getParam('table');
        $modelClass = rex_yform_manager_dataset::getModelClass($table->getTableName());
        $epName = $ep->getName();
        if( null !== $modelClass && method_exists($modelClass, $epName)) {
            return $modelClass::$epName($ep); // @phpstan-ignore-line
        }
    }
);
Die EP-Funktion prüft ab, ob es für die angegebene Tabelle ($ep->getParam('table')) eine eigene Dataset-Klasse gibt (rex_yform_manager_dataset::getModelClass) und ob die Klasse eine dem EP-Namen entsprechende Methode hat (hier z.B. Dataset::YFORM_DATA_LIST). Wenn ja wird die Methode ausgeführt.

Step 2: Die Dataset-Klasse
Die Dataset-Klasse ist ein All-In-One-Beispiel. Wie man die Struktur auch anders handhaben kann, wird später beschrieben.

class Dataset extends rex_yform_manager_dataset
{
    protected static string $CLONE_PARAM = 'clone';
    protected static string $CLONE_COLUMN = 'clone';

    public function executeForm(rex_yform $yform, callable $afterFieldsExecuted = null): string
    {
        $afterFieldsExecuted = $this->getCloneFormCallback($afterFieldsExecuted);
        return parent::executeForm($yform, $afterFieldsExecuted);
    }

    /**
     * @api
     * @param rex_extension_point<rex_yform_list> $ep
     * @return void|rex_yform_list
     */
    public static function YFORM_DATA_LIST(rex_extension_point $ep)
    {
        $list = $ep->getSubject();
        self::addCloneColumn($list);
    }

    /**
     * @api
     * @param rex_extension_point<array<string,string>> $ep
     * @return void|array<string,string>
     */
    public static function YFORM_DATA_LIST_ACTION_BUTTONS(rex_extension_point $ep)
    {
        $action = $ep->getSubject();
        $action = self::addCloneAction($action);
        $ep->setSubject($action);
    }

    /**
     * erzeugt (für Clone-Formulare) eine Callback-Funktion, die das Formular
     * kurz vor der Ausgabe von Edit auf Add umstellt und dann den ggf. 
     * vorhandenen afterFieldsExecuted-Callback ausführt.
     */
    protected function getCloneFormCallback(callable $afterFieldsExecuted = null): ?callable
    {
        if (1 === rex_request(self::$CLONE_PARAM, 'integer', 0)) {
            $callback = $afterFieldsExecuted;
            $afterFieldsExecuted = static function (rex_yform $yform) use ($callback) {
                self::changeEditToAdd($yform);
                if (is_callable($callback)) {
                    $callback($yform);
                }
            };
            rex_i18n::addMsg('yform_editdata', rex_i18n::msg('yform_clonedata'));
        }
        return $afterFieldsExecuted;
    }

    /**
     * fügt eine Spalte mit Klonen/Duplizieren-Button ein
     * Bedingung: Spalte 0 enthält den Edit-Button.
     * Die Edit-Button-Konfiguration wird weitgehend kopiert und zusätzlich
     * der Parameter clone=1 angehängt
     * @api
     */
    public static function addCloneColumn(rex_yform_list $list, int $position=1, string $column='clone'): void
    {
        $name = $list->getColumnName(0);
        if (null !== $name && str_contains($name, ' href="index.php?func=add')) {
            $list->addColumn($column, '<i class="fa fa-clone"></i>', $position);
            $list->setColumnLayout($column, ['<th></th>', '<td class="rex-table-icon">###VALUE###</td>']);
            $params = $list->getColumnParams($name);
            $params[self::$CLONE_PARAM] = 1;
            $list->setColumnParams($column, $params);
        }
    }

    /**
     * fügt eine Klonen/Duplizieren-Action in das Action Menü ein
     * @api
     * @param array<string,string> $action
     * @return array<string,string>
     */
    public static function addCloneAction(array $action) : array
    {
        $i = array_search('edit', array_keys($action), true);
        if (false !== $i) {
            preg_match('/href="(?<href>.*?)"/',$action['edit'],$match);
            $template = '<a href="%s&%s=1"><i class="fa fa-clone"></i> %s</a>';
            $cloneAction = sprintf($template,$match['href'],self::$CLONE_PARAM,rex_i18n::msg('my_yform_duplicate_action'));
            array_splice( $action, $i+1, 0, ['clone' => $cloneAction]);
        }
        return $action;
    }
    
    /**
     * Ändert ein EDIT-Formular auf ADD.
     *
     * Die Daten bleiben erhalten, aber alle Datensatz-Referenzen werden
     * entfernt etc.
     * 
     * Auch Inline-Formulare von be_manager_relation/Typ5 werden umgebaut,
     * nicht aber Inline-Formulare in Inline-Formularen.
     * @api
     */
    public static function changeEditToAdd(rex_yform $yform): void
    {
        // Für das Formular an sich: Auf "Add" umschalten
        $yform->objparams['form_hiddenfields']['func'] = 'add';
        unset($yform->objparams['form_hiddenfields']['data_id']);

        // In den Feldern Anpassungen vornehmen
        foreach ($yform->objparams['values'] as $k => $v) {
            // Submit-Buttons von "Edit" auf "Add" zurückstellen
            if ($v instanceof rex_yform_value_submit) {
                $yform->objparams['form_output'][$k] = str_replace(
                    [rex_i18n::msg('yform_save').'</button', rex_i18n::msg('yform_save_apply').'</button'],
                    [rex_i18n::msg('yform_add').'</button', rex_i18n::msg('yform_add_apply').'</button'],
                    $yform->objparams['form_output'][$k]
                );
                continue;
            }

            // im Feldtyp be_manager_relation / Typ 5 (inline) ebenfalls die Datensatz-ID der
            // verbundenen Sätze entfernen. Nur "inline" ist problematisch
            if ($v instanceof rex_yform_value_be_manager_relation && '5' === $v->getElement('type')) {
                $fieldName = preg_quote($v->getFieldName());
                $pattern = '/<input type="hidden" name="'.$fieldName.'(\[\d+\])*\[id\]" value="\d+" \/>/';
                $yform->objparams['form_output'][$k] = preg_replace($pattern, '', $yform->objparams['form_output'][$k]);
            }
        }
    }
}

Erweiterung 1: Basis-Dataset-Klasse und und individuelle Klassen für Tabellen
Hintegrrund ist die Überlegung, dass man den Duplizier-Button nicht für jede Tabelle benötigt. Wo gewünscht werden den Tabellen, die einen Button oder eine Aktion bekommen sollen, eigene, auf Dataset aufbauende Klassen zugewiesen.


Step 1: Aufruf
rex_i18n::addMsg('yform_clonedata','Datensatz klonen [Original: {0}]');
rex_i18n::addMsg('my_yform_duplicate_action','Duplizieren');

rex_yform_manager_dataset::setModelClass('rex_myfirsttable', FirstDataset::class);
rex_yform_manager_dataset::setModelClass('rex_mysecondtable', SecondDataset::class);

rex_extension::register(['YFORM_DATA_LIST', 'YFORM_DATA_LIST_ACTION_BUTTONS'],
    static function (rex_extension_point $ep) {
        /** @var rex_yform_manager_table $table */
        $table = $ep->getParam('table');
        $modelClass = rex_yform_manager_dataset::getModelClass($table->getTableName());
        $epName = $ep->getName();
        if( null !== $modelClass && method_exists($modelClass, $epName)) {
            return $modelClass::$epName($ep); // @phpstan-ignore-line
        }
    }
);
Step 2: Basis-Dataset-Klasse (ohne EP-Methoden)
class Dataset extends rex_yform_manager_dataset
{
    protected static string $CLONE_PARAM = 'clone';

    public function executeForm(rex_yform $yform, callable $afterFieldsExecuted = null): string
    {
        $afterFieldsExecuted = $this->getCloneFormCallback($afterFieldsExecuted);
        return parent::executeForm($yform, $afterFieldsExecuted);
    }

    /**
     * erzeugt (für Clone-Formulare) eine Callback-Funktion, die das Formular
     * kurz vor der Ausgabe von Edit auf Add umstellt und dann den ggf. 
     * vorhandenen afterFieldsExecuted-Callback ausführt.
     */
    protected function getCloneFormCallback(callable $afterFieldsExecuted = null): ?callable
    {
        if (1 === rex_request(self::$CLONE_PARAM, 'integer', 0)) {
            $callback = $afterFieldsExecuted;
            $afterFieldsExecuted = static function (rex_yform $yform) use ($callback) {
                self::changeEditToAdd($yform);
                if (is_callable($callback)) {
                    $callback($yform);
                }
            };
            rex_i18n::addMsg('yform_editdata', rex_i18n::msg('yform_clonedata'));
        }
        return $afterFieldsExecuted;
    }

    /**
     * fügt eine Spalte mit Klonen/Duplizieren-Button ein
     * Bedingung: Spalte 0 enthält den Edit-Button.
     * Die Edit-Button-Konfiguration wird weitgehend kopiert und zusätzlich
     * der Parameter clone=1 angehängt
     * @api
     */
    public static function addCloneColumn(rex_yform_list $list, int $position=1, string $column='clone'): void
    {
        $name = $list->getColumnName(0);
        if (null !== $name && str_contains($name, ' href="index.php?func=add')) {
            $list->addColumn($column, '<i class="fa fa-clone"></i>', $position);
            $list->setColumnLayout($column, ['<th></th>', '<td class="rex-table-icon">###VALUE###</td>']);
            $params = $list->getColumnParams($name);
            $params[self::$CLONE_PARAM] = 1;
            $list->setColumnParams($column, $params);
        }
    }

    /**
     * fügt eine Klonen/Duplizieren-Action in das Action Menü ein
     * @api
     * @param array<string,string> $action
     * @return array<string,string>
     */
    public static function addCloneAction(array $action) : array
    {
        $i = array_search('edit', array_keys($action), true);
        if (false !== $i) {
            preg_match('/href="(?<href>.*?)"/',$action['edit'],$match);
            $template = '<a href="%s&%s=1"><i class="fa fa-clone"></i> %s</a>';
            $cloneAction = sprintf($template,$match['href'],self::$CLONE_PARAM,rex_i18n::msg('my_yform_duplicate_action'));
            array_splice( $action, $i+1, 0, ['clone' => $cloneAction]);
        }
        return $action;
    }
    
    /**
     * Ändert ein EDIT-Formular auf ADD.
     *
     * Die Daten bleiben erhalten, aber alle Datensatz-Referenzen werden
     * entfernt etc.
     * 
     * Auch Inline-Formulare von be_manager_relation/Typ5 werden umgebaut,
     * nicht aber Inline-Formulare in Inline-Formularen.
     * @api
     */
    public static function changeEditToAdd(rex_yform $yform): void
    {
        // Für das Formular an sich: Auf "Add" umschalten
        $yform->objparams['form_hiddenfields']['func'] = 'add';
        unset($yform->objparams['form_hiddenfields']['data_id']);

        // In den Feldern Anpassungen vornehmen
        foreach ($yform->objparams['values'] as $k => $v) {
            // Submit-Buttons von "Edit" auf "Add" zurückstellen
            if ($v instanceof rex_yform_value_submit) {
                $yform->objparams['form_output'][$k] = str_replace(
                    [rex_i18n::msg('yform_save').'</button', rex_i18n::msg('yform_save_apply').'</button'],
                    [rex_i18n::msg('yform_add').'</button', rex_i18n::msg('yform_add_apply').'</button'],
                    $yform->objparams['form_output'][$k]
                );
                continue;
            }

            // im Feldtyp be_manager_relation / Typ 5 (inline) ebenfalls die Datensatz-ID der
            // verbundenen Sätze entfernen. Nur "inline" ist problematisch
            if ($v instanceof rex_yform_value_be_manager_relation && '5' === $v->getElement('type')) {
                $fieldName = preg_quote($v->getFieldName());
                $pattern = '/<input type="hidden" name="'.$fieldName.'(\[\d+\])*\[id\]" value="\d+" \/>/';
                $yform->objparams['form_output'][$k] = preg_replace($pattern, '', $yform->objparams['form_output'][$k]);
            }
        }
    }
}
Step 3: Dataset-Klassen für die Tabellen
class FirstDataset extends Dataset
{
    /**
     * @api
     * @param rex_extension_point<rex_yform_list> $ep
     * @return void|rex_yform_list
     */
    public static function YFORM_DATA_LIST(rex_extension_point $ep)
    {
        $list = $ep->getSubject();
        self::addCloneColumn($list);
    }
}
class SecondDataset extends Dataset
{
    /**
     * @api
     * @param rex_extension_point<array<string,string>> $ep
     * @return void|array<string,string>
     */
    public static function YFORM_DATA_LIST_ACTION_BUTTONS(rex_extension_point $ep)
    {
        $action = $ep->getSubject();
        $action = self::addCloneAction($action);
        $ep->setSubject($action);
    }
}

Erweiterung 2: Trait zur Nutzung in Dataset-Klassen
Der Trait stellt die Hilfsmethoden bereit. Alles weitere z.B. auch executeForm müssen individuell in Dataset-Klassen eingebaut werden:

Step 1: Aufruf
Siehe Erweiterung 1

Step 2: Trait
trait CloneYForm
{
    protected static string $CLONE_PARAM = 'clone';

    /**
     * erzeugt (für Clone-Formulare) eine Callback-Funktion, die das Formular
     * kurz vor der Ausgabe von Edit auf Add umstellt und dann den ggf. 
     * vorhandenen afterFieldsExecuted-Callback ausführt.
     */
    protected function getCloneFormCallback(callable $afterFieldsExecuted = null): ?callable
    {
        if (1 === rex_request(self::$CLONE_PARAM, 'integer', 0)) {
            $callback = $afterFieldsExecuted;
            $afterFieldsExecuted = static function (rex_yform $yform) use ($callback) {
                self::changeEditToAdd($yform);
                if (is_callable($callback)) {
                    $callback($yform);
                }
            };
            rex_i18n::addMsg('yform_editdata', rex_i18n::msg('yform_clonedata'));
        }
        return $afterFieldsExecuted;
    }

    /**
     * fügt eine Spalte mit Klonen/Duplizieren-Button ein
     * Bedingung: Spalte 0 enthält den Edit-Button.
     * Die Edit-Button-Konfiguration wird weitgehend kopiert und zusätzlich
     * der Parameter clone=1 angehängt
     * @api
     */
    public static function addCloneColumn(rex_yform_list $list, int $position=1, string $column='clone'): void
    {
        $name = $list->getColumnName(0);
        if (null !== $name && str_contains($name, ' href="index.php?func=add')) {
            $list->addColumn($column, '<i class="fa fa-clone"></i>', $position);
            $list->setColumnLayout($column, ['<th></th>', '<td class="rex-table-icon">###VALUE###</td>']);
            $params = $list->getColumnParams($name);
            $params[self::$CLONE_PARAM] = 1;
            $list->setColumnParams($column, $params);
        }
    }

    /**
     * fügt eine Klonen/Duplizieren-Action in das Action Menü ein
     * @api
     * @param array<string,string> $action
     * @return array<string,string>
     */
    public static function addCloneAction(array $action) : array
    {
        $i = array_search('edit', array_keys($action), true);
        if (false !== $i) {
            preg_match('/href="(?<href>.*?)"/',$action['edit'],$match);
            $template = '<a href="%s&%s=1"><i class="fa fa-clone"></i> %s</a>';
            $cloneAction = sprintf($template,$match['href'],self::$CLONE_PARAM,rex_i18n::msg('my_yform_duplicate_action'));
            array_splice( $action, $i+1, 0, ['clone' => $cloneAction]);
        }
        return $action;
    }
    
    /**
     * Ändert ein EDIT-Formular auf ADD.
     *
     * Die Daten bleiben erhalten, aber alle Datensatz-Referenzen werden
     * entfernt etc.
     * 
     * Auch Inline-Formulare von be_manager_relation/Typ5 werden umgebaut,
     * nicht aber Inline-Formulare in Inline-Formularen.
     * @api
     */
    public static function changeEditToAdd(rex_yform $yform): void
    {
        // Für das Formular an sich: Auf "Add" umschalten
        $yform->objparams['form_hiddenfields']['func'] = 'add';
        unset($yform->objparams['form_hiddenfields']['data_id']);

        // In den Feldern Anpassungen vornehmen
        foreach ($yform->objparams['values'] as $k => $v) {
            // Submit-Buttons von "Edit" auf "Add" zurückstellen
            if ($v instanceof rex_yform_value_submit) {
                $yform->objparams['form_output'][$k] = str_replace(
                    [rex_i18n::msg('yform_save').'</button', rex_i18n::msg('yform_save_apply').'</button'],
                    [rex_i18n::msg('yform_add').'</button', rex_i18n::msg('yform_add_apply').'</button'],
                    $yform->objparams['form_output'][$k]
                );
                continue;
            }

            // im Feldtyp be_manager_relation / Typ 5 (inline) ebenfalls die Datensatz-ID der
            // verbundenen Sätze entfernen. Nur "inline" ist problematisch
            if ($v instanceof rex_yform_value_be_manager_relation && '5' === $v->getElement('type')) {
                $fieldName = preg_quote($v->getFieldName());
                $pattern = '/<input type="hidden" name="'.$fieldName.'(\[\d+\])*\[id\]" value="\d+" \/>/';
                $yform->objparams['form_output'][$k] = preg_replace($pattern, '', $yform->objparams['form_output'][$k]);
            }
        }
    }
}
Step 3: Dataset-Klassen für die Tabellen
class FirstDataset extends rex_yform_manager_dataset
{
    use ConeYForm;

    public function executeForm(rex_yform $yform, callable $afterFieldsExecuted = null): string
    {
        $afterFieldsExecuted = $this->getCloneFormCallback($afterFieldsExecuted);
        return parent::executeForm($yform, $afterFieldsExecuted);
    }

    /**
     * @api
     * @param rex_extension_point<rex_yform_list> $ep
     * @return void|rex_yform_list
     */
    public static function YFORM_DATA_LIST(rex_extension_point $ep)
    {
        $list = $ep->getSubject();
        self::addCloneColumn($list);
    }
}
class SecondDataset extends rex_yform_manager_dataset
{
    use ConeYForm;
    
    public function executeForm(rex_yform $yform, callable $afterFieldsExecuted = null): string
    {
        $afterFieldsExecuted = $this->getCloneFormCallback($afterFieldsExecuted);
        return parent::executeForm($yform, $afterFieldsExecuted);
    }

    /**
     * @api
     * @param rex_extension_point<array<string,string>> $ep
     * @return void|array<string,string>
     */
    public static function YFORM_DATA_LIST_ACTION_BUTTONS(rex_extension_point $ep)
    {
        $action = $ep->getSubject();
        $action = self::addCloneAction($action);
        $ep->setSubject($action);
    }
}

Warnung
Verfahren wie

i18n-Einträge ändern
HTML umbauen
das große YForm-Array (hier als $yform->objparams) nutzen/verändern
sind immer riskant, da Seiteneffekte nie auszuschließen sind und das generierte HTML auch schon mal anders aussehen kann als gedacht, z.B. wenn ein anderes Template/Fragment zum Einsatz kommt.

Es besteht immer auch das Risiko, das sich in YForm etwas ändert - und sei es nur marginal. Für "Hacks" wie hier beschreben gibt es keinen Bestandsschutz gegen Breaking-Changes!

Da hier ein Editier-Prozedere nachträglich in ein Hinzufügen-Prozedere umgebaut wird, werden die ExtensionsPoints nicht wie zu erwarten aufgerufen. Beim Aufbau des Formulars nach Klick auf den Klon-Button, wird der EP YFORM_DATA_UPDATE aufgerufen und nicht YFORM_DATA_ADD. Daher muss man ggf. im EP abfragen, ob der URL-Parameter clone=1 gesetzt ist. Beim Speichern des Datensatzes greifen wieder die regulären EPs YFORM_DATA_ADD und YFORM_DATA_ADDED.

Für das Verfahren wurden mehrere be_manager-relation-Varianten untersucht, aber lange nicht alle theoretisch denkbaren. Untersucht wurde:

Tabelle A hat eine Relation "inline(multiple 1-n)" auf Tabelle B: Der Fall wird wie oben beschrieben behandelt.
Tabelle A hat eine n:m-Beziehung zu Tabelle B über eine Relationen-Tabelle "popup (multiple)": Der Fall hat sich als unkritisch erwiesen.
Diverse einfache Varianten ohne Relationen-Tabelle, die ihre Daten direkt in der Haupttabelle ablegen: Alle unkritisch.
Nicht erfasst sind "private" Datentypen (nicht mit YForm bereitgestellt), die Relationen aufbauen und verwalten. Hier ist Eigeninitiative nötig.
