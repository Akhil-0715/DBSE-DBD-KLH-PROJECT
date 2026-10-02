import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BillPayment() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [account, setAccount] = useState(null);

  const [billType, setBillType] = useState("Electricity");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [payment, setPayment] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= LOAD CUSTOMER =================

  useEffect(() => {
    const storedCustomer =
      localStorage.getItem("customer");

    if (!storedCustomer) {
      navigate("/login");
      return;
    }

    const customerData =
      JSON.parse(storedCustomer);

    setCustomer(customerData);

    loadAccount(
      customerData.customerId ||
      customerData.id
    );
  }, [navigate]);

  // ================= LOAD ACCOUNT =================

  const loadAccount = async (customerId) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/accounts"
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load account."
        );
      }

      const accounts =
        await response.json();

      const customerAccount =
        accounts.find(
          (item) =>
            item.customer?.id === customerId
        );

      if (!customerAccount) {
        throw new Error(
          "Bank account not found."
        );
      }

      setAccount(customerAccount);

    } catch (error) {
      console.error(
        "Account loading error:",
        error
      );

      setError(
        "Unable to load your account details."
      );
    }
  };

  // ================= REVIEW PAYMENT =================

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!account) {
      setError(
        "Your account details could not be loaded."
      );
      return;
    }

    if (!consumerNumber.trim()) {
      setError(
        "Please enter the consumer number."
      );
      return;
    }

    if (
      !amount ||
      Number(amount) <= 0
    ) {
      setError(
        "Please enter a valid amount."
      );
      return;
    }

    if (
      account.balance === null ||
      account.balance === undefined
    ) {
      setError(
        "Your account balance is unavailable."
      );
      return;
    }

    if (
      Number(amount) >
      Number(account.balance)
    ) {
      setError(
        "Insufficient balance."
      );
      return;
    }

    setShowConfirmation(true);
  };

  // ================= CONFIRM PAYMENT =================

  const handleConfirmPayment = async () => {
    if (!account) {
      setError(
        "Your account details could not be loaded."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params =
        new URLSearchParams();

      params.append(
        "accountNumber",
        account.accountNumber
      );

      params.append(
        "billType",
        billType
      );

      params.append(
        "consumerNumber",
        consumerNumber
      );

      params.append(
        "amount",
        amount
      );

      const response =
        await fetch(
          `http://localhost:8080/api/bill-payments/pay?${params.toString()}`,
          {
            method: "POST",
          }
        );

      const responseText =
        await response.text();

      if (!response.ok) {
        let errorMessage =
          "Bill payment failed.";

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

      setPayment(data);

      setShowConfirmation(false);

      setPaymentSuccess(true);

      await loadAccount(
        customer.customerId ||
        customer.id
      );

    } catch (error) {
      console.error(
        "Bill payment error:",
        error
      );

      setError(
        error.message ||
        "Unable to process bill payment."
      );

      setShowConfirmation(false);

    } finally {
      setLoading(false);
    }
  };

  // ================= NEW PAYMENT =================

  const handleNewPayment = () => {
    setPaymentSuccess(false);
    setPayment(null);
    setConsumerNumber("");
    setAmount("");
    setBillType("Electricity");
    setError("");
  };

  if (!customer) {
    return null;
  }

  const formattedAmount =
    amount
      ? Number(amount).toLocaleString(
          "en-IN",
          {
            maximumFractionDigits: 2,
          }
        )
      : "—";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f9fc",
      }}
    >

      {/* ================= HEADER ================= */}

      <header
        style={{
          height: "72px",
          background: "#ffffff",
          borderBottom:
            "1px solid #e3e8ef",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
        }}
      >

        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#172033",
          }}
        >
          🏦 OnlineBank
        </div>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          style={{
            border: "none",
            background: "transparent",
            color: "#2563eb",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ← Dashboard
        </button>

      </header>

      {/* ================= MAIN ================= */}

      <main
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          padding: "45px 25px",
        }}
      >

        {!paymentSuccess ? (

          <>

            {/* HEADING */}

            <div
              style={{
                marginBottom: "30px",
              }}
            >

              <p
                style={{
                  marginBottom: "7px",
                  color: "#2563eb",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "1.2px",
                }}
              >
                BILL PAYMENTS
              </p>

              <h1
                style={{
                  margin: 0,
                  fontSize: "30px",
                  color: "#172033",
                }}
              >
                Pay Your Bills
              </h1>

              <p
                style={{
                  marginTop: "8px",
                  color: "#667085",
                  fontSize: "14px",
                }}
              >
                Pay your utility and service bills securely.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "12px 16px",
                  background: "#fff1f1",
                  border:
                    "1px solid #f3b5b5",
                  borderRadius: "8px",
                  color: "#c62828",
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 320px",
                gap: "25px",
              }}
            >

              {/* ================= FORM ================= */}

              <section
                style={{
                  background: "#ffffff",
                  border:
                    "1px solid #e3e8ef",
                  borderRadius: "14px",
                  padding: "30px",
                }}
              >

                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: "7px",
                    fontSize: "20px",
                  }}
                >
                  Payment Details
                </h2>

                <p
                  style={{
                    color: "#667085",
                    fontSize: "13px",
                    marginBottom: "25px",
                  }}
                >
                  Enter your bill details below.
                </p>

                {/* ACCOUNT */}

                <div
                  style={{
                    marginBottom: "22px",
                  }}
                >

                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    From Account
                  </label>

                  <div
                    style={{
                      padding: "15px",
                      background: "#f7f9fc",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >

                    <div>

                      <strong>
                        {account?.accountType
                          ? `${account.accountType} Account`
                          : "Account type unavailable"}
                      </strong>

                      <div
                        style={{
                          marginTop: "4px",
                          color: "#667085",
                          fontSize: "12px",
                        }}
                      >
                        {account?.accountNumber
                          ? `•••• ${account.accountNumber.slice(-4)}`
                          : "Account number unavailable"}
                      </div>

                    </div>

                    <div
                      style={{
                        textAlign: "right",
                      }}
                    >

                      <small
                        style={{
                          display: "block",
                          color: "#667085",
                        }}
                      >
                        Available
                      </small>

                      <strong>
                        {account?.balance !== null &&
                        account?.balance !== undefined
                          ? `₹${Number(
                              account.balance
                            ).toLocaleString("en-IN")}`
                          : "₹ —"}
                      </strong>

                    </div>

                  </div>

                </div>

                {/* BILL TYPE */}

                <div
                  style={{
                    marginBottom: "20px",
                  }}
                >

                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Bill Type
                  </label>

                  <select
                    value={billType}
                    onChange={(event) =>
                      setBillType(
                        event.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      height: "45px",
                      padding: "0 12px",
                      border:
                        "1px solid #d9dee7",
                      borderRadius: "7px",
                      background: "#ffffff",
                      fontSize: "13px",
                    }}
                  >

                    <option>
                      Electricity
                    </option>

                    <option>
                      Water
                    </option>

                    <option>
                      Internet
                    </option>

                    <option>
                      Mobile Recharge
                    </option>

                  </select>

                </div>

                {/* CONSUMER NUMBER */}

                <div
                  style={{
                    marginBottom: "20px",
                  }}
                >

                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Consumer / Account Number
                  </label>

                  <input
                    type="text"
                    value={consumerNumber}
                    onChange={(event) =>
                      setConsumerNumber(
                        event.target.value
                      )
                    }
                    placeholder="Enter consumer number"
                    required
                    style={{
                      width: "100%",
                      height: "45px",
                      padding: "0 12px",
                      boxSizing: "border-box",
                      border:
                        "1px solid #d9dee7",
                      borderRadius: "7px",
                      fontSize: "13px",
                    }}
                  />

                </div>

                {/* AMOUNT */}

                <div
                  style={{
                    marginBottom: "25px",
                  }}
                >

                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Amount
                  </label>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border:
                        "1px solid #d9dee7",
                      borderRadius: "7px",
                      height: "45px",
                      overflow: "hidden",
                    }}
                  >

                    <span
                      style={{
                        padding: "0 13px",
                        color: "#667085",
                      }}
                    >
                      ₹
                    </span>

                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(event) =>
                        setAmount(
                          event.target.value
                        )
                      }
                      placeholder="0.00"
                      required
                      style={{
                        flex: 1,
                        height: "100%",
                        border: "none",
                        outline: "none",
                        fontSize: "13px",
                      }}
                    />

                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  style={{
                    width: "100%",
                    height: "46px",
                    border: "none",
                    borderRadius: "7px",
                    background: "#2563eb",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Review Payment →
                </button>

              </section>

              {/* ================= INFO ================= */}

              <aside>

                <div
                  style={{
                    background: "#ffffff",
                    border:
                      "1px solid #e3e8ef",
                    borderRadius: "14px",
                    padding: "25px",
                  }}
                >

                  <p
                    style={{
                      color: "#2563eb",
                      fontSize: "11px",
                      fontWeight: "700",
                      letterSpacing: "1px",
                    }}
                  >
                    PAYMENT SUMMARY
                  </p>

                  <h2
                    style={{
                      fontSize: "26px",
                      margin:
                        "10px 0 5px",
                    }}
                  >
                    ₹ {formattedAmount}
                  </h2>

                  <span
                    style={{
                      color: "#667085",
                      fontSize: "12px",
                    }}
                  >
                    Bill payment amount
                  </span>

                  <div
                    style={{
                      marginTop: "25px",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        padding:
                          "12px 0",
                        borderBottom:
                          "1px solid #f0f2f5",
                        fontSize: "13px",
                      }}
                    >

                      <span>
                        Bill Type
                      </span>

                      <strong>
                        {billType}
                      </strong>

                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        padding:
                          "12px 0",
                        fontSize: "13px",
                      }}
                    >

                      <span>
                        Account
                      </span>

                      <strong>
                        {account?.accountNumber
                          ? `•••• ${account.accountNumber.slice(-4)}`
                          : "Account unavailable"}
                      </strong>

                    </div>

                  </div>

                </div>

                <div
                  style={{
                    marginTop: "15px",
                    padding: "20px",
                    background: "#ffffff",
                    border:
                      "1px solid #e3e8ef",
                    borderRadius: "14px",
                    fontSize: "12px",
                    color: "#667085",
                  }}
                >
                  🔒 Your payment is processed securely through OnlineBank.
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
              border:
                "1px solid #e3e8ef",
              borderRadius: "14px",
              textAlign: "center",
            }}
          >

            <div
              style={{
                width: "65px",
                height: "65px",
                margin:
                  "0 auto 20px",
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
              BILL PAYMENT
            </p>

            <h1
              style={{
                marginBottom: "10px",
                fontSize: "28px",
              }}
            >
              Payment Successful
            </h1>

            <p
              style={{
                marginBottom: "30px",
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Your bill payment has been successfully processed.
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
                  Payment Reference
                </span>

                <strong>
                  {payment?.paymentReference
                    ? payment.paymentReference
                    : "Reference unavailable"}
                </strong>

              </div>

              <div className="summary-line">

                <span>
                  Bill Type
                </span>

                <strong>
                  {payment?.billType
                    ? payment.billType
                    : billType || "Bill type unavailable"}
                </strong>

              </div>

              <div className="summary-line">

                <span>
                  Consumer Number
                </span>

                <strong>
                  {payment?.consumerNumber
                    ? payment.consumerNumber
                    : consumerNumber || "Consumer number unavailable"}
                </strong>

              </div>

              <div className="summary-line">

                <span>
                  Amount
                </span>

                <strong>
                  {payment?.amount !== null &&
                  payment?.amount !== undefined
                    ? `₹${Number(
                        payment.amount
                      ).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}`
                    : amount
                    ? `₹${Number(
                        amount
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
                  Status
                </span>

                <strong
                  style={{
                    color: "#16834b",
                  }}
                >
                  {payment?.status ||
                    "Status unavailable"}
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
              onClick={handleNewPayment}
              style={{
                width: "100%",
                height: "42px",
                border:
                  "1px solid #d9dee7",
                borderRadius: "7px",
                background: "#ffffff",
                color: "#475467",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Make Another Payment
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
              CONFIRM PAYMENT
            </p>

            <h2
              style={{
                marginBottom: "8px",
                fontSize: "22px",
              }}
            >
              Review your bill payment
            </h2>

            <p
              style={{
                marginBottom: "22px",
                color: "#667085",
                fontSize: "12px",
              }}
            >
              Please verify the details before confirming.
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
                  Bill Type
                </span>

                <strong>
                  {billType}
                </strong>

              </div>

              <div className="summary-line">

                <span>
                  Consumer Number
                </span>

                <strong>
                  {consumerNumber}
                </strong>

              </div>

              <div className="summary-line">

                <span>
                  Amount
                </span>

                <strong>
                  ₹ {formattedAmount}
                </strong>

              </div>

              <div className="summary-line">

                <span>
                  From Account
                </span>

                <strong>
                  {account?.accountNumber
                    ? `•••• ${account.accountNumber.slice(-4)}`
                    : "Account unavailable"}
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
                disabled={loading}
                style={{
                  flex: 1,
                  height: "44px",
                  border:
                    "1px solid #d9dee7",
                  borderRadius: "7px",
                  background: "#ffffff",
                  color: "#475467",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={
                  handleConfirmPayment
                }
                disabled={loading}
                style={{
                  flex: 1,
                  height: "44px",
                  border: "none",
                  borderRadius: "7px",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontWeight: "600",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {loading
                  ? "Processing..."
                  : "Confirm Payment"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default BillPayment;