"""Jingle originale di «Il dato di oggi» (firma sonora fissa, uguale ogni giorno), 15,6 s, a tempo con giorno.html.
Composto e sintetizzato qui: nessun campione esterno, nessun diritto di terzi, nessun rischio di segnalazioni.
Uso: python3 jingle.py jingle.wav
Firma: «pestata-pestata-BATTIMANO» (il-da-to) + corsa di 7 note sulle 7 lettere di «di oggi» che entrano.
Tempi (dal video): cambio parola 1,9 s (lettere nuove 2,34–2,47 s), salita del titolo 3,7 s, chiusura 12,2 s, cartello finale 12,8 s.
Groove 3,7–12,2 s a 127 bpm (18 battiti esatti), tenuto basso perché sotto si legge il dato."""
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter

SR = 44100
BPM = 127
B = 60 / BPM
DUR = 15.6
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



def stomp(g=1.0):
    k = kick(); n = len(k); t = np.arange(n) / SR
    body = lp(rng.standard_normal(n), 400) * np.exp(-t * 25) * 0.6
    return (k * 1.1 + body) * g

def chime(m, dur=0.9):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2*np.pi*hz(m)*t) + 0.4*np.sin(2*np.pi*hz(m)*2*t)*np.exp(-t*6) + 0.15*np.sin(2*np.pi*hz(m)*3.01*t)*np.exp(-t*9)
    return x * env(n, 0.002, 0.35) * 0.32

def firma(t0, g=1.0):          # pestata – pestata – BATTIMANO (il – da – to)
    add(stomp(g), t0, -0.1, 1.0)
    add(stomp(g), t0 + B, 0.1, 1.0)
    add(clap(), t0 + 2*B, 0, 1.25 * g)
    add(stomp(g * .8), t0 + 2*B, 0, 0.8)

MOT = [69, 71, 73, 76, 78, 81, 85]   # la maggiore pentatonica che sale: le 7 lettere di «di oggi»

# 0–1,9 s: firma d'apertura, poi le lettere che escono (fruscio) e quelle che entrano (corsa di note)
T3 = 3.7
firma(T3 - 7*B)                                  # 0,40 – 0,87 – 1,34 s
add(hat(True), T3 - 7*B + 2*B, 0.3, 0.7)
add(riser(0.5), 1.9, 0, 0.5)                    # «è tratto» esce
for k, m in enumerate(MOT):                      # «di oggi» entra: una nota per lettera
    add(pluck(m, 0.22), 2.338 + k * 0.022, 0.5 * np.sin(k), 1.25)
    add(chime(m + 12, 0.5), 2.338 + k * 0.022, -0.3 * np.sin(k), 0.35)
add(pad([57, 61, 64, 69], 1.6, 1500), 2.3, 0, 0.8)
add(riser(1.1), T3 - 1.1, 0, 0.9)

# 3,7 s: colpo e groove sotto il dato (18 battiti), volume contenuto
add(hit(), T3, 0, 0.8)
add(clap(), T3, 0, 1.0)
CH = [[57, 61, 64], [54, 57, 61], [50, 54, 57], [52, 56, 59]]   # La – Fa#m – Re – Mi
ROOT = [45, 42, 38, 40]
G = 0.55
for k in range(18):
    t = T3 + k * B
    add(stomp(G), t, 0, 1.0)
    if k % 2 == 1:
        add(clap(), t, 0.1, 0.7 * G)
    add(hat(), t + B / 2, 0.35, 0.6 * G)
    c = (k // 4) % 4
    if k % 4 == 0:
        add(pad(CH[c], 4 * B + .05, 1600), t, 0, 0.55)
    add(bass(ROOT[c] - 12, B / 2 - 0.01), t, 0, 0.5)
    add(bass(ROOT[c] - 12, B / 2 - 0.01), t + B / 2, 0, 0.35)
    arp = [CH[c][0] + 12, CH[c][1] + 12, CH[c][2] + 12, CH[c][1] + 12]
    add(pluck(arp[k % 4] + 12, 0.14), t + B / 2, 0.4 * np.sin(k), 0.45)

# 12,2 s: chiusura – di nuovo la firma, poi il motivo per intero sul cartello finale
TF = T3 + 18 * B                                 # 12,20 s esatti
add(riser(0.45), TF - 0.45, 0, 0.6)
firma(TF, 1.0)
for k, m in enumerate(MOT):
    add(chime(m, 1.6 if k == 6 else 0.7), TF + 3*B + k * B / 4, 0.4 * np.sin(k), 0.9)
add(pad([57, 61, 64, 69, 73], 2.8, 2600), TF + 3*B, 0, 0.9)
add(hit(), TF + 3*B + 6 * B / 4, 0, 0.55)

x = np.tanh(out * 1.3)
fade = np.ones(N); fl = int(0.6 * SR); fade[-fl:] = np.linspace(1, 0, fl)
x *= fade[:, None]
x /= np.max(np.abs(x)) / 0.89
wavfile.write(sys.argv[1] if len(sys.argv) > 1 else 'jingle.wav', SR, (x * 32767).astype(np.int16))
print('ok', DUR, 's  battito', round(B, 4), 'chiusura a', round(TF, 3))
