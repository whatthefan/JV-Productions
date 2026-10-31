/**
 * JV PRODUCTIONS — Landing Page
 * Stack: React + Tailwind CSS + lucide-react
 * Estética: Dark Underground Luxury (cromo líquido, oro viejo, luz de estudio nocturno)
 *
 * Todo lo que tienes que personalizar está en las constantes LINKS e IMAGES de abajo.
 */
import React, { useState, useEffect, useRef } from "react";
import {
  Crown,
  Menu,
  X,
  Play,
  Pause,
  SkipBack,
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
  Disc3,
  Rocket,
  Headphones,
  Volume2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   CONFIGURACIÓN — CAMBIA AQUÍ TUS ENLACES Y FOTOS
   ═══════════════════════════════════════════════════════════════ */

const LINKS = {
  // REEMPLAZAR: tu número con prefijo de país, sin "+", espacios ni guiones (ej: 34612345678)
  whatsapp:
    "https://wa.me/34000000000?text=" +
    encodeURIComponent("Hola JV Productions, quiero reservar una sesión 🎙️"),
  instagram: "https://instagram.com/jvproduction",
  instagramHandle: "@JVPRODUCTION",
};

const IMAGES = {
  // REEMPLAZAR CON TU VÍDEO DEL ESTUDIO (carpeta /public/videos/)
  heroVideo: "videos/jv-hero.mp4",
  // Foto de portada del hero (se ve mientras carga el vídeo)
  heroPoster: "img/estudio-zona.jpg",
  // Logo JV sobre fondo negro: se integra con mix-blend-screen y una máscara radial.
  // Si consigues un PNG transparente, cámbialo aquí. Con null se pinta el emblema tipográfico.
  logo: "img/logo-jv.jpg",
  // FOTO ESTUDIO 1 — El Setup (productor en B/N con cascos Focal y monitor blanco)
  // Si tienes la toma del doble monitor con el DAW abierto, ponla aquí.
  setup: "img/estudio-setup.jpg",
  // FOTO ESTUDIO 2 — En la Zona (cascos bajo el aro LED ámbar)
  zone: "img/estudio-zona.jpg",
  // FOTO ESTUDIO 3 — La Atmósfera (LEDs azules y humo)
  atmosphere: "img/estudio-atmosfera.jpg",
  // FOTO ESTUDIO 4 — La Identidad (sombra con cuernos + encapuchado con máscara blanca)
  identity: "img/estudio-identidad.jpg",
};

/* ═══════════════════════════════════════════════════════════════
   DATOS
   ═══════════════════════════════════════════════════════════════ */

const NAV = [
  { label: "El Estudio", href: "#estudio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Vibe / Beats", href: "#beats" },
  { label: "Proceso", href: "#proceso" },
  { label: "Contacto", href: "#contacto" },
];

const GENRES = ["Todos", "Trap", "Reggaeton", "R&B", "Drill"];

// Para usar audio real añade `src: "/beats/archivo.mp3"` a cualquier beat.
// Sin `src`, el reproductor funciona en modo simulado.
const BEATS = [
  { id: 1, title: "Medianoche en el Bunker", genre: "Trap", bpm: 142, key: "F# min", dur: 174 },
  { id: 2, title: "Perreo de Cromo", genre: "Reggaeton", bpm: 94, key: "A min", dur: 186 },
  { id: 3, title: "Luz Ámbar", genre: "R&B", bpm: 78, key: "Db maj", dur: 201 },
  { id: 4, title: "Sombra con Cuernos", genre: "Drill", bpm: 144, key: "G min", dur: 162 },
  { id: 5, title: "Corona Rota", genre: "Trap", bpm: 150, key: "C# min", dur: 158 },
];

const TRACKS = [
  { name: "VOX LEAD", tone: "pink", clips: [[6, 26], [36, 24], [66, 30]] },
  { name: "VOX DOBLES", tone: "pink", clips: [[18, 14], [48, 12], [78, 18]] },
  { name: "808 / BASS", tone: "blue", clips: [[0, 49], [51, 49]] },
  { name: "DRUMS", tone: "blue", clips: [[0, 100]] },
  { name: "MELODÍA", tone: "pink", clips: [[0, 22], [24, 40], [66, 34]] },
];

const SERVICES = [
  {
    icon: SlidersVertical,
    title: "Producción Musical Completa",
    desc: "Dirección artística y creación integral de tu tema desde cero.",
  },
  {
    icon: SlidersHorizontal,
    title: "Mezcla y Mastering",
    desc: "Sonido comercial, potente y cristalino listo para competir en playlists globales.",
  },
  {
    icon: MonitorPlay,
    title: "Visualizers",
    desc: "Piezas visuales hipnóticas y dinámicas para potenciar tu lanzamiento en YouTube y redes.",
  },
  {
    icon: Music,
    title: "Creación de Beats Personalizados",
    desc: "Instrumentales exclusivas hechas a medida para tu flow y registro vocal.",
  },
  {
    icon: NotebookPen,
    title: "Composición de Letras",
    desc: "Co-writing, melodías pegadizas, estructuras comerciales y barras con identidad propia.",
  },
  {
    icon: ImageIcon,
    title: "Diseño de Portadas",
    desc: "Dirección creativa y cover art con estética de sello discográfico para todas las plataformas.",
  },
  {
    icon: Mic,
    title: "Grabación de Voces por Horas",
    desc: "Cabina tratada acústicamente, previos de gama alta y dirección vocal en sesión.",
  },
  {
    icon: Clapperboard,
    title: "Videoclips",
    desc: "Producción audiovisual cinematográfica con estética callejera, nocturna y de alto impacto.",
  },
  {
    icon: Globe,
    title: "Distribución Musical",
    desc: "Subida, gestión de regalías y posicionamiento en Spotify, Apple Music y todas las tiendas digitales.",
  },
];

const STEPS = [
  {
    icon: Disc3,
    title: "La Idea y el Beat",
    desc: "Escuchamos tu visión, definimos referencias y construimos la instrumental que te queda a medida.",
  },
  {
    icon: Mic,
    title: "Grabación en Cabina",
    desc: "Sesión dirigida en cabina tratada. Tomas, dobles y ad-libs hasta que la voz suene a disco.",
  },
  {
    icon: SlidersHorizontal,
    title: "Mezcla, Master y Arte Visual",
    desc: "Pulimos el sonido a nivel comercial y vestimos el tema: portada, visualizer o videoclip.",
  },
  {
    icon: Rocket,
    title: "Lanzamiento y Distribución Global",
    desc: "Subimos tu música a todas las plataformas y gestionamos regalías. Tú solo suenas.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   ESTILOS GLOBALES (fuentes, cromo, grano, animaciones)
   ═══════════════════════════════════════════════════════════════ */

const GlobalStyles = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Cinzel:wght@400;600;700&family=Pinyon+Script&family=Mrs+Saint+Delafield&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

html { scroll-behavior: smooth; }
body { background: #050505; }
::selection { background: #D4AF37; color: #050505; }

.jv-chrome {
  background: linear-gradient(178deg, #ffffff 0%, #E2E8F0 30%, #7c828c 48%, #f8fafc 58%, #aeb6c2 78%, #ffffff 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.jv-chrome-anim {
  background: linear-gradient(100deg, #8a909a 0%, #ffffff 20%, #9aa1ab 35%, #E2E8F0 50%, #ffffff 62%, #7c828c 80%, #ffffff 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: jv-shine 7s linear infinite;
}
.jv-gold {
  background: linear-gradient(180deg, #f7e7b4 0%, #D4AF37 40%, #8a6d1c 62%, #e9cf7a 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.jv-outline { color: transparent; -webkit-text-stroke: 1px rgba(226,232,240,.28); }
.jv-line { background: linear-gradient(90deg, transparent, rgba(226,232,240,.75), transparent); }
.jv-line-gold { background: linear-gradient(90deg, transparent, #D4AF37, transparent); }

/* Grano de película */
.jv-grain::before {
  content: ""; position: fixed; inset: -100%; z-index: 70; pointer-events: none; opacity: .075;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: jv-grain 1.2s steps(6) infinite;
}
@keyframes jv-grain {
  0% { transform: translate(0,0) } 20% { transform: translate(-3%,2%) } 40% { transform: translate(2%,-4%) }
  60% { transform: translate(-4%,-1%) } 80% { transform: translate(3%,3%) } 100% { transform: translate(0,0) }
}
@keyframes jv-shine { from { background-position: 250% 0 } to { background-position: -250% 0 } }
@keyframes jv-spin { to { transform: rotate(360deg) } }
@keyframes jv-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes jv-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes jv-glow { 0%,100% { opacity: .55 } 50% { opacity: .9 } }

/* Ecualizador */
@keyframes jv-eq { 0%,100% { transform: scaleY(.18) } 50% { transform: scaleY(1) } }
.jv-eq > span { transform-origin: bottom; animation: jv-eq 1s ease-in-out infinite; }
.jv-eq.is-paused > span { animation: none; transform: scaleY(.1); transition: transform .4s; }

/* Vinilo */
.jv-vinyl {
  background:
    radial-gradient(circle at 50% 50%, #0b0b0c 0 13%, #D4AF37 13.3% 14.5%, #111 14.8% 16%, transparent 16.2%),
    repeating-radial-gradient(circle at 50% 50%, #0a0a0a 0 2px, #161618 2.5px 3px),
    #0a0a0a;
}
.jv-vinyl::after {
  content: ""; position: absolute; inset: 0; border-radius: 9999px;
  background: conic-gradient(from 20deg, transparent 0 10%, rgba(255,255,255,.12) 14%, transparent 20% 55%, rgba(255,255,255,.08) 60%, transparent 66%);
}

/* Revelado al hacer scroll */
.jv-reveal { opacity: 0; transform: translateY(28px); transition: opacity 1s cubic-bezier(.2,.7,.2,1), transform 1s cubic-bezier(.2,.7,.2,1); }
.jv-reveal.is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
  .jv-reveal { opacity: 1; transform: none; }
}
`}</style>
);

/* ═══════════════════════════════════════════════════════════════
   PIEZAS REUTILIZABLES
   ═══════════════════════════════════════════════════════════════ */

function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`jv-reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

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

function ParentalAdvisory({ className = "", scale = 1 }) {
  return (
    <div
      className={`inline-flex select-none flex-col border-[3px] border-white bg-black text-white ${className}`}
      style={{ fontFamily: "'Arial Black', Arial, Helvetica, sans-serif", transform: `scale(${scale})` }}
      role="img"
      aria-label="Parental Advisory: Explicit Content"
    >
      <span className="bg-white px-2 text-center text-[9px] font-black leading-[13px] tracking-[0.28em] text-black">
        PARENTAL
      </span>
      <span className="px-2 py-[3px] text-center text-[19px] font-black leading-none tracking-tight">
        ADVISORY
      </span>
      <span className="bg-white px-2 text-center text-[8px] font-black leading-[12px] tracking-[0.12em] text-black">
        EXPLICIT CONTENT
      </span>
    </div>
  );
}

/** Emblema tipográfico. Si IMAGES.logo tiene ruta, se usa la imagen del logo real. */
function JVEmblem({ size = "lg" }) {
  const s = {
    sm: { crown: "h-4 w-4", jv: "text-3xl", prod: "text-[8px] tracking-[0.32em]", img: "h-40" },
    lg: {
      crown: "h-10 w-10 md:h-14 md:w-14",
      jv: "text-[7.5rem] md:text-[11rem]",
      prod: "text-lg md:text-2xl tracking-[0.35em]",
      img: "h-[300px] md:h-[440px]",
    },
  }[size];

  if (IMAGES.logo) {
    return (
      <img
        src={IMAGES.logo}
        alt="JV Productions"
        className={`${s.img} w-auto object-contain mix-blend-screen`}
        style={{
          WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 72%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 72%, transparent 100%)",
        }}
      />
    );
  }

  return (
    <div className="relative flex flex-col items-center leading-none">
      <Crown className={`${s.crown} text-[#D4AF37] drop-shadow-[0_0_12px_rgba(212,175,55,.55)]`} strokeWidth={1.25} />
      <span
        className={`jv-chrome-anim font-['Pinyon_Script'] ${s.jv} -mt-[0.12em] pr-[0.12em] drop-shadow-[0_6px_30px_rgba(255,255,255,.12)]`}
      >
        JV
      </span>
      <span className={`jv-chrome -mt-[0.35em] font-['Anton'] italic ${s.prod}`}>PRODUCTIONS</span>
    </div>
  );
}

function SectionHeading({ index, eyebrow, title, script, align = "left" }) {
  const center = align === "center";
  return (
    <Reveal className={`mb-14 md:mb-20 ${center ? "text-center" : ""}`}>
      <div
        className={`mb-5 flex items-center gap-3 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.3em] text-zinc-500 ${
          center ? "justify-center" : ""
        }`}
      >
        <span className="text-[#D4AF37]">{index}</span>
        <span className="h-px w-10 bg-white/20" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="jv-chrome font-['Anton'] text-5xl uppercase leading-[0.92] tracking-[0.02em] sm:text-6xl md:text-7xl lg:text-8xl">
        {title}
      </h2>
      {script && (
        <p className="mt-3 font-['Mrs_Saint_Delafield'] text-4xl text-[#D4AF37]/90 md:text-5xl">{script}</p>
      )}
    </Reveal>
  );
}

function Glows({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full bg-[#1D4ED8] opacity-[0.16] blur-[140px]" />
      <div className="absolute -right-32 top-10 h-[460px] w-[460px] rounded-full bg-[#6D28D9] opacity-[0.16] blur-[140px]" />
      <div className="absolute bottom-0 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-[#F59E0B] opacity-[0.08] blur-[140px]" />
    </div>
  );
}

/** Cadena metálica vertical en SVG */
function Chain({ id, className = "", links = 14 }) {
  const h = links * 44;
  return (
    <svg viewBox={`0 0 32 ${h}`} className={className} aria-hidden="true" preserveAspectRatio="xMidYMin meet">
      <defs>
        <linearGradient id={`chrome-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#3f444c" />
          <stop offset=".35" stopColor="#f1f5f9" />
          <stop offset=".55" stopColor="#6b7280" />
          <stop offset="1" stopColor="#d1d5db" />
        </linearGradient>
      </defs>
      {Array.from({ length: links }).map((_, i) =>
        i % 2 === 0 ? (
          <rect key={i} x="5" y={i * 44} width="22" height="52" rx="11" fill="none" stroke={`url(#chrome-${id})`} strokeWidth="5" />
        ) : (
          <rect key={i} x="13" y={i * 44 - 4} width="6" height="60" rx="3" fill={`url(#chrome-${id})`} />
        )
      )}
    </svg>
  );
}

function ChromeButton({ href, children, className = "", target }) {
  return (
    <a
      href={href}
      target={target}
      rel={target ? "noopener noreferrer" : undefined}
      className={`group relative inline-flex rounded-[3px] bg-[linear-gradient(120deg,#6b7280,#ffffff,#9ca3af,#f8fafc,#6b7280)] bg-[length:200%_100%] p-px transition-[background-position] duration-700 hover:bg-[position:100%_0] ${className}`}
    >
      <span className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#0a0a0b] px-4 py-2.5 font-['Space_Grotesk'] text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-100 transition-colors group-hover:bg-[#121214]">
        {children}
      </span>
    </a>
  );
}

const fmt = (sec) => {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/* ═══════════════════════════════════════════════════════════════
   A. NAVBAR
   ═══════════════════════════════════════════════════════════════ */

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 backdrop-blur-md transition-colors duration-500 ${
        scrolled || open ? "bg-black/80" : "bg-black/40"
      }`}
    >
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="JV Productions, inicio">
          <span className="relative grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.03]">
            <Crown className="h-4 w-4 text-[#D4AF37]" strokeWidth={1.5} />
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="jv-chrome font-['Pinyon_Script'] text-[28px] leading-none">JV</span>
            <span className="font-['Cinzel'] text-[11px] font-semibold tracking-[0.3em] text-zinc-300">PRODUCTIONS</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 xl:flex">
          {NAV.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative font-['Space_Grotesk'] text-[12px] uppercase tracking-[0.22em] text-zinc-400 transition-colors hover:text-white"
              >
                {l.label}
                <span className="jv-line-gold absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ChromeButton href={LINKS.whatsapp} target="_blank" className="hidden sm:inline-flex">
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            Reservar Sesión
          </ChromeButton>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center border border-white/15 text-zinc-200 xl:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <div
        className={`overflow-hidden border-t border-white/10 bg-[#050505]/95 transition-[max-height,opacity] duration-500 xl:hidden ${
          open ? "max-h-[100svh] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-4 py-6 sm:px-6">
          {NAV.map((l, i) => (
            <li key={l.href} className="border-b border-white/5">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 font-['Anton'] text-3xl uppercase tracking-wide text-zinc-200"
              >
                <span>
                  <span className="mr-4 font-['JetBrains_Mono'] text-xs text-[#D4AF37]">0{i + 1}</span>
                  {l.label}
                </span>
                <ArrowRight className="h-5 w-5 text-zinc-600" />
              </a>
            </li>
          ))}
          <li className="pt-6">
            <ChromeButton href={LINKS.whatsapp} target="_blank" className="w-full">
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              Reservar Sesión
            </ChromeButton>
          </li>
        </ul>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   B. HERO
   ═══════════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pt-[68px]">
      {/* Fondo: vídeo del estudio oscurecido al 75% */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* REEMPLAZAR CON VÍDEO / FOTO DEL ESTUDIO → IMAGES.heroVideo y IMAGES.heroPoster */}
        <video
          className="h-full w-full object-cover grayscale-[35%]"
          autoPlay
          muted
          loop
          playsInline
          poster={IMAGES.heroPoster}
        >
          <source src={IMAGES.heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_78%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] to-transparent" />
      </div>
      <Glows />

      {/* Vinilo girando detrás del logo */}
      <div
        className="jv-vinyl pointer-events-none absolute left-1/2 top-[44%] aspect-square w-[min(92vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 shadow-[0_0_120px_rgba(0,0,0,.9)] [animation:jv-spin_24s_linear_infinite]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-20 pt-10 text-center sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex items-center gap-3 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em] text-zinc-400 sm:text-[11px]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
          REC · Estudio abierto esta noche
        </Reveal>

        {/* Logo principal */}
        <Reveal delay={100} className="[animation:jv-float_6s_ease-in-out_infinite]">
          {/* REEMPLAZAR CON LOGO JV → IMAGES.logo */}
          <JVEmblem size="lg" />
        </Reveal>

        <Reveal delay={250} className="mt-10 flex w-full max-w-3xl items-center gap-4 md:gap-6">
          <span className="jv-line h-px flex-1" />
          <h1 className="font-['Cinzel'] text-[12px] font-semibold tracking-[0.32em] text-zinc-100 sm:text-sm md:text-lg md:tracking-[0.42em]">
            TU MÚSICA, NUESTRA PRODUCCIÓN
          </h1>
          <span className="jv-line h-px flex-1" />
        </Reveal>

        <Reveal delay={380} className="mt-6 max-w-2xl">
          <p className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.24em] text-zinc-400 md:text-base">
            Desde la idea hasta el lanzamiento.
          </p>
          <p className="jv-chrome mt-1 font-['Anton'] text-3xl uppercase italic tracking-wide md:text-5xl">
            Hacemos realidad tu proyecto
          </p>
        </Reveal>

        <Reveal delay={500} className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-[linear-gradient(180deg,#ffffff,#cbd5e1)] px-8 py-4 font-['Space_Grotesk'] text-sm font-bold uppercase tracking-[0.18em] text-black shadow-[0_0_40px_rgba(226,232,240,.25)] transition-shadow hover:shadow-[0_0_60px_rgba(226,232,240,.45)]"
          >
            <span className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/80 blur-md transition-[left] duration-700 group-hover:left-[120%]" />
            <span className="relative">Agendar Estudio Ahora</span>
            <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#beats"
            className="group inline-flex items-center justify-center gap-3 border border-white/15 bg-white/[0.04] px-8 py-4 font-['Space_Grotesk'] text-sm font-semibold uppercase tracking-[0.18em] text-zinc-100 backdrop-blur-md transition-colors hover:border-[#D4AF37]/60 hover:bg-white/[0.07]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/25 transition-colors group-hover:border-[#D4AF37] group-hover:text-[#D4AF37]">
              <Play className="h-3 w-3 translate-x-[1px]" fill="currentColor" />
            </span>
            Escuchar Producciones
          </a>
        </Reveal>

        <Reveal delay={650} className="mt-14 flex flex-col items-center gap-6">
          {/* El logo real ya trae su sello; sólo lo pintamos con el emblema tipográfico */}
          {!IMAGES.logo && <ParentalAdvisory />}
          <a href="#estudio" className="flex flex-col items-center gap-2 text-zinc-500 transition-colors hover:text-zinc-300" aria-label="Bajar">
            <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.4em]">Scroll</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MARQUEE DE GÉNEROS
   ═══════════════════════════════════════════════════════════════ */

function Marquee() {
  const words = ["Trap", "Reggaetón", "R&B", "Drill", "Dembow", "Afrobeat", "Corridos Tumbados", "Hip-Hop"];
  const row = [...words, ...words];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-[#0c0c0e] py-5" aria-hidden="true">
      <div className="flex w-max [animation:jv-marquee_40s_linear_infinite]">
        {row.map((w, i) => (
          <span key={i} className="flex items-center font-['Anton'] text-3xl uppercase tracking-wider md:text-4xl">
            <span className={i % 2 ? "jv-outline" : "jv-chrome"}>{w}</span>
            <Crown className="mx-8 h-5 w-5 text-[#D4AF37]/70" strokeWidth={1.5} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   E. DENTRO DEL BUNKER / EL ESTUDIO
   ═══════════════════════════════════════════════════════════════ */

function PhotoCard({ src, alt, label, title, tag, className = "", imgClass = "", delay = 0, children }) {
  return (
    <Reveal delay={delay} className={`group relative overflow-hidden border border-white/10 bg-[#0c0c0e] ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={(e) => (e.currentTarget.style.display = "none")}
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.06] ${imgClass}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute inset-0 opacity-0 ring-1 ring-inset ring-[#D4AF37]/50 transition-opacity duration-500 group-hover:opacity-100" />
      {tag && (
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 border border-white/15 bg-black/60 px-3 py-1.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.18em] text-zinc-200 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          {tag}
        </span>
      )}
      {children}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">{label}</p>
        <h3 className="jv-chrome mt-1 font-['Anton'] text-3xl uppercase leading-none md:text-4xl">{title}</h3>
      </div>
    </Reveal>
  );
}

function Bunker() {
  return (
    <section id="estudio" className="relative overflow-hidden bg-[#050505] py-24 md:py-36">
      <Glows className="opacity-70" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionHeading index="01" eyebrow="El Estudio" title={<>Dentro del<br />Bunker</>} />
          </div>
          <Reveal className="mb-14 md:col-span-4 md:mb-20">
            <p className="font-['Space_Grotesk'] text-base leading-relaxed text-zinc-400">
              Paneles piramidales, monitores de referencia y luz baja. Un espacio construido para que la
              sesión fluya de noche y el tema salga terminado de verdad.
            </p>
          </Reveal>
        </div>

        <div className="grid auto-rows-[200px] grid-cols-12 gap-3 md:auto-rows-[220px] md:gap-4 [grid-auto-flow:dense]">
          {/* REEMPLAZAR CON FOTO ESTUDIO 1 → IMAGES.setup */}
          <PhotoCard
            src={IMAGES.setup}
            alt="Setup del estudio: monitores, DAW y teclado MIDI"
            label="01 · El Setup"
            title="Centro de Mando"
            tag="Monitores de Referencia Studio Pro"
            className="col-span-12 row-span-2 md:col-span-7"
            imgClass="object-[50%_38%]"
          />
          {/* REEMPLAZAR CON FOTO ESTUDIO 2 → IMAGES.zone */}
          <PhotoCard
            src={IMAGES.zone}
            alt="Productor con gorra y auriculares bajo luz ámbar"
            label="02 · En la Zona"
            title="Luz Ámbar"
            tag="Acústica Tratada"
            delay={120}
            className="col-span-12 row-span-2 md:col-span-5 md:row-span-3"
            imgClass="object-[50%_30%]"
          >
            <div className="pointer-events-none absolute -right-10 top-1/3 h-48 w-48 rounded-full bg-[#F59E0B] opacity-25 mix-blend-screen blur-[60px] [animation:jv-glow_4s_ease-in-out_infinite]" />
          </PhotoCard>
          {/* REEMPLAZAR CON FOTO ESTUDIO 3 → IMAGES.atmosphere */}
          <PhotoCard
            src={IMAGES.atmosphere}
            alt="Estudio con luces LED azules y moradas y humo"
            label="03 · La Atmósfera"
            title="Vibra Nocturna"
            tag="Grabación Analógica / Digital"
            delay={200}
            className="col-span-12 row-span-2 sm:col-span-5 md:col-span-3"
            imgClass="object-[50%_45%]"
          />
          {/* REEMPLAZAR CON FOTO ESTUDIO 4 → IMAGES.identity */}
          <PhotoCard
            src={IMAGES.identity}
            alt="Sombra con cuernos frente a artista encapuchado con máscara blanca"
            label="04 · La Identidad"
            title="Dualidad"
            delay={280}
            className="col-span-12 row-span-2 sm:col-span-7 md:col-span-4"
            imgClass="grayscale contrast-125 object-[50%_74%]"
          />
          {/* Ficha técnica */}
          <Reveal delay={340} className="col-span-12 row-span-1 flex flex-col justify-between border border-white/10 bg-zinc-900/40 p-5 md:col-span-5">
            <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              <span>Ficha técnica</span>
              <Headphones className="h-4 w-4 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <dl className="grid grid-cols-3 gap-4">
              {[
                ["24/96", "kHz / bit"],
                ["−∞", "ruido de fondo"],
                ["24/7", "sesiones"],
              ].map(([v, k]) => (
                <div key={k}>
                  <dt className="jv-chrome font-['Anton'] text-3xl md:text-4xl">{v}</dt>
                  <dd className="mt-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.15em] text-zinc-500">{k}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   D. SERVICIOS — 360° MUSIC FACTORY
   ═══════════════════════════════════════════════════════════════ */

function ServiceCard({ s, i }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  const Icon = s.icon;
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="group relative isolate flex min-h-[250px] flex-col overflow-hidden bg-[#08080a] p-7 transition-colors duration-500 hover:bg-[#0d0d10] md:p-9"
    >
      {/* Spotlight que sigue al cursor */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(380px_circle_at_var(--x,50%)_var(--y,50%),rgba(212,175,55,.12),rgba(226,232,240,.05)_40%,transparent_70%)]" />
      {/* Borde que brilla */}
      <div className="pointer-events-none absolute inset-0 opacity-0 ring-1 ring-inset ring-[#D4AF37]/40 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="jv-line-gold absolute inset-x-0 top-0 h-px origin-center scale-x-0 transition-transform duration-700 group-hover:scale-x-100" />

      <div className="flex items-start justify-between">
        <span className="grid h-14 w-14 place-items-center border border-white/10 bg-white/[0.02] transition-all duration-500 group-hover:border-[#D4AF37]/50 group-hover:shadow-[0_0_30px_rgba(212,175,55,.2)]">
          <Icon className="h-6 w-6 text-zinc-200 transition-colors duration-500 group-hover:text-[#D4AF37]" strokeWidth={1.4} />
        </span>
        <span className="jv-outline font-['Anton'] text-5xl leading-none transition-all duration-500 group-hover:[-webkit-text-stroke:1px_rgba(212,175,55,.6)]">
          {String(i + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-8 font-['Cinzel'] text-[15px] font-semibold uppercase leading-snug tracking-[0.16em] text-zinc-100">
        {s.title}
      </h3>
      <p className="mt-3 font-['Space_Grotesk'] text-sm leading-relaxed text-zinc-500 transition-colors duration-500 group-hover:text-zinc-300">
        {s.desc}
      </p>
      <a
        href={LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-2 pt-6 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.25em] text-zinc-600 transition-colors group-hover:text-[#D4AF37]"
      >
        Pedir info <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
}

function Services() {
  return (
    <section id="servicios" className="relative bg-[#0c0c0e] py-24 md:py-36">
      <div className="absolute inset-x-0 top-0 h-px jv-line" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionHeading index="02" eyebrow="Servicios" title={<>360° Music<br />Factory</>} script="Todo bajo un mismo techo" />
          </div>
          <Reveal className="mb-14 md:col-span-4 md:mb-20">
            <p className="font-['Space_Grotesk'] text-base leading-relaxed text-zinc-400">
              Nueve servicios, un solo equipo. Del primer beat a la portada, el videoclip y la subida a
              plataformas sin cambiar de estudio.
            </p>
          </Reveal>
        </div>

        <Reveal>
          {/* gap-px sobre fondo claro = líneas divisorias finas como en el cartel oficial */}
          <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.title} s={s} i={i} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   C. REPRODUCTOR STUDIO VIBE & BEATS (pantalla tipo DAW)
   ═══════════════════════════════════════════════════════════════ */

function VUMeter({ level, label }) {
  const segs = 16;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex h-40 w-3 flex-col-reverse gap-[3px]">
        {Array.from({ length: segs }).map((_, i) => {
          const on = i / segs < level;
          const color = i >= segs - 2 ? "bg-red-500" : i >= segs - 5 ? "bg-yellow-400" : "bg-emerald-400";
          return (
            <span
              key={i}
              className={`flex-1 transition-opacity duration-75 ${color} ${on ? "opacity-100 shadow-[0_0_6px_currentColor]" : "opacity-[0.12]"}`}
            />
          );
        })}
      </div>
      <span className="font-['JetBrains_Mono'] text-[9px] text-zinc-500">{label}</span>
    </div>
  );
}

function Clip({ left, width, tone, seed }) {
  const pink = tone === "pink";
  const bars = Math.max(6, Math.round(width * 1.2));
  return (
    <div
      className={`absolute inset-y-1 overflow-hidden rounded-[2px] border ${
        pink ? "border-pink-400/60 bg-pink-500/25" : "border-blue-400/60 bg-blue-500/25"
      }`}
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      <div className={`h-[3px] w-full ${pink ? "bg-pink-400/80" : "bg-blue-400/80"}`} />
      <div className="flex h-[calc(100%-3px)] items-center gap-[1px] px-[2px]">
        {Array.from({ length: bars }).map((_, i) => {
          const h = 20 + Math.abs(Math.sin((i + seed) * 1.7) * Math.cos((i + seed) * 0.6)) * 75;
          return <span key={i} className={`flex-1 ${pink ? "bg-pink-300/70" : "bg-blue-300/70"}`} style={{ height: `${h}%` }} />;
        })}
      </div>
    </div>
  );
}

function EqBars({ playing, count = 48, className = "" }) {
  return (
    <div className={`jv-eq flex items-end gap-[3px] ${playing ? "" : "is-paused"} ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="h-full flex-1 bg-gradient-to-t from-[#D4AF37] via-zinc-200 to-white"
          style={{
            animationDuration: `${0.55 + ((i * 37) % 10) / 14}s`,
            animationDelay: `-${(i * 0.09).toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  );
}

function StudioPlayer() {
  const [genre, setGenre] = useState("Todos");
  const [activeId, setActiveId] = useState(BEATS[0].id);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [levels, setLevels] = useState([0.05, 0.05]);
  const audioRef = useRef(null);

  const list = genre === "Todos" ? BEATS : BEATS.filter((b) => b.genre === genre);
  const active = BEATS.find((b) => b.id === activeId);

  const go = (dir) => {
    const idx = list.findIndex((b) => b.id === activeId);
    const next = idx === -1 ? list[0] : list[(idx + dir + list.length) % list.length];
    setActiveId(next.id);
    setPos(0);
    setPlaying(true);
  };

  const select = (id) => {
    if (id === activeId) return setPlaying((p) => !p);
    setActiveId(id);
    setPos(0);
    setPlaying(true);
  };

  // Reloj simulado + vúmetros
  useEffect(() => {
    if (!playing) {
      setLevels([0.05, 0.05]);
      return;
    }
    const t = setInterval(() => {
      setLevels([0.5 + Math.random() * 0.5, 0.45 + Math.random() * 0.55]);
      if (!active.src) setPos((p) => Math.min(p + 0.12, active.dur));
    }, 120);
    return () => clearInterval(t);
  }, [playing, active]);

  useEffect(() => {
    if (!active.src && pos >= active.dur) go(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos]);

  // Audio real (si el beat tiene `src`)
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !active.src) return;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [playing, activeId]);

  const progress = (pos / active.dur) * 100;

  return (
    <section id="beats" className="relative overflow-hidden bg-[#050505] py-24 md:py-36">
      <Glows />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading index="03" eyebrow="Vibe / Beats" title={<>Studio Vibe<br />&amp; Beats</>} script="Escucha lo que se cocina" />

        {active.src && (
          <audio
            ref={audioRef}
            src={active.src}
            onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)}
            onEnded={() => go(1)}
          />
        )}

        <Reveal>
          <div className="overflow-hidden border border-white/10 bg-[#0c0c0e] shadow-[0_40px_120px_-20px_rgba(0,0,0,.9)]">
            {/* Barra de transporte */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-white/10 bg-[#111114] px-4 py-3 md:px-6">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                JV_SESSION_{String(active.id).padStart(2, "0")}.ptx
              </span>
              <div className="ml-auto flex items-center gap-4 font-['JetBrains_Mono'] text-xs">
                <span className="border border-white/10 bg-black px-3 py-1 tabular-nums text-emerald-400">
                  {fmt(pos)}.{String(Math.floor((pos % 1) * 30)).padStart(2, "0")}
                </span>
                <span className="text-zinc-400">
                  <span className="text-zinc-600">BPM</span> {active.bpm}
                </span>
                <span className="hidden text-zinc-400 sm:inline">
                  <span className="text-zinc-600">KEY</span> {active.key}
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-12">
              {/* Lista de beats */}
              <div className="border-b border-white/10 lg:col-span-5 lg:border-b-0 lg:border-r">
                <div className="flex gap-1 overflow-x-auto border-b border-white/10 p-3" role="tablist" aria-label="Filtrar por género">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      role="tab"
                      aria-selected={genre === g}
                      onClick={() => setGenre(g)}
                      className={`shrink-0 px-3.5 py-2 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.15em] transition-colors ${
                        genre === g
                          ? "bg-zinc-100 text-black"
                          : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <ul className="divide-y divide-white/5">
                  {list.map((b, i) => {
                    const isActive = b.id === activeId;
                    return (
                      <li key={b.id}>
                        <button
                          onClick={() => select(b.id)}
                          className={`group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors md:px-5 ${
                            isActive ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
                          }`}
                        >
                          <span
                            className={`grid h-10 w-10 shrink-0 place-items-center border transition-colors ${
                              isActive ? "border-[#D4AF37] text-[#D4AF37]" : "border-white/15 text-zinc-400 group-hover:border-white/40"
                            }`}
                          >
                            {isActive && playing ? (
                              <Pause className="h-4 w-4" fill="currentColor" />
                            ) : (
                              <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={`block truncate font-['Space_Grotesk'] text-[15px] font-medium ${isActive ? "text-white" : "text-zinc-300"}`}>
                              {b.title}
                            </span>
                            <span className="mt-0.5 flex gap-3 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                              <span className={b.genre === "R&B" || b.genre === "Reggaeton" ? "text-pink-400/80" : "text-blue-400/80"}>{b.genre}</span>
                              <span>{b.bpm} BPM</span>
                              <span>{b.key}</span>
                            </span>
                          </span>
                          {isActive && playing ? (
                            <EqBars playing count={4} className="h-4 w-5" />
                          ) : (
                            <span className="font-['JetBrains_Mono'] text-[11px] text-zinc-600">{fmt(b.dur)}</span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Pantalla DAW */}
              <div className="lg:col-span-7">
                <div className="flex">
                  <div className="min-w-0 flex-1">
                    {/* Regla de compases */}
                    <div className="flex h-6 border-b border-white/10 bg-[#0a0a0c] pl-24 font-['JetBrains_Mono'] text-[9px] text-zinc-600">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <span key={i} className="flex-1 border-l border-white/10 pl-1 leading-6">
                          {i * 4 + 1}
                        </span>
                      ))}
                    </div>
                    {/* Pistas */}
                    <div className="relative">
                      {TRACKS.map((t, ti) => (
                        <div key={t.name} className="flex h-12 border-b border-white/5">
                          <div className="flex w-24 shrink-0 items-center gap-2 border-r border-white/10 bg-[#0f0f12] px-2">
                            <span className={`h-6 w-1 ${t.tone === "pink" ? "bg-pink-400" : "bg-blue-400"}`} />
                            <span className="truncate font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-zinc-400">{t.name}</span>
                          </div>
                          <div className="relative flex-1 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_calc(12.5%-1px),rgba(255,255,255,.04)_calc(12.5%-1px),rgba(255,255,255,.04)_12.5%)]">
                            {t.clips.map(([l, w], ci) => (
                              <Clip key={ci} left={l} width={w} tone={t.tone} seed={ti * 7 + ci * 3 + active.id} />
                            ))}
                          </div>
                        </div>
                      ))}
                      {/* Cabezal de reproducción */}
                      <div className="pointer-events-none absolute inset-y-0 left-24 right-0">
                        <div className="absolute inset-y-0 w-px bg-white shadow-[0_0_10px_#fff]" style={{ left: `${progress}%` }}>
                          <span className="absolute -left-[5px] -top-1 h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Vúmetros master */}
                  <div className="hidden items-end gap-2 border-l border-white/10 bg-[#0a0a0c] px-4 py-4 sm:flex">
                    <VUMeter level={levels[0]} label="L" />
                    <VUMeter level={levels[1]} label="R" />
                  </div>
                </div>

                {/* Now playing + visualizador */}
                <div className="border-t border-white/10 p-5 md:p-6">
                  <div className="flex items-center gap-5">
                    <div
                      className={`jv-vinyl relative hidden h-16 w-16 shrink-0 rounded-full sm:block ${playing ? "[animation:jv-spin_3s_linear_infinite]" : ""}`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                        {playing ? "Sonando ahora" : "En pausa"} · {active.genre}
                      </p>
                      <p className="jv-chrome truncate font-['Anton'] text-3xl uppercase tracking-wide md:text-4xl">{active.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => go(-1)} className="grid h-10 w-10 place-items-center text-zinc-400 transition-colors hover:text-white" aria-label="Anterior">
                        <SkipBack className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setPlaying((p) => !p)}
                        className="grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(180deg,#fff,#cbd5e1)] text-black shadow-[0_0_30px_rgba(255,255,255,.25)] transition-transform hover:scale-105"
                        aria-label={playing ? "Pausar" : "Reproducir"}
                      >
                        {playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5 translate-x-[2px]" fill="currentColor" />}
                      </button>
                      <button onClick={() => go(1)} className="grid h-10 w-10 place-items-center text-zinc-400 transition-colors hover:text-white" aria-label="Siguiente">
                        <SkipForward className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <EqBars playing={playing} className="mt-6 h-20" />

                  {/* Barra de progreso navegable */}
                  <div className="mt-4 flex items-center gap-3 font-['JetBrains_Mono'] text-[10px] text-zinc-500">
                    <span className="w-9 tabular-nums">{fmt(pos)}</span>
                    <div
                      className="group relative h-1.5 flex-1 cursor-pointer bg-white/10"
                      onClick={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        const t = ((e.clientX - r.left) / r.width) * active.dur;
                        setPos(t);
                        if (audioRef.current && active.src) audioRef.current.currentTime = t;
                      }}
                    >
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4AF37] to-white" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="w-9 text-right tabular-nums">{fmt(active.dur)}</span>
                    <Volume2 className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   F. FLUJO DE TRABAJO — DEL CONCEPTO AL HIT
   ═══════════════════════════════════════════════════════════════ */

function Process() {
  return (
    <section id="proceso" className="relative overflow-hidden bg-[#0c0c0e] py-24 md:py-36">
      <div className="absolute inset-x-0 top-0 h-px jv-line" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading index="04" eyebrow="Proceso" title={<>Del Concepto<br />al Hit</>} />

        <div className="relative">
          {/* Línea cromada horizontal (desktop) / vertical (móvil) */}
          <div className="jv-line absolute left-0 right-0 top-7 hidden h-px md:block" />
          <div className="absolute bottom-0 left-7 top-0 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent md:hidden" />

          <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal as="li" key={s.title} delay={i * 140} className="group relative pl-20 md:pl-0">
                  <span className="absolute left-0 top-0 grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-[#050505] transition-all duration-500 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_30px_rgba(212,175,55,.35)] md:relative">
                    <Icon className="h-5 w-5 text-zinc-200 transition-colors group-hover:text-[#D4AF37]" strokeWidth={1.5} />
                  </span>
                  <span className="jv-outline mt-0 block font-['Anton'] text-7xl leading-none md:mt-8 md:text-8xl">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-['Cinzel'] text-base font-semibold uppercase tracking-[0.14em] text-zinc-100">{s.title}</h3>
                  <p className="mt-3 font-['Space_Grotesk'] text-sm leading-relaxed text-zinc-500">{s.desc}</p>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   G. CONTACTO + FOOTER
   ═══════════════════════════════════════════════════════════════ */

function Contact() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-[#050505] pb-10 pt-28 md:pt-40">
      <Glows />
      {/* Cadenas metálicas en los bordes */}
      <Chain id="l" links={16} className="pointer-events-none absolute -top-6 left-3 hidden h-[640px] w-6 rotate-[8deg] opacity-30 md:block" />
      <Chain id="r" links={16} className="pointer-events-none absolute -top-10 right-4 hidden h-[700px] w-6 -rotate-[10deg] opacity-30 md:block" />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-['Mrs_Saint_Delafield'] text-5xl text-[#D4AF37] md:text-6xl">Tu próximo tema empieza aquí</p>
          <h2 className="jv-chrome-anim mx-auto mt-2 max-w-5xl font-['Anton'] text-6xl uppercase leading-[0.9] sm:text-7xl md:text-8xl lg:text-[9rem]">
            ¿Listo para sonar profesional?
          </h2>
        </Reveal>

        <Reveal delay={150} className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2">
          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between gap-6 overflow-hidden border border-white/10 bg-zinc-900/40 p-6 text-left transition-all duration-500 hover:border-[#25D366]/60 hover:bg-[#25D366]/[0.06] md:p-8"
          >
            <span className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#25D366] opacity-0 blur-[90px] transition-opacity duration-700 group-hover:opacity-25" />
            <span className="relative flex items-center gap-5">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-black transition-colors group-hover:border-[#25D366]">
                <WhatsAppIcon className="h-8 w-8 text-[#25D366]" />
              </span>
              <span>
                <span className="block font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-zinc-500">WhatsApp directo</span>
                <span className="mt-1 block font-['Anton'] text-3xl uppercase tracking-wider text-white md:text-4xl">Contáctanos</span>
              </span>
            </span>
            <ArrowRight className="relative h-6 w-6 shrink-0 text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-[#25D366]" />
          </a>

          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between gap-6 overflow-hidden border border-white/10 bg-zinc-900/40 p-6 text-left transition-all duration-500 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/[0.05] md:p-8"
          >
            <span className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#6D28D9] opacity-0 blur-[90px] transition-opacity duration-700 group-hover:opacity-40" />
            <span className="relative flex items-center gap-5">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-black transition-colors group-hover:border-[#D4AF37]">
                <InstagramIcon className="h-7 w-7 text-zinc-100 transition-colors group-hover:text-[#D4AF37]" />
              </span>
              <span>
                <span className="block font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-zinc-500">Instagram oficial</span>
                <span className="mt-1 block font-['Anton'] text-3xl uppercase tracking-wider text-white md:text-4xl">{LINKS.instagramHandle}</span>
              </span>
            </span>
            <ArrowRight className="relative h-6 w-6 shrink-0 text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-[#D4AF37]" />
          </a>
        </Reveal>

        {/* Footer */}
        <footer className="mt-28 border-t border-white/10 pt-14">
          <div className="flex flex-col items-center gap-8">
            <JVEmblem size="sm" />
            <div className="flex w-full max-w-xl items-center gap-4">
              <span className="jv-line h-px flex-1" />
              <span className="font-['Cinzel'] text-[11px] tracking-[0.35em] text-zinc-400">DESDE LA IDEA HASTA EL LANZAMIENTO</span>
              <span className="jv-line h-px flex-1" />
            </div>
            <ParentalAdvisory />
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-zinc-600 sm:flex-row">
            <span>© {new Date().getFullYear()} JV Productions · Todos los derechos reservados</span>
            <span className="flex gap-6">
              {NAV.slice(0, 3).map((l) => (
                <a key={l.href} href={l.href} className="transition-colors hover:text-zinc-300">
                  {l.label}
                </a>
              ))}
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════ */

export default function JVProductions() {
  return (
    <div className="jv-grain relative min-h-screen overflow-x-hidden bg-[#050505] font-['Space_Grotesk'] text-zinc-200 antialiased">
      <GlobalStyles />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Bunker />
        <Services />
        <StudioPlayer />
        <Process />
        <Contact />
      </main>
    </div>
  );
}
