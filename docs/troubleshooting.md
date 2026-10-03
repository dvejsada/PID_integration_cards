# Troubleshooting

[← Back to README](../README.md)

## "Custom element doesn't exist: pid-departures-card"

The browser has not loaded the card.

- Reload the page. On the companion app, pull down to refresh, or go to **Settings → Companion app → Debugging** and select **Reset frontend cache**.
- Check that the card is downloaded in HACS.
- Dashboards in YAML mode do not get the resource added by HACS. Add it to the `lovelace` section of `configuration.yaml`:

  ```yaml
  lovelace:
    resources:
      - url: /hacsfiles/PID_integration_cards/pid-departures-card.js
        type: module
  ```

- With a manual installation, check that the resource is listed under **Settings → Dashboards → ⋮ → Resources** with the type **JavaScript module**, and that the file is in `config/www/`.

## The card still looks like the old version after an update

The browser keeps the old file in its cache. Reload the page while bypassing the cache (Ctrl+Shift+R, or Cmd+Shift+R on a Mac); on the companion app reset the frontend cache as described above. With a manual installation, increase the `?v=` number in the resource URL.

The version that is running is printed in the browser console (`PID-DEPARTURES-CARD 1.0.0`).

## "Departure board not found"

None of the selected departure boards exists. This happens when a board was removed from the integration and added again, because it gets a new device ID. Open the card editor and select the board again.

## "Select a departure board in the card configuration"

The card has no `devices` set. Select a board in the card editor.

## The editor offers no departure boards

The device picker only lists devices of the PID Departure Boards integration. Check that the integration is installed and has at least one departure board.

## Fewer departures than expected

- The card cannot show more departures than the integration provides. The *number of departures* is set when a departure board is added to the integration; to change it, remove the board and add it again (then select it in the card again, it gets a new device ID).
- Departures that have already left are hidden (`hide_departed`).
- `max_departures` limits the number of rows.

## A cloud icon with a time in the header

The integration has not received new data for more than three minutes. Check the Home Assistant log for errors of the PID Departure Boards integration, your API key, and the [Golemio API status](https://api.golemio.cz/). The time next to the icon is when the data were last updated.

## All departures show a calendar icon

The API provides no real-time data for these trips, so the times are from the timetable. This is common for some regional lines and trains.

## Times are in the wrong time zone or format

The card follows your user profile: **Profile → General → Time format** and **Time zone** (*use your local time zone* or *use server time zone*).

## Reporting a problem

Open an [issue](https://github.com/dvejsada/PID_integration_cards/issues) with:

- the card version from the browser console,
- your Home Assistant version and browser or companion app,
- the card YAML (the device IDs can be left out),
- a screenshot.

Problems with the data itself (missing stops, wrong departures, API errors) belong to the [integration](https://github.com/dvejsada/PID_integration/issues).
