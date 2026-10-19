'use strict';

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
  ticket: '<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M9 10h6M9 14h4"/>',
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
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  camera: '<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
  clip: '<path d="M20 11.5l-7.8 7.8a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4L15 6.9"/>',
  history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6M3.5 4v4h4"/><path d="M12 8v4.5l3 2"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  cloud: '<path d="M7 18h10.5a4 4 0 0 0 .4-8A6 6 0 0 0 6.3 9.6 4.2 4.2 0 0 0 7 18z"/>',
  logout: '<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  dollar: '<path d="M12 3v18M16.5 7.5c-.8-1.3-2.4-2-4.5-2-2.5 0-4 1.3-4 3s1.4 2.5 4 3 4 1.4 4 3.2-1.6 3.3-4 3.3c-2.2 0-3.8-.8-4.6-2.2"/>',
  google: '<path d="M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.1 2.7-7z" fill="#4285f4" stroke="none"/><path d="M12 21.5c2.6 0 4.7-.9 6.3-2.3l-3.1-2.4c-.9.6-2 .9-3.2.9-2.5 0-4.6-1.7-5.3-3.9H3.5v2.5A9.5 9.5 0 0 0 12 21.5z" fill="#34a853" stroke="none"/><path d="M6.7 13.8a5.7 5.7 0 0 1 0-3.6V7.7H3.5a9.5 9.5 0 0 0 0 8.6z" fill="#fbbc05" stroke="none"/><path d="M12 6.3c1.4 0 2.6.5 3.6 1.4l2.7-2.7A9.5 9.5 0 0 0 3.5 7.7l3.2 2.5C7.4 8 9.5 6.3 12 6.3z" fill="#ea4335" stroke="none"/>',
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
}

function bumpKm(km) {
  if (km != null && km > state.vehicle.km) state.vehicle.km = km;
}

/* ---------- Vistas ---------- */

const view = document.getElementById('view');
let currentTab = 'home';
let expenseMonth = today().slice(0, 7);
let expenseSegment = 'gastos'; // 'gastos' o 'multas'
let currentUser = null;
let cloudInfo = { fromCache: false, pending: false };

const currency = () => device.currency || 'ARS';

function badge(st) {
  return `<span class="badge ${st.level}">${esc(st.label)}</span>`;
}

function pageHead(eyebrow, title, text) {
  return `<header class="page-head"><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1>${text ? `<p>${esc(text)}</p>` : ''}</header>`;
}

function calButton(dl, small = true) {
  if (!dl) return '';
  return `<a class="btn ${small ? 'small' : ''}" href="${esc(gcalLink(dl))}" target="_blank" rel="noopener">${icon('calendar')}Google Calendar</a>`;
}

function deadlineFor(key) {
  return deadlines().find((d) => d.key === key) || null;
}

function amountLine(e) {
  const u = inUsd(e);
  return u == null ? '' : `${e.rateApprox ? '≈ ' : ''}${fmtUsd(u)}`;
}

function renderHero() {
  const v = state.vehicle;
  document.getElementById('car-name').textContent = v.name || 'Mi auto';
  const plate = document.getElementById('plate');
  plate.hidden = !v.plate;
  plate.textContent = v.plate;
  document.getElementById('hero-km').textContent = fmtKm(v.km);
  document.getElementById('offline-chip').hidden = navigator.onLine !== false;

  const list = alerts();
  const pill = document.getElementById('status-pill');
  const worst = list.length ? list[0].st.level : 'ok';
  pill.className = `status-pill ${worst}`;
  pill.textContent = list.length ? `${list.length} ${list.length === 1 ? 'alerta' : 'alertas'}` : 'Todo al día';
}

// Aviso destacado arriba de todo cuando hay cosas vencidas o por vencer.
function renderBanner() {
  const el = document.getElementById('alert-banner');
  const list = alerts();
  let dismissed = false;
  try {
    dismissed = sessionStorage.getItem('mi-auto-aviso-cerrado') === String(list.length);
  } catch (e) {
    // sin sessionStorage el aviso no se puede ocultar
  }
  // Se muestra en Inicio, que es la pantalla con la que abre la app.
  if (!list.length || dismissed || currentTab !== 'home') {
    el.hidden = true;
    return;
  }
  const bad = list.filter((a) => a.st.level === 'bad').length;
  const warn = list.length - bad;
  const parts = [bad && `${bad} ${bad === 1 ? 'vencido' : 'vencidos'}`, warn && `${warn} por vencer`].filter(Boolean).join(' y ');
  const askPermission = notificationsSupported() && Notification.permission === 'default';
  el.className = `alert-banner ${bad ? 'bad' : 'warn'}`;
  el.innerHTML = `
    <div class="ab-icon">${icon('alert')}</div>
    <div class="grow">
      <div class="name">Tenés ${parts}</div>
      <div class="sub">${list.slice(0, 3).map((a) => esc(a.title)).join(' · ')}${list.length > 3 ? ' · …' : ''}</div>
      <div class="actions">
        <button class="btn small" data-banner="ver">Ver detalle</button>
        ${askPermission ? `<button class="btn small" data-banner="notif">${icon('bell')}Activar notificaciones</button>` : ''}
      </div>
    </div>
    <button class="btn icon-only ghost" data-banner="cerrar" aria-label="Cerrar aviso">${icon('close')}</button>`;
  el.hidden = false;
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

  const monthList = state.expenses.filter((e) => e.date.startsWith(month));
  const monthTotal = monthList.reduce((a, e) => a + (Number(e.amount) || 0), 0);
  const monthUsd = monthList.reduce((a, e) => a + (inUsd(e) || 0), 0);
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
          <div class="sub">${monthUsd ? `≈ ${fmtUsd(monthUsd)} · ` : ''}Últimos 12 meses: ${money.format(sumExpenses((e) => e.date > yearAgo))}</div>
        </div>
        ${icon('chev', 'chev')}
      </div>
    </div>

    <div class="section-title" id="attention">Atención</div>
    ${list.length ? list.map((a) => `
      <div class="card glass tap" data-go="${{ task: 'tasks', doc: 'docs', fine: 'fines' }[a.kind]}">
        <div class="row">
          <div class="icon-bubble ${a.st.level}">${icon(a.kind === 'task' ? 'wrench' : a.kind === 'doc' ? 'doc' : 'ticket')}</div>
          <div class="grow">
            <div class="name">${esc(a.title)}</div>
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
    ${pageHead('Mantenimiento', 'Service', 'Tocá una tarea para ver su historial. Avisa por kilómetros, por tiempo o por lo que llegue primero.')}
    <div class="quick" style="margin-top:4px;margin-bottom:14px">
      <button class="btn primary" data-action="add-task">${icon('plus')}Nueva tarea</button>
    </div>
    <div class="cards">
    ${items.map(({ t, st }) => `
      <div class="card glass tap" data-action="open-task" data-id="${t.id}" role="button" tabindex="0">
        <div class="row">
          <div class="icon-bubble ${st.level}">${icon('wrench')}</div>
          <div class="grow">
            <div class="name">${esc(t.name)}</div>
            <div class="sub">${esc(intervalTextOf(t))}</div>
          </div>
          ${badge(st)}
        </div>
        <div class="progress ${st.level}"><i style="width:${Math.round(st.progress * 100)}%"></i></div>
        <div class="sub" style="margin-top:10px">${esc(st.detail)}</div>
        <div class="sub">${icon('history', 'inline')} ${t.history.length} ${t.history.length === 1 ? 'registro' : 'registros'} · último: ${t.lastKm != null ? fmtKm(t.lastKm) : '—'} · ${fmtDate(t.lastDate)}</div>
        <div class="actions">
          <button class="btn small primary" data-action="done-task" data-id="${t.id}">${icon('check')}Lo hice</button>
          ${calButton(deadlineFor(`task:${t.id}`))}
        </div>
      </div>`).join('') || '<div class="card glass empty">No hay tareas. Agregá una con «Nueva tarea».</div>'}
    </div>
  `;
}

function monthLabel(ym, opts = { month: 'long', year: 'numeric' }) {
  const [y, m] = ym.split('-').map(Number);
  const s = new Date(y, m - 1, 1).toLocaleDateString('es-AR', opts);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function expenseValue(e, cur) {
  return cur === 'USD' ? inUsd(e) : Number(e.amount) || 0;
}

function fmtCur(n, cur) {
  return cur === 'USD' ? fmtUsd(n) : money.format(n);
}

function segmented(name, options, value) {
  return `<div class="segmented" role="tablist">${Object.entries(options).map(([k, label]) => `
    <button role="tab" class="${k === value ? 'active' : ''}" data-seg="${name}" data-value="${k}" aria-selected="${k === value}">${esc(label)}</button>`).join('')}</div>`;
}

function renderExpenses() {
  if (expenseSegment === 'multas') {
    renderFines();
    return;
  }
  const cur = currency();
  const list = state.expenses
    .filter((e) => e.date.startsWith(expenseMonth))
    .sort((a, b) => (b.date + (b.km ?? '')).localeCompare(a.date + (a.km ?? '')));
  const withValue = list.filter((e) => expenseValue(e, cur) != null);
  const missing = list.length - withValue.length;
  const total = withValue.reduce((acc, e) => acc + expenseValue(e, cur), 0);

  const byCat = {};
  for (const e of withValue) byCat[e.cat] = (byCat[e.cat] || 0) + expenseValue(e, cur);
  const slices = Object.entries(byCat)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, value]) => {
      const c = CATEGORIES[cat] || CATEGORIES.otro;
      return { key: cat, label: c.label, value, color: c.color, display: fmtCur(value, cur) };
    });

  // Barras: los 12 meses que terminan en el mes actual.
  const nowYm = today().slice(0, 7);
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const ym = addMonths(`${nowYm}-01`, -i).slice(0, 7);
    const value = state.expenses.filter((e) => e.date.startsWith(ym)).reduce((a, e) => a + (expenseValue(e, cur) || 0), 0);
    months.push({ key: ym, label: monthLabel(ym, { month: 'short' }).replace('.', '').slice(0, 3), value, tip: `${monthLabel(ym)}: ${fmtCur(value, cur)}` });
  }
  const fuel = fuelStats();
  const isCurrent = expenseMonth >= nowYm;

  view.innerHTML = `
    ${pageHead('Finanzas', 'Gastos')}
    <div class="seg-row">
      ${segmented('expseg', { gastos: 'Gastos', multas: `Multas${state.fines.some((f) => f.status === 'pendiente') ? ` (${state.fines.filter((f) => f.status === 'pendiente').length})` : ''}` }, 'gastos')}
      ${segmented('currency', { ARS: '$ ARS', USD: 'US$' }, cur)}
    </div>

    <div class="card glass chart-card">
      <div class="row" style="margin-bottom:6px">
        <div class="grow"><div class="sub">Últimos 12 meses</div><div class="name">${fmtCur(months.reduce((a, m) => a + m.value, 0), cur)}</div></div>
        ${fuel ? `<div class="days"><b>${num.format(fuel.avg)}</b><span>km/l prom.</span></div>` : ''}
      </div>
      ${barChart(months, { selected: expenseMonth, currency: cur })}
      <div class="sub chart-note">Tocá una barra para ver ese mes.</div>
    </div>

    <div class="month-nav">
      <button class="btn icon-only" data-month="-1" aria-label="Mes anterior">${icon('left')}</button>
      <div class="label">${esc(monthLabel(expenseMonth))}</div>
      <button class="btn icon-only" data-month="1" aria-label="Mes siguiente" ${isCurrent ? 'disabled style="opacity:.3"' : ''}>${icon('chev')}</button>
    </div>

    <div class="card glass">
      ${slices.length
        ? donutChart(slices, { total: fmtCur(total, cur), totalLabel: 'en el mes' })
        : `<div class="empty" style="padding:12px">Sin gastos en ${esc(monthLabel(expenseMonth))}.</div>`}
      ${missing && cur === 'USD' ? `<div class="sub chart-note">${missing} ${missing === 1 ? 'gasto no tiene' : 'gastos no tienen'} cotización y no ${missing === 1 ? 'entra' : 'entran'} en el total en dólares. Tocalos para cargarla.</div>` : ''}
    </div>

    <div class="section-title">Movimientos <button class="btn small primary" data-action="add-expense">${icon('plus')}Gasto</button></div>
    ${list.length ? `<div class="card glass" style="padding:4px 16px">${list.map((e) => {
      const cat = CATEGORIES[e.cat] || CATEGORIES.otro;
      return `
      <div class="list-item tap" data-action="edit-expense" data-id="${e.id}" role="button" tabindex="0">
        <div class="icon-bubble cat" style="--cat:${cat.color}">${icon(cat.icon)}</div>
        <div class="grow">
          <div class="name">${esc(e.note || cat.label)}</div>
          <div class="sub">${fmtDate(e.date)}${e.km != null ? ` · ${fmtKm(e.km)}` : ''}${e.liters ? ` · ${num.format(e.liters)} l · $${num.format(e.amount / e.liters)}/l` : ''}</div>
        </div>
        <div class="amount-col">
          <span class="amount">${money.format(e.amount)}</span>
          <span class="sub">${e.usdRate ? esc(amountLine(e)) : '<span class="missing">sin cotización</span>'}</span>
        </div>
      </div>`;
    }).join('')}</div>` : '<div class="card glass empty">No hay gastos en este mes.</div>'}
  `;
}

function renderFines() {
  const order = { pendiente: 0, descargo: 1, pagada: 2 };
  const items = state.fines
    .map((f) => ({ f, st: fineStatus(f) }))
    .sort((a, b) => order[a.f.status] - order[b.f.status] || levelOrder(a.st.level) - levelOrder(b.st.level) || (b.f.date || '').localeCompare(a.f.date || ''));
  const pendingTotal = state.fines.filter((f) => f.status === 'pendiente').reduce((a, f) => a + (Number(f.amount) || 0), 0);

  view.innerHTML = `
    ${pageHead('Finanzas', 'Multas')}
    <div class="seg-row">
      ${segmented('expseg', { gastos: 'Gastos', multas: 'Multas' }, 'multas')}
    </div>
    <div class="card glass">
      <div class="row">
        <div class="grow"><div class="sub">Pendiente de pago</div><div class="big-number">${money.format(pendingTotal)}</div></div>
        <button class="btn primary" data-action="add-fine">${icon('plus')}Multa</button>
      </div>
    </div>
    <div class="cards">
    ${items.map(({ f, st }) => `
      <div class="card glass tap" data-action="open-fine" data-id="${f.id}" role="button" tabindex="0">
        <div class="row">
          <div class="icon-bubble ${f.status === 'pendiente' ? st.level : f.status === 'pagada' ? 'ok' : 'none'}">${icon('ticket')}</div>
          <div class="grow">
            <div class="name">${esc(f.reason || 'Multa')}</div>
            <div class="sub">${esc([fmtDate(f.date), f.place].filter(Boolean).join(' · '))}</div>
            <div class="sub">${esc(st.detail)}${f.files.length ? ` · ${icon('clip', 'inline')} ${f.files.length}` : ''}</div>
          </div>
          <div class="amount-col">
            <span class="amount">${f.amount ? money.format(f.amount) : '—'}</span>
            ${badge(st)}
          </div>
        </div>
      </div>`).join('') || '<div class="card glass empty">No hay multas cargadas. ¡Ojalá siga así!</div>'}
    </div>
  `;
}

function renderDocs() {
  const items = state.docs
    .map((d) => ({ d, st: docStatus(d) }))
    .sort((a, b) => levelOrder(a.st.level) - levelOrder(b.st.level) || (a.d.expiry || '9').localeCompare(b.d.expiry || '9'));

  view.innerHTML = `
    ${pageHead('Documentación', 'Papeles', 'Tocá un papel para mostrarlo en pantalla completa (por ejemplo, en un control de tránsito).')}
    <div class="quick" style="margin-top:4px;margin-bottom:14px">
      <button class="btn primary" data-action="add-doc">${icon('plus')}Agregar papel</button>
    </div>
    <div class="cards">
    ${items.map(({ d, st }) => `
      <div class="card glass tap" data-action="open-doc" data-id="${d.id}" role="button" tabindex="0">
        <div class="row">
          <div class="icon-bubble ${st.level}">${icon('doc')}</div>
          <div class="grow">
            <div class="name">${esc(d.name)}</div>
            <div class="sub">${esc([d.number && `Nº ${d.number}`, d.expiry && `Vence el ${fmtDate(d.expiry)}`].filter(Boolean).join(' · ') || 'Sin número cargado')}</div>
            <div class="sub">${d.files.length ? `${icon('clip', 'inline')} ${d.files.length} ${d.files.length === 1 ? 'archivo' : 'archivos'}` : 'Sin fotos ni PDF'}</div>
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
  const perm = notificationsSupported() ? Notification.permission : 'unsupported';
  const permText = {
    granted: 'Activadas: te avisamos cuando algo pase a «por vencer» o «vencido».',
    denied: 'Bloqueadas en este navegador. Para activarlas, habilitalas desde la configuración del sitio (candadito al lado de la dirección).',
    default: 'Todavía no las activaste en este dispositivo.',
    unsupported: 'Este navegador no permite notificaciones. En iPhone, primero instalá la app en la pantalla de inicio.',
  }[perm];

  view.innerHTML = `
    ${pageHead('Configuración', v.name || 'Mi auto')}

    <div class="section-title">Cuenta</div>
    <div class="card glass">
      ${mode === 'cloud' ? `
        <div class="row">
          <div class="icon-bubble">${icon('cloud')}</div>
          <div class="grow">
            <div class="name">${esc(currentUser?.email || '')}</div>
            <div class="sub">${navigator.onLine === false ? 'Sin conexión: los cambios se suben solos cuando vuelva la señal.' : cloudInfo.pending ? 'Subiendo cambios…' : 'Sincronizado. Los cambios se comparten con la otra cuenta del garage.'}</div>
          </div>
        </div>
        <div class="actions"><button class="btn small" data-action="sign-out">${icon('logout')}Cerrar sesión</button></div>` : `
        <div class="row">
          <div class="icon-bubble none">${icon('cloud')}</div>
          <div class="grow">
            <div class="name">Sin nube</div>
            <div class="sub">Los datos quedan sólo en este dispositivo. Para compartirlos y tener copia en la nube, hay que completar <b>config.js</b> con los datos de Firebase (ver README).</div>
          </div>
        </div>`}
    </div>

    <div class="section-title">Datos</div>
    <div class="settings glass">
      <div class="set-row" data-action="edit-car"><span class="grow">Nombre o modelo</span><span class="val">${esc(v.name || '—')}</span>${icon('chev', 'chev')}</div>
      <div class="set-row" data-action="edit-car"><span class="grow">Patente</span><span class="val">${esc(v.plate || '—')}</span>${icon('chev', 'chev')}</div>
      <div class="set-row" data-action="update-km"><span class="grow">Kilometraje</span><span class="val">${fmtKm(v.km)}</span>${icon('chev', 'chev')}</div>
      ${v.notes ? `<div class="set-row" data-action="edit-car"><span class="grow sub" style="white-space:pre-wrap">${esc(v.notes)}</span>${icon('chev', 'chev')}</div>` : ''}
    </div>

    <div class="section-title">Avisos</div>
    <div class="card glass">
      <div class="row">
        <div class="icon-bubble ${perm === 'granted' ? 'ok' : 'none'}">${icon('bell')}</div>
        <div class="grow"><div class="name">Notificaciones</div><div class="sub">${esc(permText)}</div></div>
      </div>
      <div class="actions">
        ${perm === 'default' ? `<button class="btn small primary" data-action="enable-notif">${icon('bell')}Activar notificaciones</button>` : ''}
        <button class="btn small" data-action="download-ics">${icon('calendar')}Descargar calendario (.ics)</button>
      </div>
      <div class="sub" style="margin-top:10px">El archivo .ics trae todos los vencimientos juntos, con recordatorio. Abrilo desde el celular o importalo en Google Calendar (Configuración → Importar).</div>
    </div>

    <div class="section-title">Color</div>
    <div class="card glass">
      <div class="row">
        <div class="icon-bubble">${icon('palette')}</div>
        <div class="grow"><div class="name">Color de tu auto</div><div class="sub">Pinta toda la app con el color que elijas.</div></div>
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
          <div class="name">${device.modelName ? esc(device.modelName) : 'Tu auto (incluido en la app)'}</div>
          <div class="sub">${device.modelName ? 'Este modelo está guardado sólo en este dispositivo.' : 'Viene incluido en la app. Si querés probar otro modelo, cargá un .glb.'}</div>
        </div>
      </div>
      <div class="actions">
        <button class="btn small primary" data-action="load-model">${icon('upload')}Cargar .glb</button>
        ${device.modelName ? `<button class="btn small danger" data-action="remove-model">${icon('trash')}Quitar</button>` : ''}
      </div>
      <label class="field" style="margin:16px 0 0">
        <span>Orientación de los puntos</span>
        <select id="front-select">
          ${Object.entries(FRONT_OPTIONS).map(([k, label]) => `<option value="${k}" ${k === currentFront() ? 'selected' : ''}>${esc(label)}</option>`).join('')}
        </select>
        <small>El punto «Motor» tiene que quedar sobre el capó.</small>
      </label>
    </div>

    <div class="section-title">Copia de seguridad</div>
    <div class="card glass">
      <div class="sub">${mode === 'cloud' ? 'Los datos ya están en la nube. Igual podés bajar una copia en un archivo.' : 'Los datos se guardan sólo en este dispositivo. Exportá una copia de vez en cuando.'} Las fotos y los PDF no entran en el archivo.</div>
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
    device[frontKey()] = ev.target.value;
    saveDevice();
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
  applyColor();
  renderHero();
  renderBanner();
  document.body.dataset.view = currentTab;
  document.getElementById('stage').hidden = currentTab !== 'home';
  document.getElementById('storage-warning').hidden = mode === 'cloud' || storageOk;
  renderers[currentTab]();
  updateHotspots();
}

// Muchas novedades de la nube llegan juntas: se dibuja una sola vez por cuadro.
let renderQueued = false;
function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    if (started) render();
  });
}

function goTo(tab) {
  // «fines» es la lista de multas, que vive dentro de Gastos.
  if (tab === 'fines' || tab === 'expenses') expenseSegment = tab === 'fines' ? 'multas' : 'gastos';
  if (tab === 'fines') tab = 'expenses';
  currentTab = tab;
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  selectedSpot = null;
  window.scrollTo(0, 0);
  render();
}

/* ---------- Auto 3D ---------- */

const DEFAULT_MODEL = 'models/baic-x55.glb';
// Hacia dónde mira la trompa del modelo incluido (en el archivo apunta hacia +Z).
const DEFAULT_FRONT = '+z';
/*
 * El BAIC X55 trae un solo material para todo el auto, así que el brillo de cada parte sale de su textura
 * metallicRoughness (G = rugosidad, B = metalicidad). Este mapa la reemplaza por zonas: carrocería con
 * rugosidad 0,4 y metalicidad 0,3, vidrios lisos (0,05) y gomas y plásticos mate (0,85, sin metal).
 * Se genera con tools/brillo a partir de los colores del atlas y de la forma del auto.
 */
const DEFAULT_FINISH = 'models/baic-x55-brillo.webp';

// La orientación se guarda por separado para el modelo incluido y para uno cargado en el dispositivo.
function frontKey() {
  return device.modelName ? 'front' : 'defaultFront';
}

function currentFront() {
  return device[frontKey()] || (device.modelName ? '+z' : DEFAULT_FRONT);
}
const MAX_MODEL_MB = 40;

// Puntos sobre el auto. Cada tarea va al primero cuyo nombre coincide; las demás, los papeles y las multas, al habitáculo.
const SPOTS = [
  { key: 'motor', label: 'Motor', match: /aceite|motor|correa|distribuci|buj[ií]a|filtro de aire|refrigerante|bater[ií]a|embrague/i },
  { key: 'ruedas', label: 'Ruedas', match: /neum[aá]tico|rueda|cubierta|alineaci|balanceo|amortiguador|suspensi/i },
  { key: 'frenos', label: 'Frenos', match: /fren|pastilla|disco/i },
  { key: 'cabina', label: 'Habitáculo y papeles', match: null },
];

// Dónde va cada punto, en fracciones de la caja que ocupa el auto:
// adelante (-0.5 cola … 0.5 trompa), costado (-0.5 … 0.5) y altura (0 piso … 1 techo).
// Medido sobre el BAIC X55: ejes al 31 % adelante y 29 % atrás, gomas al 42 % del ancho (los espejos ensanchan la caja).
const SPOT_PLACES = {
  motor: [0.33, 0, 0.66],
  ruedas: [0.31, 0.42, 0.2],
  frenos: [-0.29, 0.42, 0.2],
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
    for (const f of state.fines) if (f.status === 'pendiente') out.push({ icon: 'ticket', name: fineTitle(f), st: fineStatus(f) });
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
  const front = currentFront();
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

// Ajusta el brillo del modelo incluido con la API de materiales de model-viewer (no cambia su color).
async function applyDefaultFinish() {
  if (mv.getAttribute('src') !== DEFAULT_MODEL || !mv.model) return;
  try {
    const finish = await mv.createTexture(DEFAULT_FINISH);
    for (const mat of mv.model.materials) {
      const pbr = mat.pbrMetallicRoughness;
      pbr.metallicRoughnessTexture.setTexture(finish);
      pbr.setRoughnessFactor(1);
      pbr.setMetallicFactor(1);
    }
  } catch (e) {
    // Sin el mapa (por ejemplo, sin internet la primera vez) el auto se ve con el brillo original.
  }
}

mv.addEventListener('load', () => {
  // La URL del modelo anterior se libera recién cuando el nuevo terminó de cargar.
  if (staleModelUrl) URL.revokeObjectURL(staleModelUrl);
  staleModelUrl = null;
  placeHotspots();
  applyDefaultFinish();
});

mv.addEventListener('error', () => {
  if (mv.getAttribute('src') === DEFAULT_MODEL) return;
  alert('No se pudo abrir ese modelo 3D. Vuelvo a mostrar el auto de la app.');
  removeCustomModel();
});

async function loadModel() {
  const blob = await idbGet('model');
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
  if ((await idbPut('model', file)) === null) {
    alert('No hay espacio para guardar el modelo en este dispositivo.');
    return;
  }
  device.modelName = file.name;
  device.front = '+z';
  saveDevice();
  await loadModel();
  render();
}

async function removeCustomModel() {
  await idbDel('model');
  delete device.modelName;
  delete device.front;
  saveDevice();
  await loadModel();
  render();
}

document.getElementById('model-file').addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  ev.target.value = '';
  if (file) saveCustomModel(file);
});

/* ---------- Hojas de detalle y visor a pantalla completa ---------- */

const sheet = document.getElementById('sheet');
const sheetBody = document.getElementById('sheet-body');
let sheetHandler = null;
const objectUrls = [];

function openSheet(html, { full = false, onClick = null } = {}) {
  sheet.classList.toggle('full', full);
  sheetBody.innerHTML = html;
  sheetHandler = onClick;
  if (!sheet.open) sheet.showModal();
  sheetBody.scrollTop = 0;
}

function closeSheet() {
  if (sheet.open) sheet.close();
}

sheet.addEventListener('close', () => {
  objectUrls.splice(0).forEach((u) => URL.revokeObjectURL(u));
  sheetHandler = null;
});

sheet.addEventListener('click', (ev) => {
  if (ev.target === sheet || ev.target.closest('[data-sheet-close]')) {
    closeSheet();
    return;
  }
  if (sheetHandler) sheetHandler(ev);
});

// Carga las fotos y PDF de un papel o multa dentro del visor.
async function fillAttachments(container, files) {
  for (const meta of files) {
    const slot = container.querySelector(`[data-att="${meta.id}"]`);
    if (!slot) continue;
    try {
      const blob = await loadAttachment(meta);
      const url = URL.createObjectURL(blob);
      objectUrls.push(url);
      if (meta.type.startsWith('image/')) {
        slot.innerHTML = `<img src="${url}" alt="${esc(meta.name)}">`;
      } else {
        slot.innerHTML = `
          ${window.innerWidth >= 700 ? `<iframe src="${url}" title="${esc(meta.name)}"></iframe>` : ''}
          <a class="btn primary" href="${url}" target="_blank" rel="noopener">${icon('external')}Abrir PDF «${esc(meta.name)}»</a>`;
      }
    } catch (e) {
      slot.innerHTML = `<div class="sub">No se pudo abrir «${esc(meta.name)}»: ${esc(e.message)}</div>`;
    }
  }
}

function attachmentSlots(files) {
  return files.map((f) => `<div class="att-view" data-att="${f.id}"><div class="sub">Cargando ${esc(f.name)}…</div></div>`).join('');
}

function openDocViewer(id) {
  const d = find(state.docs, id);
  if (!d) return;
  const st = docStatus(d);
  openSheet(`
    <div class="viewer-head">
      <div class="grow"><div class="eyebrow">Papeles</div><h2>${esc(d.name)}</h2></div>
      <button class="btn icon-only" data-sheet-close aria-label="Cerrar">${icon('close')}</button>
    </div>
    ${d.number ? `<div class="doc-number"><span class="sub">Número</span><b>${esc(d.number)}</b></div>` : ''}
    <div class="row" style="margin:12px 0">
      ${badge(st)}<span class="sub">${esc(st.detail)}</span>
    </div>
    ${d.note ? `<p class="sub" style="white-space:pre-wrap">${esc(d.note)}</p>` : ''}
    <div class="att-gallery">${d.files.length ? attachmentSlots(d.files) : '<div class="card glass empty">Todavía no tiene fotos ni PDF. Tocá «Editar» para agregarlos.</div>'}</div>
    <div class="actions sticky-actions">
      <button class="btn primary" data-v="edit">${icon('edit')}Editar</button>
      ${calButton(deadlineFor(`doc:${d.id}`), false)}
    </div>`, {
    full: true,
    onClick: (ev) => {
      if (ev.target.closest('[data-v="edit"]')) {
        closeSheet();
        docForm(d.id);
      }
    },
  });
  fillAttachments(sheetBody, d.files);
}

function openFineViewer(id) {
  const f = find(state.fines, id);
  if (!f) return;
  const st = fineStatus(f);
  openSheet(`
    <div class="viewer-head">
      <div class="grow"><div class="eyebrow">Multa · ${esc(FINE_STATUS[f.status])}</div><h2>${esc(f.reason || 'Multa')}</h2></div>
      <button class="btn icon-only" data-sheet-close aria-label="Cerrar">${icon('close')}</button>
    </div>
    <div class="settings glass">
      <div class="set-row"><span class="grow">Fecha</span><span class="val">${fmtDate(f.date)}</span></div>
      <div class="set-row"><span class="grow">Lugar</span><span class="val">${esc(f.place || '—')}</span></div>
      <div class="set-row"><span class="grow">Monto</span><span class="val">${f.amount ? money.format(f.amount) : '—'}</span></div>
      <div class="set-row"><span class="grow">Vence el pago</span><span class="val">${fmtDate(f.dueDate)}</span></div>
      <div class="set-row"><span class="grow">Estado</span>${badge(st)}</div>
    </div>
    ${f.note ? `<p class="sub" style="white-space:pre-wrap">${esc(f.note)}</p>` : ''}
    <div class="att-gallery">${attachmentSlots(f.files)}</div>
    <div class="actions sticky-actions">
      <button class="btn primary" data-v="edit">${icon('edit')}Editar</button>
      ${f.status === 'pendiente' ? `<button class="btn" data-v="paid">${icon('check')}Marcar pagada</button>` : ''}
      ${calButton(deadlineFor(`fine:${f.id}`), false)}
    </div>`, {
    full: true,
    onClick: async (ev) => {
      if (ev.target.closest('[data-v="edit"]')) {
        closeSheet();
        fineForm(f.id);
      } else if (ev.target.closest('[data-v="paid"]')) {
        const cur = find(state.fines, f.id);
        if (!cur) return;
        cur.status = 'pagada';
        save();
        await ensureFineExpense(cur.id);
        save();
        closeSheet();
        render();
      }
    },
  });
  fillAttachments(sheetBody, f.files);
}

function openTaskSheet(id) {
  const t = find(state.tasks, id);
  if (!t) return;
  const st = taskStatus(t);
  const history = [...t.history].sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.km ?? 0) - (a.km ?? 0));
  openSheet(`
    <div class="viewer-head">
      <div class="grow"><div class="eyebrow">Service</div><h2>${esc(t.name)}</h2></div>
      <button class="btn icon-only" data-sheet-close aria-label="Cerrar">${icon('close')}</button>
    </div>
    <div class="row" style="margin-bottom:6px">${badge(st)}<span class="sub">${esc(intervalTextOf(t))}</span></div>
    <div class="progress ${st.level}"><i style="width:${Math.round(st.progress * 100)}%"></i></div>
    <div class="sub" style="margin-top:10px">${esc(st.detail)}</div>
    <div class="actions">
      <button class="btn small primary" data-v="done">${icon('check')}Lo hice</button>
      <button class="btn small" data-v="edit">${icon('edit')}Editar tarea</button>
      ${calButton(deadlineFor(`task:${t.id}`))}
    </div>
    <div class="section-title">Historial</div>
    ${history.length ? `<div class="card glass" style="padding:4px 16px">${history.map((h) => `
      <div class="list-item">
        <div class="icon-bubble">${icon('history')}</div>
        <div class="grow">
          <div class="name">${fmtDate(h.date)}${h.km != null ? ` · ${fmtKm(h.km)}` : ''}</div>
          <div class="sub">${esc([h.shop, h.cost ? money.format(h.cost) : '', h.note].filter(Boolean).join(' · ') || 'Sin detalles')}</div>
        </div>
        <button class="btn icon-only ghost" data-v="del-h" data-h="${h.id}" aria-label="Borrar registro">${icon('trash')}</button>
      </div>`).join('')}</div>` : '<div class="card glass empty">Todavía no hay registros. Tocá «Lo hice» la próxima vez que lo hagas.</div>'}
  `, {
    onClick: (ev) => {
      const b = ev.target.closest('[data-v]');
      if (!b) return;
      if (b.dataset.v === 'done') {
        closeSheet();
        doneTaskForm(t.id);
      } else if (b.dataset.v === 'edit') {
        closeSheet();
        taskForm(t.id);
      } else if (b.dataset.v === 'del-h') {
        const cur = find(state.tasks, t.id);
        const h = cur && cur.history.find((x) => x.id === b.dataset.h);
        if (!h || !confirm('¿Borrar este registro del historial?')) return;
        cur.history = cur.history.filter((x) => x !== h);
        if (h.expenseId && find(state.expenses, h.expenseId) && confirm('¿Borrar también el gasto que se cargó con este service?')) {
          state.expenses = state.expenses.filter((e) => e.id !== h.expenseId);
        }
        recomputeLast(cur);
        save();
        render();
        openTaskSheet(t.id);
      }
    },
  });
}

/* ---------- Formularios ---------- */

const modal = document.getElementById('modal');
const modalForm = document.getElementById('modal-form');
const modalFields = document.getElementById('modal-fields');
const modalDelete = document.getElementById('modal-delete');
const modalSave = modalForm.querySelector('button[type=submit]');
let modalHandlers = null;
let formFiles = null; // adjuntos del formulario abierto

function openForm({ title, fields, onSubmit, onDelete, onOpen }) {
  document.getElementById('modal-title').textContent = title;
  formFiles = null;
  modalFields.innerHTML = fields.map(fieldHtml).join('');
  modalDelete.hidden = !onDelete;
  modalSave.disabled = false;
  modalSave.textContent = 'Guardar';
  modalHandlers = { onSubmit, onDelete };
  const filesField = fields.find((f) => f.type === 'files');
  if (filesField) initFilesField(filesField.value || []);
  modal.showModal();
  if (onOpen) onOpen(modalForm);
}

function fieldHtml(f) {
  if (f.type === 'files') {
    return `
      <div class="field files-field">
        <span>${esc(f.label)}</span>
        <div class="att-list"></div>
        <div class="actions" style="margin-top:8px">
          <label class="btn small">${icon('camera')}Sacar foto<input type="file" accept="image/*" capture="environment" hidden data-add-files></label>
          <label class="btn small">${icon('clip')}Adjuntar foto o PDF<input type="file" accept="image/*,application/pdf" multiple hidden data-add-files></label>
        </div>
        <small class="att-msg"></small>
      </div>`;
  }
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
  } else if (f.type === 'hidden') {
    return `<input type="hidden" ${attrs} value="${esc(f.value ?? '')}">`;
  } else {
    control = `<input type="${f.type || 'text'}" value="${esc(f.value ?? '')}" ${attrs}>`;
  }
  return `<label class="field"><span>${esc(f.label)}</span>${control}${f.hint != null ? `<small data-hint="${f.name}">${esc(f.hint)}</small>` : ''}</label>`;
}

function initFilesField(existing) {
  formFiles = { existing: [...existing], removed: [], added: [] };
  renderFormFiles();
}

async function renderFormFiles() {
  const list = modalFields.querySelector('.att-list');
  if (!list || !formFiles) return;
  const items = [
    ...formFiles.existing.map((m) => ({ meta: m, blob: null, isNew: false })),
    ...formFiles.added.map((a) => ({ ...a, isNew: true })),
  ];
  list.innerHTML = items.length ? items.map(({ meta }) => `
    <div class="att-thumb" data-thumb="${meta.id}">
      <div class="att-prev">${meta.type.startsWith('image/') ? '' : icon('doc')}</div>
      <div class="att-name">${esc(meta.name)}<br><span class="sub">${Math.round(meta.size / 1024)} KB</span></div>
      <button type="button" class="btn icon-only ghost" data-remove-att="${meta.id}" aria-label="Quitar">${icon('close')}</button>
    </div>`).join('') : '<div class="sub">Sin archivos todavía.</div>';
  for (const { meta, blob } of items) {
    if (!meta.type.startsWith('image/')) continue;
    try {
      const b = blob || await loadAttachment(meta);
      const url = URL.createObjectURL(b);
      objectUrls.push(url);
      const prev = list.querySelector(`[data-thumb="${meta.id}"] .att-prev`);
      if (prev) prev.style.backgroundImage = `url("${url}")`;
    } catch (e) {
      // sin vista previa
    }
  }
}

modalFields.addEventListener('change', async (ev) => {
  if (!ev.target.matches('[data-add-files]')) return;
  const files = [...ev.target.files];
  ev.target.value = '';
  const msg = modalFields.querySelector('.att-msg');
  msg.textContent = 'Procesando…';
  const errors = [];
  for (const file of files) {
    try {
      formFiles.added.push(await prepareAttachment(file));
    } catch (e) {
      errors.push(e.message);
    }
  }
  msg.textContent = errors.join(' ');
  msg.classList.toggle('error', errors.length > 0);
  if (errors.length) alert(errors.join('\n\n'));
  renderFormFiles();
});

modalFields.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-remove-att]');
  if (!b) return;
  const id = b.dataset.removeAtt;
  const ex = formFiles.existing.find((m) => m.id === id);
  if (ex) {
    formFiles.existing = formFiles.existing.filter((m) => m !== ex);
    formFiles.removed.push(ex);
  } else {
    formFiles.added = formFiles.added.filter((a) => a.meta.id !== id);
  }
  renderFormFiles();
});

// Guarda los adjuntos nuevos, borra los quitados y devuelve la lista final.
async function commitFormFiles() {
  if (!formFiles) return [];
  for (const { meta, blob } of formFiles.added) await storeAttachment(meta, blob);
  formFiles.removed.forEach(removeAttachment);
  return [...formFiles.existing, ...formFiles.added.map((a) => a.meta)];
}

modalForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const values = Object.fromEntries(new FormData(modalForm).entries());
  modalSave.disabled = true;
  modalSave.textContent = 'Guardando…';
  try {
    if ((await modalHandlers.onSubmit(values)) === false) return;
    modal.close();
    save();
    render();
  } finally {
    modalSave.disabled = false;
    modalSave.textContent = 'Guardar';
  }
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

// Los formularios trabajan por id: si mientras tanto llegó una novedad de la nube, se edita la versión nueva.
function taskForm(id) {
  const t = id ? find(state.tasks, id) : null;
  openForm({
    title: t ? 'Editar tarea' : 'Nueva tarea',
    fields: [
      { name: 'name', label: 'Nombre', required: true, value: t?.name, placeholder: 'Ej.: Cambio de bujías' },
      { name: 'everyKm', label: 'Cada cuántos km', type: 'number', min: 0, step: 100, value: t?.everyKm || '', hint: 'Dejá vacío si sólo depende del tiempo.' },
      { name: 'everyMonths', label: 'Cada cuántos meses', type: 'number', min: 0, step: 1, value: t?.everyMonths || '', hint: 'Dejá vacío si sólo depende de los km.' },
      ...(t ? [] : [
        kmField('', 'Km del último service (si lo sabés)'),
        { name: 'lastDate', label: 'Fecha del último service (si la sabés)', type: 'date', value: '' },
      ]),
    ],
    onSubmit: (v) => {
      const data = { name: v.name.trim(), everyKm: numOrNull(v.everyKm) || 0, everyMonths: numOrNull(v.everyMonths) || 0 };
      if (!data.everyKm && !data.everyMonths) {
        alert('Indicá cada cuántos km o cada cuántos meses.');
        return false;
      }
      const cur = t && find(state.tasks, t.id);
      if (cur) {
        Object.assign(cur, data);
        return;
      }
      const task = { id: uid(), ...data, lastKm: null, lastDate: null, history: [] };
      const km = numOrNull(v.km);
      if (km != null || v.lastDate) {
        task.history.push({ id: uid(), date: v.lastDate || null, km, shop: '', cost: null, note: '', expenseId: null });
        recomputeLast(task);
        bumpKm(km);
      }
      state.tasks.push(task);
    },
    onDelete: t ? () => { state.tasks = state.tasks.filter((x) => x.id !== t.id); } : null,
  });
}

function doneTaskForm(id) {
  const t = find(state.tasks, id);
  if (!t) return;
  openForm({
    title: `Hecho: ${t.name}`,
    fields: [
      { name: 'date', label: 'Fecha', type: 'date', required: true, value: today() },
      kmField(state.vehicle.km || ''),
      { name: 'shop', label: 'Taller', placeholder: 'Ej.: Lubricentro San Martín' },
      { name: 'cost', label: '¿Cuánto salió? ($)', type: 'number', min: 0, step: 'any', hint: 'Se carga solo en Gastos, con la cotización del dólar del día.' },
      { name: 'note', label: 'Notas', placeholder: 'Marca del aceite, repuestos…' },
    ],
    onSubmit: async (v) => {
      const km = numOrNull(v.km);
      const cost = numOrNull(v.cost);
      const rate = cost ? await rateFor(v.date) : null;
      // Se busca después de esperar la cotización, por si mientras tanto llegó una novedad de la nube.
      const cur = find(state.tasks, id);
      if (!cur) return;
      const entry = { id: uid(), date: v.date, km, shop: v.shop.trim(), cost, note: v.note.trim(), expenseId: null };
      if (cost) {
        const expense = { id: uid(), date: v.date, cat: 'mantenimiento', amount: cost, km, liters: null, note: [cur.name, entry.shop].filter(Boolean).join(' — '), ...rate };
        state.expenses.push(expense);
        entry.expenseId = expense.id;
      }
      cur.history.push(entry);
      recomputeLast(cur);
      bumpKm(km);
    },
  });
}

// Formulario de gasto con la cotización del dólar blue del día (o aproximada si no hay internet).
function expenseForm(id, presetCat) {
  const e = id ? find(state.expenses, id) : null;
  const cat = e?.cat || presetCat || 'combustible';
  const rateHint = e
    ? (e.usdRate ? (e.rateApprox ? 'Cotización aproximada. Si sabés la de ese día, corregila.' : 'Cotización del día del gasto.') : 'Este gasto no tiene cotización: cargala a mano para verlo en dólares.')
    : 'Buscando la cotización de hoy…';
  openForm({
    title: e ? 'Editar gasto' : presetCat === 'combustible' ? 'Carga de combustible' : 'Nuevo gasto',
    fields: [
      { name: 'cat', label: 'Categoría', type: 'select', options: categoryOptions(), value: cat },
      { name: 'date', label: 'Fecha', type: 'date', required: true, value: e?.date || today() },
      { name: 'amount', label: 'Monto ($)', type: 'number', min: 0, step: 'any', required: true, value: e?.amount },
      kmField(e?.km ?? ''),
      { name: 'liters', label: 'Litros (sólo combustible)', type: 'number', min: 0, step: 'any', value: e?.liters ?? '', hint: 'Para calcular el consumo, llená el tanque y anotá el km en cada carga.' },
      { name: 'usdRate', label: 'Dólar blue (venta) ese día', type: 'number', min: 0, step: 'any', value: e?.usdRate ?? '', hint: rateHint },
      { name: 'rateApprox', type: 'hidden', value: e?.rateApprox ? '1' : '' },
      { name: 'note', label: 'Nota (opcional)', value: e?.note || '' },
    ],
    onOpen: (form) => {
      const rate = form.elements.usdRate;
      const approx = form.elements.rateApprox;
      const hint = form.querySelector('[data-hint="usdRate"]');
      let auto = !e;
      rate.addEventListener('input', () => {
        auto = false;
        approx.value = '';
        hint.textContent = 'Cotización cargada a mano.';
      });
      form.elements.date.addEventListener('change', () => {
        if (auto && rate.value) {
          approx.value = form.elements.date.value === today() ? '' : '1';
          hint.textContent = approx.value ? 'Es la cotización de hoy: para otra fecha queda como aproximada. Podés corregirla.' : 'Cotización de hoy.';
        }
      });
      if (e) return;
      rateFor(form.elements.date.value).then((r) => {
        if (!auto || !modal.open) return;
        if (r.usdRate) {
          rate.value = r.usdRate;
          approx.value = r.rateApprox ? '1' : '';
          const last = lastRate();
          hint.textContent = r.rateApprox
            ? `Sin internet: se usa la última cotización guardada${last ? ` (${fmtDate(last.date)})` : ''}, marcada como aproximada.`
            : 'Cotización de hoy (dolarapi.com).';
        } else {
          hint.textContent = 'Sin internet y sin cotización guardada: cargala a mano o dejala vacía.';
        }
      });
    },
    onSubmit: (v) => {
      const data = {
        cat: v.cat,
        date: v.date,
        amount: numOrNull(v.amount) || 0,
        km: numOrNull(v.km),
        liters: v.cat === 'combustible' ? numOrNull(v.liters) : null,
        usdRate: numOrNull(v.usdRate),
        rateApprox: !!v.rateApprox && numOrNull(v.usdRate) != null,
        note: v.note.trim(),
      };
      bumpKm(data.km);
      const cur = e && find(state.expenses, e.id);
      if (cur) Object.assign(cur, data);
      else state.expenses.push({ id: uid(), ...data });
      expenseMonth = data.date.slice(0, 7);
    },
    onDelete: e ? () => { state.expenses = state.expenses.filter((x) => x.id !== e.id); } : null,
  });
}

function docForm(id) {
  const d = id ? find(state.docs, id) : null;
  openForm({
    title: d ? `Editar: ${d.name}` : 'Nuevo papel',
    fields: [
      { name: 'name', label: 'Nombre', required: true, value: d?.name, placeholder: 'Ej.: Patente 2º cuota' },
      { name: 'number', label: 'Número', value: d?.number || '', placeholder: 'Nº de póliza, de licencia, de cédula…' },
      { name: 'expiry', label: 'Vence el (opcional)', type: 'date', value: d?.expiry || '', hint: 'La cédula, por ejemplo, puede no tener vencimiento.' },
      { name: 'notifyDays', label: 'Avisarme con cuántos días de anticipación', type: 'number', min: 0, step: 1, value: d?.notifyDays ?? SOON_DAYS },
      { name: 'note', label: 'Notas', type: 'textarea', value: d?.note || '', placeholder: 'Compañía, teléfono de auxilio, categoría…' },
      { name: 'files', label: 'Fotos o PDF', type: 'files', value: d?.files || [] },
    ],
    onSubmit: async (v) => {
      const files = await commitFormFiles();
      const data = { name: v.name.trim(), number: v.number.trim(), expiry: v.expiry, notifyDays: numOrNull(v.notifyDays) ?? SOON_DAYS, note: v.note.trim(), files };
      const cur = d && find(state.docs, d.id);
      if (cur) Object.assign(cur, data);
      else state.docs.push({ id: uid(), ...data });
    },
    onDelete: d ? () => {
      removeItemAttachments(d);
      state.docs = state.docs.filter((x) => x.id !== d.id);
    } : null,
  });
}

// Cuando una multa se marca pagada, se carga sola en Gastos (una sola vez).
async function ensureFineExpense(fineId) {
  const needs = (f) => f && f.status === 'pagada' && f.amount && !(f.expenseId && find(state.expenses, f.expenseId));
  if (!needs(find(state.fines, fineId))) return;
  const date = today();
  const rate = await rateFor(date);
  const f = find(state.fines, fineId); // la versión actual, después de esperar la cotización
  if (!needs(f)) return;
  const expense = { id: uid(), date, cat: 'multa', amount: Number(f.amount), km: null, liters: null, note: fineTitle(f), ...rate };
  state.expenses.push(expense);
  f.expenseId = expense.id;
}

function fineForm(id) {
  const f = id ? find(state.fines, id) : null;
  openForm({
    title: f ? 'Editar multa' : 'Nueva multa',
    fields: [
      { name: 'date', label: 'Fecha de la multa', type: 'date', required: true, value: f?.date || today() },
      { name: 'reason', label: 'Motivo', value: f?.reason || '', placeholder: 'Ej.: Exceso de velocidad' },
      { name: 'place', label: 'Lugar', value: f?.place || '', placeholder: 'Ej.: Av. General Paz km 12' },
      { name: 'amount', label: 'Monto ($)', type: 'number', min: 0, step: 'any', value: f?.amount ?? '' },
      { name: 'dueDate', label: 'Vencimiento del pago', type: 'date', value: f?.dueDate || '' },
      { name: 'status', label: 'Estado', type: 'select', options: FINE_STATUS, value: f?.status || 'pendiente', hint: 'Al marcarla «Pagada» se carga sola en Gastos.' },
      { name: 'note', label: 'Notas', type: 'textarea', value: f?.note || '', placeholder: 'Nº de acta, juzgado, descargo presentado…' },
      { name: 'files', label: 'Foto del acta (opcional)', type: 'files', value: f?.files || [] },
    ],
    onSubmit: async (v) => {
      const files = await commitFormFiles();
      const data = { date: v.date, reason: v.reason.trim(), place: v.place.trim(), amount: numOrNull(v.amount), dueDate: v.dueDate, status: v.status, note: v.note.trim(), files };
      let cur = f && find(state.fines, f.id);
      if (cur) Object.assign(cur, data);
      else {
        cur = { id: uid(), expenseId: null, ...data };
        state.fines.push(cur);
      }
      save();
      await ensureFineExpense(cur.id);
    },
    onDelete: f ? () => {
      removeItemAttachments(f);
      state.fines = state.fines.filter((x) => x.id !== f.id);
    } : null,
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
      const cur = state.vehicle;
      cur.name = f.name.trim() || 'Mi auto';
      cur.plate = f.plate.trim().toUpperCase();
      cur.km = numOrNull(f.km) ?? cur.km;
      cur.notes = f.notes.trim();
    },
  });
}

/* ---------- Copia de seguridad y calendario ---------- */

function download(name, content, type) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function exportData() {
  download(`mi-auto-${today()}.json`, JSON.stringify(state, null, 2), 'application/json');
}

function downloadIcs() {
  const list = deadlines();
  if (!list.length) {
    alert('Todavía no hay vencimientos con fecha para agregar al calendario.');
    return;
  }
  download('mi-auto-vencimientos.ics', buildIcs(list), 'text/calendar');
}

document.getElementById('import-file').addEventListener('change', async (ev) => {
  const file = ev.target.files[0];
  ev.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data || typeof data !== 'object' || !data.vehicle) throw new Error('formato');
    const who = mode === 'cloud' ? ' (también para la otra cuenta del garage)' : '';
    if (!confirm(`Esto reemplaza todos los datos actuales por los del archivo${who}. ¿Continuar?`)) return;
    state = normalize(data);
    ensureDefaultDocs();
    save();
    render();
  } catch (e) {
    alert('El archivo no es una copia válida de Mi Auto.');
  }
});

/* ---------- Notificaciones ---------- */

async function askNotifications() {
  if (!notificationsSupported()) {
    alert('Este navegador no permite notificaciones. En iPhone, primero agregá la app a la pantalla de inicio.');
    return;
  }
  const result = await Notification.requestPermission();
  if (result === 'granted') {
    await enablePeriodicSync();
    await checkNotifications();
  }
  render();
}

let notifTimer = null;
onSaved = () => {
  clearTimeout(notifTimer);
  notifTimer = setTimeout(checkNotifications, 800);
};

/* ---------- Eventos ---------- */

const find = (list, id) => list.find((x) => x.id === id);

const actions = {
  'update-km': () => updateKmForm(),
  'add-task': () => taskForm(null),
  'open-task': (el) => openTaskSheet(el.dataset.id),
  'done-task': (el) => doneTaskForm(el.dataset.id),
  'add-expense': (el) => expenseForm(null, el.dataset.cat),
  'edit-expense': (el) => expenseForm(el.dataset.id),
  'add-doc': () => docForm(null),
  'open-doc': (el) => openDocViewer(el.dataset.id),
  'add-fine': () => fineForm(null),
  'open-fine': (el) => openFineViewer(el.dataset.id),
  'edit-car': () => carForm(),
  'enable-notif': () => askNotifications(),
  'download-ics': () => downloadIcs(),
  'sign-out': async () => {
    if (!confirm('¿Cerrar sesión en este dispositivo? Los datos quedan guardados en la nube.')) return;
    await MiAutoCloud.signOut();
  },
  'load-model': () => document.getElementById('model-file').click(),
  'remove-model': () => {
    if (confirm('¿Quitar este modelo 3D y volver al auto incluido en la app?')) removeCustomModel();
  },
  export: () => exportData(),
  import: () => document.getElementById('import-file').click(),
  reset: () => {
    const who = mode === 'cloud' ? '\n\nOjo: el garage es compartido, así que se borra también para la otra cuenta.' : '';
    if (!confirm(`¿Borrar TODOS los datos del auto? No se puede deshacer.${who}`)) return;
    for (const c of ['docs', 'fines']) state[c].forEach(removeItemAttachments);
    state = defaultState();
    save();
    render();
  },
};

view.addEventListener('click', (ev) => {
  // Los links (Google Calendar) se abren solos y no abren la tarjeta que los contiene.
  if (ev.target.closest('a[href]')) return;
  const el = ev.target.closest('[data-action], [data-go], [data-month], [data-color], [data-seg], [data-select-month]');
  if (!el) return;
  if (el.dataset.action && actions[el.dataset.action]) {
    ev.stopPropagation();
    actions[el.dataset.action](el);
  } else if (el.dataset.go) goTo(el.dataset.go);
  else if (el.dataset.color) setColor(el.dataset.color);
  else if (el.dataset.seg === 'expseg') {
    expenseSegment = el.dataset.value;
    renderExpenses();
  } else if (el.dataset.seg === 'currency') {
    device.currency = el.dataset.value;
    saveDevice();
    renderExpenses();
  } else if (el.dataset.selectMonth) {
    expenseMonth = el.dataset.selectMonth;
    renderExpenses();
  } else if (el.dataset.month) {
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
  if (currentTab !== 'home') goTo('home');
  document.getElementById('attention')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('alert-banner').addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-banner]');
  if (!b) return;
  if (b.dataset.banner === 'ver') {
    if (currentTab !== 'home') goTo('home');
    document.getElementById('attention')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (b.dataset.banner === 'notif') {
    askNotifications();
  } else {
    try {
      sessionStorage.setItem('mi-auto-aviso-cerrado', String(alerts().length));
    } catch (e) {
      // no se puede recordar: se oculta igual hasta el próximo cambio
    }
    document.getElementById('alert-banner').hidden = true;
  }
});

window.addEventListener('online', scheduleRender);
window.addEventListener('offline', scheduleRender);
initChartTips(view);

/* ---------- Inicio y login ---------- */

const authScreen = document.getElementById('auth-screen');
let started = false;
let stopSync = null;

function showAuth(stateName, detail = '') {
  const msg = {
    loading: ['Conectando…', ''],
    login: ['Entrá con tu cuenta de Google', 'Los datos del auto se guardan en la nube y se comparten entre las cuentas autorizadas.'],
    sync: ['Trayendo tus datos…', 'La primera vez puede tardar unos segundos.'],
    denied: ['Esta cuenta no tiene acceso', `${detail} no está autorizada para ver este garage. Entrá con otra cuenta.`],
    error: ['No se pudo conectar', detail],
  }[stateName];
  authScreen.querySelector('[data-auth-title]').textContent = msg[0];
  authScreen.querySelector('[data-auth-text]').textContent = msg[1];
  authScreen.querySelector('[data-auth-login]').hidden = !['login', 'denied'].includes(stateName);
  authScreen.querySelector('[data-auth-retry]').hidden = stateName !== 'error';
  authScreen.querySelector('.auth-spinner').hidden = !['loading', 'sync'].includes(stateName);
  authScreen.hidden = false;
}

function hideAuth() {
  authScreen.hidden = true;
}

authScreen.addEventListener('click', async (ev) => {
  if (ev.target.closest('[data-auth-login]')) {
    try {
      await MiAutoCloud.signIn();
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
        showAuth('error', `No se pudo entrar con Google (${e.code || e.message}).`);
      }
    }
  } else if (ev.target.closest('[data-auth-retry]')) {
    location.reload();
  }
});

function start() {
  if (started) {
    render();
    return;
  }
  started = true;
  applyColor();
  loadModel();
  render();
  checkNotifications();
  if (notificationsSupported() && Notification.permission === 'granted') enablePeriodicSync();
}

function startLocal() {
  mode = 'local';
  state = loadLocal();
  if (ensureDefaultDocs()) save();
  hideAuth();
  start();
}

function hasData() {
  return COLLECTIONS.some((c) => state[c].length);
}

async function startCloud() {
  showAuth('loading');
  try {
    await MiAutoCloud.init();
  } catch (e) {
    showAuth('error', 'No se pudo cargar Firebase. Revisá la conexión a internet y probá de nuevo (la primera vez hace falta internet).');
    return;
  }
  MiAutoCloud.onAuth(async (user) => {
    if (stopSync) {
      stopSync();
      stopSync = null;
    }
    if (!user) {
      currentUser = null;
      started = false;
      closeSheet();
      if (modal.open) modal.close();
      showAuth('login');
      return;
    }
    if (!MiAutoCloud.isAllowed(user.email)) {
      await MiAutoCloud.signOut();
      showAuth('denied', user.email);
      return;
    }
    currentUser = user;
    mode = 'cloud';
    state = { vehicle: defaultVehicle(), tasks: [], expenses: [], docs: [], fines: [] };
    showAuth('sync');
    stopSync = startCloudSync({
      onChange: ({ cacheReady }) => {
        // Con la caché offline los datos aparecen al instante, aunque no haya señal.
        if (cacheReady && hasData()) {
          hideAuth();
          if (started) scheduleRender();
          else start();
        }
      },
      onServerReady: async (info) => {
        holdRemote = true;
        try {
          const changed = await migrateLocalToCloud(info);
          const added = ensureDefaultDocs();
          if (changed || added) save();
          else syncToCloud(); // sube lo que normalize() haya completado
        } finally {
          holdRemote = false;
        }
        hideAuth();
        if (started) scheduleRender();
        else start();
      },
      onError: (e) => {
        const denied = e.code === 'permission-denied';
        showAuth('error', denied
          ? 'Firestore no dejó leer los datos. Revisá que hayas publicado las reglas de firestore.rules y que tu mail esté en la lista.'
          : `Error de Firestore: ${e.message}`);
      },
    });
  });
}

hydrateIcons();
createHotspots();
if (MiAutoCloud.configured) startCloud();
else startLocal();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
