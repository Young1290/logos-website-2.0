import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type PageKey = "mission" | "aequitas" | "pricing";
type TransitionStage = "idle" | "exiting" | "entering";
type BillingMode = "monthly" | "annual";

type NavItem = {
  key: PageKey;
  label: string;
  href: string;
};

type Founder = {
  name: string;
  role: string;
  image: string;
};

type PricingTier = {
  title: string;
  monthlyPrice: string;
  annualPrice: string;
  description: string;
  points: string[];
  featured?: boolean;
  buttonLabel: string;
};

type Particle = {
  id: number;
  x: number;
  y: number;
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
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Low Chin Hsien",
    role: "Co-Founder & CTO",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  },
];

const pricingTiers: PricingTier[] = [
  {
    title: "Standard Law Firm",
    monthlyPrice: "RM1000",
    annualPrice: "RM9600",
    description:
      "Essential intelligence tools for boutique practices focused on precision.",
    points: [
      "Access to Core Aequitas Database",
      "Up to 5 User Accounts",
      "Standard Query Velocity",
    ],
    buttonLabel: "Start Your 1-Month Free Trial",
  },
  {
    title: "Professional Law Firm",
    monthlyPrice: "RM2000",
    annualPrice: "RM19200",
    description:
      "Advanced capabilities for high-volume firms requiring absolute data fidelity.",
    points: [
      "Full Aequitas Ecosystem Access",
      "Unlimited User Accounts",
      "High-Velocity Priority Processing",
      "Dedicated Account Curator",
    ],
    featured: true,
    buttonLabel: "Start Your 1-Month Free Trial",
  },
  {
    title: "University / Academic",
    monthlyPrice: "Invited to Use",
    annualPrice: "Invited to Use",
    description:
      "Supporting the next generation of legal minds with free access to our primary database.",
    points: ["Academic Database Access", "Campus-Wide IP Authentication"],
    buttonLabel: "Request Academic Access",
  },
];

function detectPage(pathname: string): PageKey {
  if (pathname === "/pricing") {
    return "pricing";
  }

  if (pathname === "/aequitas") {
    return "aequitas";
  }

  return "mission";
}

function App() {
  const [page, setPage] = useState<PageKey>(() => detectPage(window.location.pathname));
  const [displayedPage, setDisplayedPage] = useState<PageKey>(() =>
    detectPage(window.location.pathname),
  );
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
      const nextPage = detectPage(window.location.pathname);
      setPage(nextPage);
      setDisplayedPage(nextPage);
      setTransitionStage("entering");
    };

    const onScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("scroll", onScroll);
      if (exitTimer.current) {
        window.clearTimeout(exitTimer.current);
      }
      if (enterTimer.current) {
        window.clearTimeout(enterTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (transitionStage !== "entering") {
      return;
    }

    enterTimer.current = window.setTimeout(() => {
      setTransitionStage("idle");
    }, 620);

    return () => {
      if (enterTimer.current) {
        window.clearTimeout(enterTimer.current);
      }
    };
  }, [transitionStage]);

  const themeClass = useMemo(() => `page-${displayedPage}`, [displayedPage]);

  const navigate = (next: NavItem) => {
    if (displayedPage === next.key && transitionStage === "idle") {
      return;
    }

    if (exitTimer.current) {
      window.clearTimeout(exitTimer.current);
    }
    if (enterTimer.current) {
      window.clearTimeout(enterTimer.current);
    }

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
          "--scroll-tilt": `${Math.min(scrollY * 0.04, 20)}px`,
        } as CSSProperties
      }
    >
      <div className="pointer-wash" />
      <div className="page-noise" />
      <div className="page-transition-shutter" />
      <div className="page-transition-overlay">
        <span className="page-transition-kicker">Switching Surface</span>
        <strong>{pageTitles[page]}</strong>
      </div>

      <header className="site-header">
        <button className="brand" onClick={() => navigate(navItems[0])} type="button">
          Logos AI
        </button>

        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={displayedPage === item.key ? "nav-link active" : "nav-link"}
              onClick={() => navigate(item)}
              type="button"
            >
              {item.label}
            </button>
          ))}
          <button className="nav-link muted" type="button">
            Team
          </button>
        </nav>

        <MagneticButton className="primary-cta">Get Started</MagneticButton>
      </header>

      <div className="page-frame" key={displayedPage}>
        {displayedPage === "mission" && <MissionPage />}
        {displayedPage === "aequitas" && <AequitasPage />}
        {displayedPage === "pricing" && <PricingPage />}
      </div>

      <footer className="site-footer">
        <div>
          <p className="footer-brand">Logos AI</p>
          <p className="footer-copy">© 2024 Logos AI Sdn Bhd. The Operating System for Truth.</p>
        </div>

        <div className="footer-links">
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
          <a href="/">Contact Us</a>
          <a href="/">Careers</a>
        </div>

        <div className="footer-icons">
          <span>O</span>
          <span>&gt;</span>
        </div>
      </footer>
    </div>
  );
}

function MagneticButton({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement | null>(null);

  const handleMove = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    setOffset({ x, y });
  };

  return (
    <button
      ref={ref}
      className={`${className} magnetic-button`}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      onMouseMove={handleMove}
      style={{ "--mx": `${offset.x}px`, "--my": `${offset.y}px` } as CSSProperties}
      type="button"
    >
      <span>{children}</span>
    </button>
  );
}

function StaggerGroup({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`stagger-group ${className ?? ""}`}>{children}</div>;
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
    <div
      className={`stagger-item ${className ?? ""}`}
      style={{ "--stagger-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function KineticHeadline({
  lines,
  accentWords = [],
  baseDelay = 80,
}: {
  lines: string[];
  accentWords?: string[];
  baseDelay?: number;
}) {
  let wordIndex = 0;

  return (
    <h1 className="kinetic-headline">
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");

        return (
          <span className="headline-line" key={`${line}-${lineIndex}`}>
            {words.map((word, index) => {
              const currentIndex = wordIndex++;
              const normalized = word.replace(/[.,!?]/g, "");
              const isAccent = accentWords.includes(normalized);

              return (
                <span
                  className={isAccent ? "headline-word accent" : "headline-word"}
                  key={`${word}-${lineIndex}-${index}`}
                  style={{ "--word-delay": `${baseDelay + currentIndex * 70}ms` } as CSSProperties}
                >
                  {word}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}

function AnimatedPrice({
  value,
  prefix = "",
  active,
}: {
  value: number;
  prefix?: string;
  active: boolean;
}) {
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
    const duration = 420;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startValue + (endValue - startValue) * eased));
      if (progress < 1) {
        raf = window.requestAnimationFrame(tick);
      }
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [active, collapsed, value]);

  return (
    <strong>
      {prefix}
      {display.toLocaleString()}
    </strong>
  );
}

function RevealSection({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={
        visible ? `reveal-section is-visible ${className ?? ""}` : `reveal-section ${className ?? ""}`
      }
    >
      {children}
    </section>
  );
}

function InteractivePanel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(0);

  const spawnParticle = (clientX: number, clientY: number) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const particle: Particle = {
      id: nextId.current++,
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    setParticles((current) => [...current.slice(-9), particle]);

    window.setTimeout(() => {
      setParticles((current) => current.filter((item) => item.id !== particle.id));
    }, 900);
  };

  return (
    <div
      ref={panelRef}
      className={`interactive-panel ${className ?? ""}`}
      onMouseMove={(event) => spawnParticle(event.clientX, event.clientY)}
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="hover-particle"
          style={{ left: particle.x, top: particle.y }}
        />
      ))}
      {children}
    </div>
  );
}

function MissionPage() {
  return (
    <main>
      <RevealSection className="hero hero-mission">
        <StaggerGroup className="hero-copy">
          <StaggerItem delay={20}>
            <span className="tag-chip">Intelligence Unleashed</span>
          </StaggerItem>
          <StaggerItem delay={100}>
            <KineticHeadline
              accentWords={["for", "Truth"]}
              lines={["The Operating", "System", "for Truth."]}
            />
          </StaggerItem>
          <StaggerItem delay={180}>
            <p>
              Accelerating AI Digitalization in Southeast Asia. We are on a mission to
              free professionals&apos; time from the mundane, enabling focus on
              high-impact creativity.
            </p>
          </StaggerItem>
          <StaggerItem delay={260}>
            <div className="hero-actions">
              <MagneticButton className="primary-cta">Go Try Our Package</MagneticButton>
              <MagneticButton className="secondary-cta">Explore Mission</MagneticButton>
            </div>
          </StaggerItem>
        </StaggerGroup>

        <InteractivePanel className="hero-visual mission-visual">
          <div className="hero-image mission-image parallax-panel" />
        </InteractivePanel>
      </RevealSection>

      <RevealSection className="split-section">
        <div className="image-block">
          <InteractivePanel className="media-shell">
            <div className="feature-photo mission-lab parallax-panel" />
          </InteractivePanel>
          <div className="floating-note">
            <strong>Jan 2026</strong>
            <span>The moment the architecture of truth was finalized.</span>
          </div>
        </div>

        <div className="copy-block">
          <p className="section-eyebrow">Our Foundation</p>
          <h2>
            2 Years of Deep
            <br />
            Research.
            <br />
            Ready for the Spike.
          </h2>
          <p>
            Founded in January 2026, Logos AI is the culmination of two years of
            intense market experience and deep technological research. We didn&apos;t
            launch until we solved the fundamental problem of AI hallucination.
          </p>
          <p className="quote-line">"Now is the time to spike development."</p>
          <p>
            We are scaling the infrastructure that will define digital truth across
            Southeast Asia&apos;s burgeoning tech ecosystem. Our tools are built for
            precision, designed for professionals, and optimized for high-velocity
            intelligence.
          </p>
          <div className="stat-row">
            <div>
              <strong>0</strong>
              <span>Hallucinations</span>
            </div>
            <div>
              <strong>10X</strong>
              <span>Velocity</span>
            </div>
            <div>
              <strong>SEA</strong>
              <span>Focus</span>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="founders-section">
        <div className="section-head">
          <div>
            <h2>The Architects of Logos</h2>
            <p>
              Meet the visionary founders bridging the gap between raw data and
              absolute truth.
            </p>
          </div>
          <div className="line-fill" />
        </div>

        <div className="founder-grid">
          {founderCards.map((founder) => (
            <article className="founder-card" key={founder.name}>
              <div
                className="founder-image"
                style={{ backgroundImage: `url(${founder.image})` }}
              />
              <div className="founder-meta">
                <div>
                  <h3>{founder.name}</h3>
                  <p>{founder.role}</p>
                </div>
                <span>+</span>
              </div>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="hero-cta hero-cta-warm">
        <h2>
          Ready to automate
          <br />
          the future?
        </h2>
        <p>
          Join the Aequitas trial and experience the precision of the world&apos;s most
          stable AI operating system.
        </p>
        <MagneticButton className="white-cta">Go Try Our Package</MagneticButton>
      </RevealSection>
    </main>
  );
}

function AequitasPage() {
  return (
    <main>
      <RevealSection className="hero hero-aequitas">
        <StaggerGroup className="hero-copy">
          <StaggerItem delay={20}>
            <span className="tag-chip cyan-chip">Now In Trial Stage</span>
          </StaggerItem>
          <StaggerItem delay={100}>
            <KineticHeadline
              accentWords={["Conveyancing", "OS"]}
              lines={["Aequitas: The", "First", "Integrated", "Conveyancing", "OS."]}
            />
          </StaggerItem>
          <StaggerItem delay={180}>
            <p>
              Transitioning legal practice from fragmented documents to a unified,
              high-velocity intelligence ecosystem. Zero hallucination. Pure legal
              precision.
            </p>
          </StaggerItem>
          <StaggerItem delay={260}>
            <div className="hero-actions">
              <MagneticButton className="primary-cta">Start Your Free Trial</MagneticButton>
              <MagneticButton className="secondary-cta">Watch Demo</MagneticButton>
            </div>
          </StaggerItem>
        </StaggerGroup>

        <InteractivePanel className="hero-visual aequitas-visual">
          <div className="hero-image aequitas-image parallax-panel">
            <div className="hud-ring hud-ring-outer" />
            <div className="hud-ring hud-ring-mid" />
            <div className="hud-ring hud-ring-inner" />
            <div className="hud-scanline" />
            <div className="hud-crosshair hud-crosshair-h" />
            <div className="hud-crosshair hud-crosshair-v" />
            <div className="hud-core" />
            <span className="hud-node hud-node-a" />
            <span className="hud-node hud-node-b" />
            <span className="hud-node hud-node-c" />
          </div>
          <div className="floating-speed">
            <p>Automation Speed</p>
            <strong>94.2% Faster</strong>
            <span>SPA generation and compliance checks executed in seconds, not hours.</span>
          </div>
        </InteractivePanel>
      </RevealSection>

      <RevealSection className="product-section">
        <div className="section-head compact">
          <div>
            <h2>
              The New Standard for <span>Legal Ops.</span>
            </h2>
            <p>
              We&apos;ve dismantled the traditional conveyancing workflow to rebuild it
              for the AI era.
            </p>
          </div>
          <div className="ghost-word">AEQUITAS</div>
        </div>

        <div className="bento-grid">
          <article className="bento-card large-card">
            <div className="icon">[]</div>
            <h3>Dynamic SPA Generation</h3>
            <p>
              Our integrated engine pulls data points directly from verified sources
              to construct Sales and Purchase Agreements that are contextually aware
              and legally sound.
            </p>
            <div className="module-dots">
              <span />
              <span />
              <span />
            </div>
            <small>Live Module</small>
          </article>

          <article className="bento-card dark-card">
            <div className="icon">()</div>
            <h3>Continuous Compliance</h3>
            <p>
              Automated regulatory alignment checks that run in the background. Never
              miss a clause change or statutory update again.
            </p>
            <div className="progress-bar">
              <div />
            </div>
            <small>Accuracy Threshold: 100%</small>
          </article>

          <article className="bento-card image-card">
            <div className="feature-photo architecture-photo" />
            <div className="image-copy">
              <h3>Zero Hallucination Architecture</h3>
              <p>Logos AI core ensures data integrity at every hop.</p>
            </div>
          </article>

          <article className="bento-card trial-card">
            <div className="trial-badge">TRIAL</div>
            <div>
              <h3>Exclusive Trial Enrollment</h3>
              <p>
                Be among the first firms to pilot the Aequitas OS. We are currently
                accepting a limited number of partners for the Q4 integration cohort.
              </p>
              <small>Secure Your Slot</small>
            </div>
          </article>
        </div>
      </RevealSection>

      <RevealSection className="deep-dive">
        <aside className="advantage-list">
          <h2>
            The Curator&apos;s
            <br />
            Advantage
          </h2>
          <div className="advantage-item">
            <span>01</span>
            <div>
              <p>Infrastructure</p>
              <small>Cloud-native, zero-trust security for sensitive legal data.</small>
            </div>
          </div>
          <div className="advantage-item">
            <span>02</span>
            <div>
              <p>Intelligence</p>
              <small>Proprietary LLM layers tuned specifically for real estate law.</small>
            </div>
          </div>
          <div className="advantage-item">
            <span>03</span>
            <div>
              <p>Integration</p>
              <small>Connects seamlessly with land registries and financial portals.</small>
            </div>
          </div>
        </aside>

        <div className="deep-dive-panels">
          <article className="detail-panel">
            <h3>Revolutionizing the SPA Workflow</h3>
            <p>
              The Sales and Purchase Agreement is no longer a static document. In
              Aequitas, it is a Living Data Object. Our system tracks changes in
              real-time, cross-references with compliance databases, and suggests
              optimized clauses based on the latest precedents, all without human
              error.
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

          <article className="detail-panel warm-panel">
            <h3>Advanced Legal Automation</h3>
            <p>
              Automation in Aequitas goes beyond simple fill-in-the-blanks. We utilize
              contextual awareness to understand the nuances of each transaction, from
              residential strata titles to complex commercial holdings.
            </p>
          </article>
        </div>
      </RevealSection>

      <RevealSection className="hero-cta hero-cta-dark">
        <h2>Ready to curate the future of law?</h2>
        <p>
          Join the Aequitas trial today and redefine your firm&apos;s operational
          velocity.
        </p>
        <MagneticButton className="primary-cta">Go Try Our Package</MagneticButton>
      </RevealSection>
    </main>
  );
}

function PricingPage() {
  const [hoveredTier, setHoveredTier] = useState<string>("Professional Law Firm");
  const [billingMode, setBillingMode] = useState<BillingMode>("monthly");

  return (
    <main>
      <RevealSection className="pricing-hero">
        <StaggerGroup>
          <StaggerItem delay={40}>
            <KineticHeadline
              accentWords={["High-Velocity", "Intelligence"]}
              lines={["Transparent Pricing for", "High-Velocity Intelligence"]}
            />
          </StaggerItem>
          <StaggerItem delay={140}>
            <p>
              Empower your practice with 0-hallucination data. Select the precision
              toolset designed for your operational scale.
            </p>
          </StaggerItem>
          <StaggerItem delay={220}>
            <div className="billing-toggle" role="tablist" aria-label="Billing mode">
              <button
                className={billingMode === "monthly" ? "billing-chip active" : "billing-chip"}
                onClick={() => setBillingMode("monthly")}
                type="button"
              >
                Monthly
              </button>
              <button
                className={billingMode === "annual" ? "billing-chip active" : "billing-chip"}
                onClick={() => setBillingMode("annual")}
                type="button"
              >
                Annual
              </button>
              <span className="billing-note">Annual saves 20%</span>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </RevealSection>

      <RevealSection className="launch-banner">
        <div className="launch-icon">*</div>
        <div>
          <h2>Special Launch Offer</h2>
          <p>All law firms get their first month FREE.</p>
        </div>
        <button className="text-cta" type="button">
          Claim Offer
        </button>
      </RevealSection>

      <RevealSection className="pricing-cards">
        {pricingTiers.map((tier) => {
          const displayPrice =
            billingMode === "monthly" ? tier.monthlyPrice : tier.annualPrice;
          const isMoneyPrice = displayPrice.startsWith("RM");

          return (
            <article
              className={
                hoveredTier === tier.title
                  ? tier.featured
                    ? "price-card featured is-hovered"
                    : "price-card is-hovered"
                  : tier.featured
                    ? "price-card featured"
                    : "price-card"
              }
              key={tier.title}
              onMouseEnter={() => setHoveredTier(tier.title)}
              onMouseLeave={() => setHoveredTier("Professional Law Firm")}
            >
              {tier.featured && <div className="recommended-badge">Recommended</div>}
              <h3>{tier.title}</h3>
              <div className="price-line">
                {isMoneyPrice ? (
                  <AnimatedPrice
                    active={hoveredTier === tier.title}
                    prefix="RM"
                    value={Number.parseInt(displayPrice.replace("RM", ""), 10)}
                  />
                ) : (
                  <strong>{displayPrice}</strong>
                )}
                <span>{billingMode === "monthly" ? "/month" : isMoneyPrice ? "/year" : ""}</span>
              </div>
              {billingMode === "annual" && tier.monthlyPrice.startsWith("RM") && (
                <div className="annual-caption">
                  <span>Billed yearly, equivalent to {tier.monthlyPrice}/month</span>
                </div>
              )}
              <p>{tier.description}</p>
              <ul>
                {tier.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <MagneticButton className={tier.featured ? "primary-cta" : "outline-cta"}>
                {tier.buttonLabel}
              </MagneticButton>
            </article>
          );
        })}
      </RevealSection>

      <RevealSection className="faq-panel">
        <h2>Frequently Asked Questions</h2>
        <article>
          <h3>What is included in the Aequitas trial?</h3>
          <p>
            The 1-month trial provides full, uninhibited access to the tier you
            select. You experience the complete High-Velocity Intelligence engine,
            including all query tools and data verification nodes.
          </p>
        </article>
        <article>
          <h3>How is our firm&apos;s query data secured?</h3>
          <p>
            Logos AI employs end-to-end encryption and a strict zero-retention policy
            on user queries. Your intellectual property and research strategies remain
            entirely your own.
          </p>
        </article>
        <article>
          <h3>Can we cancel before the trial ends?</h3>
          <p>
            Yes. Cancellation is immediate and can be executed directly from your
            administrative dashboard. No hidden fees or complex offboarding processes.
          </p>
        </article>
      </RevealSection>
    </main>
  );
}

export default App;
