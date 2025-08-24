---
title: Sicherheit - Best Practices für REDAXO
authors: []
prio:
---

# Sicherheit - Best Practices für REDAXO

- [Einleitung](#einleitung)
- [Server-Sicherheit](#server-sicherheit)
- [Authentifizierung und Autorisierung](#authentifizierung)
- [Eingabe-Validierung](#eingabe-validierung)
- [Output-Encoding](#output-encoding)
- [Session-Sicherheit](#session-sicherheit)
- [Datei-Upload Sicherheit](#datei-uploads)
- [SQL-Injection Schutz](#sql-injection)
- [CSRF-Schutz](#csrf-schutz)
- [Monitoring und Logging](#monitoring)

<a name="einleitung"></a>
## Einleitung

Sicherheit ist ein kritischer Aspekt jeder Web-Anwendung. Diese Sammlung zeigt bewährte Sicherheitspraktiken für REDAXO, die in der Community häufig diskutiert werden.

<a name="server-sicherheit"></a>
## Server-Sicherheit

### .htaccess Absicherung

```apache
# Wichtige Verzeichnisse schützen
<Files ~ "^\.">
    Order allow,deny
    Deny from all
</Files>

# Cache-Verzeichnisse schützen
<Directory "redaxo/cache">
    Order allow,deny
    Deny from all
</Directory>

<Directory "redaxo/data">
    Order allow,deny
    Deny from all
</Directory>

# PHP-Dateien in Media-Ordner verhindern
<Directory "media">
    <FilesMatch "\.(php|php3|php4|php5|phtml|pl|py|jsp|asp|sh|cgi)$">
        Order allow,deny
        Deny from all
    </FilesMatch>
</Directory>

# Sensible Dateien ausschließen
<FilesMatch "(^\.|(package|composer)\.(json|lock)$|^(README|CHANGELOG|CONTRIBUTING)\.md$)">
    Order allow,deny
    Deny from all
</FilesMatch>

# Security Headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
```

### config.yml Sicherheit

```yaml
# Sichere Konfiguration
setup: false
debug:
    enabled: false
    throw_always_exception: false

# Sichere Session-Einstellungen
session:
    cookie_lifetime: 7200
    cookie_secure: true      # Nur über HTTPS
    cookie_httponly: true    # Nicht per JavaScript zugreifbar
    cookie_samesite: 'Strict'

# Sichere Passwort-Policy
password_policy:
    length: 12
    letter: true
    uppercase: true
    lowercase: true  
    digit: true
    symbol: true
```

<a name="authentifizierung"></a>
## Authentifizierung und Autorisierung

### Sichere Benutzer-Authentifizierung

```php
<?php
// Erweiterte Login-Validierung
class SecureAuth {
    private static $failed_attempts = [];
    
    public static function validateLogin($username, $password) {
        // Rate Limiting prüfen
        if (self::isRateLimited($username)) {
            throw new Exception('Zu viele Login-Versuche. Bitte warten Sie 15 Minuten.');
        }
        
        // Benutzer prüfen
        $user = rex_user::get($username);
        if (!$user) {
            self::recordFailedAttempt($username);
            throw new Exception('Ungültige Anmeldedaten.');
        }
        
        // Account-Status prüfen
        if (!$user->getStatus()) {
            throw new Exception('Benutzer-Account ist deaktiviert.');
        }
        
        // Passwort prüfen
        if (!rex_backend_login::passwordVerify($password, $user->getPassword())) {
            self::recordFailedAttempt($username);
            throw new Exception('Ungültige Anmeldedaten.');
        }
        
        // Erfolgreichen Login protokollieren
        self::clearFailedAttempts($username);
        self::logSecurityEvent('successful_login', ['user' => $username]);
        
        return $user;
    }
    
    private static function isRateLimited($username) {
        $attempts = self::$failed_attempts[$username] ?? [];
        $recent_attempts = array_filter($attempts, function($time) {
            return $time > (time() - 900); // 15 Minuten
        });
        
        return count($recent_attempts) >= 5;
    }
    
    private static function recordFailedAttempt($username) {
        self::$failed_attempts[$username][] = time();
        self::logSecurityEvent('failed_login', ['user' => $username]);
    }
    
    private static function clearFailedAttempts($username) {
        unset(self::$failed_attempts[$username]);
    }
    
    private static function logSecurityEvent($event, $data = []) {
        rex_logger::factory('security')->info($event, array_merge($data, [
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]));
    }
}
?>
```

### Zwei-Faktor-Authentifizierung

```php
<?php
// 2FA Implementation
class TwoFactorAuth {
    public static function generateSecret() {
        return bin2hex(random_bytes(16));
    }
    
    public static function generateQRCode($username, $secret) {
        $issuer = rex::getServerName();
        $qr_data = sprintf(
            'otpauth://totp/%s:%s?secret=%s&issuer=%s',
            urlencode($issuer),
            urlencode($username),
            $secret,
            urlencode($issuer)
        );
        
        return $qr_data;
    }
    
    public static function verifyToken($secret, $token) {
        $timeSlice = floor(time() / 30);
        
        // Prüfe aktuelles und vorheriges/nächstes Zeitfenster
        for ($i = -1; $i <= 1; $i++) {
            $calculated_token = self::calculateToken($secret, $timeSlice + $i);
            if (hash_equals($calculated_token, $token)) {
                return true;
            }
        }
        
        return false;
    }
    
    private static function calculateToken($secret, $timeSlice) {
        $key = pack('H*', $secret);
        $time = pack('N*', 0) . pack('N*', $timeSlice);
        $hm = hash_hmac('sha1', $time, $key, true);
        $offset = ord(substr($hm, -1)) & 0x0F;
        $hashpart = substr($hm, $offset, 4);
        $value = unpack('N', $hashpart);
        $value = $value[1];
        $value = $value & 0x7FFFFFFF;
        $modulo = pow(10, 6);
        return str_pad($value % $modulo, 6, '0', STR_PAD_LEFT);
    }
}

// Extension Point für 2FA-Prüfung
rex_extension::register('LOGIN_SUCCESS', function(rex_extension_point $ep) {
    $user = $ep->getSubject();
    $secret = $user->getValue('totp_secret');
    
    if ($secret && !isset($_SESSION['2fa_verified'])) {
        // 2FA-Eingabe anfordern
        $_SESSION['2fa_required'] = true;
        $_SESSION['pending_user'] = $user->getLogin();
        rex_response::sendRedirect('index.php?page=login&2fa=required');
    }
});
?>
```

<a name="eingabe-validierung"></a>
## Eingabe-Validierung

### Input-Sanitization

```php
<?php
class InputValidator {
    public static function sanitizeString($input, $max_length = 255) {
        $input = trim($input);
        $input = strip_tags($input);
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
        
        if ($max_length > 0) {
            $input = substr($input, 0, $max_length);
        }
        
        return $input;
    }
    
    public static function sanitizeEmail($email) {
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : false;
    }
    
    public static function sanitizeInt($input, $min = null, $max = null) {
        $int = filter_var($input, FILTER_SANITIZE_NUMBER_INT);
        $int = (int) $int;
        
        if ($min !== null && $int < $min) {
            return $min;
        }
        
        if ($max !== null && $int > $max) {
            return $max;
        }
        
        return $int;
    }
    
    public static function sanitizeUrl($url) {
        $url = filter_var($url, FILTER_SANITIZE_URL);
        return filter_var($url, FILTER_VALIDATE_URL) ? $url : false;
    }
    
    public static function sanitizeFilename($filename) {
        // Gefährliche Zeichen entfernen
        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
        
        // Doppelte Punkte entfernen (Directory Traversal)
        $filename = preg_replace('/\.+/', '.', $filename);
        
        // Gefährliche Dateiendungen blocken
        $dangerous_extensions = ['php', 'phtml', 'php3', 'php4', 'php5', 'pl', 'py', 'jsp', 'asp', 'sh', 'cgi', 'exe', 'bat'];
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        if (in_array($extension, $dangerous_extensions)) {
            $filename .= '.txt';
        }
        
        return $filename;
    }
}

// Verwendung in YForm
rex_extension::register('YFORM_DATA_UPDATE', function(rex_extension_point $ep) {
    $data = $ep->getParam('data');
    
    // Alle String-Felder sanitisieren
    foreach ($data as $key => $value) {
        if (is_string($value)) {
            $data[$key] = InputValidator::sanitizeString($value);
        }
    }
    
    $ep->setParam('data', $data);
});
?>
```

<a name="output-encoding"></a>
## Output-Encoding

### XSS-Schutz

```php
<?php
class OutputEncoder {
    public static function html($input) {
        return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }
    
    public static function htmlAttr($input) {
        return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }
    
    public static function js($input) {
        return json_encode($input, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
    }
    
    public static function url($input) {
        return urlencode($input);
    }
    
    public static function css($input) {
        // CSS-Escaping für dynamische Styles
        return preg_replace('/[^a-zA-Z0-9\s\-_#.]/', '', $input);
    }
}

// Template-Funktionen für sicheren Output
function escape($input, $context = 'html') {
    switch ($context) {
        case 'html':
            return OutputEncoder::html($input);
        case 'attr':
            return OutputEncoder::htmlAttr($input);
        case 'js':
            return OutputEncoder::js($input);
        case 'url':
            return OutputEncoder::url($input);
        case 'css':
            return OutputEncoder::css($input);
        default:
            return OutputEncoder::html($input);
    }
}

// Verwendung in Templates
// <?= escape($user_input) ?>
// <div class="<?= escape($css_class, 'css') ?>">
// <script>var data = <?= escape($data, 'js') ?>;</script>
?>
```

<a name="session-sicherheit"></a>
## Session-Sicherheit

### Session-Management

```php
<?php
class SecureSession {
    public static function start() {
        // Sichere Session-Parameter
        ini_set('session.cookie_httponly', 1);
        ini_set('session.cookie_secure', isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on');
        ini_set('session.use_only_cookies', 1);
        ini_set('session.cookie_samesite', 'Strict');
        
        // Session-Fixation verhindern
        session_start();
        
        if (!isset($_SESSION['initiated'])) {
            session_regenerate_id(true);
            $_SESSION['initiated'] = true;
        }
        
        // Session-Hijacking erkennen
        self::validateSession();
    }
    
    private static function validateSession() {
        $expected_fingerprint = self::getSessionFingerprint();
        
        if (!isset($_SESSION['fingerprint'])) {
            $_SESSION['fingerprint'] = $expected_fingerprint;
        } elseif ($_SESSION['fingerprint'] !== $expected_fingerprint) {
            self::destroySession();
            throw new Exception('Session-Sicherheitsverletzung erkannt.');
        }
        
        // Session-Timeout prüfen
        if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) {
            self::destroySession();
            throw new Exception('Session ist abgelaufen.');
        }
        
        $_SESSION['last_activity'] = time();
    }
    
    private static function getSessionFingerprint() {
        return hash('sha256', 
            $_SERVER['HTTP_USER_AGENT'] . 
            $_SERVER['REMOTE_ADDR'] . 
            session_id()
        );
    }
    
    public static function destroySession() {
        $_SESSION = [];
        
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        
        session_destroy();
    }
}
?>
```

<a name="datei-uploads"></a>
## Datei-Upload Sicherheit

### Sichere Datei-Uploads

```php
<?php
class SecureFileUpload {
    private static $allowed_mime_types = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    private static $max_file_size = 10485760; // 10MB
    
    public static function validateUpload($file) {
        $errors = [];
        
        // File-Array prüfen
        if (!isset($file['error']) || is_array($file['error'])) {
            $errors[] = 'Ungültige Upload-Parameter.';
            return $errors;
        }
        
        // Upload-Fehler prüfen
        switch ($file['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                $errors[] = 'Keine Datei wurde hochgeladen.';
                break;
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $errors[] = 'Datei zu groß.';
                break;
            default:
                $errors[] = 'Unbekannter Upload-Fehler.';
                break;
        }
        
        // Dateigröße prüfen
        if ($file['size'] > self::$max_file_size) {
            $errors[] = 'Datei ist zu groß. Maximum: ' . number_format(self::$max_file_size / 1048576, 2) . 'MB';
        }
        
        // MIME-Type prüfen
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime_type = $finfo->file($file['tmp_name']);
        
        if (!in_array($mime_type, self::$allowed_mime_types)) {
            $errors[] = 'Dateityp nicht erlaubt: ' . $mime_type;
        }
        
        // Dateiname validieren
        $filename = InputValidator::sanitizeFilename($file['name']);
        if ($filename !== $file['name']) {
            $errors[] = 'Ungültiger Dateiname.';
        }
        
        // Dateiinhalt prüfen (für Bilder)
        if (strpos($mime_type, 'image/') === 0) {
            if (!self::validateImageContent($file['tmp_name'])) {
                $errors[] = 'Ungültiger Bildinhalt.';
            }
        }
        
        return $errors;
    }
    
    private static function validateImageContent($tmp_name) {
        // Bildinhalt mit getimagesize prüfen
        $image_info = getimagesize($tmp_name);
        if ($image_info === false) {
            return false;
        }
        
        // Zusätzliche Validierung mit GD
        switch ($image_info[2]) {
            case IMAGETYPE_JPEG:
                $image = imagecreatefromjpeg($tmp_name);
                break;
            case IMAGETYPE_PNG:
                $image = imagecreatefrompng($tmp_name);
                break;
            case IMAGETYPE_GIF:
                $image = imagecreatefromgif($tmp_name);
                break;
            default:
                return false;
        }
        
        if ($image === false) {
            return false;
        }
        
        imagedestroy($image);
        return true;
    }
    
    public static function secureMove($tmp_name, $destination) {
        // Zielverzeichnis erstellen falls nötig
        $dir = dirname($destination);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        
        // Datei verschieben
        if (!move_uploaded_file($tmp_name, $destination)) {
            throw new Exception('Fehler beim Speichern der Datei.');
        }
        
        // Dateiberechtigungen setzen
        chmod($destination, 0644);
        
        return true;
    }
}

// YForm Upload-Validierung
rex_extension::register('YFORM_VALIDATE_BEFORE', function(rex_extension_point $ep) {
    foreach ($_FILES as $field_name => $file) {
        if ($file['size'] > 0) {
            $errors = SecureFileUpload::validateUpload($file);
            if (!empty($errors)) {
                $yform = $ep->getSubject();
                $yform->setWarning(null, implode('<br>', $errors));
                break;
            }
        }
    }
});
?>
```

<a name="sql-injection"></a>
## SQL-Injection Schutz

### Sichere Datenbankabfragen

```php
<?php
class SecureDatabase {
    public static function select($table, $conditions = [], $fields = '*', $order = '', $limit = '') {
        $sql = rex_sql::factory();
        
        // Tabellennamen whitelisten
        if (!self::isValidTableName($table)) {
            throw new InvalidArgumentException('Ungültiger Tabellenname: ' . $table);
        }
        
        // Query-Builder mit Prepared Statements
        $query = 'SELECT ' . self::sanitizeFields($fields) . ' FROM `' . $table . '`';
        $params = [];
        
        if (!empty($conditions)) {
            $where_parts = [];
            foreach ($conditions as $field => $value) {
                if (!self::isValidFieldName($field)) {
                    throw new InvalidArgumentException('Ungültiger Feldname: ' . $field);
                }
                $where_parts[] = '`' . $field . '` = :' . $field;
                $params[$field] = $value;
            }
            $query .= ' WHERE ' . implode(' AND ', $where_parts);
        }
        
        if ($order) {
            $query .= ' ORDER BY ' . self::sanitizeOrder($order);
        }
        
        if ($limit) {
            $query .= ' LIMIT ' . self::sanitizeLimit($limit);
        }
        
        return $sql->getArray($query, $params);
    }
    
    public static function insert($table, $data) {
        $sql = rex_sql::factory();
        
        if (!self::isValidTableName($table)) {
            throw new InvalidArgumentException('Ungültiger Tabellenname: ' . $table);
        }
        
        $fields = [];
        $placeholders = [];
        $params = [];
        
        foreach ($data as $field => $value) {
            if (!self::isValidFieldName($field)) {
                throw new InvalidArgumentException('Ungültiger Feldname: ' . $field);
            }
            $fields[] = '`' . $field . '`';
            $placeholders[] = ':' . $field;
            $params[$field] = $value;
        }
        
        $query = 'INSERT INTO `' . $table . '` (' . implode(', ', $fields) . ') VALUES (' . implode(', ', $placeholders) . ')';
        
        return $sql->setQuery($query, $params);
    }
    
    private static function isValidTableName($table) {
        // Nur erlaubte Zeichen für Tabellennamen
        return preg_match('/^[a-zA-Z0-9_]+$/', $table) === 1;
    }
    
    private static function isValidFieldName($field) {
        // Nur erlaubte Zeichen für Feldnamen
        return preg_match('/^[a-zA-Z0-9_]+$/', $field) === 1;
    }
    
    private static function sanitizeFields($fields) {
        if ($fields === '*') {
            return '*';
        }
        
        if (is_array($fields)) {
            $sanitized = [];
            foreach ($fields as $field) {
                if (self::isValidFieldName($field)) {
                    $sanitized[] = '`' . $field . '`';
                }
            }
            return implode(', ', $sanitized);
        }
        
        return '*';
    }
    
    private static function sanitizeOrder($order) {
        // Nur sichere ORDER BY Klauseln erlauben
        $allowed_pattern = '/^[a-zA-Z0-9_]+\s*(ASC|DESC)?$/i';
        return preg_match($allowed_pattern, trim($order)) ? $order : '';
    }
    
    private static function sanitizeLimit($limit) {
        // Nur numerische LIMIT-Werte erlauben
        return is_numeric($limit) ? (int)$limit : 0;
    }
}
?>
```

<a name="csrf-schutz"></a>
## CSRF-Schutz

### Cross-Site Request Forgery Schutz

```php
<?php
class CSRFProtection {
    public static function generateToken() {
        if (!isset($_SESSION['csrf_tokens'])) {
            $_SESSION['csrf_tokens'] = [];
        }
        
        $token = bin2hex(random_bytes(32));
        $_SESSION['csrf_tokens'][$token] = time();
        
        // Alte Tokens aufräumen (älter als 1 Stunde)
        self::cleanupTokens();
        
        return $token;
    }
    
    public static function validateToken($token) {
        if (!isset($_SESSION['csrf_tokens'][$token])) {
            return false;
        }
        
        $token_time = $_SESSION['csrf_tokens'][$token];
        
        // Token ist 1 Stunde gültig
        if (time() - $token_time > 3600) {
            unset($_SESSION['csrf_tokens'][$token]);
            return false;
        }
        
        // Token nach Verwendung löschen (One-Time-Use)
        unset($_SESSION['csrf_tokens'][$token]);
        
        return true;
    }
    
    private static function cleanupTokens() {
        if (!isset($_SESSION['csrf_tokens'])) {
            return;
        }
        
        $current_time = time();
        foreach ($_SESSION['csrf_tokens'] as $token => $time) {
            if ($current_time - $time > 3600) {
                unset($_SESSION['csrf_tokens'][$token]);
            }
        }
    }
    
    public static function getHiddenField() {
        $token = self::generateToken();
        return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token) . '">';
    }
}

// Verwendung in Formularen
// echo CSRFProtection::getHiddenField();

// Validierung bei Form-Submission
rex_extension::register('OUTPUT_FILTER', function(rex_extension_point $ep) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $token = $_POST['csrf_token'] ?? '';
        
        if (!CSRFProtection::validateToken($token)) {
            throw new Exception('CSRF-Token ist ungültig oder abgelaufen.');
        }
    }
});
?>
```

<a name="monitoring"></a>
## Monitoring und Logging

### Security Event Logging

```php
<?php
class SecurityLogger {
    private static $events = [];
    
    public static function logEvent($event_type, $details = []) {
        $event = [
            'timestamp' => date('Y-m-d H:i:s'),
            'type' => $event_type,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            'user' => rex::isBackend() && rex::getUser() ? rex::getUser()->getLogin() : 'anonymous',
            'details' => $details
        ];
        
        self::$events[] = $event;
        
        // Kritische Events sofort loggen
        $critical_events = ['sql_injection_attempt', 'xss_attempt', 'unauthorized_access', 'brute_force'];
        
        if (in_array($event_type, $critical_events)) {
            rex_logger::logError('security', 'CRITICAL: ' . $event_type, $event);
            self::alertAdmin($event);
        } else {
            rex_logger::logInfo('security', $event_type, $event);
        }
    }
    
    private static function alertAdmin($event) {
        // Admin per E-Mail benachrichtigen
        $mailer = rex_mailer::factory();
        $mailer->addAddress(rex::getProperty('error_email'));
        $mailer->Subject = 'Security Alert - ' . rex::getServerName();
        $mailer->Body = "Security Event detected:\n\n" . 
                       "Type: " . $event['type'] . "\n" .
                       "IP: " . $event['ip'] . "\n" .
                       "User: " . $event['user'] . "\n" .
                       "Time: " . $event['timestamp'] . "\n" .
                       "Details: " . json_encode($event['details'], JSON_PRETTY_PRINT);
        
        try {
            $mailer->send();
        } catch (Exception $e) {
            rex_logger::logError('security', 'Failed to send security alert', ['error' => $e->getMessage()]);
        }
    }
    
    public static function getEvents($limit = 100) {
        return array_slice(self::$events, -$limit);
    }
}

// Verschiedene Security Events überwachen
rex_extension::register('LOGIN_FAILED', function() {
    SecurityLogger::logEvent('login_failed', ['username' => $_POST['username'] ?? 'unknown']);
});

rex_extension::register('LOGIN_SUCCESS', function($ep) {
    SecurityLogger::logEvent('login_success', ['username' => $ep->getSubject()->getLogin()]);
});

// SQL-Injection Versuche erkennen
rex_extension::register('OUTPUT_FILTER_BEFORE', function($ep) {
    $content = $ep->getSubject();
    $suspicious_patterns = [
        '/union.*select/i',
        '/sleep\s*\(/i',
        '/benchmark\s*\(/i',
        '/load_file\s*\(/i'
    ];
    
    foreach ($_REQUEST as $key => $value) {
        if (is_string($value)) {
            foreach ($suspicious_patterns as $pattern) {
                if (preg_match($pattern, $value)) {
                    SecurityLogger::logEvent('sql_injection_attempt', [
                        'parameter' => $key,
                        'value' => substr($value, 0, 200)
                    ]);
                    break;
                }
            }
        }
    }
});
?>
```

> **Wichtig:** Sicherheit ist ein kontinuierlicher Prozess. Halten Sie REDAXO und alle AddOns immer auf dem neuesten Stand und führen Sie regelmäßige Sicherheitsaudits durch.