# Mi Auto

App web para el celular que ayuda a controlar las cosas del auto:

- **Service**: tareas de mantenimiento (aceite, filtros, correa, frenos…) que avisan por kilómetros, por tiempo o por lo que llegue primero.
- **Gastos**: combustible, seguro, patente, reparaciones, etc. Muestra totales por mes y por categoría, y calcula el consumo (km/l).
- **Papeles**: VTV, seguro, licencia y cualquier otro vencimiento, con aviso anticipado.
- **Diseño**: estilo oscuro tipo app de auto premium. El color se elige en **Auto → Color** y pinta toda la app (y el auto genérico).
- **Inicio**: tu auto en 3D (gira solo, se rota 360° con el dedo y se hace zoom), con puntos sobre el motor, las ruedas,
  los frenos y el habitáculo que se ponen amarillos o rojos según los avisos. Debajo, kilometraje, resumen de gastos y la
  lista de lo que está vencido o por vencer.

## Poner tu propio auto en 3D

Hasta que cargues el tuyo se muestra un auto genérico (`models/auto.glb`, generado con `tools/make_car.py`).

1. Conseguí un modelo **.glb** de tu auto. En [Sketchfab](https://sketchfab.com) buscá marca y modelo, filtrá por
   *Downloadable* y descargalo en formato **glTF Binary (.glb)**. Mejor si pesa menos de 20 MB.
2. En la app, pestaña **Auto → Modelo 3D → Cargar modelo .glb**. Queda guardado en el celular.
3. Si los puntos no quedan donde corresponde (el de «Motor» tiene que ir sobre el capó), cambiá la rotación en esa misma
   tarjeta.

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
| `vendor/model-viewer.min.js` | Visor 3D [model-viewer](https://modelviewer.dev) 4.0.0 de Google (licencia Apache 2.0) |
| `models/auto.glb`, `tools/make_car.py` | Auto genérico y el script que lo genera |
