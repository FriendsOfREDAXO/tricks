---
title: YForm Table Manager XLSX-Import
authors: [ alexplusde ]
prio:
---

# YForm Table Manager XLSX-Import

[Basis dieses Skripts](https://gist.github.com/searbe/3284011)

## Aufruf:

```php
$array = xlsx_import(rex_path::media().'datei.xlsx');
```

## Diese Funktion über das project-Addon oder das theme-Addon integrieren.

```php
function xlsx_import($inputFile) {
    /**
     * I had to parse an XLSX spreadsheet (which should damn well have been a CSV!)
     * but the usual tools were hitting the memory limit pretty quick. I found that
     * manually parsing the XML worked pretty well. Note that this, most likely,
     * won't work if cells contain anything more than text or a number (so formulas,
     * graphs, etc ..., I don't know what'd happen).
     */
    // Unzip
    $dir = rex_path::addonCache('project'); 
    $zip = new ZipArchive;

    $ZIP_ERROR = [
        ZipArchive::ER_EXISTS => 'File already exists.',
        ZipArchive::ER_INCONS => 'Zip archive inconsistent.',
        ZipArchive::ER_INVAL => 'Invalid argument.',
        ZipArchive::ER_MEMORY => 'Malloc failure.',
        ZipArchive::ER_NOENT => 'No such file.',
        ZipArchive::ER_NOZIP => 'Not a zip archive.',
        ZipArchive::ER_OPEN => "Can't open file.",
        ZipArchive::ER_READ => 'Read error.',
        ZipArchive::ER_SEEK => 'Seek error.',
    ];
    
    $result_code = $zip->open($inputFile);
    if($result_code !== true){
        $msg = isset($ZIP_ERROR[$result_code])? $ZIP_ERROR[$result_code] : 'Unknown error.';
        return ['error'=>$msg];
    } else {
        $zip->extractTo($dir);
        // Open up shared strings & the first worksheet
        $strings = simplexml_load_file($dir . '/xl/sharedStrings.xml');
        $sheet   = simplexml_load_file($dir . '/xl/worksheets/sheet1.xml');
        // Parse the rows
        $xlrows = $sheet->sheetData->row;
        $rows = [];
        foreach ($xlrows as $xlrow) {
            $arr = array();
            
            // In each row, grab it's value
            foreach ($xlrow->c as $cell) {
                $v = (string) $cell->v;
                
                // If it has a "t" (type?) of "s" (string?), use the value to look up string value
                if (isset($cell['t']) && $cell['t'] == 's') {
                    $s  = array();
                    $si = $strings->si[(int) $v];
                    
                    // Register & alias the default namespace or you'll get empty results in the xpath query
                    $si->registerXPathNamespace('n', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
                    // Cat together all of the 't' (text?) node values
                    foreach($si->xpath('.//n:t') as $t) {
                        $s[] = (string) $t;
                    }
                    $v = implode($s);
                }
                
                $arr[] = $v;
            }
            
            // Assuming the first row are headers, stick them in the headers array
            if (count($headers) == 0) {
                $f = 1;
                foreach($arr as $val){
                    if($val == "") {
                        $val = "field".$f;
                    }
                    $headers[$val] = rex_string::normalize($val);
                    $f++;
                }       
                $rows["headers"] = $headers;
            
            } else {
                // Combine the row with the headers - make sure we have the same column count
                $values = array_pad($arr, count($headers), '');
                $row    = array_combine($headers, $values);
                $rows[$row['id']] = $row;
            }
        }
        return $rows;
        unlink($dir);
        // @unlink($inputFile);
    }
    
    $zip->close();
}
```
