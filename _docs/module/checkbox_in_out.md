---
title: Checkbox im Modul
authors: []
prio:
---

# Checkbox im Modul

# Beschreibung
Dieses Modul Beinhaltet eine Checkbox als Modul.

## Input

```html
<input type="hidden" name="REX_INPUT_VALUE[1]" value="0">
<input type="checkbox" name="REX_INPUT_VALUE[1]" value="1" REX_VALUE[id=1 instead=checked]>
```

## Output

```php
<?php 
if(REX_VALUE[1])
    {
      echo "checked...";
```
