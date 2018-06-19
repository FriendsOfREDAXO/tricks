---
title: Queries
authors: []
prio:
---

# Queries

- [Paginierung auf Datum basierende Datensätze](#paginierung-datum)
    - [vorheriger Datensatz](#paginierung-datum-vorheriger-datensatz)
    - [nächster Datensatz](#paginierung-datum-naechster-datensatz)
- [Query inkl. einer "Bitte auswählen" Option](#option-please-select)


<a name="paginierung-datum"></a>
## Beispiel um ein Blättern auf Datum basierende Datensätze zu erstellen (News)

Die Methoden basieren auf Yorm und gehören in eine Class wie zum Beispiel

```
class News extends rex_yform_manager_dataset
{
}
```

Die Queries lassen sich aber auch sehr einfach für eine normale DB-Abfrage adaptieren.

<a name="paginierung-datum-vorheriger-datensatz"></a>
### vorherigen Datensatz holen

```php
public function getPrevious()
{
    $query = self::query()
        ->where('status', '1')
        ->whereRaw('id != :id and (date > :date or date = :date and id > :id)', ['id' => $this->id, 'date' => $this->date])
        ->orderBy('date', 'ASC')
        ->orderBy('id', 'ASC');
    return $query->findOne();
}
```

<a name="paginierung-datum-naechster-datensatz"></a>
### nächsten Datensatz holen
 
```php
public function getNext()
{
    $query = self::query()
        ->where('status', '1')
        ->whereRaw('id != :id and (date < :date or date = :date and id < :id)', ['id' => $this->id, 'date' => $this->date])
        ->orderBy('date', 'DESC')
        ->orderBy('id', 'DESC');
    return $query->findOne();
}
```


<a name="option-please-select"></a>
## Query inkl. einer "Bitte auswählen" Option

Nützlich bei `select`-Feldtypen im **MetaInfo** AddOn oder im **YFormbuilder**

```php
SELECT name, filename AS id FROM rex_project_icon UNION SELECT ' Bitte wählen' AS name, "" AS id ORDER BY name
```

### Beispielausgabe in der Sidebar eines Artikels

```html
<select name="art_icon" size="1" class="form-control" id="rex-metainfo-art_icon">
    <option value=""> Bitte wählen</option>
    <option value="file_a">A</option>
    <option value="file_b">B</option>
</select>
```

> Hinweis: `select` via **MetaInfo** erstellt
