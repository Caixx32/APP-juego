"""Achica un .glb recomprimiendo sus texturas como JPEG (la geometría no se toca).

Uso: python3 tools/optimize_glb.py entrada.glb salida.glb [--max 2048] [--quality 85]
"""
import argparse
import io
import json
import struct

from PIL import Image


def read_glb(path):
    data = open(path, 'rb').read()
    magic, version, _ = struct.unpack('<III', data[:12])
    assert magic == 0x46546C67 and version == 2, 'no es un .glb v2'
    jlen = struct.unpack('<I', data[12:16])[0]
    gltf = json.loads(data[20:20 + jlen])
    bin_start = 20 + jlen + 8
    blen = struct.unpack('<I', data[20 + jlen:24 + jlen])[0]
    return gltf, data[bin_start:bin_start + blen]


def write_glb(path, gltf, binary):
    js = json.dumps(gltf, separators=(',', ':')).encode()
    js += b' ' * ((4 - len(js) % 4) % 4)
    binary += b'\0' * ((4 - len(binary) % 4) % 4)
    out = struct.pack('<III', 0x46546C67, 2, 28 + len(js) + len(binary))
    out += struct.pack('<II', len(js), 0x4E4F534A) + js
    out += struct.pack('<II', len(binary), 0x004E4942) + binary
    open(path, 'wb').write(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('dst')
    ap.add_argument('--max', type=int, default=2048, help='lado máximo de cada textura en px')
    ap.add_argument('--quality', type=int, default=85)
    a = ap.parse_args()

    gltf, binary = read_glb(a.src)
    image_views = {img['bufferView']: i for i, img in enumerate(gltf.get('images', [])) if 'bufferView' in img}

    # Se reconstruye el buffer entero porque las texturas cambian de tamaño.
    new_bin = bytearray()
    for vi, view in enumerate(gltf['bufferViews']):
        start = view.get('byteOffset', 0)
        chunk = binary[start:start + view['byteLength']]
        if vi in image_views:
            img_meta = gltf['images'][image_views[vi]]
            im = Image.open(io.BytesIO(chunk))
            has_alpha = im.mode in ('RGBA', 'LA') and im.getextrema()[-1][0] < 255
            if max(im.size) > a.max:
                im.thumbnail((a.max, a.max), Image.LANCZOS)
            buf = io.BytesIO()
            if has_alpha:
                im.save(buf, 'PNG', optimize=True)
                img_meta['mimeType'] = 'image/png'
            else:
                im.convert('RGB').save(buf, 'JPEG', quality=a.quality, optimize=True)
                img_meta['mimeType'] = 'image/jpeg'
            chunk = buf.getvalue()
        while len(new_bin) % 4:
            new_bin.append(0)
        view['byteOffset'] = len(new_bin)
        view['byteLength'] = len(chunk)
        new_bin.extend(chunk)
    gltf['buffers'][0]['byteLength'] = len(new_bin)
    write_glb(a.dst, gltf, bytes(new_bin))
    print(f'{a.src}: {len(binary) // 1024} KB -> {a.dst}: {len(new_bin) // 1024} KB')


if __name__ == '__main__':
    main()
