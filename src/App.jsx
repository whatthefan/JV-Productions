/**
 * JV PRODUCTIONS — Experiencia inmersiva guiada por scroll (v2)
 * Intro cinematográfica, cursor propio, menú a pantalla completa, scroll con inercia,
 * 4 capítulos fijados en pantalla + un interludio tipográfico.
 * Stack: React + Tailwind CSS + lucide-react
 *
 * Personaliza LINKS e IMAGES justo debajo.
 */
import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import {
  Crown,
  Play,
  Pause,
  SkipForward,
  SlidersVertical,
  SlidersHorizontal,
  MonitorPlay,
  Music,
  NotebookPen,
  Image as ImageIcon,
  Mic,
  Clapperboard,
  Globe,
  ArrowRight,
  ArrowUpRight,
  Check,
  Minus,
  Plus,
  Disc3,
  Rocket,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   CONFIGURACIÓN
   ═══════════════════════════════════════════════════════════════ */

const LINKS = {
  // REEMPLAZAR: tu número con prefijo de país, sin "+", espacios ni guiones (ej: 34612345678)
  whatsappNumber: "34000000000",
  instagram: "https://instagram.com/jvproduction",
  instagramHandle: "@JVPRODUCTION",
};

const IMAGES = {
  // Logo JV sobre fondo negro (se funde con mix-blend-screen)
  logo: "img/logo-jv.jpg",
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

/* ═══════════════════════════════════════════════════════════════
   DATOS
   ═══════════════════════════════════════════════════════════════ */

// Orden de las secciones en la página
const S = { origin: 0, interlude: 1, services: 2, experience: 3, booking: 4 };

const MENU = [
  { label: "Origen", sub: "El estudio", to: S.origin, img: IMAGES.studioWall },
  { label: "Servicios", sub: "360° Music Factory", to: S.services, img: IMAGES.heroMic },
  { label: "Experiencia", sub: "De maqueta a master", to: S.experience, img: IMAGES.consoleAmber },
  { label: "Agendar", sub: "Reserva por WhatsApp", to: S.booking, img: IMAGES.crowdGold },
];

// Añade `src: "beats/archivo.mp3"` para audio real; sin src el reproductor se simula.
const BEATS = [
  { title: "Medianoche en el Bunker", genre: "Trap", bpm: 142, dur: 174 },
  { title: "Perreo de Cromo", genre: "Reggaetón", bpm: 94, dur: 186 },
  { title: "Luz Ámbar", genre: "R&B", bpm: 78, dur: 201 },
];

const FAN = [
  /* FOTO ESTUDIO 1: DAW */
  { src: IMAGES.setup, label: "El Setup", pos: "50% 38%" },
  /* FOTO ESTUDIO 2: EN LA ZONA (se expande) */
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

const INTERLUDE_A = ["Trap", { img: IMAGES.zone }, "Reggaetón", { img: IMAGES.pxRapper }, "R&B", { img: IMAGES.night }, "Drill", { img: IMAGES.pxMic }];
const INTERLUDE_B = ["sonido de élite", "·", "hecho de noche", "·", "con la corona puesta", "·"];

const SERVICES = [
  { id: "produccion", cat: 0, title: "Producción Musical Completa", icon: SlidersVertical, book: "Producción Completa", img: "img/stock/sv-produccion.jpg", desc: "Dirección artística y creación integral de tu tema desde cero." },
  { id: "beats", cat: 0, title: "Creación de Beats Personalizados", icon: Music, book: "Beat a Medida", img: "img/stock/sv-beats.jpg", desc: "Instrumentales exclusivas a medida de tu flow. Toca los pads." },
  { id: "voces", cat: 0, title: "Grabación de Voces por Horas", icon: Mic, book: "Grabar Voces", img: "img/stock/sv-voces.jpg", desc: "Cabina tratada, previos de gama alta y dirección vocal en sesión." },
  { id: "mezcla", cat: 0, title: "Mezcla y Mastering", icon: SlidersHorizontal, book: "Mezcla / Master", img: "img/stock/sv-mezcla.jpg", desc: "Sonido comercial y cristalino. Mueve los faders." },
  { id: "letras", cat: 1, title: "Composición de Letras", icon: NotebookPen, book: "Letras", img: "img/stock/sv-letras.jpg", desc: "Co-writing, melodías pegadizas y barras con identidad propia." },
  { id: "portadas", cat: 1, title: "Diseño de Portadas", icon: ImageIcon, book: "Portada", img: "img/stock/sv-portadas.jpg", desc: "Cover art con estética de sello discográfico. Toca la portada." },
  { id: "visualizers", cat: 1, title: "Visualizers", icon: MonitorPlay, book: "Videoclip / Visuals", img: "img/stock/sv-visualizers.jpg", desc: "Piezas visuales hipnóticas para YouTube y redes." },
  { id: "videoclips", cat: 1, title: "Videoclips", icon: Clapperboard, book: "Videoclip / Visuals", img: "img/stock/sv-videoclips.jpg", desc: "Producción cinematográfica callejera, nocturna y de alto impacto." },
  { id: "distribucion", cat: 2, title: "Distribución Musical", icon: Globe, book: "Distribución", img: "img/stock/sv-distribucion.jpg", desc: "Subida, regalías y posicionamiento en Spotify, Apple Music y todas las tiendas." },
];
// Palabra gigante de fondo según el bloque de servicios que se está viendo
const CATEGORY_WORDS = ["Sonido", "Imagen", "Mundo"];

const STEPS = [
  { icon: Disc3, short: "Idea & Beat", desc: "Fijamos referencias y construimos la instrumental a tu medida." },
  { icon: Mic, short: "Cabina", desc: "Tomas, dobles y ad-libs dirigidos hasta que suene a disco." },
  { icon: SlidersHorizontal, short: "Mezcla & Arte", desc: "Master comercial + portada, visualizer o videoclip." },
  { icon: Rocket, short: "Lanzamiento", desc: "Distribución global y regalías. Tú solo suenas." },
];

const BOOK_SERVICES = ["Grabar Voces", "Producción Completa", "Beat a Medida", "Mezcla / Master", "Videoclip / Visuals", "Letras", "Portada", "Distribución"];
const BOOK_FORMATS = ["Sesión por Horas", "Proyecto Completo", "Pack Lanzamiento"];
const BOOK_WHEN = ["Esta semana", "Próxima semana", "Urgente"];

const LYRICS = [
  "Desde abajo con la corona puesta,",
  "la noche escribe lo que el día no contesta.",
  "Cromo en la voz, oro en la libreta,",
  "cada barra es una puerta que se abre completa.",
];

/* ═══════════════════════════════════════════════════════════════
   MOTOR DE SCROLL
   Cada sección recibe, suavizadas con inercia:
   --p (0→1 mientras está fijada), --enter (0→1 al entrar) y --t (0→1 mientras cruza la pantalla).
   En la raíz del documento: --mx / --my (ratón, -1→1) y --vel (velocidad de scroll, -1→1).
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
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@0;1&family=Jost:wght@200;300;400;500&family=Mrs+Saint+Delafield&family=Pinyon+Script&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

html, body { background: #050505; margin: 0; }
::selection { background: #D4AF37; color: #050505; }
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
.jv-gold { background: linear-gradient(180deg, #fff3c4 0%, #D4AF37 45%, #8a6a12 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.jv-outline { color: transparent; -webkit-text-stroke: 1px rgba(226,232,240,.45); }
.jv-line { background: linear-gradient(90deg, transparent, rgba(226,232,240,.75), transparent); }

/* Borde degradado cromo/oro para tarjetas */
.jv-frame {
  border: 1px solid transparent;
  background:
    linear-gradient(160deg, rgba(24,24,27,.92), rgba(9,9,11,.92)) padding-box,
    linear-gradient(140deg, rgba(255,255,255,.28), rgba(255,255,255,.04) 38%, rgba(255,255,255,.02) 62%, rgba(212,175,55,.45)) border-box;
}
.jv-frame.is-on {
  background:
    linear-gradient(160deg, rgba(30,26,14,.95), rgba(9,9,11,.95)) padding-box,
    linear-gradient(140deg, #fff3c4, #D4AF37 40%, rgba(212,175,55,.2) 70%, #D4AF37) border-box;
}

.jv-grain::after {
  content: ""; position: fixed; inset: -100%; z-index: 90; pointer-events: none; opacity: .07;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: jv-grain 1.2s steps(6) infinite;
}

/* Cursor propio (solo ratón) */
@media (pointer: fine) { .jv-root, .jv-root * { cursor: none !important; } }
.jv-cursor-ring {
  position: fixed; left: 0; top: 0; width: 34px; height: 34px; margin: -17px 0 0 -17px; border-radius: 9999px;
  border: 1px solid rgba(226,232,240,.55); display: grid; place-items: center; pointer-events: none; z-index: 200;
  transition: width .35s cubic-bezier(.2,.7,.2,1), height .35s cubic-bezier(.2,.7,.2,1), margin .35s cubic-bezier(.2,.7,.2,1), background-color .3s, border-color .3s, opacity .3s;
}
.jv-cursor-ring[data-state="hover"] { width: 58px; height: 58px; margin: -29px 0 0 -29px; border-color: #D4AF37; background: rgba(212,175,55,.08); }
.jv-cursor-ring[data-state="label"] { width: 92px; height: 92px; margin: -46px 0 0 -46px; border-color: #D4AF37; background: #D4AF37; }
.jv-cursor-ring > span { opacity: 0; transition: opacity .2s; font: 600 10px 'Space Grotesk', sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #050505; }
.jv-cursor-ring[data-state="label"] > span { opacity: 1; }
.jv-cursor-dot { position: fixed; left: 0; top: 0; width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 9999px; background: #fff; pointer-events: none; z-index: 201; mix-blend-mode: difference; }

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
@keyframes jv-hint {0% { transform: translateY(-100%) } 100% { transform: translateY(200%) } }
@keyframes jv-morph { 0%,100% { border-radius: 42% 58% 63% 37% / 41% 44% 56% 59% } 50% { border-radius: 58% 42% 38% 62% / 55% 61% 39% 45% } }
.jv-eq > span { transform-origin: bottom; animation: jv-eq 1s ease-in-out infinite; }
.jv-eq.is-paused > span { animation: none; transform: scaleY(.12); transition: transform .4s; }

.jv-vinyl {
  background:
    radial-gradient(circle at 50% 50%, #0b0b0c 0 12%, #D4AF37 12.3% 15%, #111 15.3% 16.5%, transparent 16.7%),
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

const CursorIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M4 3l7.5 18 2.4-7.1L21 11.5z" fill="#D4AF37" stroke="#050505" strokeWidth="1.5" strokeLinejoin="round" />
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
    <img
      src={IMAGES.logo}
      alt="JV Productions"
      className={`w-auto object-contain mix-blend-screen ${className}`}
      style={{
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 42%, transparent 70%)",
        maskImage: "radial-gradient(circle at 50% 50%, #000 42%, transparent 70%)",
        ...style,
      }}
    />
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

function Pill({ children, className = "", style }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 font-['Space_Grotesk'] text-[11px] font-medium tracking-wide text-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,.5)] backdrop-blur-xl md:text-xs ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

/** El contenido se desplaza un poco hacia el puntero (botones "magnéticos") */
function Magnetic({ children, strength = 0.3, className = "" }) {
  const ref = useRef(null);
  return (
    <span
      ref={ref}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
      }}
      onPointerLeave={() => (ref.current.style.transform = "")}
    >
      {children}
    </span>
  );
}

/** Texto que sube letra a letra desde una máscara, guiado por una variable de scroll */
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

function EqBars({ playing, count = 40, className = "" }) {
  return (
    <div className={`jv-eq flex items-end gap-[2px] ${playing ? "" : "is-paused"} ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="h-full flex-1 rounded-full bg-gradient-to-t from-[#D4AF37] via-zinc-200 to-white"
          style={{ animationDuration: `${0.55 + ((i * 37) % 10) / 14}s`, animationDelay: `-${(i * 0.09).toFixed(2)}s` }}
        />
      ))}
    </div>
  );
}

const fmt = (sec) => {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

// Sonido corto para los pads (Web Audio, sin archivos)
let audioCtx;
function blip(i) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    const kick = i % 4 === 0;
    o.type = kick ? "sine" : "triangle";
    o.frequency.setValueAtTime(kick ? 150 : [0, 262, 330, 392, 0, 440, 523, 659][i], t);
    if (kick) o.frequency.exponentialRampToValueAtTime(45, t + 0.25);
    g.gain.setValueAtTime(0.28, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g).connect(audioCtx.destination);
    o.start(t);
    o.stop(t + 0.32);
  } catch (e) {
    /* sin audio disponible */
  }
}

/* ═══════════════════════════════════════════════════════════════
   INTRO + CURSOR + NAVEGACIÓN + REPRODUCTOR
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
            className="mt-6 block h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
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

/** Punto + anillo que sigue al ratón; muestra el texto de data-cursor="..." */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);
  const fine = useMedia("(pointer: fine)");

  useEffect(() => {
    if (!fine) return;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target.closest ? e.target.closest("[data-cursor]") : null;
      const interactive = e.target.closest ? e.target.closest("a,button,input,[role='button'],[role='slider']") : null;
      const text = t ? t.getAttribute("data-cursor") : "";
      if (label.current.textContent !== text) label.current.textContent = text;
      ring.current.dataset.state = text ? "label" : interactive ? "hover" : "";
    };
    const leave = () => (ring.current.style.opacity = dot.current.style.opacity = "0");
    const enter = () => (ring.current.style.opacity = dot.current.style.opacity = "1");
    const loop = () => {
      rx += (x - rx) * 0.17;
      ry += (y - ry) * 0.17;
      dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [fine]);

  if (!fine) return null;
  return (
    <>
      <div ref={ring} className="jv-cursor-ring" aria-hidden="true">
        <span ref={label} />
      </div>
      <div ref={dot} className="jv-cursor-dot" aria-hidden="true" />
    </>
  );
}

function Nav({ menuOpen, setMenuOpen, goTo }) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-4 py-4 md:px-10 md:py-7">
      <button onClick={() => goTo(S.origin)} className="pointer-events-auto flex items-center gap-2.5 mix-blend-difference" aria-label="Ir al inicio">
        <Crown className="h-4 w-4 text-white" strokeWidth={1.5} />
        <span className="font-['Jost'] text-[11px] font-light uppercase tracking-[0.5em] text-white">
          JV<span className="hidden sm:inline"> Productions</span>
        </span>
      </button>
      <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
        <Magnetic>
          <button
            onClick={() => goTo(S.booking)}
            className="group relative overflow-hidden rounded-full border border-white/20 bg-black/40 px-4 py-2.5 font-['Space_Grotesk'] text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md md:px-6 md:py-3"
          >
            <span className="absolute inset-0 translate-y-full rounded-full bg-[#D4AF37] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:translate-y-0" />
            <span className="relative transition-colors duration-500 group-hover:text-black">Agendar</span>
          </button>
        </Magnetic>
        <Magnetic>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md md:h-11 md:w-11"
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-px w-5 bg-white transition-all duration-500 ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px bg-white transition-all duration-500 ${menuOpen ? "top-1.5 w-5 -rotate-45" : "top-3 w-3"}`} />
            </span>
          </button>
        </Magnetic>
      </div>
    </header>
  );
}

/** Menú a pantalla completa: se abre como un círculo desde el botón */
function MenuOverlay({ open, onClose, goTo }) {
  const [hover, setHover] = useState(0);
  return (
    <div
      className="fixed inset-0 z-[60] bg-[#070708] text-white"
      style={{
        clipPath: open ? "circle(150% at calc(100% - 44px) 44px)" : "circle(0% at calc(100% - 44px) 44px)",
        transition: "clip-path 1s cubic-bezier(.76,0,.24,1)",
        pointerEvents: open ? "auto" : "none",
      }}
      aria-hidden={!open}
    >
      {MENU.map((m, i) => (
        <img
          key={m.label}
          src={m.img}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-all duration-1000"
          style={{ opacity: hover === i ? 0.35 : 0, transform: hover === i ? "scale(1)" : "scale(1.05)" }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
      <nav className="relative flex h-full flex-col justify-center px-6 md:px-20" aria-label="Menú">
        {MENU.map((m, i) => (
          <button
            key={m.label}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onClick={() => {
              onClose();
              setTimeout(() => goTo(m.to), 350);
            }}
            tabIndex={open ? 0 : -1}
            data-cursor="Ir"
            className="group flex items-baseline gap-4 overflow-hidden py-1 text-left md:gap-8"
          >
            <span
              className="block font-['Jost'] text-[clamp(2.4rem,8vw,7rem)] font-extralight uppercase leading-[1.02] tracking-[0.02em] transition-[transform,color] duration-700"
              style={{
                transform: open ? "translateY(0)" : "translateY(110%)",
                transitionDelay: open ? `${300 + i * 80}ms` : "0ms",
                color: hover === i ? "#fff" : "rgba(255,255,255,.35)",
              }}
            >
              {m.label}
            </span>
            <span
              className="hidden font-['Instrument_Serif'] text-2xl italic text-[#D4AF37] transition-all duration-500 md:inline"
              style={{ opacity: hover === i && open ? 1 : 0, transform: hover === i ? "translateX(0)" : "translateX(-12px)" }}
            >
              {m.sub}
            </span>
          </button>
        ))}
        <div
          className="mt-10 flex flex-wrap items-center gap-6 font-['Space_Grotesk'] text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 transition-opacity duration-700"
          style={{ opacity: open ? 1 : 0, transitionDelay: open ? "700ms" : "0ms" }}
        >
          <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white" tabIndex={open ? 0 : -1}>
            <InstagramIcon className="h-4 w-4" /> {LINKS.instagramHandle}
          </a>
          <a href={`https://wa.me/${LINKS.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white" tabIndex={open ? 0 : -1}>
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </nav>
    </div>
  );
}

/** Reproductor: disco con texto giratorio; al pasar el ratón muestra el beat */
function FloatingPlayer({ hidden }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const audioRef = useRef(null);
  const beat = BEATS[idx];

  useEffect(() => {
    if (!playing || beat.src) return;
    const t = setInterval(() => setPos((p) => (p + 0.25 >= beat.dur ? 0 : p + 0.25)), 250);
    return () => clearInterval(t);
  }, [playing, beat]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !beat.src) return;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [playing, idx]);

  const next = () => {
    setIdx((i) => (i + 1) % BEATS.length);
    setPos(0);
    setPlaying(true);
  };

  return (
    <div
      className={`group fixed bottom-3 left-3 z-40 flex items-center transition-all duration-700 md:bottom-6 md:left-6 ${hidden ? "pointer-events-none translate-y-8 opacity-0" : "opacity-100"}`}
    >
      {beat.src && <audio ref={audioRef} src={beat.src} onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)} onEnded={next} />}
      <button
        onClick={() => setPlaying((p) => !p)}
        data-cursor={playing ? "Pausa" : "Play"}
        className="relative grid h-16 w-16 shrink-0 place-items-center md:h-[76px] md:w-[76px]"
        aria-label={playing ? "Pausar beat" : "Escuchar beat"}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ animation: `jv-spin ${playing ? 6 : 16}s linear infinite` }} aria-hidden="true">
          <defs>
            <path id="jv-ring" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
          </defs>
          <text fill="#E2E8F0" fontSize="9.6" letterSpacing="3.2" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            <textPath href="#jv-ring">JV BEATS · ESCUCHAR · JV BEATS · ESCUCHAR ·</textPath>
          </text>
        </svg>
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(180deg,#fff,#a3abb8)] text-black shadow-[0_6px_20px_rgba(0,0,0,.6)] transition-transform duration-300 group-hover:scale-110 md:h-11 md:w-11">
          {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" />}
        </span>
      </button>
      <div
        className={`ml-1 hidden items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-black/60 py-2 pl-4 pr-3 backdrop-blur-md transition-all duration-500 sm:flex ${
          playing ? "max-w-[340px] opacity-100" : "max-w-0 border-transparent px-0 opacity-0 group-hover:max-w-[340px] group-hover:border-white/10 group-hover:pl-4 group-hover:pr-3 group-hover:opacity-100"
        }`}
      >
        <div className="w-36 whitespace-nowrap">
          <p className="truncate font-['Space_Grotesk'] text-xs font-semibold text-white">{beat.title}</p>
          <p className="font-['Instrument_Serif'] text-[13px] italic text-zinc-400">
            {beat.genre} · {fmt(pos)}
          </p>
        </div>
        <EqBars playing={playing} count={10} className="h-5 w-12" />
        <button onClick={next} className="text-zinc-400 transition-colors hover:text-white" aria-label="Siguiente beat">
          <SkipForward className="h-4 w-4" />
        </button>
      </div>
    </div>
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
  const wordmark = "font-['Jost'] font-extralight uppercase text-white/90";

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
        {/* Fondo: azul cobalto profundo que se calienta */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,#0b1a4a_0%,#050505_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(109,40,217,.35),transparent_60%)]" style={{ opacity: "var(--b)" }} />

        {/* Escena 1: micro bajo un haz de luz. La cámara avanza despacio hacia la luz. */}
        <div className="absolute inset-0" style={{ opacity: "calc(1 - var(--a))" }}>
          <img
            src={IMAGES.heroMic}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: "50% 62%",
              transform: "translate(calc(var(--mx, 0) * -12px), calc(var(--my, 0) * -8px + var(--h) * -3dvh)) scale(calc(1.04 + var(--h) * 0.08 + var(--a) * 0.05))",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,transparent_0%,rgba(5,5,5,.55)_60%,rgba(5,5,5,.95)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        {/* Rayos de luz desde arriba; se inclinan con el ratón */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[75%] origin-top mix-blend-screen"
          style={{ opacity: "calc(0.7 - var(--c) * 0.7)", transform: "skewX(calc(var(--mx, 0) * -6deg))" }}
          aria-hidden="true"
        >
          {[14, 27, 39, 48, 55, 66, 79, 88].map((l, i) => (
            <span
              key={l}
              className="absolute top-0 h-full bg-gradient-to-b from-blue-100/60 via-blue-300/10 to-transparent blur-[2px]"
              style={{ left: `${l}%`, width: `${[6, 2, 10, 1, 4, 2, 8, 1][i]}px`, animation: `jv-beam ${3 + i * 0.7}s ease-in-out ${-i}s infinite` }}
            />
          ))}
        </div>

        {/* Orbe de cromo líquido detrás del logo */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(64vmin,560px)] w-[min(64vmin,560px)]"
          style={{
            transform: "translate(-50%, -50%) translate(calc(var(--mx, 0) * 30px), calc(var(--my, 0) * 24px)) scale(calc(0.9 + var(--a) * 0.1 + var(--b) * 0.3))",
            opacity: "calc(var(--a) * 0.75 * (1 - var(--b) * 0.85))",
          }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 blur-[70px] [animation:jv-spin_22s_linear_infinite,jv-morph_9s_ease-in-out_infinite]"
            style={{ background: "conic-gradient(from 0deg, #1D4ED8, #6D28D9, #F59E0B, #E2E8F0, #1D4ED8)" }}
          />
          <div className="absolute inset-[22%] rounded-full bg-[#050505]/70 blur-[40px]" />
        </div>

        {/* Niebla en capas con parallax: se espesa al avanzar hacia la luz */}
        <div
          className="absolute inset-0"
          style={{
            transform: "translate(calc(var(--mx, 0) * -24px), calc(var(--h) * -6vh + var(--b) * -18vh))",
            opacity: "calc(0.18 + var(--h) * 0.2 + var(--a) * 0.15 - var(--c) * 0.5)",
          }}
        >
          <Fog seed={4} className="-left-[10%] top-[30%] h-[80%] w-[140%] [animation:jv-drift_40s_ease-in-out_infinite]" />
        </div>

        {/* Wordmark fino que se abre alrededor del micro (Montfort) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[47%] z-10 hidden -translate-y-1/2 md:block"
          style={{ opacity: "calc(1 - var(--a) * 1.8)", "--gap": "calc(9vw + var(--h) * 4vw)" }}
          aria-hidden="true"
        >
          <span
            className={`${wordmark} absolute right-[calc(50%+var(--gap))] top-0 -translate-y-1/2 text-[clamp(1.2rem,2.3vw,2.8rem)]`}
            style={{ letterSpacing: "calc(0.35em + var(--h) * 0.2em)", marginRight: "calc(-0.35em - var(--h) * 0.2em)", transform: "translate(calc(var(--mx, 0) * -10px), -50%)" }}
          >
            JV
          </span>
          <span
            className={`${wordmark} absolute left-[calc(50%+var(--gap))] top-0 -translate-y-1/2 text-[clamp(1.2rem,2.3vw,2.8rem)]`}
            style={{ letterSpacing: "calc(0.35em + var(--h) * 0.2em)", transform: "translate(calc(var(--mx, 0) * -10px), -50%)" }}
          >
            Productions
          </span>
        </div>
        <p
          className={`${wordmark} pointer-events-none absolute inset-x-0 top-[17%] z-10 text-center text-[15px] md:hidden`}
          style={{ opacity: "calc(1 - var(--a) * 1.8)", letterSpacing: "calc(0.45em + var(--h) * 0.25em)" }}
          aria-hidden="true"
        >
          JV Productions
        </p>

        {/* Eslogan bajo el micro */}
        <div
          className="absolute inset-x-0 bottom-[15%] z-10 flex justify-center px-6"
          style={{ opacity: "calc(1 - var(--a) * 2)", transform: "translateY(calc(var(--h) * -3dvh))" }}
        >
          <div className="flex w-full max-w-xl items-center gap-4">
            <span className="jv-line h-px flex-1" />
            <h1 className="text-center font-['Jost'] text-[10px] font-light uppercase tracking-[0.42em] text-zinc-200 sm:text-xs md:text-sm">
              Tu música, <span className="font-['Instrument_Serif'] text-[1.35em] normal-case italic tracking-[0.04em] text-[#D4AF37]">nuestra producción</span>
            </h1>
            <span className="jv-line h-px flex-1" />
          </div>
        </div>

        {/* Escena 2: el logo sale de la niebla (sin envoltorio: la opacidad en un padre rompería el mix-blend-screen) */}
        <Logo
          className="absolute left-1/2 top-[50%] z-10 h-[clamp(160px,34dvh,340px)]"
          style={{
            transform:
              "translate(-50%, -50%) translate(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -10px + var(--b) * -30dvh)) scale(calc(0.94 + var(--a) * 0.06 - var(--b) * 0.45))",
            opacity: "calc(var(--a) - var(--c) * 1.5)",
            filter: "blur(calc((1 - var(--a)) * 14px))",
          }}
        />

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
                <span className="block font-['Instrument_Serif'] text-xl italic text-white md:text-2xl">{card.label}</span>
              </figcaption>
            </figure>
          );
        })}

        {/* Píldoras flotantes con cursor (Pallet Ross) */}
        <div className="pointer-events-none absolute inset-0 z-30" style={{ opacity: "calc(var(--b) * 1.4 - var(--c) * 2.2)" }} aria-hidden="true">
          <Pill className="absolute left-[6%] top-[24%] [animation:jv-float_5s_ease-in-out_infinite] md:left-[16%]">Sonido urbano de élite</Pill>
          <Pill className="absolute right-[5%] top-[30%] [animation:jv-float_6s_ease-in-out_-2s_infinite] md:right-[16%]">Cabina tratada</Pill>
          <Pill className="absolute left-[8%] top-[78%] [animation:jv-float_7s_ease-in-out_-1s_infinite] md:left-[20%]">
            <span className="h-2 w-2 rounded-full bg-red-500 [animation:jv-blink_1s_infinite]" /> REC
          </Pill>
          <Pill className="absolute right-[8%] top-[84%] hidden [animation:jv-float_5.5s_ease-in-out_-3s_infinite] sm:inline-flex md:right-[22%]">Master ready</Pill>
          <Pill className="absolute left-[3%] top-[52%] hidden [animation:jv-float_6s_ease-in-out_-5s_infinite] lg:inline-flex lg:left-[10%]">Hitmakers</Pill>
          <div className="absolute right-[4%] top-[62%] flex items-start [animation:jv-float_6.5s_ease-in-out_-4s_infinite] md:right-[12%]">
            <CursorIcon className="-mr-1 -mt-2.5 h-5 w-5" />
            <Pill className="border-[#D4AF37]/40 text-[#f3e3ad]">@JVProduction</Pill>
          </div>
        </div>

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
                    className={`inline-block ${em ? "font-['Instrument_Serif'] normal-case italic tracking-normal text-[#E9CF7A]" : ""}`}
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
   INTERLUDIO — tipografía gigante que corre con el scroll y se inclina con la velocidad
   ═══════════════════════════════════════════════════════════════ */

function MarqueeRow({ items, variant }) {
  return (
    <div className="flex shrink-0 items-center gap-[3vw] pr-[3vw]">
      {items.map((w, i) =>
        typeof w === "object" ? (
          <span key={i} className="inline-block h-[0.62em] w-[1.35em] shrink-0 overflow-hidden rounded-full border border-white/20">
            <img src={w.img} alt="" className="h-full w-full object-cover" />
          </span>
        ) : (
          <span key={i} className={variant === "outline" ? "jv-outline" : "jv-gold"}>
            {w}
          </span>
        )
      )}
    </div>
  );
}

function Interlude({ setRef }) {
  return (
    <section ref={setRef} aria-hidden="true" className="relative overflow-hidden py-[12vh] md:py-[18vh]">
      {/* Escenario con niebla de fondo, con parallax */}
      <img
        src={IMAGES.stageFog}
        alt=""
        className="absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover opacity-60"
        style={{ transform: "translateY(calc((var(--t, 0.5) - 0.5) * -14%))" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/40 to-[#050505]" />
      <div className="relative flex flex-col gap-[2vh] whitespace-nowrap" style={{ transform: "skewX(calc(var(--vel, 0) * -12deg))" }}>
        <div className="flex w-max font-['Jost'] text-[clamp(3rem,11vw,11rem)] font-extralight uppercase leading-none" style={{ transform: "translateX(calc(var(--t, 0) * -38%))" }}>
          <MarqueeRow items={INTERLUDE_A} variant="outline" />
          <MarqueeRow items={INTERLUDE_A} variant="outline" />
        </div>
        <div className="flex w-max font-['Instrument_Serif'] text-[clamp(2.6rem,8.5vw,8.5rem)] italic leading-none" style={{ transform: "translateX(calc(-45% + var(--t, 0) * 38%))" }}>
          <MarqueeRow items={INTERLUDE_B} />
          <MarqueeRow items={INTERLUDE_B} />
          <MarqueeRow items={INTERLUDE_B} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAPÍTULO 02 — SERVICIOS (recorrido horizontal en carrusel 3D)
   ═══════════════════════════════════════════════════════════════ */

function Fader({ value, onChange, label }) {
  const ref = useRef(null);
  const setFrom = (clientY) => {
    const r = ref.current.getBoundingClientRect();
    onChange(Math.min(1, Math.max(0, 1 - (clientY - r.top) / r.height)));
  };
  return (
    <div className="flex h-full flex-col items-center gap-1">
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        data-cursor="Arrastra"
        className="relative w-7 flex-1 touch-none outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => {
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          setFrom(e.clientY);
        }}
        onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && setFrom(e.clientY)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            onChange(Math.min(1, Math.max(0, value + (e.key === "ArrowUp" ? 0.05 : -0.05))));
          }
        }}
      >
        <div className="absolute inset-y-1 left-1/2 w-1 -translate-x-1/2 rounded-full bg-white/10" />
        <div className="absolute bottom-1 left-1/2 w-1 -translate-x-1/2 rounded-full bg-gradient-to-t from-[#D4AF37] to-white" style={{ height: `calc(${value * 100}% - 8px)` }} />
        <div
          className="absolute left-1/2 h-3.5 w-7 -translate-x-1/2 translate-y-1/2 rounded-[4px] border border-white/40 bg-gradient-to-b from-zinc-100 to-zinc-500 shadow-[0_4px_10px_rgba(0,0,0,.6)]"
          style={{ bottom: `calc(${value * 100}% * .9 + 5%)` }}
        />
      </div>
      <span className="font-['JetBrains_Mono'] text-[9px] uppercase text-zinc-500">{label}</span>
    </div>
  );
}

function MixWidget() {
  const [v, setV] = useState([0.72, 0.55, 0.84]);
  const lufs = (-20 + ((v[0] + v[1] + v[2]) / 3) * 14).toFixed(1);
  return (
    <div className="flex h-full min-h-0 gap-2">
      {["Vox", "808", "Mst"].map((l, i) => (
        <Fader key={l} label={l} value={v[i]} onChange={(nv) => setV((a) => a.map((x, j) => (j === i ? nv : x)))} />
      ))}
      <div className="ml-auto flex flex-col items-end justify-end">
        <span className="font-['Jost'] text-3xl font-light leading-none text-white">{lufs}</span>
        <span className="font-['JetBrains_Mono'] text-[9px] uppercase text-zinc-500">LUFS</span>
      </div>
    </div>
  );
}

function PadsWidget() {
  const [hit, setHit] = useState(-1);
  const colors = ["bg-emerald-400", "bg-red-500", "bg-emerald-400", "bg-[#D4AF37]", "bg-red-500", "bg-emerald-400", "bg-[#D4AF37]", "bg-red-500"];
  const press = (i) => {
    blip(i);
    setHit(i);
    setTimeout(() => setHit((h) => (h === i ? -1 : h)), 160);
  };
  return (
    <div className="grid h-full min-h-0 grid-cols-4 grid-rows-2 gap-1.5">
      {colors.map((c, i) => (
        <button
          key={i}
          onPointerDown={(e) => {
            e.stopPropagation();
            press(i);
          }}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Pad ${i + 1}`}
          data-cursor="Toca"
          className={`rounded-lg border border-white/10 transition-all duration-150 ${hit === i ? `${c} scale-95 shadow-[0_0_24px_currentColor]` : "bg-white/[0.04] hover:bg-white/[0.08]"}`}
        />
      ))}
    </div>
  );
}

function ProductionWidget() {
  const rows = [[[0, 24], [30, 24], [60, 24]], [[10, 90]], [[0, 100]], [[20, 22], [45, 22], [75, 24]]];
  return (
    <div className="flex h-full min-h-0 flex-col justify-end">
      <div className="relative flex flex-col gap-1.5">
        {rows.map((r, i) => (
          <div key={i} className="relative h-4 rounded-sm bg-white/[0.04]">
            {r.map(([l, w], j) => (
              <span key={j} className={`absolute inset-y-0 rounded-sm ${i % 2 ? "bg-blue-500/60" : "bg-pink-500/60"}`} style={{ left: `${l}%`, width: `${w}%` }} />
            ))}
          </div>
        ))}
        {/* Cabezal de reproducción */}
        <span className="absolute -inset-y-1 w-px bg-white shadow-[0_0_8px_#fff] [animation:jv-sweep_4s_linear_infinite]" />
      </div>
    </div>
  );
}

function VoiceWidget({ hours, setHours }) {
  const btn = "grid h-10 w-10 place-items-center rounded-full border border-white/15 text-zinc-300 hover:border-white/40";
  return (
    <div className="flex h-full min-h-0 items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        <button onClick={(e) => (e.stopPropagation(), setHours((h) => Math.max(1, h - 1)))} className={btn} aria-label="Menos horas">
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-[3ch] text-center font-['Jost'] text-4xl font-light text-white">{hours}h</span>
        <button onClick={(e) => (e.stopPropagation(), setHours((h) => Math.min(10, h + 1)))} className={btn} aria-label="Más horas">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 font-['JetBrains_Mono'] text-[10px] text-red-300">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 [animation:jv-blink_1s_infinite]" /> REC
      </span>
    </div>
  );
}

function CameraWidget() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1000 / 24);
    return () => clearInterval(id);
  }, []);
  const tc = `${String(Math.floor(t / 1440) % 60).padStart(2, "0")}:${String(Math.floor(t / 24) % 60).padStart(2, "0")}:${String(t % 24).padStart(2, "0")}`;
  return (
    <div className="relative h-full min-h-[80px] overflow-hidden rounded-2xl bg-black">
      <img src={IMAGES.night} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale" style={{ objectPosition: "50% 40%" }} />
      {["left-2 top-2 border-l-2 border-t-2", "right-2 top-2 border-r-2 border-t-2", "bottom-2 left-2 border-b-2 border-l-2", "bottom-2 right-2 border-b-2 border-r-2"].map((c) => (
        <span key={c} className={`absolute h-5 w-5 border-white/80 ${c}`} />
      ))}
      <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />
      <span className="absolute left-4 top-3 flex items-center gap-1.5 font-['JetBrains_Mono'] text-[10px] font-medium text-white">
        <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] [animation:jv-blink_1s_infinite]" /> REC
      </span>
      <span className="absolute right-4 top-3 font-['JetBrains_Mono'] text-[10px] text-white/80">4K · 24fps</span>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-['JetBrains_Mono'] text-[10px] tabular-nums text-white/90">{tc}</span>
    </div>
  );
}

function LyricsWidget() {
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  useEffect(() => {
    const full = LYRICS[line];
    const id = setTimeout(
      () => {
        if (chars < full.length) setChars((c) => c + 1);
        else {
          setLine((l) => (l + 1) % LYRICS.length);
          setChars(0);
        }
      },
      chars < full.length ? 55 : 1600
    );
    return () => clearTimeout(id);
  }, [chars, line]);
  return (
    <div className="flex h-full min-h-0 items-end">
      <p className="font-['Mrs_Saint_Delafield'] text-3xl leading-tight text-[#f3e3ad]">
        {LYRICS[line].slice(0, chars)}
        <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 bg-[#D4AF37] [animation:jv-caret_1s_steps(1)_infinite]" />
      </p>
    </div>
  );
}

function CoverWidget() {
  const styles = [
    "bg-[radial-gradient(circle_at_30%_30%,#f8fafc,#64748b_45%,#050505_75%)]",
    "bg-[radial-gradient(circle_at_70%_20%,#F59E0B,#7c2d12_50%,#050505_80%)]",
    "bg-[radial-gradient(circle_at_40%_70%,#6D28D9,#1D4ED8_45%,#050505_80%)]",
  ];
  const [s, setS] = useState(0);
  return (
    <div className="flex h-full min-h-0 items-center justify-center">
      <button
        onClick={(e) => (e.stopPropagation(), setS((x) => (x + 1) % styles.length))}
        aria-label="Cambiar estilo de portada"
        data-cursor="Cambia"
        className={`relative aspect-square h-full max-h-40 rounded-lg border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,.6)] transition-all duration-500 hover:-rotate-3 hover:scale-105 ${styles[s]}`}
      >
        <span className="absolute left-2 top-1.5 font-['Pinyon_Script'] text-2xl text-white/90">JV</span>
        <span className="absolute bottom-2 right-2 border border-white bg-black px-1 font-black text-[6px] leading-tight text-white">
          PARENTAL
          <br />
          ADVISORY
        </span>
      </button>
    </div>
  );
}

function VisualizerWidget() {
  return (
    <div className="relative grid h-full min-h-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(109,40,217,.4),transparent_65%)]" />
      <div className="absolute aspect-square h-2/3 w-auto rounded-full border border-white/10 [animation:jv-spin_12s_linear_infinite]" />
      <div className="absolute aspect-square h-1/2 w-auto rounded-full border border-dashed border-[#D4AF37]/30 [animation:jv-spin_8s_linear_infinite_reverse]" />
      <EqBars playing count={16} className="relative h-1/2 w-3/4" />
    </div>
  );
}

function DistributionWidget() {
  const stores = ["Spotify", "Apple Music", "YouTube Music", "Amazon Music", "Deezer", "Tidal", "TikTok", "+150 tiendas"];
  return (
    <div className="flex h-full min-h-0 flex-col justify-end gap-3">
      <div className="relative mx-auto grid aspect-square h-[clamp(70px,14dvh,140px)] place-items-center">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-[12%] rounded-full border border-dashed border-[#D4AF37]/40 [animation:jv-spin_30s_linear_infinite]" />
        <Globe className="h-1/2 w-1/2 text-zinc-200 [animation:jv-spin_40s_linear_infinite]" strokeWidth={0.8} />
      </div>
      <div className="flex flex-wrap gap-1">
        {stores.map((s) => (
          <span key={s} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-['Space_Grotesk'] text-[10px] text-zinc-300">
            {s}
          </span>
        ))}
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-gradient-to-r from-[#D4AF37] to-white [animation:jv-load_3s_ease-out_infinite]" />
      </div>
    </div>
  );
}

const ServiceCard = React.forwardRef(function ServiceCard({ item, selected, onSelect, onBook, children }, ref) {
  const Icon = item.icon;
  const inner = useRef(null);
  const tilt = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const s = inner.current.style;
    s.setProperty("--tx", ((0.5 - py) * 10).toFixed(2));
    s.setProperty("--ty", ((px - 0.5) * 12).toFixed(2));
    s.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    s.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    s.setProperty("--go", "1");
  };
  const untilt = () => {
    const s = inner.current.style;
    s.setProperty("--tx", "0");
    s.setProperty("--ty", "0");
    s.setProperty("--go", "0");
  };
  return (
    // Posición en el carrusel: --k (-1.5 → 1.5) la calcula ChapterServices en cada frame
    <div ref={ref} className="shrink-0 [perspective:1400px]" style={{ "--k": 0, "--ka": 0 }}>
      <div
        ref={inner}
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect())}
        onPointerMove={tilt}
        onPointerLeave={untilt}
        aria-pressed={selected}
        data-cursor={selected ? "Agendar" : "Elegir"}
        className={`jv-frame relative flex h-[min(62dvh,560px)] w-[80vw] flex-col overflow-hidden rounded-[28px] p-5 transition-[box-shadow] duration-500 sm:w-[360px] lg:w-[400px] lg:p-7 ${
          selected ? "is-on shadow-[0_0_80px_-12px_rgba(212,175,55,.55)]" : "shadow-[0_40px_80px_-30px_rgba(0,0,0,.9)]"
        }`}
        style={{
          transform:
            "rotateY(calc(var(--k) * -12deg + var(--ty, 0) * 1deg)) rotateX(calc(var(--tx, 0) * 1deg)) translateZ(calc(var(--ka) * -50px))",
          opacity: "calc(1 - var(--ka) * 0.4)",
          transition: "transform .18s ease-out, box-shadow .5s",
          "--go": 0,
        }}
      >
        {/* Foto del servicio arriba, fundida hacia el contenido */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <img src={item.img} alt="" className={`h-full w-full object-cover transition-[opacity,transform] duration-700 ${selected ? "scale-[1.03] opacity-60" : "opacity-40"}`} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/30 via-[#09090b]/88 to-[#09090b]" />
        </div>
        {/* Brillo que sigue al ratón */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{ background: "radial-gradient(420px circle at var(--gx, 50%) var(--gy, 0%), rgba(255,255,255,.10), transparent 45%)", opacity: "var(--go)" }}
        />
        <div className="relative z-10 flex shrink-0 items-center justify-between">
          <span className={`grid h-12 w-12 place-items-center rounded-full border transition-colors duration-500 ${selected ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-white/15 text-zinc-200"}`}>
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <ArrowUpRight className={`h-5 w-5 transition-all duration-500 ${selected ? "rotate-45 text-[#D4AF37]" : "text-white/25"}`} />
        </div>
        <h3 className="relative z-10 mt-5 shrink-0 font-['Jost'] text-xl font-light uppercase leading-tight tracking-[0.06em] text-white lg:text-[1.65rem]">{item.title}</h3>
        <p className="relative z-10 mt-2 shrink-0 font-['Space_Grotesk'] text-sm leading-relaxed text-zinc-500">{item.desc}</p>
        <div className="relative z-10 mt-4 min-h-0 flex-1">{children}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            selected ? onBook() : onSelect();
          }}
          className={`relative z-10 mt-4 flex w-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full px-3 py-3 font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-500 ${
            selected ? "bg-[#D4AF37] text-black hover:bg-[#e6c25a]" : "border border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
          }`}
        >
          {selected ? "Agendar este servicio" : "Seleccionar"} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
});

function ChapterServices({ index, setRef, onBook, hours, setHours }) {
  const stage = useRef(null);
  const track = useRef(null);
  const cards = useRef([]);
  const [dist, setDist] = useState(0);
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);

  useEffect(() => {
    const calc = () => {
      if (!track.current || !stage.current) return;
      setDist(Math.max(0, track.current.scrollWidth - stage.current.clientWidth));
    };
    calc();
    // Recalcula si cambian las tarjetas (carga de fuentes/estilos) o la ventana
    const ro = new ResizeObserver(calc);
    ro.observe(track.current);
    ro.observe(stage.current);
    return () => ro.disconnect();
  }, []);

  // Al cambiar la distancia, fuerza un frame del motor para recolocar el carrusel
  useEffect(() => {
    window.dispatchEvent(new Event("scroll"));
  }, [dist]);

  useProgress(index, (p, enter) => {
    const c = Math.min(SERVICES.length - 1, Math.floor(p * SERVICES.length));
    setCur((x) => (x === c ? x : c));
    if (enter <= 0 || p >= 1) return;
    const vw = window.innerWidth;
    cards.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const k = clamp((r.left + r.width / 2 - vw / 2) / (vw * 0.6), -1.5, 1.5);
      el.style.setProperty("--k", k.toFixed(3));
      el.style.setProperty("--ka", Math.abs(k).toFixed(3));
    });
  });

  const widget = (id) =>
    ({
      produccion: <ProductionWidget />,
      beats: <PadsWidget />,
      mezcla: <MixWidget />,
      voces: <VoiceWidget hours={hours} setHours={setHours} />,
      videoclips: <CameraWidget />,
      letras: <LyricsWidget />,
      portadas: <CoverWidget />,
      visualizers: <VisualizerWidget />,
      distribucion: <DistributionWidget />,
    }[id]);

  const cat = SERVICES[cur].cat;

  return (
    <section ref={setRef} aria-label="Servicios" className="relative" style={{ height: `calc(100dvh + ${dist}px)` }}>
      <div ref={stage} className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden pb-6 pt-[76px] md:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(109,40,217,.28),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(29,78,216,.22),transparent_55%)]" />
        <Fog seed={9} tint="0.62 0.55 0.92" className="left-0 top-[40%] h-[70%] w-full opacity-30" />

        {/* Palabra gigante de fondo según el bloque */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2" aria-hidden="true">
          {CATEGORY_WORDS.map((w, i) => (
            <span
              key={w}
              className="absolute inset-x-0 -translate-y-1/2 text-center text-transparent [-webkit-text-stroke:1px_rgba(226,232,240,.22)] font-['Jost'] text-[clamp(6rem,24vw,24rem)] font-extralight uppercase leading-none tracking-[0.04em] transition-all duration-1000 ease-[cubic-bezier(.2,.7,.2,1)]"
              style={{
                opacity: cat === i ? 1 : 0,
                transform: `translateY(${cat === i ? 0 : i < cat ? -60 : 60}px)`,
                filter: cat === i ? "blur(0px)" : "blur(10px)",
                letterSpacing: cat === i ? "0.04em" : "0.2em",
              }}
            >
              {w}
            </span>
          ))}
        </div>

        <div className="relative z-10 shrink-0 px-5 md:px-12">
          <h2 className="font-['Jost'] text-[clamp(2rem,6vw,5rem)] font-extralight uppercase leading-none tracking-[0.06em]">
            <SplitReveal text="360° Music Factory" from={0.35} to={0.95} letterClass="jv-chrome" />
          </h2>
          <p className="mt-2 font-['Instrument_Serif'] text-lg italic text-zinc-400 md:text-2xl" style={{ opacity: reveal("--enter", 0.7, 1) }}>
            Nueve servicios. <span className="text-[#D4AF37]">Un solo sonido.</span>
          </p>
        </div>

        <div className="relative z-10 mt-5 flex min-h-0 flex-1 items-center md:mt-8" style={{ transform: "skewX(calc(var(--vel, 0) * -4deg))" }}>
          <div ref={track} className="flex gap-4 px-5 will-change-transform md:gap-7 md:px-12" style={{ transform: `translateX(calc(var(--p, 0) * -${dist}px))` }}>
            {SERVICES.map((s, i) => (
              <ServiceCard
                key={s.id}
                ref={(el) => (cards.current[i] = el)}
                item={s}
                selected={sel === s.id}
                onSelect={() => setSel((x) => (x === s.id ? null : s.id))}
                onBook={() => onBook(s.book)}
              >
                {widget(s.id)}
              </ServiceCard>
            ))}
            <div className="flex w-[64vw] shrink-0 flex-col justify-center sm:w-[380px]">
              <p className="font-['Jost'] text-[clamp(1.8rem,3.2vw,3rem)] font-extralight uppercase leading-[1.05] tracking-[0.04em] text-zinc-200">
                Todo bajo
                <br />
                <span className="font-['Instrument_Serif'] normal-case italic text-[#D4AF37]">un mismo techo.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAPÍTULO 03 — EXPERIENCIA (un cabezal recorre la maqueta y la convierte en master)
   ═══════════════════════════════════════════════════════════════ */

function ChapterExperience({ index, setRef }) {
  const root = useRef(null);
  const out = { lufs: useRef(null), peak: useRef(null), stereo: useRef(null), label: useRef(null) };
  const bars = 72;
  const head1 = "Desde la idea hasta el lanzamiento.".split(" ");
  const head2 = "Hacemos realidad tu proyecto.".split(" ");
  const nWords = head1.length + head2.length;

  useProgress(index, (p) => {
    const el = root.current;
    if (!el) return;
    const m = seg(p, 0.08, 0.6);
    el.style.setProperty("--m", m.toFixed(4));
    el.style.setProperty("--q", seg(p, 0.6, 0.95).toFixed(4));
    if (out.lufs.current) out.lufs.current.textContent = lerp(-19.4, -8.2, m).toFixed(1);
    if (out.peak.current) out.peak.current.textContent = lerp(-6.3, -1.0, m).toFixed(1);
    if (out.stereo.current) out.stereo.current.textContent = Math.round(lerp(61, 92, m));
    if (out.label.current) out.label.current.textContent = m > 0.98 ? "Master ready" : m > 0.02 ? "Masterizando" : "Maqueta";
  });

  const word = (w, i, chrome) => {
    const t = reveal("--enter", (0.35 + i * 0.045).toFixed(3), (0.55 + i * 0.045).toFixed(3));
    return (
      <React.Fragment key={`${chrome}-${i}`}>
        <span
          className={`inline-block ${chrome ? "jv-chrome font-normal" : "text-zinc-500"}`}
          style={{ opacity: t, filter: `blur(calc((1 - ${t}) * 8px))`, transform: `translateY(calc((1 - ${t}) * 0.4em))` }}
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
      aria-label="Experiencia"
      className="relative h-[320vh]"
      style={{ "--m": 0, "--q": 0 }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Sala de control de fondo, muy oscurecida, que se acerca un poco con el scroll */}
        <img
          src={IMAGES.consoleAmber}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: "calc(0.16 + var(--m) * 0.14)", transform: "scale(calc(1.04 + var(--p, 0) * 0.04))" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-[#050505]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_90%,rgba(29,78,216,.2),transparent_50%)]" />
        {/* La luz ámbar del estudio se enciende al masterizar */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(245,158,11,.28),transparent_55%)]" style={{ opacity: "calc(0.3 + var(--m) * 0.7)" }} />
        <Fog seed={14} tint="0.95 0.80 0.55" className="left-0 top-[50%] h-[60%] w-full opacity-25" />

        <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-rows-[auto_1fr] gap-5 px-5 pb-24 pt-[76px] md:grid-cols-2 md:grid-rows-1 md:items-center md:gap-14 md:px-12 md:pb-12 md:pt-28">
          {/* Identidad */}
          <div className="md:order-2">
            <h2 className="font-['Jost'] text-[clamp(1.5rem,4.4vw,4.2rem)] font-extralight uppercase leading-[1.05] tracking-[0.04em]">
              {head1.map((w, i) => word(w, i, false))}
              {head2.map((w, i) => word(w, head1.length + i, true))}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 md:mt-8 md:gap-3" style={{ opacity: reveal("--enter", 0.35 + nWords * 0.045, 0.6 + nWords * 0.045) }}>
              <ParentalAdvisory className="origin-left scale-[.85] md:scale-100" />
              {[
                ["Spotify", "bg-[#1DB954]"],
                ["Apple Music", "bg-pink-400"],
                ["YouTube", "bg-red-500"],
              ].map(([p, c]) => (
                <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 font-['Space_Grotesk'] text-[10px] font-medium text-zinc-200 md:px-3 md:py-1.5 md:text-[11px]">
                  <span className={`h-1.5 w-1.5 rounded-full ${c}`} />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Showcase: maqueta → master */}
          <div className="flex min-h-0 flex-col gap-4 md:order-1">
            <div className="jv-frame relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] p-5 md:flex-none md:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="font-['Instrument_Serif'] text-xl italic text-zinc-300 md:text-2xl">Tu tema</span>
                <span ref={out.label} className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.12em] text-[#f3e3ad]">
                  Maqueta
                </span>
              </div>

              <div className="mt-3 flex min-h-0 flex-1 items-center gap-5 md:mt-5 md:gap-8">
                <div className="hidden shrink-0 [perspective:700px] sm:block [@media(max-height:700px)]:hidden">
                  <div className="[transform:rotateX(55deg)_rotateZ(-10deg)]">
                    <div
                      className="jv-vinyl relative h-28 w-28 rounded-full md:h-40 md:w-40"
                      style={{ transform: "rotate(calc(var(--p, 0) * 1080deg))", boxShadow: "0 30px 40px rgba(0,0,0,.8), 0 0 calc(var(--m) * 60px) rgba(212,175,55,calc(var(--m) * .45))" }}
                    />
                  </div>
                </div>
                <dl className="grid flex-1 grid-cols-3 gap-2">
                  {[
                    ["Loudness", out.lufs, "-19.4", "LUFS"],
                    ["Pico", out.peak, "-6.3", "dBTP"],
                    ["Stereo", out.stereo, "61", "%"],
                  ].map(([k, ref, v, u]) => (
                    <div key={k}>
                      <dt className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.15em] text-zinc-500">{k}</dt>
                      <dd className="font-['Jost'] text-3xl font-light leading-tight tabular-nums text-white md:text-4xl">
                        <span ref={ref}>{v}</span>
                        <span className="ml-1 font-['JetBrains_Mono'] text-[9px] text-zinc-500">{u}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Forma de onda: cada barra cambia cuando el cabezal pasa por encima */}
              <div className="relative mt-3 flex h-[clamp(44px,10dvh,120px)] shrink-0 items-center gap-[2px] md:mt-5" aria-hidden="true">
                {Array.from({ length: bars }).map((_, i) => {
                  const base = 0.35 + Math.abs(Math.sin(i * 0.45) * Math.cos(i * 0.17)) * 0.65;
                  const before = base * 0.42;
                  const after = 0.6 + base * 0.4;
                  const t = `clamp(0, calc((var(--m) * ${bars + 6} - ${i}) / 6), 1)`;
                  return (
                    <span key={i} className="relative flex-1 overflow-hidden rounded-full bg-zinc-600" style={{ height: `calc((${before} + ${(after - before).toFixed(3)} * ${t}) * 100%)` }}>
                      <span className="absolute inset-0 bg-gradient-to-b from-white via-[#E2E8F0] to-[#D4AF37]" style={{ opacity: t }} />
                    </span>
                  );
                })}
                <span
                  className="pointer-events-none absolute -bottom-2 -top-2 w-[2px] rounded-full bg-[#fff3c4] shadow-[0_0_14px_4px_rgba(212,175,55,.7)]"
                  style={{ left: "calc(var(--m) * 100%)", opacity: "calc(min(1, var(--m) * 20) * (1 - var(--q) * 3))" }}
                />
              </div>
            </div>

            {/* Proceso: se ilumina paso a paso */}
            <div className="relative grid shrink-0 grid-cols-4 gap-2">
              <div className="absolute left-[12.5%] right-[12.5%] top-[18px] h-px bg-white/10 md:top-[22px]">
                <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#fff3c4] shadow-[0_0_10px_#D4AF37]" style={{ width: "calc(var(--q) * 100%)" }} />
              </div>
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const t = `clamp(0, calc(var(--q) * 4.2 - ${i}), 1)`;
                return (
                  <div key={s.short} className="relative flex flex-col items-center text-center" style={{ opacity: `calc(0.3 + 0.7 * ${t})` }}>
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full border bg-[#0c0c0e] md:h-11 md:w-11"
                      style={{ borderColor: `rgba(212,175,55,calc(0.2 + ${t} * 0.8))`, boxShadow: `0 0 calc(${t} * 18px) rgba(212,175,55,.5)`, transform: `scale(calc(0.9 + ${t} * 0.1))` }}
                    >
                      <Icon className="h-4 w-4 text-[#D4AF37]" strokeWidth={1.6} />
                    </span>
                    <span className="mt-2 font-['Space_Grotesk'] text-[10px] font-semibold uppercase tracking-[0.08em] text-white md:text-xs">{s.short}</span>
                    <span className="mt-1 hidden font-['Space_Grotesk'] text-[11px] leading-snug text-zinc-500 lg:block">{s.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAPÍTULO 04 — AGENDAR (un círculo de luz champagne se abre desde abajo)
   ═══════════════════════════════════════════════════════════════ */

function Choice({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 font-['Space_Grotesk'] text-[11px] font-semibold transition-all duration-300 md:px-4 md:py-2 md:text-[13px] ${
        active ? "border-black bg-black text-white" : "border-black/20 bg-white/50 text-black/80 hover:-translate-y-0.5 hover:border-black/50"
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(251,247,238,.92)_0%,rgba(231,220,196,.8)_45%,rgba(120,98,60,.55)_100%)]" />
      </div>
      <Fog seed={21} tint="1 1 1" className="left-0 top-0 h-full w-full" style={{ opacity: "calc(var(--enter, 0) * 0.9)" }} />
      <div
        className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 whitespace-nowrap font-['Anton'] text-[clamp(5rem,22vw,22rem)] uppercase leading-none text-black/[0.05]"
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
          <h2 className="font-['Anton'] text-[clamp(1.7rem,5dvh,4.5rem)] uppercase leading-[0.92]">
            <SplitReveal text="¿Listo para sonar profesional?" from={0.55} to={1} />
          </h2>
          <div className="hidden md:block">
            <p className="mb-2 font-['Instrument_Serif'] text-lg italic text-black/60">Tu mensaje</p>
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
              <legend className="mb-1.5 font-['Instrument_Serif'] text-base italic text-black/70 md:text-lg">{label}</legend>
              <div className="flex flex-wrap gap-1.5">
                {opts.map((o) => (
                  <Choice key={o} active={isOn(o)} onClick={() => pick(o)}>
                    {o}
                    {o === "Sesión por Horas" && format === o ? ` · ${hours}h` : ""}
                  </Choice>
                ))}
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
            className="group relative mt-1 flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-black px-5 py-3 font-['Anton'] text-base uppercase tracking-[0.08em] text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 md:py-5 md:text-2xl"
          >
            <span className="absolute inset-0 -translate-x-full bg-[#25D366] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-enabled:group-hover:translate-x-0" />
            <WhatsAppIcon className="relative h-6 w-6 text-[#25D366] transition-colors duration-700 group-enabled:group-hover:text-black" />
            <span className="relative transition-colors duration-700 group-enabled:group-hover:text-black">{ready ? "Agendar por WhatsApp ahora" : "Elige al menos un servicio"}</span>
            {ready && <ArrowRight className="relative h-5 w-5 transition-all duration-700 group-hover:translate-x-1 group-hover:text-black" />}
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

export default function JVProductionsImmersive() {
  const sections = useRef([]);
  const listeners = useRef(new Map());
  const kickRef = useRef(() => {});
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [booking, setBooking] = useState({ services: [], format: "Sesión por Horas", when: "Esta semana", name: "", hours: 2 });

  const ctx = useRef({
    subscribe(i, fn) {
      if (!listeners.current.has(i)) listeners.current.set(i, new Set());
      listeners.current.get(i).add(fn);
      return () => listeners.current.get(i).delete(fn);
    },
  }).current;

  // Bloquea el scroll mientras dura la intro o el menú está abierto
  useEffect(() => {
    document.documentElement.style.overflow = ready && !menuOpen ? "" : "hidden";
  }, [ready, menuOpen]);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = reduce ? 1 : 0.12;
    const docEl = document.documentElement;
    const state = [];
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    let raf = 0;
    let lastY = window.scrollY;
    let vel = 0;
    let first = true;

    const approach = (cur, target) => {
      const n = cur + (target - cur) * ease;
      return Math.abs(target - n) < 0.0004 ? target : n;
    };

    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      vel += (y - lastY - vel) * 0.18;
      lastY = y;
      let moving = Math.abs(vel) > 0.05;
      if (!moving) vel = 0;
      let current = 0;

      sections.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const tp = clamp01(-r.top / Math.max(1, el.offsetHeight - vh));
        const te = clamp01(1 - r.top / vh);
        const tt = clamp01((vh - r.top) / (vh + el.offsetHeight));
        const s = state[i] || (state[i] = { p: tp, e: te, t: tt });
        if (first) Object.assign(s, { p: tp, e: te, t: tt });
        s.p = approach(s.p, tp);
        s.e = approach(s.e, te);
        s.t = approach(s.t, tt);
        if (s.p !== tp || s.e !== te || s.t !== tt) moving = true;
        el.style.setProperty("--p", s.p.toFixed(4));
        el.style.setProperty("--enter", s.e.toFixed(4));
        el.style.setProperty("--t", s.t.toFixed(4));
        listeners.current.get(i)?.forEach((fn) => fn(s.p, s.e));
        if (r.top <= vh * 0.5) current = i;
      });

      mouse.sx += (mouse.x - mouse.sx) * 0.08;
      mouse.sy += (mouse.y - mouse.sy) * 0.08;
      if (Math.abs(mouse.x - mouse.sx) > 0.001 || Math.abs(mouse.y - mouse.sy) > 0.001) moving = true;
      docEl.style.setProperty("--mx", mouse.sx.toFixed(4));
      docEl.style.setProperty("--my", mouse.sy.toFixed(4));
      docEl.style.setProperty("--vel", clamp(vel / 40, -1, 1).toFixed(4));

      first = false;
      setActive((a) => (a === current ? a : current));
      if (moving) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    kickRef.current = kick;
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

  const setHours = (fn) => setBooking((b) => ({ ...b, hours: typeof fn === "function" ? fn(b.hours) : fn }));
  const reg = (i) => (el) => (sections.current[i] = el);

  return (
    <ProgressCtx.Provider value={ctx}>
      <div className="jv-root jv-grain relative overflow-x-clip bg-[#050505] font-['Space_Grotesk'] text-zinc-200 antialiased">
        <GlobalStyles />
        <Intro onDone={() => setReady(true)} />
        <Cursor />
        <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} goTo={goTo} />
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} goTo={goTo} />
        <FloatingPlayer hidden={active === S.booking || menuOpen} />
        <main>
          <ChapterOrigin index={S.origin} setRef={reg(S.origin)} />
          <Interlude setRef={reg(S.interlude)} />
          <ChapterServices index={S.services} setRef={reg(S.services)} onBook={bookService} hours={booking.hours} setHours={setHours} />
          <ChapterExperience index={S.experience} setRef={reg(S.experience)} />
          <ChapterBooking setRef={reg(S.booking)} booking={booking} setBooking={setBooking} />
        </main>
      </div>
    </ProgressCtx.Provider>
  );
}
