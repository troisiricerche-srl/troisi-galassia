// Uso: node monta-sito.js <mappatura|registro|customerpa> <h|v> <uscita.mp4>   (PROVA=t1,t2 → fotogrammi)
// Brevi video dei siti di Troisi Ricerche. Filmati in clip/ (Envato e nostri), musica Envato in musica/ (fuori dal repository).
const { chromium } = require('playwright'); const { spawnSync, spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
const [SITO, ORI, OUT] = process.argv.slice(2); const DIR = __dirname; const V = ORI === 'v'; const W = V ? 1080 : 1920, H = V ? 1920 : 1080, FPS = 25;
const mus = k => JSON.parse(fs.readFileSync(path.join(DIR, 'musica', k + '.json'))).beats;
const FOTO = f => path.join(DIR, 'foto', f);
const CFG = {
  mappatura: () => { const b = mus('A'); const B = i => b[i] - 0;
    return { musica: 'A-itt-v5.wav', off: 0, dur: 40.5,
      tema: { c1: '#7C3AED', c2: '#C4B5FD', fondo: '#160C2E', alone: 'rgba(124,58,237,.38)', alto: '#7C3AED', medio: '#A78BFA', testoPill: '#160C2E' },
      sito: { nome: 'Mappatura delle Competenze', sigla: 'MC', dominio: 'mappaturadellecompetenze.it', claim: "L'impronta delle competenze della tua organizzazione" },
      scene: [
        { tipo: 'gancio', da: 0, a: B(10), clip: 'stretta.mp4', inp: 0, testo: 'Sai davvero quali competenze ci sono nella tua organizzazione?', ultimaColorata: true, cxv: .55 },
        { tipo: 'heatmap', da: B(10), a: B(18), kicker: 'Skill mapping', righe: ['Ogni ruolo,', { t: 'ogni competenza.', c: 1 }], ruoli: ['Dir. Amministrativo', 'Responsabile HR', 'Funzionario PA', 'Project Manager'], comp: ['Digitale', 'Gestione', 'Normativa', 'Analisi'], livelli: [[5, 6, 4, 4], [4, 5, 2, 5], [3, 4, 5, 3], [5, 6, 4, 5]] },
        { tipo: 'barre', da: B(18), a: B(26), kicker: 'Gap analysis', righe: ['Troviamo i gap', { t: 'prima che pesino.', c: 1 }], voci: [['Competenze digitali', 84], ['Project management', 76], ['Analisi dei dati', 51], ['Normativa appalti', 29]] },
        { tipo: 'clip', da: B(26), a: B(32), clip: 'bilancio.mp4', inp: 5.15, lento: 1.6, cxv: .2, kicker: 'Mappatura delle competenze', righe: ['Dalla mappatura', { t: 'al piano formativo.', c: 1 }], didascalia: 'Foyer del Teatro Petruzzelli · Bari' },
        { tipo: 'passi', da: B(32), a: B(44), kicker: 'Come funziona', righe: ['Quattro fasi,', { t: 'un metodo.', c: 1 }], passi: [['Profili', 'Ruoli e competenze attese, allineati ai livelli EQF'], ['Assessment', 'Questionari digitali di autovalutazione e valutazione'], ['Gap analysis', 'La mappa dei gap per persona, team e organizzazione'], ['Piano formativo', 'Percorsi suggeriti, compatibili con i fondi interprofessionali']] },
        { tipo: 'badge', da: B(44), a: 31.1, kicker: 'Standard', righe: ['Competenze misurate', { t: 'e confrontabili.', c: 1 }], badge: ['Livelli EQF', 'D.Lgs. 13/2013', 'Fondimpresa', 'Fondirigenti'] },
        { tipo: 'chiusura', da: 31.1, a: 40.5, dissolvi: .25 },
      ] }; },
  registro: () => { const b = mus('C'); const B = i => b[i];
    return { musica: 'C-mh-37.wav', off: 0, dur: 37,
      tema: { c1: '#0F8F7E', c2: '#5EEAD4', fondo: '#05211D', alone: 'rgba(15,143,126,.38)', alto: '#0F8F7E', medio: '#14B8A6', testoPill: '#05211D' },
      sito: { nome: 'Registro delle Competenze', sigla: 'RC', dominio: 'registrodellecompetenze.it', claim: 'Certificare e seguire nel tempo le competenze' },
      scene: [
        { tipo: 'gancio', da: 0, a: B(9), clip: 'riunione-alto.mp4', inp: 0, lento: 1.3, testo: 'Le competenze non si dichiarano. Si certificano.', ultimaColorata: true },
        { tipo: 'certificato', da: B(9), a: B(20), kicker: 'Certificato digitale', righe: ['Verificabile,', { t: 'con QR code.', c: 1 }], titolare: 'Dott.ssa M. Bianchi', org: 'Ufficio tecnico · Ente pubblico', codice: 'RDC-IT-0000 · esempio', voci: [['Gestione appalti pubblici', 'EQF LV.6', true], ['Project management PA', 'EQF LV.5', true], ['Transizione digitale', 'EQF LV.4', false]] },
        { tipo: 'gauge', da: B(20), a: B(30), kicker: 'Indice di Maturità delle Competenze', righe: ['Un numero', { t: 'da 0 a 100.', c: 1 }], valore: 78, etichetta: 'IMC', sotto: [['Crescita', 82], ['Aggiornamento', 71], ['Maturità EQF', 76], ['Copertura ruoli', 68]] },
        { tipo: 'passi', da: B(30), a: B(41), kicker: 'Come funziona', righe: ['Dalla mappatura', { t: 'al certificato.', c: 1 }], passi: [['Importa', 'Le competenze arrivano dalla Mappatura, senza reinserire i dati'], ['Documenta', 'Titoli, attestati ed esperienze come evidenze'], ['Valida', 'Con il referente o l’ente accreditato, passo per passo'], ['Certifica', 'Certificato digitale con QR code e calcolo dell’IMC']] },
        { tipo: 'badge', da: B(41), a: B(46), kicker: 'Standard', righe: ['Conforme', { t: 'agli standard.', c: 1 }], badge: ['D.Lgs. 13/2013', 'Livelli EQF', 'Open Badges 3.0', 'GDPR'] },
        { tipo: 'chiusura', da: B(46), a: 37, dissolvi: .25 },
      ] }; },
  customerpa: () => { const b = mus('B'), off = 2.0; const B = i => b[i] - off;
    return { musica: 'B-eit.wav', off, dur: 36,
      tema: { c1: '#2347C5', c2: '#93C5FD', fondo: '#0A1438', alone: 'rgba(35,71,197,.42)', alto: '#2347C5', medio: '#3B82F6', testoPill: '#0A1438' },
      sito: { nome: 'CustomerPA™', sigla: 'CPA', dominio: 'customerpa.it', claim: 'La customer satisfaction delle pubbliche amministrazioni' },
      scene: [
        { tipo: 'gancio', da: 0, a: B(12), clip: 'callcenter2.mp4', inp: 0, testo: 'Il tuo ente misura davvero la soddisfazione dei cittadini?', ultimaColorata: true, cxv: .5 },
        { tipo: 'leggi', da: B(12), a: B(26), kicker: 'Non è una scelta', righe: ['È previsto', { t: 'dalle norme.', c: 1 }], leggi: [['D.Lgs. 150/2009', 'Rilevazione annuale della soddisfazione degli utenti'], ['D.L. 80/2021 · PIAO', 'La customer satisfaction come obiettivo misurabile'], ['D.Lgs. 33/2013', 'Risultati pubblicati in Amministrazione Trasparente']] },
        { tipo: 'gauge', da: B(26), a: B(36), kicker: 'CustomerPA™ Score', righe: ['Quanto è conforme', { t: 'il tuo ente?', c: 1 }], valore: 74, soglia: 70, etichetta: 'SCORE · 0–100' },
        { tipo: 'foto', da: B(36), a: B(44), f: FOTO('forum-2026.jpg'), rot: -2, kicker: 'Forum dei Pubblici Ufficiali · Bari, 2026', righe: ['Dal questionario', { t: 'al dato.', c: 1 }] },
        { tipo: 'foto', da: B(44), a: B(50), f: FOTO('camera-deputati.jpg'), rot: 2, kicker: 'Camera dei deputati', righe: ['Un metodo presentato', { t: 'alla Camera.', c: 1 }] },
        { tipo: 'passi', da: B(50), a: B(62), kicker: 'Il percorso', righe: ['Quattro passi', { t: 'verso la conformità.', c: 1 }], passi: [['Audit', 'Verifica in 8 punti e CustomerPA™ Score'], ['Indagine', 'Rilevazione con metodo statistico validato'], ['Report', 'Allegabile alla Relazione sulla Performance'], ['Validazione', 'Documentazione a supporto dell’OIV']] },
        { tipo: 'chiusura', da: B(62), a: 36, dissolvi: .25 },
      ] }; },
};
const cfg = CFG[SITO](); const scene = cfg.scene; const DUR = cfg.dur; const NF = Math.round(DUR * FPS);
const tmp = path.join(DIR, 'tmp'); fs.mkdirSync(tmp, { recursive: true });
(async () => {
  const br = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await br.newPage({ viewport: { width: W, height: H } });
  await p.addInitScript('window.CONF=' + JSON.stringify({ W, H, fps: FPS, scene, tema: cfg.tema, sito: cfg.sito, logo: { testo: path.join(DIR, 'testo-bianco.svg') } }));
  await p.goto('file://' + path.join(DIR, 'sito.html')); await p.evaluate(() => window.pronto);
  if (process.env.PROVA) { for (const ts of process.env.PROVA.split(',')) { const d = await p.evaluate(f => { frame(f); return document.getElementById('cv').toDataURL('image/png'); }, Math.round(Number(ts) * FPS)); fs.writeFileSync(path.join(tmp, `${SITO}-${ORI}-${ts}.png`), Buffer.from(d.split(',')[1], 'base64')); } await br.close(); return; }
  const ov = path.join(tmp, `ov-${SITO}-${ORI}.mov`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-c:v', 'qtrle', ov], { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let f = 0; f < NF; f++) { const d = await p.evaluate(f => { frame(f); return document.getElementById('cv').toDataURL('image/png'); }, f); if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await br.close();
  const inp = [], fil = []; let n = 0;
  for (const s of scene) { const d = (s.a - s.da).toFixed(3);
    if (!s.clip) { fil.push(`color=c=black:s=${W}x${H}:r=${FPS}:d=${d},setsar=1[s${n}]`); n++; continue; }
    const L = s.lento || 1; inp.push('-ss', String(s.inp || 0), '-t', (Number(d) / L + .2).toFixed(3), '-i', path.join(DIR, 'clip', s.clip)); const k = inp.filter(v => v === '-i').length - 1;
    const cx = V ? (s.cxv === undefined ? .5 : s.cxv) : .5;
    const z = V ? `scale=-2:${Math.round(H * 1.06)},crop=${W}:${H}:(iw-ow)*${cx}:(ih-oh)/2` : `scale=${Math.round(W * 1.08)}:-2,crop=${W}:${H}:(iw-ow)*(0.25+0.25*t/${d}):(ih-oh)/2`;
    fil.push(`[${k}:v]setpts=(PTS-STARTPTS)*${L},fps=${FPS},${z},eq=saturation=0.95:contrast=1.05:brightness=-0.02,vignette=PI/5,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=2,trim=duration=${d},setsar=1[s${n}]`); n++; }
  const cat = scene.map((_, i) => `[s${i}]`).join('') + `concat=n=${scene.length}:v=1:a=0,format=yuv420p[bg]`; const k = inp.filter(v => v === '-i').length;
  const args = ['-y', '-loglevel', 'error', ...inp, '-i', ov, '-ss', String(cfg.off), '-i', path.join(DIR, 'musica', cfg.musica),
    '-filter_complex', fil.join(';') + ';' + cat + `;[bg][${k}:v]overlay=0:0:format=auto,format=yuv420p[v];[${k + 1}:a]afade=t=out:st=${(DUR - 1.5).toFixed(2)}:d=1.5[a]`,
    '-map', '[v]', '-map', '[a]', '-t', String(DUR), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', OUT];
  const r = spawnSync('ffmpeg', args, { stdio: 'inherit' }); console.log('fatto', OUT, r.status);
})();
