# Changelog

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
