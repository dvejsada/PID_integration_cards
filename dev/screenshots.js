/**
 * Regenerates the README screenshots in assets/ from dev/demo.html.
 *
 *   node dev/screenshots.js            # writes assets/preview.png and assets/layouts.png
 *   node dev/screenshots.js some/dir   # writes them to another folder
 *
 * Needs Playwright with Chromium (npm install playwright && npx playwright install chromium).
 * See docs/development.md.
 */
const { chromium } = require('playwright');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.resolve(process.argv[2] || path.join(ROOT, 'assets'));
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1420, height: 900 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.join(ROOT, 'dev', 'demo.html'));

  // --- layouts.png: the demo scenarios, without the toolbar and the newer message-only ones.
  await p.evaluate(() => {
    document.querySelector('.toolbar').remove();
    const keep = ['Wide card (480 px)', 'Two platforms merged', 'Compact, stale data', 'Time only',
      'Countdown only', 'Medium card (400 px)', 'Narrow card (300 px)', 'No board selected'];
    for (const d of document.querySelectorAll('.demo')) if (!keep.includes(d.querySelector('h4').textContent)) d.remove();
    document.body.style.background = '#fff';
  });
  await p.waitForTimeout(300);
  const grid = await p.locator('#grid').boundingBox();
  await p.screenshot({ path: `${ASSETS}/layouts.png`, fullPage: true, clip: { x: 0, y: 0, width: grid.x + grid.width + 16, height: grid.y + grid.height + 16 } });

  // --- preview.png: light, dark Czech with an alert, dark compact with stale data.
  await p.evaluate(() => {
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;padding:6px;background:#fff;display:flex;gap:16px;align-items:flex-start';
    const css = document.createElement('style');
    css.textContent = `
      .panel { padding: 22px; border-radius: 16px; }
      .light { background: #f3f3f3; }
      .dark { background: #111;
        --primary-text-color: #e1e1e1; --secondary-text-color: #9b9b9b; --divider-color: rgba(225,225,225,.12);
        --card-background-color: #1c1c1c; --secondary-background-color: #282828; }`;
    document.head.append(css);
    const card = (cls, width, config, boards, opts) => {
      const panel = document.createElement('div'); panel.className = `panel ${cls}`;
      const c = document.createElement('pid-departures-card'); c.style.display = 'block'; c.style.width = width + 'px';
      c.setConfig({ type: 'custom:pid-departures-card', ...config });
      panel.append(c); document.body.append(panel); c.hass = mockHass(boards, opts);
    };
    card('light', 400, { devices: ['plananska_a'] }, [{ id: 'plananska_a', name: 'Plaňanská A', departures: [
      { line: '188', to: 'Kavčí hory', in: 0.4, atStop: true, wheelchair: true, ac: true },
      { line: '199', to: 'Sídliště Malešice', in: 3, delay: 120, wheelchair: true },
      { line: '133', to: 'Sídliště Malešice', in: 8, wheelchair: true, ac: true },
      { line: '188', to: 'Kavčí hory', in: 12, realtime: false },
      { line: 'X9', to: 'Náměstí Míru', in: 20, substitute: true, canceled: true },
      { line: '22', type: 'tram', to: 'Bílá Hora', in: 16, delay: -60, wheelchair: true },
      { line: '195', to: 'Černý Most', in: 16, delay: 420, wheelchair: true },
      { line: '913', to: 'Sídliště Ďáblice', in: 94, night: true, wheelchair: true },
    ] }]);
    card('dark', 400, { devices: ['palmovka_a', 'palmovka_b'] }, [
      { id: 'palmovka_a', name: 'Palmovka A', infotext: {
          cs: 'Z důvodu opravy trati jsou tramvaje linky 3 odkloněny přes zastávku Libeňský most. Zajištěna náhradní autobusová doprava X3.', en: '' },
        departures: [
          { line: 'B', type: 'metro', to: 'Černý Most', in: 0.6, platform: 'M1', wheelchair: true },
          { line: '8', type: 'tram', to: 'Starý Hloubětín', in: 2, delay: 60, platform: 'A', wheelchair: true, ac: true },
          { line: '12', type: 'tram', to: 'Lehovec', in: 6, platform: 'A', wheelchair: true },
        ] },
      { id: 'palmovka_b', name: 'Palmovka B', departures: [
          { line: 'B', type: 'metro', to: 'Zličín', in: 1.5, platform: 'M2', wheelchair: true },
          { line: 'S9', type: 'train', train: 'Os 9362', to: 'Praha hl.n.', in: 5, platform: 'B' },
          { line: 'C', type: 'metro', to: 'Háje', in: 7, platform: 'M' },
          { line: 'A', type: 'metro', to: 'Depo Hostivař', in: 10, platform: 'M', wheelchair: true },
          { line: '58', type: 'trolleybus', to: 'Letňany', in: 13, platform: 'B', wheelchair: true, ac: true },
      ] },
    ], { language: 'cs' });
    card('dark', 420, { devices: ['plananska_a'], compact: true, max_departures: 4 }, [{ id: 'plananska_a', name: 'Plaňanská A', departures: [
      { line: '188', to: 'Kavčí hory', in: 0.4, atStop: true },
      { line: '199', to: 'Sídliště Malešice', in: 3, delay: 120 },
      { line: '133', to: 'Sídliště Malešice', in: 8 },
      { line: '188', to: 'Kavčí hory', in: 12, realtime: false },
    ] }], { staleMinutes: 13 });
  });
  await p.waitForTimeout(300);
  const box = await p.evaluate(() => { const r = [...document.querySelectorAll('.panel')].map(e => e.getBoundingClientRect()); return { w: Math.max(...r.map(x => x.right)) + 6, h: Math.max(...r.map(x => x.bottom)) + 6 }; });
  await p.screenshot({ path: `${ASSETS}/preview.png`, clip: { x: 0, y: 0, width: box.w, height: box.h } });
  await b.close();
  console.log(`Written to ${ASSETS}: preview.png, layouts.png`);
})();
