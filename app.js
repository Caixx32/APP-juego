'use strict';

/* ---------- Datos ---------- */

const STORAGE_KEY = 'mi-auto-v1';

const CATEGORIES = {
  combustible: '⛽ Combustible',
  mantenimiento: '🔧 Mantenimiento',
  reparacion: '🛠️ Reparación',
  seguro: '🛡️ Seguro',
  patente: '🧾 Patente / impuestos',
  peaje: '🛣️ Peaje / estacionamiento',
  lavado: '🧽 Lavado',
  otro: '📦 Otro',
};

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
    vehicle: { name: 'Mi auto', plate: '', km: 0 },
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

/* ---------- Utilidades ---------- */

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 });

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function today() {
  const d = new Date();
  return toISO(d);
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

/* ---------- Cálculos ---------- */

function taskStatus(t) {
  const km = state.vehicle.km;
  if (t.lastKm == null && !t.lastDate) {
    return { level: 'none', label: 'Sin registro', detail: 'Cargá cuándo lo hiciste por última vez' };
  }
  const parts = [];
  let level = 'ok';
  let kmLeft = null;
  let daysLeft = null;

  if (t.everyKm > 0 && t.lastKm != null) {
    const nextKm = t.lastKm + t.everyKm;
    kmLeft = nextKm - km;
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
    daysLeft = daysUntil(nextDate);
    parts.push(`${daysLeft < 0 ? 'venció' : 'vence'} ${daysText(daysLeft)} (${fmtDate(nextDate)})`);
    if (daysLeft < 0) level = 'bad';
    else if (daysLeft <= SOON_DAYS && level !== 'bad') level = 'warn';
  }
  if (!parts.length) {
    return { level: 'none', label: 'Incompleto', detail: 'Falta el km o la fecha del último service' };
  }
  const label = { ok: 'Al día', warn: 'Pronto', bad: 'Vencido' }[level];
  return { level, label, detail: parts.join(' · '), kmLeft, daysLeft };
}

function docStatus(d) {
  if (!d.expiry) return { level: 'none', label: 'Sin fecha', detail: 'Cargá la fecha de vencimiento' };
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

/* ---------- Vistas ---------- */

const view = document.getElementById('view');
let currentTab = 'home';
let expenseMonth = today().slice(0, 7);

function badge(st) {
  return `<span class="badge ${st.level}">${esc(st.label)}</span>`;
}

function renderHeader() {
  document.getElementById('title').textContent = state.vehicle.name || 'Mi Auto';
  const plate = document.getElementById('plate');
  plate.hidden = !state.vehicle.plate;
  plate.textContent = state.vehicle.plate;
}

function renderHome() {
  const alerts = [
    ...state.tasks.map((t) => ({ kind: 'task', item: t, st: taskStatus(t) })),
    ...state.docs.map((d) => ({ kind: 'doc', item: d, st: docStatus(d) })),
  ]
    .filter((a) => a.st.level === 'bad' || a.st.level === 'warn')
    .sort((a, b) => (a.st.level === b.st.level ? 0 : a.st.level === 'bad' ? -1 : 1));

  const month = today().slice(0, 7);
  const yearAgo = addMonths(today(), -12);
  const fuel = fuelStats();

  view.innerHTML = `
    <div class="card hero">
      <div class="grow">
        <div class="sub">Kilometraje actual</div>
        <div class="km">${fmtKm(state.vehicle.km)}</div>
      </div>
      <button class="primary" data-action="update-km">Actualizar</button>
    </div>

    <div class="stats">
      <div class="stat"><div class="label">Gastado este mes</div><div class="value">${money.format(sumExpenses((e) => e.date.startsWith(month)))}</div></div>
      <div class="stat"><div class="label">Últimos 12 meses</div><div class="value">${money.format(sumExpenses((e) => e.date > yearAgo))}</div></div>
      <div class="stat"><div class="label">Consumo promedio</div><div class="value">${fuel ? `${num.format(fuel.avg)} km/l` : '—'}</div></div>
    </div>

    <h2 class="section">Atención</h2>
    ${alerts.length ? alerts.map((a) => `
      <div class="card"><div class="row">
        <div class="grow">
          <div class="name">${a.kind === 'task' ? '🔧' : '📄'} ${esc(a.item.name)}</div>
          <div class="sub">${esc(a.st.detail)}</div>
        </div>
        ${badge(a.st)}
      </div></div>`).join('') : '<div class="card empty">✅ Todo al día. No hay nada vencido ni por vencer.</div>'}

    <h2 class="section">Carga rápida</h2>
    <div class="stats">
      <button class="block" data-action="add-expense" data-cat="combustible">⛽ Cargué nafta</button>
      <button class="block" data-action="add-expense">💸 Otro gasto</button>
    </div>
  `;
}

function renderTasks() {
  const items = state.tasks
    .map((t) => ({ t, st: taskStatus(t) }))
    .sort((a, b) => levelOrder(a.st.level) - levelOrder(b.st.level));

  view.innerHTML = `
    <div class="toolbar">
      <div class="grow sub">Cada tarea avisa por kilómetros, por tiempo o por lo que llegue primero.</div>
      <button class="primary" data-action="add-task">+ Nueva</button>
    </div>
    ${items.map(({ t, st }) => `
      <div class="card">
        <div class="row">
          <div class="grow">
            <div class="name">${esc(t.name)}</div>
            <div class="sub">${esc(intervalText(t))}</div>
          </div>
          ${badge(st)}
        </div>
        <div class="sub" style="margin-top:6px">${esc(st.detail)}</div>
        <div class="sub">Último: ${t.lastKm != null ? fmtKm(t.lastKm) : '—'} · ${fmtDate(t.lastDate)}</div>
        <div class="actions">
          <button class="small primary" data-action="done-task" data-id="${t.id}">✔ Lo hice</button>
          <button class="small" data-action="edit-task" data-id="${t.id}">Editar</button>
        </div>
      </div>`).join('') || '<div class="card empty">No hay tareas. Agregá una con “+ Nueva”.</div>'}
  `;
}

function levelOrder(level) {
  return { bad: 0, warn: 1, none: 2, ok: 3 }[level];
}

function intervalText(t) {
  const parts = [];
  if (t.everyKm > 0) parts.push(`cada ${fmtKm(t.everyKm)}`);
  if (t.everyMonths > 0) parts.push(`cada ${t.everyMonths} ${t.everyMonths === 1 ? 'mes' : 'meses'}`);
  return parts.length ? parts.join(' o ') : 'Sin intervalo';
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

  view.innerHTML = `
    <div class="toolbar">
      <input type="month" id="month" value="${expenseMonth}" aria-label="Mes">
      <button class="primary" data-action="add-expense">+ Gasto</button>
    </div>

    <div class="card">
      <div class="row">
        <div class="grow"><div class="sub">Total del mes</div><div class="km" style="font-size:1.5rem;font-weight:700">${money.format(total)}</div></div>
        ${fuel ? `<div class="sub" style="text-align:right">Consumo<br><b>${num.format(fuel.avg)} km/l</b>${fuel.last ? `<br>última: ${num.format(fuel.last)}` : ''}</div>` : ''}
      </div>
      ${cats.map(([cat, amt]) => `
        <div class="cat-bar">
          <span class="label">${esc(CATEGORIES[cat] || cat)}</span>
          <span class="bar"><i style="width:${max ? (amt / max) * 100 : 0}%"></i></span>
          <span class="amt">${money.format(amt)}</span>
        </div>`).join('')}
    </div>

    ${list.map((e) => `
      <div class="card" data-action="edit-expense" data-id="${e.id}" role="button" tabindex="0">
        <div class="row">
          <div class="grow">
            <div class="name">${esc(CATEGORIES[e.cat] || e.cat)}</div>
            <div class="sub">${fmtDate(e.date)}${e.km != null ? ` · ${fmtKm(e.km)}` : ''}${e.liters ? ` · ${num.format(e.liters)} l ($${num.format(e.amount / e.liters)}/l)` : ''}</div>
            ${e.note ? `<div class="sub">${esc(e.note)}</div>` : ''}
          </div>
          <span class="amount">${money.format(e.amount)}</span>
        </div>
      </div>`).join('') || '<div class="card empty">No hay gastos en este mes.</div>'}
  `;

  document.getElementById('month').addEventListener('change', (ev) => {
    expenseMonth = ev.target.value || today().slice(0, 7);
    renderExpenses();
  });
}

function renderDocs() {
  const items = state.docs
    .map((d) => ({ d, st: docStatus(d) }))
    .sort((a, b) => levelOrder(a.st.level) - levelOrder(b.st.level) || (a.d.expiry || '9').localeCompare(b.d.expiry || '9'));

  view.innerHTML = `
    <div class="toolbar">
      <div class="grow sub">Seguro, VTV, licencia, patente… Te avisa antes de que venzan.</div>
      <button class="primary" data-action="add-doc">+ Nuevo</button>
    </div>
    ${items.map(({ d, st }) => `
      <div class="card" data-action="edit-doc" data-id="${d.id}" role="button" tabindex="0">
        <div class="row">
          <div class="grow">
            <div class="name">${esc(d.name)}</div>
            <div class="sub">${esc(st.detail)}</div>
            ${d.note ? `<div class="sub">${esc(d.note)}</div>` : ''}
          </div>
          ${badge(st)}
        </div>
      </div>`).join('') || '<div class="card empty">No hay papeles cargados.</div>'}
  `;
}

function renderCar() {
  const v = state.vehicle;
  view.innerHTML = `
    <h2 class="section">Datos del auto</h2>
    <div class="card">
      <div class="name">${esc(v.name || 'Mi auto')}</div>
      <div class="sub">${v.plate ? `Patente ${esc(v.plate)} · ` : ''}${fmtKm(v.km)}</div>
      ${v.notes ? `<div class="sub" style="margin-top:6px;white-space:pre-wrap">${esc(v.notes)}</div>` : ''}
      <div class="actions"><button class="small" data-action="edit-car">Editar</button></div>
    </div>

    <h2 class="section">Copia de seguridad</h2>
    <div class="card">
      <div class="sub">Los datos se guardan sólo en este celular. Exportá una copia de vez en cuando para no perderlos.</div>
      <div class="actions">
        <button class="small" data-action="export">⬇ Exportar</button>
        <button class="small" data-action="import">⬆ Importar</button>
      </div>
    </div>

    <h2 class="section">Zona peligrosa</h2>
    <div class="card">
      <button class="small danger" data-action="reset">Borrar todos los datos</button>
    </div>
  `;
}

const renderers = { home: renderHome, tasks: renderTasks, expenses: renderExpenses, docs: renderDocs, car: renderCar };

function render() {
  renderHeader();
  renderers[currentTab]();
}

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
    title: t ? 'Editar tarea' : 'Nueva tarea de mantenimiento',
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
    title: `✔ ${t.name}`,
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
    title: e ? 'Editar gasto' : cat === 'combustible' && presetCat ? '⛽ Carga de combustible' : 'Nuevo gasto',
    fields: [
      { name: 'cat', label: 'Categoría', type: 'select', options: CATEGORIES, value: cat },
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
    title: d ? 'Editar papel' : 'Nuevo papel / vencimiento',
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
      { name: 'name', label: 'Nombre o modelo', value: v.name, placeholder: 'Ej.: Gol Trend 2015' },
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
    state = normalize(data);
    save();
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
  export: () => exportData(),
  import: () => document.getElementById('import-file').click(),
  reset: () => {
    if (!confirm('¿Borrar TODOS los datos del auto? No se puede deshacer.')) return;
    state = defaultState();
    save();
    render();
  },
};

view.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-action]');
  if (el && actions[el.dataset.action]) actions[el.dataset.action](el);
});

view.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Enter' || ev.target.getAttribute('role') !== 'button') return;
  ev.target.click();
});

document.querySelector('.tabs').addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-tab]');
  if (!btn) return;
  currentTab = btn.dataset.tab;
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('active', b === btn));
  window.scrollTo(0, 0);
  render();
});

document.getElementById('storage-warning').hidden = storageOk;
render();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
