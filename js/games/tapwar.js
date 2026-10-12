// Guerra de toques: cada toque empuja la frontera hacia el rival.
App.register((() => {
  const GOAL = 20; // ventaja de toques necesaria para ganar
  let timer = null;

  return {
    id: 'tapwar',
    name: 'Guerra de toques',
    emoji: '👆',
    desc: 'Toca sin parar',
    help: 'Poned el móvil en la mesa, cada uno en un extremo.\nTras la cuenta atrás, toca tu mitad lo más rápido que puedas: cada toque empuja la frontera hacia el otro.\nGana quien se coma toda la pantalla.',
    start(area, api) {
      area.classList.add('fullbleed');
      let diff = 0; // positivo = ventaja del jugador 1
      let live = false;

      const wrap = api.el('div', 'tapwar');
      const halves = { 2: api.el('button', 'half top p2'), 1: api.el('button', 'half p1') };
      wrap.append(halves[2], halves[1]);
      area.append(wrap);

      function render() {
        const share = 0.5 + diff / (2 * GOAL); // fracción de pantalla del jugador 1
        halves[1].style.flexGrow = Math.max(share, 0.02);
        halves[2].style.flexGrow = Math.max(1 - share, 0.02);
      }

      function countdown(n) {
        [1, 2].forEach((p) => { halves[p].textContent = n > 0 ? String(n) : '¡YA!'; });
        if (n > 0) {
          timer = setTimeout(() => countdown(n - 1), 700);
        } else {
          live = true;
          timer = setTimeout(() => [1, 2].forEach((p) => { halves[p].textContent = api.name(p); }), 500);
        }
      }

      [1, 2].forEach((p) => {
        halves[p].addEventListener('pointerdown', (e) => {
          e.preventDefault();
          if (!live) return;
          diff += p === 1 ? 1 : -1;
          render();
          if (Math.abs(diff) >= GOAL) {
            live = false;
            api.finish(diff > 0 ? 1 : 2);
          }
        });
      });

      render();
      countdown(3);
    },
    stop() { clearTimeout(timer); },
  };
})());
