// Piedra, papel o tijera con elección secreta: se pasa el móvil entre jugadores.
App.register((() => {
  const OPTIONS = [
    { id: 'rock', emoji: '✊', name: 'Piedra', beats: 'scissors' },
    { id: 'paper', emoji: '✋', name: 'Papel', beats: 'rock' },
    { id: 'scissors', emoji: '✌️', name: 'Tijera', beats: 'paper' },
  ];
  const ROUNDS_TO_WIN = 3;

  return {
    id: 'rps',
    name: 'Piedra, papel, tijera',
    emoji: '✊',
    desc: 'Al mejor de 5',
    help: 'Cada uno elige en secreto: el primero elige y pasa el móvil sin mirar.\nPiedra gana a tijera, tijera a papel y papel a piedra.\nGana quien llegue antes a ' + ROUNDS_TO_WIN + ' rondas.',
    start(area, api) {
      const points = { 1: 0, 2: 0 };
      let picks = {};

      function clear() { area.innerHTML = ''; }

      function tally() {
        return api.el('div', 'rps-tally', `${api.name(1)} ${points[1]} – ${points[2]} ${api.name(2)}`);
      }

      function choose(p) {
        clear();
        const label = api.el('div', `turn p${p}`, `${api.name(p)}, elige en secreto`);
        const row = api.el('div', 'rps-choices');
        OPTIONS.forEach((o) => {
          const b = api.el('button', 'rps-choice', o.emoji);
          b.setAttribute('aria-label', o.name);
          b.addEventListener('click', () => {
            picks[p] = o;
            if (p === 1) handOver(); else reveal();
          });
          row.append(b);
        });
        area.append(tally(), label, row);
      }

      function handOver() {
        clear();
        const btn = api.el('button', 'btn', `Soy ${api.name(2)}, ¡listo!`);
        btn.addEventListener('click', () => choose(2));
        area.append(api.el('div', 'turn', `🙈 Pasa el móvil a ${api.name(2)}`), btn);
      }

      function reveal() {
        clear();
        const a = picks[1];
        const b = picks[2];
        let winner = 0;
        if (a.beats === b.id) winner = 1;
        else if (b.beats === a.id) winner = 2;
        if (winner) points[winner]++;

        const show = api.el('div', 'rps-reveal');
        show.append(api.el('span', null, a.emoji), api.el('span', null, b.emoji));
        const text = winner
          ? `${(winner === 1 ? a : b).name} gana — punto para ${api.name(winner)}`
          : 'Empate en esta ronda';
        area.append(show, api.el('div', winner ? `turn p${winner}` : 'turn', text), tally());

        if (points[winner] >= ROUNDS_TO_WIN) {
          api.finish(winner, `${points[1]} – ${points[2]}`);
        } else {
          const next = api.el('button', 'btn', 'Siguiente ronda');
          next.addEventListener('click', () => { picks = {}; choose(1); });
          area.append(next);
        }
      }

      choose(1);
    },
  };
})());
