App.register((() => {
  const EMOJIS = ['🍕', '🌮', '🐶', '🐱', '🌻', '🚀', '🎸', '🍓', '🦄', '🍩', '⚽', '🌙'];
  const PAIRS = 8;
  let timer = null;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return {
    id: 'memory',
    name: 'Memoria',
    emoji: '🧠',
    desc: 'Encuentra las parejas',
    help: 'Por turnos, levanta dos cartas.\nSi son iguales, te las quedas y repites turno. Si no, pasa el turno.\nGana quien consiga más parejas.',
    start(area, api) {
      const deck = shuffle(shuffle(EMOJIS.slice()).slice(0, PAIRS).flatMap((e) => [e, e]));
      const found = { 1: 0, 2: 0 };
      let turn = api.nextStarter(this.id);
      let open = [];
      let locked = false;

      const label = api.el('div', 'turn');
      const scores = api.el('div', 'mem-scores');
      const s1 = api.el('div', 'turn p1');
      const s2 = api.el('div', 'turn p2');
      scores.append(s1, s2);
      const grid = api.el('div', 'mem-board');
      const cards = deck.map((emoji, i) => {
        const c = api.el('button', 'mem-card');
        c.append(api.el('span', 'face', emoji));
        c.addEventListener('click', () => flip(i));
        grid.append(c);
        return c;
      });
      area.append(scores, grid, label);

      function update() {
        label.className = `turn p${turn}`;
        label.textContent = `Turno de ${api.name(turn)}`;
        s1.textContent = `${api.name(1)}: ${found[1]}`;
        s2.textContent = `${api.name(2)}: ${found[2]}`;
      }

      function flip(i) {
        const card = cards[i];
        if (locked || card.classList.contains('open') || card.classList.contains('done')) return;
        card.classList.add('open');
        open.push(i);
        if (open.length < 2) return;

        const [a, b] = open;
        open = [];
        if (deck[a] === deck[b]) {
          [a, b].forEach((k) => { cards[k].classList.remove('open'); cards[k].classList.add('done', `p${turn}`); });
          found[turn]++;
          update();
          if (found[1] + found[2] === PAIRS) {
            const winner = found[1] === found[2] ? 0 : (found[1] > found[2] ? 1 : 2);
            api.finish(winner, `Parejas: ${found[1]} – ${found[2]}`);
          }
        } else {
          locked = true;
          timer = setTimeout(() => {
            [a, b].forEach((k) => cards[k].classList.remove('open'));
            turn = 3 - turn;
            locked = false;
            update();
          }, 900);
        }
      }

      update();
    },
    stop() { clearTimeout(timer); },
  };
})());
