# Perfomance prüfen

## Queries zählen und ausgeben

### 1. Datei `/redaxo/src/core/lib/response.php` öffnen

**Suche**

```php
// ca. Zeile 126
public static function sendPage($content, $lastModified = null)
{
```

**Ersetze**

```php
public static function sendPage($content, $lastModified = null)
{
    // header('X-COUNT: '.array_sum(rex_sql::$count));
    // ob_start();dump(rex_sql::$count);$content = ob_get_clean().$content;

```


### 2. Datei `/redaxo/src/core/lib/sql/sql.php` öffnen

**Suche**

```php
// ca. Zeile 50
protected static $pdo = [];
```

**Ersetze**

```php
protected static $pdo = [];

public static $count = [];
```

--


**Suche**

```php
// ca. Zeile 266

public function execute(array $params = [], array $options = [])
{
    if (!$this->stmt) {
        throw new rex_sql_exception('you need to prepare a query before calling execute()');
    }
```

**Ersetze**

```php

public function execute(array $params = [], array $options = [])
{
    if (!$this->stmt) {
        throw new rex_sql_exception('you need to prepare a query before calling execute()');
    }

    self::$count[$this->query] = (isset(self::$count[$this->query]) ? self::$count[$this->query] : 0) + 1;
```

--


**Suche**

```php
// ca. Zeile 342
try {
    $this->stmt = $pdo->query($query);
    $this->rows = $this->stmt->rowCount();
```

**Ersetze**

```php
try {
    self::$count[$query] = (isset(self::$count[$query]) ? self::$count[$query] : 0) + 1;
    $this->stmt = $pdo->query($query);
    $this->rows = $this->stmt->rowCount();
```

### 3. Anzahl der Queries immer ausgeben

In der Datei `/redaxo/src/core/lib/response.php` den Kommentar vor der eingefügten Zeile `// header('X-COUNT: '.array_sum(rex_sql::$count));` löschen

Im Response-Header steht unter X-Count dann die Anzahl aller Queries.


### 4. Welche Queries wurden aufgerufen

In der Datei `/redaxo/src/core/lib/response.php` den Kommentar vor der eingefügten Zeile `// ob_start();dump(rex_sql::$count);$content = ob_get_clean().$content;` löschen

Auf der Website erscheint ein Dump mit der Anzahl der Queries und deren Aufrufe.