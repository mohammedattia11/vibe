"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

interface PricingCardProps {
  plan: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ─── FadeIn Component ─────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: FadeInProps) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Features", "How It Works", "Pricing", "FAQ"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(7, 7, 18, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #6c63ff 0%, #3ecfcf 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: "#fff",
            boxShadow: "0 0 20px rgba(108,99,255,0.4)"
          }}>S</div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#f0f0fa", letterSpacing: "-0.5px" }}>Synapse</span>
        </a>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="nav-links">
          {links.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, "-")}`}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#9090b8", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f0f0fa")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9090b8")}
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#9090b8", textDecoration: "none", padding: "8px 16px" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f0f0fa")}
            onMouseLeave={e => (e.currentTarget.style.color = "#9090b8")}>
            Sign in
          </a>
          <CTAButton size="sm">Get Started</CTAButton>
        </div>
      </div>
    </nav>
  );
}

// ─── CTA Button ───────────────────────────────────────────────────────────────
function CTAButton({ children, size = "md", variant = "primary", onClick }: {
  children: ReactNode; size?: "sm" | "md" | "lg"; variant?: "primary" | "ghost"; onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const padMap = { sm: "9px 20px", md: "13px 28px", lg: "16px 36px" };
  const fontMap = { sm: 13, md: 15, lg: 16 };

  if (variant === "ghost") return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: fontMap[size], fontWeight: 500,
        padding: padMap[size], borderRadius: 12, cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.12)", color: "#d0d0f0",
        background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
        transition: "all 0.2s", letterSpacing: "-0.2px",
      }}
    >{children}</button>
  );

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: fontMap[size], fontWeight: 600,
        padding: padMap[size], borderRadius: 12, cursor: "pointer", border: "none",
        background: hovered
          ? "linear-gradient(135deg, #7c72ff 0%, #4edede 100%)"
          : "linear-gradient(135deg, #6c63ff 0%, #3ecfcf 100%)",
        color: "#fff", transition: "all 0.25s",
        boxShadow: hovered ? "0 8px 32px rgba(108,99,255,0.55)" : "0 4px 20px rgba(108,99,255,0.35)",
        transform: hovered ? "translateY(-1px)" : "none",
        letterSpacing: "-0.2px",
      }}
    >{children}</button>
  );
}

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────
function DashboardMockup() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(108,99,255,0.1)",
      position: "relative",
    }}>
      {/* Window bar */}
      <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ flex: 1, height: 24, background: "rgba(255,255,255,0.04)", borderRadius: 6, marginLeft: 8 }} />
      </div>

      {/* Sidebar + Content */}
      <div style={{ display: "flex", height: 320 }}>
        {/* Sidebar */}
        <div style={{ width: 140, borderRight: "1px solid rgba(255,255,255,0.06)", padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          {["Dashboard", "Analytics", "Workflows", "Team", "Settings"].map((item, i) => (
            <div key={item} style={{
              padding: "8px 12px", borderRadius: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif",
              color: i === 0 ? "#fff" : "#6060a0",
              background: i === 0 ? "rgba(108,99,255,0.2)" : "transparent",
            }}>{item}</div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { label: "Revenue", value: "$48.2K", delta: "+18%" },
              { label: "Users", value: "12,841", delta: "+24%" },
              { label: "Uptime", value: "99.99%", delta: "stable" },
            ].map(stat => (
              <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 10, color: "#6060a0", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f0fa", fontFamily: "'DM Sans', sans-serif" }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: "#3ecfcf", fontFamily: "'DM Sans', sans-serif" }}>{stat.delta}</div>
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", padding: 12, position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 10, color: "#6060a0", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Revenue trend — last 30 days</div>
            <svg viewBox="0 0 300 80" style={{ width: "100%", height: "70%" }}>
              <defs>
                <linearGradient id="grd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6c63ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,70 C20,65 40,55 60,50 S100,30 120,25 S160,20 180,18 S220,15 240,12 S270,8 300,5" stroke="#6c63ff" strokeWidth="2" fill="none" />
              <path d="M0,70 C20,65 40,55 60,50 S100,30 120,25 S160,20 180,18 S220,15 240,12 S270,8 300,5 L300,80 L0,80 Z" fill="url(#grd)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      paddingTop: 100, paddingBottom: 80,
      background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(108,99,255,0.18) 0%, transparent 70%)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Bg grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 80%)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", position: "relative", zIndex: 1, width: "100%" }}>
        {/* Left */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.3)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 28,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6c63ff", display: "inline-block", boxShadow: "0 0 8px #6c63ff" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#a09bff", fontWeight: 500 }}>Now in public beta</span>
          </div>

          <h1 style={{
            fontFamily: "'Instrument Serif', serif", fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 400, color: "#f0f0fa", lineHeight: 1.1, marginBottom: 24,
            letterSpacing: "-1px",
          }}>
            Ship products that<br />
            <span style={{ fontStyle: "italic", background: "linear-gradient(135deg, #6c63ff, #3ecfcf)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              feel like magic.
            </span>
          </h1>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#8080aa", lineHeight: 1.7, marginBottom: 40, maxWidth: 440, fontWeight: 300 }}>
            Synapse unifies your team's workflows, data, and deployments into one AI-native platform — so you move fast without breaking things.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
            <CTAButton size="lg">Get Started Free</CTAButton>
            <CTAButton size="lg" variant="ghost">See Demo →</CTAButton>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>⭐️⭐️⭐️⭐️⭐️</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6060a0" }}>4.9/5 from 2,400+ reviews</span>
            </div>
            <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6060a0" }}>🔒 SOC 2 Type II</span>
            <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6060a0" }}>🌍 GDPR Ready</span>
          </div>
        </div>

        {/* Right — Dashboard */}
        <div style={{ animation: "floatY 6s ease-in-out infinite" }}>
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

// ─── Logo Bar ─────────────────────────────────────────────────────────────────
function LogoBar() {
  const logos = ["Vercel", "Stripe", "Linear", "Notion", "Figma", "Supabase", "GitHub", "Raycast"];
  return (
    <section style={{ padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#4a4a70", textAlign: "center", marginBottom: 32, textTransform: "uppercase", letterSpacing: "2px" }}>
          Trusted by teams at world-class companies
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(24px, 4vw, 56px)", flexWrap: "wrap", alignItems: "center" }}>
          {logos.map(logo => (
            <div key={logo} style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15,
              color: "#3a3a60", letterSpacing: "-0.3px",
              transition: "color 0.2s", cursor: "default",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#8080c0")}
              onMouseLeave={e => (e.currentTarget.style.color = "#3a3a60")}
            >{logo}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem → Solution ───────────────────────────────────────────────────────
function ProblemSolution() {
  const problems = [
    { icon: "⚡", text: "Switching between 10+ disconnected tools kills your momentum" },
    { icon: "🔀", text: "Manual workflows create errors, delays, and team frustration" },
    { icon: "📊", text: "Data lives in silos — insights arrive too late to matter" },
  ];
  const solutions = [
    { icon: "✦", text: "One unified workspace connects every tool your team relies on" },
    { icon: "✦", text: "AI-powered automation handles the repetitive work for you" },
    { icon: "✦", text: "Real-time data pipelines surface insights the moment they're ready" },
  ];

  return (
    <section id="features" style={{ padding: "120px 24px", background: "rgba(255,255,255,0.01)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4vw, 52px)", color: "#f0f0fa", fontWeight: 400, marginBottom: 16, letterSpacing: "-0.5px" }}>
              The old way is broken.
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#6060a0", maxWidth: 520, margin: "0 auto" }}>
              Most teams are slowed down by the very tools meant to help them. Here's what changes with Synapse.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 40, alignItems: "center" }}>
          {/* Problems */}
          <FadeIn delay={100}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#ff6b6b", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>Without Synapse</div>
              {problems.map((p, i) => (
                <div key={i} style={{
                  display: "flex", gap: 14, alignItems: "flex-start",
                  background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.12)",
                  borderRadius: 14, padding: "16px 18px",
                }}>
                  <span style={{ fontSize: 20 }}>{p.icon}</span>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#7070a0", lineHeight: 1.6, margin: 0 }}>{p.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Arrow */}
          <FadeIn delay={200}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg, #6c63ff, #3ecfcf)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: "#fff", flexShrink: 0,
              boxShadow: "0 0 30px rgba(108,99,255,0.4)",
            }}>→</div>
          </FadeIn>

          {/* Solutions */}
          <FadeIn delay={300}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3ecfcf", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>With Synapse</div>
              {solutions.map((s, i) => (
                <div key={i} style={{
                  display: "flex", gap: 14, alignItems: "flex-start",
                  background: "rgba(62,207,207,0.05)", border: "1px solid rgba(62,207,207,0.15)",
                  borderRadius: 14, padding: "16px 18px",
                }}>
                  <span style={{ fontSize: 18, color: "#3ecfcf", marginTop: 1 }}>{s.icon}</span>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#b0b0d0", lineHeight: 1.6, margin: 0 }}>{s.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: hovered ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 18, padding: "28px 26px", transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.3)" : "none",
        cursor: "default",
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 12, marginBottom: 18,
        background: gradient, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, boxShadow: hovered ? `0 8px 24px ${gradient.includes("6c63ff") ? "rgba(108,99,255,0.4)" : "rgba(62,207,207,0.3)"}` : "none",
        transition: "box-shadow 0.3s",
      }}>{icon}</div>
      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 600, color: "#e0e0f8", marginBottom: 10, letterSpacing: "-0.3px" }}>{title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6060a0", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{description}</p>
    </div>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: "🤖", title: "AI Workflow Engine", description: "Automate complex multi-step processes with natural language. Define once, run forever.", gradient: "linear-gradient(135deg, #6c63ff, #9b8fff)" },
    { icon: "📡", title: "Real-time Data Sync", description: "Connect any source. Webhook, REST, GraphQL — your data flows instantly across all views.", gradient: "linear-gradient(135deg, #3ecfcf, #6ae8e8)" },
    { icon: "🔐", title: "Enterprise Security", description: "SOC 2 Type II, SSO, RBAC, audit logs. Security-first from the ground up.", gradient: "linear-gradient(135deg, #ff7eb3, #ff6090)" },
    { icon: "📈", title: "Smart Analytics", description: "Dashboards that think. Surface anomalies, trends, and predictions before you ask.", gradient: "linear-gradient(135deg, #f7b733, #fc4a1a)" },
    { icon: "🔌", title: "1-Click Integrations", description: "Slack, GitHub, Jira, Notion, Stripe and 200+ more. Connected in seconds, not hours.", gradient: "linear-gradient(135deg, #43e97b, #38f9d7)" },
    { icon: "⚙️", title: "Developer API", description: "Full REST + GraphQL API with SDKs for Node, Python, Go. Build on top of Synapse.", gradient: "linear-gradient(135deg, #a18cd1, #fbc2eb)" },
  ];

  return (
    <section id="features" style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6c63ff", textTransform: "uppercase", letterSpacing: "2.5px" }}>Capabilities</span>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(30px, 4vw, 50px)", color: "#f0f0fa", fontWeight: 400, marginTop: 12, marginBottom: 14, letterSpacing: "-0.5px" }}>
              Everything your team needs,<br /><em>nothing it doesn't.</em>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#6060a0", maxWidth: 480, margin: "0 auto" }}>
              Purpose-built features that grow with you — from solo founders to 500-person engineering teams.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 80}>
              <FeatureCard {...f} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: "01", title: "Sign Up in Seconds", description: "Create your account with a single click. No credit card. No setup friction. You're in.", icon: "🚀" },
    { num: "02", title: "Connect Your Stack", description: "Link your tools, import your data, and define your first workflow in under 5 minutes.", icon: "🔗" },
    { num: "03", title: "Get Results Instantly", description: "Watch automations run, insights surface, and your team move faster than ever before.", icon: "✨" },
  ];

  return (
    <section id="how-it-works" style={{ padding: "120px 24px", background: "rgba(108,99,255,0.04)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3ecfcf", textTransform: "uppercase", letterSpacing: "2.5px" }}>Process</span>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(30px, 4vw, 50px)", color: "#f0f0fa", fontWeight: 400, marginTop: 12, letterSpacing: "-0.5px" }}>
              Up and running in <em>minutes.</em>
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, position: "relative" }}>
          {/* Connector line */}
          <div style={{
            position: "absolute", top: 52, left: "calc(16.67% + 26px)", right: "calc(16.67% + 26px)",
            height: 1, background: "linear-gradient(90deg, rgba(108,99,255,0.5) 0%, rgba(62,207,207,0.5) 100%)",
            zIndex: 0,
          }} />

          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 150}>
              <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", margin: "0 auto 24px",
                  background: i === 0 ? "linear-gradient(135deg, #6c63ff, #9b8fff)"
                    : i === 1 ? "linear-gradient(135deg, #5b85ff, #6cc2ff)"
                      : "linear-gradient(135deg, #3ecfcf, #6ae8e8)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, boxShadow: "0 8px 30px rgba(108,99,255,0.3)",
                }}>{step.icon}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#4040a0", letterSpacing: "2px", marginBottom: 10 }}>{step.num}</div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 600, color: "#e0e0f8", marginBottom: 12, letterSpacing: "-0.3px" }}>{step.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6060a0", lineHeight: 1.7 }}>{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Preview ──────────────────────────────────────────────────────────
function ProductPreview() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Analytics", "Workflows", "AI Chat", "Code Editor"];

  const TabContent = ({ idx }: { idx: number }) => {
    const colors = ["#6c63ff", "#3ecfcf", "#ff7eb3", "#f7b733"];
    const icons = ["📊", "🔀", "🤖", "💻"];
    const descriptions = [
      "Real-time charts and KPI dashboards update as your data flows in.",
      "Drag-and-drop automation builder with 200+ pre-built action blocks.",
      "Ask your data anything in plain English. Get instant, accurate answers.",
      "Full-featured editor with AI completion, linting, and live preview.",
    ];
    return (
      <div style={{
        height: 340, background: "rgba(255,255,255,0.02)", borderRadius: "0 0 18px 18px",
        border: "1px solid rgba(255,255,255,0.07)", borderTop: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 16,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: `linear-gradient(135deg, ${colors[idx]}, ${colors[(idx + 1) % 4]})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, boxShadow: `0 12px 40px ${colors[idx]}55`,
        }}>{icons[idx]}</div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#8080b0", textAlign: "center", maxWidth: 360 }}>{descriptions[idx]}</p>
      </div>
    );
  };

  return (
    <section style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6c63ff", textTransform: "uppercase", letterSpacing: "2.5px" }}>Product</span>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(30px, 4vw, 50px)", color: "#f0f0fa", fontWeight: 400, marginTop: 12, letterSpacing: "-0.5px" }}>
              See it in action.
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {tabs.map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)} style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                  padding: "12px 22px", border: "none", cursor: "pointer",
                  background: "transparent",
                  color: activeTab === i ? "#f0f0fa" : "#5050a0",
                  borderBottom: activeTab === i ? "2px solid #6c63ff" : "2px solid transparent",
                  marginBottom: -1, transition: "all 0.2s",
                }}>{tab}</button>
              ))}
            </div>
            <TabContent idx={activeTab} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialCard({ quote, name, role, avatar }: TestimonialCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.03)",
        border: hovered ? "1px solid rgba(255,255,255,0.13)" : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 18, padding: "28px 24px", transition: "all 0.3s",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
    >
      <div style={{ fontSize: 24, color: "#6c63ff", marginBottom: 16 }}>❝</div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#b0b0d0", lineHeight: 1.8, marginBottom: 24, fontWeight: 300 }}>
        {quote}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "linear-gradient(135deg, #6c63ff, #3ecfcf)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 700, color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
        }}>{avatar}</div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#e0e0f8" }}>{name}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#5050a0" }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote: "Synapse replaced 7 different tools we were stitching together manually. We ship twice as fast now, with fewer bugs and zero context switching.",
      name: "Sofia Reyes",
      role: "CTO at Helix Labs",
      avatar: "S",
    },
    {
      quote: "The AI workflow engine is genuinely magic. I described our onboarding process in plain English and it just… worked. First try.",
      name: "Marcus Chen",
      role: "Head of Product at Loopback",
      avatar: "M",
    },
    {
      quote: "I was skeptical about 'all-in-one' tools, but Synapse is different. It doesn't try to do everything — it does the right things, exceptionally well.",
      name: "Aisha Okafor",
      role: "Founder at Drift Protocol",
      avatar: "A",
    },
  ];

  return (
    <section style={{ padding: "120px 24px", background: "rgba(255,255,255,0.01)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3ecfcf", textTransform: "uppercase", letterSpacing: "2.5px" }}>Testimonials</span>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(30px, 4vw, 50px)", color: "#f0f0fa", fontWeight: 400, marginTop: 12, letterSpacing: "-0.5px" }}>
              Teams that made the switch.
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 100}>
              <TestimonialCard {...t} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function PricingCard({ plan, price, description, features, highlighted = false, badge }: PricingCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: highlighted ? "linear-gradient(145deg, rgba(108,99,255,0.15), rgba(62,207,207,0.05))"
          : hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
        border: highlighted ? "1px solid rgba(108,99,255,0.4)" : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20, padding: "36px 28px", position: "relative",
        transition: "all 0.3s", transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: highlighted ? "0 0 60px rgba(108,99,255,0.15)" : "none",
      }}
    >
      {badge && (
        <div style={{
          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #6c63ff, #3ecfcf)",
          borderRadius: 100, padding: "4px 16px",
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#fff",
          whiteSpace: "nowrap",
        }}>{badge}</div>
      )}
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: highlighted ? "#a09bff" : "#6060a0", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>{plan}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
        <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, color: "#f0f0fa", lineHeight: 1 }}>{price}</span>
        {price !== "Custom" && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#5050a0" }}>/mo</span>}
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6060a0", marginBottom: 28, lineHeight: 1.6 }}>{description}</p>
      <CTAButton size="md" variant={highlighted ? "primary" : "ghost"}>
        {plan === "Enterprise" ? "Contact Sales" : "Get Started"}
      </CTAButton>
      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
        {features.map(f => (
          <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: "#3ecfcf", fontSize: 14, marginTop: 1 }}>✓</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#8080b0" }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pricing() {
  const plans = [
    {
      plan: "Starter",
      price: "$0",
      description: "Perfect for solo builders and early-stage projects.",
      features: ["3 active workflows", "5,000 events/month", "Basic analytics", "Community support", "1 integration"],
    },
    {
      plan: "Pro",
      price: "$49",
      description: "For fast-moving teams that need power and reliability.",
      features: ["Unlimited workflows", "500K events/month", "Advanced analytics", "Priority support", "200+ integrations", "Team collaboration", "Custom domains"],
      highlighted: true,
      badge: "Most Popular",
    },
    {
      plan: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large organizations with complex needs.",
      features: ["Everything in Pro", "Unlimited scale", "Dedicated infrastructure", "SSO & SAML", "Custom SLA", "Dedicated success manager", "On-prem option"],
    },
  ];

  return (
    <section id="pricing" style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6c63ff", textTransform: "uppercase", letterSpacing: "2.5px" }}>Pricing</span>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(30px, 4vw, 50px)", color: "#f0f0fa", fontWeight: 400, marginTop: 12, letterSpacing: "-0.5px" }}>
              Simple, honest pricing.
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#6060a0", marginTop: 12 }}>No hidden fees. No surprises. Cancel anytime.</p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "start" }}>
          {plans.map((p, i) => (
            <FadeIn key={p.plan} delay={i * 100}>
              <PricingCard {...p} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden",
      transition: "border-color 0.2s",
      borderColor: open ? "rgba(108,99,255,0.3)" : "rgba(255,255,255,0.07)",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "20px 24px", display: "flex", justifyContent: "space-between",
          alignItems: "center", background: "transparent", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: "#e0e0f8" }}>{question}</span>
        <span style={{
          fontSize: 20, color: "#6c63ff", transition: "transform 0.3s",
          transform: open ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: 16,
        }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 24px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6060a0", lineHeight: 1.8, margin: "16px 0 0" }}>{answer}</p>
        </div>
      )}
    </div>
  );
}

function FAQ() {
  const faqs = [
    { question: "Is there a free trial?", answer: "Yes. The Starter plan is permanently free — no credit card required. You can upgrade anytime when you're ready for more." },
    { question: "Can I cancel at any time?", answer: "Absolutely. No lock-in, no cancellation fees. You can cancel or downgrade your plan from your account settings with one click." },
    { question: "How does the event limit work?", answer: "An event is any action processed by Synapse — a webhook received, an automation step executed, a data sync triggered. Most Pro customers use well under their limit." },
    { question: "Do you support on-premise deployment?", answer: "Yes, on-premise deployment is available for Enterprise customers. Reach out to our sales team and we'll walk you through the setup." },
    { question: "What integrations do you support?", answer: "We support 200+ integrations including Slack, GitHub, Jira, Notion, Stripe, Salesforce, HubSpot, and all major databases. We also offer a full API for custom integrations." },
    { question: "How is my data secured?", answer: "We're SOC 2 Type II certified, GDPR-compliant, and encrypt all data at rest and in transit. Enterprise customers get dedicated infrastructure and optional single-tenancy." },
  ];

  return (
    <section id="faq" style={{ padding: "120px 24px", background: "rgba(255,255,255,0.01)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3ecfcf", textTransform: "uppercase", letterSpacing: "2.5px" }}>FAQ</span>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(30px, 4vw, 50px)", color: "#f0f0fa", fontWeight: 400, marginTop: 12, letterSpacing: "-0.5px" }}>
              Questions & answers.
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f, i) => (
            <FadeIn key={f.question} delay={i * 60}>
              <FAQItem {...f} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <div style={{
            background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(108,99,255,0.18) 0%, transparent 70%)",
            borderRadius: 32, padding: "80px 40px",
            border: "1px solid rgba(108,99,255,0.15)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Glow orb */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: 400, height: 400, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <h2 style={{
              fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 5vw, 58px)",
              color: "#f0f0fa", fontWeight: 400, marginBottom: 20, letterSpacing: "-1px",
              position: "relative",
            }}>
              Ready to build something <em>incredible?</em>
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#7070a0",
              marginBottom: 40, lineHeight: 1.7, fontWeight: 300, position: "relative",
            }}>
              Join 14,000+ teams who've already made the switch. Start free — no setup required, results in minutes.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <CTAButton size="lg">Start Building Free</CTAButton>
              <CTAButton size="lg" variant="ghost">Talk to Sales</CTAButton>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#4040a0", marginTop: 24 }}>
              ✦ Free forever plan &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Cancel anytime
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Developers: ["Docs", "API Reference", "Status", "GitHub"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
  };

  return (
    <footer style={{ padding: "64px 24px 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 64 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #6c63ff, #3ecfcf)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>S</div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: "#f0f0fa" }}>Synapse</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#4a4a70", lineHeight: 1.7, maxWidth: 220, marginBottom: 24 }}>
              The AI-native platform for modern product teams.
            </p>
            {/* Socials */}
            <div style={{ display: "flex", gap: 12 }}>
              {["𝕏", "in", "gh", "yt"].map(s => (
                <a key={s} href="#" style={{
                  width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#5050a0", textDecoration: "none",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.4)"; e.currentTarget.style.color = "#a09bff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#5050a0"; }}
                >{s}</a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#3030a0", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 16 }}>{category}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map(item => (
                  <a key={item} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#5050a0", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#b0b0d0")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#5050a0")}
                  >{item}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#3030a0" }}>© 2026 Synapse Technologies, Inc. All rights reserved.</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#3030a0" }}>Made with ✦ for builders.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Root Page ────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #09090f; color: #f0f0fa; -webkit-font-smoothing: antialiased; }

        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @media (max-width: 768px) {
          .nav-links { display: none !important; }
        }

        @media (max-width: 900px) {
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          section > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          section > div[style*="grid-template-columns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Navbar />

      <main>
        <HeroSection />
        <LogoBar />
        <ProblemSolution />
        <FeaturesSection />
        <HowItWorks />
        <ProductPreview />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}