import { IMG, MagBtn, Reveal, SI, ParticleBg } from "../components";

export function AequitasPage() {
  return (
    <main>
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
            { v:"0s",   label:"Hallucination Rate" },
            { v:"100%", label:"Traceable Logic" },
            { v:"<2s",  label:"Generation Time" },
            { v:"∞",    label:"Scalability" },
          ].map(({ v, label }) => (
            <div key={label} className="aq-kpi-cell">
              <strong>{v}</strong><span>{label}</span>
            </div>
          ))}
        </div>
        <article className="dpan warm">
          <h3>The SPA as a Living Data Object</h3>
          <p>In Aequitas, every Sales and Purchase Agreement is tracked in real-time, cross-referenced with compliance databases, and optimized with the latest precedents — without human error.</p>
        </article>
      </Reveal>

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
