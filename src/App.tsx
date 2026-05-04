import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PageKey, TxStage, Tweaks } from "./components";
import { IMG, MagBtn, TweaksPanel, detectPage } from "./components";
import { MissionPage } from "./pages/MissionPage";
import { AequitasPage } from "./pages/AequitasPage";
import { PricingPage } from "./pages/PricingPage";
import { DemoPage } from "./pages/DemoPage";

const NAV = [
  { key: "mission" as PageKey, label: "Mission", href: "/" },
  { key: "aequitas" as PageKey, label: "Aequitas", href: "/aequitas" },
  { key: "demo" as PageKey, label: "Demo", href: "/demo" },
  { key: "pricing" as PageKey, label: "Pricing", href: "/pricing" },
];
const PAGE_TITLES: Record<PageKey, string> = { mission: "Mission", aequitas: "Aequitas", pricing: "Pricing", demo: "Demo" };
const TWEAK_DEFAULTS: Tweaks = { intensity: "Default", bg: "Warm", density: "Spacious", showLDE: true };

export default function App() {
  const [page, setPage]     = useState<PageKey>(() => detectPage(window.location.pathname));
  const [disp, setDisp]     = useState<PageKey>(() => detectPage(window.location.pathname));
  const [tx, setTx]         = useState<TxStage>("idle");
  const [mouse, setMouse]   = useState({ x: 50, y: 18 });
  const [prog, setProg]     = useState(0);
  const [drawer, setDrawer] = useState(false);
  const [tweaksVis, setTweaksVis] = useState(false);
  const [tweaks, setTweaks] = useState<Tweaks>(TWEAK_DEFAULTS);
  const exit = useRef<number | null>(null), enter = useRef<number | null>(null);

  useEffect(() => {
    const pm = (e: PointerEvent) => setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    const ps = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProg(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
    };
    const pp = () => { const n = detectPage(window.location.pathname); setPage(n); setDisp(n); setTx("entering"); };
    window.addEventListener("pointermove", pm);
    window.addEventListener("scroll", ps, { passive: true });
    window.addEventListener("popstate", pp);
    return () => { window.removeEventListener("pointermove", pm); window.removeEventListener("scroll", ps); window.removeEventListener("popstate", pp); };
  }, []);

  useEffect(() => {
    if (tx !== "entering") return;
    enter.current = window.setTimeout(() => setTx("idle"), 620);
    return () => { if (enter.current) window.clearTimeout(enter.current); };
  }, [tx]);

  useEffect(() => {
    const h = (e: MessageEvent) => {
      if (e.data?.type === "__activate_edit_mode") setTweaksVis(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaksVis(false);
    };
    window.addEventListener("message", h);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", h);
  }, []);

  const navigate = useCallback((item: typeof NAV[0]) => {
    if (disp === item.key && tx === "idle") return;
    if (exit.current) window.clearTimeout(exit.current);
    if (enter.current) window.clearTimeout(enter.current);
    setPage(item.key); setTx("exiting"); setDrawer(false);
    exit.current = window.setTimeout(() => {
      if (window.location.pathname !== item.href) window.history.pushState({}, "", item.href);
      setDisp(item.key); setTx("entering");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 340);
  }, [disp, tx]);

  return (
    <div className={`shell tx-${tx}`}
      style={{ "--px": `${mouse.x}%`, "--py": `${mouse.y}%` } as CSSProperties}>
      <div className="spbar" style={{ "--prog": `${prog}%` } as CSSProperties} />
      <div className="orb orb-a" /><div className="orb orb-b" /><div className="grain" />
      <div className="shutter" />
      <div className="txov">
        <span className="txov-lbl">Loading</span>
        <strong>{PAGE_TITLES[page]}</strong>
      </div>

      <header className="hdr">
        <button className="brand" onClick={() => navigate(NAV[0])} type="button">
          <div className="brand-mk"><img src={IMG.logo} alt="Logos AI" /></div>
          Logos AI
        </button>
        <nav className="nav">
          {NAV.map(item => (
            <button key={item.key} className={`nb ${disp === item.key ? "on" : ""}`} onClick={() => navigate(item)} type="button">
              {item.label}
              {disp === item.key && <span className="npip" />}
            </button>
          ))}
        </nav>
        <span className="hdr-cta"><MagBtn cls="bp">Get Started</MagBtn></span>
        <button className={`ham ${drawer ? "open" : ""}`} type="button"
          onClick={() => setDrawer(d => !d)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      <div className={`drw-wrap ${drawer ? "open" : ""}`}>
        <div className="drw-bd" onClick={() => setDrawer(false)} />
        <div className="drw">
          <div className="drw-logo">Logos AI</div>
          {NAV.map(item => (
            <button key={item.key} className={`drw-lnk ${disp === item.key ? "on" : ""}`}
              type="button" onClick={() => navigate(item)}>{item.label}</button>
          ))}
          <div className="drw-cta"><MagBtn cls="bp">Get Started</MagBtn></div>
        </div>
      </div>

      <div className="pf" key={disp}>
        {disp === "mission"  && <MissionPage tweaks={tweaks} />}
        {disp === "aequitas" && <AequitasPage />}
        {disp === "pricing"  && <PricingPage />}
        {disp === "demo"     && <DemoPage />}
      </div>

      <footer className="ftr wrap">
        <div>
          <p className="fword">Logos AI</p>
          <p className="ftag">The Operating System for Truth.</p>
        </div>
        <div className="flinks">
          <a href="/">Privacy</a><a href="/">Terms</a>
          <a href="/">Contact</a><a href="/">Careers</a>
        </div>
        <p className="fcopy">© 2025 Logos AI Sdn Bhd</p>
      </footer>

      <TweaksPanel visible={tweaksVis} tweaks={tweaks} setTweaks={setTweaks} />
    </div>
  );
}
