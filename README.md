# JV Productions

Web inmersiva del estudio de producción musical **JV Productions**, guiada por scroll y hecha solo con
imágenes reales: el estudio entre la niebla, el abanico con las fotos del estudio, el vídeo del estudio montado
(`public/videos/jv-studio-edit.mp4`), los 9 servicios explicados uno por pantalla, el lema "Desde la idea hasta
el lanzamiento" y la reserva rápida por WhatsApp.

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
- `IMAGES` — logo, fotos del estudio (`public/img/`) y fotos de ambiente (`public/img/stock/`, ver `CREDITOS-FOTOS.md`).
- `SERVICES` — textos de cada servicio (título, explicación y qué incluye).
- `VIDEO` — el vídeo del estudio (`public/videos/jv-studio-edit.mp4`). El original sin editar es `jv-hero.mp4`.

`src/JVSlides.jsx` y `src/JVLanding.jsx` son versiones anteriores, por si quieres comparar.
