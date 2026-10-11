"""Original background music, synthesized from scratch (no samples, no copyright).
style 'bright' : 100 BPM pop  C-G-Am-F, e-piano arpeggio, soft kick/shaker/clap
style 'calm'   : 84 BPM  Am-F-C-G, pad + piano, soft kick only"""
import numpy as np, sys
from scipy.signal import butter, sosfilt
SR = 44100
def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def env(n, a, d, sustain=1.0):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d) if d else np.minimum(1, t / max(a, 1e-4))
    return e * sustain
def epiano(f, dur, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    s = (np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*2*f*t)*np.exp(-t/0.25) + 0.12*np.sin(2*np.pi*3*f*t)*np.exp(-t/0.12)
         + 0.08*np.sin(2*np.pi*f*7.02*t)*np.exp(-t/0.03))
    return s * env(n, 0.004, 0.55) * vel * (1 + 0.04*np.sin(2*np.pi*5*t))
def pad(freqs, dur):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for det in (-0.12, 0.0, 0.11):
            ff = f * 2 ** (det / 12)
            for h in range(1, 7): s += np.sin(2*np.pi*ff*h*t + h) / (h ** 1.6)
    a = np.minimum(1, t / 0.6); r = np.minimum(1, (dur - t) / 0.5)
    return s * a * np.clip(r, 0, 1) / (len(freqs) * 3)
def bass(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2*np.pi*f*t) + 0.25*np.sin(2*np.pi*2*f*t)
    return s * env(n, 0.01, 0.9) * np.clip((dur - t) / 0.05, 0, 1)
rng = np.random.default_rng(7)
def kick():
    n = int(0.35*SR); t = np.arange(n)/SR; f = 50 + 90*np.exp(-t/0.04)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t/0.12)
def shaker():
    n = int(0.08*SR); s = rng.standard_normal(n) * np.exp(-np.arange(n)/SR/0.018)
    return sosfilt(butter(2, 6000, 'hp', fs=SR, output='sos'), s) * 0.5
def clap():
    n = int(0.2*SR); s = rng.standard_normal(n) * np.exp(-np.arange(n)/SR/0.05)
    return sosfilt(butter(2, [900, 4000], 'bp', fs=SR, output='sos'), s) * 0.6
def add(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if i < len(buf): buf[i:j] += x[:j - i]
def make(style, seconds, out):
    if style == 'bright':
        bpm, prog = 100, [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]
        drums = 'full'
    else:
        bpm, prog = 84, [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (43, [55, 59, 62])]
        drums = 'soft'
    beat = 60 / bpm; bar = 4 * beat
    n = int((seconds + 2) * SR)
    L = {k: np.zeros(n) for k in ('pad', 'keys', 'bass', 'drums')}
    bars = int(np.ceil(seconds / bar)) + 1
    arp = [0, 1, 2, 1, 0, 2, 1, 2] if style == 'bright' else [0, 2, 1, 2]
    for b in range(bars):
        root, chord = prog[b % 4]; t0 = b * bar
        add(L['pad'], pad([midi(c) for c in chord], bar + 0.4), t0)
        add(L['bass'], bass(midi(root), beat * 1.9), t0); add(L['bass'], bass(midi(root), beat * 1.9), t0 + 2 * beat)
        step = bar / len(arp)
        for k, idx in enumerate(arp):
            note = chord[idx] + 12; vel = 0.8 if k % 2 == 0 else 0.6
            add(L['keys'], epiano(midi(note), step * 2.2, vel), t0 + k * step)
        if b % 2 == 1 and style == 'bright':
            add(L['keys'], epiano(midi(chord[2] + 24), beat * 2, 0.35), t0 + 3.5 * beat)
        for q in range(4):
            if drums == 'full' or q in (0,):
                if q in (0, 2) or drums == 'full' and q == 0: add(L['drums'], kick() * (0.9 if drums == 'full' else 0.5), t0 + q * beat)
            if drums == 'full':
                if q in (1, 3) and b > 0: add(L['drums'], clap() * 0.22, t0 + q * beat)
                for e in (0, 0.5): add(L['drums'], shaker() * (0.35 if e else 0.22), t0 + (q + e) * beat)
    mix = 0.55*L['pad'] + 0.5*L['keys'] + 0.6*L['bass'] + 0.55*L['drums']
    mix = sosfilt(butter(2, 9000, 'lp', fs=SR, output='sos'), mix)
    # gentle stereo: delay one channel
    d = int(0.012 * SR); left = mix; right = np.concatenate([np.zeros(d), mix[:-d]])
    st = np.stack([left, right], 1)[: int(seconds * SR)]
    t = np.arange(len(st)) / SR
    fade = np.minimum(1, t / 1.5) * np.clip((seconds - t) / 2.5, 0, 1)
    st *= fade[:, None]
    st = st / (np.abs(st).max() + 1e-9) * 0.8
    np.save(out, st.astype(np.float32))
if __name__ == '__main__':
    make(sys.argv[1], float(sys.argv[2]), sys.argv[3])
