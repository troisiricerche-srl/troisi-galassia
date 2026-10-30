# «Il dato di oggi» – video, testi e programmazione social (dal Turno serale)

Si prepara la sera prima, subito dopo l'articolo del giorno di uscita (portale principale del CALENDARIO).
Social programmati per le 06:50 del giorno di uscita; commenti aggiunti la sera stessa del giorno di uscita.

## 1. Dati del video
`uscite/giorno/<aaaa-mm-gg di uscita>/dati.json` (modello: ../../uscite/giorno/2026-10-21/dati.json; istruzioni
in ../giorno/LEGGIMI.md). Colori da ../giorno/colori-settimana.json, chiave = giorno della settimana di USCITA.
- `data` «<Giorno> <g> <mese> <aaaa>» del giorno di uscita; `n` = numero principale scritto come nell'articolo;
  `tema` MAIUSCOLO «AREA · ARGOMENTO»; `riga` 10-16 parole; `barre` 2-4 confronti dell'articolo
  (Italia `c:"tema"`, UE `c:"ue"`, altri `c:"altro"`); `fonte` «Fonte: <ente> (<dataset>), <anno> · <sito>» su una riga.
- Ogni numero deve comparire nell'articolo. Verifica il numero principale sull'API Eurostat e annota l'esito.

## 2. Video CON MUSICA (obbligatoria)
- Musica: sul Mac `…/SITI WEB - Troisi Ricerche/ildatoetratto.it/envato/musica-dato-di-oggi.wav`
  (device_stage_files con il percorso della cartella collegata, es. `/Users/Andrea/Downloads/SITI WEB - Troisi Ricerche/ildatoetratto.it/envato/musica-dato-di-oggi.wav`).
  MAI nel repository (licenza Envato).
- In strumenti/giorno: `NODE_PATH=$(npm root -g) node rendi.js ../../uscite/giorno/<data>/dati.json ../../uscite/giorno/<data>/video.mp4 <wav>`.
- Se la musica non è raggiungibile NON pubblicare un video muto: fermati e scrivilo ad Andrea.
- Controlli: ffprobe deve mostrare una traccia audio aac di 15,6 s; fotogrammi a 3,4 s, 9 s e 13,5 s affiancati e GUARDATI
  (testo dentro lo schermo, nessuna sovrapposizione, fonte non tagliata). Copertina = fotogramma a 9 s → copertina.jpg.
- Commit «dato di oggi <data>» e push su main (senza il wav).

## 3. Licenza Envato
Browser integrato: https://app.envato.com/search?itemType=music&term=minimal%20corporate%20ident%20pluck%20clean →
«The Corporate Ident» (Oasis_Music) → pulsante «Licenses» → «Create new» → clic nel campo di ricerca/nome e scrivi
«Il dato di oggi – <gg/mm/aaaa di uscita>» → «Create». Verifica che compaia in cima all'elenco. Mai «Download».
Se Envato chiede il login, non farlo: scrivilo ad Andrea.

## 4. Testi (testi.txt nella stessa cartella; modello uscite/giorno/2026-10-21/testi.txt)
In cima: riga del dato, link dell'articolo, esito della verifica.
- a) LINKEDIN / FACEBOOK: prima un commento su uno o due numeri (domanda concreta o fatto che colpisce, con il confronto),
  poi una riga con un secondo dato; «L'analisi completa di <Portale>, su dati <fonte> <anno>:» + link;
  «Il dato di oggi: ogni mattina un dato ufficiale sull'Italia dai nostri osservatori. Ogni martedì «Il dato è tratto™» raccoglie la settimana.»;
  4-6 hashtag con #IlDatoDiOggi #TroisiRicerche #ilDatoètratto.
- b) INSTAGRAM: stessa apertura in 2-3 frasi; «Fonte: … · analisi completa su <sito> (link nel primo commento 👇)»;
  «Ogni mattina un dato ufficiale sull'Italia: canale WhatsApp «Il dato è tratto™», link in bio.»;
  8-10 hashtag con #IlDatoDiOggi #ilDatoètratto #TroisiRicerche.
- c) WHATSAPP: «📊 Il dato di oggi · <n>», una frase, «👉 <link>».
- d) COMMENTI:
  - WhatsApp (FB e LinkedIn): «💬 Iscrivetevi al canale WhatsApp «Il dato è tratto™»: ogni mattina un dato ufficiale sull'Italia, ogni martedì la settimana in numeri.» + https://whatsapp.com/channel/0029VbE9Kx9DeONGCBFx5v42
  - Instagram (FB e LinkedIn): «📲 Seguiteci anche su Instagram: ogni giorno il dato in 15 secondi.» + https://www.instagram.com/troisiricerche/
  - Su Instagram: «📎 L'analisi completa: <link senza https://www.> · 💬 Canale WhatsApp «Il dato è tratto™»: whatsapp.com/channel/0029VbE9Kx9DeONGCBFx5v42»
- Mai «con la fonte» in coda alle frasi. Rileggi come un dirigente pubblico e scrivi in fondo «PUNTO DEBOLE: …» se c'è.

## 5. Salvataggio sul Mac
In `…/SITI WEB - Troisi Ricerche/ildatoetratto.it/dato-di-oggi/<aaaa-mm-gg>/`: video.mp4, copertina.jpg, testi.txt
(scrivi nella cartella con device_bash se il file è piccolo; per il video SendUserFile e device_commit_files con il fileUuid,
oppure device_commit_files con stagedPath sotto /mnt/user-data/outputs/).

## 6. Programmazione social per le 06:50 del giorno di uscita
Andrea deve solo scegliere video.mp4 due volte (finestra file del Mac: non si può comandare, non cercare altre vie).
Prima di chiedere il clic: `tabs_context`; se il pannello del browser è nascosto chiedigli Cmd+Shift+B.
a) INSTAGRAM + FACEBOOK (un solo Reel) – scheda 1:
   https://business.facebook.com/latest/reels_composer?asset_id=112947764837&business_id=4521979151462744 ;
   «Pubblica su» = «Troisi Ricerche e troisiricerche»; clic nel campo «Testo» e digita la didascalia b).
   Chiedi ad Andrea «Aggiungi video» → video.mp4; al suo «fatto» controlla che il testo ci sia, Avanti → Avanti;
   «Remix e uso dell'audio originale» = «Non consentire»; scegli «Programma» (NON «Condividi ora»): data = giorno di uscita,
   ora 06:50 (campi con clic e frecce Su/Giù; fuso Europe/Vienna = Roma); screenshot di controllo; «Programma».
   Verifica in Contenuti › Programmati. Mai «Metti in evidenza».
b) LINKEDIN – scheda 2 (MAI nella stessa scheda di Business Suite):
   https://www.linkedin.com/company/1590415/admin/page-posts/published/?share=true ; clic su «Di cosa vorresti parlare?»
   e digita il testo a); rimuovi l'anteprima del link (X); icona immagine → chiedi ad Andrea «Carica dal computer» → video.mp4;
   al «fatto»: Avanti; NON «Pubblica»: icona orologio → data giorno di uscita, ora 06:50 (triple_click, Backspace ×15,
   scrivi 06:50) → Avanti → «Programma». Verifica con «Visualizza tutti i post programmati».
Se Andrea scrive «ferma», non programmare; se chiede correzioni, rifai e rimanda l'anteprima.

## 7. Commenti ai post USCITI STAMATTINA (stesso turno, prima di tutto il resto)
Testi nella sezione d) di `dato-di-oggi/<oggi>/testi.txt`. Se nel LEGGIMI.txt di oggi risultano già «commenti aggiunti», salta.
- Facebook: (Business Suite apre solo gli insight e facebook.com/reel/<content_id> dà «contenuto non disponibile»: NON usarli)
  apri https://www.facebook.com/troisiricerche/reels/ (si apre già come Pagina), prendi gli href /reel/<id>/ e apri quello
  con la didascalia di oggi; resize_window 1400×940 → riquadro «Commenta come Troisi Ricerche»: commento WhatsApp
  (testo, Maiusc+Invio, link) + Invio, poi commento Instagram allo stesso modo + Invio; verifica che compaiano una volta sola.
- Instagram: https://www.instagram.com/troisiricerche/ → primo /reel/ → https://www.instagram.com/p/<codice>/ con
  resize_window 1400×940 → «Aggiungi un commento...» → commento Instagram → «Pubblica». Poi resize_window preset desktop.
- LinkedIn: pagina dei post pubblicati, primo [data-urn] activity col testo del dato di oggi → «Commenta come Troisi Ricerche…»
  → commento WhatsApp → «Commenta»; commento Instagram: rimuovi l'anteprima (X) → «Commenta»; verifica «2 commenti».
Se un post di stamattina NON è uscito, non pubblicarlo da solo: scrivilo ad Andrea.
- SOLO IL MARTEDÌ: aggiungi anche i primi commenti ai post di «Il dato è tratto™» usciti alle 9:00 (Reel Instagram e carosello LinkedIn),
  con i testi di `ildatoetratto.it/carosello-linkedin/<data di oggi>/` (vedi IL-DATO-E-TRATTO.md, punto 8).
