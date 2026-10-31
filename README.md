# JV Productions

Web inmersiva del estudio de producción musical **JV Productions**. Intro cinematográfica, cursor propio,
menú a pantalla completa y scroll con inercia. Cuatro capítulos fijados en pantalla cuya animación avanza y
retrocede con el scroll: origen (logo entre la niebla con orbe de cromo líquido, abanico 3D del estudio y
manifiesto), un interludio tipográfico, servicios (carrusel 3D horizontal), experiencia (un cabezal convierte
la maqueta en master) y reserva rápida por WhatsApp que se abre como un círculo de luz.

## Ver la demo sin instalar nada

`docs/index.html` es una versión autónoma (React y Tailwind por CDN). Para publicarla gratis:
GitHub → **Settings → Pages** → Source: *Deploy from a branch* → Branch `main`, carpeta `/docs`.

## Proyecto (Vite + React + Tailwind)

```bash
npm install
npm run dev     # desarrollo en http://localhost:5173
npm run build   # genera dist/ para Vercel, Netlify, etc.
```

## Qué personalizar

Todo está al principio de `src/App.jsx`:

- `LINKS.whatsappNumber` — tu número con prefijo de país, sin `+` ni espacios.
- `LINKS.instagram` — enlace de Instagram.
- `IMAGES` — fotos del abanico y logo (archivos en `public/img/`).
- `BEATS` — añade `src: "beats/tema.mp3"` para reproducir audio real.

`src/JVSlides.jsx` es la versión de 4 slides con scroll-snap y `src/JVLanding.jsx` la landing larga anterior (landing larga con scroll); usa el vídeo de `public/videos/`.
