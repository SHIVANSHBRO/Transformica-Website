import { useState, useEffect, useRef } from "react";
import { Helmet } from 'react-helmet-async';
import {
  Activity, Apple, Brain, Dumbbell, Heart, MessageCircle, Star,
  Users, User, Zap, Check, ArrowRight, Award, TrendingUp, Clock, Shield,
  Flame, Target, Cpu, ChevronDown, Menu, Plus, Trash2, X,
  ChevronRight, Package, Leaf, Phone, Camera, LogOut, BarChart3,
  Download, Sparkles
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { supabase, PRODUCT_IMAGE_BUCKET } from "./supabase";
import LogoImage from "../Transformica New logo.png";
import AppUiImage from "../Transformica App UI.webp";
import AppUi2Image from "../App Ui 2.webp";
import Trans1 from "../1.webp";
import Trans2 from "../2.webp";
import Trans3 from "../3.webp";
import Trans4 from "../4.webp";
import Trans5 from "../5.webp";
import Trans6 from "../6.webp";

// Video served from /public — not bundled, fetched only when AppPage renders
const AppUiVideo = "/app-ui.mp4";

/* ─────────────────────────── DESIGN TOKENS ─────────────────────────── */
const C = {
  bg:        "#04040f",
  bg2:       "#080818",
  card:      "rgba(10,10,30,0.9)",
  cyan:      "#00c8ff",
  green:     "#22d97e",
  violet:    "#7c3aed",
  orange:    "#f97316",
  textPrimary:  "#f0f4ff",
  textMuted:    "#6b7a99",
  border:    "rgba(0,200,255,0.12)",
  borderHover: "rgba(0,200,255,0.35)",
};

/* ─────────────────────────── GLOBAL STYLES ─────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.bg}; color: ${C.textPrimary}; font-family: 'Outfit', sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.cyan}; border-radius: 2px; }
  
  @keyframes floatY {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-18px); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spinOrbit {
    from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 20px rgba(0,200,255,0.25); }
    50%     { box-shadow: 0 0 45px rgba(0,200,255,0.65), 0 0 90px rgba(0,200,255,0.2); }
  }
  @keyframes orb1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%     { transform: translate(40px,-60px) scale(1.1); }
    66%     { transform: translate(-30px,40px) scale(0.9); }
  }
  @keyframes orb2 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%     { transform: translate(-50px,30px) scale(0.8); }
    66%     { transform: translate(60px,-40px) scale(1.2); }
  }
  @keyframes scanLine {
    0%   { top: -4px; opacity: 0.6; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes cardFlip {
    from { transform: perspective(1000px) rotateY(0deg); }
    to   { transform: perspective(1000px) rotateY(180deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes borderPulse {
    0%,100% { border-color: rgba(0,200,255,0.12); }
    50%     { border-color: rgba(0,200,255,0.45); }
  }

  .t-fade-up { animation: fadeUp 0.7s ease both; }
  .t-float   { animation: floatY 4s ease-in-out infinite; }
  .t-pulse   { animation: pulseGlow 2.5s ease-in-out infinite; }

  .flip-card { perspective: 1000px; }
  .flip-card:hover .flip-inner { transform: rotateY(180deg); }
  .flip-inner { transition: transform 0.6s; transform-style: preserve-3d; position: relative; }
  .flip-front, .flip-back { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .flip-back { transform: rotateY(180deg); position: absolute; top:0; left:0; width:100%; height:100%; }

  .nav-item::after {
    content: ''; display: block; height: 2px; width: 0;
    background: ${C.cyan}; transition: width 0.3s; margin-top: 2px;
  }
  .nav-item:hover::after, .nav-item.active::after { width: 100%; }

  .glow-text {
    text-shadow: 0 0 30px rgba(0,200,255,0.7), 0 0 60px rgba(0,200,255,0.3);
  }
  .shimmer-btn {
    background: linear-gradient(90deg, ${C.cyan} 0%, #0077ff 50%, ${C.cyan} 100%);
    background-size: 200% auto;
    animation: shimmer 2.5s linear infinite;
  }
  .glass {
    background: rgba(10,10,30,0.75);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid ${C.border};
    border-radius: 16px;
  }
  .quiz-option:hover { border-color: ${C.cyan} !important; background: rgba(0,200,255,0.08) !important; }
  .quiz-option.selected { border-color: ${C.cyan} !important; background: rgba(0,200,255,0.15) !important; }
  
  input, textarea, select {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,200,255,0.2);
    border-radius: 8px;
    color: ${C.textPrimary};
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    padding: 10px 14px;
    width: 100%;
    outline: none;
  }
  input:focus, textarea:focus { border-color: ${C.cyan}; }
  label { font-size: 13px; color: ${C.textMuted}; display: block; margin-bottom: 5px; }

  /* ─── 3D feature card hover ─── */
  .feature-3d-card {
    will-change: transform;
  }
  .feature-3d-card:hover {
    transform: translateY(-10px) rotateY(0deg) rotateX(0deg) translateZ(40px) !important;
    box-shadow: 0 35px 70px rgba(28, 42, 94, 0.18), 0 8px 20px rgba(28, 42, 94, 0.08) !important;
  }

  /* ─── Mobile-first orbit scaling (used by spinOrbit keyframes) ─── */
  /* The keyframes use a fixed translateX(110px). On mobile we scale the whole
     container down so the orbit fits and stays visible. */

  /* ─── Responsive layouts ─── */
  @media (max-width: 1023px) {
    .r-grid-hero   { grid-template-columns: 1fr !important; gap: 28px !important; }
    .r-grid-support { grid-template-columns: 1fr !important; gap: 40px !important; }
    .r-grid-analytics { grid-template-columns: 1fr !important; gap: 32px !important; }
    .r-grid-app    { grid-template-columns: 1fr !important; gap: 40px !important; }
    .features-3d-grid {
      grid-template-columns: 1fr !important;
      gap: 32px !important;
    }
    .features-3d-col {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 16px !important;
    }
    .features-3d-card-tilt {
      transform: none !important;
    }
    .transformations-grid { grid-template-columns: 1fr !important; gap: 50px !important; }
    .pricing-grid {
      grid-template-columns: 1fr !important;
      gap: 28px !important;
      max-width: 460px;
      margin: 0 auto;
    }
    .pricing-grid > div {
      transform: none !important;
    }
    .footer-grid {
      grid-template-columns: 1fr 1fr !important;
      gap: 36px !important;
    }
    .dual-strip {
      grid-template-columns: 1fr !important;
      gap: 24px !important;
      text-align: left;
    }
    .dual-strip > div:nth-child(2) {
      margin: 0 auto;
    }
    /* Shrink the hero orbit instead of hiding it */
    .hero-orbit { transform: scale(0.72); transform-origin: center; }
  }

  @media (max-width: 767px) {
    .wa-text { display: none !important; }
    .r-grid-2 { grid-template-columns: 1fr !important; gap: 20px !important; }
    .features-3d-col { grid-template-columns: 1fr !important; }
    .trans-grid    { grid-template-columns: 1fr !important; }
    .footer-grid   { grid-template-columns: 1fr !important; gap: 28px !important; }

    /* Hero: keep orbit visible but smaller and below the headline */
    .hero-orbit { transform: scale(0.62); margin-top: -20px; }
    .hero-title { font-size: clamp(38px, 11vw, 56px) !important; letter-spacing: 1.5px !important; line-height: 1.02 !important; }
    .hero-sub { font-size: 15px !important; line-height: 1.6 !important; }
    .hero-stats { gap: 18px !important; flex-wrap: wrap !important; margin-top: 28px !important; }
    .hero-stat-num { font-size: 22px !important; }

    /* Section headers */
    .section-h1 { font-size: clamp(30px, 8vw, 44px) !important; letter-spacing: 1.5px !important; line-height: 1.05 !important; }
    .section-h2 { font-size: clamp(26px, 7.5vw, 40px) !important; letter-spacing: 1px !important; line-height: 1.1 !important; }

    /* Sections get tighter padding on phones */
    .r-section { padding-left: 16px !important; padding-right: 16px !important; padding-top: 56px !important; padding-bottom: 56px !important; }

    /* Stack button rows */
    .r-btn-row { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
    .r-btn-row > * { width: 100% !important; justify-content: center !important; }

    /* Generic 2-up / 3-up card grids */
    .r-cards-2, .r-cards-3, .r-cards-auto { grid-template-columns: 1fr !important; gap: 16px !important; }

    /* Tighten card padding */
    .r-card { padding: 20px !important; }
  }

  @media (max-width: 400px) {
    .nav-logo-text { display: none !important; }
    .hero-orbit { transform: scale(0.52); margin-top: -32px; }
  }

  /* Prevent horizontal overflow from large glow orbs / animations */
  html, body { overflow-x: hidden; max-width: 100%; }
  img { max-width: 100%; height: auto; }
`;

/* ─────────────────────────── UTILITY COMPONENTS ─────────────────────── */
function TiltCard({ children, style = {}, className = "" }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform =
      `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(12px)`;
  };
  const onLeave = () => {
    ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.15s ease", ...style }}>
      {children}
    </div>
  );
}

function Counter({ target, suffix = "", prefix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let v = 0;
      const step = target / 80;
      const t = setInterval(() => {
        v += step;
        if (v >= target) { setVal(target); clearInterval(t); }
        else setVal(Math.floor(v));
      }, 20);
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

const WHATSAPP_NUMBER = "9899901124";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Transformica%20Coach`;
const SUPPLEMENT_CATEGORIES = ["Whey Protein", "Creatine", "Pre Workout", "Multi Vitamins", "Peptides", "Others"];

function LogoMark({ size = 42 }) {
  return (
    <img src={LogoImage} alt="Transformica logo" style={{ width: size, height: size, objectFit: "contain" }} />
  );
}

function WhatsappBubble() {
  return (
    <button onClick={() => window.open(WHATSAPP_URL, "_blank")}
      style={{
        position: "fixed", right: 20, bottom: 20, zIndex: 2000,
        background: "#25D366", color: "#fff", border: "none",
        borderRadius: 999, padding: "12px 18px", display: "flex",
        alignItems: "center", gap: 10, cursor: "pointer", boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
      }}>
      <MessageCircle size={18} />
      <span className="wa-text">Contact via WhatsApp</span>
    </button>
  );
}

function saveFitnessResult(result) {
  try {
    const existing = JSON.parse(localStorage.getItem("tx_fitness_results") || "[]");
    existing.push({ ...result, createdAt: new Date().toISOString() });
    localStorage.setItem("tx_fitness_results", JSON.stringify(existing));
  } catch (err) {
    console.warn("Unable to save fitness result", err);
  }
}

function Btn({ children, variant = "primary", onClick, style = {}, disabled = false }) {
  const base = {
    padding: "13px 28px", borderRadius: "8px", fontFamily: "'Outfit', sans-serif",
    fontWeight: 700, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", letterSpacing: "1px",
    textTransform: "uppercase", transition: "all 0.3s", border: "none",
    display: "inline-flex", alignItems: "center", gap: 8, opacity: disabled ? 0.55 : 1, ...style,
  };
  if (variant === "primary") return (
    <button className="shimmer-btn" onClick={onClick} disabled={disabled}
      style={{ ...base, color: "#fff" }}
      onMouseEnter={e => { if (disabled) return; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,200,255,0.5)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
      {children}
    </button>
  );
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...base, background: "transparent", border: `2px solid ${C.cyan}`, color: C.cyan }}
      onMouseEnter={e => { if (disabled) return; e.currentTarget.style.background = "rgba(0,200,255,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = ""; }}>
      {children}
    </button>
  );
}

function SectionHeader({ label, title, sub }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 56 }}>
      <span style={{ fontSize: 12, letterSpacing: 4, color: C.cyan, textTransform: "uppercase", fontWeight: 700 }}>{label}</span>
      <h2 className="section-h2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(34px,5vw,64px)", letterSpacing: 3, marginTop: 8, lineHeight: 1.05 }}>{title}</h2>
      {sub && <p style={{ color: C.textMuted, marginTop: 12, maxWidth: 540, margin: "12px auto 0", lineHeight: 1.7, padding: "0 16px" }}>{sub}</p>}
    </div>
  );
}

function GlowOrb({ size, color, style }) {
  return (
    <div style={{
      position: "absolute", borderRadius: "50%",
      width: size, height: size,
      background: color,
      filter: "blur(80px)",
      opacity: 0.18,
      pointerEvents: "none",
      zIndex: 0,
      ...style,
    }} />
  );
}

/* ─────────────────────────── NAVBAR ─────────────────────────── */
const PAGES = ["home", "app", "supplements", "about", "fitness-test"];
const PAGE_LABELS = { home: "Home", app: "Transformica App", supplements: "Supplements", about: "About Us", "fitness-test": "Fitness Test" };

function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isLight = page === "app";
  const textColor = isLight ? "#1c2a5e" : C.textPrimary;
  const accentColor = isLight ? "#3a5cd6" : C.cyan;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: isLight
        ? (scrolled ? "rgba(247,249,252,0.85)" : "rgba(247,249,252,0.45)")
        : (scrolled ? "rgba(255,255,255,0.22)" : "rgba(4,4,15,0.15)"),
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: scrolled
        ? (isLight ? "1px solid rgba(28,42,94,0.08)" : `1px solid ${C.border}`)
        : "none",
      boxShadow: scrolled
        ? (isLight ? "0 18px 40px rgba(28,42,94,0.06)" : "0 18px 40px rgba(0,0,0,0.12)")
        : "none",
      transition: "all 0.4s",
      padding: "0 clamp(16px,4vw,60px)",
    }}>
      <div className="nav-bar-inner" style={{ maxWidth: 1360, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48, height: 84 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flexShrink: 0 }} onClick={() => setPage("home")}>
          <img src={LogoImage} alt="Transformica" className="nav-logo-img" style={{ width: 50, height: 50, objectFit: "contain" }} />
          <span className="nav-logo-text" style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, letterSpacing: 3, color: accentColor }}>TRANSFORMICA</span>
        </div>
        <div style={{ display: "flex", gap: 34, alignItems: "center" }} className="hide-mobile nav-menu">
          {PAGES.map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`nav-item ${page === p ? "active" : ""}`}
              style={{
                background: "none", border: "none", color: page === p ? accentColor : textColor,
                fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 500, cursor: "pointer",
                letterSpacing: 1.2, textTransform: "uppercase",
              }}>
              {PAGE_LABELS[p]}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <Btn
            style={{ padding: "12px 26px", fontSize: 14 }}
            onClick={() => {
              if (page !== "home") setPage("home");
              setTimeout(() => {
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, page !== "home" ? 150 : 0);
            }}
          >
            Get Started
          </Btn>
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", color: textColor, cursor: "pointer", display: "none" }}
            className="show-mobile">
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: isLight ? "rgba(247,249,252,0.98)" : "rgba(4,4,15,0.98)",
          borderTop: isLight ? "1px solid rgba(28,42,94,0.08)" : `1px solid ${C.border}`,
          padding: "18px 26px",
        }}>
          {PAGES.map(p => (
            <button key={p} onClick={() => { setPage(p); setMenuOpen(false); }}
              style={{
                display: "block", width: "100%", background: "none", border: "none",
                color: page === p ? accentColor : textColor, fontFamily: "'Outfit', sans-serif",
                fontSize: 20, padding: "14px 0", textAlign: "left", cursor: "pointer",
                fontWeight: 500, letterSpacing: 1.2, textTransform: "uppercase",
              }}>
              {PAGE_LABELS[p]}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────── HOME PAGE ─────────────────────────── */
const analyticsData = [
  { w: "Wk1", str: 42, bf: 28 }, { w: "Wk2", str: 50, bf: 26 },
  { w: "Wk3", str: 57, bf: 24.5 }, { w: "Wk4", str: 63, bf: 23 },
  { w: "Wk5", str: 70, bf: 21 }, { w: "Wk6", str: 75, bf: 19.5 },
  { w: "Wk7", str: 82, bf: 18 }, { w: "Wk8", str: 88, bf: 16 },
];

const ecosystemFeatures = [
  { icon: <Apple size={22} />, label: "Diet & Nutrition", desc: "Custom meal plans & macro tracking", color: C.green },
  { icon: <Dumbbell size={22} />, label: "Workout Plans", desc: "Expert-designed training programs", color: C.cyan },
  { icon: <Heart size={22} />, label: "PCOS/PCOD Care", desc: "Specialized hormonal health support", color: "#ff6b8a" },
  { icon: <MessageCircle size={22} />, label: "24×7 Support", desc: "WhatsApp support from real coaches", color: C.orange },
  { icon: <Activity size={22} />, label: "Rehab Exercises", desc: "Injury recovery & mobility work", color: C.violet },
  { icon: <Package size={22} />, label: "Supplements", desc: "Genuine imported products only", color: "#fbbf24" },
];

/* ─────────────────────────── PRICING DATA + CARD ─────────────────────────── */
const pricingPlans = [
  {
    name: "Transformica Lite",
    duration: "1 Month",
    tagline: "Perfect for first-timers testing the waters",
    price: "999",
    original: "2,499",
    savings: "60% OFF",
    color: C.green,
    colorDark: "#16a34a",
    cta: "Start Light",
    features: [
      { icon: <Apple size={14} />, text: "Guided meal templates & calorie targets" },
      { icon: <Dumbbell size={14} />, text: "Step-by-step home & gym workout plans" },
      { icon: <Activity size={14} />, text: "Up to 2 plan alterations" },
      { icon: <Heart size={14} />, text: "No-gym home workouts available" },
      { icon: <MessageCircle size={14} />, text: "Email support from nutrition experts" },
    ],
  },
  {
    name: "Transformica Pro",
    duration: "3 Months",
    tagline: "Maximum value. Real coaching. Real results.",
    price: "7,997",
    original: "10,000",
    savings: "Save ₹2,003",
    color: C.cyan,
    colorDark: "#0077ff",
    cta: "Start My Transformation",
    badge: "Most Popular",
    featured: true,
    socialProof: "Chosen by 70% of new members",
    guarantee: true,
    features: [
      { icon: <Cpu size={14} />, text: "Complete blood work analysis", highlight: true, subtext: "Uncover hidden deficiencies blocking progress" },
      { icon: <Target size={14} />, text: "Custom diet & workout plan", highlight: true, subtext: "Personalized around your body & lifestyle" },
      { icon: <Users size={14} />, text: "Weekly 1-on-1 coach check-ins", highlight: true },
      { icon: <Activity size={14} />, text: "Up to 2 plan alterations" },
      { icon: <BarChart3 size={14} />, text: "Full access to Transformica App" },
      { icon: <Shield size={14} />, text: "7-day money-back guarantee" },
    ],
  },
  {
    name: "Transformica Pro Max",
    duration: "3 Months",
    tagline: "For serious results & total accountability",
    price: "24,997",
    original: "29,999",
    savings: "Save ₹5,002",
    color: C.violet,
    colorDark: "#5b21b6",
    cta: "Go Pro Max",
    badge: "Premium",
    premium: true,
    bonus: "FREE Wearable Smart Watch — track steps, heart rate & sleep 24/7",
    guarantee: true,
    features: [
      { icon: <Cpu size={14} />, text: "Complete blood work analysis", highlight: true },
      { icon: <Target size={14} />, text: "Custom diet & workout plan", highlight: true },
      { icon: <Activity size={14} />, text: "5 plan alterations included", highlight: true, subtext: "More flexibility as you progress" },
      { icon: <Users size={14} />, text: "Weekly coach check-ins" },
      { icon: <Award size={14} />, text: "FREE wearable smart watch", highlight: true, subtext: "Steps, heart rate & sleep tracking" },
      { icon: <MessageCircle size={14} />, text: "24×7 WhatsApp expert support", highlight: true },
      { icon: <Shield size={14} />, text: "7-day money-back guarantee" },
    ],
  },
];

function PricingCard({ plan }) {
  const isFeatured = plan.featured;
  const isPremium = plan.premium;
  const isHighlight = isFeatured || isPremium;

  return (
    <div style={{
      position: "relative",
      background: isFeatured
        ? `linear-gradient(160deg, rgba(0,200,255,0.10), rgba(34,217,126,0.04) 60%, ${C.card})`
        : isPremium
        ? `linear-gradient(160deg, rgba(124,58,237,0.10), rgba(251,191,36,0.04) 60%, ${C.card})`
        : C.card,
      border: `${isFeatured ? 2 : 1}px solid ${isFeatured ? C.cyan : isPremium ? C.violet : C.border}`,
      borderRadius: 24,
      padding: "36px 28px 28px",
      boxShadow: isFeatured
        ? `0 0 70px rgba(0,200,255,0.22), 0 24px 50px rgba(0,0,0,0.32)`
        : isPremium
        ? `0 0 60px rgba(124,58,237,0.20), 0 24px 50px rgba(0,0,0,0.32)`
        : "0 14px 32px rgba(0,0,0,0.18)",
      transform: isFeatured ? "scale(1.05)" : "scale(1)",
      transition: "all 0.3s",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Badge */}
      {plan.badge && (
        <div style={{
          position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)",
          background: isFeatured
            ? `linear-gradient(90deg, ${C.cyan}, ${C.green})`
            : `linear-gradient(90deg, ${C.violet}, #fbbf24)`,
          color: "#fff", fontSize: 11, fontWeight: 700,
          padding: "7px 18px", borderRadius: 99,
          letterSpacing: 2.5, textTransform: "uppercase",
          whiteSpace: "nowrap",
          boxShadow: `0 10px 24px ${isFeatured ? C.cyan : C.violet}55`,
          fontFamily: "'Outfit', sans-serif",
        }}>
          ★ {plan.badge}
        </div>
      )}

      {/* Plan name + duration */}
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 26, letterSpacing: 0.5,
          color: plan.color, fontWeight: 700, lineHeight: 1.1,
        }}>
          {plan.name}
        </div>
        <div style={{
          fontSize: 11, letterSpacing: 2, color: C.textMuted,
          textTransform: "uppercase", marginTop: 6, fontWeight: 600,
        }}>
          {plan.duration}
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        textAlign: "center", marginBottom: 22,
        fontSize: 12.5, color: C.textMuted, fontStyle: "italic",
        lineHeight: 1.5, padding: "0 8px",
      }}>
        {plan.tagline}
      </div>

      {/* Price */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ display: "inline-flex", alignItems: "baseline", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: plan.color, fontWeight: 700, marginRight: 4, lineHeight: 1 }}>₹</span>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 60, color: plan.color, lineHeight: 1, fontWeight: 800,
          }}>
            {plan.price}
          </span>
        </div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ color: C.textMuted, fontSize: 14, textDecoration: "line-through" }}>₹{plan.original}</span>
          <span style={{
            background: `${C.green}20`, color: C.green, fontSize: 11, fontWeight: 700,
            padding: "4px 11px", borderRadius: 99, letterSpacing: 0.8, textTransform: "uppercase",
          }}>
            {plan.savings}
          </span>
        </div>
      </div>

      {/* Social proof */}
      {plan.socialProof && (
        <div style={{
          textAlign: "center", marginBottom: 18, padding: "10px 12px",
          background: `${C.cyan}12`, border: `1px solid ${C.cyan}35`,
          borderRadius: 10, fontSize: 12, color: C.cyan, fontWeight: 600,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <Flame size={13} />
          {plan.socialProof}
        </div>
      )}

      {/* Bonus */}
      {plan.bonus && (
        <div style={{
          marginBottom: 18, padding: "12px 14px",
          background: `linear-gradient(135deg, rgba(251,191,36,0.15), rgba(249,115,22,0.08))`,
          border: `1px solid rgba(251,191,36,0.35)`, borderRadius: 10,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <div style={{ color: "#fbbf24", flexShrink: 0, marginTop: 1 }}><Award size={18} /></div>
          <div style={{ fontSize: 12, color: "#fbbf24", fontWeight: 600, lineHeight: 1.4 }}>
            {plan.bonus}
          </div>
        </div>
      )}

      {/* Features */}
      <div style={{ marginBottom: 24, flex: 1 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
            <div style={{
              flexShrink: 0, marginTop: 2,
              width: 22, height: 22, borderRadius: 6,
              background: f.highlight ? `${plan.color}25` : "rgba(255,255,255,0.04)",
              border: `1px solid ${f.highlight ? plan.color : "transparent"}50`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: f.highlight ? plan.color : C.green,
            }}>
              {f.highlight ? <Check size={13} strokeWidth={3} /> : <Check size={13} strokeWidth={2.5} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 13.5,
                fontWeight: f.highlight ? 700 : 500,
                color: f.highlight ? C.textPrimary : C.textMuted,
                lineHeight: 1.4,
              }}>
                {f.text}
              </div>
              {f.subtext && (
                <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 3, opacity: 0.85, lineHeight: 1.4 }}>
                  {f.subtext}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => window.open(WHATSAPP_URL, "_blank")}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          if (isHighlight) e.currentTarget.style.boxShadow = `0 22px 44px ${plan.color}65`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          if (isHighlight) e.currentTarget.style.boxShadow = `0 12px 28px ${plan.color}45`;
        }}
        style={{
          width: "100%",
          padding: "16px 20px",
          background: isHighlight
            ? `linear-gradient(135deg, ${plan.color}, ${plan.colorDark})`
            : "transparent",
          color: isHighlight ? "#fff" : plan.color,
          border: isHighlight ? "none" : `2px solid ${plan.color}`,
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          cursor: "pointer",
          fontFamily: "'Outfit', sans-serif",
          boxShadow: isHighlight ? `0 12px 28px ${plan.color}45` : "none",
          transition: "all 0.3s",
        }}>
        {plan.cta} <ArrowRight size={15} style={{ marginLeft: 6, verticalAlign: "middle" }} />
      </button>

      {/* Guarantee footer */}
      {plan.guarantee && (
        <div style={{
          marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          fontSize: 11, color: C.textMuted,
        }}>
          <Shield size={12} style={{ color: C.green }} />
          7-day money-back guarantee
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── WHATSAPP HELPERS ─────────────────────────── */
const programWA = (program) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hey Coach, I wanna enquire about ${program}.`)}`;

const waWithMessage = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/* ─────────────────────────── FAQ DATA + COMPONENT ─────────────────────────── */
const faqs = [
  {
    q: "How can I lose belly fat fast at home?",
    a: "Belly fat loss requires a combination of consistent calorie deficit, strength training, and lifestyle adjustments. There is no spot reduction — total body fat must decrease for belly fat to reduce. At Transformica, our coaches design home-based fat loss programs that combine effective routines, customised Indian meal plans, and habit changes around sleep and stress. Most members see visible belly fat reduction within 4–8 weeks when adherence stays above 80%.",
  },
  {
    q: "How many calories should I eat to lose weight?",
    a: "Your calorie target depends on your age, weight, height, activity level, and goals. As a general rule, a daily deficit of 300–500 calories from your maintenance level produces sustainable weight loss of 0.4–0.8 kg per week. Crash diets often backfire by triggering muscle loss and metabolic slowdown. Our coaches use AI-assisted calculations and ongoing weekly check-ins to find your exact sweet spot.",
  },
  {
    q: "What is the best workout plan for weight loss?",
    a: "The most effective weight-loss workout plan combines 3–4 strength training sessions with 2–3 cardio or active recovery sessions per week. Strength training preserves lean muscle while you lose fat, which keeps your metabolism elevated. Pure cardio plans often lead to muscle loss and rebound weight gain. Transformica builds plans personalised to your gym access, schedule, injuries, and experience level.",
  },
  {
    q: "How much protein do I need per day to build muscle?",
    a: "For muscle building, aim for 1.6–2.2 grams of protein per kilogram of body weight per day. A 70 kg adult should target 112–154 g of protein daily, spread across 3–5 meals. Indian vegetarians can hit this target through dal, paneer, tofu, milk, eggs (if eggetarian), and a quality whey or plant protein supplement. Our dieticians design protein-balanced meal plans that respect your dietary preferences.",
  },
  {
    q: "Is intermittent fasting effective for weight loss?",
    a: "Intermittent fasting (IF) can support weight loss because it naturally limits eating windows, often reducing total calorie intake. The 16:8 pattern (eat in 8 hours, fast for 16) is the most popular protocol. However, IF is not magical — long-term results still depend on the quality of food and total calories consumed. IF isn't suitable for everyone, especially those with PCOS, pregnancy, or eating disorders. Always consult a coach before starting.",
  },
  {
    q: "What is the best PCOS / PCOD diet plan?",
    a: "A PCOS-friendly diet focuses on low-glycemic carbs, adequate protein, healthy fats, and anti-inflammatory foods. Avoid refined sugar, white flour, and excessive dairy. Include foods like oats, millets, leafy greens, eggs, fish, nuts, seeds, and berries. Strength training plus brisk walking helps insulin sensitivity. Transformica has dedicated PCOS/PCOD coaches who customise Indian-friendly diets based on your hormonal profile and lifestyle.",
  },
  {
    q: "How long does it take to see results from working out?",
    a: "Most beginners notice strength gains and improved energy within 2–3 weeks. Visible body changes — fat loss and muscle definition — typically appear in 6–8 weeks with consistent training and proper nutrition. Significant transformations such as 8–12 kg fat loss or noticeable muscle build usually require 3–6 months. Consistency matters far more than intensity in the early weeks. Our 90-day plans are designed around this realistic timeline.",
  },
  {
    q: "Can I lose weight without going to the gym?",
    a: "Yes, absolutely. Bodyweight exercises, resistance bands, and household items can deliver excellent results when programmed correctly. Walking 8,000–10,000 steps daily, doing 3 home strength sessions per week, and following a calorie-controlled diet is enough to lose 0.4–0.7 kg per week. Transformica Lite includes complete no-gym home workout plans for members who prefer exercising at home.",
  },
  {
    q: "What should I eat before and after a workout?",
    a: "Before a workout (1–2 hours): a moderate carb plus small protein meal — for example, oats with banana, or roti with paneer bhurji. After a workout (within 60 minutes): protein with carbs to support recovery — such as a whey shake with banana, eggs with toast, or chicken with rice. Hydration matters as much as food. Our app's smart meal planner auto-suggests pre and post workout meals based on your training schedule.",
  },
  {
    q: "How can I lose weight after pregnancy?",
    a: "Postpartum weight loss should be gradual and patient — never crash diet, especially while breastfeeding. Wait for your doctor's clearance (usually 6–8 weeks post-delivery) before structured workouts. Start with walking, pelvic floor work, and gentle strength training. Calorie intake should be 300–500 below maintenance, with high protein for healing. Many of our members have lost 13+ kg postpartum following our specialised mother-friendly programs.",
  },
  {
    q: "What is the difference between fat loss and weight loss?",
    a: "Weight loss measures total body weight change — including fat, muscle, and water. Fat loss specifically targets body fat while preserving lean muscle. Quick weight loss often comes from water and muscle, which reduces metabolism and causes rebound. True transformation focuses on fat loss with muscle retention or growth — the look of a leaner, stronger body even if the scale moves slowly. This is what we call body recomposition.",
  },
  {
    q: "How many days per week should I work out?",
    a: "For most people, 3–5 strength sessions per week is the sweet spot. Beginners can start with 3 full-body workouts to build a foundation. Intermediate to advanced lifters can train 4–5 days using upper-lower or push-pull-legs splits. Active rest days (walking, yoga, mobility) accelerate recovery. Training 6–7 days without proper recovery often leads to plateaus and injury.",
  },
  {
    q: "Are supplements like whey protein and creatine safe?",
    a: "Yes, when sourced from reputable brands and used as directed. Whey protein is simply concentrated milk protein — safe for healthy adults. Creatine monohydrate is one of the most researched supplements in the world, with proven benefits for strength and recovery. Both have decades of safety data when consumed within recommended doses. Transformica only sells genuine, internationally certified supplements through our Supplement Lab.",
  },
  {
    q: "How can I stay consistent and motivated to work out?",
    a: "Motivation is unreliable — systems and accountability win. Schedule workouts like meetings, prepare meals in advance, track progress weekly with photos and measurements, and have a coach who checks in. Small wins (logging a workout, hitting protein targets) build momentum. Our weekly 1-on-1 check-ins are specifically designed to break consistency plateaus and rekindle motivation when life gets in the way.",
  },
  {
    q: "What is body recomposition (losing fat while gaining muscle)?",
    a: "Body recomposition is the simultaneous process of losing fat and gaining muscle, leading to a leaner, more defined physique without dramatic weight changes. It requires a small calorie deficit (or maintenance), high protein intake (1.8–2.2 g/kg), progressive strength training, and adequate sleep. It's most achievable for beginners, returning lifters, or those with higher body fat. Our coaches specialise in recomp programs that produce visible changes in 12–16 weeks.",
  },
];

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${isOpen ? C.cyan + "55" : C.border}`,
      borderRadius: 14,
      marginBottom: 12,
      overflow: "hidden",
      transition: "border-color 0.3s",
    }}>
      <button onClick={onToggle} style={{
        width: "100%", padding: "20px 24px", textAlign: "left",
        background: "transparent", border: "none", color: C.textPrimary,
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 16,
        fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600,
      }}>
        <span style={{ flex: 1 }}>{q}</span>
        <span style={{
          color: C.cyan, fontSize: 28, lineHeight: 1, flexShrink: 0,
          transform: isOpen ? "rotate(45deg)" : "rotate(0)",
          transition: "transform 0.3s",
          fontFamily: "'Outfit', sans-serif", fontWeight: 300,
        }}>+</span>
      </button>
      {isOpen && (
        <div style={{
          padding: "0 24px 22px",
          color: C.textMuted, fontSize: 14, lineHeight: 1.75,
          borderTop: `1px solid ${C.border}`,
          paddingTop: 18, marginTop: -2,
        }}>
          {a}
        </div>
      )}
    </div>
  );
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="faq" style={{ padding: "100px clamp(16px,4vw,60px)", background: C.bg2, position: "relative", overflow: "hidden" }}>
      <GlowOrb size={400} color={C.violet} style={{ top: 0, left: -100 }} />
      <GlowOrb size={400} color={C.cyan} style={{ bottom: 0, right: -100 }} />
      <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionHeader
          label="Frequently Asked"
          title="FITNESS QUESTIONS, ANSWERED"
          sub="Real answers to the most-searched fitness questions in India — from belly fat to PCOS, postpartum weight loss to body recomposition."
        />
        <div>
          {faqs.map((item, i) => (
            <FAQItem
              key={i}
              q={item.q}
              a={item.a}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
        {/* JSON-LD for SEO rich snippets */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }) }} />
      </div>
    </section>
  );
}

function HomePage({ testimonials, transformations }) {
  return (
    <div style={{ paddingTop: 84 }}>
      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <GlowOrb size={500} color={C.cyan} style={{ top: -100, right: -100, animation: "orb1 12s ease-in-out infinite" }} />
        <GlowOrb size={400} color={C.violet} style={{ bottom: -80, left: -100, animation: "orb2 10s ease-in-out infinite" }} />
        <GlowOrb size={300} color={C.green} style={{ top: "40%", left: "50%", animation: "orb1 15s ease-in-out infinite 3s" }} />

        {/* Scan line */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${C.cyan}40, transparent)`,
          animation: "scanLine 4s linear infinite", zIndex: 1,
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,60px)", position: "relative", zIndex: 2 }}>
          <div className="r-grid-hero" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{
                display: "inline-block", padding: "6px 16px", borderRadius: 20,
                border: `1px solid ${C.cyan}40`, background: "rgba(0,200,255,0.08)",
                fontSize: 12, fontWeight: 700, letterSpacing: 3, color: C.cyan,
                textTransform: "uppercase", marginBottom: 24,
                animation: "fadeUp 0.6s ease both",
              }}>
                Your Complete Health & Fitness Ecosystem
              </div>
              <h1 className="hero-title" style={{
                fontFamily: "'Playfair Display', serif", fontSize: "clamp(48px,7vw,92px)",
                lineHeight: 0.95, letterSpacing: 4, marginBottom: 24,
                animation: "fadeUp 0.7s ease both 0.1s",
                textShadow: `0 0 40px rgba(0,200,255,0.4), 0 0 80px rgba(0,200,255,0.15)`,
              }}>
                TRANSFORM<br />
                <span style={{ color: C.cyan }}>YOUR</span><br />
                BODY. MIND.<br />
                <span style={{
                  background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>LIFE.</span>
              </h1>
              <p className="hero-sub" style={{
                color: C.textMuted, fontSize: 17, lineHeight: 1.7, maxWidth: 460,
                marginBottom: 36, animation: "fadeUp 0.7s ease both 0.2s",
              }}>
                Human expert guidance fused with AI-powered analytics. Transformica helps you achieve your dream physique and peak performance — scientifically, sustainably.
              </p>
              <div className="r-btn-row" style={{ display: "flex", gap: 14, flexWrap: "wrap", animation: "fadeUp 0.7s ease both 0.3s" }}>
                <Btn onClick={() => window.open(WHATSAPP_URL, "_blank")}>Contact Us <ArrowRight size={16} /></Btn>
              </div>
              <div className="hero-stats" style={{ display: "flex", gap: 32, marginTop: 40, animation: "fadeUp 0.7s ease both 0.4s" }}>
                {[["5000+", "Members"], ["94%", "Success Rate"], ["12+", "Experts"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="hero-stat-num" style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: C.cyan, letterSpacing: 2 }}>{n}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Orbit Visual */}
            <div className="hero-orbit" style={{ display: "flex", justifyContent: "center", alignItems: "center", animation: "fadeUp 0.8s ease both 0.3s" }}>
              <div style={{ position: "relative", width: 320, height: 320 }}>
                {/* Center */}
                <div className="t-pulse" style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 96, height: 96, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.cyan}, #0055ff)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 10,
                  zIndex: 2,
                }}>
                  <img src={LogoImage} alt="Transformica logo" style={{ width: 56, height: 56, objectFit: "contain" }} />
                </div>

                {/* Orbit ring */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 240, height: 240, borderRadius: "50%",
                  border: `1px dashed rgba(0,200,255,0.25)`,
                }} />

                {/* Orbiting icons */}
                {ecosystemFeatures.slice(0, 5).map((f, i) => (
                  <div key={i} style={{
                    position: "absolute", top: "50%", left: "50%",
                    width: 44, height: 44,
                    animation: `spinOrbit ${6 + i * 0.5}s linear infinite`,
                    animationDelay: `${-(i / 5) * (6 + i * 0.5)}s`,
                    marginTop: -22, marginLeft: -22,
                  }}>
                    <div style={{
                      width: "100%", height: "100%", borderRadius: "50%",
                      background: `${f.color}22`, border: `1px solid ${f.color}55`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: f.color,
                    }}>
                      {f.icon}
                    </div>
                  </div>
                ))}

                {/* Floating stats */}
                {[
                  { label: "Calories Burned", val: "3,420 kcal", y: -20, x: -160 },
                  { label: "Body Fat", val: "↓ 8.2%", y: 60, x: 150 },
                  { label: "Strength", val: "↑ 34%", y: 200, x: -100 },
                ].map((s, i) => (
                  <div key={i} className="glass t-float" style={{
                    position: "absolute", top: s.y + 160, left: s.x + 160,
                    padding: "8px 14px", fontSize: 11, animationDelay: `${i * 0.8}s`,
                    whiteSpace: "nowrap",
                  }}>
                    <div style={{ color: C.textMuted, fontSize: 10 }}>{s.label}</div>
                    <div style={{ color: C.cyan, fontWeight: 700 }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <ChevronDown size={24} style={{ color: C.textMuted, animation: "floatY 2s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section style={{ padding: "100px clamp(16px,4vw,60px)", position: "relative" }}>
        <GlowOrb size={400} color={C.violet} style={{ top: 0, right: 0 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionHeader label="The Ecosystem" title="EVERYTHING YOU NEED" sub="Six pillars of transformation — working together in perfect synergy." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 20 }}>
            {ecosystemFeatures.map((f, i) => (
              <TiltCard key={i} style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28,
                animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: `${f.color}18`,
                  border: `1px solid ${f.color}44`, display: "flex", alignItems: "center",
                  justifyContent: "center", color: f.color, marginBottom: 18,
                }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, letterSpacing: 2, marginBottom: 8, color: f.color }}>{f.label}</h3>
                <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* HUMAN SUPPORT */}
      <section style={{ padding: "100px clamp(16px,4vw,60px)", background: C.bg2, position: "relative" }}>
        <GlowOrb size={500} color={C.green} style={{ bottom: -100, left: -50 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="r-grid-support" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <SectionHeader label="Human Support" title="REAL COACHES. REAL RESULTS." sub={null} />
              <p style={{ color: C.textMuted, lineHeight: 1.8, marginBottom: 28, textAlign: "left" }}>
                No chatbots. No generic advice. Every Transformica member gets a dedicated human coach who understands your lifestyle, limitations, and goals. Our coaches provide 24×7 WhatsApp support and make real-time adjustments to your plan.
              </p>
              {[
                { icon: <MessageCircle size={18} />, t: "24×7 WhatsApp Coaching", d: "Instant response from certified coaches" },
                { icon: <Users size={18} />, t: "Personalized Check-ins", d: "Weekly 1-on-1 progress reviews" },
                { icon: <Heart size={18} />, t: "Holistic Approach", d: "Diet, sleep, stress & mental wellness" },
                { icon: <Shield size={18} />, t: "PCOS/PCOD Specialists", d: "Hormonal health expertise" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, background: `${C.green}18`,
                    border: `1px solid ${C.green}44`, display: "flex", alignItems: "center",
                    justifyContent: "center", color: C.green, flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{item.t}</div>
                    <div style={{ color: C.textMuted, fontSize: 13 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <TiltCard style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, letterSpacing: 2, color: C.green, marginBottom: 20 }}>LIVE COACH DASHBOARD</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[["12", "Active Members"], ["3.2 min", "Avg Response"], ["98%", "Retention"], ["4.9★", "Rating"]].map(([v, l]) => (
                  <div key={l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16, textAlign: "center" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: C.cyan }}>{v}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{l}</div>
                  </div>
                ))}
              </div>
              {["Priya S. — Meal plan updated ✓", "Rahul M. — Workout adjusted ✓", "Anjali K. — Check-in complete ✓"].map((msg, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                  borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
                  }}>{msg[0]}</div>
                  <span style={{ fontSize: 13, color: C.textMuted }}>{msg}</span>
                </div>
              ))}
            </TiltCard>
          </div>
        </div>
      </section>

      {/* DATA-DRIVEN TRANSFORMATION — AI + Human Coach */}
      <section style={{ padding: "100px clamp(16px,4vw,60px)", position: "relative", overflow: "hidden" }}>
        <GlowOrb size={500} color={C.cyan} style={{ top: 0, right: -100 }} />
        <GlowOrb size={400} color="#ff6b8a" style={{ bottom: 100, left: -50, opacity: 0.18 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <SectionHeader label="AI + Human Coaching" title="POWERED BY AI. GUIDED BY HUMANS."
            sub="The precision of AI analytics combined with the empathy of a real coach who knows you, listens to you, and adapts your plan around your life." />
          <div className="r-grid-analytics" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 40, alignItems: "center" }}>
            <div>
              {[
                { icon: <Heart size={20} />, c: "#ff6b8a", t: "A Coach Who Truly Understands", d: "Your coach listens to your concerns, lifestyle, and limitations — then adapts the plan around your reality, not the other way around." },
                { icon: <MessageCircle size={20} />, c: C.green, t: "Empathy When You Need It Most", d: "Stressful week? Travel plans? Injury setback? Your coach pivots with you, with personalized advice that meets you where you are." },
                { icon: <Cpu size={20} />, c: C.cyan, t: "AI That Sees Every Detail", d: "Body composition, strength curves, recovery, and habits — tracked with precision no human could match. Nothing falls through the cracks." },
                { icon: <Users size={20} />, c: C.violet, t: "Smart Alternatives, Always", d: "Don't enjoy an exercise? Allergic to a food? Your coach instantly offers effective substitutes — your plan flexes to your life." },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, marginBottom: 20, padding: 20,
                  background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, background: `${item.c}18`,
                    border: `1px solid ${item.c}44`, display: "flex", alignItems: "center",
                    justifyContent: "center", color: item.c, flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.t}</div>
                    <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.5 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, letterSpacing: 2, color: C.cyan }}>STRENGTH UP. FAT DOWN.</span>
                <span style={{ fontSize: 11, color: C.green, background: `${C.green}18`, padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>↑ Real Member · 8 wks</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="strGr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.cyan} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={C.cyan} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="bfGr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b8a" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#ff6b8a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="w" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: C.textPrimary }} />
                  <Area type="monotone" dataKey="str" stroke={C.cyan} fill="url(#strGr)" strokeWidth={2.5} name="Strength %" />
                  <Area type="monotone" dataKey="bf" stroke="#ff6b8a" fill="url(#bfGr)" strokeWidth={2.5} name="Body Fat %" />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 32, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, justifyContent: "center" }}>
                    <div style={{ width: 24, height: 3, background: C.cyan, borderRadius: 2 }} />
                    <span style={{ fontSize: 12, color: C.textMuted }}>Strength</span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: C.cyan, fontWeight: 700, lineHeight: 1 }}>↑ 110%</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, justifyContent: "center" }}>
                    <div style={{ width: 24, height: 3, background: "#ff6b8a", borderRadius: 2 }} />
                    <span style={{ fontSize: 12, color: C.textMuted }}>Body Fat</span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#ff6b8a", fontWeight: 700, lineHeight: 1 }}>↓ 43%</div>
                </div>
              </div>
            </div>
          </div>

          {/* "Two minds. One mission." highlight strip */}
          <div className="dual-strip" style={{
            marginTop: 56,
            padding: "32px clamp(20px, 3vw, 40px)",
            background: `linear-gradient(135deg, ${C.cyan}10, #ff6b8a08)`,
            border: `1px solid ${C.border}`,
            borderRadius: 24,
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 32,
            alignItems: "center",
          }}>
            {/* AI side */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: `${C.cyan}18`, border: `1px solid ${C.cyan}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: C.cyan, flexShrink: 0,
                }}>
                  <Cpu size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>The Tech</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.cyan, fontWeight: 700, lineHeight: 1.1 }}>AI That Tracks</div>
                </div>
              </div>
              <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.7 }}>
                Real-time body composition, strength progression, sleep, HRV, and habit consistency — captured 24/7 with surgical precision. Never sleeps. Never misses a data point.
              </p>
            </div>

            {/* Plus connector */}
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.cyan}, #ff6b8a)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 32, fontWeight: 800,
              boxShadow: `0 0 50px ${C.cyan}50`,
              fontFamily: "'Playfair Display', serif",
              flexShrink: 0,
            }}>+</div>

            {/* Human side */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: "rgba(255,107,138,0.12)", border: "1px solid rgba(255,107,138,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#ff6b8a", flexShrink: 0,
                }}>
                  <Heart size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>The Heart</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#ff6b8a", fontWeight: 700, lineHeight: 1.1 }}>Coach Who Cares</div>
                </div>
              </div>
              <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.7 }}>
                A real human who knows your name, listens when you struggle, and holds your hand from the first kg lost to the last rep gained. Empathy at every step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "80px clamp(16px,4vw,60px)", background: C.bg2 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 1, background: C.border }}>
            {[
              { n: 5000, s: "+", l: "Members Transformed", icon: <Users size={24} /> },
              { n: 94, s: "%", l: "Success Rate", icon: <Award size={24} /> },
              { n: 12, s: "+", l: "Expert Coaches", icon: <Brain size={24} /> },
              { n: 50000, s: "+", l: "Meals Planned", icon: <Apple size={24} /> },
            ].map(({ n, s, l, icon }) => (
              <div key={l} style={{
                background: C.bg2, padding: "40px 24px", textAlign: "center",
              }}>
                <div style={{ color: C.cyan, marginBottom: 12, opacity: 0.6 }}>{icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, color: C.cyan, letterSpacing: 2 }}>
                  <Counter target={n} suffix={s} />
                </div>
                <div style={{ fontSize: 13, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION */}
      <section style={{ padding: "120px clamp(16px,4vw,60px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <GlowOrb size={600} color={C.violet} style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, letterSpacing: 4, color: C.violet, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Our Vision</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px,6vw,80px)", letterSpacing: 4, lineHeight: 1.05, marginBottom: 28,
          }}>
            TO HELP EVERY PERSON ACHIEVE THEIR<br />
            <span className="glow-text" style={{ color: C.cyan }}>DREAM PHYSIQUE</span> AND<br />
            <span style={{ color: C.green }}>PEAK PERFORMANCE</span>
          </h2>
          <p style={{ color: C.textMuted, fontSize: 17, lineHeight: 1.8, marginBottom: 40 }}>
            We believe transformation is a right, not a privilege. Every body is different, every goal is valid. Transformica exists to give everyone — regardless of fitness level or background — the world-class guidance they deserve.
          </p>
          <Btn onClick={() => window.open(WHATSAPP_URL, "_blank")}>Join The Movement <Flame size={16} /></Btn>
        </div>
      </section>

      {/* PRICING — Conversion Optimized */}
      <section id="pricing" style={{ padding: "120px clamp(16px,4vw,60px)", background: C.bg2, position: "relative", overflow: "hidden" }}>
        <GlowOrb size={500} color={C.cyan} style={{ top: 0, right: 0 }} />
        <GlowOrb size={400} color={C.violet} style={{ bottom: 0, left: 0 }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <SectionHeader
            label="Plans"
            title="INVEST IN YOUR TRANSFORMATION"
            sub="Limited-time pricing. Cancel anytime. 7-day money-back guarantee on Pro and Pro Max."
          />

          {/* Trust badges row */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap",
            padding: "14px 28px",
            background: "rgba(255,255,255,0.025)",
            border: `1px solid ${C.border}`,
            borderRadius: 999,
            maxWidth: 760, margin: "0 auto 56px",
          }}>
            {[
              { icon: <Shield size={15} />, t: "Money-Back Guarantee" },
              { icon: <Users size={15} />, t: "5,000+ Members" },
              { icon: <Star size={15} />, t: "4.9★ Rated" },
              { icon: <Award size={15} />, t: "Certified Coaches" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, color: C.textMuted, fontSize: 12, fontWeight: 600 }}>
                <div style={{ color: C.cyan }}>{b.icon}</div>
                {b.t}
              </div>
            ))}
          </div>

          {/* Pricing cards */}
          <div className="pricing-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.12fr 1fr",
            gap: 24,
            alignItems: "stretch",
            paddingTop: 24,
          }}>
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>

          {/* Risk reversal banner */}
          <div style={{
            marginTop: 56, padding: "22px 28px",
            background: `linear-gradient(135deg, ${C.green}10, ${C.cyan}05)`,
            border: `1px solid ${C.green}30`,
            borderRadius: 18,
            maxWidth: 760, margin: "56px auto 0",
            textAlign: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
              <Shield size={22} style={{ color: C.green }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: C.green, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>
                Try Risk-Free for 7 Days
              </span>
            </div>
            <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.7 }}>
              Subscribe to Pro or Pro Max today. If you're not seeing real progress within 7 days, we'll refund every rupee — no questions asked.
            </p>
          </div>

          {/* Honest comparison hint */}
          <div style={{
            marginTop: 28, textAlign: "center",
            color: C.textMuted, fontSize: 13, lineHeight: 1.6,
          }}>
            All plans include access to our certified coaching team. Cancel anytime, no commitments.
          </div>
        </div>
      </section>

      {/* TRANSFORMATIONS & TESTIMONIALS */}
      {(transformations.length > 0 || testimonials.length > 0) && (
        <section style={{ padding: "100px clamp(16px,4vw,60px)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {transformations.length > 0 && (
              <>
                <SectionHeader label="Results" title="CLIENT TRANSFORMATIONS" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20, marginBottom: 60 }}>
                  {transformations.map((t) => (
                    <div key={t.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
                      {t.image && <img src={t.image} alt={t.name} style={{ width: "100%", height: 200, objectFit: "cover" }} />}
                      <div style={{ padding: 20 }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: C.cyan, marginBottom: 8 }}>{t.duration}</div>
                        <div style={{ fontSize: 13, color: C.textMuted }}>{t.result}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {testimonials.length > 0 && (
              <>
                <SectionHeader label="Testimonials" title="WHAT OUR MEMBERS SAY" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
                  {testimonials.map((t) => (
                    <div key={t.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                        {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} style={{ color: "#fbbf24", fill: "#fbbf24" }} />)}
                      </div>
                      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>"{t.text}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {t.photo ? <img src={t.photo} alt={t.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} /> :
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{t.name[0]}</div>
                        }
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>{t.plan} member</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}

/* ─────────────────────────── APP PAGE ─────────────────────────── */
const appFeatures = [
  { icon: <Activity size={20} />, c: C.cyan, t: "Smart Calorie Tracker", d: "AI-powered food scanner logs macros from photos in seconds." },
  { icon: <Dumbbell size={20} />, c: C.violet, t: "Workout Logger", d: "Log sets, reps, weights — 500+ exercises with video form guides." },
  { icon: <TrendingUp size={20} />, c: C.green, t: "Progress Analytics", d: "Body composition charts, strength curves, and goal ETAs." },
  { icon: <MessageCircle size={20} />, c: C.orange, t: "Coach Chat", d: "Direct WhatsApp-style messaging with your assigned coach." },
  { icon: <Apple size={20} />, c: "#ff6b8a", t: "Meal Plan Builder", d: "Weekly meal plans generated from your preferences and macros." },
  { icon: <Clock size={20} />, c: "#fbbf24", t: "Habit Tracker", d: "Water, sleep, steps, and supplement reminders built-in." },
];

function AppHeroDots({ rows, cols, style }) {
  const total = rows * cols;
  return (
    <div style={{
      position: "absolute",
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 14,
      opacity: 0.45,
      pointerEvents: "none",
      ...style,
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#a8b3d1" }} />
      ))}
    </div>
  );
}

function Feature3DCard({ feature, tilt, side }) {
  return (
    <div className="feature-3d-card features-3d-card-tilt" style={{
      background: "#ffffff",
      borderRadius: 20,
      padding: 26,
      border: "1px solid rgba(28, 42, 94, 0.06)",
      boxShadow: "0 22px 45px rgba(28, 42, 94, 0.10), 0 6px 18px rgba(28, 42, 94, 0.05)",
      transform: tilt,
      transformStyle: "preserve-3d",
      transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease",
      textAlign: side === "right" ? "left" : "left",
    }}>
      <div style={{
        width: 52, height: 52,
        borderRadius: 14,
        background: `linear-gradient(135deg, ${feature.c}1f, ${feature.c}10)`,
        border: `1px solid ${feature.c}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: feature.c,
        marginBottom: 18,
        boxShadow: `0 8px 20px ${feature.c}20`,
      }}>
        {feature.icon}
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#162152", marginBottom: 8, fontFamily: "'Outfit', sans-serif", letterSpacing: -0.3 }}>
        {feature.t}
      </h3>
      <p style={{ color: "#7a86a8", fontSize: 13, lineHeight: 1.65 }}>
        {feature.d}
      </p>
    </div>
  );
}

function TransformationCard({ src }) {
  return (
    <div
      style={{
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)",
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
        cursor: "pointer",
        aspectRatio: "1 / 1",
        background: "#0c1840",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 28px 60px rgba(91, 126, 237, 0.35), 0 8px 20px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 18px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)";
      }}
    >
      <img
        src={src}
        alt="Client transformation"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

const appTransformations = [Trans1, Trans2, Trans3, Trans4, Trans5, Trans6];

function AppPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f9fc" }}>
      {/* ───── HERO ───── */}
      <section style={{
        background: "linear-gradient(135deg, #eef1f9 0%, #f7f9fc 45%, #e6ecf8 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "130px clamp(16px,4vw,60px) 100px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{ position: "absolute", top: -70, left: -90, width: 260, height: 260, borderRadius: "50%", background: "rgba(185, 202, 246, 0.45)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -320, right: -260, width: 820, height: 820, borderRadius: "50%", background: "radial-gradient(circle, rgba(80, 138, 250, 0.22) 0%, rgba(80, 138, 250, 0.08) 50%, transparent 75%)", pointerEvents: "none" }} />

        <AppHeroDots rows={5} cols={7} style={{ top: 110, right: "6%" }} />
        <AppHeroDots rows={5} cols={5} style={{ bottom: 100, left: "4%" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2, width: "100%" }}>
          <div className="r-grid-app" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <div style={{ marginBottom: 56 }}>
                <img src={LogoImage} alt="Transformica" style={{ width: "clamp(96px, 11vw, 140px)", height: "clamp(96px, 11vw, 140px)", objectFit: "contain", display: "block", marginBottom: 16 }} />
                <div style={{ fontSize: "clamp(34px, 3.8vw, 52px)", fontWeight: 700, color: "#1c2a5e", fontFamily: "'Playfair Display', serif", letterSpacing: 5, lineHeight: 1, textTransform: "uppercase" }}>
                  Transformica
                </div>
              </div>

              <h1 style={{ fontSize: "clamp(46px, 6.5vw, 96px)", fontWeight: 800, color: "#162152", lineHeight: 1.02, marginBottom: 28, fontFamily: "'Outfit', sans-serif", letterSpacing: -2 }}>
                Your Health.<br />
                <span style={{ color: "#3a5cd6" }}>Transformed.</span>
              </h1>

              <p style={{ fontSize: "clamp(16px, 1.4vw, 22px)", color: "#7a86a8", fontWeight: 400, fontFamily: "'Outfit', sans-serif", lineHeight: 1.5 }}>
                Track. Improve. Become your best self.
              </p>

              {/* Hero download buttons */}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 36 }}>
                <button
                  onClick={() => window.open("https://play.google.com/store/apps/details?id=com.app.transformica", "_blank")}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 22px 44px rgba(58, 92, 214, 0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 14px 30px rgba(58, 92, 214, 0.35)"; }}
                  style={{
                    background: "linear-gradient(135deg, #3a5cd6, #2540b8)",
                    color: "#fff",
                    border: "none",
                    padding: "15px 30px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    boxShadow: "0 14px 30px rgba(58, 92, 214, 0.35)",
                    transition: "all 0.3s",
                    fontFamily: "'Outfit', sans-serif",
                  }}>
                  <Download size={16} /> Download for Android
                </button>
                <button
                  onClick={() => window.open("https://apps.apple.com/app/transformica/id6757585633", "_blank")}
                  onMouseEnter={e => { e.currentTarget.style.background = "#1c2a5e"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.7)"; e.currentTarget.style.color = "#1c2a5e"; e.currentTarget.style.transform = ""; }}
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    color: "#1c2a5e",
                    border: "2px solid #1c2a5e",
                    padding: "13px 30px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "all 0.3s",
                    fontFamily: "'Outfit', sans-serif",
                    backdropFilter: "blur(10px)",
                  }}>
                  <Download size={16} /> Download for iOS
                </button>
              </div>
            </div>

            <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 600 }}>
              {/* Soft radial glow behind */}
              <div style={{
                position: "absolute",
                width: 480,
                height: 480,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(58, 92, 214, 0.28) 0%, rgba(58, 92, 214, 0.08) 50%, transparent 72%)",
                filter: "blur(20px)",
                zIndex: 0,
                pointerEvents: "none",
              }} />

              {/* Light blue accent circle */}
              <div style={{
                position: "absolute",
                right: "4%",
                bottom: "12%",
                width: 170,
                height: 170,
                borderRadius: "50%",
                background: "rgba(186, 205, 248, 0.45)",
                zIndex: 0,
                pointerEvents: "none",
              }} />

              {/* Subtle gradient curve */}
              <div style={{
                position: "absolute",
                right: "-20%",
                bottom: "-10%",
                width: "85%",
                height: "55%",
                borderRadius: "50% 48% 52% 46%",
                background: "linear-gradient(135deg, rgba(58, 92, 214, 0.55) 0%, rgba(37, 64, 184, 0.4) 100%)",
                zIndex: 1,
                filter: "blur(2px)",
                pointerEvents: "none",
              }} />

              {/* Phone-framed Video — thin bezel, tilted to match phone in video */}
              <div style={{
                position: "relative",
                zIndex: 3,
                maxWidth: 360,
                width: "100%",
                padding: 1,
                borderRadius: 44,
                background: "linear-gradient(145deg, #1c2540 0%, #0a0e1f 100%)",
                transform: "rotate(10deg)",
                boxShadow: "0 50px 100px rgba(20, 35, 90, 0.38), 0 18px 36px rgba(20, 35, 90, 0.2), inset 0 0 0 1px rgba(255,255,255,0.06)",
              }}>
                <video
                  src={AppUiVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={AppUi2Image}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: 42,
                    backgroundColor: "#000",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── 3D FEATURES SECTION ───── */}
      <section style={{
        background: "linear-gradient(180deg, #f7f9fc 0%, #eef2fb 50%, #f7f9fc 100%)",
        padding: "130px clamp(16px,4vw,60px)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(80, 138, 250, 0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <AppHeroDots rows={4} cols={6} style={{ top: 80, left: "5%" }} />
        <AppHeroDots rows={4} cols={6} style={{ bottom: 80, right: "5%" }} />

        <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 90 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 99,
              background: "rgba(58, 92, 214, 0.08)",
              border: "1px solid rgba(58, 92, 214, 0.2)",
              marginBottom: 24,
            }}>
              <Sparkles size={14} style={{ color: "#3a5cd6" }} />
              <span style={{ fontSize: 12, letterSpacing: 3, color: "#3a5cd6", textTransform: "uppercase", fontWeight: 700 }}>
                App Features
              </span>
            </div>
            <h2 style={{
              fontSize: "clamp(38px, 5.5vw, 72px)",
              fontWeight: 800,
              color: "#162152",
              lineHeight: 1.02,
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: -2,
              marginBottom: 18,
            }}>
              Built for serious results.
            </h2>
            <p style={{ color: "#7a86a8", maxWidth: 620, margin: "0 auto", fontSize: 18, lineHeight: 1.7 }}>
              Every feature is engineered to give you measurable progress — AI insights paired with real human coaching.
            </p>
          </div>

          {/* 3D Phone-centered layout */}
          <div style={{ perspective: 1800 }}>
            <div className="features-3d-grid" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.05fr 1fr",
              gap: 40,
              alignItems: "center",
              transformStyle: "preserve-3d",
            }}>
              {/* Left column */}
              <div className="features-3d-col" style={{ display: "flex", flexDirection: "column", gap: 24, transformStyle: "preserve-3d" }}>
                {appFeatures.slice(0, 3).map((f, i) => (
                  <Feature3DCard
                    key={i}
                    feature={f}
                    side="left"
                    tilt={`rotateY(11deg) rotateX(${i === 1 ? 0 : i === 0 ? 3 : -3}deg) translateZ(20px)`}
                  />
                ))}
              </div>

              {/* Center phone */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                transformStyle: "preserve-3d",
              }}>
                {/* Glow */}
                <div style={{
                  position: "absolute",
                  width: "85%",
                  height: "85%",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(58, 92, 214, 0.35) 0%, rgba(58, 92, 214, 0.1) 50%, transparent 75%)",
                  filter: "blur(20px)",
                  pointerEvents: "none",
                }} />
                {/* Floating accent rings */}
                <div style={{
                  position: "absolute",
                  width: "115%",
                  height: "115%",
                  borderRadius: "50%",
                  border: "1px dashed rgba(58, 92, 214, 0.25)",
                  animation: "spinOrbit 30s linear infinite",
                  pointerEvents: "none",
                }} />

                <div style={{
                  position: "relative",
                  zIndex: 2,
                  transform: "translateZ(80px)",
                  filter: "drop-shadow(0 45px 70px rgba(20, 35, 90, 0.32))",
                  maxWidth: 320,
                  width: "100%",
                }}>
                  <img src={AppUi2Image} alt="Transformica App" style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: 36,
                  }} />
                </div>

                {/* Floating badges */}
                <div className="t-float" style={{
                  position: "absolute",
                  top: "12%",
                  left: "-10%",
                  background: "#ffffff",
                  padding: "10px 14px",
                  borderRadius: 12,
                  boxShadow: "0 16px 32px rgba(28, 42, 94, 0.12)",
                  border: "1px solid rgba(28, 42, 94, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  zIndex: 3,
                  animationDelay: "0.5s",
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(34, 217, 126, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22d97e" }}>
                    <Flame size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: "#7a86a8", letterSpacing: 1, fontWeight: 700, textTransform: "uppercase" }}>Streak</div>
                    <div style={{ fontSize: 13, color: "#162152", fontWeight: 800 }}>14 Days</div>
                  </div>
                </div>

                <div className="t-float" style={{
                  position: "absolute",
                  bottom: "16%",
                  right: "-12%",
                  background: "#ffffff",
                  padding: "10px 14px",
                  borderRadius: 12,
                  boxShadow: "0 16px 32px rgba(28, 42, 94, 0.12)",
                  border: "1px solid rgba(28, 42, 94, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  zIndex: 3,
                  animationDelay: "1.2s",
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(58, 92, 214, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3a5cd6" }}>
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: "#7a86a8", letterSpacing: 1, fontWeight: 700, textTransform: "uppercase" }}>Progress</div>
                    <div style={{ fontSize: 13, color: "#162152", fontWeight: 800 }}>+24%</div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="features-3d-col" style={{ display: "flex", flexDirection: "column", gap: 24, transformStyle: "preserve-3d" }}>
                {appFeatures.slice(3, 6).map((f, i) => (
                  <Feature3DCard
                    key={i}
                    feature={f}
                    side="right"
                    tilt={`rotateY(-11deg) rotateX(${i === 1 ? 0 : i === 0 ? 3 : -3}deg) translateZ(20px)`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── STATS + DOWNLOAD ───── */}
      <section style={{
        background: "#f7f9fc",
        padding: "100px clamp(16px,4vw,60px) 120px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(80, 138, 250, 0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 99,
            background: "rgba(58, 92, 214, 0.08)",
            border: "1px solid rgba(58, 92, 214, 0.2)",
            marginBottom: 24,
          }}>
            <Download size={14} style={{ color: "#3a5cd6" }} />
            <span style={{ fontSize: 12, letterSpacing: 3, color: "#3a5cd6", textTransform: "uppercase", fontWeight: 700 }}>
              Get the app
            </span>
          </div>

          <h2 style={{
            fontSize: "clamp(34px, 5vw, 64px)",
            fontWeight: 800,
            color: "#162152",
            marginBottom: 18,
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: -2,
            lineHeight: 1.02,
          }}>
            Download Transformica.
          </h2>
          <p style={{ color: "#7a86a8", fontSize: 18, marginBottom: 48, maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
            Available on iOS and Android. Start tracking workouts, meals and recovery today.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "center", marginBottom: 56 }}>
            {[["4.9 ★", "App Store Rating"], ["50k+", "Workouts Logged"], ["60k+", "Meals Logged"]].map(([value, label]) => (
              <div key={label} style={{
                minWidth: 200,
                padding: "26px 30px",
                borderRadius: 22,
                background: "#ffffff",
                border: "1px solid rgba(28, 42, 94, 0.06)",
                boxShadow: "0 14px 36px rgba(28, 42, 94, 0.08)",
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 42,
                  background: "linear-gradient(135deg, #3a5cd6, #2540b8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 4,
                  letterSpacing: 1,
                  lineHeight: 1,
                }}>{value}</div>
                <div style={{ fontSize: 11, color: "#7a86a8", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Download buttons (light) */}
          <div style={{ display: "inline-flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => window.open("https://play.google.com/store/apps/details?id=com.app.transformica", "_blank")}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 22px 44px rgba(58, 92, 214, 0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 14px 30px rgba(58, 92, 214, 0.35)"; }}
              style={{
                background: "linear-gradient(135deg, #3a5cd6, #2540b8)",
                color: "#fff",
                border: "none",
                padding: "16px 32px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 14px 30px rgba(58, 92, 214, 0.35)",
                transition: "all 0.3s",
                fontFamily: "'Outfit', sans-serif",
              }}>
              Download for Android <ArrowRight size={16} />
            </button>
            <button onClick={() => window.open("https://apps.apple.com/app/transformica/id6757585633", "_blank")}
              onMouseEnter={e => { e.currentTarget.style.background = "#1c2a5e"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#1c2a5e"; e.currentTarget.style.transform = ""; }}
              style={{
                background: "#ffffff",
                color: "#1c2a5e",
                border: "2px solid #1c2a5e",
                padding: "14px 32px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                transition: "all 0.3s",
                fontFamily: "'Outfit', sans-serif",
              }}>
              Download for iOS <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ───── CLIENT TRANSFORMATIONS (dark feature panel) ───── */}
      <section style={{
        background: "linear-gradient(135deg, #0a1235 0%, #0f1c52 50%, #0a1235 100%)",
        padding: "120px clamp(16px,4vw,60px)",
        position: "relative",
        overflow: "hidden",
        color: "#fff",
      }}>
        {/* Curved decorative lines */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 280, opacity: 0.18, pointerEvents: "none" }}>
          <svg viewBox="0 0 1400 280" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0,140 Q350,70 700,140 T1400,140" stroke="#5b7eed" strokeWidth="2" fill="none" />
            <path d="M0,180 Q350,110 700,180 T1400,180" stroke="#5b7eed" strokeWidth="2" fill="none" />
            <path d="M0,220 Q350,150 700,220 T1400,220" stroke="#5b7eed" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Faint athlete silhouette */}
        <div style={{
          position: "absolute",
          top: "8%",
          left: "10%",
          opacity: 0.06,
          pointerEvents: "none",
        }}>
          <Dumbbell size={400} style={{ color: "#5b7eed" }} />
        </div>

        <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="transformations-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.25fr",
            gap: 70,
            alignItems: "center",
            marginBottom: 70,
          }}>
            {/* LEFT */}
            <div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(48px, 7.5vw, 104px)",
                color: "#fff",
                lineHeight: 0.95,
                letterSpacing: 3,
                marginBottom: 4,
              }}>
                TOTAL BODY<br />
                <span style={{ color: "#5b7eed" }}>RECOMPOSITION.</span>
              </h2>
              <div style={{
                width: 90, height: 3,
                background: "linear-gradient(90deg, #22d97e, #5b7eed)",
                marginTop: 22,
                marginBottom: 28,
                borderRadius: 2,
              }} />
              <p style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.7)",
                fontStyle: "italic",
                marginBottom: 40,
                maxWidth: 420,
                lineHeight: 1.5,
                fontFamily: "'Outfit', sans-serif",
              }}>
                Building strength while<br />simultaneously losing fat.
              </p>
              <button onClick={() => window.open(WHATSAPP_URL, "_blank")}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 22px 44px rgba(34, 217, 126, 0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 14px 30px rgba(34, 217, 126, 0.35)"; }}
                style={{
                  background: "linear-gradient(90deg, #22d97e, #00c8ff)",
                  color: "#fff",
                  border: "none",
                  padding: "18px 36px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 14px 30px rgba(34, 217, 126, 0.35)",
                  transition: "all 0.3s",
                  fontFamily: "'Outfit', sans-serif",
                }}>
                SEE RESULTS <ArrowRight size={16} />
              </button>
            </div>

            {/* RIGHT — Transformations */}
            <div className="trans-grid" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}>
              {appTransformations.map((src, i) => (
                <TransformationCard key={i} src={src} />
              ))}
            </div>
          </div>

          {/* 4 pillars */}
          <div style={{
            paddingTop: 44,
            borderTop: "1px solid rgba(255,255,255,0.12)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 30,
          }}>
            {[
              { icon: <Dumbbell size={22} />, label: "Personalized Training" },
              { icon: <Apple size={22} />, label: "Nutrition That Works" },
              { icon: <BarChart3 size={22} />, label: "Measurable Results" },
              { icon: <Users size={22} />, label: "Expert Coaching & Support" },
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 12,
                  background: "rgba(34, 217, 126, 0.12)",
                  border: "1px solid rgba(34, 217, 126, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#22d97e",
                  flexShrink: 0,
                }}>{p.icon}</div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: 1.4,
                  lineHeight: 1.3,
                  fontFamily: "'Outfit', sans-serif",
                }}>
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── SUPPLEMENTS PAGE ─────────────────────────── */
const PEPTIDE_COLOR = "#fbbf24"; // amber for peptides

const DEFAULT_SUPPLEMENTS = [
  // ─── Whey Protein ───
  { id: "whey-001", name: "Gold Standard 100% Whey", brand: "Optimum Nutrition", price: "₹3,299", category: "Whey Protein", tag: "Best Seller", color: C.cyan, image: null, flavours: ["Double Rich Chocolate", "Vanilla Ice Cream", "Strawberry", "Cookies & Cream"], benefits: ["24g whey protein", "Rapid recovery", "Low sugar", "Trusted formula"] },
  { id: "whey-002", name: "ISO 100 Whey Protein", brand: "Dymatize", price: "₹3,799", category: "Whey Protein", tag: "Premium", color: C.cyan, image: null, flavours: ["Gourmet Chocolate", "Birthday Cake", "Cinnamon Bun", "Vanilla"], benefits: ["Hydrolyzed whey isolate", "Fast digestion", "0g fat", "Great for cutting"] },
  { id: "whey-003", name: "Whey Protein Plus", brand: "MuscleBlaze", price: "₹2,499", category: "Whey Protein", tag: "Value", color: C.cyan, image: null, flavours: ["Rich Milk Chocolate", "Mango", "Strawberry", "Café Mocha"], benefits: ["25g protein", "Enhanced BCAAs", "Great taste", "Sustained energy"] },
  { id: "whey-004", name: "Impact Whey Protein", brand: "MyProtein", price: "₹2,199", category: "Whey Protein", tag: "Popular", color: C.cyan, image: null, flavours: ["Chocolate Smooth", "Banana", "Vanilla", "Salted Caramel", "Cookies & Cream"], benefits: ["20g protein", "30+ flavours", "Low carbs", "Muscle support"] },
  { id: "whey-005", name: "Performance Whey", brand: "Ultimate Nutrition", price: "₹3,199", category: "Whey Protein", tag: "Muscle", color: C.cyan, image: null, flavours: ["Chocolate Crème", "French Vanilla", "Strawberry"], benefits: ["High protein", "Great mixability", "Muscle recovery", "Low lactose"] },
  { id: "whey-006", name: "Whey Advanced", brand: "Gaspari", price: "₹3,599", category: "Whey Protein", tag: "Strength", color: C.cyan, image: null, flavours: ["Chocolate", "Vanilla", "Cookies & Cream"], benefits: ["20g protein", "Added amino acids", "Lean gains", "Premium formula"] },

  // ─── Creatine ───
  { id: "creatine-001", name: "Micronized Creatine", brand: "Optimum Nutrition", price: "₹1,199", category: "Creatine", tag: "Strength", color: C.violet, image: null, flavours: ["Unflavoured"], benefits: ["5g creatine", "Pure micronized", "Faster uptake", "Improves power"] },
  { id: "creatine-002", name: "Creatine Monohydrate", brand: "Thorne Research", price: "₹1,499", category: "Creatine", tag: "Certified", color: C.violet, image: null, flavours: ["Unflavoured"], benefits: ["High purity", "No fillers", "Endurance boost", "Muscle strength"] },
  { id: "creatine-003", name: "Creatine HCL", brand: "MuscleTech", price: "₹1,699", category: "Creatine", tag: "Fast Absorb", color: C.violet, image: null, flavours: ["Unflavoured", "Fruit Punch"], benefits: ["Superior solubility", "Less bloat", "Power gains", "Stamina support"] },
  { id: "creatine-004", name: "Creatine Complex", brand: "MyProtein", price: "₹1,399", category: "Creatine", tag: "Combo", color: C.violet, image: null, flavours: ["Unflavoured", "Berry Burst", "Lemon"], benefits: ["Loaded with creatine", "Carb recovery", "Supports strength", "Daily formula"] },
  { id: "creatine-005", name: "Peak Creatine", brand: "Cellucor", price: "₹1,599", category: "Creatine", tag: "Elite", color: C.violet, image: null, flavours: ["Unflavoured"], benefits: ["2100mg CEE", "Muscle pump", "Fast strength", "Premium delivery"] },
  { id: "creatine-006", name: "Creatine Focus", brand: "Transparent Labs", price: "₹1,799", category: "Creatine", tag: "Pure", color: C.violet, image: null, flavours: ["Unflavoured"], benefits: ["100% creatine", "No artificial sweeteners", "Strength support", "Recovery aid"] },

  // ─── Pre Workout ───
  { id: "pre-001", name: "Pulse Pre-Workout", brand: "Legion Pulse", price: "₹2,499", category: "Pre Workout", tag: "Energy", color: "#ff6b8a", image: null, flavours: ["Fruit Punch", "Watermelon", "Blue Raspberry", "Tropical Storm"], benefits: ["350mg caffeine", "Beta-alanine", "L-citrulline", "Pump support"] },
  { id: "pre-002", name: "C4 Original", brand: "Cellucor", price: "₹1,899", category: "Pre Workout", tag: "Popular", color: "#ff6b8a", image: null, flavours: ["Fruit Punch", "Icy Blue Razz", "Pink Lemonade", "Watermelon"], benefits: ["Explosive energy", "Focus blend", "Strength boost", "Improved endurance"] },
  { id: "pre-003", name: "Pre-Kaged", brand: "Kaged", price: "₹2,999", category: "Pre Workout", tag: "Premium", color: "#ff6b8a", image: null, flavours: ["Fruit Punch", "Berry Blast", "Cherry Bomb"], benefits: ["Clean energy", "Nitric oxide", "Endurance", "Hydration support"] },
  { id: "pre-004", name: "Mr. Hyde", brand: "ProSupps", price: "₹1,699", category: "Pre Workout", tag: "Intense", color: "#ff6b8a", image: null, flavours: ["Tropical Storm", "Blue Razz Popsicle", "Pixie Dust"], benefits: ["High caffeine", "Extreme energy", "Focus boost", "Strength performance"] },
  { id: "pre-005", name: "Pre-Boost", brand: "Optimum", price: "₹2,299", category: "Pre Workout", tag: "Balance", color: "#ff6b8a", image: null, flavours: ["Blueberry Lemonade", "Fruit Punch", "Sour Apple"], benefits: ["Nootropic blend", "Pump enhancers", "Endurance support", "Great taste"] },
  { id: "pre-006", name: "Nitro Surge", brand: "BSN", price: "₹1,799", category: "Pre Workout", tag: "Performance", color: "#ff6b8a", image: null, flavours: ["Cherry Limeade", "Grape", "Strawberry Kiwi"], benefits: ["Energy boost", "Pump enhancement", "Strength support", "Focus complex"] },

  // ─── Multi Vitamins ───
  { id: "multi-001", name: "Multivitamin Pro", brand: "Garden of Life", price: "₹2,199", category: "Multi Vitamins", tag: "Complete", color: C.orange, image: null, flavours: ["Tablet"], benefits: ["30+ nutrients", "Made from whole food", "Immune support", "Energy boost"] },
  { id: "multi-002", name: "One Daily Multi", brand: "Optimum Nutrition", price: "₹1,799", category: "Multi Vitamins", tag: "Daily", color: C.orange, image: null, flavours: ["Tablet"], benefits: ["Balanced nutrition", "Bone support", "Skin health", "Energy formula"] },
  { id: "multi-003", name: "Mega Men", brand: "GNC", price: "₹2,299", category: "Multi Vitamins", tag: "Men's", color: C.orange, image: null, flavours: ["Tablet"], benefits: ["Heart support", "Eye health", "Muscle recovery", "Immune support"] },
  { id: "multi-004", name: "Herbal Multi", brand: "HealthKart", price: "₹1,699", category: "Multi Vitamins", tag: "Natural", color: C.orange, image: null, flavours: ["Tablet"], benefits: ["Plant-based", "Digestive enzymes", "Stress support", "Daily wellness"] },
  { id: "multi-005", name: "Daily Wellness", brand: "Himalaya", price: "₹1,399", category: "Multi Vitamins", tag: "Trusted", color: C.orange, image: null, flavours: ["Tablet"], benefits: ["Essential vitamins", "Mineral support", "Immunity", "Energy focus"] },
  { id: "multi-006", name: "Multi Boost", brand: "Nature's Bounty", price: "₹1,999", category: "Multi Vitamins", tag: "Complete", color: C.orange, image: null, flavours: ["Tablet"], benefits: ["Complete daily blend", "Immune support", "Energy", "Metabolism"] },

  // ─── Peptides (10 oral peptide products) ───
  { id: "pep-001", name: "Marine Collagen Peptides", brand: "Sports Research", price: "₹3,499", category: "Peptides", tag: "Skin & Joints", color: PEPTIDE_COLOR, image: null, flavours: ["Unflavoured", "Lemon"], benefits: ["10g hydrolysed marine collagen", "Type I peptides", "Skin elasticity & hair strength", "Joint comfort support"] },
  { id: "pep-002", name: "Bovine Collagen Peptides", brand: "Vital Proteins", price: "₹2,899", category: "Peptides", tag: "Recovery", color: PEPTIDE_COLOR, image: null, flavours: ["Unflavoured", "Chocolate", "Vanilla"], benefits: ["20g grass-fed collagen", "Type I & III peptides", "Faster muscle recovery", "Bone & joint support"] },
  { id: "pep-003", name: "Creatine Peptides", brand: "MuscleTech", price: "₹1,899", category: "Peptides", tag: "Strength", color: PEPTIDE_COLOR, image: null, flavours: ["Unflavoured", "Fruit Punch"], benefits: ["Bonded peptide form", "Faster absorption than monohydrate", "Lean strength gains", "Reduced water retention"] },
  { id: "pep-004", name: "Glutamine Peptides", brand: "Optimum Nutrition", price: "₹1,799", category: "Peptides", tag: "Recovery", color: PEPTIDE_COLOR, image: null, flavours: ["Unflavoured"], benefits: ["5g glutamine peptides", "Reduces muscle soreness", "Supports gut health", "Boosts immunity"] },
  { id: "pep-005", name: "Whey Protein Hydrolysate", brand: "Dymatize", price: "₹4,199", category: "Peptides", tag: "Rapid Absorb", color: PEPTIDE_COLOR, image: null, flavours: ["Chocolate", "Vanilla", "Strawberry"], benefits: ["Pre-digested whey peptides", "Fastest absorption rate", "Ideal for post-workout", "30g protein per scoop"] },
  { id: "pep-006", name: "Casein Peptides", brand: "Optimum Nutrition", price: "₹3,499", category: "Peptides", tag: "Sustained Release", color: PEPTIDE_COLOR, image: null, flavours: ["Chocolate", "Vanilla"], benefits: ["Slow-digesting micellar peptides", "8-hour amino release", "Anti-catabolic overnight", "Lean muscle preservation"] },
  { id: "pep-007", name: "BCAA Peptides Plus", brand: "Scivation Xtend", price: "₹2,299", category: "Peptides", tag: "Recovery", color: PEPTIDE_COLOR, image: null, flavours: ["Watermelon Smash", "Blue Raspberry", "Mango Madness"], benefits: ["7g BCAAs in peptide form", "Faster amino delivery", "Reduces fatigue", "Hydration electrolytes"] },
  { id: "pep-008", name: "Beef Protein Peptides", brand: "MuscleMeds Carnivor", price: "₹3,299", category: "Peptides", tag: "Lean Mass", color: PEPTIDE_COLOR, image: null, flavours: ["Chocolate", "Vanilla", "Fruit Punch"], benefits: ["23g beef protein isolate", "Hydrolyzed peptide form", "Lactose-free", "Creatine and BCAAs included"] },
  { id: "pep-009", name: "Pea Protein Peptides", brand: "Naked Nutrition", price: "₹2,599", category: "Peptides", tag: "Vegan", color: PEPTIDE_COLOR, image: null, flavours: ["Unflavoured", "Vanilla", "Chocolate"], benefits: ["27g plant-based peptides", "Allergen-free", "Easy digestion", "Complete amino profile"] },
  { id: "pep-010", name: "Hydrolyzed Collagen Type I & III", brand: "NeoCell Super Collagen", price: "₹2,799", category: "Peptides", tag: "Anti-Aging", color: PEPTIDE_COLOR, image: null, flavours: ["Tablet", "Unflavoured Powder"], benefits: ["6g collagen Type I & III", "Skin firmness & elasticity", "Hair growth support", "Nail strength"] },

  // ─── Others ───
  { id: "other-001", name: "Omega 3 Fish Oil", brand: "Nordic Naturals", price: "₹1,899", category: "Others", tag: "Recovery", color: C.green, image: null, flavours: ["Lemon Softgel", "Unflavoured"], benefits: ["2000mg EPA+DHA", "Heart support", "Brain health", "Joint recovery"] },
  { id: "other-002", name: "BCAA Plus", brand: "Transparent Labs", price: "₹1,699", category: "Others", tag: "Recovery", color: C.green, image: null, flavours: ["Tropical Punch", "Strawberry Lemonade", "Blue Raspberry"], benefits: ["7g BCAAs", "Muscle repair", "Zero sugar", "Hydration support"] },
  { id: "other-003", name: "Glutamine Core", brand: "Dymatize", price: "₹1,499", category: "Others", tag: "Repair", color: C.green, image: null, flavours: ["Unflavoured"], benefits: ["Supports recovery", "Immune health", "Muscle repair", "Strength support"] },
  { id: "other-004", name: "ZMA Night", brand: "MuscleTech", price: "₹1,299", category: "Others", tag: "Sleep", color: C.green, image: null, flavours: ["Capsule"], benefits: ["Sleep support", "Recovery", "Testosterone support", "Muscle growth"] },
  { id: "other-005", name: "CLA Lean", brand: "GNC", price: "₹1,299", category: "Others", tag: "Lean", color: C.green, image: null, flavours: ["Softgel"], benefits: ["Fat metabolism", "Lean support", "Natural blend", "Weight management"] },
  { id: "other-006", name: "Collagen Boost", brand: "Vital Proteins", price: "₹2,199", category: "Others", tag: "Beauty", color: C.green, image: null, flavours: ["Unflavoured", "Lemon", "Berry"], benefits: ["Skin support", "Joint health", "Hair strength", "Recovery"] },
];

/* ─── Supplement store (Supabase-backed) ─── */
const rowToProduct = (r) => ({
  id: r.id,
  name: r.name,
  brand: r.brand,
  price: r.price,
  category: r.category,
  tag: r.tag || "",
  color: r.color,
  image: r.image_url || null,
  flavours: r.flavours || [],
  benefits: r.benefits || [],
});

const productToRow = (p) => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  price: p.price,
  category: p.category,
  tag: p.tag || null,
  color: p.color,
  image_url: p.image || null,
  flavours: p.flavours || [],
  benefits: p.benefits || [],
});

function useSupplementsStore() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) { setError(error.message); setLoading(false); return; }
    setItems((data || []).map(rowToProduct));
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("products-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const add = async (product) => {
    const id = product.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const { error } = await supabase.from("products").insert(productToRow({ ...product, id }));
    if (error) throw error;
    await refresh();
  };

  const update = async (id, patch) => {
    const { error } = await supabase.from("products").update(productToRow({ ...patch, id })).eq("id", id);
    if (error) throw error;
    await refresh();
  };

  const remove = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    await refresh();
  };

  return { items, loading, error, add, update, remove, refresh };
}

/* ─── Auth hook ─── */
function useAuth() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  return { session, ready };
}

function SupplementsPage() {
  const [category, setCategory] = useState(SUPPLEMENT_CATEGORIES[0]);
  const { items, loading, error } = useSupplementsStore();
  const filtered = items.filter((s) => s.category === category);

  const productMessage = (s) =>
    waWithMessage(`Hi Coach, I want to enquire about ${s.name} (${s.brand}) — priced ${s.price}.`);

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <section style={{ padding: "60px clamp(16px,4vw,60px) 100px", position: "relative", overflow: "hidden" }}>
        <GlowOrb size={500} color={C.orange} style={{ top: -100, right: -100 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 12, letterSpacing: 4, color: C.orange, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Supplements</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px,6vw,72px)", letterSpacing: 3, marginBottom: 16, lineHeight: 1 }}>
              TRANSFORMICA SUPPLEMENTS LAB
            </h1>
            <p style={{ color: C.textMuted, fontSize: 16, maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.7 }}>
              Choose the right supplement for your goal with category filters, premium formulas, and expert-backed product recommendations.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 40 }}>
            {SUPPLEMENT_CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{
                  padding: "10px 18px", borderRadius: 999, border: `1px solid ${category === cat ? C.cyan : "rgba(255,255,255,0.12)"}`,
                  background: category === cat ? "rgba(0,200,255,0.12)" : "rgba(255,255,255,0.03)", color: C.textPrimary,
                  cursor: "pointer", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.2,
                  fontFamily: "'Outfit', sans-serif",
                }}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: C.textMuted }}>
              Loading products…
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#ff6b8a" }}>
              Couldn't load products: {error}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: C.textMuted }}>
              No products in this category yet.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 20 }}>
              {filtered.map((s) => (
                <TiltCard key={s.id || s.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  {/* Product image */}
                  <div style={{
                    width: "100%",
                    aspectRatio: "16 / 11",
                    background: s.image ? "#000" : `linear-gradient(135deg, ${s.color}25, ${s.color}08)`,
                    borderBottom: `1px solid ${s.color}25`,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}>
                    {s.image ? (
                      <img src={s.image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Package size={64} style={{ color: s.color, opacity: 0.5 }} />
                    )}
                    {s.tag && (
                      <span style={{
                        position: "absolute", top: 12, right: 12,
                        background: s.color, color: "#fff",
                        fontSize: 10, fontWeight: 700, letterSpacing: 1,
                        padding: "4px 10px", borderRadius: 99,
                        textTransform: "uppercase",
                      }}>
                        {s.tag}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: 22, display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, letterSpacing: 1, color: s.color, fontWeight: 700, lineHeight: 1.2 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>{s.brand} · {s.category}</div>
                    </div>

                    {/* Benefits */}
                    <div style={{ marginBottom: 14 }}>
                      {(s.benefits || []).slice(0, 3).map((b) => (
                        <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                          <Check size={13} style={{ color: s.color, flexShrink: 0, marginTop: 3 }} />
                          <span style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.5 }}>{b}</span>
                        </div>
                      ))}
                    </div>

                    {/* Flavours */}
                    {s.flavours && s.flavours.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
                          {s.flavours.length === 1 ? "Form" : "Flavours"}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {s.flavours.slice(0, 5).map((f) => (
                            <span key={f} style={{
                              fontSize: 11, padding: "4px 10px", borderRadius: 99,
                              background: `${s.color}15`, color: s.color,
                              border: `1px solid ${s.color}30`, fontWeight: 600,
                            }}>
                              {f}
                            </span>
                          ))}
                          {s.flavours.length > 5 && (
                            <span style={{ fontSize: 11, color: C.textMuted, padding: "4px 6px" }}>+{s.flavours.length - 5} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* Price + CTA */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: s.color, fontWeight: 700 }}>{s.price}</div>
                      <Btn onClick={() => window.open(productMessage(s), "_blank")}>Buy Now</Btn>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── SUPPLEMENTS ADMIN PAGE ─────────────────────────── */
const PRODUCT_COLOR_OPTIONS = [
  { label: "Cyan (Whey)", value: C.cyan },
  { label: "Violet (Creatine)", value: C.violet },
  { label: "Pink (Pre-Workout)", value: "#ff6b8a" },
  { label: "Orange (Vitamins)", value: C.orange },
  { label: "Amber (Peptides)", value: PEPTIDE_COLOR },
  { label: "Green (Others)", value: C.green },
];

const EMPTY_PRODUCT = {
  name: "", brand: "", price: "", category: SUPPLEMENT_CATEGORIES[0],
  tag: "", color: C.cyan, benefits: ["", "", "", ""],
  flavours: [], image: null,
};

function SupplementsAdminPage() {
  const { session, ready } = useAuth();
  if (!ready) return <div style={{ paddingTop: 140, textAlign: "center", color: C.textMuted }}>Loading…</div>;
  if (!session) return <AdminLogin />;
  return <SupplementsAdminPageInner />;
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setErr(error.message);
    setBusy(false);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 8,
    background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
    color: C.textPrimary, fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none",
    marginBottom: 14,
  };

  return (
    <div style={{ paddingTop: 140, minHeight: "100vh" }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ fontSize: 12, letterSpacing: 4, color: C.cyan, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Admin</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, marginBottom: 8 }}>Sign in</h1>
        <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 28 }}>Access the Supplement Manager.</p>
        <form onSubmit={submit}>
          <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          {err && <div style={{ color: "#ff6b8a", fontSize: 13, marginBottom: 14 }}>{err}</div>}
          <Btn onClick={submit} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Btn>
        </form>
      </div>
    </div>
  );
}

function SupplementsAdminPageInner() {
  const store = useSupplementsStore();
  const [editing, setEditing] = useState(null); // null | "new" | productId
  const [filterCat, setFilterCat] = useState("All");
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [flavInput, setFlavInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const startNew = () => {
    setForm(EMPTY_PRODUCT);
    setFlavInput("");
    setEditing("new");
  };
  const startEdit = (product) => {
    setForm({
      ...EMPTY_PRODUCT,
      ...product,
      benefits: [...(product.benefits || []), "", "", "", ""].slice(0, 4),
      flavours: product.flavours || [],
    });
    setFlavInput("");
    setEditing(product.id);
  };
  const cancel = () => { setEditing(null); setForm(EMPTY_PRODUCT); setFlavInput(""); };

  const signOut = async () => { await supabase.auth.signOut(); };

  const save = async () => {
    if (!form.name.trim() || !form.brand.trim() || !form.price.trim()) {
      alert("Name, Brand and Price are required.");
      return;
    }
    const cleanBenefits = form.benefits.map((b) => b.trim()).filter(Boolean);
    const productData = { ...form, benefits: cleanBenefits, flavours: form.flavours.filter(Boolean) };
    setSaving(true);
    try {
      if (editing === "new") await store.add(productData);
      else await store.update(editing, productData);
      cancel();
    } catch (e) {
      alert("Save failed: " + (e.message || e));
    } finally {
      setSaving(false);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Please use a file under 5 MB.");
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop().toLowerCase();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
      setForm((f) => ({ ...f, image: data.publicUrl }));
    } catch (err) {
      alert("Upload failed: " + (err.message || err));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const addFlavour = () => {
    const trimmed = flavInput.trim();
    if (!trimmed) return;
    if (form.flavours.includes(trimmed)) { setFlavInput(""); return; }
    setForm((f) => ({ ...f, flavours: [...f.flavours, trimmed] }));
    setFlavInput("");
  };
  const removeFlavour = (fl) => {
    setForm((f) => ({ ...f, flavours: f.flavours.filter((x) => x !== fl) }));
  };

  const allCats = ["All", ...SUPPLEMENT_CATEGORIES];
  const visible = filterCat === "All" ? store.items : store.items.filter((p) => p.category === filterCat);

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
    color: C.textPrimary, fontSize: 14, fontFamily: "'Outfit', sans-serif",
    outline: "none",
  };
  const labelStyle = { fontSize: 12, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 6, display: "block" };

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <section style={{ padding: "60px clamp(16px,4vw,60px) 100px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: 4, color: C.cyan, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Admin</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(34px,5vw,56px)", letterSpacing: 2, lineHeight: 1.05 }}>
                Supplement Manager
              </h1>
              <p style={{ color: C.textMuted, fontSize: 14, marginTop: 8 }}>
                Add, edit, or remove products. Changes save to your browser (local storage).
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn onClick={startNew}><Plus size={15} /> Add Product</Btn>
              <Btn variant="outline" onClick={signOut}><LogOut size={14} /> Sign out</Btn>
            </div>
          </div>

          {/* Edit form */}
          {editing && (
            <div style={{
              background: C.card, border: `1px solid ${C.cyan}55`, borderRadius: 16,
              padding: "28px clamp(20px, 3vw, 36px)", marginBottom: 36,
              boxShadow: `0 0 40px ${C.cyan}20`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: C.cyan, letterSpacing: 1 }}>
                  {editing === "new" ? "New Product" : "Edit Product"}
                </h2>
                <button onClick={cancel} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer" }}>
                  <X size={22} />
                </button>
              </div>

              {/* Image upload */}
              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle}>Product Image (max 800 KB)</label>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{
                    width: 160, height: 110, borderRadius: 10,
                    background: form.image ? "#000" : `${form.color}15`,
                    border: `1px dashed ${C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", flexShrink: 0,
                  }}>
                    {form.image ? (
                      <img src={form.image} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Camera size={32} style={{ color: form.color, opacity: 0.6 }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                    <Btn variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                      <Camera size={14} /> {uploading ? "Uploading…" : form.image ? "Replace Image" : "Upload Image"}
                    </Btn>
                    {form.image && (
                      <button onClick={() => setForm((f) => ({ ...f, image: null }))}
                        style={{ marginLeft: 10, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>
                        Remove
                      </button>
                    )}
                    <div style={{ marginTop: 10 }}>
                      <input
                        type="text"
                        placeholder="…or paste an image URL"
                        value={form.image && form.image.startsWith("http") ? form.image : ""}
                        onChange={(e) => setForm((f) => ({ ...f, image: e.target.value || null }))}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-column form */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }} className="r-grid-2">
                <div>
                  <label style={labelStyle}>Product Name *</label>
                  <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Brand *</label>
                  <input style={inputStyle} value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Price (e.g., ₹1,999) *</label>
                  <input style={inputStyle} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Tag (e.g., Best Seller)</label>
                  <input style={inputStyle} value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {SUPPLEMENT_CATEGORIES.map((c) => (
                      <option key={c} value={c} style={{ background: C.bg2 }}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Accent Colour</label>
                  <select style={inputStyle} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
                    {PRODUCT_COLOR_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value} style={{ background: C.bg2 }}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Benefits */}
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Benefits (up to 4 short bullets)</label>
                {form.benefits.map((b, i) => (
                  <input
                    key={i}
                    style={{ ...inputStyle, marginBottom: 8 }}
                    placeholder={`Benefit ${i + 1}`}
                    value={b}
                    onChange={(e) => {
                      const next = [...form.benefits];
                      next[i] = e.target.value;
                      setForm({ ...form, benefits: next });
                    }}
                  />
                ))}
              </div>

              {/* Flavours */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Flavours / Forms</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="Add a flavour and press Enter (e.g., Chocolate)"
                    value={flavInput}
                    onChange={(e) => setFlavInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFlavour(); } }}
                  />
                  <Btn variant="outline" onClick={addFlavour}>Add</Btn>
                </div>
                {form.flavours.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {form.flavours.map((f) => (
                      <span key={f} style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        fontSize: 12, padding: "6px 10px 6px 12px", borderRadius: 99,
                        background: `${form.color}18`, color: form.color,
                        border: `1px solid ${form.color}40`, fontWeight: 600,
                      }}>
                        {f}
                        <button onClick={() => removeFlavour(f)} style={{ background: "none", border: "none", color: form.color, cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Save / Cancel */}
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <Btn variant="outline" onClick={cancel} disabled={saving}>Cancel</Btn>
                <Btn onClick={save} disabled={saving || uploading}>
                  {saving ? "Saving…" : editing === "new" ? "Add Product" : "Save Changes"}
                </Btn>
              </div>
            </div>
          )}

          {/* Filter chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
            {allCats.map((cat) => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                style={{
                  padding: "8px 16px", borderRadius: 999,
                  border: `1px solid ${filterCat === cat ? C.cyan : "rgba(255,255,255,0.10)"}`,
                  background: filterCat === cat ? "rgba(0,200,255,0.10)" : "rgba(255,255,255,0.02)",
                  color: filterCat === cat ? C.cyan : C.textMuted,
                  cursor: "pointer", fontSize: 12, textTransform: "uppercase", letterSpacing: 1,
                  fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                }}>
                {cat} {cat === "All" ? `(${store.items.length})` : `(${store.items.filter((p) => p.category === cat).length})`}
              </button>
            ))}
          </div>

          {/* Product list */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
            {visible.map((p) => (
              <div key={p.id} style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
                padding: 16, display: "flex", gap: 14,
              }}>
                <div style={{
                  width: 70, height: 70, borderRadius: 10, flexShrink: 0,
                  background: p.image ? "#000" : `${p.color}15`,
                  border: `1px solid ${p.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Package size={28} style={{ color: p.color, opacity: 0.6 }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: p.color, lineHeight: 1.2, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{p.brand} · {p.category}</div>
                  <div style={{ fontSize: 13, color: C.textPrimary, fontWeight: 600, marginBottom: 8 }}>{p.price}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => startEdit(p)}
                      style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: `1px solid ${C.cyan}40`, background: `${C.cyan}10`, color: C.cyan, cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                      Edit
                    </button>
                    <button onClick={async () => {
                        if (!confirm(`Delete "${p.name}"?`)) return;
                        try { await store.remove(p.id); } catch (e) { alert("Delete failed: " + (e.message || e)); }
                      }}
                      style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid #ff6b8a40`, background: "#ff6b8a10", color: "#ff6b8a", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visible.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px", color: C.textMuted }}>
              No products in this category. Click "Add Product" to create one.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── ABOUT PAGE ─────────────────────────── */
function AboutPage() {
  const timeline = [
    { yr: "2022", t: "The Idea", d: "Founded in Noida, UP, with a mission to democratize elite fitness coaching." },
    { yr: "2023", t: "First 500 Members", d: "Grew to 500 transformed members through referrals alone. Zero paid ads." },
    { yr: "2024", t: "Transformica App Launch", d: "Launched our proprietary AI-backed fitness tracking app." },
    { yr: "2025", t: "5,000 Members", d: "Expanded to 12 coaches, 5,000 members, and pan-India supplement delivery." },
    { yr: "2026", t: "The Future", d: "Scaling to 50,000 members with AI-first coaching + global supplement sourcing." },
  ];
  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <section style={{ padding: "60px clamp(16px,4vw,60px) 100px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 12, letterSpacing: 4, color: C.violet, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>About Us</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px,6vw,72px)", letterSpacing: 3, lineHeight: 1, marginBottom: 20 }}>
              WE ARE <span style={{ color: C.violet }}>NOVABLITZ</span><br />SMART FITNESS
            </h1>
            <p style={{ color: C.textMuted, fontSize: 17, maxWidth: 600, margin: "0 auto", lineHeight: 1.8 }}>
              Novablitz Smart Fitness Private Limited was founded in Noida with a singular obsession: making world-class fitness coaching accessible to everyone in India.
            </p>
          </div>

          <div className="r-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }}>
            <TiltCard style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
              <div style={{ color: C.violet, marginBottom: 12 }}><Target size={28} /></div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, letterSpacing: 2, marginBottom: 10 }}>MISSION</h3>
              <p style={{ color: C.textMuted, lineHeight: 1.7, fontSize: 14 }}>To deliver personalized, human-led fitness transformation supported by intelligent technology — making every member feel like they have a world-class coach in their pocket.</p>
            </TiltCard>
            <TiltCard style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
              <div style={{ color: C.cyan, marginBottom: 12 }}><Zap size={28} /></div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, letterSpacing: 2, marginBottom: 10 }}>VISION</h3>
              <p style={{ color: C.textMuted, lineHeight: 1.7, fontSize: 14 }}>To help every person achieve their dream physique and peak performance — regardless of their starting point, location, or budget.</p>
            </TiltCard>
          </div>

          {/* Founder spotlight */}
          <div style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 24,
            padding: "40px clamp(24px, 4vw, 48px)",
            marginBottom: 32,
            position: "relative",
            overflow: "hidden",
          }}>
            <GlowOrb size={350} color={C.violet} style={{ top: -120, right: -60, opacity: 0.25 }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 36, alignItems: "center", position: "relative", zIndex: 1 }}>
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 20px 50px ${C.violet}50`,
                }}>
                  <Award size={64} style={{ color: "#fff" }} />
                </div>
              </div>
              <div style={{ flex: "1 1 320px" }}>
                <div style={{ fontSize: 12, letterSpacing: 4, color: C.violet, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Meet The Founder</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3vw, 36px)", letterSpacing: 1, marginBottom: 16, color: C.textPrimary, lineHeight: 1.2 }}>
                  Built by an Exercise Science Specialist
                </h3>
                <p style={{ color: C.textMuted, lineHeight: 1.8, fontSize: 15, marginBottom: 18 }}>
                  Our founder holds a <strong style={{ color: C.textPrimary }}>Master's degree in Exercise Science</strong> and specializes in <strong style={{ color: C.textPrimary }}>high-performance coaching</strong> and <strong style={{ color: C.textPrimary }}>lifestyle coaching</strong>. With years of hands-on experience training elite athletes and everyday clients alike, he founded Transformica to make scientifically-grounded, personalized coaching accessible to every Indian.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {["MSc Exercise Science", "High-Performance Coach", "Lifestyle Coach"].map((tag) => (
                    <span key={tag} style={{
                      padding: "7px 14px",
                      borderRadius: 99,
                      background: `${C.violet}18`,
                      border: `1px solid ${C.violet}44`,
                      color: C.textPrimary,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Team & credibility stats */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {[
                { icon: <Users size={26} />, n: "10+", l: "Fitness Professionals", c: C.cyan },
                { icon: <Award size={26} />, n: "100%", l: "Certified Trainers", c: C.green },
                { icon: <Apple size={26} />, n: "100%", l: "Registered Dieticians", c: C.orange },
                { icon: <Star size={26} />, n: "5,000+", l: "Lives Transformed", c: C.violet },
              ].map((s, i) => (
                <TiltCard key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, textAlign: "center" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: `${s.c}18`, border: `1px solid ${s.c}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: s.c, margin: "0 auto 14px",
                  }}>
                    {s.icon}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: s.c, fontWeight: 700, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600, marginTop: 8 }}>{s.l}</div>
                </TiltCard>
              ))}
            </div>
          </div>

          {/* Trust signals */}
          <div style={{
            marginBottom: 80,
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 24,
            padding: "36px clamp(20px, 4vw, 40px)",
          }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 12, letterSpacing: 4, color: C.cyan, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Why Trust Us</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 3vw, 34px)", letterSpacing: 1.5, color: C.textPrimary }}>Built on Science. Delivered with Care.</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 22 }}>
              {[
                { icon: <Brain size={20} />, t: "Evidence-Based Programs", d: "Every workout and meal plan is grounded in current exercise science research." },
                { icon: <Heart size={20} />, t: "Holistic Health Approach", d: "We address training, nutrition, sleep, stress and recovery — not just one variable." },
                { icon: <Shield size={20} />, t: "Privacy & Data Security", d: "Your health data is encrypted, secure, and never shared with third parties." },
                { icon: <Check size={20} />, t: "Verified Client Results", d: "Every transformation is documented with measurable, photographic evidence." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${C.cyan}18`, border: `1px solid ${C.cyan}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.cyan, flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: C.textPrimary }}>{item.t}</div>
                    <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <SectionHeader label="Journey" title="OUR STORY SO FAR" />
          <div style={{ position: "relative", paddingLeft: 40 }}>
            <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${C.cyan}, ${C.violet})`, borderRadius: 1 }} />
            {timeline.map((item, i) => (
              <div key={i} style={{ position: "relative", marginBottom: 36 }}>
                <div style={{
                  position: "absolute", left: -34, width: 18, height: 18, borderRadius: "50%",
                  background: i < 4 ? C.cyan : C.violet, border: `3px solid ${C.bg}`,
                  boxShadow: `0 0 10px ${i < 4 ? C.cyan : C.violet}60`,
                }} />
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: C.cyan, letterSpacing: 2, marginBottom: 4 }}>{item.yr}</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{item.t}</h4>
                <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── FITNESS TEST ─────────────────────────── */
const questions = [
  { q: "How often do you currently exercise?", opts: ["Never", "1–2× per week", "3–4× per week", "5+ times per week"], pts: [0, 1, 2, 3] },
  { q: "What is your primary fitness goal?", opts: ["Lose fat", "Build muscle", "Improve endurance", "General health"], pts: [1, 1, 1, 1] },
  { q: "How would you rate your current diet?", opts: ["Poor (lots of junk food)", "Average (some processed food)", "Good (mostly whole foods)", "Excellent (very clean)"], pts: [0, 1, 2, 3] },
  { q: "How many hours of sleep do you get per night?", opts: ["Less than 5 hrs", "5–6 hrs", "7–8 hrs", "More than 8 hrs"], pts: [0, 1, 3, 2] },
  { q: "How would you describe your daily stress level?", opts: ["Very high", "High", "Moderate", "Low"], pts: [0, 1, 2, 3] },
  { q: "How much time can you dedicate to workouts daily?", opts: ["Less than 30 min", "30–45 min", "45–60 min", "60+ min"], pts: [0, 1, 2, 3] },
  { q: "Do you have access to gym equipment?", opts: ["No equipment at all", "Basic home setup", "Home gym", "Full gym access"], pts: [0, 1, 2, 3] },
];

function FitnessTestPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [goal, setGoal] = useState("");

  const handleSelect = (i) => setSelected(i);

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    if (step === 1) setGoal(questions[1].opts[selected]);
    if (step < questions.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
      setSelected(null);
    } else {
      const score = newAnswers.reduce((acc, a, i) => acc + questions[i].pts[a], 0);
      let level, plan, rec;
      if (score <= 7) { level = "Beginner"; plan = "Transformica Lite"; rec = 45; }
      else if (score <= 14) { level = "Intermediate"; plan = "Transformica Pro"; rec = 62; }
      else { level = "Advanced"; plan = "Transformica Pro Max"; rec = 81; }
      const nextResult = { score, level, plan, rec, goal: questions[1].opts[newAnswers[1]] };
      setAnswers(newAnswers);
      setSelected(null);
      setResult(nextResult);
      saveFitnessResult(nextResult);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setResult(null);
    setGoal("");
  };

  const QUESTION_LABELS = [
    "Exercise frequency",
    "Primary goal",
    "Diet quality",
    "Sleep per night",
    "Stress level",
    "Workout time/day",
    "Equipment access",
  ];

  const buildWhatsAppMessage = () => {
    const answerLines = answers.map((a, i) => `${i + 1}. ${QUESTION_LABELS[i]}: ${questions[i].opts[a]}`).join("\n");
    return [
      "Hi Coach! I just completed the Transformica Fitness Test.",
      "",
      "*MY RESULTS*",
      `• Level: ${result.level}`,
      `• Score: ${result.score}/18`,
      `• Detected Goal: ${result.goal}`,
      `• Recommended Plan: ${result.plan}`,
      "",
      "*MY ANSWERS*",
      answerLines,
      "",
      `I'd like to get started with the ${result.plan} plan. Please guide me through the next steps!`,
    ].join("\n");
  };

  const radarData = result ? [
    { sub: "Exercise", val: (answers[0] / 3) * 100 },
    { sub: "Nutrition", val: (answers[2] / 3) * 100 },
    { sub: "Sleep", val: (answers[3] / 3) * 100 },
    { sub: "Stress Mgmt", val: (answers[4] / 3) * 100 },
    { sub: "Time", val: (answers[5] / 3) * 100 },
    { sub: "Equipment", val: (answers[6] / 3) * 100 },
  ] : [];

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px clamp(16px,4vw,60px)" }}>
      <div style={{ maxWidth: 680, width: "100%", margin: "0 auto" }}>
        {!result ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 12, letterSpacing: 4, color: C.cyan, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Free Assessment</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,5vw,58px)", letterSpacing: 3, marginBottom: 12 }}>FITNESS LEVEL TEST</h1>
              <p style={{ color: C.textMuted }}>7 questions · Takes 2 minutes · Get your personalized plan</p>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textMuted, marginBottom: 8 }}>
                <span>Question {step + 1} of {questions.length}</span>
                <span>{Math.round(((step) / questions.length) * 100)}% complete</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                <div style={{ width: `${(step / questions.length) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, borderRadius: 2, transition: "width 0.4s ease" }} />
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 36 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 28, lineHeight: 1.4 }}>{questions[step].q}</h2>
              {questions[step].opts.map((opt, i) => (
                <button key={i} onClick={() => handleSelect(i)}
                  className={`quiz-option ${selected === i ? "selected" : ""}`}
                  style={{
                    display: "block", width: "100%", background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${selected === i ? C.cyan : C.border}`,
                    borderRadius: 10, padding: "14px 18px", marginBottom: 10,
                    color: selected === i ? C.textPrimary : C.textMuted,
                    textAlign: "left", cursor: "pointer", fontSize: 14,
                    fontFamily: "'Outfit'", transition: "all 0.2s",
                    fontWeight: selected === i ? 600 : 400,
                  }}>
                  {opt}
                </button>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                {step > 0 && <Btn variant="outline" onClick={() => { setStep(step - 1); setSelected(answers[step - 1]); setAnswers(answers.slice(0, -1)); }}>Back</Btn>}
                <Btn onClick={handleNext} style={{ marginLeft: "auto" }} disabled={selected === null}>
                  {step === questions.length - 1 ? "Get My Results" : "Next"} <ArrowRight size={16} />
                </Btn>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, letterSpacing: 4, color: C.green, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Your Results</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,5vw,58px)", letterSpacing: 3, marginBottom: 8 }}>
              YOU'RE A <span style={{ color: C.cyan }}>{result.level.toUpperCase()}</span>
            </h1>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 80, color: C.cyan, lineHeight: 1, marginBottom: 8 }}>{result.score}</div>
            <div style={{ color: C.textMuted, marginBottom: 32 }}>out of 18 fitness points</div>

            <div className="r-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, textAlign: "left" }}>
                <div style={{ fontSize: 12, color: C.textMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Goal Detected</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.cyan }}>{result.goal}</div>
              </div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, textAlign: "left" }}>
                <div style={{ fontSize: 12, color: C.textMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Recommended Plan</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.green }}>{result.plan}</div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>Your Fitness Profile</div>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="sub" tick={{ fill: C.textMuted, fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="You" dataKey="val" stroke={C.cyan} fill={C.cyan} fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn onClick={() => window.open(waWithMessage(buildWhatsAppMessage()), "_blank")}>
                Start My {result.plan} Plan on WhatsApp <ArrowRight size={16} />
              </Btn>
              <Btn variant="outline" onClick={reset}>Retake Test</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── PRIVACY POLICY PAGE ─────────────────────────── */
function LegalSection({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(22px, 2.6vw, 30px)",
        color: C.cyan,
        letterSpacing: 1,
        marginBottom: 14,
        lineHeight: 1.2,
      }}>
        {title}
      </h2>
      <div style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <section style={{ padding: "60px clamp(16px,4vw,60px) 100px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, letterSpacing: 4, color: C.cyan, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Legal</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px, 5vw, 64px)", letterSpacing: 2, lineHeight: 1.05, marginBottom: 18 }}>
              Privacy Policy
            </h1>
            <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7 }}>
              Last updated: 15 May 2026 · This Privacy Policy describes how Novablitz Smart Fitness Pvt Ltd ("Transformica", "we", "us", "our") collects, uses, and protects your information when you use our website, mobile application, and services.
            </p>
          </div>

          <LegalSection title="1. Information We Collect">
            <p style={{ marginBottom: 12 }}>We collect the following categories of information when you interact with our services:</p>
            <ul style={{ paddingLeft: 22, marginBottom: 12 }}>
              <li style={{ marginBottom: 8 }}><strong style={{ color: C.textPrimary }}>Personal information:</strong> name, email address, phone number, age, gender, city, and (where you provide them) photographs of your physical progress.</li>
              <li style={{ marginBottom: 8 }}><strong style={{ color: C.textPrimary }}>Health & fitness data:</strong> height, weight, body measurements, medical history you choose to share, dietary preferences, exercise history, sleep, and activity data.</li>
              <li style={{ marginBottom: 8 }}><strong style={{ color: C.textPrimary }}>Payment information:</strong> processed by third-party payment gateways. We do not store your full card details on our servers.</li>
              <li style={{ marginBottom: 8 }}><strong style={{ color: C.textPrimary }}>Device & usage data:</strong> IP address, browser type, device identifiers, pages visited, session duration, and click activity.</li>
              <li><strong style={{ color: C.textPrimary }}>Marketing data:</strong> interactions with our ads, source of referral, and conversion events.</li>
            </ul>
          </LegalSection>

          <LegalSection title="2. How We Use Your Information">
            <ul style={{ paddingLeft: 22 }}>
              <li style={{ marginBottom: 8 }}>To deliver and personalise the diet, workout, and coaching services you subscribe to.</li>
              <li style={{ marginBottom: 8 }}>To process payments, send service updates, and provide customer support.</li>
              <li style={{ marginBottom: 8 }}>To send marketing communications about our products, promotions, and content (you may opt out any time).</li>
              <li style={{ marginBottom: 8 }}>To measure the performance of our website, app, and advertising campaigns.</li>
              <li style={{ marginBottom: 8 }}>To prevent fraud, debug issues, and improve our services.</li>
              <li>To comply with applicable laws and respond to lawful requests from authorities.</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Cookies, Pixels & Tracking Technologies">
            <p style={{ marginBottom: 12 }}>We use cookies and similar technologies on our website and app to enable core functionality, remember your preferences, analyse traffic, and personalise content. We also use the following third-party tracking technologies:</p>
            <ul style={{ paddingLeft: 22, marginBottom: 12 }}>
              <li style={{ marginBottom: 8 }}><strong style={{ color: C.textPrimary }}>Meta (Facebook) Pixel:</strong> to measure ad performance, build custom audiences, and show you relevant ads on Facebook and Instagram.</li>
              <li style={{ marginBottom: 8 }}><strong style={{ color: C.textPrimary }}>Google Analytics & Google Ads:</strong> to understand site usage and run conversion-tracked ads on Google services.</li>
              <li>Other industry-standard analytics SDKs inside our mobile application.</li>
            </ul>
            <p>You can control cookies via your browser settings and opt out of personalised ads through your Facebook and Google ad-preference dashboards. Disabling cookies may affect website functionality.</p>
          </LegalSection>

          <LegalSection title="4. Sharing of Information">
            <p style={{ marginBottom: 12 }}>We do not sell your personal information. We share data only in these limited circumstances:</p>
            <ul style={{ paddingLeft: 22 }}>
              <li style={{ marginBottom: 8 }}><strong style={{ color: C.textPrimary }}>Service providers:</strong> hosting, analytics, payment, communication (WhatsApp, email/SMS providers), and customer-support tools that process data on our behalf under strict confidentiality.</li>
              <li style={{ marginBottom: 8 }}><strong style={{ color: C.textPrimary }}>Advertising partners:</strong> Meta, Google and similar platforms receive hashed identifiers and conversion events to optimise the ads we run.</li>
              <li style={{ marginBottom: 8 }}><strong style={{ color: C.textPrimary }}>Legal & safety:</strong> when required by law, court order, or to protect rights, property, and safety.</li>
              <li><strong style={{ color: C.textPrimary }}>Business transfers:</strong> in case of a merger, acquisition, or asset sale, where data may be transferred subject to this Policy.</li>
            </ul>
          </LegalSection>

          <LegalSection title="5. Your Rights">
            <ul style={{ paddingLeft: 22 }}>
              <li style={{ marginBottom: 8 }}>Access the personal information we hold about you.</li>
              <li style={{ marginBottom: 8 }}>Request correction or deletion of your data.</li>
              <li style={{ marginBottom: 8 }}>Withdraw consent for marketing communications at any time.</li>
              <li style={{ marginBottom: 8 }}>Request a copy of your data in a machine-readable format.</li>
              <li>Lodge a complaint with the relevant data protection authority.</li>
            </ul>
            <p style={{ marginTop: 12 }}>To exercise these rights, contact us at <strong style={{ color: C.cyan }}>support@transformica.in</strong>. We will respond within 30 days.</p>
          </LegalSection>

          <LegalSection title="6. Data Security">
            <p>We implement reasonable administrative, technical, and physical safeguards designed to protect your information from unauthorised access, alteration, disclosure, or destruction. These measures include encryption in transit (HTTPS), restricted access controls, and regular security reviews. No system, however, is 100% secure; you use our services at your own risk.</p>
          </LegalSection>

          <LegalSection title="7. Data Retention">
            <p>We retain your personal information for as long as your account is active and for a reasonable period thereafter to comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account and associated data at any time, subject to applicable retention requirements.</p>
          </LegalSection>

          <LegalSection title="8. Children's Privacy">
            <p>Our services are intended for users aged 18 and above. We do not knowingly collect personal information from children under 18. If you believe a minor has provided us information, please contact us so we can delete it promptly.</p>
          </LegalSection>

          <LegalSection title="9. International Transfers">
            <p>Your information is primarily stored on servers located in India. Where data is processed outside India by our service providers, we take steps to ensure equivalent protection through contractual and technical safeguards.</p>
          </LegalSection>

          <LegalSection title="10. Updates to This Policy">
            <p>We may update this Privacy Policy from time to time. The "Last updated" date at the top reflects the latest revision. Material changes will be notified through the website or email.</p>
          </LegalSection>

          <LegalSection title="11. Contact Us">
            <p>For any questions about this Privacy Policy or our data practices, please reach out to:</p>
            <p style={{ marginTop: 12, color: C.textPrimary }}>
              <strong>Novablitz Smart Fitness Pvt Ltd</strong><br />
              Email: <a href="mailto:support@transformica.in" style={{ color: C.cyan }}>support@transformica.in</a><br />
              Phone: +91 9899901124 / +91 8595432548<br />
              Registered office: Noida Sector 132, Uttar Pradesh, India
            </p>
          </LegalSection>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── TERMS & CONDITIONS PAGE ─────────────────────────── */
function TermsPage() {
  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <section style={{ padding: "60px clamp(16px,4vw,60px) 100px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, letterSpacing: 4, color: C.cyan, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Legal</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px, 5vw, 64px)", letterSpacing: 2, lineHeight: 1.05, marginBottom: 18 }}>
              Terms & Conditions
            </h1>
            <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7 }}>
              Last updated: 15 May 2026 · By accessing or using Transformica, you agree to be bound by these Terms & Conditions ("Terms"). If you do not agree, please do not use the services.
            </p>
          </div>

          <LegalSection title="1. Acceptance of Terms">
            <p>By creating an account, subscribing to a plan, or otherwise using the Transformica website, mobile application, or coaching services (collectively, the "Services"), you agree to these Terms, our Privacy Policy, and any additional terms applicable to specific features.</p>
          </LegalSection>

          <LegalSection title="2. Eligibility">
            <p>You must be at least 18 years old and capable of forming a legally binding contract under Indian law to use our Services. By using Transformica, you confirm you meet these requirements. Use by minors is strictly prohibited.</p>
          </LegalSection>

          <LegalSection title="3. Health & Medical Disclaimer">
            <p style={{ marginBottom: 12 }}>Transformica provides general fitness, nutrition, and lifestyle guidance. <strong style={{ color: C.textPrimary }}>We do not provide medical advice, diagnosis, or treatment.</strong> Our coaches are fitness and nutrition professionals, not licensed medical doctors.</p>
            <p style={{ marginBottom: 12 }}>You agree to consult a qualified healthcare professional before beginning any exercise or nutrition program, especially if you have or suspect any medical condition, are pregnant, postpartum, or are taking medication. You assume all risks associated with physical exercise.</p>
            <p>By participating, you represent that you are physically and mentally fit to undertake the activities prescribed and that you have obtained any necessary medical clearance.</p>
          </LegalSection>

          <LegalSection title="4. No Guaranteed Results">
            <p>Individual results vary based on genetics, adherence, lifestyle, medical history, and many other factors. Testimonials and transformation photos shown on the Services represent individual experiences and are not guarantees of similar outcomes for any specific user. Transformica makes no warranty regarding the level or speed of results you will achieve.</p>
          </LegalSection>

          <LegalSection title="5. Subscriptions, Billing & Refunds">
            <ul style={{ paddingLeft: 22 }}>
              <li style={{ marginBottom: 8 }}>Plan prices, durations, and inclusions are displayed at the point of purchase and may change from time to time.</li>
              <li style={{ marginBottom: 8 }}>All payments are processed through third-party gateways. By subscribing, you authorise the applicable charges.</li>
              <li style={{ marginBottom: 8 }}><strong style={{ color: C.textPrimary }}>Money-back guarantee:</strong> Transformica Pro and Pro Max plans include a 7-day money-back guarantee from the date of activation. Refund requests after 7 days will not be entertained.</li>
              <li style={{ marginBottom: 8 }}>Transformica Lite and supplement purchases are non-refundable once delivered or activated.</li>
              <li>Refunds are processed to the original payment method within 7–14 business days of approval.</li>
            </ul>
          </LegalSection>

          <LegalSection title="6. User Accounts & Conduct">
            <p style={{ marginBottom: 12 }}>You are responsible for safeguarding your account credentials and for any activity under your account. You agree not to:</p>
            <ul style={{ paddingLeft: 22 }}>
              <li style={{ marginBottom: 6 }}>Share your account or plan with another person.</li>
              <li style={{ marginBottom: 6 }}>Resell, redistribute, or commercially exploit our content.</li>
              <li style={{ marginBottom: 6 }}>Reverse-engineer, scrape, or otherwise misuse the Services.</li>
              <li style={{ marginBottom: 6 }}>Submit false or misleading information.</li>
              <li>Engage in any conduct that disrupts or harms the Services or other users.</li>
            </ul>
          </LegalSection>

          <LegalSection title="7. Intellectual Property">
            <p>All content on the Transformica website, app, and within delivered programs — including text, graphics, logos, video, plans, and methodology — is the property of Novablitz Smart Fitness Pvt Ltd or its licensors and is protected by copyright and other applicable laws. You receive a limited, non-transferable licence to access and use the content solely for your personal, non-commercial use.</p>
          </LegalSection>

          <LegalSection title="8. Limitation of Liability">
            <p style={{ marginBottom: 12 }}>To the maximum extent permitted by law, Transformica, its founders, employees, coaches, and partners shall not be liable for:</p>
            <ul style={{ paddingLeft: 22, marginBottom: 12 }}>
              <li style={{ marginBottom: 6 }}>Any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of (or inability to use) the Services.</li>
              <li style={{ marginBottom: 6 }}>Personal injury, illness, or death resulting from following any plan or recommendation, where you have failed to obtain medical clearance.</li>
              <li style={{ marginBottom: 6 }}>Loss of data, profits, goodwill, or business opportunity.</li>
              <li>Any acts of third parties, including supplement manufacturers, payment processors, and connected services.</li>
            </ul>
            <p>Our aggregate liability for any claim arising out of or relating to the Services shall not exceed the amount you paid to Transformica in the three (3) months preceding the event giving rise to the claim.</p>
          </LegalSection>

          <LegalSection title="9. Indemnification">
            <p>You agree to indemnify, defend, and hold harmless Novablitz Smart Fitness Pvt Ltd and its representatives from any claims, damages, losses, liabilities, and expenses (including reasonable legal fees) arising from your use of the Services, your violation of these Terms, or your infringement of any third-party right.</p>
          </LegalSection>

          <LegalSection title="10. Third-Party Services">
            <p>The Services may contain links to third-party websites or integrate with third-party tools (e.g., WhatsApp, payment gateways, analytics providers). We are not responsible for the content, privacy practices, or actions of any third party.</p>
          </LegalSection>

          <LegalSection title="11. Modifications & Termination">
            <p>We reserve the right to modify or discontinue any part of the Services at any time without prior notice. We may suspend or terminate your access for any breach of these Terms or for any other reason at our sole discretion. Sections that, by their nature, should survive termination (including disclaimers, limitation of liability, indemnification, and governing law) will continue to apply.</p>
          </LegalSection>

          <LegalSection title="12. Governing Law & Dispute Resolution">
            <p>These Terms are governed by the laws of India. Any dispute arising out of or relating to the Services or these Terms shall be subject to the exclusive jurisdiction of the courts located in Gautam Buddha Nagar (Noida), Uttar Pradesh, India. The parties shall first attempt to resolve disputes amicably through good-faith negotiation before pursuing legal proceedings.</p>
          </LegalSection>

          <LegalSection title="13. Severability & Entire Agreement">
            <p>If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force. These Terms, together with the Privacy Policy, constitute the entire agreement between you and Transformica regarding the Services and supersede all prior understandings.</p>
          </LegalSection>

          <LegalSection title="14. Contact">
            <p style={{ color: C.textPrimary }}>
              <strong>Novablitz Smart Fitness Pvt Ltd</strong><br />
              Email: <a href="mailto:support@transformica.in" style={{ color: C.cyan }}>support@transformica.in</a><br />
              Phone: +91 9899901124 / +91 8595432548<br />
              Registered office: Noida Sector 132, Uttar Pradesh, India
            </p>
          </LegalSection>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── FOOTER ─────────────────────────── */
const ADDRESSES = [
  "Noida Sector 132, Uttar Pradesh",
  "Sector 44, Gurugram, Haryana",
  "Ramghat Road, Aligarh, Uttar Pradesh",
];

function Footer({ setPage }) {
  const programs = [
    { label: "Fat Loss", msg: "Fat Loss" },
    { label: "Muscle Building", msg: "Muscle Building" },
    { label: "PCOS / PCOD Care", msg: "PCOS Care" },
    { label: "Injury Rehab", msg: "Injury Rehab" },
    { label: "Postpartum Recovery", msg: "Postpartum Recovery" },
    { label: "Body Recomposition", msg: "Body Recomposition" },
  ];

  const linkStyle = {
    color: C.textMuted, fontSize: 13, marginBottom: 10, cursor: "pointer",
    textDecoration: "none", display: "block", transition: "color 0.2s",
    background: "none", border: "none", padding: 0, textAlign: "left",
    fontFamily: "'Outfit', sans-serif",
  };

  const goToPricing = () => {
    setPage("home");
    setTimeout(() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  const goToFaq = () => {
    setPage("home");
    setTimeout(() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <footer style={{ background: C.bg2, borderTop: `1px solid ${C.border}`, padding: "70px clamp(16px,4vw,60px) 30px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1.3fr",
          gap: 40,
          marginBottom: 48,
        }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, cursor: "pointer" }} onClick={() => setPage("home")}>
              <img src={LogoImage} alt="Transformica" style={{ width: 42, height: 42, objectFit: "contain" }} />
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, letterSpacing: 3, color: C.cyan, fontWeight: 700 }}>TRANSFORMICA</div>
            </div>
            <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
              Novablitz Smart Fitness Pvt Ltd<br />
              Science-backed fitness coaching for every Indian.
            </p>
            <a
              href={waWithMessage("Hi Transformica, I'd like to learn more about your programs.")}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#25D366", color: "#fff",
                padding: "10px 18px", borderRadius: 99,
                fontSize: 13, fontWeight: 600, textDecoration: "none",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <MessageCircle size={15} /> Chat on WhatsApp
            </a>
          </div>

          {/* Programs */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, color: C.textPrimary, fontFamily: "'Outfit', sans-serif" }}>Programs</div>
            {programs.map((p) => (
              <a
                key={p.label}
                href={programWA(p.msg)}
                target="_blank"
                rel="noreferrer"
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.cyan; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
              >
                {p.label}
              </a>
            ))}
          </div>

          {/* Support */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, color: C.textPrimary, fontFamily: "'Outfit', sans-serif" }}>Support</div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Transformica, I need support.")}`}
              target="_blank"
              rel="noreferrer"
              style={linkStyle}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.cyan; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
            >
              WhatsApp Us
            </a>
            <button onClick={goToFaq} style={linkStyle}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.cyan; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
            >
              FAQ
            </button>
            <button onClick={goToPricing} style={linkStyle}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.cyan; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
            >
              Pricing & Plans
            </button>
            <button onClick={() => setPage("privacy")} style={linkStyle}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.cyan; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
            >
              Privacy Policy
            </button>
            <button onClick={() => setPage("terms")} style={linkStyle}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.cyan; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
            >
              Terms & Conditions
            </button>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, color: C.textPrimary, fontFamily: "'Outfit', sans-serif" }}>Contact</div>

            {/* Addresses */}
            <div style={{ marginBottom: 16 }}>
              {ADDRESSES.map((addr, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>
                  <span style={{ color: C.cyan, flexShrink: 0, marginTop: 2 }}>•</span>
                  <span>{addr}</span>
                </div>
              ))}
            </div>

            {/* Phones */}
            <div style={{ marginBottom: 12 }}>
              <a href="tel:+919899901124" style={{ ...linkStyle, color: C.textPrimary, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={13} style={{ color: C.cyan }} /> +91 9899901124
              </a>
              <a href="tel:+918595432548" style={{ ...linkStyle, color: C.textPrimary, fontWeight: 600, marginBottom: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={13} style={{ color: C.cyan }} /> +91 8595432548
              </a>
            </div>

            {/* Email */}
            <a href="mailto:support@transformica.in" style={{ ...linkStyle, color: C.textPrimary, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <MessageCircle size={13} style={{ color: C.cyan }} /> support@transformica.in
            </a>
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: C.textMuted }}>
            © 2026 Novablitz Smart Fitness Pvt Ltd · All rights reserved
          </div>
          <div style={{ display: "flex", gap: 18, fontSize: 12, color: C.textMuted, alignItems: "center" }}>
            <button onClick={() => setPage("privacy")} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Privacy</button>
            <button onClick={() => setPage("terms")} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Terms</button>
            <button
              onClick={() => setPage("admin-supplements")}
              title="Manage supplement products"
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.18)", fontSize: 11, cursor: "pointer", letterSpacing: 2, fontFamily: "'Outfit', sans-serif", textTransform: "uppercase" }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── MAIN APP ─────────────────────────── */
export default function TransformicaWebsite() {
  const [page, setPage] = useState(() =>
    typeof window !== "undefined" && window.location.hash === "#admin" ? "admin-supplements" : "home"
  );
  const [testimonials, setTestimonials] = useState([]);
  const [transformations, setTransformations] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#admin") setPage("admin-supplements");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const getMetaData = () => {
    const baseUrl = "https://transformica.in";
    const meta = {
      home: {
        title: "Transformica - Your Complete Health & Fitness Ecosystem",
        description: "Transform your body, mind, and life with Transformica. Expert human guidance, AI analytics, and a mobile app for sustainable fitness results.",
        keywords: "fitness app, health transformation, workout tracker, diet planner, coach guidance",
        canonical: `${baseUrl}/`,
      },
      app: {
        title: "Transformica App - Fitness Made Easy | Download Now",
        description: "Download the Transformica app for Android and iOS. Track workouts, meals, and get coach support in one polished mobile experience.",
        keywords: "fitness app download, workout logger, meal tracker, fitness coach",
        canonical: `${baseUrl}/app`,
      },
      supplements: {
        title: "Premium Supplements | Transformica Supplement Lab",
        description: "Shop genuine imported supplements at Transformica. Whey protein, creatine, pre-workouts, and more with expert recommendations.",
        keywords: "supplements, whey protein, creatine, pre workout, fitness supplements",
        canonical: `${baseUrl}/supplements`,
      },
      about: {
        title: "About Transformica - Expert Fitness Coaching",
        description: "Learn about Transformica's mission to make fitness accessible. Meet our expert coaches and discover our science-backed approach.",
        keywords: "about fitness app, transformica team, fitness coaching",
        canonical: `${baseUrl}/about`,
      },
      "fitness-test": {
        title: "Fitness Test | Get Your Personalized Plan",
        description: "Take our comprehensive fitness test to get a customized workout and diet plan. Start your transformation journey today.",
        keywords: "fitness test, personalized plan, workout assessment",
        canonical: `${baseUrl}/fitness-test`,
      },
      privacy: {
        title: "Privacy Policy | Transformica",
        description: "Read how Novablitz Smart Fitness Pvt Ltd (Transformica) collects, uses, and protects your information across our website, app, and coaching services.",
        keywords: "privacy policy, transformica, data protection, fitness app privacy",
        canonical: `${baseUrl}/privacy`,
      },
      terms: {
        title: "Terms & Conditions | Transformica",
        description: "Terms governing your use of Transformica's website, mobile app, coaching plans, and supplement purchases.",
        keywords: "terms and conditions, transformica, fitness coaching terms",
        canonical: `${baseUrl}/terms`,
      },
    };
    return meta[page] || meta.home;
  };

  const meta = getMetaData();

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Transformica",
            "description": "Your complete health and fitness ecosystem with AI-powered analytics and human expert guidance.",
            "url": "https://transformica.com",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Android, iOS",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            },
            "creator": {
              "@type": "Organization",
              "name": "Novablitz Smart Fitness Pvt Ltd"
            }
          })}
        </script>
      </Helmet>
      <style>{STYLES}</style>
      <style>{`
        @media(max-width:1099px){.hide-mobile{display:none!important}.show-mobile{display:block!important}}
        @media(min-width:1100px){.show-mobile{display:none!important}}
        @media(max-width:767px){
          .nav-bar-inner{height:72px!important}
          .nav-logo-img{width:42px!important;height:42px!important}
          .nav-logo-text{font-size:22px!important;letter-spacing:2px!important}
        }
        @media(min-width:768px) and (max-width:1099px){
          .nav-bar-inner{height:78px!important}
        }
        *{box-sizing:border-box}
      `}</style>

      <Navbar page={page} setPage={setPage} />

      <main>
        {page === "home" && <HomePage testimonials={testimonials} transformations={transformations} />}
        {page === "app" && <AppPage />}
        {page === "supplements" && <SupplementsPage />}
        {page === "about" && <AboutPage />}
        {page === "fitness-test" && <FitnessTestPage />}
        {page === "privacy" && <PrivacyPage />}
        {page === "terms" && <TermsPage />}
        {page === "admin-supplements" && <SupplementsAdminPage />}
      </main>

      {page !== "admin-supplements" && <WhatsappBubble />}
      <Footer setPage={setPage} />
    </>
  );
}
