# REDAXO Loader

Skript zum Download und Entpacken der aktuellen REDAXO-Release aus GitHub.
(Basiert auf einem Gist von Jan Kristinus)

- Datei redaxo_loader.php erstellen und nachfolgenden Quellcode reinkopieren
- redaxo_loader.php in den Ordner / oder Webroot laden, wo redaxo installiert werden soll
- redaxo_loader.php aufrufen. 

> load_redaxo.php läd und enpackt die aktuelle Redaxo-Version. 

```php
    <?php
/**
 * Download latest REDAXO release from github
 * License: Public Domain
 */
error_reporting(E_ALL);
ini_set("display_errors", 1);
$install_path = './';
$install_file = $install_path . 'redaxo.zip';
$loader_file = $install_path . 'redaxo_loader.php';
define('REPO', 'redaxo/redaxo');
$opts = ['http' => ['method' => 'GET', 'header' => ['User-Agent: PHP']]];
$context = stream_context_create($opts);
$releases = file_get_contents('https://api.github.com/repos/' . REPO . '/releases', false, $context);
$releases = json_decode($releases);
$url = $releases[0]->assets[0]->browser_download_url;

// check if folder redaxo exists

$folder = "./redaxo";

if (is_dir($folder))
 {
 echo '<pre>Es existiert schon ein Ordner /redaxo 
      Bitte pr&uuml;fen.
    <pre>';
 exit();
 }

// Funktion die file_get_contents mit curl ersetzt

function curl_file_get_contents($url)
 {
 $curly = curl_init();
 curl_setopt($curly, CURLOPT_HEADER, 0);
 curl_setopt($curly, CURLOPT_RETURNTRANSFER, 1); //Return Data
 curl_setopt($curly, CURLOPT_FOLLOWLOCATION, 1);
 curl_setopt($curly, CURLOPT_URL, $url);
 $content = curl_exec($curly);
 curl_close($curly);
 return $content;
 }

echo '<pre>Folgende aktuelle Datei wurde gefunden: ' . $url . '</pre>';
$redaxo_core = curl_file_get_contents($url);
file_put_contents($install_file, $redaxo_core);
echo '<pre>redaxo.zip wurde erstellt und wird nun entpackt</pre>';
$zip = new ZipArchive;
$res = $zip->open($install_file);

if ($res === TRUE)
 {
 $zip->extractTo($install_path);
 $zip->close();
 echo '<pre>REDAXO wurde erfolgreich entpackt</pre>';
 $loader = file_get_contents($loader_file);
 $loader = str_replace("\n" . '// info', '', $loader);
 file_put_contents($loader_file, $loader);
 unlink($install_file);
 }
  else
 {
 echo 'Beim Entpacken ist ein Fehler aufgetreten';
 }
```
