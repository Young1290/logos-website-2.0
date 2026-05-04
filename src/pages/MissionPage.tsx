import { IMG, founders, MagBtn, Reveal, SI, ParticleBg, InteractiveLDE, LDEViz } from "../components";
import type { Tweaks } from "../components";

export function MissionPage({ tweaks }: { tweaks: Tweaks }) {
  return (
    <main>
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
