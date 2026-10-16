// PDF «working paper» delle analisi della galassia Troisi Ricerche, generati NEL BROWSER con pdfmake
// (il container non raggiunge i siti, il browser sì). Uso in javascript_tool, su una pagina che può
// caricare script da cdnjs (es. zenodo.org o osservatoriomezzogiorno.net):
//   (incolla questo file)  ;  await ZP.init()  ;  const blob = await ZP.pdf(articolo)
// articolo = {portale, sito, id, date, title, excerpt, content, link, doi?}
(() => {
  const ORCID = '0009-0006-2618-2254';
  const AFF = 'Università degli Studi di Bari Aldo Moro (UNIBA) · Troisi Ricerche S.r.l., Bari';
  const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  const BLU = '#0a1628', ORO = '#c9981a', GRIGIO = '#5b6676', CHIARO = '#f4f6f9';
  const ZP = {};
  const dec = s => { const t = document.createElement('textarea'); t.innerHTML = s || ''; return t.value; };
  const txt = h => dec(String(h || '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
  const dataIt = s => { const d = new Date(s.slice(0, 19)); return `${d.getDate()} ${MESI[d.getMonth()]} ${d.getFullYear()}`; };
  const load = src => new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); });

  ZP.init = async function () {
    if (!window.pdfMake) {
      await load('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/pdfmake.min.js');
      await load('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/vfs_fonts.min.js');
    }
    if (!ZP.logo && ZP.logoDataUrl) ZP.logo = ZP.logoDataUrl;
    return { pdfmake: !!window.pdfMake, logo: !!ZP.logo };
  };

  // frasi promozionali su Troisi Ricerche: via dai paragrafi (non da didascalie e riquadri metodo)
  function pulisci(root) {
    root.querySelectorAll('p, li').forEach(p => {
      if (p.closest('figcaption, aside, .ti-box, figure')) return;
      if (!/Troisi Ricerche/i.test(p.textContent)) return;
      const frasi = p.innerHTML.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú«“"])/);
      const ten = frasi.filter(f => !/Troisi Ricerche/i.test(txt(f)));
      if (!txt(ten.join(' '))) p.remove(); else p.innerHTML = ten.join(' ');
    });
  }

  // testo in linea con grassetti, corsivi e link
  function runs(node, st = {}) {
    const out = [];
    node.childNodes.forEach(n => {
      if (n.nodeType === 3) { const t = n.textContent.replace(/\s+/g, ' '); if (t) out.push(Object.assign({ text: t }, st)); return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName.toLowerCase();
      if (tag === 'br') { out.push({ text: '\n' }); return; }
      if (['svg', 'script', 'style', 'iframe', 'img'].includes(tag)) return;
      const s2 = Object.assign({}, st);
      if (tag === 'strong' || tag === 'b') s2.bold = true;
      if (tag === 'em' || tag === 'i') s2.italics = true;
      if (tag === 'sup') { s2.sup = true; }
      if (tag === 'a' && n.getAttribute('href') && /^https?:/.test(n.getAttribute('href'))) { s2.link = n.getAttribute('href'); s2.color = '#1f4e8c'; }
      out.push(...runs(n, s2));
    });
    return out;
  }

  function svgNode(svg) {
    const c = svg.cloneNode(true);
    const vb = (c.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
    if (vb.length === 4 && !c.getAttribute('width')) { c.setAttribute('width', vb[2]); c.setAttribute('height', vb[3]); }
    c.removeAttribute('style');
    let s = new XMLSerializer().serializeToString(c);
    s = s.replace(/font-family="[^"]*"/g, '');
    const w = Math.min(440, vb.length === 4 ? vb[2] * 0.62 : 440);
    return { svg: s, width: w, alignment: 'center', margin: [0, 4, 0, 4] };
  }

  function blocchi(el, out) {
    el.childNodes.forEach(n => {
      if (n.nodeType === 3) { const t = n.textContent.trim(); if (t) out.push({ text: t, style: 'p' }); return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName.toLowerCase(), cls = n.className && n.className.baseVal === undefined ? n.className : '';
      if (['style', 'script', 'noscript', 'iframe'].includes(tag)) return;
      if (/flourish-embed/.test(cls)) { out.push({ text: 'Grafico interattivo disponibile nella versione online dell’analisi.', style: 'nota' }); return; }
      if (/tg-share|ti-share/.test(cls)) return;
      if (tag === 'h2') { out.push({ text: txt(n.innerHTML), style: 'h2' }); return; }
      if (tag === 'h3' || tag === 'h4') { out.push({ text: txt(n.innerHTML), style: 'h3' }); return; }
      if (tag === 'svg') { out.push(svgNode(n)); return; }
      if (tag === 'p') {
        const svgs = n.querySelectorAll('svg');
        if (svgs.length) { svgs.forEach(s => out.push(svgNode(s))); const r = runs(n); if (r.some(x => x.text.trim())) out.push({ text: r, style: 'p' }); return; }
        const r = runs(n); if (r.some(x => x.text.trim())) out.push({ text: r, style: 'p' }); return;
      }
      if (/ti-kpi/.test(cls)) {
        const cells = [...n.children].map(d => ({ stack: [{ text: txt((d.querySelector('b') || d).innerHTML), style: 'kpiN' }, { text: txt((d.querySelector('span') || {}).innerHTML || ''), style: 'kpiL' }], fillColor: CHIARO, margin: [6, 5, 6, 5] }));
        if (cells.length) out.push({ table: { widths: cells.map(() => '*'), body: [cells] }, layout: { hLineColor: '#ffffff', vLineColor: '#ffffff', hLineWidth: () => 3, vLineWidth: () => 3 }, margin: [0, 4, 0, 10] });
        return;
      }
      if (tag === 'figure' || /ti-chart/.test(cls)) {
        const st = [];
        const t = n.querySelector('.ti-chart-title'); if (t) st.push({ text: txt(t.innerHTML), style: 'figT' });
        const s = n.querySelector('.ti-chart-sub'); if (s) st.push({ text: txt(s.innerHTML), style: 'figS' });
        const lg = n.querySelector('.ti-legend');
        if (lg) { const cols = []; lg.querySelectorAll('span').forEach(sp => { const i = sp.querySelector('i'); const col = i && (i.getAttribute('style') || '').match(/background:\s*([^;]+)/); cols.push({ canvas: [{ type: 'rect', x: 0, y: 2.5, w: 7, h: 7, r: 1, color: col ? col[1].trim() : BLU }], width: 10 }); cols.push({ text: txt(sp.innerHTML), width: 'auto', fontSize: 7.6, color: GRIGIO, margin: [0, 0, 10, 0] }); }); st.push({ columns: cols, columnGap: 0, margin: [0, 1, 0, 3] }); }
        n.querySelectorAll('svg').forEach(sv => st.push(svgNode(sv)));
        n.querySelectorAll('img').forEach(() => st.push({ text: '[immagine nella versione online]', style: 'nota' }));
        const fc = n.querySelector('figcaption'); if (fc) st.push({ text: runs(fc), style: 'cap' });
        if (!t && !n.querySelector('svg') && !fc) { blocchi(n, out); return; }
        out.push({ stack: st, unbreakable: st.length < 6, margin: [0, 6, 0, 10] });
        return;
      }
      if (tag === 'table') {
        const body = [];
        n.querySelectorAll('tr').forEach((tr, i) => { const row = [...tr.children].map(c => ({ text: runs(c), bold: c.tagName === 'TH' || undefined, fontSize: 8.3 })); if (row.length) body.push(row); });
        const w = Math.max(...body.map(r => r.length)); body.forEach(r => { while (r.length < w) r.push(''); });
        if (body.length) out.push({ table: { headerRows: n.querySelector('th') ? 1 : 0, widths: Array(w).fill('*'), body }, layout: 'lightHorizontalLines', margin: [0, 4, 0, 10] });
        return;
      }
      if (tag === 'aside' || /ti-box/.test(cls)) {
        const st = []; blocchi(n, st);
        st.forEach(b => { if (b.style === 'p') b.style = 'box'; });
        out.push({ table: { widths: ['*'], body: [[{ stack: st, fillColor: CHIARO, margin: [8, 6, 8, 2] }]] }, layout: { hLineWidth: () => 0, vLineWidth: i => (i === 0 ? 2.5 : 0), vLineColor: () => ORO }, margin: [0, 8, 0, 8] });
        return;
      }
      if (tag === 'strong' && n.parentElement && /ti-box/.test(n.parentElement.className)) { out.push({ text: txt(n.innerHTML), bold: true, fontSize: 9, color: BLU, margin: [0, 0, 0, 3] }); return; }
      if (tag === 'ul' || tag === 'ol') { const it = [...n.children].map(li => ({ text: runs(li) })); out.push({ [tag]: it, style: 'p' }); return; }
      if (tag === 'blockquote') { out.push({ text: runs(n), style: 'p', italics: true, margin: [16, 0, 16, 8] }); return; }
      blocchi(n, out);
    });
  }

  ZP.doc = function (a) {
    const titolo = txt(a.title), dt = dataIt(a.date), anno = a.date.slice(0, 4), doi = a.doi || '';
    const sint = txt(a.excerpt);
    const d = new DOMParser().parseFromString('<div id="r">' + a.content + '</div>', 'text/html');
    const r = d.getElementById('r'); pulisci(r);
    const corpo = []; blocchi(r, corpo);
    const cit = `Troisi, A. (${anno}). ${titolo}. ${a.portale}, Troisi Ricerche. ` + (doi ? `https://doi.org/${doi}` : a.link);
    const band = [{ stack: [ZP.logo ? { image: ZP.logo, height: 26, width: 26 * (ZP.logoRatio || 4) } : { text: 'Troisi Ricerche', color: '#fff', bold: true, fontSize: 13 }], margin: [8, 7, 0, 6] },
      { stack: [{ text: a.portale.toUpperCase(), color: '#e8c46a', bold: true, fontSize: 8, characterSpacing: 0.8 }, { text: 'Analisi su dati ufficiali · Troisi Ricerche', color: '#cfd6df', fontSize: 7.5 }], alignment: 'right', margin: [0, 9, 8, 6] }];
    return {
      pageSize: 'A4', pageMargins: [51, 48, 51, 52],
      info: { title: titolo, author: 'Andrea Troisi', subject: a.portale + ' – Troisi Ricerche', keywords: 'Troisi Ricerche, ' + a.portale + ', dati ufficiali, Italia' },
      footer: (cp, pc) => ({ columns: [{ text: 'Andrea Troisi · UNIBA · Troisi Ricerche · CC BY 4.0', fontSize: 7, color: '#7a8594' }, { text: cp + ' / ' + pc, alignment: 'right', fontSize: 7, color: '#7a8594' }], margin: [51, 18, 51, 0] }),
      content: [
        { table: { widths: ['*', 'auto'], body: [band.map(c => Object.assign(c, { fillColor: BLU }))] }, layout: 'noBorders' },
        { text: ('Analisi · ' + a.portale).toUpperCase(), color: '#8a6d1a', bold: true, fontSize: 7.5, characterSpacing: 0.8, margin: [0, 14, 0, 4] },
        { text: titolo, style: 'tit' },
        { text: [{ text: 'Andrea Troisi', bold: true }, ' · ORCID ' + ORCID], fontSize: 9.5, margin: [0, 0, 0, 1] },
        { text: AFF, fontSize: 8, color: GRIGIO, margin: [0, 0, 0, 8] },
        { table: { widths: ['*', '*'], body: [
          [{ text: [{ text: 'Data: ', bold: true }, dt] }, { text: [{ text: 'Licenza: ', bold: true }, 'CC BY 4.0'] }],
          [{ text: [{ text: 'DOI: ', bold: true }, doi || '—'] }, { text: [{ text: 'Lingua: ', bold: true }, 'italiano'] }],
          [{ text: [{ text: 'Pubblicato su: ', bold: true }, { text: a.link, link: a.link, color: '#1f4e8c' }], colSpan: 2 }, '']] },
          layout: { hLineWidth: (i, n) => (i === 0 || i === n.table.body.length ? 0.6 : 0), vLineWidth: () => 0, hLineColor: () => '#d5dbe3', paddingLeft: () => 0, paddingTop: () => 2, paddingBottom: () => 2 }, fontSize: 7.8, color: '#3d4756', margin: [0, 0, 0, 10] },
        sint ? { table: { widths: ['*'], body: [[{ stack: [{ text: 'SINTESI', bold: true, fontSize: 7.5, color: BLU, characterSpacing: 0.8, margin: [0, 0, 0, 2] }, { text: sint, fontSize: 9.5 }], fillColor: CHIARO, margin: [8, 6, 8, 6] }]] }, layout: { hLineWidth: () => 0, vLineWidth: i => (i === 0 ? 2.5 : 0), vLineColor: () => ORO }, margin: [0, 0, 0, 12] } : '',
        ...corpo,
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 493, y2: 0, lineWidth: 0.6, lineColor: '#d5dbe3' }], margin: [0, 14, 0, 6] },
        { text: [{ text: 'Citazione consigliata: ', bold: true, color: BLU }, cit], fontSize: 7.8, color: '#3d4756', margin: [0, 0, 0, 3] },
        { text: `© ${anno} Andrea Troisi, Troisi Ricerche. Testo e grafici sono rilasciati con licenza Creative Commons Attribuzione 4.0 Internazionale (CC BY 4.0): https://creativecommons.org/licenses/by/4.0/deed.it`, fontSize: 7.3, color: '#5b6676' }
      ],
      styles: {
        tit: { fontSize: 17, bold: true, color: BLU, lineHeight: 1.12, margin: [0, 0, 0, 8] },
        h2: { fontSize: 12, bold: true, color: BLU, margin: [0, 10, 0, 4] },
        h3: { fontSize: 10.5, bold: true, color: BLU, margin: [0, 8, 0, 3] },
        p: { fontSize: 9.6, lineHeight: 1.28, margin: [0, 0, 0, 6], alignment: 'justify' },
        box: { fontSize: 8.4, lineHeight: 1.22, margin: [0, 0, 0, 4] },
        kpiN: { fontSize: 13, bold: true, color: BLU }, kpiL: { fontSize: 7.3, color: GRIGIO },
        figT: { fontSize: 9.6, bold: true, color: BLU }, figS: { fontSize: 7.6, color: GRIGIO, margin: [0, 1, 0, 3] },
        cap: { fontSize: 7.2, color: GRIGIO, margin: [0, 3, 0, 0] }, nota: { fontSize: 8, italics: true, color: GRIGIO, margin: [0, 2, 0, 6] }
      },
      defaultStyle: { font: 'Roboto', color: '#1d2733' }
    };
  };

  ZP.pdf = a => new Promise(ok => window.pdfMake.createPdf(ZP.doc(a)).getBlob(ok));
  window.ZP = ZP;
  return 'ZP pronto';
})();
