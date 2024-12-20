---
title: Queries
authors: [tbaddade]
prio:
---

# Queries

- [Paginierung auf alphabetisch basierende Datensätze](#paginierung-abc)
    - [vorheriger Datensatz](#paginierung-abc-vorheriger-datensatz)
    - [nächster Datensatz](#paginierung-abc-naechster-datensatz)
- [Paginierung auf Datum basierende Datensätze](#paginierung-datum)
    - [vorheriger Datensatz](#paginierung-datum-vorheriger-datensatz)
    - [nächster Datensatz](#paginierung-datum-naechster-datensatz)
- [Paginierung auf Prio basierende Datensätze](#paginierung-prio)
    - [vorheriger Datensatz](#paginierung-prio-vorheriger-datensatz)
    - [nächster Datensatz](#paginierung-prio-naechster-datensatz)   
- [Query inkl. einer "Bitte auswählen" Option](#option-please-select)


<a name="paginierung-abc"></a>
## Blättern auf alphabetisch basierende Datensätze

Die Methoden basieren auf Yorm und gehören in eine Class wie zum Beispiel

```php
class Project extends rex_yform_manager_dataset
{
}
```

<a name="paginierung-abc-vorheriger-datensatz"></a>
### vorherigen Datensatz holen

```php
public function getPrevious()
{
    $query = self::query()
        ->where('status', '1')
        ->where(sprogfield('title'), $this->getTitle(), '<')
        ->orderBy(sprogfield('title'), 'DESC');
    return $query->findOne();
}
```

<a name="paginierung-abc-naechster-datensatz"></a>
### nächsten Datensatz holen
 
```php
public function getNext()
{
    $query = self::query()
        ->where('status', '1')
        ->where(sprogfield('title'), $this->getTitle(), '>')
        ->orderBy(sprogfield('title'), 'ASC');
    return $query->findOne();
}
```


<a name="paginierung-datum"></a>
## Blättern auf Datum basierende Datensätze zu erstellen (News)

Die Methoden basieren auf Yorm und gehören in eine Class wie zum Beispiel

```php
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
        ->whereRaw('id != :id and (date > :date or date = :date and id > :id)',
            ['id' => $this->id, 'date' => $this->date])
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
        ->whereRaw('id != :id and (date < :date or date = :date and id < :id)',
            ['id' => $this->id, 'date' => $this->date])
        ->orderBy('date', 'DESC')
        ->orderBy('id', 'DESC');
    return $query->findOne();
}
```


<a name="paginierung-prio"></a>
## Blättern auf Prio basierende Datensätze zu erstellen

Die Methoden basieren auf [YOrm](https://github.com/yakamara/redaxo_yform/blob/master/docs/04_yorm.md) und gehören in eine Class wie zum Beispiel

```php
class Item extends rex_yform_manager_dataset
{
}
```

Die Queries lassen sich aber auch sehr einfach für eine normale DB-Abfrage adaptieren.

<a name="paginierung-prio-vorheriger-datensatz"></a>
### vorherigen Datensatz holen

```php
public function getPrevious()
{
    $query = self::query()
        ->where('status', '1')
        ->whereRaw('prio < :prio', ['prio' => $this->prio])
        ->orderBy('prio', 'DESC');
    return $query->findOne();
}
```

<a name="paginierung-prio-naechster-datensatz"></a>
### nächsten Datensatz holen
 
```php
public function getNext()
{
    $query = self::query()
        ->where('status', '1')
        ->whereRaw('prio > :prio', ['prio' => $this->prio])
        ->orderBy('prio', 'ASC');
    return $query->findOne();
}
```


<a name="option-please-select"></a>
## Query inkl. einer "Bitte auswählen" Option

Nützlich bei `select`-Feldtypen im **MetaInfo** AddOn oder im **YFormbuilder**

```php
SELECT 'Bitte wählen' AS name, "" AS id UNION (SELECT name, filename AS id FROM rex_project_icon ORDER BY name)
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
