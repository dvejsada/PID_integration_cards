# Changelog

## Unreleased

- Standard Home Assistant actions on departures: `tap_action`, `hold_action` and `double_tap_action`, with confirmation, navigate, perform-action and the other actions of built-in cards, also in the visual editor (*Interactions*). Tapping still opens the details by default.
- With every action set to `none` the rows are not clickable or focusable.
- Departures show Home Assistant's press and hover effect (ripple) when the frontend provides it (HA 2024.6 and newer), otherwise the hover background as before.
- Rows are updated in place instead of being rebuilt every 15 seconds, so focus and the press effect survive updates and less work is done on wall panels.
- Text sizes, weights, corner radii and spacing follow Home Assistant's design tokens and font size scale, with the same values as before as fallbacks for older versions. To match Home Assistant's sizes the destination is 14 px instead of 15 px, the time 12 px instead of 13 px, the countdown bold, line badges 14 px with 4 px corners, and the compact title 20 px instead of 18 px.
- The title is styled like the header of Home Assistant's own cards (`card-header` class, `ha-card-header-*` theme variables).
- The service alert can be expanded with the keyboard; the focused departure is outlined in high contrast mode; the hover effect respects *reduce motion*.

- New options `lines` and `exclude_lines` to show only some lines, or to hide some, also in the visual editor. When no departure of the selected lines is left, the card says *No upcoming departures of the selected lines*.

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
