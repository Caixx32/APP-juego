// Configuración de Mi Auto. Es lo único que hay que tocar para conectar la app con Firebase.
//
// 1. firebase: pegá acá el objeto firebaseConfig que te da la consola de Firebase
//    (Configuración del proyecto → Tus apps → app web). Mientras quede en null, la app
//    funciona sin nube y guarda todo sólo en el dispositivo.
// 2. allowedEmails: los mails que pueden entrar. Tienen que ser los mismos que en firestore.rules.
//
// Estos datos no son secretos: la seguridad la ponen las reglas de Firestore, no esta clave.

window.MI_AUTO_CONFIG = {
  firebase: {
    apiKey: 'AIzaSyAvnm6ovZO2eRvx7nuvYB80jWy4Q5qMb-o',
    authDomain: 'mi-auto-20c27.firebaseapp.com',
    projectId: 'mi-auto-20c27',
    storageBucket: 'mi-auto-20c27.firebasestorage.app',
    messagingSenderId: '653500972301',
    appId: '1:653500972301:web:d81cde1d849265301b0444',
  },

  allowedEmails: [
    'juanmarcospaterno@gmail.com',
    'MAIL_DE_TU_MUJER@gmail.com',
  ],

  // Todos los datos viven en garages/<garageId>. Los dos usuarios comparten el mismo.
  garageId: 'principal',
};
