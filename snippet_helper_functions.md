# Hilfsfunktionen

In Redaxo sind zahlreiche Hilfsfunktionen enthalten, mit denen man in Modulen, Templates, Addons etc arbeiten kann. 

## rex_markdown

So kann ein Markdown-Text geparst werden. Die Funktion parse ist nicht statisch.

`echo rex_markdown::factory()->parse($text)`


## rex_formatter

Mit dieser Funktion können unhandliche Datenwerte in menschenlesbare Formate umgewandelt werden.

'echo rex_formatter::bytes($media->getValue("size"))'

