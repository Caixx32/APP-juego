"""Rasteriza, en el espacio UV del atlas, la altura y la inclinación de la superficie de cada triángulo."""
import numpy as np
from PIL import Image, ImageDraw
import sys
W = sys.argv[1]
N = 2048
P = np.fromfile(f'{W}/pos.bin', np.float32).reshape(-1, 3)
U = np.fromfile(f'{W}/uv.bin', np.float32).reshape(-1, 2)
I = np.fromfile(f'{W}/idx.bin', np.uint32).reshape(-1, 3)
a, b, c = P[I[:, 0]], P[I[:, 1]], P[I[:, 2]]
n = np.cross(b - a, c - a)
n /= np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-12)
y = (a[:, 1] + b[:, 1] + c[:, 1]) / 3
ymin, ymax = P[:, 1].min(), P[:, 1].max()
h = ((y - ymin) / (ymax - ymin) * 254 + 1).astype(int)        # 1..255 (0 = sin geometría)
ny = (np.abs(n[:, 1]) * 254 + 1).astype(int)                   # 1 = vertical, 255 = horizontal
uv = U[I] * N                                                   # glTF: v=0 arriba de la imagen
hm, nm = Image.new('L', (N, N), 0), Image.new('L', (N, N), 0)
dh, dn = ImageDraw.Draw(hm), ImageDraw.Draw(nm)
for t in range(len(I)):
    pts = [tuple(p) for p in uv[t]]
    dh.polygon(pts, fill=int(h[t]))
    dn.polygon(pts, fill=int(ny[t]))
hm.save(f'{W}/height.png'); nm.save(f'{W}/normal_y.png')
print('ok', len(I))
