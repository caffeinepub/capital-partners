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
  { label: "Packages", href: "#packages" },
  { label: "Portfolio", href: "#portfolio" },
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
            src="/assets/uploads/IMG_5302-1-1.png"
            alt="Capital Partners Logo"
            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
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
    const STREAK_COUNT = 55;
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
      speed: 0.0006 + Math.random() * 0.001,
      length: 0.06 + Math.random() * 0.14,
      alpha: 0.06 + Math.random() * 0.13,
      width: 0.5 + Math.random() * 1.2,
      hue: 265 + Math.floor(Math.random() * 55),
      waver: Math.random() * Math.PI * 2,
      waverSpeed: 0.0002 + Math.random() * 0.0003,
    }));

    // ── Slow horizontal ripple lines (water surface reflections) ──
    const RIPPLE_COUNT = 14;
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
      alpha: 0.03 + Math.random() * 0.06,
      hue: 270 + Math.floor(Math.random() * 45),
    }));

    // ── Subsurface glow blobs ──
    const BLOB_COUNT = 6;
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
      radius: 0.15 + Math.random() * 0.2,
      intensity: 0.05 + Math.random() * 0.07,
    }));

    let t = 0;

    function draw() {
      if (!ctx) return;
      t++;

      // ── 1. Deep background ──
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#02000e");
      bg.addColorStop(0.4, "#060018");
      bg.addColorStop(0.75, "#0c0030");
      bg.addColorStop(1, "#04000f");
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
        g.addColorStop(0, `rgba(110,30,220,${alpha})`);
        g.addColorStop(0.5, `rgba(60,10,140,${alpha * 0.4})`);
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
      vign.addColorStop(0, "rgba(2,0,12,0.65)");
      vign.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, width, height * 0.3);

      // ── 6. Bottom vignette ──
      const bvign = ctx.createLinearGradient(0, height * 0.75, 0, height);
      bvign.addColorStop(0, "rgba(0,0,0,0)");
      bvign.addColorStop(1, "rgba(2,0,10,0.55)");
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
            "linear-gradient(to bottom, rgba(2,0,10,0.55) 0%, rgba(5,0,20,0.35) 50%, rgba(5,0,16,0.75) 100%)",
        }}
      />
      {/* Purple radial glow at center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(100,20,200,0.12), transparent 70%)",
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
              src="/assets/uploads/IMG_5302-1-1.png"
              alt="Capital Partners"
              className="relative w-36 h-36 md:w-48 md:h-48 object-contain drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 0 30px oklch(0.54 0.24 293 / 0.6))",
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
                  { value: "50+", label: "Clients" },
                  { value: "3+", label: "Years" },
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

/* ─── Packages Section ──────────────────────────────────────── */
interface PackageItem {
  name: string;
  tagline: string;
  icon: React.ReactNode;
  features: string[];
  highlight: boolean;
  color: string;
}

const PACKAGES: PackageItem[] = [
  {
    name: "Basic",
    tagline: "Start your journey",
    icon: <Zap size={20} />,
    features: [
      "Business consultation (1 session/month)",
      "Social media management (1 platform)",
      "Monthly performance report",
      "Email support",
    ],
    highlight: false,
    color: "oklch(0.54 0.24 293)",
  },
  {
    name: "Professional",
    tagline: "Accelerate growth",
    icon: <TrendingUp size={22} />,
    features: [
      "Business consultation (4 sessions/month)",
      "Multi-platform promotions",
      "Brand strategy development",
      "Freelancer network access",
      "Bi-weekly performance reports",
      "Priority support",
    ],
    highlight: true,
    color: "oklch(0.65 0.22 300)",
  },
  {
    name: "Pro",
    tagline: "Dominate your market",
    icon: <Rocket size={22} />,
    features: [
      "Unlimited consultations",
      "Full-suite management & promotions",
      "Investment advisory",
      "Dedicated account manager",
      "Custom AI tools integration",
      "Weekly in-depth reporting",
      "24/7 VIP support",
    ],
    highlight: false,
    color: "oklch(0.72 0.16 75)",
  },
];

function PackagesSection() {
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
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="font-heading text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">
            Investment Tiers
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="gradient-text">Packages</span>
          </h2>
          <div className="section-line mx-auto mb-4" />
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Choose the package that fits your ambition. Pricing details are
            being finalized and will be revealed at launch.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PACKAGES.map((pkg, i) => (
            <div
              key={pkg.name}
              data-ocid={`packages.card.${i + 1}`}
              className="reveal relative rounded-2xl border flex flex-col overflow-hidden"
              style={{
                background: pkg.highlight
                  ? "linear-gradient(160deg, oklch(0.13 0.06 285 / 0.95), oklch(0.09 0.04 280 / 0.95))"
                  : "oklch(0.09 0.02 285 / 0.85)",
                borderColor: pkg.highlight
                  ? `${pkg.color}66`
                  : "oklch(0.22 0.04 285 / 0.5)",
                boxShadow: pkg.highlight
                  ? `0 0 60px ${pkg.color}28, 0 0 0 1px ${pkg.color}44`
                  : "none",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {/* Most Popular badge */}
              {pkg.highlight && (
                <div
                  className="text-center py-2 font-heading font-bold text-xs tracking-widest uppercase"
                  style={{
                    background: `linear-gradient(90deg, ${pkg.color}55, ${pkg.color}33)`,
                    color: pkg.color,
                    borderBottom: `1px solid ${pkg.color}44`,
                  }}
                >
                  ★ Most Popular
                </div>
              )}

              <div className="p-8 flex flex-col gap-6 flex-1">
                {/* Icon + name */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${pkg.color}20`,
                      border: `1px solid ${pkg.color}44`,
                      color: pkg.color,
                    }}
                  >
                    {pkg.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {pkg.name}
                    </h3>
                    <p className="font-heading text-xs text-muted-foreground">
                      {pkg.tagline}
                    </p>
                  </div>
                </div>

                {/* Blurred price */}
                <div className="relative">
                  <div
                    className="flex items-end gap-1 select-none"
                    style={{ filter: "blur(8px)", userSelect: "none" }}
                    aria-hidden="true"
                  >
                    <span
                      className="font-display text-4xl font-bold"
                      style={{ color: pkg.color }}
                    >
                      $XXX
                    </span>
                    <span className="font-heading text-sm text-muted-foreground mb-2">
                      / month
                    </span>
                  </div>
                  <span
                    className="absolute inset-0 flex items-center font-heading font-semibold text-xs px-3 py-1 rounded-full tracking-widest uppercase w-fit h-fit my-auto"
                    style={{
                      background: "oklch(0.54 0.24 293 / 0.15)",
                      borderColor: "oklch(0.54 0.24 293 / 0.4)",
                      border: "1px solid",
                      color: "oklch(0.72 0.22 293)",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <Lock size={10} className="mr-1.5" />
                    Coming Soon
                  </span>
                </div>

                {/* Features list */}
                <ul className="flex flex-col gap-3 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2
                        size={15}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: pkg.color }}
                      />
                      <span className="font-body text-sm text-muted-foreground leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  type="button"
                  data-ocid={`packages.cta.button.${i + 1}`}
                  onClick={() => {
                    const contact = document.querySelector("#contact");
                    if (contact) {
                      const top =
                        contact.getBoundingClientRect().top +
                        window.scrollY -
                        80;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  }}
                  className="w-full py-3 rounded-xl font-heading font-bold text-sm transition-all duration-200 hover:opacity-90"
                  style={
                    pkg.highlight
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.44 0.22 285), oklch(0.60 0.26 295))",
                          color: "oklch(0.97 0 0)",
                          boxShadow: `0 0 30px ${pkg.color}44`,
                        }
                      : {
                          background: `${pkg.color}18`,
                          border: `1px solid ${pkg.color}44`,
                          color: pkg.color,
                        }
                  }
                >
                  Get in Touch
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center font-heading text-sm text-muted-foreground mt-10 reveal">
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border"
            style={{
              borderColor: "oklch(0.54 0.24 293 / 0.2)",
              background: "oklch(0.54 0.24 293 / 0.05)",
            }}
          >
            <Star size={12} className="text-primary" />
            Pricing will be announced at launch — contact us for early access
            <Star size={12} className="text-primary" />
          </span>
        </p>
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
    name: "Ankit Sharam",
    initials: "AS",
    role: "Freelance Founder",
    title: "Head of Freelancing",
    description:
      "Ankit built our freelancing division from the ground up, curating a network of elite talent across disciplines and industries worldwide.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.40 0.18 260), oklch(0.55 0.22 280))",
  },
  {
    name: "JB",
    initials: "JB",
    role: "Management Founder",
    title: "Head of Management",
    description:
      "JB architects the management frameworks that keep our clients' operations running at peak performance — methodical, precise, and results-driven.",
    available: true,
    gradient:
      "linear-gradient(135deg, oklch(0.35 0.16 290), oklch(0.50 0.20 300))",
  },
  {
    name: "Position Open",
    initials: "?",
    role: "Promotions Founder",
    title: "Head of Promotions",
    description:
      "We're searching for an exceptional promotions visionary to lead our marketing division. Could this be you?",
    available: false,
    gradient:
      "linear-gradient(135deg, oklch(0.20 0.03 280), oklch(0.28 0.04 285))",
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
    href: "https://discord.gg/yRuSDB9Yvn",
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

function ContactSection() {
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !email.trim() || !message.trim()) {
        toast.error("Please fill in all fields.");
        return;
      }
      if (!actor) {
        toast.error("Service not available. Please try again.");
        return;
      }

      setIsSubmitting(true);
      setSubmitState("idle");
      try {
        await actor.submitContactMessage(
          name.trim(),
          email.trim(),
          message.trim(),
        );
        setSubmitState("success");
        setName("");
        setEmail("");
        setMessage("");
        toast.success("Message sent successfully! We'll be in touch soon.");
      } catch {
        setSubmitState("error");
        toast.error("Failed to send message. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [actor, name, email, message],
  );

  return (
    <section
      id="contact"
      data-ocid="contact.section"
      className="relative py-28 overflow-hidden"
      style={{ background: "oklch(0.07 0.01 280 / 0.3)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "oklch(0.54 0.24 293)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="font-heading text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">
            Let's Connect
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <div className="section-line mx-auto mb-4" />
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Ready to build something extraordinary? Reach out and let's discuss
            how Capital Partners can elevate your vision.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="reveal-left">
            <form
              onSubmit={handleSubmit}
              data-ocid="contact.modal"
              className="space-y-5 p-8 rounded-2xl border"
              style={{
                background: "oklch(0.09 0.02 285 / 0.8)",
                borderColor: "oklch(0.54 0.24 293 / 0.2)",
              }}
              noValidate
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-primary" />
                Send Us a Message
              </h3>

              <div>
                <label
                  htmlFor="contact-name"
                  className="font-heading text-sm font-medium text-muted-foreground block mb-2"
                >
                  Your Name
                </label>
                <Input
                  id="contact-name"
                  data-ocid="contact.input"
                  type="text"
                  placeholder="Abdul Ahad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  autoComplete="name"
                  className="contact-input font-body bg-transparent border-border/60 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50 h-11"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="font-heading text-sm font-medium text-muted-foreground block mb-2"
                >
                  Email Address
                </label>
                <Input
                  id="contact-email"
                  data-ocid="contact.input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  autoComplete="email"
                  className="contact-input font-body bg-transparent border-border/60 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50 h-11"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="font-heading text-sm font-medium text-muted-foreground block mb-2"
                >
                  Message
                </label>
                <Textarea
                  id="contact-message"
                  data-ocid="contact.textarea"
                  placeholder="Tell us about your project or inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  required
                  rows={5}
                  className="contact-input font-body bg-transparent border-border/60 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50 resize-none"
                />
              </div>

              {/* Success/Error state */}
              {submitState === "success" && (
                <div
                  data-ocid="contact.success_state"
                  className="flex items-center gap-3 p-4 rounded-xl border"
                  style={{
                    background: "oklch(0.40 0.15 150 / 0.1)",
                    borderColor: "oklch(0.40 0.15 150 / 0.3)",
                  }}
                >
                  <CheckCircle2
                    size={18}
                    style={{ color: "oklch(0.60 0.15 150)" }}
                  />
                  <span
                    className="font-heading text-sm"
                    style={{ color: "oklch(0.60 0.15 150)" }}
                  >
                    Message sent! We'll get back to you shortly.
                  </span>
                </div>
              )}

              {submitState === "error" && (
                <div
                  data-ocid="contact.error_state"
                  className="flex items-center gap-3 p-4 rounded-xl border"
                  style={{
                    background: "oklch(0.577 0.245 27.325 / 0.1)",
                    borderColor: "oklch(0.577 0.245 27.325 / 0.3)",
                  }}
                >
                  <X size={18} className="text-destructive" />
                  <span className="font-heading text-sm text-destructive">
                    Failed to send. Please try again.
                  </span>
                </div>
              )}

              <button
                type="submit"
                data-ocid="contact.submit_button"
                disabled={isSubmitting}
                className="btn-glow w-full py-3 rounded-xl font-heading font-bold text-base text-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.44 0.22 285), oklch(0.60 0.26 295))",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Send Message
                  </>
                )}
              </button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Messages are forwarded to officialahfahtrades@gmail.com
              </p>
            </form>
          </div>

          {/* Social Links & Info */}
          <div className="reveal-right flex flex-col justify-center gap-8">
            {/* Direct contact */}
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Globe size={20} className="text-primary" />
                Find Us Online
              </h3>
              <p className="font-body text-muted-foreground text-sm mb-8">
                Follow Capital Partners across all platforms for the latest
                updates, insights, and opportunities.
              </p>
            </div>

            {/* Social icons grid */}
            <div className="grid grid-cols-3 gap-4">
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
                  data-ocid={`contact.social.${social.label.toLowerCase().replace(/[^a-z0-9]/g, "")}.link`}
                  aria-label={social.label}
                  className="social-icon flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border text-center group"
                  style={{
                    background: "oklch(0.09 0.02 285 / 0.8)",
                    borderColor: "oklch(0.54 0.24 293 / 0.2)",
                    color: social.color,
                  }}
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">
                    {social.icon}
                  </span>
                  <span className="font-heading text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>

            {/* Email direct */}
            <div
              className="flex items-center gap-4 p-5 rounded-2xl border"
              style={{
                background: "oklch(0.09 0.02 285 / 0.8)",
                borderColor: "oklch(0.54 0.24 293 / 0.15)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary"
                style={{ background: "oklch(0.54 0.24 293 / 0.15)" }}
              >
                <Mail size={18} />
              </div>
              <div>
                <p className="font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                  Email Us Directly
                </p>
                <a
                  href="mailto:officialcapitalpartners@gmail.com"
                  className="font-body text-sm text-foreground hover:text-primary transition-colors"
                >
                  officialcapitalpartners@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
              src="/assets/uploads/IMG_5302-1-1.png"
              alt="Capital Partners"
              className="w-10 h-10 object-contain"
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
        <PackagesSection />
        <PortfolioSection />
        <TeamSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
