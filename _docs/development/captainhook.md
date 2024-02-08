---
title: Captain Hook
authors: [eaCe]
prio:
---

# Captain Hook

[Captain Hook](https://github.com/captainhookphp/captainhook) ist ein Tool, das es ermöglicht, Git-Hooks zu konfigurieren und zu verwenden. Es ist ein nützliches
Tool, um sicherzustellen, dass bestimmte Standards eingehalten werden, bevor ein Commit oder ein Push durchgeführt wird.
Captain Hook bietet eine einfache Möglichkeit, hooks zu konfigurieren und zu verwenden. Weiter lassen sich die Hooks
einfach in ein Projekt integrieren und in einem Team verwenden.

## Git-Hooks

Git-Hooks sind Skripte, die automatisch ausgeführt werden, wenn bestimmte Ereignisse in einem Git-Repository auftreten.
Es gibt verschiedene Arten von Hooks, die in verschiedenen Situationen ausgeführt werden. 

Hier sind einige Beispiele für Hooks:

- `pre-commit`: Wird vor einem Commit ausgeführt
- `commit-msg`: Wird ausgeführt, nachdem eine Commit-Nachricht eingegeben wurde
- `pre-push`: Wird vor einem Push ausgeführt
- `post-checkout`: Wird nach einem Checkout ausgeführt

## Installation

Um Captain Hook zu installieren, muss Composer verwendet werden. Zur Installation kann der folgende Befehl verwendet
werden:

```bash
composer require captainhook/captainhook --dev
```

## Konfiguration

Nach der Installation von Captain Hook muss die Konfiguration erstellt werden. Dazu kann der folgende Befehl verwendet
werden:

```bash
vendor/bin/captainhook configure
```

Dieser Befehl erstellt eine `captainhook.json`-Datei im Root-Verzeichnis des Projekts. Diese Datei wird verwendet, um
die Hooks zu konfigurieren. Eine Beispielkonfiguration findet sich am Ende dieser Anleitung.

## Aktivierung

Nachdem die Konfiguration erstellt wurde, müssen die Hooks in den lokalen .git-Ordner installiert werden. Dazu kann der
folgende Befehl verwendet werden:

```bash
vendor/bin/captainhook install
```

Dieser Befehl erstellt die notwendigen Dateien und Verzeichnisse im .git-Ordner, um die Hooks zu verwenden.

Für zukünftige Installationen kann man in der `composer.json`-Datei ein Skript hinzufügen, das die Installation
automatisch durchführt:

```json
  "scripts": {
    "post-install-cmd": [
      "vendor/bin/captainhook install"
    ]
  }
```

## Beispielkonfiguration

Folgende Konfiguration kann in der `captainhook.json`-Datei verwendet werden. 
Alle Informationen zu den verfügbaren Aktionen und Bedingungen finden sich in der [Dokumentation](http://captainhook.info/php/configure.html).

```json
{
  "commit-msg": {
    "enabled": true,
    "actions": [
      {
        "action": "\\CaptainHook\\App\\Hook\\Message\\Action\\Regex",
        "options": {
          "regex": "#.*#"
        },
        "config": {
          "label": "Check for non-empty commit message"
        }
      }
    ]
  },
  "pre-push": {
    "enabled": false,
    "actions": [
    ]
  },
  "pre-commit": {
    "enabled": true,
    "actions": [
      {
        "action": "\\CaptainHook\\App\\Hook\\PHP\\Action\\Linting",
        "options": [],
        "config": {
          "label": "Run PHP Linting"
        }
      },
      {
        "action": "composer cs-fix",
        "config": {
          "label": "Run PHP CS Fixer and fix code style"
        }
      },
      {
        "action": "\\CaptainHook\\App\\Hook\\File\\Action\\DoesNotContainRegex",
        "options": {
          "regex": "#print_r|var_dump|dump|@dump#i",
          "regexName": "debug output",
          "fileExtensions": [
            "inc",
            "php"
          ]
        },
        "config": {
          "label": "Search for debug output in files"
        }
      }
    ]
  },
  "prepare-commit-msg": {
    "enabled": false,
    "actions": []
  },
  "post-commit": {
    "enabled": false,
    "actions": []
  },
  "post-merge": {
    "enabled": false,
    "actions": []
  },
  "post-checkout": {
    "enabled": true,
    "actions": [
      {
        "action": "composer install --ansi",
        "conditions": [
          {
            "exec": "\\CaptainHook\\App\\Hook\\Condition\\FileChanged\\Any",
            "args": [
              ["composer.json", "composer.lock"]
            ]
          }
        ],
        "config": {
          "label": "Run composer install if composer.json or composer.lock has changed"
        }
      }
    ]
  },
  "post-rewrite": {
    "enabled": false,
    "actions": []
  },
  "post-change": {
    "enabled": false,
    "actions": []
  }
}
```
