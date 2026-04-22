import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import checkApprovalImage from "../image/CheckApproval.png";
import chinHsienPhoto from "../image/Chin Hsien.jpg";
import ldePhoto from "../image/LDE.jpg";
import logoPhoto from "../image/logo.jpg";
import mainAequitasImage from "../image/Main Aequitas.png";
import spaCreationImage from "../image/SPA creation.png";
import youngPhoto from "../image/young.jpg";

type PageKey = "mission" | "aequitas" | "pricing";
type TransitionStage = "idle" | "exiting" | "entering";
type BillingMode = "monthly" | "annual";

type NavItem = { key: PageKey; label: string; href: string };
type Founder = { name: string; role: string; image: string };
type PricingTier = {
  title: string;
  monthlyPrice: string;
  annualPrice: string;
  description: string;
  points: string[];
  featured?: boolean;
  buttonLabel: string;
};

const navItems: NavItem[] = [
  { key: "mission", label: "Mission", href: "/" },
  { key: "aequitas", label: "Aequitas", href: "/aequitas" },
  { key: "pricing", label: "Pricing", href: "/pricing" },
];

const pageTitles: Record<PageKey, string> = {
  mission: "Mission",
  aequitas: "Aequitas",
  pricing: "Pricing",
};

const founderCards: Founder[] = [
  {
    name: "Lim Gin Young",
    role: "Co-Founder & CEO",
    image: youngPhoto,
  },
  {
    name: "Low Chin Hsien",
    role: "Co-Founder & CTO",
    image: chinHsienPhoto,
  },
];

const pricingTiers: PricingTier[] = [
  {
    title: "Standard",
    monthlyPrice: "RM1000",
    annualPrice: "RM9600",
    description: "Essential intelligence tools for boutique practices focused on precision.",
    points: ["Access to Core Aequitas Database", "Up to 5 User Accounts", "Standard Query Velocity"],
    buttonLabel: "Start Free Trial",
  },
  {
    title: "Professional",
    monthlyPrice: "RM2000",
    annualPrice: "RM19200",
    description: "Advanced capabilities for high-volume firms requiring absolute data fidelity.",
    points: ["Full Aequitas Ecosystem Access", "Unlimited User Accounts", "High-Velocity Priority Processing", "Dedicated Account Curator"],
    featured: true,
    buttonLabel: "Start Free Trial",
  },
  {
    title: "Academic",
    monthlyPrice: "Invited",
    annualPrice: "Invited",
    description: "Supporting the next generation of legal minds with free access to our primary database.",
    points: ["Academic Database Access", "Campus-Wide IP Authentication"],
    buttonLabel: "Request Access",
  },
];

function detectPage(pathname: string): PageKey {
  if (pathname === "/pricing") return "pricing";
  if (pathname === "/aequitas") return "aequitas";
  return "mission";
}

export default function App() {
  const [page, setPage] = useState<PageKey>(() => detectPage(window.location.pathname));
  const [displayedPage, setDisplayedPage] = useState<PageKey>(() => detectPage(window.location.pathname));
  const [mouse, setMouse] = useState({ x: 50, y: 18 });
  const [scrollY, setScrollY] = useState(0);
  const [transitionStage, setTransitionStage] = useState<TransitionStage>("idle");
  const exitTimer = useRef<number | null>(null);
  const enterTimer = useRef<number | null>(null);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    const onPopState = () => {
      const next = detectPage(window.location.pathname);
      setPage(next);
      setDisplayedPage(next);
      setTransitionStage("entering");
    };

    const onScroll = () => setScrollY(window.scrollY);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("scroll", onScroll);
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
      if (enterTimer.current) window.clearTimeout(enterTimer.current);
    };
  }, []);

  useEffect(() => {
    if (transitionStage !== "entering") return;
    enterTimer.current = window.setTimeout(() => setTransitionStage("idle"), 620);
    return () => {
      if (enterTimer.current) window.clearTimeout(enterTimer.current);
    };
  }, [transitionStage]);

  const themeClass = useMemo(() => `page-${displayedPage}`, [displayedPage]);

  const navigate = (next: NavItem) => {
    if (displayedPage === next.key && transitionStage === "idle") return;
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
    if (enterTimer.current) window.clearTimeout(enterTimer.current);

    setPage(next.key);
    setTransitionStage("exiting");

    exitTimer.current = window.setTimeout(() => {
      if (window.location.pathname !== next.href) {
        window.history.pushState({}, "", next.href);
      }
      setDisplayedPage(next.key);
      setTransitionStage("entering");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 340);
  };

  return (
    <div
      className={`site-shell ${themeClass} transition-${transitionStage}`}
      style={
        {
          "--pointer-x": `${mouse.x}%`,
          "--pointer-y": `${mouse.y}%`,
          "--scroll-shift": `${Math.min(scrollY * 0.16, 160)}px`,
        } as CSSProperties
      }
    >
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="grain-overlay" />
      <div className="page-transition-shutter" />
      <div className="page-transition-overlay">
        <span className="transition-label">Loading</span>
        <strong>{pageTitles[page]}</strong>
      </div>

      <header className="site-header">
        <button className="brand" onClick={() => navigate(navItems[0])} type="button">
          <span className="brand-logo">L</span>
          Logos AI
        </button>
        <nav className="site-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-link ${displayedPage === item.key ? "active" : ""}`}
              onClick={() => navigate(item)}
              type="button"
            >
              {item.label}
              {displayedPage === item.key && <span className="nav-pip" />}
            </button>
          ))}
          <button className="nav-link muted" type="button">
            Team
          </button>
        </nav>
        <MagneticButton className="cta-primary">Get Started</MagneticButton>
      </header>

      <div className="page-frame" key={displayedPage}>
        {displayedPage === "mission" && <MissionPage />}
        {displayedPage === "aequitas" && <AequitasPage />}
        {displayedPage === "pricing" && <PricingPage />}
      </div>

      <footer className="site-footer">
        <div className="footer-brand-block">
          <p className="footer-wordmark">Logos AI</p>
          <p className="footer-tagline">The Operating System for Truth.</p>
        </div>
        <div className="footer-links">
          <a href="/">Privacy</a>
          <a href="/">Terms</a>
          <a href="/">Contact</a>
          <a href="/">Careers</a>
        </div>
        <p className="footer-copy">© 2024 Logos AI Sdn Bhd</p>
      </footer>
    </div>
  );
}

function MagneticButton({ className, children }: { className: string; children: ReactNode }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement | null>(null);

  const handleMove = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setOffset({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 14,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 12,
    });
  };

  return (
    <button
      ref={ref}
      className={`${className} magnetic`}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      onMouseMove={handleMove}
      style={{ "--mx": `${offset.x}px`, "--my": `${offset.y}px` } as CSSProperties}
      type="button"
    >
      <span>{children}</span>
    </button>
  );
}

function RevealSection({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`reveal ${visible ? "revealed" : ""} ${className ?? ""}`}>
      {children}
    </section>
  );
}

function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`stagger ${className ?? ""}`}>{children}</div>;
}

function StaggerItem({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`stagger-item ${className ?? ""}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

function AnimatedPrice({ value, active }: { value: number; active: boolean }) {
  const collapsed = Math.max(Math.round(value * 0.72), 0);
  const [display, setDisplay] = useState(active ? value : collapsed);
  const displayRef = useRef(display);

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    let raf = 0;
    const startValue = displayRef.current;
    const endValue = active ? value : collapsed;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / 420, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startValue + (endValue - startValue) * eased));
      if (progress < 1) raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [active, collapsed, value]);

  return <>{display.toLocaleString()}</>;
}

function MissionPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-content">
          <Stagger>
            <StaggerItem delay={60}>
              <span className="eyechip">Intelligence Unleashed · Southeast Asia</span>
            </StaggerItem>
            <StaggerItem delay={140}>
              <h1 className="display-headline">
                <span className="line">The Operating</span>
                <span className="line accent-line">System</span>
                <span className="line">for Truth.</span>
              </h1>
            </StaggerItem>
            <StaggerItem delay={260}>
              <p className="hero-body">
                Accelerating AI digitalization across Southeast Asia - freeing professionals
                from the mundane so they can focus on high-impact work.
              </p>
            </StaggerItem>
            <StaggerItem delay={360}>
              <div className="hero-ctas">
                <MagneticButton className="cta-primary">Try Our Package</MagneticButton>
                <MagneticButton className="cta-ghost">Explore Mission</MagneticButton>
              </div>
            </StaggerItem>
          </Stagger>
        </div>

        <div className="hero-visual-block">
          <div className="hero-img-frame">
            <img src={ldePhoto} alt="Logos AI hero visual" className="hero-img" />
            <div className="hero-img-overlay" />
          </div>
          <div className="hero-stat-card">
            <div className="stat-row-mini">
              <div className="stat-mini">
                <strong>0</strong>
                <span>Hallucinations</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-mini">
                <strong>10X</strong>
                <span>Velocity</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-mini">
                <strong>SEA</strong>
                <span>Focus</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RevealSection className="about-section">
        <div className="about-img-col">
          <div className="about-img-wrap">
            <img src={logoPhoto} alt="Logos AI logo" className="about-img" />
          </div>
          <div className="about-badge">
            <strong>Jan 2026</strong>
            <span>The moment the architecture of truth was finalized.</span>
          </div>
        </div>

        <div className="about-copy">
          <span className="section-label">Our Foundation</span>
          <h2 className="section-headline">
            2 Years of Deep
            <br />
            Research.
            <br />
            <em>Ready for the Spike.</em>
          </h2>
          <p>
            Founded in January 2026, Logos AI is the culmination of two years of intense market
            experience and deep technological research. We didn&apos;t launch until we solved the
            fundamental problem of AI hallucination.
          </p>
          <blockquote className="pull-quote">
            "Now is the time to spike development."
          </blockquote>
          <p>
            We are scaling infrastructure that will define digital truth across Southeast Asia&apos;s
            burgeoning tech ecosystem - built for precision, designed for professionals.
          </p>
        </div>
      </RevealSection>

      <RevealSection className="founders-section">
        <div className="founders-header">
          <h2 className="section-headline">
            The Architects
            <br />
            of Logos
          </h2>
          <p>Visionary founders bridging raw data and absolute truth.</p>
        </div>
        <div className="founders-grid">
          {founderCards.map((founder) => (
            <article className="founder-card" key={founder.name}>
              <div className="founder-img-wrap">
                <img src={founder.image} alt={founder.name} className="founder-img" />
                <div className="founder-img-tint" />
              </div>
              <div className="founder-info">
                <div>
                  <h3>{founder.name}</h3>
                  <p>{founder.role}</p>
                </div>
                <span className="founder-plus">+</span>
              </div>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="cta-band">
        <div className="cta-band-inner">
          <div className="cta-band-copy">
            <h2>
              Ready to automate
              <br />
              the future?
            </h2>
            <p>Join the Aequitas trial - experience the world&apos;s most stable AI operating system.</p>
          </div>
          <MagneticButton className="cta-white">Try Our Package</MagneticButton>
        </div>
      </RevealSection>
    </main>
  );
}

function AequitasPage() {
  return (
    <main>
      <section className="hero-section hero-aequitas">
        <div className="hero-content">
          <Stagger>
            <StaggerItem delay={60}>
              <span className="eyechip cyan">Now In Trial Stage</span>
            </StaggerItem>
            <StaggerItem delay={140}>
              <h1 className="display-headline">
                <span className="line">Aequitas:</span>
                <span className="line accent-line">The First</span>
                <span className="line">Integrated</span>
                <span className="line">Legal OS.</span>
              </h1>
            </StaggerItem>
            <StaggerItem delay={260}>
              <p className="hero-body">
                Transitioning legal practice from fragmented documents to a unified,
                high-velocity intelligence ecosystem. Zero hallucination. Pure legal precision.
              </p>
            </StaggerItem>
            <StaggerItem delay={360}>
              <div className="hero-ctas">
                <MagneticButton className="cta-primary">Start Free Trial</MagneticButton>
                <MagneticButton className="cta-ghost">Watch Demo</MagneticButton>
              </div>
            </StaggerItem>
          </Stagger>
        </div>

        <div className="hero-visual-block">
          <div className="hud-panel">
            <img src={mainAequitasImage} alt="Aequitas main dashboard" className="hud-product-shot" />
            <div className="hud-bg" />
            <div className="hud-ring outer" />
            <div className="hud-ring mid" />
            <div className="hud-ring inner" />
            <div className="hud-scanline" />
            <div className="hud-cross h" />
            <div className="hud-cross v" />
            <div className="hud-core" />
            <span className="hud-node a" />
            <span className="hud-node b" />
            <span className="hud-node c" />
          </div>
          <div className="speed-card">
            <p className="speed-label">Automation Speed</p>
            <strong className="speed-value">94.2% Faster</strong>
            <span>SPA generation and compliance checks in seconds, not hours.</span>
          </div>
        </div>
      </section>

      <RevealSection className="bento-section">
        <div className="bento-header">
          <h2 className="section-headline">
            The New Standard
            <br />
            for <em>Legal Ops.</em>
          </h2>
          <p>We dismantled the traditional conveyancing workflow to rebuild it for the AI era.</p>
        </div>

        <div className="bento-grid">
          <article className="bento-card bento-large">
            <div className="bento-shot-wrap">
              <img src={spaCreationImage} alt="SPA creation workflow" className="bento-shot bento-shot-spa" />
            </div>
            <div className="bento-icon">[]</div>
            <h3>Dynamic SPA Generation</h3>
            <p>
              Our integrated engine pulls data points directly from verified sources to construct
              Sales and Purchase Agreements that are contextually aware and legally sound.
            </p>
            <div className="bento-dots">
              <span />
              <span />
              <span />
            </div>
            <small>Live Module</small>
          </article>

          <article className="bento-card bento-dark">
            <div className="bento-shot-wrap compact-shot">
              <img
                src={checkApprovalImage}
                alt="Approval and compliance review"
                className="bento-shot bento-shot-approval"
              />
            </div>
            <div className="bento-icon">()</div>
            <h3>Continuous Compliance</h3>
            <p>
              Automated regulatory alignment checks running in the background. Never miss a
              clause change or statutory update again.
            </p>
            <div className="compliance-bar">
              <div />
            </div>
            <small>Accuracy: 100%</small>
          </article>

          <article className="bento-card bento-img">
            <img
              src={mainAequitasImage}
              alt="Aequitas integrated system overview"
              className="bento-bg-img"
            />
            <div className="bento-img-copy">
              <h3>Zero Hallucination Architecture</h3>
              <p>Logos AI core ensures data integrity at every hop.</p>
            </div>
          </article>

          <article className="bento-card bento-trial">
            <div className="trial-badge">TRIAL</div>
            <div>
              <h3>Exclusive Trial Enrollment</h3>
              <p>Be among the first firms to pilot Aequitas OS. Limited slots for our Q4 cohort.</p>
              <span className="trial-cta">Secure Your Slot</span>
            </div>
          </article>
        </div>
      </RevealSection>

      <RevealSection className="advantage-section">
        <aside className="advantage-list">
          <h2 className="section-headline">
            The Curator&apos;s
            <br />
            Advantage
          </h2>
          {[
            { n: "01", label: "Infrastructure", desc: "Cloud-native, zero-trust security for sensitive legal data." },
            { n: "02", label: "Intelligence", desc: "Proprietary LLM layers tuned for real estate law." },
            { n: "03", label: "Integration", desc: "Connects seamlessly with land registries and financial portals." },
          ].map(({ n, label, desc }) => (
            <div className="adv-item" key={n}>
              <span className="adv-num">{n}</span>
              <div>
                <p className="adv-label">{label}</p>
                <small>{desc}</small>
              </div>
            </div>
          ))}
        </aside>

        <div className="detail-panels">
          <article className="detail-panel">
            <h3>Revolutionizing the SPA Workflow</h3>
            <p>
              The Sales and Purchase Agreement is no longer a static document. In Aequitas, it is
              a Living Data Object - tracked in real-time, cross-referenced with compliance
              databases, and optimized with latest precedents. Without human error.
            </p>
            <div className="detail-stats">
              <div>
                <strong>0s</strong>
                <span>Hallucination Rate</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Traceable Logic</span>
              </div>
            </div>
          </article>
          <article className="detail-panel warm">
            <h3>Advanced Legal Automation</h3>
            <p>
              Automation in Aequitas goes beyond fill-in-the-blanks. We use contextual awareness
              to understand the nuances of each transaction - from residential strata titles to
              complex commercial holdings.
            </p>
          </article>
        </div>
      </RevealSection>

      <RevealSection className="cta-band dark">
        <div className="cta-band-inner">
          <div className="cta-band-copy">
            <h2>
              Ready to curate
              <br />
              the future of law?
            </h2>
            <p>Join the Aequitas trial today and redefine your firm&apos;s operational velocity.</p>
          </div>
          <MagneticButton className="cta-primary">Try Our Package</MagneticButton>
        </div>
      </RevealSection>
    </main>
  );
}

function PricingPage() {
  const [hovered, setHovered] = useState("Professional");
  const [billing, setBilling] = useState<BillingMode>("monthly");

  return (
    <main>
      <section className="pricing-hero">
        <Stagger>
          <StaggerItem delay={60}>
            <span className="eyechip">Transparent Pricing</span>
          </StaggerItem>
          <StaggerItem delay={140}>
            <h1 className="display-headline">
              <span className="line">Precision Tools</span>
              <span className="line accent-line">For Every Scale</span>
            </h1>
          </StaggerItem>
          <StaggerItem delay={240}>
            <p className="hero-body center">
              Empower your practice with 0-hallucination data. Select the toolset designed for
              your operational scale.
            </p>
          </StaggerItem>
          <StaggerItem delay={320}>
            <div className="billing-toggle">
              <button
                className={`bill-btn ${billing === "monthly" ? "active" : ""}`}
                onClick={() => setBilling("monthly")}
                type="button"
              >
                Monthly
              </button>
              <button
                className={`bill-btn ${billing === "annual" ? "active" : ""}`}
                onClick={() => setBilling("annual")}
                type="button"
              >
                Annual
              </button>
              <span className="bill-note">Save 20% annually</span>
            </div>
          </StaggerItem>
        </Stagger>
      </section>

      <RevealSection className="launch-strip">
        <div className="launch-dot">*</div>
        <div className="launch-copy">
          <strong>Special Launch Offer</strong>
          <span>All law firms get their first month FREE.</span>
        </div>
        <button className="launch-claim" type="button">
          Claim Offer
        </button>
      </RevealSection>

      <RevealSection className="pricing-grid">
        {pricingTiers.map((tier) => {
          const price = billing === "monthly" ? tier.monthlyPrice : tier.annualPrice;
          const isRM = price.startsWith("RM");
          const isActive = hovered === tier.title;

          return (
            <article
              key={tier.title}
              className={`price-card ${tier.featured ? "featured" : ""} ${isActive ? "hovered" : ""}`}
              onMouseEnter={() => setHovered(tier.title)}
              onMouseLeave={() => setHovered("Professional")}
            >
              {tier.featured && <div className="rec-badge">Recommended</div>}
              <div className="price-tier-label">{tier.title}</div>
              <div className="price-display">
                {isRM ? (
                  <>
                    <span className="price-currency">RM</span>
                    <span className="price-num">
                      <AnimatedPrice value={parseInt(price.replace("RM", ""), 10)} active={isActive} />
                    </span>
                    <span className="price-period">{billing === "monthly" ? "/mo" : "/yr"}</span>
                  </>
                ) : (
                  <span className="price-num small">{price}</span>
                )}
              </div>
              {billing === "annual" && isRM && (
                <p className="annual-equiv">~ {tier.monthlyPrice}/month billed yearly</p>
              )}
              <p className="price-desc">{tier.description}</p>
              <ul className="price-features">
                {tier.points.map((point) => (
                  <li key={point}>
                    <span className="feat-dot">◆</span>
                    {point}
                  </li>
                ))}
              </ul>
              <MagneticButton className={tier.featured ? "cta-primary" : "cta-outline"}>
                {tier.buttonLabel}
              </MagneticButton>
            </article>
          );
        })}
      </RevealSection>

      <RevealSection className="faq-section">
        <h2 className="faq-title">FAQ</h2>
        <div className="faq-grid">
          {[
            {
              q: "What's included in the trial?",
              a: "The 1-month trial provides full, uninhibited access to the tier you select - the complete High-Velocity Intelligence engine, including all query tools and data verification nodes.",
            },
            {
              q: "How is our data secured?",
              a: "Logos AI employs end-to-end encryption and a strict zero-retention policy on user queries. Your intellectual property and research strategies remain entirely your own.",
            },
            {
              q: "Can we cancel before trial ends?",
              a: "Yes. Cancellation is immediate and executed directly from your administrative dashboard. No hidden fees or complex offboarding processes.",
            },
          ].map(({ q, a }) => (
            <article className="faq-card" key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </article>
          ))}
        </div>
      </RevealSection>
    </main>
  );
}
