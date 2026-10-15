// Strumento «Dati e analisi» di osservatoriomezzogiorno.net
// Si incolla in javascript_tool in una scheda aperta su https://www.osservatoriomezzogiorno.net/wp-admin/
// (sessione WordPress «redazione»). Definisce window.OSM con:
//   await OSM.init()                                   carica il modello di pagina (header, menu, footer del sito)
//   await OSM.pubblica(src, portale, dominio, etichetta, {aggiorna:true}) crea (o, con aggiorna, rifà) la pagina dell'articolo (figlia di «Dati e analisi»)
//   await OSM.aggiornaIndice()                          rifà le schede della pagina «Dati e analisi»
//   await OSM.elenco()                                 articoli già ripresi (slug, fonte)
// src = oggetto della REST del portale: {date,title:{rendered},excerpt:{rendered},content:{rendered},link}
// Le pagine usano il modello «osm-blank.php» (HTML completo del sito), come la rubrica «Sorveglianza digitale».
(() => {
  const PARENT_SLUG = 'dati-e-analisi';
  const NOTIZIE_ID = 13;
  const MODELLO_ID = 246; // una pagina della rubrica Sorveglianza digitale, usata come modello grafico
  const BASE = 'https://www.osservatoriomezzogiorno.net/notizie/dati-e-analisi/';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const dec = s => { const t = document.createElement('textarea'); t.innerHTML = s; return t.value; };
  const data = d => new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  const OSM = {};
  const ICO = '<svg class="osm-i" width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M7 16v-4M12 16V6M17 16V9"/></svg>';
  // «TroisiInsight» non compare sul sito dell'Osservatorio: diventa «Congiuntura Italia» e il link all'originale non mostra il dominio (decisione di Andrea, 15/10/2026)
  const nomePortale = p => p === 'TroisiInsight' ? 'Congiuntura Italia' : p;
  // Toglie dai paragrafi del testo le frasi promozionali su Troisi Ricerche (decisione di Andrea del 15/10/2026).
  // Non tocca didascalie dei grafici (figcaption) né il riquadro «Metodo e fonti» (aside/.ti-box).
  OSM.pulisci = function (html) {
    const d = new DOMParser().parseFromString('<div id="r">' + html + '</div>', 'text/html');
    const r = d.getElementById('r');
    let tolte = [];
    r.querySelectorAll('p, li').forEach(p => {
      if (p.closest('figcaption, aside, .ti-box, figure')) return;
      if (!/Troisi Ricerche/i.test(p.textContent)) return;
      const frasi = p.innerHTML.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú«“"])/);
      const tenute = frasi.filter(f => !/Troisi Ricerche/i.test(f.replace(/<[^>]+>/g, '')));
      tolte = tolte.concat(frasi.filter(f => /Troisi Ricerche/i.test(f.replace(/<[^>]+>/g, ''))).map(f => f.replace(/<[^>]+>/g, '').trim()));
      if (!tenute.length || !tenute.join(' ').replace(/<[^>]+>/g, '').trim()) p.remove(); else p.innerHTML = tenute.join(' ');
    });
    return { html: r.innerHTML, tolte };
  };
  async function H() {
    const n = await fetch('/wp-admin/admin-ajax.php?action=rest-nonce').then(r => r.text());
    return { 'X-WP-Nonce': n, 'Content-Type': 'application/json' };
  }
  OSM.init = async function () {
    const h = await H();
    const me = await fetch('/?rest_route=/wp/v2/users/me&context=edit&_fields=username', { headers: h }).then(r => r.json());
    if (me.username !== 'redazione') throw new Error('Utente non «redazione»: ' + JSON.stringify(me));
    const m = (await fetch(`/?rest_route=/wp/v2/pages/${MODELLO_ID}&context=edit&_fields=content`, { headers: h }).then(r => r.json())).content.raw;
    const a = m.indexOf('</head>'), b = m.indexOf('<div class="breadcrumb">'), c = m.indexOf('<footer');
    if (a < 0 || b < 0 || c < 0) throw new Error('Modello di pagina cambiato: controllare la pagina ' + MODELLO_ID);
    OSM.P = { head: m.slice(0, a), mid: m.slice(a, b), foot: m.slice(c) };
    const p = await fetch(`/?rest_route=/wp/v2/pages&slug=${PARENT_SLUG}&context=edit&_fields=id`, { headers: h }).then(r => r.json());
    if (!p.length) throw new Error('Pagina «Dati e analisi» non trovata');
    OSM.pid = p[0].id;
    return { ok: true, pid: OSM.pid };
  };
  const CSS = `<style id="osm-dati">
.osm-art h2{font-size:24px;line-height:1.3;color:var(--blu);margin:1.6em 0 .6em;font-weight:700}
.osm-art h3{font-size:19px;color:var(--blu);margin:1.4em 0 .5em}
.osm-art ul,.osm-art ol{font-size:17px;line-height:1.7;color:#22364b;margin:0 0 1.25em 1.2em}
.osm-art a{color:var(--rosso)}
.osm-art .tr-art p{font-size:18px;line-height:1.8;color:#22364b}
.osm-art .tr-art .ti-box p,.osm-art .ti-box p{font-size:15px;line-height:1.6}
.osm-art figure{margin:1.8em 0}
.osm-art img{max-width:100%;height:auto}
.osm-dati-intro{font-size:15px;color:var(--grigio);background:var(--grigio-light);border-left:4px solid var(--rosso);border-radius:6px;padding:14px 18px;margin:0 0 28px}
.osm-dati-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px}
.osm-dati-card{display:flex;flex-direction:column;background:#fff;border:1px solid var(--bordo);border-radius:12px;padding:24px;text-decoration:none;color:inherit;box-shadow:0 2px 16px rgba(0,0,0,.04);transition:transform .15s,box-shadow .15s}
.osm-dati-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.08)}
.osm-dati-card .k{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--rosso);margin-bottom:8px}
.osm-dati-card h2{font-size:19px;line-height:1.35;color:var(--blu);margin:0 0 10px;font-weight:700}
.osm-dati-card p{font-size:15px;line-height:1.6;color:#33475b;margin:0 0 14px;flex:1}
.osm-dati-card .d{font-size:13px;color:var(--grigio);font-weight:600}
</style>
`;

  // ---- Barra Condividi / Stampa-PDF / canale WhatsApp (come i siti della galassia, plugin troisi-galassia §12) ----
  const ICONE = {"linkedin": "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", "whatsapp": "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z", "facebook": "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z", "x": "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z", "telegram": "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z", "mail": "!M3 5h18v14H3zM3 6l9 7 9-7", "link": "!M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1", "print": "!M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2M6 14h12v7H6z", "share": "!M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v12M7 8l5-5 5 5", "instagram": "!M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17.5 6.5h.01"};
  const ico = k => { const p = ICONE[k] || ''; return p[0] === '!' ? `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${p.slice(1)}"/></svg>` : `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="${p}"/></svg>`; };
  const utm = (u, s) => u + (u.includes('?') ? '&' : '?') + 'utm_source=' + s + '&utm_medium=condivisione&utm_campaign=pulsanti-articolo';
  const WA_CANALE = 'https://whatsapp.com/channel/0029VbE9Kx9DeONGCBFx5v42';
  OSM.barra = function ({ title, url, portale, dt, ex }) {
    const t = encodeURIComponent(title);
    const L = [
      ['linkedin', 'LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(utm(url, 'linkedin'))],
      ['whatsapp', 'WhatsApp', 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + utm(url, 'whatsapp'))],
      ['facebook', 'Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(utm(url, 'facebook'))],
      ['x', 'X', 'https://x.com/intent/post?text=' + t + '&url=' + encodeURIComponent(utm(url, 'x'))],
      ['telegram', 'Telegram', 'https://t.me/share/url?url=' + encodeURIComponent(utm(url, 'telegram')) + '&text=' + t],
      ['mail', 'Email', 'mailto:?subject=' + t + '&body=' + encodeURIComponent(title + '\n\n' + utm(url, 'email'))]
    ];
    let b = '<div class="tg-share" data-tg-share role="group" aria-label="Condividi o stampa questo articolo"><span class="tg-share-l">Condividi</span><span class="tg-share-btns">';
    L.forEach(([k, n, h]) => { b += `<a class="tg-sb tg-sb-${k}" href="${esc(h)}"${k === 'mail' ? '' : ' target="_blank" rel="noopener nofollow"'} title="Condividi su ${n}">${ico(k)}<span>${n}</span></a>`; });
    b += `<button type="button" class="tg-sb tg-sb-copy" data-url="${esc(utm(url, 'copia-link'))}">${ico('link')}<span>Copia link</span></button>`;
    b += `<button type="button" class="tg-sb tg-sb-native" hidden data-url="${esc(utm(url, 'telefono'))}" data-title="${esc(title)}">${ico('share')}<span>Condividi…</span></button>`;
    b += `</span><button type="button" class="tg-sb tg-sb-print">${ico('print')}<span>Stampa / PDF</span></button>`;
    b += `<a class="tg-follow" href="${WA_CANALE}" target="_blank" rel="noopener">${ico('whatsapp')}<span>Iscriviti al canale WhatsApp <strong>Il dato è tratto™</strong>: ogni mattina un dato ufficiale sull'Italia, ogni martedì la settimana in numeri</span></a>`;
    b += `<a class="tg-follow tg-follow-ig" href="https://www.instagram.com/troisiricerche/" target="_blank" rel="noopener">${ico('instagram')}<span>Seguici su Instagram: <strong>@troisiricerche</strong></span></a>`;
    b += '</div>';
    const C = { site: "Osservatorio sull'Innovazione del Mezzogiorno", sub: 'osservatoriomezzogiorno.net · Dati e analisi', date: dt, title, excerpt: ex, byline: 'di Andrea Troisi · ' + portale, url,
      foot: 'osservatoriomezzogiorno.net · Osservatorio sull’Innovazione del Mezzogiorno', colo: ' · Via De Rossi 57, 70122 Bari · osservatoriomezzogiorno.net' };
    const q = x => String(x).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
    const css = `<style id="tg-share-css">
.tg-share{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:2.2em 0 .4em;padding:14px 0;border-top:1px solid rgba(0,0,0,.14);border-bottom:1px solid rgba(0,0,0,.14);font-family:inherit;font-size:14px;line-height:1.2;clear:both}
.tg-share-l{flex:1 1 auto;font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-size:12px;opacity:.75}
.tg-share-btns{display:flex;flex-wrap:wrap;gap:8px;flex:1 1 100%;order:2}
.tg-share .tg-sb{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border:1px solid rgba(0,0,0,.18);border-radius:999px;background:transparent;color:#22364b;font:inherit;font-size:13px;text-decoration:none!important;cursor:pointer;line-height:1;box-shadow:none}
.tg-share .tg-sb:hover,.tg-share .tg-sb:focus-visible{background:rgba(0,0,0,.06)}
.tg-share .tg-sb svg{flex:none}
.tg-share .tg-sb-linkedin svg{color:#0A66C2}.tg-share .tg-sb-whatsapp svg{color:#25D366}.tg-share .tg-sb-facebook svg{color:#1877F2}.tg-share .tg-sb-telegram svg{color:#26A5E4}
.tg-share .tg-sb-print{order:1;font-weight:600;border-color:currentColor}
.tg-share .tg-sb[hidden]{display:none}
.tg-share .tg-follow{order:3;flex:1 1 100%;display:inline-flex;align-items:center;gap:8px;font-size:14px;color:#22364b!important;text-decoration:none!important}.tg-share .tg-follow svg{color:#25D366;flex:none}.tg-share .tg-follow-ig svg{color:#E1306C}.tg-share .tg-follow:hover span{text-decoration:underline}
@media (max-width:640px){.tg-share .tg-sb span{display:none}.tg-share .tg-sb{padding:9px}.tg-share .tg-sb-print span,.tg-share .tg-sb-native span{display:inline}}
#tg-ph,#tg-pf{display:none}
@media print{
 @page{size:A4;margin:16mm 17mm 18mm;@bottom-left{content:"${q(C.foot)}";font:8pt Helvetica,Arial,sans-serif;color:#777}@bottom-right{content:counter(page) " / " counter(pages);font:8pt Helvetica,Arial,sans-serif;color:#777}@top-left{content:"${q(C.site)}";font:8pt Helvetica,Arial,sans-serif;color:#777}@top-right{content:"${q(C.date)}";font:8pt Helvetica,Arial,sans-serif;color:#777}}
 @page:first{@top-left{content:none}@top-right{content:none}}
 html,body{margin:0!important;padding:0!important;background:#fff!important}
 body.tg-p *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
 body.tg-p.tg-chain>:not(.tg-chain):not(.tg-root):not(#tg-ph):not(#tg-pf),body.tg-p .tg-chain>:not(.tg-chain):not(.tg-root):not(#tg-ph):not(#tg-pf){display:none!important}
 body.tg-p .tg-chain{display:block!important;position:static!important;margin:0!important;padding:0!important;width:auto!important;max-width:none!important;border:0!important;background:none!important;box-shadow:none!important}
 body.tg-p .tg-root{margin:0!important;padding:0!important;border:0!important;box-shadow:none!important;background:none!important;max-width:none!important;font-family:Georgia,"Times New Roman",serif!important;font-size:11pt!important;line-height:1.5!important;color:#222!important}
 body.tg-p .tg-root p{font-size:11pt!important;line-height:1.5!important}
 body.tg-p .tg-root .tg-share,body.tg-p .tg-root button,body.tg-p .tg-root script{display:none!important}
 body.tg-p .tg-root img,body.tg-p .tg-root svg,body.tg-p .tg-root figure,body.tg-p .tg-root table,body.tg-p .tg-root aside,body.tg-p .tg-root .ti-chart{break-inside:avoid;max-width:100%!important}
 body.tg-p .tg-root h2,body.tg-p .tg-root h3{break-after:avoid}
 body.tg-p .tg-root a{color:inherit!important;text-decoration:none!important}
 body.tg-p #tg-ph,body.tg-p #tg-pf{display:block!important;font-family:Helvetica,Arial,sans-serif;color:#222}
 #tg-ph .tg-lh{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #C83B2B;padding-bottom:7px;margin-bottom:18px}
 #tg-ph .tg-lh-s{display:flex;align-items:center;gap:10px;font-family:Georgia,serif;font-weight:700;font-size:15pt;line-height:1.1;color:#17324D}
 #tg-ph .tg-lh-s img{height:34px;width:auto}
 #tg-ph .tg-lh-h{display:block;font-family:Helvetica,Arial,sans-serif;font-weight:400;font-size:8pt;letter-spacing:.06em;text-transform:uppercase;color:#777;margin-top:3px}
 #tg-ph .tg-lh-d{font-size:9.5pt;color:#444;white-space:nowrap}
 #tg-ph h1{font-family:Georgia,serif;font-weight:700;font-size:20pt;line-height:1.15;color:#000;margin:0 0 8px}
 #tg-ph .tg-ex{font-family:Georgia,serif;font-size:12pt;line-height:1.4;color:#444;margin:0 0 8px}
 #tg-ph .tg-by{font-size:9.5pt;color:#555;margin:0 0 16px;padding-bottom:10px;border-bottom:1px solid #ccc}
 #tg-pf{margin-top:20px;padding-top:8px;border-top:1px solid #ccc;font-size:8.5pt!important;color:#666!important;break-inside:avoid}
 #tg-pf b{color:#222}
}
</style>`;
    const js = `<script id="tg-share-js">
(function(){
var C={"site":"${q(C.site)}","sub":"${q(C.sub)}","date":"${q(C.date)}","title":"${q(C.title)}","excerpt":"${q(C.excerpt)}","byline":"${q(C.byline)}","url":"${q(C.url)}","colo":"${q(C.colo)}"};
var bar=document.querySelector('[data-tg-share]');if(!bar)return;var root=bar.parentElement;
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var cp=bar.querySelector('.tg-sb-copy');
cp.addEventListener('click',function(){var u=cp.getAttribute('data-url'),s=cp.querySelector('span');function ok(){s.textContent='Link copiato';setTimeout(function(){s.textContent='Copia link'},2200)}
 if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(u).then(ok,function(){window.prompt('Copia il link:',u)})}else{window.prompt('Copia il link:',u)}});
var nb=bar.querySelector('.tg-sb-native');if(navigator.share){nb.hidden=false;nb.addEventListener('click',function(){navigator.share({title:nb.getAttribute('data-title'),url:nb.getAttribute('data-url')}).catch(function(){})})}
var ph=el('div');ph.id='tg-ph';var lh=el('div','tg-lh'),s=el('div','tg-lh-s');
var lg=document.querySelector('a[href="/home"] svg');if(lg){var li=lg.cloneNode(true);li.setAttribute('width','38');li.setAttribute('height','38');s.appendChild(li)}
var sn=el('span','',C.site);sn.appendChild(el('span','tg-lh-h',C.sub));s.appendChild(sn);
lh.appendChild(s);lh.appendChild(el('div','tg-lh-d',C.date));ph.appendChild(lh);
ph.appendChild(el('h1','',C.title));if(C.excerpt)ph.appendChild(el('p','tg-ex',C.excerpt));ph.appendChild(el('p','tg-by',C.byline+' · '+C.date));
var pf=el('div');pf.id='tg-pf';pf.appendChild(el('b','',C.site));pf.appendChild(document.createTextNode(C.colo));pf.appendChild(el('br'));pf.appendChild(document.createTextNode('Articolo online: '+C.url));
root.parentNode.insertBefore(ph,root);root.parentNode.insertBefore(pf,root.nextSibling);root.classList.add('tg-root');
for(var e=root.parentElement;e;e=e.parentElement){e.classList.add('tg-chain');if(e===document.body)break}
document.body.classList.add('tg-p');
bar.querySelector('.tg-sb-print').addEventListener('click',function(){window.print()});
})();
</script>`;
    return { html: b, css, js };
  };

  OSM.build = function ({ title, desc, author, canonical, ogurl, ogtype, breadcrumb, tag, h1, firma, body, back }) {
    const P = OSM.P;
    const head = P.head
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
      .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`)
      .replace(/<meta name="author" content="[^"]*">/, `<meta name="author" content="${esc(author)}">`)
      .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${esc(canonical)}">`)
      .replace(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="${ogtype}">`)
      .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(h1)}">`)
      .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`)
      .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${esc(ogurl)}">`)
      .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(h1)}">`)
      .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(desc)}">`);
    const bc = breadcrumb.map((x, i) => (i ? '    <span>›</span>\n' : '') + (x[1] ? `    <a href="${x[1]}">${esc(x[0])}</a>\n` : `    <span>${esc(x[0])}</span>\n`)).join('');
    return head + CSS + P.mid +
      `<div class="breadcrumb">\n  <div class="breadcrumb-inner">\n${bc}  </div>\n</div>\n\n<div class="page-hero">\n  <div class="page-hero-inner">\n    <div>\n      <div class="page-tag">${tag}</div>\n      <h1>${esc(h1)}</h1>\n      ${firma ? `<p class="osm-firma">${firma}</p>` : ''}\n    </div>\n  </div>\n</div>\n\n<div class="osm-wrap">\n${body}\n${back || ''}\n</div>\n\n` +
      P.foot;
  };
  OSM.pubblica = async function (src, portale, dominio, etichetta, opz) {
    opz = opz || {};
    if (!OSM.P) await OSM.init();
    portale = nomePortale(portale);
    const nascondiDominio = /troisiinsight/i.test(dominio);
    const h = await H();
    const title = dec(src.title.rendered);
    const slug = src.link.replace(/\/$/, '').split('/').pop().replace(/^\?p=/, 'analisi-');
    const ex = dec(src.excerpt.rendered.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    const desc = ex.length > 160 ? ex.slice(0, 157).replace(/\s\S*$/, '') + '…' : ex;
    const dt = data(src.date);
    const dup = await fetch(`/?rest_route=/wp/v2/pages&slug=${encodeURIComponent(slug)}&parent=${OSM.pid}&status=publish,draft,future,private&context=edit&_fields=id,link`, { headers: h }).then(r => r.json());
    if (dup.length && !opz.aggiorna) return { gia_presente: dup[0].id, link: dup[0].link };
    const pul = OSM.pulisci(src.content.rendered.replace(/TroisiInsight/g, 'Congiuntura Italia'));
    const dtx = data(src.date);
    const bar = OSM.barra({ title, url: BASE + slug + '/', portale, dt: dtx, ex: desc });
    const body = bar.css + `<article class="osm-art" data-fonte="${esc(src.link)}" data-portale="${esc(portale)}" data-etichetta="${esc(etichetta)}" data-data="${esc(src.date)}" data-sintesi="${esc(ex)}">\n${pul.html}\n<p class="osm-fonte">Analisi pubblicata da <strong>${esc(portale)}</strong>, osservatorio di Troisi Ricerche, il ${dt}. <a href="${esc(src.link)}" target="_blank" rel="noopener">Leggi l’articolo originale${nascondiDominio ? '' : ' su ' + esc(dominio)}</a>.</p>\n${bar.html}\n</article>\n` + bar.js + '\n';
    const html = OSM.build({
      title: `${title} — Dati e analisi | Osservatorio sull'Innovazione del Mezzogiorno`, desc,
      author: 'Andrea Troisi', canonical: src.link, ogurl: BASE + slug + '/', ogtype: 'article',
      breadcrumb: [['Home', '/home'], ['Notizie', '/notizie'], ['Dati e analisi', '/notizie/dati-e-analisi/'], [title, '']],
      tag: ICO + ' Dati e analisi · ' + esc(etichetta), h1: title,
      firma: `a cura di&nbsp;<strong>Andrea Troisi</strong>&nbsp;· ${esc(portale)} · ${dt}`,
      body, back: `<a class="osm-back" href="/notizie/dati-e-analisi/">← Tutte le analisi</a>`
    });
    const dati = { title, slug, parent: OSM.pid, status: 'publish', template: 'osm-blank.php', content: html, date: src.date, comment_status: 'closed', ping_status: 'closed' };
    const url = dup.length ? `/?rest_route=/wp/v2/pages/${dup[0].id}` : '/?rest_route=/wp/v2/pages';
    const r = await fetch(url, { method: 'POST', headers: h, body: JSON.stringify(dati) }).then(r => r.json());
    if (!r.id) throw new Error('Pubblicazione non riuscita: ' + (r.message || JSON.stringify(r)));
    return { id: r.id, link: r.link, aggiornato: !!dup.length, frasi_tolte: pul.tolte };
  };
  OSM.elenco = async function () {
    if (!OSM.P) await OSM.init();
    const h = await H();
    let ch = [];
    for (let pg = 1; pg < 50; pg++) {
      const r = await fetch(`/?rest_route=/wp/v2/pages&parent=${OSM.pid}&per_page=100&page=${pg}&status=publish&context=edit&_fields=id,slug,link,title,content`, { headers: h });
      if (!r.ok) break;
      const j = await r.json(); ch = ch.concat(j);
      if (j.length < 100) break;
    }
    return ch.map(p => {
      const g = k => { const m = p.content.raw.match(new RegExp(`data-${k}="([^"]*)"`)); return m ? dec(m[1]) : ''; };
      return { id: p.id, link: p.link, slug: p.slug, title: dec(p.title.raw || p.title.rendered), fonte: g('fonte'), portale: g('portale'), etichetta: g('etichetta'), data: g('data'), sintesi: g('sintesi') };
    }).sort((a, b) => (b.data || '').localeCompare(a.data || ''));
  };
  OSM.aggiornaIndice = async function () {
    const items = await OSM.elenco();
    const h = await H();
    const cards = items.map(i => `<a class="osm-dati-card" href="${i.link.replace('https://www.osservatoriomezzogiorno.net', '')}">\n  <div class="k">${esc(i.etichetta)}</div>\n  <h2>${esc(i.title)}</h2>\n  <p>${esc(i.sintesi.length > 230 ? i.sintesi.slice(0, 227).replace(/\s\S*$/, '') + '…' : i.sintesi)}</p>\n  <div class="d">${esc(i.portale)} · ${data(i.data)}</div>\n</a>`).join('\n');
    const intro = `<p class="osm-dati-intro">Le analisi su dati ufficiali (ISTAT, Eurostat, Banca d'Italia, BCE) pubblicate dagli osservatori di Troisi Ricerche su innovazione, digitale, imprese, lavoro, competenze e territorio. Ogni analisi riporta il link all'articolo originale.</p>`;
    const html = OSM.build({
      title: "Dati e analisi — Osservatorio sull'Innovazione del Mezzogiorno",
      desc: 'Analisi su dati ufficiali su innovazione, digitale, imprese, competenze e territorio, dagli osservatori di Troisi Ricerche.',
      author: "Osservatorio sull'Innovazione del Mezzogiorno", canonical: BASE, ogurl: BASE, ogtype: 'website',
      breadcrumb: [['Home', '/home'], ['Notizie', '/notizie'], ['Dati e analisi', '']],
      tag: ICO + ' Dati e analisi', h1: 'Dati e analisi', firma: '',
      body: intro + `<div class="osm-dati-grid">\n${cards}\n</div>`
    });
    const r = await fetch(`/?rest_route=/wp/v2/pages/${OSM.pid}`, { method: 'POST', headers: h, body: JSON.stringify({ content: html }) }).then(r => r.json());
    return { aggiornato: !!r.id, schede: items.length };
  };
  window.OSM = OSM;
  return 'OSM pronto';
})();
