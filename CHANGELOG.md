# Changelog

## 1.0.0-beta.1

First beta. The card now follows the look and the interactions of Home Assistant's own cards.

### New

- Show only some lines with `lines`, or hide some with `exclude_lines`, also in the visual editor. When no departure of the selected lines is left, the card says *No upcoming departures of the selected lines*.
- Standard Home Assistant actions on departures: `tap_action`, `hold_action` and `double_tap_action`, with confirmation, navigate, perform-action and the other actions of built-in cards, also in the visual editor under *Interactions*. Tapping still opens the details by default. With every action set to `none` the rows are not clickable or focusable.
- Home Assistant's press and hover effect (ripple) on departures, on HA 2024.6 and newer.
- Theme variables for the text colour of line badges: `pid-line-text-color` for all of them and one per type (`pid-color-tram-text`, `pid-color-ferry-text`, `pid-color-metro-b-text`, …), and `pid-delay-early-text-color` for the early delay badge.

### Changed

- Text sizes, weights, corner radii and spacing follow Home Assistant's design tokens and font size scale, with the same values as fallbacks on older versions. To match Home Assistant's sizes the destination is 14 px instead of 15 px, the time 12 px instead of 13 px, the countdown bold, line badges 14 px with 4 px corners, and the compact title 20 px instead of 18 px.
- The title is styled like the header of Home Assistant's own cards and follows the `ha-card-header-*` theme variables.
- The early delay badge has dark text; white on the default info blue was hard to read.
- Rows are updated in place instead of being rebuilt every 15 seconds, so focus and the press effect survive updates and wall panels do less work.

### Accessibility

- The service alert can be expanded with the keyboard and keeps the focus.
- The focused departure is outlined in high contrast mode; the hover effect respects *reduce motion*.

### Upgrading

- **card-mod:** the title elements are now `.card-header` and `.name` instead of `.header` and `.title`. Class names are not a stable interface, prefer the theme variables where possible.
- HACS: this is a pre-release, turn on **Show beta versions** for the card in HACS to get it.
- Manual installation: change the resource URL to `/local/pid-departures-card.js?v=1.0.0-beta.1` so browsers load the new version.

## 1.0.0-alpha.2

- When the integration has no data (the API is unreachable, or the board is not loaded), the card says *Departure data are unavailable* and shows *Data unavailable* in the header, instead of *No upcoming departures*. Since version 3.0 of the integration all its entities become unavailable when an update fails.
- A board without any departures (e.g. at night) still shows *No upcoming departures*.

## 1.0.0-alpha.1

First pre-release of the card, moved out of the [PID Departure Boards integration](https://github.com/dvejsada/PID_integration) into its own repository.

- Departure board for one or more PID departure boards, merged and sorted by time
- Countdown recalculated in the browser every 15 seconds
- Scheduled time with delay badges, cancelled trips, vehicle at stop, trips without real-time data
- Service alert banner and a warning when data are stale
- Columns aligned across all rows; one-line, stacked and narrow layouts by card width; compact mode
- PID line colours, adjustable by a theme
- Visual editor, card picker preview and sections view support
- English, Czech, Slovak and German
