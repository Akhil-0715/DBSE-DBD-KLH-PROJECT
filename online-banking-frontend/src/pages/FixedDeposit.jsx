import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FixedDeposit.css";

function FixedDeposit() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("12");
  const [payout, setPayout] = useState("maturity");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [created, setCreated] = useState(false);

  const interestRates = {
    6: 6.25,
    12: 6.75,
    24: 7.0,
    36: 7.25,
  };

  const rate = interestRates[tenure];

  const principal = Number(amount) || 0;

  const interest =
    principal * (rate / 100) * (Number(tenure) / 12);

  const maturityAmount = principal + interest;

  const formattedMaturity =
    maturityAmount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const formattedPrincipal =
    principal.toLocaleString("en-IN");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (principal < 1000) {
      alert("Minimum fixed deposit amount is ₹1,000.");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setCreated(true);
  };

  const handleReset = () => {
    setCreated(false);
    setAmount("");
    setTenure("12");
    setPayout("maturity");
  };

  return (
    <div className="fd-page">

      {/* ================= HEADER ================= */}

      <header className="fd-header">

        <div className="fd-logo">
          <span>🏦</span>
          OnlineBank
        </div>

        <button
          className="fd-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </header>


      {/* ================= MAIN ================= */}

      <main className="fd-main">

        {!created ? (

          <>
            {/* HEADING */}

            <div className="fd-heading">

              <p>FIXED DEPOSIT</p>

              <h1>
                Open a Fixed Deposit
              </h1>

              <span>
                Grow your savings with a fixed-term deposit.
              </span>

            </div>


            <div className="fd-layout">


              {/* FORM */}

              <section className="fd-card">

                <div className="fd-card-title">

                  <h2>
                    Deposit Details
                  </h2>

                  <p>
                    Enter the amount and select your preferred tenure.
                  </p>

                </div>


                <form onSubmit={handleSubmit}>


                  {/* SOURCE ACCOUNT */}

                  <div className="fd-group">

                    <label>
                      Source Account
                    </label>

                    <div className="fd-account">

                      <div>

                        <strong>
                          Savings Account
                        </strong>

                        <span>
                          •••• 4582
                        </span>

                      </div>

                      <span className="fd-active">
                        Active
                      </span>

                    </div>

                  </div>


                  {/* AMOUNT */}

                  <div className="fd-group">

                    <label htmlFor="fdAmount">
                      Deposit Amount
                    </label>

                    <div className="fd-amount">

                      <span>₹</span>

                      <input
                        id="fdAmount"
                        type="number"
                        min="1000"
                        value={amount}
                        onChange={(event) =>
                          setAmount(event.target.value)
                        }
                        placeholder="Enter amount"
                        required
                      />

                    </div>

                    <small>
                      Minimum deposit: ₹1,000
                    </small>

                  </div>


                  {/* TENURE */}

                  <div className="fd-group">

                    <label>
                      Deposit Tenure
                    </label>

                    <div className="tenure-options">

                      <label
                        className={
                          tenure === "6"
                            ? "tenure-option selected"
                            : "tenure-option"
                        }
                      >

                        <input
                          type="radio"
                          name="tenure"
                          value="6"
                          checked={tenure === "6"}
                          onChange={(event) =>
                            setTenure(event.target.value)
                          }
                        />

                        <strong>
                          6 Months
                        </strong>

                        <small>
                          6.25%
                        </small>

                      </label>


                      <label
                        className={
                          tenure === "12"
                            ? "tenure-option selected"
                            : "tenure-option"
                        }
                      >

                        <input
                          type="radio"
                          name="tenure"
                          value="12"
                          checked={tenure === "12"}
                          onChange={(event) =>
                            setTenure(event.target.value)
                          }
                        />

                        <strong>
                          1 Year
                        </strong>

                        <small>
                          6.75%
                        </small>

                      </label>


                      <label
                        className={
                          tenure === "24"
                            ? "tenure-option selected"
                            : "tenure-option"
                        }
                      >

                        <input
                          type="radio"
                          name="tenure"
                          value="24"
                          checked={tenure === "24"}
                          onChange={(event) =>
                            setTenure(event.target.value)
                          }
                        />

                        <strong>
                          2 Years
                        </strong>

                        <small>
                          7.00%
                        </small>

                      </label>


                      <label
                        className={
                          tenure === "36"
                            ? "tenure-option selected"
                            : "tenure-option"
                        }
                      >

                        <input
                          type="radio"
                          name="tenure"
                          value="36"
                          checked={tenure === "36"}
                          onChange={(event) =>
                            setTenure(event.target.value)
                          }
                        />

                        <strong>
                          3 Years
                        </strong>

                        <small>
                          7.25%
                        </small>

                      </label>

                    </div>

                  </div>


                  {/* PAYOUT */}

                  <div className="fd-group">

                    <label>
                      Interest Payout
                    </label>

                    <select
                      value={payout}
                      onChange={(event) =>
                        setPayout(event.target.value)
                      }
                    >

                      <option value="maturity">
                        At Maturity
                      </option>

                      <option value="monthly">
                        Monthly
                      </option>

                      <option value="quarterly">
                        Quarterly
                      </option>

                    </select>

                  </div>


                  <button
                    type="submit"
                    className="fd-submit"
                  >
                    Review Fixed Deposit →
                  </button>

                </form>

              </section>


              {/* SUMMARY */}

              <aside className="fd-side">

                <div className="fd-summary">

                  <p>
                    DEPOSIT SUMMARY
                  </p>

                  <h2>
                    {principal > 0
                      ? `₹ ${formattedMaturity}`
                      : "₹ ••••••"}
                  </h2>

                  <span>
                    Estimated Maturity Amount
                  </span>


                  <div className="summary-line">

                    <span>
                      Deposit Amount
                    </span>

                    <strong>
                      {principal > 0
                        ? `₹ ${formattedPrincipal}`
                        : "₹ —"}
                    </strong>

                  </div>


                  <div className="summary-line">

                    <span>
                      Interest Rate
                    </span>

                    <strong>
                      {rate}%
                    </strong>

                  </div>


                  <div className="summary-line">

                    <span>
                      Tenure
                    </span>

                    <strong>
                      {tenure} Months
                    </strong>

                  </div>


                  <div className="summary-line">

                    <span>
                      Estimated Interest
                    </span>

                    <strong>
                      {principal > 0
                        ? `₹ ${interest.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}`
                        : "₹ —"}
                    </strong>

                  </div>

                </div>


                <div className="fd-note">

                  <span>ℹ</span>

                  <div>

                    <strong>
                      About Fixed Deposit
                    </strong>

                    <p>
                      Your deposit remains locked for the selected
                      tenure and earns interest according to the
                      selected rate.
                    </p>

                  </div>

                </div>

              </aside>

            </div>
          </>

        ) : (

          /* ================= SUCCESS ================= */

          <section
            style={{
              maxWidth: "650px",
              margin: "50px auto",
              padding: "45px 35px",
              background: "#ffffff",
              border: "1px solid #e3e8ef",
              borderRadius: "14px",
              textAlign: "center",
            }}
          >

            <div
              style={{
                width: "65px",
                height: "65px",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: "#eaf8f0",
                color: "#16834b",
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              ✓
            </div>


            <p
              style={{
                marginBottom: "8px",
                color: "#16834b",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "1.2px",
              }}
            >
              FIXED DEPOSIT
            </p>


            <h1
              style={{
                marginBottom: "10px",
                fontSize: "28px",
              }}
            >
              Fixed Deposit Created
            </h1>


            <p
              style={{
                marginBottom: "30px",
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Your fixed deposit request has been successfully
              submitted.
            </p>


            <div
              style={{
                marginBottom: "25px",
                padding: "20px",
                background: "#f7f9fc",
                borderRadius: "9px",
                textAlign: "left",
              }}
            >

              <div className="summary-line">
                <span>FD Reference</span>
                <strong>FD20260911001</strong>
              </div>

              <div className="summary-line">
                <span>Deposit Amount</span>
                <strong>₹ {formattedPrincipal}</strong>
              </div>

              <div className="summary-line">
                <span>Tenure</span>
                <strong>{tenure} Months</strong>
              </div>

              <div className="summary-line">
                <span>Interest Rate</span>
                <strong>{rate}%</strong>
              </div>

              <div className="summary-line">
                <span>Maturity Amount</span>
                <strong>₹ {formattedMaturity}</strong>
              </div>

            </div>


            <button
              onClick={() => navigate("/dashboard")}
              style={{
                width: "100%",
                height: "45px",
                marginBottom: "10px",
                border: "none",
                borderRadius: "7px",
                background: "#2563eb",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Back to Dashboard
            </button>


            <button
              onClick={handleReset}
              style={{
                width: "100%",
                height: "42px",
                border: "1px solid #d9dee7",
                borderRadius: "7px",
                background: "#ffffff",
                color: "#475467",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Create Another Deposit
            </button>

          </section>

        )}

      </main>


      {/* ================= CONFIRMATION MODAL ================= */}

      {showConfirmation && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(15, 23, 42, 0.45)",
            zIndex: 1000,
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "470px",
              padding: "30px",
              background: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
            }}
          >

            <p
              style={{
                marginBottom: "7px",
                color: "#2563eb",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "1px",
              }}
            >
              CONFIRM DEPOSIT
            </p>


            <h2
              style={{
                marginBottom: "8px",
                fontSize: "22px",
              }}
            >
              Review your Fixed Deposit
            </h2>


            <p
              style={{
                marginBottom: "22px",
                color: "#667085",
                fontSize: "12px",
              }}
            >
              Please check the details before confirming.
            </p>


            <div
              style={{
                padding: "15px",
                background: "#f7f9fc",
                borderRadius: "8px",
              }}
            >

              <div className="summary-line">
                <span>Deposit Amount</span>
                <strong>₹ {formattedPrincipal}</strong>
              </div>

              <div className="summary-line">
                <span>Tenure</span>
                <strong>{tenure} Months</strong>
              </div>

              <div className="summary-line">
                <span>Interest Rate</span>
                <strong>{rate}%</strong>
              </div>

              <div className="summary-line">
                <span>Payout</span>
                <strong>
                  {payout === "maturity"
                    ? "At Maturity"
                    : payout === "monthly"
                    ? "Monthly"
                    : "Quarterly"}
                </strong>
              </div>

              <div className="summary-line">
                <span>Maturity Amount</span>
                <strong>₹ {formattedMaturity}</strong>
              </div>

            </div>


            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "22px",
              }}
            >

              <button
                onClick={() =>
                  setShowConfirmation(false)
                }
                style={{
                  flex: 1,
                  height: "44px",
                  border: "1px solid #d9dee7",
                  borderRadius: "7px",
                  background: "#ffffff",
                  color: "#475467",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>


              <button
                onClick={handleConfirm}
                style={{
                  flex: 1,
                  height: "44px",
                  border: "none",
                  borderRadius: "7px",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Confirm Deposit
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default FixedDeposit;