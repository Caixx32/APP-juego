// Núcleo de la app: registro de juegos, marcador, navegación y modal.
const App = (() => {
  const STORAGE_KEY = 'minijuegos-dos';
  const games = [];
  let current = null;
  let state = load();

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.names && saved.scores) return saved;
    } catch (e) { /* almacenamiento no disponible */ }
    return { names: ['Jugador 1', 'Jugador 2'], scores: [0, 0] };
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignorar */ }
  }

  const $ = (id) => document.getElementById(id);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function register(game) { games.push(game); }

  function renderScores() {
    $('score1').textContent = state.scores[0];
    $('score2').textContent = state.scores[1];
  }

  function renderHome() {
    const grid = $('gameGrid');
    grid.innerHTML = '';
    games.forEach((g) => {
      const tile = el('button', 'game-tile');
      tile.append(el('span', 'emoji', g.emoji), el('span', 'name', g.name), el('span', 'desc', g.desc));
      tile.addEventListener('click', () => openGame(g));
      grid.append(tile);
    });
  }

  function show(screenId) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === screenId));
  }

  function resetArea() {
    const area = $('gameArea');
    area.innerHTML = '';
    area.className = '';
    return area;
  }

  function openGame(game) {
    current = game;
    $('gameTitle').textContent = `${game.emoji} ${game.name}`;
    show('game');
    game.start(resetArea(), api);
  }

  function closeGame() {
    if (current && current.stop) current.stop();
    current = null;
    hideModal();
    renderScores();
    show('home');
  }

  function restartGame() {
    if (!current) return;
    if (current.stop) current.stop();
    hideModal();
    current.start(resetArea(), api);
  }

  function showModal(title, body, actions) {
    const content = $('modalContent');
    content.innerHTML = '';
    content.append(el('h3', null, title));
    if (body) {
      String(body).split('\n').forEach((line) => content.append(el('p', null, line)));
    }
    const box = $('modalActions');
    box.innerHTML = '';
    actions.forEach(({ label, onClick, secondary }) => {
      const b = el('button', secondary ? 'btn secondary' : 'btn', label);
      b.addEventListener('click', onClick);
      box.append(b);
    });
    $('modal').classList.remove('hidden');
  }

  function hideModal() { $('modal').classList.add('hidden'); }

  // API que reciben los juegos.
  const api = {
    el,
    name: (p) => state.names[p - 1],
    // Termina la partida. winner: 1, 2 o 0 (empate).
    finish(winner, detail) {
      if (winner === 1 || winner === 2) {
        state.scores[winner - 1] += 1;
        save();
      }
      const title = winner ? `🏆 ¡Gana ${api.name(winner)}!` : '🤝 ¡Empate!';
      const tally = `Marcador: ${state.names[0]} ${state.scores[0]} – ${state.scores[1]} ${state.names[1]}`;
      setTimeout(() => {
        showModal(title, detail ? `${detail}\n${tally}` : tally, [
          { label: 'Otra vez', onClick: restartGame },
          { label: 'Menú', onClick: closeGame, secondary: true },
        ]);
      }, 450);
    },
    // Quién empieza: alterna en cada partida para que sea justo.
    nextStarter(gameId) {
      state.starters = state.starters || {};
      const s = state.starters[gameId] === 1 ? 2 : 1;
      state.starters[gameId] = s;
      save();
      return s;
    },
    message(title, body, onOk) {
      showModal(title, body, [{ label: 'Vale', onClick: () => { hideModal(); if (onOk) onOk(); } }]);
    },
  };

  function bindNames() {
    [1, 2].forEach((p) => {
      const input = $(`name${p}`);
      input.value = state.names[p - 1];
      input.addEventListener('change', () => {
        state.names[p - 1] = input.value.trim() || `Jugador ${p}`;
        input.value = state.names[p - 1];
        save();
      });
    });
  }

  function init() {
    bindNames();
    renderScores();
    renderHome();
    $('backBtn').addEventListener('click', closeGame);
    $('helpBtn').addEventListener('click', () => current && api.message('Cómo se juega', current.help));
    $('resetScores').addEventListener('click', () => {
      showModal('¿Reiniciar marcador?', 'Los puntos de los dos volverán a 0.', [
        { label: 'Sí, reiniciar', onClick: () => { state.scores = [0, 0]; save(); renderScores(); hideModal(); } },
        { label: 'Cancelar', onClick: hideModal, secondary: true },
      ]);
    });
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  return { init, register };
})();
