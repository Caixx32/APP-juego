# Minijuegos para Dos 💞

App web de minijuegos para jugar dos personas en el **mismo móvil o tablet**.
Sin instalaciones ni dependencias: HTML, CSS y JavaScript puros.

## Juegos

| Juego | Cómo se juega |
|---|---|
| ❌ Tres en raya | Por turnos, tres en línea |
| 🔴 Conecta 4 | Por turnos, cuatro en línea |
| ⚡ Reflejos | Pantalla dividida: toca primero cuando se ponga verde |
| 🧠 Memoria | Por turnos, encuentra más parejas |
| ✊ Piedra, papel, tijera | Elección secreta pasando el móvil, al mejor de 5 |
| 👆 Guerra de toques | Pantalla dividida: toca más rápido que el otro |

- Nombres editables y marcador global que se guarda en el dispositivo.
- Quién empieza se alterna en cada partida.
- Se puede instalar como app ("Añadir a pantalla de inicio") y funciona sin conexión.

## Probarla

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

Para tenerla en el móvil, la forma más sencilla es activar **GitHub Pages**
(Settings → Pages → rama `main`, carpeta `/`) y abrir la URL en el móvil.

## Añadir un juego

Crea `js/games/mijuego.js` con `App.register({ id, name, emoji, desc, help, start(area, api), stop() })`,
añade el `<script>` en `index.html` y la ruta en `sw.js`. Dentro de `start`, llama a
`api.finish(1 | 2 | 0)` al terminar (0 = empate).
