import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  DollarSign,
  Globe,
  Loader2,
  Lock,
  Mail,
  Menu,
  MessageSquare,
  Rocket,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SiDiscord,
  SiFacebook,
  SiInstagram,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

/* ─── Scroll Reveal Hook ────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
    );

    const elements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right",
    );
    for (const el of Array.from(elements)) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);
}

/* ─── Navbar ────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#packages" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Why Us", href: "#why-choose-us" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

function scrollToSection(href: string) {
  const target = document.querySelector(href);
  if (target) {
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          data-ocid="nav.home.link"
          className="flex items-center gap-3 group"
        >
          <img
            src="/assets/uploads/IMG_5419-1.png"
            alt="Capital Partners Logo"
            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
            style={{ mixBlendMode: "screen" }}
          />
          <span className="font-heading font-bold text-lg tracking-wide">
            <span className="gradient-text">Capital</span>{" "}
            <span className="text-foreground">Partners</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-ocid={`nav.${link.label.toLowerCase()}.link`}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-4 py-2 text-sm font-heading font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-primary/10 relative group"
            >
              {link.label}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-6" />
            </a>
          ))}
          <button
            type="button"
            data-ocid="nav.cta.button"
            onClick={() => {
              setMobileOpen(false);
              scrollToSection("#contact");
            }}
            className="ml-2 px-5 py-2 text-sm font-heading font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-purple-sm"
          >
            Get Started
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          data-ocid="nav.mobile.toggle"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-nav border-t border-border mt-1">
          <nav
            className="px-4 py-4 flex flex-col gap-1"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`nav.mobile.${link.label.toLowerCase()}.link`}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-3 text-sm font-heading font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

/* ─── Water Canvas Hook (Realistic Falling Water) ───────────── */
function useOceanCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    function resize() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // ── Falling water streaks (vertical flow) ──
    const STREAK_COUNT = 70;
    type Streak = {
      x: number;
      y: number;
      speed: number;
      length: number;
      alpha: number;
      width: number;
      hue: number;
      waver: number;
      waverSpeed: number;
    };
    const streaks: Streak[] = Array.from({ length: STREAK_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: 0.0007 + Math.random() * 0.0012,
      length: 0.08 + Math.random() * 0.18,
      alpha: 0.28 + Math.random() * 0.38,
      width: 0.8 + Math.random() * 1.8,
      hue: 265 + Math.floor(Math.random() * 55),
      waver: Math.random() * Math.PI * 2,
      waverSpeed: 0.0002 + Math.random() * 0.0003,
    }));

    // ── Slow horizontal ripple lines (water surface reflections) ──
    const RIPPLE_COUNT = 18;
    type Ripple = {
      y: number;
      phase: number;
      speed: number;
      amplitude: number;
      alpha: number;
      hue: number;
    };
    const ripples: Ripple[] = Array.from({ length: RIPPLE_COUNT }, () => ({
      y: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.00005 + Math.random() * 0.00008,
      amplitude: 0.006 + Math.random() * 0.012,
      alpha: 0.18 + Math.random() * 0.22,
      hue: 270 + Math.floor(Math.random() * 45),
    }));

    // ── Subsurface glow blobs ──
    const BLOB_COUNT = 7;
    type Blob = {
      x: number;
      y: number;
      phase: number;
      speed: number;
      radius: number;
      intensity: number;
    };
    const blobs: Blob[] = Array.from({ length: BLOB_COUNT }, (_, i) => ({
      x: i / BLOB_COUNT + Math.random() * 0.2,
      y: 0.2 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.00015 + Math.random() * 0.0002,
      radius: 0.18 + Math.random() * 0.24,
      intensity: 0.18 + Math.random() * 0.2,
    }));

    let t = 0;

    function draw() {
      if (!ctx) return;
      t++;

      // ── 1. Deep background ──
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#04001a");
      bg.addColorStop(0.4, "#08002a");
      bg.addColorStop(0.75, "#120045");
      bg.addColorStop(1, "#06001c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // ── 2. Subsurface purple glow blobs ──
      for (const b of blobs) {
        const bx =
          (b.x + Math.sin(t * b.speed * 1000 + b.phase) * 0.06) * width;
        const by =
          (b.y + Math.cos(t * b.speed * 700 + b.phase) * 0.04) * height;
        const rad = b.radius * Math.min(width, height);
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, rad);
        const alpha = b.intensity * (0.85 + 0.15 * Math.sin(t * b.speed * 500));
        g.addColorStop(0, `rgba(130,40,255,${alpha})`);
        g.addColorStop(0.5, `rgba(80,15,180,${alpha * 0.5})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(bx - rad, by - rad, rad * 2, rad * 2);
      }

      // ── 3. Falling water streaks ──
      for (const s of streaks) {
        // advance position downward
        s.y += s.speed;
        if (s.y > 1 + s.length) {
          s.y = -(s.length + Math.random() * 0.1);
          s.x = Math.random();
          s.alpha = 0.06 + Math.random() * 0.13;
        }
        s.waver += s.waverSpeed;
        const sx = (s.x + Math.sin(s.waver) * 0.008) * width;
        const sy = s.y * height;
        const len = s.length * height;

        const grad = ctx.createLinearGradient(sx, sy, sx, sy + len);
        const hsl = `hsla(${s.hue},80%,65%,`;
        grad.addColorStop(0, `${hsl}0)`);
        grad.addColorStop(0.25, `${hsl}${s.alpha})`);
        grad.addColorStop(0.65, `${hsl}${s.alpha * 0.8})`);
        grad.addColorStop(1, `${hsl}0)`);

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx, sy + len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.globalAlpha = 1;
        ctx.stroke();
      }

      // ── 4. Horizontal ripple lines ──
      for (const r of ripples) {
        const ry = r.y * height;
        const phase = t * r.speed * 1000 + r.phase;
        ctx.beginPath();
        ctx.moveTo(0, ry + Math.sin(phase) * height * r.amplitude);
        for (let x = 6; x <= width; x += 6) {
          const y =
            ry +
            Math.sin((x / width) * Math.PI * 4 + phase) * height * r.amplitude;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${r.hue},70%,65%,${r.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 1;
        ctx.stroke();
      }

      // ── 5. Top vignette ──
      const vign = ctx.createLinearGradient(0, 0, 0, height * 0.3);
      vign.addColorStop(0, "rgba(2,0,12,0.30)");
      vign.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, width, height * 0.3);

      // ── 6. Bottom vignette ──
      const bvign = ctx.createLinearGradient(0, height * 0.75, 0, height);
      bvign.addColorStop(0, "rgba(0,0,0,0)");
      bvign.addColorStop(1, "rgba(2,0,10,0.28)");
      ctx.fillStyle = bvign;
      ctx.fillRect(0, height * 0.75, width, height * 0.25);

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

/* ─── Hero Section ──────────────────────────────────────────── */
function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useOceanCanvas(canvasRef);

  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const about = document.querySelector("#about");
    if (about) {
      const top = about.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleCTA = (e: React.MouseEvent) => {
    e.preventDefault();
    const contact = document.querySelector("#contact");
    if (contact) {
      const top = contact.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      data-ocid="hero.section"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated Ocean Canvas */}
      <canvas
        ref={canvasRef}
        tabIndex={-1}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      {/* Thin gradient overlay to ensure text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,0,10,0.25) 0%, rgba(5,0,20,0.10) 50%, rgba(5,0,16,0.45) 100%)",
        }}
      />
      {/* Purple radial glow at center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(130,30,220,0.18), transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        {/* CP Logo */}
        <div className="hero-logo mb-8">
          <div className="relative inline-block">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "oklch(0.54 0.24 293 / 0.3)",
                filter: "blur(30px)",
                transform: "scale(1.3)",
              }}
            />
            <img
              src="/assets/uploads/IMG_5419-1.png"
              alt="Capital Partners"
              className="relative w-36 h-36 md:w-48 md:h-48 object-contain drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 0 30px oklch(0.54 0.24 293 / 0.6))",
                mixBlendMode: "screen",
              }}
            />
          </div>
        </div>

        {/* Main tagline */}
        <h1 className="hero-title font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-4">
          <span className="block gradient-text">Your Capital.</span>
          <span className="block text-foreground mt-1">Our Strategy.</span>
        </h1>

        {/* Subtext */}
        <p className="hero-subtitle font-heading text-xl md:text-2xl text-muted-foreground font-medium tracking-wide mb-10 max-w-2xl">
          Building Empires.{" "}
          <span style={{ color: "oklch(0.72 0.22 293)" }}>
            Creating Legacies.
          </span>
        </p>

        {/* CTA */}
        <div className="hero-cta flex flex-col sm:flex-row gap-4 items-center">
          <button
            type="button"
            data-ocid="hero.primary_button"
            onClick={handleCTA}
            className="btn-glow font-heading font-bold text-base px-10 py-4 rounded-xl text-foreground cursor-pointer border-0 outline-0 flex items-center gap-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.44 0.22 285), oklch(0.60 0.26 295))",
            }}
          >
            <DollarSign size={18} />
            Partner With Us
          </button>
          <button
            type="button"
            data-ocid="hero.secondary_button"
            onClick={() => {
              const services = document.querySelector("#services");
              if (services) {
                const top =
                  services.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
            className="font-heading font-semibold text-base px-10 py-4 rounded-xl text-foreground cursor-pointer border border-primary/40 bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            Explore Services
          </button>
        </div>

        {/* Scroll indicator */}
        <button
          type="button"
          onClick={handleScrollDown}
          aria-label="Scroll to About section"
          className="mt-16 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <span className="text-xs font-heading font-medium tracking-widest uppercase">
            Scroll Down
          </span>
          <ChevronDown
            size={20}
            className="animate-bounce group-hover:text-primary"
          />
        </button>
      </div>
    </section>
  );
}

/* ─── About Section ─────────────────────────────────────────── */
function AboutSection() {
  return (
    <section
      id="about"
      data-ocid="about.section"
      className="relative py-28 overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.54 0.24 293), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20 reveal">
          <span className="font-heading text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">
            Our Story
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            About <span className="gradient-text">Capital Partners</span>
          </h2>
          <div className="section-line mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Story & Mission */}
          <div className="space-y-8">
            <div className="reveal-left">
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-primary flex-shrink-0"
                  style={{ background: "oklch(0.54 0.24 293 / 0.15)" }}
                >
                  <Star size={16} />
                </span>
                Our Story
              </h3>
              <p className="font-body text-muted-foreground text-base leading-relaxed">
                Capital Partners was founded with an unwavering vision: to
                empower entrepreneurs, visionaries, and established businesses
                to reach their fullest potential. In a world where growth
                demands strategy, we combine elite expertise with bold
                innovation to deliver results that transcend expectations.
              </p>
              <p className="font-body text-muted-foreground text-base leading-relaxed mt-4">
                From startup acceleration to enterprise transformation, we've
                built a reputation for turning ambitious goals into measurable
                reality — one strategic partnership at a time.
              </p>
            </div>

            {/* Vision & Mission */}
            <div
              className="reveal-left p-6 rounded-2xl border"
              style={{
                background: "oklch(0.09 0.02 285 / 0.8)",
                borderColor: "oklch(0.54 0.24 293 / 0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Globe size={18} className="text-primary" />
                <h4 className="font-heading font-bold text-foreground">
                  Vision
                </h4>
              </div>
              <p className="font-body text-muted-foreground text-sm leading-relaxed italic">
                "To become the world's leading business growth and investment
                agency — reshaping how capital and talent converge to build
                lasting empires."
              </p>
            </div>

            <div
              className="reveal-left p-6 rounded-2xl border"
              style={{
                background: "oklch(0.09 0.02 285 / 0.8)",
                borderColor: "oklch(0.82 0.18 75 / 0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Target size={18} style={{ color: "oklch(0.82 0.18 75)" }} />
                <h4 className="font-heading font-bold text-foreground">
                  Mission
                </h4>
              </div>
              <p className="font-body text-muted-foreground text-sm leading-relaxed italic">
                "Empowering individuals and businesses through strategic
                management, innovative promotions, and intelligent investments —
                creating the infrastructure for generational success."
              </p>
            </div>
          </div>

          {/* CEO Card */}
          <div className="reveal-right">
            <div
              className="relative rounded-3xl p-8 overflow-hidden border"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.14 0.06 285 / 0.9), oklch(0.10 0.04 280 / 0.9))",
                borderColor: "oklch(0.54 0.24 293 / 0.35)",
                boxShadow: "0 0 60px oklch(0.54 0.24 293 / 0.15)",
              }}
            >
              {/* Decorative glow */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: "oklch(0.54 0.24 293)",
                  filter: "blur(80px)",
                  transform: "translate(30%, -30%)",
                }}
              />

              {/* CEO Avatar */}
              <div className="relative flex flex-col items-center text-center mb-8">
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-display font-bold text-foreground mb-4 border-2"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.44 0.22 285), oklch(0.60 0.26 295))",
                    borderColor: "oklch(0.72 0.22 295 / 0.5)",
                    boxShadow:
                      "0 0 30px oklch(0.54 0.24 293 / 0.4), inset 0 1px 0 oklch(0.97 0 0 / 0.1)",
                  }}
                >
                  AA
                </div>
                <Badge
                  className="mb-2 font-heading font-semibold tracking-wide text-xs"
                  style={{
                    background: "oklch(0.54 0.24 293 / 0.2)",
                    borderColor: "oklch(0.54 0.24 293 / 0.4)",
                    color: "oklch(0.75 0.22 293)",
                  }}
                >
                  CEO & Founder
                </Badge>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  Abdul Ahad
                </h3>
                <p className="font-heading text-primary font-medium text-sm mt-1">
                  (Ahfah)
                </p>
              </div>

              <p className="font-body text-muted-foreground text-sm leading-relaxed text-center mb-6">
                A visionary leader with a passion for transforming ambitious
                ideas into thriving enterprises. Abdul Ahad founded Capital
                Partners to democratize access to world-class business strategy,
                management, and investment expertise.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "400+", label: "Projects" },
                  { value: "5+", label: "Years" },
                  { value: "5", label: "Divisions" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-3 rounded-xl border"
                    style={{
                      background: "oklch(0.07 0.01 280 / 0.6)",
                      borderColor: "oklch(0.54 0.24 293 / 0.15)",
                    }}
                  >
                    <div
                      className="font-display text-xl font-bold"
                      style={{ color: "oklch(0.82 0.18 75)" }}
                    >
                      {stat.value}
                    </div>
                    <div className="font-heading text-xs text-muted-foreground mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Services Section ──────────────────────────────────────── */
interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  available: boolean;
  color: string;
}

const SERVICES: ServiceItem[] = [
  {
    icon: <Briefcase size={22} />,
    title: "Management",
    description:
      "End-to-end operational management for businesses of all sizes. We streamline workflows, optimize teams, and drive measurable efficiency across every division.",
    tags: ["Operations", "Team", "Systems"],
    available: true,
    color: "oklch(0.54 0.24 293)",
  },
  {
    icon: <TrendingUp size={22} />,
    title: "Promotions",
    description:
      "Strategic promotional campaigns built to amplify brand presence, accelerate audience growth, and generate tangible ROI across every channel.",
    tags: ["Brand", "Marketing", "Growth"],
    available: true,
    color: "oklch(0.65 0.22 300)",
  },
  {
    icon: <Users size={22} />,
    title: "Freelancing",
    description:
      "Access to a curated network of elite freelance talent across design, development, content, and strategy — matched precisely to your project needs.",
    tags: ["Talent", "Projects", "Network"],
    available: true,
    color: "oklch(0.60 0.20 275)",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Business Growth & Strategy",
    description:
      "Data-driven growth frameworks, market positioning, and strategic roadmaps that transform ambitious goals into scalable, measurable results.",
    tags: ["Strategy", "Analytics", "Scaling"],
    available: true,
    color: "oklch(0.72 0.16 75)",
  },
  {
    icon: <DollarSign size={22} />,
    title: "Investment Solutions",
    description:
      "Intelligent capital allocation, portfolio structuring, and investment advisory tailored to maximize returns and build generational wealth.",
    tags: ["Capital", "Portfolio", "Returns"],
    available: true,
    color: "oklch(0.66 0.20 150)",
  },
  {
    icon: <Zap size={22} />,
    title: "AI Services",
    description:
      "Next-generation AI-powered automation, analytics, and intelligent tooling designed to give your business a decisive competitive edge.",
    tags: ["AI", "Automation", "Future"],
    available: false,
    color: "oklch(0.54 0.24 293)",
  },
  {
    icon: <Rocket size={22} />,
    title: "Global Partnerships",
    description:
      "Strategic alliance building and international market entry support — opening doors to global networks, partners, and opportunities.",
    tags: ["Global", "Alliances", "Expansion"],
    available: false,
    color: "oklch(0.60 0.22 310)",
  },
  {
    icon: <Target size={22} />,
    title: "Consulting Suite",
    description:
      "Premium consulting packages combining deep-domain expertise across finance, operations, and digital transformation for enterprise clients.",
    tags: ["Enterprise", "Consulting", "Premium"],
    available: false,
    color: "oklch(0.62 0.18 260)",
  },
];

function ServiceCard({
  service,
  index,
}: { service: ServiceItem; index: number }) {
  return (
    <div
      data-ocid={`services.card.${index + 1}`}
      className="service-card reveal relative rounded-2xl border p-6 flex flex-col gap-4"
      style={{
        background: "oklch(0.09 0.02 285 / 0.85)",
        borderColor: service.available
          ? "oklch(0.54 0.24 293 / 0.25)"
          : "oklch(0.22 0.04 285 / 0.5)",
        transitionDelay: `${index * 60}ms`,
      }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: `${service.color}22`,
          border: `1px solid ${service.color}44`,
          color: service.color,
        }}
      >
        {service.icon}
      </div>

      {/* Title & badge */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-base font-bold text-foreground leading-tight">
          {service.title}
        </h3>
        {!service.available && (
          <span
            className="flex-shrink-0 font-heading font-semibold text-[10px] px-2.5 py-1 rounded-full border tracking-wider uppercase"
            style={{
              background: "oklch(0.54 0.24 293 / 0.12)",
              borderColor: "oklch(0.54 0.24 293 / 0.35)",
              color: "oklch(0.72 0.22 293)",
            }}
          >
            Coming Soon
          </span>
        )}
      </div>

      {/* Description */}
      <p
        className="font-body text-sm leading-relaxed flex-1"
        style={{
          color: service.available ? "oklch(0.60 0 0)" : "oklch(0.45 0 0)",
        }}
      >
        {service.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="font-heading text-[10px] font-semibold px-2.5 py-1 rounded-md tracking-wide"
            style={{
              background: service.available
                ? `${service.color}15`
                : "oklch(0.14 0.02 285 / 0.5)",
              color: service.available ? service.color : "oklch(0.38 0 0)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <section
      id="services"
      data-ocid="services.section"
      className="relative py-28 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.54 0.24 293 / 0.05), transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "oklch(0.54 0.24 293)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="font-heading text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">
            What We Offer
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <div className="section-line mx-auto mb-4" />
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            A comprehensive suite of premium services designed to accelerate
            growth, maximize performance, and build lasting success.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing Section ─────────────────────────────────────────── */
function PricingSection() {
  const [reqForm, setReqForm] = useState({
    name: "",
    email: "",
    phone: "",
    discord: "",
    business: "",
    plan: "",
    details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { actor } = useActor();

  const handleRequestSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const { name, email, phone, discord, business, plan, details } = reqForm;
      if (!name.trim() || !email.trim() || !plan) {
        toast.error("Please fill in Name, Email, and select a Service Plan.");
        return;
      }
      setIsSubmitting(true);
      try {
        if (actor) {
          const fullMessage = `Phone/WhatsApp: ${phone}\nDiscord: ${discord}\nBusiness: ${business}\nPlan: ${plan}\n\nProject Details:\n${details}`;
          await actor.submitContactMessage(name, email, fullMessage);
        }
        setSubmitted(true);
        toast.success("Request sent! We'll respond within 24 hours.");
        setReqForm({
          name: "",
          email: "",
          phone: "",
          discord: "",
          business: "",
          plan: "",
          details: "",
        });
      } catch {
        toast.error("Failed to send. Please try again or reach us on Discord.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [reqForm, actor],
  );

  const plans = [
    {
      name: "Basic Plan",
      badge: "Starter",
      originalPrice: "$499",
      price: "$299",
      tagline:
        "Perfect for small creators and startups beginning their growth journey.",
      quality: "Standard Quality",
      highlight: false,
      services: [
        "Video Editing – up to 2 projects per month",
        "Thumbnail Design – up to 3 designs per month",
        "Content Clipping – up to 4 clips per month",
        "Promotion Support – 2 promotional actions",
        "Basic creator / business management support",
      ],
      color: "oklch(0.54 0.24 293)",
    },
    {
      name: "Professional Plan",
      badge: "Most Popular",
      originalPrice: "$999",
      price: "$699",
      tagline:
        "Best for growing creators and brands who need consistent content and strategy.",
      quality: "High Quality",
      highlight: true,
      services: [
        "Video Editing – up to 4 projects per month",
        "Thumbnail Design – up to 4 designs per month",
        "Content Clipping – up to 4 clips per month",
        "Promotion Campaigns – 4 promotional actions",
        "Creator / Business management support",
      ],
      color: "oklch(0.65 0.22 300)",
    },
    {
      name: "Pro Plan",
      badge: "Premium",
      originalPrice: "$1,999",
      price: "$999",
      tagline:
        "For serious creators and businesses who want full content and growth support.",
      quality: "Premium / Professional",
      highlight: false,
      services: [
        "Video Editing – up to 6 projects per month",
        "Thumbnail Design – up to 6 designs per month",
        "Content Clipping – up to 6 clips per month",
        "Promotion Campaigns – 6 promotional actions",
        "Full creator / business management support",
      ],
      color: "oklch(0.72 0.16 75)",
    },
  ];

  const customServices = [
    {
      name: "Video Editing",
      range: "$149 – $799",
      note: "depending on complexity",
    },
    {
      name: "Thumbnail Design",
      range: "$99 – $599",
      note: "depending on design level",
    },
    {
      name: "Content Clipping",
      range: "$59 – $399",
      note: "depending on number of clips",
    },
    {
      name: "Promotion Services",
      range: "$99 – $799",
      note: "depending on campaign size",
    },
    {
      name: "Management Services",
      range: "$199 – $999",
      note: "depending on project scope",
    },
  ];

  return (
    <section
      id="packages"
      data-ocid="packages.section"
      className="relative py-28 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, oklch(0.54 0.24 293 / 0.07), transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="font-heading text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">
            Monthly Plans
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Services &amp; <span className="gradient-text">Pricing</span>
          </h2>
          <div className="section-line mx-auto mb-4" />
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Choose the plan that fits your goals. All plans are billed monthly
            with no hidden fees.
          </p>
          <div
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full font-heading text-sm font-bold tracking-wide"
            style={{
              background: "oklch(0.72 0.16 75 / 0.12)",
              border: "1px solid oklch(0.72 0.16 75 / 0.45)",
              color: "oklch(0.88 0.14 75)",
            }}
          >
            🚀 Grab it now — Launch prices available for a limited time only!
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              data-ocid={`packages.card.${i + 1}`}
              className="reveal relative rounded-2xl border flex flex-col overflow-hidden"
              style={{
                background: plan.highlight
                  ? "linear-gradient(160deg, oklch(0.13 0.06 285 / 0.95), oklch(0.09 0.04 280 / 0.95))"
                  : "oklch(0.09 0.02 285 / 0.85)",
                borderColor: plan.highlight
                  ? `${plan.color}66`
                  : "oklch(0.22 0.04 285 / 0.5)",
                boxShadow: plan.highlight
                  ? `0 0 60px ${plan.color}28, 0 0 0 1px ${plan.color}44`
                  : "none",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="text-center py-2 font-heading font-bold text-xs tracking-widest uppercase"
                style={{
                  background: plan.highlight
                    ? `linear-gradient(90deg, ${plan.color}55, ${plan.color}33)`
                    : `${plan.color}18`,
                  color: plan.color,
                  borderBottom: `1px solid ${plan.color}44`,
                }}
              >
                {plan.highlight && "★ "}
                {plan.badge}
              </div>

              <div className="p-8 flex flex-col gap-5 flex-1">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {plan.name}
                </h3>

                {/* Pricing */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading text-sm text-muted-foreground line-through">
                      {plan.originalPrice}/mo
                    </span>
                    <span
                      className="font-heading text-xs px-1.5 py-0.5 rounded font-semibold"
                      style={{
                        background: "oklch(0.65 0.22 145 / 0.15)",
                        color: "oklch(0.70 0.18 145)",
                      }}
                    >
                      SAVE{" "}
                      {Math.round(
                        (1 -
                          Number.parseInt(plan.price.replace(/[^0-9]/g, "")) /
                            Number.parseInt(
                              plan.originalPrice.replace(/[^0-9]/g, ""),
                            )) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span
                      className="font-display text-4xl font-bold"
                      style={{ color: plan.color }}
                    >
                      {plan.price}
                    </span>
                    <span className="font-heading text-sm text-muted-foreground mb-1.5">
                      / month
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground italic mt-1">
                    {plan.tagline}
                  </p>
                </div>

                {/* Quality badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold w-fit"
                  style={{
                    background: `${plan.color}14`,
                    border: `1px solid ${plan.color}40`,
                    color: plan.color,
                  }}
                >
                  <span>◆</span> {plan.quality}
                </div>

                <div
                  className="flex-1 border-t pt-4"
                  style={{ borderColor: "oklch(0.22 0.04 285 / 0.5)" }}
                >
                  <p
                    className="font-heading text-xs font-bold tracking-widest uppercase mb-3"
                    style={{ color: plan.color }}
                  >
                    Services Included
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {plan.services.map((svc) => (
                      <li key={svc} className="flex items-start gap-2.5">
                        <CheckCircle2
                          size={14}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: plan.color }}
                        />
                        <span className="font-body text-sm text-foreground/85 leading-snug">
                          {svc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  data-ocid={`packages.cta.button.${i + 1}`}
                  onClick={() => {
                    const el = document.querySelector("#request-form");
                    if (el) {
                      const top =
                        el.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                    setReqForm((prev) => ({ ...prev, plan: plan.name }));
                  }}
                  className="w-full py-3 rounded-xl font-heading font-bold text-sm transition-all duration-200 hover:opacity-90 mt-auto"
                  style={
                    plan.highlight
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.44 0.22 285), oklch(0.60 0.26 295))",
                          color: "oklch(0.97 0 0)",
                          boxShadow: `0 0 30px ${plan.color}44`,
                        }
                      : {
                          background: `${plan.color}18`,
                          border: `1px solid ${plan.color}44`,
                          color: plan.color,
                        }
                  }
                >
                  {plan.name === "Pro Plan" ? "Contact Us" : "Get Started"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 reveal">
          <div className="text-center mb-10">
            <span className="font-heading text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block">
              One-Time Projects
            </span>
            <h3 className="font-display text-3xl font-bold text-foreground mb-2">
              Custom Services
            </h3>
            <div className="section-line mx-auto mb-4" />
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Clients who require specific services can request individual
              projects. Pricing depends on the project scope and requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {customServices.map((svc, i) => (
              <div
                key={svc.name}
                data-ocid={`custom.service.item.${i + 1}`}
                className="reveal flex flex-col gap-2 p-5 rounded-xl border"
                style={{
                  background: "oklch(0.09 0.02 285 / 0.85)",
                  borderColor: "oklch(0.22 0.04 285 / 0.5)",
                  transitionDelay: `${i * 50}ms`,
                }}
              >
                <p className="font-heading font-semibold text-sm text-foreground/90">
                  {svc.name}
                </p>
                <p
                  className="font-display text-lg font-bold"
                  style={{ color: "oklch(0.65 0.22 300)" }}
                >
                  {svc.range}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {svc.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Banner */}
        <div className="mt-12 mb-4 reveal">
          <div
            className="flex flex-col items-center gap-3 px-8 py-5 rounded-2xl mx-auto w-fit font-body text-sm"
            style={{
              background: "oklch(0.09 0.03 285 / 0.9)",
              border: "1px solid oklch(0.54 0.24 293 / 0.35)",
              color: "oklch(0.75 0.08 285)",
            }}
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span>🌍</span>
              <span className="font-semibold text-foreground/80">
                Payment Methods
              </span>
              <span className="opacity-40">—</span>
              <span
                className="font-semibold"
                style={{ color: "oklch(0.72 0.22 293)" }}
              >
                TapTap Send
              </span>
              <span className="opacity-40">·</span>
              <span
                className="font-semibold"
                style={{ color: "oklch(0.72 0.22 293)" }}
              >
                Crypto Payments
              </span>
              <span className="opacity-40">·</span>
              <span className="font-semibold opacity-50">PayPal</span>
              <span
                className="font-heading text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
                style={{
                  background: "oklch(0.72 0.16 75 / 0.15)",
                  border: "1px solid oklch(0.72 0.16 75 / 0.4)",
                  color: "oklch(0.85 0.14 75)",
                }}
              >
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md italic">
              We mainly accept TapTap Send, a trusted international transfer
              app. Crypto payments are also available, and PayPal is coming
              soon.
            </p>
          </div>
        </div>

        <div id="request-form" className="mt-20 reveal">
          <div className="text-center mb-10">
            <span className="font-heading text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block">
              Get Started Today
            </span>
            <h3 className="font-display text-3xl font-bold text-foreground mb-2">
              Request Our Services
            </h3>
            <div className="section-line mx-auto mb-4" />
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              To purchase or request a service, clients must complete the
              service request form by providing the required details. Our team
              will review the request and respond within 24 hours.
            </p>
            <p
              className="font-body text-sm mt-3"
              style={{ color: "oklch(0.72 0.22 293)" }}
            >
              All requests are forwarded to{" "}
              <span className="font-semibold">
                supportcapitalpartners@gmail.com
              </span>
            </p>
          </div>

          <div
            className="max-w-2xl mx-auto rounded-2xl border p-8"
            style={{
              background: "oklch(0.09 0.03 285 / 0.9)",
              borderColor: "oklch(0.54 0.24 293 / 0.25)",
              boxShadow: "0 0 60px oklch(0.54 0.24 293 / 0.08)",
            }}
          >
            {submitted ? (
              <div
                data-ocid="request.success_state"
                className="text-center py-12"
              >
                <CheckCircle2
                  size={48}
                  className="mx-auto mb-4"
                  style={{ color: "oklch(0.65 0.22 145)" }}
                />
                <h4 className="font-display text-2xl font-bold text-foreground mb-2">
                  Request Sent!
                </h4>
                <p className="font-body text-muted-foreground">
                  Your request has been sent to our team. We will review it and
                  respond within 24 hours via email or Discord.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2 rounded-xl font-heading font-semibold text-sm"
                  style={{
                    background: "oklch(0.54 0.24 293 / 0.2)",
                    border: "1px solid oklch(0.54 0.24 293 / 0.4)",
                    color: "oklch(0.72 0.22 293)",
                  }}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleRequestSubmit}
                className="flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="req-name"
                      className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                      Name *
                    </label>
                    <Input
                      id="req-name"
                      data-ocid="request.name.input"
                      placeholder="Your full name"
                      value={reqForm.name}
                      onChange={(e) =>
                        setReqForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="bg-transparent border-border/60 focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="req-email"
                      className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                      Email Address *
                    </label>
                    <Input
                      id="req-email"
                      data-ocid="request.email.input"
                      type="email"
                      placeholder="your@email.com"
                      value={reqForm.email}
                      onChange={(e) =>
                        setReqForm((p) => ({ ...p, email: e.target.value }))
                      }
                      className="bg-transparent border-border/60 focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="req-phone"
                      className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                      Phone / WhatsApp
                    </label>
                    <Input
                      id="req-phone"
                      data-ocid="request.phone.input"
                      placeholder="+1 234 567 8900"
                      value={reqForm.phone}
                      onChange={(e) =>
                        setReqForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="bg-transparent border-border/60 focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="req-discord"
                      className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                      Discord Username
                    </label>
                    <Input
                      id="req-discord"
                      data-ocid="request.discord.input"
                      placeholder="username#0000"
                      value={reqForm.discord}
                      onChange={(e) =>
                        setReqForm((p) => ({ ...p, discord: e.target.value }))
                      }
                      className="bg-transparent border-border/60 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="req-business"
                    className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    Business Name
                  </label>
                  <Input
                    id="req-business"
                    data-ocid="request.business.input"
                    placeholder="Your business or brand name"
                    value={reqForm.business}
                    onChange={(e) =>
                      setReqForm((p) => ({ ...p, business: e.target.value }))
                    }
                    className="bg-transparent border-border/60 focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="req-plan"
                    className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    Selected Service Plan *
                  </label>
                  <select
                    id="req-plan"
                    data-ocid="request.plan.select"
                    value={reqForm.plan}
                    onChange={(e) =>
                      setReqForm((p) => ({ ...p, plan: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg font-body text-sm text-foreground border"
                    style={{
                      background: "oklch(0.08 0.02 285)",
                      borderColor: "oklch(0.22 0.04 285 / 0.6)",
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select a plan or service
                    </option>
                    <option value="Creator Launch Plan">
                      Creator Launch Plan — $150/mo
                    </option>
                    <option value="Brand Growth Plan">
                      Brand Growth Plan — $300/mo
                    </option>
                    <option value="Business Accelerator Plan">
                      Business Accelerator Plan — $600/mo
                    </option>
                    <option value="Custom Service">
                      Custom Service (One-Time Project)
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="req-details"
                    className="font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    Project Details
                  </label>
                  <Textarea
                    id="req-details"
                    data-ocid="request.details.textarea"
                    placeholder="Describe your project, goals, and any specific requirements..."
                    value={reqForm.details}
                    onChange={(e) =>
                      setReqForm((p) => ({ ...p, details: e.target.value }))
                    }
                    rows={5}
                    className="bg-transparent border-border/60 focus:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  data-ocid="request.submit.button"
                  disabled={isSubmitting}
                  className="w-full py-3 font-heading font-bold text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.44 0.22 285), oklch(0.60 0.26 295))",
                    color: "oklch(0.97 0 0)",
                    boxShadow: "0 0 30px oklch(0.54 0.24 293 / 0.4)",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Sending...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </Button>
              </form>
            )}

            <div
              className="mt-6 flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl border text-center sm:text-left"
              style={{
                background: "oklch(0.60 0.24 270 / 0.08)",
                borderColor: "oklch(0.60 0.24 270 / 0.25)",
              }}
            >
              <SiDiscord
                size={24}
                style={{ color: "oklch(0.70 0.24 270)", flexShrink: 0 }}
              />
              <p className="font-body text-sm text-muted-foreground flex-1">
                For faster communication and updates, please join our Discord
                community:
              </p>
              <a
                href="https://discord.gg/Te3PFxQ2SM"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="request.discord.link"
                className="px-4 py-2 rounded-lg font-heading font-semibold text-xs whitespace-nowrap transition-opacity hover:opacity-80"
                style={{
                  background: "oklch(0.60 0.24 270 / 0.2)",
                  border: "1px solid oklch(0.60 0.24 270 / 0.4)",
                  color: "oklch(0.70 0.24 270)",
                }}
              >
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Why Choose Us Section ──────────────────────────────────── */
function WhyChooseUsSection() {
  const reasons = [
    {
      icon: "🏆",
      title: "Proven Results",
      desc: "We measure our success by your growth. Every strategy is built around tangible, measurable outcomes for your brand.",
    },
    {
      icon: "⚡",
      title: "Fast Turnaround",
      desc: "We respond within 24 hours and deliver projects on schedule — no delays, no excuses.",
    },
    {
      icon: "🎯",
      title: "Tailored Strategy",
      desc: "No cookie-cutter solutions. Every plan is custom-built around your specific goals, audience, and brand identity.",
    },
    {
      icon: "💎",
      title: "Premium Quality",
      desc: "From content editing to full business consulting, we deliver agency-level quality at every tier.",
    },
    {
      icon: "🤝",
      title: "Long-Term Partnership",
      desc: "We don't just complete projects — we build lasting relationships and grow alongside your business.",
    },
    {
      icon: "🌐",
      title: "Full-Service Agency",
      desc: "Content, branding, marketing, web, and consulting — everything under one roof for seamless execution.",
    },
  ];

  return (
    <section
      id="why-choose-us"
      data-ocid="why-choose-us.section"
      className="relative py-28 overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "oklch(0.54 0.24 293)",
          filter: "blur(120px)",
          opacity: 0.06,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "oklch(0.65 0.22 300)",
          filter: "blur(100px)",
          opacity: 0.05,
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="font-heading text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">
            The CP Difference
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose <span className="gradient-text">Capital Partners</span>
          </h2>
          <div className="section-line mx-auto mb-6" />
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Hundreds of creators and businesses trust Capital Partners to drive
            their growth. Here's what sets us apart from the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              data-ocid={`why-choose-us.item.${i + 1}`}
              className="reveal flex flex-col gap-4 p-7 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
              style={{
                background:
                  i === 1 || i === 4
                    ? "linear-gradient(160deg, oklch(0.13 0.06 285 / 0.95), oklch(0.09 0.04 280 / 0.95))"
                    : "oklch(0.09 0.02 285 / 0.85)",
                borderColor:
                  i === 1 || i === 4
                    ? "oklch(0.65 0.22 300 / 0.4)"
                    : "oklch(0.22 0.04 285 / 0.5)",
                boxShadow:
                  i === 1 || i === 4
                    ? "0 0 40px oklch(0.65 0.22 300 / 0.1)"
                    : "none",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "oklch(0.54 0.24 293 / 0.12)" }}
              >
                {reason.icon}
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground text-base mb-2">
                  {reason.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-14 reveal mx-auto max-w-3xl p-8 rounded-2xl border text-center"
          style={{
            background: "oklch(0.09 0.03 285 / 0.9)",
            borderColor: "oklch(0.54 0.24 293 / 0.3)",
            boxShadow: "0 0 60px oklch(0.54 0.24 293 / 0.08)",
          }}
        >
          <p className="font-display text-2xl font-bold text-foreground mb-3">
            Your Capital, Our Strategy
          </p>
          <p className="font-body text-muted-foreground leading-relaxed">
            Ready to take your brand to the next level? Join the growing list of
            businesses that trust Capital Partners as their long-term growth
            partner.
          </p>
          <button
            type="button"
            data-ocid="why-choose-us.cta.button"
            onClick={() => {
              document
                .querySelector("#request-form")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-block mt-6 px-8 py-3 rounded-xl font-heading font-bold text-sm transition-opacity hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.44 0.22 285), oklch(0.60 0.26 295))",
              color: "oklch(0.97 0 0)",
              boxShadow: "0 0 30px oklch(0.54 0.24 293 / 0.35)",
            }}
          >
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Portfolio Section ─────────────────────────────────────── */
interface ProjectItem {
  title: string;
  type: string;
  description: string;
  image: string;
  color: string;
}

const PROJECTS: ProjectItem[] = [
  {
    title: "Brand Identity Campaign",
    type: "Branding",
    description:
      "Complete visual identity system for a luxury consumer brand — logo, typography, and brand guidelines.",
    image: "/assets/generated/portfolio-brand-identity.dim_800x500.jpg",
    color: "oklch(0.54 0.24 293)",
  },
  {
    title: "Executive Growth Strategy",
    type: "Strategy",
    description:
      "A transformative 12-month growth roadmap delivered for a mid-market consultancy.",
    image: "/assets/generated/portfolio-growth-strategy.dim_800x500.jpg",
    color: "oklch(0.72 0.16 75)",
  },
  {
    title: "Digital Promotions Suite",
    type: "Marketing",
    description:
      "Multi-channel digital marketing campaign achieving 400% increase in brand reach.",
    image: "/assets/generated/portfolio-digital-promos.dim_800x500.jpg",
    color: "oklch(0.60 0.22 300)",
  },
  {
    title: "Investment Portfolio Design",
    type: "Investment",
    description:
      "Strategic asset allocation framework for a high-net-worth private investment group.",
    image: "/assets/generated/portfolio-investment.dim_800x500.jpg",
    color: "oklch(0.66 0.20 150)",
  },
  {
    title: "Corporate Management System",
    type: "Management",
    description:
      "End-to-end enterprise management platform deployed across three regional offices.",
    image: "/assets/generated/portfolio-management.dim_800x500.jpg",
    color: "oklch(0.54 0.24 293)",
  },
  {
    title: "Social Media Blitz",
    type: "Promotions",
    description:
      "Viral social media campaign generating 2M+ impressions in 30 days across platforms.",
    image: "/assets/generated/portfolio-social-blitz.dim_800x500.jpg",
    color: "oklch(0.82 0.18 75)",
  },
];

function PortfolioCard({
  project,
  index,
}: { project: ProjectItem; index: number }) {
  return (
    <article
      data-ocid={`portfolio.project.card.${index + 1}`}
      className="reveal portfolio-card rounded-2xl overflow-hidden border group cursor-pointer"
      style={{
        background: "oklch(0.09 0.02 285 / 0.8)",
        borderColor: "oklch(0.22 0.04 285 / 0.8)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={project.image}
          alt={project.title}
          className="card-img w-full h-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to top, ${project.color}33, transparent)`,
          }}
        />
        <Badge
          className="absolute top-3 left-3 font-heading font-bold text-xs"
          style={{
            background: `${project.color}22`,
            borderColor: `${project.color}55`,
            color: project.color,
          }}
        >
          {project.type}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </div>
    </article>
  );
}

function PortfolioSection() {
  return (
    <section
      id="portfolio"
      data-ocid="portfolio.section"
      className="relative py-28 overflow-hidden"
      style={{ background: "oklch(0.07 0.01 280 / 0.5)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="font-heading text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">
            Our Work
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Portfolio &amp; <span className="gradient-text">Projects</span>
          </h2>
          <div className="section-line mx-auto mb-4" />
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Our portfolio is being curated. Exceptional work is on its way.
          </p>
        </div>

        {/* Blurred portfolio grid with Coming Soon overlay */}
        <div className="relative reveal">
          {/* Blurred cards underneath */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{
              filter: "blur(7px)",
              pointerEvents: "none",
              userSelect: "none",
            }}
            aria-hidden="true"
          >
            {PROJECTS.map((project, i) => (
              <PortfolioCard key={project.title} project={project} index={i} />
            ))}
          </div>

          {/* Coming Soon overlay */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-2xl"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.07 0.01 280 / 0.5) 0%, oklch(0.05 0 0 / 0.80) 60%, oklch(0.05 0 0 / 0.95) 100%)",
            }}
          >
            {/* Lock icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.44 0.22 285 / 0.3), oklch(0.60 0.26 295 / 0.15))",
                border: "1px solid oklch(0.54 0.24 293 / 0.4)",
                boxShadow: "0 0 40px oklch(0.54 0.24 293 / 0.3)",
              }}
            >
              <Lock size={28} style={{ color: "oklch(0.72 0.22 293)" }} />
            </div>

            <div className="text-center space-y-3 px-6 max-w-md">
              <span
                className="inline-flex items-center gap-2 font-heading font-bold text-base px-6 py-2.5 rounded-full border tracking-widest uppercase"
                style={{
                  background: "oklch(0.54 0.24 293 / 0.18)",
                  borderColor: "oklch(0.54 0.24 293 / 0.5)",
                  color: "oklch(0.80 0.22 293)",
                  boxShadow: "0 0 30px oklch(0.54 0.24 293 / 0.2)",
                }}
              >
                <Star size={13} className="fill-current" />
                Coming Soon
                <Star size={13} className="fill-current" />
              </span>
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: "oklch(0.55 0.08 285)" }}
              >
                Our portfolio showcase is being curated with precision.
                Exceptional work will be revealed very soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Team Section ──────────────────────────────────────────── */
interface TeamMember {
  name: string;
  initials: string;
  role: string;
  title: string;
  description: string;
  available: boolean;
  gradient?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Abdul Ahad (Ahfah)",
    initials: "AA",
    role: "CEO & Founder",
    title: "Visionary CEO",
    description:
      "The driving force behind Capital Partners. Abdul Ahad combines strategic insight with entrepreneurial fire to lead the agency toward global impact.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.44 0.22 285), oklch(0.60 0.26 295))",
  },
  {
    name: "Omar Farooq",
    initials: "OF",
    role: "Co-Founder",
    title: "Strategic Co-Founder",
    description:
      "Omar brings deep business strategy and operational expertise, helping Capital Partners scale with precision and purpose.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.44 0.22 285), oklch(0.60 0.26 295))",
  },
  {
    name: "James Mitchell",
    initials: "JM",
    role: "Head of Freelancing",
    title: "Freelance Operations Lead",
    description:
      "James oversees our global network of freelance talent, ensuring quality delivery and seamless project coordination.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.30 0.12 285), oklch(0.45 0.18 295))",
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    role: "Head of Management",
    title: "Operations Manager",
    description:
      "Priya drives internal operations and client management with sharp organizational skills and a client-first mindset.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.30 0.12 285), oklch(0.45 0.18 295))",
  },
  {
    name: "Bilal Hassan",
    initials: "BH",
    role: "Head of Promotions",
    title: "Promotions Strategist",
    description:
      "Bilal leads promotional campaigns with data-driven strategies that amplify brand visibility and audience engagement.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.30 0.12 285), oklch(0.45 0.18 295))",
  },
  {
    name: "Sarah Johnson",
    initials: "SJ",
    role: "Head of Marketing",
    title: "Marketing Director",
    description:
      "Sarah crafts and executes full-funnel marketing strategies that convert audiences into loyal brand communities.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.30 0.12 285), oklch(0.45 0.18 295))",
  },
  {
    name: "Rahul Verma",
    initials: "RV",
    role: "Head of Content",
    title: "Content Director",
    description:
      "Rahul leads our content production team, ensuring every piece of content is engaging, on-brand, and high-impact.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.30 0.12 285), oklch(0.45 0.18 295))",
  },
  {
    name: "Zara Ahmed",
    initials: "ZA",
    role: "Head of Design",
    title: "Creative Design Lead",
    description:
      "Zara brings visuals to life with premium design work that defines the aesthetic identity of every brand we work with.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.30 0.12 285), oklch(0.45 0.18 295))",
  },
  {
    name: "Tyler Brooks",
    initials: "TB",
    role: "Head of Development",
    title: "Tech Development Lead",
    description:
      "Tyler architects and builds the digital infrastructure that powers our clients' online presence and growth systems.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.30 0.12 285), oklch(0.45 0.18 295))",
  },
  {
    name: "Aryan Kapoor",
    initials: "AK",
    role: "Head of Strategy",
    title: "Growth Strategist",
    description:
      "Aryan maps out long-term growth roadmaps, combining market research and creative thinking to drive results.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.30 0.12 285), oklch(0.45 0.18 295))",
  },
  {
    name: "Fatima Malik",
    initials: "FM",
    role: "Head of Partnerships",
    title: "Partnerships Director",
    description:
      "Fatima builds and nurtures strategic partnerships that extend Capital Partners' reach and create mutual value.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.30 0.12 285), oklch(0.45 0.18 295))",
  },
];

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <div
      data-ocid={`team.member.card.${index + 1}`}
      className="reveal team-card rounded-2xl overflow-hidden border text-center p-8"
      style={{
        background: "oklch(0.09 0.02 285 / 0.8)",
        borderColor: member.available
          ? "oklch(0.54 0.24 293 / 0.25)"
          : "oklch(0.22 0.04 285 / 0.4)",
        transitionDelay: `${index * 100}ms`,
        opacity: member.available ? 1 : undefined,
      }}
    >
      {/* Avatar */}
      <div className="relative inline-block mb-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-display font-bold text-foreground border-2 mx-auto"
          style={{
            background: member.gradient,
            borderColor: member.available
              ? "oklch(0.54 0.24 293 / 0.5)"
              : "oklch(0.30 0.05 280 / 0.4)",
            boxShadow: member.available
              ? "0 0 25px oklch(0.54 0.24 293 / 0.3)"
              : "none",
            color: member.available ? "white" : "oklch(0.45 0 0)",
          }}
        >
          {member.available ? (
            member.initials
          ) : (
            <Lock size={24} className="text-muted-foreground" />
          )}
        </div>
        {member.available && (
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
            style={{
              background: "oklch(0.40 0.15 150)",
              borderColor: "oklch(0.09 0.02 285)",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <Badge
          className="mb-3 text-xs font-heading font-semibold"
          style={{
            background: member.available
              ? "oklch(0.54 0.24 293 / 0.15)"
              : "oklch(0.22 0.04 285 / 0.3)",
            borderColor: member.available
              ? "oklch(0.54 0.24 293 / 0.35)"
              : "oklch(0.30 0.05 280 / 0.3)",
            color: member.available
              ? "oklch(0.75 0.22 293)"
              : "oklch(0.45 0 0)",
          }}
        >
          {member.role}
        </Badge>
        <h3
          className="font-heading text-lg font-bold mb-1"
          style={{
            color: member.available ? "oklch(0.97 0 0)" : "oklch(0.40 0 0)",
          }}
        >
          {member.name}
        </h3>
        <p
          className="font-body text-xs leading-relaxed mt-3"
          style={{
            color: member.available ? "oklch(0.60 0 0)" : "oklch(0.35 0 0)",
          }}
        >
          {member.description}
        </p>
        {!member.available && (
          <span
            className="mt-4 inline-block font-heading font-semibold text-xs px-4 py-1.5 rounded-full border"
            style={{
              background: "oklch(0.54 0.24 293 / 0.08)",
              borderColor: "oklch(0.54 0.24 293 / 0.25)",
              color: "oklch(0.54 0.24 293 / 0.7)",
            }}
          >
            Position Open
          </span>
        )}
      </div>
    </div>
  );
}

function TeamSection() {
  return (
    <section
      id="team"
      data-ocid="team.section"
      className="relative py-28 overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "oklch(0.54 0.24 293)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="font-heading text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">
            The People Behind CP
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="gradient-text">Team</span>
          </h2>
          <div className="section-line mx-auto mb-4" />
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            A small but formidable team of founders dedicated to building your
            success story.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, i) => (
            <TeamCard key={member.role} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact Section ───────────────────────────────────────── */
const SOCIAL_LINKS = [
  {
    label: "Email",
    href: "mailto:officialcapitalpartners@gmail.com",
    icon: <Mail size={20} />,
    color: "oklch(0.60 0.20 30)",
  },
  {
    label: "X / Twitter",
    href: "https://x.com/copitolportners?s=21",
    icon: <SiX size={18} />,
    color: "oklch(0.80 0 0)",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/officialcapitalpartners?igsh=MXIzdGxzZGNhNGU0OQ%3D%3D&utm_source=qr",
    icon: <SiInstagram size={18} />,
    color: "oklch(0.65 0.22 5)",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1CZbDdCYcE/?mibextid=wwXIfr",
    icon: <SiFacebook size={18} />,
    color: "oklch(0.55 0.18 255)",
  },
  {
    label: "Discord",
    href: "https://discord.gg/Te3PFxQ2SM",
    icon: <SiDiscord size={18} />,
    color: "oklch(0.60 0.24 270)",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@officialcapitalpartners?si=CzjejWJyuVRzOTg-",
    icon: <SiYoutube size={20} />,
    color: "oklch(0.58 0.24 25)",
  },
];

/* ─── Footer ────────────────────────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;

  return (
    <footer
      className="relative py-16 overflow-hidden border-t"
      style={{ borderColor: "oklch(0.54 0.24 293 / 0.15)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, oklch(0.54 0.24 293 / 0.06), transparent)",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/IMG_5419-1.png"
              alt="Capital Partners"
              className="w-10 h-10 object-contain"
              style={{ mixBlendMode: "screen" }}
            />
            <span className="font-heading font-bold text-xl">
              <span className="gradient-text">Capital</span>{" "}
              <span className="text-foreground">Partners</span>
            </span>
          </div>

          {/* Tagline */}
          <p
            className="font-display text-lg italic"
            style={{ color: "oklch(0.72 0.22 293)" }}
          >
            "Your Capital. Our Strategy."
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={
                  social.href.startsWith("mailto:") ? undefined : "_blank"
                }
                rel={
                  social.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                aria-label={social.label}
                className="w-9 h-9 rounded-full flex items-center justify-center border hover:border-primary/60 hover:scale-110 transition-all duration-200"
                style={{
                  background: "oklch(0.12 0.02 285 / 0.8)",
                  borderColor: "oklch(0.54 0.24 293 / 0.2)",
                  color: social.color,
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div
            className="w-full max-w-sm h-px"
            style={{ background: "oklch(0.54 0.24 293 / 0.15)" }}
          />

          {/* Copyright */}
          <div className="space-y-1">
            <p className="font-heading text-sm text-muted-foreground">
              © {year} Capital Partners. All rights reserved.
            </p>
            <p
              className="font-body text-xs"
              style={{ color: "oklch(0.40 0 0)" }}
            >
              Built with <span style={{ color: "oklch(0.65 0.22 5)" }}>♥</span>{" "}
              using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                style={{ color: "oklch(0.45 0 0)" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── App Root ──────────────────────────────────────────────── */
export default function App() {
  useScrollReveal();

  // Set dark mode on html element
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";

    // Meta tags
    document.title = "Capital Partners — Your Capital. Our Strategy.";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        "content",
        "Capital Partners (CP) — Premium business agency for management, promotions, freelancing, growth strategy & investment solutions.",
      );
    }
  }, []);

  return (
    <div
      className="min-h-screen font-body"
      style={{ background: "oklch(0.05 0 0)" }}
    >
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.12 0.04 285)",
            border: "1px solid oklch(0.54 0.24 293 / 0.3)",
            color: "oklch(0.97 0 0)",
          },
        }}
      />

      <Navbar />

      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PricingSection />
        <PortfolioSection />
        <WhyChooseUsSection />
        <TeamSection />
      </main>

      <Footer />
    </div>
  );
}
