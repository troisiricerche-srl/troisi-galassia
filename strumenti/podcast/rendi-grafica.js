const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files','--disable-web-security']});const p=await b.newPage();
await p.goto('file://'+__dirname+'/g.html');await p.evaluate(()=>window.pronto);
for(const [fn,arg,out] of [['copertina',null,'copertina-podcast-3000.png'],['studio',true,'studio-podcast-con-voci.png'],['studio',false,'studio-podcast-sfondo.png']]){
 const d=await p.evaluate(([fn,arg])=>{window[fn](arg);return cv.toDataURL('image/png');},[fn,arg]);fs.writeFileSync(__dirname+'/'+out,Buffer.from(d.split(',')[1],'base64'));}
await b.close();})();
