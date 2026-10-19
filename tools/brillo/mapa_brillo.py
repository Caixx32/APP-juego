"""Genera el mapa de brillo por zonas (metallicRoughness de glTF: G = rugosidad, B = metalicidad)
a partir de los colores del atlas del modelo, sin tocar el .glb."""
import sys
import numpy as np
from PIL import Image

src_bc, src_mr, out, debug, src_h, src_ny = sys.argv[1:7]
height = np.array(Image.open(src_h)).astype(float) / 255       # altura de la superficie (0 = sin geometría)
tilt = np.array(Image.open(src_ny)).astype(float) / 255         # 0 = vertical, 1 = horizontal
bc = np.array(Image.open(src_bc).convert('RGB')).astype(float) / 255
mr = np.array(Image.open(src_mr).convert('RGB')).astype(float) / 255
r, g, b = bc[..., 0], bc[..., 1], bc[..., 2]
mx, mn = bc.max(2), bc.min(2)
sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)

body = (b - r > 0.10) & (b > g + 0.04)                                  # azul marino de la carrocería
glass = ~body & (g - r > 0.03) & (np.abs(g - b) < 0.06) & (mx > 0.12) & (mx < 0.45)  # gris pizarra de los vidrios
lights = (r > g + 0.2) & (r > b + 0.2)                                  # ópticas rojas: se dejan como vienen
chrome = (mx > 0.5) & (sat < 0.2)                                       # llantas y cromados: como vienen
matte = ~body & ~glass & ~lights & ~chrome & (sat < 0.35) & (mx < 0.5)   # gomas y plásticos
# La luneta trasera es más oscura que el resto de los vidrios: lo oscuro a la altura de las ventanillas
# y con la superficie de costado (no el techo) también es vidrio.
window_band = (height > 0.60) & (height < 0.93) & (tilt > 0) & (tilt < 0.8)
dark_glass = matte & window_band & (mx > 0.04)
glass |= dark_glass
matte &= ~dark_glass

out_mr = mr.copy()
out_mr[..., 0] = 1.0
out_mr[body, 1], out_mr[body, 2] = 0.40, 0.30
out_mr[glass, 1], out_mr[glass, 2] = 0.05, 0.10
out_mr[matte, 1], out_mr[matte, 2] = 0.85, 0.0
Image.fromarray((out_mr * 255).round().astype('uint8')).save(out, 'WEBP', lossless=True, method=6)

dbg = np.full_like(bc, 0.5)
dbg[body] = (0.1, 0.3, 1.0)
dbg[glass] = (0.0, 1.0, 1.0)
dbg[matte] = (1.0, 0.0, 1.0)
dbg[lights] = (1.0, 0.0, 0.0)
dbg[chrome] = (1.0, 1.0, 0.0)
Image.fromarray((dbg * 255).astype('uint8')).save(debug, 'WEBP', quality=80)
tot = body.size
print({k: round(v.sum() / tot * 100, 1) for k, v in dict(body=body, glass=glass, matte=matte, lights=lights, chrome=chrome).items()})
