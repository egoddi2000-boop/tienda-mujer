# Tienda online de ropa para mujer

Tienda lista para publicar. Es un sitio estático (HTML, CSS y JavaScript): no necesita servidor ni base de datos, y se publica gratis o muy barato.

## Qué trae

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La tienda (inicio, catálogo, producto, carrito, pedido, preguntas, cambios y envíos, contacto) |
| `js/config.js` | **Tus datos**: nombre, WhatsApp, Yape/Plin, cuentas, envíos, redes |
| `js/data.js` | Productos, categorías, cupones y aviso de portada (50 productos de ejemplo) |
| `admin.html` | Panel para editar productos y cupones sin tocar código |
| `img/` | Aquí van tus fotos y los QR de Yape y Plin |
| `css/styles.css` | Colores y diseño (los colores están al inicio, en `:root`) |

## 1. Configura tu tienda (10 minutos)

Abre `js/config.js` con el Bloc de notas y cambia:

1. `nombre` y `lema`.
2. `whatsapp`: con código de país y sin `+`. Ejemplo: `51987654321`. **Aquí llegan todos los pedidos.**
3. `pagos.yape` y `pagos.plin`: número y titular. Guarda tus QR como `img/yape-qr.png` y `img/plin-qr.png` (descárgalos desde la app).
4. `pagos.transferencia.cuentas`: tus cuentas y CCI.
5. `envios`: costos, envío gratis desde cierto monto y los departamentos donde haces delivery propio.
6. `redes`, `email`, `direccionTienda`, `horario`.

Para quitar un medio de pago, pon `activo: false`.

## 2. Carga tus productos y fotos

1. Pon tus fotos en la carpeta `img/` (formato `.jpg` o `.webp`, de unos 1000 px de ancho y menos de 300 KB cada una, para que la página cargue rápido).
2. Abre `admin.html` en tu navegador (doble clic).
3. En **Productos** edita los de ejemplo o agrega los tuyos. En "Fotos" escribe, por ejemplo, `img/jean-mom-1.jpg, img/jean-mom-2.jpg`.
4. Mira **Publicar > Ver vista previa**. Si todo está bien, toca **Descargar data.js** y reemplaza `js/data.js` con ese archivo.

Sin fotos, la tienda muestra un dibujo de la prenda en el color elegido.

## 3. Cómo funcionan los pagos

La clienta arma su carrito, llena sus datos y elige cómo pagar. Al enviar el pedido ve las instrucciones y un botón verde que abre WhatsApp con el pedido ya escrito.

- **Yape y Plin:** ve tu número y tu QR, paga y manda la captura por WhatsApp. Tú confirmas el pago a mano.
- **Transferencia:** ve tus cuentas. Igual, manda la captura por WhatsApp.
- **Contra entrega / al recoger:** disponible solo donde tú lo permitas (`contraEntrega.soloZonas`).
- **Tarjeta (Visa, Mastercard, American Express, Diners):** hay dos modos.
  - **Modo completo (recomendado):** la clienta paga dentro de la página, en el formulario seguro de **Culqi**. Necesita tu cuenta de Culqi y publicar con Netlify conectado a GitHub. Mira la sección "Cobro con tarjeta dentro de la página".
  - **Modo simple:** si no pones la llave de Culqi en `config.js`, la clienta envía el pedido por WhatsApp y tú le mandas un link de pago de tu pasarela.
  En ambos casos, **los datos de la tarjeta nunca pasan por tu página ni por tu servidor**: los recibe Culqi.

### Qué NO hace esta versión (importante)

- **No descuenta el stock solo.** Cuando vendas, baja el stock en `admin.html` y vuelve a subir `data.js`.
- **No tiene panel de pedidos.** Los pedidos te llegan por WhatsApp (y por correo si activas `formspree`, que es gratis en su plan básico).
- **El cobro con tarjeta se confirma, pero el stock y los pedidos siguen siendo manuales.** Las ventas con tarjeta las ves en tu CulqiPanel; el stock lo bajas tú en `admin.html`.
- **Los cupones y precios son visibles** en el código de la página, como en cualquier sitio estático. Verifica siempre el monto antes de confirmar un pedido.
- **El panel `admin.html` no tiene contraseña real.** Úsalo en tu computadora y no lo subas al hosting.

## 4. Cobro con tarjeta dentro de la página (Culqi)

Con esto la clienta elige "Tarjeta", se abre el formulario seguro de Culqi sobre tu página, paga y ve su confirmación. El monto lo calcula el servidor con tus precios reales, así que nadie puede cambiarlo desde el navegador.

**Qué necesitas:** una cuenta en Culqi (culqi.com) y publicar con Netlify conectado a GitHub (explicado abajo). Con "Netlify Drop" (arrastrar la carpeta) la función en servidor puede no activarse.

1. **Crea tu cuenta en Culqi** y entra a CulqiPanel. Empieza en el entorno de **integración (pruebas)**: no se cobra dinero real.
2. En CulqiPanel, ve a **Desarrollo > API Keys** y copia tus llaves de prueba: la **pública** (`pk_test_...`) y la **secreta** (`sk_test_...`).
3. Pega la llave **pública** en `js/config.js`, en `pagos.tarjeta.culqi.publicKey`.
4. Publica el sitio (sección 5, opción A).
5. En Netlify: **Site configuration > Environment variables > Add a variable**. Nombre: `CULQI_SECRET_KEY`. Valor: tu llave **secreta**. Luego haz un nuevo deploy para que la tome.
6. Prueba una compra con tarjeta usando las **tarjetas de prueba** de la documentación de Culqi (docs.culqi.com). Revisa que la venta aparezca en CulqiPanel.
7. **Para cobrar dinero real:** completa la activación de tu comercio en Culqi (te piden datos de tu negocio). Cambia a las llaves `pk_live_...` y `sk_live_...`, actualízalas (la pública en `config.js`, la secreta en Netlify) y vuelve a publicar.

**Reglas importantes**
- **La llave secreta (`sk_...`) nunca va en `config.js` ni en el código.** Solo en Netlify.
- La tarjeta pide correo: sin correo no se puede pagar.
- Si el banco rechaza la tarjeta, la clienta ve el mensaje y puede reintentar o elegir otro medio. No se le cobra.
- Cuando una venta con tarjeta se aprueba, aparece en tu **CulqiPanel** con el número de pedido, el nombre, el celular y los productos. También le sale a la clienta el botón de WhatsApp para avisarte, pero **ella podría cerrar la página sin tocarlo**: revisa tu CulqiPanel con frecuencia y activa `formspree` en `config.js` para que cada pedido te llegue también por correo.
- Culqi cobra una comisión por venta (consulta su tarifa actual en culqi.com).
- Culqi puede cambiar su sistema con el tiempo. Esta página usa su "Checkout Custom". Si algún día algo deja de funcionar, revisa su documentación.

## 5. Publicar en internet (paso a paso)

### Opción A: Netlify conectado a GitHub (gratis, necesaria para cobrar con tarjeta)

1. Antes de subir, **saca `admin.html` de la carpeta** (déjalo guardado en tu computadora para seguir editando).
2. Crea una cuenta gratis en github.com. Toca **New repository**, ponle un nombre (por ejemplo `mi-tienda`) y créalo.
3. En el repositorio nuevo, toca **uploading an existing file** y arrastra **todo el contenido** de la carpeta de la tienda (incluida la carpeta `netlify` y el archivo `netlify.toml`). Toca **Commit changes**.
4. Crea una cuenta gratis en netlify.com. Ve a **Add new site > Import an existing project**, elige **GitHub** y selecciona tu repositorio.
5. Deja el comando de build vacío y el directorio de publicación como está (`.`). Toca **Deploy**.
6. En unos segundos tendrás una dirección como `tu-tienda.netlify.app`, con HTTPS ya activado.
7. Si vas a cobrar con tarjeta, agrega la variable `CULQI_SECRET_KEY` (sección 4, paso 5).
8. Cada vez que cambies productos: sube de nuevo `js/data.js` y las fotos al repositorio (botón **Add file > Upload files**). Netlify republica solo.

**Sin tarjeta en línea (modo simple)** puedes usar el método más fácil: en netlify.com, **Add new site > Deploy manually** y arrastrar la carpeta. Pero así la función de cobro no se activa.

Alternativas con el mismo método de GitHub: **Cloudflare Pages** y **Vercel** (la función de cobro está hecha para Netlify, así que para cobrar con tarjeta usa Netlify).

### Opción B: Hostinger u otro hosting con cPanel

Ojo: en un hosting común el **pago con tarjeta dentro de la página no funciona** (la función en servidor está hecha para Netlify). Funciona en modo simple, con link de pago por WhatsApp.

1. Contrata un plan de hosting compartido.
2. Entra al **Administrador de archivos** y abre la carpeta `public_html`.
3. Sube todo el contenido de la tienda (sin `admin.html`).
4. Activa el **SSL gratuito** en el panel (sección SSL/Seguridad) y marca "Forzar HTTPS".

### Dominio propio (.com o .pe)

1. Compra el dominio en un registrador (Hostinger, Namecheap, GoDaddy o un distribuidor de .pe).
2. **En Netlify:** *Domain management > Add a domain* y sigue las instrucciones. Te indicará qué registros DNS crear o te dará los *nameservers*.
3. **En Hostinger:** si compras hosting y dominio juntos, ya viene conectado.
4. El certificado SSL (candado/HTTPS) se activa solo en Netlify, Cloudflare y Vercel. Puede tardar de unos minutos a unas horas.

### Google, Instagram y TikTok

Pega el enlace de tu tienda en la biografía de Instagram y TikTok. Para Google Analytics y Meta Pixel, pon tus IDs en `analitica` dentro de `config.js`.

## 6. Costos aproximados (verifica precios actuales)

| Concepto | Costo aproximado |
|---|---|
| Hosting en Netlify, Cloudflare Pages o Vercel | Gratis |
| Hosting compartido (Hostinger y similares) | Desde S/ 12 a S/ 40 por mes, según el plan |
| Dominio .com | S/ 45 a S/ 70 por año |
| Dominio .pe | S/ 120 a S/ 200 por año aproximadamente |
| Yape, Plin, transferencia | Sin comisión de la tienda (revisa condiciones de tu banco o Yape Negocios) |
| Pasarela de tarjetas | Comisión por venta, normalmente alrededor de 3% a 4% más IGV |

## 7. Lista de revisión antes de lanzar

- [ ] Cambié `[NOMBRE DE LA TIENDA]` en `config.js` y mi WhatsApp tiene el formato `51XXXXXXXXX`.
- [ ] Mis QR de Yape y Plin están en `img/` y se ven en un pedido de prueba.
- [ ] Mis cuentas bancarias y CCI son correctas.
- [ ] Reemplacé los productos de ejemplo por los míos (fotos, precios, tallas, stock).
- [ ] Revisé las páginas "Nosotras" y "Cambios y envíos": ajusté los plazos a mi política real.
- [ ] Hice un pedido de prueba desde mi celular con cada medio de pago, incluida una compra con tarjeta de prueba de Culqi.
- [ ] Cambié las llaves de Culqi de prueba (`pk_test`/`sk_test`) a reales (`pk_live`/`sk_live`) y mi comercio está activado.
- [ ] La llave secreta está solo en Netlify, no en `config.js`.
- [ ] Probé el botón de WhatsApp y llega el pedido completo.
- [ ] Borré `admin.html` de la carpeta que subí al hosting.
- [ ] Abrí la tienda con `https://` y aparece el candado.
- [ ] Agregué opiniones reales de clientas (opcional) en `opiniones` de `config.js`.

## 8. Textos que debes revisar

Las páginas **Nosotras**, **Preguntas frecuentes** y **Cambios y envíos** traen textos de ejemplo (por ejemplo, cambios dentro de 7 días). Están en `js/store.js`, en las funciones `viewAbout`, `viewFaq` y `viewPolicies`. Ajústalos a tu política real antes de lanzar.
