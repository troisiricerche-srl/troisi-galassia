# «Il dato è tratto™» – uscita settimanale (preparata il LUNEDÌ sera, esce il MARTEDÌ alle 9:00)

Decisione di Andrea del 21/10/2026: tutto la sera prima. Lunedì sera si prepara e si PROGRAMMA per martedì 09:00:
Reel su Instagram, post con le slide su Facebook, carosello PDF su LinkedIn. Il canale WhatsApp lo pubblica Andrea a mano.
I primi commenti (link alle analisi) li aggiunge martedì sera il Turno serale (non si possono mettere su un post programmato).
La pubblicazione automatica via chiave Meta (ildatoetratto.it › Uscite social, uscite/prossima.json) NON si usa:
non scrivere prossima.json, per evitare doppie uscite.

Stella Polare: ogni numero deve comparire nell'articolo da cui lo prendi; niente arrotondamenti, stime, superlativi.
Nomi: «Mappatura delle Competenze», «Registro delle Competenze», «CustomerPA™», «Il dato è tratto™». Voce al plurale.
Mai il motto privato di Andrea. Mai «Metti in evidenza»/«Promuovi».

## 1. Articoli della settimana
Finestra: articoli con data DOPO il martedì precedente alle 07:00 e fino a domani (martedì) alle 00:01 compreso.
Siti: troisiinsight.it, customerpa.it, benessereorganizzativo.it, governancefinanziaria.it, digitalizzazionenellapa.it,
consulenzainternazionalizzazione.it, dibattito-pubblico.it, benesseredigitalegiovani.it, mappaturadellecompetenze.it.
Pubblicati: fetch `https://www.<dominio>/?rest_route=/wp/v2/posts&per_page=5&_fields=date,title,excerpt,link,content`
(credentials:'omit', cache:'no-store') da una scheda sul dominio. L'articolo di CustomerPA di domani è PROGRAMMATO:
leggilo da https://www.customerpa.it/wp-admin/ con nonce (`/?rest_route=/wp/v2/posts&status=future&context=edit&per_page=3&_fields=id,date,status,title,excerpt,link,content`).
Massimo 8 articoli, per data. Se non ce n'è nessuno, scrivi ad Andrea e fermati.

## 2. Slide
Per articolo: tema breve, numero principale, frase 10-18 parole, contesto di 2 frasi, eventuali due valori confrontabili (Italia e UE).

## 3. Carosello PDF (LinkedIn) e JPG
Modello `ildatoetratto.it/materiali/carosello-linkedin/carosello-modello.html` e logo `…/logo-troisi-grigio.png` sul Mac
(device_stage_files). Copertina «Martedì <gg mese aaaa>» con le etichette dei temi; una slide-dato per articolo (blocco «Casa»;
barre 760px × valore / massimo; senza barre se non ci sono due valori); chiusura invariata; numeratori «k / N».
Non cambiare colori, caratteri, impaginazione. Caratteri locali (@fontsource/archivo, @fontsource/ibm-plex-mono).
PDF 1080×1350 con Playwright (printBackground true). JPG: `pdftoppm -jpeg -jpegopt quality=90 -scale-to-x 1080 -scale-to-y 1350` → slide-01.jpg…
Guarda le pagine.

## 4. Reel
strumenti/reel (istruzioni in testa a rendi.js): dati.json con periodo, breve e al massimo 6 dati.
`NODE_PATH=$(npm root -g) node rendi.js dati.json reel.mp4`. Estrai 4 fotogrammi e guardali.

## 5. Testi (prima un commento su uno o due numeri, poi i dati; non un elenco di tutti i numeri)
- a) LINKEDIN (max 1.300 caratteri): apertura con domanda concreta o fatto che colpisce su 1-2 numeri con il confronto;
  secondo paragrafo con un dato collegato; «Con «Il dato è tratto™» raccogliamo ogni martedì i numeri della settimana pubblicati dai nostri osservatori su dati ufficiali.»;
  «Scorrete il carosello per gli altri dati su <2-4 temi>. Nel primo commento trovate le analisi complete e il link per iscrivervi al canale WhatsApp della rubrica.»;
  «Seguiteci anche su Instagram: @troisiricerche»; 3-5 hashtag con #TroisiRicerche #ilDatoètratto.
  Primo commento LinkedIn: «💬 Iscrivetevi al canale WhatsApp «Il dato è tratto™»: ogni martedì i numeri della settimana.» + https://whatsapp.com/channel/0029VbE9Kx9DeONGCBFx5v42, riga vuota, «Le analisi della settimana:» e «<tema>: <link>» per articolo.
- b) INSTAGRAM: stessa apertura; «Le analisi complete, con grafici e fonti ufficiali, sono nel primo commento 👇»;
  «Un dato a settimana, spiegato bene: iscriviti al canale WhatsApp «Il dato è tratto™», il link è in bio.»; 8-12 hashtag con #ilDatoètratto #TroisiRicerche.
  Primo commento Instagram: «📎 Le analisi complete:» + una riga per articolo (tema e link senza https://www.); in fondo «💬 Canale WhatsApp «Il dato è tratto™»» e whatsapp.com/channel/0029VbE9Kx9DeONGCBFx5v42.
- c) FACEBOOK: stessa apertura e secondo paragrafo; «Con «Il dato è tratto™» raccogliamo ogni martedì…»; «Le analisi complete:» con i link completi;
  «💬 Il canale WhatsApp: https://whatsapp.com/channel/0029VbE9Kx9DeONGCBFx5v42»; «📲 Su Instagram: https://www.instagram.com/troisiricerche/»; 3-5 hashtag con #ilDatoètratto.
- d) WHATSAPP: «📊 Il dato è tratto™ · la settimana in <N> numeri», apertura in una frase, una riga per dato «<numero> – <frase breve>»,
  «Le analisi complete 👉 https://www.ildatoetratto.it», «📲 Seguici anche su Instagram: https://www.instagram.com/troisiricerche/».
Rileggi come un dirigente su LinkedIn e annota il punto debole.

## 6. Salvataggio
Repository: uscite/<aaaa-mm-gg di martedì>/ con slide JPG e reel.mp4, commit «uscita <data>» e push.
Mac: `ildatoetratto.it/carosello-linkedin/<aaaa-mm-gg di martedì>/`: carosello.pdf, testo-linkedin.txt, primo-commento-linkedin.txt,
testi-instagram-facebook.txt (con i primi commenti), reel.mp4, whatsapp/ con le slide JPG e messaggio-whatsapp.txt.

## 7. Programmazione per martedì 09:00 (3 clic di Andrea: reel.mp4, le slide JPG, carosello.pdf)
Prima di chiedere un clic: tabs_context; se il pannello è nascosto chiedi Cmd+Shift+B.
a) Reel Instagram – scheda 1: https://business.facebook.com/latest/reels_composer?asset_id=112947764837&business_id=4521979151462744 ;
   «Pubblica su» SOLO @troisiricerche (Instagram); didascalia b) con clic nel campo e digitazione; Andrea «Aggiungi video» → reel.mp4;
   copertina = fotogramma con il titolo (cursore a circa 88/1000); Avanti → Avanti; remix «Non consentire»; «Programma» martedì 09:00
   (fuso Europe/Vienna = Roma); verifica in Contenuti › Programmati.
b) Post Facebook – stessa scheda dopo la verifica: https://business.facebook.com/latest/composer?asset_id=112947764837&business_id=4521979151462744 ;
   solo la pagina Troisi Ricerche; testo c); Andrea sceglie le slide JPG; «Programma» martedì 09:00; verifica in Programmati.
c) LinkedIn – scheda 2: https://www.linkedin.com/company/1590415/admin/page-posts/published/?share=true ; «Altro» → «Aggiungi un documento»
   → Andrea sceglie carosello.pdf → titolo «Il dato è tratto™ – <gg mese aaaa>» → «Fine» → clic su «Di cosa vorresti parlare?» e digita il testo a)
   → icona orologio → martedì 09:00 (triple_click, Backspace ×15, 09:00) → Avanti → «Programma». Verifica «Visualizza tutti i post programmati».
Se Andrea scrive «ferma», non programmare.

## 8. Commenti di martedì (li fa il Turno serale del martedì)
Facebook: nessun primo commento necessario (i link sono nel testo). Instagram: primo commento Instagram. LinkedIn: primo commento LinkedIn.
Testi in `carosello-linkedin/<data>/primo-commento-linkedin.txt` e `testi-instagram-facebook.txt`.
