---
title: Styling des Cookie-Hinweises von iwcc Cookie Gedöns
authors: [anveno]
prio:
---

# Styling des Cookie-Hinweises von iwcc Cookie Gedöns


- [Einleitung](#einleitung)
- [Beispiel](#beispiel)
- [Code](#code)


<a name="einleitung"></a>
## Einleitung

Achtung: Diese Anleitung bezieht sich auf Version 1 des Addons. In Version 2 gab es Änderungen am Fragment "iwcc_box.php".

Der Cookie Hinweis des iwcc Cookie Gedöns Addons erscheint standardmäßig als Lightbox welche die gesamte Seite überlagert.
Zudem werden CSS- und Javascript-Dateien des Addons im Head-Bereich reingeladen.
Dies läasst sich über das Fragment iwcc_box.php aus dem Ordner fragments im Ordner eigenen Wünschen anpassen.
Dazu wird das Fragment z.B. in den Ordner theme/private/fragments kopiert, sofern das theme-Addon verwendet wird.
Anschließend können die Änderungen vorgenommen werden.

Im nachfolgenden Beispiel wird auf pretty-checkbox und fontello verzichtet. 
Das CSS aus iwcc_frontend.css wird geändert in die Haupt-CSS-Datei der Website eingefügt.

<a name="beispiel"></a>
## Beispiel

![Cookie](https://raw.githubusercontent.com/FriendsOfREDAXO/tricks/master/screenshots/cookie-footer.png "Cookie-Leiste im Footer")


<a name="code"></a>
## Code

```php
<?php
$iwcc = new iwcc_frontend($this->getVar('forceCache'));
$iwcc->setDomain($_SERVER['HTTP_HOST']);
if ($this->getVar('debug'))
{
    dump($iwcc);
}
?>
<?php if ($iwcc->cookiegroups): ?>
    <script src="/assets/addons/iwcc/js.cookie-2.2.1.min.js"></script>
    <script src="/assets/addons/iwcc/iwcc_frontend.js"></script>
    <script id="iwcc-template" type="text/template">
        <div class="iwcc-background fr-version-bottom iwcc-hidden <?= $iwcc->boxClass ?>" id="iwcc-background" data-domain-name="<?= $iwcc->domainName ?>">
            <div class="iwcc-wrapper" id="iwcc-wrapper">
                <div class="iwcc-wrapper-inner">
                    <div class="iwcc-summary" id="iwcc-summary">
                        <p class="iwcc-headline"><?= $iwcc->texts['headline'] ?></p>
                        <p class="iwcc-text"><?= nl2br($iwcc->texts['description']) ?></p>
                        <div class="iwcc-cookiegroups">
                            <?php
                            foreach ($iwcc->cookiegroups as $cookiegroup) {
								if ($cookiegroup['required']) {
                                    echo '<div class="iwcc-cookiegroup-checkbox">';
                                    echo '<input id="' . $cookiegroup['uid'] . '" type="checkbox" data-action="toggle-cookie" data-uid="' . $cookiegroup['uid'] . '" data-cookie-uids=\'' . json_encode($cookiegroup['cookie_uids']) . '\' disabled="disabled" checked="checked">';
                                    echo '<label for="' . $cookiegroup['uid'] . '">' . $cookiegroup['name'] . '</label>';
                                    if ($cookiegroup['script'])
                                    {
                                        echo '<div class="iwcc-script" data-script="' . $cookiegroup['script'] . '"></div>';
                                    }
                                    echo '</div>';
                                }
                                else {
                                    echo '<div class="iwcc-cookiegroup-checkbox">';
                                    echo '<input id="' . $cookiegroup['uid'] . '" type="checkbox" data-uid="' . $cookiegroup['uid'] . '" tabindex="1" autocomplete="off" data-cookie-uids=\'' . json_encode($cookiegroup['cookie_uids']) . '\'>';
                                    echo '<label for="' . $cookiegroup['uid'] . '">' . $cookiegroup['name'] . '</label>';
                                    if ($cookiegroup['script'])
                                    {
                                        echo '<div class="iwcc-script" data-script="' . $cookiegroup['script'] . '"></div>';
                                    }
                                    echo '</div>';
                                }
                            }
                            ?>
							<div class="iwcc-show-details">
								<a id="iwcc-toggle-details" class="omnMoreInfo"><?= $iwcc->texts['toggle_details'] ?></a>
							</div>
                        </div>
                    </div>
                    <div class="iwcc-detail iwcc-hidden" id="iwcc-detail">
                        <?php
                        foreach ($iwcc->cookiegroups as $cookiegroup)
                        {
                            echo '<div class="iwcc-cookiegroup-title iwcc-headline">';
                            echo $cookiegroup['name'] . ' <span>(' . count($cookiegroup['cookie']) . ')</span>';
                            echo '</div>';
                            echo '<div class="iwcc-cookiegroup-description">';
                            echo $cookiegroup['description'];
                            echo '</div>';
                            echo '<div class="iwcc-cookiegroup">';
                            foreach ($cookiegroup['cookie'] as $cookie)
                            {
                                echo '<div class="iwcc-cookie">';
                                echo '<span class="iwcc-cookie-name"><strong>' . $cookie['cookie_name'] . '</strong> (' . $cookie['service_name'] . ')</span>';
                                echo '<span class="iwcc-cookie-description">' . $cookie['description'] . '</span>';
                                echo '<span class="iwcc-cookie-description">' . $iwcc->texts['lifetime'] . ' ' . $cookie['cookie_lifetime'] . '</span>';
                                echo '<span class="iwcc-cookie-provider">' . $iwcc->texts['provider'] . ' ' . $cookie['provider'] . '</span>';
                                echo '<span class="iwcc-cookie-link-privacy-policy"><a href="' . $cookie['provider_link_privacy'] . '">' . $iwcc->texts['link_privacy'] . '</a></span>';
                                echo '</div>';
                            }
                            echo '</div>';
                        }
                        ?>
                    </div>
                    <div class="iwcc-buttons-sitelinks">
                        <div class="iwcc-buttons">
                            <a class="iwcc-save-selection iwcc-close uk-button uk-button-default"><?= $iwcc->texts['button_accept'] ?></a>
                            <a class="iwcc-accept-all iwcc-close uk-button uk-button-primary"><?= $iwcc->texts['button_select_all'] ?></a>
                        </div>
                        <div class="iwcc-sitelinks">
                            <?php
                            foreach ($iwcc->links as $v)
                            {
                                echo '<a href="' . rex_getUrl($v) . '">' . rex_article::get($v)->getName() . '</a>';
                            }
                            ?>
                        </div>
                    </div>
                    <a class="icon-cancel iwcc-close iwcc-close-box uk-hidden"></a>
                </div>
            </div>
        </div>
    </script>
<?php endif; ?>
```

```LESS
.iwcc-background {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 1em;
	z-index: 999999;
	height: 100%;
	width: 100%;
	overflow: hidden;
	
	.iwcc-wrapper {
		background: #fff;
		position: relative;
		font-size: 13px;
		line-height: 16px;
		width: 100%;
		max-width: 60em;
		max-height: 100vh;
		overflow-y: auto;
		a {
			cursor: pointer;
		}
	}
		
	&.fr-version-bottom {
		left: auto;
		top: auto;
		right: auto;
		bottom: 0px;
		padding: 0;
		height: auto;
		width: 100%;
		
		background-color: white;
		color: #666;
		border-top: 1px solid black;
		box-shadow: #ccc 2px 2px 8px 2px;

		.iwcc-wrapper {
			background: transparent;
		}
	}
}

.iwcc-wrapper-inner {
	padding: 1em;
	position: relative;
}

.iwcc-hidden {
	display: none;
}
.iwcc-detail {
	margin-bottom: 1em;
}
.iwcc-headline {
	font-weight: bold;
	font-size: 1em;
	margin-bottom: 5px;
	span {
		font-weight: normal;
	}
}
.iwcc-text {
	margin: 0;
}
	
.iwcc-sitelinks {
	a {
		display: inline-block;
		margin: 0 0.5em;
		color: #999;
		text-decoration: none;
		&:hover {
			color: #404040;
			text-decoration: none;
		}
		&:first-child {
			margin-left: 0;
		}
	}
}

.iwcc-save-selection {
	color: #A5A5A5 !important;
}

.iwcc-close-box {
	position: absolute;
	right: 0.5em;
	top: 0.5em;
	display: block;
	padding: 0;
	margin: 0;
	border: 0;
	cursor: pointer;
	color: #999;
	font-size: 1.8em;
	background: none transparent;
	line-height: 1;
	text-decoration: none;
	&:before {
		margin: 0;
	}
	&:hover {
		color: #404040;
		background: none transparent;
		text-decoration: none;
	}
}

.iwcc-cookiegroups {	
	margin: 8px 0 8px;	
	border: 1px solid #ccc;
	padding: 4px 8px;
	border-radius: 4px 0 0 4px;
	&:after {
		content: "";
		clear: both;
		display: table;
	}
}
.iwcc-cookiegroup-checkbox, .iwcc-show-details {
	margin: 0;
	
	position: relative;
	display: inline-block;
	white-space: nowrap;
	
	padding: 4px 10px;
	line-height: 17px;
	&:hover {
		background-color: #EDEDED;
		a {
			text-decoration: none;
			color: #666;
		}
	}
}

.iwcc-cookiegroup + .iwcc-cookiegroup-title {
	margin-top: 1em;
}
.iwcc-cookie {
	margin-top: 0.5em;
	border-left: 2px solid #999;
	padding: 0.5em 0.5em 0.5em 1em;
	background: #f9f9f9;
	span {
		display: block;
	}
}

.iwcc-wrapper {
	input[type="checkbox"] {
		opacity: 0;
		height: 17px;
		width: 17px;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		padding: 4px 8px;
	}
	input[type="checkbox"] + label, a.omnMoreInfo {
		height: auto;
		width: auto;
		min-height: 17px;
		display: block;
		position: relative;
		z-index: 1;
		vertical-align: top;
		line-height: 17px;
		cursor: pointer;
		padding: 1px 0 0 22px;
	}
	input[type="checkbox"] + label::before, a.omnMoreInfo::before {
		position: absolute;
		background-repeat: no-repeat;
		background-position: left top;
		height: 17px;
		width: 17px;
		display:inline-block;
		padding: 0;
		top: 0;
		left: 0;
		z-index: 1;
		content: '';
	}
	input[type="checkbox"] + label::before {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAABvAAAAbwHxotxDAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAADZQTFRF/////wAA5Bsb4Rsb4xoa4Rwc4xsb4Rsb4hsb4hsb4hsb4yIi4yYm8ZSU98DA98HB98LC////D8BLZgAAAAp0Uk5TAAEmcH+As7Xm9myQZpsAAABqSURBVBhXZY9JDgMhDASrbWDy/98OwfYcQhRF1LGl3gRgLiMrEhDIhgComYXQcL7ELOEXP+6QXcKUhaySutU7eIvAfQVMjQZyr7KIgqWXAeoiVwG5hWbU+yNsS0rbcoQetcewc/pxjv/7D9JkQzloZ2NlAAAAAElFTkSuQmCC');
	}
	input[type="checkbox"]:checked + label::before {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAACFAAAAhQHi7P/BAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAFFQTFRF////AP8AVdVVZsxNZrtVbcJVar9ca8NXaMFZasFXa8JZasNYasFaa8JZacJYasJZasNZa8JZasJZasJZasJZasJZasJZasJZasJZasJZasJZEILHAQAAABp0Uk5TAAEGCg8VJCZCRnB/gLGztbq9xsjS5urw9vwUKFZoAAAAcklEQVQYV23PSxYCIRBD0dDaooDVfijFt/+FOmhEj5rZHSWRJMVi7lai1oTUAKClIElhYWQJkhIfSVJsQ5c7LaoMnzcHyLK3t1cwOdxOw7gc9tPxZVwGdZ5yN6YC1Fnd5LW27rpb7MMevSr9m/5z7uv+E2PDEYnbsX9CAAAAAElFTkSuQmCC');

	}
	input[type="checkbox"]:disabled, input[type="checkbox"]:disabled + label {
		cursor: not-allowed;
		color: #666666;
	}
	input[type="checkbox"]:disabled + label::before {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjgyQzgwRUFDNTc3MjExRTg5NEE3RjRDQUZDNDBDOTY3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjgyQzgwRUFENTc3MjExRTg5NEE3RjRDQUZDNDBDOTY3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODJDODBFQUE1NzcyMTFFODk0QTdGNENBRkM0MEM5NjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODJDODBFQUI1NzcyMTFFODk0QTdGNENBRkM0MEM5NjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4X18kuAAABNElEQVR42mL8//8/AzLo6+tTA1JRQGwMxSBwFoqXFRUV3UJWzwgzoKGhgZGPjy8fyGwDYk4G7OA7EFd9+vRpIlD9f7gBUM1bgHwvBuLANqAhPiBDmEA8qM3EagYBL6geBmYgA+Tn1UDMSoTG4yD7gJgDiO2PHz++mgkaYJxEaN4H9K4LEIdB+SA9kUxIIU1Is++fP39YGRkZm5DETdANeA1UsBuXZiDYCeSbI8kZM6EpjmBnZ/cB0puI0AwGTNAEAgMTvn37xs/BwREKShqENIP0ohugy8TEtBdkCDDFNRLQDAJnQAYsg6YwFEOASVqFgGaQnuXglAhUXADk9KMp+AtKJ3hiphDoygngQASlbVDyRFPATCApT4QFIigv/AelbZCpaN7B5uxCWD5AyY3kZmeAAAMApNGWSOsTA9oAAAAASUVORK5CYII=');
	}
	a.omnMoreInfo::before {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiBQ8PJgNWUBqsAAABOUlEQVQoz3WRu0oDQRSGv5mNF0wQFBtBTNCIFxBsAmJlYSoLFaJiaSJGIS9gY55BC3VJXEshYlCwUouohfgARoQUYiNqsPGCJNkdi113EcxpzuH75z8XRuCG3tHwgB+4iw95VHplUz9+AAb0Fo/6YC+kJqoHT58q5jDhW2BX72yMVfaTZQHGKVG+eCHk+bgnjCZ2FldFdlKeUC9Ma0Sb3qLHBbcqLS5EH23ehiIblnmGAbiJjwLktI+SM65QnZVLJWvc2W3TznOm0gF4f4wmyxKaa07Db3eUXam0CTLbXjm0qUr96iIJQKtxlukSRp4Z11lQ2zKgVoi4Ty+FMcVR3TNR8zJ+zDlg8fxHecUErhI5CSql1kVvoJsNVzYCQS2o1sQyCM+UGdSKTuOxxPU/v2mVeLPvrxU9+gO/3Fu7J/nI4wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wNS0xNVQxNTozODowMyswMjowMJG7RKYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDUtMTVUMTU6Mzg6MDMrMDI6MDDg5vwaAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==');
	}
}

@media (max-width:35em){
	.iwcc-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column-reverse;
	}
	.iwcc-save-selection, .iwcc-accept-all {
		margin: 0em 0 0.5em 0;
	}
	.iwcc-buttons-sitelinks {
		text-align: center;
	}
}

@media (min-width: 35em) {
	.iwcc-cookiegroups {
		display: flex;
		flex-wrap: wrap;
		//justify-content: flex-end;		
		justify-content: flex-start;
	}
	.iwcc-buttons {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.iwcc-save-selection,
	.iwcc-accept-all {
		display: inline-block;
		margin: 0 0 0 0.5em;
	}
	
	.iwcc-buttons-sitelinks {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		flex-direction: row-reverse;
	}
}
```
    



