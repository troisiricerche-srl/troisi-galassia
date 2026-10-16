// Deposito su Zenodo (InvenioRDM) dalla scheda zenodo.org del browser di Claude, con la sessione di Andrea.
// Niente token: usa i cookie della sessione e il CSRF. Funzioni:
//   await ZU.check()                 utente collegato?
//   await ZU.affil('Bari')           cerca l'id dell'affiliazione (ROR) nel vocabolario Zenodo
//   await ZU.bozza(a)                crea la bozza con i metadati e prenota il DOI -> {id, doi}
//   await ZU.file(id, nome, blob)    carica il PDF nella bozza
//   await ZU.pubblica(id)            PUBBLICA (DOI definitivo): solo dopo il «pubblica» di Andrea
//   await ZU.bozze()                 elenco delle bozze dell'utente
(() => {
  const ZU = {};
  const csrf = () => (document.cookie.match(/csrftoken=([^;]+)/) || [])[1] || '';
  const H = () => ({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRFToken': csrf() });
  const j = async r => { const t = await r.text(); let b; try { b = JSON.parse(t); } catch (e) { b = t; } if (!r.ok) throw new Error(r.status + ' ' + (typeof b === 'string' ? b.slice(0, 300) : JSON.stringify(b).slice(0, 600))); return b; };
  const dec = s => { const t = document.createElement('textarea'); t.innerHTML = s || ''; return t.value; };
  const txt = h => dec(String(h || '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
  ZU.ORCID = '0009-0006-2618-2254';
  ZU.affiliazioni = [{ name: 'Università degli Studi di Bari Aldo Moro' }, { name: 'Troisi Ricerche' }];
  ZU.community = null; // id della community, se creata

  ZU.check = async () => j(await fetch('/api/user/records?size=1', { headers: { Accept: 'application/json' } })).then(b => ({ ok: true, records: b.hits.total }));
  ZU.affil = async q => (await j(await fetch('/api/affiliations?q=' + encodeURIComponent(q) + '&size=5', { headers: { Accept: 'application/json' } }))).hits.hits.map(h => ({ id: h.id, name: h.name, country: h.country }));

  const KW = {
    'TroisiInsight': ['economia italiana', 'Eurostat', 'ISTAT'],
    'CustomerPA™': ['pubblica amministrazione', 'servizi pubblici', 'customer satisfaction'],
    'Benessere Organizzativo': ['benessere organizzativo', 'lavoro', 'condizioni di lavoro'],
    'Governance Finanziaria': ['imprese', 'governance', 'ESG', 'finanza d\'impresa'],
    'DigitalizzazionePA': ['digitalizzazione', 'pubblica amministrazione', 'competenze digitali'],
    'Consulenza Internazionalizzazione': ['export', 'internazionalizzazione', 'commercio estero', 'PMI'],
    'Dibattito Pubblico': ['partecipazione', 'infrastrutture', 'politiche pubbliche'],
    'Benessere Digitale Giovani': ['giovani', 'benessere digitale', 'competenze digitali'],
    'Mappatura delle Competenze': ['competenze', 'mercato del lavoro', 'istruzione']
  };

  ZU.metadati = function (a) {
    const titolo = txt(a.title), sint = txt(a.excerpt);
    const desc = `<p>${sint.replace(/</g, '&lt;')}</p><p>Analisi su dati ufficiali pubblicata originariamente da <strong>${a.portale}</strong> (Troisi Ricerche) il ${a.date.slice(0, 10)}: <a href="${a.link}">${a.link}</a>.</p>`;
    const kw = ['Italia', 'statistiche ufficiali', 'Troisi Ricerche', a.portale].concat(KW[a.portale] || []);
    if (/Mezzogiorno|Sud|Puglia|region/i.test(titolo + ' ' + sint)) kw.push('Mezzogiorno', 'divari territoriali');
    return {
      access: { record: 'public', files: 'public' },
      files: { enabled: true },
      metadata: {
        resource_type: { id: 'publication-report' },
        title: titolo,
        publication_date: a.date.slice(0, 10),
        creators: [{ person_or_org: { type: 'personal', given_name: 'Andrea', family_name: 'Troisi', identifiers: [{ scheme: 'orcid', identifier: ZU.ORCID }] }, affiliations: ZU.affiliazioni }],
        description: desc,
        languages: [{ id: 'ita' }],
        rights: [{ id: 'cc-by-4.0' }],
        subjects: [...new Set(kw)].map(s => ({ subject: s })),
        publisher: 'Zenodo',
        related_identifiers: [{ identifier: a.link, scheme: 'url', relation_type: { id: 'isvariantformof' }, resource_type: { id: 'publication-report' } }]
      }
    };
  };

  ZU.bozza = async function (a) {
    const d = await j(await fetch('/api/records', { method: 'POST', headers: H(), body: JSON.stringify(ZU.metadati(a)) }));
    const p = await j(await fetch(`/api/records/${d.id}/draft/pids/doi`, { method: 'POST', headers: H() }));
    return { id: d.id, doi: p.pids && p.pids.doi && p.pids.doi.identifier };
  };

  ZU.file = async function (id, nome, blob) {
    await j(await fetch(`/api/records/${id}/draft/files`, { method: 'POST', headers: H(), body: JSON.stringify([{ key: nome }]) }));
    await j(await fetch(`/api/records/${id}/draft/files/${encodeURIComponent(nome)}/content`, { method: 'PUT', headers: { 'Content-Type': 'application/octet-stream', 'X-CSRFToken': csrf() }, body: blob }));
    return j(await fetch(`/api/records/${id}/draft/files/${encodeURIComponent(nome)}/commit`, { method: 'POST', headers: H() }));
  };

  ZU.pubblica = async id => j(await fetch(`/api/records/${id}/draft/actions/publish`, { method: 'POST', headers: H() }));
  ZU.bozze = async () => (await j(await fetch('/api/user/records?size=300&is_published=false&sort=newest', { headers: { Accept: 'application/json' } }))).hits.hits.map(h => ({ id: h.id, titolo: h.metadata && h.metadata.title, doi: h.pids && h.pids.doi && h.pids.doi.identifier }));
  window.ZU = ZU;
  return 'ZU pronto';
})();
