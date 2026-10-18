'use strict';

/* Datos de Mi Auto: estado, guardado (local o Firestore), migración, adjuntos, dólar y avisos. */

const STORAGE_KEY = 'mi-auto-v1';          // datos guardados en el dispositivo (modo sin nube y versiones viejas)
const DEVICE_KEY = 'mi-auto-dispositivo';  // preferencias de este dispositivo (no se comparten)
const MIGRATED_KEY = 'mi-auto-migrado';    // marca de que los datos locales ya se subieron a la nube
const RATE_KEY = 'mi-auto-dolar';          // última cotización del dólar blue conocida
const COLLECTIONS = ['tasks', 'expenses', 'docs', 'fines'];

const CATEGORIES = {
  combustible: { label: 'Combustible', icon: 'fuel', color: '#3987e5' },
  mantenimiento: { label: 'Mantenimiento', icon: 'wrench', color: '#d95926' },
  reparacion: { label: 'Reparación', icon: 'tool', color: '#199e70' },
  seguro: { label: 'Seguro', icon: 'shield', color: '#c98500' },
  patente: { label: 'Patente / impuestos', icon: 'receipt', color: '#d55181' },
  peaje: { label: 'Peaje / estacionamiento', icon: 'road', color: '#008300' },
  lavado: { label: 'Lavado', icon: 'drop', color: '#9085e9' },
  multa: { label: 'Multas', icon: 'ticket', color: '#e66767' },
  otro: { label: 'Otro', icon: 'box', color: '#8b95a5' },
};

const FINE_STATUS = { pendiente: 'Pendiente', pagada: 'Pagada', descargo: 'En descargo' };

const CAR_COLORS = {
  'Azul marino': '#1f3c88',
  'Azul': '#2f7bf5',
  'Celeste': '#3ea6ff',
  'Rojo': '#e0353b',
  'Bordó': '#8e1b2c',
  'Naranja': '#ff7a1a',
  'Amarillo': '#f5c518',
  'Verde': '#2fbf71',
  'Blanco': '#f2f4f7',
  'Gris plata': '#b8c0cc',
  'Gris oscuro': '#5b6573',
  'Negro': '#1b1e23',
};
const DEFAULT_COLOR = '#1f3c88';

// Avisar cuando falte este margen para un vencimiento.
const SOON_KM_RATIO = 0.1;
const SOON_KM_MAX = 1000;
const SOON_DAYS = 30;
const FINE_SOON_DAYS = 10;

// Adjuntos: fotos comprimidas en el navegador y PDF hasta este tamaño.
const IMAGE_MAX_PX = 1600;
const IMAGE_QUALITY = 0.7;
const IMAGE_MAX_BYTES = 900 * 1024;
const PDF_MAX_BYTES = 3 * 1024 * 1024;

const DEFAULT_DOCS = [
  { name: 'Cédula del auto', match: /c[eé]dula/i, notifyDays: 30 },
  { name: 'Registro (licencia de conducir)', match: /registro|licencia/i, notifyDays: 30 },
  { name: 'Seguro', match: /seguro|p[oó]liza/i, notifyDays: 15 },
  { name: 'VTV', match: /vtv|itv|verificaci/i, notifyDays: 30 },
];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------- Utilidades ---------- */

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const usd = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', currencyDisplay: 'code', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 });

function fmtUsd(n) {
  return usd.format(n).replace('USD', 'US$').replace(/\s+/, ' ');
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function today() {
  return toISO(new Date());
}

function toISO(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function parseISO(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addMonths(iso, months) {
  const d = parseISO(iso);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return toISO(d);
}

function addDays(iso, days) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

function daysUntil(iso) {
  return Math.round((parseISO(iso) - parseISO(today())) / 86400000);
}

function fmtDate(iso) {
  if (!iso) return '—';
  return parseISO(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtKm(n) {
  return `${Math.round(n).toLocaleString('es-AR')} km`;
}

function daysText(days) {
  if (days === 0) return 'hoy';
  if (days === 1) return 'mañana';
  if (days === -1) return 'ayer';
  return days > 0 ? `en ${days} días` : `hace ${-days} días`;
}

function numOrNull(v) {
  if (v === '' || v == null) return null;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function levelOrder(level) {
  return { bad: 0, warn: 1, none: 2, ok: 3 }[level];
}

/* ---------- Estado ---------- */

function defaultVehicle() {
  return { name: 'Mi auto', plate: '', km: 0, color: DEFAULT_COLOR, docsDefaultsV2: true };
}

function defaultState() {
  const task = (name, everyKm, everyMonths) => ({ id: uid(), name, everyKm, everyMonths, lastKm: null, lastDate: null, history: [] });
  return {
    vehicle: defaultVehicle(),
    tasks: [
      task('Aceite y filtro de aceite', 10000, 12),
      task('Filtro de aire', 20000, 24),
      task('Filtro de habitáculo', 15000, 12),
      task('Rotación de neumáticos', 10000, 0),
      task('Líquido de frenos', 0, 24),
      task('Correa de distribución', 60000, 60),
    ],
    expenses: [],
    docs: DEFAULT_DOCS.map((d) => newDoc(d.name, d.notifyDays)),
    fines: [],
  };
}

function newDoc(name, notifyDays = SOON_DAYS) {
  return { id: uid(), name, number: '', expiry: '', notifyDays, note: '', files: [] };
}

function normalizeTask(t) {
  t.history = Array.isArray(t.history) ? t.history : [];
  // Las tareas de versiones anteriores sólo tenían el último service: pasa a ser la primera entrada del historial.
  if (!t.history.length && (t.lastDate || t.lastKm != null)) {
    t.history.push({ id: uid(), date: t.lastDate || null, km: t.lastKm ?? null, shop: '', cost: null, note: 'Registro anterior', expenseId: null });
  }
  return t;
}

function normalizeDoc(d) {
  d.files = Array.isArray(d.files) ? d.files : [];
  d.number = d.number || '';
  d.note = d.note || '';
  return d;
}

function normalizeFine(f) {
  f.files = Array.isArray(f.files) ? f.files : [];
  f.status = FINE_STATUS[f.status] ? f.status : 'pendiente';
  return f;
}

const NORMALIZERS = { tasks: normalizeTask, docs: normalizeDoc, fines: normalizeFine, expenses: (e) => e };

function normalize(s) {
  const d = defaultState();
  const out = {
    vehicle: { ...defaultVehicle(), docsDefaultsV2: false, ...(s.vehicle || {}) },
    tasks: Array.isArray(s.tasks) ? s.tasks : d.tasks,
    expenses: Array.isArray(s.expenses) ? s.expenses : [],
    docs: Array.isArray(s.docs) ? s.docs : d.docs,
    fines: Array.isArray(s.fines) ? s.fines : [],
  };
  for (const c of COLLECTIONS) out[c] = out[c].map(NORMALIZERS[c]);
  return out;
}

// Agrega los papeles básicos que falten (una sola vez: si después los borrás, no vuelven).
function ensureDefaultDocs() {
  if (state.vehicle.docsDefaultsV2) return false;
  for (const def of DEFAULT_DOCS) {
    if (!state.docs.some((d) => def.match.test(d.name))) state.docs.push(newDoc(def.name, def.notifyDays));
  }
  state.vehicle.docsDefaultsV2 = true;
  return true;
}

/* Preferencias de este dispositivo: el modelo 3D cargado a mano, la moneda elegida, etc. */
function loadDevice() {
  try {
    return JSON.parse(localStorage.getItem(DEVICE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

const device = loadDevice();

function saveDevice() {
  try {
    localStorage.setItem(DEVICE_KEY, JSON.stringify(device));
  } catch (e) {
    // sin almacenamiento: las preferencias duran hasta cerrar
  }
}

let storageOk = true;

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    storageOk = false;
    return null;
  }
}

function loadLocal() {
  const raw = readLocal();
  const s = raw ? normalize(raw) : defaultState();
  // Versiones anteriores guardaban el modelo 3D propio dentro del auto: ahora es del dispositivo.
  for (const k of ['modelName', 'front', 'defaultFront']) {
    if (s.vehicle[k] !== undefined) {
      if (device[k] === undefined) device[k] = s.vehicle[k];
      delete s.vehicle[k];
    }
  }
  saveDevice();
  return s;
}

let state = defaultState();
let mode = 'local'; // 'local' (sólo este dispositivo) o 'cloud' (Firestore compartido)

/* ---------- Guardado ---------- */

const synced = { vehicle: null, tasks: new Map(), expenses: new Map(), docs: new Map(), fines: new Map() };

// Mientras se migran o crean los datos iniciales, lo que llega de la nube no pisa el estado local:
// esas novedades son anteriores a las escrituras de la migración, que llegan después con su propio aviso.
let holdRemote = false;

function save() {
  if (mode === 'cloud') {
    syncToCloud();
  } else {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      storageOk = true;
    } catch (e) {
      storageOk = false;
    }
  }
  onSaved();
}

// Se reemplaza desde app.js para refrescar avisos después de cada cambio.
let onSaved = () => {};

// Sube sólo lo que cambió respecto de lo último que vino de la nube.
function syncToCloud() {
  const vehicle = JSON.stringify(state.vehicle);
  if (vehicle !== synced.vehicle) {
    MiAutoCloud.put('meta', 'vehicle', JSON.parse(vehicle));
    synced.vehicle = vehicle;
  }
  for (const c of COLLECTIONS) {
    const seen = new Set();
    for (const item of state[c]) {
      seen.add(item.id);
      const json = JSON.stringify(item);
      if (synced[c].get(item.id) !== json) {
        MiAutoCloud.put(c, item.id, JSON.parse(json));
        synced[c].set(item.id, json);
      }
    }
    for (const id of [...synced[c].keys()]) {
      if (!seen.has(id)) {
        MiAutoCloud.del(c, id);
        synced[c].delete(id);
      }
    }
  }
}

/*
 * Escucha la nube. onChange se llama con cada novedad. onServerReady se llama una vez, cuando
 * llegaron los datos reales del servidor (no sólo la caché): recién ahí es seguro migrar o crear
 * los datos iniciales sin duplicar nada.
 */
function startCloudSync({ onChange, onServerReady, onError }) {
  const names = ['vehicle', ...COLLECTIONS];
  const seen = new Set();
  const fromServer = new Set();
  let remoteVehicle = false;
  let serverReadyFired = false;

  const mark = (name, meta) => {
    seen.add(name);
    if (!meta.fromCache) fromServer.add(name);
    if (!serverReadyFired && names.every((n) => fromServer.has(n))) {
      serverReadyFired = true;
      onServerReady({ remoteVehicle });
    }
    onChange({ cacheReady: names.every((n) => seen.has(n)) });
  };

  const unsubs = [
    MiAutoCloud.subscribeDoc('meta', 'vehicle', (data, meta) => {
      remoteVehicle = remoteVehicle || !!data;
      if (data && !holdRemote) {
        state.vehicle = { ...defaultVehicle(), docsDefaultsV2: false, ...data };
        synced.vehicle = JSON.stringify(state.vehicle);
      }
      mark('vehicle', meta);
    }, onError),
    ...COLLECTIONS.map((c) => MiAutoCloud.subscribe(c, (items, meta) => {
      if (!holdRemote) {
        state[c] = items.map(NORMALIZERS[c]);
        // Lo que normalize() haya agregado se sube en el próximo save(), una sola vez.
        synced[c] = new Map(items.map((i) => [i.id, JSON.stringify(i)]));
      }
      mark(c, meta);
    }, onError)),
  ];
  return () => unsubs.forEach((u) => u());
}

// Mezcla los datos que había en el dispositivo con los de la nube sin perder ni duplicar nada.
async function migrateLocalToCloud({ remoteVehicle }) {
  if (localStorage.getItem(MIGRATED_KEY)) return false;
  const raw = readLocal();
  const remoteEmpty = !remoteVehicle && COLLECTIONS.every((c) => !state[c].length);
  if (!raw) {
    if (remoteEmpty) Object.assign(state, defaultState());
    localStorage.setItem(MIGRATED_KEY, new Date().toISOString());
    return remoteEmpty;
  }
  const local = normalize(raw);
  for (const k of ['modelName', 'front', 'defaultFront']) delete local.vehicle[k];

  if (remoteEmpty) {
    state.vehicle = local.vehicle;
  } else {
    const v = state.vehicle;
    v.km = Math.max(v.km || 0, local.vehicle.km || 0);
    if (!v.plate && local.vehicle.plate) v.plate = local.vehicle.plate;
    if ((!v.name || v.name === 'Mi auto') && local.vehicle.name) v.name = local.vehicle.name;
    if (!v.notes && local.vehicle.notes) v.notes = local.vehicle.notes;
  }

  for (const c of COLLECTIONS) {
    for (const item of local[c]) {
      if (state[c].some((x) => x.id === item.id)) continue;
      // Tareas y papeles por defecto tienen ids distintos en cada dispositivo: se unen por nombre.
      const twin = (c === 'tasks' || c === 'docs') && state[c].find((x) => x.name.trim().toLowerCase() === item.name.trim().toLowerCase());
      if (twin) {
        mergeTwin(c, twin, item);
        continue;
      }
      state[c].push(item);
    }
  }
  await uploadPendingAttachments();
  localStorage.setItem(MIGRATED_KEY, new Date().toISOString());
  return true;
}

function mergeTwin(c, remote, local) {
  if (c === 'tasks') {
    const ids = new Set(remote.history.map((h) => h.id));
    for (const h of local.history) {
      if (!ids.has(h.id) && !remote.history.some((r) => r.date === h.date && r.km === h.km)) remote.history.push(h);
    }
    recomputeLast(remote);
  } else {
    for (const k of ['number', 'expiry', 'note']) if (!remote[k] && local[k]) remote[k] = local[k];
    remote.files = [...remote.files, ...local.files.filter((f) => !remote.files.some((r) => r.id === f.id))];
  }
}

// El último service es la entrada más reciente del historial (por fecha y, si empata, por km).
function recomputeLast(t) {
  const sorted = [...t.history].sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.km ?? 0) - (b.km ?? 0));
  const last = sorted[sorted.length - 1];
  t.lastDate = last ? last.date : null;
  t.lastKm = last ? last.km : null;
}

/* ---------- Adjuntos (fotos y PDF) ---------- */

// IndexedDB guarda el modelo 3D propio, los adjuntos (como caché o en modo local) y el estado de los avisos.
function idb(mode_, fn) {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open('mi-auto', 1);
    open.onupgradeneeded = () => open.result.createObjectStore('files');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const tx = open.result.transaction('files', mode_);
      const req = fn(tx.objectStore('files'));
      tx.oncomplete = () => resolve(req && req.result);
      tx.onerror = () => reject(tx.error);
    };
  });
}

const idbGet = (key) => idb('readonly', (s) => s.get(key)).catch(() => null);
const idbPut = (key, val) => idb('readwrite', (s) => s.put(val, key)).catch(() => null);
const idbDel = (key) => idb('readwrite', (s) => s.delete(key)).catch(() => null);

function loadImage(file) {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => loadImageElement(file));
  }
  return loadImageElement(file);
}

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    img.src = URL.createObjectURL(file);
  });
}

async function compressImage(file) {
  const img = await loadImage(file);
  let maxPx = IMAGE_MAX_PX;
  let quality = IMAGE_QUALITY;
  for (let attempt = 0; attempt < 4; attempt++) {
    const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', quality));
    if (blob && blob.size <= IMAGE_MAX_BYTES) return blob;
    maxPx = Math.round(maxPx * 0.8);
    quality = Math.max(0.5, quality - 0.08);
  }
  throw new Error('La foto no se pudo achicar lo suficiente.');
}

// Devuelve { meta, blob } listo para guardar, o tira un error con un mensaje para mostrar.
async function prepareAttachment(file) {
  const meta = { id: uid(), name: file.name || 'archivo', type: file.type, size: 0, added: today() };
  let blob;
  if (file.type.startsWith('image/')) {
    blob = await compressImage(file);
    meta.type = 'image/jpeg';
    meta.name = meta.name.replace(/\.\w+$/, '') + '.jpg';
  } else if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    if (file.size > PDF_MAX_BYTES) {
      throw new Error(`«${file.name}» pesa ${(file.size / 1048576).toFixed(1)} MB y el máximo para un PDF es ${PDF_MAX_BYTES / 1048576} MB. Sacale una foto al papel o achicá el PDF (por ejemplo en ilovepdf.com) y probá de nuevo.`);
    }
    blob = file;
    meta.type = 'application/pdf';
  } else {
    throw new Error(`«${file.name}» no es una foto ni un PDF.`);
  }
  meta.size = blob.size;
  return { meta, blob };
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

function base64ToBlob(b64, type) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type });
}

async function storeAttachment(meta, blob) {
  await idbPut(`att:${meta.id}`, blob);
  if (mode === 'cloud') meta.chunks = MiAutoCloud.putFile(meta.id, await blobToBase64(blob));
}

async function loadAttachment(meta) {
  const cached = await idbGet(`att:${meta.id}`);
  if (cached) return cached;
  if (mode !== 'cloud' || !meta.chunks) throw new Error('El archivo no está en este dispositivo.');
  const blob = base64ToBlob(await MiAutoCloud.getFile(meta.id, meta.chunks), meta.type);
  idbPut(`att:${meta.id}`, blob);
  return blob;
}

function removeAttachment(meta) {
  idbDel(`att:${meta.id}`);
  if (mode === 'cloud' && meta.chunks) MiAutoCloud.delFile(meta.id, meta.chunks);
}

function removeItemAttachments(item) {
  (item.files || []).forEach(removeAttachment);
}

// Adjuntos cargados sin nube (o antes de entrar) que todavía no se subieron.
async function uploadPendingAttachments() {
  if (mode !== 'cloud') return;
  for (const c of ['docs', 'fines']) {
    for (const item of state[c]) {
      for (const f of item.files || []) {
        if (f.chunks) continue;
        const blob = await idbGet(`att:${f.id}`);
        if (blob) f.chunks = MiAutoCloud.putFile(f.id, await blobToBase64(blob));
      }
    }
  }
}

/* ---------- Dólar blue ---------- */

function lastRate() {
  try {
    return JSON.parse(localStorage.getItem(RATE_KEY));
  } catch (e) {
    return null;
  }
}

async function fetchBlueRate() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch('https://dolarapi.com/v1/dolares/blue', { signal: ctrl.signal, cache: 'no-store' });
    const data = await res.json();
    const value = Number(data.venta);
    if (!value) throw new Error('Respuesta sin cotización');
    localStorage.setItem(RATE_KEY, JSON.stringify({ value, date: today() }));
    return value;
  } finally {
    clearTimeout(timer);
  }
}

// Cotización para un gasto. Es aproximada si no es del mismo día del gasto o si no hubo internet.
async function rateFor(dateISO) {
  try {
    const value = await fetchBlueRate();
    return { usdRate: value, rateApprox: dateISO !== today() };
  } catch (e) {
    const last = lastRate();
    return last ? { usdRate: last.value, rateApprox: true } : { usdRate: null, rateApprox: false };
  }
}

function inUsd(e) {
  return e.usdRate ? (Number(e.amount) || 0) / e.usdRate : null;
}

/* ---------- Estado de cada cosa ---------- */

function taskNextDate(t) {
  return t.everyMonths > 0 && t.lastDate ? addMonths(t.lastDate, t.everyMonths) : null;
}

function taskStatus(t) {
  const km = state.vehicle.km;
  if (t.lastKm == null && !t.lastDate) {
    return { level: 'none', label: 'Sin registro', detail: 'Cargá cuándo lo hiciste por última vez', progress: 0, due: null };
  }
  const parts = [];
  let level = 'ok';
  let progress = 0;

  if (t.everyKm > 0 && t.lastKm != null) {
    const nextKm = t.lastKm + t.everyKm;
    const kmLeft = nextKm - km;
    progress = Math.max(progress, (km - t.lastKm) / t.everyKm);
    parts.push(
      kmLeft < 0 ? `pasado por ${fmtKm(-kmLeft)}`
        : kmLeft === 0 ? `toca ahora (a los ${fmtKm(nextKm)})`
          : `faltan ${fmtKm(kmLeft)} (a los ${fmtKm(nextKm)})`,
    );
    if (kmLeft <= 0) level = 'bad';
    else if (kmLeft <= Math.min(t.everyKm * SOON_KM_RATIO, SOON_KM_MAX)) level = 'warn';
  }
  const nextDate = taskNextDate(t);
  if (nextDate) {
    const daysLeft = daysUntil(nextDate);
    const total = daysUntil(nextDate) - daysUntil(t.lastDate);
    progress = Math.max(progress, total > 0 ? 1 - daysLeft / total : 1);
    parts.push(`${daysLeft < 0 ? 'venció' : 'vence'} ${daysText(daysLeft)} (${fmtDate(nextDate)})`);
    if (daysLeft < 0) level = 'bad';
    else if (daysLeft <= SOON_DAYS && level !== 'bad') level = 'warn';
  }
  if (!parts.length) {
    return { level: 'none', label: 'Incompleto', detail: 'Falta el km o la fecha del último service', progress: 0, due: null };
  }
  const label = { ok: 'Al día', warn: 'Pronto', bad: 'Vencido' }[level];
  return { level, label, detail: parts.join(' · '), progress: Math.min(Math.max(progress, 0), 1), due: nextDate };
}

function docStatus(d) {
  if (!d.expiry) return { level: 'none', label: 'Sin vencimiento', detail: 'No tiene fecha de vencimiento cargada', days: null, due: null };
  const days = daysUntil(d.expiry);
  const level = days < 0 ? 'bad' : days <= (d.notifyDays ?? SOON_DAYS) ? 'warn' : 'ok';
  const label = { ok: 'Vigente', warn: 'Por vencer', bad: 'Vencido' }[level];
  return { level, label, detail: `${days < 0 ? 'Venció' : 'Vence'} ${daysText(days)} · ${fmtDate(d.expiry)}`, days, due: d.expiry };
}

function fineStatus(f) {
  if (f.status !== 'pendiente' || !f.dueDate) {
    const level = f.status === 'pagada' ? 'ok' : 'none';
    return { level, label: FINE_STATUS[f.status], detail: f.dueDate ? `Vencimiento del pago: ${fmtDate(f.dueDate)}` : 'Sin fecha de pago', days: null, due: null };
  }
  const days = daysUntil(f.dueDate);
  const level = days < 0 ? 'bad' : days <= FINE_SOON_DAYS ? 'warn' : 'ok';
  const label = { ok: 'Pendiente', warn: 'Por vencer', bad: 'Vencida' }[level];
  return { level, label, detail: `Pago ${days < 0 ? 'vencido' : 'vence'} ${daysText(days)} · ${fmtDate(f.dueDate)}`, days, due: f.dueDate };
}

function fineTitle(f) {
  return `Multa: ${f.reason || f.place || 'sin detalle'}`;
}

function alerts() {
  return [
    ...state.tasks.map((t) => ({ kind: 'task', item: t, title: t.name, st: taskStatus(t) })),
    ...state.docs.map((d) => ({ kind: 'doc', item: d, title: d.name, st: docStatus(d) })),
    ...state.fines.map((f) => ({ kind: 'fine', item: f, title: fineTitle(f), st: fineStatus(f) })),
  ]
    .filter((a) => a.st.level === 'bad' || a.st.level === 'warn')
    .sort((a, b) => levelOrder(a.st.level) - levelOrder(b.st.level));
}

function sumExpenses(filter) {
  return state.expenses.filter(filter).reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
}

// Consumo con el método de tanque lleno: km recorridos entre dos cargas / litros de la segunda.
function fuelStats() {
  const fills = state.expenses
    .filter((e) => e.cat === 'combustible' && e.km != null && e.liters > 0)
    .sort((a, b) => a.km - b.km);
  let km = 0;
  let liters = 0;
  let last = null;
  for (let i = 1; i < fills.length; i++) {
    const dist = fills[i].km - fills[i - 1].km;
    if (dist <= 0) continue;
    km += dist;
    liters += fills[i].liters;
    last = dist / fills[i].liters;
  }
  if (!liters) return null;
  return { avg: km / liters, last };
}

/* ---------- Calendario ---------- */

// Todo lo que tiene fecha de vencimiento, para el calendario y para los avisos en segundo plano.
function deadlines() {
  const out = [];
  for (const t of state.tasks) {
    const date = taskNextDate(t);
    if (date) out.push({ key: `task:${t.id}`, title: `Service: ${t.name}`, date, notifyDays: SOON_DAYS, details: `Último service: ${fmtDate(t.lastDate)}${t.lastKm != null ? ` a los ${fmtKm(t.lastKm)}` : ''}. ${intervalTextOf(t)}.` });
  }
  for (const d of state.docs) {
    if (d.expiry) out.push({ key: `doc:${d.id}`, title: `Vence: ${d.name}`, date: d.expiry, notifyDays: d.notifyDays ?? SOON_DAYS, details: [d.number && `Número: ${d.number}`, d.note].filter(Boolean).join('. ') });
  }
  for (const f of state.fines) {
    if (f.status === 'pendiente' && f.dueDate) out.push({ key: `fine:${f.id}`, title: `Pagar ${fineTitle(f).toLowerCase()}`, date: f.dueDate, notifyDays: FINE_SOON_DAYS, details: [f.place && `Lugar: ${f.place}`, f.amount && `Monto: ${money.format(f.amount)}`].filter(Boolean).join('. ') });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

function intervalTextOf(t) {
  const parts = [];
  if (t.everyKm > 0) parts.push(`cada ${fmtKm(t.everyKm)}`);
  if (t.everyMonths > 0) parts.push(`cada ${t.everyMonths} ${t.everyMonths === 1 ? 'mes' : 'meses'}`);
  return parts.length ? `Se hace ${parts.join(' o ')}` : 'Sin intervalo';
}

function gcalLink(dl) {
  const start = dl.date.replace(/-/g, '');
  const end = addDays(dl.date, 1).replace(/-/g, '');
  const details = `${dl.details ? `${dl.details}\n\n` : ''}Recordatorio: avisame ${dl.notifyDays} días antes.\nCargado desde Mi Auto.`;
  const params = new URLSearchParams({ action: 'TEMPLATE', text: dl.title, details });
  return `https://calendar.google.com/calendar/render?${params}&dates=${start}/${end}`;
}

function icsEscape(s) {
  return String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => `\\${c}`);
}

function buildIcs(list) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mi Auto//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Mi Auto - vencimientos'];
  for (const dl of list) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${dl.key.replace(':', '-')}@mi-auto`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${dl.date.replace(/-/g, '')}`,
      `DTEND;VALUE=DATE:${addDays(dl.date, 1).replace(/-/g, '')}`,
      `SUMMARY:${icsEscape(dl.title)}`,
      `DESCRIPTION:${icsEscape(dl.details)}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${icsEscape(dl.title)}`,
      `TRIGGER:-P${Math.max(0, dl.notifyDays)}D`,
      'END:VALARM',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/* ---------- Notificaciones ---------- */

function notificationsSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

async function notify(title, options) {
  const reg = await navigator.serviceWorker.ready;
  return reg.showNotification(title, { icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', ...options });
}

/*
 * Avisa una sola vez cada cambio de estado (por vencer → vencido). La firma incluye la fecha,
 * así que si se renueva un papel y vuelve a acercarse el vencimiento, se avisa de nuevo.
 * El service worker usa la misma clave y firma para los avisos en segundo plano.
 */
async function checkNotifications() {
  idbPut('schedule', deadlines());
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  const notified = (await idbGet('notified')) || {};
  const current = alerts();
  const keys = new Set();
  for (const a of current) {
    const key = `${a.kind}:${a.item.id}`;
    const sig = `${a.st.level}:${a.st.due || ''}`;
    keys.add(key);
    if (notified[key] === sig) continue;
    notified[key] = sig;
    const verb = a.st.level === 'bad' ? 'Vencido' : 'Por vencer';
    try {
      await notify(`${verb}: ${a.title}`, { body: a.st.detail, tag: key, data: { url: './' } });
    } catch (e) {
      // sin permiso o sin service worker: queda el aviso dentro de la app
    }
  }
  for (const k of Object.keys(notified)) if (!keys.has(k)) delete notified[k];
  await idbPut('notified', notified);
}

async function enablePeriodicSync() {
  try {
    const reg = await navigator.serviceWorker.ready;
    if (!('periodicSync' in reg)) return false;
    const perm = await navigator.permissions.query({ name: 'periodic-background-sync' });
    if (perm.state !== 'granted') return false;
    await reg.periodicSync.register('vencimientos', { minInterval: 12 * 60 * 60 * 1000 });
    return true;
  } catch (e) {
    return false;
  }
}
