// Uso: node monta-galassia.js <h|v> <uscita.mp4>   (PROVA=t1,t2 → fotogrammi di prova)
// Trailer della galassia dei siti di Troisi Ricerche: tutto disegnato in overlay.html, musica musica/A-itt-v5.wav (Envato, fuori dal repository).
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
const [ORI, OUT] = process.argv.slice(2); const DIR = __dirname;
const V = ORI === 'v'; const W = V ? 1080 : 1920, H = V ? 1920 : 1080, FPS = 25;
const A = JSON.parse(fs.readFileSync(path.join(DIR, 'musica', 'A.json'))); const b = k => A.beats[k];
const S = f => path.join(DIR, 'siti', f);
const SITI = [
  ['00-troisiricerche.net.jpg', "L'istituto", 'troisiricerche.net'],
  ['01-customerpa.it.jpg', 'CustomerPA™', 'customerpa.it'],
  ['02-ildatoetratto.it.jpg', 'Il dato è tratto™', 'ildatoetratto.it'],
  ['05-delfiweb.it.jpg', 'DELFI · i 7.896 comuni', 'delfiweb.it'],
  ['04-benessereorganizzativo.it.jpg', 'Benessere organizzativo', 'benessereorganizzativo.it'],
  ['06-mappaturadellecompetenze.it.jpg', 'Mappatura delle Competenze', 'mappaturadellecompetenze.it'],
  ['08-t-index.it.jpg', 'Indice di Performance Territoriale', 't-index.it'],
  ['07-dibattito-pubblico.it.jpg', 'Dibattito pubblico', 'dibattito-pubblico.it'],
  ['09-benesseredigitalegiovani.it.jpg', 'Benessere digitale giovani', 'benesseredigitalegiovani.it'],
  ['03-andreatroisi.it.jpg', 'Il fondatore', 'andreatroisi.it'],
].map(([f, nome, dominio]) => ({ f: S(f), nome, dominio }));
const HIT = 32.02, DUR = 39.5;
const scene = [
  { tipo: 'galassia', da: 0, a: b(8) },
  { tipo: 'telefoni', da: b(8), a: b(48), totale: 10 },
  { tipo: 'griglia', da: b(48), a: 30.3 },
  { tipo: 'silenzio', da: 30.3, a: HIT },
  { tipo: 'chiusura', da: HIT, a: DUR, scrivi: HIT + 1.1, davvero: HIT + 4.0, cta: HIT + 5.3 },
];
(async () => {
  const br = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await br.newPage({ viewport: { width: W, height: H } });
  await p.addInitScript('window.CONF=' + JSON.stringify({ W, H, fps: FPS, scene, siti: SITI, logo: { testo: path.join(DIR, 'foto', 'logo-testo-bianco.png') }, beats: A.beats }));
  await p.goto('file://' + path.join(DIR, 'overlay.html')); await p.evaluate(() => window.pronto);
  const shot = async f => { const d = await p.evaluate(f => { frame(f); return document.getElementById('cv').toDataURL('image/jpeg', .95); }, f); return Buffer.from(d.split(',')[1], 'base64'); };
  if (process.env.PROVA) { for (const ts of process.env.PROVA.split(',')) fs.writeFileSync(path.join(DIR, 'tmp', `g-${ORI}-${ts}.jpg`), await shot(Math.round(Number(ts) * FPS))); await br.close(); return; }
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-i', path.join(DIR, 'musica', 'A-itt-v5.wav'),
    '-filter_complex', `[1:a]atrim=0:${DUR},afade=t=out:st=${DUR - 1}:d=1[a]`, '-map', '0:v', '-map', '[a]', '-t', String(DUR),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
  const NF = Math.round(DUR * FPS);
  for (let f = 0; f < NF; f++) { if (!ff.stdin.write(await shot(f))) await new Promise(r => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await br.close(); console.log('fatto', OUT);
})();
