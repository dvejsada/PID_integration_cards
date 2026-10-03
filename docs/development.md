# Development

[← Back to README](../README.md)

The card is a single JavaScript file, [`dist/pid-departures-card.js`](../dist/pid-departures-card.js), written as a plain web component. There is no build step and no dependencies: the file in the repository is the file Home Assistant loads.

## Previewing changes

[`dev/demo.html`](../dev/demo.html) renders the card with mock data in several configurations and widths, without Home Assistant. Open it in a browser (directly from disk works) and use the toolbar to switch the theme, language and time format. It covers delays, cancellations, trips without real-time data, a vehicle at the stop, a service alert, stale data and a missing configuration.

The page provides minimal stand-ins for the Home Assistant elements the card uses (`ha-card`, `ha-icon`) and a mock `hass` object shaped like the one Home Assistant passes to cards. The visual editor needs the real Home Assistant frontend and is not part of the demo.

To try the card in Home Assistant, copy the file to `config/www/` and add it as a resource, see the manual installation in the [README](../README.md#manual).

## How the card finds its data

The card is configured with departure board **devices**, not entities, because the entity IDs are generated from translated names and differ per language. It looks up the entities of the selected devices in `hass.entities` by their translation key:

| Translation key | Entity                       | Used for |
|:----------------|:-----------------------------|:---------|
| `route_name`    | `sensor` per departure       | All departure data, from its attributes |
| `infotext`      | `binary_sensor`              | Service alert |
| `updated`       | `sensor`                     | Time of the last successful update, for the stale data warning |

When the integration renames these keys or the attributes of the `route_name` sensors, the card has to be updated too.

## Performance

Home Assistant replaces the `hass` object on every state change in the whole system. The card re-renders only when one of its own entities or the language changed, and otherwise once every 15 seconds for the countdown. The timer stops while the card is not displayed (e.g. on another dashboard view) and skips rendering while the browser tab is hidden.

## Checks

The `Validate` workflow runs on every push and pull request:

- HACS validation of the repository,
- `node --check dist/pid-departures-card.js`.

## Releasing

1. Update `CARD_VERSION` at the top of `dist/pid-departures-card.js`.
2. Update the version in the manual installation step of the README and add the changes to [`CHANGELOG.md`](../CHANGELOG.md).
3. Commit and push.
4. Create a GitHub release with the tag `v` + the version, e.g. `v1.0.1`.

The `Release` workflow checks that the tag matches `CARD_VERSION` and attaches `pid-departures-card.js` to the release. HACS offers the update to users from the release.
