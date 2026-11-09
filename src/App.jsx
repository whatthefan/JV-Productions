/**
 * JV PRODUCTIONS — Web inmersiva guiada por scroll
 * Progresión: el estudio entre la niebla → tus fotos → el vídeo del estudio → los servicios explicados →
 * desde la idea hasta el lanzamiento → reserva por WhatsApp.
 * Todo con imágenes reales, etalonadas con la misma luz cobalto/ámbar del estudio.
 * Stack: React + Tailwind CSS + lucide-react
 *
 * Personaliza LINKS e IMAGES justo debajo.
 */
import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import { ArrowDown, ArrowRight, ArrowUp, Check, Minus, Plus, Music, Volume2, VolumeX } from "lucide-react";
import { createPortal } from "react-dom";

/* ═══════════════════════════════════════════════════════════════
   CONFIGURACIÓN
   ═══════════════════════════════════════════════════════════════ */

const LINKS = {
  // WhatsApp: número con prefijo de país, sin "+" ni espacios (ej: 34612345678).
  // Vacío = las reservas se envían por Instagram y el número no aparece en la web.
  whatsappNumber: "",
  instagram: "https://instagram.com/jvproduction",
  instagramDM: "https://ig.me/m/jvproduction",
  instagramHandle: "@JVPRODUCTION",
  // Música de fondo: pega aquí el enlace de Spotify del artista, álbum o canción
  // (ej: "https://open.spotify.com/artist/XXXX"). Vacío = no se muestra el reproductor.
  spotify: "https://open.spotify.com/artist/3p2LsUveVusWCTV5PZTKGu", // Vigora
};

const IMAGES = {
  // Logo JV sobre fondo negro (se funde con mix-blend-screen)
  logo: "img/logo-jv.jpg",
  // Versión rojo sangre / blanco con fondo transparente (generada a partir del logo original)
  logoVampire: "img/logo-jv-vampire.png",
  // FOTO ESTUDIO 1: DAW — doble pantalla, pistas rosa/azul, teclado MIDI (cámbiala por la toma del DAW)
  setup: "img/estudio-setup.jpg",
  // FOTO ESTUDIO 2: EN LA ZONA — gorra + cascos bajo el aro ámbar. Es la carta que se expande a pantalla completa.
  zone: "img/estudio-zona.jpg",
  // FOTO ESTUDIO 3: NIGHT VIBE — humo y LEDs azules
  night: "img/estudio-atmosfera.jpg",
  // FOTO ESTUDIO 4: CONCEPT ART — sombra con cuernos vs encapuchado con máscara
  concept: "img/estudio-identidad.jpg",

  // Fotos de ambiente libres de derechos (licencia Unsplash: uso comercial, sin atribución obligatoria).
  // Créditos y enlaces en CREDITOS-FOTOS.md
  heroMic: "img/stock/hero-mic.jpg",
  stageFog: "img/stock/stage-fog.jpg",
  consoleAmber: "img/stock/console-amber.jpg",
  crowdGold: "img/stock/crowd-gold.jpg",
  studioWall: "img/stock/studio-wall.jpg",
  pxRapper: "img/stock/px-rapper.jpg",
  pxMic: "img/stock/px-mic.jpg",
  pxCamera: "img/stock/px-camera.jpg",
};

// Canción de fondo (muy baja). Empieza con el primer clic o toque en la página; se puede apagar desde el menú.
const MUSIC = { src: "audio/pendiente-sesion-one.m4a", title: "Pendiente — Sesión One", volume: 0.12 };

const VIDEO = {
  // Montaje del estudio (etalonado, con cortes y cierre con logo) hecho a partir de tu vídeo original
  src: "videos/jv-studio-edit-v3.mp4",
  poster: "videos/jv-studio-poster-v3.jpg",
};

/* ═══════════════════════════════════════════════════════════════
   DATOS
   ═══════════════════════════════════════════════════════════════ */

// Orden de las secciones en la página
/* ═══════════════════════════════════════════════════════════════
   IDIOMA (ES por defecto; EN traduce con este diccionario)
   ═══════════════════════════════════════════════════════════════ */

let LANG = "es";
const tr = (es) => (LANG === "en" && EN[es]) || es;

const EN = {
  "Productions": "Productions",
  "Música en Spotify": "Music on Spotify",
  "Apagar música": "Mute music",
  "Poner música": "Play music",
  "◀◀ Rebobinando": "◀◀ Rewinding",
  "▶▶ Avanzando": "▶▶ Fast-forward",
  "Inicio": "Home",
  "El estudio": "The studio",
  "Servicios": "Services",
  "Reserva": "Booking",
  "Rebobinar · Volver arriba ·": "Rewind · Back to top · ",
  "Volver arriba": "Back to top",
  "Ir al inicio": "Go to top",
  "Agendar sesión": "Book a session",
  "Agendar": "Book",
  "Cambiar idioma": "Change language",
  "Donde nace tu sonido": "Where your sound is born",
  "Detrás del sonido:": "Behind the sound:",
  "Cabina tratada y equipo profesional.": "Treated vocal booth and pro gear.",
  "Producción, grabación y mezcla en el mismo sitio.": "Production, recording and mixing under one roof.",
  "Tu tema, de la primera idea al lanzamiento.": "Your track, from the first idea to release.",
  "Activar sonido": "Sound on",
  "Silenciar": "Mute",
  "Ver en grande": "Full screen",
  "Cerrar ✕": "Close ✕",
  "Vídeo del estudio": "Studio video",
  "Agendar este servicio": "Book this service",
  "Producción Musical Completa": "Full Music Production",
  "Creación de Beats Personalizados": "Custom Beat Making",
  "Grabación de Voces por Horas": "Hourly Vocal Recording",
  "Mezcla y Mastering": "Mixing & Mastering",
  "Composición de Letras": "Songwriting",
  "Diseño de Portadas": "Cover Art Design",
  "Visualizers": "Visualizers",
  "Videoclips": "Music Videos",
  "Distribución Musical": "Music Distribution",
  "Nos encargamos del tema entero. Tú llegas con la idea y te vas con una canción lista para sacar.": "We handle the whole track. You come in with the idea and leave with a song ready to release.",
  "Instrumentales exclusivas hechas desde cero para tu voz y tu estilo, sea cual sea el género.": "Exclusive instrumentals made from scratch for your voice and style, whatever the genre.",
  "Reserva las horas que necesites en cabina tratada. Te dirigimos la sesión para sacar tu mejor toma.": "Book the hours you need in a treated booth. We direct the session to get your best take.",
  "Equilibramos cada pista y llevamos tu tema al volumen y la claridad de las plataformas, sin perder pegada.": "We balance every track and bring your song to streaming loudness and clarity, without losing punch.",
  "Escribimos contigo o pulimos lo que ya tienes: estructura, estribillos que se quedan y barras con identidad.": "We write with you or polish what you have: structure, hooks that stick and bars with identity.",
  "Portadas con estética de sello para tus singles y álbumes, preparadas para las plataformas y las redes.": "Label-quality covers for your singles and albums, ready for streaming platforms and socials.",
  "Piezas visuales en bucle que acompañan tu tema en YouTube, Spotify y redes mientras suena.": "Looping visuals that play with your track on YouTube, Spotify and socials.",
  "Producción audiovisual completa con estética urbana y cinematográfica, de la idea a la edición final.": "Full video production with an urban, cinematic look, from concept to final edit.",
  "Subimos tu música a Spotify, Apple Music, YouTube Music, TikTok y el resto de tiendas, y te ayudamos con las regalías.": "We release your music on Spotify, Apple Music, YouTube Music, TikTok and every other store, and help you with royalties.",
  "Dirección artística y referencias": "Creative direction and references",
  "Instrumental, arreglos y grabación": "Instrumental, arrangement and recording",
  "Mezcla y master comercial": "Commercial mix and master",
  "Beat exclusivo a tu medida": "Exclusive beat made for you",
  "Stems separados por pistas": "Separate track stems",
  "Ajustes hasta que encaje con tu flow": "Tweaks until it fits your flow",
  "Ingeniero durante toda la sesión": "Engineer for the whole session",
  "Dobles, coros y ad-libs": "Doubles, backing vocals and ad-libs",
  "Archivos limpios al terminar": "Clean files when you finish",
  "Mezcla de voces e instrumental": "Vocal and instrumental mix",
  "Master listo para streaming": "Streaming-ready master",
  "Versiones para escuchar y comparar": "Versions to listen and compare",
  "Co-writing en sesión": "Co-writing in session",
  "Melodías y topline": "Melodies and topline",
  "Estructura completa del tema": "Full song structure",
  "Concepto y diseño a medida": "Custom concept and design",
  "Formatos para Spotify y Apple Music": "Formats for Spotify and Apple Music",
  "Versión para redes sociales": "Social media version",
  "Visualizer para YouTube": "YouTube visualizer",
  "Canvas para Spotify": "Spotify Canvas",
  "Cortes verticales para redes": "Vertical cuts for socials",
  "Idea, guion y localizaciones": "Concept, script and locations",
  "Rodaje": "Shooting",
  "Edición y etalonaje": "Editing and color grading",
  "Subida a todas las plataformas": "Upload to every platform",
  "Gestión de regalías": "Royalty management",
  "Planificación del lanzamiento": "Release planning",
  "Desde la idea hasta el lanzamiento.": "From the idea to the release.",
  "Hacemos realidad tu proyecto.": "We make your project real.",
  "Escucha a": "Listen to",
  "En rotación": "On rotation",
  "Todos los géneros": "Every genre",
  "El Setup": "The Setup",
  "En la Zona": "In the Zone",
  "Tu música": "Your music",
  "Nuestra producción": "Our production",
  "Desliza · Entra al estudio ·": "Scroll · Enter the studio · ",
  "Desliza para entrar": "Scroll to enter",
  "Suena a disco": "Sounds like a record",
  "¿Listo para sonar profesional?": "Ready to sound professional?",
  "Tu mensaje": "Your message",
  "¿Qué necesitas?": "What do you need?",
  "Formato": "Format",
  "¿Cuándo?": "When?",
  "Grabar Voces": "Vocal Recording",
  "Producción Completa": "Full Production",
  "Beat a Medida": "Custom Beat",
  "Mezcla / Master": "Mix / Master",
  "Videoclip / Visuals": "Music Video / Visuals",
  "Letras": "Lyrics",
  "Portada": "Cover Art",
  "Distribución": "Distribution",
  "Sesión por Horas": "Hourly Session",
  "Proyecto Completo": "Full Project",
  "Pack Lanzamiento": "Release Pack",
  "Esta semana": "This week",
  "Próxima semana": "Next week",
  "Urgente": "Urgent",
  "Tu nombre artístico (opcional)": "Your artist name (optional)",
  "Nombre artístico": "Artist name",
  "Menos horas": "Fewer hours",
  "Más horas": "More hours",
  "Agendar por WhatsApp ahora": "Book on WhatsApp now",
  "Enviar por Instagram": "Send via Instagram",
  "Elige al menos un servicio": "Pick at least one service",
  "Mensaje copiado: pégalo en el chat de Instagram que se ha abierto.": "Message copied: paste it into the Instagram chat that just opened.",
};

const MANIFESTO_EN = [
  "Your", "music,", "our", { em: "production." }, "From", "the", "first", "beat", { img: "img/stock/px-mic.jpg" },
  "to", "the", "final", "mix", { img: "img/stock/px-camera.jpg" }, "we", "create", "the", "sound", "that",
  "puts", "you", "on", "the", { em: "map." }, { img: "img/stock/px-rapper.jpg" },
];

const S = { origin: 0, studio: 1, services: 2, statement: 3, booking: 4 };

const FAN = [
  /* FOTO ESTUDIO 1: DAW */
  { src: IMAGES.setup, label: "El Setup", pos: "50% 38%" },
  /* FOTO ESTUDIO 2: EN LA ZONA (crece hasta panel) */
  { src: IMAGES.zone, label: "En la Zona", pos: "50% 30%" },
  /* FOTO ESTUDIO 3: NIGHT VIBE */
  { src: IMAGES.night, label: "Night Vibe", pos: "50% 45%" },
  /* FOTO ESTUDIO 4: CONCEPT ART */
  { src: IMAGES.concept, label: "Concept Art", pos: "50% 74%" },
];
const HERO_CARD = 1;

// [x en % del ancho de carta, rotación, y en px] — reposo y abierto
const FAN_REST = [[-40, -13, 18], [-13, -4, 0], [13, 4, 0], [40, 13, 18]];
const FAN_OPEN = [[-150, -8, 10], [-50, -2.5, -6], [50, 2.5, -6], [150, 8, 10]];
const FAN_REST_SM = [[-34, -11, 14], [-11, -3.5, 0], [11, 3.5, 0], [34, 11, 14]];
const FAN_OPEN_SM = [[-80, -8, 8], [-27, -2.5, -4], [27, 2.5, -4], [80, 8, 8]];

// Manifiesto del capítulo 1. {img} = mini-foto dentro del texto, {em} = palabra destacada.
const MANIFESTO = [
  "Tu", "música,", "nuestra", { em: "producción." }, "Del", "primer", "beat", { img: IMAGES.pxMic },
  "a", "la", "última", "mezcla", { img: IMAGES.pxCamera }, "creamos", "el", "sonido", "que", "te",
  "pone", "en", "el", { em: "mapa." }, { img: IMAGES.pxRapper },
];

// Quién está detrás del estudio
const TEAM = ["Vigora", "jwiill.r"];

const STUDIO_LINES = [
  "Cabina tratada y equipo profesional.",
  "Producción, grabación y mezcla en el mismo sitio.",
  "Tu tema, de la primera idea al lanzamiento.",
];

// Los 9 servicios del cartel, explicados. `book` es la opción que se marca en la reserva.
const SERVICES = [
  {
    title: "Producción Musical Completa",
    book: "Producción Completa",
    img: "img/stock/sv-produccion.jpg",
    pos: "50% 40%",
    text: "Nos encargamos del tema entero. Tú llegas con la idea y te vas con una canción lista para sacar.",
    includes: ["Dirección artística y referencias", "Instrumental, arreglos y grabación", "Mezcla y master comercial"],
  },
  {
    title: "Creación de Beats Personalizados",
    book: "Beat a Medida",
    img: "img/stock/sv-beats.jpg",
    pos: "50% 40%",
    text: "Instrumentales exclusivas hechas desde cero para tu voz y tu estilo, sea cual sea el género.",
    includes: ["Beat exclusivo a tu medida", "Stems separados por pistas", "Ajustes hasta que encaje con tu flow"],
  },
  {
    title: "Grabación de Voces por Horas",
    book: "Grabar Voces",
    img: "img/stock/sv-voces.jpg",
    pos: "50% 35%",
    text: "Reserva las horas que necesites en cabina tratada. Te dirigimos la sesión para sacar tu mejor toma.",
    includes: ["Ingeniero durante toda la sesión", "Dobles, coros y ad-libs", "Archivos limpios al terminar"],
  },
  {
    title: "Mezcla y Mastering",
    book: "Mezcla / Master",
    img: "img/stock/sv-mezcla.jpg",
    pos: "50% 50%",
    text: "Equilibramos cada pista y llevamos tu tema al volumen y la claridad de las plataformas, sin perder pegada.",
    includes: ["Mezcla de voces e instrumental", "Master listo para streaming", "Versiones para escuchar y comparar"],
  },
  {
    title: "Composición de Letras",
    book: "Letras",
    img: "img/stock/sv-letras.jpg",
    pos: "50% 30%",
    text: "Escribimos contigo o pulimos lo que ya tienes: estructura, estribillos que se quedan y barras con identidad.",
    includes: ["Co-writing en sesión", "Melodías y topline", "Estructura completa del tema"],
  },
  {
    title: "Diseño de Portadas",
    book: "Portada",
    img: "img/stock/sv-portadas.jpg",
    pos: "50% 50%",
    text: "Portadas con estética de sello para tus singles y álbumes, preparadas para las plataformas y las redes.",
    includes: ["Concepto y diseño a medida", "Formatos para Spotify y Apple Music", "Versión para redes sociales"],
  },
  {
    title: "Visualizers",
    book: "Videoclip / Visuals",
    img: "img/stock/sv-visualizers.jpg",
    pos: "50% 50%",
    text: "Piezas visuales en bucle que acompañan tu tema en YouTube, Spotify y redes mientras suena.",
    includes: ["Visualizer para YouTube", "Canvas para Spotify", "Cortes verticales para redes"],
  },
  {
    title: "Videoclips",
    book: "Videoclip / Visuals",
    img: "img/stock/sv-videoclips.jpg",
    pos: "50% 40%",
    text: "Producción audiovisual completa con estética urbana y cinematográfica, de la idea a la edición final.",
    includes: ["Idea, guion y localizaciones", "Rodaje", "Edición y etalonaje"],
  },
  {
    title: "Distribución Musical",
    book: "Distribución",
    img: "img/stock/sv-distribucion.jpg",
    pos: "50% 50%",
    text: "Subimos tu música a Spotify, Apple Music, YouTube Music, TikTok y el resto de tiendas, y te ayudamos con las regalías.",
    includes: ["Subida a todas las plataformas", "Gestión de regalías", "Planificación del lanzamiento"],
  },
];

const BOOK_SERVICES = ["Grabar Voces", "Producción Completa", "Beat a Medida", "Mezcla / Master", "Videoclip / Visuals", "Letras", "Portada", "Distribución"];
const BOOK_FORMATS = ["Sesión por Horas", "Proyecto Completo", "Pack Lanzamiento"];
const BOOK_WHEN = ["Esta semana", "Próxima semana", "Urgente"];

/* ═══════════════════════════════════════════════════════════════
   MOTOR DE SCROLL
   Cada sección recibe, suavizadas con inercia:
   --p (0→1 mientras está fijada) y --enter (0→1 al entrar).
   En la raíz del documento: --mx / --my (ratón, -1→1) para el parallax.
   ═══════════════════════════════════════════════════════════════ */

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const seg = (p, a, b) => clamp01((p - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const reveal = (v, from, to) => `clamp(0, calc((var(${v}) - ${from}) / ${to - from}), 1)`;

const ProgressCtx = createContext(null);

function useProgress(index, fn) {
  const ctx = useContext(ProgressCtx);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => ctx.subscribe(index, (p, enter) => fnRef.current(p, enter)), [ctx, index]);
}

function useMedia(query) {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return m;
}

/* ═══════════════════════════════════════════════════════════════
   ESTILOS GLOBALES
   ═══════════════════════════════════════════════════════════════ */

const GlobalStyles = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@500;600;700&family=Jost:wght@200;300;400;500&family=Mrs+Saint+Delafield&family=Pinyon+Script&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

html, body { background: #050505; margin: 0; }
::selection { background: #E10600; color: #fff; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }

.jv-chrome {
  background: linear-gradient(178deg, #fff 0%, #E2E8F0 30%, #7c828c 48%, #f8fafc 58%, #aeb6c2 78%, #fff 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.jv-chrome-anim {
  background: linear-gradient(100deg, #8a909a 0%, #fff 20%, #9aa1ab 35%, #E2E8F0 50%, #fff 62%, #7c828c 80%, #fff 100%);
  background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: jv-shine 7s linear infinite;
}
.jv-gold { background: linear-gradient(180deg, #ffe1e1 0%, #E10600 45%, #5a0000 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.jv-outline { color: transparent; -webkit-text-stroke: 1px rgba(226,232,240,.45); }
.jv-line { background: linear-gradient(90deg, transparent, rgba(226,232,240,.75), transparent); }

/* Borde degradado cromo/oro para tarjetas */
.jv-frame {
  border: 1px solid transparent;
  background:
    linear-gradient(160deg, rgba(24,24,27,.92), rgba(9,9,11,.92)) padding-box,
    linear-gradient(140deg, rgba(255,255,255,.28), rgba(255,255,255,.04) 38%, rgba(255,255,255,.02) 62%, rgba(225,6,0,.45)) border-box;
}
.jv-frame.is-on {
  background:
    linear-gradient(160deg, rgba(30,26,14,.95), rgba(9,9,11,.95)) padding-box,
    linear-gradient(140deg, #ffe1e1, #E10600 40%, rgba(225,6,0,.2) 70%, #E10600) border-box;
}

.jv-grain::after {
  content: ""; position: fixed; inset: -100%; z-index: 90; pointer-events: none; opacity: .07;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: jv-grain 1.2s steps(6) infinite;
}


@keyframes jv-grain { 0%{transform:translate(0,0)} 25%{transform:translate(-3%,2%)} 50%{transform:translate(2%,-4%)} 75%{transform:translate(-4%,-1%)} 100%{transform:translate(0,0)} }
@keyframes jv-shine { from { background-position: 250% 0 } to { background-position: -250% 0 } }
@keyframes jv-spin { to { transform: rotate(360deg) } }
@keyframes jv-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
@keyframes jv-drift { 0% { transform: translateX(0) } 50% { transform: translateX(-4%) } 100% { transform: translateX(0) } }
@keyframes jv-beam { 0%,100% { opacity: .3 } 50% { opacity: .9 } }
@keyframes jv-blink { 0%,49% { opacity: 1 } 50%,100% { opacity: .15 } }
@keyframes jv-caret { 50% { opacity: 0 } }
@keyframes jv-eq { 0%,100% { transform: scaleY(.18) } 50% { transform: scaleY(1) } }
@keyframes jv-load { from { width: 0 } to { width: 100% } }
@keyframes jv-sweep { from { left: 0 } to { left: 100% } }
@keyframes jv-pulse { 0%,100% { opacity: .6 } 50% { opacity: 1 } }
@keyframes jv-hint {0% { transform: translateY(-100%) } 100% { transform: translateY(200%) } }
@keyframes jv-ping { 0% { transform: scale(.7); opacity: .9 } 100% { transform: scale(1.9); opacity: 0 } }
@keyframes jv-breathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.035) } }
@keyframes jv-track { from { top: -15% } to { top: 110% } }
@keyframes jv-bob { 0%,100% { transform: translateY(-2px) } 50% { transform: translateY(2px) } }
@keyframes jv-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes jv-glitch { 0%,92%,100% { text-shadow: 0 0 34px rgba(225,6,0,.45); transform: none } 93% { text-shadow: -3px 0 rgba(255,255,255,.85), 3px 0 #7a0000; transform: translateX(2px) skewX(-6deg) } 95% { text-shadow: 3px 0 rgba(255,255,255,.7), -3px 0 #7a0000; transform: translateX(-2px) } 97% { text-shadow: 0 0 34px rgba(225,6,0,.45); transform: none } }
@keyframes jv-morph { 0%,100% { border-radius: 42% 58% 63% 37% / 41% 44% 56% 59% } 50% { border-radius: 58% 42% 38% 62% / 55% 61% 39% 45% } }
.jv-eq > span { transform-origin: bottom; animation: jv-eq 1s ease-in-out infinite; }
.jv-eq.is-paused > span { animation: none; transform: scaleY(.12); transition: transform .4s; }

.jv-vinyl {
  background:
    radial-gradient(circle at 50% 50%, #0b0b0c 0 12%, #E10600 12.3% 15%, #111 15.3% 16.5%, transparent 16.7%),
    repeating-radial-gradient(circle at 50% 50%, #0a0a0a 0 2px, #18181b 2.5px 3px), #0a0a0a;
}
.jv-vinyl::after {
  content: ""; position: absolute; inset: 0; border-radius: 9999px;
  background: conic-gradient(from 20deg, transparent 0 10%, rgba(255,255,255,.16) 14%, transparent 20% 55%, rgba(255,255,255,.1) 60%, transparent 66%);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
`}</style>
);

/* ═══════════════════════════════════════════════════════════════
   PIEZAS REUTILIZABLES
   ═══════════════════════════════════════════════════════════════ */

const WhatsAppIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43zm8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.8.72.7 5.8.7 12.07c0 2 .52 3.95 1.52 5.67L.6 23.28l5.68-1.49a11.33 11.33 0 0 0 5.77 1.47h.01c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.33-8.02z" />
  </svg>
);

const InstagramIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
  </svg>
);

function ParentalAdvisory({ className = "" }) {
  return (
    <div
      className={`inline-flex select-none flex-col items-stretch border-[0.09em] border-white bg-black px-[0.12em] pb-[0.1em] pt-[0.08em] text-center uppercase leading-none text-white ${className}`}
      role="img"
      aria-label="Parental Advisory: Explicit Content"
    >
      <span className="font-['Anton'] text-[0.46em] tracking-[0.34em] [padding-left:0.34em]">Parental</span>
      <span className="my-[0.08em] bg-white px-[0.12em] pb-[0.04em] pt-[0.06em] font-['Anton'] text-[1em] tracking-[0.04em] text-black">Advisory</span>
      <span className="font-['Anton'] text-[0.4em] tracking-[0.14em] [padding-left:0.14em]">Explicit Content</span>
    </div>
  );
}

function Logo({ className = "", style }) {
  return (
    <img src={IMAGES.logoVampire} alt="JV Productions" className={`w-auto object-contain ${className}`} style={{ filter: "drop-shadow(0 0 10px rgba(225,6,0,.45))", ...style }} />
  );
}

/** Capa de niebla procedural (SVG turbulence) */
function Fog({ seed = 3, tint = "0.80 0.84 0.95", className = "", style }) {
  const [r, g, b] = tint.split(" ");
  const id = `fog-${seed}`;
  return (
    <svg className={`pointer-events-none absolute ${className}`} style={style} aria-hidden="true" preserveAspectRatio="none">
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.0035 0.009" numOctaves="4" seed={seed} />
        <feColorMatrix values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 1.3 -0.55`} />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}

function SplitReveal({ text, v = "--enter", from = 0.3, to = 0.9, className = "", letterClass = "" }) {
  const words = text.split(" ");
  const total = text.replace(/ /g, "").length;
  let k = 0;
  return (
    <span className={className} aria-label={text}>
      {words.map((w, wi) => (
        <React.Fragment key={wi}>
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {[...w].map((c, ci) => {
              const start = from + ((to - from) * 0.6 * k++) / Math.max(1, total);
              const t = reveal(v, start.toFixed(3), +(start + (to - from) * 0.4).toFixed(3));
              return (
                <span key={ci} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <span className={`inline-block ${letterClass}`} style={{ transform: `translateY(calc((1 - ${t}) * 110%)) rotate(calc((1 - ${t}) * 8deg))` }}>
                    {c}
                  </span>
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
}


/* ═══════════════════════════════════════════════════════════════
   INTRO + NAVEGACIÓN
   ═══════════════════════════════════════════════════════════════ */

/** Telón de entrada: la línea dorada se abre, aparece el logo y la pantalla se parte en dos */
function Intro({ onDone }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const at = reduce ? [0, 0, 0] : [120, 1750, 2750];
    const ts = [
      setTimeout(() => setPh(1), at[0]),
      setTimeout(() => setPh(2), at[1]),
      setTimeout(() => {
        setPh(3);
        onDone();
      }, at[2]),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);
  if (ph === 3) return null;
  const curtain = "transform 1s cubic-bezier(.76,0,.24,1)";
  return (
    <div className="fixed inset-0 z-[150]" aria-hidden="true">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-[#050505]" style={{ transform: ph >= 2 ? "translateY(-100%)" : "none", transition: curtain }} />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#050505]" style={{ transform: ph >= 2 ? "translateY(100%)" : "none", transition: curtain }} />
      <div className="absolute inset-0 grid place-items-center" style={{ opacity: ph >= 2 ? 0 : 1, transition: "opacity .45s" }}>
        <div className="relative flex flex-col items-center">
          <Logo
            className="h-[clamp(120px,24svh,220px)]"
            style={{
              opacity: ph >= 1 ? 1 : 0,
              filter: ph >= 1 ? "blur(0px)" : "blur(16px)",
              transform: ph >= 1 ? "scale(1)" : "scale(1.06)",
              transition: "opacity 1.2s, filter 1.4s, transform 1.6s cubic-bezier(.2,.7,.2,1)",
            }}
          />
          <span
            className="mt-6 block h-px bg-gradient-to-r from-transparent via-[#E10600] to-transparent"
            style={{ width: ph >= 1 ? "min(62vw,440px)" : "0px", transition: "width 1.3s cubic-bezier(.65,0,.35,1)" }}
          />
          <span className="jv-chrome-anim mt-4 font-['Jost'] text-[11px] font-light uppercase tracking-[0.7em]" style={{ opacity: ph >= 1 ? 1 : 0, transition: "opacity 1s .5s" }}>
            Productions
          </span>
        </div>
      </div>
    </div>
  );
}

/** Logo JV en rojo y blanco con un halo rojo suave detrás */
function VampireLogo({ className = "" }) {
  return (
    <div className={`relative aspect-[827/804] w-full ${className}`}>
      <div className="absolute inset-[16%] rounded-full bg-[#E10600]/25 blur-[60px]" />
      <img
        src={IMAGES.logoVampire}
        alt="JV Productions"
        className="relative h-full w-full object-contain"
        style={{ filter: "drop-shadow(0 0 18px rgba(225,6,0,.45))" }}
      />
    </div>
  );
}

/** Reproductor de Spotify (artista, álbum o canción) a partir de LINKS.spotify */
function SpotifyPlayer({ className = "", tall = false }) {
  const m = LINKS.spotify.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(artist|album|track|playlist)\/([A-Za-z0-9]+)/);
  if (!m) return null;
  return (
    <iframe
      title={tr("Música en Spotify")}
      src={`https://open.spotify.com/embed/${m[1]}/${m[2]}?theme=0`}
      className={`${tall ? "h-[232px] md:h-[352px]" : "h-[152px]"} w-full rounded-2xl border-0 ${className}`}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}

/** Foto real en blanco y negro con contraste y viñeta */
function Photo({ src, pos = "50% 50%", className = "relative", imgClassName = "", imgStyle, children }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        style={{ objectPosition: pos, filter: "grayscale(1) contrast(1.25) brightness(.8)", willChange: "transform", ...imgStyle }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(0,0,0,.4), rgba(0,0,0,.05) 50%, rgba(0,0,0,.45))" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_40%,rgba(5,5,5,.75)_100%)]" />
      {children}
    </div>
  );
}

/** Música de fondo: suena bajita tras la primera interacción y se aparta cuando el vídeo tiene el sonido activado */
function BackgroundMusic() {
  const audio = useRef(null);
  const [on, setOn] = useState(false);
  const wanted = useRef(true); // la persona no la ha apagado
  const ducked = useRef(false); // el vídeo del estudio está sonando

  const sync = () => {
    const a = audio.current;
    if (!a) return;
    if (wanted.current && !ducked.current) a.play().then(() => setOn(true)).catch(() => setOn(false));
    else {
      a.pause();
      setOn(false);
    }
  };

  useEffect(() => {
    audio.current.volume = MUSIC.volume;
    const first = () => {
      sync();
      ["pointerdown", "keydown", "touchstart"].forEach((t) => window.removeEventListener(t, first));
    };
    ["pointerdown", "keydown", "touchstart"].forEach((t) => window.addEventListener(t, first, { passive: true }));
    const onVideo = (e) => {
      ducked.current = e.detail;
      sync();
    };
    window.addEventListener("jv-video-sound", onVideo);
    return () => {
      ["pointerdown", "keydown", "touchstart"].forEach((t) => window.removeEventListener(t, first));
      window.removeEventListener("jv-video-sound", onVideo);
    };
  }, []);

  return (
    <>
      <audio ref={audio} src={MUSIC.src} loop preload="none" />
      <button
        onClick={(e) => {
          e.stopPropagation();
          wanted.current = !on;
          sync();
        }}
        aria-label={tr(on ? "Apagar música" : "Poner música")}
        title={MUSIC.title}
        className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/60 text-white md:bg-black/40 md:backdrop-blur-md md:h-11 md:w-11"
      >
        {on ? (
          <span className="flex h-3.5 items-end gap-[2px]" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="w-[3px] origin-bottom rounded-full bg-[#E10600]" style={{ height: "100%", animation: `jv-eq ${0.7 + i * 0.13}s ease-in-out -${i * 0.21}s infinite` }} />
            ))}
          </span>
        ) : (
          <Music className="h-4 w-4 text-zinc-400" />
        )}
      </button>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3D Y VIAJES (Three.js se carga solo cuando hace falta)
   ═══════════════════════════════════════════════════════════════ */

/** Estado compartido con la capa 3D: velocidad del viaje (0–1) y sentido (1 baja, -1 sube) */
const FX = { warp: 0, dir: 1 };

/** Móviles y tablets: se quitan los efectos caros para que el scroll vaya fluido */
const TOUCH = typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

const TRAVEL_LABELS = ["Inicio", "El estudio", "Servicios", "Vigora", "Reserva"];

let threePromise = null;
function loadThree() {
  if (window.THREE) return Promise.resolve(window.THREE);
  if (!threePromise) {
    threePromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      s.onload = () => resolve(window.THREE);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return threePromise;
}

/** Punto suave para las brasas */
function dotTexture(THREE) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.25, "rgba(255,255,255,.55)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/** Mundo 3D que acompaña toda la página: brasas rojas, anillos de onda y estelas cuando viajas */
function World3D() {
  const host = useRef(null);

  useEffect(() => {
    if (TOUCH || window.innerWidth < 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let cleanup = () => {};

    loadThree()
      .then((THREE) => {
        if (!alive || !host.current) return;
        const el = host.current;
        const small = window.innerWidth < 768;
        const DEPTH = 240;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
        renderer.setPixelRatio(1);
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
        el.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.034);
        const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 140);

        // Brasas: un túnel de partículas rojas y alguna blanca
        const N = small ? 260 : 520;
        const pos = new Float32Array(N * 3);
        const col = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
          const r = 2.2 + Math.random() * 10;
          const a = Math.random() * Math.PI * 2;
          pos.set([Math.cos(a) * r, Math.sin(a) * r * 0.75, 8 - Math.random() * DEPTH], i * 3);
          const hot = Math.random() < 0.18;
          col.set(hot ? [1, 0.82, 0.78] : [0.75 + Math.random() * 0.25, 0.02 + Math.random() * 0.06, 0.02], i * 3);
        }
        const emberGeo = new THREE.BufferGeometry();
        emberGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        emberGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
        const dot = dotTexture(THREE);
        const emberMat = new THREE.PointsMaterial({
          size: small ? 0.2 : 0.16,
          map: dot,
          vertexColors: true,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const embers = new THREE.Points(emberGeo, emberMat);
        scene.add(embers);

        // Anillos de onda: como si la página fuera el interior de un altavoz
        const ringMat = new THREE.LineBasicMaterial({ color: 0xe10600, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false });
        const rings = [];
        for (let k = 0; k < 18; k++) {
          const pts = [];
          const R = 7 + (k % 3) * 1.4;
          const wobble = 0.12 + Math.random() * 0.25;
          const freq = 3 + (k % 5);
          for (let j = 0; j <= 160; j++) {
            const a = (j / 160) * Math.PI * 2;
            const rr = R + Math.sin(a * freq + k) * wobble;
            pts.push(new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr * 0.75, 0));
          }
          const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), ringMat);
          ring.position.z = -12 - k * 13;
          ring.rotation.z = Math.random() * Math.PI;
          scene.add(ring);
          rings.push(ring);
        }

        // Estelas de velocidad: solo se ven cuando la página viaja
        const M = small ? 90 : 160;
        const sPos = new Float32Array(M * 6);
        const base = Array.from({ length: M }, () => {
          const r = 1.6 + Math.random() * 7;
          const a = Math.random() * Math.PI * 2;
          return [Math.cos(a) * r, Math.sin(a) * r * 0.75, Math.random() * 80];
        });
        const streakGeo = new THREE.BufferGeometry();
        streakGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
        const streakMat = new THREE.LineBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
        scene.add(new THREE.LineSegments(streakGeo, streakMat));

        const resize = () => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();

        const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
        const onMove = (e) => {
          mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
          mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        };

        let raf = 0;
        let last = performance.now();
        let lastY = window.scrollY;
        let camZ = 0;
        let vel = 0;
        let warp = 0;
        let flow = 0;

        const loop = (now) => {
          raf = requestAnimationFrame(loop);
          // Sin viaje ni scroll rápido basta con 30 fps
          if (warp < 0.02 && now - last < 32) return;
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          const t = now / 1000;
          const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
          const y = window.scrollY;
          const speed = Math.min(1, (Math.abs(y - lastY) / window.innerHeight) * 5);
          lastY = y;
          vel += (speed - vel) * 0.12;
          warp += (Math.max(FX.warp, vel * 0.55) - warp) * 0.15;

          // La cámara avanza por el túnel según lo que llevas de página
          camZ += (-(y / max) * (DEPTH - 40) - camZ) * 0.09;
          mouse.sx += (mouse.x - mouse.sx) * 0.05;
          mouse.sy += (mouse.y - mouse.sy) * 0.05;
          camera.position.set(mouse.sx * 0.9, -mouse.sy * 0.6, camZ + 6);
          camera.lookAt(mouse.sx * 0.25, -mouse.sy * 0.15, camZ - 20);
          camera.rotation.z = Math.sin(t * 0.15) * 0.04 + FX.dir * warp * 0.06;
          camera.fov = 62 + warp * 24;
          camera.updateProjectionMatrix();

          embers.rotation.z = t * 0.025;
          embers.position.y = Math.sin(t * 0.3) * 0.25;
          emberMat.size = (small ? 0.2 : 0.16) * (1 + warp * 0.8);

          rings.forEach((r, k) => {
            r.rotation.z += (k % 2 ? 1 : -1) * (0.0015 + warp * 0.02);
            r.scale.setScalar(1 + Math.sin(t * 1.7 + k * 0.8) * 0.035 + warp * 0.25);
          });
          ringMat.opacity = 0.13 + warp * 0.3;

          flow += dt * (6 + warp * 160);
          const len = 0.3 + warp * 14;
          for (let j = 0; j < M; j++) {
            const [bx, by, bz] = base[j];
            const z = camZ + 6 - ((bz + flow) % 80) - 1;
            sPos.set([bx, by, z, bx, by, z - len], j * 6);
          }
          streakGeo.attributes.position.needsUpdate = true;
          streakMat.opacity = warp * 0.85;

          renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(loop);

        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", onMove, { passive: true });
        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("resize", resize);
          window.removeEventListener("pointermove", onMove);
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => {});

    return () => {
      alive = false;
      cleanup();
    };
  }, []);

  return <div ref={host} className="pointer-events-none fixed inset-0 z-[60] opacity-70" aria-hidden="true" />;
}

/** Tocadiscos 3D con el vinilo de JV: gira, refleja la luz y se inclina con el ratón y el scroll */
function Vinyl3D({ className = "" }) {
  const host = useRef(null);

  useEffect(() => {
    let alive = true;
    let cleanup = () => {};

    // En móvil el tocadiscos no se muestra: ni se carga
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    loadThree()
      .then((THREE) => {
        if (!alive || !host.current) return;
        const el = host.current;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
        el.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
        camera.position.set(0.1, 3.5, 5.6);
        camera.lookAt(0.1, -0.1, 0);

        // Cara del disco dibujada en un canvas: surcos, pista lisa y etiqueta roja con el logo
        const c = document.createElement("canvas");
        c.width = c.height = 1024;
        const g = c.getContext("2d");
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        const paint = () => {
          g.clearRect(0, 0, 1024, 1024);
          g.fillStyle = "#070707";
          g.beginPath();
          g.arc(512, 512, 512, 0, Math.PI * 2);
          g.fill();
          for (let r = 180; r < 505; r += 1.6) {
            const gap = (r > 300 && r < 306) || (r > 395 && r < 401);
            g.strokeStyle = gap ? "rgba(0,0,0,.9)" : `rgba(255,255,255,${0.025 + Math.random() * 0.045})`;
            g.lineWidth = gap ? 2.6 : 0.8;
            g.beginPath();
            g.arc(512, 512, r, 0, Math.PI * 2);
            g.stroke();
          }
          g.fillStyle = "#c70500";
          g.beginPath();
          g.arc(512, 512, 172, 0, Math.PI * 2);
          g.fill();
          g.strokeStyle = "rgba(0,0,0,.35)";
          g.lineWidth = 3;
          g.beginPath();
          g.arc(512, 512, 160, 0, Math.PI * 2);
          g.stroke();
          if (logo.complete && logo.naturalWidth) {
            const o = document.createElement("canvas");
            o.width = o.height = 220;
            const og = o.getContext("2d");
            og.drawImage(logo, 0, 0, 220, 220 * (logo.naturalHeight / logo.naturalWidth));
            og.globalCompositeOperation = "source-in";
            og.fillStyle = "#fff";
            og.fillRect(0, 0, 220, 220);
            g.drawImage(o, 402, 372);
          }
          g.fillStyle = "#fff";
          g.textAlign = "center";
          g.font = "600 22px Oswald, sans-serif";
          g.fillText("VIGORA · LADO A", 512, 610);
          g.font = "500 15px Oswald, sans-serif";
          g.fillStyle = "rgba(255,255,255,.7)";
          g.fillText("JV PRODUCTIONS — 33⅓ RPM", 512, 636);
          g.fillStyle = "#000";
          g.beginPath();
          g.arc(512, 512, 9, 0, Math.PI * 2);
          g.fill();
          tex.needsUpdate = true;
        };
        const tex = new THREE.CanvasTexture(c);
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        logo.onload = paint;
        logo.src = IMAGES.logoVampire;
        paint();

        const rig = new THREE.Group();
        scene.add(rig);

        // Plato metálico debajo del disco
        const metal = new THREE.MeshStandardMaterial({ color: 0x9aa0a8, metalness: 0.9, roughness: 0.32 });
        const platter = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.06, 0.07, 96), new THREE.MeshStandardMaterial({ color: 0x1b1b1d, metalness: 0.7, roughness: 0.4 }));
        platter.position.y = -0.05;
        rig.add(platter);

        const disc = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.022, 128), [
          new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.5 }),
          new THREE.MeshStandardMaterial({ map: tex, roughness: 0.28, metalness: 0.25 }),
          new THREE.MeshStandardMaterial({ color: 0x050505 }),
        ]);
        rig.add(disc);

        const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.08, 16), metal);
        spindle.position.y = 0.04;
        rig.add(spindle);

        // Brazo: pivote, tubo y cápsula apoyada sobre el surco
        const arm = new THREE.Group();
        arm.position.set(1.2, 0.02, -0.8);
        const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.16, 32), metal);
        pivot.position.y = 0.05;
        arm.add(pivot);
        const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.14, 24), new THREE.MeshStandardMaterial({ color: 0x222226, metalness: 0.8, roughness: 0.35 }));
        weight.rotation.z = Math.PI / 2;
        weight.position.set(-0.22, 0.14, 0);
        arm.add(weight);
        const target = new THREE.Vector3(0.32, 0, 0.46);
        const dx = target.x - arm.position.x;
        const dz = target.z - arm.position.z;
        const L = Math.hypot(dx, dz);
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, L, 12), metal);
        tube.rotation.z = Math.PI / 2;
        tube.position.set(L / 2, 0.14, 0);
        arm.add(tube);
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.09), new THREE.MeshStandardMaterial({ color: 0xe10600, metalness: 0.4, roughness: 0.35 }));
        head.position.set(L + 0.03, 0.08, 0);
        arm.add(head);
        const baseAngle = Math.atan2(-dz, dx);
        arm.rotation.y = baseAngle;
        rig.add(arm);

        scene.add(new THREE.AmbientLight(0xffffff, 0.28));
        const key = new THREE.DirectionalLight(0xffffff, 0.9);
        key.position.set(2, 4, 2);
        scene.add(key);
        const red = new THREE.PointLight(0xe10600, 2.4, 12);
        red.position.set(-2.4, 1.6, 1);
        scene.add(red);
        const shine = new THREE.PointLight(0xffffff, 1.4, 6);
        scene.add(shine);

        const resize = () => {
          const w = el.clientWidth || 1;
          const h = el.clientHeight || 1;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(el);

        const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
        const onMove = (e) => {
          mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
          mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        let visible = true;
        const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
        io.observe(el);

        let raf = 0;
        const loop = (now) => {
          raf = requestAnimationFrame(loop);
          if (!visible) return;
          const t = now / 1000;
          mouse.sx += (mouse.x - mouse.sx) * 0.06;
          mouse.sy += (mouse.y - mouse.sy) * 0.06;
          if (!reduce) disc.rotation.y -= 0.03;
          rig.rotation.x = 0.12 + mouse.sy * 0.1;
          rig.rotation.z = -mouse.sx * 0.06;
          rig.rotation.y = mouse.sx * 0.14 + Math.sin(t * 0.4) * 0.05;
          arm.rotation.y = baseAngle + Math.sin(t * 2.1) * 0.004;
          shine.position.set(Math.cos(t * 0.7) * 1.6, 1.2, Math.sin(t * 0.7) * 1.6);
          renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(loop);

        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          io.disconnect();
          window.removeEventListener("pointermove", onMove);
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => {});

    return () => {
      alive = false;
      cleanup();
    };
  }, []);

  return <div ref={host} className={className} aria-hidden="true" />;
}

/** Pantalla de viaje: al saltar por la página se rebobina (o avanza) como una cinta, sección a sección */
function TravelHUD() {
  const [trip, setTrip] = useState(null);
  const head = useRef(null);
  const time = useRef(null);
  const [passed, setPassed] = useState(-1);

  useEffect(() => {
    const on = (e) => setTrip(e.detail.on ? e.detail : (t) => (t ? { ...t, on: false } : null));
    window.addEventListener("jv-travel", on);
    return () => window.removeEventListener("jv-travel", on);
  }, []);

  useEffect(() => {
    if (!trip?.on) return;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = window.scrollY / max;
      if (head.current) head.current.style.top = `${p * 100}%`;
      if (time.current) {
        const s = p * 312;
        const f = Math.floor((s % 1) * 25);
        time.current.textContent = `00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
      }
      let k = 0;
      trip.stops.forEach((s, i) => p >= s - 0.002 && (k = i));
      setPassed((x) => (x === k ? x : k));
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [trip]);

  const show = !!trip?.on;
  const up = trip?.dir < 0;

  return (
    <div className={`pointer-events-none fixed inset-0 z-[80] transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
      <div className="absolute inset-0 bg-black/45 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(120,0,0,.5)_100%)]" />
      <div className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(0deg,rgba(255,255,255,.07)_0_1px,transparent_1px_3px)]" />
      {show && <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-white/[0.07] to-transparent blur-sm [animation:jv-track_.9s_linear_infinite]" />}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="font-['Anton'] text-[clamp(2.4rem,7vw,6rem)] uppercase leading-none text-white [animation:jv-glitch_1.4s_steps(1)_infinite]">
          {tr(up ? "◀◀ Rebobinando" : "▶▶ Avanzando")}
        </p>
        <p className="mt-3 font-['JetBrains_Mono'] text-xs uppercase tracking-[0.3em] text-[#FF4D4D] md:text-sm">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#E10600] align-middle [animation:jv-blink_.6s_steps(1)_infinite]" />
          <span ref={time}>00:00:00:00</span> · {tr(TRAVEL_LABELS[passed] || "")}
        </p>
      </div>

      {/* Cinta lateral con las paradas de la página */}
      <div className="absolute bottom-[14%] right-6 top-[14%] w-px bg-white/20 md:right-12">
        {(trip?.stops || []).map((s, i) => (
          <div key={i} className="absolute right-0 flex -translate-y-1/2 items-center gap-3" style={{ top: `${s * 100}%` }}>
            <span className={`font-['Oswald'] text-[10px] font-medium uppercase tracking-[0.2em] transition-colors md:text-xs ${passed === i ? "text-white" : "text-white/35"}`}>{tr(TRAVEL_LABELS[i])}</span>
            <span className={`h-2 w-2 translate-x-1/2 rounded-full ${passed === i ? "bg-[#E10600]" : "bg-white/40"}`} />
          </div>
        ))}
        <div ref={head} className="absolute -left-[7px] h-[15px] w-[15px] -translate-y-1/2 rounded-full border-2 border-white bg-[#E10600] shadow-[0_0_20px_#E10600]" />
      </div>
    </div>
  );
}

/** Botón flotante para volver arriba: rebobina toda la página */
function BackToTop({ onClick }) {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.2);
    const onTrip = (e) => setBusy(e.detail.on);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("jv-travel", onTrip);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("jv-travel", onTrip);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={tr("Volver arriba")}
      className={`group fixed bottom-8 right-8 z-[75] hidden h-[92px] w-[92px] transition-all md:block duration-500 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <svg viewBox="0 0 100 100" className={`absolute inset-0 h-full w-full ${busy ? "[animation:jv-spin_.8s_linear_infinite_reverse]" : "[animation:jv-spin_16s_linear_infinite]"}`} aria-hidden="true">
        <defs>
          <path id="jv-ring-top" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
        </defs>
        <circle cx="50" cy="50" r="47" fill="rgba(5,5,5,.55)" />
        <text fill="rgba(255,255,255,.8)" style={{ font: "600 9.4px Oswald, sans-serif", letterSpacing: "2.6px", textTransform: "uppercase" }}>
          <textPath href="#jv-ring-top" textLength="236" lengthAdjust="spacing">{tr("Rebobinar · Volver arriba ·")}</textPath>
        </text>
      </svg>
      <span className="absolute inset-[30%] flex items-center justify-center rounded-full bg-[#E10600] text-white shadow-[0_0_24px_rgba(225,6,0,.6)] transition group-hover:bg-white group-hover:text-[#E10600]">
        <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 md:h-5 md:w-5" strokeWidth={2.4} />
      </span>
    </button>
  );
}

function Nav({ goTo, light, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > window.innerHeight * 1.2);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const pill = "pointer-events-auto grid h-10 place-items-center rounded-full border border-white/20 bg-black/60 text-white md:bg-black/40 md:backdrop-blur-md md:h-11";
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-4 py-4 md:px-10 md:py-7">
      <button onClick={() => goTo(S.origin)} className="pointer-events-auto flex items-center gap-3" aria-label={tr("Ir al inicio")}>
        <Logo className="h-9 md:h-11" />
        <span className={`hidden font-['Jost'] text-[11px] font-light uppercase tracking-[0.5em] transition-colors duration-500 sm:inline ${light ? "text-black/70" : "text-white/80"}`}>
          JV Productions
        </span>
      </button>
      <div className="flex items-center gap-1.5 md:gap-3">
      <button
        onClick={() => goTo(S.origin)}
        aria-label={tr("Volver arriba")}
        className={`${pill} w-10 transition-all duration-500 md:hidden ${scrolled ? "opacity-100" : "pointer-events-none w-0 scale-50 border-0 opacity-0"}`}
      >
        <ArrowUp className="h-4 w-4" strokeWidth={2.4} />
      </button>
      <button
        onClick={() => setLang(lang === "es" ? "en" : "es")}
        aria-label={tr("Cambiar idioma")}
        className={`${pill} px-3 font-['JetBrains_Mono'] text-[11px] font-medium tracking-[0.1em]`}
      >
        <span>
          <span className={lang === "es" ? "text-white" : "text-white/40"}>ES</span>
          <span className="mx-1 text-[#E10600]">/</span>
          <span className={lang === "en" ? "text-white" : "text-white/40"}>EN</span>
        </span>
      </button>
      <BackgroundMusic />
      <button
        onClick={() => goTo(S.booking)}
        className={`pointer-events-auto group relative overflow-hidden rounded-full border px-4 py-2.5 font-['Space_Grotesk'] text-[11px] font-semibold uppercase tracking-[0.16em] md:backdrop-blur-md transition-colors duration-500 md:px-7 md:py-3 ${
          light ? "border-black/20 bg-white/40 text-black" : "border-white/20 bg-black/40 text-white"
        }`}
      >
        <span className="absolute inset-0 translate-y-full rounded-full bg-[#E10600] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:translate-y-0" />
        <span className="relative transition-colors duration-500 group-hover:text-black">
          <span className="md:hidden">{tr("Agendar")}</span>
          <span className="hidden md:inline">{tr("Agendar sesión")}</span>
        </span>
      </button>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAPÍTULO 02 — EL ESTUDIO (el vídeo montado crece y su luz llena la pantalla)
   ═══════════════════════════════════════════════════════════════ */

function ChapterStudio({ index, setRef }) {
  const root = useRef(null);
  const main = useRef(null);
  const bar = useRef(null);
  const time = useRef(null);
  const [muted, setMuted] = useState(true);

  useProgress(index, (p) => {
    const el = root.current;
    if (!el) return;
    el.style.setProperty("--v", seg(p, 0, 0.4).toFixed(4)); // el vídeo crece
    el.style.setProperty("--w", seg(p, 0.2, 0.75).toFixed(4)); // aparecen los textos
  });

  // React no sincroniza el atributo muted: se aplica a mano
  useEffect(() => {
    if (main.current) main.current.muted = muted;
    window.dispatchEvent(new CustomEvent("jv-video-sound", { detail: !muted }));
  }, [muted]);

  // Solo reproduce mientras la sección está a la vista
  useEffect(() => {
    const v = main.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v?.play().catch(() => {
            const retry = () => v.play().catch(() => {});
            window.addEventListener("touchend", retry, { once: true, passive: true });
            window.addEventListener("click", retry, { once: true });
          });
        }
        else {
          v?.pause();
          setMuted(true); // al salir, vuelve la música de fondo
        }
      },
      { threshold: 0.05 }
    );
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  // Barra de progreso y código de tiempo bajo el vídeo
  useEffect(() => {
    const v = main.current;
    if (!v) return;
    const pad = (n) => String(n).padStart(2, "0");
    const onTime = () => {
      const t = v.currentTime || 0;
      if (bar.current) bar.current.style.transform = `scaleX(${v.duration ? t / v.duration : 0})`;
      if (time.current) time.current.textContent = `00:${pad(Math.floor(t / 60))}:${pad(Math.floor(t % 60))}`;
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  // "Ver en grande": reproductor a pantalla completa dentro de la propia página (funciona en todos los navegadores)
  const [big, setBig] = useState(false);
  const bigVideo = useRef(null);

  const openBig = () => {
    main.current?.pause();
    setBig(true);
  };
  const closeBig = () => {
    const b = bigVideo.current, v = main.current;
    if (b && v) v.currentTime = b.currentTime;
    setBig(false);
    v?.play().catch(() => {});
  };

  useEffect(() => {
    if (!big) {
      window.dispatchEvent(new CustomEvent("jv-video-sound", { detail: !muted }));
      return;
    }
    const b = bigVideo.current;
    if (b && main.current) {
      b.currentTime = main.current.currentTime;
      b.muted = false;
      b.play().catch(() => {});
    }
    window.dispatchEvent(new CustomEvent("jv-video-sound", { detail: true })); // pausa la música de fondo
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && closeBig();
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [big]);

  return (
    <section
      ref={(el) => {
        root.current = el;
        setRef(el);
      }}
      aria-label="El estudio"
      className="relative h-[230vh]"
      style={{ "--v": 0, "--w": 0 }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {big &&
          createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={tr("Vídeo del estudio")} onClick={closeBig}>
            <video
              ref={bigVideo}
              src={VIDEO.src}
              poster={VIDEO.poster}
              playsInline
              controls
              loop
              className="h-[100svh] max-w-full object-contain md:h-[94svh] md:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeBig}
              className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/70 px-4 py-2.5 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.16em] text-white transition hover:bg-[#E10600] md:right-8 md:top-8"
            >
              {tr("Cerrar ✕")}
            </button>
          </div>,
          document.body
        )}
        {/* Fondo: luz roja tenue que crece con el vídeo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(225,6,0,.22),transparent_60%)]" style={{ opacity: "var(--v)" }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-[#050505]/40" />
        {/* Número de capítulo gigante en contorno */}
        <span
          className="pointer-events-none absolute -left-4 bottom-[-14vh] hidden select-none font-['Anton'] text-[34vh] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.07)] md:block"
          style={{ transform: "translateY(calc((1 - var(--w)) * 8vh))" }}
          aria-hidden="true"
        >
          01
        </span>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-4 px-5 pb-5 pt-20 md:flex-row md:justify-between md:gap-14 md:px-12 md:pb-8 md:pt-24">
          {/* Texto */}
          <div className="w-full max-w-md shrink-0">
            <p className="flex items-center gap-3 font-['Oswald'] text-lg font-semibold uppercase tracking-[0.08em] text-[#FF4D4D] md:text-2xl" style={{ opacity: reveal("--enter", 0.5, 0.9) }}>
              <span className="font-['JetBrains_Mono'] text-[11px] font-medium tracking-[0.2em] text-zinc-500 md:text-xs">01 /</span> {tr("El estudio")}
            </p>
            <h2 className="mt-1 font-['Jost'] text-[clamp(1.6rem,4.4vw,4.2rem)] font-extralight uppercase leading-[1.02] tracking-[0.04em] text-white">
              <SplitReveal key={LANG} text={tr("Donde nace tu sonido")} from={0.55} to={1} letterClass="jv-chrome" />
            </h2>
            <p className="mt-2 font-['Space_Grotesk'] text-xs uppercase tracking-[0.2em] text-zinc-400 md:mt-3 md:text-sm" style={{ opacity: reveal("--enter", 0.8, 1) }}>
              {tr("Detrás del sonido:")} {TEAM.map((n, i) => (
                <React.Fragment key={n}>
                  {i > 0 && <span className="mx-2 text-[#E10600]">×</span>}
                  <span className="text-white">{n}</span>
                </React.Fragment>
              ))}
            </p>
            <ul className="mt-8 hidden border-t border-white/10 md:block">
              {STUDIO_LINES.map((l, i) => {
                const t = reveal("--w", (i * 0.22).toFixed(2), (i * 0.22 + 0.35).toFixed(2));
                return (
                  <li
                    key={l}
                    className="flex items-baseline gap-5 border-b border-white/10 py-4 font-['Space_Grotesk'] text-base text-zinc-300"
                    style={{ opacity: t, transform: `translateX(calc((1 - ${t}) * -24px))` }}
                  >
                    <span className="font-['JetBrains_Mono'] text-xs text-[#E10600]">0{i + 1}</span>
                    {tr(l)}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Vídeo montado, grande */}
          <div
            className="flex min-h-0 flex-1 flex-col items-center md:flex-none"
            style={{
              transform: TOUCH
                ? "translate3d(0, calc((1 - var(--v)) * 8svh), 0) scale(calc(0.9 + var(--v) * 0.1))"
                : "perspective(1600px) translateY(calc((1 - var(--v)) * 12svh)) rotateX(calc((1 - var(--v)) * 10deg)) scale(calc(0.82 + var(--v) * 0.18))",
              willChange: "transform",
              opacity: "calc(0.35 + var(--v) * 0.65)",
            }}
          >
            <div className="relative aspect-[9/16] h-full max-h-[calc(100svh-230px)] min-h-0 overflow-hidden rounded-[22px] border border-white/15 bg-black shadow-[0_60px_140px_-30px_rgba(0,0,0,.95),0_0_0_1px_rgba(225,6,0,.15)] md:h-[calc(100svh-170px)] md:max-h-[920px]">
              <video ref={main} src={VIDEO.src} poster={VIDEO.poster} muted autoPlay loop playsInline preload="metadata" className="h-full w-full object-cover" />
            </div>
            {/* Barra bajo el vídeo: tiempo, progreso y pantalla completa */}
            <div className="mt-3 flex w-full items-center gap-3 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.14em] text-zinc-400">
              <button
                onClick={() => setMuted((m) => !m)}
                className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 font-[Space_Grotesk] text-[11px] font-bold uppercase tracking-[0.14em] md:backdrop-blur-md transition-colors ${
                  muted ? "bg-[#E10600] text-white shadow-[0_0_30px_rgba(225,6,0,.6)]" : "bg-black/60 text-white"
                }`}
                aria-label={tr(muted ? "Activar sonido" : "Silenciar")}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                {tr(muted ? "Activar sonido" : "Silenciar")}
              </button>
              <span className="h-1.5 w-1.5 rounded-full bg-[#E10600] [animation:jv-blink_1.2s_steps(1)_infinite]" />
              <span ref={time}>00:00:00</span>
              <span className="relative h-px flex-1 overflow-hidden bg-white/15">
                <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-[#E10600]" />
              </span>
              <button onClick={openBig} className="shrink-0 whitespace-nowrap text-zinc-300 transition hover:text-white">
                {tr("Ver en grande")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAPÍTULO 03 — SERVICIOS (uno por pantalla: cada foto cubre a la anterior al bajar)
   ═══════════════════════════════════════════════════════════════ */

function ChapterServices({ index, setRef, onBook }) {
  const root = useRef(null);
  const [cur, setCur] = useState(0);
  const n = SERVICES.length;

  useProgress(index, (p) => {
    const f = clamp(p * (n - 1) * 1.08, 0, n - 1); // deja un respiro al final
    root.current?.style.setProperty("--f", f.toFixed(4));
    const c = Math.round(f);
    setCur((x) => (x === c ? x : c));
  });

  const jump = (i) => {
    const el = root.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (total * i) / ((n - 1) * 1.08), behavior: "smooth" });
  };

  return (
    <section
      ref={(el) => {
        root.current = el;
        setRef(el);
      }}
      aria-label="Servicios"
      className="relative"
      style={{ height: `${100 + n * 44}vh`, "--f": 0 }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#050505]">
        {SERVICES.map((s, i) => {
          // Cada servicio entra cubriendo al anterior desde abajo
          const t = i === 0 ? "1" : `clamp(0, calc(var(--f) - ${i - 1}), 1)`;
          const here = `clamp(0, calc(1 - (var(--f) - ${i}) * (var(--f) - ${i}) * 4.5), 1)`; // 1 cuando es el actual; se apaga antes de que entre el siguiente
          return (
            <div
              key={s.title}
              className="absolute inset-0"
              style={{
                transform: `translate3d(0, calc((1 - ${t}) * 100%), 0)`,
                willChange: "transform",
                zIndex: i,
                visibility: Math.abs(i - cur) > 1 ? "hidden" : "visible",
              }}
            >
              <Photo src={s.img} pos={s.pos} className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/55 to-[#050505]/10 md:bg-gradient-to-r md:from-[#050505] md:via-[#050505]/70 md:to-transparent" />

              <div className="relative flex h-full items-end px-5 pb-10 pt-24 md:items-center md:px-16 md:pb-0">
                <div className="max-w-xl" style={{ opacity: here, transform: `translateY(calc((1 - ${here}) * 30px))` }}>
                  <p className="font-['Oswald'] font-semibold uppercase tracking-[0.08em] text-lg text-[#FF4D4D] md:text-2xl">{tr("Servicios")}</p>
                  <h3 className="mt-1 font-['Jost'] text-[clamp(1.9rem,4.4vw,4rem)] font-extralight uppercase leading-[1.02] tracking-[0.03em] text-white">{tr(s.title)}</h3>
                  <p className="mt-4 max-w-lg font-['Space_Grotesk'] text-[15px] leading-relaxed text-zinc-300 md:text-lg">{tr(s.text)}</p>
                  <ul className="mt-5 space-y-2">
                    {s.includes.map((x) => (
                      <li key={x} className="flex items-center gap-3 font-['Space_Grotesk'] text-sm text-zinc-200 md:text-base">
                        <Check className="h-4 w-4 shrink-0 text-[#E10600]" strokeWidth={2.2} />
                        {tr(x)}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onBook(s.book)}
                    tabIndex={cur === i ? 0 : -1}
                    className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[#E10600] px-6 py-3.5 font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-[#ff2a2a]"
                  >
                    {tr("Agendar este servicio")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Índice de los 9 servicios (escritorio): sirve para saltar a cualquiera */}
        <nav className="absolute right-10 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-2.5 lg:flex" aria-label="Servicios">
          {SERVICES.map((s, i) => (
            <button
              key={s.title}
              onClick={() => jump(i)}
              className={`text-right font-['Space_Grotesk'] text-[13px] transition-all duration-500 ${cur === i ? "translate-x-0 text-white" : "translate-x-2 text-white/35 hover:text-white/70"}`}
            >
              {tr(s.title)}
              <span className={`ml-3 inline-block h-px align-middle transition-all duration-500 ${cur === i ? "w-8 bg-[#E10600]" : "w-3 bg-white/30"}`} />
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAPÍTULO 04 — DESDE LA IDEA HASTA EL LANZAMIENTO (el lema del cartel sobre el público)
   ═══════════════════════════════════════════════════════════════ */

function ChapterStatement({ index, setRef }) {
  const root = useRef(null);
  const line1 = tr("Desde la idea hasta el lanzamiento.").split(" ");
  const line2 = tr("Hacemos realidad tu proyecto.").split(" ");
  const total = line1.length + line2.length;

  useProgress(index, (p) => root.current?.style.setProperty("--q", seg(p, 0.05, 0.6).toFixed(4)));

  const word = (w, i, gold) => {
    const t = `clamp(0, calc(var(--q) * ${total + 2} - ${i}), 1)`;
    return (
      <React.Fragment key={`${gold}-${i}`}>
        <span
          className={`inline-block ${gold ? "font-['Oswald'] font-semibold uppercase tracking-[0.08em] text-[#FF4D4D]" : ""}`}
          style={{ opacity: `calc(0.12 + 0.88 * ${t})`, transform: `translateY(calc((1 - ${t}) * 0.25em))` }}
        >
          {w}
        </span>{" "}
      </React.Fragment>
    );
  };

  const ticker = ["Vigora", "jwiill.r", tr("Todos los géneros"), "JV Productions"];
  const show = reveal("--q", 0.8, 1);

  return (
    <section
      ref={(el) => {
        root.current = el;
        setRef(el);
      }}
      aria-label="Desde la idea hasta el lanzamiento"
      className="relative h-[210vh]"
      style={{ "--q": 0 }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Photo src={IMAGES.crowdGold} className="absolute inset-0" />
        <div className="absolute inset-0 bg-[#050505]/60" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-transparent" />

        <div className="relative flex h-full flex-col items-center px-5 pb-20 pt-20 text-center md:px-10 md:pb-28 md:pt-24">
          <p className="max-w-6xl font-['Jost'] text-[clamp(1.4rem,3.2vw,3.2rem)] font-light uppercase leading-[1.1] tracking-[0.04em] text-white">
            {line1.map((w, i) => word(w, i, false))}
            <br className="hidden md:block" />
            {line2.map((w, i) => word(w, line1.length + i, true))}
          </p>

          {/* Parental Advisory + reproductor de Vigora con un vinilo girando detrás */}
          <div
            className="mt-6 flex min-h-0 w-full max-w-6xl flex-1 flex-col items-center gap-5 md:mt-10 md:flex-row md:items-stretch md:gap-12"
            style={{ opacity: show, transform: `translateY(calc((1 - ${show}) * 40px))` }}
          >
            <div className="flex shrink-0 flex-col items-center justify-center gap-4 md:w-[34%]">
              <ParentalAdvisory className="text-[44px] md:text-[clamp(64px,7.4vw,110px)]" />
              <span className="font-['Oswald'] text-xs font-medium uppercase tracking-[0.24em] text-zinc-400 md:text-sm">Spotify · Apple Music · YouTube · TikTok</span>
            </div>

            <div className="relative flex min-h-0 w-full flex-1 flex-col text-left">
              <div className="mb-3 flex items-end justify-between gap-4">
                <p className="font-['Anton'] text-2xl uppercase tracking-[0.04em] text-white md:text-4xl">
                  {tr("Escucha a")} <span className="text-[#E10600]">Vigora</span>
                </p>
                <span className="flex items-center gap-2 font-['Oswald'] text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400 md:mr-[12%]">
                  <span className="h-2 w-2 rounded-full bg-[#E10600] [animation:jv-blink_1.2s_steps(1)_infinite]" /> {tr("En rotación")}
                </span>
              </div>
              <div className="relative min-h-0 flex-1">
                <Vinyl3D className="pointer-events-none absolute -right-[8%] top-1/2 hidden h-[125%] w-[60%] -translate-y-1/2 md:block" />
                <div className="relative h-full min-h-[232px] md:max-h-[460px] md:min-h-[352px] md:w-[78%]">
                  <SpotifyPlayer className="!h-full shadow-[0_30px_80px_-20px_rgba(0,0,0,.95)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cinta roja en movimiento que cierra la pantalla */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden bg-[#E10600] py-2.5 md:py-4" style={{ opacity: reveal("--q", 0.6, 0.9) }} aria-hidden="true">
          <div className="flex w-max [animation:jv-marquee_30s_linear_infinite]">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {[...ticker, ...ticker].map((t, i) => (
                  <span key={i} className="flex items-center font-['Anton'] text-2xl uppercase leading-none tracking-[0.04em] text-black md:text-5xl">
                    <span className="px-5 md:px-8">{t}</span>
                    <span className="text-white">✕</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAPÍTULO 01 — ORIGEN
   Oscuridad → logo entre la niebla → abanico → la carta se expande → manifiesto
   ═══════════════════════════════════════════════════════════════ */

function ChapterOrigin({ index, setRef }) {
  const root = useRef(null);
  const heroCard = useRef(null);
  const narrow = useMedia("(max-width: 640px)");
  const rest = narrow ? FAN_REST_SM : FAN_REST;
  const open = narrow ? FAN_OPEN_SM : FAN_OPEN;

  useProgress(index, (p) => {
    const el = root.current;
    if (!el) return;
    el.style.setProperty("--h", seg(p, 0, 0.14).toFixed(4)); // escena del micro: la cámara avanza y el wordmark se abre
    el.style.setProperty("--a", seg(p, 0.1, 0.25).toFixed(4)); // la foto se funde y el logo sale de la niebla
    el.style.setProperty("--b", seg(p, 0.25, 0.45).toFixed(4)); // abanico entra y se abre
    el.style.setProperty("--c", seg(p, 0.48, 0.64).toFixed(4)); // la carta crece a panel vertical
    el.style.setProperty("--d", seg(p, 0.64, 0.95).toFixed(4)); // manifiesto
  });

  // Escala para que la carta crezca hasta un panel vertical que quepa en pantalla (sin recortar ni pixelar la foto)
  useEffect(() => {
    const calc = () => {
      const c = heroCard.current;
      if (!c || !root.current) return;
      const s = Math.min((window.innerHeight * 0.84) / c.offsetHeight, (window.innerWidth * 0.9) / c.offsetWidth);
      root.current.style.setProperty("--s", Math.max(1, s).toFixed(3));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  let wordIndex = 0;
  const words = LANG === "en" ? MANIFESTO_EN : MANIFESTO;
  const totalWords = words.length;

  return (
    <section
      ref={(el) => {
        root.current = el;
        setRef(el);
      }}
      aria-label="Origen"
      className="relative h-[370vh]"
      style={{ "--h": 0, "--a": 0, "--b": 0, "--c": 0, "--d": 0, "--s": 1.8 }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Fondo negro con una luz blanca tenue desde arriba */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,#1a1a1c_0%,#050505_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,.06),transparent_60%)]" style={{ opacity: "var(--b)" }} />

        {/* Escena 1: micro bajo un haz de luz, en blanco y negro. La cámara avanza despacio. */}
        <div className="absolute inset-0" style={{ opacity: "calc(1 - var(--a) * 0.85)" }}>
          <img
            src={IMAGES.heroMic}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: "50% 30%",
              filter: "grayscale(1) contrast(1.35) brightness(.7)",
              willChange: "transform",
              transform: "translate(calc(var(--mx, 0) * -12px), calc(var(--my, 0) * -8px + var(--h) * -3svh)) scale(calc(1.04 + var(--h) * 0.08 + var(--a) * 0.05))",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,transparent_0%,rgba(5,5,5,.5)_60%,rgba(5,5,5,.95)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        {/* Rayos de luz desde arriba; se inclinan con el ratón */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[75%] origin-top"
          style={{ opacity: "calc(0.65 - var(--c) * 0.65)", transform: "skewX(calc(var(--mx, 0) * -6deg))" }}
          aria-hidden="true"
        >
          {[14, 27, 39, 48, 55, 66, 79, 88].map((l, i) => (
            <span
              key={l}
              className="absolute top-0 h-full bg-gradient-to-b from-white/30 via-white/[0.06] to-transparent"
              style={{ left: `${l}%`, width: `${[6, 2, 10, 1, 4, 2, 8, 1][i]}px`, animation: `jv-beam ${3 + i * 0.7}s ease-in-out ${-i}s infinite` }}
            />
          ))}
        </div>

        {/* Logo fijo desde el primer momento */}
        <div
          className="absolute left-1/2 top-[37%] z-[26] w-[min(104vw,clamp(280px,60svh,640px))] will-change-transform md:top-[38%]"
          style={{
            transform:
              "translate(-50%, -50%) translate(calc(var(--mx, 0) * -10px), calc(var(--my, 0) * -8px + var(--b) * -18svh)) perspective(900px) rotateY(calc(var(--mx, 0) * 16deg)) rotateX(calc(var(--my, 0) * -12deg)) scale(calc(1 + var(--h) * 0.06 - var(--b) * 0.5))",
            opacity: "calc(1 - var(--b) * 1.7)",
          }}
        >
          <VampireLogo />
        </div>

        {/* Eslogan bajo el micro */}
        <div
          className="absolute inset-x-0 bottom-[19%] z-10 flex justify-center px-6 md:bottom-[11%]"
          style={{ opacity: "calc(1 - var(--b) * 2)", transform: "translateY(calc(var(--h) * -3svh))" }}
        >
          <h1 className="text-center font-['Anton'] uppercase leading-[0.95]">
            <span className="block text-[clamp(.95rem,1.8vw,1.35rem)] tracking-[0.62em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.9)] [padding-left:0.62em]">
              {tr("Tu música")}
            </span>
            <span className="mt-2 block text-[clamp(2.1rem,5.4vw,4.4rem)] tracking-[0.02em] text-[#E10600] [animation:jv-glitch_5s_steps(1)_infinite]">
              {tr("Nuestra producción")}
            </span>
          </h1>
        </div>

        {/* Indicador de scroll: sello giratorio con flecha */}
        <button
          type="button"
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" })}
          className="group absolute bottom-5 left-1/2 z-10 h-[76px] w-[76px] -translate-x-1/2 md:bottom-8 md:left-auto md:right-10 md:h-[96px] md:w-[96px] md:translate-x-0"
          style={{ opacity: "calc(1 - var(--h) * 3)" }}
          aria-label={tr("Desliza para entrar")}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full [animation:jv-spin_14s_linear_infinite]" aria-hidden="true">
            <defs>
              <path id="jv-ring" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
            </defs>
            <text fill="rgba(255,255,255,.75)" style={{ font: "600 9.4px Oswald, sans-serif", letterSpacing: "2.6px", textTransform: "uppercase" }}>
              <textPath href="#jv-ring" textLength="236" lengthAdjust="spacing">{tr("Desliza · Entra al estudio ·")}</textPath>
            </text>
          </svg>
          <span className="absolute inset-[30%] flex items-center justify-center rounded-full bg-[#E10600] text-white transition group-hover:bg-white group-hover:text-[#E10600]">
            <ArrowDown className="h-4 w-4 [animation:jv-bob_1.6s_ease-in-out_infinite] md:h-5 md:w-5" strokeWidth={2.4} />
          </span>
        </button>

        {/* Fondo del estudio que aparece detrás del panel */}
        <div className="absolute inset-0 z-[15]" style={{ opacity: "var(--c)" }} aria-hidden="true">
          <img src={IMAGES.studioWall} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "saturate(.8)" }} />
          <div className="absolute inset-0 bg-[#050505]/75" />
        </div>

        {/* Abanico de cartas (se inclina en 3D con el ratón) */}
        {FAN.map((card, i) => {
          const [rx, rr, ry] = rest[i];
          const [ox, or, oy] = open[i];
          const hero = i === HERO_CARD;
          const x = `calc((${rx} + (${ox - rx}) * var(--b)) * ${hero ? "(1 - var(--c))" : "(1 + var(--c) * 1.4)"} * 1%)`;
          const r = `calc((${rr} + (${or - rr}) * var(--b)) * ${hero ? "(1 - var(--c))" : "1"} * 1deg)`;
          const y = `calc((${ry} + (${oy - ry}) * var(--b)) * 1px + (1 - var(--b)) * 75svh + ${hero ? "(1 - var(--c))" : "1"} * 12svh)`;
          const tilt = hero ? "(1 - var(--c))" : "1";
          return (
            <figure
              key={card.label}
              ref={hero ? heroCard : undefined}
              className="absolute left-1/2 top-1/2 z-20 aspect-[3/4] h-[clamp(190px,44svh,420px)] max-w-[56vw] overflow-hidden border border-white/15 bg-zinc-900 shadow-[0_30px_80px_-10px_rgba(0,0,0,.9)] will-change-transform"
              style={{
                transform: `perspective(1200px) translate(-50%, -50%) translateX(${x}) translateY(${y}) rotate(${r}) rotateY(calc(var(--mx, 0) * 12deg * ${tilt})) rotateX(calc(var(--my, 0) * -9deg * ${tilt})) ${
                  hero ? "scale(calc(1 + (var(--s) - 1) * var(--c)))" : ""
                }`,
                zIndex: hero ? 25 : i === 2 ? 22 : 20,
                borderRadius: hero ? "calc(20px - var(--c) * 10px)" : "20px",
                opacity: hero ? 1 : "calc(1 - var(--c) * 1.3)",
              }}
            >
              <img
                src={card.src}
                alt={tr(card.label)}
                className="h-full w-full object-cover"
                style={{ objectPosition: card.pos, transform: hero ? "scale(calc(1.04 + var(--d) * 0.04))" : "scale(1.04)" }}
              />
              {/* Reflejo especular que se mueve con el ratón */}
              <div
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,.35) 48%, transparent 62%)",
                  transform: "translateX(calc(var(--mx, 0) * 40%))",
                  opacity: hero ? "calc(1 - var(--c))" : 1,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" style={hero ? { opacity: "calc(1 - var(--c))" } : undefined} />
              <figcaption className="absolute inset-x-0 bottom-0 p-4" style={hero ? { opacity: "calc(1 - var(--c) * 3)" } : undefined}>
                <span className="block font-['Oswald'] font-semibold uppercase tracking-[0.08em] text-xl text-white md:text-2xl">{tr(card.label)}</span>
              </figcaption>
            </figure>
          );
        })}


        {/* Manifiesto palabra a palabra sobre la foto expandida: cada palabra sale del desenfoque */}
        <div className="absolute inset-0 z-30 bg-black" style={{ opacity: "calc(var(--c) * 0.35 + var(--d) * 0.45)" }} />
        <div className="absolute inset-0 z-40 flex items-center justify-center px-5 md:px-16" style={{ opacity: "calc(var(--c) * 2 - 1)" }}>
          <p className="max-w-5xl text-center font-['Jost'] text-[clamp(1.5rem,3.8vw,3.6rem)] font-light uppercase leading-[1.18] tracking-[0.04em] text-white">
            {words.map((w, i) => {
              const k = wordIndex++;
              const t = `clamp(0, calc(var(--d) * ${totalWords + 2} - ${k}), 1)`;
              if (w.img) {
                return (
                  <span
                    key={i}
                    className="mx-[0.15em] inline-block h-[0.8em] w-[1.6em] translate-y-[0.08em] overflow-hidden rounded-full border border-white/30 align-baseline"
                    style={{ transform: `scale(${t}) rotate(calc((1 - ${t}) * -20deg))`, opacity: t }}
                  >
                    <img src={w.img} alt="" className="h-full w-full object-cover" />
                  </span>
                );
              }
              const em = typeof w === "object";
              return (
                <React.Fragment key={i}>
                  <span
                    className={`inline-block ${em ? "font-['Oswald'] font-semibold uppercase tracking-[0.08em] text-[#FF4D4D]" : ""}`}
                    style={{
                      opacity: `calc(0.12 + 0.88 * ${t})`,
                      transform: `translateY(calc((1 - ${t}) * 0.25em))`,
                    }}
                  >
                    {em ? w.em : w}
                  </span>{" "}
                </React.Fragment>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAPÍTULO 05 — AGENDAR (un círculo de luz champagne se abre desde abajo)
   ═══════════════════════════════════════════════════════════════ */

function Choice({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 font-['Space_Grotesk'] text-[11px] font-semibold transition-all duration-300 md:px-4 md:py-2 md:text-[13px] ${
        active ? "border-[#E10600] bg-[#E10600] text-white" : "border-white/15 bg-white/[0.04] text-zinc-200 hover:-translate-y-0.5 hover:border-white/40"
      }`}
    >
      {active && <Check className="h-3 w-3" strokeWidth={3} />}
      {children}
    </button>
  );
}

function ChapterBooking({ setRef, booking, setBooking }) {
  const { services, format, when, name, hours } = booking;
  const set = (k, v) => setBooking((b) => ({ ...b, [k]: v }));
  const toggle = (s) => set("services", services.includes(s) ? services.filter((x) => x !== s) : [...services, s]);

  const h = format === "Sesión por Horas" ? ` (${hours}h)` : "";
  const list = services.map(tr).join(", ") || "-";
  const message =
    LANG === "en"
      ? `Hi JV Productions, I'm ${name.trim() || "an artist"} and I'd like to book: ${list} as ${tr(format)}${h}, for ${tr(when).toLowerCase()}. Are you available?`
      : `Hola JV Productions, soy ${name.trim() || "un artista"} y quiero agendar: ${list} en formato ${format}${h}, para ${when.toLowerCase()}. ¿Tenéis disponibilidad?`;
  const ready = services.length > 0;
  const viaWhatsApp = !!LINKS.whatsappNumber;
  const [copied, setCopied] = useState(false);
  const send = () => {
    if (!ready) return;
    if (viaWhatsApp) return window.open(`https://wa.me/${LINKS.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    // Instagram no deja rellenar el mensaje: lo copiamos y abrimos el chat
    navigator.clipboard?.writeText(message).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 7000);
    window.open(LINKS.instagramDM, "_blank", "noopener,noreferrer");
  };

  return (
    <section ref={setRef} aria-label="Agendar" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-3 pb-4 pt-[72px] md:px-10 md:pb-10 md:pt-28">
      {/* La luz se abre en círculo desde abajo */}
      <div className="absolute inset-0" style={{ clipPath: "circle(calc(var(--enter, 0) * 135%) at 50% 100%)" }}>
        <img src={IMAGES.crowdGold} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ transform: "scale(calc(1.08 - var(--enter, 0) * 0.06))" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(10,10,11,.9)_0%,rgba(5,5,5,.88)_50%,rgba(0,0,0,.8)_100%)]" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 whitespace-nowrap font-['Anton'] text-[clamp(5rem,22vw,22rem)] uppercase leading-none text-white/[0.05]"
        style={{ transform: "translateX(calc(-50% + (1 - var(--enter, 0)) * 20vw))" }}
        aria-hidden="true"
      >
        {tr("Suena a disco")}
      </div>

      <div
        className="no-scrollbar relative z-10 grid max-h-full w-full max-w-6xl overflow-y-auto rounded-[32px] border border-white/10 bg-[#0c0c0e]/95 text-white shadow-[0_50px_140px_-30px_rgba(0,0,0,.9)] md:backdrop-blur-md md:grid-cols-5"
        style={{
          transform: "perspective(1400px) translateY(calc((1 - var(--enter, 0)) * 120px)) rotateX(calc((1 - var(--enter, 0)) * 14deg))",
          opacity: "calc(var(--enter, 0) * 1.4 - 0.2)",
        }}
      >
        <div className="relative flex flex-col justify-between gap-4 p-4 pb-3 md:col-span-2 md:border-r md:border-white/10 md:p-10">
          <h2 className="font-['Anton'] text-[clamp(1.7rem,5svh,4.5rem)] uppercase leading-[0.92] text-[#E10600]">
            <SplitReveal key={LANG} text={tr("¿Listo para sonar profesional?")} from={0.55} to={1} />
          </h2>
          <div className="hidden md:block">
            <p className="mb-2 font-['Oswald'] font-semibold uppercase tracking-[0.08em] text-lg text-[#FF4D4D]">{tr("Tu mensaje")}</p>
            <div className="rounded-2xl rounded-bl-sm bg-[#16261c] p-4 font-['Space_Grotesk'] text-sm leading-relaxed text-zinc-200 shadow-sm">{message}</div>
          </div>
          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 font-['Space_Grotesk'] text-sm font-bold uppercase tracking-[0.12em] text-zinc-400 transition-colors hover:text-white md:inline-flex"
          >
            <InstagramIcon className="h-5 w-5" /> {LINKS.instagramHandle}
          </a>
        </div>

        <div className="flex min-h-0 flex-col gap-2.5 p-4 pt-0 md:col-span-3 md:gap-5 md:p-10">
          {[
            ["¿Qué necesitas?", BOOK_SERVICES, (s) => services.includes(s), toggle],
            ["Formato", BOOK_FORMATS, (f) => format === f, (f) => set("format", f)],
            ["¿Cuándo?", BOOK_WHEN, (w) => when === w, (w) => set("when", w)],
          ].map(([label, opts, isOn, pick]) => (
            <fieldset key={label}>
              <legend className="mb-1.5 font-['Oswald'] font-semibold uppercase tracking-[0.08em] text-base text-[#FF4D4D] md:text-lg">{tr(label)}</legend>
              <div className="flex flex-wrap gap-1.5">
                {opts.map((o) => (
                  <Choice key={o} active={isOn(o)} onClick={() => pick(o)}>
                    {tr(o)}
                    {o === "Sesión por Horas" && format === o ? ` · ${hours}h` : ""}
                  </Choice>
                ))}
                {label === "Formato" && format === "Sesión por Horas" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] px-1 text-zinc-200">
                    <button onClick={() => set("hours", Math.max(1, hours - 1))} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10" aria-label={tr("Menos horas")}>
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[2.5ch] text-center font-['Space_Grotesk'] text-xs font-semibold">{hours}h</span>
                    <button onClick={() => set("hours", Math.min(10, hours + 1))} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10" aria-label={tr("Más horas")}>
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
              </div>
            </fieldset>
          ))}
          <input
            value={name}
            onChange={(e) => set("name", e.target.value)}
            placeholder={tr("Tu nombre artístico (opcional)")}
            aria-label={tr("Nombre artístico")}
            maxLength={40}
            className="w-full rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-['Space_Grotesk'] text-sm text-white placeholder:text-zinc-500 focus:border-white/50 focus:outline-none md:py-2.5"
          />
          <button
            onClick={send}
            disabled={!ready}
            data-cursor={ready ? "Enviar" : undefined}
            className="group relative mt-1 flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#E10600] px-5 py-3 font-['Anton'] text-base uppercase tracking-[0.08em] text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 md:py-5 md:text-2xl"
          >
            <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-enabled:group-hover:translate-x-0" />
            {viaWhatsApp ? (
              <WhatsAppIcon className="relative h-6 w-6 text-white transition-colors duration-700 group-enabled:group-hover:text-[#1aa34a]" />
            ) : (
              <InstagramIcon className="relative h-6 w-6 text-white transition-colors duration-700 group-enabled:group-hover:text-[#E10600]" />
            )}
            <span className="relative transition-colors duration-700 group-enabled:group-hover:text-black">
              {tr(ready ? (viaWhatsApp ? "Agendar por WhatsApp ahora" : "Enviar por Instagram") : "Elige al menos un servicio")}
            </span>
            {ready && <ArrowRight className="relative h-5 w-5 transition-all duration-700 group-hover:translate-x-1 group-hover:text-black" />}
          </button>
          {copied && (
            <p className="rounded-xl border border-[#E10600]/40 bg-[#E10600]/10 px-3 py-2 text-center font-['Space_Grotesk'] text-xs text-zinc-200 md:text-sm" role="status">
              {tr("Mensaje copiado: pégalo en el chat de Instagram que se ha abierto.")}
            </p>
          )}
          <div className="flex items-center justify-between md:hidden">
            <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.1em] text-zinc-400">
              <InstagramIcon className="h-4 w-4" /> {LINKS.instagramHandle}
            </a>
            <span className="font-['JetBrains_Mono'] text-[9px] uppercase text-zinc-600">© {new Date().getFullYear()} JV</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════ */

export default function JVProductions() {
  const sections = useRef([]);
  const listeners = useRef(new Map());
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("jv-lang");
      if (saved) return saved;
    } catch {}
    return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
  });
  LANG = lang;
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("jv-lang", lang);
    } catch {}
  }, [lang]);
  const [booking, setBooking] = useState({ services: [], format: "Sesión por Horas", when: "Esta semana", name: "", hours: 2 });

  const ctx = useRef({
    subscribe(i, fn) {
      if (!listeners.current.has(i)) listeners.current.set(i, new Set());
      listeners.current.get(i).add(fn);
      return () => listeners.current.get(i).delete(fn);
    },
  }).current;

  // Bloquea el scroll mientras dura la intro
  useEffect(() => {
    document.documentElement.style.overflow = ready ? "" : "hidden";
  }, [ready]);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = reduce || TOUCH ? 1 : 0.26; // en táctil el dedo ya da la inercia
    const docEl = document.documentElement;
    const state = [];
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    let raf = 0;
    let first = true;

    const approach = (cur, target) => {
      const n = cur + (target - cur) * ease;
      return Math.abs(target - n) < 0.0004 ? target : n;
    };

    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      let moving = false;
      let current = 0;

      sections.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const tp = clamp01(-r.top / Math.max(1, el.offsetHeight - vh));
        const te = clamp01(1 - r.top / vh);
        const s = state[i] || (state[i] = { p: tp, e: te });
        if (first) Object.assign(s, { p: tp, e: te });
        s.p = approach(s.p, tp);
        s.e = approach(s.e, te);
        if (s.p !== tp || s.e !== te) moving = true;
        // Solo se toca el estilo si el valor cambia: las secciones fuera de pantalla no recalculan nada
        const p = s.p.toFixed(4);
        const e = s.e.toFixed(4);
        if (p !== s.wp || e !== s.we) {
          s.wp = p;
          s.we = e;
          el.style.setProperty("--p", p);
          el.style.setProperty("--enter", e);
          listeners.current.get(i)?.forEach((fn) => fn(s.p, s.e));
        }
        if (r.top <= vh * 0.5) current = i;
      });

      mouse.sx += (mouse.x - mouse.sx) * 0.08;
      mouse.sy += (mouse.y - mouse.sy) * 0.08;
      if (Math.abs(mouse.x - mouse.sx) > 0.001 || Math.abs(mouse.y - mouse.sy) > 0.001) moving = true;
      const mx = mouse.sx.toFixed(3);
      const my = mouse.sy.toFixed(3);
      if (mx !== mouse.wx || my !== mouse.wy) {
        mouse.wx = mx;
        mouse.wy = my;
        docEl.style.setProperty("--mx", mx);
        docEl.style.setProperty("--my", my);
      }

      first = false;
      setActive((a) => (a === current ? a : current));
      if (moving) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e) => {
      if (e.pointerType !== "mouse" || reduce) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      kick();
    };

    tick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Viaje animado: recorre la página entera hasta el destino (rebobina si sube)
  const trip = useRef(0);
  const travelTo = (top) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const from = window.scrollY;
    const dist = clamp(top, 0, max) - from;
    if (Math.abs(dist) < 8) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return window.scrollTo(0, from + dist);
    const id = ++trip.current;
    const dur = clamp((Math.abs(dist) / window.innerHeight) * 120, 900, 2600);
    const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const stops = sections.current.map((el) => (el ? el.offsetTop / max : 0));
    const end = () => {
      if (trip.current !== id) return;
      trip.current++;
      FX.warp = 0;
      ["wheel", "touchstart", "keydown"].forEach((ev) => window.removeEventListener(ev, end));
      window.dispatchEvent(new CustomEvent("jv-travel", { detail: { on: false } }));
    };
    ["wheel", "touchstart", "keydown"].forEach((ev) => window.addEventListener(ev, end, { passive: true }));
    FX.dir = Math.sign(dist);
    window.dispatchEvent(new CustomEvent("jv-travel", { detail: { on: true, dir: FX.dir, stops } }));
    const t0 = performance.now();
    const step = (now) => {
      if (trip.current !== id) return;
      const t = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, from + dist * easeIO(t));
      FX.warp = Math.sin(Math.PI * t);
      if (t < 1) requestAnimationFrame(step);
      else end();
    };
    requestAnimationFrame(step);
  };

  const goTo = (i) => {
    const el = sections.current[i];
    if (el) travelTo(i === 0 ? 0 : el.offsetTop);
  };

  const bookService = (service) => {
    setBooking((b) => ({
      ...b,
      services: b.services.includes(service) ? b.services : [...b.services, service],
      format: service === "Grabar Voces" ? "Sesión por Horas" : service === "Distribución" ? "Pack Lanzamiento" : b.format,
    }));
    goTo(S.booking);
  };

  const reg = (i) => (el) => (sections.current[i] = el);

  return (
    <ProgressCtx.Provider value={ctx}>
      <div className="relative overflow-x-clip bg-[#050505] font-['Space_Grotesk'] text-zinc-200 antialiased">
        <GlobalStyles />
        <Intro onDone={() => setReady(true)} />
        <World3D />
        <TravelHUD />
        <Nav goTo={goTo} light={false} lang={lang} setLang={setLang} />
        <BackToTop onClick={() => goTo(S.origin)} />
        <main>
          <ChapterOrigin index={S.origin} setRef={reg(S.origin)} />
          <ChapterStudio index={S.studio} setRef={reg(S.studio)} />
          <ChapterServices index={S.services} setRef={reg(S.services)} onBook={bookService} />
          <ChapterStatement index={S.statement} setRef={reg(S.statement)} />
          <ChapterBooking setRef={reg(S.booking)} booking={booking} setBooking={setBooking} />
        </main>
      </div>
    </ProgressCtx.Provider>
  );
}
