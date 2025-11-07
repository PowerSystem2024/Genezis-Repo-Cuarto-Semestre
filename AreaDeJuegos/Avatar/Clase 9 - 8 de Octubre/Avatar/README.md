# Proyecto: La Leyenda de Aang — Juego (Avatar)

Estructura:
```
Avatar/
└─ public/
   ├─ avatar.html
   ├─ assets/
   │  ├─ Aang_and_Friends.jpg
   │  ├─ aang.png
   │  ├─ katara.png
   │  ├─ toph.png
   │  └─ zuko.png
   ├─ css/
   │  └─ styles.css
   └─ js/
      └─ avatar.js
```

## Cómo ejecutar
Abrí `public/avatar.html` en tu navegador. No requiere servidor.

## Requisitos marcados en el código
1) **Color y background al h1**  
   - `css/styles.css` → clase `.titulo-hero` (gradiente, borde redondeado y sombra).  
   - En `avatar.html`, el `<h1>` usa `class="titulo-hero"`.

2) **Background a todo el sitio**  
   - `css/styles.css` → selector `body` con imagen `assets/Aang_and_Friends.jpg` + overlay oscuro.

3) **Tipografía**  
   - `avatar.html` → Google Fonts (Cinzel para títulos y Roboto para texto).  
   - `css/styles.css` → `body` usa Roboto, `h1,h2` usan Cinzel.

4) **Flexbox y tipos de display**  
   - `body` usa `display:flex` para centrar el contenedor.  
   - `.combate-principal` usa **flex** para dividir en 2 columnas.  
   - `.info-combate` usa **grid** (otro tipo de display).  
   - `.boton-reglas` usa **inline-flex** (alinea icono+texto) y luego se fuerza a **block** para centrar bajo el título (override al final del CSS).  
   - `.personajes-seleccion` usa **grid** para tarjetas responsivas.

5) **Formato y layout de los títulos**  
   - `.titulo-hero` (h1) con gradiente, sombra y bordes.  
   - `.titulo-seccion` (h2) con pseudo-elemento `::after` como subrayado decorativo.

6) **Responsive**  
   - `css/styles.css` incluye **media queries** (`@media ...`) y escala tipográfica fluida con `clamp(...)`.  
   - Las tarjetas se reorganizan y los botones se expanden en pantallas pequeñas.

## Buenas prácticas solicitadas
- **DRY / variables globales:** `js/avatar.js` define `CONFIG`, `STATE`, `DATA` y cachea elementos en `EL`.  
- **Script al final del HTML:** `<script src="js/avatar.js"></script>` está al final de `avatar.html`.

