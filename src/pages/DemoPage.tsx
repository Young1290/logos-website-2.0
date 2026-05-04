import { useState } from "react";
import { SI, Reveal, parseMoneyInput, calcLegalFee, calcTransferStampDuty, calcLoanStampDuty, calcMonthlyInstallment, formatMoney } from "../components";

export function DemoPage() {
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
