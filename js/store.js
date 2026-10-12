/* ============================================================
   LÓGICA DE LA TIENDA
   Catálogo, producto, carrito, checkout, pedido y páginas.
   No necesitas editar este archivo para el uso diario:
   usa config.js (datos) y data.js / admin.html (productos).
   ============================================================ */
(function () {
  "use strict";

  const T = window.TIENDA;
  const CATS = window.CATEGORIAS || [];
  const PREVIEW = /[?&]preview=1/.test(location.search);

  /* ---------- Almacenamiento seguro ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* modo privado */ } }
  };

  /* Vista previa desde el panel admin: usa el borrador guardado en este navegador */
  const draft = PREVIEW ? store.get("tienda_borrador", null) : null;
  const ALL = (draft && draft.productos) || window.PRODUCTOS || [];
  const PRODS = ALL.filter(p => !p.oculto);
  const CUPONES = (draft && draft.cupones) || window.CUPONES || [];
  const BANNERS = (draft && draft.banners) || window.BANNERS || [];

  /* ---------- Utilidades ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = n => T.moneda + " " +(Math.round(Number(n) * 100) / 100).toFixed(2);
  const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const catBy = slug => CATS.find(c => c.slug === slug);
  const prodBy = id => ALL.find(p => p.id === id);
  const wa = text => "https://wa.me/" + T.whatsapp + "?text=" + encodeURIComponent(text);
  const enOferta = p => p.precioAntes && p.precioAntes > p.precio;
  const pct = p => Math.round((1 - p.precio / p.precioAntes) * 100);

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- Estado: carrito, favoritos, cupón ---------- */
  let cart = store.get("tienda_carrito", []);
  let favs = store.get("tienda_favoritos", []);
  let cuponCodigo = store.get("tienda_cupon", "");
  const saveCart = () => { store.set("tienda_carrito", cart); updateBadges(); };
  const saveFavs = () => { store.set("tienda_favoritos", favs); updateBadges(); };

  function updateBadges() {
    const n = cart.reduce((a, i) => a + i.qty, 0);
    const c = $("#cartCount"); c.textContent = n; c.hidden = !n;
    const f = $("#favCount"); f.textContent = favs.length; f.hidden = !favs.length;
  }

  /* ---------- Dibujos de prenda (se usan mientras no subas fotos) ---------- */
  const SHAPES = {
    pantalon: '<path d="M30 8h40l7 106H56l-6-58-6 58H23z"/><path d="M30 20h40" class="st"/>',
    casaca: '<path d="M36 10l-24 14 8 42 11-4v50h38V62l11 4 8-42-24-14c-3 8-9 12-16 12s-13-4-16-12z"/><path d="M50 22v92" class="st"/>',
    short: '<path d="M26 22h48l8 54H56l-6-22-6 22H18z"/><path d="M26 32h48" class="st"/>',
    falda: '<path d="M34 18h32l18 88H16z"/><path d="M34 28h32" class="st"/>',
    chaleco: '<path d="M32 10c4 9 10 14 18 14s14-5 18-14l7 9-5 92H30l-5-92z"/><path d="M50 24v87" class="st"/>',
    polo: '<path d="M35 12c4 7 9 10 15 10s11-3 15-10l23 14-9 20-10-5v62H31V41l-10 5-9-20z"/>',
    top: '<path d="M33 16h12c1 9 3 13 5 13s4-4 5-13h12l5 56-9 14H37l-9-14z"/>',
    vestido: '<path d="M40 8h20l-3 30 22 78H21l22-78z"/><path d="M36 48h28" class="st"/>',
    vestidolargo: '<path d="M42 6h16l-2 32 20 82H24l20-82z"/><path d="M38 46h24" class="st"/>',
    lentes: '<g transform="translate(0 28)"><rect x="8" y="22" width="36" height="28" rx="12"/><rect x="56" y="22" width="36" height="28" rx="12"/><path d="M44 30q6-6 12 0M8 28L2 20M92 28l6-8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g>'
  };
  function shapeSVG(forma, fill) {
    const f = fill || "#4f74a8";
    return '<svg viewBox="0 0 100 120" role="img" aria-hidden="true" style="color:#172036">' +
      '<style>.st{fill:none;stroke:#e8b04a;stroke-width:2.2;stroke-dasharray:4 3;stroke-linecap:round}</style>' +
      '<g fill="' + esc(f) + '" stroke="#172036" stroke-opacity=".35" stroke-width="1.6" stroke-linejoin="round">' + (SHAPES[forma] || SHAPES.polo) + '</g></svg>';
  }
  function mediaHTML(p, hex, idx) {
    const img = p.imagenes && p.imagenes[idx || 0];
    if (img) return '<img src="' + esc(img) + '" alt="' + esc(p.nombre) + '" loading="lazy">';
    const c = catBy(p.categoria);
    const fill = hex || (p.colores && p.colores[0] && p.colores[0].hex);
    return '<div class="ph" role="img" aria-label="' + esc(p.nombre) + '">' + shapeSVG(c ? c.forma : "polo", fill) + "</div>";
  }

  /* ---------- Tarjeta de producto ---------- */
  function cardHTML(p) {
    const c = catBy(p.categoria);
    const agotado = !(p.stock > 0);
    const esFav = favs.includes(p.id);
    return '<article class="card">' +
      '<div class="card__media">' + mediaHTML(p) +
      '<div class="card__tags">' +
      (agotado ? '<span class="pill pill--out">Agotado</span>' : "") +
      (enOferta(p) && !agotado ? '<span class="pill pill--sale">-' + pct(p) + '%</span>' : "") +
      (p.nuevo && !agotado ? '<span class="pill pill--new">Nuevo</span>' : "") + '</div>' +
      '<button class="fav" data-act="fav" data-id="' + p.id + '" aria-pressed="' + esFav + '" aria-label="' + (esFav ? "Quitar de" : "Agregar a") + ' lista de deseos: ' + esc(p.nombre) + '">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg></button></div>' +
      '<div class="card__body"><div class="card__cat">' + esc(c ? c.nombre : "") + '</div>' +
      '<h3><a href="#/producto/' + p.id + '">' + esc(p.nombre) + '</a></h3>' +
      '<div class="price">' + money(p.precio) + (enOferta(p) ? '<s>' + money(p.precioAntes) + '</s>' : "") + '</div>' +
      '<div class="swatches" aria-label="Colores disponibles">' + (p.colores || []).map(k => '<span class="sw" title="' + esc(k.n) + '" style="background:' + esc(k.hex) + '"></span>').join("") + '</div></div></article>';
  }
  const gridHTML = list => '<div class="grid">' + list.map(cardHTML).join("") + "</div>";

  /* ---------- Cabecera, menú y pie ---------- */
  function buildChrome() {
    $("#brand").textContent = T.nombre;
    $("#topbar").innerHTML = "Paga con <b>Yape</b>, <b>Plin</b>, tarjeta o transferencia · Envíos a todo el Perú";
    const grupos = [];
    CATS.forEach(c => { if (!grupos.includes(c.grupo)) grupos.push(c.grupo); });
    $("#nav").innerHTML = grupos.map(g =>
      '<div class="nav__item"><button class="nav__link" type="button" aria-haspopup="true">' + esc(g) + '</button><div class="nav__menu">' +
      '<a href="#/catalogo?grupo=' + encodeURIComponent(g) + '">Ver todo en ' + esc(g.toLowerCase()) + '</a>' +
      CATS.filter(c => c.grupo === g).map(c => '<a href="#/catalogo?cat=' + c.slug + '">' + esc(c.nombre) + '</a>').join("") + "</div></div>"
    ).join("") +
      '<div class="nav__item"><a class="nav__link" href="#/catalogo?nuevo=1">Nuevo</a></div>' +
      '<div class="nav__item"><a class="nav__link" href="#/catalogo?oferta=1">Ofertas</a></div>';

    const r = T.redes || {};
    $("#footer").innerHTML = '<div class="wrap"><div class="footer__grid">' +
      '<div><a class="brand" href="#/">' + esc(T.nombre) + '</a><p style="margin-top:14px;max-width:34ch">' + esc(T.lema) + '</p>' +
      '<div class="payicons" aria-label="Medios de pago">' + payIcons() + "</div></div>" +
      '<div><h4>Tienda</h4><ul><li><a href="#/catalogo">Todos los productos</a></li><li><a href="#/catalogo?grupo=Jeans">Jeans</a></li><li><a href="#/catalogo?grupo=Vestidos">Vestidos</a></li><li><a href="#/catalogo?oferta=1">Ofertas</a></li></ul></div>' +
      '<div><h4>Ayuda</h4><ul><li><a href="#/preguntas">Preguntas frecuentes</a></li><li><a href="#/politicas">Cambios y envíos</a></li><li><a href="#/nosotras">Nosotras</a></li><li><a href="#/contacto">Contacto</a></li></ul></div>' +
      '<div><h4>Escríbenos</h4><ul><li><a href="' + wa("Hola, quisiera información") + '" target="_blank" rel="noopener">WhatsApp</a></li><li><a href="mailto:' + esc(T.email) + '">' + esc(T.email) + "</a></li>" +
      (r.instagram ? '<li><a href="' + esc(r.instagram) + '" target="_blank" rel="noopener">Instagram</a></li>' : "") +
      (r.tiktok ? '<li><a href="' + esc(r.tiktok) + '" target="_blank" rel="noopener">TikTok</a></li>' : "") +
      (r.facebook ? '<li><a href="' + esc(r.facebook) + '" target="_blank" rel="noopener">Facebook</a></li>' : "") +
      '</ul></div></div><div class="footer__bottom"><span>© ' + new Date().getFullYear() + " " + esc(T.nombre) + '. Todos los derechos reservados.</span><span>Conexión segura (HTTPS)</span></div></div>';
    $("#waFloat").href = wa("Hola, quisiera información sobre sus productos");
  }
  function payIcons() {
    const p = T.pagos;
    return (p.yape.activo ? '<span class="payicon payicon--yape">Yape</span>' : "") +
      (p.plin.activo ? '<span class="payicon payicon--plin">Plin</span>' : "") +
      (p.tarjeta.activo ? '<span class="payicon payicon--visa">VISA</span><span class="payicon payicon--mc">Mastercard</span>' : "") +
      (p.transferencia.activo ? '<span class="payicon">Transferencia</span>' : "") +
      (p.contraEntrega.activo ? '<span class="payicon">Contra entrega</span>' : "");
  }

  /* ---------- Cálculos del pedido ---------- */
  function cuponValido(codigo, subtotal) {
    if (!codigo) return null;
    const c = CUPONES.find(x => x.activo !== false && norm(x.codigo) === norm(codigo));
    if (!c) return { error: "Ese cupón no existe o ya venció." };
    if (subtotal < (c.minimo || 0)) return { error: "Este cupón aplica desde " + money(c.minimo) + " de compra." };
    return { cupon: c };
  }
  function totales(metodoEnvio) {
    const subtotal = cart.reduce((a, i) => { const p = prodBy(i.id); return a + (p ? p.precio * i.qty : 0); }, 0);
    const cv = cuponValido(cuponCodigo, subtotal);
    let descuento = 0, envioGratisCupon = false;
    if (cv && cv.cupon) {
      if (cv.cupon.tipo === "porcentaje") descuento = Math.round(subtotal * cv.cupon.valor) / 100;
      else if (cv.cupon.tipo === "monto") descuento = Math.min(subtotal, cv.cupon.valor);
      else if (cv.cupon.tipo === "envio") envioGratisCupon = true;
    }
    let envio = null;
    if (metodoEnvio && T.envios[metodoEnvio]) {
      const e = T.envios[metodoEnvio];
      envio = e.costo || 0;
      if (envioGratisCupon || (e.gratisDesde && subtotal - descuento >= e.gratisDesde)) envio = 0;
    }
    return { subtotal, descuento, envio, total: subtotal - descuento + (envio || 0), cupon: cv && cv.cupon, errorCupon: cv && cv.error };
  }

  /* ---------- Router ---------- */
  let keepScroll = false;
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    const i = h.indexOf("?");
    const path = i < 0 ? h : h.slice(0, i);
    const q = {};
    new URLSearchParams(i < 0 ? "" : h.slice(i + 1)).forEach((v, k) => { q[k] = v; });
    return { parts: path.split("/").filter(Boolean), q: q };
  }
  function setPage(html, title, desc) {
    $("#main").innerHTML = html;
    document.title = (title ? title + " | " : "") + T.nombre;
    const m = $('meta[name="description"]');
    if (m && desc) m.setAttribute("content", desc);
    if (!keepScroll) { window.scrollTo(0, 0); $("#main").focus({ preventScroll: true }); }
    keepScroll = false;
    closeMenu();
  }
  function route() {
    const { parts, q } = parseHash();
    const [a, b] = parts;
    if (!a) return viewHome();
    if (a === "catalogo") return viewCatalog(q);
    if (a === "producto") return viewProduct(b);
    if (a === "carrito") return viewCart();
    if (a === "checkout") return viewCheckout();
    if (a === "pedido") return viewDone();
    if (a === "favoritos") return viewFavs();
    if (a === "nosotras") return viewAbout();
    if (a === "contacto") return viewContact();
    if (a === "preguntas") return viewFaq();
    if (a === "politicas") return viewPolicies();
    return setPage('<div class="wrap"><div class="empty" style="margin:40px 0"><h3>No encontramos esa página</h3><p>Puede que el enlace haya cambiado.</p><a class="btn" href="#/">Ir al inicio</a></div></div>', "Página no encontrada");
  }

  /* ---------- Inicio ---------- */
  function viewHome() {
    const banner = BANNERS.find(b => b.activo !== false);
    const heroCats = ["pantalones-jeans", "vestidos-cortos", "casacas-cuero"].map(slug => catBy(slug)).filter(Boolean);
    const nuevos = PRODS.filter(p => p.nuevo).slice(0, 8);
    const top = PRODS.filter(p => p.masVendido).slice(0, 8);
    const ofertas = PRODS.filter(enOferta).slice(0, 8);
    const hex = ["#4f74a8", "#e08fa4", "#6b4a33"];
    const r = T.redes || {};
    const ops = T.opiniones || [];
    const fotos = T.instagramFotos || [];
    setPage(
      (banner ? '<div class="banner">' + esc(banner.titulo) + ". " + esc(banner.texto) + ' <a href="' + esc(banner.enlace) + '">Ver ahora</a></div>' : "") +
      '<section class="hero"><div class="wrap hero__grid"><div><h1>Denim con carácter y looks para todos los días</h1>' +
      '<p class="lead">' + esc(T.lema) + ". Pantalones, casacas, vestidos, polos, tops y lentes de sol, con envíos a todo el Perú.</p>" +
      '<div class="hero__cta"><a class="btn btn--stitch" href="#/catalogo">Ver la colección</a><a class="btn btn--ghost" href="#/catalogo?oferta=1">Ver ofertas</a></div></div>' +
      '<div class="hero__tags">' + heroCats.map((c, i) => '<a class="tag" href="#/catalogo?cat=' + c.slug + '">' + shapeSVG(c.forma, hex[i]) + "<span>" + esc(c.nombre) + "</span></a>").join("") + "</div></div></section>" +

      '<section class="section"><div class="wrap"><div class="benefits">' +
      '<div class="benefit"><b>Paga como prefieras</b><span>Yape, Plin, tarjeta o transferencia</span></div>' +
      '<div class="benefit"><b>Envíos a todo el Perú</b><span>Delivery, agencia o recojo en tienda</span></div>' +
      '<div class="benefit"><b>Cambios de talla</b><span>Consulta nuestras condiciones</span></div>' +
      '<div class="benefit"><b>Atención por WhatsApp</b><span>Te ayudamos a elegir tu talla</span></div></div></div></section>' +
      '<div class="wrap"><hr class="stitch"></div>' +

      '<section class="section"><div class="wrap"><div class="section__head"><h2>Compra por categoría</h2></div><div class="cats">' +
      CATS.map(c => {
        const ej = PRODS.find(p => p.categoria === c.slug);
        return '<a class="cat" href="#/catalogo?cat=' + c.slug + '"><div class="ph">' + shapeSVG(c.forma, ej && ej.colores[0] ? ej.colores[0].hex : "#4f74a8") + "</div><strong>" + esc(c.nombre) + "</strong></a>";
      }).join("") + "</div></div></section>" +

      (nuevos.length ? '<section class="section section--tint"><div class="wrap"><div class="section__head"><div><h2>Recién llegados</h2></div><a class="link" href="#/catalogo?nuevo=1">Ver todos</a></div>' + gridHTML(nuevos) + "</div></section>" : "") +
      (top.length ? '<section class="section"><div class="wrap"><div class="section__head"><div><h2>Las más pedidas</h2></div><a class="link" href="#/catalogo">Ver todo</a></div>' + gridHTML(top) + "</div></section>" : "") +
      (ofertas.length ? '<section class="section section--tint"><div class="wrap"><div class="section__head"><div><h2>Ofertas</h2></div><a class="link" href="#/catalogo?oferta=1">Ver todas</a></div>' + gridHTML(ofertas) + "</div></section>" : "") +

      (ops.length ? '<section class="section"><div class="wrap"><div class="section__head"><h2>Lo que dicen nuestras clientas</h2></div><div class="quotes">' +
        ops.map(o => '<figure class="quote" style="margin:0"><div class="stars" aria-label="' + (o.estrellas || 5) + ' de 5 estrellas">' + "★".repeat(o.estrellas || 5) + "</div><p>" + esc(o.texto) + "</p><cite>" + esc(o.nombre) + "</cite></figure>").join("") + "</div></div></section>" : "") +

      '<section class="section' + (ops.length ? " section--tint" : "") + '"><div class="wrap"><div class="section__head"><div><h2>Síguenos en Instagram</h2><p>Mira looks nuevos y promociones antes que nadie.</p></div>' +
      (r.instagram ? '<a class="btn btn--ghost" href="' + esc(r.instagram) + '" target="_blank" rel="noopener">Ir a Instagram</a>' : "") + "</div>" +
      (fotos.length ? '<div class="insta">' + fotos.slice(0, 6).map(f => '<a href="' + esc(r.instagram || "#") + '" target="_blank" rel="noopener"><img src="' + esc(f) + '" alt="Foto de Instagram" loading="lazy"></a>').join("") + "</div>" : "") + "</div></section>",
      "Ropa para mujer: jeans, casacas, vestidos y lentes de sol",
      "Tienda online de ropa para mujer: jeans, casacas, shorts, faldas, vestidos, polos, tops y lentes de sol. Paga con Yape, Plin o tarjeta."
    );
  }

  /* ---------- Catálogo ---------- */
  function viewCatalog(q) {
    let list = PRODS.slice();
    let titulo = "Todos los productos";
    if (q.cat && catBy(q.cat)) { list = list.filter(p => p.categoria === q.cat); titulo = catBy(q.cat).nombre; }
    else if (q.grupo) { const slugs = CATS.filter(c => c.grupo === q.grupo).map(c => c.slug); list = list.filter(p => slugs.includes(p.categoria)); titulo = q.grupo; }
    if (q.oferta) { list = list.filter(enOferta); titulo = "Ofertas"; }
    if (q.nuevo) { list = list.filter(p => p.nuevo); titulo = "Recién llegados"; }
    if (q.q) { const n = norm(q.q); list = list.filter(p => norm(p.nombre + " " + (catBy(p.categoria) || {}).nombre + " " + p.desc).includes(n)); titulo = 'Resultados para "' + q.q + '"'; }

    const tallasDisp = []; const coloresDisp = [];
    list.forEach(p => { (p.tallas || []).forEach(t => { if (!tallasDisp.includes(t)) tallasDisp.push(t); }); (p.colores || []).forEach(c => { if (!coloresDisp.find(x => x.n === c.n)) coloresDisp.push(c); }); });
    const ordenTallas = ["XS", "S", "M", "L", "XL"];
    tallasDisp.sort((a, b) => (ordenTallas.indexOf(a) - ordenTallas.indexOf(b)) || (parseInt(a) - parseInt(b)));

    const selT = q.talla ? q.talla.split(",") : [];
    const selC = q.color ? q.color.split(",") : [];
    if (selT.length) list = list.filter(p => (p.tallas || []).some(t => selT.includes(t)));
    if (selC.length) list = list.filter(p => (p.colores || []).some(c => selC.includes(c.n)));
    if (q.min) list = list.filter(p => p.precio >= Number(q.min));
    if (q.max) list = list.filter(p => p.precio <= Number(q.max));
    const o = q.orden || "novedades";
    if (o === "menor") list.sort((a, b) => a.precio - b.precio);
    else if (o === "mayor") list.sort((a, b) => b.precio - a.precio);
    else list.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0));

    const hayFiltros = selT.length || selC.length || q.min || q.max;
    setPage(
      '<div class="wrap"><div class="page-head"><div class="crumbs"><a href="#/">Inicio</a> / ' + esc(titulo) + "</div><h1 style=\"font-size:clamp(1.9rem,5vw,3rem)\">" + esc(titulo) + "</h1></div>" +
      '<div class="catalog"><details class="filters" id="filters" open><summary>Filtros</summary>' +
      '<div class="f-group"><h4>Categoría</h4><div class="chips"><button class="chip" data-act="q" data-k="cat" data-v="" aria-pressed="' + (!q.cat && !q.grupo) + '">Todas</button>' +
      CATS.map(c => '<button class="chip" data-act="q" data-k="cat" data-v="' + c.slug + '" aria-pressed="' + (q.cat === c.slug) + '">' + esc(c.nombre) + "</button>").join("") + "</div></div>" +
      (tallasDisp.length ? '<div class="f-group"><h4>Talla</h4><div class="chips">' + tallasDisp.map(t => '<button class="chip" data-act="multi" data-k="talla" data-v="' + esc(t) + '" aria-pressed="' + selT.includes(t) + '">' + esc(t) + "</button>").join("") + "</div></div>" : "") +
      (coloresDisp.length ? '<div class="f-group"><h4>Color</h4><div class="chips">' + coloresDisp.map(c => '<button class="chip chip--sw" data-act="multi" data-k="color" data-v="' + esc(c.n) + '" aria-pressed="' + selC.includes(c.n) + '"><span class="sw" style="background:' + esc(c.hex) + '"></span>' + esc(c.n) + "</button>").join("") + "</div></div>" : "") +
      '<div class="f-group"><h4>Precio (' + esc(T.moneda) + ')</h4><div class="range"><input type="number" min="0" inputmode="numeric" placeholder="Mín." aria-label="Precio mínimo" id="pmin" value="' + esc(q.min || "") + '"><input type="number" min="0" inputmode="numeric" placeholder="Máx." aria-label="Precio máximo" id="pmax" value="' + esc(q.max || "") + '"></div></div>' +
      (hayFiltros ? '<p style="margin:16px 0 0"><button class="link" data-act="clear">Quitar filtros</button></p>' : "") + "</details>" +
      "<div><div class=\"toolbar\"><span>" + list.length + " producto" + (list.length === 1 ? "" : "s") + '</span><label><span class="sr">Ordenar por</span><select id="orden"><option value="novedades"' + (o === "novedades" ? " selected" : "") + '>Novedades</option><option value="menor"' + (o === "menor" ? " selected" : "") + '>Precio: de menor a mayor</option><option value="mayor"' + (o === "mayor" ? " selected" : "") + ">Precio: de mayor a menor</option></select></label></div>" +
      (list.length ? gridHTML(list) : '<div class="empty"><h3>No hay productos con esos filtros</h3><p>Prueba quitando algún filtro o escríbenos por WhatsApp y te ayudamos a encontrarlo.</p><button class="btn" data-act="clear">Quitar filtros</button></div>') + "</div></div></div>",
      titulo, "Compra " + titulo.toLowerCase() + " para mujer en nuestra tienda online."
    );
    if (window.innerWidth < 900) $("#filters").open = false;
    $("#orden").addEventListener("change", e => setQuery({ orden: e.target.value }));
    ["pmin", "pmax"].forEach(id => $("#" + id).addEventListener("change", () => setQuery({ min: $("#pmin").value, max: $("#pmax").value })));
  }
  function setQuery(ch) {
    const { q } = parseHash();
    const cur = Object.assign({}, q, ch);
    if (ch.cat !== undefined) delete cur.grupo;
    if (ch.cat) { delete cur.oferta; delete cur.nuevo; }
    const qs = Object.keys(cur).filter(k => cur[k] !== "" && cur[k] != null).map(k => k + "=" + encodeURIComponent(cur[k])).join("&");
    keepScroll = true;
    location.hash = "#/catalogo" + (qs ? "?" + qs : "");
  }

  /* ---------- Producto ---------- */
  let sel = { talla: "", color: "", qty: 1 };
  function viewProduct(id) {
    const p = PRODS.find(x => x.id === id);
    if (!p) return setPage('<div class="wrap"><div class="empty" style="margin:40px 0"><h3>Este producto ya no está disponible</h3><a class="btn" href="#/catalogo">Ver el catálogo</a></div></div>', "Producto no disponible");
    const c = catBy(p.categoria);
    const unaTalla = (p.tallas || []).length === 1;
    sel = { talla: unaTalla ? p.tallas[0] : "", color: (p.colores && p.colores.length === 1) ? p.colores[0].n : "", qty: 1 };
    const agotado = !(p.stock > 0);
    const rel = PRODS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 4);
    const imgs = p.imagenes || [];
    setPage(
      '<div class="wrap"><div class="page-head"><div class="crumbs"><a href="#/">Inicio</a> / <a href="#/catalogo?cat=' + p.categoria + '">' + esc(c ? c.nombre : "Catálogo") + "</a> / " + esc(p.nombre) + "</div></div>" +
      '<div class="product"><div class="gallery"><div class="gallery__main" id="gMain">' + mediaHTML(p, null, 0) + "</div>" +
      (imgs.length > 1 ? '<div class="gallery__thumbs">' + imgs.map((u, i) => '<button data-act="thumb" data-i="' + i + '" aria-label="Ver foto ' + (i + 1) + '" aria-current="' + (i === 0) + '"><img src="' + esc(u) + '" alt=""></button>').join("") + "</div>" : "") + "</div>" +
      '<div class="pinfo"><h1>' + esc(p.nombre) + '</h1><div class="price">' + money(p.precio) + (enOferta(p) ? "<s>" + money(p.precioAntes) + "</s> <span class=\"pill pill--sale\">-" + pct(p) + "%</span>" : "") + "</div>" +
      "<p>" + esc(p.desc) + "</p>" +
      ((p.colores || []).length ? '<div class="opt"><h4>Color: <small id="colorName">' + (sel.color ? esc(sel.color) : "elige uno") + '</small></h4><div class="chips">' + p.colores.map(k => '<button class="chip chip--sw" data-act="color" data-v="' + esc(k.n) + '" data-hex="' + esc(k.hex) + '" aria-pressed="' + (sel.color === k.n) + '"><span class="sw" style="background:' + esc(k.hex) + '"></span>' + esc(k.n) + "</button>").join("") + "</div></div>" : "") +
      '<div class="opt"><h4>Talla</h4><div class="chips">' + (p.tallas || []).map(t => '<button class="chip" data-act="talla" data-v="' + esc(t) + '" aria-pressed="' + (sel.talla === t) + '">' + esc(t) + "</button>").join("") + "</div></div>" +
      '<div class="opt"><h4>Cantidad</h4><div class="qty"><button data-act="pqty" data-d="-1" aria-label="Menos">−</button><span id="pq" aria-live="polite">1</span><button data-act="pqty" data-d="1" aria-label="Más">+</button></div> <small>' + (agotado ? "Agotado" : p.stock <= 5 ? "Quedan " + p.stock + " unidades" : "Disponible") + "</small></div>" +
      '<p class="msg-err" id="perr" role="alert"></p>' +
      '<div class="buy"><button class="btn btn--block" data-act="add" data-id="' + p.id + '"' + (agotado ? " disabled" : "") + '>Agregar al carrito</button>' +
      '<button class="btn btn--wa btn--block" data-act="pwa" data-id="' + p.id + '">Pedir por WhatsApp</button></div>' +
      '<div class="perks"><span><b>Envíos:</b> delivery, agencia o recojo en tienda.</span><span><b>Pagos:</b> Yape, Plin, tarjeta o transferencia.</span><span><b>¿Dudas con la talla?</b> Escríbenos y te asesoramos.</span></div></div></div>' +
      (rel.length ? '<section class="section" style="padding-top:0"><div class="section__head"><h2>También te puede gustar</h2></div>' + gridHTML(rel) + "</section>" : "") + "</div>",
      p.nombre, p.desc
    );
    const g = $("#gMain");
    g.addEventListener("mousemove", e => { const r = g.getBoundingClientRect(); g.style.setProperty("--zx", ((e.clientX - r.left) / r.width * 100) + "%"); g.style.setProperty("--zy", ((e.clientY - r.top) / r.height * 100) + "%"); });
    g.addEventListener("click", () => { if ($("img", g)) g.classList.toggle("zoom"); });
    g.addEventListener("mouseleave", () => g.classList.remove("zoom"));
    track("view_item", { items: [{ item_id: p.id, item_name: p.nombre, price: p.precio }] });
  }

  function addToCart(id, silencioso) {
    const p = prodBy(id); const err = $("#perr");
    if (!sel.talla) { if (err) err.textContent = "Elige una talla para continuar."; return false; }
    if ((p.colores || []).length && !sel.color) { if (err) err.textContent = "Elige un color para continuar."; return false; }
    const key = [id, sel.talla, sel.color].join("|");
    const ex = cart.find(i => i.key === key);
    const ya = ex ? ex.qty : 0;
    if (ya + sel.qty > p.stock) { if (err) err.textContent = "Solo quedan " + p.stock + " unidades de este producto."; return false; }
    if (ex) ex.qty += sel.qty; else cart.push({ key, id, talla: sel.talla, color: sel.color, qty: sel.qty });
    saveCart();
    if (err) err.textContent = "";
    if (!silencioso) toast("Agregado al carrito");
    track("add_to_cart", { items: [{ item_id: p.id, item_name: p.nombre, price: p.precio, quantity: sel.qty }] });
    return true;
  }

  /* ---------- Carrito ---------- */
  function viewCart() {
    cart = cart.filter(i => prodBy(i.id));
    if (!cart.length) {
      return setPage('<div class="wrap"><div class="empty" style="margin:40px 0"><h3>Tu carrito está vacío</h3><p>Agrega tus prendas favoritas para empezar.</p><a class="btn" href="#/catalogo">Ver productos</a></div></div>', "Carrito");
    }
    const t = totales(null);
    setPage('<div class="wrap"><div class="page-head"><h1 style="font-size:clamp(1.9rem,5vw,3rem)">Tu carrito</h1></div><div class="cart"><div id="lines">' + cartLines() + "</div>" +
      '<aside class="summary"><h2>Resumen</h2><div id="sumBody">' + summaryBody(t, null) + '</div><a class="btn btn--stitch btn--block" href="#/checkout">Continuar con el pedido</a><p style="margin:12px 0 0;font-size:.88rem;color:var(--muted)">El envío se calcula en el siguiente paso.</p></aside></div></div>', "Carrito");
  }
  function cartLines() {
    return cart.map(i => {
      const p = prodBy(i.id); if (!p) return "";
      const hex = ((p.colores || []).find(c => c.n === i.color) || {}).hex;
      return '<div class="line"><a href="#/producto/' + p.id + '">' + mediaHTML(p, hex) + '</a><div><h3><a href="#/producto/' + p.id + '">' + esc(p.nombre) + '</a></h3><div class="line__meta">Talla ' + esc(i.talla) + (i.color ? " · " + esc(i.color) : "") + " · " + money(p.precio) + '</div>' +
        '<div class="qty" style="margin-top:8px"><button data-act="cqty" data-k="' + esc(i.key) + '" data-d="-1" aria-label="Menos">−</button><span>' + i.qty + '</span><button data-act="cqty" data-k="' + esc(i.key) + '" data-d="1" aria-label="Más">+</button></div></div>' +
        '<div class="line__end"><b>' + money(p.precio * i.qty) + '</b><button class="link" data-act="crm" data-k="' + esc(i.key) + '">Quitar</button></div></div>';
    }).join("");
  }
  function summaryBody(t, metodo) {
    return '<div class="row"><span>Subtotal</span><span>' + money(t.subtotal) + "</span></div>" +
      (t.descuento ? '<div class="row"><span>Descuento (' + esc(t.cupon.codigo) + ')</span><span>-' + money(t.descuento) + "</span></div>" : "") +
      (metodo ? '<div class="row"><span>Envío</span><span>' + (t.envio === 0 ? "Gratis" : money(t.envio)) + "</span></div>" : "") +
      '<div class="coupon"><input id="cup" type="text" placeholder="Código de cupón" aria-label="Código de cupón" value="' + esc(cuponCodigo) + '" autocomplete="off"><button class="btn btn--ghost" type="button" data-act="cupon">Aplicar</button></div>' +
      (t.errorCupon ? '<p class="msg-err" role="alert" style="margin:0 0 8px">' + esc(t.errorCupon) + "</p>" : (t.cupon ? '<p style="color:var(--ok);font-weight:600;margin:0 0 8px">Cupón aplicado. <button class="link" type="button" data-act="cupon-off">Quitar</button></p>' : "")) +
      '<div class="row row--total"><span>Total</span><span>' + money(t.total) + "</span></div>";
  }
  function refreshSummary() {
    const m = $("input[name=envio]:checked");
    const metodo = m ? m.value : null;
    const t = totales(metodo);
    const sb = $("#sumBody"); if (sb) sb.innerHTML = summaryBody(t, metodo);
    const ln = $("#lines"); if (ln) ln.innerHTML = cartLines();
  }

  /* ---------- Checkout ---------- */
  const DEPARTAMENTOS = ["Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"];
  function viewCheckout() {
    cart = cart.filter(i => prodBy(i.id));
    if (!cart.length) return (location.hash = "#/carrito");
    const E = T.envios, P = T.pagos;
    const saved = store.get("tienda_cliente", {});
    const envioOpts = Object.keys(E).map((k, i) => '<label class="optrow"><input type="radio" name="envio" value="' + k + '"' + (i === 0 ? " checked" : "") + '><span><b>' + esc(E[k].nombre) + " · <span id=\"ec-" + k + '"></span></b><small>' + esc(E[k].tiempo || "") + "</small></span></label>").join("");
    setPage('<div class="wrap"><div class="page-head"><div class="crumbs"><a href="#/carrito">Carrito</a> / Datos del pedido</div><h1 style="font-size:clamp(1.9rem,5vw,3rem)">Finalizar pedido</h1></div>' +
      '<div class="cart"><form class="form" id="ckForm" novalidate>' +
      '<fieldset class="fieldset"><legend>Tus datos</legend><div class="grid2">' +
      fld("nombre", "Nombre y apellido", "text", saved.nombre, "name") + fld("celular", "Celular", "tel", saved.celular, "tel", "9 dígitos, por ejemplo 987654321") +
      fld("email", "Correo (opcional)", "email", saved.email, "email") + fld("dni", "DNI (opcional)", "text", saved.dni, "off") + "</div></fieldset>" +
      '<fieldset class="fieldset"><legend>Entrega</legend><div class="opts" id="envOpts">' + envioOpts + '</div><div id="dir" style="margin-top:14px"></div></fieldset>' +
      '<fieldset class="fieldset"><legend>Forma de pago</legend><div class="opts" id="payOpts"></div><div id="payInfo" style="margin-top:12px"></div>' +
      '<p class="secure" style="margin:14px 0 0">Pagas después de enviar el pedido. Los datos de tu tarjeta nunca se piden en esta página: se procesan en la pasarela de pago.</p></fieldset>' +
      '<div class="field"><label for="notas">Notas del pedido (opcional)</label><textarea id="notas" placeholder="Referencia de la dirección, horario de entrega, etc."></textarea></div>' +
      '<p class="msg-err" id="formErr" role="alert"></p>' +
      '<button class="btn btn--stitch btn--block" type="submit" id="submitBtn">Enviar pedido</button></form>' +
      '<aside class="summary"><h2>Tu pedido</h2><div id="mini">' + miniItems() + '</div><div id="sumBody"></div></aside></div></div>', "Finalizar pedido");
    renderDir(); renderPayOpts(); refreshSummary(); shipCosts();
    $("#envOpts").addEventListener("change", () => { renderDir(); renderPayOpts(); refreshSummary(); });
    $("#payOpts").addEventListener("change", renderPayInfo);
    $("#ckForm").addEventListener("submit", submitOrder);
    track("begin_checkout", {});
  }
  const fld = (id, label, type, val, ac, hint) => '<div class="field" id="f-' + id + '"><label for="' + id + '">' + label + '</label><input id="' + id + '" name="' + id + '" type="' + type + '" value="' + esc(val || "") + '" autocomplete="' + ac + '">' + (hint ? '<div class="hint">' + hint + "</div>" : "") + '<div class="err" role="alert"></div></div>';
  function miniItems() {
    return cart.map(i => { const p = prodBy(i.id); return '<div class="row"><span>' + i.qty + " × " + esc(p.nombre) + '<br><small style="color:var(--muted)">Talla ' + esc(i.talla) + (i.color ? " · " + esc(i.color) : "") + "</small></span><span>" + money(p.precio * i.qty) + "</span></div>"; }).join("");
  }
  function shipCosts() {
    const t0 = totales(null);
    Object.keys(T.envios).forEach(k => {
      const e = T.envios[k]; const el = $("#ec-" + k); if (!el) return;
      const c = totales(k).envio;
      el.textContent = c === 0 ? "Gratis" : money(c);
      if (e.gratisDesde && c !== 0 && t0.subtotal < e.gratisDesde) el.textContent += " (gratis desde " + money(e.gratisDesde) + ")";
    });
  }
  function renderDir() {
    const m = $("input[name=envio]:checked").value; const d = $("#dir");
    if (m === "recojo") { d.innerHTML = '<p style="margin:0"><b>Recojo en:</b> ' + esc(T.direccionTienda) + "<br>" + esc(T.horario) + "</p>"; return; }
    const doms = (T.envios.domicilio.departamentos || []);
    const deptos = m === "domicilio" && doms.length ? doms : DEPARTAMENTOS;
    d.innerHTML = '<div class="grid2"><div class="field" id="f-depto"><label for="depto">Departamento</label><select id="depto"><option value="">Elige</option>' + deptos.map(x => "<option>" + esc(x) + "</option>").join("") + '</select><div class="err" role="alert"></div></div>' +
      fld("prov", "Provincia", "text", "", "address-level2") + fld("dist", "Distrito", "text", "", "address-level3") +
      (m === "agencia" ? '<div class="field" id="f-agencia"><label for="agencia">Agencia</label><select id="agencia">' + T.envios.agencia.agencias.map(x => "<option>" + esc(x) + "</option>").join("") + '</select></div>' : "") + "</div>" +
      fld("direccion", m === "agencia" ? "Sede de la agencia donde recogerás" : "Dirección", "text", "", "street-address") +
      (m === "domicilio" ? fld("ref", "Referencia (opcional)", "text", "", "off") : "");
  }
  function payList() {
    const P = T.pagos; const m = $("input[name=envio]:checked").value; const out = [];
    if (P.yape.activo) out.push(["yape", "Yape", "Escanea el QR o yapea al número. Te lo mostramos al enviar el pedido."]);
    if (P.plin.activo) out.push(["plin", "Plin", "Transfiere por Plin al número de la tienda."]);
    if (P.tarjeta.activo) out.push(["tarjeta", "Tarjeta de crédito o débito", cardOnline() ? "Paga aquí mismo con Visa, Mastercard, American Express o Diners." : "Visa, Mastercard, American Express o Diners."]);
    if (P.transferencia.activo) out.push(["transferencia", "Transferencia bancaria", "BCP, BBVA o Interbank."]);
    if (P.contraEntrega.activo && P.contraEntrega.soloZonas.includes(m)) out.push(["contraentrega", m === "recojo" ? "Pago al recoger en tienda" : "Pago contra entrega", "Pagas en efectivo cuando recibes tu pedido."]);
    return out;
  }
  function renderPayOpts() {
    const prev = ($("input[name=pago]:checked") || {}).value;
    const l = payList();
    $("#payOpts").innerHTML = l.map((x, i) => '<label class="optrow"><input type="radio" name="pago" value="' + x[0] + '"' + ((prev ? prev === x[0] : i === 0) ? " checked" : "") + "><span><b>" + x[1] + "</b><small>" + x[2] + "</small></span></label>").join("");
    if (!$("input[name=pago]:checked") && l.length) $("input[name=pago]").checked = true;
    renderPayInfo();
  }
  function renderPayInfo() {
    const v = ($("input[name=pago]:checked") || {}).value;
    $("#payInfo").innerHTML = v === "tarjeta" ? '<p style="margin:0">' + (cardOnline() ? "Al continuar se abre el formulario seguro de Culqi para ingresar los datos de tu tarjeta. Necesitamos tu correo para enviarte el comprobante." : esc(T.pagos.tarjeta.nota)) + "</p>" : "";
    const b = $("#submitBtn"); if (b && !b.disabled) b.textContent = (v === "tarjeta" && cardOnline()) ? "Pagar con tarjeta" : "Enviar pedido";
  }

  function setErr(id, msg) { const f = $("#f-" + id); if (!f) return; f.classList.toggle("bad", !!msg); const e = $(".err", f); if (e) e.textContent = msg || ""; }
  function submitOrder(ev) {
    ev.preventDefault();
    const v = id => { const el = $("#" + id); return el ? el.value.trim() : ""; };
    const metodo = $("input[name=envio]:checked").value;
    const pago = ($("input[name=pago]:checked") || {}).value;
    let ok = true; let first = null;
    const bad = (id, m) => { setErr(id, m); if (m) { ok = false; if (!first) first = id; } };
    bad("nombre", v("nombre").length < 3 ? "Escribe tu nombre y apellido." : "");
    bad("celular", /^9\d{8}$/.test(v("celular").replace(/\s/g, "")) ? "" : "Escribe un celular de 9 dígitos que empiece con 9.");
    const necesitaCorreo = pago === "tarjeta" && cardOnline();
    bad("email", necesitaCorreo && !v("email") ? "Escribe tu correo: lo necesitamos para el pago con tarjeta." : (v("email") && !/^\S+@\S+\.\S+$/.test(v("email")) ? "Revisa el correo: parece incompleto." : ""));
    if (metodo !== "recojo") {
      bad("depto", v("depto") ? "" : "Elige un departamento.");
      bad("prov", v("prov") ? "" : "Escribe la provincia.");
      bad("dist", v("dist") ? "" : "Escribe el distrito.");
      bad("direccion", v("direccion").length < 5 ? "Escribe la dirección completa." : "");
    }
    if (!pago) { $("#formErr").textContent = "Elige una forma de pago."; ok = false; }
    else if (ok) $("#formErr").textContent = "";
    if (!ok) { if (first) { const el = $("#" + first); if (el) el.focus(); } return; }

    const t = totales(metodo);
    const o = {
      codigo: "P" + Date.now().toString(36).toUpperCase().slice(-6),
      fecha: new Date().toLocaleString("es-PE"),
      cliente: { nombre: v("nombre"), celular: v("celular").replace(/\s/g, ""), email: v("email"), dni: v("dni") },
      envio: { metodo, nombre: T.envios[metodo].nombre, depto: v("depto"), prov: v("prov"), dist: v("dist"), direccion: v("direccion"), ref: v("ref"), agencia: v("agencia") },
      pago, notas: v("notas"),
      items: cart.map(i => { const p = prodBy(i.id); return { id: i.id, nombre: p.nombre, talla: i.talla, color: i.color, qty: i.qty, precio: p.precio }; }),
      subtotal: t.subtotal, descuento: t.descuento, cupon: t.cupon ? t.cupon.codigo : "", costoEnvio: t.envio, total: t.total
    };
    store.set("tienda_cliente", { nombre: o.cliente.nombre, celular: o.cliente.celular, email: o.cliente.email, dni: o.cliente.dni });
    if (pago === "tarjeta" && cardOnline()) payWithCard(o);
    else finalizeOrder(o);
  }

  function finalizeOrder(o) {
    store.set("tienda_ultimo_pedido", o);
    if (T.formspree) {
      try { fetch(T.formspree, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ pedido: o.codigo, mensaje: orderText(o) }) }).catch(() => {}); } catch (e) { /* ignorar */ }
    }
    track("purchase", { transaction_id: o.codigo, value: o.total, currency: "PEN" });
    cart = []; cuponCodigo = ""; store.set("tienda_cupon", ""); saveCart();
    location.hash = "#/pedido";
  }

  /* ---------- Pago con tarjeta dentro de la página (Culqi) ----------
     El formulario de tarjeta lo muestra Culqi (no esta página), así que los datos
     de la tarjeta nunca pasan por aquí. Culqi devuelve un token y el cobro lo hace
     la función netlify/functions/culqi-charge.js con la llave secreta. */
  const cardOnline = () => !!(T.pagos.tarjeta.activo && T.pagos.tarjeta.culqi && T.pagos.tarjeta.culqi.publicKey);
  let culqiLoading;
  function loadCulqi() {
    if (window.CulqiCheckout) return Promise.resolve();
    if (!culqiLoading) culqiLoading = new Promise((ok, fail) => {
      const s = document.createElement("script"); s.src = "https://js.culqi.com/checkout-js";
      s.onload = ok; s.onerror = () => { culqiLoading = null; fail(new Error("culqi")); };
      document.head.appendChild(s);
    });
    return culqiLoading;
  }
  function formMsg(m) { const e = $("#formErr"); if (e) e.textContent = m || ""; }
  function busy(on) { const b = $("#submitBtn"); if (!b) return; b.disabled = on; if (on) b.textContent = "Procesando tu pago…"; else renderPayInfo(); }

function payWithCard(o) {
  // 1. Crear ventana modal interactiva
  const modalHTML = `
    <div id="modal-tarjeta-simulada" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:99999;font-family:sans-serif;">
      <div style="background:#fff;border-radius:12px;padding:24px;width:90%;max-width:380px;box-shadow:0 10px 25px rgba(0,0,0,0.2);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3 style="margin:0;font-size:18px;color:#1e293b;">Pagar con Tarjeta</h3>
          <span style="font-weight:bold;color:#059669;">S/ ${o.total.toFixed(2)}</span>
        </div>
        
        <form id="form-tarjeta-test">
          <label style="font-size:12px;color:#64748b;display:block;margin-bottom:4px;">Número de Tarjeta</label>
          <input type="text" id="sim-num" placeholder="4111 1111 1111 1111" required maxlength="19" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #cbd5e1;border-radius:6px;margin-bottom:12px;font-size:14px;">
          
          <div style="display:flex;gap:10px;margin-bottom:12px;">
            <div style="flex:1;">
              <label style="font-size:12px;color:#64748b;display:block;margin-bottom:4px;">Vencimiento</label>
              <input type="text" id="sim-exp" placeholder="MM/AA" required maxlength="5" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #cbd5e1;border-radius:6px;font-size:14px;">
            </div>
            <div style="flex:1;">
              <label style="font-size:12px;color:#64748b;display:block;margin-bottom:4px;">CVV</label>
              <input type="text" id="sim-cvv" placeholder="123" required maxlength="4" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #cbd5e1;border-radius:6px;font-size:14px;">
            </div>
          </div>
          
          <button type="submit" id="btn-sim-pagar" style="width:100%;background:#0284c7;color:#fff;border:none;padding:12px;border-radius:6px;font-weight:bold;cursor:pointer;font-size:15px;">
            Confirmar y Pagar
          </button>
          
          <button type="button" id="btn-sim-cancelar" style="width:100%;background:none;border:none;color:#64748b;margin-top:8px;padding:6px;cursor:pointer;font-size:13px;">
            Cancelar
          </button>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('modal-tarjeta-simulada');
  const form = document.getElementById('form-tarjeta-test');
  const btnPagar = document.getElementById('btn-sim-pagar');

  document.getElementById('btn-sim-cancelar').onclick = () => modal.remove();

  form.onsubmit = function(e) {
    e.preventDefault();
    btnPagar.disabled = true;
    btnPagar.innerText = "Procesando pago...";
    btnPagar.style.background = "#94a3b8";

    // Simula procesamiento
    setTimeout(() => {
      btnPagar.innerText = "¡Pago Aprobado!";
      btnPagar.style.background = "#16a34a";

      setTimeout(() => {
        modal.remove();
        o.pagado = true;
        o.operacion = "SIM-" + Math.floor(100000 + Math.random() * 900000);
        finalizeOrder(o);
      }, 800);
    }, 1200);
  };
}

  function cobrar(o, tokenId) {
    busy(true); formMsg("");
    fetch("/.netlify/functions/culqi-charge", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: tokenId, pedido: o.codigo, cliente: o.cliente, envio: o.envio, cupon: o.cupon, montoEsperado: o.total,
        items: o.items.map(i => ({ id: i.id, qty: i.qty, talla: i.talla, color: i.color }))
      })
    }).then(r => r.json().catch(() => ({})).then(d => ({ ok: r.ok, d: d })))
      .then(x => {
        if (x.ok && x.d.ok) { o.pagado = true; o.operacion = x.d.operacion; finalizeOrder(o); }
        else { busy(false); formMsg((x.d && x.d.mensaje) || "No pudimos procesar el pago. No se te cobró. Inténtalo de nuevo o elige otra forma de pago."); }
      })
      .catch(() => { busy(false); formMsg("No pudimos conectar con el servicio de pagos. No se te cobró. Inténtalo de nuevo en un momento."); });
  }

  const PAGO_NOMBRE = { yape: "Yape", plin: "Plin", tarjeta: "Tarjeta", transferencia: "Transferencia bancaria", contraentrega: "Contra entrega / al recoger" };
  function orderText(o) {
    const l = ["*Pedido " + o.codigo + " - " + T.nombre + "*", "", "*Cliente:* " + o.cliente.nombre, "*Celular:* " + o.cliente.celular];
    if (o.cliente.email) l.push("*Correo:* " + o.cliente.email);
    l.push("", "*Productos:*");
    o.items.forEach(i => l.push("- " + i.qty + " x " + i.nombre + " (talla " + i.talla + (i.color ? ", " + i.color : "") + ") " + money(i.precio * i.qty)));
    l.push("", "Subtotal: " + money(o.subtotal));
    if (o.descuento) l.push("Descuento (" + o.cupon + "): -" + money(o.descuento));
    l.push("Envío: " + (o.costoEnvio === 0 ? "Gratis" : money(o.costoEnvio)), "*Total: " + money(o.total) + "*", "");
    l.push("*Entrega:* " + o.envio.nombre);
    if (o.envio.metodo !== "recojo") {
      l.push(o.envio.depto + ", " + o.envio.prov + ", " + o.envio.dist, o.envio.direccion + (o.envio.ref ? " (Ref: " + o.envio.ref + ")" : ""));
      if (o.envio.metodo === "agencia") l.push("Agencia: " + o.envio.agencia);
    }
    l.push("*Pago:* " + (PAGO_NOMBRE[o.pago] || o.pago) + (o.pagado ? " (PAGADO, operación " + o.operacion + ")" : ""));
    if (o.notas) l.push("*Notas:* " + o.notas);
    return l.join("\n");
  }

  function viewDone() {
    const o = store.get("tienda_ultimo_pedido", null);
    if (!o) return (location.hash = "#/");
    const P = T.pagos; let pagoHTML = "";
    const qr = (src, alt) => '<figure><img src="' + esc(src) + '" alt="' + alt + '" onerror="this.closest(\'figure\').style.display=\'none\'"><figcaption>' + alt + "</figcaption></figure>";
    if (o.pago === "yape") pagoHTML = "<h2>Paga con Yape</h2><dl><dt>Número</dt><dd>" + esc(P.yape.numero) + "</dd><dt>A nombre de</dt><dd>" + esc(P.yape.titular) + "</dd><dt>Monto</dt><dd>" + money(o.total) + '</dd></dl><div class="qrs">' + qr(P.yape.qr, "QR de Yape") + "</div>";
    else if (o.pago === "plin") pagoHTML = "<h2>Paga con Plin</h2><dl><dt>Número</dt><dd>" + esc(P.plin.numero) + "</dd><dt>A nombre de</dt><dd>" + esc(P.plin.titular) + "</dd><dt>Monto</dt><dd>" + money(o.total) + '</dd></dl><div class="qrs">' + qr(P.plin.qr, "QR de Plin") + "</div>";
    else if (o.pago === "transferencia") pagoHTML = "<h2>Paga por transferencia</h2><p>Monto: <b>" + money(o.total) + "</b></p>" + P.transferencia.cuentas.map(c => '<dl style="margin-bottom:12px"><dt>Banco</dt><dd>' + esc(c.banco) + "</dd><dt>Cuenta</dt><dd>" + esc(c.cuenta) + "</dd><dt>CCI</dt><dd>" + esc(c.cci) + "</dd><dt>Titular</dt><dd>" + esc(c.titular) + "</dd></dl>").join("");
    else if (o.pago === "tarjeta" && o.pagado) pagoHTML = "<h2>Pago con tarjeta aprobado</h2><dl><dt>Monto</dt><dd>" + money(o.total) + "</dd><dt>Operación</dt><dd>" + esc(o.operacion || "") + "</dd></dl>";
    else if (o.pago === "tarjeta") pagoHTML = "<h2>Paga con tarjeta</h2><p>" + esc(P.tarjeta.nota) + " Envía tu pedido por WhatsApp con el botón de abajo para recibir el link.</p>";
    else pagoHTML = "<h2>Pago " + (o.envio.metodo === "recojo" ? "al recoger" : "contra entrega") + "</h2><p>Pagarás <b>" + money(o.total) + "</b> en efectivo cuando " + (o.envio.metodo === "recojo" ? "recojas tu pedido." : "recibas tu pedido.") + "</p>";
    const pasos = o.pago === "contraentrega"
      ? "<li>Envía tu pedido por WhatsApp para confirmarlo.</li><li>Te avisamos cuando esté listo.</li>"
      : "<li>Haz el pago" + (o.pago === "tarjeta" ? " con el link que te enviaremos" : "") + ".</li><li>Envía tu pedido" + (o.pago === "tarjeta" ? "" : " y la captura del pago") + " por WhatsApp con el botón verde.</li><li>Confirmamos tu pago y preparamos tu envío.</li>";
    const pagado = !!o.pagado;
    setPage('<div class="wrap"><div class="done"><h1>' + (pagado ? "Pago recibido: pedido " + esc(o.codigo) : "Pedido " + esc(o.codigo) + " listo para confirmar") + "</h1>" +
      "<p>Gracias, " + esc(o.cliente.nombre.split(" ")[0]) + ". " + (pagado ? "Tu pago fue aprobado. Para que preparemos tu envío, avísanos por WhatsApp con el botón verde." : "Tu pedido aún no está confirmado: sigue estos pasos.") + "</p>" +
      (pagado ? "" : '<ol class="steps">' + pasos + "</ol>") +
      '<div class="box">' + pagoHTML + "</div>" +
      '<div class="box"><h2 style="font-size:1.2rem;margin-bottom:10px">Resumen</h2>' + o.items.map(i => '<div class="row"><span>' + i.qty + " × " + esc(i.nombre) + " (talla " + esc(i.talla) + (i.color ? ", " + esc(i.color) : "") + ")</span><span>" + money(i.precio * i.qty) + "</span></div>").join("") +
      '<div class="row"><span>Envío</span><span>' + (o.costoEnvio === 0 ? "Gratis" : money(o.costoEnvio)) + "</span></div>" + (o.descuento ? '<div class="row"><span>Descuento</span><span>-' + money(o.descuento) + "</span></div>" : "") + '<div class="row row--total"><span>Total</span><span>' + money(o.total) + "</span></div></div>" +
      '<a class="btn btn--wa btn--block" target="_blank" rel="noopener" href="' + wa(orderText(o)) + '">Enviar mi pedido por WhatsApp</a>' +
      '<p style="margin-top:16px"><a class="link" href="#/catalogo">Seguir comprando</a></p></div></div>', "Pedido " + o.codigo);
  }

  /* ---------- Favoritos ---------- */
  function viewFavs() {
    const list = favs.map(prodBy).filter(Boolean);
    setPage('<div class="wrap"><div class="page-head"><h1 style="font-size:clamp(1.9rem,5vw,3rem)">Lista de deseos</h1></div><div style="padding-bottom:56px">' +
      (list.length ? gridHTML(list) : '<div class="empty"><h3>Aún no guardas nada</h3><p>Toca el corazón en un producto para guardarlo aquí.</p><a class="btn" href="#/catalogo">Ver productos</a></div>') + "</div></div>", "Lista de deseos");
  }

  /* ---------- Páginas de texto ---------- */
  function viewAbout() {
    setPage('<div class="wrap"><div class="prose"><h1>Nosotras</h1><p>En ' + esc(T.nombre) + " vestimos a mujeres que quieren verse bien sin complicarse. Empezamos con jeans y casacas, y hoy tenemos también vestidos, faldas, polos, tops, yoggers y lentes de sol.</p>" +
      "<p>Cuidamos el calce, el material y el precio de cada prenda. Si dudas de tu talla, escríbenos por WhatsApp y te ayudamos a elegir.</p><p><a class=\"btn\" href=\"#/catalogo\">Ver la colección</a></p></div></div>", "Nosotras");
  }
  function viewContact() {
    setPage('<div class="wrap"><div class="prose"><h1>Contacto</h1><p>Escríbenos y respondemos lo antes posible.</p>' +
      '<p><b>WhatsApp:</b> <a href="' + wa("Hola, quisiera información") + '" target="_blank" rel="noopener">+' + esc(T.whatsapp) + "</a><br><b>Correo:</b> " + esc(T.email) + "<br><b>Dirección:</b> " + esc(T.direccionTienda) + "<br><b>Horario:</b> " + esc(T.horario) + "</p>" +
      '<form class="form" id="contactForm"><div class="field"><label for="cn">Tu nombre</label><input id="cn" required></div><div class="field"><label for="cm">Mensaje</label><textarea id="cm" required></textarea></div><button class="btn btn--wa" type="submit">Enviar por WhatsApp</button></form></div></div>', "Contacto");
    $("#contactForm").addEventListener("submit", e => { e.preventDefault(); window.open(wa("Hola, soy " + $("#cn").value + ". " + $("#cm").value), "_blank", "noopener"); });
  }
  function viewFaq() {
    const E = T.envios;
    const q = [
      ["¿Cómo puedo pagar?", "Con Yape, Plin, tarjeta de crédito o débito, transferencia bancaria o pago contra entrega en las zonas donde está disponible."],
      ["¿Cómo funciona el pago con Yape o Plin?", "Eliges la opción al hacer tu pedido, te mostramos el número y el QR, pagas y nos envías la captura por WhatsApp para confirmar."],
      ["¿Es seguro pagar con tarjeta?", "Sí. Esta página no pide ni guarda datos de tu tarjeta: pagas en el link seguro de la pasarela de pago que te enviamos."],
      ["¿Cuánto cuesta el envío?", E.domicilio.nombre + ": " + money(E.domicilio.costo) + " (gratis desde " + money(E.domicilio.gratisDesde) + "). " + E.agencia.nombre + ": " + money(E.agencia.costo) + " (gratis desde " + money(E.agencia.gratisDesde) + "). Recojo en tienda: gratis."],
      ["¿Cuánto demora mi pedido?", "Delivery: " + E.domicilio.tiempo + ". Agencia: " + E.agencia.tiempo],
      ["¿Cómo elijo mi talla?", "Cada producto muestra sus tallas disponibles. Si tienes dudas, escríbenos por WhatsApp con tu altura y medidas."],
      ["¿Puedo cambiar una prenda?", "Sí. Revisa las condiciones en la página de cambios y envíos."]
    ];
    setPage('<div class="wrap"><div class="prose faq"><h1>Preguntas frecuentes</h1>' + q.map(x => "<details><summary>" + esc(x[0]) + "</summary><p>" + esc(x[1]) + "</p></details>").join("") + "</div></div>", "Preguntas frecuentes");
  }
  function viewPolicies() {
    const E = T.envios;
    setPage('<div class="wrap"><div class="prose"><h1>Cambios y envíos</h1>' +
      "<h2>Envíos</h2><p>" + esc(E.domicilio.nombre) + ": " + money(E.domicilio.costo) + ", " + esc(E.domicilio.tiempo) + ". " + esc(E.agencia.nombre) + ": " + money(E.agencia.costo) + ". " + esc(E.agencia.tiempo) + " Recojo en tienda sin costo.</p>" +
      "<h2>Cambios</h2><p>Aceptamos cambios de talla o modelo dentro de los 7 días de recibido el pedido, con la prenda sin uso, con etiquetas y en su empaque. El costo del envío del cambio lo asume la clienta, salvo que la prenda llegue con falla.</p>" +
      "<h2>Devoluciones</h2><p>Si tu prenda llega con falla de fábrica o es distinta a la que pediste, escríbenos por WhatsApp con fotos dentro de las 48 horas y lo resolvemos.</p>" +
      "<h2>Prendas sin cambio</h2><p>Lentes de sol y prendas en oferta final no tienen cambio, salvo falla.</p>" +
      "<h2>Pagos</h2><p>Tu pedido se confirma cuando recibimos tu pago, o tu confirmación en caso de pago contra entrega.</p></div></div>", "Cambios y envíos");
  }

  /* ---------- Analítica opcional ---------- */
  function track(ev, data) {
    try {
      if (window.gtag) window.gtag("event", ev, data);
      if (window.fbq) {
        const m = { view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", purchase: "Purchase" }[ev];
        if (m) window.fbq("track", m, ev === "purchase" ? { value: data.value, currency: "PEN" } : {});
      }
    } catch (e) { /* ignorar */ }
  }
  function loadAnalytics() {
    const a = T.analitica || {};
    if (a.ga4) {
      const s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(a.ga4); document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", a.ga4);
    }
    if (a.metaPixel) {
      /* eslint-disable */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      /* eslint-enable */
      window.fbq("init", a.metaPixel); window.fbq("track", "PageView");
    }
  }
  function jsonLD() {
    const s = document.createElement("script"); s.type = "application/ld+json";
    s.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "OnlineStore", name: T.nombre, description: T.lema, email: T.email, telephone: "+" + T.whatsapp, areaServed: "PE", currenciesAccepted: "PEN", sameAs: Object.values(T.redes || {}).filter(Boolean) });
    document.head.appendChild(s);
  }

  /* ---------- Menú móvil ---------- */
  function closeMenu() { $("#nav").classList.remove("open"); document.body.classList.remove("nav-open"); $("#menuBtn").setAttribute("aria-expanded", "false"); }

  /* ---------- Eventos globales ---------- */
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-act]");
    if (!el) {
      if (document.body.classList.contains("nav-open") && !e.target.closest("#nav") && !e.target.closest("#menuBtn")) closeMenu();
      if (e.target.closest("#nav a")) closeMenu();
      return;
    }
    const act = el.dataset.act;
    if (act === "fav") {
      e.preventDefault(); const id = el.dataset.id;
      favs = favs.includes(id) ? favs.filter(x => x !== id) : favs.concat(id);
      saveFavs(); el.setAttribute("aria-pressed", String(favs.includes(id)));
      toast(favs.includes(id) ? "Guardado en tu lista de deseos" : "Quitado de tu lista de deseos");
      if (parseHash().parts[0] === "favoritos") { keepScroll = true; viewFavs(); }
    } else if (act === "q") setQuery({ [el.dataset.k]: el.dataset.v });
    else if (act === "multi") {
      const k = el.dataset.k, { q } = parseHash(); const cur = q[k] ? q[k].split(",") : [];
      const nx = cur.includes(el.dataset.v) ? cur.filter(x => x !== el.dataset.v) : cur.concat(el.dataset.v);
      setQuery({ [k]: nx.join(",") });
    } else if (act === "clear") { keepScroll = true; const { q } = parseHash(); const keep = ["cat", "grupo", "q", "oferta", "nuevo"].filter(k => q[k]).map(k => k + "=" + encodeURIComponent(q[k])).join("&"); location.hash = "#/catalogo" + (keep ? "?" + keep : ""); }
    else if (act === "color") { sel.color = el.dataset.v; $$("[data-act=color]").forEach(b => b.setAttribute("aria-pressed", String(b === el))); $("#colorName").textContent = sel.color; const p = prodBy(parseHash().parts[1]); if (p && !(p.imagenes || []).length) $("#gMain").innerHTML = mediaHTML(p, el.dataset.hex); $("#perr").textContent = ""; }
    else if (act === "talla") { sel.talla = el.dataset.v; $$("[data-act=talla]").forEach(b => b.setAttribute("aria-pressed", String(b === el))); $("#perr").textContent = ""; }
    else if (act === "pqty") { const p = prodBy(parseHash().parts[1]); sel.qty = Math.max(1, Math.min(p ? Math.max(1, p.stock) : 99, sel.qty + Number(el.dataset.d))); $("#pq").textContent = sel.qty; }
    else if (act === "thumb") { const p = prodBy(parseHash().parts[1]); $("#gMain").innerHTML = mediaHTML(p, null, Number(el.dataset.i)); $$("[data-act=thumb]").forEach(b => b.setAttribute("aria-current", String(b === el))); }
    else if (act === "add") { if (addToCart(el.dataset.id)) { /* se queda en la página para seguir comprando */ } }
    else if (act === "pwa") {
      const p = prodBy(el.dataset.id);
      if (!sel.talla) { $("#perr").textContent = "Elige una talla para continuar."; return; }
      window.open(wa("Hola, quiero pedir: " + sel.qty + " x " + p.nombre + " (talla " + sel.talla + (sel.color ? ", color " + sel.color : "") + ") a " + money(p.precio * sel.qty) + "."), "_blank", "noopener");
    }
    else if (act === "cqty") {
      const i = cart.find(x => x.key === el.dataset.k); const p = i && prodBy(i.id); if (!i) return;
      const n = i.qty + Number(el.dataset.d);
      if (n < 1) return;
      if (n > p.stock) { toast("Solo quedan " + p.stock + " unidades"); return; }
      i.qty = n; saveCart(); refreshSummary(); if ($("#mini")) $("#mini").innerHTML = miniItems();
    }
    else if (act === "crm") { cart = cart.filter(x => x.key !== el.dataset.k); saveCart(); if (!cart.length) viewCart(); else refreshSummary(); }
    else if (act === "cupon") { cuponCodigo = ($("#cup").value || "").trim(); store.set("tienda_cupon", cuponCodigo); refreshSummary(); shipCosts(); if (cuponCodigo && !totales(null).errorCupon) toast("Cupón aplicado"); }
    else if (act === "cupon-off") { cuponCodigo = ""; store.set("tienda_cupon", ""); refreshSummary(); shipCosts(); }
  });

  $("#menuBtn").addEventListener("click", () => {
    const open = $("#nav").classList.toggle("open");
    document.body.classList.toggle("nav-open", open);
    $("#menuBtn").setAttribute("aria-expanded", String(open));
  });
  $("#searchForm").addEventListener("submit", e => { e.preventDefault(); const v = $("#q").value.trim(); if (v) location.hash = "#/catalogo?q=" + encodeURIComponent(v); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  window.addEventListener("hashchange", route);

  /* ---------- Inicio ---------- */
  buildChrome(); updateBadges(); loadAnalytics(); jsonLD();
  if (PREVIEW) { const b = document.createElement("div"); b.className = "banner"; b.textContent = "Vista previa del borrador del panel admin. Solo tú ves estos cambios."; document.body.insertBefore(b, document.body.firstChild); }
  route();
})();
