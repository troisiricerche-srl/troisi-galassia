// Uso: node monta-galassia.js <h|v> <uscita.mp4>   (PROVA=t1,t2 → fotogrammi di prova)
// Trailer della galassia dei siti di Troisi Ricerche: tutto disegnato in overlay.html, musica musica/A-itt-v5.wav (Envato, fuori dal repository).
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
const [ORI, OUT] = process.argv.slice(2); const DIR = __dirname;
const V = ORI === 'v'; const W = V ? 1080 : 1920, H = V ? 1920 : 1080, FPS = 25;
const A = JSON.parse(fs.readFileSync(path.join(DIR, 'musica', 'A.json'))); const b = k => A.beats[k];
const S = f => path.join(DIR, 'siti', f);
const SITI = [
  ['00-troisiricerche.net.jpg', "L'istituto", 'troisiricerche.net', 'Ricerche di mercato, sociali e sondaggi di opinione, dal 2006'],
  ['01-customerpa.it.jpg', 'CustomerPA™', 'customerpa.it', 'La customer satisfaction delle pubbliche amministrazioni'],
  ['02-ildatoetratto.it.jpg', 'Il dato è tratto™', 'ildatoetratto.it', "Ogni mattina un dato ufficiale sull'Italia"],
  ['05-delfiweb.it.jpg', 'DELFI', 'delfiweb.it', 'I dati dei comuni italiani, uno per uno'],
  ['10-troisiinsight.it.jpg', 'TroisiInsight', 'troisiinsight.it', "Analisi e report sull'Italia che cambia"],
  ['04-benessereorganizzativo.it.jpg', 'Benessere organizzativo', 'benessereorganizzativo.it', 'Clima interno e stress lavoro-correlato in PA e aziende'],
  ['19-osservatoriobenessereorganizzativo.it.jpg', 'Osservatorio sul Benessere Organizzativo', 'osservatoriobenessereorganizzativo.it', 'Il ranking delle società partecipate'],
  ['17-tiplive.it.jpg', 'TIP', 'tiplive.it', 'Survey, analisi dati e KPI per la PA'],
  ['06-mappaturadellecompetenze.it.jpg', 'Mappatura delle Competenze', 'mappaturadellecompetenze.it', "Le competenze di un'organizzazione, misurate"],
  ['12-registrodellecompetenze.it.jpg', 'Registro delle Competenze', 'registrodellecompetenze.it', 'Certificare e seguire nel tempo le competenze'],
  ['14-troisiformazione.it.jpg', 'Troisi Formazione', 'troisiformazione.it', 'La formazione finanziata, trasformata in competenze'],
  ['08-t-index.it.jpg', 'Indice di Performance Territoriale', 't-index.it', 'La performance di comuni, province e regioni'],
  ['11-digitalizzazionenellapa.it.jpg', 'Digitalizzazione nella PA', 'digitalizzazionenellapa.it', 'Strumenti data-driven per la PA italiana'],
  ['07-dibattito-pubblico.it.jpg', 'Dibattito pubblico', 'dibattito-pubblico.it', 'Partecipazione e confronto sulle grandi opere'],
  ['13-consulenzainternazionalizzazione.it.jpg', 'Internazionalizzazione', 'consulenzainternazionalizzazione.it', "Export guidato dai dati per le PMI"],
  ['09-benesseredigitalegiovani.it.jpg', 'Benessere digitale giovani', 'benesseredigitalegiovani.it', 'Quanto sono esposti i ragazzi al digitale'],
  ['16-svegliadigitale.it.jpg', 'Sveglia Digitale', 'svegliadigitale.it', 'Il test di consapevolezza digitale'],
  ['15-voiceinhub.it.jpg', 'VoiceInHub', 'voiceinhub.it', 'Il podcast su PA, innovazione e territorio'],
  ['03-andreatroisi.it.jpg', 'Il fondatore', 'andreatroisi.it', 'Andrea Troisi, statistico e professore universitario'],
].map(([f, nome, dominio, cosa]) => ({ f: S(f), nome, dominio, cosa }));
const per = d => SITI.filter(x => d.includes(x.dominio.split('.')[0]));
const LUNGA = process.env.VERSIONE !== 'corta';
const PASSO = Number(process.env.PASSO || 2.705);
let scene, HIT, DUR;
if (LUNGA) { const t0 = b(8), t1 = t0 + SITI.length * PASSO; HIT = t1 + 2.9 + 1.77; DUR = HIT + 7.5;
  scene = [ { tipo: 'galassia', da: 0, a: t0 }, { tipo: 'telefoni', da: t0, a: t1, totale: SITI.length }, { tipo: 'griglia', da: t1, a: t1 + 2.9 }, { tipo: 'silenzio', da: t1 + 2.9, a: HIT },
    { tipo: 'chiusura', da: HIT, a: DUR, scrivi: HIT + 1.1, davvero: HIT + 4.0, cta: HIT + 5.3 } ];
} else { HIT = 32.02; DUR = 39.5; const t0 = b(8), t1 = b(48), g = (t1 - t0) / 3;
  scene = [ { tipo: 'galassia', da: 0, a: t0 },
    { tipo: 'gruppo', da: t0, a: t0 + g, titolo: 'Per la pubblica amministrazione', siti: per(['customerpa', 'benessereorganizzativo', 'osservatoriobenessereorganizzativo', 'tiplive', 't-index', 'digitalizzazionenellapa', 'dibattito-pubblico']) },
    { tipo: 'gruppo', da: t0 + g, a: t0 + 2 * g, titolo: 'Per le imprese', siti: per(['troisiricerche', 'mappaturadellecompetenze', 'registrodellecompetenze', 'troisiformazione', 'consulenzainternazionalizzazione']) },
    { tipo: 'gruppo', da: t0 + 2 * g, a: t1, titolo: 'Per cittadini e territori', siti: per(['ildatoetratto', 'delfiweb', 'troisiinsight', 'benesseredigitalegiovani', 'svegliadigitale', 'voiceinhub', 'andreatroisi']) },
    { tipo: 'griglia', da: t1, a: 30.3 }, { tipo: 'silenzio', da: 30.3, a: HIT },
    { tipo: 'chiusura', da: HIT, a: DUR, scrivi: HIT + 1.1, davvero: HIT + 4.0, cta: HIT + 5.3 } ];
}
(async () => {
  const br = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await br.newPage({ viewport: { width: W, height: H } });
  await p.addInitScript('window.CONF=' + JSON.stringify({ W, H, fps: FPS, scene, siti: SITI, logo: { testo: path.join(DIR, 'logo', 'testo-bianco.svg') }, beats: A.beats }));
  await p.goto('file://' + path.join(DIR, 'overlay.html')); await p.evaluate(() => window.pronto);
  const shot = async f => { const d = await p.evaluate(f => { frame(f); return document.getElementById('cv').toDataURL('image/jpeg', .95); }, f); return Buffer.from(d.split(',')[1], 'base64'); };
  if (process.env.PROVA) { for (const ts of process.env.PROVA.split(',')) fs.writeFileSync(path.join(DIR, 'tmp', `g-${LUNGA ? 'L' : 'C'}-${ORI}-${ts}.jpg`), await shot(Math.round(Number(ts) * FPS))); await br.close(); return; }
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-i', path.join(DIR, 'musica', LUNGA ? 'A-lunga.wav' : 'A-itt-v5.wav'),
    '-filter_complex', `[1:a]atrim=0:${DUR},afade=t=out:st=${DUR - 1}:d=1[a]`, '-map', '0:v', '-map', '[a]', '-t', String(DUR),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
  const NF = Math.round(DUR * FPS);
  for (let f = 0; f < NF; f++) { if (!ff.stdin.write(await shot(f))) await new Promise(r => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await br.close(); console.log('fatto', OUT);
})();
