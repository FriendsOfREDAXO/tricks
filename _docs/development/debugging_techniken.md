---
title: Debugging-Techniken für REDAXO
authors: []
prio:
---

# Debugging-Techniken für REDAXO

- [Einleitung](#einleitung)
- [Grundlegende Debugging-Tools](#grundlagen)
- [Frontend-Debugging](#frontend-debugging)
- [Backend-Debugging](#backend-debugging)
- [SQL-Debugging](#sql-debugging)
- [AddOn-Debugging](#addon-debugging)
- [Performance-Debugging](#performance-debugging)
- [Produktionsumgebung debuggen](#produktionsumgebung)

<a name="einleitung"></a>
## Einleitung

Effektives Debugging ist entscheidend für die Entwicklung robuster REDAXO-Anwendungen. Diese Sammlung zeigt bewährte Debugging-Techniken, die in der Community häufig diskutiert werden.

<a name="grundlagen"></a>
## Grundlegende Debugging-Tools

### Debug-Modus aktivieren

```php
<?php
// In der boot.php oder config.yml
if (rex::isBackend() && rex::getUser() && rex::getUser()->isAdmin()) {
    // Allgemeiner Debug-Modus
    rex::setProperty('debug', ['enabled' => true, 'throw_always_exception' => true]);
    
    // SQL-Debugging aktivieren
    rex_sql::setDebug(true);
    
    // PHP-Fehler anzeigen
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
}
?>
```

### Custom Debug-Logger

```php
<?php
class DebugHelper {
    public static function log($message, $context = [], $level = 'debug') {
        if (!rex::isDebugMode()) {
            return;
        }
        
        $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
        $caller = isset($trace[1]) ? $trace[1]['class'] . '::' . $trace[1]['function'] : 'unknown';
        
        $logMessage = sprintf('[%s] %s', $caller, $message);
        
        if (!empty($context)) {
            $logMessage .= ' | Context: ' . json_encode($context, JSON_PRETTY_PRINT);
        }
        
        rex_logger::factory()->log($level, $logMessage, $context);
    }
    
    public static function dump($var, $label = '') {
        if (!rex::isDebugMode()) {
            return;
        }
        
        $output = $label ? '<strong>' . htmlspecialchars($label) . ':</strong><br>' : '';
        $output .= '<pre style="background: #f5f5f5; padding: 10px; margin: 10px 0; border: 1px solid #ddd;">';
        $output .= htmlspecialchars(print_r($var, true));
        $output .= '</pre>';
        
        if (rex::isBackend()) {
            echo $output;
        } else {
            rex_response::sendContent($output);
        }
    }
    
    public static function trace($message = '') {
        if (!rex::isDebugMode()) {
            return;
        }
        
        $trace = debug_backtrace();
        $output = '<h3>Stack Trace' . ($message ? ': ' . $message : '') . '</h3>';
        $output .= '<ol style="font-size: 12px; margin: 10px 0;">';
        
        foreach ($trace as $i => $step) {
            $file = isset($step['file']) ? basename($step['file']) : 'unknown';
            $line = isset($step['line']) ? $step['line'] : 'unknown';
            $function = isset($step['function']) ? $step['function'] : 'unknown';
            $class = isset($step['class']) ? $step['class'] . '::' : '';
            
            $output .= sprintf('<li>%s%s() in %s:%s</li>', $class, $function, $file, $line);
        }
        
        $output .= '</ol>';
        echo $output;
    }
}
?>
```

<a name="frontend-debugging"></a>
## Frontend-Debugging

### Artikel-Debugging

```php
<?php
// Artikel-Details anzeigen
function debugArticle($article_id = null) {
    if (!rex::isDebugMode()) return;
    
    $article = $article_id ? rex_article::get($article_id) : rex_article::getCurrent();
    
    if (!$article) {
        DebugHelper::log('Article not found', ['id' => $article_id]);
        return;
    }
    
    $debug_info = [
        'ID' => $article->getId(),
        'Name' => $article->getName(),
        'Category' => $article->getCategoryId(),
        'Template' => $article->getTemplateId(),
        'Status' => $article->getStatus(),
        'Priority' => $article->getPriority(),
        'Create Date' => date('d.m.Y H:i', $article->getCreatedate()),
        'Update Date' => date('d.m.Y H:i', $article->getUpdatedate()),
        'Clang' => $article->getClangId()
    ];
    
    DebugHelper::dump($debug_info, 'Article Info');
}

// Slices debuggen
function debugSlices($article_id = null) {
    if (!rex::isDebugMode()) return;
    
    $article = $article_id ? rex_article::get($article_id) : rex_article::getCurrent();
    
    if (!$article) return;
    
    $slices = rex_article_slice::getSlicesForArticle($article->getId(), $article->getClangId());
    $slice_info = [];
    
    foreach ($slices as $slice) {
        $slice_info[] = [
            'ID' => $slice->getId(),
            'Module ID' => $slice->getModuleId(),
            'Module Name' => $slice->getModule() ? $slice->getModule()->getName() : 'Unknown',
            'Ctype' => $slice->getCtype(),
            'Priority' => $slice->getPriority()
        ];
    }
    
    DebugHelper::dump($slice_info, 'Article Slices');
}
?>
```

### Template-Debugging

```php
<?php
// Template-Variablen debuggen
function debugTemplateVars() {
    if (!rex::isDebugMode()) return;
    
    $template_vars = rex_var::getGlobalVars();
    DebugHelper::dump($template_vars, 'Template Variables');
    
    // REX_VARS die aktuell verfügbar sind
    $rex_vars = [
        'REX_ARTICLE_ID' => REX_ARTICLE_ID,
        'REX_CATEGORY_ID' => REX_CATEGORY_ID,
        'REX_CLANG_ID' => REX_CLANG_ID,
        'REX_TEMPLATE_ID' => rex_article::getCurrentId() ? rex_article::getCurrent()->getTemplateId() : 'none'
    ];
    
    DebugHelper::dump($rex_vars, 'REX Variables');
}

// CSS/JS Dependencies anzeigen
function debugAssets() {
    if (!rex::isDebugMode()) return;
    
    $assets = [
        'CSS Files' => rex_view::getCssFiles(),
        'JS Files' => rex_view::getJsFiles(),
        'CSS Code' => rex_view::getCssCode(),
        'JS Code' => rex_view::getJsCode()
    ];
    
    DebugHelper::dump($assets, 'Loaded Assets');
}
?>
```

<a name="backend-debugging"></a>
## Backend-Debugging

### Extension Point Debugging

```php
<?php
// Extension Points überwachen
class ExtensionDebugger {
    private static $ep_calls = [];
    
    public static function enable() {
        if (!rex::isDebugMode()) return;
        
        // Alle Extension Points loggen
        $extension_points = [
            'OUTPUT_FILTER', 'URL_REWRITE', 'MEDIA_ADDED', 'ART_UPDATED',
            'CAT_UPDATED', 'SLICE_ADDED', 'SLICE_UPDATED', 'SLICE_DELETED'
        ];
        
        foreach ($extension_points as $ep) {
            rex_extension::register($ep, [self::class, 'logExtensionPoint'], rex_extension::EARLY);
        }
    }
    
    public static function logExtensionPoint(rex_extension_point $ep) {
        $ep_name = $ep->getName();
        $params = $ep->getParams();
        $subject = $ep->getSubject();
        
        self::$ep_calls[] = [
            'time' => microtime(true),
            'name' => $ep_name,
            'params' => array_keys($params),
            'subject_type' => is_object($subject) ? get_class($subject) : gettype($subject)
        ];
        
        DebugHelper::log('Extension Point called', [
            'name' => $ep_name,
            'params' => array_keys($params)
        ]);
        
        return $ep->getSubject();
    }
    
    public static function showStats() {
        if (!rex::isDebugMode()) return;
        
        DebugHelper::dump(self::$ep_calls, 'Extension Point Calls');
    }
}

// Aktivieren in boot.php
ExtensionDebugger::enable();
?>
```

### Backend-Page Debugging

```php
<?php
// Backend-Page Info anzeigen
function debugBackendPage() {
    if (!rex::isBackend() || !rex::isDebugMode()) return;
    
    $page = rex_be_controller::getCurrentPage();
    $page_parts = rex_be_controller::getCurrentPageParts();
    
    $debug_info = [
        'Current Page' => $page,
        'Page Parts' => $page_parts,
        'User' => rex::getUser() ? rex::getUser()->getLogin() : 'none',
        'User Role' => rex::getUser() ? rex::getUser()->getRole() : 'none',
        'Backend Language' => rex::getUser() ? rex::getUser()->getLanguage() : rex_i18n::getLanguage()
    ];
    
    DebugHelper::dump($debug_info, 'Backend Page Info');
}
?>
```

<a name="sql-debugging"></a>
## SQL-Debugging

### SQL-Query Monitoring

```php
<?php
class SqlDebugger {
    private static $queries = [];
    
    public static function enable() {
        if (!rex::isDebugMode()) return;
        
        // SQL-Debugging aktivieren
        rex_sql::setDebug(true);
        
        // Custom SQL-Logger
        rex_extension::register('SQL_QUERY', [self::class, 'logQuery']);
    }
    
    public static function logQuery(rex_extension_point $ep) {
        $query = $ep->getParam('query');
        $start_time = microtime(true);
        
        // Query ausführen
        $result = $ep->getSubject();
        
        $duration = microtime(true) - $start_time;
        
        self::$queries[] = [
            'query' => $query,
            'duration' => $duration,
            'timestamp' => date('H:i:s')
        ];
        
        // Langsame Queries warnen
        if ($duration > 0.1) {
            rex_logger::logWarning('database', 'Slow Query (' . round($duration, 3) . 's): ' . substr($query, 0, 100) . '...');
        }
        
        return $result;
    }
    
    public static function showStats() {
        if (!rex::isDebugMode()) return;
        
        $total_time = array_sum(array_column(self::$queries, 'duration'));
        $slow_queries = array_filter(self::$queries, function($q) { return $q['duration'] > 0.1; });
        
        $stats = [
            'Total Queries' => count(self::$queries),
            'Total Time' => round($total_time, 3) . 's',
            'Average Time' => count(self::$queries) ? round($total_time / count(self::$queries), 3) . 's' : '0s',
            'Slow Queries' => count($slow_queries)
        ];
        
        DebugHelper::dump($stats, 'SQL Statistics');
        
        if (!empty($slow_queries)) {
            DebugHelper::dump($slow_queries, 'Slow Queries');
        }
    }
}

// Aktivieren
SqlDebugger::enable();
?>
```

### YForm-SQL Debugging

```php
<?php
// YForm Query-Builder debuggen
rex_extension::register('YFORM_DATA_LIST', function(rex_extension_point $ep) {
    if (!rex::isDebugMode()) return;
    
    $list = $ep->getSubject();
    $table = $ep->getParam('table');
    
    if ($list instanceof rex_yform_manager_query) {
        $query = $list->getQuery();
        DebugHelper::log('YForm Query', [
            'table' => $table->getTableName(),
            'query' => $query
        ]);
    }
    
    return $list;
});
?>
```

<a name="addon-debugging"></a>
## AddOn-Debugging

### AddOn-Status überprüfen

```php
<?php
function debugAddons() {
    if (!rex::isDebugMode()) return;
    
    $addons = rex_addon::getRegisteredAddons();
    $addon_info = [];
    
    foreach ($addons as $addon) {
        $addon_info[] = [
            'Name' => $addon->getName(),
            'Version' => $addon->getVersion(),
            'Status' => $addon->isAvailable() ? 'Available' : 'Not Available',
            'Installed' => $addon->isInstalled() ? 'Yes' : 'No',
            'Activated' => $addon->isActivated() ? 'Yes' : 'No'
        ];
    }
    
    DebugHelper::dump($addon_info, 'AddOn Status');
}

// Plugin-Status überprüfen
function debugPlugins($addon_name) {
    if (!rex::isDebugMode()) return;
    
    $addon = rex_addon::get($addon_name);
    if (!$addon->exists()) {
        DebugHelper::log('AddOn not found', ['name' => $addon_name]);
        return;
    }
    
    $plugins = $addon->getRegisteredPlugins();
    $plugin_info = [];
    
    foreach ($plugins as $plugin) {
        $plugin_info[] = [
            'Name' => $plugin->getName(),
            'Version' => $plugin->getVersion(),
            'Status' => $plugin->isAvailable() ? 'Available' : 'Not Available'
        ];
    }
    
    DebugHelper::dump($plugin_info, $addon_name . ' Plugins');
}
?>
```

<a name="performance-debugging"></a>
## Performance-Debugging

### Memory-Usage Tracking

```php
<?php
class MemoryProfiler {
    private static $checkpoints = [];
    
    public static function checkpoint($name) {
        if (!rex::isDebugMode()) return;
        
        self::$checkpoints[$name] = [
            'memory' => memory_get_usage(true),
            'peak' => memory_get_peak_usage(true),
            'time' => microtime(true)
        ];
    }
    
    public static function report() {
        if (!rex::isDebugMode() || empty(self::$checkpoints)) return;
        
        $report = [];
        $prev_memory = 0;
        $start_time = null;
        
        foreach (self::$checkpoints as $name => $data) {
            if ($start_time === null) {
                $start_time = $data['time'];
            }
            
            $report[] = [
                'Checkpoint' => $name,
                'Memory' => self::formatBytes($data['memory']),
                'Memory Diff' => $prev_memory ? self::formatBytes($data['memory'] - $prev_memory) : '0 B',
                'Peak' => self::formatBytes($data['peak']),
                'Time' => round($data['time'] - $start_time, 3) . 's'
            ];
            
            $prev_memory = $data['memory'];
        }
        
        DebugHelper::dump($report, 'Memory Profile');
    }
    
    private static function formatBytes($bytes) {
        $units = ['B', 'KB', 'MB', 'GB'];
        $unit = 0;
        while ($bytes > 1024 && $unit < count($units) - 1) {
            $bytes /= 1024;
            $unit++;
        }
        return round($bytes, 2) . ' ' . $units[$unit];
    }
}

// Verwendung
MemoryProfiler::checkpoint('Start');
// ... Code ...
MemoryProfiler::checkpoint('After Heavy Operation');
// ... mehr Code ...
MemoryProfiler::checkpoint('End');
MemoryProfiler::report();
?>
```

<a name="produktionsumgebung"></a>
## Produktionsumgebung debuggen

### Safe Debug Mode

```php
<?php
// Debugging nur für bestimmte IPs oder User
class SafeDebugger {
    private static $debug_ips = ['127.0.0.1', '::1']; // Localhost
    private static $debug_users = ['admin', 'developer'];
    
    public static function isDebugAllowed() {
        // IP-basiertes Debugging
        $client_ip = $_SERVER['REMOTE_ADDR'] ?? '';
        if (in_array($client_ip, self::$debug_ips)) {
            return true;
        }
        
        // User-basiertes Debugging
        if (rex::isBackend() && rex::getUser()) {
            return in_array(rex::getUser()->getLogin(), self::$debug_users);
        }
        
        // GET-Parameter (nur in Development)
        if (rex::getEnvironment() === 'dev' && isset($_GET['debug'])) {
            return $_GET['debug'] === 'true';
        }
        
        return false;
    }
    
    public static function conditionalDebug($callback) {
        if (self::isDebugAllowed()) {
            call_user_func($callback);
        }
    }
}

// Verwendung
SafeDebugger::conditionalDebug(function() {
    DebugHelper::dump($_SESSION, 'Session Data');
    debugArticle();
    SqlDebugger::showStats();
});
?>
```

### Error-Handler für Production

```php
<?php
// Custom Error Handler
function customErrorHandler($errno, $errstr, $errfile, $errline) {
    $error_types = [
        E_ERROR => 'Fatal Error',
        E_WARNING => 'Warning',
        E_PARSE => 'Parse Error',
        E_NOTICE => 'Notice',
        E_CORE_ERROR => 'Core Error',
        E_CORE_WARNING => 'Core Warning',
        E_COMPILE_ERROR => 'Compile Error',
        E_COMPILE_WARNING => 'Compile Warning',
        E_USER_ERROR => 'User Error',
        E_USER_WARNING => 'User Warning',
        E_USER_NOTICE => 'User Notice',
        E_STRICT => 'Strict Notice',
        E_RECOVERABLE_ERROR => 'Recoverable Error'
    ];
    
    $error_type = $error_types[$errno] ?? 'Unknown Error';
    
    $error_message = sprintf(
        '[%s] %s in %s on line %d',
        $error_type,
        $errstr,
        $errfile,
        $errline
    );
    
    // Log error
    rex_logger::logError('php', $error_message);
    
    // Show user-friendly message in production
    if (rex::getEnvironment() === 'prod' && !SafeDebugger::isDebugAllowed()) {
        if ($errno === E_ERROR || $errno === E_CORE_ERROR || $errno === E_COMPILE_ERROR) {
            echo '<h1>Oops! Ein Fehler ist aufgetreten.</h1>';
            echo '<p>Wir arbeiten bereits an einer Lösung. Bitte versuchen Sie es später erneut.</p>';
            exit;
        }
    }
    
    return false; // PHP default error handler
}

// Nur in Production registrieren
if (rex::getEnvironment() === 'prod') {
    set_error_handler('customErrorHandler');
}
?>
```

> **Wichtig:** Debugging-Code sollte in der Produktionsumgebung nie für alle Benutzer aktiviert sein. Verwenden Sie immer Zugangskontrollen wie IP-Restrictions oder spezielle User-Rollen.