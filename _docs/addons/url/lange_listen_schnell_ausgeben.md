---
title: Lange Listen mit Url Urls schnell ausgeben
authors: [dtpop]
prio:
---

# Die Standardausgabe

Das Url AddOn in der auf Github vorliegenden Version 2 https://github.com/tbaddade/redaxo_url ist aus kaum einem Projekt wegzudenken, welches datenbankbasiert Artikel ausgibt. z.B. Produktlisten, Veranstaltungen oder was auch immer. Profil entsprechend anlegen, dann mit `rex_getUrl('', '', ['prod_id' => $product_id])` die Url erzeugen. Alles wunderbar. Tolles AddOn!

# Das Problem

Allerdings können Produktlisten auch mal länger werden. Ich hatte hier eine mit 761 Einträgen. Die Ausgabe hat ziemlich lange gedauert und ich habe herumgerätselt, was denn da die Bremse sein könnte. Sobald ich die Url Ausgabe auskommentiert habe, schwuppte das Ganze wie geschmiert.
Ok ... da muss dann jedesmal vom Url AddOn eine entsprechende Datenbankabfrage abgesetzt werden. Das müsste schneller gehen.

# Die Lösung

Eine einzige Datenbankabfrage, die alle Urls auf einmal abfrägt sollte das Ganze beschleunigen. Da die Urls auch sehr schön in der Tabelle rex_url_generator_url mit passender Datensatz Id liegen, sollte das auch einfach zu machen sein. Da gibt es sicher verschiedene Ansätze. Ich habe es mal so gelöst:

```
// Ein leeres Array, falls was nicht funktioniert, ist das schonmal da.
$urls = [];

// wir suchen das passende Profil, da die Datensätze mit der profil_id, der clang_id und der data_id indexiert sind.
// Hier im Beispiel auf den Artikel mit der Id 37
$profile = rex_sql::factory()->setTable(rex::getTable('url_generator_profile'))
  ->setWhere('clang_id = :clang_id AND article_id = :article_id',['clang_id'=>rex_clang::getCurrentId(),'article_id'=>37])
  ->select('id')
  ->getArray();

// Wenn tatsächlich nur 1 Profil nach diesem Kriterium gefunden wird, kann es weiter gehen
if (count($profile) == 1) {
    // Wir holen uns die Urls als key (Datensatz Id) value (url) Paar, haben also dann ein Array,
    // was als Keys die Datensatz Id hat und als Value die Url
    $urls = rex_sql::factory()->setTable(rex::getTable('url_generator_url'))
      ->setWhere('profile_id=:profile_id AND clang_id=:clang_id', ['profile_id' => $profile[0]['id'], 'clang_id' => rex_clang::getCurrentId()])->select('data_id,url')
      ->getArray(null, [], PDO::FETCH_KEY_PAIR);
}
```

Dieses Array können wir dann direkt in einer Ausgabe verwenden. Hier wurde die Produktliste als yorm Objekt abgeholt

```
<ul>
<?php foreach ($products as $prod) : ?>
    <li>
        <a href="<?= $urls[$prod->id] ?? rex_getUrl('', '', ['prod_id' => $prod->id]) ?>">
            <h3><?= $prod->name ?></h3>
            <p><?= $prod->text ?></p>
        </a>
    </li>
<?php endforeach ?>
</ul>
```

Die Ausgabe der Url `<?= $urls[$prod->id] ?? rex_getUrl('', '', ['prod_id' => $prod->id]) ?>` enthält ein Fallback. Falls für diesen Datensatz die Url wider Erwarten nicht im $urls Array vorhanden ist, wird als Fallback die Standardmethode `rex_getUrl()` aufgerufen.

In meinem Fall war der Speedupfaktor 10.
