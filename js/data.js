/* DATOS DE LA TIENDA (productos, categorías, cupones, banner).
   Puedes editarlo a mano o desde admin.html y descargar este archivo. */
window.CATEGORIAS = [
 {
  "slug": "pantalones-jeans",
  "nombre": "Pantalones jeans",
  "grupo": "Jeans",
  "forma": "pantalon"
 },
 {
  "slug": "casacas-jeans",
  "nombre": "Casacas jeans",
  "grupo": "Jeans",
  "forma": "casaca"
 },
 {
  "slug": "shorts-jeans",
  "nombre": "Shorts jeans",
  "grupo": "Jeans",
  "forma": "short"
 },
 {
  "slug": "faldas-jeans",
  "nombre": "Faldas jeans",
  "grupo": "Jeans",
  "forma": "falda"
 },
 {
  "slug": "casacas-cuero",
  "nombre": "Casacas de cuero",
  "grupo": "Abrigos",
  "forma": "casaca"
 },
 {
  "slug": "chalecos",
  "nombre": "Chalecos",
  "grupo": "Abrigos",
  "forma": "chaleco"
 },
 {
  "slug": "chaquetas",
  "nombre": "Chaquetas",
  "grupo": "Abrigos",
  "forma": "casaca"
 },
 {
  "slug": "casacas",
  "nombre": "Casacas",
  "grupo": "Abrigos",
  "forma": "casaca"
 },
 {
  "slug": "vestidos-cortos",
  "nombre": "Vestidos cortos",
  "grupo": "Vestidos",
  "forma": "vestido"
 },
 {
  "slug": "vestidos-largos",
  "nombre": "Vestidos largos",
  "grupo": "Vestidos",
  "forma": "vestidolargo"
 },
 {
  "slug": "faldas",
  "nombre": "Faldas",
  "grupo": "Básicos",
  "forma": "falda"
 },
 {
  "slug": "polos",
  "nombre": "Polos",
  "grupo": "Básicos",
  "forma": "polo"
 },
 {
  "slug": "tops",
  "nombre": "Tops",
  "grupo": "Básicos",
  "forma": "top"
 },
 {
  "slug": "yoggers",
  "nombre": "Yoggers",
  "grupo": "Básicos",
  "forma": "pantalon"
 },
 {
  "slug": "lentes-sol",
  "nombre": "Lentes de sol",
  "grupo": "Accesorios",
  "forma": "lentes"
 }
];

window.PRODUCTOS = [
 {
  "id": "p01",
  "nombre": "Jean mom tiro alto",
  "categoria": "pantalones-jeans",
  "precio": 119,
  "precioAntes": 0,
  "tallas": [
   "26",
   "28",
   "30",
   "32",
   "34"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   }
  ],
  "desc": "Jean mom tiro alto de la categoría pantalones jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p02",
  "nombre": "Jean recto clásico",
  "categoria": "pantalones-jeans",
  "precio": 109,
  "precioAntes": 129,
  "tallas": [
   "26",
   "28",
   "30",
   "32",
   "34"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   },
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   }
  ],
  "desc": "Jean recto clásico de la categoría pantalones jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p03",
  "nombre": "Jean wide leg",
  "categoria": "pantalones-jeans",
  "precio": 129,
  "precioAntes": 0,
  "tallas": [
   "26",
   "28",
   "30",
   "32",
   "34"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   }
  ],
  "desc": "Jean wide leg de la categoría pantalones jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p04",
  "nombre": "Jean skinny elastizado",
  "categoria": "pantalones-jeans",
  "precio": 99,
  "precioAntes": 0,
  "tallas": [
   "26",
   "28",
   "30",
   "32",
   "34"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   },
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   }
  ],
  "desc": "Jean skinny elastizado de la categoría pantalones jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 19,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p05",
  "nombre": "Casaca jean clásica",
  "categoria": "casacas-jeans",
  "precio": 139,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   }
  ],
  "desc": "Casaca jean clásica de la categoría casacas jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p06",
  "nombre": "Casaca jean oversize",
  "categoria": "casacas-jeans",
  "precio": 149,
  "precioAntes": 169,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   },
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   }
  ],
  "desc": "Casaca jean oversize de la categoría casacas jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p07",
  "nombre": "Casaca jean corta",
  "categoria": "casacas-jeans",
  "precio": 129,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   }
  ],
  "desc": "Casaca jean corta de la categoría casacas jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p08",
  "nombre": "Short jean tiro alto",
  "categoria": "shorts-jeans",
  "precio": 69,
  "precioAntes": 0,
  "tallas": [
   "26",
   "28",
   "30",
   "32",
   "34"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   }
  ],
  "desc": "Short jean tiro alto de la categoría shorts jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p09",
  "nombre": "Short jean bermuda",
  "categoria": "shorts-jeans",
  "precio": 79,
  "precioAntes": 99,
  "tallas": [
   "26",
   "28",
   "30",
   "32",
   "34"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   },
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   }
  ],
  "desc": "Short jean bermuda de la categoría shorts jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p10",
  "nombre": "Short jean desflecado",
  "categoria": "shorts-jeans",
  "precio": 65,
  "precioAntes": 0,
  "tallas": [
   "26",
   "28",
   "30",
   "32",
   "34"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   }
  ],
  "desc": "Short jean desflecado de la categoría shorts jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p11",
  "nombre": "Falda jean mini",
  "categoria": "faldas-jeans",
  "precio": 75,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   }
  ],
  "desc": "Falda jean mini de la categoría faldas jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p12",
  "nombre": "Falda jean midi con abertura",
  "categoria": "faldas-jeans",
  "precio": 95,
  "precioAntes": 115,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   },
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   }
  ],
  "desc": "Falda jean midi con abertura de la categoría faldas jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p13",
  "nombre": "Falda jean con botones",
  "categoria": "faldas-jeans",
  "precio": 89,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Azul oscuro",
    "hex": "#2d4470"
   },
   {
    "n": "Azul medio",
    "hex": "#4f74a8"
   },
   {
    "n": "Celeste",
    "hex": "#9bb7d9"
   }
  ],
  "desc": "Falda jean con botones de la categoría faldas jeans. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p14",
  "nombre": "Casaca de cuero biker",
  "categoria": "casacas-cuero",
  "precio": 259,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Marrón",
    "hex": "#6b4a33"
   },
   {
    "n": "Camel",
    "hex": "#b98a58"
   }
  ],
  "desc": "Casaca de cuero biker de la categoría casacas de cuero. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p15",
  "nombre": "Casaca de cuero oversize",
  "categoria": "casacas-cuero",
  "precio": 289,
  "precioAntes": 309,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Marrón",
    "hex": "#6b4a33"
   },
   {
    "n": "Camel",
    "hex": "#b98a58"
   }
  ],
  "desc": "Casaca de cuero oversize de la categoría casacas de cuero. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p16",
  "nombre": "Casaca de cuero corta",
  "categoria": "casacas-cuero",
  "precio": 239,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Marrón",
    "hex": "#6b4a33"
   },
   {
    "n": "Camel",
    "hex": "#b98a58"
   }
  ],
  "desc": "Casaca de cuero corta de la categoría casacas de cuero. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p17",
  "nombre": "Chaleco tejido",
  "categoria": "chalecos",
  "precio": 89,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   }
  ],
  "desc": "Chaleco tejido de la categoría chalecos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p18",
  "nombre": "Chaleco jean",
  "categoria": "chalecos",
  "precio": 85,
  "precioAntes": 105,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   },
   {
    "n": "Gris",
    "hex": "#8d9099"
   }
  ],
  "desc": "Chaleco jean de la categoría chalecos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p19",
  "nombre": "Chaleco largo sastre",
  "categoria": "chalecos",
  "precio": 109,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   }
  ],
  "desc": "Chaleco largo sastre de la categoría chalecos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p20",
  "nombre": "Chaqueta bomber",
  "categoria": "chaquetas",
  "precio": 149,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   }
  ],
  "desc": "Chaqueta bomber de la categoría chaquetas. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p21",
  "nombre": "Chaqueta cortaviento",
  "categoria": "chaquetas",
  "precio": 129,
  "precioAntes": 149,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   },
   {
    "n": "Gris",
    "hex": "#8d9099"
   }
  ],
  "desc": "Chaqueta cortaviento de la categoría chaquetas. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p22",
  "nombre": "Chaqueta acolchada",
  "categoria": "chaquetas",
  "precio": 169,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   }
  ],
  "desc": "Chaqueta acolchada de la categoría chaquetas. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p23",
  "nombre": "Casaca drill con capucha",
  "categoria": "casacas",
  "precio": 139,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   }
  ],
  "desc": "Casaca drill con capucha de la categoría casacas. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p24",
  "nombre": "Casaca larga abrigo",
  "categoria": "casacas",
  "precio": 189,
  "precioAntes": 209,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   },
   {
    "n": "Gris",
    "hex": "#8d9099"
   }
  ],
  "desc": "Casaca larga abrigo de la categoría casacas. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p25",
  "nombre": "Casaca safari",
  "categoria": "casacas",
  "precio": 149,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   }
  ],
  "desc": "Casaca safari de la categoría casacas. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p26",
  "nombre": "Vestido corto floral",
  "categoria": "vestidos-cortos",
  "precio": 99,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   }
  ],
  "desc": "Vestido corto floral de la categoría vestidos cortos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p27",
  "nombre": "Vestido corto camisero",
  "categoria": "vestidos-cortos",
  "precio": 109,
  "precioAntes": 129,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   },
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   }
  ],
  "desc": "Vestido corto camisero de la categoría vestidos cortos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p28",
  "nombre": "Vestido corto negro básico",
  "categoria": "vestidos-cortos",
  "precio": 89,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   }
  ],
  "desc": "Vestido corto negro básico de la categoría vestidos cortos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p29",
  "nombre": "Vestido corto con lazo",
  "categoria": "vestidos-cortos",
  "precio": 95,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   },
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   }
  ],
  "desc": "Vestido corto con lazo de la categoría vestidos cortos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 19,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p30",
  "nombre": "Vestido largo fluido",
  "categoria": "vestidos-largos",
  "precio": 139,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   }
  ],
  "desc": "Vestido largo fluido de la categoría vestidos largos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p31",
  "nombre": "Vestido largo con abertura",
  "categoria": "vestidos-largos",
  "precio": 149,
  "precioAntes": 169,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   },
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   }
  ],
  "desc": "Vestido largo con abertura de la categoría vestidos largos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p32",
  "nombre": "Vestido largo de lino",
  "categoria": "vestidos-largos",
  "precio": 159,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   }
  ],
  "desc": "Vestido largo de lino de la categoría vestidos largos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p33",
  "nombre": "Falda plisada midi",
  "categoria": "faldas",
  "precio": 79,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   }
  ],
  "desc": "Falda plisada midi de la categoría faldas. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p34",
  "nombre": "Falda lápiz",
  "categoria": "faldas",
  "precio": 69,
  "precioAntes": 89,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   },
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   }
  ],
  "desc": "Falda lápiz de la categoría faldas. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p35",
  "nombre": "Falda short con cinturón",
  "categoria": "faldas",
  "precio": 65,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   }
  ],
  "desc": "Falda short con cinturón de la categoría faldas. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p36",
  "nombre": "Polo básico algodón",
  "categoria": "polos",
  "precio": 39,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   }
  ],
  "desc": "Polo básico algodón de la categoría polos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p37",
  "nombre": "Polo oversize",
  "categoria": "polos",
  "precio": 45,
  "precioAntes": 65,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   },
   {
    "n": "Gris",
    "hex": "#8d9099"
   }
  ],
  "desc": "Polo oversize de la categoría polos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p38",
  "nombre": "Polo estampado",
  "categoria": "polos",
  "precio": 49,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   }
  ],
  "desc": "Polo estampado de la categoría polos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p39",
  "nombre": "Polo crop",
  "categoria": "polos",
  "precio": 39,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   },
   {
    "n": "Gris",
    "hex": "#8d9099"
   }
  ],
  "desc": "Polo crop de la categoría polos. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 19,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p40",
  "nombre": "Top de tiras",
  "categoria": "tops",
  "precio": 35,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   }
  ],
  "desc": "Top de tiras de la categoría tops. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p41",
  "nombre": "Top corset",
  "categoria": "tops",
  "precio": 59,
  "precioAntes": 79,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   },
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   }
  ],
  "desc": "Top corset de la categoría tops. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p42",
  "nombre": "Top manga larga",
  "categoria": "tops",
  "precio": 45,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   }
  ],
  "desc": "Top manga larga de la categoría tops. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p43",
  "nombre": "Top halter",
  "categoria": "tops",
  "precio": 39,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Rosa",
    "hex": "#e08fa4"
   },
   {
    "n": "Verde oliva",
    "hex": "#6b7a4e"
   },
   {
    "n": "Vino",
    "hex": "#7a2e3f"
   },
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   }
  ],
  "desc": "Top halter de la categoría tops. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 19,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p44",
  "nombre": "Jogger algodón",
  "categoria": "yoggers",
  "precio": 75,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   }
  ],
  "desc": "Jogger algodón de la categoría yoggers. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p45",
  "nombre": "Jogger cargo",
  "categoria": "yoggers",
  "precio": 89,
  "precioAntes": 109,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   },
   {
    "n": "Gris",
    "hex": "#8d9099"
   }
  ],
  "desc": "Jogger cargo de la categoría yoggers. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p46",
  "nombre": "Jogger deportivo",
  "categoria": "yoggers",
  "precio": 79,
  "precioAntes": 0,
  "tallas": [
   "XS",
   "S",
   "M",
   "L",
   "XL"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Blanco",
    "hex": "#f4f4f2"
   },
   {
    "n": "Beige",
    "hex": "#d9c6a8"
   }
  ],
  "desc": "Jogger deportivo de la categoría yoggers. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p47",
  "nombre": "Lentes aviador",
  "categoria": "lentes-sol",
  "precio": 55,
  "precioAntes": 0,
  "tallas": [
   "Única"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Carey",
    "hex": "#8a5a2b"
   },
   {
    "n": "Rosa translúcido",
    "hex": "#e7b3bd"
   }
  ],
  "desc": "Lentes aviador de la categoría lentes de sol. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 10,
  "nuevo": true,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p48",
  "nombre": "Lentes cat eye",
  "categoria": "lentes-sol",
  "precio": 59,
  "precioAntes": 79,
  "tallas": [
   "Única"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Carey",
    "hex": "#8a5a2b"
   },
   {
    "n": "Rosa translúcido",
    "hex": "#e7b3bd"
   }
  ],
  "desc": "Lentes cat eye de la categoría lentes de sol. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 13,
  "nuevo": false,
  "masVendido": true,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p49",
  "nombre": "Lentes cuadrados",
  "categoria": "lentes-sol",
  "precio": 52,
  "precioAntes": 0,
  "tallas": [
   "Única"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Carey",
    "hex": "#8a5a2b"
   },
   {
    "n": "Rosa translúcido",
    "hex": "#e7b3bd"
   }
  ],
  "desc": "Lentes cuadrados de la categoría lentes de sol. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 16,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 },
 {
  "id": "p50",
  "nombre": "Lentes redondos",
  "categoria": "lentes-sol",
  "precio": 55,
  "precioAntes": 0,
  "tallas": [
   "Única"
  ],
  "colores": [
   {
    "n": "Negro",
    "hex": "#1b1b1f"
   },
   {
    "n": "Carey",
    "hex": "#8a5a2b"
   },
   {
    "n": "Rosa translúcido",
    "hex": "#e7b3bd"
   }
  ],
  "desc": "Lentes redondos de la categoría lentes de sol. Producto de ejemplo: cambia esta descripción, el precio y las fotos desde el panel admin.",
  "stock": 19,
  "nuevo": false,
  "masVendido": false,
  "oculto": false,
  "imagenes": []
 }
];

window.CUPONES = [
 {
  "codigo": "BIENVENIDA10",
  "tipo": "porcentaje",
  "valor": 10,
  "minimo": 0,
  "activo": true
 },
 {
  "codigo": "ENVIOGRATIS",
  "tipo": "envio",
  "valor": 0,
  "minimo": 150,
  "activo": true
 }
];

window.BANNERS = [
 {
  "titulo": "Nueva temporada denim",
  "texto": "Jeans, casacas y shorts con hasta 20% de descuento.",
  "enlace": "#/catalogo?cat=pantalones-jeans",
  "activo": true
 }
];
