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
import { ArrowRight, Check, Minus, Plus, Volume2, VolumeX } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   CONFIGURACIÓN
   ═══════════════════════════════════════════════════════════════ */

const LINKS = {
  // REEMPLAZAR: tu número con prefijo de país, sin "+", espacios ni guiones (ej: 34612345678)
  whatsappNumber: "34000000000",
  instagram: "https://instagram.com/jvproduction",
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

const VIDEO = {
  // Montaje del estudio (etalonado, con cortes y cierre con logo) hecho a partir de tu vídeo original
  src: "videos/jv-studio-edit.mp4",
  poster: "videos/jv-studio-poster.jpg",
};

/* ═══════════════════════════════════════════════════════════════
   DATOS
   ═══════════════════════════════════════════════════════════════ */

// Orden de las secciones en la página
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
    text: "Instrumentales exclusivas hechas desde cero para tu voz y tu estilo: trap, reggaetón, R&B o drill.",
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
@import url('https://fonts.googleapis.com/css2?family=Anton&family=UnifrakturMaguntia&family=Jost:wght@200;300;400;500&family=Mrs+Saint+Delafield&family=Pinyon+Script&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

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
      className={`inline-flex select-none flex-col border-[3px] border-white bg-black text-white ${className}`}
      style={{ fontFamily: "'Arial Black', Arial, Helvetica, sans-serif" }}
      role="img"
      aria-label="Parental Advisory: Explicit Content"
    >
      <span className="bg-white px-2 text-center text-[8px] font-black leading-[12px] tracking-[0.28em] text-black">PARENTAL</span>
      <span className="px-2 py-[2px] text-center text-[17px] font-black leading-none tracking-tight">ADVISORY</span>
      <span className="bg-white px-2 text-center text-[7px] font-black leading-[11px] tracking-[0.12em] text-black">EXPLICIT CONTENT</span>
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
            className="h-[clamp(120px,24dvh,220px)]"
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

/** Silueta de pistola (apunta a la derecha) para el emblema */
const PISTOL =
  "M6 18 H170 L176 22 V40 H150 V50 H114 C114 64 106 70 94 70 H86 V62 C95 62 100 58 100 50 H64 L46 110 H6 L24 40 H6 Z";

/** Logo JV en rojo y blanco con armas cruzadas detrás */
function VampireLogo({ className = "" }) {
  return (
    <div className={`relative aspect-[827/804] w-full ${className}`}>
      {/* Armas cruzadas */}
      <svg viewBox="0 0 400 260" className="absolute left-1/2 top-[56%] w-[150%] -translate-x-1/2 -translate-y-1/2 opacity-80" aria-hidden="true">
        <g transform="translate(200 130) rotate(-24) translate(-30 -60)">
          <path d={PISTOL} fill="#0a0a0a" stroke="rgba(255,255,255,.55)" strokeWidth="1.4" />
        </g>
        <g transform="translate(200 130) scale(-1 1) rotate(-24) translate(-30 -60)">
          <path d={PISTOL} fill="#0a0a0a" stroke="rgba(255,255,255,.55)" strokeWidth="1.4" />
        </g>
      </svg>
      {/* Halo blanco tenue */}
      <div className="absolute inset-[18%] rounded-full bg-white/10 blur-[60px]" />
      <img
        src={IMAGES.logoVampire}
        alt="JV Productions"
        className="relative h-full w-full object-contain"
        style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,.9))" }}
      />
    </div>
  );
}

/** Reproductor de Spotify (artista, álbum o canción) a partir de LINKS.spotify */
function SpotifyPlayer({ className = "" }) {
  const m = LINKS.spotify.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(artist|album|track|playlist)\/([A-Za-z0-9]+)/);
  if (!m) return null;
  return (
    <iframe
      title="Música en Spotify"
      src={`https://open.spotify.com/embed/${m[1]}/${m[2]}?theme=0`}
      className={`h-[152px] w-full rounded-2xl border-0 ${className}`}
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
        style={{ objectPosition: pos, filter: "grayscale(1) contrast(1.25) brightness(.8)", ...imgStyle }}
      />
      <div className="absolute inset-0 mix-blend-soft-light" style={{ background: "linear-gradient(160deg, rgba(0,0,0,.45), rgba(0,0,0,.1) 50%, rgba(0,0,0,.5))" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_40%,rgba(5,5,5,.75)_100%)]" />
      {children}
    </div>
  );
}

function Nav({ goTo, light }) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-4 py-4 md:px-10 md:py-7">
      <button onClick={() => goTo(S.origin)} className="pointer-events-auto flex items-center gap-3" aria-label="Ir al inicio">
        <Logo className="h-9 md:h-11" />
        <span className={`hidden font-['Jost'] text-[11px] font-light uppercase tracking-[0.5em] transition-colors duration-500 sm:inline ${light ? "text-black/70" : "text-white/80"}`}>
          JV Productions
        </span>
      </button>
      <button
        onClick={() => goTo(S.booking)}
        className={`pointer-events-auto group relative overflow-hidden rounded-full border px-5 py-2.5 font-['Space_Grotesk'] text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md transition-colors duration-500 md:px-7 md:py-3 ${
          light ? "border-black/20 bg-white/40 text-black" : "border-white/20 bg-black/40 text-white"
        }`}
      >
        <span className="absolute inset-0 translate-y-full rounded-full bg-[#E10600] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:translate-y-0" />
        <span className="relative transition-colors duration-500 group-hover:text-black">Agendar sesión</span>
      </button>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAPÍTULO 02 — EL ESTUDIO (el vídeo montado crece y su luz llena la pantalla)
   ═══════════════════════════════════════════════════════════════ */

function ChapterStudio({ index, setRef }) {
  const root = useRef(null);
  const main = useRef(null);
  const ambient = useRef(null);
  const [muted, setMuted] = useState(true);

  useProgress(index, (p) => {
    const el = root.current;
    if (!el) return;
    el.style.setProperty("--v", seg(p, 0, 0.45).toFixed(4)); // el vídeo crece
    el.style.setProperty("--w", seg(p, 0.25, 0.85).toFixed(4)); // aparecen los textos
  });

  // React no sincroniza el atributo muted: se aplica a mano
  useEffect(() => {
    if (main.current) main.current.muted = muted;
  }, [muted]);

  // Solo reproduce mientras la sección está a la vista
  useEffect(() => {
    const vids = [main.current, ambient.current];
    const io = new IntersectionObserver(([e]) => vids.forEach((v) => v && (e.isIntersecting ? v.play().catch(() => {}) : v.pause())), { threshold: 0.05 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={(el) => {
        root.current = el;
        setRef(el);
      }}
      aria-label="El estudio"
      className="relative h-[300vh]"
      style={{ "--v": 0, "--w": 0 }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* La luz del propio vídeo, desenfocada, llena el fondo */}
        <video
          ref={ambient}
          src={VIDEO.src}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-125 object-cover blur-[60px]"
          style={{ opacity: "calc(0.15 + var(--v) * 0.4)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-[#050505]/30" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-6 px-5 pb-6 pt-24 md:flex-row md:justify-between md:gap-16 md:px-12">
          {/* Texto */}
          <div className="w-full max-w-md shrink-0 md:order-1">
            <p className="font-['UnifrakturMaguntia'] text-xl text-[#FF4D4D] md:text-2xl" style={{ opacity: reveal("--enter", 0.5, 0.9) }}>
              El estudio
            </p>
            <h2 className="mt-1 font-['Jost'] text-[clamp(1.8rem,4.6vw,4.2rem)] font-extralight uppercase leading-[1.02] tracking-[0.04em] text-white">
              <SplitReveal text="Donde nace tu sonido" from={0.55} to={1} letterClass="jv-chrome" />
            </h2>
            <p className="mt-3 font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] text-zinc-400" style={{ opacity: reveal("--enter", 0.8, 1) }}>
              Detrás del sonido: {TEAM.map((n, i) => (
                <React.Fragment key={n}>
                  {i > 0 && <span className="mx-2 text-[#E10600]">×</span>}
                  <span className="text-white">{n}</span>
                </React.Fragment>
              ))}
            </p>
            <ul className="mt-4 hidden space-y-3 md:mt-8 md:block">
              {STUDIO_LINES.map((l, i) => {
                const t = reveal("--w", (i * 0.25).toFixed(2), (i * 0.25 + 0.35).toFixed(2));
                return (
                  <li key={l} className="flex items-start gap-3 font-['Space_Grotesk'] text-base text-zinc-300" style={{ opacity: t, transform: `translateY(calc((1 - ${t}) * 16px))` }}>
                    <span className="mt-[11px] h-px w-6 shrink-0 bg-[#E10600]" />
                    {l}
                  </li>
                );
              })}
            </ul>
            <SpotifyPlayer className="mt-6 hidden md:block" />
          </div>

          {/* Vídeo montado en formato vertical */}
          <div
            className="relative aspect-[9/16] h-[min(62dvh,560px)] shrink-0 overflow-hidden rounded-[28px] border border-white/15 shadow-[0_60px_120px_-30px_rgba(0,0,0,.95)] md:order-2 md:h-[min(80dvh,760px)]"
            style={{
              transform: "perspective(1400px) translateY(calc((1 - var(--v)) * 14dvh)) rotateX(calc((1 - var(--v)) * 12deg)) scale(calc(0.86 + var(--v) * 0.14))",
              opacity: "calc(0.3 + var(--v) * 0.7)",
            }}
          >
            <video
              ref={main}
              src={VIDEO.src}
              poster={VIDEO.poster}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => setMuted((m) => !m)}
              className={`absolute right-4 top-4 inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 font-[Space_Grotesk] text-xs font-bold uppercase tracking-[0.14em] backdrop-blur-md transition-colors ${
                muted ? "bg-[#E10600] text-white shadow-[0_0_30px_rgba(225,6,0,.6)]" : "bg-black/60 text-white"
              }`}
              aria-label={muted ? "Activar sonido" : "Silenciar"}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {muted ? "Activar sonido" : "Silenciar"}
            </button>
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
      style={{ height: `${100 + n * 80}vh`, "--f": 0 }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-[#050505]">
        {SERVICES.map((s, i) => {
          // Cada servicio entra cubriendo al anterior desde abajo
          const t = i === 0 ? "1" : `clamp(0, calc(var(--f) - ${i - 1}), 1)`;
          const here = `clamp(0, calc(1 - (var(--f) - ${i}) * (var(--f) - ${i}) * 4.5), 1)`; // 1 cuando es el actual; se apaga antes de que entre el siguiente
          return (
            <div key={s.title} className="absolute inset-0" style={{ clipPath: `inset(calc((1 - ${t}) * 100%) 0 0 0)`, zIndex: i }}>
              <Photo src={s.img} pos={s.pos} className="absolute inset-0" imgStyle={{ transform: `scale(calc(1.12 - ${t} * 0.08))` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/55 to-[#050505]/10 md:bg-gradient-to-r md:from-[#050505] md:via-[#050505]/70 md:to-transparent" />

              <div className="relative flex h-full items-end px-5 pb-10 pt-24 md:items-center md:px-16 md:pb-0">
                <div className="max-w-xl" style={{ opacity: here, transform: `translateY(calc((1 - ${here}) * 30px))` }}>
                  <p className="font-['UnifrakturMaguntia'] text-lg text-[#FF4D4D] md:text-2xl">Servicios</p>
                  <h3 className="mt-1 font-['Jost'] text-[clamp(1.9rem,4.4vw,4rem)] font-extralight uppercase leading-[1.02] tracking-[0.03em] text-white">{s.title}</h3>
                  <p className="mt-4 max-w-lg font-['Space_Grotesk'] text-[15px] leading-relaxed text-zinc-300 md:text-lg">{s.text}</p>
                  <ul className="mt-5 space-y-2">
                    {s.includes.map((x) => (
                      <li key={x} className="flex items-center gap-3 font-['Space_Grotesk'] text-sm text-zinc-200 md:text-base">
                        <Check className="h-4 w-4 shrink-0 text-[#E10600]" strokeWidth={2.2} />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onBook(s.book)}
                    tabIndex={cur === i ? 0 : -1}
                    className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[#E10600] px-6 py-3.5 font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-[#ff2a2a]"
                  >
                    Agendar este servicio <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
              {s.title}
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
  const line1 = "Desde la idea hasta el lanzamiento.".split(" ");
  const line2 = "Hacemos realidad tu proyecto.".split(" ");
  const total = line1.length + line2.length;

  useProgress(index, (p) => root.current?.style.setProperty("--q", seg(p, 0.05, 0.75).toFixed(4)));

  const word = (w, i, gold) => {
    const t = `clamp(0, calc(var(--q) * ${total + 2} - ${i}), 1)`;
    return (
      <React.Fragment key={`${gold}-${i}`}>
        <span
          className={`inline-block ${gold ? "font-['UnifrakturMaguntia'] text-[#FF4D4D]" : ""}`}
          style={{ opacity: `calc(0.12 + 0.88 * ${t})`, filter: `blur(calc((1 - ${t}) * 6px))`, transform: `translateY(calc((1 - ${t}) * 0.25em))` }}
        >
          {w}
        </span>{" "}
      </React.Fragment>
    );
  };

  return (
    <section
      ref={(el) => {
        root.current = el;
        setRef(el);
      }}
      aria-label="Desde la idea hasta el lanzamiento"
      className="relative h-[220vh]"
      style={{ "--q": 0 }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <Photo src={IMAGES.crowdGold} className="absolute inset-0" imgStyle={{ transform: "scale(calc(1.1 - var(--p, 0) * 0.08))" }} />
        <div className="absolute inset-0 bg-[#050505]/55" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="max-w-5xl font-['Jost'] text-[clamp(1.7rem,4.6vw,4.4rem)] font-light uppercase leading-[1.12] tracking-[0.04em] text-white">
            {line1.map((w, i) => word(w, i, false))}
            <br className="hidden md:block" />
            {line2.map((w, i) => word(w, line1.length + i, true))}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3" style={{ opacity: reveal("--q", 0.85, 1) }}>
            <ParentalAdvisory />
            <span className="font-['Space_Grotesk'] text-sm text-zinc-300">Spotify · Apple Music · YouTube · TikTok</span>
          </div>
          <SpotifyPlayer className="mt-8 max-w-md md:hidden" />
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
  const totalWords = MANIFESTO.length;

  return (
    <section
      ref={(el) => {
        root.current = el;
        setRef(el);
      }}
      aria-label="Origen"
      className="relative h-[560vh]"
      style={{ "--h": 0, "--a": 0, "--b": 0, "--c": 0, "--d": 0, "--s": 1.8 }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
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
              transform: "translate(calc(var(--mx, 0) * -12px), calc(var(--my, 0) * -8px + var(--h) * -3dvh)) scale(calc(1.04 + var(--h) * 0.08 + var(--a) * 0.05))",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,transparent_0%,rgba(5,5,5,.5)_60%,rgba(5,5,5,.95)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        {/* Rayos de luz desde arriba; se inclinan con el ratón */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[75%] origin-top mix-blend-screen"
          style={{ opacity: "calc(0.65 - var(--c) * 0.65)", transform: "skewX(calc(var(--mx, 0) * -6deg))" }}
          aria-hidden="true"
        >
          {[14, 27, 39, 48, 55, 66, 79, 88].map((l, i) => (
            <span
              key={l}
              className="absolute top-0 h-full bg-gradient-to-b from-white/45 via-white/10 to-transparent blur-[2px]"
              style={{ left: `${l}%`, width: `${[6, 2, 10, 1, 4, 2, 8, 1][i]}px`, animation: `jv-beam ${3 + i * 0.7}s ease-in-out ${-i}s infinite` }}
            />
          ))}
        </div>

        {/* Niebla en capas con parallax */}
        <div
          className="absolute inset-0"
          style={{
            transform: "translate(calc(var(--mx, 0) * -24px), calc(var(--h) * -6vh + var(--b) * -18vh))",
            opacity: "calc(0.22 + var(--h) * 0.15 - var(--c) * 0.4)",
          }}
        >
          <Fog seed={4} tint="0.7 0.7 0.72" className="-left-[10%] top-[30%] h-[80%] w-[140%] [animation:jv-drift_40s_ease-in-out_infinite]" />
        </div>

        {/* Logo fijo desde el primer momento, con armas cruzadas detrás */}
        <div
          className="absolute left-1/2 top-[36%] z-[26] w-[clamp(250px,52dvh,520px)] max-w-[92vw]"
          style={{
            transform:
              "translate(-50%, -50%) translate(calc(var(--mx, 0) * -10px), calc(var(--my, 0) * -8px + var(--b) * -18dvh)) scale(calc(1 - var(--b) * 0.5))",
            opacity: "calc(1 - var(--c) * 1.6)",
          }}
        >
          <VampireLogo />
        </div>

        {/* Eslogan bajo el micro */}
        <div
          className="absolute inset-x-0 bottom-[13%] z-10 flex justify-center px-6"
          style={{ opacity: "calc(1 - var(--b) * 2)", transform: "translateY(calc(var(--h) * -3dvh))" }}
        >
          <div className="flex w-full max-w-xl items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/60" />
            <h1 className="text-center font-['Jost'] text-[10px] font-light uppercase tracking-[0.42em] text-zinc-100 sm:text-xs md:text-sm">
              Tu música, <span className="font-['UnifrakturMaguntia'] text-[1.5em] normal-case tracking-normal text-[#E10600]">nuestra producción</span>
            </h1>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/60" />
          </div>
        </div>

        {/* Pista de scroll: solo una línea que respira */}
        <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2" style={{ opacity: "calc(1 - var(--h) * 3)" }} aria-hidden="true">
          <span className="relative block h-12 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-white [animation:jv-hint_2s_cubic-bezier(.6,0,.4,1)_infinite]" />
          </span>
        </div>

        {/* Fondo del estudio que aparece detrás del panel */}
        <div className="absolute inset-0 z-[15]" style={{ opacity: "var(--c)" }} aria-hidden="true">
          <img src={IMAGES.studioWall} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ transform: "scale(calc(1.08 - var(--d) * 0.04))", filter: "blur(3px) saturate(.8)" }} />
          <div className="absolute inset-0 bg-[#050505]/75" />
        </div>

        {/* Abanico de cartas (se inclina en 3D con el ratón) */}
        {FAN.map((card, i) => {
          const [rx, rr, ry] = rest[i];
          const [ox, or, oy] = open[i];
          const hero = i === HERO_CARD;
          const x = `calc((${rx} + (${ox - rx}) * var(--b)) * ${hero ? "(1 - var(--c))" : "(1 + var(--c) * 1.4)"} * 1%)`;
          const r = `calc((${rr} + (${or - rr}) * var(--b)) * ${hero ? "(1 - var(--c))" : "1"} * 1deg)`;
          const y = `calc((${ry} + (${oy - ry}) * var(--b)) * 1px + (1 - var(--b)) * 75dvh + ${hero ? "(1 - var(--c))" : "1"} * 12dvh)`;
          const tilt = hero ? "(1 - var(--c))" : "1";
          return (
            <figure
              key={card.label}
              ref={hero ? heroCard : undefined}
              className="absolute left-1/2 top-1/2 z-20 aspect-[3/4] h-[clamp(190px,44dvh,420px)] max-w-[56vw] overflow-hidden border border-white/15 bg-zinc-900 shadow-[0_30px_80px_-10px_rgba(0,0,0,.9)] will-change-transform"
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
                alt={card.label}
                className="h-full w-full object-cover"
                style={{ objectPosition: card.pos, transform: hero ? "scale(calc(1.04 + var(--d) * 0.04))" : "scale(1.04)" }}
              />
              {/* Reflejo especular que se mueve con el ratón */}
              <div
                className="pointer-events-none absolute inset-0 mix-blend-overlay"
                style={{
                  background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,.35) 48%, transparent 62%)",
                  transform: "translateX(calc(var(--mx, 0) * 40%))",
                  opacity: hero ? "calc(1 - var(--c))" : 1,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" style={hero ? { opacity: "calc(1 - var(--c))" } : undefined} />
              <figcaption className="absolute inset-x-0 bottom-0 p-4" style={hero ? { opacity: "calc(1 - var(--c) * 3)" } : undefined}>
                <span className="block font-['UnifrakturMaguntia'] text-xl text-white md:text-2xl">{card.label}</span>
              </figcaption>
            </figure>
          );
        })}


        {/* Manifiesto palabra a palabra sobre la foto expandida: cada palabra sale del desenfoque */}
        <div className="absolute inset-0 z-30 bg-black" style={{ opacity: "calc(var(--c) * 0.35 + var(--d) * 0.45)" }} />
        <div className="absolute inset-0 z-40 flex items-center justify-center px-5 md:px-16" style={{ opacity: "calc(var(--c) * 2 - 1)" }}>
          <p className="max-w-5xl text-center font-['Jost'] text-[clamp(1.5rem,3.8vw,3.6rem)] font-light uppercase leading-[1.18] tracking-[0.04em] text-white">
            {MANIFESTO.map((w, i) => {
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
                    className={`inline-block ${em ? "font-['UnifrakturMaguntia'] text-[#FF4D4D]" : ""}`}
                    style={{
                      opacity: `calc(0.12 + 0.88 * ${t})`,
                      filter: `blur(calc((1 - ${t}) * 6px))`,
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
        active ? "border-[#E10600] bg-[#E10600] text-white" : "border-black/20 bg-white/50 text-black/80 hover:-translate-y-0.5 hover:border-black/50"
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

  const message =
    `Hola JV Productions, soy ${name.trim() || "un artista"} y quiero agendar: ${services.join(", ") || "-"}` +
    ` en formato ${format}${format === "Sesión por Horas" ? ` (${hours}h)` : ""}, para ${when.toLowerCase()}. ¿Tenéis disponibilidad?`;
  const ready = services.length > 0;
  const send = () => ready && window.open(`https://wa.me/${LINKS.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");

  return (
    <section ref={setRef} aria-label="Agendar" className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-3 pb-4 pt-[72px] md:px-10 md:pb-10 md:pt-28">
      {/* La luz se abre en círculo desde abajo */}
      <div className="absolute inset-0" style={{ clipPath: "circle(calc(var(--enter, 0) * 135%) at 50% 100%)" }}>
        <img src={IMAGES.crowdGold} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ transform: "scale(calc(1.08 - var(--enter, 0) * 0.06))" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(10,10,11,.9)_0%,rgba(5,5,5,.88)_50%,rgba(0,0,0,.8)_100%)]" />
      </div>
      <Fog seed={21} tint="0.6 0.6 0.62" className="left-0 top-0 h-full w-full" style={{ opacity: "calc(var(--enter, 0) * 0.9)" }} />
      <div
        className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 whitespace-nowrap font-['Anton'] text-[clamp(5rem,22vw,22rem)] uppercase leading-none text-white/[0.05]"
        style={{ transform: "translateX(calc(-50% + (1 - var(--enter, 0)) * 20vw))" }}
        aria-hidden="true"
      >
        Suena a disco
      </div>

      <div
        className="no-scrollbar relative z-10 grid max-h-full w-full max-w-6xl overflow-y-auto rounded-[32px] bg-gradient-to-br from-white via-zinc-100 to-zinc-300 text-black shadow-[0_50px_140px_-30px_rgba(60,40,0,.55)] md:grid-cols-5"
        style={{
          transform: "perspective(1400px) translateY(calc((1 - var(--enter, 0)) * 120px)) rotateX(calc((1 - var(--enter, 0)) * 14deg))",
          opacity: "calc(var(--enter, 0) * 1.4 - 0.2)",
        }}
      >
        <div className="relative flex flex-col justify-between gap-4 p-4 pb-3 md:col-span-2 md:border-r md:border-black/10 md:p-10">
          <h2 className="font-['Anton'] text-[clamp(1.7rem,5dvh,4.5rem)] uppercase leading-[0.92] text-[#E10600]">
            <SplitReveal text="¿Listo para sonar profesional?" from={0.55} to={1} />
          </h2>
          <div className="hidden md:block">
            <p className="mb-2 font-['UnifrakturMaguntia'] text-lg text-black/60">Tu mensaje</p>
            <div className="rounded-2xl rounded-bl-sm bg-[#d9fdd3] p-4 font-['Space_Grotesk'] text-sm leading-relaxed text-black/80 shadow-sm">{message}</div>
          </div>
          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 font-['Space_Grotesk'] text-sm font-bold uppercase tracking-[0.12em] text-black/70 transition-colors hover:text-black md:inline-flex"
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
              <legend className="mb-1.5 font-['UnifrakturMaguntia'] text-base text-black/70 md:text-lg">{label}</legend>
              <div className="flex flex-wrap gap-1.5">
                {opts.map((o) => (
                  <Choice key={o} active={isOn(o)} onClick={() => pick(o)}>
                    {o}
                    {o === "Sesión por Horas" && format === o ? ` · ${hours}h` : ""}
                  </Choice>
                ))}
                {label === "Formato" && format === "Sesión por Horas" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-black/20 bg-white/50 px-1">
                    <button onClick={() => set("hours", Math.max(1, hours - 1))} className="grid h-7 w-7 place-items-center rounded-full hover:bg-black/10" aria-label="Menos horas">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[2.5ch] text-center font-['Space_Grotesk'] text-xs font-semibold">{hours}h</span>
                    <button onClick={() => set("hours", Math.min(10, hours + 1))} className="grid h-7 w-7 place-items-center rounded-full hover:bg-black/10" aria-label="Más horas">
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
            placeholder="Tu nombre artístico (opcional)"
            aria-label="Nombre artístico"
            maxLength={40}
            className="w-full rounded-full border border-black/20 bg-white/70 px-4 py-2 font-['Space_Grotesk'] text-sm text-black placeholder:text-black/40 focus:border-black focus:outline-none md:py-2.5"
          />
          <button
            onClick={send}
            disabled={!ready}
            data-cursor={ready ? "Enviar" : undefined}
            className="group relative mt-1 flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#E10600] px-5 py-3 font-['Anton'] text-base uppercase tracking-[0.08em] text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 md:py-5 md:text-2xl"
          >
            <span className="absolute inset-0 -translate-x-full bg-black transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-enabled:group-hover:translate-x-0" />
            <WhatsAppIcon className="relative h-6 w-6 text-white transition-colors duration-700 group-enabled:group-hover:text-[#25D366]" />
            <span className="relative transition-colors duration-700 group-enabled:group-hover:text-white">{ready ? "Agendar por WhatsApp ahora" : "Elige al menos un servicio"}</span>
            {ready && <ArrowRight className="relative h-5 w-5 transition-all duration-700 group-hover:translate-x-1" />}
          </button>
          <div className="flex items-center justify-between md:hidden">
            <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.1em] text-black/70">
              <InstagramIcon className="h-4 w-4" /> {LINKS.instagramHandle}
            </a>
            <span className="font-['JetBrains_Mono'] text-[9px] uppercase text-black/40">© {new Date().getFullYear()} JV</span>
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
    const ease = reduce ? 1 : 0.12;
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
        el.style.setProperty("--p", s.p.toFixed(4));
        el.style.setProperty("--enter", s.e.toFixed(4));
        listeners.current.get(i)?.forEach((fn) => fn(s.p, s.e));
        if (r.top <= vh * 0.5) current = i;
      });

      mouse.sx += (mouse.x - mouse.sx) * 0.08;
      mouse.sy += (mouse.y - mouse.sy) * 0.08;
      if (Math.abs(mouse.x - mouse.sx) > 0.001 || Math.abs(mouse.y - mouse.sy) > 0.001) moving = true;
      docEl.style.setProperty("--mx", mouse.sx.toFixed(4));
      docEl.style.setProperty("--my", mouse.sy.toFixed(4));

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

  const goTo = (i) => {
    const el = sections.current[i];
    if (el) window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
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
      <div className="jv-grain relative overflow-x-clip bg-[#050505] font-['Space_Grotesk'] text-zinc-200 antialiased">
        <GlobalStyles />
        <Intro onDone={() => setReady(true)} />
        <Nav goTo={goTo} light={false} />
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
