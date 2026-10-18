# Video brevi dei siti

`monta-sito.js <mappatura|registro|customerpa> <h|v> uscita.mp4`: domanda battuta su filmato, grafiche animate (sito.html), passi, standard, chiusura con dominio e «Un progetto di Troisi Ricerche».
Filmati (clip/), foto (foto/) e musica Envato (musica/) restano fuori dal repository. Font: archivo.woff2 da strumenti/giorno/; scritta del logo: testo-bianco.svg ricavato dal PDF vettoriale del logo.

## Gli altri 16 siti

`siti-config.js` contiene le configurazioni di troisiricerche, ildatoetratto, delfi, troisiinsight, benessereorganizzativo, osservatoriobenessere, tip, troisiformazione, tindex, digitalizzazione, dibattito, internazionalizzazione, bdg, sveglia, voiceinhub, andreatroisi. `monta-sito.js` le carica in automatico (`node monta-sito.js delfi v delfi-v.mp4`).
Ogni scena dura un numero di battiti (`nb`); i battiti avanzati fino al punto di chiusura del brano vengono distribuiti fra le scene. Nuovi tipi di scena: `numero` (valore grande, testo e «Fonte: …») e `sito` (la home del sito in un telefono che scorre).
Ogni numero porta la sua fonte: Eurostat (NEET 2025), ISTAT (disoccupazione, agosto 2026, dati provvisori), OCSE PISA 2025 (sintesi INVALSI), ISTAT (elenco comuni), MEF e IPA (partecipate).
