# Queries

- [Paginierung auf Datum basierende Datensätze](#paginierung-datum)
    - [vorheriger Datensatz](#paginierung-datum-vorheriger-datensatz)
    - [nächster Datensatz](#paginierung-datum-naechster-datensatz)


<a name="paginierung-datum"></a>
## Beispiel um ein Blättern auf Datum basierende Datensätze zu erstellen (News)

Die Methoden basieren auf Yorm und gehören in eine Class wie zum Beispiel

```
class News extends \rex_yform_manager_dataset
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
