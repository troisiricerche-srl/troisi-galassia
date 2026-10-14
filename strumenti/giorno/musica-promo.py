"""Musica originale per il promo «Il dato di oggi»: 120 bpm, 16 s, stile elettronico incalzante.
Composta e sintetizzata qui (nessun campione esterno, nessun diritto di terzi).
Uso: python3 musica-promo.py musica.wav
Struttura (battuta = 0,5 s): 0-3 s intro (pad + charleston, salita), 3 s colpo, 3,5-11 s groove pieno
(cassa in 4, clap su 2 e 4, basso, arpeggio a sedicesimi, "tick" a ogni cambio scheda), 11 s colpo + filtro,
12,5-16 s chiusura con accordo e coda."""
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter

SR = 44100
BPM = 120
B = 60 / BPM          # 0,5 s
DUR = 16.0
N = int(SR * DUR)
out = np.zeros((N, 2))
rng = np.random.default_rng(7)


def at(t):
    return int(t * SR)


def add(sig, t, pan=0.0, gain=1.0):
    i = at(t)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    out[i:i + len(sig), 0] += sig * l * 1.414
    out[i:i + len(sig), 1] += sig * r * 1.414


def env(n, a=0.002, d=0.2, s=0.0, rel=0.05, hold=None):
    t = np.arange(n) / SR
    e = np.minimum(t / a, 1.0)
    e *= np.where(t < a, 1, s + (1 - s) * np.exp(-(t - a) / d))
    if hold is not None:
        e *= np.where(t < hold, 1, np.exp(-(t - hold) / rel))
    return e


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 110 * np.exp(-t * 35)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) + 0.15 * np.sin(ph * 2) * np.exp(-t * 30)


def clap():
    n = int(0.25 * SR)
    no = rng.standard_normal(n)
    b, a = butter(2, [900 / (SR / 2), 4000 / (SR / 2)], 'band')
    no = lfilter(b, a, no)
    t = np.arange(n) / SR
    e = np.exp(-t * 18) + 0.6 * np.exp(-np.maximum(t - 0.012, 0) * 40) * (t > 0.012)
    return no * e * 0.9


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    no = rng.standard_normal(n)
    b, a = butter(2, 7000 / (SR / 2), 'high')
    no = lfilter(b, a, no)
    return no * env(n, 0.001, 0.06 if open_ else 0.015) * 0.35


def saw(f, n, det=0.0):
    t = np.arange(n) / SR
    s = 0
    for d in (-det, 0, det):
        ph = (t * f * (1 + d)) % 1
        s = s + (2 * ph - 1)
    return s / 3


def lp(x, fc):
    b, a = butter(2, min(fc, SR / 2 - 100) / (SR / 2))
    return lfilter(b, a, x)


def pluck(m, dur=0.22):
    n = int(dur * SR)
    x = saw(hz(m), n, 0.004)
    x = lp(x, 3200) * env(n, 0.002, 0.09)
    return x * 0.28


def bass(m, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * hz(m) * t) + 0.35 * lp(saw(hz(m), n), 900)
    return x * env(n, 0.004, 0.25, 0.6, 0.04, dur - 0.04) * 0.45


def pad(ms, dur, fc=1800):
    n = int(dur * SR)
    x = sum(saw(hz(m), n, 0.006) for m in ms) / len(ms)
    t = np.arange(n) / SR
    e = np.minimum(t / 0.6, 1) * np.minimum((dur - t) / 0.5, 1)
    return lp(x, fc) * e * 0.22


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    no = rng.standard_normal(n)
    out_ = np.zeros(n)
    for k in range(8):  # filtro che sale, a blocchi
        s, e_ = k * n // 8, (k + 1) * n // 8
        out_[s:e_] = lp(no[s:e_], 600 + 9000 * (k / 8) ** 2)
    return out_ * (t / dur) ** 2 * 0.35


def hit():
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    no = lp(rng.standard_normal(n), 5000) * np.exp(-t * 4) * 0.4
    k = kick()
    return no + np.pad(k, (0, max(0, n - len(k))))[:n] * 1.2


# accordi (la minore – fa – do – sol), una battuta = 4 battiti = 2 s
CH = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
ROOT = [45, 41, 48, 43]

# intro: pad + charleston che si infittiscono + salita
add(pad([57, 60, 64, 69], 3.2, 1200), 0.0, 0, 1.0)
for i in range(6):
    add(hat(), i * B, 0.3, 0.7)
for i in range(4):
    add(hat(), 2.0 + i * B / 2, -0.3, 0.8)
add(riser(1.5), 1.5, 0, 1.0)
for j, m in enumerate([69, 72, 76, 79]):         # piccolo motivo sul cambio parola (1,5 s)
    add(pluck(m, 0.18), 1.5 + j * B / 2, 0.2 * (-1) ** j, 1.1)

# groove 3,0 – 11,0 s
add(hit(), 3.0, 0, 0.9)
t0 = 3.0
nb = int((11.0 - t0) / B)
for k in range(nb):
    t = t0 + k * B
    add(kick(), t, 0, 1.0)
    if k % 2 == 1:
        add(clap(), t, 0.1, 0.8)
    add(hat(), t + B / 2, 0.35, 0.9)
    if k % 4 == 3:
        add(hat(True), t + B / 2, -0.3, 0.6)
for bar in range(4):                              # 4 battute da 2 s
    t = t0 + bar * 2.0
    c = bar % 4
    add(pad(CH[c], 2.05, 2400), t, 0, 0.8)
    for q in range(8):                            # basso a crome, con "pompa"
        add(bass(ROOT[c] - 12, B / 2 - 0.01), t + q * B / 2, 0, 0.9 if q % 2 else 0.6)
    arp = [CH[c][0] + 12, CH[c][1] + 12, CH[c][2] + 12, CH[c][1] + 24]
    for s in range(16):                           # arpeggio a sedicesimi
        add(pluck(arp[s % 4], 0.16), t + s * B / 4, 0.4 * np.sin(s), 0.9)
for i in range(7):                                # «tick» sul cambio di ogni scheda (3,5 + i s)
    add(pluck(84 + [0, 2, 4, 5, 7, 9, 12][i], 0.12), 3.5 + i * 1.0, 0, 1.3)

# 11 s: le schede si affiancano – colpo, poi chiusura
add(riser(0.5), 10.5, 0, 0.8)
add(hit(), 11.0, 0, 1.0)
add(pad([57, 64, 69, 72, 76], 5.0, 3000), 11.0, 0, 1.0)
for k in range(6):
    add(kick(), 12.5 + k * B, 0, 0.8)
    add(hat(), 12.5 + k * B + B / 2, 0.3, 0.7)
    if k % 2:
        add(clap(), 12.5 + k * B, 0, 0.6)
for j, m in enumerate([81, 79, 76, 72, 69]):
    add(pluck(m, 0.3), 12.5 + j * B / 2, 0.3 * (-1) ** j, 1.0)
add(hit(), 15.5, 0, 0.5)

# master: leggera compressione morbida, dissolvenza finale, normalizzazione
x = np.tanh(out * 1.4)
fade = np.ones(N)
fade[-int(0.35 * SR):] = np.linspace(1, 0, int(0.35 * SR))
x *= fade[:, None]
x /= np.max(np.abs(x)) / 0.89
wavfile.write(sys.argv[1] if len(sys.argv) > 1 else 'musica.wav', SR, (x * 32767).astype(np.int16))
print('ok', DUR, 's')
