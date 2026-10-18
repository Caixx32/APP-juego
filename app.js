'use strict';

/* ---------- Datos ---------- */

const STORAGE_KEY = 'mi-auto-v1';

const CATEGORIES = {
  combustible: { label: 'Combustible', icon: 'fuel' },
  mantenimiento: { label: 'Mantenimiento', icon: 'wrench' },
  reparacion: { label: 'Reparación', icon: 'tool' },
  seguro: { label: 'Seguro', icon: 'shield' },
  patente: { label: 'Patente / impuestos', icon: 'receipt' },
  peaje: { label: 'Peaje / estacionamiento', icon: 'road' },
  lavado: { label: 'Lavado', icon: 'drop' },
  otro: { label: 'Otro', icon: 'box' },
};

const CAR_COLORS = {
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
const DEFAULT_COLOR = '#3ea6ff';

// Avisar cuando falte este margen para un vencimiento.
const SOON_KM_RATIO = 0.1;
const SOON_KM_MAX = 1000;
const SOON_DAYS = 30;

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function defaultState() {
  const task = (name, everyKm, everyMonths) => ({ id: uid(), name, everyKm, everyMonths, lastKm: null, lastDate: null });
  const doc = (name, notifyDays) => ({ id: uid(), name, expiry: '', notifyDays });
  return {
    vehicle: { name: 'Mi auto', plate: '', km: 0, front: '+z', color: DEFAULT_COLOR },
    tasks: [
      task('Aceite y filtro de aceite', 10000, 12),
      task('Filtro de aire', 20000, 24),
      task('Filtro de habitáculo', 15000, 12),
      task('Rotación de neumáticos', 10000, 0),
      task('Líquido de frenos', 0, 24),
      task('Correa de distribución', 60000, 60),
    ],
    expenses: [],
    docs: [
      doc('VTV / ITV', 30),
      doc('Seguro', 15),
      doc('Licencia de conducir', 30),
    ],
  };
}

let storageOk = true;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch (e) {
    storageOk = false;
  }
  return defaultState();
}

function normalize(s) {
  const d = defaultState();
  return {
    vehicle: { ...d.vehicle, ...(s.vehicle || {}) },
    tasks: Array.isArray(s.tasks) ? s.tasks : d.tasks,
    expenses: Array.isArray(s.expenses) ? s.expenses : [],
    docs: Array.isArray(s.docs) ? s.docs : d.docs,
  };
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageOk = true;
  } catch (e) {
    storageOk = false;
  }
  document.getElementById('storage-warning').hidden = storageOk;
}

let state = load();

/* ---------- Íconos ---------- */

const ICONS = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2"/>',
  doc: '<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9.5 13h6M9.5 17h6"/>',
  car: '<path d="M4 16.5l1.6-5.1A2 2 0 0 1 7.5 10h9a2 2 0 0 1 1.9 1.4l1.6 5.1V19h-2.5v-1.5h-11V19H4z"/><path d="M4 16.5h16"/><circle cx="7.5" cy="14.3" r=".6"/><circle cx="16.5" cy="14.3" r=".6"/><path d="M7 7.5l1-1.5h8l1 1.5"/>',
  fuel: '<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M14 10h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8l-3-3M7 7h4"/>',
  gauge: '<path d="M12 14l4-4M3.5 18a9 9 0 1 1 17 0"/>',
  tool: '<path d="M14 7l3-3 3 3-3 3zM15.5 8.5L5 19l-1.5 1.5M8 12l4 4"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>',
  road: '<path d="M8 3L4 21M16 3l4 18M12 4v3M12 10v3M12 16v3"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  alert: '<path d="M12 3.5l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  left: '<path d="M15 6l-6 6 6 6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-1.3-1.1-1.6-1.1-2.8 0-1 .8-1.6 1.8-1.6H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
};

function icon(name, cls = '') {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

function hydrateIcons(root = document) {
  root.querySelectorAll('svg[data-icon]').forEach((svg) => {
    svg.outerHTML = icon(svg.dataset.icon);
  });
}

/* ---------- Color del auto ---------- */

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance([r, g, b]) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

// Un auto negro o bordó daría un acento ilegible sobre fondo oscuro: se aclara hasta que se lea.
function uiAccent(hex) {
  let rgb = hexToRgb(hex);
  for (let i = 0; i < 12 && luminance(rgb) < 0.14; i++) {
    rgb = rgb.map((c) => Math.round(c + (255 - c) * 0.18));
  }
  return rgb;
}

function applyColor() {
  const rgb = uiAccent(state.vehicle.color || DEFAULT_COLOR);
  const root = document.documentElement.style;
  root.setProperty('--accent', `rgb(${rgb.join(',')})`);
  root.setProperty('--accent-rgb', rgb.join(', '));
  root.setProperty('--on-accent', luminance(rgb) > 0.45 ? '#0b0d10' : '#ffffff');
  paintDefaultCar();
}

/* ---------- Utilidades ---------- */

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 });

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
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function bumpKm(km) {
  if (km != null && km > state.vehicle.km) state.vehicle.km = km;
}

function levelOrder(level) {
  return { bad: 0, warn: 1, none: 2, ok: 3 }[level];
}

/* ---------- Cálculos ---------- */

function taskStatus(t) {
  const km = state.vehicle.km;
  if (t.lastKm == null && !t.lastDate) {
    return { level: 'none', label: 'Sin registro', detail: 'Cargá cuándo lo hiciste por última vez', progress: 0 };
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
  if (t.everyMonths > 0 && t.lastDate) {
    const nextDate = addMonths(t.lastDate, t.everyMonths);
    const daysLeft = daysUntil(nextDate);
    const total = daysUntil(nextDate) - daysUntil(t.lastDate);
    progress = Math.max(progress, total > 0 ? 1 - daysLeft / total : 1);
    parts.push(`${daysLeft < 0 ? 'venció' : 'vence'} ${daysText(daysLeft)} (${fmtDate(nextDate)})`);
    if (daysLeft < 0) level = 'bad';
    else if (daysLeft <= SOON_DAYS && level !== 'bad') level = 'warn';
  }
  if (!parts.length) {
    return { level: 'none', label: 'Incompleto', detail: 'Falta el km o la fecha del último service', progress: 0 };
  }
  const label = { ok: 'Al día', warn: 'Pronto', bad: 'Vencido' }[level];
  return { level, label, detail: parts.join(' · '), progress: Math.min(Math.max(progress, 0), 1) };
}

function docStatus(d) {
  if (!d.expiry) return { level: 'none', label: 'Sin fecha', detail: 'Cargá la fecha de vencimiento', days: null };
  const days = daysUntil(d.expiry);
  const level = days < 0 ? 'bad' : days <= (d.notifyDays ?? SOON_DAYS) ? 'warn' : 'ok';
  const label = { ok: 'Vigente', warn: 'Por vencer', bad: 'Vencido' }[level];
  return { level, label, detail: `${days < 0 ? 'Venció' : 'Vence'} ${daysText(days)} · ${fmtDate(d.expiry)}`, days };
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

function alerts() {
  return [
    ...state.tasks.map((t) => ({ kind: 'task', item: t, st: taskStatus(t) })),
    ...state.docs.map((d) => ({ kind: 'doc', item: d, st: docStatus(d) })),
  ]
    .filter((a) => a.st.level === 'bad' || a.st.level === 'warn')
    .sort((a, b) => levelOrder(a.st.level) - levelOrder(b.st.level));
}

/* ---------- Vistas ---------- */

const view = document.getElementById('view');
let currentTab = 'home';
let expenseMonth = today().slice(0, 7);

function badge(st) {
  return `<span class="badge ${st.level}">${esc(st.label)}</span>`;
}

function pageHead(eyebrow, title, text) {
  return `<header class="page-head"><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1>${text ? `<p>${esc(text)}</p>` : ''}</header>`;
}

function renderHero() {
  const v = state.vehicle;
  document.getElementById('car-name').textContent = v.name || 'Mi auto';
  const plate = document.getElementById('plate');
  plate.hidden = !v.plate;
  plate.textContent = v.plate;
  document.getElementById('hero-km').textContent = fmtKm(v.km);

  const list = alerts();
  const pill = document.getElementById('status-pill');
  const worst = list.length ? list[0].st.level : 'ok';
  pill.className = `status-pill ${worst}`;
  pill.textContent = list.length ? `${list.length} ${list.length === 1 ? 'alerta' : 'alertas'}` : 'Todo al día';
}

function renderHome() {
  const list = alerts();
  const month = today().slice(0, 7);
  const fuel = fuelStats();
  const taskAlerts = list.filter((a) => a.kind === 'task');
  const taskLevel = taskAlerts.length ? taskAlerts[0].st.level : 'ok';
  const nextDoc = state.docs
    .map((d) => ({ d, st: docStatus(d) }))
    .filter((x) => x.st.days != null)
    .sort((a, b) => a.st.days - b.st.days)[0];

  const monthTotal = sumExpenses((e) => e.date.startsWith(month));
  const yearAgo = addMonths(today(), -12);

  view.innerHTML = `
    <div class="tiles">
      <button class="tile glass" data-go="expenses">
        ${icon('gauge')}
        <div class="label">Consumo</div>
        <div class="value">${fuel ? `${num.format(fuel.avg)} <small>km/l</small>` : '—'}</div>
      </button>
      <button class="tile glass ${taskLevel}" data-go="tasks">
        ${icon('wrench')}
        <div class="label">Service</div>
        <div class="value">${taskAlerts.length ? `${taskAlerts.length} <small>${taskAlerts.length === 1 ? 'aviso' : 'avisos'}</small>` : 'Al día'}</div>
      </button>
      <button class="tile glass ${nextDoc ? nextDoc.st.level : ''}" data-go="docs">
        ${icon('doc')}
        <div class="label">Papeles</div>
        <div class="value">${nextDoc ? (nextDoc.st.days < 0 ? 'Vencido' : `${nextDoc.st.days} <small>días</small>`) : '—'}</div>
      </button>
    </div>

    <div class="quick-grid">
      <button class="btn primary" data-action="add-expense" data-cat="combustible">${icon('fuel')}Cargar nafta</button>
      <button class="btn" data-action="update-km">${icon('gauge')}Actualizar km</button>
      <button class="btn" data-action="add-expense">${icon('plus')}Nuevo gasto</button>
    </div>

    <div class="section-title">Este mes</div>
    <div class="card glass tap" data-go="expenses">
      <div class="row">
        <div class="grow">
          <div class="big-number">${money.format(monthTotal)}</div>
          <div class="sub">Últimos 12 meses: ${money.format(sumExpenses((e) => e.date > yearAgo))}</div>
        </div>
        ${icon('chev', 'chev')}
      </div>
    </div>

    <div class="section-title" id="attention">Atención</div>
    ${list.length ? list.map((a) => `
      <div class="card glass tap" data-go="${a.kind === 'task' ? 'tasks' : 'docs'}">
        <div class="row">
          <div class="icon-bubble ${a.st.level}">${icon(a.kind === 'task' ? 'wrench' : 'doc')}</div>
          <div class="grow">
            <div class="name">${esc(a.item.name)}</div>
            <div class="sub">${esc(a.st.detail)}</div>
          </div>
          ${badge(a.st)}
        </div>
      </div>`).join('') : `
      <div class="card glass">
        <div class="row">
          <div class="icon-bubble ok">${icon('check')}</div>
          <div class="grow"><div class="name">Todo en orden</div><div class="sub">No hay nada vencido ni por vencer.</div></div>
        </div>
      </div>`}
  `;
}

function renderTasks() {
  const items = state.tasks
    .map((t) => ({ t, st: taskStatus(t) }))
    .sort((a, b) => levelOrder(a.st.level) - levelOrder(b.st.level));

  view.innerHTML = `
    ${pageHead('Mantenimiento', 'Service', 'Cada tarea avisa por kilómetros, por tiempo o por lo que llegue primero.')}
    <div class="quick" style="margin-top:4px;margin-bottom:14px">
      <button class="btn primary" data-action="add-task">${icon('plus')}Nueva tarea</button>
    </div>
    <div class="cards">
    ${items.map(({ t, st }) => `
      <div class="card glass">
        <div class="row">
          <div class="icon-bubble ${st.level}">${icon('wrench')}</div>
          <div class="grow">
            <div class="name">${esc(t.name)}</div>
            <div class="sub">${esc(intervalText(t))}</div>
          </div>
          ${badge(st)}
        </div>
        <div class="progress ${st.level}"><i style="width:${Math.round(st.progress * 100)}%"></i></div>
        <div class="sub" style="margin-top:10px">${esc(st.detail)}</div>
        <div class="sub">Último: ${t.lastKm != null ? fmtKm(t.lastKm) : '—'} · ${fmtDate(t.lastDate)}</div>
        <div class="actions">
          <button class="btn small primary" data-action="done-task" data-id="${t.id}">${icon('check')}Lo hice</button>
          <button class="btn small" data-action="edit-task" data-id="${t.id}">${icon('edit')}Editar</button>
        </div>
      </div>`).join('') || '<div class="card glass empty">No hay tareas. Agregá una con «Nueva tarea».</div>'}
    </div>
  `;
}

function intervalText(t) {
  const parts = [];
  if (t.everyKm > 0) parts.push(`cada ${fmtKm(t.everyKm)}`);
  if (t.everyMonths > 0) parts.push(`cada ${t.everyMonths} ${t.everyMonths === 1 ? 'mes' : 'meses'}`);
  return parts.length ? parts.join(' o ') : 'Sin intervalo';
}

function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  const s = new Date(y, m - 1, 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function renderExpenses() {
  const list = state.expenses
    .filter((e) => e.date.startsWith(expenseMonth))
    .sort((a, b) => (b.date + (b.km ?? '')).localeCompare(a.date + (a.km ?? '')));
  const total = list.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  const byCat = {};
  for (const e of list) byCat[e.cat] = (byCat[e.cat] || 0) + (Number(e.amount) || 0);
  const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const max = cats.length ? cats[0][1] : 0;
  const fuel = fuelStats();
  const isCurrent = expenseMonth >= today().slice(0, 7);

  view.innerHTML = `
    ${pageHead('Finanzas', 'Gastos')}
    <div class="month-nav">
      <button class="btn icon-only" data-month="-1" aria-label="Mes anterior">${icon('left')}</button>
      <div class="label">${esc(monthLabel(expenseMonth))}</div>
      <button class="btn icon-only" data-month="1" aria-label="Mes siguiente" ${isCurrent ? 'disabled style="opacity:.3"' : ''}>${icon('chev')}</button>
    </div>

    <div class="card glass">
      <div class="row">
        <div class="grow">
          <div class="sub">Total del mes</div>
          <div class="big-number">${money.format(total)}</div>
        </div>
        ${fuel ? `<div class="days"><b>${num.format(fuel.avg)}</b><span>km/l prom.</span></div>` : ''}
      </div>
      ${cats.map(([cat, amt]) => `
        <div class="cat-bar">
          ${icon((CATEGORIES[cat] || CATEGORIES.otro).icon)}
          <span class="label">${esc((CATEGORIES[cat] || CATEGORIES.otro).label)}</span>
          <span class="bar"><i style="width:${max ? (amt / max) * 100 : 0}%"></i></span>
          <span class="amt">${money.format(amt)}</span>
        </div>`).join('')}
    </div>

    <div class="section-title">Movimientos <button class="btn small primary" data-action="add-expense">${icon('plus')}Gasto</button></div>
    ${list.length ? `<div class="card glass" style="padding:4px 16px">${list.map((e) => {
      const cat = CATEGORIES[e.cat] || CATEGORIES.otro;
      return `
      <div class="list-item tap" data-action="edit-expense" data-id="${e.id}" role="button" tabindex="0">
        <div class="icon-bubble">${icon(cat.icon)}</div>
        <div class="grow">
          <div class="name">${esc(e.note || cat.label)}</div>
          <div class="sub">${fmtDate(e.date)}${e.km != null ? ` · ${fmtKm(e.km)}` : ''}${e.liters ? ` · ${num.format(e.liters)} l · $${num.format(e.amount / e.liters)}/l` : ''}</div>
        </div>
        <span class="amount">${money.format(e.amount)}</span>
      </div>`;
    }).join('')}</div>` : '<div class="card glass empty">No hay gastos en este mes.</div>'}
  `;
}

function renderDocs() {
  const items = state.docs
    .map((d) => ({ d, st: docStatus(d) }))
    .sort((a, b) => levelOrder(a.st.level) - levelOrder(b.st.level) || (a.d.expiry || '9').localeCompare(b.d.expiry || '9'));

  view.innerHTML = `
    ${pageHead('Vencimientos', 'Papeles', 'Seguro, VTV, licencia, patente… Te avisa antes de que venzan.')}
    <div class="quick" style="margin-top:4px;margin-bottom:14px">
      <button class="btn primary" data-action="add-doc">${icon('plus')}Nuevo vencimiento</button>
    </div>
    <div class="cards">
    ${items.map(({ d, st }) => `
      <div class="card glass tap" data-action="edit-doc" data-id="${d.id}" role="button" tabindex="0">
        <div class="row">
          <div class="icon-bubble ${st.level}">${icon('doc')}</div>
          <div class="grow">
            <div class="name">${esc(d.name)}</div>
            <div class="sub">${esc(d.expiry ? fmtDate(d.expiry) : st.detail)}</div>
            ${d.note ? `<div class="sub">${esc(d.note)}</div>` : ''}
          </div>
          ${st.days == null ? badge(st) : `<div class="days ${st.level}"><b>${Math.abs(st.days)}</b><span>${st.days < 0 ? 'días vencido' : st.days === 1 ? 'día' : 'días'}</span></div>`}
        </div>
      </div>`).join('') || '<div class="card glass empty">No hay papeles cargados.</div>'}
    </div>
  `;
}

function renderCar() {
  const v = state.vehicle;
  const color = (v.color || DEFAULT_COLOR).toLowerCase();
  const isPreset = Object.values(CAR_COLORS).includes(color);

  view.innerHTML = `
    ${pageHead('Configuración', v.name || 'Mi auto')}

    <div class="section-title">Datos</div>
    <div class="settings glass">
      <div class="set-row" data-action="edit-car"><span class="grow">Nombre o modelo</span><span class="val">${esc(v.name || '—')}</span>${icon('chev', 'chev')}</div>
      <div class="set-row" data-action="edit-car"><span class="grow">Patente</span><span class="val">${esc(v.plate || '—')}</span>${icon('chev', 'chev')}</div>
      <div class="set-row" data-action="update-km"><span class="grow">Kilometraje</span><span class="val">${fmtKm(v.km)}</span>${icon('chev', 'chev')}</div>
      ${v.notes ? `<div class="set-row" data-action="edit-car"><span class="grow sub" style="white-space:pre-wrap">${esc(v.notes)}</span>${icon('chev', 'chev')}</div>` : ''}
    </div>

    <div class="section-title">Color</div>
    <div class="card glass">
      <div class="row">
        <div class="icon-bubble">${icon('palette')}</div>
        <div class="grow"><div class="name">Color de tu auto</div><div class="sub">Pinta la app${v.modelName ? '' : ' y el auto genérico'}.</div></div>
      </div>
      <div class="swatches">
        ${Object.entries(CAR_COLORS).map(([name, hex]) => `
          <button class="swatch ${hex === color ? 'selected' : ''}" style="background:${hex}" data-color="${hex}" title="${esc(name)}" aria-label="${esc(name)}"></button>`).join('')}
        <label class="swatch custom ${isPreset ? '' : 'selected'}" title="Otro color" aria-label="Otro color">
          <input type="color" id="custom-color" value="${color}">
        </label>
      </div>
    </div>

    <div class="section-title">Modelo 3D</div>
    <div class="card glass">
      <div class="row">
        <div class="icon-bubble">${icon('cube')}</div>
        <div class="grow">
          <div class="name">${v.modelName ? esc(v.modelName) : 'Auto genérico'}</div>
          <div class="sub">${v.modelName ? 'Tu modelo está guardado en este celular.' : 'Cargá un .glb de tu auto (por ejemplo, de Sketchfab).'}</div>
        </div>
      </div>
      <div class="actions">
        <button class="btn small primary" data-action="load-model">${icon('upload')}Cargar .glb</button>
        ${v.modelName ? `<button class="btn small danger" data-action="remove-model">${icon('trash')}Quitar</button>` : ''}
      </div>
      <label class="field" style="margin:16px 0 0">
        <span>Orientación de los puntos</span>
        <select id="front-select">
          ${Object.entries(FRONT_OPTIONS).map(([k, label]) => `<option value="${k}" ${k === (v.front || '+z') ? 'selected' : ''}>${esc(label)}</option>`).join('')}
        </select>
        <small>El punto «Motor» tiene que quedar sobre el capó.</small>
      </label>
    </div>

    <div class="section-title">Copia de seguridad</div>
    <div class="card glass">
      <div class="sub">Los datos se guardan sólo en este celular. Exportá una copia de vez en cuando. El modelo 3D no entra en la copia: guardá el .glb aparte.</div>
      <div class="actions">
        <button class="btn small" data-action="export">${icon('download')}Exportar</button>
        <button class="btn small" data-action="import">${icon('upload')}Importar</button>
      </div>
    </div>

    <div class="section-title">Zona peligrosa</div>
    <div class="card glass">
      <button class="btn small danger" data-action="reset">${icon('trash')}Borrar todos los datos</button>
    </div>
  `;

  document.getElementById('front-select').addEventListener('change', (ev) => {
    state.vehicle.front = ev.target.value;
    save();
    placeHotspots();
  });
  document.getElementById('custom-color').addEventListener('input', (ev) => setColor(ev.target.value, false));
  document.getElementById('custom-color').addEventListener('change', (ev) => setColor(ev.target.value));
}

function setColor(hex, rerender = true) {
  state.vehicle.color = hex.toLowerCase();
  save();
  applyColor();
  if (rerender) render();
}

const renderers = { home: renderHome, tasks: renderTasks, expenses: renderExpenses, docs: renderDocs, car: renderCar };

function render() {
  renderHero();
  document.body.dataset.view = currentTab;
  document.getElementById('stage').hidden = currentTab !== 'home';
  renderers[currentTab]();
  updateHotspots();
}

function goTo(tab) {
  currentTab = tab;
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  selectedSpot = null;
  window.scrollTo(0, 0);
  render();
}

/* ---------- Auto 3D ---------- */

const DEFAULT_MODEL = 'models/auto.glb';
const MAX_MODEL_MB = 40;

// Puntos sobre el auto. Cada tarea va al primero cuyo nombre coincide; las demás y los papeles, al habitáculo.
const SPOTS = [
  { key: 'motor', label: 'Motor', match: /aceite|motor|correa|distribuci|buj[ií]a|filtro de aire|refrigerante|bater[ií]a|embrague/i },
  { key: 'ruedas', label: 'Ruedas', match: /neum[aá]tico|rueda|cubierta|alineaci|balanceo|amortiguador|suspensi/i },
  { key: 'frenos', label: 'Frenos', match: /fren|pastilla|disco/i },
  { key: 'cabina', label: 'Habitáculo y papeles', match: null },
];

// Dónde va cada punto, en fracciones de la caja que ocupa el auto:
// adelante (-0.5 cola … 0.5 trompa), costado (-0.5 … 0.5) y altura (0 piso … 1 techo).
const SPOT_PLACES = {
  motor: [0.36, 0, 0.62],
  ruedas: [0.32, 0.5, 0.24],
  frenos: [-0.32, -0.5, 0.24],
  cabina: [-0.12, 0, 1.0],
};

const FRONT_OPTIONS = {
  '+z': 'Normal',
  '-z': 'Girado 180°',
  '+x': 'Girado 90° a la derecha',
  '-x': 'Girado 90° a la izquierda',
};

const mv = document.getElementById('car3d');
const spotInfo = document.getElementById('spot-info');
let selectedSpot = null;
let customModelUrl = null;
let staleModelUrl = null;

function spotItems(key) {
  const out = [];
  for (const t of state.tasks) {
    const spot = SPOTS.find((s) => s.match && s.match.test(t.name)) || SPOTS[SPOTS.length - 1];
    if (spot.key === key) out.push({ icon: 'wrench', name: t.name, st: taskStatus(t) });
  }
  if (key === 'cabina') {
    for (const d of state.docs) out.push({ icon: 'doc', name: d.name, st: docStatus(d) });
  }
  return out.sort((a, b) => levelOrder(a.st.level) - levelOrder(b.st.level));
}

function worstLevel(items) {
  return items.reduce((worst, i) => (levelOrder(i.st.level) < levelOrder(worst) ? i.st.level : worst), items.length ? 'ok' : 'none');
}

function createHotspots() {
  for (const s of SPOTS) {
    const b = document.createElement('button');
    b.className = 'hotspot unplaced';
    b.slot = `hotspot-${s.key}`;
    b.dataset.position = '0m 0m 0m';
    b.dataset.visibilityAttribute = 'visible';
    b.innerHTML = `<span class="dot"></span><span class="hs-label">${esc(s.label)}</span>`;
    b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      selectedSpot = selectedSpot === s.key ? null : s.key;
      updateHotspots();
    });
    mv.appendChild(b);
  }
}

function placeHotspots() {
  if (!mv.loaded || !mv.getDimensions) return;
  const dim = mv.getDimensions();
  const c = mv.getBoundingBoxCenter();
  const front = state.vehicle.front || '+z';
  const sign = front[0] === '-' ? -1 : 1;
  const alongZ = front[1] === 'z';
  const length = alongZ ? dim.z : dim.x;
  const width = alongZ ? dim.x : dim.z;
  for (const s of SPOTS) {
    const [fwd, side, up] = SPOT_PLACES[s.key];
    const f = sign * fwd * length;
    const l = sign * side * width;
    const x = c.x + (alongZ ? l : f);
    const z = c.z + (alongZ ? f : -l);
    const y = c.y - dim.y / 2 + up * dim.y;
    mv.updateHotspot({ name: `hotspot-${s.key}`, position: `${x}m ${y}m ${z}m` });
    mv.querySelector(`[slot="hotspot-${s.key}"]`).classList.remove('unplaced');
  }
}

// El auto genérico toma el color elegido; un modelo propio conserva sus colores originales.
function paintDefaultCar() {
  if (!mv.loaded || !mv.model || mv.getAttribute('src') !== DEFAULT_MODEL) return;
  const body = mv.model.materials.find((m) => m.name === 'Carroceria');
  if (body) body.pbrMetallicRoughness.setBaseColorFactor(state.vehicle.color || DEFAULT_COLOR);
}

function updateHotspots() {
  for (const s of SPOTS) {
    const el = mv.querySelector(`[slot="hotspot-${s.key}"]`);
    if (!el) continue;
    const level = worstLevel(spotItems(s.key));
    el.classList.remove('ok', 'warn', 'bad', 'none');
    el.classList.add(level);
    el.classList.toggle('selected', selectedSpot === s.key);
  }

  if (!selectedSpot) {
    spotInfo.hidden = true;
    mv.setAttribute('auto-rotate', '');
    return;
  }
  // Mientras se lee el detalle, el auto deja de girar.
  mv.removeAttribute('auto-rotate');
  const spot = SPOTS.find((s) => s.key === selectedSpot);
  const items = spotItems(selectedSpot);
  spotInfo.innerHTML = `
    <div class="head"><b>${esc(spot.label)}</b><button class="btn icon-only ghost" data-close-spot aria-label="Cerrar">${icon('close')}</button></div>
    ${items.map((i) => `
      <div class="list-item">
        <div class="icon-bubble ${i.st.level}">${icon(i.icon)}</div>
        <div class="grow"><div class="name">${esc(i.name)}</div><div class="sub">${esc(i.st.detail)}</div></div>
        ${badge(i.st)}
      </div>`).join('') || '<div class="sub" style="padding-bottom:8px">No hay nada cargado para esta parte.</div>'}
  `;
  spotInfo.hidden = false;
}

spotInfo.addEventListener('click', (ev) => {
  if (!ev.target.closest('[data-close-spot]')) return;
  selectedSpot = null;
  updateHotspots();
});

mv.addEventListener('load', () => {
  // La URL del modelo anterior se libera recién cuando el nuevo terminó de cargar.
  if (staleModelUrl) URL.revokeObjectURL(staleModelUrl);
  staleModelUrl = null;
  placeHotspots();
  paintDefaultCar();
});

mv.addEventListener('error', () => {
  if (mv.getAttribute('src') === DEFAULT_MODEL) return;
  alert('No se pudo abrir ese modelo 3D. Vuelvo a mostrar el auto genérico.');
  removeCustomModel();
});

// El modelo propio se guarda en IndexedDB porque suele pesar varios MB (localStorage admite muy poco).
function idb(mode, fn) {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open('mi-auto', 1);
    open.onupgradeneeded = () => open.result.createObjectStore('files');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const tx = open.result.transaction('files', mode);
      const req = fn(tx.objectStore('files'));
      tx.oncomplete = () => resolve(req && req.result);
      tx.onerror = () => reject(tx.error);
    };
  });
}

async function loadModel() {
  let blob = null;
  try {
    blob = await idb('readonly', (store) => store.get('model'));
  } catch (e) {
    blob = null;
  }
  if (customModelUrl) staleModelUrl = customModelUrl;
  customModelUrl = blob ? URL.createObjectURL(blob) : null;
  // setAttribute y no .src: el componente puede no estar definido todavía.
  mv.setAttribute('src', customModelUrl || DEFAULT_MODEL);
}

async function saveCustomModel(file) {
  if (!/\.glb$/i.test(file.name)) {
    alert('Tiene que ser un archivo .glb (el formato .gltf con varios archivos no sirve).');
    return;
  }
  if (file.size > MAX_MODEL_MB * 1024 * 1024) {
    alert(`El archivo pesa ${Math.round(file.size / 1048576)} MB. Buscá una versión de menos de ${MAX_MODEL_MB} MB para que el celular no se trabe.`);
    return;
  }
  try {
    await idb('readwrite', (store) => store.put(file, 'model'));
  } catch (e) {
    alert('No hay espacio para guardar el modelo en este celular.');
    return;
  }
  state.vehicle.modelName = file.name;
  state.vehicle.front = '+z';
  save();
  await loadModel();
  render();
}

async function removeCustomModel() {
  try {
    await idb('readwrite', (store) => store.delete('model'));
  } catch (e) {
    // Si no se puede borrar, igual se deja de mostrar.
  }
  delete state.vehicle.modelName;
  state.vehicle.front = '+z';
  save();
  await loadModel();
  render();
}

document.getElementById('model-file').addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  ev.target.value = '';
  if (file) saveCustomModel(file);
});

/* ---------- Formularios ---------- */

const modal = document.getElementById('modal');
const modalForm = document.getElementById('modal-form');
const modalFields = document.getElementById('modal-fields');
const modalDelete = document.getElementById('modal-delete');
let modalHandlers = null;

function openForm({ title, fields, onSubmit, onDelete }) {
  document.getElementById('modal-title').textContent = title;
  modalFields.innerHTML = fields.map(fieldHtml).join('');
  modalDelete.hidden = !onDelete;
  modalHandlers = { onSubmit, onDelete };
  modal.showModal();
}

function fieldHtml(f) {
  const attrs = [
    `name="${f.name}"`,
    f.required ? 'required' : '',
    f.min != null ? `min="${f.min}"` : '',
    f.step != null ? `step="${f.step}"` : '',
    f.placeholder ? `placeholder="${esc(f.placeholder)}"` : '',
    f.type === 'number' ? 'inputmode="decimal"' : '',
  ].join(' ');
  let control;
  if (f.type === 'select') {
    control = `<select ${attrs}>${Object.entries(f.options)
      .map(([k, label]) => `<option value="${k}" ${k === f.value ? 'selected' : ''}>${esc(label)}</option>`)
      .join('')}</select>`;
  } else if (f.type === 'textarea') {
    control = `<textarea ${attrs} rows="3">${esc(f.value)}</textarea>`;
  } else {
    control = `<input type="${f.type || 'text'}" value="${esc(f.value ?? '')}" ${attrs}>`;
  }
  return `<label class="field"><span>${esc(f.label)}</span>${control}${f.hint ? `<small>${esc(f.hint)}</small>` : ''}</label>`;
}

modalForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const values = Object.fromEntries(new FormData(modalForm).entries());
  if (modalHandlers.onSubmit(values) === false) return;
  modal.close();
  save();
  render();
});

document.getElementById('modal-cancel').addEventListener('click', () => modal.close());

// Tocar fuera de la hoja la cierra.
modal.addEventListener('click', (ev) => {
  if (ev.target === modal) modal.close();
});

modalDelete.addEventListener('click', () => {
  if (!confirm('¿Eliminar este registro?')) return;
  modalHandlers.onDelete();
  modal.close();
  save();
  render();
});

function kmField(value, label = 'Kilometraje') {
  return { name: 'km', label, type: 'number', min: 0, step: 1, value, placeholder: String(state.vehicle.km) };
}

function categoryOptions() {
  return Object.fromEntries(Object.entries(CATEGORIES).map(([k, c]) => [k, c.label]));
}

function updateKmForm() {
  openForm({
    title: 'Actualizar kilometraje',
    fields: [{ name: 'km', label: 'Kilómetros que marca el tablero', type: 'number', min: 0, step: 1, required: true, value: state.vehicle.km }],
    onSubmit: (v) => {
      const km = numOrNull(v.km);
      if (km == null) return false;
      if (km < state.vehicle.km && !confirm('El valor es menor al actual. ¿Corregirlo igual?')) return false;
      state.vehicle.km = km;
    },
  });
}

function taskForm(t) {
  openForm({
    title: t ? 'Editar tarea' : 'Nueva tarea',
    fields: [
      { name: 'name', label: 'Nombre', required: true, value: t?.name, placeholder: 'Ej.: Cambio de bujías' },
      { name: 'everyKm', label: 'Cada cuántos km', type: 'number', min: 0, step: 100, value: t?.everyKm || '', hint: 'Dejá vacío si sólo depende del tiempo.' },
      { name: 'everyMonths', label: 'Cada cuántos meses', type: 'number', min: 0, step: 1, value: t?.everyMonths || '', hint: 'Dejá vacío si sólo depende de los km.' },
      kmField(t?.lastKm ?? '', 'Km del último service'),
      { name: 'lastDate', label: 'Fecha del último service', type: 'date', value: t?.lastDate || '' },
    ],
    onSubmit: (v) => {
      const data = {
        name: v.name.trim(),
        everyKm: numOrNull(v.everyKm) || 0,
        everyMonths: numOrNull(v.everyMonths) || 0,
        lastKm: numOrNull(v.km),
        lastDate: v.lastDate || null,
      };
      if (!data.everyKm && !data.everyMonths) {
        alert('Indicá cada cuántos km o cada cuántos meses.');
        return false;
      }
      bumpKm(data.lastKm);
      if (t) Object.assign(t, data);
      else state.tasks.push({ id: uid(), ...data });
    },
    onDelete: t ? () => { state.tasks = state.tasks.filter((x) => x !== t); } : null,
  });
}

function doneTaskForm(t) {
  openForm({
    title: t.name,
    fields: [
      { name: 'date', label: 'Fecha', type: 'date', required: true, value: today() },
      kmField(state.vehicle.km || ''),
      { name: 'amount', label: 'Costo (opcional)', type: 'number', min: 0, step: 'any', hint: 'Si lo cargás, se suma a Gastos.' },
      { name: 'note', label: 'Nota (opcional)', placeholder: 'Taller, marca del aceite…' },
    ],
    onSubmit: (v) => {
      const km = numOrNull(v.km);
      t.lastDate = v.date;
      t.lastKm = km;
      bumpKm(km);
      const amount = numOrNull(v.amount);
      if (amount) {
        state.expenses.push({ id: uid(), date: v.date, cat: 'mantenimiento', amount, km, liters: null, note: [t.name, v.note.trim()].filter(Boolean).join(' — ') });
      }
    },
  });
}

function expenseForm(e, presetCat) {
  const cat = e?.cat || presetCat || 'combustible';
  openForm({
    title: e ? 'Editar gasto' : presetCat === 'combustible' ? 'Carga de combustible' : 'Nuevo gasto',
    fields: [
      { name: 'cat', label: 'Categoría', type: 'select', options: categoryOptions(), value: cat },
      { name: 'date', label: 'Fecha', type: 'date', required: true, value: e?.date || today() },
      { name: 'amount', label: 'Monto ($)', type: 'number', min: 0, step: 'any', required: true, value: e?.amount },
      kmField(e?.km ?? ''),
      { name: 'liters', label: 'Litros (sólo combustible)', type: 'number', min: 0, step: 'any', value: e?.liters ?? '', hint: 'Para calcular el consumo, llená el tanque y anotá el km en cada carga.' },
      { name: 'note', label: 'Nota (opcional)', value: e?.note || '' },
    ],
    onSubmit: (v) => {
      const data = {
        cat: v.cat,
        date: v.date,
        amount: numOrNull(v.amount) || 0,
        km: numOrNull(v.km),
        liters: v.cat === 'combustible' ? numOrNull(v.liters) : null,
        note: v.note.trim(),
      };
      bumpKm(data.km);
      if (e) Object.assign(e, data);
      else state.expenses.push({ id: uid(), ...data });
      expenseMonth = data.date.slice(0, 7);
    },
    onDelete: e ? () => { state.expenses = state.expenses.filter((x) => x !== e); } : null,
  });
}

function docForm(d) {
  openForm({
    title: d ? 'Editar vencimiento' : 'Nuevo vencimiento',
    fields: [
      { name: 'name', label: 'Nombre', required: true, value: d?.name, placeholder: 'Ej.: Patente 2º cuota' },
      { name: 'expiry', label: 'Vence el', type: 'date', value: d?.expiry || '' },
      { name: 'notifyDays', label: 'Avisarme con cuántos días de anticipación', type: 'number', min: 0, step: 1, value: d?.notifyDays ?? SOON_DAYS },
      { name: 'note', label: 'Nota (opcional)', value: d?.note || '', placeholder: 'Nº de póliza, compañía…' },
    ],
    onSubmit: (v) => {
      const data = { name: v.name.trim(), expiry: v.expiry, notifyDays: numOrNull(v.notifyDays) ?? SOON_DAYS, note: v.note.trim() };
      if (d) Object.assign(d, data);
      else state.docs.push({ id: uid(), ...data });
    },
    onDelete: d ? () => { state.docs = state.docs.filter((x) => x !== d); } : null,
  });
}

function carForm() {
  const v = state.vehicle;
  openForm({
    title: 'Datos del auto',
    fields: [
      { name: 'name', label: 'Nombre o modelo', value: v.name, placeholder: 'Ej.: Fiat Cronos 2021' },
      { name: 'plate', label: 'Patente', value: v.plate, placeholder: 'AB 123 CD' },
      { name: 'km', label: 'Kilometraje actual', type: 'number', min: 0, step: 1, value: v.km },
      { name: 'notes', label: 'Notas', type: 'textarea', value: v.notes || '', placeholder: 'Medida de cubiertas, tipo de aceite, nº de chasis…' },
    ],
    onSubmit: (f) => {
      v.name = f.name.trim() || 'Mi auto';
      v.plate = f.plate.trim().toUpperCase();
      v.km = numOrNull(f.km) ?? v.km;
      v.notes = f.notes.trim();
    },
  });
}

/* ---------- Copia de seguridad ---------- */

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mi-auto-${today()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

document.getElementById('import-file').addEventListener('change', async (ev) => {
  const file = ev.target.files[0];
  ev.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data || typeof data !== 'object' || !data.vehicle) throw new Error('formato');
    if (!confirm('Esto reemplaza todos los datos actuales por los del archivo. ¿Continuar?')) return;
    const { modelName, front } = state.vehicle; // el modelo 3D no viaja en la copia
    state = normalize(data);
    state.vehicle.modelName = modelName;
    state.vehicle.front = front;
    save();
    applyColor();
    render();
  } catch (e) {
    alert('El archivo no es una copia válida de Mi Auto.');
  }
});

/* ---------- Eventos ---------- */

const find = (list, id) => list.find((x) => x.id === id);

const actions = {
  'update-km': () => updateKmForm(),
  'add-task': () => taskForm(null),
  'edit-task': (el) => taskForm(find(state.tasks, el.dataset.id)),
  'done-task': (el) => doneTaskForm(find(state.tasks, el.dataset.id)),
  'add-expense': (el) => expenseForm(null, el.dataset.cat),
  'edit-expense': (el) => expenseForm(find(state.expenses, el.dataset.id)),
  'add-doc': () => docForm(null),
  'edit-doc': (el) => docForm(find(state.docs, el.dataset.id)),
  'edit-car': () => carForm(),
  'load-model': () => document.getElementById('model-file').click(),
  'remove-model': () => {
    if (confirm('¿Quitar tu modelo 3D y volver al auto genérico?')) removeCustomModel();
  },
  export: () => exportData(),
  import: () => document.getElementById('import-file').click(),
  reset: () => {
    if (!confirm('¿Borrar TODOS los datos del auto? No se puede deshacer.')) return;
    state = defaultState();
    applyColor();
    removeCustomModel();
  },
};

view.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-action], [data-go], [data-month], [data-color]');
  if (!el) return;
  if (el.dataset.action && actions[el.dataset.action]) actions[el.dataset.action](el);
  else if (el.dataset.go) goTo(el.dataset.go);
  else if (el.dataset.color) setColor(el.dataset.color);
  else if (el.dataset.month) {
    const [y, m] = expenseMonth.split('-').map(Number);
    expenseMonth = toISO(new Date(y, m - 1 + Number(el.dataset.month), 1)).slice(0, 7);
    renderExpenses();
  }
});

view.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Enter' || ev.target.getAttribute('role') !== 'button') return;
  ev.target.click();
});

document.querySelector('.tabs').addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-tab]');
  if (btn) goTo(btn.dataset.tab);
});

document.getElementById('status-pill').addEventListener('click', () => {
  document.getElementById('attention')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('storage-warning').hidden = storageOk;
hydrateIcons();
createHotspots();
applyColor();
loadModel();
render();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
