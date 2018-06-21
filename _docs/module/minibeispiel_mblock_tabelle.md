---
title: "Minibeispiel: Einfache Tabelle mit MForm MBlock"
authors: []
prio:
---

# Minibeispiel: Einfache Tabelle mit MForm MBlock

> Benötigt die FOR-Addons `mform` und `mblock`

## Eingabe


```php
<?php
    // Aufruf der MForm-Instanz
    $mform1 = new MForm(); 
    $mform1->addFieldset('Zeile');

    // Textfelder definieren (Hier vier Spalten) 
    $mform1->addTextField("1.0.a", array('label'=>'Spalte 1'));
    $mform1->addTextField("1.0.b", array('label'=>'Spalte 2'));
    $mform1->addTextField("1.0.c", array('label'=>'Spalte 3'));
    $mform1->addTextField("1.0.d", array('label'=>'Spalte 4'));

    // Ausgabe der MForm mittels MBlock
    // Erlaubt deas Wiederholen der Moduleingabe innerhalb eines Blocks
    echo MBlock::show(1, $mform1->show(), array('min'=>1,'max'=>50));
?>
```

## Ausgabe

```html
<section class="modul modul-mblocktable" id="modul-REX_SLICE_ID">
  <div class="wrapper">
    <?php
    // Auslesen der Mblock-Daten als Array. 
    $rows = rex_var::toArray("REX_VALUE[1]");
    // Mit dump($rows); kann man sich das Array seit REDAXO 5.3 für Testzwecke ausgeben lassen. 
    ?>
    <table>
      <?php 
      $i = 0;
      // Auslesen der der einzelnen Datensätze
      foreach ($rows as $row) { 
        // Die erste Zeile soll als Überschrift gesetzt werden
        if($i === 0) { 
      ?>
      <thead>
        <tr>
          <th class="col-a"><?php echo $row['a']; ?></th>
          <th class="col-b"><?php echo $row['b']; ?></th>
          <th class="col-c"><?php echo $row['c']; ?></th>
          <th class="col-d"><?php echo $row['d']; ?></th>
        </tr>
      </thead>
      <tbody>
        <?php 
        }
        // Ausgabe normaler Zeilen:
        else {
        ?>
        <tr>
          <td class="col-a"><?php echo $row['a']; ?></td>
          <td class="col-b"><?php echo $row['b']; ?></td>
          <td class="col-c"><?php echo $row['c']; ?></td>
          <td class="col-d"><?php echo $row['d']; ?></td>
        </tr>
        <?
        }
        $i++;
      } // foreach ($rows as $row) Ende der Schleife
      ?>
      </tbody>
      <tfoot>
      </tfoot>
    </table>
  </div>
</section>
```
