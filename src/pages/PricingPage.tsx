import type { CSSProperties } from "react";
import { useState } from "react";
import type { BillMode } from "../components";
import { pricingTiers, MagBtn, Reveal, SI, ParticleBg } from "../components";

export function PricingPage() {
  const [hov, setHov] = useState("Professional");
  const [bill, setBill] = useState<BillMode>("monthly");
  const [planType, setPlanType] = useState<"individual" | "team">("individual");
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
              <button className={`bbtn ${planType==="individual"?"on":""}`} type="button" onClick={() => setPlanType("individual")}>Individual</button>
              <button className={`bbtn ${planType==="team"?"on":""}`} type="button" onClick={() => setPlanType("team")}>Team</button>
            </div>
          </SI>
          {planType === "team" && (
            <SI d={400}>
              <div className="btog" style={{ marginTop:"0.75rem" }}>
                <button className={`bbtn ${bill==="monthly"?"on":""}`} type="button" onClick={() => setBill("monthly")}>Monthly</button>
                <button className={`bbtn ${bill==="annual"?"on":""}`} type="button" onClick={() => setBill("annual")}>Annual</button>
                <span className="bnote">Save 20% annually</span>
              </div>
            </SI>
          )}
        </div>
      </section>

      <Reveal className="lstrip wrap">
        <span className="ldot">✦</span>
        <div className="lcopy"><strong>Special Launch Offer</strong><span>All law firms get their first month FREE.</span></div>
        <button className="lclaim" type="button">Claim Offer</button>
      </Reveal>

      {planType === "individual" ? (
        <Reveal className="pgrid wrap" style={{ justifyContent:"center" } as CSSProperties}>
          <article className="pc feat hov" style={{ maxWidth:"420px", margin:"0 auto" }}>
            <div className="ptier">Individual</div>
            <div className="ppr">
              <span className="pcur">RM</span>
              <span className="pnum">100</span>
              <span className="pper">/mo</span>
            </div>
            <p className="pdesc">Full access to all Aequitas tools for individual practitioners — with dedicated storage included.</p>
            <ul className="pfeats">
              {["500MB Dedicated Storage","Aequitas ChatAPI Access","SPA Generation","Compliance Checks","All Core Functions","Marketplace Display Not Included"]
                .map(p => <li key={p}><span className="fd">◆</span>{p}</li>)}
            </ul>
            <MagBtn cls="bp">Start Free Trial</MagBtn>
          </article>
        </Reveal>
      ) : (
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
                      <span className="pnum">{parseInt(price.replace("RM",""),10).toLocaleString()}</span>
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
      )}

      <Reveal className="wrap">
        <div className="lstrip" style={{ flexDirection:"column", gap:"0.75rem", textAlign:"center", padding:"2.25rem 2rem" } as CSSProperties}>
          <span className="ldot">◎</span>
          <div className="lcopy" style={{ flexDirection:"column", gap:"0.25rem" } as CSSProperties}>
            <strong>Beta Testing Now Open</strong>
            <span>We are currently accepting beta testers. If you are interested, please reach out to us directly.</span>
          </div>
          <button className="lclaim" type="button">Contact Us</button>
        </div>
      </Reveal>

      <Reveal className="faq wrap">
        <h2 className="fttl">FAQ</h2>
        <div className="fqgrid">
          {[
            { q:"What's included in the trial?",  a:"The 1-month trial provides full, uninhibited access to the tier you select — the complete High-Velocity Intelligence engine, including all query tools and data verification nodes." },
            { q:"How is our data secured?",         a:"Logos AI employs end-to-end encryption and a strict zero-retention policy on user queries. Your intellectual property and research strategies remain entirely your own." },
            { q:"Can we cancel before trial ends?", a:"Yes. Cancellation is immediate and executed directly from your administrative dashboard. No hidden fees or complex offboarding processes." },
          ].map(({ q, a }) => (
            <article key={q} className="fqc"><h3>{q}</h3><p>{a}</p></article>
          ))}
        </div>
      </Reveal>
    </main>
  );
}
