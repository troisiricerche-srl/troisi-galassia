// Uso: node rendi-promo.js uscita.mp4 [musica.wav]  (la musica si genera con: python3 musica-promo.py musica.wav) — video promo «Il dato di oggi» con le 7 schede (colori da colori-settimana.json)
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
(async () => {
  const C = JSON.parse(fs.readFileSync(path.join(__dirname, 'colori-settimana.json'), 'utf8'));
  const G = Object.entries(C).map(([g, v]) => ({ giorno: g[0].toUpperCase() + g.slice(1), portale: v.portale, sito: v.sito, sfondo: v.sfondo, fondo: v.fondo, col: v.col, colScuro: v.colScuro }));
  const out = process.argv[2] || 'promo.mp4'; const b = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.addInitScript('window.GIORNI=' + JSON.stringify(G) + ';');
  if (process.env.BEAT) await p.addInitScript('window.BEAT=' + Number(process.env.BEAT) + ';window.NCLIP=' + Number(process.env.NCLIP || 96) + ';');
  await p.goto('file://' + path.join(__dirname, process.env.PAGINA || 'promo.html')); await p.evaluate(() => window.pronto);
  const F = await p.evaluate(() => window.FRAMES);
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-preset', 'medium', '-movflags', '+faststart', out], { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let f = 0; f < F; f++) { const d = await p.evaluate(f => { frame(f); return cv.toDataURL('image/jpeg', 0.92); }, f); ff.stdin.write(Buffer.from(d.split(',')[1], 'base64')); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  if (process.argv[3]) { const tmp = out + '.muto.mp4'; fs.renameSync(out, tmp); await new Promise(r => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-i', process.argv[3], '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' }).on('close', r)); fs.unlinkSync(tmp); } console.log('fotogrammi', F, '→', out);
})();
