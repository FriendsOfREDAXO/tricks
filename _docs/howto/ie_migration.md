---
title: Banner für Internet Explorer 11 anzeigen
authors: [alexplusde]
prio:
---

# Banner für Internet Explorer 11 anzeigen

Kopiere diesen Code in ein Template oder Fragment deiner Wahl, um ausschließlich im Internet Explorer einen Banner anzuzeigen, der den Besucher der Website dazu auffordert, den Browser zu wechseln. 

**Der Clou:** Über einen Link im Banner lässt sich die Website unter Windows 10 direkt im aktuellen Microsoft Edge Browser öffnen.

> Internet Explorer kann diese Seite nicht optimal darstellen. *Klicken Sie hier*, um die Website direkt in Microsoft Edge zu öffnen. Oder installieren Sie einen *alternativen Browser*

```php
<?php
$ua = htmlentities($_SERVER['HTTP_USER_AGENT'], ENT_QUOTES, 'UTF-8');
if (preg_match('~MSIE|Internet Explorer~i', $ua) || (strpos($ua, 'Trident/7.0') !== false && strpos($ua, 'rv:11.0') !== false)) { ?>
<style>
    .ie-upgrade {
        display: none;
    }

    @media screen and (-ms-high-contrast: active),
    (-ms-high-contrast: none) {
        .ie-upgrade {
            position: fixed;
            display: block;
            text-align: center;
            top: 0;
            right: 0;
            left: 0;
            z-index: 99999999;
            background: #ffffe0;
            border-bottom: 1px solid white;
            box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.3);
            padding: 3px;
        }

        .ie-upgrade-close {
            position: absolute;
            right: 0;
            top: 3px;
            bottom: 3px;
            right: 3px;
            border: none;
            background: transparent;
        }

        .ie-upgrade p,
        .ie-upgrade a,
        .ie-upgrade a:hover,
        .ie-upgrade a:focus,
        .ie-upgrade a:visited {
            color: black;
            font-family: sans-serif;
            line-height: 24px;
            margin: 0;
            font-size: 16px;
        }

        .ie-upgrade a {
            text-decoration: underline;
        }
    }
</style>
<div id="ie-upgrade-banner" class="ie-upgrade">
    <p>Internet Explorer kann diese Seite nicht optimal darstellen. <a
            href="microsoft-edge:<?='http'.(empty($_SERVER['HTTPS'])?'':'s').'://'. $_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'] ?>">Klicken
            Sie hier</a>, um die Website direkt in Microsoft Edge zu öffnen. Oder installieren Sie einen <a
            href="https://browser-update.org/de/update-browser.html">alternativen Browser</a>.</p><button
        class="ie-upgrade-close"
        onclick="document.getElementById('ie-upgrade-banner').parentNode.removeChild(document.getElementById('ie-upgrade-banner'));">X</button>
</div>
<?php }
```
