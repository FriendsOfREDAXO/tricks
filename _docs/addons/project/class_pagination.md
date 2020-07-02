---
title: Pagination
authors: [alexplusde]
prio:
---

# Pagination

Eine simple Paginationsklasse, zum Blättern von Seiten (bspw. bei einem Blog, bei Suchergebnissen im Addon __search_it__ o. ä.).

## Anwendung

Die Klasse benötigt zunächst nur 3 Parameter:

* `$total`: Anzahl der gesamten Ergebnisse
* `$page`: Aktuelle Seitenzahl (default: 1)
* `$limit`: Anzahl der Ergebnisse innerhalb einer Seite (default: 10)

## Beispiel-Code

```php
$limit = 10;
$page = rex_request('page', 'int', 1);
if(rex::isBackend()) {
    $page = 1;
}
$offset = (($page -1) * $limit);

// Pagination initialisieren
$pagination = new Pagination($total, $page, $limit);

// Zusätzliche Optionen und Parameter
# $pagination->addParams("search", rex_request("search", "string", "")); // zusätzliche URL-Parameter, bspw für `search_it`
# $pagination->setHash("results"); // ID der Sprungmarke, zu der der Browser beim Auswahl einer Seite springen soll
# $pagination->setOption("show_max", 5); // Anzahl der Links, die um die aktuelle Seite angezeigt werden.
# $pagination->setOption("show_skip", false); // Zeige Erster/Letzer Link
# $pagination->setOption("show_neighbours", false); // Zeige Zurück/Vor Link
# $pagination->setId("1"); // Ziel-Artikel-ID

// Optional: Syntax überschreiben
# $pagination->setHtml('ul', '<ul class="###class###">###items###</ul>');
# $pagination->setHtml('li', '<li class="###class###">###anchor###</li>');
# $pagination->setHtml('a', '<a href="###href###" class="###class###">###text###</a>');

// Text der Navigations-Links überschreiben
# $pagination->setText('first', '«');
# $pagination->setText('last', '»');
# $pagination->setText('prev', '‹');
# $pagination->setText('next', '›');

// Pagination ausgeben
echo $pagination->show();
```

## PHP-Code

Diesen Code bspw. in REDAXO unter `/redaxo/src/addons/project/lib/` abspeichern, die Klasse wird dann über den redaxo-internen Autoloader geladen und in jedem Modul / Template zur Verfügung gestellt.

```php
<?php
/*
*
* Pagination
* Gibt eine Liste mit Paginierungs-Links aus.
*
* @author: @alexplus_de Alexander Walther
* @version: 0.2
*
*/

class Pagination {

	private $limit;
	private $offset;
	private $total;
	private $page;

	private $page_max;

	private $html = array();
	private $text = array();
	private $option = array();
	private $url = array();
	private $params = array();


	private $elements = array();
	private $return = "";

	public function __construct($total = 50, $page = 1, $limit = 10) {
		$this->total = $total; 				// Letzter Eintrag
		$this->page = $page;				// Aktuelle Seite
		$this->limit = $limit; 				// Einträge pro Seite
		$this->offset = $page * $limit; 		// Aktueller Eintrag
		$this->page_max = (int) ceil($total / $limit); 	// Letzte Seite

		$this->html['ul'] = '<ul class="###class###">###items###</ul>';
		$this->html['li'] = '<li class="###class###">###anchor###</li>';
		$this->html['a'] = '<a href="###href###" class="###class###">###text###</a>';
		$this->html['span'] = '<span class="###class###">###text###</span>';

		$this->text['first'] = '«';
		$this->text['last'] = '»';
		$this->text['prev'] = '‹';
		$this->text['next'] = '›';

		$this->option['show_max'] = 5;			// Anzahl der Seiten-Links um die aktuelle Seite herum
		$this->option['show_skip'] = true;		// Zeige Erste / Letzte
		$this->option['show_neighbours'] = true;	// Zeige Vor / Zurück

		$this->url['id'] = "REX_ARTICLE_ID";		// Ziel-Artikel-ID
		$this->url['hash'] = "";			// Ziel-ID (ohne "#")
	}


    public function setHtml($key, $value) {
		$this->html[$key] = $value;
    }
    public function setText($key, $value) {
		$this->text[$key] = $value;
    }
    public function setOption($key, $value) {
		$this->option[$key] = $value;
    }
    public function setHash($hash) {
		$this->url['hash'] = $hash;
    }

    public function setId($id) {
		$this->url['id'] = $id;
    }

    public function addParams($key, $value) {
		$this->params[$key] = $value;
    }


	public function getFirst() {
		// Erste Seite
		if($this->option['show_skip']) {
			$anchor = $this->buildAnchor(1, $this->text['first']);
			$li  = str_replace("###anchor###",$anchor,$this->html['li']);
			if($this->offset > $this->limit) {
				$li  = str_replace("###class###","first",$li);
			} else {
				$li  = str_replace("###class###","first disabled",$li);
			}
			return $li;
		}
	}

	public function getPrev() {
		// Zurück
		if($this->option['show_neighbours']) {
			$page = $this->page-1;
			if($page < 1) {
				$page = 1;
			}
			$anchor = $this->buildAnchor($page, $this->text['prev']);
			$li  = str_replace("###anchor###",$anchor,$this->html['li']);
			if($this->offset > $this->limit) {
				$li  = str_replace("###class###","prev",$li);
			} else {
				$li  = str_replace("###class###","prev disabled",$li);
			}
			return $li;
		}
	}


	public function getNext() {

		// Nächste
		if($this->option['show_neighbours']) {
			$page = $this->page + 1;
			if(($page * $this->limit) >= $this->total) {
				$page = ceil($this->total / $this->limit);
			}
			$anchor = $this->buildAnchor($page, $this->text['next']);
			$li  = str_replace("###anchor###",$anchor,$this->html['li']);
			if($this->page+1 <= ceil($this->total / $this->limit)) {
				$li  = str_replace("###class###","next",$li);
			} else {
				$li  = str_replace("###class###","next disabled",$li);
			}
			return $li;
		}
	}

	public function getLast() {

		// Letzte Seite
		if($this->option['show_skip']) {
			$anchor = $this->buildAnchor(ceil($this->total / $this->limit), $this->text['last']);
			$li  = str_replace("###anchor###",$anchor,$this->html['li']);
			if($this->page+1 <= ceil($this->total / $this->limit)) {
				$li  = str_replace("###class###","last",$li);
			} else {
				$li  = str_replace("###class###","last disabled",$li);
			}
			return $li;
		}
	}

	private function buildAnchor($page, $text = '') {

		$this->addParams("page", $page);
		$href = rex_getUrl($this->url['id'], null, $this->params);
		if($this->url['hash']) {
			$href .= "#".$this->url['hash'];
		}

		$span = str_replace("###text###",$text,$this->html['span']);
		$anchor = str_replace("###text###",$span,$this->html['a']);
		$anchor = str_replace("###href###",$href,$anchor);
		//$anchor = str_replace("###key###",$key,$anchor);
		return $anchor;
	}

	public function show() {

		$elements[] = $this->getFirst();
		$elements[] = $this->getPrev();

		if($this->page_max > $this->option['show_max']) {
			$first = $this->page - (int)($this->option['show_max']/2);
			$last = $this->page + (int)($this->option['show_max']/2);
			while($first < 1) {
				$first++;
				$last++;
			}
			while($last > $this->page_max) {
				$first--;
				$last--;
			}
		} else {
			$first = 1;
			$last = $this->page_max;
		}

		// Zahlen
		for($i = $first; ($i <= $last); $i++)
	{
		$anchor = $this->buildAnchor($i, $i);
			$list = str_replace("###anchor###",$anchor,$this->html['li']);

			if($i == $this->page) {
				$list = str_replace("###class###","current",$list);
			} else {
				$list = str_replace("###class###","",$list);
			}

			$elements[] = $list;
	}

		$elements[] = $this->getNext();
		$elements[] = $this->getLast();

		foreach ($elements as $element) {
			$return .= $element;
		}
		$return = str_replace("###items###",$return,$this->html['ul']);
		$return = str_replace("###class###","pagination",$return);

		return $return;

	}
}
```
