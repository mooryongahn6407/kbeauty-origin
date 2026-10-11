import sherpa_onnx, soundfile as sf
S='/tmp/claude-0/tts/sherpa-onnx-supertonic-3-tts-int8-2026-05-11'
_tts = None
def tts():
    global _tts
    if _tts is None:
        cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
            supertonic=sherpa_onnx.OfflineTtsSupertonicModelConfig(
                duration_predictor=f'{S}/duration_predictor.int8.onnx', text_encoder=f'{S}/text_encoder.int8.onnx',
                vector_estimator=f'{S}/vector_estimator.int8.onnx', vocoder=f'{S}/vocoder.int8.onnx',
                tts_json=f'{S}/tts.json', unicode_indexer=f'{S}/unicode_indexer.bin', voice_style=f'{S}/voice.bin'),
            num_threads=4, provider='cpu'))
        assert cfg.validate()
        _tts = sherpa_onnx.OfflineTts(cfg)
    return _tts
def synth(text, sid=6, steps=12, speed=1.0):
    g = sherpa_onnx.GenerationConfig(); g.sid = sid; g.num_steps = steps; g.speed = speed; g.extra['lang'] = 'ko'
    a = tts().generate(text, g)
    import numpy as np
    return np.asarray(a.samples, dtype=np.float32), a.sample_rate
