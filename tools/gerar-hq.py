#!/usr/bin/env python3
"""Gera a arte dos quadros de uma HQ de fã a partir do roteiro (hq.json).

Usa o FLUX.1-schnell (modelo aberto, licença Apache 2.0) pelo Space gratuito do
Hugging Face, sem chave. Cada personagem tem uma "ficha" fixa (campo cast do
roteiro) que entra igual em todos os quadros, para a aparência não mudar.

Uso:
    pip install gradio_client pillow
    python tools/gerar-hq.py assets/comics/triunfo-e-tormento            # gera o que falta
    python tools/gerar-hq.py assets/comics/triunfo-e-tormento p03-2 p05-1 # refaz quadros
"""
import json
import os
import re
import sys
import time

from gradio_client import Client
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


def gen_size(w, h, long_side=1024):
    """Tamanho de geração com a mesma proporção do quadro, múltiplo de 32."""
    s = long_side / max(w, h)
    return max(256, round(w * s / 32) * 32), max(256, round(h * s / 32) * 32)


def main():
    folder = sys.argv[1]
    only = set(sys.argv[2:])
    hq = json.load(open(os.path.join(folder, "hq.json"), encoding="utf-8"))
    cast = hq.get("cast", {})
    client = Client("black-forest-labs/FLUX.1-schnell")
    for pi, page in enumerate(hq["pages"]):
        sizes = LAYOUTS[page["layout"]]
        for k, panel in enumerate(page["panels"]):
            name = f"p{pi:02d}-{k + 1}"
            out = os.path.join(folder, name + ".webp")
            if only and name not in only:
                continue
            if not only and os.path.exists(out):
                continue
            prompt = re.sub(r"\{(\w+)\}", lambda m: cast.get(m.group(1), m.group(0)), panel["p"]) + STYLE
            w, h = gen_size(*sizes[k], long_side=1280 if page.get("cover") else 1024)
            for attempt in range(4):
                try:
                    t = time.time()
                    res = client.predict(prompt=prompt, seed=panel.get("seed", 7), randomize_seed=False,
                                         width=w, height=h, num_inference_steps=4, api_name="/infer")
                    Image.open(res[0]).convert("RGB").save(out, "WEBP", quality=82, method=6)
                    print(name, f"{w}x{h}", "ok", round(time.time() - t, 1), "s", flush=True)
                    break
                except Exception as e:  # fila cheia ou cota do Space: espera e tenta de novo
                    print(name, "erro:", str(e)[:160], flush=True)
                    time.sleep(30 * (attempt + 1))


if __name__ == "__main__":
    main()
