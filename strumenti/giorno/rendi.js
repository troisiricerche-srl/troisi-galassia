// Uso: node rendi.js dati.json uscita.mp4 [audio.wav]  (NODE_PATH con playwright; ffmpeg nel PATH)
// Audio: passa come terzo argomento la musica fissa della rubrica (brano Envato «The Corporate Ident», già tagliata a 15,6 s:
// sul Mac in ildatoetratto.it/envato/musica-dato-di-oggi.wav — licenza Envato, NON va nel repository).
// Senza terzo argomento il video esce con una traccia audio muta (WhatsApp si blocca sui video senza audio).
// dati.json: {"data":"Mercoledì 14 ottobre 2026","n":"21,1%","col":"#41DDA0","tema":"…","riga":"…","barre":[{"e":"Italia","v":21.1,"t":"21,1%","c":"tema|ue|altro"}],"fonte":"Fonte: …","sito":"…"}
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
(async () => {
  const dati = fs.readFileSync(process.argv[2], 'utf8'); const out = process.argv[3] || 'reel.mp4';
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.addInitScript('window.DATI=' + dati + ';');
  await p.goto('file://' + path.join(__dirname, 'giorno.html')); await p.evaluate(() => window.pronto);
  const F = await p.evaluate(() => window.FRAMES);
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'medium', '-movflags', '+faststart', out], { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let f = 0; f < F; f++) { const d = await p.evaluate(f => { frame(f); return cv.toDataURL('image/jpeg', 0.92); }, f); ff.stdin.write(Buffer.from(d.split(',')[1], 'base64')); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  const au = process.argv[4];
  { const tmp = out + '.muto.mp4'; fs.renameSync(out, tmp); const inA = (au && fs.existsSync(au)) ? ['-i', au] : ['-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo']; await new Promise(r => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, ...inA, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' }).on('close', r)); fs.unlinkSync(tmp); }
  if (false) { const tmp = out + '.muto.mp4'; fs.renameSync(out, tmp); await new Promise(r => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-i', au, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' }).on('close', r)); fs.unlinkSync(tmp); }
  console.log('fotogrammi', F, '→', out);
})();
