---
title: Hilfsfunktionen
authors: []
prio:
---

# Hilfsfunktionen

In REDAXO sind zahlreiche Hilfsfunktionen enthalten, mit denen man in Modulen, Templates, AddOns etc. arbeiten kann. 

## rex_markdown

So kann ein Markdown-Text geparst werden. Die Funktion `parse` ist nicht statisch.

```php
echo rex_markdown::factory()->parse($text)
```
