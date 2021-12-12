---
title: Tipps für Sprachen in REDAXO
authors: []
prio:
---

# Tipps für Sprachen in REDAXO

## Datum in korrekter Sprache ausgeben

**Szenario** 

Die REDAXO-Website verfügt über verschiedene Sprachen. Ein Datum ist im MYSQL-Format hinterlegt und soll in Abhängigkeit der Sprache korrekt formatiert ausgegeben werden.

**Lösung** 

`setlocale()` in PHP mit Sprach-Metainfos setzen.

**Schritt-für-Schritt-Anleitung**

Die Funktion `setlocale()` benötigt eine Kombination aus `Language Code` und `Country Code`.

1. Im Addon __Meta Infos__ unter __Sprachen__ ein neues Feld `clang_country` einfügen:

	```yaml
	  Spaltenname: country
	  Feldbezeichnung: Country Code (ISO 3166)
	  Feldtyp: Text
	  Feldattribut (optional): pattern="[A-Z]{2}"
	```

2. In __System__ unter Sprachen die gewünschten Sprachen anlegen und dabei in den Feldern __Code__ (für `Language Code`) und __Country Code__ den korrekten Sprach- und Region-Codes eintragen, z.B. `de` und `DE`, `de` und `AT`, `en` und `GB` oder `en` und `US`.

	_Eine vollständige Liste an korrekten Country-Codes gibt es auf oracle.com: [Language Codes](https://docs.oracle.com/cd/E13214_01/wli/docs92/xref/xqisocodes.html#wp1252447) und [Country Codes](https://docs.oracle.com/cd/E13214_01/wli/docs92/xref/xqisocodes.html#wp1250799)_

3. Im __project-Addon__ in der `boot.php` folgenden Code einfügen:

	```php
	  $clang = rex_clang::getCurrent();
	  setlocale(LC_TIME, $clang->getCode()."_".$clang->getValue('country').".utf8");
	```

4. Nun ist der aktuelle Sprachcode überall gesetzt und ein Datum kann ganz einfach mit `rex_formatter::intlDate` formatiert werden, z. B.

	```php
	  echo rex_formatter::intlDate(time(), IntlDateFormatter::MEDIUM); // ergibt 12. Dez. 2021
	```

Mehr Informationen zur Datumsformatierung in der [Doku](https://redaxo.org/doku/main/formatierungen#intlformat)
