// Reflejos: pantalla dividida, el primero en tocar cuando se pone verde gana la ronda.
App.register((() => {
  const ROUNDS_TO_WIN = 3;
  let timer = null;

  return {
    id: 'reflex',
    name: 'Reflejos',
    emoji: '⚡',
    desc: '¿Quién es más rápido?',
    help: 'Poned el móvil en la mesa, cada uno en un extremo.\nCuando tu mitad se ponga VERDE, ¡toca lo más rápido que puedas!\nSi tocas antes de tiempo, el punto es para el otro.\nGana quien llegue antes a ' + ROUNDS_TO_WIN + ' puntos.',
    start(area, api) {
      area.classList.add('fullbleed');
      const points = { 1: 0, 2: 0 };
      let phase = 'idle'; // idle | waiting | go | done

      const split = api.el('div', 'split');
      const halves = { 2: api.el('button', 'half top p2'), 1: api.el('button', 'half p1') };
      const middle = api.el('div', 'split-middle');
      split.append(halves[2], middle, halves[1]);
      area.append(split);

      function setHalf(p, text, sub) {
        halves[p].textContent = text;
        if (sub) halves[p].append(api.el('small', null, sub));
      }

      function updateMiddle() {
        middle.textContent = `${api.name(1)} ${points[1]} – ${points[2]} ${api.name(2)}`;
      }

      function ready() {
        phase = 'idle';
        [1, 2].forEach((p) => {
          halves[p].className = `half p${p}${p === 2 ? ' top' : ''}`;
          setHalf(p, api.name(p), 'Toca para empezar la ronda');
        });
      }

      function beginRound() {
        phase = 'waiting';
        [1, 2].forEach((p) => setHalf(p, 'Espera…', 'No toques todavía'));
        timer = setTimeout(() => {
          phase = 'go';
          [1, 2].forEach((p) => {
            halves[p].classList.add('go');
            setHalf(p, '¡YA!');
          });
        }, 1500 + Math.random() * 3500);
      }

      function score(winner, reason) {
        clearTimeout(timer);
        phase = 'done';
        points[winner]++;
        updateMiddle();
        const loser = 3 - winner;
        halves[loser].className = `half foul${loser === 2 ? ' top' : ''}`;
        halves[winner].className = `half go${winner === 2 ? ' top' : ''}`;
        setHalf(winner, '¡Punto!', reason === 'foul' ? 'El otro se adelantó' : 'Más rápido');
        setHalf(loser, reason === 'foul' ? '¡Demasiado pronto!' : 'Tarde…');
        if (points[winner] >= ROUNDS_TO_WIN) {
          api.finish(winner, `${points[1]} – ${points[2]}`);
        } else {
          timer = setTimeout(ready, 1400);
        }
      }

      [1, 2].forEach((p) => {
        halves[p].addEventListener('pointerdown', (e) => {
          e.preventDefault();
          if (phase === 'idle') beginRound();
          else if (phase === 'waiting') score(3 - p, 'foul');
          else if (phase === 'go') score(p, 'fast');
        });
      });

      updateMiddle();
      ready();
    },
    stop() { clearTimeout(timer); },
  };
})());
