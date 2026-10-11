import json, sys, numpy as np, soundfile as sf, subprocess
sys.path.insert(0, '/tmp/claude-0/tts'); sys.path.insert(0, '/tmp/claude-0/audio')
from st import synth
from music import make
from scipy.signal import resample_poly
SR = 44100
N = json.load(open('/tmp/claude-0/audio/narr.json'))
name = sys.argv[1]; v = N[name]; dur = v['dur']
voice = np.zeros(int((dur + 1) * SR)); active = np.zeros_like(voice)
t = 0.0; report = []
for planned, txt in v['lines']:
    x, sr = synth(txt, sid=v['sid'], speed=v.get('speed', 1.0))
    if sr != SR: x = resample_poly(x, SR, sr)
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    st = max(planned, t + 0.25); i = int(st * SR)
    voice[i:i + len(x)] += x[: len(voice) - i]; active[i:i + len(x)] = 1
    t = st + len(x) / SR; report.append((planned, round(st - planned, 2), round(t, 2)))
print(report); print(name, 'ends at', round(t, 2), 'of', dur, '| max drift', max(r[1] for r in report))
assert t < dur - 0.3, 'narration too long'
make(v['style'], dur, f'/tmp/claude-0/audio/{name}-music.npy')
m = np.load(f'/tmp/claude-0/audio/{name}-music.npy')
# ducking envelope: smooth the activity, music at 0.30 normally, 0.09 under voice
k = int(0.25 * SR); sm = np.convolve(active, np.ones(k) / k, 'same')[: len(m)]
gain = 0.30 - 0.21 * np.clip(sm * 1.5, 0, 1)
out = m * gain[:, None] + voice[: len(m), None] * 0.95
out = out / max(1.0, np.abs(out).max() / 0.97)
sf.write(f'/tmp/claude-0/audio/{name}.wav', out.astype(np.float32), SR)
