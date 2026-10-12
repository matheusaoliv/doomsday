#!/usr/bin/env python3
"""Gera a arte dos quadros de uma HQ de fã a partir do roteiro (hq.json).

Modelo: FLUX.1-schnell (aberto, licença Apache 2.0). Dois jeitos de rodar, ambos grátis:

  1. Local, sem cota (mais lento): stable-diffusion.cpp (github.com/leejet/stable-diffusion.cpp)
     SD_CLI=/caminho/sd-cli SD_MODELS=/caminho/modelos python tools/gerar-hq.py <pasta>
     Em SD_MODELS: flux1-schnell-Q4_K_S.gguf, t5-v1_1-xxl-encoder-Q4_K_M.gguf,
     clip_l.safetensors e ae.safetensors.
  2. Pelo Space gratuito do Hugging Face (rápido, mas com cota diária por IP):
     pip install gradio_client pillow && python tools/gerar-hq.py <pasta>

Cada personagem tem uma "ficha" fixa (campo cast do roteiro) que entra igual em
todos os quadros, para a aparência não mudar.

Exemplos:
    python tools/gerar-hq.py assets/comics/triunfo-e-tormento            # gera o que falta
    python tools/gerar-hq.py assets/comics/triunfo-e-tormento p03-2 p05-1 # refaz quadros
"""
import json
import os
import re
import subprocess
import sys
import tempfile
import time

from PIL import Image

STYLE = (", graphic novel panel art, bold black ink linework, heavy dramatic shadows, painted colors, "
         "cinematic composition, highly detailed, no text, no speech bubbles, no lettering, no watermark")

# mesmas grades do leitor (assets/js/hq.js): página 800x1200, margem 26, calha 14
M, G, CW, CH = 26, 14, 748, 1148
HALF = (CW - G) / 2
THIRD = (CW - 2 * G) / 3
LAYOUTS = {
    "splash": [(CW, CH)],
    "w-2-w": [(CW, 390), (HALF, 360), (HALF, 360), (CW, 370)],
    "2-w-2": [(HALF, 360), (HALF, 360), (CW, 400), (HALF, 360), (HALF, 360)],
    "w-w-w": [(CW, 373), (CW, 374), (CW, 373)],
    "tall-2": [(HALF, CH), (HALF, 567), (HALF, 567)],
    "w-3": [(CW, 560), (THIRD, 574), (THIRD, 574), (THIRD, 574)],
    "w-2": [(CW, 560), (HALF, 574), (HALF, 574)],
    "2-w": [(HALF, 574), (HALF, 574), (CW, 560)],
}


def gen_size(w, h, long_side=None, area=None):
    """Tamanho de geração com a mesma proporção do quadro, múltiplo de 64
    (pelo lado maior ou por uma área-alvo em pixels)."""
    s = long_side / max(w, h) if long_side else (area / (w * h)) ** 0.5
    return max(256, round(w * s / 64) * 64), max(256, round(h * s / 64) * 64)


def finish(src, out, long_side=1024):
    """Amplia para ~1024 px no lado maior (Lanczos + nitidez leve) e salva em WebP."""
    from PIL import ImageFilter
    im = Image.open(src).convert("RGB")
    k = long_side / max(im.size)
    if k > 1:
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        im = im.filter(ImageFilter.UnsharpMask(radius=1.4, percent=70, threshold=2))
    im.save(out, "WEBP", quality=84, method=6)


class LocalFlux:
    """stable-diffusion.cpp na CPU: sem cota, ~10 min por quadro em 4 núcleos.
    Gera ~300 mil pixels por quadro (capa: ~420 mil) e amplia no fim."""
    long_side = None
    area = int(os.environ.get("SD_AREA", "300000"))

    def __init__(self, cli, models):
        self.cli, self.m = cli, models

    def __call__(self, prompt, seed, w, h, out):
        with tempfile.TemporaryDirectory() as tmp:
            png = os.path.join(tmp, "q.png")
            cmd = [self.cli, "--diffusion-model", os.path.join(self.m, "flux1-schnell-Q4_K_S.gguf"),
                   "--vae", os.path.join(self.m, "ae.safetensors"),
                   "--clip_l", os.path.join(self.m, "clip_l.safetensors"),
                   "--t5xxl", os.path.join(self.m, "t5-v1_1-xxl-encoder-Q4_K_M.gguf"),
                   "-p", prompt, "--cfg-scale", "1.0", "--sampling-method", "euler", "--steps", "4",
                   "-W", str(w), "-H", str(h), "-s", str(seed), "-t", str(os.cpu_count() or 4),
                   "--diffusion-fa", "-o", png]
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
            finish(png, out)


class SpaceFlux:
    """Space gratuito do Hugging Face: rápido, mas a cota por IP acaba."""
    long_side = 1024
    area = None

    def __init__(self):
        from gradio_client import Client
        self.client = Client("black-forest-labs/FLUX.1-schnell")

    def __call__(self, prompt, seed, w, h, out):
        res = self.client.predict(prompt=prompt, seed=seed, randomize_seed=False, width=w, height=h,
                                  num_inference_steps=4, api_name="/infer")
        Image.open(res[0]).convert("RGB").save(out, "WEBP", quality=84, method=6)


def main():
    folder = sys.argv[1]
    only = set(sys.argv[2:])
    hq = json.load(open(os.path.join(folder, "hq.json"), encoding="utf-8"))
    cast = hq.get("cast", {})
    cli, models = os.environ.get("SD_CLI"), os.environ.get("SD_MODELS")
    engine = LocalFlux(cli, models) if cli and models else SpaceFlux()
    for pi, page in enumerate(hq["pages"]):
        sizes = LAYOUTS[page["layout"]]
        for k, panel in enumerate(page["panels"]):
            name = f"p{pi:02d}-{k + 1}"
            out = os.path.join(folder, name + ".webp")
            if (only and name not in only) or (not only and os.path.exists(out)):
                continue
            prompt = re.sub(r"\{(\w+)\}", lambda m: cast.get(m.group(1), m.group(0)), panel["p"]) + STYLE
            if engine.area:
                w, h = gen_size(*sizes[k], area=engine.area * (1.4 if page.get("cover") else 1))
            else:
                w, h = gen_size(*sizes[k], long_side=engine.long_side)
            for attempt in range(3):
                try:
                    t = time.time()
                    engine(prompt, panel.get("seed", 7), w, h, out)
                    print(name, f"{w}x{h}", "ok", round(time.time() - t), "s", flush=True)
                    break
                except Exception as e:  # fila, cota ou falha pontual: espera e tenta de novo
                    print(name, "erro:", str(e)[:200], flush=True)
                    time.sleep(30 * (attempt + 1))


if __name__ == "__main__":
    main()
