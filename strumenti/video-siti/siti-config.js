// Configurazioni dei video brevi per gli altri siti della galassia. Testi presi dalle home dei siti.
const fs = require('fs'); const path = require('path');
module.exports = (DIR) => {
  const mus = k => JSON.parse(fs.readFileSync(path.join(DIR, 'musica', k + '.json'))).beats;
  const FOTO = f => path.join(DIR, 'foto', f), SITO = f => path.join(DIR, 'siti', f);
  const TR = { A: { file: 'A-itt-v5.wav', off: 0, dur: 40.5, fine: 31.1 }, C: { file: 'C-mh-37.wav', off: 0, dur: 37, fine: 27.5 }, B: { file: 'B-eit.wav', off: 2.0, dur: 36, fine: 31 }, M: { file: 'M-mh61.wav', off: 0, dur: 37, fine: 29.8 } };
  const JS = { A: 'A', C: 'C', B: 'B', M: 'M' };
  // costruisce la sequenza: ogni scena dura nb battiti; la chiusura prende il resto
  function seq(k, base, lista) { const t = TR[k], b = mus(JS[k]).map(v => v - t.off).filter(v => v > 0.2); let i = 0, da = 0; const scene = []; const jf = b.findIndex(v => v >= t.fine - .05); let tot = lista.reduce((q, s) => q + s.nb, 0); lista = lista.map(s => ({ ...s })); for (let r = 0; tot < jf; r++, tot++) lista[r % lista.length].nb++;
    for (const s of lista) { const j = Math.min(b.length - 1, i + s.nb); let a = b[j]; if (a > t.fine) a = t.fine; scene.push({ ...s, da, a }); da = a; i = j; if (a >= t.fine) break; }
    scene.push({ tipo: 'chiusura', da, a: t.dur, dissolvi: .25 }); return { musica: t.file, off: t.off, dur: t.dur, ...base, scene }; }
  const tema = (c1, c2, fondo, alone) => ({ c1, c2, fondo, alone, alto: c1, medio: c2, testoPill: fondo });
  return {
    troisiricerche: () => seq('A', { tema: tema('#0066CC', '#F5A623', '#00264D', 'rgba(0,102,204,.4)'), sito: { nome: 'Troisi Ricerche', sigla: 'TR', dominio: 'troisiricerche.net', claim: 'Istituto di ricerca statistica · Bari · Roma · Milano' } }, [
      { tipo: 'gancio', nb: 10, clip: 'tr-senato.mp4', inp: 0, testo: 'Dal 2006 trasformiamo i dati in conoscenza per chi decide.', ultimaColorata: true },
      { clip: 'tr-sis.mp4', inp: 0, tipo: 'passi', nb: 12, kicker: 'Cosa facciamo', righe: ['Per enti pubblici,', { t: 'imprese e territori.', c: 1 }], passi: [['Indagini', 'Ricerche di mercato, sociali e sondaggi di opinione'], ['Piattaforme', 'CustomerPA™, DELFI, TIP e gli strumenti per la PA'], ['Osservatori', 'Analisi ogni settimana su dati ufficiali']] },
      { tipo: 'foto', nb: 8, f: FOTO('forum-2026.jpg'), kicker: 'Forum dei Pubblici Ufficiali · Bari, 2026', righe: ['Nei luoghi', { t: 'dove si decide.', c: 1 }] },
      { clip: 'tr-forum.mp4', inp: 0, tipo: 'badge', nb: 8, kicker: 'Qualità e iscrizioni', righe: ['Un metodo', { t: 'certificato.', c: 1 }], badge: ['TÜV ISO 9001:2015', 'Accreditato MIUR', 'SIS', 'Confindustria'] },
      { tipo: 'sito', nb: 10, f: SITO('00-troisiricerche.net.jpg'), riga: 'Indagini, piattaforme e osservatori della galassia Troisi Ricerche.' } ]),
    ildatoetratto: () => seq('C', { tema: tema('#7C5CFF', '#C4B5FD', '#0A0F1F', 'rgba(124,92,255,.38)'), sito: { nome: 'Il dato è tratto™', sigla: 'DT', dominio: 'ildatoetratto.it', claim: "Ogni mattina un dato ufficiale sull'Italia" } }, [
      { tipo: 'gancio', nb: 9, clip: 'dt-laptop.mp4', inp: 0, lento: 1.2, testo: "Ogni mattina un dato ufficiale sull'Italia.", ultimaColorata: true },
      { clip: 'dt-dati.mp4', inp: 0, tipo: 'numero', nb: 9, kicker: 'Il dato', val: 13.3, dec: 1, suf: '%', testo: 'dei giovani italiani tra 15 e 29 anni non lavora e non studia (2025)', fonte: 'Eurostat' },
      { clip: 'dt-cuffie.mp4', inp: 0, tipo: 'passi', nb: 10, kicker: 'Due modi per riceverlo', righe: ['Scegli', { t: 'dove leggerci.', c: 1 }], passi: [['WhatsApp', 'Il dato sul telefono, appena esce'], ['Email', 'Ogni due settimane, gratis, senza pubblicità']] },
      { tipo: 'sito', nb: 10, f: SITO('02-ildatoetratto.it.jpg'), riga: 'Le analisi degli osservatori di Troisi Ricerche, in un unico posto.' } ]),
    delfi: () => seq('B', { tema: tema('#F97316', '#FDBA74', '#14142B', 'rgba(249,115,22,.32)'), sito: { nome: 'DELFI', sigla: 'DF', dominio: 'delfiweb.it', claim: 'I dati di tutti i comuni italiani' } }, [
      { tipo: 'gancio', nb: 12, clip: 'de-mappa.mp4', inp: 0, testo: 'Quanto conosci davvero il tuo comune?', ultimaColorata: true },
      { clip: 'de-bari.mp4', inp: 0, tipo: 'numero', nb: 12, kicker: 'Tutti i comuni', val: 7896, dec: 0, suf: '', testo: 'comuni italiani, con dati verificati da fonti istituzionali', fonte: 'ISTAT, elenco dei comuni italiani' },
      { clip: 'de-cattedrale.mp4', inp: 0, tipo: 'badge', nb: 12, kicker: 'Cosa trovi', righe: ['Dati reali', { t: 'contro percezioni.', c: 1 }], badge: ['Popolazione', 'Reddito', 'Raccolta differenziata', 'Rischio sismico', 'Turismo', 'PNRR', 'Scuole', 'Sanità'] },
      { tipo: 'sito', nb: 14, f: SITO('05-delfiweb.it.jpg'), riga: 'Cerca un comune e confrontalo con gli altri.' } ]),
    troisiinsight: () => seq('M', { tema: tema('#E8A020', '#FCD34D', '#0F2238', 'rgba(232,160,32,.3)'), sito: { nome: 'TroisiInsight', sigla: 'TI', dominio: 'troisiinsight.it', claim: "I dati che raccontano l'Italia che cambia" } }, [
      { tipo: 'gancio', nb: 10, clip: 'ti-mic.mp4', inp: 0, testo: "I dati che raccontano l'Italia che cambia.", ultimaColorata: true },
      { clip: 'ti-dash.mp4', inp: 0, tipo: 'numero', nb: 10, kicker: 'Lavoro', val: 6.2, dec: 1, suf: '%', testo: 'il tasso di disoccupazione in Italia ad agosto 2026, in risalita', fonte: 'ISTAT, dati provvisori' },
      { clip: 'ti-schermo.mp4', inp: 0, tipo: 'passi', nb: 12, kicker: 'Il laboratorio di analisi', righe: ['Analisi, report', { t: 'e dashboard.', c: 1 }], passi: [['Analisi', 'Un articolo di data journalism ogni lunedì'], ['Report', 'Report scaricabili su territori, PA e competenze'], ['Dashboard', 'Dati interattivi da esplorare']] },
      { tipo: 'sito', nb: 12, f: SITO('10-troisiinsight.it.jpg') } ]),
    benessereorganizzativo: () => seq('A', { tema: tema('#16A085', '#86EFAC', '#0B2E2A', 'rgba(22,160,133,.36)'), sito: { nome: 'Benessere Organizzativo', sigla: 'BO', dominio: 'benessereorganizzativo.it', claim: 'Benessere organizzativo e stress lavoro-correlato' } }, [
      { tipo: 'gancio', nb: 10, clip: 'bo-stretch.mp4', inp: 0, testo: 'Come stanno davvero le persone nella tua organizzazione?', ultimaColorata: true },
      { clip: 'bo-colleghi.mp4', inp: 0, tipo: 'leggi', nb: 12, kicker: 'Per PA e aziende', righe: ['Lo chiedono', { t: 'le norme.', c: 1 }], leggi: [['D.Lgs. 81/2008 · art. 28', 'Valutazione dello stress lavoro-correlato nel DVR, per tutti i datori di lavoro'], ['D.Lgs. 165/2001 · art. 7', 'Le PA garantiscono un ambiente di lavoro improntato al benessere organizzativo']] },
      { clip: 'bo-ascolto.mp4', inp: 0, tipo: 'passi', nb: 12, kicker: 'Il metodo', righe: ['Dal questionario', { t: 'al DVR.', c: 1 }], passi: [['Questionario', 'Il modello ANAC per PA e aziende'], ['Analisi', 'Clima, stress e benessere con metodo validato'], ['Report', 'Integrabile nel DVR e nella Relazione sulla Performance']] },
      { tipo: 'sito', nb: 10, f: SITO('04-benessereorganizzativo.it.jpg') } ]),
    osservatoriobenessere: () => seq('C', { tema: tema('#059669', '#A7F3D0', '#063B30', 'rgba(5,150,105,.36)'), sito: { nome: 'Osservatorio sul Benessere Organizzativo', sigla: 'BO', dominio: 'osservatoriobenessereorganizzativo.it', claim: 'Il ranking del benessere organizzativo delle partecipate' } }, [
      { tipo: 'gancio', nb: 9, clip: 'ob-gruppo.mp4', inp: 0, testo: 'Dove si lavora meglio, tra le società pubbliche?', ultimaColorata: true },
      { clip: 'ob-mappe.mp4', inp: 0, tipo: 'numero', nb: 9, kicker: 'Il database', val: 6685, dec: 0, testo: 'società partecipate e controllate dalla PA, attive', fonte: 'MEF e IPA' },
      { clip: 'ob-applausi.mp4', inp: 0, tipo: 'badge', nb: 10, kicker: 'Prima edizione · 2026', righe: ['Il ranking', { t: 'nazionale.', c: 1 }], badge: ['IBO Score™', '20 regioni', '18 settori', 'Premio 2027'] },
      { tipo: 'sito', nb: 12, f: SITO('19-osservatoriobenessereorganizzativo.it.jpg') } ]),
    tip: () => seq('B', { tema: tema('#0EA5E9', '#7DD3FC', '#0B1A33', 'rgba(14,165,233,.34)'), sito: { nome: 'TIP', sigla: 'TIP', dominio: 'tiplive.it', claim: 'Troisi Intelligence Platform per la PA' } }, [
      { tipo: 'gancio', nb: 12, clip: 'tip-tavolo.mp4', inp: 0, lento: 1.8, testo: 'Raccogli dati, misura la performance, migliora i servizi pubblici.', ultimaColorata: true },
      { clip: 'tip-dash.mp4', inp: 0, tipo: 'passi', nb: 14, kicker: 'Una piattaforma', righe: ['Tutto in', { t: 'un unico sistema.', c: 1 }], passi: [['Survey', 'Questionari pensati per la PA'], ['Monitoraggio', 'Il territorio sotto controllo'], ['Live polling', 'Il voto del pubblico, in tempo reale'], ['KPI', 'Indicatori preconfigurati per la PA']] },
      { clip: 'tip-tablet.mp4', inp: 0, tipo: 'badge', nb: 12, kicker: 'Pensata per la PA', righe: ['Pronta', { t: 'da subito.', c: 1 }], badge: ['Conforme GDPR e CAD', 'KPI per la PA', 'Nessuna installazione'] },
      { tipo: 'sito', nb: 14, f: SITO('17-tiplive.it.jpg') } ]),
    troisiformazione: () => seq('M', { tema: tema('#1D4ED8', '#F59E0B', '#0B1E4A', 'rgba(29,78,216,.36)'), sito: { nome: 'Troisi Formazione', sigla: 'TF', dominio: 'troisiformazione.it', claim: 'La formazione finanziata, trasformata in competenze' } }, [
      { tipo: 'gancio', nb: 10, clip: 'tf-relatore.mp4', inp: 0, testo: 'La tua azienda versa ogni mese fondi per la formazione. Li stai usando?', ultimaColorata: true },
      { clip: 'tf-sala.mp4', inp: 0, tipo: 'passi', nb: 14, kicker: 'Il percorso', righe: ['Competenze misurabili', { t: 'e certificate.', c: 1 }], passi: [['Fabbisogni', 'Dalla Mappatura delle Competenze'], ['Piano', 'Il piano formativo finanziato dai fondi'], ['Formazione', 'In aula e online'], ['Certificazione', 'Nel Registro delle Competenze']] },
      { clip: 'tf-studenti.mp4', inp: 0, lento: 1.3, tipo: 'badge', nb: 10, kicker: 'Fondi interprofessionali', righe: ['A costo', { t: 'zero.', c: 1 }], badge: ['Fondimpresa', 'Fondirigenti', 'Fondo Forte', 'TÜV ISO 9001:2015'] },
      { tipo: 'sito', nb: 10, f: SITO('14-troisiformazione.it.jpg') } ]),
    tindex: () => seq('A', { tema: tema('#E8A020', '#FCD34D', '#14304F', 'rgba(232,160,32,.3)'), sito: { nome: 'Indice di Performance Territoriale', sigla: 'ITP', dominio: 't-index.it', claim: 'La performance di comuni, province e regioni' } }, [
      { tipo: 'gancio', nb: 10, clip: 'ix-stazione.mp4', inp: 0, testo: 'Come funziona davvero il tuo territorio?', ultimaColorata: true },
      { clip: 'ix-tram.mp4', inp: 0, tipo: 'gauge', nb: 10, kicker: 'ITP', righe: ['Un unico indice', { t: 'da 0 a 100.', c: 1 }], valore: 64, etichetta: 'ITP' },
      { clip: 'ix-mare.mp4', inp: 0, tipo: 'badge', nb: 10, kicker: 'Benchmarking territoriale', righe: ['Servizi, governance', { t: 'e sviluppo.', c: 1 }], badge: ['38 indicatori', '5 dimensioni', 'Comuni', 'Province', 'Regioni'] },
      { tipo: 'sito', nb: 12, f: SITO('08-t-index.it.jpg') } ]),
    digitalizzazione: () => seq('C', { tema: tema('#2563EB', '#93C5FD', '#0A1A4A', 'rgba(37,99,235,.38)'), sito: { nome: 'Digitalizzazione nella PA', sigla: 'DPA', dominio: 'digitalizzazionenellapa.it', claim: 'Strumenti data-driven per la PA italiana' } }, [
      { tipo: 'gancio', nb: 9, clip: 'dg-team.mp4', inp: 0, testo: 'La tua amministrazione è pronta per il digitale?', ultimaColorata: true },
      { clip: 'dg-dash.mp4', inp: 0, tipo: 'passi', nb: 10, kicker: 'Gli strumenti', righe: ['Tutti gli strumenti', { t: 'per la PA.', c: 1 }], passi: [['ITP', 'La performance del territorio'], ['CustomerPA™', 'La soddisfazione dei cittadini'], ['PNRR', 'Progetti e indicatori'], ['Competenze', 'La mappatura del personale']] },
      { tipo: 'sito', nb: 12, f: SITO('11-digitalizzazionenellapa.it.jpg') } ]),
    dibattito: () => seq('B', { tema: tema('#F59E0B', '#FDBA74', '#0C1E46', 'rgba(245,158,11,.3)'), sito: { nome: 'Dibattito Pubblico', sigla: 'DP', dominio: 'dibattito-pubblico.it', claim: 'Partecipazione e grandi opere in Italia' } }, [
      { tipo: 'gancio', nb: 12, clip: 'db-pubblico.mp4', inp: 0, testo: 'Le grandi opere si decidono insieme.', ultimaColorata: true },
      { clip: 'db-cantiere.mp4', inp: 0, lento: 1.8, tipo: 'leggi', nb: 14, kicker: 'La normativa', righe: ['Regole chiare', { t: 'per partecipare.', c: 1 }], leggi: [['D.Lgs. 36/2023 · art. 40', 'Il dibattito pubblico nel Codice dei contratti pubblici'], ['D.Lgs. 36/2023 · Allegato I.6', 'Le opere per cui il dibattito pubblico è obbligatorio']] },
      { clip: 'db-consiglio.mp4', inp: 0, tipo: 'passi', nb: 12, kicker: "L'osservatorio", righe: ['Cittadini, stakeholder', { t: 'e istituzioni.', c: 1 }], passi: [['Normativa', 'Le regole, spiegate'], ['Processi', 'Come si organizza la partecipazione'], ['Analisi', 'Approfondimenti ogni venerdì']] },
      { tipo: 'sito', nb: 14, f: SITO('07-dibattito-pubblico.it.jpg') } ]),
    internazionalizzazione: () => seq('M', { tema: tema('#C9922E', '#E9C46A', '#0E1A2E', 'rgba(201,146,46,.3)'), sito: { nome: 'Consulenza Internazionalizzazione', sigla: 'INT', dominio: 'consulenzainternazionalizzazione.it', claim: 'Export guidato dai dati per le PMI' } }, [
      { tipo: 'gancio', nb: 10, clip: 'in-aeroporto.mp4', inp: 0, testo: "La tua impresa è pronta a vendere all'estero?", ultimaColorata: true },
      { clip: 'in-riunione.mp4', inp: 0, tipo: 'passi', nb: 14, kicker: 'Come ti affianchiamo', righe: ['Ogni scelta', { t: 'parte dai dati.', c: 1 }], passi: [['Check-up export', 'Quanto è pronta la tua impresa'], ['Mercati esteri', 'Analisi dei paesi giusti'], ['Export manager', 'Un Temporary Export Manager'], ['Strumenti', 'Bandi, dazi e logistica']] },
      { clip: 'in-polignano.mp4', inp: 0, tipo: 'badge', nb: 10, kicker: 'Per le PMI italiane', righe: ['Dal primo passo', { t: 'ai mercati.', c: 1 }], badge: ['Bandi', 'Missioni', 'Dazi', 'Export digitale'] },
      { tipo: 'sito', nb: 10, f: SITO('13-consulenzainternazionalizzazione.it.jpg') } ]),
    bdg: () => seq('A', { tema: tema('#0F766E', '#5EEAD4', '#121417', 'rgba(15,118,110,.36)'), sito: { nome: 'Benessere Digitale Giovani', sigla: 'BDG', dominio: 'benesseredigitalegiovani.it', claim: "L'osservatorio sul benessere digitale dei ragazzi" } }, [
      { tipo: 'gancio', nb: 10, clip: 'bg-studenti.mp4', inp: 0, testo: 'Tuo figlio è sempre al cellulare?', ultimaColorata: true },
      { clip: 'bg-scala.mp4', inp: 0, lento: 1.5, tipo: 'numero', nb: 10, kicker: 'Scuola', val: 24, dec: 0, suf: '%', testo: 'dei quindicenni italiani è sotto la soglia minima in lettura: la media OCSE è il 31%', fonte: 'OCSE PISA 2025, sintesi INVALSI' },
      { clip: 'bg-scuola.mp4', inp: 0, tipo: 'passi', nb: 12, kicker: 'Cosa facciamo', righe: ['Dati, non', { t: 'allarmismo.', c: 1 }], passi: [['Test gratuito', 'Quanto è esposto tuo figlio'], ['Ricerca annuale', 'Un campione di famiglie italiane'], ['Analisi', 'Ogni sabato, su dati europei']] },
      { tipo: 'sito', nb: 10, f: SITO('09-benesseredigitalegiovani.it.jpg') } ]),
    sveglia: () => seq('C', { tema: tema('#F28C28', '#FDBA74', '#14304F', 'rgba(242,140,40,.3)'), sito: { nome: 'Sveglia Digitale', sigla: 'SD', dominio: 'svegliadigitale.it', claim: 'Indice di consapevolezza digitale' } }, [
      { tipo: 'gancio', nb: 9, clip: 'sv-dataviz.mp4', inp: 0, testo: 'Quanto sei consapevole del mondo digitale?', ultimaColorata: true },
      { clip: 'sv-plexus.mp4', inp: 0, tipo: 'badge', nb: 10, kicker: '18 domande · 5 dimensioni', righe: ['Non quanto lo usi.', { t: 'Quanto lo capisci.', c: 1 }], badge: ['Autonomia cognitiva', 'Sovranità dei dati', "Gestione dell'attenzione", 'Literacy algoritmica', 'Visione sistemica'] },
      { clip: 'sv-ologramma.mp4', inp: 0, tipo: 'gauge', nb: 9, kicker: 'Il tuo indice', righe: ['Un punteggio', { t: 'da 0 a 100.', c: 1 }], valore: 66, etichetta: 'INDICE' },
      { tipo: 'sito', nb: 12, f: SITO('16-svegliadigitale.it.jpg'), kicker: 'Fai il test' } ]),
    voiceinhub: () => seq('B', { tema: tema('#E11D48', '#FDA4AF', '#16121A', 'rgba(225,29,72,.3)'), sito: { nome: 'VoiceInHub', sigla: 'VH', dominio: 'voiceinhub.it', claim: 'Il podcast di Andrea Troisi' } }, [
      { tipo: 'gancio', nb: 12, clip: 'vh-radio.mp4', inp: 0, testo: "La voce dei dati, dell'innovazione e del territorio.", ultimaColorata: true },
      { clip: 'vh-mic.mp4', inp: 0, tipo: 'passi', nb: 14, kicker: 'Il podcast', righe: ['PA, innovazione', { t: 'e territorio.', c: 1 }], passi: [['Serie 01', 'Il Metodo Troisi'], ['Episodio 01', "Cos'è l'ITP: misurare la performance di un comune"], ['Conversazioni', 'Con chi lavora sui dati']] },
      { clip: 'vh-studio.mp4', inp: 0, tipo: 'badge', nb: 12, kicker: 'In arrivo', righe: ['Ascoltalo', { t: 'dove vuoi.', c: 1 }], badge: ['Spotify', 'YouTube', 'Podcast app'] },
      { tipo: 'sito', nb: 12, f: SITO('15-voiceinhub.it.jpg'), kicker: 'Avvisami al lancio' } ]),
    andreatroisi: () => seq('M', { tema: tema('#B8963E', '#E6C77A', '#0E1726', 'rgba(184,150,62,.28)'), sito: { nome: 'Andrea Troisi', sigla: 'AT', dominio: 'andreatroisi.it', claim: 'Statistico, professore universitario, giornalista' } }, [
      { tipo: 'gancio', nb: 10, clip: 'at-evento.mp4', inp: 0, testo: 'Fondatore di Troisi Ricerche, dal 2006.', ultimaColorata: true },
      { tipo: 'foto', nb: 8, f: FOTO('senato-leggio.jpg'), kicker: 'Senato della Repubblica · 2026', righe: ['I suoi studi', { t: 'al Senato.', c: 1 }] },
      { tipo: 'foto', nb: 8, f: FOTO('camera-deputati.jpg'), rot: 2, kicker: 'Camera dei deputati · 2019', righe: ['E alla Camera', { t: 'dei Deputati.', c: 1 }] },
      { clip: 'at-sorriso.mp4', inp: 0, tipo: 'badge', nb: 10, kicker: 'Di cosa si occupa', righe: ['Ricerca, dati', { t: 'e università.', c: 1 }], badge: ['Ricerca e analisi dati', 'Customer satisfaction PA', 'AI e data science', 'Professore UniBa'] },
      { tipo: 'sito', nb: 10, f: SITO('03-andreatroisi.it.jpg') } ]),
  };
};
