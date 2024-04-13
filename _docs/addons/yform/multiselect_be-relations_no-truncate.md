---
title: 'YForm Formulare: Multiple (select) für "be_manager_relations"-Feld ungekürzt'
authors: [eaCe, madiko]
prio: 
---

Anleitung für:  
REDAXO 5.15.1  
AddOn YForm 4.1.1  
[ AddOn Theme 1.4.0 wird mit erklärt ]  
(andere Versionen ungetestet)  

Letztes Update: 2023-10-11  

  
# Die Anleitung im Überblick

- [Vorbereiten: Eigene(s) YTemplates einbinden](#boot)
- [Angepasstes Template](#template)

>**Hinweis**: Diese Anleitung funktioniert (noch) nicht, wenn Du beim Tabellen-Feld `"be_manager_relation"` unter `"Ziel Tabellenfeld(er) zur Anzeige oder Feld, das die Relations-ID enthält."` mehr als nur *ein* Tabellen-Feld auswählst. Wir freuen uns über sachdienliche Hinweise, die dieses Problem auch noch lösen. Danke.  
Derweil kannst Du prüfen, ob die Quick&Dirty-Lösung von [olien](https://github.com/olien) vorübergehend in Frage kommt: [YForm issue 1259](https://github.com/yakamara/yform/issues/1259#issuecomment-1079632786). Achtung: das ist nicht update-sicher und wird beim nächsten YForm Update überschrieben!

<a name="boot"></a>

## Eigene(s) YTemplates einbinden

Zunächst hinterlegst Du für REDAXO die generelle Anweisung, dass eigene YForm-Templates geladen werden sollen. Die Anleitung dazu findest Du [in der YForm-Doku unter "Formbuilder – ein eigenes Template verwenden"](https://github.com/yakamara/yform/blob/master/docs/07_formbuilder.md#ein-eigenes-template--framework-f%C3%BCr-formularcode-verwenden):

### via AddOn Project

Füge das Code-Snippet unten ein in die `boot.php` unter  
`redaxo/src/addons/project`

### via AddOn Theme

*Alternativ* kannst Du das Code-Snippet unten einfügen in die `boot.php` unter  
`theme/private/inc`
  
```
/*************************************************************************
* Funktion für: YForm
     YForm Tabellen Templates anpassen
     * Autor / copy: Anleitung aus der Doku von YForm
        https://github.com/yakamara/yform/blob/master/docs/07_formbuilder.md#ein-eigenes-template--framework-f%C3%BCr-formularcode-verwenden
* last update:  2023-10-11
    * last review:  2023-10-11
**************************************************************************/

rex_yform::addTemplatePath($this->getPath('ytemplates'));
```

<a name="template"></a>

## Template

Nun legst Du folgendes Template ab  
unter `theme/private/ytemplates/bootstrap`  
mit dem Datei-Namen `value.be_manager_relation.tpl.php`:  

>**Hinweis**: Das sollte direkt funktionieren. Falls nicht, lösche unter `System` den `Cache` und versuche es erneut.

```
<?php

/**
 * @var rex_yform_value_be_manager_relation $this
 * @psalm-scope-this rex_yform_value_be_manager_relation
 */

// get filter
$filter = [];
if ($rawFilter = $this->getElement('filter')) {
    $filter = $this::getFilterArray($rawFilter, $this->params['main_table'], [$this, 'getValueForKey']);
}
if (isset($this->params['rex_yform_set'][$this->getName()]) && is_array($this->params['rex_yform_set'][$this->getName()])) {
    $filter = array_merge($filter, $this->params['rex_yform_set'][$this->getName()]);
}

// adapting selection for options without truncation
if (!empty($options)) {
    $options = [];
    $listValues = $this::getListValues($this->relation['target_table'], $this->relation['target_field'], $filter);

    foreach ($listValues as $id => $value) {
        $options[] = [
            'id' => $id,
            'name' => $value . " [id=$id]",
        ];
    }
}

// template as defined in the YForm-Standard for be_manager_relation
// yform/plugins/manager/ytemplates/bootstrap/value.be_manager_relation.tpl.php

$class_group = trim('form-group ' . $this->getHTMLClass() . ' ' . $this->getWarningClass());

$id = sprintf('%u', crc32($this->params['form_name']. random_int(0, 100). $this->getId()));

$notice = [];
if ('' != $this->getElement('notice')) {
    $notice[] = rex_i18n::translate($this->getElement('notice'), false);
}
if (isset($this->params['warning_messages'][$this->getId()]) && !$this->params['hide_field_warning_messages']) {
    $notice[] = '<span class="text-warning">' . rex_i18n::translate($this->params['warning_messages'][$this->getId()], false) . '</span>'; //    var_dump();
}
if (count($notice) > 0) {
    $notice = '<p class="help-block small">' . implode('<br />', $notice) . '</p>';
} else {
    $notice = '';
}

?>
<?php if ($this->getRelationType() < 2): ?>
    <div data-be-relation-wrapper="<?php echo $this->getFieldName(); ?>" class="<?php echo $class_group ?>" id="<?php echo $this->getHTMLId() ?>">
        <label class="control-label" for="<?php echo $this->getFieldId() ?>"><?php echo $this->getLabel() ?></label>
        <?php

        $attributes = [];
        $attributes['class'] = 'form-control';
        $attributes['id'] = $this->getFieldId();

        $select = new rex_select();

        if (1 == $this->getRelationType()) {
            $select->setName($this->getFieldName() . '[]');
            $select->setMultiple();
            $select->setSize($this->getRelationSize());
        } else {
            $select->setName($this->getFieldName());
        }

        $attributes = $this->getAttributeArray($attributes, ['required', 'readonly', 'disabled']);

        $select->setAttributes($attributes);
        foreach ($options as $option) {
            $select->addOption($option['name'], $option['id']);
        }

        $select->setSelected($this->getValue());
        echo $select->get();
        ?>
        <?php echo $notice ?>
    </div>
<?php else: ?>
    <div data-be-relation-wrapper="<?php echo $this->getFieldName(); ?>" class="<?php echo $class_group ?>" id="<?php echo $this->getHTMLId() ?>">
        <label class="control-label" for="<?php echo $this->getFieldId() ?>"><?php echo $this->getLabel() ?></label>
        <?php
        $e = [];
        if (4 == $this->getRelationType()) {
            $e['field'] = '<input type="hidden" name="' . $this->getFieldName() . '" id="YFORM_DATASET_' . $id . '" value="' . implode(',', $this->getValue()) . '" />';
            if ($this->params['main_id'] > 0) {
                $e['functionButtons'] = '<a class="btn btn-popup" href="javascript:void(0);" onclick="newPoolWindow(\'' . $link . '\');return false;">' . rex_i18n::msg('yform_relation_edit_relations') . '</a>';
            } else {
                $e['after'] = '<p class="help-block small">' . rex_i18n::msg('yform_relation_first_create_data') . '</p>';
            }

            $fragment = new rex_fragment();
            $fragment->setVar('elements', [$e], false);
            echo $fragment->parse('core/form/widget.php');
        } elseif (2 == $this->getRelationType()) {
            $e['field'] = '<input class="form-control" type="text" name="YFORM_DATASET_NAME[' . $id . ']" value="' .  rex_escape($valueName) . '" id="YFORM_DATASET_SELECT_' . $id . '" readonly="readonly" /><input type="hidden" name="' .  $this->getFieldName() . '" id="YFORM_DATASET_FIELD_' . $id . '" value="' . implode(',', $this->getValue()) . '" />';
            $e['functionButtons'] = '
                <a href="javascript:void(0);" class="btn btn-popup" onclick="openYFormDataset(' . $id . ', \'' . $this->getRelationSourceTableName() . '.' . $this->getName() . '\', \'' . $link . '\',\'0\');return false;" title="' .  rex_i18n::msg('yform_relation_choose_entry') . '"><i class="rex-icon rex-icon-add"></i></a>
                <a href="javascript:void(0);" class="btn btn-popup" onclick="deleteYFormDataset(' . $id . ',\'0\');return false;" title="' .  rex_i18n::msg('yform_relation_delete_entry') . '"><i class="rex-icon rex-icon-remove"></i></a>';

            $fragment = new rex_fragment();
            $fragment->setVar('elements', [$e], false);
            echo $fragment->parse('core/form/widget.php');
        } else {
            $attributes = [];
            $attributes['class'] = 'form-control';
            $attributes = $this->getAttributeArray($attributes, ['required', 'readonly']);

            $select = new rex_select();
            $select->setAttributes($attributes);
            $select->setId('YFORM_DATASETLIST_SELECT_' . $id . '');
            $select->setName('YFORM_DATASETLIST_SELECT_' . $id . '');
            $select->setSize($this->getRelationSize());
            foreach ($options as $option) {
                $select->addOption($option['name'], $option['id']);
            }
            $e['field'] = $select->get() . '<input type="hidden" name="' . $this->getFieldName() . '" id="YFORM_DATASETLIST_FIELD_' . $id . '" value="' . implode(',', $this->getValue()) . '" />';

            $e['moveButtons'] = '
                <a href="javascript:void(0);" class="btn btn-popup" onclick="moveYFormDatasetList(' . $id . ',\'top\');return false;" title="' . rex_i18n::msg('yform_relation_move_first_data') . '"><i class="rex-icon rex-icon-top"></i></a>
                <a href="javascript:void(0);" class="btn btn-popup" onclick="moveYFormDatasetList(' . $id . ',\'up\');return false;" title="' . rex_i18n::msg('yform_relation_move_up_data') . '>"><i class="rex-icon rex-icon-up"></i></a>
                <a href="javascript:void(0);" class="btn btn-popup" onclick="moveYFormDatasetList(' . $id . ',\'down\');return false;" title="' . rex_i18n::msg('yform_relation_move_down_data') . '"><i class="rex-icon rex-icon-down"></i></a>
                <a href="javascript:void(0);" class="btn btn-popup" onclick="moveYFormDatasetList(' . $id . ',\'bottom\');return false;" title="' . rex_i18n::msg('yform_relation_move_last_data') . '"><i class="rex-icon rex-icon-bottom"></i></a>';
            $e['functionButtons'] = '
                <a href="javascript:void(0);" class="btn btn-popup" onclick="openYFormDatasetList(' . $id . ', \'' . $this->getRelationSourceTableName() . '.' . $this->getName() . '\', \'' . $link . '\',\'1\');return false;" title="' . rex_i18n::msg('yform_relation_choose_entry') . '"><i class="rex-icon rex-icon-add"></i></a>
                <a href="javascript:void(0);" class="btn btn-popup" onclick="deleteYFormDatasetList(' . $id . ',\'1\');return false;" title="' . rex_i18n::msg('yform_relation_delete_entry') . '"><i class="rex-icon rex-icon-remove"></i></a>
            ';

            $fragment = new rex_fragment();
            $fragment->setVar('elements', [$e], false);
            echo $fragment->parse('core/form/widget_list.php');
        }
        ?>
        <?php echo $notice ?>
    </div>
<?php endif;
```
