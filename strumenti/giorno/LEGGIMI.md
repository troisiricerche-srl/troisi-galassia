# Il dato di oggi – video quotidiano

`node rendi.js dati.json video.mp4` (NODE_PATH=$(npm root -g), ffmpeg nel PATH) → video 1080×1920, 15,6 s.

dati.json = colori del giorno da `colori-settimana.json` (variante B «chiari», scelta da Andrea il 14/10/2026) +
`data` («Mercoledì 14 ottobre 2026»), `n` (numero principale, scritto come nell'articolo), `tema` (MAIUSCOLO),
`riga` (frase che segue il numero, 10-16 parole), `barre` (2-4: `e` etichetta, `v` valore numerico, `t` testo, `c` = tema | ue | altro),
`fonte` («Fonte: <ente> (<dataset>), <anno> · <sito>»), `sito`.
Ogni numero deve comparire nell'articolo del giorno. Esempio: ../../uscite/giorno/2026-10-14/dati.json.
`anteprima.js` = fotogrammi affiancati per confrontare colori.

## Musica fissa della rubrica
Scelta da Andrea il 14/10/2026: brano Envato «The Corporate Ident» di Oasis_Music (120 bpm), tagliato da 4,78 s per 15,6 s, dissolvenza in entrata 0,25 s e in uscita da 14,9 s: il colpo cade a 3,7 s (salita del titolo) e a 12,2 s (cartello finale).
Il file pronto è sul Mac: `SITI WEB - Troisi Ricerche/ildatoetratto.it/envato/musica-dato-di-oggi.wav`. NON va nel repository (licenza Envato, non ridistribuibile).
Uso: `node rendi.js dati.json video.mp4 /percorso/musica-dato-di-oggi.wav`. Senza musica il video esce con audio muto.
Licenza: ogni video è un nuovo prodotto finale → su app.envato.com, scheda del brano, «Licenses» → nuovo nome «Il dato di oggi – <data>».
`jingle.py` (musica sintetizzata) resta come riserva, scartata da Andrea («troppo da videogioco»).
