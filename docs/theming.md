# Theming

[← Back to README](../README.md)

The card uses the standard Home Assistant theme variables (`primary-text-color`, `secondary-text-color`, `divider-color`, `primary-color`, `warning-color`, `error-color`, `info-color`, …), so it follows your theme in light and dark mode.

## Line colours

The line badges use colours close to the PID ones. They can be changed by setting these variables in a [theme](https://www.home-assistant.io/integrations/frontend/#defining-themes):

| Variable               | Default   | Used for |
|:-----------------------|:----------|:---------|
| `pid-color-metro-a`    | `#00a562` | Metro A |
| `pid-color-metro-b`    | `#f8b322` | Metro B (with dark text) |
| `pid-color-metro-c`    | `#cf003d` | Metro C |
| `pid-color-metro`      | `#555555` | Any other metro line |
| `pid-color-tram`       | `#7a0603` | Trams |
| `pid-color-bus`        | `#007da8` | Buses, and any unknown type |
| `pid-color-trolleybus` | `#80166f` | Trolleybuses |
| `pid-color-train`      | `#283583` | Trains |
| `pid-color-ferry`      | `#00a3c7` | Ferries |
| `pid-color-funicular`  | `#8b6d4c` | Petřín funicular |
| `pid-color-night`      | `#1d1d1b` | Night lines of any type |

Example theme in `configuration.yaml` (or a file in your `themes` folder):

```yaml
frontend:
  themes:
    My theme:
      pid-color-tram: "#a00000"
      pid-color-night: "#2b2b6b"
```

Badges have white text, except metro B, which has dark text.

## card-mod

With [card-mod](https://github.com/thomasloven/lovelace-card-mod) the variables can also be set for a single card:

```yaml
type: custom:pid-departures-card
devices:
  - 3f1c5e0d9a7b4c2e8d6f1a2b3c4d5e6f
card_mod:
  style: |
    ha-card {
      --pid-color-bus: #1565c0;
    }
```
