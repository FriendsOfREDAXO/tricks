# Hilfsfunktionen

In Redaxo sind zahlreiche Hilfsfunktionen enthalten, mit denen man in Modulen, Templates, Addons etc arbeiten kann. 

## rex_markdown

So kann ein Markdown-Text geparst werden. Die Funktion parse ist nicht statisch.
`echo rex_markdown::factory()->parse($text)`
