/**
 * PID Departures card for Home Assistant.
 * https://github.com/dvejsada/PID_integration_cards
 *
 * Shows departures provided by the PID Departure Boards integration
 * (https://github.com/dvejsada/PID_integration).
 *
 * The card is configured with departure board devices rather than entity IDs:
 * entity IDs are generated from translated names and differ per language.
 */

const CARD_VERSION = "1.0.0-alpha.2";
const DOMAIN = "pid_departures";
const CARD_TYPE = "pid-departures-card";
const EDITOR_TYPE = "pid-departures-card-editor";

// The integration polls the API once a minute; the countdown is recomputed
// locally in between so it does not freeze for up to a minute.
const TICK_MS = 15 * 1000;
// Keep a departure that just left visible briefly, the data may be a minute old.
const DEPARTED_GRACE_MS = 30 * 1000;
// Three missed polls in a row mean the shown data can no longer be trusted.
const STALE_AFTER_MS = 3 * 60 * 1000;
// Gesture timing of Home Assistant's own action handler.
const HOLD_MS = 500;
const DOUBLE_TAP_MS = 250;
// A press that moves further is a scroll, not a hold.
const HOLD_MOVE_PX = 10;
// The click that ends a hold follows its pointerup at once.
const CLICK_AFTER_RELEASE_MS = 1000;

const DEFAULTS = {
  time_format: "both",
  show_header: true,
  show_infotext: true,
  show_delay: true,
  hide_departed: true,
  compact: false,
};

const TRANSLATIONS = {
  en: {
    min: "min",
    now: "now",
    at_stop: "at stop",
    canceled: "Canceled",
    no_departures: "No upcoming departures",
    no_matching: "No upcoming departures of the selected lines",
    no_board: "Select a departure board in the card configuration.",
    board_not_found: "Departure board not found. Check the card configuration.",
    stale: "Not updated since {time}",
    unavailable: "Data unavailable",
    unavailable_body: "Departure data are unavailable. Check the PID Departure Boards integration.",
    delay: "Delay",
    no_realtime: "Timetable (no real-time data)",
    platform: "Platform",
    wheelchair: "Wheelchair accessible vehicle",
    air_conditioned: "Air conditioned",
    night: "Night line",
    substitute: "Substitute service",
    route_type: {
      tram: "Tram", metro: "Metro", train: "Train", bus: "Bus",
      ferry: "Ferry", funicular: "Funicular", trolleybus: "Trolleybus",
    },
    editor: {
      devices: "Departure boards",
      title: "Title (default: stop name)",
      max_departures: "Maximum departures",
      time_format: "Departure time",
      time_format_both: "Countdown and time",
      time_format_relative: "Countdown only",
      time_format_absolute: "Time only",
      show_header: "Show header",
      show_infotext: "Show service alerts",
      show_delay: "Show delay",
      show_platform: "Show platform",
      hide_departed: "Hide departed",
      compact: "Compact layout",
      interactions: "Interactions",
      tap_action: "Tap action",
      hold_action: "Hold action",
      double_tap_action: "Double tap action",
      lines: "Show only lines (e.g. 9, 22, A)",
      exclude_lines: "Hide lines",
    },
  },
  cs: {
    min: "min",
    now: "teď",
    at_stop: "v zastávce",
    canceled: "Zrušeno",
    no_departures: "Žádné nadcházející odjezdy",
    no_matching: "Žádné nadcházející odjezdy vybraných linek",
    no_board: "V nastavení karty vyberte odjezdovou tabuli.",
    board_not_found: "Odjezdová tabule nebyla nalezena. Zkontrolujte nastavení karty.",
    stale: "Neaktualizováno od {time}",
    unavailable: "Data nejsou k dispozici",
    unavailable_body: "Data o odjezdech nejsou k dispozici. Zkontrolujte integraci PID Departure Boards.",
    delay: "Zpoždění",
    no_realtime: "Dle jízdního řádu (bez online dat)",
    platform: "Nástupiště",
    wheelchair: "Bezbariérové vozidlo",
    air_conditioned: "Klimatizace",
    night: "Noční linka",
    substitute: "Náhradní doprava",
    route_type: {
      tram: "Tramvaj", metro: "Metro", train: "Vlak", bus: "Autobus",
      ferry: "Přívoz", funicular: "Lanovka", trolleybus: "Trolejbus",
    },
    editor: {
      devices: "Odjezdové tabule",
      title: "Nadpis (výchozí: název zastávky)",
      max_departures: "Maximální počet odjezdů",
      time_format: "Čas odjezdu",
      time_format_both: "Odpočet a čas",
      time_format_relative: "Pouze odpočet",
      time_format_absolute: "Pouze čas",
      show_header: "Zobrazit záhlaví",
      show_infotext: "Zobrazit mimořádnosti",
      show_delay: "Zobrazit zpoždění",
      show_platform: "Zobrazit nástupiště",
      hide_departed: "Skrýt odjeté spoje",
      compact: "Kompaktní rozložení",
      interactions: "Interakce",
      tap_action: "Akce při klepnutí",
      hold_action: "Akce při podržení",
      double_tap_action: "Akce při dvojitém klepnutí",
      lines: "Zobrazit pouze linky (např. 9, 22, A)",
      exclude_lines: "Skrýt linky",
    },
  },
  sk: {
    min: "min",
    now: "teraz",
    at_stop: "na zastávke",
    canceled: "Zrušené",
    no_departures: "Žiadne nadchádzajúce odchody",
    no_matching: "Žiadne nadchádzajúce odchody vybraných liniek",
    no_board: "V nastavení karty vyberte odchodovú tabuľu.",
    board_not_found: "Odchodová tabuľa nebola nájdená. Skontrolujte nastavenie karty.",
    stale: "Neaktualizované od {time}",
    unavailable: "Údaje nie sú k dispozícii",
    unavailable_body: "Údaje o odchodoch nie sú k dispozícii. Skontrolujte integráciu PID Departure Boards.",
    delay: "Meškanie",
    no_realtime: "Podľa cestovného poriadku (bez online údajov)",
    platform: "Nástupište",
    wheelchair: "Bezbariérové vozidlo",
    air_conditioned: "Klimatizácia",
    night: "Nočná linka",
    substitute: "Náhradná doprava",
    route_type: {
      tram: "Električka", metro: "Metro", train: "Vlak", bus: "Autobus",
      ferry: "Prievoz", funicular: "Lanovka", trolleybus: "Trolejbus",
    },
    editor: {
      devices: "Odchodové tabule",
      title: "Nadpis (predvolený: názov zastávky)",
      max_departures: "Maximálny počet odchodov",
      time_format: "Čas odchodu",
      time_format_both: "Odpočet a čas",
      time_format_relative: "Iba odpočet",
      time_format_absolute: "Iba čas",
      show_header: "Zobraziť hlavičku",
      show_infotext: "Zobraziť mimoriadnosti",
      show_delay: "Zobraziť meškanie",
      show_platform: "Zobraziť nástupište",
      hide_departed: "Skryť odídené spoje",
      compact: "Kompaktné rozloženie",
      interactions: "Interakcie",
      tap_action: "Akcia pri ťuknutí",
      hold_action: "Akcia pri podržaní",
      double_tap_action: "Akcia pri dvojitom ťuknutí",
      lines: "Zobraziť iba linky (napr. 9, 22, A)",
      exclude_lines: "Skryť linky",
    },
  },
  de: {
    min: "Min.",
    now: "jetzt",
    at_stop: "am Steig",
    canceled: "Fällt aus",
    no_departures: "Keine anstehenden Abfahrten",
    no_matching: "Keine anstehenden Abfahrten der gewählten Linien",
    no_board: "Wähle in der Kartenkonfiguration eine Abfahrtstafel aus.",
    board_not_found: "Abfahrtstafel nicht gefunden. Prüfe die Kartenkonfiguration.",
    stale: "Nicht aktualisiert seit {time}",
    unavailable: "Daten nicht verfügbar",
    unavailable_body: "Abfahrtsdaten nicht verfügbar. Prüfe die Integration PID Departure Boards.",
    delay: "Verspätung",
    no_realtime: "Fahrplan (keine Echtzeitdaten)",
    platform: "Steig",
    wheelchair: "Barrierefreies Fahrzeug",
    air_conditioned: "Klimatisiert",
    night: "Nachtlinie",
    substitute: "Ersatzverkehr",
    route_type: {
      tram: "Straßenbahn", metro: "Metro", train: "Zug", bus: "Bus",
      ferry: "Fähre", funicular: "Standseilbahn", trolleybus: "Oberleitungsbus",
    },
    editor: {
      devices: "Abfahrtstafeln",
      title: "Titel (Standard: Haltestellenname)",
      max_departures: "Maximale Anzahl Abfahrten",
      time_format: "Abfahrtszeit",
      time_format_both: "Countdown und Uhrzeit",
      time_format_relative: "Nur Countdown",
      time_format_absolute: "Nur Uhrzeit",
      show_header: "Kopfzeile anzeigen",
      show_infotext: "Störungsmeldungen anzeigen",
      show_delay: "Verspätung anzeigen",
      show_platform: "Steig anzeigen",
      hide_departed: "Abgefahrene ausblenden",
      compact: "Kompaktes Layout",
      interactions: "Interaktionen",
      tap_action: "Tippen-Aktion",
      hold_action: "Halten-Aktion",
      double_tap_action: "Doppeltippen-Aktion",
      lines: "Nur Linien anzeigen (z. B. 9, 22, A)",
      exclude_lines: "Linien ausblenden",
    },
  },
};

function translations(hass) {
  const lang = (hass?.locale?.language || hass?.language || "en").split("-")[0];
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats a time respecting the user's HA profile (12/24 h, server/local time zone). */
function timeFormatter(hass) {
  const locale = hass?.locale || {};
  const options = { hour: "2-digit", minute: "2-digit" };
  if (locale.time_format === "12") options.hour12 = true;
  if (locale.time_format === "24") options.hour12 = false;
  if (locale.time_zone === "server" && hass?.config?.time_zone) {
    options.timeZone = hass.config.time_zone;
  }
  const language = locale.time_format === "system" ? undefined : locale.language || hass?.language;
  try {
    return new Intl.DateTimeFormat(language, options);
  } catch (_err) {
    return new Intl.DateTimeFormat(undefined, options);
  }
}

/**
 * Line names from a `lines` or `exclude_lines` option.
 * Takes a list (`[9, "A"]`) or a string (`"9, 22 A"`).
 */
function splitLines(value) {
  const items = Array.isArray(value) ? value : [value];
  return items
    .flatMap((item) => String(item ?? "").split(/[\s,;]+/))
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Line names lower-cased for matching. */
function parseLines(value) {
  return splitLines(value).map((line) => line.toLowerCase());
}

function normalizeConfig(config) {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid configuration");
  }
  const raw = config.devices ?? config.device ?? [];
  const devices = [...new Set(Array.isArray(raw) ? raw : [raw])].filter(Boolean);
  return { ...DEFAULTS, ...config, devices };
}

/**
 * Finds the entities belonging to the configured departure boards.
 *
 * Uses the entity registry display entries in `hass.entities`, which carry the
 * device and translation key, so the lookup works whatever the entity IDs are.
 */
function resolveBoards(hass, deviceIds) {
  const byDevice = new Map(deviceIds.map((id) => [id, []]));
  for (const entry of Object.values(hass.entities || {})) {
    if (entry.platform === DOMAIN && byDevice.has(entry.device_id)) {
      byDevice.get(entry.device_id).push(entry);
    }
  }

  return deviceIds.map((deviceId) => {
    const entries = byDevice.get(deviceId);
    const device = hass.devices?.[deviceId];
    const find = (domain, key) => entries.find(
      (e) => e.translation_key === key && e.entity_id.startsWith(`${domain}.`),
    )?.entity_id;

    return {
      deviceId,
      found: entries.length > 0,
      name: device?.name_by_user || device?.name || "",
      routeEntities: entries
        .filter((e) => e.translation_key === "route_name" && e.entity_id.startsWith("sensor."))
        .map((e) => e.entity_id),
      infotextEntity: find("binary_sensor", "infotext"),
      updatedEntity: find("sensor", "updated"),
    };
  });
}

/** Common leading words of the board names, e.g. "Palmovka" for "Palmovka A" and "Palmovka B". */
function commonTitle(names) {
  const unique = [...new Set(names.filter(Boolean))];
  if (unique.length <= 1) return unique[0] || "";
  const split = unique.map((n) => n.split(" "));
  const prefix = [];
  for (let i = 0; split.every((words) => i < words.length && words[i] === split[0][i]); i++) {
    prefix.push(split[0][i]);
  }
  return prefix.length ? prefix.join(" ") : unique.join(" · ");
}

/** Same as Home Assistant's hasAction: configured and not "none". */
function hasAction(actionConfig) {
  return actionConfig !== undefined && actionConfig !== null && actionConfig.action !== "none";
}

function lineClass(attrs) {
  const type = attrs.route_type;
  if (type === "metro") {
    const line = String(attrs.route_name || "").toLowerCase();
    return ["a", "b", "c"].includes(line) ? `metro-${line}` : "metro";
  }
  if (attrs.is_night) return "night";
  return ["tram", "train", "bus", "ferry", "funicular", "trolleybus"].includes(type) ? type : "bus";
}

class PidDeparturesCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._boards = [];
    this._entitiesRef = undefined;
    this._devicesRef = undefined;
    this._watched = [];
    this._infoExpanded = false;
    this._press = null;
    this._pendingTap = null;
  }

  static getConfigElement() {
    return document.createElement(EDITOR_TYPE);
  }

  static getStubConfig(hass) {
    const entry = Object.values(hass.entities || {}).find(
      (e) => e.platform === DOMAIN && e.device_id && e.translation_key === "route_name",
    );
    return { devices: entry ? [entry.device_id] : [] };
  }

  setConfig(config) {
    this._config = normalizeConfig(config);
    this._onlyLines = new Set(parseLines(this._config.lines));
    this._excludedLines = new Set(parseLines(this._config.exclude_lines));
    this._entitiesRef = undefined;
    this._render();
  }

  set hass(hass) {
    const previous = this._hass;
    this._hass = hass;
    if (!this._config) return;

    // hass.entities and hass.devices only change on registry updates.
    if (hass.entities !== this._entitiesRef || hass.devices !== this._devicesRef) {
      this._entitiesRef = hass.entities;
      this._devicesRef = hass.devices;
      this._boards = resolveBoards(hass, this._config.devices);
      this._watched = this._boards.flatMap((b) => [
        ...b.routeEntities, b.infotextEntity, b.updatedEntity,
      ]).filter(Boolean);
      this._render();
      return;
    }

    // hass is replaced on every state change in the whole system, so only
    // re-render when one of the card's own entities or the locale changed.
    if (
      !previous
      || previous.locale !== hass.locale
      || this._watched.some((id) => previous.states[id] !== hass.states[id])
    ) {
      this._render();
    }
  }

  connectedCallback() {
    this._timer = window.setInterval(() => {
      if (document.visibilityState !== "hidden") this._render();
    }, TICK_MS);
    this._onVisible = () => {
      if (document.visibilityState === "visible") this._render();
    };
    document.addEventListener("visibilitychange", this._onVisible);
    this._render();
  }

  disconnectedCallback() {
    window.clearInterval(this._timer);
    this._cancelPress();
    this._cancelPendingTap();
    document.removeEventListener("visibilitychange", this._onVisible);
  }

  getCardSize() {
    let rows = this._config?.max_departures || this._boards.reduce((n, b) => n + b.routeEntities.length, 0) || 3;
    // A line filter usually leaves far fewer rows than there are departure
    // sensors; size by what was last shown (at least one row for a message).
    const filtered = this._onlyLines?.size || this._excludedLines?.size;
    if (filtered && this._shownRows !== undefined) rows = Math.min(rows, Math.max(this._shownRows, 1));
    return (this._config?.show_header === false ? 0 : 1) + Math.ceil(rows * (this._config?.compact ? 0.8 : 1.2));
  }

  // Sections view (2024.11+).
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  // Sections view (2024.8 - 2024.10).
  getLayoutOptions() {
    return { grid_columns: 4, grid_min_columns: 2 };
  }

  /** Whether a departure passes the `lines` and `exclude_lines` options. */
  _matchesLineFilter(attrs) {
    const line = String(attrs.route_name ?? "").trim().toLowerCase();
    if (this._onlyLines.size && !this._onlyLines.has(line)) return false;
    return !this._excludedLines.has(line);
  }

  /**
   * Departures to show, sorted by time. `filteredOut` tells whether the line
   * filter hid every departure that would otherwise be shown.
   */
  _departures(now) {
    const departures = [];
    for (const board of this._boards) {
      for (const entityId of board.routeEntities) {
        const stateObj = this._hass.states[entityId];
        if (!stateObj || ["unavailable", "unknown"].includes(stateObj.state)) continue;
        const a = stateObj.attributes;
        const scheduled = parseDate(a.departure_time_sched) || parseDate(a.arrival_time_sched);
        const estimated = parseDate(a.departure_time_est) || parseDate(a.arrival_time_est) || scheduled;
        if (!estimated) continue;
        departures.push({ entityId, attrs: a, scheduled: scheduled || estimated, estimated });
      }
    }

    departures.sort((x, y) => x.estimated - y.estimated);

    const upcoming = this._config.hide_departed
      ? departures.filter((d) => d.attrs.is_at_stop || d.estimated - now > -DEPARTED_GRACE_MS)
      : departures;
    const visible = upcoming.filter((d) => this._matchesLineFilter(d.attrs));
    return {
      list: this._config.max_departures ? visible.slice(0, this._config.max_departures) : visible,
      filteredOut: upcoming.length > 0 && visible.length === 0,
    };
  }

  _render() {
    if (!this._config || !this._hass || !this.isConnected) return;
    const t = translations(this._hass);
    const fmt = timeFormatter(this._hass);
    const now = Date.now();
    const config = this._config;

    const columns = this._columns();
    // Either the departure rows or a message instead of them.
    let rows = [];
    let message = "";
    if (!config.devices.length) {
      message = `<div class="message">${escapeHtml(t.no_board)}</div>`;
    } else if (!this._boards.some((b) => b.found)) {
      message = `<div class="message warning">${escapeHtml(t.board_not_found)}</div>`;
    } else {
      const departures = this._departures(now);
      if (departures.list.length) {
        rows = departures.list.map((d) => this._rowModel(d, now, t, fmt, columns));
      } else if (departures.filteredOut) {
        message = `<div class="message">${escapeHtml(t.no_matching)}</div>`;
      } else if (this._boards.filter((b) => b.found).every((b) => this._isDown(b))) {
        message = `<div class="message warning">${escapeHtml(t.unavailable_body)}</div>`;
      } else {
        message = `<div class="message">${escapeHtml(t.no_departures)}</div>`;
      }
    }

    if (!this._card) {
      const style = document.createElement("style");
      style.textContent = STYLES;
      this._card = document.createElement("ha-card");
      this._card.innerHTML = `<div class="content"><div class="departures"></div></div>`;
      this._content = this._card.querySelector(".content");
      this._departuresEl = this._card.querySelector(".departures");
      this._topNodes = [];
      this._topHtml = null;
      this._messageHtml = null;
      this._rowEls = new Map();
      this.shadowRoot.append(style, this._card);
      this._listen(this._card);
    }

    this._shownRows = rows.length;
    this._card.classList.toggle("compact", config.compact);
    // Holding or double clicking a row must not select its text.
    this._card.classList.toggle("no-select", hasAction(config.hold_action) || hasAction(config.double_tap_action));

    // Rows that stay are updated in place and keep focus. A row that is
    // rebuilt or moved, and the service alert when it changes, lose it:
    // put it back on the same departure or on the alert.
    const active = this.shadowRoot.activeElement;
    const focused = active?.dataset?.entity;
    const infotextFocused = !!active?.classList?.contains("infotext");

    // Every row is a subgrid of this grid, so a column has the same width in all
    // rows: a delay badge or a long label never shifts the neighbouring rows.
    const departuresClass = columns.includes("count")
      ? (columns.includes("time") ? "stackable" : "")
      : "no-count";
    const template = columns
      .map((c) => `[${c}] ${c === "main" ? "minmax(0, 1fr)" : "max-content"}`)
      .join(" ");
    this._updateTop(`
      ${config.show_header ? this._renderHeader(now, t, fmt) : ""}
      ${config.show_infotext ? this._renderInfotext() : ""}`);
    const list = this._departuresEl;
    const listClass = `departures ${departuresClass}`;
    if (list.className !== listClass) list.className = listClass;
    const listColumns = `${template} [end]`;
    // Compared with what was set: the browser reads the style back normalised.
    if (this._listColumns !== listColumns) {
      this._listColumns = listColumns;
      list.style.gridTemplateColumns = listColumns;
    }
    if (message) this._showMessage(message);
    else this._updateRows(rows);

    if (focused && this.shadowRoot.activeElement !== active) {
      this._card.querySelector(`[data-entity="${CSS.escape(focused)}"][tabindex]`)?.focus();
    } else if (infotextFocused && this.shadowRoot.activeElement !== active) {
      this._card.querySelector(".infotext")?.focus();
    }
  }

  /** Header and service alert, replaced only when their content changes. */
  _updateTop(html) {
    if (html === this._topHtml) return;
    this._topHtml = html;
    this._topNodes.forEach((node) => node.remove());
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    this._topNodes = [...template.content.children];
    this._content.before(...this._topNodes);
  }

  _showMessage(html) {
    this._rowEls.clear();
    if (html === this._messageHtml) return;
    this._messageHtml = html;
    this._departuresEl.innerHTML = html;
  }

  /**
   * Updates the departure rows in place instead of rebuilding them, keyed by
   * the departure sensor: a row keeps its element, focus and press ripple,
   * and only the cells whose content changed are touched.
   */
  _updateRows(rows) {
    const list = this._departuresEl;
    if (this._messageHtml !== null) {
      this._messageHtml = null;
      list.textContent = "";
    }

    const keep = new Set(rows.map((r) => r.key));
    for (const [key, el] of this._rowEls) {
      if (!keep.has(key)) {
        el.remove();
        this._rowEls.delete(key);
      }
    }

    rows.forEach((model, index) => {
      let el = this._rowEls.get(model.key);
      if (!el || el._shape !== model.shape) {
        const created = this._createRow(model);
        if (el) el.replaceWith(created);
        el = created;
        this._rowEls.set(model.key, el);
      }
      this._fillRow(el, model);
      // Moving the element would drop its focus and ripple, only move when needed.
      const at = list.children[index];
      if (at !== el) list.insertBefore(el, at || null);
    });
  }

  _createRow(model) {
    const el = document.createElement("div");
    el._shape = model.shape;
    el._cells = {};
    el._cellHtml = {};
    el.dataset.entity = model.key;
    for (const column of model.columns) {
      const cell = document.createElement("div");
      cell.className = `cell ${column}-cell`;
      el._cells[column] = cell;
      el.append(cell);
    }
    // Home Assistant's press and hover effect, when the frontend has it.
    if (model.ripple) el.append(document.createElement("ha-ripple"));
    return el;
  }

  _fillRow(el, model) {
    if (el.className !== model.className) el.className = model.className;
    for (const [name, value] of Object.entries(model.attributes)) {
      if (value === null) {
        if (el.hasAttribute(name)) el.removeAttribute(name);
      } else if (el.getAttribute(name) !== value) {
        el.setAttribute(name, value);
      }
    }
    for (const column of model.columns) {
      const html = model.cells[column];
      if (el._cellHtml[column] !== html) {
        el._cellHtml[column] = html;
        el._cells[column].innerHTML = html;
      }
    }
  }

  /** Whether tapping, holding or double tapping a row does anything. */
  _rowsInteractive() {
    const c = this._config;
    return this._tapRuns() || hasAction(c.hold_action) || hasAction(c.double_tap_action);
  }

  /** Whether a tap runs an action. An unset tap action means more-info, like on HA's own cards. */
  _tapRuns() {
    const tap = this._config.tap_action;
    return tap === undefined || hasAction(tap);
  }

  /**
   * Pointer and keyboard handling for the rows and the service alert.
   *
   * The listeners sit on ha-card, which is never replaced, because the rows
   * are rebuilt on every render: a press may start on one row element and end
   * on its replacement. Presses are tracked by entity ID for the same reason.
   */
  _listen(card) {
    card.addEventListener("pointerdown", (ev) => {
      const row = this._rowFor(ev);
      this._cancelPress();
      if (!row || (ev.pointerType === "mouse" && ev.button !== 0)) return;
      // Touch pointers are captured by the row they went down on. The row is
      // replaced on every render, and a pointerup sent to a removed row would
      // never reach the card, leaving the hold timer running. Without the
      // capture the pointerup goes to whatever row is under the finger.
      if (ev.target.hasPointerCapture?.(ev.pointerId)) ev.target.releasePointerCapture(ev.pointerId);
      const press = {
        entity: row.dataset.entity,
        pointerId: ev.pointerId,
        pointerType: ev.pointerType,
        x: ev.clientX,
        y: ev.clientY,
        held: false,
        timer: null,
      };
      if (hasAction(this._config.hold_action)) {
        press.timer = window.setTimeout(() => {
          press.held = true;
          // A tap still waiting for a possible double tap happened first.
          this._flushPendingTap();
          this._fireAction(press.entity, "hold");
        }, HOLD_MS);
      }
      this._press = press;
      // On the window: the finger may leave the card while pressing.
      window.addEventListener("pointermove", this._onPointerMove, true);
      window.addEventListener("pointerup", this._onPointerUp, true);
      window.addEventListener("pointercancel", this._onPointerCancel, true);
    });
    // Only the pointer that started the press counts, not a second finger.
    const ownPointer = (ev) => this._press && ev.pointerId === this._press.pointerId;
    this._onPointerMove = (ev) => {
      const press = this._press;
      if (ownPointer(ev) && !press.held
        && Math.hypot(ev.clientX - press.x, ev.clientY - press.y) > HOLD_MOVE_PX) {
        window.clearTimeout(press.timer);
      }
    };
    this._onPointerUp = (ev) => {
      if (!ownPointer(ev)) return;
      window.clearTimeout(this._press.timer);
      this._press.releasedAt ??= performance.now();
      this._stopWatchingPress();
    };
    this._onPointerCancel = (ev) => {
      if (ownPointer(ev)) this._cancelPress();
    };
    card.addEventListener("pointerup", this._onPointerUp);
    card.addEventListener("pointercancel", this._onPointerCancel);
    // A long press on a touch screen would open the context menu instead.
    // A right click with the mouse keeps it.
    card.addEventListener("contextmenu", (ev) => {
      if (this._press && this._press.pointerType !== "mouse" && hasAction(this._config.hold_action)) {
        ev.preventDefault();
      }
    });

    card.addEventListener("click", (ev) => {
      // The click sent from keydown only shows the ripple, keydown ran the action.
      if (this._rippleClick) return;
      if (ev.target.closest(".infotext")) {
        this._toggleInfotext();
        return;
      }
      const row = this._rowFor(ev);
      if (!row) return;
      const press = this._press;
      this._press = null;
      this._stopWatchingPress();
      // The hold already ran its action. Only for the click that ends this
      // press: a press released outside the card leaves no click, and a later
      // click without a pointer press (e.g. from a screen reader) is a tap.
      if (press?.held && press.releasedAt !== undefined
        && performance.now() - press.releasedAt < CLICK_AFTER_RELEASE_MS) return;
      this._tap(row.dataset.entity);
    });

    card.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      // Leave shortcuts with modifiers to the browser and Home Assistant.
      if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
      // The keyboard has no hold or double tap, like on Home Assistant's own
      // cards: rows only take the key when a tap does something.
      const row = this._tapRuns() ? this._rowFor(ev) : null;
      const target = ev.target.closest(".infotext") || row;
      if (!target) return;
      ev.preventDefault();
      // A held key repeats keydown, act only once.
      if (ev.repeat) return;
      if (target.classList.contains("infotext")) {
        this._toggleInfotext();
        return;
      }
      this._fireAction(row.dataset.entity, "tap");
      // HA's ripple shows a press for a click without a pointer, as on its own cards.
      if (row.querySelector(":scope > ha-ripple")) {
        this._rippleClick = true;
        try {
          row.click();
        } finally {
          this._rippleClick = false;
        }
      }
    });
  }

  _rowFor(ev) {
    if (!this._rowsInteractive()) return null;
    return ev.target.closest?.(".row[data-entity]") || null;
  }

  _tap(entityId) {
    if (!hasAction(this._config.double_tap_action)) {
      this._fireAction(entityId, "tap");
      return;
    }
    // Wait whether a second tap follows, only when a double tap does something.
    const pending = this._pendingTap;
    if (pending && pending.entity === entityId) {
      this._cancelPendingTap();
      this._fireAction(entityId, "double_tap");
      return;
    }
    this._flushPendingTap();
    this._pendingTap = {
      entity: entityId,
      timer: window.setTimeout(() => {
        this._pendingTap = null;
        this._fireAction(entityId, "tap");
      }, DOUBLE_TAP_MS),
    };
  }

  _cancelPress() {
    window.clearTimeout(this._press?.timer);
    this._press = null;
    this._stopWatchingPress();
  }

  _stopWatchingPress() {
    if (!this._onPointerUp) return;
    window.removeEventListener("pointermove", this._onPointerMove, true);
    window.removeEventListener("pointerup", this._onPointerUp, true);
    window.removeEventListener("pointercancel", this._onPointerCancel, true);
  }

  /** Runs a tap that is waiting for a possible double tap right away. */
  _flushPendingTap() {
    const pending = this._pendingTap;
    if (!pending) return;
    this._cancelPendingTap();
    this._fireAction(pending.entity, "tap");
  }

  _cancelPendingTap() {
    window.clearTimeout(this._pendingTap?.timer);
    this._pendingTap = null;
  }

  _toggleInfotext() {
    this._infoExpanded = !this._infoExpanded;
    this._render();
  }

  /**
   * Lets Home Assistant run the configured action, as for its own cards:
   * more-info by default, confirmation, navigate, perform-action and so on.
   */
  _fireAction(entityId, action) {
    const c = this._config;
    if (action === "tap" && c.tap_action !== undefined && !hasAction(c.tap_action)) return;
    this.dispatchEvent(new CustomEvent("hass-action", {
      bubbles: true,
      composed: true,
      detail: {
        config: {
          entity: entityId,
          tap_action: c.tap_action,
          hold_action: c.hold_action,
          double_tap_action: c.double_tap_action,
        },
        action,
      },
    }));
  }

  /**
   * Whether the integration currently has no data for the board.
   *
   * All entities of a board turn unavailable when a poll fails or the board
   * is not loaded. The departure sensors alone cannot tell that apart from
   * an empty timetable (they are unavailable then too), the "updated" sensor
   * can: it only becomes unavailable together with the whole board.
   */
  _isDown(board) {
    const entityId = board.updatedEntity || board.infotextEntity;
    const state = entityId && this._hass.states[entityId]?.state;
    return state === "unavailable";
  }

  /** Grid columns of the departure list, in display order. */
  _columns() {
    const config = this._config;
    const columns = ["line", "main"];
    if (config.show_platform ?? this._boards.length > 1) columns.push("platform");
    if (config.time_format !== "relative") columns.push("time");
    if (config.show_delay) columns.push("delay");
    if (config.time_format !== "absolute") columns.push("count");
    return columns;
  }

  _renderHeader(now, t, fmt) {
    const title = this._config.title || commonTitle(this._boards.map((b) => b.name));

    let status = "";
    const updated = this._boards
      .map((b) => b.updatedEntity && parseDate(this._hass.states[b.updatedEntity]?.state))
      .filter(Boolean)
      .sort((x, y) => x - y)[0];
    if (this._boards.some((b) => b.found && this._isDown(b))) {
      status = `
        <div class="stale" title="${escapeHtml(t.unavailable_body)}">
          <ha-icon icon="mdi:cloud-alert"></ha-icon>
          <span>${escapeHtml(t.unavailable)}</span>
        </div>`;
    } else if (updated && now - updated > STALE_AFTER_MS) {
      status = `
        <div class="stale" title="${escapeHtml(t.stale.replace("{time}", fmt.format(updated)))}">
          <ha-icon icon="mdi:cloud-alert"></ha-icon>
          <span>${escapeHtml(fmt.format(updated))}</span>
        </div>`;
    }

    if (!title && !status) return "";
    return `
      <div class="card-header">
        <div class="name">${escapeHtml(title)}</div>
        ${status}
      </div>`;
  }

  _renderInfotext() {
    const language = (this._hass.locale?.language || this._hass.language || "en").split("-")[0];
    const texts = new Set();
    for (const board of this._boards) {
      const stateObj = board.infotextEntity && this._hass.states[board.infotextEntity];
      if (stateObj?.state !== "on") continue;
      const a = stateObj.attributes;
      const text = language !== "cs" && language !== "sk" && a.text_en ? a.text_en : a.text;
      if (text) texts.add(text);
    }
    if (!texts.size) return "";
    return `
      <div class="infotext ${this._infoExpanded ? "expanded" : ""}" role="button" tabindex="0">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        <div class="infotext-text">${[...texts].map(escapeHtml).join("<br>")}</div>
      </div>`;
  }

  /** What a departure row shows, applied to its element by _updateRows. */
  _rowModel(d, now, t, fmt, columns) {
    const a = d.attrs;
    const diffMs = d.estimated - now;
    const minutes = Math.floor(diffMs / 60000);
    const realtime = a.is_delay_avail === true;
    const delayMin = realtime ? Math.floor((a.delay_sec ?? 0) / 60) : 0;
    const time = fmt.format(d.scheduled);
    const typeLabel = t.route_type[a.route_type] || "";

    // Countdown, rounded down so the user is never told they have more time than they do.
    let countdown;
    if (a.is_canceled) countdown = t.canceled;
    else if (a.is_at_stop) countdown = t.at_stop;
    else if (diffMs <= 0) countdown = t.now;
    else if (minutes < 1) countdown = `<1 ${t.min}`;
    else if (minutes < 60) countdown = `${minutes} ${t.min}`;
    // A countdown in hours is harder to read than the time itself; the time
    // column already shows it, otherwise show when it actually leaves.
    else countdown = columns.includes("time") ? "" : fmt.format(d.estimated);

    // Scheduled time plus delay, the convention used on PID departure boards.
    let delay = "";
    if (a.is_canceled) {
      delay = "";
    } else if (!realtime) {
      delay = `<ha-icon icon="mdi:calendar-clock" title="${escapeHtml(t.no_realtime)}"></ha-icon>`;
    } else if (delayMin !== 0) {
      const severity = delayMin >= 5 ? "severe" : delayMin > 0 ? "late" : "early";
      delay = `<span class="badge ${severity}" title="${escapeHtml(t.delay)}">${delayMin > 0 ? "+" : "−"}${Math.abs(delayMin)}</span>`;
    }

    const features = [
      a.route_type === "train" && a.train_number ? `<span>${escapeHtml(a.train_number)}</span>` : "",
      a.is_wheelchair_accessible ? `<ha-icon icon="mdi:wheelchair-accessibility" title="${escapeHtml(t.wheelchair)}"></ha-icon>` : "",
      a.is_air_conditioned ? `<ha-icon icon="mdi:snowflake" title="${escapeHtml(t.air_conditioned)}"></ha-icon>` : "",
      a.is_night ? `<ha-icon icon="mdi:weather-night" title="${escapeHtml(t.night)}"></ha-icon>` : "",
      a.is_substitute ? `<ha-icon icon="mdi:swap-horizontal-bold" title="${escapeHtml(t.substitute)}"></ha-icon>` : "",
    ].filter(Boolean).join("");

    const cells = {
      line: `<span class="line line--${lineClass(a)}" title="${escapeHtml(typeLabel)}">${escapeHtml(a.route_name || "?")}</span>`,
      main: `
        <div class="headsign">${escapeHtml(a.trip_headsign)}</div>
        ${features ? `<div class="features">${features}</div>` : ""}`,
      platform: a.stop_platform
        ? `<span class="platform" title="${escapeHtml(t.platform)}">${escapeHtml(a.stop_platform)}</span>` : "",
      time: escapeHtml(time),
      delay,
      count: escapeHtml(countdown),
    };

    const soon = !a.is_canceled && (a.is_at_stop || diffMs < 2 * 60000);
    const label = [typeLabel, a.route_name, a.trip_headsign, a.stop_platform && `${t.platform} ${a.stop_platform}`,
      time, countdown].filter(Boolean).join(", ");
    const interactive = this._rowsInteractive();
    // Only focusable when the keyboard can do something: it can only tap.
    const focusable = interactive && this._tapRuns();
    const ripple = interactive && !!customElements.get("ha-ripple");

    return {
      key: d.entityId,
      columns,
      // A row is rebuilt when its structure changes, otherwise updated in place.
      shape: `${columns.join(",")}|${interactive}|${ripple}`,
      ripple,
      className: ["row", interactive && "interactive", ripple && "has-ripple",
        a.is_canceled && "canceled", soon && "soon"].filter(Boolean).join(" "),
      attributes: {
        role: focusable ? "button" : "group",
        tabindex: focusable ? "0" : null,
        "aria-label": label,
      },
      cells,
    };
  }

}

const STYLES = `
  ha-card { overflow: hidden; }
  /*
   * Home Assistant design tokens are used with the values of older versions
   * as fallbacks: fonts since 2025.5, radii since 2025.8, spacing since 2025.10.
   */

  /* Same typography and theme variables as the header of HA's own cards
     (ha-card .card-header), with a smaller gap below so the list stays close. */
  .card-header {
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    margin: 0;
    padding: var(--ha-space-4, 16px) var(--ha-space-4, 16px) var(--ha-space-2, 8px);
    color: var(--ha-card-header-color, var(--primary-text-color));
    font-family: var(--ha-card-header-font-family, inherit);
    font-size: var(--ha-card-header-font-size, var(--ha-font-size-2xl, 24px));
    font-weight: var(--ha-font-weight-normal, 400);
    letter-spacing: -0.012em;
    line-height: var(--ha-line-height-condensed, 1.2);
  }
  .card-header .name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .stale {
    display: flex;
    align-items: center;
    gap: var(--ha-space-1, 4px);
    color: var(--warning-color);
    font-family: var(--ha-font-family-body, inherit);
    font-size: var(--ha-font-size-s, 12px);
    letter-spacing: normal;
    --mdc-icon-size: 18px;
  }
  .infotext {
    display: flex;
    gap: var(--ha-space-2, 8px);
    margin: 0 var(--ha-space-4, 16px) var(--ha-space-2, 8px);
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-md, 8px);
    color: var(--primary-text-color);
    background: rgba(var(--rgb-warning-color, 255, 166, 0), 0.15);
    font-size: var(--ha-font-size-s, 12px);
    line-height: 1.4;
    cursor: pointer;
    --mdc-icon-size: 20px;
  }
  .infotext ha-icon { color: var(--warning-color); flex: none; }
  .infotext-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .infotext.expanded .infotext-text { display: block; }
  .content {
    /* Lets the rows adapt to the width of the card, not of the window. */
    container-type: inline-size;
    padding: 0 var(--ha-space-2, 8px) var(--ha-space-2, 8px);
  }
  ha-card > .content:first-child { padding-top: var(--ha-space-2, 8px); }
  .departures {
    display: grid;
    column-gap: 10px;
    font-variant-numeric: tabular-nums;
  }
  .row {
    grid-column: 1 / -1;
    display: grid;
    /* Fallback for browsers without subgrid: same layout, columns sized per row. */
    grid-template-columns: inherit;
    grid-template-columns: subgrid;
    column-gap: inherit;
    align-items: center;
    min-height: 52px;
    padding: 6px var(--ha-space-2, 8px);
    box-sizing: border-box;
    border-radius: var(--ha-border-radius-md, 8px);
    outline: none;
    /* For the press ripple, which covers the row. */
    position: relative;
  }
  .row.interactive {
    cursor: pointer;
    /* No double-tap zoom, a double tap may be an action. Scrolling and pinch zoom stay. */
    touch-action: manipulation;
    transition: background-color 180ms ease-in-out;
  }
  /* Without HA's ripple, a plain background on hover; the ripple has its own. */
  .row.interactive:not(.has-ripple):hover, .row.interactive:focus-visible {
    background: var(--secondary-background-color);
  }
  /* A long press must not select text or open the callout on touch screens. */
  .no-select .row.interactive { user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
  .infotext:focus-visible { outline: 2px solid var(--warning-color); outline-offset: -2px; }
  @media (prefers-reduced-motion: reduce) {
    .row.interactive { transition: none; }
  }
  /* High contrast mode ignores background colours, the focus needs an outline. */
  @media (forced-colors: active) {
    .row.interactive:focus-visible { outline: 2px solid CanvasText; outline-offset: -2px; }
  }
  .row + .row { border-top: 1px solid var(--divider-color); }
  .cell { min-width: 0; }
  .line-cell { grid-column: line; display: flex; }
  .main-cell { grid-column: main; }
  .platform-cell { grid-column: platform; text-align: center; }
  .time-cell { grid-column: time; text-align: end; }
  .delay-cell { grid-column: delay; display: flex; justify-content: center; }
  .count-cell { grid-column: count; text-align: end; }

  /* Reserved widths, so a column does not jump when its widest value changes
     between updates (e.g. the first delay appears or "9 min" becomes "12 min"). */
  .platform-cell { min-width: 2em; }
  .delay-cell { min-width: 2.25em; }
  .count-cell { min-width: 3.75em; }

  .line {
    flex: 1;
    box-sizing: border-box;
    min-width: 2.75em;
    max-width: 5em;
    padding: var(--ha-space-1, 4px) 6px;
    border-radius: var(--ha-border-radius-sm, 4px);
    text-align: center;
    font-weight: var(--ha-font-weight-bold, 700);
    font-size: var(--ha-font-size-m, 14px);
    line-height: 1.2;
    color: var(--pid-line-fg, var(--pid-line-text-color, #fff));
    background: var(--pid-line-bg);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* Approximation of the PID line colours, a theme can override them. */
  .line--tram {
    --pid-line-bg: var(--pid-color-tram, #7a0603);
    --pid-line-fg: var(--pid-color-tram-text, var(--pid-line-text-color, #fff));
  }
  .line--bus {
    --pid-line-bg: var(--pid-color-bus, #007da8);
    --pid-line-fg: var(--pid-color-bus-text, var(--pid-line-text-color, #fff));
  }
  .line--trolleybus {
    --pid-line-bg: var(--pid-color-trolleybus, #80166f);
    --pid-line-fg: var(--pid-color-trolleybus-text, var(--pid-line-text-color, #fff));
  }
  .line--train {
    --pid-line-bg: var(--pid-color-train, #283583);
    --pid-line-fg: var(--pid-color-train-text, var(--pid-line-text-color, #fff));
  }
  .line--ferry {
    --pid-line-bg: var(--pid-color-ferry, #00a3c7);
    --pid-line-fg: var(--pid-color-ferry-text, var(--pid-line-text-color, #fff));
  }
  .line--funicular {
    --pid-line-bg: var(--pid-color-funicular, #8b6d4c);
    --pid-line-fg: var(--pid-color-funicular-text, var(--pid-line-text-color, #fff));
  }
  .line--metro {
    --pid-line-bg: var(--pid-color-metro, #555555);
    --pid-line-fg: var(--pid-color-metro-text, var(--pid-line-text-color, #fff));
  }
  .line--metro-a {
    --pid-line-bg: var(--pid-color-metro-a, #00a562);
    --pid-line-fg: var(--pid-color-metro-a-text, var(--pid-line-text-color, #fff));
  }
  .line--metro-b {
    --pid-line-bg: var(--pid-color-metro-b, #f8b322);
    --pid-line-fg: var(--pid-color-metro-b-text, #1d1d1b);
  }
  .line--metro-c {
    --pid-line-bg: var(--pid-color-metro-c, #cf003d);
    --pid-line-fg: var(--pid-color-metro-c-text, var(--pid-line-text-color, #fff));
  }
  .line--night {
    --pid-line-bg: var(--pid-color-night, #1d1d1b);
    --pid-line-fg: var(--pid-color-night-text, var(--pid-line-text-color, #fff));
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
  }
  .headsign {
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .features {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-s, 12px);
    white-space: nowrap;
    overflow: hidden;
    --mdc-icon-size: 16px;
  }
  .platform {
    display: inline-block;
    min-width: 1.2em;
    padding: 0 var(--ha-space-1, 4px);
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-border-radius-sm, 4px);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--secondary-text-color);
  }
  .time-cell {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .count-cell {
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-bold, 700);
    color: var(--primary-text-color);
    white-space: nowrap;
  }
  /* Without a countdown the time is the main information. */
  .no-count .time-cell {
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-bold, 700);
    color: var(--primary-text-color);
  }
  .soon .count-cell { color: var(--primary-color); }
  .delay-cell { color: var(--secondary-text-color); --mdc-icon-size: 16px; }
  .badge {
    box-sizing: border-box;
    min-width: 2em;
    padding: 1px var(--ha-space-1, 4px);
    border-radius: var(--ha-border-radius-sm, 4px);
    text-align: center;
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-bold, 700);
    line-height: 1.3;
  }
  /* Dark text: white on the default info blue is only about 3:1. */
  .badge.early { background: var(--info-color, #039be5); color: var(--pid-delay-early-text-color, #1d1d1b); }
  .badge.late { background: var(--warning-color, #ffa600); color: #1d1d1b; }
  .badge.severe { background: var(--error-color, #db4437); color: #fff; }
  .canceled .headsign, .canceled .time-cell { text-decoration: line-through; }
  .canceled .line-cell, .canceled .main-cell, .canceled .platform-cell { opacity: 0.5; }
  .canceled .count-cell { color: var(--error-color); }
  .message {
    grid-column: 1 / -1;
    padding: var(--ha-space-4, 16px) var(--ha-space-2, 8px);
    color: var(--secondary-text-color);
    text-align: center;
  }
  .message.warning { color: var(--warning-color); }

  @supports not (grid-template-columns: subgrid) {
    /* Without subgrid each row sizes its own columns, fix the widest ones instead. */
    .line-cell { width: 3.25em; }
    .time-cell { min-width: 3.25em; }
  }

  /* Medium cards: the time and delay move under the countdown, in their columns. */
  @container (max-width: 419px) {
    .stackable .row { grid-template-rows: auto auto; row-gap: 2px; }
    .stackable .line-cell, .stackable .main-cell, .stackable .platform-cell { grid-row: 1 / span 2; }
    .stackable .count-cell { grid-row: 1; grid-column: time / end; }
    .stackable .time-cell, .stackable .delay-cell { grid-row: 2; }
    .stackable .time-cell { font-size: var(--ha-font-size-s, 12px); }
  }

  /* Narrow cards: the destination gets the whole first line, the values the second. */
  @container (max-width: 339px) {
    .departures { column-gap: 8px; }
    .departures .row { grid-template-rows: auto auto; row-gap: 2px; }
    .departures .line-cell { grid-row: 1 / span 2; }
    .departures .main-cell { grid-row: 1; grid-column: main / end; }
    .departures .features { display: none; }
    .departures .platform-cell, .departures .time-cell,
    .departures .delay-cell, .departures .count-cell { grid-row: 2; }
    .departures .count-cell { grid-column: count; }
  }

  /* Compact: one line per departure, for wall panels and small tiles. */
  .compact .row { min-height: 36px; padding: 2px var(--ha-space-2, 8px); grid-template-rows: auto; row-gap: 0; }
  .compact .features { display: none; }
  .compact .line { min-width: 2.5em; padding: 2px var(--ha-space-1, 4px); }
  .compact .cell { grid-row: 1; }
  .compact .main-cell { grid-column: main; }
  .compact .time-cell { grid-column: time; }
  .compact .count-cell { grid-column: count; }
  .compact .card-header {
    padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px) var(--ha-space-1, 4px);
    font-size: var(--ha-font-size-xl, 20px);
  }
  @container (max-width: 339px) {
    /* One line has no room for both, the countdown matters more. */
    .compact .stackable .time-cell { display: none; }
  }
`;

class PidDeparturesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = normalizeConfig(config);
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
    else this._render();
  }

  async _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      await loadHaForm();
      if (this._form) return;
      this._form = document.createElement("ha-form");
      this._form.addEventListener("value-changed", (ev) => this._valueChanged(ev.detail.value));
      this.appendChild(this._form);
    }
    const t = translations(this._hass).editor;
    this._form.hass = this._hass;
    this._form.schema = editorSchema(t);
    this._form.computeLabel = (schema) => t[schema.name] || schema.name;
    this._form.data = {
      ...this._config,
      show_platform: this._config.show_platform ?? this._config.devices.length > 1,
      // Edited as text, "9, 22, A", saved as a list.
      lines: this._linesText("lines"),
      exclude_lines: this._linesText("exclude_lines"),
    };
  }

  /**
   * Text of a lines field. Keeps the text as typed while it means the same
   * lines as the config, so separators and spaces do not vanish while typing.
   */
  _linesText(key) {
    const typed = this._typedLines?.[key];
    const configured = splitLines(this._config[key]);
    if (typed !== undefined && sameLines(splitLines(typed), configured)) return typed;
    return configured.join(", ");
  }

  _valueChanged(value) {
    // Keep the YAML short: drop options that are left at their defaults.
    const config = { ...value, type: `custom:${CARD_TYPE}` };
    delete config.device;
    for (const [key, defaultValue] of Object.entries(DEFAULTS)) {
      if (config[key] === defaultValue) delete config[key];
    }
    if (config.show_platform === (config.devices || []).length > 1) delete config.show_platform;
    if (!config.title) delete config.title;
    if (!config.max_departures) delete config.max_departures;
    for (const key of ["tap_action", "hold_action", "double_tap_action"]) {
      if (!config[key]) delete config[key];
    }
    this._typedLines = {};
    for (const key of ["lines", "exclude_lines"]) {
      this._typedLines[key] = value[key] ?? "";
      const lines = splitLines(config[key]).map((line) => (/^[1-9]\d*$/.test(line) ? Number(line) : line));
      if (lines.length) config[key] = lines;
      else delete config[key];
    }
    this._config = normalizeConfig(config);
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config }, bubbles: true, composed: true,
    }));
  }
}

function sameLines(a, b) {
  return a.length === b.length && a.every((line, i) => line === b[i]);
}

function editorSchema(t) {
  return [
    {
      name: "devices",
      required: true,
      selector: { device: { multiple: true, filter: { integration: DOMAIN } } },
    },
    { name: "title", selector: { text: {} } },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "lines", selector: { text: {} } },
        { name: "exclude_lines", selector: { text: {} } },
      ],
    },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "max_departures", selector: { number: { min: 1, max: 50, mode: "box" } } },
        {
          name: "time_format",
          selector: {
            select: {
              mode: "dropdown",
              options: ["both", "relative", "absolute"].map((value) => ({
                value, label: t[`time_format_${value}`],
              })),
            },
          },
        },
      ],
    },
    {
      type: "grid",
      name: "",
      schema: [
        "show_header", "show_infotext", "show_delay", "show_platform", "hide_departed", "compact",
      ].map((name) => ({ name, selector: { boolean: {} } })),
    },
    {
      type: "expandable",
      name: "",
      flatten: true,
      title: t.interactions,
      icon: "mdi:gesture-tap",
      schema: [
        { name: "tap_action", selector: { ui_action: { default_action: "more-info" } } },
        { name: "hold_action", selector: { ui_action: { default_action: "none" } } },
        { name: "double_tap_action", selector: { ui_action: { default_action: "none" } } },
      ],
    },
  ];
}

/** ha-form is lazy loaded by the frontend; loading a built-in card editor pulls it in. */
async function loadHaForm() {
  if (customElements.get("ha-form")) return;
  try {
    const helpers = await window.loadCardHelpers();
    const card = await helpers.createCardElement({ type: "entities", entities: [] });
    await card.constructor.getConfigElement();
  } catch (_err) {
    // Fall through and wait, the editor dialog loads ha-form itself too.
  }
  await customElements.whenDefined("ha-form");
}

if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, PidDeparturesCard);
  customElements.define(EDITOR_TYPE, PidDeparturesCardEditor);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD_TYPE,
    name: "PID Departures",
    description: "Departure board for Prague Integrated Transport stops.",
    preview: true,
    documentationURL: "https://github.com/dvejsada/PID_integration_cards",
  });
  console.info(`%c PID-DEPARTURES-CARD %c ${CARD_VERSION} `,
    "color: #fff; background: #007da8; font-weight: 700;", "color: #007da8; background: #fff;");
}
