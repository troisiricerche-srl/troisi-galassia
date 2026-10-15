# Video di Troisi Ricerche

Due video, in 16:9 e 9:16, montati a tempo di musica:

- `monta.js`: video istituzionale (61 s). Apertura col marchio TT, filmati degli eventi del canale YouTube, «Misuriamo …», numeri del sito (20+ anni, 500+ ricerche, 200+ clienti, 20+ siti), foto «nei luoghi dove si decide», mosaico «TROISI RICERCHE», chiusura con troisiricerche.net sull'ultimo colpo.
- `monta-galassia.js`: trailer della galassia dei siti (36 s). Telefoni con le home dei siti, griglia «Oltre 20 siti, un solo metodo», «Ogni mattina un dato ufficiale sull'Italia», chiusura.
- `overlay.html`: tutte le sovrimpressioni (canvas), font Archivo (`archivo.woff2`, da copiare da `strumenti/giorno/`).

Fuori dal repository (cartella di lavoro): `clip/` (proxy 1080p dei video del canale), `foto/` (foto da Facebook, LinkedIn e dossier, con persone riconoscibili), `siti/` (schermate delle home), `musica/` (brani Envato «Majestic Heroes» e «Inspiring Technology Trailer»). Per ogni video pubblicato si registra una licenza Envato nuova.

Uso: `NODE_PATH=$(npm root -g) node monta.js h|v uscita.mp4` (con `PROVA=t1,t2` produce solo fotogrammi di prova in `tmp/`).
