App.register((() => {
  const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const MARK = { 1: '✕', 2: '◯' };

  return {
    id: 'tictactoe',
    name: 'Tres en raya',
    emoji: '❌',
    desc: 'El clásico de siempre',
    help: 'Por turnos, toca una casilla para poner tu ficha.\nGana quien consiga tres en línea: horizontal, vertical o diagonal.',
    start(area, api) {
      const board = Array(9).fill(0);
      let turn = api.nextStarter(this.id);
      let over = false;

      const label = api.el('div', 'turn');
      const grid = api.el('div', 'ttt-board');
      const cells = board.map((_, i) => {
        const c = api.el('button', 'ttt-cell');
        c.addEventListener('click', () => play(i));
        grid.append(c);
        return c;
      });
      area.append(label, grid);

      function updateLabel() {
        label.className = `turn p${turn}`;
        label.textContent = `Turno de ${api.name(turn)} ${MARK[turn]}`;
      }

      function play(i) {
        if (over || board[i]) return;
        board[i] = turn;
        cells[i].textContent = MARK[turn];
        cells[i].classList.add(`p${turn}`);
        const line = LINES.find((l) => l.every((k) => board[k] === turn));
        if (line) {
          over = true;
          line.forEach((k) => cells[k].classList.add('win'));
          api.finish(turn);
        } else if (board.every(Boolean)) {
          over = true;
          api.finish(0);
        } else {
          turn = 3 - turn;
          updateLabel();
        }
      }

      updateLabel();
    },
  };
})());
