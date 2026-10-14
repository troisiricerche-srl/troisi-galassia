// Uso: MODO=apertura|chiusura node rendi.js uscita.mp4 [audio.wav]  — sigle del podcast «Il dato è tratto™» 1920×1080
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
(async () => {
  const out = process.argv[2]; const modo = process.env.MODO || 'apertura';
  const b = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] }); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.addInitScript('window.MODO=' + JSON.stringify(modo) + ';');
  await p.goto('file://' + path.join(__dirname, 'podcast.html')); await p.evaluate(() => window.pronto);
  const F = await p.evaluate(() => window.FRAMES);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-movflags', '+faststart', out + '.muto.mp4'], { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let f = 0; f < F; f++) { const d = await p.evaluate(f => { frame(f); return cv.toDataURL('image/jpeg', 0.9); }, f); ff.stdin.write(Buffer.from(d.split(',')[1], 'base64')); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  const au = process.argv[3]; const inA = (au && fs.existsSync(au)) ? ['-i', au] : ['-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo'];
  await new Promise(r => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', out + '.muto.mp4', ...inA, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' }).on('close', r));
  fs.unlinkSync(out + '.muto.mp4'); console.log(modo, F, 'fotogrammi →', out);
})();
