import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FixedDeposit.css";

function FixedDeposit() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("12");
  const [payout, setPayout] = useState("maturity");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [created, setCreated] = useState(false);
  const [createdFd, setCreatedFd] = useState(null);
  const [creating, setCreating] = useState(false);
  const [sourceAccount, setSourceAccount] = useState(null);

  const [fdHistory, setFdHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

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

  // ================= LOAD ACCOUNT + FD HISTORY =================

  useEffect(() => {
    loadFdHistory();
    loadSourceAccount();
  }, []);

  // ================= LOAD SOURCE ACCOUNT =================

  const loadSourceAccount = async () => {
    try {
      const storedCustomer =
        JSON.parse(localStorage.getItem("customer"));

      if (!storedCustomer) {
        return;
      }

      const customerId =
        storedCustomer.customerId ||
        storedCustomer.id;

      if (!customerId) {
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/accounts"
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load bank account."
        );
      }

      const accounts = await response.json();

      const account = accounts.find(
        (item) =>
          item.customer &&
          item.customer.id === customerId
      );

      setSourceAccount(account || null);

    } catch (error) {
      console.error(
        "Source account loading error:",
        error
      );

      setSourceAccount(null);
    }
  };

  // ================= LOAD FD HISTORY =================

  const loadFdHistory = async () => {
    try {
      setHistoryLoading(true);

      const storedCustomer =
        JSON.parse(localStorage.getItem("customer"));

      if (!storedCustomer) {
        return;
      }

      const customerId =
        storedCustomer.customerId ||
        storedCustomer.id;

      if (!customerId) {
        return;
      }

      const accountsResponse = await fetch(
        "http://localhost:8080/api/accounts"
      );

      if (!accountsResponse.ok) {
        throw new Error(
          "Unable to load accounts."
        );
      }

      const accounts =
        await accountsResponse.json();

      const customerAccountIds =
        accounts
          .filter(
            (item) =>
              item.customer?.id === customerId
          )
          .map((item) => item.id);

      const fdResponse = await fetch(
        "http://localhost:8080/api/fixed-deposits"
      );

      if (!fdResponse.ok) {
        throw new Error(
          "Unable to load Fixed Deposits."
        );
      }

      const allFds =
        await fdResponse.json();

      const customerFds =
        allFds.filter(
          (fd) =>
            fd.account &&
            customerAccountIds.includes(
              fd.account.id
            )
        );

      setFdHistory(customerFds);

    } catch (error) {

      console.error(
        "FD history error:",
        error
      );

      setFdHistory([]);

    } finally {

      setHistoryLoading(false);

    }
  };

  // ================= REVIEW =================

  const handleSubmit = (event) => {

    event.preventDefault();

    if (principal < 1000) {

      alert(
        "Minimum fixed deposit amount is ₹1,000."
      );

      return;
    }

    setShowConfirmation(true);
  };

  // ================= CONFIRM FD =================

  const handleConfirm = async () => {

    try {

      setCreating(true);

      const storedCustomer =
        JSON.parse(
          localStorage.getItem("customer")
        );

      if (!storedCustomer) {

        alert("Please login again.");

        return;
      }

      const customerId =
        storedCustomer.customerId ||
        storedCustomer.id;

      if (!customerId) {

        alert(
          "Customer information not found."
        );

        return;
      }

      // Get all accounts

      const accountsResponse =
        await fetch(
          "http://localhost:8080/api/accounts"
        );

      if (!accountsResponse.ok) {

        throw new Error(
          "Unable to load bank account."
        );
      }

      const accounts =
        await accountsResponse.json();

      // Find logged-in customer's account

      const account =
        accounts.find(
          (item) =>
            item.customer &&
            item.customer.id === customerId
        );

      setSourceAccount(account);

      if (!account) {

        throw new Error(
          "Bank account not found."
        );
      }

      if (!account.accountNumber) {

        throw new Error(
          "Account number not found."
        );
      }

      // Send FD request to Spring Boot

      const requestBody = {

        principalAmount: principal,

        interestRate: rate,

        tenureMonths:
          Number(tenure),

        payoutOption: payout,

        account: {
          accountNumber:
            account.accountNumber,
        },
      };

      const response =
        await fetch(
          "http://localhost:8080/api/fixed-deposits",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                requestBody
              ),
          }
        );

      const responseText =
        await response.text();

      if (!response.ok) {

        let errorMessage =
          "Fixed Deposit creation failed.";

        try {

          const parsed =
            JSON.parse(responseText);

          if (
            typeof parsed ===
            "string"
          ) {

            errorMessage = parsed;

          } else if (
            parsed?.message
          ) {

            errorMessage =
              parsed.message;
          }

        } catch {

          if (
            responseText.trim() !== ""
          ) {

            errorMessage =
              responseText;
          }
        }

        throw new Error(
          errorMessage
        );
      }

      const data =
        JSON.parse(responseText);

      console.log(
        "Fixed Deposit created:",
        data
      );

      setCreatedFd(data);

      setShowConfirmation(false);

      setCreated(true);

      // Refresh FD history

      await loadFdHistory();

      // Refresh source account balance/details

      await loadSourceAccount();

    } catch (error) {

      console.error(
        "Fixed Deposit error:",
        error
      );

      alert(
        error.message ||
        "Failed to create Fixed Deposit."
      );

    } finally {

      setCreating(false);

    }
  };

  // ================= RESET =================

  const handleReset = () => {

    setCreated(false);

    setCreatedFd(null);

    setAmount("");

    setTenure("12");

    setPayout("maturity");

    loadSourceAccount();
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
          onClick={() =>
            navigate("/dashboard")
          }
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

              <p>
                FIXED DEPOSIT
              </p>

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


                <form
                  onSubmit={handleSubmit}
                >


                  {/* SOURCE ACCOUNT */}

                  <div className="fd-group">

                    <label>
                      Source Account
                    </label>

                    <div className="fd-account">

                      <div>

                        <strong>
                          {sourceAccount?.accountType
                            ? `${sourceAccount.accountType} Account`
                            : "Account type unavailable"}
                        </strong>

                        <span>
                          {sourceAccount?.accountNumber
                            ? `•••• ${sourceAccount.accountNumber.slice(-4)}`
                            : "Account number unavailable"}
                        </span>

                      </div>

                      <span className="fd-active">
                        {sourceAccount?.status ||
                          "Account status unavailable"}
                      </span>

                    </div>

                  </div>


                  {/* AMOUNT */}

                  <div className="fd-group">

                    <label htmlFor="fdAmount">
                      Deposit Amount
                    </label>

                    <div className="fd-amount">

                      <span>
                        ₹
                      </span>

                      <input
                        id="fdAmount"
                        type="number"
                        min="1000"
                        value={amount}
                        onChange={(event) =>
                          setAmount(
                            event.target.value
                          )
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
                          checked={
                            tenure === "6"
                          }
                          onChange={(event) =>
                            setTenure(
                              event.target.value
                            )
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
                          checked={
                            tenure === "12"
                          }
                          onChange={(event) =>
                            setTenure(
                              event.target.value
                            )
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
                          checked={
                            tenure === "24"
                          }
                          onChange={(event) =>
                            setTenure(
                              event.target.value
                            )
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
                          checked={
                            tenure === "36"
                          }
                          onChange={(event) =>
                            setTenure(
                              event.target.value
                            )
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
                        setPayout(
                          event.target.value
                        )
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
                        ? `₹ ${interest.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}`
                        : "₹ —"}

                    </strong>

                  </div>

                </div>


                <div className="fd-note">

                  <span>
                    ℹ
                  </span>

                  <div>

                    <strong>
                      About Fixed Deposit
                    </strong>

                    <p>
                      Your deposit remains locked for the selected tenure and earns interest according to the selected rate.
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
              Your fixed deposit request has been successfully submitted.
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

                <span>
                  FD Reference
                </span>

                <strong>
                  {createdFd?.fdNumber ||
                    "Reference unavailable"}
                </strong>

              </div>


              <div className="summary-line">

                <span>
                  Deposit Amount
                </span>

                <strong>
                  {createdFd?.principalAmount !== null &&
                  createdFd?.principalAmount !== undefined
                    ? `₹ ${Number(
                        createdFd.principalAmount
                      ).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}`
                    : "₹ —"}
                </strong>

              </div>


              <div className="summary-line">

                <span>
                  Tenure
                </span>

                <strong>
                  {createdFd?.tenureMonths !== null &&
                  createdFd?.tenureMonths !== undefined
                    ? `${createdFd.tenureMonths} Months`
                    : "Tenure unavailable"}
                </strong>

              </div>


              <div className="summary-line">

                <span>
                  Interest Rate
                </span>

                <strong>
                  {createdFd?.interestRate !== null &&
                  createdFd?.interestRate !== undefined
                    ? `${createdFd.interestRate}%`
                    : "Rate unavailable"}
                </strong>

              </div>


              <div className="summary-line">

                <span>
                  Maturity Amount
                </span>

                <strong>
                  {createdFd?.maturityAmount !== null &&
                  createdFd?.maturityAmount !== undefined
                    ? `₹ ${Number(
                        createdFd.maturityAmount
                      ).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}`
                    : "₹ —"}
                </strong>

              </div>

            </div>


            <button
              onClick={() =>
                navigate("/dashboard")
              }
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


        {/* ================= FD HISTORY ================= */}

        <section
          style={{
            maxWidth: "1100px",
            margin: "35px auto 50px",
            padding: "25px",
            background: "#ffffff",
            border: "1px solid #e3e8ef",
            borderRadius: "14px",
          }}
        >

          <div style={{ marginBottom: "20px" }}>

            <p
              style={{
                marginBottom: "6px",
                color: "#2563eb",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "1.2px",
              }}
            >
              MY FIXED DEPOSITS
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "22px",
              }}
            >
              Fixed Deposit History
            </h2>

            <p
              style={{
                marginTop: "7px",
                color: "#667085",
                fontSize: "13px",
              }}
            >
              View your active and previous fixed deposits.
            </p>

          </div>


          {historyLoading ? (

            <p
              style={{
                color: "#667085",
                fontSize: "13px",
              }}
            >
              Loading Fixed Deposit history...
            </p>

          ) : fdHistory.length === 0 ? (

            <div
              style={{
                padding: "25px",
                background: "#f7f9fc",
                borderRadius: "9px",
                textAlign: "center",
                color: "#667085",
                fontSize: "13px",
              }}
            >
              No Fixed Deposits found.
            </div>

          ) : (

            <div
              style={{
                overflowX: "auto",
              }}
            >

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                }}
              >

                <thead>

                  <tr
                    style={{
                      borderBottom:
                        "1px solid #e3e8ef",
                    }}
                  >

                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                      }}
                    >
                      FD Reference
                    </th>

                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                      }}
                    >
                      Principal
                    </th>

                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                      }}
                    >
                      Rate
                    </th>

                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                      }}
                    >
                      Tenure
                    </th>

                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                      }}
                    >
                      Maturity Amount
                    </th>

                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                      }}
                    >
                      Maturity Date
                    </th>

                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                      }}
                    >
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {fdHistory.map(
                    (fd) => (

                      <tr
                        key={fd.id}
                        style={{
                          borderBottom:
                            "1px solid #f0f2f5",
                        }}
                      >

                        <td
                          style={{
                            padding: "13px",
                            fontWeight: "600",
                          }}
                        >
                          {fd.fdNumber ||
                            "Reference unavailable"}
                        </td>


                        <td
                          style={{
                            padding: "13px",
                          }}
                        >
                          {fd.principalAmount !== null &&
                          fd.principalAmount !== undefined
                            ? `₹ ${Number(
                                fd.principalAmount
                              ).toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 2,
                                }
                              )}`
                            : "₹ —"}
                        </td>


                        <td
                          style={{
                            padding: "13px",
                          }}
                        >
                          {fd.interestRate !== null &&
                          fd.interestRate !== undefined
                            ? `${fd.interestRate}%`
                            : "Rate unavailable"}
                        </td>


                        <td
                          style={{
                            padding: "13px",
                          }}
                        >
                          {fd.tenureMonths !== null &&
                          fd.tenureMonths !== undefined
                            ? `${fd.tenureMonths} Months`
                            : "Tenure unavailable"}
                        </td>


                        <td
                          style={{
                            padding: "13px",
                            fontWeight: "600",
                          }}
                        >
                          {fd.maturityAmount !== null &&
                          fd.maturityAmount !== undefined
                            ? `₹ ${Number(
                                fd.maturityAmount
                              ).toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 2,
                                }
                              )}`
                            : "₹ —"}
                        </td>


                        <td
                          style={{
                            padding: "13px",
                          }}
                        >
                          {fd.maturityDate ||
                            "Maturity date unavailable"}
                        </td>


                        <td
                          style={{
                            padding: "13px",
                          }}
                        >

                          <span
                            style={{
                              display:
                                "inline-block",
                              padding:
                                "5px 9px",
                              borderRadius:
                                "20px",
                              background:
                                fd.status ===
                                "ACTIVE"
                                  ? "#eaf8f0"
                                  : "#f2f4f7",
                              color:
                                fd.status ===
                                "ACTIVE"
                                  ? "#16834b"
                                  : "#667085",
                              fontSize:
                                "11px",
                              fontWeight:
                                "700",
                            }}
                          >
                            {fd.status ||
                              "Status unavailable"}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

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
            background:
              "rgba(15, 23, 42, 0.45)",
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
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.18)",
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

                <span>
                  Deposit Amount
                </span>

                <strong>
                  ₹ {formattedPrincipal}
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
                  Interest Rate
                </span>

                <strong>
                  {rate}%
                </strong>

              </div>


              <div className="summary-line">

                <span>
                  Payout
                </span>

                <strong>

                  {payout === "maturity"
                    ? "At Maturity"
                    : payout === "monthly"
                    ? "Monthly"
                    : "Quarterly"}

                </strong>

              </div>


              <div className="summary-line">

                <span>
                  Maturity Amount
                </span>

                <strong>
                  ₹ {formattedMaturity}
                </strong>

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
                disabled={creating}
                style={{
                  flex: 1,
                  height: "44px",
                  border:
                    "1px solid #d9dee7",
                  borderRadius: "7px",
                  background: "#ffffff",
                  color: "#475467",
                  cursor: creating
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                Cancel
              </button>


              <button
                onClick={handleConfirm}
                disabled={creating}
                style={{
                  flex: 1,
                  height: "44px",
                  border: "none",
                  borderRadius: "7px",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontWeight: "600",
                  cursor: creating
                    ? "not-allowed"
                    : "pointer",
                }}
              >

                {creating
                  ? "Creating..."
                  : "Confirm Deposit"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default FixedDeposit;