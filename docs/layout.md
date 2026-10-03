# Layout

[← Back to README](../README.md)

## Columns

The departures are laid out in columns shared by all rows: line, destination, platform, time, delay and countdown. Each column is as wide as its widest value, so values line up across rows whatever they contain: a delay badge, a cancellation, a long line number such as `X913` or a long label such as *v zastávce*.

The delay, countdown and platform columns also keep a minimum width, so the layout does not jump when values change between updates, e.g. when the first delay appears or *9 min* becomes *12 min*.

Columns that are switched off (`show_delay`, `show_platform`, `time_format`) are left out entirely.

## Card width

The card adapts to its own width, not the width of the screen, so it fits a narrow column of a wide dashboard as well as a phone.

| Card width       | Layout |
|:-----------------|:-------|
| 420 px and more  | One line per departure. |
| 340 – 419 px     | Countdown on the first line, time and delay under it. |
| less than 340 px | Destination on the first line, platform, time, delay and countdown on the second. Vehicle icons are hidden. |

With `time_format: relative` or `absolute` there are fewer columns, so the one-line layout is kept down to 340 px.

![The card in different widths and modes](https://raw.githubusercontent.com/dvejsada/PID_integration_cards/main/assets/layouts.png)

## Compact mode

`compact: true` always shows one line per departure with smaller rows and a smaller title, for wall panels and small tiles. Vehicle icons are hidden. With `time_format: both`, cards narrower than 340 px hide the time column too and keep the countdown.

## Sections view

In the sections view the card takes the full width of a section by default and can be resized down to half of it. The height follows the number of departures.

## Browser support

The aligned columns use CSS subgrid, supported by Chrome and Android WebView 117+, Safari 16+ and Firefox 71+. Older browsers, e.g. on an old wall tablet, show the same layout, only the columns may be a few pixels off between rows.
