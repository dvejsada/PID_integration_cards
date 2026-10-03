# Reading the card

[← Back to README](../README.md)

Each row is one departure. From left to right:

| Column       | Shown                    | Meaning |
|:-------------|:-------------------------|:--------|
| Line         | always                   | Line number in the colour of the transport type. Night lines are black. |
| Destination  | always                   | Final stop of the trip. Below it the train number for trains, and icons for the vehicle (see below). |
| Platform     | with 2+ boards, or `show_platform: true` | Platform code of the stop the departure leaves from. |
| Time         | `time_format: both` or `absolute` | Scheduled departure time. |
| Delay        | `show_delay: true`       | Delay in minutes, or a calendar icon when there are no real-time data. Empty means on time. |
| Countdown    | `time_format: both` or `relative` | Minutes until the vehicle actually leaves, delay included. |

## Countdown

| Shown        | Meaning |
|:-------------|:--------|
| `5 min`      | Leaves in 5 to 6 minutes. The value is rounded down, so the card never promises more time than there is. |
| `<1 min`     | Leaves within a minute. |
| `now`        | The departure time has passed, but the vehicle has not reported leaving yet. |
| `at stop`    | The vehicle is standing at the stop. |
| `Canceled`   | The trip is cancelled. The row is greyed out and the time crossed out. |
| *(empty)*    | Leaves in an hour or more, the time column says when. With `time_format: relative` the expected time is shown instead. |

Departures leaving within two minutes have their countdown highlighted in the theme's primary colour.

The integration fetches data from the API once a minute; the card recalculates the countdown every 15 seconds in between, so it keeps counting down even without new data.

## Delay

| Shown            | Meaning |
|:-----------------|:--------|
| *(empty)*        | On time (less than a minute late). |
| orange `+2`      | 1 to 4 minutes late. |
| red `+7`         | 5 or more minutes late. |
| blue `−1`        | Early. |
| calendar icon    | No real-time data for this trip, the times are from the timetable. |

The time column always shows the **scheduled** time, the same way PID departure boards at stops do: `18:06 +2` means scheduled at 18:06 and running two minutes late. The countdown already includes the delay.

## Icons below the destination

| Icon                    | Meaning |
|:------------------------|:--------|
| wheelchair              | Wheelchair accessible vehicle |
| snowflake               | Air conditioned vehicle |
| moon                    | Night line |
| two arrows              | Substitute service |

Hover over an icon (or long-press on a touch screen) to see its description. The icons are hidden in compact mode and on narrow cards.

## Header

The header shows the stop name, or the common part of the names when several boards are selected (*Palmovka* for *Palmovka A* and *Palmovka B*). A different title can be set with `title`.

A **cloud icon** in the top right corner warns about the data:

| Shown                         | Meaning |
|:------------------------------|:--------|
| cloud icon with a time        | The data have not been updated for more than three minutes. The time is when they were last updated, so the departures shown may be out of date. |
| cloud icon, *Data unavailable* | The integration has no data for the board, e.g. because the API is unreachable or the board failed to load. With several boards, the departures of the others are still shown. |

When there are no departures to show, the card says why: *No upcoming departures* when the timetable is empty (e.g. at night), *Departure data are unavailable* when the integration has no data.

## Service alerts

When PID publishes a service alert (infotext) for the stop, it is shown in an orange box under the header. Long texts are shortened to two lines; tap the box to read the whole text. The English version is shown when your Home Assistant language is not Czech or Slovak and PID provides one.

## Details

Tap a departure to open its details with all the data the integration provides, e.g. the last stop the vehicle passed.
