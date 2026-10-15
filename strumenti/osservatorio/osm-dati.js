// Strumento «Dati e analisi» di osservatoriomezzogiorno.net
// Si incolla in javascript_tool in una scheda aperta su https://www.osservatoriomezzogiorno.net/wp-admin/
// (sessione WordPress «redazione»). Definisce window.OSM con:
//   await OSM.init()                                   carica il modello di pagina (header, menu, footer del sito)
//   await OSM.pubblica(src, portale, dominio, etichetta) crea la pagina dell'articolo (figlia di «Dati e analisi»)
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
  OSM.pubblica = async function (src, portale, dominio, etichetta) {
    if (!OSM.P) await OSM.init();
    const h = await H();
    const title = dec(src.title.rendered);
    const slug = src.link.replace(/\/$/, '').split('/').pop().replace(/^\?p=/, 'analisi-');
    const ex = dec(src.excerpt.rendered.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    const desc = ex.length > 160 ? ex.slice(0, 157).replace(/\s\S*$/, '') + '…' : ex;
    const dt = data(src.date);
    const dup = await fetch(`/?rest_route=/wp/v2/pages&slug=${encodeURIComponent(slug)}&parent=${OSM.pid}&status=publish,draft,future,private&context=edit&_fields=id,link`, { headers: h }).then(r => r.json());
    if (dup.length) return { gia_presente: dup[0].id, link: dup[0].link };
    const body = `<article class="osm-art" data-fonte="${esc(src.link)}" data-portale="${esc(portale)}" data-etichetta="${esc(etichetta)}" data-data="${esc(src.date)}" data-sintesi="${esc(ex)}">\n${src.content.rendered}\n<p class="osm-fonte">Analisi pubblicata da <strong>${esc(portale)}</strong>, osservatorio di Troisi Ricerche, il ${dt}. <a href="${esc(src.link)}" target="_blank" rel="noopener">Leggi l’articolo originale su ${esc(dominio)}</a>.</p>\n</article>\n`;
    const html = OSM.build({
      title: `${title} — Dati e analisi | Osservatorio sull'Innovazione del Mezzogiorno`, desc,
      author: `${portale} · Troisi Ricerche`, canonical: src.link, ogurl: BASE + slug + '/', ogtype: 'article',
      breadcrumb: [['Home', '/home'], ['Notizie', '/notizie'], ['Dati e analisi', '/notizie/dati-e-analisi/'], [title, '']],
      tag: '📊 Dati e analisi · ' + esc(etichetta), h1: title,
      firma: `a cura di&nbsp;<strong>${esc(portale)}</strong>&nbsp;· Troisi Ricerche · ${dt}`,
      body, back: `<a class="osm-back" href="/notizie/dati-e-analisi/">← Tutte le analisi</a>`
    });
    const r = await fetch('/?rest_route=/wp/v2/pages', { method: 'POST', headers: h, body: JSON.stringify({ title, slug, parent: OSM.pid, status: 'publish', template: 'osm-blank.php', content: html, comment_status: 'closed', ping_status: 'closed' }) }).then(r => r.json());
    if (!r.id) throw new Error('Pubblicazione non riuscita: ' + (r.message || JSON.stringify(r)));
    return { id: r.id, link: r.link };
  };
  OSM.elenco = async function () {
    if (!OSM.P) await OSM.init();
    const h = await H();
    const ch = await fetch(`/?rest_route=/wp/v2/pages&parent=${OSM.pid}&per_page=100&status=publish&context=edit&_fields=id,slug,link,title,content`, { headers: h }).then(r => r.json());
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
      tag: '📊 Dati e analisi', h1: 'Dati e analisi', firma: '',
      body: intro + `<div class="osm-dati-grid">\n${cards}\n</div>`
    });
    const r = await fetch(`/?rest_route=/wp/v2/pages/${OSM.pid}`, { method: 'POST', headers: h, body: JSON.stringify({ content: html }) }).then(r => r.json());
    return { aggiornato: !!r.id, schede: items.length };
  };
  window.OSM = OSM;
  return 'OSM pronto';
})();
