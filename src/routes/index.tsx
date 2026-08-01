import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import {
  MapPin,
  Calendar as CalendarIcon,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Sparkles,
  Clock,
} from "lucide-react";
import ganesha from "@/assets/ganesha.png";
import venueImg from "@/assets/venue.jpg";
import mandala from "@/assets/mandala.png";

export const Route = createFileRoute("/")({
  component: Invitation,
  head: () => ({
    meta: [
      { title: "Aketi's Wedding Invitation" },
      { name: "description", content: "Join us on August 27th, 2026 at Deepika Convention, Peravali, AP as Naresh Kumar & Gayatri Devi begin their journey together." },
      { property: "og:title", content: "Aketi's Wedding Invitation" },
      { property: "og:description", content: "Join us on August 27th, 2026 at Deepika Convention, Peravali, AP as Naresh Kumar & Gayatri Devi begin their journey together." },
    ],
  }),
});

const WEDDING_DATE = new Date("2026-08-27T23:40:00+05:30");
const VENUE = {
  name: "Deepika Convention",
  address: "Peravali, Andhra Pradesh, India",
  mapsQuery: "Deepika Convention Peravali Andhra Pradesh",
};
const BRIDE = "Gayatri Devi";
const GROOM = "Naresh Kumar";
const MUSIC_SRC = "/bgm.mp3";


/* ---------------- Ambient decor ---------------- */

function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 14,
        size: 10 + Math.random() * 16,
        hue: i % 3,
      })),
    []
  );
  const colors = ["#E8B4A0", "#D4AF37", "#8B1E3F"];
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {petals.map((p, i) => (
        <svg
          key={i}
          className="petal absolute"
          style={{
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            filter: "drop-shadow(0 2px 4px rgba(139,30,63,0.15))",
          }}
          viewBox="0 0 24 24"
          fill={colors[p.hue]}
          opacity={0.7}
        >
          <path d="M12 2 C 16 8, 16 14, 12 22 C 8 14, 8 8, 12 2 Z" />
        </svg>
      ))}
    </div>
  );
}

function Sparkles3() {
  const dots = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        size: 2 + Math.random() * 3,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="sparkle absolute rounded-full"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            background: "radial-gradient(circle, #F4D06F, transparent 70%)",
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function MandalaBg({ className = "" }: { className?: string }) {
  return (
    <img
      src={mandala}
      alt=""
      aria-hidden
      className={`pointer-events-none select-none opacity-[0.07] ${className}`}
    />
  );
}

function TitleFlourish({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 300 60"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* long tapering lead-in line */}
      <path
        d="M0 30 C 60 30, 90 22, 130 28 C 155 32, 165 30, 178 30"
        stroke="#D4AF37"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* inward curling spiral, like the loop trailing off the letterforms in the reference */}
      <path
        d="M178 30
           C 196 30, 204 18, 196 10
           C 190 4, 180 6, 179 14
           C 178 20, 185 24, 191 20"
        stroke="#D4AF37"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* small companion tendril */}
      <path
        d="M150 28 C 156 20, 166 18, 172 24"
        stroke="#D4AF37"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="0" cy="30" r="1.6" fill="#D4AF37" />
    </svg>
  );
}

function CornerAccent({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="10" y1="110" x2="110" y2="10" stroke="#D4AF37" strokeWidth="1" opacity="0.55" />
    </svg>
  );
}

/* ---------------- Music player ---------------- */

function MusicPlayer({ playing, setPlaying, audioRef }: {
  playing: boolean;
  setPlaying: (v: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = muted ? 0 : volume;
  }, [volume, muted, audioRef]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress((a.currentTime / (a.duration || 1)) * 100);
    a.addEventListener("timeupdate", onTime);
    return () => a.removeEventListener("timeupdate", onTime);
  }, [audioRef]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-full px-3 py-2 sm:bottom-6 sm:right-6"
    >
      <button
        onClick={() => setPlaying(!playing)}
        aria-label={playing ? "Pause music" : "Play music"}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6914] text-ivory shadow-lg transition-transform hover:scale-110"
      >
        {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>
      <div className="hidden items-center gap-2 sm:flex">
        <div className="h-1 w-24 overflow-hidden rounded-full bg-champagne">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F4D06F] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={() => setMuted(!muted)}
          aria-label={muted ? "Unmute" : "Mute"}
          className="text-brown hover:text-maroon"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
          className="w-16 accent-[#D4AF37]"
          aria-label="Volume"
        />
      </div>
    </motion.div>
  );
}

/* ---------------- Opening screen ---------------- */

function Opening({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.section
      key="opening"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at center, #FFFDF8 0%, #F7F1E8 60%, #E8DCC3 100%)",
      }}
    >
      <MandalaBg className="absolute -left-40 -top-40 h-[600px] w-[600px] float-slow" />
      <MandalaBg className="absolute -bottom-40 -right-40 h-[600px] w-[600px] float-slow" />
      <Sparkles3 />
      <CornerAccent className="pointer-events-none absolute -right-4 top-6 h-24 w-24 sm:h-32 sm:w-32" />
      <CornerAccent className="pointer-events-none absolute -left-4 bottom-6 h-24 w-24 sm:h-32 sm:w-32" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-6 w-52 sm:w-64"
        >
          <img src={ganesha} alt="Lord Ganesha" className="pulse-glow rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mb-2 font-[var(--font-quote)] text-xl italic text-maroon sm:text-2xl"
        >
          || శ్రీ గణేశాయ నమః ||
        </motion.div>

        <motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 1.3, duration: 0.8 }}
  className="mb-10"
>
  <div className="flex items-center justify-center gap-3">
    <TitleFlourish className="h-10 w-28 sm:h-12 sm:w-32" />
    <TitleFlourish className="h-10 w-28 sm:h-12 sm:w-32" flip />
  </div>

  <div
  className={`${cinzel.className} mt-6 text-4xl sm:text-5xl shimmer-text tracking-[0.18em] font-semibold`}
>
  AKETI'S
  <br />
  WEDDING INVITATION
</div>

  <div className="mt-4 flex items-center justify-center gap-3">
    <TitleFlourish className="h-10 w-28 sm:h-12 sm:w-32" flip />
    <TitleFlourish className="h-10 w-28 sm:h-12 sm:w-32" />
  </div>
</motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          onClick={onOpen}
          className="group relative overflow-hidden rounded-full border-2 border-[#D4AF37] bg-gradient-to-br from-[#F4D06F] via-[#D4AF37] to-[#8B6914] px-10 py-4 font-[var(--font-display)] text-sm font-semibold uppercase tracking-[0.25em] text-ivory shadow-[0_10px_40px_-10px_rgba(212,175,55,0.7)] transition-transform hover:scale-105 pulse-glow"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles size={16} /> Open Invitation
          </span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </motion.button>
      </div>
    </motion.section>
  );
}

/* ---------------- Hero ---------------- */

function Hero({ guestName }: { guestName: string | null }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20">
      <MandalaBg className="absolute -left-20 top-10 h-96 w-96 float-slow" />
      <MandalaBg className="absolute -right-20 bottom-10 h-96 w-96 float-slow" />
      <Sparkles3 />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        {guestName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 font-[var(--font-quote)] text-lg italic text-maroon sm:text-xl"
          >
            Welcome, {guestName} Garu
          </motion.div>
        )}

        <div className="mb-4 font-[var(--font-display)] text-xs uppercase tracking-[0.5em] text-gold">
          —Aketi's Wedding Invitation —
        </div>

        <div className="mx-auto my-6 flex max-w-3xl items-center justify-center gap-4 sm:gap-8">
          <div className="h-px flex-1 divider-gold" />
          <Sparkles className="text-gold" size={20} />
          <div className="h-px flex-1 divider-gold" />
        </div>

        <motion.h1
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.3, duration: 1.4 }}
          className="font-[var(--font-script)] leading-[0.9]"
        >
          <span className="block text-5xl shimmer-text sm:text-7xl md:text-8xl">
            {GROOM}
          </span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
            className="my-4 inline-block text-3xl text-maroon sm:text-4xl"
          >
            <Heart className="inline" size={28} fill="currentColor" />
          </motion.span>
          <span className="block text-5xl shimmer-text sm:text-7xl md:text-8xl">
            {BRIDE}
          </span>
        </motion.h1>

        <div className="mx-auto my-8 flex max-w-3xl items-center justify-center gap-4 sm:gap-8">
          <div className="h-px flex-1 divider-gold" />
          <Sparkles className="text-gold" size={20} />
          <div className="h-px flex-1 divider-gold" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="font-[var(--font-quote)] text-base italic text-brown/70 sm:text-lg"
        >
          Together with our families
        </motion.div>

{/* Parents Section */}

<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="mt-8 mb-12"
>
  <div className="mx-auto max-w-5xl">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

      {/* Groom */}
      <div className="text-center">

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-10 divider-gold" />

          <span className="font-[var(--font-display)] text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]">
            Groom's Parents
          </span>

          <div className="h-px w-10 divider-gold" />
        </div>

        <h3
          className="text-[1.55rem] md:text-[1.75rem] font-medium text-[#A67C00] leading-[1.75] tracking-wide"
  style={{
    fontFamily: "'Mandali', sans-serif",
    textShadow: "0 1px 3px rgba(212,175,55,0.25)",
          }}
        >
          ఆకేటి సాయిబాబా
        </h3>

        <p
          className="mt-2 text-[1.25rem] md:text-[1.35rem] text-[#5C4033] leading-[1.5]"
          style={{
            fontFamily: "'Noto Serif Telugu', serif",
          }}
        >
          దివ్యశ్రీ నాగ దుర్గ
        </p>

      </div>

      {/* Bride */}
      <div className="text-center">

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-10 divider-gold" />

          <span className="font-[var(--font-display)] text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]">
            Bride's Parents
          </span>

          <div className="h-px w-10 divider-gold" />
        </div>

        <h3
          className="text-[1.55rem] md:text-[1.75rem] font-medium text-[#A67C00] leading-[1.75] tracking-wide"
  style={{
    fontFamily: "'Mandali', sans-serif",
    textShadow: "0 1px 3px rgba(212,175,55,0.25)",
          }}
        >
          కొవ్వూరి సురేష్
        </h3>

        <p
          className="mt-2 text-[1.25rem] md:text-[1.35rem] text-[#5C4033] leading-[1.5]"
          style={{
            fontFamily: "'Noto Serif Telugu', serif",
          }}
        >
          నాగ కనకదుర్గ
        </p>

      </div>

    </div>

  </div>
</motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-[-6rem] left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold/70">
            Scroll
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="h-8 w-px bg-gradient-to-b from-gold to-transparent"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------------- Invitation message ---------------- */

function InviteMessage() {
  return (
    <SectionWrap id="invite">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="glass-card mx-auto max-w-3xl rounded-3xl px-8 py-14 text-center sm:px-14"
      >
        <div className="mx-auto mb-6 flex items-center justify-center gap-4">
          <div className="h-px w-16 divider-gold" />
          <span className="font-[var(--font-display)] text-xs uppercase tracking-[0.4em] text-gold">
            Invitation
          </span>
          <div className="h-px w-16 divider-gold" />
        </div>
        <p className="font-[var(--font-quote)] text-2xl italic leading-relaxed text-brown sm:text-3xl">
          “With immense joy and the blessings of our families, we cordially invite
          you and your family to grace the auspicious wedding ceremony and bless
          the newlyweds with your presence.”
        </p>
        <div className="mt-8 font-[var(--font-script)] text-3xl shimmer-text">
          — Naresh &amp; Gayatri
        </div>
      </motion.div>
    </SectionWrap>
  );
}

/* ---------------- Countdown ---------------- */

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE);
  const items = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  const dateCards = [
    { label: "Day", value: "27" },
    { label: "Month", value: "AUGUST" },
    { label: "Year", value: "2026" },
  ];

  return (
    <SectionWrap id="countdown">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="mb-12 text-center"
      >
        <h2 className="font-[var(--font-script)] text-6xl shimmer-text sm:text-7xl">
          Save The Date
        </h2>
        <div className="mx-auto mt-3 h-px w-40 divider-gold" />
      </motion.div>

      {/* Day / Month / Year tag cards */}
      <div className="mx-auto mb-14 grid max-w-3xl grid-cols-3 gap-3 sm:gap-6">
        {dateCards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: -40, rotate: -6 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15, type: "spring", stiffness: 120 }}
            whileHover={{ y: -6, rotate: [0, -1.5, 1.5, 0] }}
            className="relative"
          >
            {/* hanging string */}
            <div className="mx-auto h-6 w-px bg-gradient-to-b from-transparent to-gold" />
            <div className="relative overflow-hidden rounded-3xl border border-[#E8C971]/60 bg-gradient-to-b from-[#F8E9B8] via-[#F4D06F] to-[#D4AF37] p-4 pt-8 text-center shadow-[0_15px_40px_-15px_rgba(139,105,20,0.5)] sm:p-6 sm:pt-10">
              <div className="absolute inset-2 rounded-2xl border border-dashed border-[#8B6914]/40" />
              <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-ivory px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-brown sm:text-xs">
                {c.label}
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
                className="relative z-10 font-[var(--font-display)] text-2xl font-semibold text-[#4A3A2A] sm:text-4xl"
              >
                {c.value}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Counting Down card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="glass-card mx-auto max-w-4xl rounded-3xl p-6 sm:p-10"
      >
        <div className="text-center">
          <h3 className="font-[var(--font-display)] text-2xl text-maroon sm:text-3xl">
            Counting Down
          </h3>
          <p className="mt-2 font-[var(--font-quote)] italic text-brown/80">
            Thursday, 27 August 2026 at 11:40 PM
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl bg-ivory/80 p-4 text-center shadow-inner ring-1 ring-[#D4AF37]/30 sm:p-6"
            >
              <motion.div
                key={it.value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="font-[var(--font-display)] text-3xl font-semibold text-[#8B6914] sm:text-5xl"
              >
                {String(it.value).padStart(2, "0")}
              </motion.div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-brown/70 sm:text-xs">
                {it.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrap>
  );
}

/* ---------------- Event Timeline ---------------- */

function EventTimeline() {
  const events = [
    { title: "Reception", time: "6:00 PM", side: "left" as const },
    { title: "Dinner", time: "7:00 PM Onwards", side: "right" as const },
    { title: "Muhurtham", time: "11:40 PM", side: "left" as const },
  ];
  return (
    <SectionWrap id="timeline">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-14 text-center"
      >
        <h2 className="font-[var(--font-script)] text-6xl shimmer-text sm:text-7xl">
          Event Timeline
        </h2>
        <div className="mx-auto mt-4 h-px w-40 divider-gold" />
      </motion.div>

      <div className="relative mx-auto max-w-3xl">
        {/* vertical gold line */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ transformOrigin: "top" }}
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-gold via-gold to-transparent"
        />

        <div className="space-y-10 sm:space-y-16">
          {events.map((ev, i) => (
            <div key={ev.title} className="relative grid grid-cols-2 items-center gap-4">
              {/* flower node */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.2, type: "spring", stiffness: 150 }}
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative h-6 w-6">
                  <span className="absolute inset-0 rounded-full bg-rose shadow-[0_0_20px_rgba(232,180,160,0.8)]" />
                  <span className="absolute inset-1 rounded-full bg-gradient-to-br from-[#E8B4A0] to-maroon" />
                </div>
              </motion.div>

              {ev.side === "left" ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.15 }}
                    className="glass-card rounded-2xl p-5 text-center sm:p-8"
                  >
                    <div className="flex items-center justify-center gap-2 font-[var(--font-display)] text-xl font-semibold text-maroon sm:text-2xl">
                      <Sparkles size={16} className="text-gold" />
                      {ev.title}
                    </div>
                    <div className="mt-2 font-[var(--font-quote)] text-lg text-brown sm:text-xl">
                      {ev.time}
                    </div>
                  </motion.div>
                  <div />
                </>
              ) : (
                <>
                  <div />
                  <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.15 }}
                    className="glass-card rounded-2xl p-5 text-center sm:p-8"
                  >
                    <div className="flex items-center justify-center gap-2 font-[var(--font-display)] text-xl font-semibold text-maroon sm:text-2xl">
                      <Sparkles size={16} className="text-gold" />
                      {ev.title}
                    </div>
                    <div className="mt-2 font-[var(--font-quote)] text-lg text-brown sm:text-xl">
                      {ev.time}
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

/* ---------------- Venue ---------------- */

function Venue() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE.mapsQuery)}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(VENUE.mapsQuery)}&output=embed`;
  return (
    <SectionWrap id="venue">
      <SectionHeader eyebrow="The Celebration" title="Wedding Venue" />
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card overflow-hidden rounded-3xl"
        >
          <img
            src={venueImg}
            alt={VENUE.name}
            loading="lazy"
            className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-96"
          />
          <div className="p-6 sm:p-8">
            <div className="font-[var(--font-display)] text-2xl text-maroon sm:text-3xl">
              {VENUE.name}
            </div>
            <div className="mt-2 flex items-start gap-2 font-[var(--font-quote)] text-lg italic text-brown/80">
              <MapPin size={18} className="mt-1 flex-none text-gold" />
              {VENUE.address}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-brown/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-champagne px-4 py-2">
                <CalendarIcon size={14} className="text-gold" /> Aug 27, 2026
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-champagne px-4 py-2">
                <Clock size={14} className="text-gold" /> Muhurtham 11:40 PM
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-champagne px-4 py-2">
                <Sparkles size={14} className="text-gold" /> Dinner 7:00 PM
              </span>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-gold bg-gradient-to-br from-[#F4D06F] via-[#D4AF37] to-[#8B6914] px-6 py-3 font-[var(--font-display)] text-sm uppercase tracking-[0.2em] text-ivory shadow-lg transition-transform hover:scale-105"
            >
              <MapPin size={16} /> Get Directions
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card overflow-hidden rounded-3xl p-2"
        >
          <iframe
            title="Venue map"
            src={embedUrl}
            className="h-full min-h-[400px] w-full rounded-2xl"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </SectionWrap>
  );
}

/* ---------------- Add to Calendar ---------------- */

function pad(n: number) { return String(n).padStart(2, "0"); }
function toICSDate(d: Date) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function AddToCalendar() {
  const start = WEDDING_DATE;
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const title = `Wedding of ${GROOM} & ${BRIDE}`;
  const details = `Join us at ${VENUE.name}, ${VENUE.address}`;

  const gcal = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${toICSDate(start)}/${toICSDate(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(VENUE.address)}`;
  const outlook = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(VENUE.address)}`;
  const ics = `data:text/calendar;charset=utf-8,${encodeURIComponent(
    ["BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT",
      `DTSTART:${toICSDate(start)}`,`DTEND:${toICSDate(end)}`,
      `SUMMARY:${title}`,`DESCRIPTION:${details}`,`LOCATION:${VENUE.address}`,
      "END:VEVENT","END:VCALENDAR"].join("\n")
  )}`;

  const items = [
    { label: "Google Calendar", href: gcal, target: "_blank" as const },
    { label: "Apple Calendar", href: ics },
    { label: "Outlook Calendar", href: outlook, target: "_blank" as const },
  ];

  return (
    <SectionWrap id="calendar">
      <SectionHeader eyebrow="Save The Date" title="Add To Your Calendar" />
      <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
        {items.map((it) => (
          <a
            key={it.label}
            href={it.href}
            target={it.target}
            rel="noreferrer"
            className="group glass-card inline-flex items-center gap-3 rounded-full px-6 py-4 font-[var(--font-display)] text-sm uppercase tracking-[0.2em] text-brown transition-all hover:-translate-y-1 hover:text-maroon"
          >
            <CalendarIcon size={16} className="text-gold transition-transform group-hover:rotate-12" />
            {it.label}
          </a>
        ))}
      </div>
    </SectionWrap>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="relative overflow-hidden px-4 pt-24 pb-12">
      <MandalaBg className="absolute -bottom-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 float-slow" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 flex items-center justify-center gap-4">
          <div className="h-px w-20 divider-gold" />
          <Heart className="text-maroon" size={20} fill="currentColor" />
          <div className="h-px w-20 divider-gold" />
        </div>
        <p className="font-[var(--font-quote)] text-2xl italic text-brown sm:text-3xl">
          “Your presence is the greatest blessing.”
        </p>
        <div className="mt-10 font-[var(--font-script)] text-5xl shimmer-text sm:text-6xl">
          {GROOM.split(" ")[0]} <Heart className="inline text-maroon" size={22} fill="currentColor" /> {BRIDE.split(" ")[0]}
        </div>
        <div className="mt-4 font-[var(--font-display)] tracking-[0.3em] text-brown">
          AUGUST · 27 · 2026
        </div>
        <div className="mt-8 font-[var(--font-quote)] italic text-brown/70">
          With love, from both families.
        </div>
        <div className="mx-auto mt-10 h-px w-40 divider-gold" />
      </div>
    </footer>
  );
}

/* ---------------- Layout helpers ---------------- */

function SectionWrap({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative px-4 py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-14 text-center"
    >
      <div className="mb-3 font-[var(--font-display)] text-xs uppercase tracking-[0.4em] text-gold">
        {eyebrow}
      </div>
      <h2 className="font-[var(--font-script)] text-5xl shimmer-text sm:text-6xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-px w-32 divider-gold" />
    </motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-40 h-[3px] origin-left bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
    />
  );
}

function StickyNav() {
  const items = [
    { id: "invite", label: "Invitation" },
    { id: "countdown", label: "Save The Date" },
    { id: "timeline", label: "Timeline" },
    { id: "venue", label: "Venue" },
    { id: "calendar", label: "Calendar" },
  ];
  return (
    <nav className="glass-card fixed left-1/2 top-4 z-40 hidden -translate-x-1/2 rounded-full px-2 py-1.5 md:block">
      <ul className="flex items-center gap-1">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className="block rounded-full px-4 py-2 font-[var(--font-display)] text-xs uppercase tracking-[0.2em] text-brown transition-colors hover:bg-champagne hover:text-maroon"
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------------- Main ---------------- */

function Invitation() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const n = params.get("guest") || params.get("to");
    if (n) setGuestName(n);
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.play().catch(() => setPlaying(false));
    } else {
      a.pause();
    }
  }, [playing]);

  // Autoplay strategy: browsers block audible autoplay until a user gesture.
  // Start MUTED autoplay immediately (allowed everywhere), then unmute on the
  // very first interaction so it feels like it "just played" from load.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = true;
    a.play().then(() => setPlaying(true)).catch(() => {});

    const unmute = () => {
      const el = audioRef.current;
      if (!el) return;
      el.muted = false;
      el.volume = 0.6;
      el.play().then(() => setPlaying(true)).catch(() => {});
      window.removeEventListener("pointerdown", unmute);
      window.removeEventListener("keydown", unmute);
      window.removeEventListener("touchstart", unmute);
      window.removeEventListener("scroll", unmute);
    };
    window.addEventListener("pointerdown", unmute, { once: true });
    window.addEventListener("keydown", unmute, { once: true });
    window.addEventListener("touchstart", unmute, { once: true });
    window.addEventListener("scroll", unmute, { once: true, passive: true });
  }, []);

  const handleOpen = () => {
    setOpened(true);
    const a = audioRef.current;
    if (a) {
      a.muted = false;
      a.volume = 0.6;
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" autoPlay playsInline />

      <ScrollProgress />
      <Petals />
      <MusicPlayer playing={playing} setPlaying={setPlaying} audioRef={audioRef} />

      <AnimatePresence>
        {!opened && <Opening onOpen={handleOpen} />}
      </AnimatePresence>

      {opened && (
        <>
          <StickyNav />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Hero guestName={guestName} />
            <InviteMessage />
            <Countdown />
            <EventTimeline />
            <Venue />
            <AddToCalendar />
            <Footer />
          </motion.main>
        </>
      )}
    </div>
  );
}
