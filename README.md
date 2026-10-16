# Mi Auto

App web para el celular que ayuda a controlar las cosas del auto:

- **Service**: tareas de mantenimiento (aceite, filtros, correa, frenos…) que avisan por kilómetros, por tiempo o por lo que llegue primero.
- **Gastos**: combustible, seguro, patente, reparaciones, etc. Muestra totales por mes y por categoría, y calcula el consumo (km/l).
- **Papeles**: VTV, seguro, licencia y cualquier otro vencimiento, con aviso anticipado.
- **Inicio**: kilometraje actual, resumen de gastos y una lista de lo que está vencido o por vencer.

No necesita servidor ni cuenta: los datos se guardan en el propio celular. Funciona sin internet una vez abierta y se puede
instalar como una app. Desde la pestaña **Auto** se puede exportar e importar una copia de seguridad (archivo `.json`).

## Usarla en el celular

1. Publicala con GitHub Pages: en el repositorio, **Settings → Pages → Build and deployment**, elegí
   *Deploy from a branch*, la rama y la carpeta `/ (root)`. GitHub te da una dirección `https://…github.io/…`.
2. Abrí esa dirección en el celular.
3. Instalala:
   - **Android (Chrome)**: menú ⋮ → *Agregar a la pantalla principal* / *Instalar app*.
   - **iPhone (Safari)**: botón Compartir → *Agregar a inicio*.

## Probarla en la computadora

```sh
python3 -m http.server 8000
```

y abrí <http://localhost:8000>.

## Archivos

| Archivo | Qué hace |
| --- | --- |
| `index.html` | Estructura de la página |
| `styles.css` | Estilos (modo claro y oscuro automático) |
| `app.js` | Toda la lógica y el guardado de datos |
| `sw.js` | Permite usarla sin internet. Si cambiás algún archivo, subí el número de `CACHE` |
| `manifest.webmanifest`, `icons/` | Nombre e ícono para instalarla |
