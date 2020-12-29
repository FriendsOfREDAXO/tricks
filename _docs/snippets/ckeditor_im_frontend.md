---
title: CKEditor 5 im Frontend einbinden
authors: [aeberhard]
prio:
---

# CKEditor 5 im Frontend einbinden

Das Addon **CKEditor 5** muss natürlich installiert sein. Getestet mit der Version 4.2.1.

Für das Frontend am besten ein eigenes Profil **frontend** erstellen. In diesem Profil nur die Funktionen freischalten die auch wirklich benötigt werden und auch Sinn machen. (Interner REDAXO-Link muss z.B. weg!)

Folgenden Code in der boot.php des project-Addons oder theme-Addons einfügen: 

```php

// CKEditor im Frontend ausgeben
if (rex::isFrontend()) {
    rex_extension::register('OUTPUT_FILTER', static function (rex_extension_point $ep) {
        $content = $ep->getSubject();

        if (strpos($content, 'cke5-editor')) {
            // CSS
            $mtime_css = filemtime(rex_path::assets('addons/cke5/cke5.css'));
            $mtime_custom_css = filemtime(rex_path::assets('addons/cke5_custom_data/custom-style.css'));
            $cke5_css = '
            <link rel="stylesheet" media="all" href="' . rex_url::assets('addons/cke5/cke5.css') . '?buster=' . $mtime_css . '">
            <!--<link rel="stylesheet" media="all" href="' . rex_url::assets('addons/cke5_custom_data/custom-style.css') . '?buster=' . $mtime_custom_css . '">-->
            '. "\n";

            // JavaScript
            $mtime_ckjs = filemtime(rex_path::assets('addons/cke5/vendor/ckeditor5-classic/ckeditor.js'));
            $mtime_cktr = filemtime(rex_path::assets('addons/cke5/vendor/ckeditor5-classic/translations/de.js'));
            $mtime_ckpr = filemtime(rex_path::assets('addons/cke5/cke5profiles.js'));
            $mtime_cke5 = filemtime(rex_path::assets('addons/cke5/cke5.js'));
            $cke5_js = '
            <script src="' . rex_url::assets('addons/cke5/vendor/ckeditor5-classic/ckeditor.js') . '?buster=' . $mtime_ckjs . '"></script>
            <script src="' . rex_url::assets('addons/cke5/vendor/ckeditor5-classic/translations/de.js') . '?buster=' . $mtime_cktr . '"></script>
            <script src="' . rex_url::assets('addons/cke5/cke5profiles.js') . '?buster=' . $mtime_ckpr . '"></script>
            <script src="' . rex_url::assets('addons/cke5/cke5.js') . '?buster=' . $mtime_cke5 . '"></script>
            <script>
            $(document).ready(function() {
                $(document).find(".cke5-editor").each(function () {
                    cke5_init($(this));
                });
            });
            </script>
            ' . "\n";

            // CSS im Head-Bereich ausgeben
            $search = '</head>';
            $replace = $cke5_css . '</head>';
            $content = str_replace($search, $replace, $content);

            // JavaScript am Ende ausgeben
            $search = '</body>';
            $replace = $cke5_js . '</body>';
            $content = str_replace($search, $replace, $content);
        }

        $ep->setSubject($content);
    }, rex_extension::LATE);
}

```

> **Hinweis:** Die Custom-Styles (custom-style.css) sind in obigem Code auskommentiert. Falls notwendig einfach einkommentieren.


Im eigenen Modul oder Addon dann die gewünschte Textarea für den CKEditor zum Beispiel wie folgt ausgeben:

```html
<textarea name="editor1" id="editor1" class="form-control cke5-editor" rows="10" data-profile="frontend" data-lang="de" data-content-lang="de"></textarea>
```
