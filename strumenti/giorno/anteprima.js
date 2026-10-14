// Uso: node anteprima.js settimana.json uscita.png — un fotogramma (3,4 s) per giorno, affiancati
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { execSync } = require('child_process');
(async () => {
  const G = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const b = await chromium.launch(); const files = [];
  for (const [i, d] of G.entries()) {
    const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
    await p.addInitScript('window.DATI=' + JSON.stringify(d) + ';');
    await p.goto('file://' + path.join(__dirname, 'giorno.html')); await p.evaluate(() => window.pronto);
    await p.evaluate(() => { for (let f = 0; f <= 102; f++) frame(f); });
    const f = `/tmp/ant${i}.png`; await p.locator('#cv').screenshot({ path: f }); files.push(f); await p.close();
  }
  await b.close();
  execSync(`ffmpeg -loglevel error -y ${files.map(f => '-i ' + f).join(' ')} -filter_complex "${files.map((_, i) => `[${i}]scale=360:-1[a${i}];`).join('')}${files.map((_, i) => `[a${i}]`).join('')}hstack=${files.length}" ${process.argv[3]}`);
})();
