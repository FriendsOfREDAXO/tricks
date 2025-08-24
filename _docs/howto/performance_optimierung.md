---
title: Performance-Optimierung für REDAXO
authors: []
prio:
---

# Performance-Optimierung für REDAXO

- [Einleitung](#einleitung)
- [Frontend-Performance](#frontend-performance)
- [Backend-Performance](#backend-performance)
- [Datenbank-Optimierung](#datenbank-optimierung)
- [Caching-Strategien](#caching-strategien)
- [Media-Pool Optimierung](#mediapool-optimierung)
- [Monitoring und Tools](#monitoring)

<a name="einleitung"></a>
## Einleitung

Performance ist ein kritischer Faktor für jede Website. Hier sind bewährte Techniken zur Optimierung von REDAXO-Installationen, die in der Community häufig diskutiert werden.

<a name="frontend-performance"></a>
## Frontend-Performance

### CSS und JavaScript optimieren

**Minification mit dem Minify-AddOn:**
```php
<?php
// CSS-Dateien zusammenfassen und minifizieren
echo minify::css([
    'assets/css/bootstrap.css',
    'assets/css/main.css',
    'assets/css/responsive.css'
]);

// JavaScript-Dateien zusammenfassen und minifizieren
echo minify::js([
    'assets/js/jquery.min.js',
    'assets/js/bootstrap.min.js',
    'assets/js/main.js'
]);
?>
```

### Bilder optimieren

**Responsive Images mit Focuspoint:**
```php
<?php
$media = rex_media::get('beispiel.jpg');
if ($media) {
    // Verschiedene Bildgrößen für responsive Design
    echo '<picture>';
    echo '<source media="(min-width: 1200px)" srcset="' . rex_media_manager::getUrl('large', $media->getFileName()) . '">';
    echo '<source media="(min-width: 768px)" srcset="' . rex_media_manager::getUrl('medium', $media->getFileName()) . '">';
    echo '<img src="' . rex_media_manager::getUrl('small', $media->getFileName()) . '" alt="' . $media->getTitle() . '">';
    echo '</picture>';
}
?>
```

### Lazy Loading implementieren

```php
<?php
// Lazy Loading für Bilder
function getLazyImage($filename, $type = 'medium', $alt = '', $class = '') {
    if (!$media = rex_media::get($filename)) {
        return '';
    }
    
    $url = rex_media_manager::getUrl($type, $filename);
    $placeholder = rex_media_manager::getUrl('placeholder', $filename);
    
    return '<img 
        src="' . $placeholder . '" 
        data-src="' . $url . '" 
        alt="' . htmlspecialchars($alt) . '" 
        class="lazy ' . $class . '" 
        loading="lazy">';
}
?>
```

<a name="backend-performance"></a>
## Backend-Performance

### Artikel-Queries optimieren

```php
<?php
// Schlecht - lädt alle Felder
$articles = rex_article::getArticlesOfCategory(1);

// Besser - nur benötigte Felder laden
$articles = rex_sql::factory()->getArray('
    SELECT id, name, status, createdate 
    FROM rex_article 
    WHERE category_id = 1 AND status = 1
    ORDER BY createdate DESC 
    LIMIT 10
');

// Noch besser - mit Prepared Statements
$sql = rex_sql::factory();
$articles = $sql->getArray('
    SELECT id, name, status, createdate 
    FROM rex_article 
    WHERE category_id = :cat_id AND status = 1
    ORDER BY createdate DESC 
    LIMIT :limit
', [
    'cat_id' => 1,
    'limit' => 10
]);
?>
```

### Memory-Usage reduzieren

```php
<?php
// Memory-intensiv
$big_result = rex_sql::factory()->getArray('SELECT * FROM big_table');
foreach ($big_result as $row) {
    // Verarbeitung
}

// Memory-schonend
$sql = rex_sql::factory();
$sql->setQuery('SELECT * FROM big_table');
while ($sql->hasNext()) {
    $row = $sql->getRow();
    // Verarbeitung
    $sql->next();
}
?>
```

<a name="datenbank-optimierung"></a>
## Datenbank-Optimierung

### Indizes setzen

```sql
-- Für häufig abgefragte Spalten
ALTER TABLE `rex_article` ADD INDEX `idx_status_catid` (`status`, `category_id`);

-- Für Sortierungen
ALTER TABLE `rex_article` ADD INDEX `idx_priority_date` (`priority`, `createdate`);

-- Für Volltextsuche
ALTER TABLE `rex_article` ADD FULLTEXT(`name`, `teaser`);
```

### Query-Analyse

```php
<?php
// Query-Performance messen
function profileQuery($query, $params = []) {
    $start = microtime(true);
    
    $sql = rex_sql::factory();
    $result = $sql->getArray($query, $params);
    
    $duration = microtime(true) - $start;
    
    if (rex::isBackend() && $duration > 0.1) {
        rex_logger::logError('database', 'Slow Query (' . round($duration, 3) . 's): ' . $query);
    }
    
    return $result;
}
?>
```

### Datenbank-Wartung

```php
<?php
// Regelmäßige Wartung via Cronjob
class DatabaseMaintenance {
    public static function optimize() {
        $sql = rex_sql::factory();
        
        // Tabellen optimieren
        $tables = ['rex_article', 'rex_article_slice', 'rex_media', 'rex_yform_data'];
        foreach ($tables as $table) {
            $sql->setQuery('OPTIMIZE TABLE `' . $table . '`');
        }
        
        // Query-Cache leeren (bei MySQL)
        $sql->setQuery('RESET QUERY CACHE');
        
        rex_logger::logInfo('system', 'Database maintenance completed');
    }
}
?>
```

<a name="caching-strategien"></a>
## Caching-Strategien

### Fragment-Caching

```php
<?php
// Cache-Fragment für teure Operationen
function getCachedContent($cache_key, $ttl = 3600) {
    $cache = rex_cache::get('my_cache', $cache_key, null);
    
    if ($cache === null) {
        // Teure Operation
        $content = generateExpensiveContent();
        
        // Im Cache speichern
        rex_cache::set('my_cache', $cache_key, $content, $ttl);
        return $content;
    }
    
    return $cache;
}

// Verwendung
$content = getCachedContent('article_list_' . $category_id, 3600);
?>
```

### Smart Cache Invalidation

```php
<?php
// Cache bei Änderungen leeren
rex_extension::register('ART_UPDATED', function(rex_extension_point $ep) {
    $article = $ep->getSubject();
    $category_id = $article->getCategoryId();
    
    // Cache für diese Kategorie leeren
    rex_cache::delete('my_cache', 'article_list_' . $category_id);
    
    // Auch Parent-Kategorien berücksichtigen
    $parent_id = rex_category::get($category_id)->getParentId();
    if ($parent_id) {
        rex_cache::delete('my_cache', 'article_list_' . $parent_id);
    }
});
?>
```

<a name="mediapool-optimierung"></a>
## Media-Pool Optimierung

### Automatische Bildoptimierung

```php
<?php
// In der boot.php
rex_extension::register('MEDIA_ADDED', function(rex_extension_point $ep) {
    $filename = $ep->getParam('filename');
    $filepath = rex_path::media($filename);
    
    // Bildoptimierung für große Uploads
    if (rex_media::isImageType(rex_file::extension($filename))) {
        $info = getimagesize($filepath);
        $max_width = 2000;
        $max_height = 2000;
        
        if ($info[0] > $max_width || $info[1] > $max_height) {
            rex_mediapool_resizeImage($filepath, $max_width, $max_height);
        }
    }
});

function rex_mediapool_resizeImage($filepath, $max_width, $max_height) {
    $manager = rex_media_manager::create('resize_original', $filepath);
    $manager->addEffect('resize', [
        'width' => $max_width,
        'height' => $max_height,
        'style' => 'maximum'
    ]);
    $manager->applyEffects();
}
?>
```

### Media-Manager Cache optimieren

```php
<?php
// Media-Manager Cache-Header setzen
rex_extension::register('MEDIA_MANAGER_BEFORE_SEND', function(rex_extension_point $ep) {
    $media = $ep->getParam('media');
    
    // Cache-Header für statische Medien
    header('Cache-Control: public, max-age=31536000'); // 1 Jahr
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
    
    // ETag für besseres Caching
    $etag = md5($media->getFileName() . $media->getUpdatedate());
    header('ETag: "' . $etag . '"');
    
    // 304 Not Modified wenn möglich
    if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && $_SERVER['HTTP_IF_NONE_MATCH'] === $etag) {
        http_response_code(304);
        exit;
    }
});
?>
```

<a name="monitoring"></a>
## Monitoring und Tools

### Performance-Monitoring

```php
<?php
class PerformanceMonitor {
    private static $timers = [];
    
    public static function start($name) {
        self::$timers[$name] = microtime(true);
    }
    
    public static function end($name) {
        if (isset(self::$timers[$name])) {
            $duration = microtime(true) - self::$timers[$name];
            
            if (rex::isBackend() && rex_be_controller::getPageObject() && rex::getUser()->isAdmin()) {
                rex_view::addJsCode('console.log("Performance: ' . $name . ' took ' . round($duration * 1000, 2) . 'ms");');
            }
            
            return $duration;
        }
        return null;
    }
}

// Verwendung
PerformanceMonitor::start('article_loading');
$articles = getComplexArticleList();
PerformanceMonitor::end('article_loading');
?>
```

### Memory-Usage überwachen

```php
<?php
function logMemoryUsage($context = '') {
    $usage = memory_get_usage(true);
    $peak = memory_get_peak_usage(true);
    
    if (rex::isBackend() && rex::getUser() && rex::getUser()->isAdmin()) {
        $message = sprintf(
            'Memory Usage%s: Current: %s, Peak: %s',
            $context ? ' (' . $context . ')' : '',
            formatBytes($usage),
            formatBytes($peak)
        );
        
        rex_logger::logInfo('performance', $message);
    }
}

function formatBytes($size) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $unit = 0;
    while ($size > 1024 && $unit < count($units) - 1) {
        $size /= 1024;
        $unit++;
    }
    return round($size, 2) . ' ' . $units[$unit];
}
?>
```

### .htaccess Optimierungen

```apache
# Gzip-Komprimierung aktivieren
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser-Caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

> **Wichtig:** Performance-Optimierung ist ein kontinuierlicher Prozess. Verwenden Sie Tools wie Google PageSpeed Insights, GTmetrix oder WebPageTest um die Auswirkungen Ihrer Optimierungen zu messen.