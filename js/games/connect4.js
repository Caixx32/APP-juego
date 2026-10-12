App.register((() => {
  const COLS = 7;
  const ROWS = 6;
  const DIRS = [[0, 1], [1, 0], [1, 1], [1, -1]];

  return {
    id: 'connect4',
    name: 'Conecta 4',
    emoji: '🔴',
    desc: 'Cuatro en línea',
    help: 'Toca una columna para dejar caer tu ficha.\nGana quien junte cuatro fichas seguidas en horizontal, vertical o diagonal.',
    start(area, api) {
      const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      let turn = api.nextStarter(this.id);
      let over = false;
      let moves = 0;

      const label = api.el('div', 'turn');
      const grid = api.el('div', 'c4-board');
      const cells = [];
      for (let r = 0; r < ROWS; r++) {
        cells.push([]);
        for (let c = 0; c < COLS; c++) {
          const cell = api.el('div', 'c4-cell');
          cell.addEventListener('click', () => drop(c));
          grid.append(cell);
          cells[r].push(cell);
        }
      }
      area.append(label, grid);

      function updateLabel() {
        label.className = `turn p${turn}`;
        label.textContent = `Turno de ${api.name(turn)}`;
      }

      function line(r, c) {
        for (const [dr, dc] of DIRS) {
          const found = [[r, c]];
          for (const sign of [1, -1]) {
            let rr = r + dr * sign;
            let cc = c + dc * sign;
            while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && board[rr][cc] === turn) {
              found.push([rr, cc]);
              rr += dr * sign;
              cc += dc * sign;
            }
          }
          if (found.length >= 4) return found;
        }
        return null;
      }

      function drop(c) {
        if (over) return;
        let r = ROWS - 1;
        while (r >= 0 && board[r][c]) r--;
        if (r < 0) return;
        board[r][c] = turn;
        cells[r][c].classList.add(`p${turn}`);
        moves++;
        const win = line(r, c);
        if (win) {
          over = true;
          win.forEach(([rr, cc]) => cells[rr][cc].classList.add('win'));
          api.finish(turn);
        } else if (moves === ROWS * COLS) {
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
