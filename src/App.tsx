import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import checkApprovalImage from "../image/CheckApproval.png";
import chinHsienPhoto from "../image/Chin Hsien.jpg";
import ldePhoto from "../image/LDE.jpg";
import logoImg from "../image/logo.jpg";
import mainAequitasImage from "../image/Main Aequitas.png";
import spaCreationImage from "../image/SPA creation.png";
import youngPhoto from "../image/young.jpg";

/* ── types ───────────────────────────────────────────────────────── */
type PageKey = "mission" | "aequitas" | "pricing" | "demo";
type TxStage = "idle" | "exiting" | "entering";
type BillMode = "monthly" | "annual";
type Tweaks = { intensity: string; bg: string; density: string; showLDE: boolean };

const IMG = {
  logo: logoImg, lde: ldePhoto, aequitas: mainAequitasImage,
  spa: spaCreationImage, approval: checkApprovalImage,
  young: youngPhoto, chin: chinHsienPhoto,
};

const NAV = [
  { key: "mission" as PageKey, label: "Mission", href: "/" },
  { key: "aequitas" as PageKey, label: "Aequitas", href: "/aequitas" },
  { key: "demo" as PageKey, label: "Demo", href: "/demo" },
  { key: "pricing" as PageKey, label: "Pricing", href: "/pricing" },
];
const PAGE_TITLES: Record<PageKey, string> = { mission: "Mission", aequitas: "Aequitas", pricing: "Pricing", demo: "Demo" };

function detectPage(p: string): PageKey {
  if (p === "/pricing") return "pricing";
  if (p === "/aequitas") return "aequitas";
  if (p === "/demo") return "demo";
  return "mission";
}

function parseMoneyInput(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calcLegalFee(amount: number) {
  if (amount <= 0) return 0;
  const firstTier = Math.min(amount, 500_000) * 0.0125;
  const secondTierBase = Math.max(Math.min(amount - 500_000, 7_000_000), 0);
  const secondTier = secondTierBase * 0.01;
  const remaining = Math.max(amount - 7_500_000, 0);
  const estimatedNegotiableTier = remaining * 0.01;
  return firstTier + secondTier + estimatedNegotiableTier;
}

function calcTransferStampDuty(amount: number) {
  if (amount <= 0) return 0;
  const first = Math.min(amount, 100_000) * 0.01;
  const secondBase = Math.max(Math.min(amount - 100_000, 400_000), 0);
  const second = secondBase * 0.02;
  const thirdBase = Math.max(Math.min(amount - 500_000, 500_000), 0);
  const third = thirdBase * 0.03;
  const fourth = Math.max(amount - 1_000_000, 0) * 0.04;
  return first + second + third + fourth;
}

function calcLoanStampDuty(loanAmount: number) {
  if (loanAmount <= 0) return 0;
  return Math.ceil(loanAmount * 0.005);
}

function calcMonthlyInstallment(loanAmount: number, annualRate: number, years: number) {
  if (loanAmount <= 0 || annualRate <= 0 || years <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (loanAmount * monthlyRate * factor) / (factor - 1);
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/* ── MagBtn ──────────────────────────────────────────────────────── */
function MagBtn({ cls, children }: { cls: string; children: ReactNode }) {
  const [off, setOff] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: MouseEvent<HTMLButtonElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setOff({ x: ((e.clientX - r.left) / r.width - 0.5) * 14, y: ((e.clientY - r.top) / r.height - 0.5) * 12 });
  };
  return (
    <button ref={ref} className={`${cls} mag`} type="button"
      style={{ "--mx": `${off.x}px`, "--my": `${off.y}px` } as CSSProperties}
      onMouseLeave={() => setOff({ x: 0, y: 0 })} onMouseMove={move}>
      <span>{children}</span>
    </button>
  );
}

/* ── Reveal ──────────────────────────────────────────────────────── */
function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const n = ref.current; if (!n) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
    obs.observe(n);
    return () => obs.disconnect();
  }, []);
  return <section ref={ref} className={`rv ${v ? "in" : ""} ${className}`}>{children}</section>;
}

/* ── SI (stagger item) ───────────────────────────────────────────── */
function SI({ children, d = 0, className = "" }: { children: ReactNode; d?: number; className?: string }) {
  return <div className={`si ${className}`} style={{ "--d": `${d}ms` } as CSSProperties}>{children}</div>;
}

/* ── AnimPrice ───────────────────────────────────────────────────── */
function AnimPrice({ value, active }: { value: number; active: boolean }) {
  const col = Math.max(Math.round(value * 0.72), 0);
  const [disp, setDisp] = useState(active ? value : col);
  const dref = useRef(disp);
  useEffect(() => { dref.current = disp; }, [disp]);
  useEffect(() => {
    let raf = 0;
    const sv = dref.current, ev = active ? value : col, t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / 420, 1), e = 1 - Math.pow(1 - p, 3);
      setDisp(Math.round(sv + (ev - sv) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, col, value]);
  return <>{disp.toLocaleString()}</>;
}

/* ── ParticleBg (canvas) ─────────────────────────────────────────── */
function ParticleBg({ r = 235, g = 98, b = 0 }: { r?: number; g?: number; b?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type Node = { bx:number;by:number;vx:number;vy:number;r:number;a:number;px:number;py:number;sc:number;phase:number;speed:number };
    const st = { mouse:{x:-9999,y:-9999,lx:-9999,ly:-9999}, nodes:[] as Node[], w:0, h:0, raf:0, t:0 };

    const initNodes = (w: number, h: number) => {
      const count = Math.min(Math.floor(w * h / 16000), 60);
      st.nodes = Array.from({ length: count }, () => ({
        bx: Math.random()*w, by: Math.random()*h,
        vx: (Math.random()-0.5)*0.28, vy: (Math.random()-0.5)*0.28,
        r: 1.8 + Math.random()*2.8, a: 0.07 + Math.random()*0.10,
        px: 0, py: 0, sc: 1, phase: Math.random()*Math.PI*2, speed: 0.7 + Math.random()*0.6,
      }));
    };

    const resize = () => {
      const par = canvas.parentElement!;
      st.w = par.offsetWidth; st.h = par.offsetHeight;
      canvas.width = st.w * dpr; canvas.height = st.h * dpr;
      canvas.style.width = st.w + "px"; canvas.style.height = st.h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes(st.w, st.h);
    };

    const draw = (ts: number) => {
      st.t = ts * 0.001;
      st.mouse.lx += (st.mouse.x - st.mouse.lx) * 0.07;
      st.mouse.ly += (st.mouse.y - st.mouse.ly) * 0.07;
      const { lx: mx, ly: my } = st.mouse;
      ctx.clearRect(0, 0, st.w, st.h);

      // Grid parallax
      const sp = 58, gox = (mx/st.w - 0.5)*-18, goy = (my/st.h - 0.5)*-14;
      ctx.save();
      ctx.strokeStyle = `rgba(${r},${g},${b},0.038)`; ctx.lineWidth = 0.7; ctx.beginPath();
      const sx = ((gox%sp)+sp)%sp, sy = ((goy%sp)+sp)%sp;
      for (let x = sx-sp; x < st.w+sp; x+=sp) { ctx.moveTo(x,0); ctx.lineTo(x,st.h); }
      for (let y = sy-sp; y < st.h+sp; y+=sp) { ctx.moveTo(0,y); ctx.lineTo(st.w,y); }
      ctx.stroke(); ctx.restore();

      // Update nodes
      const posArr = st.nodes.map((n, i) => {
        n.bx += n.vx*n.speed; n.by += n.vy*n.speed;
        if (n.bx < -12) n.bx = st.w+12; if (n.bx > st.w+12) n.bx = -12;
        if (n.by < -12) n.by = st.h+12; if (n.by > st.h+12) n.by = -12;
        const f = 0.012 + (1-n.r/5)*0.012;
        const tpx = (mx/st.w-0.5)*-st.w*f, tpy = (my/st.h-0.5)*-st.h*f;
        n.px += (tpx-n.px)*0.055; n.py += (tpy-n.py)*0.055;
        const rx = n.bx+n.px, ry = n.by+n.py;
        const dx = rx-mx, dy = ry-my;
        return { i, rx, ry, d: Math.sqrt(dx*dx+dy*dy) };
      });

      const awakened = new Set([...posArr].sort((a,b)=>a.d-b.d).slice(0,5).map(x=>x.i));

      // Connections
      for (let i = 0; i < posArr.length; i++) {
        for (let j = i+1; j < posArr.length; j++) {
          const dx = posArr[i].rx-posArr[j].rx, dy = posArr[i].ry-posArr[j].ry;
          const d = Math.sqrt(dx*dx+dy*dy);
          if (d < 130) {
            const active = awakened.has(i)||awakened.has(j);
            ctx.beginPath();
            ctx.moveTo(posArr[i].rx, posArr[i].ry); ctx.lineTo(posArr[j].rx, posArr[j].ry);
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1-d/130)*(active?0.20:0.055)})`;
            ctx.lineWidth = active ? 1.0 : 0.6; ctx.stroke();
          }
        }
      }

      // Nodes
      posArr.forEach(({ i, rx, ry }) => {
        const n = st.nodes[i]; const awake = awakened.has(i);
        n.sc += ((awake ? 1.85 : 1) - n.sc) * 0.10;
        const pulse = awake ? 0 : Math.sin(st.t*0.9+n.phase)*0.02;
        const alpha = awake ? 0.55 : (n.a+pulse);
        const rad = n.r*n.sc;
        if (awake) {
          const grad = ctx.createRadialGradient(rx,ry,rad*0.5,rx,ry,rad*3.5);
          grad.addColorStop(0, `rgba(${r},${g},${b},0.18)`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath(); ctx.arc(rx,ry,rad*3.5,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(rx,ry,rad,0,Math.PI*2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`; ctx.fill();
      });

      st.raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      st.mouse.x = e.clientX-rect.left; st.mouse.y = e.clientY-rect.top;
    };
    const onLeave = () => { st.mouse.x = -9999; st.mouse.y = -9999; };
    const par = canvas.parentElement!;
    par.addEventListener("pointermove", onMove, { passive: true });
    par.addEventListener("mouseleave", onLeave);
    resize();
    const ro = new ResizeObserver(resize); ro.observe(par);
    st.raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(st.raf);
      par.removeEventListener("pointermove", onMove);
      par.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
    };
  }, [r, g, b]);

  return (
    <canvas ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      aria-hidden="true" />
  );
}

/* ── InteractiveLDE ──────────────────────────────────────────────── */
function InteractiveLDE() {
  const [active, setActive] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const hotspots = [
    { id:"ingest",   x:50, y:11, pos:"below",  label:"Multimodal Ingestion",    badge:"Input Layer",       desc:"PDF, audio, diagrams and structured data unified into one versioned pipeline." },
    { id:"nlp",      x:21, y:34, pos:"right",  label:"AI Processing Layer",     badge:"NLP Engine",        desc:"Multi-model NLP layers extract legal meaning from unstructured text and voice." },
    { id:"core",     x:50, y:44, pos:"right",  label:"LDE Core Engine",         badge:"Deterministic Core",desc:"Every output is source-traced to a legal citation. Zero hallucination by architecture." },
    { id:"verify",   x:77, y:31, pos:"left",   label:"Verification Engine",     badge:"Compliance Layer",  desc:"Cross-referenced against live land registries and statutory databases in real-time." },
    { id:"sources",  x:22, y:66, pos:"right",  label:"Structured Data Sources", badge:"Data Layer",        desc:"Land registries, court databases, statutory repositories — all integrated live." },
    { id:"analysis", x:50, y:67, pos:"above",  label:"Semantic Analysis",       badge:"Reasoning Layer",   desc:"Deep contextual understanding of legal clauses, precedents and transactional intent." },
    { id:"output",   x:77, y:67, pos:"left",   label:"Output Validation",       badge:"Trust Layer",       desc:"Final outputs are audit-logged with full traceability before delivery." },
  ];

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = wrapRef.current?.getBoundingClientRect(); if (!r) return;
    setTilt({ x: ((e.clientX-r.left)/r.width-0.5)*10, y: ((e.clientY-r.top)/r.height-0.5)*8 });
  };

  return (
    <div className="lde-hero" ref={wrapRef} onMouseMove={onMove} onMouseLeave={() => setTilt({x:0,y:0})}>
      <div className="lde-hero-img-wrap">
        <img src={IMG.lde} alt="Logos AI LDE Engine" className="lde-hero-img"
          style={{ transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg) scale(1.02)` }} />
        <div className="lde-hero-glow" />
        {hotspots.map(h => (
          <div key={h.id} className={`hpin ${active===h.id?"on":""}`}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            onMouseEnter={() => setActive(h.id)} onMouseLeave={() => setActive(null)}>
            <div className="hpin-ring" />
            <div className="hpin-dot" />
            {active === h.id && (
              <div className={`hpin-tip ${h.pos}`}>
                <div className="hpin-tip-badge">{h.badge}</div>
                <h5>{h.label}</h5>
                <p>{h.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="scard">
        <div className="srow">
          <div className="sitem"><strong>0</strong><span>Hallucinations</span></div>
          <div className="sdiv" />
          <div className="sitem"><strong>10×</strong><span>Velocity</span></div>
          <div className="sdiv" />
          <div className="sitem"><strong>SEA</strong><span>Focus</span></div>
        </div>
      </div>
    </div>
  );
}

/* ── LDE Visualizer (SVG) ────────────────────────────────────────── */
function LDEViz() {
  const inputs  = ["Legal Statutes","Land Registry","Case Law","Contracts"];
  const outputs = ["Verified Truth","SPA Generator","Compliance Check","Audit Trail"];
  const iy = [80,165,255,345], oy = [80,175,265,355];
  const cx = 340, cy = 215;
  return (
    <svg viewBox="0 0 680 440" width="100%" height="100%" aria-label="LDE Engine data flow">
      <defs>
        <radialGradient id="cg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9950" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#ff9950" stopOpacity="0"/>
        </radialGradient>
        <filter id="gw"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        {inputs.map((_,i) => <path key={`pi${i}`} id={`pi${i}`} d={`M 110 ${iy[i]} C 200 ${iy[i]}, 260 ${cy}, ${cx-30} ${cy}`}/>)}
        {outputs.map((_,i) => <path key={`po${i}`} id={`po${i}`} d={`M ${cx+30} ${cy} C 420 ${cy}, 480 ${oy[i]}, 570 ${oy[i]}`}/>)}
      </defs>
      <ellipse cx={cx} cy={cy} rx="70" ry="70" fill="url(#cg)">
        <animate attributeName="rx" values="65;75;65" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="65;75;65" dur="3s" repeatCount="indefinite"/>
      </ellipse>
      {inputs.map((_,i) => <path key={i} d={`M 110 ${iy[i]} C 200 ${iy[i]}, 260 ${cy}, ${cx-30} ${cy}`} fill="none" stroke="rgba(235,98,0,0.22)" strokeWidth="1.5" strokeDasharray="4 4"/>)}
      {outputs.map((_,i) => <path key={i} d={`M ${cx+30} ${cy} C 420 ${cy}, 480 ${oy[i]}, 570 ${oy[i]}`} fill="none" stroke="rgba(235,98,0,0.22)" strokeWidth="1.5" strokeDasharray="4 4"/>)}
      {inputs.map((_,i) => (
        <g key={i}>
          <circle r="3.5" fill="#f28434" opacity="0.9" filter="url(#gw)"><animateMotion dur={`${2+i*.4}s`} repeatCount="indefinite" begin={`${i*.6}s`}><mpath href={`#pi${i}`}/></animateMotion></circle>
          <circle r="3.5" fill="#ff9950" opacity="0.7"><animateMotion dur={`${2+i*.4}s`} repeatCount="indefinite" begin={`${i*.6+1.1}s`}><mpath href={`#pi${i}`}/></animateMotion></circle>
        </g>
      ))}
      {outputs.map((_,i) => <circle key={i} r="3.5" fill="#ff9950" opacity="0.85" filter="url(#gw)"><animateMotion dur={`${2.2+i*.35}s`} repeatCount="indefinite" begin={`${i*.5+0.3}s`}><mpath href={`#po${i}`}/></animateMotion></circle>)}
      {inputs.map((label,i) => (
        <g key={i}>
          <rect x="4" y={iy[i]-14} width="106" height="28" rx="5" fill="rgba(235,98,0,0.09)" stroke="rgba(235,98,0,0.25)" strokeWidth="1"/>
          <circle cx="18" cy={iy[i]} r="4" fill="#f28434" opacity="0.8"/>
          <text x="28" y={iy[i]+4.5} fontFamily="Manrope,sans-serif" fontSize="10.5" fill="rgba(255,255,255,0.75)" fontWeight="600">{label}</text>
        </g>
      ))}
      {outputs.map((label,i) => (
        <g key={i}>
          <rect x="570" y={oy[i]-14} width="106" height="28" rx="5" fill="rgba(235,98,0,0.09)" stroke="rgba(235,98,0,0.25)" strokeWidth="1"/>
          <circle cx="583" cy={oy[i]} r="4" fill="#ff9950" opacity="0.8"/>
          <text x="593" y={oy[i]+4.5} fontFamily="Manrope,sans-serif" fontSize="10.5" fill="rgba(255,255,255,0.75)" fontWeight="600">{label}</text>
        </g>
      ))}
      <polygon points={`${cx},${cy-44} ${cx+38},${cy-22} ${cx+38},${cy+22} ${cx},${cy+44} ${cx-38},${cy+22} ${cx-38},${cy-22}`} fill="none" stroke="rgba(235,98,0,0.55)" strokeWidth="2">
        <animate attributeName="stroke-opacity" values="0.55;0.85;0.55" dur="2.5s" repeatCount="indefinite"/>
      </polygon>
      <polygon points={`${cx},${cy-30} ${cx+26},${cy-15} ${cx+26},${cy+15} ${cx},${cy+30} ${cx-26},${cy+15} ${cx-26},${cy-15}`} fill="rgba(235,98,0,0.08)" stroke="rgba(235,98,0,0.30)" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r="55" fill="none" stroke="rgba(235,98,0,0.12)" strokeWidth="1"><animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="20s" repeatCount="indefinite"/></circle>
      <circle cx={cx} cy={cy} r="70" fill="none" stroke="rgba(235,98,0,0.07)" strokeWidth="1" strokeDasharray="6 4"><animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`-360 ${cx} ${cy}`} dur="30s" repeatCount="indefinite"/></circle>
      <text x={cx} y={cy-7} textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="16" fontWeight="700" letterSpacing="3" fill="#ffffff" opacity="0.95">LDE</text>
      <text x={cx} y={cy+12} textAnchor="middle" fontFamily="Manrope,sans-serif" fontSize="8.5" fontWeight="700" letterSpacing="2" fill="rgba(255,153,80,0.7)">CORE ENGINE</text>
    </svg>
  );
}

/* ── TweaksPanel ─────────────────────────────────────────────────── */
function TweaksPanel({ visible, tweaks, setTweaks }: { visible: boolean; tweaks: Tweaks; setTweaks: (t: (p: Tweaks) => Tweaks) => void }) {
  const set = (k: keyof Tweaks, v: Tweaks[keyof Tweaks]) => setTweaks(t => ({ ...t, [k]: v }));
  return (
    <div className={`twk ${visible ? "vis" : ""}`}>
      <div className="twkttl">Tweaks</div>
      <div className="twkrow">
        <span className="twklbl">Brand Intensity</span>
        <div className="twkopts">
          {(["Default","Vivid","Muted"] as const).map(v => (
            <span key={v} className={`twkopt ${tweaks.intensity===v?"on":""}`}
              onClick={() => {
                const map: Record<string,[string,string,string,string]> = {
                  Default:["#a33800","#eb6200","#f28434","#ff9950"],
                  Vivid:["#8a2e00","#d45500","#e87a30","#ff8c40"],
                  Muted:["#b04010","#d06020","#e09050","#f0b080"],
                };
                const [b0,b1,b2,b3] = map[v];
                document.documentElement.style.setProperty("--b0",b0);
                document.documentElement.style.setProperty("--b1",b1);
                document.documentElement.style.setProperty("--b2",b2);
                document.documentElement.style.setProperty("--b3",b3);
                set("intensity", v);
              }}>{v}</span>
          ))}
        </div>
      </div>
      <div className="twkrow">
        <span className="twklbl">Section Backgrounds</span>
        <div className="twkopts">
          {(["Warm","Pure White"] as const).map(v => (
            <span key={v} className={`twkopt ${tweaks.bg===v?"on":""}`}
              onClick={() => {
                document.documentElement.style.setProperty("--sf-w", v==="Warm" ? "#fff4f0" : "#fafafa");
                set("bg", v);
              }}>{v}</span>
          ))}
        </div>
      </div>
      <div className="twkrow">
        <div className="twktog" onClick={() => set("showLDE", !tweaks.showLDE)}>
          <div className={`twktr ${tweaks.showLDE?"on":""}`}><div className="twkth"/></div>
          <span>Show LDE Visualizer</span>
        </div>
      </div>
    </div>
  );
}

/* ── Pages ───────────────────────────────────────────────────────── */
const founders = [
  { name: "Lim Gin Young", role: "Co-Founder & CEO", img: IMG.young },
  { name: "Low Chin Hsien", role: "Co-Founder & CTO", img: IMG.chin },
];

const pricingTiers = [
  { title:"Standard",     mo:"RM1000",  yr:"RM9600",  desc:"Essential intelligence tools for boutique practices focused on precision.",           pts:["Access to Core Aequitas Database","Up to 5 User Accounts","Standard Query Velocity"],                                                   btn:"Start Free Trial" },
  { title:"Professional", mo:"RM2000",  yr:"RM19200", desc:"Advanced capabilities for high-volume firms requiring absolute data fidelity.",        pts:["Full Aequitas Ecosystem Access","Unlimited User Accounts","High-Velocity Priority Processing","Dedicated Account Curator"], feat:true, btn:"Start Free Trial" },
  { title:"Academic",     mo:"Invited", yr:"Invited", desc:"Supporting the next generation of legal minds with free access to our primary database.", pts:["Academic Database Access","Campus-Wide IP Authentication"],                                                                       btn:"Request Access" },
];

function MissionPage({ tweaks }: { tweaks: Tweaks }) {
  return (
    <main>
      {/* Hero */}
      <section className="hero wrap">
        <ParticleBg r={235} g={98} b={0} />
        <div className="hcopy" style={{ position:"relative", zIndex:2 }}>
          <div className="stagger">
            <SI d={60}><span className="chip">Intelligence Unleashed · Southeast Asia</span></SI>
            <SI d={140}>
              <h1 className="dh">
                <span className="ln">The Operating</span>
                <span className="ln ac">System</span>
                <span className="ln">for Truth.</span>
              </h1>
            </SI>
            <SI d={260}><p className="hbody">Accelerating AI digitalization across Southeast Asia — freeing professionals from the mundane so they can focus on high-impact work.</p></SI>
            <SI d={360}>
              <div className="hctas">
                <MagBtn cls="bp">Try Our Package</MagBtn>
                <MagBtn cls="bg">Explore Mission</MagBtn>
              </div>
            </SI>
          </div>
        </div>
        <div className="hvis" style={{ position:"relative", zIndex:2 }}>
          <InteractiveLDE />
        </div>
      </section>

      {/* About */}
      <div className="aband">
        <Reveal className="agrid wrap">
          <div className="aimgc">
            <div className="aframe"><img src={IMG.logo} alt="Logos AI" /></div>
            <div className="abadge">
              <strong>Jan 2026</strong>
              <span>The moment the architecture of truth was finalized.</span>
            </div>
          </div>
          <div className="acopy">
            <span className="slbl">Our Foundation</span>
            <h2 className="sh">2 Years of Deep Research.<br /><em>Ready for the Spike.</em></h2>
            <p>Founded in January 2026, Logos AI is the culmination of two years of intense market experience and deep technological research. We didn't launch until we solved the fundamental problem of AI hallucination.</p>
            <blockquote className="pq">"Now is the time to spike development."</blockquote>
            <p>We are scaling infrastructure that will define digital truth across Southeast Asia's burgeoning tech ecosystem — built for precision, designed for professionals.</p>
          </div>
        </Reveal>
      </div>

      {/* LDE Visualizer */}
      {tweaks.showLDE && (
        <div className="lband">
          <div className="wrap">
            <Reveal>
              <div className="lhead">
                <span className="slbl">Core Technology</span>
                <h2 className="sh">The Logos Data Engine:<br /><em>Deterministic Truth</em></h2>
                <p>LDE ingests multimodal legal and financial data — statutes, registries, case law, contracts — and outputs verified, traceable, zero-hallucination results at every step.</p>
              </div>
              <div className="lgrid">
                <div className="lpts">
                  {[
                    { n:"01", h:"Multimodal Ingestion",       p:"Statutes, land registries, court records, contracts — all unified into one versioned knowledge graph." },
                    { n:"02", h:"Deterministic Verification",  p:"Every output is traced back to its source citation. No probabilistic guessing. 0 hallucination by architecture." },
                    { n:"03", h:"Self-Evolving Knowledge",     p:"The engine updates automatically as laws change. Your data stays current without manual curation." },
                    { n:"04", h:"Financial-Grade Reliability", p:"Built for conveyancing and banking standards — the same reliability demanded by regulators." },
                  ].map(({ n, h, p }) => (
                    <div key={n} className="lpt">
                      <span className="lnum">{n}</span>
                      <div><h4>{h}</h4><p>{p}</p></div>
                    </div>
                  ))}
                </div>
                <div className="lvis"><LDEViz /></div>
              </div>
            </Reveal>
          </div>
        </div>
      )}

      {/* Founders */}
      <Reveal className="found wrap">
        <div className="fhead">
          <h2 className="sh">The Architects<br />of Logos</h2>
          <p>Visionary founders bridging raw data and absolute truth.</p>
        </div>
        <div className="fgrid">
          {founders.map(f => (
            <article key={f.name} className="fcard">
              <div className="ffr">
                <img src={f.img} alt={f.name} className="fimg" />
                <div className="ftint" />
              </div>
              <div className="finfo">
                <div><h3>{f.name}</h3><p>{f.role}</p></div>
                <span className="fplus">+</span>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal className="ctaband wrap">
        <div className="ctain">
          <div className="ctacopy">
            <h2>Ready to automate<br />the future?</h2>
            <p>Join the Aequitas trial — experience the world's most stable AI operating system.</p>
          </div>
          <MagBtn cls="bw">Try Our Package</MagBtn>
        </div>
      </Reveal>
    </main>
  );
}

function AequitasPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="hero hero-aq wrap">
        <ParticleBg r={235} g={98} b={0} />
        <div className="hcopy" style={{ position:"relative", zIndex:2 }}>
          <div className="stagger">
            <SI d={40}><div className="tech-tag"><span className="dot" />&nbsp;TRIAL STAGE ACTIVE — Q2 2025</div></SI>
            <SI d={120}>
              <h1 className="dh">
                <span className="ln">The First</span>
                <span className="ln ac">Integrated</span>
                <span className="ln">Legal OS.</span>
              </h1>
            </SI>
            <SI d={240}><p className="hbody">From fragmented documents to a unified intelligence ecosystem. Zero hallucination. 100% traceable. Financial-grade reliability.</p></SI>
            <SI d={340}>
              <div className="hctas">
                <MagBtn cls="bp">Start Free Trial</MagBtn>
                <MagBtn cls="bg">Watch Demo</MagBtn>
              </div>
            </SI>
          </div>
        </div>
        <div className="hvis" style={{ position:"relative", zIndex:2 }}>
          <div className="hud">
            <img src={IMG.aequitas} alt="Aequitas Dashboard" className="hshot" />
            <div className="hudbg" />
            <div className="hring out" /><div className="hring mid" /><div className="hring inn" />
            <div className="hudscan" /><div className="hudh" /><div className="hudv" />
            <div className="hudcore" />
            <span className="hdot a" /><span className="hdot b" /><span className="hdot c" />
          </div>
          <div className="spdcard">
            <p className="spdlbl">Automation Speed</p>
            <strong className="spdval">94.2% Faster</strong>
            <span>SPA generation and compliance checks in seconds, not hours.</span>
          </div>
        </div>
      </section>

      {/* ── Features (Bento) ── */}
      <Reveal className="bento wrap">
        <div className="bhead">
          <h2 className="sh">The New Standard<br />for <em>Legal Ops.</em></h2>
          <p>We dismantled the traditional conveyancing workflow to rebuild it for the AI era.</p>
        </div>
        <div className="bgrid">
          <article className="bc bc-lg">
            <div className="bswrap">
              <img src={IMG.spa} alt="SPA creation" className="bshot spa" />
            </div>
            <div className="bico">⬡</div>
            <h3>Dynamic SPA Generation</h3>
            <p>Our integrated engine constructs Sales and Purchase Agreements from verified sources — contextually aware and legally sound, in seconds.</p>
            <small>Live Module</small>
          </article>
          <article className="bc bc-dk">
            <div className="bswrap cpt">
              <img src={IMG.approval} alt="Compliance review" className="bshot apv" />
            </div>
            <div className="bico">◎</div>
            <h3>Continuous Compliance</h3>
            <p>Automated regulatory alignment checks running in the background. Never miss a clause change or statutory update again.</p>
            <div className="cbar"><div /></div>
            <small>Accuracy: 100%</small>
          </article>
          <article className="bc bc-im">
            <img src={IMG.aequitas} alt="Aequitas overview" className="bbgimg" />
            <div className="bic">
              <h3>Zero Hallucination Architecture</h3>
              <p>Logos AI core ensures data integrity at every hop.</p>
            </div>
          </article>
          <article className="bc btr">
            <div className="tpill">TRIAL</div>
            <div>
              <h3>Exclusive Trial Enrollment</h3>
              <p>Be among the first firms to pilot Aequitas OS. Limited slots for our Q4 cohort.</p>
              <span className="tcta">Secure Your Slot →</span>
            </div>
          </article>
        </div>
      </Reveal>

      {/* ── Advantage ── */}
      <Reveal className="aq-adv wrap">
        <div className="aq-adv-hd">
          <span className="slbl">Why Aequitas</span>
          <h2 className="sh">The Curator's Advantage</h2>
          <p>Three pillars that make Aequitas the only legal OS firms trust for high-stakes transactions.</p>
        </div>

        <div className="aq-cols">
          {[
            { n:"01", l:"Infrastructure", d:"Cloud-native, zero-trust architecture purpose-built for sensitive legal and financial data." },
            { n:"02", l:"Intelligence",   d:"Proprietary LLM layers fine-tuned on real estate law, conveyancing statutes, and land registry data." },
            { n:"03", l:"Integration",    d:"Connects directly to land registries, financial portals, and compliance databases in real-time." },
          ].map(({ n, l, d }) => (
            <div key={n} className="aq-col">
              <div className="adv-bignum">{n}</div>
              <p className="advlbl">{l}</p>
              <p>{d}</p>
            </div>
          ))}
        </div>

        <div className="aq-kpi">
          {[
            { v:"0s",    label:"Hallucination Rate" },
            { v:"100%",  label:"Traceable Logic" },
            { v:"<2s",   label:"Generation Time" },
            { v:"∞",     label:"Scalability" },
          ].map(({ v, label }) => (
            <div key={label} className="aq-kpi-cell">
              <strong>{v}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <article className="dpan warm">
          <h3>The SPA as a Living Data Object</h3>
          <p>In Aequitas, every Sales and Purchase Agreement is tracked in real-time, cross-referenced with compliance databases, and optimized with the latest precedents — without human error.</p>
        </article>
      </Reveal>

      {/* ── CTA ── */}
      <Reveal className="ctaband wrap">
        <div className="ctain">
          <div className="ctacopy">
            <h2>Ready to curate<br />the future of law?</h2>
            <p>Join the Aequitas trial today and redefine your firm's operational velocity.</p>
          </div>
          <MagBtn cls="bw">Start Free Trial</MagBtn>
        </div>
      </Reveal>
    </main>
  );
}

function PricingPage() {
  const [hov, setHov] = useState("Professional");
  const [bill, setBill] = useState<BillMode>("monthly");
  return (
    <main>
      <section className="phero wrap">
        <ParticleBg r={235} g={98} b={0} />
        <div className="stagger" style={{ position:"relative", zIndex:1 }}>
          <SI d={60}><span className="chip">Transparent Pricing</span></SI>
          <SI d={140}><h1 className="dh"><span className="ln">Precision Tools</span><span className="ln ac">For Every Scale</span></h1></SI>
          <SI d={240}><p className="hbody ctr">Empower your practice with 0-hallucination data. Select the toolset designed for your operational scale.</p></SI>
          <SI d={320}>
            <div className="btog">
              <button className={`bbtn ${bill==="monthly"?"on":""}`} type="button" onClick={() => setBill("monthly")}>Monthly</button>
              <button className={`bbtn ${bill==="annual"?"on":""}`} type="button" onClick={() => setBill("annual")}>Annual</button>
              <span className="bnote">Save 20% annually</span>
            </div>
          </SI>
        </div>
      </section>

      <Reveal className="lstrip wrap">
        <span className="ldot">✦</span>
        <div className="lcopy"><strong>Special Launch Offer</strong><span>All law firms get their first month FREE.</span></div>
        <button className="lclaim" type="button">Claim Offer</button>
      </Reveal>

      <Reveal className="pgrid wrap">
        {pricingTiers.map(tier => {
          const price = bill === "monthly" ? tier.mo : tier.yr;
          const isRM = price.startsWith("RM");
          const isHov = hov === tier.title;
          return (
            <article key={tier.title} className={`pc ${tier.feat?"feat":""} ${isHov?"hov":""}`}
              onMouseEnter={() => setHov(tier.title)} onMouseLeave={() => setHov("Professional")}>
              {tier.feat && <div className="rpill">Recommended</div>}
              <div className="ptier">{tier.title}</div>
              <div className="ppr">
                {isRM ? (
                  <>
                    <span className="pcur">RM</span>
                    <span className="pnum"><AnimPrice value={parseInt(price.replace("RM",""),10)} active={isHov}/></span>
                    <span className="pper">{bill==="monthly"?"/mo":"/yr"}</span>
                  </>
                ) : <span className="pnum sm">{price}</span>}
              </div>
              {bill==="annual" && isRM && <p className="pann">~ {tier.mo}/month billed yearly</p>}
              <p className="pdesc">{tier.desc}</p>
              <ul className="pfeats">
                {tier.pts.map(p => <li key={p}><span className="fd">◆</span>{p}</li>)}
              </ul>
              <MagBtn cls={tier.feat ? "bp" : "bo"}>{tier.btn}</MagBtn>
            </article>
          );
        })}
      </Reveal>

      <Reveal className="faq wrap">
        <h2 className="fttl">FAQ</h2>
        <div className="fqgrid">
          {[
            { q:"What's included in the trial?",   a:"The 1-month trial provides full, uninhibited access to the tier you select — the complete High-Velocity Intelligence engine, including all query tools and data verification nodes." },
            { q:"How is our data secured?",          a:"Logos AI employs end-to-end encryption and a strict zero-retention policy on user queries. Your intellectual property and research strategies remain entirely your own." },
            { q:"Can we cancel before trial ends?",  a:"Yes. Cancellation is immediate and executed directly from your administrative dashboard. No hidden fees or complex offboarding processes." },
          ].map(({ q, a }) => (
            <article key={q} className="fqc"><h3>{q}</h3><p>{a}</p></article>
          ))}
        </div>
      </Reveal>
    </main>
  );
}

function DemoPage() {
  const [purchaseInput, setPurchaseInput] = useState("1000000");
  const [marginInput, setMarginInput] = useState("90");
  const [interestInput, setInterestInput] = useState("4.2");
  const [tenureInput, setTenureInput] = useState("30");

  const purchasePrice = parseMoneyInput(purchaseInput);
  const margin = parseMoneyInput(marginInput);
  const interest = parseMoneyInput(interestInput);
  const tenure = parseMoneyInput(tenureInput);
  const loanAmount = purchasePrice * (margin / 100);
  const legalFee = calcLegalFee(purchasePrice);
  const transferStampDuty = calcTransferStampDuty(purchasePrice);
  const loanStampDuty = calcLoanStampDuty(loanAmount);
  const monthlyInstallment = calcMonthlyInstallment(loanAmount, interest, tenure);

  return (
    <main>
      <section className="demohero wrap">
        <div className="stagger">
          <SI d={60}><span className="chip">Interactive Demo</span></SI>
          <SI d={140}>
            <h1 className="dh">
              <span className="ln">Aequitas ChatAPI</span>
              <span className="ln ac">Demo Suite</span>
            </h1>
          </SI>
          <SI d={240}>
            <p className="hbody ctr">
              Explore the Aequitas ChatAPI, followed by the Malaysia stamp duty calculator for SPA,
              transfer duty, loan duty, and home loan installment estimates.
            </p>
          </SI>
        </div>
      </section>

      <Reveal className="demo-grid wrap">
        <section className="demo-card demo-llm">
          <div className="demo-card-head">
            <span className="slbl">LLM API Demo</span>
            <h2 className="sh">Aequitas ChatAPI</h2>
          </div>
          <p className="demo-placeholder-copy">
            This panel is reserved for the Aequitas ChatAPI function. Once you send me the API
            spec, I can wire it in here as the first demo tool before the Malaysia calculator.
          </p>
          <div className="llm-placeholder">
            <div className="llm-pill">Awaiting API Details</div>
            <div className="llm-terminal">
              <span className="llm-line">tool: aequitas_chat_api</span>
              <span className="llm-line">status: ready_to_connect</span>
              <span className="llm-line">input_schema: pending</span>
            </div>
          </div>
        </section>

        <section className="demo-card demo-form">
          <div className="demo-card-head">
            <span className="slbl">Property Inputs</span>
            <h2 className="sh">Malaysia Property Cost Estimator</h2>
          </div>

          <div className="calc-grid">
            <label className="calc-field">
              <span>Property Purchase Price (RM)</span>
              <input value={purchaseInput} onChange={(e) => setPurchaseInput(e.target.value)} inputMode="decimal" />
            </label>
            <label className="calc-field">
              <span>Margin of Finance (%)</span>
              <input value={marginInput} onChange={(e) => setMarginInput(e.target.value)} inputMode="decimal" />
            </label>
            <label className="calc-field">
              <span>Interest Rate (%)</span>
              <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)} inputMode="decimal" />
            </label>
            <label className="calc-field">
              <span>Loan Tenure (Years)</span>
              <input value={tenureInput} onChange={(e) => setTenureInput(e.target.value)} inputMode="decimal" />
            </label>
          </div>

          <div className="calc-note">
            Based on the calculator structure referenced from Low &amp; Partners:
            first RM500,000 at 1.25%, next RM7,000,000 at 1%, transfer duty at 1% / 2% / 3% / 4% tiers,
            and loan stamp duty at 0.5% rounded up.
          </div>
        </section>

        <section className="demo-card demo-results">
          <div className="demo-card-head">
            <span className="slbl">Outputs</span>
            <h2 className="sh">Demo Results</h2>
          </div>

          <div className="metric-list">
            <div className="metric-row">
              <span>Estimated Legal Fee (SPA / Loan Agreement)</span>
              <strong>RM {formatMoney(legalFee)}</strong>
            </div>
            <div className="metric-row">
              <span>Transfer Stamp Duty</span>
              <strong>RM {formatMoney(transferStampDuty)}</strong>
            </div>
            <div className="metric-row">
              <span>Loan Amount</span>
              <strong>RM {formatMoney(loanAmount)}</strong>
            </div>
            <div className="metric-row">
              <span>Loan Stamp Duty</span>
              <strong>RM {formatMoney(loanStampDuty)}</strong>
            </div>
            <div className="metric-row">
              <span>Monthly Installment</span>
              <strong>RM {formatMoney(monthlyInstallment)}</strong>
            </div>
          </div>

          <div className="calc-disclaimer">
            Demo note: the above is an estimate for Malaysian / PR scenarios and does not include
            disbursements or negotiated fee adjustments above RM7.5 million.
          </div>
        </section>
      </Reveal>
    </main>
  );
}

/* ── App ─────────────────────────────────────────────────────────── */
const TWEAK_DEFAULTS: Tweaks = { intensity:"Default", bg:"Warm", density:"Spacious", showLDE:true };

export default function App() {
  const [page, setPage]     = useState<PageKey>(() => detectPage(window.location.pathname));
  const [disp, setDisp]     = useState<PageKey>(() => detectPage(window.location.pathname));
  const [tx, setTx]         = useState<TxStage>("idle");
  const [mouse, setMouse]   = useState({ x:50, y:18 });
  const [prog, setProg]     = useState(0);
  const [drawer, setDrawer] = useState(false);
  const [tweaksVis, setTweaksVis] = useState(false);
  const [tweaks, setTweaks] = useState<Tweaks>(TWEAK_DEFAULTS);
  const exit = useRef<number | null>(null), enter = useRef<number | null>(null);

  useEffect(() => {
    const pm = (e: PointerEvent) => setMouse({ x:(e.clientX/window.innerWidth)*100, y:(e.clientY/window.innerHeight)*100 });
    const ps = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProg(max > 0 ? Math.round((window.scrollY/max)*100) : 0);
    };
    const pp = () => { const n = detectPage(window.location.pathname); setPage(n); setDisp(n); setTx("entering"); };
    window.addEventListener("pointermove", pm);
    window.addEventListener("scroll", ps, { passive:true });
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
    window.parent.postMessage({ type:"__edit_mode_available" }, "*");
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
      window.scrollTo({ top:0, behavior:"smooth" });
    }, 340);
  }, [disp, tx]);

  return (
    <div className={`shell tx-${tx}`}
      style={{ "--px":`${mouse.x}%`, "--py":`${mouse.y}%` } as CSSProperties}>
      <div className="spbar" style={{ "--prog":`${prog}%` } as CSSProperties} />
      <div className="orb orb-a" /><div className="orb orb-b" /><div className="grain" />
      <div className="shutter" />
      <div className="txov">
        <span className="txov-lbl">Loading</span>
        <strong>{PAGE_TITLES[page]}</strong>
      </div>

      {/* Header */}
      <header className="hdr">
        <button className="brand" onClick={() => navigate(NAV[0])} type="button">
          <div className="brand-mk"><img src={IMG.logo} alt="Logos AI" /></div>
          Logos AI
        </button>
        <nav className="nav">
          {NAV.map(item => (
            <button key={item.key} className={`nb ${disp===item.key?"on":""}`} onClick={() => navigate(item)} type="button">
              {item.label}
              {disp === item.key && <span className="npip" />}
            </button>
          ))}
        </nav>
        <span className="hdr-cta"><MagBtn cls="bp">Get Started</MagBtn></span>
        <button className={`ham ${drawer?"open":""}`} type="button"
          onClick={() => setDrawer(d => !d)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      {/* Mobile Drawer */}
      <div className={`drw-wrap ${drawer?"open":""}`}>
        <div className="drw-bd" onClick={() => setDrawer(false)} />
        <div className="drw">
          <div className="drw-logo">Logos AI</div>
          {NAV.map(item => (
            <button key={item.key} className={`drw-lnk ${disp===item.key?"on":""}`}
              type="button" onClick={() => navigate(item)}>{item.label}</button>
          ))}
          <div className="drw-cta"><MagBtn cls="bp">Get Started</MagBtn></div>
        </div>
      </div>

      {/* Page */}
      <div className="pf" key={disp}>
        {disp === "mission"   && <MissionPage tweaks={tweaks} />}
        {disp === "aequitas"  && <AequitasPage />}
        {disp === "pricing"   && <PricingPage />}
        {disp === "demo"      && <DemoPage />}
      </div>

      {/* Footer */}
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
