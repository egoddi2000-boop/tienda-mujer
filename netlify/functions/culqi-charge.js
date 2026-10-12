/* ============================================================
   Cobro con tarjeta (Culqi) - función en servidor de Netlify
   Qué hace:
   1. Recibe el token de la tarjeta (creado por Culqi en el navegador).
   2. Recalcula el monto con los precios REALES de js/data.js y js/config.js
      (nunca confía en el monto que manda el navegador).
   3. Crea el cargo en Culqi con tu llave secreta.
   La llave secreta se configura en Netlify como CULQI_SECRET_KEY.
   Referencia de la API: https://apidocs.culqi.com (sección Cargos).
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const CULQI_URL = "https://api.culqi.com/v2/charges";

const json = (status, body) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body)
});
const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/* Carga js/data.js o js/config.js tal como los usa el navegador */
async function leerArchivo(nombre) {
  const candidatos = [
    path.join(process.env.LAMBDA_TASK_ROOT || "", nombre),
    path.join(process.cwd(), nombre),
    path.join(__dirname, "..", "..", nombre),
    path.join(__dirname, nombre)
  ];
  for (const c of candidatos) {
    try { return fs.readFileSync(c, "utf8"); } catch (e) { /* probar siguiente */ }
  }
  /* Respaldo: leerlo del sitio publicado (URL propia de Netlify, no del cliente) */
  if (process.env.URL) {
    const r = await fetch(process.env.URL.replace(/\/$/, "") + "/" + nombre);
    if (r.ok) return r.text();
  }
  throw new Error("No se encontró " + nombre);
}
function evaluar(src) {
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox, { timeout: 1000 });
  return sandbox.window;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return json(405, { ok: false, mensaje: "Método no permitido." });

  const secret = process.env.CULQI_SECRET_KEY;
  if (!secret) {
    console.error("Falta la variable CULQI_SECRET_KEY en Netlify.");
    return json(500, { ok: false, mensaje: "El pago con tarjeta aún no está configurado. No se te cobró. Elige otra forma de pago." });
  }

  let b;
  try { b = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { ok: false, mensaje: "Solicitud inválida." }); }

  if (typeof b.token !== "string" || !/^tkn_(test|live)_[A-Za-z0-9]+$/.test(b.token)) return json(400, { ok: false, mensaje: "Token de pago inválido." });
  const cli = b.cliente || {};
  if (typeof cli.email !== "string" || !/^\S+@\S+\.\S+$/.test(cli.email)) return json(400, { ok: false, mensaje: "Falta un correo válido." });
  if (!Array.isArray(b.items) || !b.items.length || b.items.length > 40) return json(400, { ok: false, mensaje: "Tu carrito está vacío." });

  let T, PRODUCTOS, CUPONES;
  try {
    T = evaluar(await leerArchivo("js/config.js")).TIENDA;
    const d = evaluar(await leerArchivo("js/data.js"));
    PRODUCTOS = d.PRODUCTOS || []; CUPONES = d.CUPONES || [];
  } catch (e) {
    console.error("No se pudieron leer los datos de la tienda:", e.message);
    return json(500, { ok: false, mensaje: "Error interno. No se te cobró. Inténtalo de nuevo en unos minutos." });
  }

  /* ---- 1. Validar productos y calcular subtotal con precios reales ---- */
  let subtotal = 0; const resumen = [];
  for (const it of b.items) {
    const p = PRODUCTOS.find(x => x.id === it.id && !x.oculto);
    const qty = Number(it.qty);
    if (!p || !Number.isInteger(qty) || qty < 1) return json(409, { ok: false, mensaje: "Uno de los productos ya no está disponible. Actualiza tu carrito." });
    if (qty > p.stock) return json(409, { ok: false, mensaje: "No hay stock suficiente de \"" + p.nombre + "\". No se te cobró." });
    if (!(p.tallas || []).includes(it.talla)) return json(409, { ok: false, mensaje: "La talla elegida de \"" + p.nombre + "\" ya no está disponible." });
    if ((p.colores || []).length && !p.colores.some(c => c.n === it.color)) return json(409, { ok: false, mensaje: "El color elegido de \"" + p.nombre + "\" ya no está disponible." });
    subtotal += p.precio * qty;
    resumen.push(qty + "x " + p.nombre + " (" + it.talla + (it.color ? "/" + it.color : "") + ")");
  }

  /* ---- 2. Cupón ---- */
  let descuento = 0, envioGratisCupon = false;
  if (b.cupon) {
    const c = CUPONES.find(x => x.activo !== false && norm(x.codigo) === norm(b.cupon));
    if (!c || subtotal < (c.minimo || 0)) return json(409, { ok: false, mensaje: "El cupón ya no es válido. Quítalo e inténtalo de nuevo. No se te cobró." });
    if (c.tipo === "porcentaje") descuento = Math.round(subtotal * c.valor) / 100;
    else if (c.tipo === "monto") descuento = Math.min(subtotal, c.valor);
    else if (c.tipo === "envio") envioGratisCupon = true;
  }

  /* ---- 3. Envío ---- */
  const env = b.envio || {};
  const cfgEnvio = T.envios && T.envios[env.metodo];
  if (!cfgEnvio) return json(400, { ok: false, mensaje: "Método de envío inválido." });
  if (env.metodo === "domicilio" && (cfgEnvio.departamentos || []).length && !cfgEnvio.departamentos.includes(env.depto)) {
    return json(409, { ok: false, mensaje: "El envío a domicilio no está disponible en ese departamento." });
  }
  let costoEnvio = cfgEnvio.costo || 0;
  if (envioGratisCupon || (cfgEnvio.gratisDesde && subtotal - descuento >= cfgEnvio.gratisDesde)) costoEnvio = 0;

  const total = subtotal - descuento + costoEnvio;
  const centimos = Math.round(total * 100);

  /* Si el precio del navegador no coincide, no se cobra nada */
  if (Math.abs(total - Number(b.montoEsperado)) > 0.011) {
    return json(409, { ok: false, mensaje: "Los precios cambiaron mientras comprabas. No se te cobró. Actualiza la página y revisa tu carrito." });
  }
  if (!(centimos > 0)) return json(400, { ok: false, mensaje: "Monto inválido." });

  /* ---- 4. Crear el cargo en Culqi ---- */
  const pedido = String(b.pedido || "").replace(/[^A-Z0-9]/gi, "").slice(0, 12);
  let res, data;
  try {
    res = await fetch(CULQI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + secret },
      body: JSON.stringify({
        amount: centimos,
        currency_code: "PEN",
        email: cli.email,
        source_id: b.token,
        description: ("Pedido " + pedido + " " + (T.nombre || "")).slice(0, 80),
        metadata: {
          pedido: pedido,
          cliente: String(cli.nombre || "").slice(0, 60),
          celular: String(cli.celular || "").slice(0, 20),
          entrega: String(cfgEnvio.nombre || env.metodo).slice(0, 80),
          productos: resumen.join("; ").slice(0, 190)
        }
      })
    });
    data = await res.json().catch(() => ({}));
  } catch (e) {
    console.error("Error de red con Culqi:", e.message);
    return json(502, { ok: false, mensaje: "No pudimos conectar con el servicio de pagos. No se te cobró. Inténtalo de nuevo en un momento." });
  }

  if (res.ok && data && typeof data.id === "string") {
    return json(200, { ok: true, operacion: data.id, total: total });
  }
  console.error("Culqi rechazó el cargo:", res.status, JSON.stringify({ type: data && data.type, code: data && data.code, merchant_message: data && data.merchant_message }));
  return json(402, { ok: false, mensaje: (data && data.user_message) || "Tu banco no aprobó el pago. No se te cobró. Prueba con otra tarjeta u otra forma de pago." });
};
