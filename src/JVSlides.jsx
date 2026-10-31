/**
 * JV PRODUCTIONS — Web App inmersiva de 4 slides (scroll-snap, 100dvh cada uno)
 * Stack: React + Tailwind CSS + lucide-react
 *
 * Personaliza LINKS e IMAGES justo debajo.
 */
import React, { useState, useEffect, useRef } from "react";
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
  ArrowDown,
  Check,
  Minus,
  Plus,
  Disc3,
  Rocket,
  Sparkles,
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
  // Logo JV sobre fondo negro (se funde con mix-blend-screen). Con null se pinta un emblema tipográfico.
  logo: "img/logo-jv.jpg",
  // FOTO ESTUDIO 1: DAW — doble pantalla, pistas rosa/azul, teclado MIDI (cámbiala por la toma del DAW)
  setup: "img/estudio-setup.jpg",
  // FOTO ESTUDIO 2: EN LA ZONA — gorra + cascos bajo el aro de luz ámbar
  zone: "img/estudio-zona.jpg",
  // FOTO ESTUDIO 3: NIGHT VIBE — humo y LEDs azules/morados
  night: "img/estudio-atmosfera.jpg",
  // FOTO ESTUDIO 4: CONCEPT ART — sombra con cuernos vs encapuchado con máscara blanca
  concept: "img/estudio-identidad.jpg",
};

/* ═══════════════════════════════════════════════════════════════
   DATOS
   ═══════════════════════════════════════════════════════════════ */

const SLIDES = ["Impacto", "Servicios", "Experiencia", "Agendar"];

// Añade `src: "beats/archivo.mp3"` para reproducir audio real; sin src el reproductor se simula.
const BEATS = [
  { title: "Medianoche en el Bunker", genre: "Trap", bpm: 142, dur: 174 },
  { title: "Perreo de Cromo", genre: "Reggaetón", bpm: 94, dur: 186 },
  { title: "Luz Ámbar", genre: "R&B", bpm: 78, dur: 201 },
];

const FAN = [
  /* FOTO ESTUDIO 1: DAW */
  { src: IMAGES.setup, label: "El Setup", tag: "DAW · MIDI", pos: "50% 38%" },
  /* FOTO ESTUDIO 2: EN LA ZONA */
  { src: IMAGES.zone, label: "En la Zona", tag: "Luz ámbar", pos: "50% 30%" },
  /* FOTO ESTUDIO 3: NIGHT VIBE */
  { src: IMAGES.night, label: "Night Vibe", tag: "Humo · LED", pos: "50% 45%" },
  /* FOTO ESTUDIO 4: CONCEPT ART */
  { src: IMAGES.concept, label: "Concept Art", tag: "Dualidad", pos: "50% 74%" },
];

// Posición del abanico: [desplazamiento X en % del ancho de carta, rotación, desplazamiento Y en px]
const FAN_REST = [[-42, -14, 14], [-14, -5, 0], [14, 5, 0], [42, 14, 14]];
const FAN_OPEN = [[-152, -8, 6], [-51, -2.5, -8], [51, 2.5, -8], [152, 8, 6]];
// En móvil el abanico se abre menos para no salirse de la pantalla
const FAN_REST_SM = [[-36, -12, 12], [-12, -4, 0], [12, 4, 0], [36, 12, 12]];
const FAN_OPEN_SM = [[-82, -9, 6], [-28, -3, -8], [28, 3, -8], [82, 9, 6]];

const BOOK_SERVICES = [
  "Grabar Voces",
  "Producción Completa",
  "Beat a Medida",
  "Mezcla / Master",
  "Videoclip / Visuals",
  "Letras",
  "Portada",
  "Distribución",
];
const BOOK_FORMATS = ["Sesión por Horas", "Proyecto Completo", "Pack Lanzamiento"];
const BOOK_WHEN = ["Esta semana", "Próxima semana", "Urgente ⚡"];

const TABS = [
  {
    id: "audio",
    label: "Audio & Música",
    grid: "grid-cols-2 grid-rows-2 md:grid-cols-4",
    items: [
      { id: "produccion", n: 1, title: "Producción Musical Completa", icon: SlidersVertical, book: "Producción Completa", span: "md:row-span-2", desc: "Dirección artística y creación integral de tu tema desde cero." },
      { id: "beats", n: 2, title: "Beats Personalizados", icon: Music, book: "Beat a Medida", span: "md:col-span-2", desc: "Instrumentales exclusivas a medida de tu flow. Toca los pads." },
      { id: "mezcla", n: 4, title: "Mezcla y Mastering", icon: SlidersHorizontal, book: "Mezcla / Master", span: "md:row-span-2", desc: "Sonido comercial y cristalino. Mueve los faders." },
      { id: "voces", n: 3, title: "Grabación de Voces por Horas", icon: Mic, book: "Grabar Voces", span: "md:col-span-2", desc: "Cabina tratada, previos de gama alta y dirección vocal." },
    ],
  },
  {
    id: "visual",
    label: "Letras & Visuales",
    grid: "grid-cols-2 grid-rows-2 md:grid-cols-4",
    items: [
      { id: "videoclips", n: 8, title: "Videoclips", icon: Clapperboard, book: "Videoclip / Visuals", span: "md:col-span-2 md:row-span-2", desc: "Producción cinematográfica callejera, nocturna y de alto impacto." },
      { id: "letras", n: 5, title: "Composición de Letras", icon: NotebookPen, book: "Letras", span: "md:col-span-2", desc: "Co-writing, melodías pegadizas y barras con identidad." },
      { id: "portadas", n: 6, title: "Diseño de Portadas", icon: ImageIcon, book: "Portada", span: "", desc: "Cover art con estética de sello. Toca para cambiar." },
      { id: "visualizers", n: 7, title: "Visualizers", icon: MonitorPlay, book: "Videoclip / Visuals", span: "", desc: "Piezas hipnóticas para YouTube y redes." },
    ],
  },
  {
    id: "launch",
    label: "Lanzamiento",
    grid: "grid-cols-1 grid-rows-1",
    items: [
      { id: "distribucion", n: 9, title: "Distribución Musical", icon: Globe, book: "Distribución", span: "", desc: "Subida, gestión de regalías y posicionamiento en Spotify, Apple Music y todas las tiendas digitales." },
    ],
  },
];

const STEPS = [
  { icon: Disc3, short: "Idea & Beat", desc: "Escuchamos tu visión, fijamos referencias y construimos la instrumental a tu medida." },
  { icon: Mic, short: "Cabina", desc: "Sesión dirigida en cabina tratada: tomas, dobles y ad-libs hasta que suene a disco." },
  { icon: SlidersHorizontal, short: "Mezcla & Arte", desc: "Mezcla y master comercial + portada, visualizer o videoclip para vestir el tema." },
  { icon: Rocket, short: "Lanzamiento", desc: "Distribución a todas las plataformas y gestión de regalías. Tú solo suenas." },
];

const LYRICS = [
  "Desde abajo con la corona puesta,",
  "la noche escribe lo que el día no contesta.",
  "Cromo en la voz, oro en la libreta,",
  "cada barra es una puerta que se abre completa.",
];

/* ═══════════════════════════════════════════════════════════════
   ESTILOS GLOBALES
   ═══════════════════════════════════════════════════════════════ */

const GlobalStyles = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Cinzel:wght@400;600;700&family=Mrs+Saint+Delafield&family=Pinyon+Script&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

body { background: #050505; margin: 0; }
::selection { background: #D4AF37; color: #050505; }
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }

.jv-chrome {
  background: linear-gradient(178deg, #fff 0%, #E2E8F0 30%, #7c828c 48%, #f8fafc 58%, #aeb6c2 78%, #fff 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.jv-chrome-anim {
  background: linear-gradient(100deg, #8a909a 0%, #fff 20%, #9aa1ab 35%, #E2E8F0 50%, #fff 62%, #7c828c 80%, #fff 100%);
  background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: jv-shine 7s linear infinite;
}
.jv-line { background: linear-gradient(90deg, transparent, rgba(226,232,240,.75), transparent); }

.jv-grain::after {
  content: ""; position: fixed; inset: -100%; z-index: 80; pointer-events: none; opacity: .07;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: jv-grain 1.2s steps(6) infinite;
}
@keyframes jv-grain { 0%{transform:translate(0,0)} 25%{transform:translate(-3%,2%)} 50%{transform:translate(2%,-4%)} 75%{transform:translate(-4%,-1%)} 100%{transform:translate(0,0)} }
@keyframes jv-shine { from { background-position: 250% 0 } to { background-position: -250% 0 } }
@keyframes jv-spin { to { transform: rotate(360deg) } }
@keyframes jv-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
@keyframes jv-drift { 0% { transform: translate(0,0) scale(1) } 50% { transform: translate(6%,-4%) scale(1.15) } 100% { transform: translate(0,0) scale(1) } }
@keyframes jv-rise { 0% { transform: translateY(0); opacity: 0 } 15% { opacity: .8 } 100% { transform: translateY(-70vh); opacity: 0 } }
@keyframes jv-blink { 0%,49% { opacity: 1 } 50%,100% { opacity: .15 } }
@keyframes jv-caret { 50% { opacity: 0 } }
@keyframes jv-eq { 0%,100% { transform: scaleY(.18) } 50% { transform: scaleY(1) } }
@keyframes jv-load { from { width: 0 } to { width: 100% } }
.jv-eq > span { transform-origin: bottom; animation: jv-eq 1s ease-in-out infinite; }
.jv-eq.is-paused > span { animation: none; transform: scaleY(.12); transition: transform .4s; }

.jv-vinyl {
  background:
    radial-gradient(circle at 50% 50%, #0b0b0c 0 12%, #D4AF37 12.3% 15%, #111 15.3% 16.5%, transparent 16.7%),
    repeating-radial-gradient(circle at 50% 50%, #0a0a0a 0 2px, #18181b 2.5px 3px), #0a0a0a;
}
.jv-vinyl::after {
  content: ""; position: absolute; inset: 0; border-radius: 9999px;
  background: conic-gradient(from 20deg, transparent 0 10%, rgba(255,255,255,.14) 14%, transparent 20% 55%, rgba(255,255,255,.09) 60%, transparent 66%);
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

function Emblem({ className = "" }) {
  if (IMAGES.logo) {
    return (
      <img
        src={IMAGES.logo}
        alt="JV Productions"
        className={`w-auto object-contain mix-blend-screen ${className}`}
        style={{
          WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)",
        }}
      />
    );
  }
  return (
    <div className={`flex flex-col items-center justify-center leading-none ${className}`}>
      <Crown className="h-[18%] w-auto text-[#D4AF37]" strokeWidth={1.25} />
      <span className="jv-chrome-anim font-['Pinyon_Script'] text-[clamp(4rem,12dvh,9rem)]">JV</span>
      <span className="jv-chrome -mt-3 font-['Anton'] italic tracking-[0.35em]">PRODUCTIONS</span>
    </div>
  );
}

function Atmosphere({ tone = "cool" }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className={`absolute -left-1/4 top-[10%] h-[70vmax] w-[70vmax] rounded-full blur-[120px] [animation:jv-drift_22s_ease-in-out_infinite] ${tone === "warm" ? "bg-[#F59E0B]/10" : "bg-[#1D4ED8]/20"}`} />
      <div className="absolute -right-1/4 -top-[20%] h-[60vmax] w-[60vmax] rounded-full bg-[#6D28D9]/20 blur-[120px] [animation:jv-drift_28s_ease-in-out_infinite_reverse]" />
      <div className="absolute bottom-[-30%] left-1/3 h-[50vmax] w-[50vmax] rounded-full bg-[#F59E0B]/[0.07] blur-[120px] [animation:jv-drift_34s_ease-in-out_infinite]" />
      {/* Niebla baja */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(ellipse_at_bottom,rgba(148,163,184,.10),transparent_70%)]" />
    </div>
  );
}

function Particles({ count = 18 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute bottom-0 h-[2px] w-[2px] rounded-full bg-white/70"
          style={{
            left: `${(i * 53) % 100}%`,
            animation: `jv-rise ${9 + ((i * 7) % 9)}s linear ${-(i * 1.3)}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Pill({ children, className = "", style }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-black/60 px-3 py-1.5 font-['Space_Grotesk'] text-[11px] font-medium text-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,.5)] backdrop-blur-md md:text-xs ${className}`}
      style={style}
    >
      {children}
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

function useNarrow(query = "(max-width: 640px)") {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return m;
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
   HUD (navegación fija)
   ═══════════════════════════════════════════════════════════════ */

function HUD({ active, goTo }) {
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 md:top-5">
        <nav className="pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border border-white/10 bg-black/60 py-2 pl-3 pr-2 backdrop-blur-md md:px-6 md:py-3 md:pr-3">
          <button onClick={() => goTo(0)} className="flex items-center gap-2" aria-label="Ir al inicio">
            <Crown className="h-4 w-4 text-[#D4AF37]" strokeWidth={1.6} />
            <span className="jv-chrome font-['Pinyon_Script'] text-2xl leading-none">JV</span>
            <span className="hidden font-['Cinzel'] text-[10px] font-semibold tracking-[0.3em] text-zinc-300 sm:inline">PRODUCTIONS</span>
          </button>

          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] tracking-[0.15em] text-zinc-500">
            <span className="text-white">{String(active + 1).padStart(2, "0")}</span>
            <span>/ 04</span>
            <span className="hidden uppercase text-zinc-400 md:inline">· {SLIDES[active]}</span>
          </div>

          <button
            onClick={() => goTo(3)}
            className="rounded-full bg-[linear-gradient(180deg,#fff,#cbd5e1)] px-4 py-2 font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-[0.12em] text-black transition-shadow hover:shadow-[0_0_30px_rgba(255,255,255,.35)] md:text-xs"
          >
            Agendar Ahora
          </button>
        </nav>
      </header>

      <nav className="fixed right-2 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-3 md:right-6" aria-label="Diapositivas">
        {SLIDES.map((s, i) => (
          <button
            key={s}
            onClick={() => goTo(i)}
            aria-label={`Ir a ${s}`}
            aria-current={active === i}
            className="group flex items-center justify-end gap-2 p-1"
          >
            <span className="pointer-events-none hidden font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 md:inline">
              {s}
            </span>
            <span
              className={`block w-1.5 rounded-full transition-all duration-500 ${
                active === i ? "h-7 bg-[#D4AF37] shadow-[0_0_12px_#D4AF37]" : active === 3 ? "h-1.5 bg-black/30 group-hover:bg-black/60 md:bg-white/30" : "h-1.5 bg-white/30 group-hover:bg-white/70"
              }`}
            />
          </button>
        ))}
      </nav>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 1 — IMPACTO + ABANICO + MINI-DAW
   ═══════════════════════════════════════════════════════════════ */

function Fan() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(-1);
  const narrow = useNarrow();
  const pos = narrow ? (open ? FAN_OPEN_SM : FAN_REST_SM) : open ? FAN_OPEN : FAN_REST;

  return (
    <div
      className="relative mx-auto h-full w-full max-w-3xl"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false);
        setHover(-1);
      }}
      onClick={() => setOpen((o) => !o)}
    >
      {FAN.map((c, i) => {
        const [x, r, y] = pos[i];
        const lifted = hover === i;
        return (
          <figure
            key={c.label}
            onMouseEnter={() => setHover(i)}
            className="absolute bottom-[6%] left-1/2 aspect-[3/4] h-[78%] max-h-[min(290px,56vw)] origin-bottom cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 shadow-[0_25px_60px_-10px_rgba(0,0,0,.9)] transition-transform duration-700 [transition-timing-function:cubic-bezier(.2,.8,.2,1)]"
            style={{
              transform: `translateX(${x - 50}%) translateY(${y - (lifted ? 22 : 0)}px) rotate(${r}deg) scale(${lifted ? 1.06 : 1})`,
              zIndex: lifted ? 20 : i === 1 || i === 2 ? 10 : 5,
            }}
          >
            <img
              src={c.src}
              alt={c.label}
              className="h-full w-full object-cover"
              style={{ objectPosition: c.pos }}
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-2.5 md:p-3">
              <span className="block font-['JetBrains_Mono'] text-[8px] uppercase tracking-[0.2em] text-[#D4AF37] md:text-[9px]">
                0{i + 1} · {c.tag}
              </span>
              <span className="block font-['Anton'] text-sm uppercase leading-tight text-white md:text-lg">{c.label}</span>
            </figcaption>
          </figure>
        );
      })}

      {/* Píldoras flotantes */}
      <Pill className="absolute left-[2%] top-[4%] z-30 [animation:jv-float_5s_ease-in-out_infinite] md:left-[6%]">🔥 Sonido Urbano de Élite</Pill>
      <Pill className="absolute right-[2%] top-[14%] z-30 [animation:jv-float_6s_ease-in-out_-2s_infinite] md:right-[6%]">🎙️ Cabina Tratada</Pill>
      <Pill className="absolute bottom-[2%] left-[4%] z-30 hidden [animation:jv-float_7s_ease-in-out_-1s_infinite] sm:inline-flex">👑 Hitmakers</Pill>
      <Pill className="absolute right-[1%] top-[52%] z-30 hidden [animation:jv-float_5.5s_ease-in-out_-3s_infinite] md:inline-flex">
        <span className="h-2 w-2 rounded-full bg-red-500 [animation:jv-blink_1s_infinite]" /> Rec
      </Pill>
      <div className="absolute bottom-[8%] right-[3%] z-30 flex items-start [animation:jv-float_6.5s_ease-in-out_-4s_infinite] md:right-[8%]">
        <CursorIcon className="-mr-1 mt-[-10px] h-5 w-5" />
        <Pill className="border-[#D4AF37]/40 text-[#f3e3ad]">@JVProduction</Pill>
      </div>
      <Pill className="absolute left-[1%] top-[48%] z-30 hidden [animation:jv-float_6s_ease-in-out_-5s_infinite] lg:inline-flex">Master Ready ⚡</Pill>

      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.3em] text-zinc-600 md:hidden">
        Toca para abrir
      </span>
    </div>
  );
}

function MiniDAW() {
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

  const pick = (i) => {
    if (i === idx) return setPlaying((p) => !p);
    setIdx(i);
    setPos(0);
    setPlaying(true);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-2xl border border-white/10 bg-black/60 p-2 pr-3 backdrop-blur-md md:gap-4 md:rounded-full md:p-2.5 md:pr-5">
      {beat.src && (
        <audio ref={audioRef} src={beat.src} onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)} onEnded={() => pick((idx + 1) % BEATS.length)} />
      )}
      <button
        onClick={() => setPlaying((p) => !p)}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(180deg,#fff,#cbd5e1)] text-black shadow-[0_0_24px_rgba(255,255,255,.25)] transition-transform active:scale-95"
        aria-label={playing ? "Pausar" : "Reproducir"}
      >
        {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" />}
      </button>

      <div className="w-28 shrink-0 md:w-44">
        <p className="truncate font-['Space_Grotesk'] text-[13px] font-semibold text-white">{beat.title}</p>
        <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.15em] text-zinc-500">
          {beat.genre} · {beat.bpm} BPM · {fmt(pos)}
        </p>
      </div>

      <EqBars playing={playing} count={36} className="h-8 min-w-0 flex-1" />

      <div className="hidden shrink-0 gap-1 sm:flex" role="tablist" aria-label="Beats">
        {BEATS.map((b, i) => (
          <button
            key={b.title}
            onClick={() => pick(i)}
            aria-selected={idx === i}
            role="tab"
            className={`h-8 w-8 rounded-full font-['JetBrains_Mono'] text-[10px] transition-colors ${
              idx === i ? "bg-[#D4AF37] text-black" : "border border-white/15 text-zinc-400 hover:text-white"
            }`}
          >
            0{i + 1}
          </button>
        ))}
      </div>
      <button onClick={() => pick((idx + 1) % BEATS.length)} className="shrink-0 text-zinc-400 sm:hidden" aria-label="Siguiente beat">
        <SkipForward className="h-5 w-5" />
      </button>
    </div>
  );
}

function SlideImpact({ goTo }) {
  return (
    <div className="relative flex h-full flex-col px-4 pb-4 pt-[72px] md:pb-6 md:pt-24">
      <Atmosphere />
      <Particles />
      <div className="relative z-10 flex shrink-0 flex-col items-center text-center">
        <Emblem className="h-[clamp(120px,24dvh,250px)]" />
        <div className="mt-1 flex w-full max-w-xl items-center gap-3">
          <span className="jv-line h-px flex-1" />
          <h1 className="font-['Cinzel'] text-[10px] font-semibold tracking-[0.28em] text-zinc-100 sm:text-xs md:text-sm md:tracking-[0.4em]">
            TU MÚSICA, NUESTRA PRODUCCIÓN
          </h1>
          <span className="jv-line h-px flex-1" />
        </div>
      </div>

      <div className="relative z-10 min-h-0 flex-1 py-2">
        <Fan />
      </div>

      <div className="relative z-10 shrink-0">
        <MiniDAW />
        <button
          onClick={() => goTo(1)}
          className="mx-auto mt-2 hidden items-center gap-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-zinc-500 transition-colors hover:text-zinc-200 md:flex"
        >
          Servicios <ArrowDown className="h-3 w-3 animate-bounce" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 2 — BENTO DE SERVICIOS
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
        className="relative w-6 flex-1 cursor-ns-resize md:w-8 touch-none outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
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
          className="absolute left-1/2 h-3.5 w-6 -translate-x-1/2 md:w-8 translate-y-1/2 rounded-[4px] border border-white/40 bg-gradient-to-b from-zinc-100 to-zinc-500 shadow-[0_4px_10px_rgba(0,0,0,.6)]"
          style={{ bottom: `calc(${value * 100}% * .9 + 5%)` }}
        />
      </div>
      <span className="font-['JetBrains_Mono'] text-[9px] uppercase text-zinc-500">{label}</span>
    </div>
  );
}

function MixWidget() {
  const [v, setV] = useState([0.72, 0.55, 0.84]);
  const avg = (v[0] + v[1] + v[2]) / 3;
  const lufs = (-20 + avg * 14).toFixed(1);
  return (
    <div className="relative flex h-full min-h-0 gap-1.5 md:gap-2">
      {["Vox", "808", "Mst"].map((l, i) => (
        <Fader key={l} label={l} value={v[i]} onChange={(nv) => setV((a) => a.map((x, j) => (j === i ? nv : x)))} />
      ))}
      <div className="absolute right-0 top-0 flex flex-col items-end md:static md:ml-auto md:justify-end">
        <span className="font-['Anton'] text-lg leading-none text-white md:text-3xl">{lufs}</span>
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
          className={`rounded-lg border border-white/10 transition-all duration-150 ${
            hit === i ? `${c} scale-95 shadow-[0_0_24px_currentColor]` : "bg-white/[0.04] hover:bg-white/[0.08]"
          }`}
        />
      ))}
    </div>
  );
}

function ProductionWidget() {
  const rows = [[0, 30, 60], [10, 50], [0, 100], [20, 45, 75]];
  return (
    <div className="flex h-full min-h-0 flex-col justify-end gap-1.5">
      {rows.map((r, i) => (
        <div key={i} className="relative h-3 rounded-sm bg-white/[0.04] md:h-4">
          {r.map((l, j) => (
            <span
              key={j}
              className={`absolute inset-y-0 rounded-sm ${i % 2 ? "bg-blue-500/60" : "bg-pink-500/60"}`}
              style={{ left: `${l}%`, width: `${l === 0 && r.length === 2 ? 100 : 24}%`, animation: `jv-load 1.2s ${i * 0.15 + j * 0.1}s both ease-out` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function VoiceWidget({ hours, setHours }) {
  return (
    <div className="flex h-full min-h-0 items-end justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHours((h) => Math.max(1, h - 1));
          }}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-zinc-300 hover:border-white/40"
          aria-label="Menos horas"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-[3ch] text-center font-['Anton'] text-3xl text-white">{hours}h</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHours((h) => Math.min(10, h + 1));
          }}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-zinc-300 hover:border-white/40"
          aria-label="Más horas"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <span className="hidden items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 font-['JetBrains_Mono'] text-[10px] text-red-300 sm:inline-flex">
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
      {/* Visor: usa la foto Night Vibe de fondo */}
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
      <p className="font-['Mrs_Saint_Delafield'] text-2xl leading-tight text-[#f3e3ad] md:text-3xl">
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
    <div className="flex h-full min-h-0 items-end justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setS((x) => (x + 1) % styles.length);
        }}
        aria-label="Cambiar estilo de portada"
        className={`relative aspect-square h-full max-h-28 rounded-lg border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,.6)] transition-all duration-500 ${styles[s]}`}
      >
        <span className="absolute left-2 top-1.5 font-['Pinyon_Script'] text-lg text-white/90">JV</span>
        <span className="absolute bottom-1.5 right-1.5 border border-white bg-black px-1 font-black text-[5px] leading-tight text-white">PARENTAL<br />ADVISORY</span>
      </button>
    </div>
  );
}

function VisualizerWidget() {
  return (
    <div className="relative grid h-full min-h-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(109,40,217,.35),transparent_65%)]" />
      <EqBars playing count={14} className="relative h-1/2 w-3/4" />
    </div>
  );
}

function DistributionWidget() {
  const stores = ["Spotify", "Apple Music", "YouTube Music", "Amazon Music", "Deezer", "Tidal", "TikTok", "+150 tiendas"];
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center gap-5 md:flex-row md:gap-12">
      <div className="relative grid aspect-square h-[clamp(110px,26dvh,240px)] place-items-center">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-[12%] rounded-full border border-dashed border-[#D4AF37]/40 [animation:jv-spin_30s_linear_infinite]" />
        <Globe className="h-1/2 w-1/2 text-zinc-200 [animation:jv-spin_40s_linear_infinite]" strokeWidth={0.8} />
        <span className="absolute -right-2 top-[15%] h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
      </div>
      <div className="w-full max-w-md">
        <div className="flex flex-wrap justify-center gap-1.5 md:justify-start">
          {stores.map((s) => (
            <span key={s} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-['Space_Grotesk'] text-[11px] text-zinc-300">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-gradient-to-r from-[#D4AF37] to-white [animation:jv-load_3s_ease-out_infinite]" />
        </div>
        <p className="mt-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-zinc-500">Subiendo a plataformas · Regalías 100% tuyas</p>
      </div>
    </div>
  );
}

function BentoCard({ item, selected, onSelect, onBook, children }) {
  const Icon = item.icon;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect())}
      aria-pressed={selected}
      className={`group relative flex min-h-0 cursor-pointer flex-col overflow-hidden rounded-3xl border bg-zinc-900/70 p-3.5 backdrop-blur-sm transition-all duration-500 md:p-5 ${item.span} ${
        selected ? "border-[#D4AF37]/70 shadow-[0_0_40px_-10px_rgba(212,175,55,.5)]" : "border-white/10 hover:border-white/25"
      }`}
    >
      <div className="flex shrink-0 items-start justify-between gap-2">
        <span className={`grid h-9 w-9 place-items-center rounded-full border transition-colors md:h-10 md:w-10 ${selected ? "border-[#D4AF37] text-[#D4AF37]" : "border-white/15 text-zinc-200"}`}>
          <Icon className="h-4 w-4" strokeWidth={1.6} />
        </span>
        <span className="font-['JetBrains_Mono'] text-[10px] text-zinc-600">0{item.n}</span>
      </div>
      <h3 className="mt-2 shrink-0 font-['Cinzel'] text-[11px] font-semibold uppercase leading-snug tracking-[0.1em] text-zinc-100 md:mt-3 md:text-[13px]">
        {item.title}
      </h3>
      <p className="mt-1 hidden shrink-0 font-['Space_Grotesk'] text-xs leading-relaxed text-zinc-500 lg:block">{item.desc}</p>
      <div className="mt-2 min-h-0 flex-1 md:mt-3">{children}</div>
      <div className={`grid shrink-0 transition-all duration-500 ${selected ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook();
            }}
            tabIndex={selected ? 0 : -1}
            className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#D4AF37] px-3 py-2 font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-[0.08em] text-black hover:bg-[#e6c25a]"
          >
            Agendar este servicio <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SlideServices({ onBook, hours, setHours }) {
  const [tab, setTab] = useState(0);
  const [sel, setSel] = useState(null);
  const current = TABS[tab];

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

  return (
    <div className="relative flex h-full flex-col px-4 pb-4 pt-[72px] md:px-10 md:pb-8 md:pt-24">
      <Atmosphere />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl min-h-0 flex-col">
        <div className="flex shrink-0 flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">02 · 9 servicios oficiales</p>
            <h2 className="jv-chrome font-['Anton'] text-[clamp(2rem,6dvh,4.5rem)] uppercase leading-none">360° Music Factory</h2>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label="Categorías">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === i}
                onClick={() => {
                  setTab(i);
                  setSel(null);
                }}
                className={`shrink-0 rounded-full px-4 py-2 font-['Space_Grotesk'] text-xs font-semibold transition-colors ${
                  tab === i ? "bg-white text-black" : "border border-white/15 bg-black/40 text-zinc-400 hover:text-white"
                }`}
              >
                {t.label}
                <span className={`ml-1.5 font-['JetBrains_Mono'] text-[10px] ${tab === i ? "text-zinc-500" : "text-zinc-600"}`}>{t.items.length}</span>
              </button>
            ))}
          </div>
        </div>

        <div key={current.id} className={`mt-4 grid min-h-0 flex-1 gap-2.5 md:mt-6 md:gap-4 ${current.grid}`}>
          {current.items.map((item) => (
            <BentoCard
              key={item.id}
              item={item}
              selected={sel === item.id}
              onSelect={() => setSel((s) => (s === item.id ? null : item.id))}
              onBook={() => onBook(item.book)}
            >
              {widget(item.id)}
            </BentoCard>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 3 — EXPERIENCIA (Antes/Después + proceso) / IDENTIDAD
   ═══════════════════════════════════════════════════════════════ */

function SlideExperience() {
  const [after, setAfter] = useState(true);
  const [step, setStep] = useState(0);
  const bars = 56;

  return (
    <div className="relative flex h-full flex-col px-4 pb-4 pt-[72px] md:px-10 md:pb-8 md:pt-24">
      <Atmosphere tone="warm" />
      <div className="relative z-10 mx-auto grid h-full w-full max-w-6xl min-h-0 grid-rows-[auto_1fr] gap-4 md:grid-cols-2 md:grid-rows-1 md:items-center md:gap-12">
        {/* Identidad (arriba en móvil, derecha en PC) */}
        <div className="md:order-2">
          <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">03 · La experiencia</p>
          <h2 className="mt-1 font-['Anton'] text-[clamp(1.7rem,5.2dvh,5rem)] uppercase leading-[0.95]">
            <span className="text-zinc-500">Desde la idea hasta el lanzamiento.</span>{" "}
            <span className="jv-chrome-anim">Hacemos realidad tu proyecto</span>
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-6 md:gap-3">
            <ParentalAdvisory className="scale-90 md:scale-100" />
            {["Spotify", "Apple Music", "YouTube"].map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 font-['Space_Grotesk'] text-[11px] font-medium text-zinc-200">
                <span className={`h-1.5 w-1.5 rounded-full ${p === "Spotify" ? "bg-[#1DB954]" : p === "YouTube" ? "bg-red-500" : "bg-pink-400"}`} />
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Showcase interactivo */}
        <div className="flex min-h-0 flex-col gap-3 md:order-1">
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-4 backdrop-blur-sm md:flex-none md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex rounded-full border border-white/10 bg-black/60 p-1" role="tablist" aria-label="Comparar mezcla">
                {["Antes", "Después"].map((l, i) => (
                  <button
                    key={l}
                    role="tab"
                    aria-selected={after === !!i}
                    onClick={() => setAfter(!!i)}
                    className={`rounded-full px-4 py-1.5 font-['Space_Grotesk'] text-xs font-semibold transition-colors ${after === !!i ? "bg-white text-black" : "text-zinc-400"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <span className={`rounded-full px-3 py-1 font-['JetBrains_Mono'] text-[10px] transition-colors ${after ? "bg-[#D4AF37]/15 text-[#f3e3ad]" : "bg-white/5 text-zinc-500"}`}>
                {after ? "Master Ready ⚡" : "Maqueta"}
              </span>
            </div>

            <div className="mt-4 flex min-h-0 flex-1 items-center gap-4 md:mt-6 md:gap-6">
              {/* Vinilo en 3D */}
              <div className="hidden shrink-0 [perspective:700px] sm:block [@media(max-height:700px)]:hidden">
                <div className="[transform:rotateX(55deg)_rotateZ(-10deg)]">
                  <div className={`jv-vinyl relative h-28 w-28 rounded-full shadow-[0_30px_40px_rgba(0,0,0,.8)] md:h-36 md:w-36 ${after ? "[animation:jv-spin_2.4s_linear_infinite]" : "[animation:jv-spin_6s_linear_infinite]"}`} />
                </div>
              </div>
              <dl className="grid flex-1 grid-cols-3 gap-2">
                {[
                  ["Loudness", after ? "-8.2" : "-19.4", "LUFS"],
                  ["Pico", after ? "-1.0" : "-6.3", "dBTP"],
                  ["Stereo", after ? "92" : "61", "%"],
                ].map(([k, v, u]) => (
                  <div key={k}>
                    <dt className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.15em] text-zinc-500">{k}</dt>
                    <dd className={`font-['Anton'] text-2xl leading-tight transition-colors md:text-3xl ${after ? "text-white" : "text-zinc-500"}`}>
                      {v}
                      <span className="ml-1 font-['JetBrains_Mono'] text-[9px] text-zinc-500">{u}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Forma de onda */}
            <div className="mt-4 flex h-[clamp(48px,10dvh,110px)] shrink-0 items-center gap-[2px]" aria-hidden="true">
              {Array.from({ length: bars }).map((_, i) => {
                const base = 0.35 + Math.abs(Math.sin(i * 0.45) * Math.cos(i * 0.17)) * 0.65;
                const h = after ? 0.6 + base * 0.4 : base * 0.45;
                return (
                  <span
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-700 ${after ? "bg-gradient-to-b from-white via-[#E2E8F0] to-[#D4AF37]" : "bg-zinc-600"}`}
                    style={{ height: `${h * 100}%`, transitionDelay: `${i * 6}ms` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Proceso en 4 píldoras */}
          <div className="shrink-0">
            <div className="grid grid-cols-4 gap-1.5" role="tablist" aria-label="Proceso">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.short}
                    role="tab"
                    aria-selected={step === i}
                    onClick={() => setStep(i)}
                    className={`flex flex-col items-center gap-1 rounded-2xl border px-1 py-2 transition-all md:flex-row md:justify-center md:rounded-full md:px-3 ${
                      step === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-white" : "border-white/10 bg-black/40 text-zinc-500 hover:text-zinc-200"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${step === i ? "text-[#D4AF37]" : ""}`} strokeWidth={1.6} />
                    <span className="font-['Space_Grotesk'] text-[10px] font-semibold leading-tight md:text-xs">
                      <span className="hidden md:inline">0{i + 1}. </span>
                      {s.short}
                    </span>
                  </button>
                );
              })}
            </div>
            <p key={step} className="mt-2 min-h-[2.5em] font-['Space_Grotesk'] text-xs leading-relaxed text-zinc-400 md:text-sm">
              <span className="font-['JetBrains_Mono'] text-[#D4AF37]">0{step + 1} → </span>
              {STEPS[step].desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 4 — QUICK BOOKING (alto contraste)
   ═══════════════════════════════════════════════════════════════ */

function Choice({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-['Space_Grotesk'] text-[11px] font-semibold transition-all md:px-4 md:py-2 md:text-[13px] ${
        active ? "border-black bg-black text-white" : "border-black/20 bg-white/40 text-black/80 hover:border-black/50"
      }`}
    >
      {active && <Check className="h-3 w-3" strokeWidth={3} />}
      {children}
    </button>
  );
}

function SlideBooking({ booking, setBooking }) {
  const { services, format, when, name, hours } = booking;
  const set = (k, v) => setBooking((b) => ({ ...b, [k]: v }));
  const toggle = (s) => set("services", services.includes(s) ? services.filter((x) => x !== s) : [...services, s]);

  const message =
    `Hola JV Productions 👑, soy ${name.trim() || "un artista"} y quiero agendar: ${services.join(", ") || "—"}` +
    ` en formato ${format}${format === "Sesión por Horas" ? ` (${hours}h)` : ""}, para ${when.replace(" ⚡", "").toLowerCase()}. ¿Tenéis disponibilidad?`;
  const ready = services.length > 0;
  const send = () => {
    if (!ready) return;
    window.open(`https://wa.me/${LINKS.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-3 pb-3 pt-[64px] md:px-10 md:pb-8 md:pt-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F59E0B]/15 blur-[140px]" />
      </div>

      <div className="no-scrollbar relative z-10 grid max-h-full w-full max-w-6xl overflow-y-auto rounded-3xl bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-400 text-black shadow-[0_40px_120px_-20px_rgba(245,158,11,.35)] md:grid-cols-5">
        {/* Columna izquierda: titular + preview */}
        <div className="relative flex flex-col justify-between gap-4 p-4 pb-3 md:col-span-2 md:border-r md:border-black/10 md:p-10">
          <div>
            <p className="hidden font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-black/50 sm:block">04 · Agenda en 3 clics</p>
            <h2 className="mt-1 font-['Anton'] text-[clamp(1.7rem,5dvh,4.5rem)] uppercase leading-[0.92]">¿Listo para sonar profesional?</h2>
          </div>
          {/* Vista previa del mensaje (solo PC) */}
          <div className="hidden md:block">
            <p className="mb-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-black/50">Tu mensaje</p>
            <div className="relative rounded-2xl rounded-bl-sm bg-[#d9fdd3] p-4 font-['Space_Grotesk'] text-sm leading-relaxed text-black/80 shadow-sm">
              {message}
            </div>
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

        {/* Columna derecha: pasos */}
        <div className="flex min-h-0 flex-col gap-2.5 p-4 pt-0 md:col-span-3 md:gap-5 md:p-10">
          <fieldset>
            <legend className="mb-1.5 font-['JetBrains_Mono'] text-[10px] font-medium uppercase tracking-[0.2em] text-black/60">
              <span className="mr-1 text-black">1</span> ¿Qué necesitas?
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {BOOK_SERVICES.map((s) => (
                <Choice key={s} active={services.includes(s)} onClick={() => toggle(s)}>
                  {s}
                </Choice>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 font-['JetBrains_Mono'] text-[10px] font-medium uppercase tracking-[0.2em] text-black/60">
              <span className="mr-1 text-black">2</span> Formato
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {BOOK_FORMATS.map((f) => (
                <Choice key={f} active={format === f} onClick={() => set("format", f)}>
                  {f}
                  {f === "Sesión por Horas" && format === f ? ` · ${hours}h` : ""}
                </Choice>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 font-['JetBrains_Mono'] text-[10px] font-medium uppercase tracking-[0.2em] text-black/60">
              <span className="mr-1 text-black">3</span> ¿Cuándo?
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {BOOK_WHEN.map((w) => (
                <Choice key={w} active={when === w} onClick={() => set("when", w)}>
                  {w}
                </Choice>
              ))}
            </div>
            <input
              value={name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Tu nombre artístico (opcional)"
              aria-label="Nombre artístico"
              maxLength={40}
              className="mt-2 w-full rounded-full border border-black/20 bg-white/60 px-4 py-2 md:mt-2.5 md:py-2.5 font-['Space_Grotesk'] text-sm text-black placeholder:text-black/40 focus:border-black focus:outline-none"
            />
          </fieldset>

          <button
            onClick={send}
            disabled={!ready}
            className="group mt-1 flex w-full items-center justify-center gap-3 rounded-full bg-black px-5 py-3 font-['Anton'] text-base uppercase tracking-[0.08em] text-white transition-all hover:shadow-[0_0_0_4px_rgba(37,211,102,.35)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none md:py-5 md:text-2xl"
          >
            <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
            {ready ? "Agendar por WhatsApp ahora" : "Elige al menos un servicio"}
            {ready && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
          </button>

          <div className="flex items-center justify-between md:hidden">
            <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.1em] text-black/70">
              <InstagramIcon className="h-4 w-4" /> {LINKS.instagramHandle}
            </a>
            <span className="font-['JetBrains_Mono'] text-[9px] uppercase text-black/40">© {new Date().getFullYear()} JV</span>
          </div>
        </div>
      </div>

      <p className="relative z-10 mt-3 hidden items-center gap-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-zinc-500 md:flex">
        <Sparkles className="h-3 w-3 text-[#D4AF37]" /> © {new Date().getFullYear()} JV Productions · Tu música, nuestra producción
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════ */

export default function JVProductionsSlides() {
  const scroller = useRef(null);
  const refs = useRef([]);
  const [active, setActive] = useState(0);
  const [booking, setBooking] = useState({
    services: [],
    format: "Sesión por Horas",
    when: "Esta semana",
    name: "",
    hours: 2,
  });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.index))),
      { root: scroller.current, threshold: 0.55 }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i) => refs.current[i]?.scrollIntoView({ behavior: "smooth" });

  const bookService = (service) => {
    setBooking((b) => ({
      ...b,
      services: b.services.includes(service) ? b.services : [...b.services, service],
      format: service === "Grabar Voces" ? "Sesión por Horas" : service === "Distribución" ? "Pack Lanzamiento" : b.format,
    }));
    goTo(3);
  };

  const setHours = (fn) => setBooking((b) => ({ ...b, hours: typeof fn === "function" ? fn(b.hours) : fn }));

  const slides = [
    <SlideImpact goTo={goTo} />,
    <SlideServices onBook={bookService} hours={booking.hours} setHours={setHours} />,
    <SlideExperience />,
    <SlideBooking booking={booking} setBooking={setBooking} />,
  ];

  return (
    <div className="jv-grain relative bg-[#050505] font-['Space_Grotesk'] text-zinc-200 antialiased">
      <GlobalStyles />
      <HUD active={active} goTo={goTo} />
      <main ref={scroller} className="no-scrollbar h-[100dvh] snap-y snap-mandatory overflow-y-scroll scroll-smooth">
        {slides.map((s, i) => (
          <section
            key={SLIDES[i]}
            ref={(el) => (refs.current[i] = el)}
            data-index={i}
            aria-label={SLIDES[i]}
            className="relative h-[100dvh] snap-start snap-always overflow-hidden"
          >
            {s}
          </section>
        ))}
      </main>
    </div>
  );
}
