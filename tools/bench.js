// Runs the built-in ?bench fly-through in headless Chromium and saves the report JSON.
// NOTE: in a GPU-less container this exercises the harness only (software rasteriser, offscreen target);
// run index.html?bench in real Chrome on the target machine for meaningful numbers.
// usage: node tools/bench.js <html> <out.json> [w h]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [html, outp, w = 2560, h = 1440] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--enable-unsafe-webgpu', '--enable-features=Vulkan', '--use-angle=swiftshader', '--use-webgpu-adapter=swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  p.on('console', m => console.log('[page]', m.text()));
  p.on('pageerror', e => console.log('[pageerror]', e.message));
  await p.route('https://app.local/**', r => r.fulfill({ contentType: 'text/html', body: fs.readFileSync(html) }));
  await p.goto(`https://app.local/?bench=${process.argv[6]||60}&off&w=${w}&h=${h}`);
  await p.waitForFunction('window.__bench', null, { timeout: 180000 });
  const r = await p.evaluate('window.__bench');
  fs.writeFileSync(outp, JSON.stringify(r));
  console.log(await p.evaluate('document.getElementById("o").textContent'));
  await b.close();
})();
