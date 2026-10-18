"""Genera models/auto.glb: un auto genérico low-poly que se muestra hasta que el usuario cargue el suyo.

Convenciones (las mismas que asume app.js): metros, Y hacia arriba, frente del auto hacia +Z.
Uso: python3 tools/make_car.py
"""
import json
import math
import struct
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'models' / 'auto.glb'

MATERIALS = {
    # nombre: (color RGBA lineal, metálico, rugosidad, emisivo)
    'Carroceria': ((0.10, 0.28, 0.75, 1), 0.6, 0.35, None),
    'Vidrio': ((0.02, 0.03, 0.05, 1), 0.2, 0.08, None),
    'Neumatico': ((0.02, 0.02, 0.02, 1), 0.0, 0.9, None),
    'Llanta': ((0.75, 0.75, 0.78, 1), 1.0, 0.25, None),
    'Faro': ((1, 1, 0.9, 1), 0.0, 0.2, (1, 1, 0.85)),
    'Stop': ((0.8, 0.02, 0.02, 1), 0.0, 0.3, (0.7, 0.0, 0.0)),
    'Negro': ((0.03, 0.03, 0.03, 1), 0.2, 0.6, None),
}


def sub(a, b):
    return [a[i] - b[i] for i in range(3)]


def cross(a, b):
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]


def norm(v):
    n = math.sqrt(sum(c * c for c in v)) or 1
    return [c / n for c in v]


class Mesh:
    """Triángulos con normales planas (vértices duplicados por cara)."""

    def __init__(self):
        self.pos, self.nrm, self.idx = [], [], []

    def poly(self, pts):
        """Agrega un polígono convexo; los puntos van en sentido antihorario visto desde afuera."""
        n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])))
        base = len(self.pos)
        for p in pts:
            self.pos.append(list(p))
            self.nrm.append(n)
        for i in range(1, len(pts) - 1):
            self.idx += [base, base + i, base + i + 1]


def extrude_profile(m, profile, x0, x1):
    """Extruye un perfil lateral (z, y) convexo y antihorario entre x0 y x1."""
    left = [(x0, y, z) for z, y in profile]
    right = [(x1, y, z) for z, y in profile]
    m.poly(left)
    m.poly(list(reversed(right)))
    k = len(profile)
    for i in range(k):
        j = (i + 1) % k
        m.poly([left[i], right[i], right[j], left[j]])


def box(m, c, s):
    x0, y0, z0 = (c[i] - s[i] / 2 for i in range(3))
    x1, y1, z1 = (c[i] + s[i] / 2 for i in range(3))
    extrude_profile(m, [(z0, y0), (z1, y0), (z1, y1), (z0, y1)], x0, x1)


def cylinder_x(m, c, r, w, seg=28):
    """Cilindro con eje en X (ruedas)."""
    prof = [(c[2] + r * math.cos(2 * math.pi * i / seg), c[1] + r * math.sin(2 * math.pi * i / seg)) for i in range(seg)]
    extrude_profile(m, prof, c[0] - w / 2, c[0] + w / 2)


def build():
    parts = {k: Mesh() for k in MATERIALS}
    W = 1.78  # ancho
    # Carrocería: perfil lateral (z adelante, y arriba)
    body = [(-2.12, 0.30), (2.10, 0.30), (2.22, 0.52), (2.12, 0.82), (1.05, 0.95), (-1.85, 0.98), (-2.18, 0.80), (-2.20, 0.50)]
    extrude_profile(parts['Carroceria'], body, -W / 2, W / 2)
    # Habitáculo vidriado y techo
    cabin = [(-1.70, 0.95), (1.05, 0.93), (0.30, 1.40), (-1.30, 1.43)]
    extrude_profile(parts['Vidrio'], cabin, -W / 2 + 0.10, W / 2 - 0.10)
    roof = [(-1.36, 1.40), (0.34, 1.37), (0.26, 1.46), (-1.26, 1.48)]
    extrude_profile(parts['Carroceria'], roof, -W / 2 + 0.08, W / 2 - 0.08)
    # Parantes centrales
    for x in (-W / 2 + 0.095, W / 2 - 0.095):
        box(parts['Carroceria'], (x, 1.18, -0.42), (0.02, 0.48, 0.10))
    # Ruedas
    for z in (1.38, -1.38):
        for side in (-1, 1):
            x = side * (W / 2 - 0.10)
            cylinder_x(parts['Neumatico'], (x, 0.36, z), 0.36, 0.26)
            cylinder_x(parts['Llanta'], (x + side * 0.01, 0.36, z), 0.22, 0.26)
    # Faros, stops, parrilla y espejos
    for side in (-1, 1):
        box(parts['Faro'], (side * 0.62, 0.70, 2.16), (0.36, 0.12, 0.06))
        box(parts['Stop'], (side * 0.66, 0.78, -2.18), (0.32, 0.12, 0.06))
        box(parts['Carroceria'], (side * (W / 2 + 0.07), 1.02, 0.85), (0.14, 0.08, 0.16))
    box(parts['Negro'], (0, 0.52, 2.20), (0.9, 0.16, 0.04))
    box(parts['Negro'], (0, 0.36, -2.19), (1.5, 0.10, 0.04))
    return parts


def write_glb(parts, path):
    bin_data = bytearray()
    buffer_views, accessors, materials, primitives = [], [], [], []

    def add_view(data, target):
        while len(bin_data) % 4:
            bin_data.append(0)
        buffer_views.append({'buffer': 0, 'byteOffset': len(bin_data), 'byteLength': len(data), 'target': target})
        bin_data.extend(data)
        return len(buffer_views) - 1

    for name, mesh in parts.items():
        if not mesh.idx:
            continue
        color, metal, rough, emissive = MATERIALS[name]
        mat = {'name': name, 'pbrMetallicRoughness': {'baseColorFactor': list(color), 'metallicFactor': metal, 'roughnessFactor': rough}}
        if emissive:
            mat['emissiveFactor'] = list(emissive)
        materials.append(mat)

        flat_pos = [c for p in mesh.pos for c in p]
        flat_nrm = [c for n in mesh.nrm for c in n]
        pv = add_view(struct.pack(f'<{len(flat_pos)}f', *flat_pos), 34962)
        nv = add_view(struct.pack(f'<{len(flat_nrm)}f', *flat_nrm), 34962)
        iv = add_view(struct.pack(f'<{len(mesh.idx)}I', *mesh.idx), 34963)
        mins = [min(p[i] for p in mesh.pos) for i in range(3)]
        maxs = [max(p[i] for p in mesh.pos) for i in range(3)]
        accessors += [
            {'bufferView': pv, 'componentType': 5126, 'count': len(mesh.pos), 'type': 'VEC3', 'min': mins, 'max': maxs},
            {'bufferView': nv, 'componentType': 5126, 'count': len(mesh.nrm), 'type': 'VEC3'},
            {'bufferView': iv, 'componentType': 5125, 'count': len(mesh.idx), 'type': 'SCALAR'},
        ]
        a = len(accessors)
        primitives.append({'attributes': {'POSITION': a - 3, 'NORMAL': a - 2}, 'indices': a - 1, 'material': len(materials) - 1})

    while len(bin_data) % 4:
        bin_data.append(0)
    gltf = {
        'asset': {'version': '2.0', 'generator': 'Mi Auto tools/make_car.py'},
        'scene': 0,
        'scenes': [{'nodes': [0]}],
        'nodes': [{'mesh': 0, 'name': 'Auto'}],
        'meshes': [{'name': 'Auto', 'primitives': primitives}],
        'materials': materials,
        'accessors': accessors,
        'bufferViews': buffer_views,
        'buffers': [{'byteLength': len(bin_data)}],
    }
    js = json.dumps(gltf, separators=(',', ':')).encode()
    js += b' ' * ((4 - len(js) % 4) % 4)
    total = 12 + 8 + len(js) + 8 + len(bin_data)
    out = struct.pack('<III', 0x46546C67, 2, total)
    out += struct.pack('<II', len(js), 0x4E4F534A) + js
    out += struct.pack('<II', len(bin_data), 0x004E4942) + bytes(bin_data)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(out)
    print(f'{path} ({len(out) // 1024} KB)')


if __name__ == '__main__':
    write_glb(build(), OUT)
