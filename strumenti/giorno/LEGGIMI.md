# Il dato di oggi – video quotidiano

`node rendi.js dati.json video.mp4` (NODE_PATH=$(npm root -g), ffmpeg nel PATH) → video 1080×1920, 15,6 s.

dati.json = colori del giorno da `colori-settimana.json` (variante B «chiari», scelta da Andrea il 14/10/2026) +
`data` («Mercoledì 14 ottobre 2026»), `n` (numero principale, scritto come nell'articolo), `tema` (MAIUSCOLO),
`riga` (frase che segue il numero, 10-16 parole), `barre` (2-4: `e` etichetta, `v` valore numerico, `t` testo, `c` = tema | ue | altro),
`fonte` («Fonte: <ente> (<dataset>), <anno> · <sito>»), `sito`.
Ogni numero deve comparire nell'articolo del giorno. Esempio: ../../uscite/giorno/2026-10-14/dati.json.
`anteprima.js` = fotogrammi affiancati per confrontare colori.

## Jingle (firma sonora)
Ogni video esce con lo stesso jingle originale, `jingle.wav`, generato da `python3 jingle.py jingle.wav` (sintetizzato qui, nessun diritto di terzi: niente segnalazioni su Instagram/Facebook).
Firma: «pestata-pestata-battimano» all'inizio e alla chiusura; corsa di 7 note quando entrano le 7 lettere di «di oggi»; groove a 127 bpm sotto il dato (3,7–12,2 s).
`rendi.js` lo aggiunge da solo; per un video muto: `node rendi.js dati.json video.mp4 nessuno`. Se cambiano i tempi di giorno.html, vanno aggiornati anche in jingle.py.
