// Renders review stills / fly-through frames from the page in headless Chromium (WebGPU, offscreen capture path).
// usage: node tools/shot.js <html> <outDir> poses <w> <h> [hud]            six fixed review poses (tools/poses.json)
//        node tools/shot.js <html> <outDir> set <w> <h> name:x,z,psi,zoom,anchor,warm,gull ...   ad-hoc poses
//        node tools/shot.js <html> <outDir> fly <w> <h> <fps> <t0> <t1>      scripted fly-through frames
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [html, outDir, mode = 'poses', ...rest] = process.argv.slice(2);
  const w = +rest[0] || 2560, h = +rest[1] || 1440;
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch({ args: ['--enable-unsafe-webgpu', '--enable-features=Vulkan', '--use-angle=swiftshader', '--use-webgpu-adapter=swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  p.on('console', m => console.log('[page]', m.text()));
  p.on('pageerror', e => console.log('[pageerror]', e.message));
  await p.route('https://app.local/**', r => r.fulfill({ contentType: 'text/html', body: fs.readFileSync(html) }));
  await p.goto('https://app.local/?cap' + (rest.includes('hud') ? '&hud' : ''));
  await p.waitForFunction('window.sf', null, { timeout: 180000 });
  const snap = async f => { await p.evaluate('sf.draw()'); await p.screenshot({ path: path.join(outDir, f) }); };
  if (mode == 'fly') {
    const fps = +rest[2] || 30, a = +rest[3] || 0, z = +rest[4] || 60, sub = Math.max(1, Math.round(60 / fps));
    await p.evaluate('sf.fly()');
    let fr = 0;
    for (let i = 0; i < z * fps; i++) {
      await p.evaluate(`sf.step(${1 / (fps * sub)},${sub});sf.zoom(11+4*Math.sin(${(i / fps) * 0.21}))`);
      if (i >= a * fps) { await snap(`f${String(fr++).padStart(4, '0')}.png`); if (fr % 30 == 0) console.log('frame', fr, JSON.stringify(await p.evaluate('sf.state()'))); }
    }
  } else {
    const list = mode == 'poses' ? JSON.parse(fs.readFileSync(path.join(__dirname, 'poses.json'))).map((a, i) => ['pose' + (i + 1), a])
      : rest.slice(2).filter(s => s.includes(':')).map(s => [s.split(':')[0], s.split(':')[1].split(',').map(Number)]);
    for (const [name, a] of list) { await p.evaluate(`sf.set(${a.join(',')})`); await snap(name + '.png'); console.log(name, JSON.stringify(await p.evaluate('sf.state()'))); }
  }
  await b.close();
})();
