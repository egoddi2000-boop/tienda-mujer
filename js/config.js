/* ============================================================
   CONFIGURACIÓN DE LA TIENDA
   Edita solo este archivo para cambiar nombre, teléfonos,
   medios de pago, envíos y redes sociales.
   ============================================================ */
window.TIENDA = {
  nombre: "[NOMBRE DE LA TIENDA]",
  lema: "Jeans, casacas y vestidos para tu día a día",
  moneda: "S/",

  /* Número de WhatsApp con código de país, sin + ni espacios.
     Aquí llegan todos los pedidos. Ejemplo Perú: 51987654321 */
  whatsapp: "51999999999",
  email: "ventas@tutienda.pe",
  direccionTienda: "Dirección de tu tienda o taller, Ciudad",
  horario: "Lunes a sábado, 10:00 a.m. a 7:00 p.m.",

  redes: {
    instagram: "https://instagram.com/tutienda",
    tiktok: "https://tiktok.com/@tutienda",
    facebook: "https://facebook.com/tutienda"
  },

  /* ----- MEDIOS DE PAGO ----- */
  pagos: {
    yape: {
      activo: true,
      numero: "973763723",
      titular: "Mariluz Huamani",
      qr: "img/yape-qr.png"            /* sube tu QR en la carpeta img/ */
    },
    plin: {
      activo: false,
      numero: "999 999 999",
      titular: "Nombre y Apellido",
      qr: "img/plin-qr.png"
    },
    transferencia: {
      activo: false,
      cuentas: [
        { banco: "BCP",       cuenta: "000-00000000-0-00", cci: "002-000-000000000000-00", titular: "Nombre y Apellido" },
        { banco: "BBVA",      cuenta: "0011-0000-00-0000000000", cci: "011-000-000000000000-00", titular: "Nombre y Apellido" },
        { banco: "Interbank", cuenta: "000-0000000000", cci: "003-000-000000000000-00", titular: "Nombre y Apellido" }
      ]
    },
    tarjeta: {
      activo: true,
      /* PAGO CON TARJETA DENTRO DE LA PÁGINA (Culqi)
         Pega aquí tu LLAVE PÚBLICA de Culqi (empieza con pk_test_ para pruebas
         o pk_live_ para cobros reales). La llave pública es segura de mostrar.
         La llave SECRETA (sk_...) NUNCA va aquí: va en Netlify, como variable
         CULQI_SECRET_KEY. Mira LEEME.md, sección "Cobro con tarjeta".
         Si dejas la llave vacía, se usa el modo simple: el pedido va por WhatsApp
         y tú envías un link de pago. */
      culqi: {
        publicKey: "pk_test_e2ea1b72e9fcf011"
      },
      nota: "Pago seguro con tarjeta (Modo de prueba)."
    },
    contraEntrega: {
      activo: true,
      /* Solo disponible en estas zonas (deben coincidir con zonas de envío) */
      soloZonas: ["domicilio", "recojo"]
    }
  },

  /* ----- ENVÍOS ----- */
  envios: {
    domicilio: {
      nombre: "Envío a domicilio",
      /* Departamentos donde haces delivery propio. Cámbialos por los tuyos.
         Deja la lista vacía [] para permitirlo en todo el país. */
      departamentos: ["Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"],
      costo: 10,
      gratisDesde: 250,
      tiempo: "1 a 2 días hábiles"
    },
    agencia: {
      nombre: "Envío por agencia a provincias (Olva, Shalom)",
      costo: 15,
      gratisDesde: 350,
      tiempo: "2 a 5 días hábiles. El flete extra, si lo hay, se paga al recoger.",
      agencias: ["Olva Courier", "Shalom", "Cruz del Sur Cargo", "Otra (indicar en notas)"]
    },
    recojo: {
      nombre: "Recojo en tienda",
      costo: 0,
      tiempo: "Te avisamos por WhatsApp cuando esté listo."
    }
  },

  /* ----- OPINIONES DE CLIENTAS -----
     Agrega aquí opiniones REALES de tus clientas (con su permiso).
     Mientras la lista esté vacía, la sección no se muestra.
     Formato: { nombre: "Nombre", texto: "Lo que dijo", estrellas: 5 } */
  opiniones: [],

  /* ----- FOTOS DE INSTAGRAM (opcional) -----
     Pon rutas de imágenes, por ejemplo "img/insta1.jpg". Si está vacío,
     se muestra solo el botón para seguirte. */
  instagramFotos: [],

  /* ----- ANALÍTICA (opcional): pega tus IDs, déjalos vacíos para desactivar ----- */
  analitica: {
    ga4: "",          /* Ejemplo: G-XXXXXXXXXX */
    metaPixel: ""     /* Ejemplo: 1234567890123456 */
  },

  /* ----- CORREO DE PEDIDOS (opcional) -----
     Crea un formulario gratis en formspree.io y pega aquí su URL
     (https://formspree.io/f/xxxxxx). Cada pedido te llegará también por correo. */
  formspree: "https://formspree.io/f/xdealbgw"
};
