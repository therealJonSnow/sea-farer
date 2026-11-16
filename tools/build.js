// Builds the single-file deliverable: src/index.html -> index.html (WGSL + JS + CSS minified).
// usage: node tools/build.js   (needs `terser` resolvable: npm i terser, or NODE_PATH pointing at it)
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const { minify } = require('terser');
const root = path.join(__dirname, '..');
(async () => {
  let html = fs.readFileSync(path.join(root, 'src/index.html'), 'utf8');
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  let js = m[1].replace(/\/\*wgsl\*\/`([\s\S]*?)`/g, (_, w) => {
    const keep = [];
    w = w.replace(/\$\{[^}]*\}/g, x => (keep.push(x), `\u0001${keep.length - 1}\u0001`));
    w = w.replace(/\/\/[^\n]*/g, '').replace(/\s+/g, ' ').replace(/ ?([{}()\[\],;:=+\-*\/<>!&|%@]) ?/g, '$1').trim();
    return '`' + w.replace(/\u0001(\d+)\u0001/g, (_, i) => keep[+i]) + '`';
  });
  const r = await minify(js, { ecma: 2022, compress: { passes: 3, unsafe_math: true, unsafe_arrows: true }, mangle: true, format: { comments: false } });
  let head = html.slice(0, m.index).replace(/>\s+</g, '><').replace(/\n\s*/g, '').replace(/<style>([\s\S]*?)<\/style>/, (_, c) => '<style>' + c.replace(/\s*([{};:,])\s*/g, '$1') + '</style>');
  const outp = head + '<script>' + r.code + '</script>';
  fs.writeFileSync(path.join(root, 'index.html'), outp);
  console.log(`src ${html.length} B -> index.html ${outp.length} B (${(outp.length / 1024).toFixed(1)} KiB), gzip ${zlib.gzipSync(outp, { level: 9 }).length} B`);
})();
