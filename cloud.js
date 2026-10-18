'use strict';

// Conexión con Firebase (Auth con Google + Firestore con caché offline).
// El SDK se carga por CDN con import() dinámico: si no hay internet y todavía no está en caché,
// la app muestra un error claro en lugar de romperse.

const FIREBASE_VERSION = '10.14.1';
const FIREBASE_CDN = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;

// Cada documento de Firestore admite hasta 1 MiB: los archivos se parten en pedazos de base64 más chicos.
const CHUNK_CHARS = 700000;

window.MiAutoCloud = (() => {
  const cfg = window.MI_AUTO_CONFIG || {};
  const params = new URLSearchParams(location.search);
  // Sólo para probar en la computadora con los emuladores de Firebase (nunca en el sitio publicado).
  const useEmulator = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && params.has('emu');
  const firebaseConfig = useEmulator
    ? { apiKey: 'demo-key', authDomain: 'demo-miauto.firebaseapp.com', projectId: 'demo-miauto', appId: 'demo' }
    : cfg.firebase;

  const allowed = (cfg.allowedEmails || []).map((e) => e.trim().toLowerCase());
  let fb = null; // módulos de Firebase cargados
  let auth = null;
  let db = null;
  let garage = null;

  function isAllowed(email) {
    return !!email && allowed.includes(email.toLowerCase());
  }

  async function init() {
    if (fb) return;
    const [app, authMod, fs] = await Promise.all([
      import(`${FIREBASE_CDN}/firebase-app.js`),
      import(`${FIREBASE_CDN}/firebase-auth.js`),
      import(`${FIREBASE_CDN}/firebase-firestore.js`),
    ]);
    fb = { ...app, ...authMod, ...fs };
    const fApp = fb.initializeApp(firebaseConfig);
    auth = fb.getAuth(fApp);
    auth.languageCode = 'es';
    db = fb.initializeFirestore(fApp, {
      localCache: fb.persistentLocalCache({ tabManager: fb.persistentMultipleTabManager() }),
    });
    if (useEmulator) {
      fb.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      fb.connectFirestoreEmulator(db, '127.0.0.1', 8081);
    }
    garage = cfg.garageId || 'principal';
    // Si el login fue por redirección (cuando el navegador bloquea la ventana emergente).
    fb.getRedirectResult(auth).catch(() => {});
  }

  function onAuth(cb) {
    return fb.onAuthStateChanged(auth, cb);
  }

  async function signIn() {
    const provider = new fb.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await fb.signInWithPopup(auth, provider);
    } catch (e) {
      if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment'].includes(e.code)) {
        await fb.signInWithRedirect(auth, provider);
        return;
      }
      throw e;
    }
  }

  function signOut() {
    return fb.signOut(auth);
  }

  const col = (name) => fb.collection(db, 'garages', garage, name);
  const ref = (name, id) => fb.doc(db, 'garages', garage, name, id);

  // Escucha una colección completa. cb(items, { fromCache, pending })
  function subscribe(name, cb, onError) {
    return fb.onSnapshot(col(name), { includeMetadataChanges: true }, (snap) => {
      cb(snap.docs.map((d) => d.data()), { fromCache: snap.metadata.fromCache, pending: snap.metadata.hasPendingWrites });
    }, onError);
  }

  function subscribeDoc(name, id, cb, onError) {
    return fb.onSnapshot(ref(name, id), { includeMetadataChanges: true }, (snap) => {
      cb(snap.exists() ? snap.data() : null, { fromCache: snap.metadata.fromCache, pending: snap.metadata.hasPendingWrites });
    }, onError);
  }

  // Las escrituras no se esperan: con la caché offline quedan en cola y se suben cuando hay señal.
  function put(name, id, data) {
    fb.setDoc(ref(name, id), data).catch((e) => console.warn('No se pudo guardar', name, id, e));
  }

  function del(name, id) {
    fb.deleteDoc(ref(name, id)).catch((e) => console.warn('No se pudo borrar', name, id, e));
  }

  async function getAll(name) {
    const snap = await fb.getDocs(col(name));
    return snap.docs.map((d) => d.data());
  }

  async function getOne(name, id) {
    const snap = await fb.getDoc(ref(name, id));
    return snap.exists() ? snap.data() : null;
  }

  /* ----- Archivos partidos en varios documentos ----- */

  function putFile(fileId, base64) {
    const n = Math.max(1, Math.ceil(base64.length / CHUNK_CHARS));
    for (let i = 0; i < n; i++) {
      put('chunks', `${fileId}_${i}`, { fileId, i, n, data: base64.slice(i * CHUNK_CHARS, (i + 1) * CHUNK_CHARS) });
    }
    return n;
  }

  async function getFile(fileId, n) {
    const parts = await Promise.all(Array.from({ length: n }, (_, i) => getOne('chunks', `${fileId}_${i}`)));
    if (parts.some((p) => !p)) throw new Error('Faltan partes del archivo (todavía no se sincronizó).');
    return parts.map((p) => p.data).join('');
  }

  function delFile(fileId, n) {
    for (let i = 0; i < n; i++) del('chunks', `${fileId}_${i}`);
  }

  // Sólo con emuladores: entra con una cuenta de Google de mentira para las pruebas automáticas.
  async function testSignIn(email) {
    if (!useEmulator) throw new Error('Sólo disponible con emuladores');
    const cred = fb.GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, email_verified: true }));
    await fb.signInWithCredential(auth, cred);
  }

  return {
    configured: !!firebaseConfig,
    useEmulator,
    isAllowed,
    init,
    onAuth,
    signIn,
    signOut,
    subscribe,
    subscribeDoc,
    put,
    del,
    getAll,
    getOne,
    putFile,
    getFile,
    delFile,
    testSignIn,
    CHUNK_CHARS,
  };
})();
