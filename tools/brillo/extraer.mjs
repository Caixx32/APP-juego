import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import fs from 'fs';
const [src, out] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(src);
const root = doc.getRoot();
for (const t of root.listTextures()) fs.writeFileSync(`${out}/${t.getName()}.webp`, t.getImage());
const node = root.listNodes().find((n) => n.getMesh());
const m = node.getWorldMatrix();
const prim = node.getMesh().listPrimitives()[0];
const pos = prim.getAttribute('POSITION'), uv = prim.getAttribute('TEXCOORD_0'), idx = prim.getIndices();
const n = pos.getCount();
const P = new Float32Array(n * 3), U = new Float32Array(n * 2), e = [0, 0, 0], f = [0, 0];
for (let i = 0; i < n; i++) {
  pos.getElement(i, e);
  P[i * 3] = m[0] * e[0] + m[4] * e[1] + m[8] * e[2] + m[12];
  P[i * 3 + 1] = m[1] * e[0] + m[5] * e[1] + m[9] * e[2] + m[13];
  P[i * 3 + 2] = m[2] * e[0] + m[6] * e[1] + m[10] * e[2] + m[14];
  uv.getElement(i, f); U[i * 2] = f[0]; U[i * 2 + 1] = f[1];
}
fs.writeFileSync(`${out}/pos.bin`, Buffer.from(P.buffer));
fs.writeFileSync(`${out}/uv.bin`, Buffer.from(U.buffer));
fs.writeFileSync(`${out}/idx.bin`, Buffer.from(new Uint32Array(idx.getArray()).buffer));
const mat = root.listMaterials()[0];
console.log(JSON.stringify({ verts: n, tris: idx.getCount() / 3, matName: mat.getName(), rough: mat.getRoughnessFactor(), metal: mat.getMetallicFactor(), uvNorm: uv.getNormalized(), sampler: mat.getBaseColorTextureInfo()?.getWrapS() }));
