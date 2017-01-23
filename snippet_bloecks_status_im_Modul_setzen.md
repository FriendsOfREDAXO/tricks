# Bloecks Status im Modul setzen

```php 
<?php
if (rex::isBackend()) {
  $slice_status = bloecks_status_backend::setSliceStatus("REX_SLICE_ID", 0); // status: true/false
}
?>
´´´
