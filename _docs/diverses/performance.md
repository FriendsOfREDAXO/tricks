---
title: "php+redaxo performance tipps"
authors: []
prio:
---

Artikel zur Dikussion
[Issue #7](https://github.com/FriendsOfREDAXO/tricks/issues/7#issuecomment-403207741)

**mitmachen ausdrücklich erwünscht**

Besonders im Absatz [Welche Möglichkeiten zur Verbesserung bietet Redaxo?](#rex) ist die Mitarbeit der Redaxo-Profis gefragt.

# Mehr Performance für Redaxo


#### Wie kann man die Performance einer website ermitteln?

##### Tools

[Website-Geschwindigkeit messen: 8 kostenlose Tools im Überblick](https://t3n.de/news/webseiten-ladezeiten-optimieren-497235/)

##### Dienste 

[Blackfire - ein Dienst zur Performance-Messung](https://blackfire.io/)

[website speed test](https://tools.pingdom.com/)


#### Performance verbessern

PHP 7 ist schneller

**scripte optimieren**

[Javascript optimieren – Ladezeit und Reaktionszeit](https://www.mediaevent.de/javascript/performance.html#main)

[CSS optimieren: Ladezeit und Seitenaufbau](https://www.mediaevent.de/css/effizienz.html)

**debugging**

xdebug 

**caching**

[Performance Infos](http://symfony.com/doc/current/performance.html#optimizing-all-the-files-used-by-symfony)

[Best Zend OpCache Settings/Tuning/Config](https://www.scalingphpbook.com/blog/2014/02/14/best-zend-opcache-settings.html)

[Opcache Configuration](https://tideways.io/profiler/blog/fine-tune-your-opcache-configuration-to-avoid-caching-suprises)


<a name="rex"></a>
#### Welche Möglichkeiten zur Verbesserung bietet Redaxo?

an dieser Stelle sei auf diesen trick hingewiesen:
[Performance prüfen](https://github.com/FriendsOfREDAXO/tricks/blob/master/_docs/snippets/performance_pruefen.md)

cache

OPCache

composer autoloader benutzen








