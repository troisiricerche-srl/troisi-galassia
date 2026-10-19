# Genera il calendario delle uscite (posts.json) per la pagina di revisione.
import json, datetime as dt

VS = 'troisi-ricerche-video/video-siti/'
TV = 'troisi-ricerche-video/'
CL = 'cinema-lab/'
WA = 'https://whatsapp.com/channel/0029VbE9Kx9DeONGCBFx5v42'
GIORNI = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica']
MESI = ['', 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']

def url(dom, src, camp, slug):
    base = ('https://www.' + dom) if dom in ('troisiricerche.net', 'ildatoetratto.it') else ('https://' + dom)
    return f'{base}/?utm_source={src}&utm_medium=social&utm_campaign={camp}&utm_content={slug}'

# ---------------- video dei siti ----------------
# chiave: (nome, dominio, file base, hashtag LinkedIn, hashtag Instagram, testo, commento di Andrea, titolo YouTube, nota)
SITI = {
 'delfi': ('DELFI', 'delfiweb.it', 'DELFI',
   '#comuni #datiaperti #PA', '#comuni #datiaperti #statistica #Italia #DELFI',
   "Quanto conosci davvero il tuo comune?\nSu DELFI trovate i dati di tutti i 7.896 comuni italiani (fonte: ISTAT, elenco dei comuni): popolazione, reddito, raccolta differenziata, rischio sismico, turismo, PNRR, scuole e sanità.\nDati reali contro percezioni. Cercate il vostro comune e confrontatelo con gli altri.",
   "Abbiamo costruito DELFI per una domanda semplice: cosa dicono davvero i dati del mio comune? Cercate il vostro e ditemi cosa vi sorprende.",
   'Quanto conosci davvero il tuo comune? I dati di tutti i comuni italiani su DELFI', ''),
 'troisiinsight': ('TroisiInsight', 'troisiinsight.it', 'TroisiInsight',
   '#datajournalism #ISTAT #lavoro', '#datajournalism #statistica #ISTAT #lavoro #Italia',
   "I dati che raccontano l'Italia che cambia.\nAd agosto 2026 il tasso di disoccupazione in Italia è salito al 6,2% (ISTAT, dati provvisori). Su TroisiInsight lo leggiamo insieme agli altri numeri ufficiali: un articolo di data journalism ogni lunedì, report scaricabili su territori, PA e competenze, dashboard da esplorare.",
   "Ogni lunedì su TroisiInsight prendiamo un dato ufficiale e lo spieghiamo senza scorciatoie. Questo è il laboratorio da cui partono le nostre analisi.",
   "I dati che raccontano l'Italia che cambia · TroisiInsight", 'Promemoria per Andrea entro l\'11/11: se ISTAT ha già diffuso il dato di settembre, il 6,2% di agosto resta corretto ma va letto come dato di agosto.'),
 'customerpa': ('CustomerPA™', 'customerpa.it', 'prova-CustomerPA',
   '#customersatisfaction #PA #performance', '#customersatisfaction #PA #cittadini #performance #CustomerPA',
   "Il tuo ente misura davvero la soddisfazione dei cittadini?\nCon CustomerPA™ la rilevazione segue quattro passi: audit in 8 punti con il CustomerPA™ Score, indagine con metodo statistico validato, report allegabile alla Relazione sulla Performance, documentazione a supporto dell'OIV.",
   "Misurare la soddisfazione dei cittadini è il lavoro che facciamo da più tempo. Con CustomerPA™ l'abbiamo reso un percorso chiaro, in quattro passi.",
   'Il tuo ente misura davvero la soddisfazione dei cittadini? · CustomerPA™', 'Promemoria per Andrea entro il 18/11: verificare in grafica la «rilevazione annuale» attribuita al D.Lgs. 150/2009.'),
 'troisiricerche': ('Troisi Ricerche', 'troisiricerche.net', 'Troisi-Ricerche',
   '#ricerchedimercato #statistica #PA', '#statistica #ricerchedimercato #sondaggi #PA #Bari',
   "Dal 2006 trasformiamo i dati in conoscenza per chi decide.\nIndagini di mercato, sociali e sondaggi di opinione; piattaforme come CustomerPA™, DELFI e TIP; osservatori che pubblicano analisi su dati ufficiali.\nUn metodo certificato: TÜV ISO 9001:2015, istituto accreditato MIUR.\nBari · Roma · Milano.",
   "Vent'anni di indagini in una frase: misurare bene prima di decidere. Ecco cosa facciamo oggi in Troisi Ricerche.",
   'Troisi Ricerche · Dal 2006 dati per chi decide', ''),
 'tindex': ('Indice di Performance Territoriale (ITP)', 't-index.it', 'Indice-Performance-Territoriale',
   '#territorio #comuni #benchmarking', '#territorio #comuni #benchmarking #PA #ITP',
   "Come funziona davvero il tuo territorio?\nL'Indice di Performance Territoriale (ITP) misura comuni, province e regioni su servizi, governance e sviluppo: 38 indicatori in 5 dimensioni, un unico indice da 0 a 100.",
   "Con l'ITP abbiamo provato a rispondere a una domanda che ogni amministratore si fa: come sta andando il nostro territorio, rispetto agli altri?",
   'Come funziona davvero il tuo territorio? · Indice di Performance Territoriale', 'Promemoria per Andrea entro il 2/12: allineare su t-index.it il numero dei comuni (7.901) a quello di DELFI (7.896); si vede nel video.'),
 'benessereorganizzativo': ('Benessere Organizzativo', 'benessereorganizzativo.it', 'Benessere-Organizzativo',
   '#benessereorganizzativo #stresslavorocorrelato #HR', '#benessereorganizzativo #stresslavorocorrelato #HR #PA #lavoro',
   "Come stanno davvero le persone nella tua organizzazione?\nLa valutazione dello stress lavoro-correlato è prevista per tutti i datori di lavoro (D.Lgs. 81/2008, art. 28); le PA devono garantire un ambiente di lavoro improntato al benessere organizzativo (D.Lgs. 165/2001, art. 7).\nIl nostro metodo: questionario sul modello ANAC, analisi di clima, stress e benessere, report integrabile nel DVR e nella Relazione sulla Performance.",
   "Il benessere organizzativo si può misurare, e conviene farlo bene. È uno dei temi su cui lavoriamo di più con PA e aziende.",
   'Come stanno davvero le persone nella tua organizzazione? · Benessere Organizzativo', ''),
 'ildatoetratto': ('Il dato è tratto™', 'ildatoetratto.it', 'Il-dato-e-tratto',
   '#ildatoetratto #datiufficiali #Italia', '#ildatoetratto #statistica #datiufficiali #Italia #Eurostat',
   "Ogni mattina un dato ufficiale sull'Italia.\nUn esempio: nel 2025 il 13,3% dei giovani italiani tra 15 e 29 anni non lavorava e non studiava (Eurostat).\nIl dato è tratto™ arriva sul canale WhatsApp, appena esce, oppure via email ogni due settimane, gratis e senza pubblicità.",
   "Ogni mattina scegliamo un dato ufficiale e lo spieghiamo in poche righe. Se vi va, seguiteci sul canale WhatsApp.",
   "Ogni mattina un dato ufficiale sull'Italia · Il dato è tratto™", "Promemoria per Andrea entro il 16/12: togliere da ildatoetratto.it la frase «In pochi secondi, con la fonte»; si vede nel video."),
 'osservatoriobenessere': ('Osservatorio sul Benessere Organizzativo', 'osservatoriobenessereorganizzativo.it', 'Osservatorio-Benessere-Organizzativo',
   '#benessereorganizzativo #partecipate #ranking', '#benessereorganizzativo #partecipate #PA #ranking #lavoro',
   "Dove si lavora meglio, tra le società pubbliche?\nL'Osservatorio sul Benessere Organizzativo parte da un database di 6.685 società partecipate e controllate dalla PA attive (fonte: MEF e IPA) e costruisce il ranking nazionale con l'IBO Score™: 20 regioni, 18 settori. Prima edizione 2026, premio nel 2027.",
   "Con l'Osservatorio vogliamo portare il benessere organizzativo anche dentro le società pubbliche, con un metodo uguale per tutte.",
   'Dove si lavora meglio tra le società pubbliche? · Osservatorio sul Benessere Organizzativo', ''),
 'sveglia': ('Sveglia Digitale', 'svegliadigitale.it', 'Sveglia-Digitale',
   '#consapevolezzadigitale #educazionedigitale #AI', '#consapevolezzadigitale #digitale #algoritmi #AI #test',
   "Quanto sei consapevole del mondo digitale?\nNon quanto lo usi: quanto lo capisci. Il test di Sveglia Digitale ha 18 domande su 5 dimensioni (autonomia cognitiva, sovranità dei dati, gestione dell'attenzione, literacy algoritmica, visione sistemica) e restituisce un indice da 0 a 100.",
   "Sveglia Digitale nasce da una domanda: sappiamo davvero come funzionano gli strumenti che usiamo ogni giorno? Fate il test e ditemi il vostro punteggio.",
   'Quanto sei consapevole del mondo digitale? Il test di Sveglia Digitale', ''),
 'bdg': ('Benessere Digitale Giovani', 'benesseredigitalegiovani.it', 'Benessere-Digitale-Giovani',
   '#benesseredigitale #giovani #scuola', '#benesseredigitale #giovani #genitori #scuola #smartphone',
   "Tuo figlio è sempre al cellulare?\nDati, non allarmismo. Il 24% dei quindicenni italiani è sotto la soglia minima in lettura; la media OCSE è il 31% (OCSE PISA 2025, sintesi INVALSI).\nSu Benessere Digitale Giovani: un test gratuito per capire quanto è esposto tuo figlio, una ricerca annuale su un campione di famiglie italiane e un'analisi ogni sabato su dati europei.",
   "Sul digitale dei ragazzi servono meno allarmi e più dati. È quello che proviamo a fare con questo osservatorio.",
   'Tuo figlio è sempre al cellulare? Dati, non allarmismo · Benessere Digitale Giovani', ''),
 'mappatura': ('Mappatura delle Competenze', 'mappaturadellecompetenze.it', 'prova-Mappatura-delle-Competenze',
   '#competenze #HR #formazione', '#competenze #HR #formazione #EQF #risorseumane',
   "Sai davvero quali competenze ci sono nella tua organizzazione?\nLa Mappatura delle Competenze funziona in quattro fasi: profili allineati ai livelli EQF, assessment digitale, gap analysis per persona, team e organizzazione, piano formativo.\nCompetenze misurate e confrontabili, in linea con il D.Lgs. 13/2013 e finanziabili con Fondimpresa e Fondirigenti.",
   "Prima di formare le persone bisogna sapere cosa sanno già fare. La Mappatura delle Competenze serve a questo.",
   'Sai davvero quali competenze ci sono nella tua organizzazione? · Mappatura delle Competenze', 'Video di prova già approvato.'),
 'registro': ('Registro delle Competenze', 'registrodellecompetenze.it', 'prova-Registro-delle-Competenze',
   '#competenze #certificazione #formazione', '#competenze #certificazione #formazione #OpenBadges #HR',
   "Le competenze non si dichiarano. Si certificano.\nIl Registro delle Competenze accompagna dalla mappatura al certificato: importa le competenze, documenta titoli ed esperienze, valida con il referente o l'ente accreditato e rilascia un certificato digitale. Conforme agli standard: D.Lgs. 13/2013, livelli EQF, Open Badges 3.0, GDPR.",
   "Dopo la mappatura, il passo naturale: certificare le competenze e seguirle nel tempo.",
   'Le competenze non si dichiarano, si certificano · Registro delle Competenze', 'Video di prova già approvato.'),
 'tip': ('TIP', 'tiplive.it', 'TIP',
   '#PA #performance #KPI', '#PA #performance #KPI #survey #dati',
   "Raccogli dati, misura la performance, migliora i servizi pubblici.\nTIP, Troisi Intelligence Platform, mette in un unico sistema survey per la PA, monitoraggio del territorio, live polling e KPI preconfigurati. Conforme GDPR e CAD, senza installazione.",
   "TIP è la piattaforma che usiamo ogni giorno nei nostri progetti con la PA. Ora la può usare anche il vostro ente.",
   'Raccogli dati, misura la performance, migliora i servizi pubblici · TIP', ''),
 'troisiformazione': ('Troisi Formazione', 'troisiformazione.it', 'Troisi-Formazione',
   '#formazionefinanziata #Fondimpresa #competenze', '#formazionefinanziata #Fondimpresa #competenze #formazione #imprese',
   "La tua azienda versa ogni mese fondi per la formazione. Li stai usando?\nCon Troisi Formazione il percorso è misurabile: fabbisogni dalla Mappatura delle Competenze, piano formativo finanziato dai fondi interprofessionali (Fondimpresa, Fondirigenti, Fondo Forte), formazione in aula e online, certificazione nel Registro delle Competenze.",
   "Molte imprese versano i contributi per la formazione e non li usano. Con Troisi Formazione proviamo a trasformarli in competenze.",
   'La tua azienda usa i fondi per la formazione? · Troisi Formazione', "Promemoria per Andrea entro il 17/2: in grafica c'è «A costo zero», da verificare per tutti i fondi citati."),
 'digitalizzazione': ('Digitalizzazione nella PA', 'digitalizzazionenellapa.it', 'Digitalizzazione-nella-PA',
   '#PA #digitalizzazione #innovazione', '#PA #digitalizzazione #innovazione #PNRR #dati',
   "La tua amministrazione è pronta per il digitale?\nSu Digitalizzazione nella PA raccogliamo gli strumenti data-driven per la PA italiana: l'Indice di Performance Territoriale, CustomerPA™ per la soddisfazione dei cittadini, il monitoraggio dei progetti PNRR, la mappatura delle competenze del personale.",
   "Digitalizzare non è comprare software: è decidere con i dati. Qui trovate gli strumenti che usiamo con le amministrazioni.",
   'La tua amministrazione è pronta per il digitale? · Digitalizzazione nella PA', ''),
 'dibattito': ('Dibattito Pubblico', 'dibattito-pubblico.it', 'Dibattito-Pubblico',
   '#dibattitopubblico #partecipazione #operepubbliche', '#dibattitopubblico #partecipazione #operepubbliche #cittadini #PA',
   "Le grandi opere si decidono insieme.\nIl dibattito pubblico è previsto dal Codice dei contratti pubblici (D.Lgs. 36/2023, art. 40); l'Allegato I.6 indica le opere per cui è obbligatorio.\nSu dibattito-pubblico.it: le regole spiegate, come si organizza la partecipazione, un approfondimento ogni venerdì.",
   "Partecipazione e dati vanno insieme: senza misurare cosa pensano cittadini e stakeholder, il dibattito resta sulla carta.",
   'Le grandi opere si decidono insieme · Dibattito Pubblico', 'Video aggiornato il 19/10: in grafica ora D.Lgs. 36/2023 (art. 40 e Allegato I.6) al posto delle norme abrogate.'),
 'internazionalizzazione': ('Consulenza Internazionalizzazione', 'consulenzainternazionalizzazione.it', 'Internazionalizzazione',
   '#export #PMI #internazionalizzazione', '#export #PMI #internazionalizzazione #madeinitaly #mercatiesteri',
   "La tua impresa è pronta a vendere all'estero?\nOgni scelta parte dai dati: check-up export per capire quanto è pronta l'impresa, analisi dei mercati esteri, un Temporary Export Manager, bandi, missioni, dazi ed export digitale.",
   "Per le PMI l'estero è un'opportunità solo se si sceglie il mercato giusto. Partiamo sempre dai dati.",
   "La tua impresa è pronta a vendere all'estero? · Consulenza Internazionalizzazione", ''),
 'voiceinhub': ('VoiceInHub', 'voiceinhub.it', 'VoiceInHub',
   '#podcast #PA #innovazione', '#podcast #PA #innovazione #territorio #dati',
   "La voce dei dati, dell'innovazione e del territorio.\nVoiceInHub è il podcast di Andrea Troisi. Prima serie: «Il Metodo Troisi»; primo episodio: cos'è l'ITP e come si misura la performance di un comune. Poi conversazioni con chi lavora sui dati.\nIn arrivo su Spotify, YouTube e nelle app di podcast: lasciate la vostra email per l'avviso al lancio.",
   "Sto preparando un podcast: parleremo di PA, innovazione e territorio, con i dati in mano. Se volete saperlo per primi, lasciate l'email su voiceinhub.it.",
   "VoiceInHub · Il podcast su dati, innovazione e territorio", 'Promemoria per Andrea entro il 17/3: il video invita all\'avviso di lancio del podcast; se il lancio è lontano, valutare se spostarlo.'),
 'andreatroisi': ('Andrea Troisi', 'andreatroisi.it', 'Andrea-Troisi',
   '#statistica #ricerca #università', '#statistica #ricerca #università #dati #AndreaTroisi',
   "Andrea Troisi ha fondato Troisi Ricerche nel 2006. Statistico, professore universitario (Università degli Studi di Bari Aldo Moro), giornalista: ricerca e analisi dei dati, customer satisfaction nella PA, AI e data science.\nHa presentato i suoi studi al Senato della Repubblica (2026) e alla Camera dei deputati (2019).",
   "Su andreatroisi.it ho messo in ordine vent'anni di ricerca, insegnamento e divulgazione. Chi vuole, mi trova lì.",
   'Andrea Troisi · Statistico, professore universitario, giornalista', ''),
}

# ---------------- Delitti statistici (caption dalle schede del 16/10/2026) ----------------
EP = [
 (1, "L'uomo da un milione al bar", 'Media e mediana', 'ep01-luomo-da-un-milione-al-bar', 70.5, 'delfiweb.it',
  "Un bar, dieci clienti da 1.500 euro al mese. Entra un uomo che ne guadagna un milione: nessuno ha avuto un aumento, ma lo stipendio medio del bar supera i 92.000 euro.\nLa media non mente, ma risponde a una domanda che nessuno ha fatto. Mettiamo in fila gli stipendi: quello in mezzo, la mediana, è rimasto a 1.500.\nUn dato vero: a Bari il reddito medio dichiarato è di circa 25.000 euro (DELFI, su dati MEF). È una media, e nei redditi la mediana di solito sta più in basso.\nQuando leggete «reddito medio», chiedetevi: chi è appena entrato nel bar?\n\nI redditi medi di tutti i 7.896 comuni su delfiweb.it.",
  '#statistica #media #mediana #redditi #datajournalism',
  'Promemoria per Andrea entro il 6/11: correggere su DELFI etichetta e fonte della scheda Economia e chiarire se 24.971 € è per contribuente o per abitante.'),
 (2, 'Il colpevole sbagliato', 'Correlazione e causalità', 'ep02-il-colpevole-sbagliato', 60.5, 'troisiinsight.it',
  "D'estate aumentano i gelati venduti. E aumentano gli incidenti in acqua. Due curve che salgono insieme: il sospettato perfetto è il gelato.\nMa il gelato è innocente. C'è un terzo personaggio che muove entrambe: il caldo.\nIn statistica si chiama correlazione spuria, e il colpevole nascosto è la variabile confondente. Succede ogni giorno, nei titoli che legano un cibo alla salute o una legge a un numero.\nDue curve che si somigliano sono un indizio. Non una prova.\n\nAnalisi sui dati ufficiali su troisiinsight.it.",
  '#statistica #correlazione #causalità #datajournalism', ''),
 (3, 'Mille voci, un Paese?', 'Il campione', 'ep03-mille-voci-un-paese', 63.5, 'customerpa.it',
  "Sessanta milioni di italiani, un sondaggio ne intervista mille. Sembra impossibile, eppure funziona. A una condizione: ogni persona deve avere una probabilità nota di essere scelta.\nCon un campione estratto bene, mille interviste danno un margine di errore di circa ±3 punti. Ma un milione di risposte raccolte solo tra chi frequenta un sito rappresenta soltanto chi frequenta quel sito.\nIl segreto non è quanti ascolti. È chi ascolti, chi non risponde, e come fai la domanda.\n\nIndagini di customer satisfaction per la PA su customerpa.it.",
  '#statistica #campione #sondaggi #customersatisfaction #PA', '«Sessanta milioni» è un arrotondamento: i residenti sono poco meno di 59 milioni.'),
 (4, 'Il test quasi perfetto', 'Frequenza di base', 'ep04-il-test-quasi-perfetto', 72.2, 'troisiricerche.net',
  "Una condizione rara: una persona su mille. Un test che sbaglia una volta su cento. Il risultato è positivo: quanto è probabile che lo sia davvero?\nL'istinto dice 99%. La risposta è circa 9%.\nSu 100.000 persone, quelle con la condizione sono 100 e il test ne trova 99. Ma l'1% delle altre 99.900, cioè 999, risulta positivo per errore. Su 1.098 positivi, i veri sono 99: uno su undici.\nSi chiama frequenza di base. Esempio inventato, nessun consiglio medico: è aritmetica.\n\nRicerca statistica applicata dal 2006 su troisiricerche.net.",
  '#statistica #probabilità #teoremadibayes #datajournalism', ''),
 (5, 'Il paradosso dei due ospedali', 'Paradosso di Simpson', 'ep05-il-paradosso-dei-due-ospedali', 67.6, 'delfiweb.it',
  "Due ospedali inventati, A e B. Nel totale B guarisce il 74% dei pazienti, A solo il 26%. Caso chiuso?\nGuardiamo dentro. Nei casi lievi vince A: 9 su 10 contro 80 su 100. Nei casi gravi vince ancora A: 20 su 100 contro 1 su 10.\nA è migliore in ogni gruppo, eppure perde nel totale: cura soprattutto i casi gravi. È il paradosso di Simpson.\nQuando confrontate comuni, scuole o ospedali, chiedetevi: stanno trattando gli stessi casi?\n\nConfronta i comuni italiani su delfiweb.it.",
  '#statistica #paradossodisimpson #datajournalism #comuni', ''),
 (6, 'Il sondaggio che cambia le risposte', 'Effetti di formulazione', 'ep06-il-sondaggio-che-cambia-le-risposte', 67.8, 'benessereorganizzativo.it',
  "Due questionari, stesso argomento. Il primo chiede: siete favorevoli a più investimenti nei servizi pubblici? Il secondo: siete favorevoli a più tasse per finanziare i servizi pubblici?\nStesso tema, ma non la stessa domanda. Una parola, l'ordine delle opzioni, una premessa: le risposte si spostano. Si chiamano effetti di formulazione.\nUn questionario serio usa domande neutre, una cosa per volta, opzioni bilanciate e un test sul campo.\nQuando leggete un sondaggio, cercate il testo esatto della domanda.\n\nMisurare il benessere nella PA su benessereorganizzativo.it.",
  '#statistica #sondaggi #questionari #benessereorganizzativo', ''),
 (7, 'La persona che non esiste', 'Media e distribuzione', 'ep07-la-persona-che-non-esiste', 66.7, 'ildatoetratto.it',
  "In Italia il numero medio di figli per donna è stimato in 1,14 (ISTAT, 2025). Ora cercate una donna con 1,14 figli: non la troverete.\nLa media non descrive una persona, descrive un insieme: mescola chi non ha figli, chi ne ha uno, chi ne ha tre. Progettare un servizio per la persona media rischia di significare progettarlo per qualcuno che non esiste.\nPer questo accanto alla media gli statistici guardano la distribuzione.\nLa persona media non esiste. Le persone sì.\n\nOgni mattina un dato ufficiale sull'Italia su ildatoetratto.it.",
  '#statistica #ISTAT #natalità #media #ildatoetratto', 'Promemoria per Andrea entro il 18/12: ricontrollare «1,18 nel 2024» (in grafica) sul comunicato ISTAT del 31/3/2026.'),
 (8, 'Il futuro non è una certezza', 'Previsioni e incertezza', 'ep08-il-futuro-non-e-una-certezza', 62.8, 'troisiricerche.net',
  "Una previsione dice: l'anno prossimo il dato sarà questo. Un solo numero. Sembra una certezza.\nMa ogni previsione poggia su dati del passato e su ipotesi sul futuro: cambiano le ipotesi, cambia il risultato. Per questo una previsione seria è un ventaglio, con uno scenario basso, uno centrale e uno alto. E più ci si allontana nel tempo, più il ventaglio si apre.\nDiffidate di chi vi consegna il futuro con un solo decimale.\n\nRicerca statistica applicata dal 2006 su troisiricerche.net.",
  '#statistica #previsioni #incertezza #scenari', ''),
 (9, 'La moneta ha memoria?', 'Legge dei grandi numeri', 'ep09-la-moneta-ha-memoria', 61.9, None,
  "Quattro lanci, quattro volte testa. Al quinto sentiamo che deve uscire croce, per pareggiare. Ma una moneta equa non ha memoria: testa e croce valgono ancora 50 e 50.\nE allora perché su mille lanci finiscono vicine alla metà? Non perché la moneta compensi: perché i nuovi lanci diluiscono quelli vecchi. Quattro teste in più pesano molto su dieci lanci, quasi niente su mille.\nLa legge dei grandi numeri non corregge il passato. Lo rende piccolo.\n\nSeguiteci su Instagram: @troisiricerche.",
  '#statistica #probabilità #leggedeigrandinumeri #datajournalism', 'Le puntate 9 e 10 trattano entrambe l\'indipendenza ed escono a una settimana di distanza: valutare se scambiare la 9 con la 8.'),
 (10, 'La roulette non ha memoria', 'Indipendenza', 'ep10-la-roulette-non-ha-memoria', 64.0, None,
  "Cinque rossi di fila. Al tavolo tutti puntano sul nero: «adesso tocca a lui».\nMa la pallina non ricorda nulla. Sulla ruota europea il nero ha sempre 18 probabilità su 37, prima e dopo qualunque serie.\nIl trucco è che confondiamo due domande: cinque rossi di fila, visti dall'inizio, sono rari (2,7%). Ma una volta usciti conta solo il prossimo giro, e lì «cinque rossi e un nero» e «sei rossi» hanno la stessa probabilità. È la fallacia del giocatore, la stessa dei numeri ritardatari. In statistica si chiama indipendenza: davanti a qualunque serie di dati, la prima domanda è se il fenomeno ha memoria.\n\nEsempio didattico, nessun invito al gioco.",
  '#statistica #probabilità #fallaciadelgiocatore #datajournalism', ''),
]
CODA_DS = "Delitti statistici: ogni venerdì un errore di ragionamento, smontato con i numeri."
PRIMO_COMMENTO = f"Ogni mattina un dato ufficiale sull'Italia → canale WhatsApp «Il dato è tratto™» {WA}"
REQ_DS = "Dopo la pubblicazione: disattivare remix e riuso dell'audio su Instagram e Facebook; su YouTube registrare il brano in Claim Clear."

# ---------------- calendario ----------------
D = dt.date
SEASON = [  # (data mercoledì sito, chiave sito, data venerdì, n. puntata): il martedì resta alla sintesi settimanale de Il dato è tratto™
 (D(2026,11,4), 'delfi', D(2026,11,6), 1),
 (D(2026,11,11), 'troisiinsight', D(2026,11,13), 2),
 (D(2026,11,18), 'customerpa', D(2026,11,20), 3),
 (D(2026,11,25), 'troisiricerche', D(2026,11,27), 4),
 (D(2026,12,2), 'tindex', D(2026,12,4), 5),
 (D(2026,12,9), 'benessereorganizzativo', D(2026,12,11), 6),
 (D(2026,12,16), 'ildatoetratto', D(2026,12,18), 7),
 (D(2027,1,7), 'osservatoriobenessere', D(2027,1,8), 8),
 (D(2027,1,13), 'sveglia', D(2027,1,15), 9),
 (D(2027,1,20), 'bdg', D(2027,1,22), 10),
]
DOPO = ['mappatura', 'registro', 'tip', 'troisiformazione', 'digitalizzazione', 'dibattito', 'internazionalizzazione', 'voiceinhub', 'andreatroisi']
DOPO_DATE = [D(2027,1,27) + dt.timedelta(weeks=i) for i in range(len(DOPO))]

posts = []
def add(d, ora, canale, **k):
    posts.append(dict(data=d.isoformat(), giorno=f'{GIORNI[d.weekday()]} {d.day} {MESI[d.month]} {d.year}', ora=ora, canale=canale, **k))

def file_sito(base, o):
    if base.startswith('prova-'):
        return VS + base + ('-verticale.mp4' if o == 'v' else '-orizzontale.mp4')
    return VS + base + ('-verticale.mp4' if o == 'v' else '-orizzontale.mp4')

def uscita_sito(d, k, fase, settimana):
    nome, dom, base, hli, hig, testo, andrea, yt, nota = SITI[k]
    uid = f'{d.isoformat()}-{k}'
    g = dict(gruppo=uid, serie='Video dei siti', titolo=nome, fase=fase, settimana=settimana, nota=nota)
    add(d, '08:30', 'LinkedIn · pagina Troisi Ricerche', id=uid+'-li', formato='Video orizzontale 16:9', file=file_sito(base, 'h'),
        testo=testo + f"\n\n→ {dom}", hashtag=hli, link=url(dom, 'linkedin', 'video-siti', k), primo_commento='', **g)
    add(d, '12:30', 'LinkedIn · profilo di Andrea', id=uid+'-lia', formato='Condivisione del post della pagina', file='—',
        testo=andrea, hashtag='', link='', primo_commento='', **{**g, 'nota': 'Ricondivisione con commento personale (prima persona: è il tuo profilo).' + (' ' + nota if nota else '')})
    add(d, '13:00', 'Instagram · Reel @troisiricerche', id=uid+'-ig', formato='Reel verticale 9:16', file=file_sito(base, 'v'),
        testo=testo + "\n\nLink nelle storie e in bio.", hashtag=hig, link=url(dom, 'instagram', 'video-siti', k), primo_commento='', **g)
    add(d, '13:00', 'Facebook · pagina Troisi Ricerche', id=uid+'-fb', formato='Reel verticale 9:16 (dallo stesso caricamento di Instagram)', file=file_sito(base, 'v'),
        testo=testo + f"\n\n→ {dom}", hashtag=hig, link=url(dom, 'facebook', 'video-siti', k), primo_commento='', **g)
    add(d, '18:00', 'Instagram · Storia', id=uid+'-st', formato='Storia con il Reel condiviso e adesivo link', file='—',
        testo=f'Adesivo link: «Scopri {nome}»', hashtag='', link=url(dom, 'instagram-storie', 'video-siti', k), primo_commento='', **g)
    add(d, '18:00', 'YouTube · Shorts', id=uid+'-yt', formato='Short verticale 9:16', file=file_sito(base, 'v'),
        testo=f"Titolo: {yt} #Shorts\n\nDescrizione:\n{testo}\n\n{url(dom, 'youtube', 'video-siti', k)}\n\nTroisi Ricerche · Bari · Roma · Milano · https://www.troisiricerche.net",
        hashtag=hli, link=url(dom, 'youtube', 'video-siti', k), primo_commento='', **g)
    add(d, '18:00', f'Sito · {dom}', id=uid+'-web', formato='Video orizzontale nella home', file=file_sito(base, 'h'),
        testo='Caricare il video orizzontale nella home del sito (in alto o nella sezione «Chi siamo»), senza audio automatico.', hashtag='', link='', primo_commento='', **g)

def uscita_ep(d, n, settimana):
    e = EP[n-1]
    _, tit, conc, cart, dur, dom, cap, hs, nota = e
    uid = f'{d.isoformat()}-ep{n:02d}'
    mp4 = f'{CL}{cart}/{cart}.mp4'
    nota_t = ' '.join(x for x in [nota, REQ_DS] if x)
    g = dict(gruppo=uid, serie='Delitti statistici', titolo=f'Ep. {n} · «{tit}»', fase='Stagione 1', settimana=settimana, nota=nota_t)
    full = cap + "\n" + CODA_DS
    lk = (lambda s: url(dom, s, 'delitti-statistici', f'ep{n:02d}')) if dom else (lambda s: '')
    add(d, '08:30', 'LinkedIn · pagina Troisi Ricerche', id=uid+'-li', formato=f'Video verticale 9:16 · {dur:.0f} s', file=mp4,
        testo=f"Delitti statistici · Ep. {n}: {tit}\nIl concetto: {conc.lower()}.\n\n" + full, hashtag=' '.join(hs.split()[:3]), link=lk('linkedin'), primo_commento=PRIMO_COMMENTO, **g)
    add(d, '12:30', 'Instagram · Reel @troisiricerche', id=uid+'-ig', formato=f'Reel verticale 9:16 · {dur:.0f} s · copertina {cart}/cover', file=mp4,
        testo=full, hashtag=hs, link=lk('instagram'), primo_commento=PRIMO_COMMENTO, **g)
    add(d, '12:30', 'Facebook · pagina Troisi Ricerche', id=uid+'-fb', formato='Reel verticale 9:16 (dallo stesso caricamento di Instagram)', file=mp4,
        testo=full, hashtag=hs, link=lk('facebook'), primo_commento=PRIMO_COMMENTO, **g)
    add(d, '13:00', 'LinkedIn · profilo di Andrea', id=uid+'-lia', formato='Condivisione del post della pagina', file='—',
        testo=f"Ogni venerdì un errore di ragionamento che incontro spesso, smontato in un minuto. Oggi: {conc.lower()}.", hashtag='', link='', primo_commento='', **{**g, 'nota': 'Ricondivisione con commento personale.'})
    add(d, '17:30', 'YouTube · Shorts', id=uid+'-yt', formato='Short verticale 9:16 (sottotitoli: caricare anche il file .srt)', file=mp4,
        testo=f"Titolo: {tit} · Delitti statistici, ep. {n} #Shorts\n\nDescrizione:\n{full}\n\n{lk('youtube') or 'https://www.troisiricerche.net'}\n\nTroisi Ricerche · Bari · Roma · Milano",
        hashtag=hs, link=lk('youtube'), primo_commento='', **g)
    add(d, '18:00', 'Instagram · Storia', id=uid+'-st', formato='Storia con il Reel condiviso', file='—',
        testo=f'Testo in sovrimpressione: «Delitti statistici · ep. {n}. Nuovo caso»', hashtag='', link='', primo_commento='', **g)
    add(d, '18:30', 'WhatsApp · canale Il dato è tratto™', id=uid+'-wa', formato='Messaggio con link al Reel o allo Short', file='—',
        testo=f"Delitti statistici, ep. {n}: «{tit}». Il concetto di oggi: {conc.lower()}. Un minuto per non farsi ingannare dai numeri.\n[link al Reel o allo Short, da inserire dopo la pubblicazione]",
        hashtag='', link='', primo_commento='', **g)

# settimana 0: lancio
d = D(2026,10,26)
g = dict(gruppo='2026-10-26-istituzionale', serie='Lancio', titolo='Video istituzionale Troisi Ricerche', fase='Settimana 0 · lancio', settimana=0,
         nota="Fissare il post in alto su ogni canale. Musica e filmati Envato: licenze da completare entro il 26/10 (Andrea).")
TI = ("Misuriamo ciò che conta. Davvero.\nDal 2006 siamo un istituto di ricerca statistica: indagini, piattaforme e osservatori per enti pubblici, imprese e territori. Dalle PMI alle grandi aziende, dal Senato della Repubblica al Forum dei Pubblici Ufficiali, dall'Italia all'estero, dalle scuole alla qualità della vita.\nBari · Roma · Milano.")
LI = url('troisiricerche.net', 'linkedin', 'lancio', 'istituzionale')
add(d, '08:30', 'LinkedIn · pagina Troisi Ricerche', id='ist-li', formato='Video orizzontale 16:9', file=TV+'Troisi-Ricerche-video-istituzionale-orizzontale-HQ.mp4', testo=TI+"\n\n→ troisiricerche.net", hashtag='#statistica #ricerca #PA', link=LI, primo_commento='', **g)
add(d, '09:00', 'LinkedIn · profilo di Andrea', id='ist-lia', formato='Condivisione del post della pagina', file='—', testo="Vent'anni di Troisi Ricerche in un minuto. Grazie a chi lavora e ha lavorato con noi in questi anni.", hashtag='', link='', primo_commento='', **g)
add(d, '13:00', 'Instagram · Reel @troisiricerche', id='ist-ig', formato='Reel verticale 9:16 · da fissare in alto', file=TV+'Troisi-Ricerche-video-istituzionale-verticale-HQ.mp4', testo=TI+"\n\nLink in bio.", hashtag='#statistica #ricerca #sondaggi #PA #Bari', link=url('troisiricerche.net','instagram','lancio','istituzionale'), primo_commento=PRIMO_COMMENTO, **g)
add(d, '13:00', 'Facebook · pagina Troisi Ricerche', id='ist-fb', formato='Video orizzontale 16:9 · da fissare in alto', file=TV+'Troisi-Ricerche-video-istituzionale-orizzontale-HQ.mp4', testo=TI+"\n\n→ troisiricerche.net", hashtag='#statistica #ricerca #PA', link=url('troisiricerche.net','facebook','lancio','istituzionale'), primo_commento='', **g)
add(d, '13:00', 'YouTube · video', id='ist-yt', formato='Video orizzontale 16:9 · in evidenza sul canale', file=TV+'Troisi-Ricerche-video-istituzionale-orizzontale-HQ.mp4', testo="Titolo: Troisi Ricerche · Misuriamo ciò che conta. Davvero.\n\nDescrizione:\n"+TI+"\n\n"+url('troisiricerche.net','youtube','lancio','istituzionale'), hashtag='#statistica #ricerca #PA', link=url('troisiricerche.net','youtube','lancio','istituzionale'), primo_commento='', **g)
add(d, '18:00', 'Sito · troisiricerche.net', id='ist-web', formato='Video orizzontale nella home', file=TV+'Troisi-Ricerche-video-istituzionale-orizzontale-HQ.mp4', testo='Mettere il video in apertura della home, senza audio automatico.', hashtag='', link='', primo_commento='', **g)

d = D(2026,10,29)
g = dict(gruppo='2026-10-29-galassia', serie='Lancio', titolo='La galassia dei siti', fase='Settimana 0 · lancio', settimana=0, nota='Versione corta sui social, lunga su YouTube e sul sito.')
TG = ("Un istituto, una galassia di strumenti.\nPer la pubblica amministrazione: CustomerPA™, Benessere Organizzativo, l'Osservatorio sul Benessere Organizzativo, TIP, l'Indice di Performance Territoriale, Digitalizzazione nella PA, Dibattito Pubblico.\nPer le imprese: Mappatura e Registro delle Competenze, Troisi Formazione, Consulenza Internazionalizzazione.\nPer cittadini e territori: Il dato è tratto™, DELFI, TroisiInsight, Benessere Digitale Giovani, Sveglia Digitale, VoiceInHub.\nNelle prossime settimane vi presentiamo i siti uno per uno.")
add(d, '08:30', 'LinkedIn · pagina Troisi Ricerche', id='gal-li', formato='Video orizzontale 16:9 · versione corta', file=TV+'Troisi-Ricerche-galassia-corta-orizzontale-HQ.mp4', testo=TG, hashtag='#statistica #PA #imprese', link=url('troisiricerche.net','linkedin','lancio','galassia'), primo_commento='', **g)
add(d, '12:30', 'LinkedIn · profilo di Andrea', id='gal-lia', formato='Condivisione del post della pagina', file='—', testo="Diciannove siti, un solo metodo. Da mercoledì li raccontiamo uno a settimana.", hashtag='', link='', primo_commento='', **g)
add(d, '13:00', 'Instagram · Reel @troisiricerche', id='gal-ig', formato='Reel verticale 9:16 · versione corta', file=TV+'Troisi-Ricerche-galassia-corta-verticale-HQ.mp4', testo=TG, hashtag='#statistica #PA #imprese #dati #Italia', link=url('troisiricerche.net','instagram','lancio','galassia'), primo_commento='', **g)
add(d, '13:00', 'Facebook · pagina Troisi Ricerche', id='gal-fb', formato='Reel verticale 9:16 · versione corta', file=TV+'Troisi-Ricerche-galassia-corta-verticale-HQ.mp4', testo=TG, hashtag='#statistica #PA #imprese', link=url('troisiricerche.net','facebook','lancio','galassia'), primo_commento='', **g)
add(d, '18:00', 'YouTube · video', id='gal-yt', formato='Video orizzontale 16:9 · versione lunga', file=TV+'Troisi-Ricerche-galassia-lunga-orizzontale-HQ.mp4', testo="Titolo: La galassia di Troisi Ricerche · 19 siti, un metodo\n\nDescrizione:\n"+TG+"\n\n"+url('troisiricerche.net','youtube','lancio','galassia'), hashtag='#statistica #PA #imprese', link=url('troisiricerche.net','youtube','lancio','galassia'), primo_commento='', **g)
add(d, '18:00', 'Sito · troisiricerche.net', id='gal-web', formato='Video orizzontale, versione lunga, nella pagina dei servizi', file=TV+'Troisi-Ricerche-galassia-lunga-orizzontale-HQ.mp4', testo='Inserire la versione lunga nella pagina che elenca i siti della galassia.', hashtag='', link='', primo_commento='', **g)

for i, (ds, k, df, n) in enumerate(SEASON, start=1):
    uscita_sito(ds, k, 'Stagione 1 · mercoledì sito, venerdì puntata', i)
    uscita_ep(df, n, i)
for j, (k, d) in enumerate(zip(DOPO, DOPO_DATE), start=11):
    uscita_sito(d, k, 'Dopo la stagione · un sito ogni mercoledì', j)

# Orari (decisione di Andrea, 19/10): tutto alle 7:00, mezz'ora dopo il dato del mattino delle 6:30.
for p in posts:
    if p['canale'].startswith('LinkedIn · profilo'):
        p['ora'] = '07:15'; p['nota'] = (p['nota'] + ' ' if p['nota'] else '') + 'LinkedIn non programma le ricondivisioni: si fa a mano appena il post della pagina è uscito.'
    elif p['canale'].startswith('Instagram · Storia'):
        p['ora'] = '07:05'
    else:
        p['ora'] = '07:00'
posts.sort(key=lambda p: (p['data'], p['ora'], p['canale']))
json.dump(posts, open('posts.json', 'w'), ensure_ascii=False)
print(len(posts), 'uscite;', len({p["gruppo"] for p in posts}), 'gruppi')
