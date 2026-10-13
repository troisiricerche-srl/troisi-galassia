// Uso: node rendi.js dati.json uscita.mp4   (NODE_PATH con playwright; ffmpeg nel PATH)
// dati.json: {"periodo":"7 – 12 ottobre 2026","breve":"7–12 ott 2026","dati":[{"n":"6,2%","col":"#FF6F6F","tema":"LAVORO","riga":"…","fonte":"Fonte: Istat · troisiinsight.it"}]}
// Colori ammessi: #FF6F6F #7EA6FF #FFB020 #46C9F2 #41DDA0 #C9A7FF #F59AD0 #FF9F5A #9BE15D. Massimo 6 dati (Reel sotto i 30 secondi).
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
(async () => {
  const dati = fs.readFileSync(process.argv[2], 'utf8'); const out = process.argv[3] || 'reel.mp4';
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.addInitScript('window.DATI=' + dati + ';');
  await p.goto('file://' + path.join(__dirname, 'reel.html')); await p.evaluate(() => window.pronto);
  const F = await p.evaluate(() => window.FRAMES);
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'medium', '-movflags', '+faststart', out], { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let f = 0; f < F; f++) { const d = await p.evaluate(f => { frame(f); return cv.toDataURL('image/jpeg', 0.92); }, f); ff.stdin.write(Buffer.from(d.split(',')[1], 'base64')); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('fotogrammi', F, '→', out);
})();
