---
title: Weiterführende Tipps nach Konvertierung von REDAXO 4.x zu 5
authors: [skerbis,alexplusde]
prio:
--- 

# Weiterführende Tipps nach Konvertierung von REDAXO 4.x zu 5

## Fehlersuche und -behebung

Das Cache Warm-Up AddOn vereinfacht die Fehlersuche nach der Migration erheblich. Sie müssen nicht mehr manuell alle Seiten durchklicken, um Fehler zu finden. Das AddOn durchsucht automatisch Ihre Website und stoppt, sobald es einen Fehler findet. Sie erhalten dann eine detaillierte Fehlermeldung im Whoops-Format.

## AddOn-Kompatibilität und Alternativen

Nicht alle AddOns aus REDAXO 4 wurden für REDAXO 5 aktualisiert. Hier finden Sie eine Übersicht zu Alternativen für häufig genutzte AddOns:

### SEO-Funktionalität
- Das SEO42-AddOn wird nicht mehr unterstützt
- Alle `SEO42::`-Aufrufe in Templates und Modulen müssen manuell entfernt werden
- Alternative: **YRewrite** (empfohlen) oder **YRewrite** in Kombination mit **YRewrite Scheme**

### Artikel-Slices aktivieren/deaktivieren
- Ab REDAXO 5.10 ist diese Funktion bereits im Core integriert
- Für ältere Versionen: AddOn `bloecks` mit Plugin `status` verwenden
- Migration der Daten:
  1. `bloecks` und das Plugin `status` installieren
  2. Alte Werte in der Datenbank übertragen: `UPDATE rex_article_slice SET status = a356_is_online`
  3. Spalte `a356_is_online` kann danach aus der Tabelle `rex_article_slice` gelöscht werden

### Text-Editoren
Folgende Editoren stehen zur Verfügung:
- **Markitup-AddOn** für Textile und Markdown
- WYSIWYG-Editoren: **CKEditor 4**, **CKE5**, **Redactor2** oder **TinyMCE**

### Suchfunktion
- Das AddOn **search_it** ersetzt xsearch und rex_search
- Bei Migration von REX_Search muss nur der PHP-Klassenaufruf angepasst werden
- Wichtig: Dokumentation zur sicheren Code-Anpassung beachten

### Formulare
- **YForm** ist der Nachfolger von **XForm**
- Tabellen und Einstellungen werden durch den YConverter automatisch migriert
- Für **do form!** Nutzer: Nachfolger auf [GitHub](https://github.com/skerbis/doform-6) verfügbar
- Bei wenigen Formularen empfiehlt sich eine Umstellung auf YForm

### Datei-Uploads
Für Mehrfach-Uploads stehen zwei Alternativen zur Verfügung:
- AddOn **uploader**
- AddOn **multiuploader**

## Migration der Benutzer-Passwörter

### Wichtige Vorbereitungen
1. Backup der Tabellen `rex_user` und `rex_xcom_user` erstellen
2. Verschlüsselungsmethode der alten Passwörter prüfen

### Schritte zur Migration

#### 1. Datenbank anpassen

Die Benutzerdaten aus REDAXO 4 müssen für REDAXO 5 angepasst werden:

- Feldänderungen:
  - `user_id` wird zu `id` (muss eindeutig sein)
  - `psw` wird zu `password`
  - Zeitstempel-Felder müssen in datetime-Format konvertiert werden
  - `rights`-Feld kann entfernt werden (REDAXO 5 nutzt Rollen)
  - `session_id` kann entfernt werden

Beispiel für minimalen Import:
```sql
INSERT INTO `rex_user` (`login`, `password`) VALUES
('redaktion', 'f616d7c4c54614b51f5d0bfa877e1a3ae63d31e3');
```

#### 2. Passwörter konvertieren

Fügen Sie folgenden Code in ein Modul oder Template ein (nur einmalig ausführen!):

```php
<?php
// Nur die zu migrierenden REDAXO 4 Benutzer auswählen
$users = rex_sql::factory()
    ->setDebug(true)
    ->setTable(rex::getTable('user'))
    ->setWhere(['id' => 2]) // IDs der migrierten Benutzer angeben
    ->select();

// Passwörter konvertieren
$isPreHashed = true; // auf false setzen, wenn Passwörter unverschlüsselt sind
foreach ($users as $user) {
    rex_sql::factory()
        ->setDebug(true)
        ->setTable(rex::getTable('user'))
        ->setWhere(['login' => $user->getValue('login')])
        ->setValue('password', rex_login::passwordHash($user->getValue('password'), $isPreHashed))
        ->update();
}
```

**Wichtig**: 
- Nur die IDs der migrierten REDAXO 4 Benutzer in der WHERE-Klausel angeben
- Code nur einmal ausführen, sonst werden bereits korrekte Passwörter erneut gehasht
