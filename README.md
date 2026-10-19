# Mi Auto

App web para el celular (y la compu) para llevar todo lo del auto. Se instala como una app, funciona sin internet y,
con Firebase configurado, guarda todo en la nube y lo comparte entre dos cuentas de Google.

**Dirección:** <https://caixx32.github.io/APP-juego/>

## Qué hace

- **Inicio**: el auto en 3D (gira, se rota con el dedo, puntos de alerta sobre motor, ruedas, frenos y habitáculo),
  kilometraje, consumo, gasto del mes y un **aviso destacado** cuando hay algo vencido o por vencer.
- **Service**: tareas que avisan por km, por tiempo o por lo que llegue primero. Cada tarea guarda su **historial**
  (fecha, km, taller, costo y notas). «Lo hice» agrega una entrada, actualiza el último service y carga el gasto.
- **Gastos**: por categoría (incluye **Multas**), con **gráfico de barras** de los últimos 12 meses y **torta** del mes
  elegido. Cada gasto guarda la **cotización del dólar blue** del día (dolarapi.com, valor «venta»); sin internet usa la
  última guardada y la marca como aproximada. Todo se puede ver en **pesos o en dólares**.
- **Multas**: fecha, lugar, motivo, monto, vencimiento del pago, estado (pendiente / pagada / en descargo) y foto del
  acta. Las pendientes con vencimiento entran en los avisos; al marcarlas pagadas se cargan solas en Gastos.
- **Papeles**: Cédula del auto, Registro (licencia), Seguro y VTV de entrada, y los que quieras agregar. Cada uno con
  número, vencimiento (opcional), días de aviso, notas y fotos o PDF. Tocándolo se abre **a pantalla completa** para
  mostrarlo, por ejemplo, en un control de tránsito.
- **Avisos**: notificaciones del navegador cuando algo pasa a «por vencer» o «vencido» (al abrir la app y, en Chrome de
  Android con la app instalada, también en segundo plano). Botón **Google Calendar** en cada service, papel y multa,
  y un **.ics** con todos los vencimientos juntos (pestaña Auto → Avisos).

## Puesta en marcha

### 1. GitHub Pages

En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama **`main`** y carpeta
**`/ (root)`** → **Save**. A los 1-2 minutos la app queda en la dirección de arriba.

### 2. Firebase (nube compartida)

Sin este paso la app funciona igual, pero guarda todo sólo en el dispositivo.

1. Entrá a <https://console.firebase.google.com>, **Crear un proyecto** (por ejemplo `mi-auto`). Google Analytics no hace falta.
2. **Authentication → Comenzar → Sign-in method → Google → Habilitar** → elegí tu mail de asistencia → Guardar.
3. **Authentication → Configuración → Dominios autorizados → Agregar dominio** → `caixx32.github.io`.
4. **Firestore Database → Crear base de datos** → ubicación `southamerica-east1` (San Pablo) → modo **producción**.
5. **Firestore Database → Reglas** → borrá lo que haya, pegá el contenido de [`firestore.rules`](firestore.rules)
   (con los dos mails correctos) → **Publicar**.
6. **Configuración del proyecto (engranaje) → General → Tus apps → `</>` (Web)** → poné un nombre → **Registrar app**.
   Copiá el objeto `firebaseConfig` que aparece.
7. Editá [`config.js`](config.js): pegá ese objeto en `firebase:` y completá el mail de la segunda cuenta en
   `allowedEmails`. Tiene que ser el mismo que pusiste en las reglas.
8. Subí el número de `CACHE` en `sw.js` (por ejemplo de `mi-auto-v7` a `mi-auto-v8`) para que los celulares bajen la
   versión nueva, y guardá los cambios en `main`.

El plan gratuito (Spark) alcanza: no se usa Firebase Storage. Las fotos se comprimen en el navegador (máx. 1600 px,
JPEG calidad 0,7, menos de 1 MB) y se guardan en Firestore partidas en documentos de hasta ~700 KB. Los PDF admiten
hasta 3 MB.

### 3. Primer ingreso

- Entrá primero desde el celular que **ya tiene datos**: al iniciar sesión se suben solos a la nube (no se borra la
  copia local). Esperá a que en **Auto → Cuenta** diga «Sincronizado» y recién ahí entrá desde el otro celular.
- Instalala: Android (Chrome) → menú ⋮ → «Instalar app»; iPhone (Safari) → Compartir → «Agregar a inicio».
- En la pestaña **Auto → Avisos** activá las notificaciones en cada celular.

## Cómo se guardan los datos

```
garages/principal/meta/vehicle      datos del auto (nombre, patente, km, color)
garages/principal/tasks/{id}        tareas de service con su historial
garages/principal/expenses/{id}     gastos (con cotización del dólar)
garages/principal/docs/{id}         papeles (los adjuntos van como lista de referencias)
garages/principal/fines/{id}        multas
garages/principal/chunks/{id}_{n}   partes de cada foto o PDF, en base64
```

Firestore tiene la caché offline activada: se puede cargar todo sin señal y se sincroniza cuando vuelve.
El modelo 3D cargado a mano, la moneda elegida y el estado de los avisos son de cada dispositivo.

## Probar en la computadora

```sh
python3 -m http.server 8000
```

y abrí <http://localhost:8000>. Para probar la nube sin tocar el proyecto real se pueden usar los emuladores de
Firebase (`firebase emulators:start --only auth,firestore` con Firestore en el puerto 8081) y abrir
<http://localhost:8000/?emu=1>.

## Poner otro modelo 3D

La app trae `models/mi-auto.glb`. Para cambiarlo en todos los dispositivos, reemplazá ese archivo (conviene achicarlo
antes con `python3 tools/optimize_glb.py original.glb models/mi-auto.glb`) y, si la trompa del nuevo modelo no apunta
hacia -X, ajustá `DEFAULT_FRONT` en `app.js`. Para probar uno sólo en un dispositivo: **Auto → Modelo 3D → Cargar .glb**.

## Archivos

| Archivo | Qué hace |
| --- | --- |
| `index.html` | Estructura de la página |
| `styles.css` | Estilos (celular y computadora) |
| `config.js` | Configuración de Firebase y mails autorizados |
| `cloud.js` | Login con Google, Firestore y archivos partidos |
| `store.js` | Datos: guardado, sincronización, migración, adjuntos, dólar, calendario y avisos |
| `charts.js` | Gráficos SVG de barras y torta |
| `app.js` | Pantallas, formularios y el auto 3D |
| `sw.js` | Funciona sin internet y avisos en segundo plano. Si cambiás algún archivo, subí el número de `CACHE` |
| `firestore.rules` | Reglas de seguridad para pegar en la consola de Firebase |
| `manifest.webmanifest`, `icons/` | Nombre e ícono para instalarla |
| `vendor/model-viewer.min.js` | Visor 3D [model-viewer](https://modelviewer.dev) 4.0.0 de Google (licencia Apache 2.0) |
| `models/mi-auto.glb` | Modelo 3D del auto que trae la app |
| `tools/optimize_glb.py` | Achica un .glb recomprimiendo sus texturas |
