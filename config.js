// Configuración de Mi Auto. Es lo único que hay que tocar para conectar la app con Firebase.
//
// 1. firebase: pegá acá el objeto firebaseConfig que te da la consola de Firebase
//    (Configuración del proyecto → Tus apps → app web). Mientras quede en null, la app
//    funciona sin nube y guarda todo sólo en el dispositivo.
// 2. allowedEmails: los mails que pueden entrar. Tienen que ser los mismos que en firestore.rules.
//
// Estos datos no son secretos: la seguridad la ponen las reglas de Firestore, no esta clave.

window.MI_AUTO_CONFIG = {
  firebase: null,
  // Ejemplo de cómo tiene que quedar:
  // firebase: {
  //   apiKey: 'AIza...',
  //   authDomain: 'mi-auto-xxxx.firebaseapp.com',
  //   projectId: 'mi-auto-xxxx',
  //   storageBucket: 'mi-auto-xxxx.appspot.com',
  //   messagingSenderId: '1234567890',
  //   appId: '1:1234567890:web:abcdef',
  // },

  allowedEmails: [
    'juanmarcospaterno@gmail.com',
    'MAIL_DE_TU_MUJER@gmail.com',
  ],

  // Todos los datos viven en garages/<garageId>. Los dos usuarios comparten el mismo.
  garageId: 'principal',
};
