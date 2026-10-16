// Uso: node monta.js <h|v> <uscita.mp4>      (PROVA=t1,t2 → fotogrammi di prova in tmp/)
// Video istituzionale di Troisi Ricerche: filmati (clip/) a tempo sui battiti del brano (musica/M.json),
// sovrimpressioni disegnate in overlay.html, musica musica/M-mh61.wav (Envato, fuori dal repository).
const { chromium } = require('playwright'); const { spawnSync, spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
const [ORI, OUT] = process.argv.slice(2); const DIR = __dirname;
const M = JSON.parse(fs.readFileSync(path.join(DIR, 'musica', 'M.json'))); const WAV = path.join(DIR, 'musica', 'M-mh61.wav');
const V = ORI === 'v'; const W = V ? 1080 : 1920, H = V ? 1920 : 1080, FPS = 25;
const bt = k => k === 0 ? 0 : M.beats[k];
const FT = path.join(DIR, 'foto'); const hero = n => path.join(FT, 'hero', n + '.jpg'); const dos = n => path.join(FT, 'dossier', n + '.jpg');
const POOL = fs.readdirSync(path.join(FT, 'pool')).map(f => path.join(FT, 'pool', f));
const PRIMI = ['troisi-banner', 'senato-leggio', 'telecamera', 'scrivania', 'libro', 'camera-deputati', 'istat', 'stretta-mano'].map(hero).concat([dos('d03'), dos('d34')]);
const DUR = 61.2;
// battito di partenza, battito di fine, tipo, clip, punto d'ingresso (s), parametri
const T = [
  [0, 8, 'apertura', null],
  [8, 12, 'claim', 'senato.mp4', 2.3, { righe: [{ t: 'Misuriamo' }, { t: 'ciò che conta.', c: 'a' }], didascalia: 'Senato della Repubblica · giugno 2026', cxv: .38 }],
  [12, 16, 'claim', 'senato.mp4', 14.0, { righe: [{ t: 'Dati ufficiali,' }, { t: 'metodo scientifico.', c: 'a' }], cxv: .55 }],
  [16, 20, 'claim', 'cibari-porto.mp4', 4.3, { lento: 2, righe: [{ t: 'Dal 2006 trasformiamo i dati', px: V ? 64 : 80 }, { t: 'in conoscenza per chi decide.', c: 'a', px: V ? 64 : 80 }] }],
  [20, 24, 'claim', 'cibari-porto.mp4', 5.45, { lento: 2, gia: 10, righe: [{ t: 'Dal 2006 trasformiamo i dati', px: V ? 64 : 80 }, { t: 'in conoscenza per chi decide.', c: 'a', px: V ? 64 : 80 }] }],
  [24, 28, 'parola', 'forum.mp4', 8.9, { primo: true, parola: 'la soddisfazione dei cittadini', didascalia: 'Forum dei Pubblici Ufficiali · II edizione', cxv: .45 }],
  [28, 32, 'parola', 'aqv.mp4', 7.3, { parola: 'la qualità della vita', didascalia: 'Associazione Qualità della Vita · Conferenza annuale 2023', cxv: .55 }],
  [32, 36, 'parola', 'radio.mp4', 5.4, { parola: 'le opinioni', didascalia: "Indagine sull'ascolto delle radio in Puglia", cxv: .5 }],
  [36, 40, 'parola', 'sis.mp4', 2.4, { parola: 'i fenomeni sociali', didascalia: 'Società Italiana di Statistica · 52ª Riunione scientifica', cxv: .62 }],
  [40, 44, 'parola', 'cibari-andrea.mp4', 0, { parola: 'i territori' }],
  [44, 48, 'parola', 'cibari-andrea.mp4', 8.0, { parola: 'il cibo e la salute', didascalia: '3° Convegno CiBARI «Il cibo della salute»', cxv: .45 }],
  [48, 51, 'numero', 'forum.mp4', 16, { val: 20, suf: '+', etichetta: 'anni di attività' }],
  [51, 54, 'numero', 'sis.mp4', 25.4, { val: 500, suf: '+', etichetta: 'ricerche realizzate' }],
  [54, 57, 'numero', 'consiglio.mp4', 4.0, { val: 200, suf: '+', etichetta: 'clienti serviti' }],
  [57, 60, 'numero', 'focus.mp4', 0, { val: 20, suf: '+', etichetta: 'siti del network' }],
  [60, 70, 'carte', null, 0, { carte: [
    { f: hero('senato-leggio'), t: 'Senato della Repubblica', r: -3 },
    { f: hero('camera-deputati'), t: 'Camera dei deputati', r: 2.5, ox: 30 },
    { f: hero('istat'), t: 'Istat · Roma', r: -2, ox: -20 },
    { f: hero('milano-leggio'), t: 'Regione Lombardia · Milano', r: 3, ox: 40 },
    { f: hero('uniba-laptop'), t: 'Bari', r: -1.5, ox: -30 }] }],
  [70, 84, 'mosaico', null, 0, { dissolvi: .3 }],
  [84, 999, 'chiusura', null, 0, { dissolvi: .3 }],
];
const scene = T.map(([da, a, tipo, clip, inp, par]) => ({ da: bt(da), a: a === 999 ? DUR : bt(a), tipo, clip, inp: inp || 0, ...(par || {}) }));
const COLPO = 53.452; scene.find(s => s.tipo === 'chiusura').cta = COLPO;
const NF = Math.round(DUR * FPS);
const tmp = path.join(DIR, 'tmp'); fs.mkdirSync(tmp, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: W, height: H } });
  await p.addInitScript('window.CONF=' + JSON.stringify({ W, H, fps: FPS, scene, pool: POOL, primi: PRIMI, logo: { testo: path.join(FT, 'logo-testo-bianco.png') }, beats: M.beats }));
  await p.goto('file://' + path.join(DIR, 'overlay.html')); await p.evaluate(() => window.pronto);
  if (process.env.PROVA) { for (const ts of process.env.PROVA.split(',')) { const f = Math.round(Number(ts) * FPS); const d = await p.evaluate(f => { frame(f); return document.getElementById('cv').toDataURL('image/png'); }, f); fs.writeFileSync(path.join(tmp, `prova-${ORI}-${ts}.png`), Buffer.from(d.split(',')[1], 'base64')); } console.log(JSON.stringify(await p.evaluate(() => window.MOSAICO_INFO || null))); await b.close(); return; }
  const ov = path.join(tmp, `ov-${ORI}.mov`);
  if (!process.env.SOLO_MONTA) {
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-c:v', 'qtrle', ov], { stdio: ['pipe', 'ignore', 'inherit'] });
    for (let f = 0; f < NF; f++) { const d = await p.evaluate(f => { frame(f); return document.getElementById('cv').toDataURL('image/png'); }, f); if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r)); }
    console.log('mosaico', JSON.stringify(await p.evaluate(() => window.MOSAICO_INFO || null)));
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
  const inp = [], fil = []; let n = 0;
  for (const s of scene) {
    const d = (s.a - s.da).toFixed(3);
    if (!s.clip) { fil.push(`color=c=0x00264d:s=${W}x${H}:r=${FPS}:d=${d},setsar=1[s${n}]`); n++; continue; }
    const L = s.lento || 1; inp.push('-ss', String(s.inp), '-t', (Number(d) / L + .1).toFixed(3), '-i', path.join(DIR, 'clip', s.clip)); const k = inp.filter(v => v === '-i').length - 1;
    const cx = V ? (s.cxv === undefined ? .5 : s.cxv) : .5;
    const z = V ? `scale=-2:${Math.round(H * 1.06)},crop=${W}:${H}:(iw-ow)*${cx}+(iw-ow)*0.04*(t/${d}-0.5):(ih-oh)/2`
      : `scale=${Math.round(W * 1.08)}:-2,crop=${W}:${H}:(iw-ow)*(0.2+0.3*t/${d}):(ih-oh)/2`;
    fil.push(`[${k}:v]setpts=(PTS-STARTPTS)*${L},fps=${FPS},${z},eq=saturation=0.95:contrast=1.05:brightness=${s.luce || -0.02},colorbalance=bs=0.03:bm=0.02,vignette=PI/5,setpts=PTS-STARTPTS,trim=duration=${d},setsar=1[s${n}]`); n++;
  }
  const cat = scene.map((_, i) => `[s${i}]`).join('') + `concat=n=${scene.length}:v=1:a=0,format=yuv420p[bg]`;
  const k = inp.filter(v => v === '-i').length;
  const args = ['-y', '-loglevel', 'error', ...inp, '-i', ov, '-i', WAV,
    '-filter_complex', fil.join(';') + ';' + cat + `;[bg][${k}:v]overlay=0:0:format=auto,format=yuv420p[v];[${k + 1}:a]afade=t=out:st=${(DUR - 1.2).toFixed(2)}:d=1.2[a]`,
    '-map', '[v]', '-map', '[a]', '-t', DUR.toFixed(3), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', OUT];
  const r = spawnSync('ffmpeg', args, { stdio: 'inherit' }); console.log('fatto', OUT, DUR + 's', 'codice', r.status);
})();
