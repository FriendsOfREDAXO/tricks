# Redaxo Loader
Skript zum Download und Entpacken der aktuellen Redaxo Version.
(Basiert auf ein Gist von Jan Kristinus)

- Datei load_redaxo.php erstellen und nachfolgenden Quellcode reinkopieren
- load_redaxo.php in den Ordner / oder Webroot laden, wo redaxo installiert werden soll
- load_redaxo.php aufrufen. 

> load_redaxo.php läd und enpackt die aktuelle Redaxo-Version. 


    <?php 

    error_reporting(E_ALL);
    ini_set("display_errors",1);

    // check if folder redaxo exists
    $folder = "./redaxo";
    if(is_dir($folder))
      {
    echo '<pre>Es existiert schon ein Ordner /redaxo 
    Bitte pr&uuml;fen.
    <pre>';
      exit();
      }


    function curl_file_get_contents($url) {
        $curly = curl_init();

        curl_setopt($curly, CURLOPT_HEADER, 0);
        curl_setopt($curly, CURLOPT_RETURNTRANSFER, 1); //Return Data
        curl_setopt($curly, CURLOPT_URL, $url);

        $content = curl_exec($curly);
        curl_close($curly);

        return $content;
    }
    $current_version_path = curl_file_get_contents("http://www.redaxo.org/de/_system/_version/5/");
    $install_path = './';
    $install_file = $install_path.'redaxo.zip';
    $loader_file = $install_path.'load_redaxo.php';

    echo '<pre>Folgende aktuelle Datei wurde gefunden: '.$current_version_path.'</pre>';

    $redaxo_core = curl_file_get_contents($current_version_path);
    file_put_contents($install_file, $redaxo_core);

    echo '<pre>redaxo.zip wurde erstellt und wird nun entpackt</pre>';

    $zip = new ZipArchive;
    $res = $zip->open($install_file);
    if ($res === TRUE) {
      $zip->extractTo($install_path);
      $zip->close();

      echo '<pre>REDAXO wurde erfolgreich entpackt</pre>';
      $loader = file_get_contents($loader_file);
      $loader = str_replace("\n".'// info','',$loader);
      file_put_contents($loader_file, $loader);
      unlink($install_file);

    } else {
      echo 'Beim Entpacken ist ein Fehler aufgetreten';

    }
