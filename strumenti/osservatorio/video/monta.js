// Uso: node monta.js <A|B|C> <h|v> <fino_al_battito> <uscita.mp4> [primo_battito]
// Video di presentazione dell'Osservatorio: filmati (clip/) a tempo sui battiti del brano (musica/<K>.json),
// sovrimpressioni disegnate in overlay.html, musica musica/<K>-*.wav. I file Envato NON vanno nel repository.
const { chromium } = require('playwright'); const { spawnSync, spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
const [K, ORI, FINO, OUT, B0] = process.argv.slice(2); const DIR = __dirname;
const M = JSON.parse(fs.readFileSync(path.join(DIR, 'musica', K + '.json'))); const WAV = fs.readdirSync(path.join(DIR, 'musica')).find(f => f.startsWith(K + '-') && f.endsWith('.wav'));
const V = ORI === 'v'; const W = V ? 1080 : 1920, H = V ? 1920 : 1080, FPS = 25;
const b0 = Number(B0 || 0);
const bt = i => { i += b0; const b = M.beats; if (i < b.length) return b[i]; const p = (b[b.length - 1] - b[b.length - 9]) / 8; return b[b.length - 1] + (i - b.length + 1) * p; };
const esiste = f => fs.existsSync(path.join(DIR, 'clip', f));
const alt = (f, g) => esiste(f) ? f : g; // filmato di riserva finché non arriva quello giusto
const FT = path.join(DIR, 'foto');
const TEAM = [
  ['livio-tenerelli', 'Livio Tenerelli', 'Presidente'],
  ['michele-russo', 'Michele Russo', 'Vicepresidente'],
  ['andrea-troisi', 'Andrea Troisi', 'Vicepresidente e Direttore generale'],
  ['cristina-di-bari', 'Cristina Di Bari', 'Responsabile amministrazione'],
  ['corrado-crocetta', 'Corrado Crocetta', 'Steering group'],
  ['pierpaolo-limone', 'Pierpaolo Limone', 'Steering group'],
  ['antonio-messeni-petruzzelli', 'Antonio Messeni Petruzzelli', 'Steering group'],
  ['nicola-leone', 'Nicola Leone', 'Responsabile Dip. Pubblica Amministrazione'],
].map(([f, nome, ruolo]) => ({ f: path.join(FT, f + '.jpg'), nome, ruolo }));
const POOL = fs.readdirSync(path.join(FT, 'pool')).filter(f => /^(parma|poliba|applausi|team|laboratorio)/.test(f)).map(f => path.join(FT, 'pool', f));
// battito di partenza, battito di fine, tipo, clip, punto d'ingresso nel clip (s), parametri
const T = [
  [0, 8, 'apertura', null],
  [8, 16, 'claim', 'bari-decollo.mp4', 0, { righe: [{ t: 'Il Sud che innova.' }, { t: 'Noi lo misuriamo.', c: 'r' }] }],
  [16, 20, 'area', 'polignano.mp4', 4, { n: '01 / 06', parola: 'Turismo', sotto: 'Flussi, domanda e destinazioni del Mezzogiorno' }],
  [20, 24, 'area', 'laboratorio-dati.mp4', 5, { n: '02 / 06', parola: 'Innovazione', sotto: 'Startup, tecnologie, trasferimento tecnologico' }],
  [24, 28, 'area', 'eolico.mp4', 1, { n: '03 / 06', parola: 'Sostenibilità', sotto: 'Transizione energetica ed economia circolare' }],
  [28, 32, 'area', alt('studenti.mp4', 'team-ufficio.mp4'), 1, { n: '04 / 06', parola: 'Formazione', sotto: 'Fabbisogni e competenze di imprese, PA e lavoratori' }],
  [32, 36, 'area', 'bari-alto.mp4', 0, { n: '05 / 06', parola: 'Pubblica Amministrazione', sotto: 'Servizi digitali e valutazione delle politiche' }],
  [36, 40, 'area', alt('welfare.mp4', 'applausi.mp4'), 1, { n: '06 / 06', parola: 'Welfare', sotto: 'Coesione sociale e inclusione' }],
  [40, 46, 'numero', 'bari-alto.mp4', 4, { etichetta: 'Export del Mezzogiorno · 1° semestre 2026', val: 35.1, dec: 1, suf: ' mld €', righe: ['+5,2% sullo stesso periodo del 2025', 'Italia: +4,5%'], fonte: 'Fonte: ISTAT, Le esportazioni delle regioni italiane (11 settembre 2026)' }],
  [46, 52, 'numero', 'polignano.mp4', 12, { etichetta: 'Export della Puglia · 1° semestre 2026', val: 15.2, dec: 1, pre: '+', suf: '%', righe: ['5,4 miliardi di euro esportati', 'dopo un primo semestre 2025 in calo'], fonte: 'Fonte: ISTAT, Le esportazioni delle regioni italiane (11 settembre 2026)' }],
  [52, 58, 'numero', 'team-ufficio.mp4', 5, { etichetta: 'Competenze digitali almeno di base · 2025', val: 43.5, dec: 1, suf: '%', righe: ['delle persone nel Sud', 'contro il 60,3% del Nord-Ovest'], fonte: 'Fonte: Eurostat (isoc_sk_dskl_i21)' }],
  [58, 64, 'claim', 'parma-evento.mp4', 20, { righe: [{ t: 'Convegni, tavoli tecnici,', px: 80 }, { t: 'analisi su dati ufficiali.', px: 80, c: 'r' }] }],
  [64, 68, 'claim', 'applausi.mp4', 2, { righe: [{ t: 'Con imprese, università', px: 76 }, { t: 'e istituzioni.', px: 76 }] }],
  [68, 84, 'team', null],
  [84, 98, 'mosaico', null, 0, { dissolvi: .35 }],
  [98, 112, 'chiusura', null, 0, { dissolvi: .5 }],
];
const fino = Number(FINO);
const scene = T.filter(r => r[0] < fino).map(([da, a, tipo, clip, inp, par]) => ({ da: bt(da) - bt(0), a: bt(Math.min(a, fino)) - bt(0), tipo, clip, inp: inp || 0, ...(par || {}) }));
const DUR = scene[scene.length - 1].a; const NF = Math.round(DUR * FPS);
const tmp = path.join(DIR, 'tmp'); fs.mkdirSync(tmp, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: W, height: H } });
  await p.addInitScript('window.CONF=' + JSON.stringify({ W, H, fps: FPS, scene, team: TEAM, pool: POOL, beats: M.beats.map(x => x - bt(0)).filter(x => x >= 0) }));
  await p.goto('file://' + path.join(DIR, 'overlay.html')); await p.evaluate(() => window.pronto);
  if (process.env.PROVA) { const fs2 = require('fs'); for (const ts of process.env.PROVA.split(',')) { const f = Math.round(Number(ts) * FPS); const d = await p.evaluate(f => { frame(f); return document.getElementById('cv').toDataURL('image/png'); }, f); fs2.writeFileSync(path.join(tmp, `prova-${ts}.png`), Buffer.from(d.split(',')[1], 'base64')); } console.log(JSON.stringify(scene.map(s => [s.tipo, s.da.toFixed(2), s.a.toFixed(2)]))); await b.close(); return; }
  const ov = path.join(tmp, `ov-${K}${ORI}.mov`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-c:v', 'qtrle', ov], { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let f = 0; f < NF; f++) { const d = await p.evaluate(f => { frame(f); return document.getElementById('cv').toDataURL('image/png'); }, f); if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r)); }
  console.log('mosaico', JSON.stringify(await p.evaluate(() => window.MOSAICO_INFO || null)));
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  const inp = [], fil = []; let n = 0;
  for (const s of scene) {
    const d = (s.a - s.da).toFixed(3);
    if (!s.clip) { fil.push(`color=c=0x0a1928:s=${W}x${H}:r=${FPS}:d=${d},setsar=1[s${n}]`); n++; continue; }
    inp.push('-ss', String(s.inp), '-t', d, '-i', path.join(DIR, 'clip', s.clip)); const k = inp.filter(v => v === '-i').length - 1;
    const z = V ? `scale=-2:${Math.round(H * 1.06)},crop=${W}:${H}:(iw-ow)/2+(iw-ow)*0.1*(t/${d}-0.5):(ih-oh)/2`
      : `scale=${Math.round(W * 1.08)}:-2,crop=${W}:${H}:(iw-ow)*(0.2+0.3*t/${d}):(ih-oh)/2`;
    fil.push(`[${k}:v]fps=${FPS},${z},eq=saturation=0.92:contrast=1.06:brightness=-0.02,colorbalance=bs=0.04:bm=0.02,vignette=PI/5,setpts=PTS-STARTPTS,trim=duration=${d},setsar=1[s${n}]`); n++;
  }
  const cat = scene.map((_, i) => `[s${i}]`).join('') + `concat=n=${scene.length}:v=1:a=0,format=yuv420p[bg]`;
  const k = inp.filter(v => v === '-i').length; const mus = path.join(DIR, 'musica', WAV);
  const args = ['-y', '-loglevel', 'error', ...inp, '-i', ov, '-ss', String(bt(0)), '-i', mus,
    '-filter_complex', fil.join(';') + ';' + cat + `;[bg][${k}:v]overlay=0:0:format=auto,format=yuv420p[v];[${k + 1}:a]afade=t=in:d=0.05,afade=t=out:st=${(DUR - 2.5).toFixed(2)}:d=2.5[a]`,
    '-map', '[v]', '-map', '[a]', '-t', DUR.toFixed(3), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', OUT];
  const r = spawnSync('ffmpeg', args, { stdio: 'inherit' }); console.log('fatto', OUT, DUR.toFixed(2) + 's', 'codice', r.status);
})();
