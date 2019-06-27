---
title: "Medienpool: Erweiterter Schutz vor dem Löschen von Daten"
authors: [dpf-dd]
prio:
---

# Medienpool: Erweiterter Schutz vor dem Löschen von Daten

Diese Klasse erweitert den Löschschutz vom Medienpool und prüft eigene SQL-Tabellen (z.B. aus yForm) auf das Vorhandensein des zu löschenden Mediums und Artikel.

***Ursprung:*** [Yakme](https://github.com/yakamara/yakme)

> Es handelt sich hierbei um eine isolierte Class aus dem AddOn Yakme. Wenn Yakme verwendet wird, wird dieser Trick nicht benötigt. Es emppfiehlt sich die Class mit Yakme nach einem Update ggf. abzugleichen. 

## Beispiel

Es existiert z.B. ein yForm-Formular, mit dessen Hilfe ein Frontend-User Bilder hochlädt und zum Medienpool hinzufügt.
Da der Dateiname des hochgeladenen Bildes in der yForm-Tabelle gespeichert wird, kann der Medienpool das entsprechende Bild von Haus aus **NICHT** vor dem Löschen schützen. Das Bild kann somit im Medienpool gelöscht werden, obwohl es sich noch in Benutzung befindet (In diesem Fall in der yForm-Datenausgabe / Table Manager).
Durch das Einbinden der hier geizeigten Klasse, wird diese Funktion nachgeliefert unhd vor dem Löschen eines Mediums die Tabelle nach dem Medium durchsucht. 

## Installation

Folgende zwei Zeilen der `boot.php` im `project`-Addon hinzufügen
```php
rex_extension::register('MEDIA_IS_IN_USE', 'inUseCheck::isMediaInUse');
\rex_extension::register('PACKAGES_INCLUDED', 'inUseCheck::isArticleInUse');
```

Außerdem den folgenden Code in eine eigene PHP-Datei speichern, z.B. `isMediaInUse.php` (Dateiname ist frei wählbar).
Diese Datei anschließend in den Ordner `lib` des `project`-Addons kopieren:
```php
<?php

declare(strict_types=1);

/**
 * This file is part of the Yakme package.
 *
 * @author (c) Yakamara Media GmbH & Co. KG
 * @author     Thomas Blum <thomas.blum@yakamara.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

class inUseCheck
{
    public static function isArticleInUse(\rex_extension_point $ep)
    {
        $rexApiCall = rex_request(\rex_api_function::REQ_CALL_PARAM, 'string', '');
        if ($rexApiCall == 'category_delete' || $rexApiCall == 'article_delete') {
            $id = ($rexApiCall == 'category_delete') ? rex_request('category-id', 'int', 0) : rex_request('article_id', 'int', 0);
            $article = \rex_article::get($id);
            if ($article) {
                $sql = \rex_sql::factory();
                $sql->setQuery('SELECT * FROM `'.\rex_yform_manager_field::table().'` LIMIT 0');

                $columns = $sql->getFieldnames();
                $select = in_array('multiple', $columns) ? ', `multiple`' : '';

                $fields = $sql->getArray('SELECT `table_name`, `name`'.$select.' FROM `'.\rex_yform_manager_field::table().'` WHERE `type_id`="value" AND `type_name` IN("be_link","be_select_category")');
                $fields = \rex_extension::registerPoint(new \rex_extension_point('YFORM_ARTICLE_IS_IN_USE', $fields));

                if (count($fields)) {
                    $tables = [];
                    foreach ($fields as $field) {
                        $tableName = $field['table_name'];
                        $condition = $sql->escapeIdentifier($field['name']).' = '.$article->getId();

                        if (isset($field['multiple']) && $field['multiple'] == 1) {
                            $condition = 'FIND_IN_SET('.$article->getId().', '.$sql->escapeIdentifier($field['name']).')';
                        }
                        $tables[$tableName][] = $condition;
                    }
                    $messages = '';
                    foreach ($tables as $tableName => $conditions) {
                        $items = $sql->getArray('SELECT `id` FROM '.$tableName.' WHERE '.implode(' OR ', $conditions));
                        if (count($items)) {
                            foreach ($items as $item) {
                                $sqlData = \rex_sql::factory();
                                $sqlData->setQuery('SELECT `name` FROM `'.\rex_yform_manager_table::table().'` WHERE `table_name` = "'.$tableName.'"');

                                $url = \rex_url::backendController([
                                    'page' => 'yform/manager/data_edit',
                                    'table_name' => $tableName,
                                    'data_id' => $item['id'],
                                    'func' => 'edit',
                                ]);
                                $messages .= '<li><a href="'.$url.'">'.$sqlData->getValue('name').' [id='.$item['id'].']</a></li>';
                            }
                        }
                    }

                    if ($messages != '') {
                        $_REQUEST[\rex_api_function::REQ_CALL_PARAM] = '';

                        \rex_extension::register('PAGE_TITLE_SHOWN', function (\rex_extension_point $ep) use ($article, $messages) {
                            $warning = $article->isStartArticle() ? \rex_i18n::msg('yform_structure_category_could_not_be_deleted') : \rex_i18n::msg('yform_structure_article_could_not_be_deleted');
                            $warning .= '<br /><ul>'.$messages.'</ul>';
                            $subject = $ep->getSubject();
                            $ep->setSubject(\rex_view::error($warning).$subject);
                        });
                    }
                }
            }
        }
    }

    public static function isMediaInUse(\rex_extension_point $ep)
    {
        $params = $ep->getParams();
        $warning = $ep->getSubject();

        $sql = \rex_sql::factory();
        $sql->setQuery('SELECT * FROM `'.\rex_yform_manager_field::table().'` LIMIT 0');

        $columns = $sql->getFieldnames();
        $select = in_array('multiple', $columns) ? ', `multiple`' : '';

        $fields = $sql->getArray('SELECT `table_name`, `name`'.$select.' FROM `'.\rex_yform_manager_field::table().'` WHERE `type_id`="value" AND `type_name` IN("be_media","mediafile")');
        $fields = \rex_extension::registerPoint(new \rex_extension_point('YFORM_MEDIA_IS_IN_USE', $fields));

        if (!count($fields)) {
            return $warning;
        }

        $tables = [];
        $escapedFilename = $sql->escape($params['filename']);
        foreach ($fields as $field) {
            $tableName = $field['table_name'];
            $condition = $sql->escapeIdentifier($field['name']).' = '.$escapedFilename;

            if (isset($field['multiple']) && $field['multiple'] == 1) {
                $condition = 'FIND_IN_SET('.$escapedFilename.', '.$sql->escapeIdentifier($field['name']).')';
            }
            $tables[$tableName][] = $condition;
        }

        $messages = '';
        foreach ($tables as $tableName => $conditions) {
            $items = $sql->getArray('SELECT `id` FROM '.$tableName.' WHERE '.implode(' OR ', $conditions));
            if (count($items)) {
                foreach ($items as $item) {
                    $sqlData = \rex_sql::factory();
                    $sqlData->setQuery('SELECT `name` FROM `'.\rex_yform_manager_table::table().'` WHERE `table_name` = "'.$tableName.'"');

                    $messages .= '<li><a href="javascript:openPage(\'index.php?page=yform/manager/data_edit&amp;table_name='.$tableName.'&amp;data_id='.$item['id'].'&amp;func=edit\')">'.$sqlData->getValue('name').' [id='.$item['id'].']</a></li>';
                }
            }
        }

        if ($messages != '') {
            $warning[] = 'Tabelle<br /><ul>'.$messages.'</ul>';
        }

        return $warning;
    }
}

?>
```

## Anwendung

Es muss nichts weiter beachtet werden, der Schutz funktioniert vollautomatisch und verhindert ab sofort das Löschen von Medienpool-Inhalten, die noch in eigenen SQL-Tabellen enthalten sind!
