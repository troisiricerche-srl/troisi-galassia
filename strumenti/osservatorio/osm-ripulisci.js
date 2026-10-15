// Trasforma l'HTML di una pagina dell'Osservatorio: emoji → icone lineari (OSMI), «TroisiInsight» → «Congiuntura Italia».
// Richiede osm-icone.js. Uso: OSMR.trasforma(html) → {html, emoji, ti}
(() => {
  const CSS = '<style id="osm-icone">.osm-i{width:1em;height:1em;display:inline-block;vertical-align:-.14em;flex:none;overflow:visible}'
   + '.news-thumb{color:#fff}.news-thumb .osm-i{width:44px;height:44px;stroke-width:1.5}'
   + '.nc-thumb .osm-i{color:rgba(255,255,255,.92);stroke-width:1.4}'
   + '.cb-ico{color:#fff}'
   + '.dip-ico,.doc-ico,.focus-ico,.ac-ico{color:var(--rosso,#c0392b)}'
   + '.dip-ico{display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:12px;font-size:26px;background:rgba(192,57,43,.08)}'
   + '.doc-ico{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:10px;font-size:24px;background:rgba(192,57,43,.08)}'
   + '.page-tag .osm-i{margin-right:.15em}</style>';
  const EMO = /\p{Extended_Pictographic}️?/gu;
  const SKIP = /^<(script|style|title|textarea)\b/i;
  function trasforma(html) {
    let emoji = 0, ignote = new Set();
    const parti = html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<title[\s\S]*?<\/title>|<textarea[\s\S]*?<\/textarea>|<!--[\s\S]*?-->|<[^>]+>)/i);
    for (let i = 0; i < parti.length; i++) {
      const t = parti[i];
      if (!t || t[0] === '<') continue;
      parti[i] = t.replace(EMO, m => {
        const base = m.replace(/️/g, '');
        if ('™©®'.includes(base)) return m;
        const s = OSMI.byEmoji(base);
        if (!s) { ignote.add(base); return m; }
        emoji++; return s;
      });
    }
    let out = parti.join('');
    const ti = (out.match(/TroisiInsight/g) || []).length;
    out = out.replace(/Leggi l’articolo originale su troisiinsight\.it/g, 'Leggi l’articolo originale')
             .replace(/Leggi l'articolo originale su troisiinsight\.it/g, "Leggi l'articolo originale")
             .replace(/TroisiInsight/g, 'Congiuntura Italia');
    out = out.replace(/<style id="osm-icone">[\s\S]*?<\/style>/, '');
    const h = out.indexOf('</head>');
    if (h > -1) out = out.slice(0, h) + CSS + out.slice(h);
    return { html: out, emoji, ti, ignote: [...ignote] };
  }
  window.OSMR = { trasforma, CSS };
})();
