# PID Departures Card

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/docs/faq/custom_repositories/)
[![Validate](https://github.com/dvejsada/PID_integration_cards/actions/workflows/validate.yaml/badge.svg)](https://github.com/dvejsada/PID_integration_cards/actions/workflows/validate.yaml)

A Home Assistant dashboard card that shows a live departure board for stops of the Prague Integrated Transport ([PID](https://pid.cz/)).

The card displays data from the [PID Departure Boards integration](https://github.com/dvejsada/PID_integration), which has to be installed and set up first.

![PID Departures card in light and dark theme](https://raw.githubusercontent.com/dvejsada/PID_integration_cards/main/assets/preview.png)

## Features

- **Live countdown** recalculated in the browser every 15 seconds between the integration's one-minute updates, rounded down so it never promises more time than there is
- **Delays at a glance**: scheduled time with a delay badge (orange up to 4 minutes, red from 5), early departures in blue, a calendar icon for trips without real-time data
- **Cancelled trips**, **vehicles at the stop** and the stop's **service alerts**
- **Several platforms in one list**: select more departure boards, e.g. all platforms of a stop, and their departures are merged and sorted by time
- **Stable layout**: every value has its own column shared by all rows, so a delay or a cancellation never shifts the other rows
- **Fits any column**: one line per departure on wide cards, a stacked layout on medium and narrow ones, and a compact mode for wall panels
- **Line colours** of PID (metro A/B/C, tram, bus, trolleybus, train, ferry, funicular, night lines), adjustable by a theme
- **Warning when data are stale**, e.g. when the API is down
- **Visual editor**, card picker preview, sections view support
- **Follows your profile**: theme, language (English, Czech, Slovak, German), 12/24-hour time and time zone

## Requirements

- Home Assistant 2024.1 or newer
- [PID Departure Boards integration](https://github.com/dvejsada/PID_integration) with at least one departure board

## Installation

### HACS (recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=dvejsada&repository=PID_integration_cards&category=plugin)

Or add it by hand:

1. Open **HACS**, select the **⋮** menu in the top right corner and choose **Custom repositories**.
2. Enter `https://github.com/dvejsada/PID_integration_cards`, choose the type **Dashboard** and select **Add**.
3. Search for **PID Departures Card**, open it and select **Download**.
4. Reload the browser (on the companion app, pull down to refresh).

HACS registers the card with your dashboards automatically.

### Manual

1. Download `pid-departures-card.js` from the [latest release](https://github.com/dvejsada/PID_integration_cards/releases/latest) and copy it to `config/www/`.
2. Go to **Settings → Dashboards**, select the **⋮** menu and choose **Resources**. If the menu is missing, enable **Advanced mode** in your user profile.
3. Add a resource with the URL `/local/pid-departures-card.js?v=1.0.0` and the type **JavaScript module**. Increase the `v` number with every update, otherwise browsers keep the old version.
4. Reload the browser.

## Usage

Edit a dashboard, select **Add card** and search for **PID Departures**. Choose one or more departure boards in the editor, everything else is optional.

The same in YAML:

```yaml
type: custom:pid-departures-card
devices:
  - 3f1c5e0d9a7b4c2e8d6f1a2b3c4d5e6f
```

`devices` takes the IDs of the departure board devices. The visual editor fills them in for you. In YAML you can find the ID in the address of the device page (**Settings → Devices & services → Devices → your board**), it is the last part of the URL.

### Options

| Option           | Default                  | Description |
|:-----------------|:-------------------------|:------------|
| `devices`        | *required*               | Departure boards to show. With more than one, their departures are merged and sorted by time. |
| `title`          | stop name                | Card title. |
| `max_departures` | all                      | Maximum number of departures. The upper limit is the *number of departures* set in the integration. |
| `time_format`    | `both`                   | `both`: countdown and scheduled time, `relative`: countdown only, `absolute`: scheduled time only. |
| `show_header`    | `true`                   | Show the title. |
| `show_infotext`  | `true`                   | Show the service alert of the stop. Tap it to read the whole text. |
| `show_delay`     | `true`                   | Show the delay column. |
| `show_platform`  | `true` with 2+ boards    | Show the platform column. |
| `hide_departed`  | `true`                   | Hide departures that have already left. |
| `compact`        | `false`                  | One line per departure, smaller rows. |

### Examples

All platforms of a stop on one board:

```yaml
type: custom:pid-departures-card
title: Palmovka
devices:
  - 3f1c5e0d9a7b4c2e8d6f1a2b3c4d5e6f   # Palmovka A
  - 7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d   # Palmovka B
```

A wall panel next to the door, five departures, no title:

```yaml
type: custom:pid-departures-card
devices:
  - 3f1c5e0d9a7b4c2e8d6f1a2b3c4d5e6f
compact: true
show_header: false
max_departures: 5
```

A timetable-style board with scheduled times only:

```yaml
type: custom:pid-departures-card
devices:
  - 3f1c5e0d9a7b4c2e8d6f1a2b3c4d5e6f
time_format: absolute
```

## Documentation

- [Reading the card](docs/reading-the-card.md): what each column, colour and icon means
- [Layout](docs/layout.md): how the card adapts to its width
- [Theming](docs/theming.md): changing line colours
- [Troubleshooting](docs/troubleshooting.md)
- [Development](docs/development.md): previewing changes without Home Assistant, releasing

## Related

- [PID Departure Boards integration](https://github.com/dvejsada/PID_integration): the data source for this card
- [Golemio API](https://api.golemio.cz/pid/docs/openapi/): the PID departure board API used by the integration

## License

[MIT](LICENSE)
