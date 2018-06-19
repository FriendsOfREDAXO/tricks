---
title: Hilfsfunktionen
authors: []
prio:
---

# Hilfsfunktionen

In Redaxo sind zahlreiche Hilfsfunktionen enthalten, mit denen man in Modulen, Templates, Addons etc. arbeiten kann. 

## rex_markdown

So kann ein Markdown-Text geparst werden. Die Funktion parse ist nicht statisch.

`echo rex_markdown::factory()->parse($text)`


## rex_formatter

Mit dieser Funktion können unhandliche Datenwerte in menschenlesbare Formate umgewandelt werden.

'echo rex_formatter::bytes($media->getValue("size"))'

## rex_addon und rex_config

Wenn man weiß, dass ein Array in einem rex_addon- oder rex_config-Wert existiert, kann man dieses auch direkt abfragen, z.B. so in der Art:
`rex_addon::get('addonname')->getProperty('arrayroot')['key']['subkey']`
`rex_config::get('key')->getProperty('arrayroot')['key']['subkey']`
