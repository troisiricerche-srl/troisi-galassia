#!/bin/bash
# Taglia la musica Envato «The Drumming» (Intro and Outro, MrClaps) per le due sigle. Uso: ./monta.sh "The Drumming.wav" cartella_uscita
M="$1"; O="${2:-.}"
# apertura: 4,98 → 20,36 s, poi la coda finale da 64,98 s (giunta sul battito, dissolvenza incrociata 20 ms)
ffmpeg -v error -y -ss 4.98 -t 15.40 -i "$M" -ss 64.98 -i "$M" -filter_complex "[0:a]afade=t=in:d=0.08[a];[1:a]atrim=0:4.62[b];[a][b]acrossfade=d=0.02:c1=tri:c2=tri,apad=whole_dur=20,atrim=0:20,afade=t=out:st=19.2:d=0.8" "$O/sigla-apertura.wav"
# chiusura: 53,45 s → fine (16,15 s), colpo finale a 11,53 s
ffmpeg -v error -y -ss 53.45 -i "$M" -af "afade=t=in:d=0.05,apad=whole_dur=16.15,atrim=0:16.15" "$O/sigla-chiusura.wav"
