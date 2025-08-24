---
title: Deployment-Strategien für REDAXO
authors: []
prio:
---

# Deployment-Strategien für REDAXO

- [Einleitung](#einleitung)
- [Umgebungen verwalten](#umgebungen)
- [Automatisiertes Deployment](#automatisiertes-deployment)
- [Datenbankmigrationen](#datenbankmigrationen)
- [Asset-Management](#asset-management)
- [Backup-Strategien](#backup-strategien)
- [Zero-Downtime Deployment](#zero-downtime)
- [Monitoring nach Deployment](#monitoring)

<a name="einleitung"></a>
## Einleitung

Professionelles Deployment ist entscheidend für stabile REDAXO-Websites. Diese Sammlung zeigt bewährte Deployment-Strategien, die in der Community häufig diskutiert werden.

<a name="umgebungen"></a>
## Umgebungen verwalten

### Environment-basierte Konfiguration

```yaml
# config/config.yml (Base Configuration)
setup: false
debug:
  enabled: false

# config/config.local.yml (Development)
debug:
  enabled: true
  throw_always_exception: true
db:
  1:
    host: localhost
    login: dev_user
    password: dev_password
    name: redaxo_dev

# config/config.prod.yml (Production)  
session:
  cookie_secure: true
  cookie_httponly: true
db:
  1:
    host: prod-db-server
    login: prod_user
    password: secure_prod_password
    name: redaxo_prod
```

### Environment Detection

```php
<?php
// In der boot.php
class EnvironmentManager {
    private static $environment = null;
    
    public static function detect() {
        if (self::$environment !== null) {
            return self::$environment;
        }
        
        // Environment über Umgebungsvariable
        if ($env = getenv('REDAXO_ENV')) {
            self::$environment = $env;
            return self::$environment;
        }
        
        // Environment über Server-Name erkennen
        $server_name = $_SERVER['SERVER_NAME'] ?? '';
        
        if (strpos($server_name, '.local') !== false || 
            strpos($server_name, 'localhost') !== false ||
            $server_name === '127.0.0.1') {
            self::$environment = 'development';
        } elseif (strpos($server_name, 'staging') !== false ||
                  strpos($server_name, 'test') !== false) {
            self::$environment = 'staging';
        } else {
            self::$environment = 'production';
        }
        
        return self::$environment;
    }
    
    public static function is($environment) {
        return self::detect() === $environment;
    }
    
    public static function loadConfig() {
        $env = self::detect();
        $config_file = rex_path::coreData("config.{$env}.yml");
        
        if (file_exists($config_file)) {
            $config = rex_file::getConfig($config_file);
            
            // Config in REDAXO einmergen
            foreach ($config as $key => $value) {
                rex::setProperty($key, $value);
            }
        }
    }
}

// Environment-spezifische Konfiguration laden
EnvironmentManager::loadConfig();

// Environment-abhängige Einstellungen
if (EnvironmentManager::is('development')) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}
?>
```

<a name="automatisiertes-deployment"></a>
## Automatisiertes Deployment

### GitHub Actions Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.1'
        extensions: mbstring, intl, gd, xml, zip, mysql
    
    - name: Install Dependencies
      run: |
        composer install --no-dev --optimize-autoloader
        npm ci
        npm run production
    
    - name: Run Tests
      run: |
        php vendor/bin/phpunit tests/
    
    - name: Deploy via rsync
      uses: burnett01/rsync-deployments@5.2
      with:
        switches: -avzr --delete --exclude-from='.deployignore'
        path: ./
        remote_path: ${{ secrets.DEPLOY_PATH }}
        remote_host: ${{ secrets.DEPLOY_HOST }}
        remote_user: ${{ secrets.DEPLOY_USER }}
        remote_key: ${{ secrets.DEPLOY_KEY }}
    
    - name: Run Post-Deploy Commands
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_KEY }}
        script: |
          cd ${{ secrets.DEPLOY_PATH }}
          php redaxo/bin/console cache:clear
          php redaxo/bin/console package:install
          php redaxo/bin/console assets:sync
```

### Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e  # Exit on error

ENVIRONMENT=${1:-staging}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/redaxo_${TIMESTAMP}"
PROJECT_DIR="/var/www/html"
REPO_URL="git@github.com:yourcompany/your-redaxo-project.git"

echo "🚀 Starting deployment to $ENVIRONMENT..."

# 1. Backup erstellen
echo "📦 Creating backup..."
mkdir -p "$BACKUP_DIR"
mysqldump -u backup_user -p redaxo_prod > "$BACKUP_DIR/database.sql"
rsync -av --exclude='redaxo/cache/*' --exclude='redaxo/data/log/*' "$PROJECT_DIR/" "$BACKUP_DIR/"

# 2. Code aktualisieren
echo "📥 Updating code..."
cd "$PROJECT_DIR"
git fetch origin
git checkout "$ENVIRONMENT"
git pull origin "$ENVIRONMENT"

# 3. Dependencies installieren
echo "📚 Installing dependencies..."
composer install --no-dev --optimize-autoloader
npm ci
npm run production

# 4. Cache leeren
echo "🧹 Clearing cache..."
php redaxo/bin/console cache:clear

# 5. Datenbankmigrationen ausführen
echo "🗄️ Running database migrations..."
php redaxo/bin/console migration:run

# 6. Assets synchronisieren
echo "🎨 Syncing assets..."
php redaxo/bin/console assets:sync

# 7. Wartungsmodus deaktivieren
echo "✅ Disabling maintenance mode..."
php redaxo/bin/console maintenance:disable

# 8. Health Check
echo "🏥 Running health check..."
if curl -f http://localhost/health-check > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
else
    echo "❌ Health check failed! Rolling back..."
    # Rollback logic here
    exit 1
fi

echo "🎉 Deployment completed successfully!"
```

### .deployignore Datei

```gitignore
# Deployment ignore file
.git/
.github/
node_modules/
tests/
docs/
*.md
.env.local
.env.development
package-lock.json
phpunit.xml
.phpcs.xml
redaxo/cache/*
redaxo/data/log/*
redaxo/data/core/config.yml
```

<a name="datenbankmigrationen"></a>
## Datenbankmigrationen

### Migration System

```php
<?php
// lib/Migration.php
class Migration {
    private static $migrations_table = 'rex_migrations';
    
    public static function init() {
        $sql = rex_sql::factory();
        $sql->setQuery('
            CREATE TABLE IF NOT EXISTS `' . self::$migrations_table . '` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `migration` varchar(255) NOT NULL,
                `executed_at` datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                UNIQUE KEY `migration` (`migration`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ');
    }
    
    public static function run() {
        self::init();
        
        $migrations_dir = rex_path::base('database/migrations');
        if (!is_dir($migrations_dir)) {
            return;
        }
        
        $files = glob($migrations_dir . '/*.php');
        sort($files);
        
        foreach ($files as $file) {
            $migration_name = basename($file, '.php');
            
            if (!self::hasRun($migration_name)) {
                echo "Running migration: $migration_name\n";
                
                try {
                    include $file;
                    self::markAsRun($migration_name);
                    echo "✅ Migration completed: $migration_name\n";
                } catch (Exception $e) {
                    echo "❌ Migration failed: $migration_name - " . $e->getMessage() . "\n";
                    throw $e;
                }
            }
        }
    }
    
    private static function hasRun($migration) {
        $sql = rex_sql::factory();
        $result = $sql->getArray('
            SELECT id FROM `' . self::$migrations_table . '` 
            WHERE migration = :migration
        ', ['migration' => $migration]);
        
        return !empty($result);
    }
    
    private static function markAsRun($migration) {
        $sql = rex_sql::factory();
        $sql->setQuery('
            INSERT INTO `' . self::$migrations_table . '` (migration) 
            VALUES (:migration)
        ', ['migration' => $migration]);
    }
}

// Console Command
// redaxo/bin/console migration:run
class MigrationCommand extends rex_console_command {
    protected function configure() {
        $this->setName('migration:run')
             ->setDescription('Run database migrations');
    }
    
    protected function execute(rex_console_input $input, rex_console_output $output) {
        Migration::run();
        $output->writeln('All migrations completed successfully.');
        return 0;
    }
}
?>
```

### Beispiel Migration

```php
<?php
// database/migrations/20241225_120000_add_user_preferences.php

$sql = rex_sql::factory();

// Neue Tabelle erstellen
$sql->setQuery('
    CREATE TABLE IF NOT EXISTS `rex_user_preferences` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `user_id` int(11) NOT NULL,
        `preference_key` varchar(100) NOT NULL,
        `preference_value` text,
        `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
        `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `user_preference` (`user_id`, `preference_key`),
        FOREIGN KEY (`user_id`) REFERENCES `rex_user`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
');

// Neue Spalten zu bestehender Tabelle hinzufügen
$sql->setQuery('
    ALTER TABLE `rex_user` 
    ADD COLUMN `last_login` datetime NULL AFTER `updatedate`,
    ADD COLUMN `login_count` int(11) DEFAULT 0 AFTER `last_login`
');

// Index hinzufügen
$sql->setQuery('
    ALTER TABLE `rex_user` 
    ADD INDEX `idx_last_login` (`last_login`)
');

echo "Migration 20241225_120000_add_user_preferences completed\n";
?>
```

<a name="asset-management"></a>
## Asset-Management

### Asset-Synchronisation

```php
<?php
// lib/AssetManager.php
class AssetManager {
    public static function syncAssets() {
        $local_assets = self::getLocalAssets();
        $remote_assets = self::getRemoteAssets();
        
        // Neue Assets hochladen
        foreach ($local_assets as $asset) {
            if (!in_array($asset, $remote_assets) || self::isNewer($asset)) {
                self::uploadAsset($asset);
                echo "Uploaded: $asset\n";
            }
        }
        
        // Veraltete Assets entfernen
        foreach ($remote_assets as $asset) {
            if (!in_array($asset, $local_assets)) {
                self::deleteRemoteAsset($asset);
                echo "Deleted: $asset\n";
            }
        }
    }
    
    private static function getLocalAssets() {
        $assets = [];
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator(rex_path::assets())
        );
        
        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $relative_path = str_replace(rex_path::assets(), '', $file->getPathname());
                $assets[] = $relative_path;
            }
        }
        
        return $assets;
    }
    
    private static function uploadAsset($asset) {
        $local_file = rex_path::assets($asset);
        $remote_path = '/var/www/html/assets/' . $asset;
        
        // Via SFTP oder rsync
        $command = sprintf(
            'rsync -av %s %s:%s',
            escapeshellarg($local_file),
            escapeshellarg($_ENV['DEPLOY_HOST']),
            escapeshellarg($remote_path)
        );
        
        exec($command, $output, $return_var);
        
        if ($return_var !== 0) {
            throw new Exception("Failed to upload asset: $asset");
        }
    }
}

// Console Command
class AssetSyncCommand extends rex_console_command {
    protected function configure() {
        $this->setName('assets:sync')
             ->setDescription('Sync assets with remote server');
    }
    
    protected function execute(rex_console_input $input, rex_console_output $output) {
        AssetManager::syncAssets();
        $output->writeln('Asset sync completed.');
        return 0;
    }
}
?>
```

<a name="backup-strategien"></a>
## Backup-Strategien

### Automatisierte Backups

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="redaxo_backup_${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"
RETENTION_DAYS=30

# Backup-Verzeichnis erstellen
mkdir -p "$BACKUP_PATH"

echo "📦 Creating backup: $BACKUP_NAME"

# 1. Datenbank-Backup
echo "🗄️ Backing up database..."
mysqldump \
    --single-transaction \
    --routines \
    --triggers \
    -u backup_user \
    -p redaxo_prod \
    | gzip > "$BACKUP_PATH/database.sql.gz"

# 2. Dateien-Backup (ohne Cache und Logs)
echo "📁 Backing up files..."
tar -czf "$BACKUP_PATH/files.tar.gz" \
    --exclude='redaxo/cache/*' \
    --exclude='redaxo/data/log/*' \
    --exclude='node_modules' \
    /var/www/html/

# 3. Media-Pool separat
echo "🖼️ Backing up media..."
tar -czf "$BACKUP_PATH/media.tar.gz" /var/www/html/media/

# 4. Backup-Info erstellen
cat > "$BACKUP_PATH/backup_info.txt" << EOF
Backup created: $(date)
Environment: Production
Database size: $(du -h "$BACKUP_PATH/database.sql.gz" | cut -f1)
Files size: $(du -h "$BACKUP_PATH/files.tar.gz" | cut -f1)
Media size: $(du -h "$BACKUP_PATH/media.tar.gz" | cut -f1)
EOF

# 5. Backup-Integrität prüfen
echo "✅ Verifying backup integrity..."
gzip -t "$BACKUP_PATH/database.sql.gz"
tar -tzf "$BACKUP_PATH/files.tar.gz" > /dev/null
tar -tzf "$BACKUP_PATH/media.tar.gz" > /dev/null

# 6. Alte Backups löschen
echo "🧹 Cleaning old backups..."
find "$BACKUP_DIR" -type d -name "redaxo_backup_*" -mtime +$RETENTION_DAYS -exec rm -rf {} \;

# 7. Backup in Cloud hochladen (optional)
if [ ! -z "$AWS_S3_BUCKET" ]; then
    echo "☁️ Uploading to S3..."
    aws s3 cp "$BACKUP_PATH" "s3://$AWS_S3_BUCKET/backups/" --recursive
fi

echo "✅ Backup completed: $BACKUP_NAME"
```

### Restore-Script

```bash
#!/bin/bash
# restore.sh

BACKUP_NAME=${1}
BACKUP_PATH="/backups/${BACKUP_NAME}"

if [ ! -d "$BACKUP_PATH" ]; then
    echo "❌ Backup not found: $BACKUP_NAME"
    exit 1
fi

echo "⚠️ WARNING: This will overwrite the current installation!"
read -p "Are you sure you want to restore from $BACKUP_NAME? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled."
    exit 1
fi

echo "🔄 Restoring from backup: $BACKUP_NAME"

# 1. Wartungsmodus aktivieren
echo "🚧 Enabling maintenance mode..."
touch /var/www/html/.maintenance

# 2. Datenbank wiederherstellen
echo "🗄️ Restoring database..."
gunzip < "$BACKUP_PATH/database.sql.gz" | mysql -u restore_user -p redaxo_prod

# 3. Dateien wiederherstellen
echo "📁 Restoring files..."
cd /var/www/html/
tar -xzf "$BACKUP_PATH/files.tar.gz" --strip-components=4

# 4. Media-Pool wiederherstellen
echo "🖼️ Restoring media..."
tar -xzf "$BACKUP_PATH/media.tar.gz" --strip-components=4

# 5. Berechtigungen setzen
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/html/
find /var/www/html/ -type d -exec chmod 755 {} \;
find /var/www/html/ -type f -exec chmod 644 {} \;

# 6. Cache leeren
echo "🧹 Clearing cache..."
php /var/www/html/redaxo/bin/console cache:clear

# 7. Wartungsmodus deaktivieren
echo "✅ Disabling maintenance mode..."
rm -f /var/www/html/.maintenance

echo "🎉 Restore completed successfully!"
```

<a name="zero-downtime"></a>
## Zero-Downtime Deployment

### Blue-Green Deployment

```bash
#!/bin/bash
# blue-green-deploy.sh

CURRENT_ENV=$(readlink /var/www/current)
NEW_ENV="/var/www/releases/$(date +%Y%m%d_%H%M%S)"
REPO_URL="git@github.com:yourcompany/your-redaxo-project.git"

echo "🔄 Starting Blue-Green Deployment..."
echo "Current environment: $CURRENT_ENV"
echo "New environment: $NEW_ENV"

# 1. Neue Release-Version erstellen
echo "📥 Creating new release..."
git clone "$REPO_URL" "$NEW_ENV"
cd "$NEW_ENV"

# 2. Dependencies installieren
echo "📚 Installing dependencies..."
composer install --no-dev --optimize-autoloader
npm ci && npm run production

# 3. Konfiguration kopieren
echo "⚙️ Copying configuration..."
cp /var/www/config/config.yml redaxo/data/core/config.yml
cp /var/www/config/.htaccess .htaccess

# 4. Shared Directories verlinken
echo "🔗 Creating shared links..."
ln -sfn /var/www/shared/media media
ln -sfn /var/www/shared/redaxo/data/addons redaxo/data/addons

# 5. Warm-up durchführen
echo "🔥 Warming up application..."
php redaxo/bin/console cache:warmup

# 6. Health Check der neuen Version
echo "🏥 Running health check on new version..."
if ! curl -f http://localhost:8080/health-check > /dev/null 2>&1; then
    echo "❌ Health check failed on new version!"
    rm -rf "$NEW_ENV"
    exit 1
fi

# 7. Traffic umleiten
echo "🔀 Switching traffic to new version..."
ln -sfn "$NEW_ENV" /var/www/current

# 8. Graceful reload des Webservers
sudo systemctl reload nginx

# 9. Final Health Check
sleep 5
if curl -f http://localhost/health-check > /dev/null 2>&1; then
    echo "✅ Blue-Green deployment successful!"
    
    # Alte Releases aufräumen (behalte die letzten 5)
    ls -dt /var/www/releases/* | tail -n +6 | xargs rm -rf
else
    echo "❌ Final health check failed! Rolling back..."
    ln -sfn "$CURRENT_ENV" /var/www/current
    sudo systemctl reload nginx
    rm -rf "$NEW_ENV"
    exit 1
fi
```

<a name="monitoring"></a>
## Monitoring nach Deployment

### Health Check Endpoint

```php
<?php
// health-check.php
class HealthCheck {
    public static function run() {
        $checks = [
            'database' => self::checkDatabase(),
            'cache' => self::checkCache(),
            'files' => self::checkFiles(),
            'addons' => self::checkAddons()
        ];
        
        $overall_status = array_reduce($checks, function($carry, $check) {
            return $carry && $check['status'];
        }, true);
        
        http_response_code($overall_status ? 200 : 503);
        
        header('Content-Type: application/json');
        echo json_encode([
            'status' => $overall_status ? 'healthy' : 'unhealthy',
            'timestamp' => date('c'),
            'checks' => $checks
        ]);
    }
    
    private static function checkDatabase() {
        try {
            $sql = rex_sql::factory();
            $sql->setQuery('SELECT 1');
            return ['status' => true, 'message' => 'Database connection OK'];
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
    
    private static function checkCache() {
        $cache_dir = rex_path::cache();
        $writable = is_writable($cache_dir);
        
        return [
            'status' => $writable,
            'message' => $writable ? 'Cache directory writable' : 'Cache directory not writable'
        ];
    }
    
    private static function checkFiles() {
        $critical_files = [
            rex_path::core('boot.php'),
            rex_path::coreData('config.yml'),
            rex_path::assets()
        ];
        
        foreach ($critical_files as $file) {
            if (!file_exists($file)) {
                return ['status' => false, 'message' => 'Critical file missing: ' . $file];
            }
        }
        
        return ['status' => true, 'message' => 'All critical files present'];
    }
    
    private static function checkAddons() {
        $critical_addons = ['yform', 'yrewrite', 'media_manager'];
        
        foreach ($critical_addons as $addon_name) {
            $addon = rex_addon::get($addon_name);
            if (!$addon->isAvailable()) {
                return ['status' => false, 'message' => "Critical addon not available: $addon_name"];
            }
        }
        
        return ['status' => true, 'message' => 'All critical addons available'];
    }
}

// Nur für berechtigte Zugriffe
$allowed_ips = ['127.0.0.1', '::1']; // Monitoring-Server IPs hinzufügen
$client_ip = $_SERVER['REMOTE_ADDR'] ?? '';

if (in_array($client_ip, $allowed_ips) || isset($_GET['token']) && $_GET['token'] === getenv('HEALTH_CHECK_TOKEN')) {
    HealthCheck::run();
} else {
    http_response_code(403);
    echo 'Access denied';
}
?>
```

### Post-Deployment Tests

```php
<?php
// tests/DeploymentTest.php
class DeploymentTest extends PHPUnit\Framework\TestCase {
    public function testHomepageLoads() {
        $response = file_get_contents('http://localhost/');
        $this->assertNotFalse($response);
        $this->assertStringContainsString('<html', $response);
    }
    
    public function testDatabaseConnection() {
        $sql = rex_sql::factory();
        $result = $sql->getArray('SELECT COUNT(*) as count FROM rex_article');
        $this->assertGreaterThan(0, $result[0]['count']);
    }
    
    public function testCriticalPages() {
        $critical_urls = [
            '/',
            '/kontakt/',
            '/impressum/',
            '/datenschutz/'
        ];
        
        foreach ($critical_urls as $url) {
            $response = @file_get_contents('http://localhost' . $url);
            $this->assertNotFalse($response, "Failed to load: $url");
        }
    }
    
    public function testMediaManagerProfiles() {
        $profiles = ['thumbnail', 'medium', 'large'];
        
        foreach ($profiles as $profile) {
            $url = 'http://localhost/media/' . $profile . '/test.jpg';
            $headers = @get_headers($url);
            $this->assertNotFalse($headers, "Media profile not working: $profile");
        }
    }
}
?>
```

> **Wichtig:** Deployment-Strategien sollten immer in einer Test-Umgebung validiert werden bevor sie in der Produktion eingesetzt werden. Automatisierung reduziert menschliche Fehler erheblich.