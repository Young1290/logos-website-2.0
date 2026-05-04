import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import checkApprovalImage from "../image/CheckApproval.png";
import chinHsienPhoto from "../image/Chin Hsien.jpg";
import ldePhoto from "../image/LDE.jpg";
import logoImg from "../image/logo.jpg";
import mainAequitasImage from "../image/Main Aequitas.png";
import spaCreationImage from "../image/SPA creation.png";
import youngPhoto from "../image/young.jpg";

/* ── types ───────────────────────────────────────────────────────── */
export type PageKey = "mission" | "aequitas" | "pricing" | "demo";
export type TxStage = "idle" | "exiting" | "entering";
export type BillMode = "monthly" | "annual";
export type Tweaks = { intensity: string; bg: string; density: string; showLDE: boolean };

/* ── constants & data ────────────────────────────────────────────── */
export const IMG = {
  logo: logoImg, lde: ldePhoto, aequitas: mainAequitasImage,
  spa: spaCreationImage, approval: checkApprovalImage,
  young: youngPhoto, chin: chinHsienPhoto,
};

export function detectPage(p: string): PageKey {
  if (p === "/pricing") return "pricing";
  if (p === "/aequitas") return "aequitas";
  if (p === "/demo") return "demo";
  return "mission";
}

export const founders = [
  { name: "Lim Gin Young", role: "Co-Founder & CEO", img: IMG.young },
  { name: "Low Chin Hsien", role: "Co-Founder & CTO", img: IMG.chin },
];

export const pricingTiers = [
  { title:"Standard",     mo:"RM1000",  yr:"RM9600",  desc:"Essential intelligence tools for boutique practices focused on precision.",             pts:["10GB Dedicated Storage","All Core Functions","All Marketplace Functions"],      btn:"Start Free Trial" },
  { title:"Professional", mo:"RM2000",  yr:"RM19200", desc:"Advanced capabilities for high-volume firms requiring absolute data fidelity.",          pts:["100GB Dedicated Storage","All Core Functions","Priority Marketplace Ranking"],   feat:true, btn:"Start Free Trial" },
  { title:"Academic",     mo:"Invited", yr:"Invited", desc:"Supporting the next generation of legal minds with free access to our primary database.", pts:["Academic Database Access","Campus-Wide IP Authentication"],                     btn:"Request Access" },
];

/* ── calc utils ──────────────────────────────────────────────────── */
export function parseMoneyInput(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function calcLegalFee(amount: number) {
  if (amount <= 0) return 0;
  const firstTier = Math.min(amount, 500_000) * 0.0125;
  const secondTierBase = Math.max(Math.min(amount - 500_000, 7_000_000), 0);
  const secondTier = secondTierBase * 0.01;
  const remaining = Math.max(amount - 7_500_000, 0);
  return firstTier + secondTier + remaining * 0.01;
}

export function calcTransferStampDuty(amount: number) {
  if (amount <= 0) return 0;
  const first = Math.min(amount, 100_000) * 0.01;
  const second = Math.max(Math.min(amount - 100_000, 400_000), 0) * 0.02;
  const third = Math.max(Math.min(amount - 500_000, 500_000), 0) * 0.03;
  const fourth = Math.max(amount - 1_000_000, 0) * 0.04;
  return first + second + third + fourth;
}

export function calcLoanStampDuty(loanAmount: number) {
  if (loanAmount <= 0) return 0;
  return Math.ceil(loanAmount * 0.005);
}

export function calcMonthlyInstallment(loanAmount: number, annualRate: number, years: number) {
  if (loanAmount <= 0 || annualRate <= 0 || years <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (loanAmount * monthlyRate * factor) / (factor - 1);
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

/* ── MagBtn ──────────────────────────────────────────────────────── */
export function MagBtn({ cls, children }: { cls: string; children: ReactNode }) {
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
export function Reveal({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const n = ref.current; if (!n) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
    obs.observe(n);
    return () => obs.disconnect();
  }, []);
  return <section ref={ref} className={`rv ${v ? "in" : ""} ${className}`} style={style}>{children}</section>;
}

/* ── SI ──────────────────────────────────────────────────────────── */
export function SI({ children, d = 0, className = "" }: { children: ReactNode; d?: number; className?: string }) {
  return <div className={`si ${className}`} style={{ "--d": `${d}ms` } as CSSProperties}>{children}</div>;
}

/* ── AnimPrice ───────────────────────────────────────────────────── */
export function AnimPrice({ value, active }: { value: number; active: boolean }) {
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

/* ── ParticleBg ──────────────────────────────────────────────────── */
export function ParticleBg({ r = 235, g = 98, b = 0 }: { r?: number; g?: number; b?: number }) {
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
      const sp = 58, gox = (mx/st.w - 0.5)*-18, goy = (my/st.h - 0.5)*-14;
      ctx.save();
      ctx.strokeStyle = `rgba(${r},${g},${b},0.038)`; ctx.lineWidth = 0.7; ctx.beginPath();
      const sx = ((gox%sp)+sp)%sp, sy = ((goy%sp)+sp)%sp;
      for (let x = sx-sp; x < st.w+sp; x+=sp) { ctx.moveTo(x,0); ctx.lineTo(x,st.h); }
      for (let y = sy-sp; y < st.h+sp; y+=sp) { ctx.moveTo(0,y); ctx.lineTo(st.w,y); }
      ctx.stroke(); ctx.restore();
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
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }}
      aria-hidden="true" />
  );
}

/* ── InteractiveLDE ──────────────────────────────────────────────── */
export function InteractiveLDE() {
  const [active, setActive] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const hotspots = [
    { id:"ingest",   x:50, y:11, pos:"below",  label:"Multimodal Ingestion",    badge:"Input Layer",        desc:"PDF, audio, diagrams and structured data unified into one versioned pipeline." },
    { id:"nlp",      x:21, y:34, pos:"right",  label:"AI Processing Layer",     badge:"NLP Engine",         desc:"Multi-model NLP layers extract legal meaning from unstructured text and voice." },
    { id:"core",     x:50, y:44, pos:"right",  label:"LDE Core Engine",         badge:"Deterministic Core", desc:"Every output is source-traced to a legal citation. Zero hallucination by architecture." },
    { id:"verify",   x:77, y:31, pos:"left",   label:"Verification Engine",     badge:"Compliance Layer",   desc:"Cross-referenced against live land registries and statutory databases in real-time." },
    { id:"sources",  x:22, y:66, pos:"right",  label:"Structured Data Sources", badge:"Data Layer",         desc:"Land registries, court databases, statutory repositories — all integrated live." },
    { id:"analysis", x:50, y:67, pos:"above",  label:"Semantic Analysis",       badge:"Reasoning Layer",    desc:"Deep contextual understanding of legal clauses, precedents and transactional intent." },
    { id:"output",   x:77, y:67, pos:"left",   label:"Output Validation",       badge:"Trust Layer",        desc:"Final outputs are audit-logged with full traceability before delivery." },
  ];
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = wrapRef.current?.getBoundingClientRect(); if (!r) return;
    setTilt({ x: ((e.clientX-r.left)/r.width-0.5)*10, y: ((e.clientY-r.top)/r.height-0.5)*8 });
  };
  return (
    <div className="lde-hero" ref={wrapRef} onMouseMove={onMove} onMouseLeave={() => setTilt({x:0,y:0})}>
      <div className="lde-hero-img-wrap">
        <img src={IMG.lde} alt="Logos AI LDE Engine" className="lde-hero-img"
          style={{ transform:`perspective(800px) rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg) scale(1.02)` }} />
        <div className="lde-hero-glow" />
        {hotspots.map(h => (
          <div key={h.id} className={`hpin ${active===h.id?"on":""}`}
            style={{ left:`${h.x}%`, top:`${h.y}%` }}
            onMouseEnter={() => setActive(h.id)} onMouseLeave={() => setActive(null)}>
            <div className="hpin-ring" /><div className="hpin-dot" />
            {active === h.id && (
              <div className={`hpin-tip ${h.pos}`}>
                <div className="hpin-tip-badge">{h.badge}</div>
                <h5>{h.label}</h5><p>{h.desc}</p>
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

/* ── LDEViz ──────────────────────────────────────────────────────── */
export function LDEViz() {
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
export function TweaksPanel({ visible, tweaks, setTweaks }: { visible: boolean; tweaks: Tweaks; setTweaks: (t: (p: Tweaks) => Tweaks) => void }) {
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
