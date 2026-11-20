# Theming

[← Back to README](../README.md)

The card uses the standard Home Assistant theme variables (`primary-text-color`, `secondary-text-color`, `divider-color`, `primary-color`, `warning-color`, `error-color`, `info-color`, …), so it follows your theme in light and dark mode.

Text sizes, font weights, corner radii and spacing come from Home Assistant's design tokens (`ha-font-size-*`, `ha-font-weight-*`, `ha-border-radius-*`, `ha-space-*`), so the card follows the font size scale and a theme that changes them. On versions before the tokens existed (fonts 2025.5, radii 2025.8, spacing 2025.10) the card uses the same default values.

The title is styled like the header of Home Assistant's own cards and follows `ha-card-header-font-size`, `ha-card-header-font-family` and `ha-card-header-color`. In compact mode the title has its own, smaller size (`ha-font-size-xl`, 20 px).

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

Each colour has a matching text colour variable with `-text` appended, e.g. `pid-color-ferry-text` or `pid-color-night-text`. They default to `pid-line-text-color` (white), except `pid-color-metro-b-text`, which defaults to dark `#1d1d1b`. `pid-line-text-color` changes the text of all badges except metro B at once.

Example theme in `configuration.yaml` (or a file in your `themes` folder):

```yaml
frontend:
  themes:
    My theme:
      pid-color-tram: "#a00000"
      pid-color-night: "#2b2b6b"
```

Badges have white text, except metro B, which has dark text. When you change a background to a light colour, change its text colour with it, e.g. dark text on a lighter ferry colour:

```yaml
frontend:
  themes:
    My theme:
      pid-color-ferry: "#7fd3e6"
      pid-color-ferry-text: "#1d1d1b"
```

The delay badges use the theme's `info-color` (early), `warning-color` (late) and `error-color` (5 minutes or more). The early badge has dark text, which can be changed with `pid-delay-early-text-color` for a theme with a dark `info-color`.

The press and hover effect of the departures is Home Assistant's ripple, its colour can be changed with `ha-ripple-color` (default: the secondary text colour).

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

card-mod can also style the card's elements, e.g. `.card-header` (title row), `.name` (title text), `.row` (departure), `.line`, `.headsign`, `.count-cell`. These class names are not a stable interface and may change between versions; theme variables are.
