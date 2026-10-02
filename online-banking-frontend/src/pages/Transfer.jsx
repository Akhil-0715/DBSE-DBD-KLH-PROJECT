import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Transfer.css";

function Transfer() {
  const navigate = useNavigate();

  const [showBalance, setShowBalance] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  const [customer, setCustomer] = useState(null);
  const [account, setAccount] = useState(null);
  const [transaction, setTransaction] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    accountNumber: "",
    confirmAccountNumber: "",
    ifsc: "",
    amount: "",
    transferType: "IMPS",
    purpose: "",
  });

  // ================= LOAD CUSTOMER =================

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");

    if (!storedCustomer) {
      navigate("/login");
      return;
    }

    const customerData = JSON.parse(storedCustomer);

    setCustomer(customerData);

    loadAccount(customerData.customerId);
  }, [navigate]);

  // ================= LOAD ACCOUNT =================

  const loadAccount = async (customerId) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/accounts"
      );

      if (!response.ok) {
        throw new Error("Unable to load account");
      }

      const accounts = await response.json();

      const customerAccount = accounts.find(
        (item) => item.customer?.id === customerId
      );

      if (customerAccount) {
        setAccount(customerAccount);
      }
    } catch (error) {
      console.error("Account loading error:", error);
      setError("Unable to load your account details.");
    }
  };

  // ================= FORM CHANGE =================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setError("");
  };

  // ================= REVIEW TRANSFER =================

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!account) {
      setError("Your account details could not be loaded.");
      return;
    }

    if (
      formData.accountNumber !==
      formData.confirmAccountNumber
    ) {
      alert("Account numbers do not match.");
      return;
    }

    if (formData.accountNumber === account.accountNumber) {
      alert("You cannot transfer money to your own account.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (Number(formData.amount) > Number(account.balance)) {
      alert("Insufficient balance.");
      return;
    }

    setShowConfirmation(true);
  };

  // ================= CONFIRM TRANSFER =================

  const handleConfirmTransfer = async () => {
    if (!account) {
      setError("Your account details could not be loaded.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      params.append(
        "senderAccountNumber",
        account.accountNumber
      );

      params.append(
        "receiverAccountNumber",
        formData.accountNumber
      );

      params.append(
        "amount",
        formData.amount
      );

      params.append(
        "transferMode",
        formData.transferType
      );

      const response = await fetch(
        `http://localhost:8080/api/transactions/transfer?${params.toString()}`,
        {
          method: "POST",
        }
      );

      // ================= HANDLE RESPONSE =================

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = "Transfer failed. Please try again.";

        try {
          const parsedData = JSON.parse(responseText);

          if (typeof parsedData === "string") {
            errorMessage = parsedData;
          } else if (parsedData?.message) {
            errorMessage = parsedData.message;
          }
        } catch {
          if (responseText && responseText.trim() !== "") {
            errorMessage = responseText;
          }
        }

        setError(errorMessage);
        setShowConfirmation(false);

        return;
      }

      // ================= SUCCESS RESPONSE =================

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = null;
      }

      setTransaction(data);
      setShowConfirmation(false);
      setTransferSuccess(true);

      // Refresh account balance
      await loadAccount(customer.customerId);

    } catch (error) {
      console.error("Transfer error:", error);

      setError(
        "Unable to connect to the banking server."
      );

      setShowConfirmation(false);

    } finally {
      setLoading(false);
    }
  };

  // ================= NEW TRANSFER =================

  const handleNewTransfer = () => {
    setTransferSuccess(false);
    setTransaction(null);
    setError("");

    setFormData({
      accountNumber: "",
      confirmAccountNumber: "",
      ifsc: "",
      amount: "",
      transferType: "IMPS",
      purpose: "",
    });
  };

  // ================= FORMAT AMOUNT =================

  const formattedAmount = Number(
    formData.amount || 0
  ).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

  // ================= CUSTOMER LOADING =================

  if (!customer) {
    return null;
  }

  return (
    <div className="transfer-page">

      {/* ================= HEADER ================= */}

      <header className="transfer-header">

        <div className="transfer-logo">
          <span>🏦</span>
          OnlineBank
        </div>

        <button
          className="transfer-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </header>

      <main className="transfer-main">

        {!transferSuccess ? (

          <>
            {/* ================= PAGE HEADING ================= */}

            <div className="transfer-heading">

              <p>FUND TRANSFER</p>

              <h1>
                Send Money
              </h1>

              <span>
                Transfer funds securely to another bank account.
              </span>

            </div>

            {/* ================= ERROR ================= */}

            {error && (
              <div
                style={{
                  maxWidth: "900px",
                  margin: "0 auto 20px",
                  padding: "12px 16px",
                  background: "#fff1f1",
                  border: "1px solid #f3b5b5",
                  borderRadius: "8px",
                  color: "#c62828",
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            <div className="transfer-layout">

              {/* ================= TRANSFER FORM ================= */}

              <section className="transfer-card">

                <div className="form-section-title">

                  <h2>
                    Transfer Details
                  </h2>

                  <p>
                    Enter the beneficiary information below.
                  </p>

                </div>

                <form onSubmit={handleSubmit}>

                  {/* FROM ACCOUNT */}

                  <div className="form-group">

                    <label>
                      From Account
                    </label>

                    <div className="from-account">

                      <div>

                        <strong>
                          {account?.accountType
                            ? `${account.accountType} Account`
                            : "Account type unavailable"}
                        </strong>

                        <span>
                          •••• {account?.accountNumber?.slice(-4)}
                        </span>

                      </div>

                      <div className="from-balance">

                        <small>
                          Available
                        </small>

                        <strong>
                          {showBalance
                            ? account?.balance !== null &&
                              account?.balance !== undefined
                              ? `₹${Number(account.balance).toLocaleString("en-IN")}`
                              : "₹ —"
                            : "₹ ••••••"}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            setShowBalance(!showBalance)
                          }
                        >
                          {showBalance ? "Hide" : "Show"}
                        </button>

                      </div>

                    </div>

                  </div>

                  {/* ACCOUNT NUMBER */}

                  <div className="form-group">

                    <label htmlFor="accountNumber">
                      Beneficiary Account Number
                    </label>

                    <input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      inputMode="numeric"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="Enter account number"
                      required
                    />

                  </div>

                  {/* CONFIRM ACCOUNT */}

                  <div className="form-group">

                    <label htmlFor="confirmAccountNumber">
                      Confirm Account Number
                    </label>

                    <input
                      id="confirmAccountNumber"
                      name="confirmAccountNumber"
                      type="text"
                      inputMode="numeric"
                      value={formData.confirmAccountNumber}
                      onChange={handleChange}
                      placeholder="Re-enter account number"
                      required
                    />

                  </div>

                  {/* IFSC */}

                  <div className="form-group">

                    <label htmlFor="ifsc">
                      IFSC Code
                    </label>

                    <input
                      id="ifsc"
                      name="ifsc"
                      type="text"
                      value={formData.ifsc}
                      onChange={handleChange}
                      placeholder="Enter IFSC code"
                      required
                    />

                  </div>

                  {/* AMOUNT */}

                  <div className="form-group">

                    <label htmlFor="amount">
                      Amount
                    </label>

                    <div className="amount-input">

                      <span>₹</span>

                      <input
                        id="amount"
                        name="amount"
                        type="number"
                        min="1"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />

                    </div>

                  </div>

                  {/* TRANSFER METHOD */}

                  <div className="form-group">

                    <label>
                      Transfer Method
                    </label>

                    <div className="transfer-types">

                      <label
                        className={
                          formData.transferType === "IMPS"
                            ? "type-option selected"
                            : "type-option"
                        }
                      >

                        <input
                          type="radio"
                          name="transferType"
                          value="IMPS"
                          checked={
                            formData.transferType === "IMPS"
                          }
                          onChange={handleChange}
                        />

                        <div>

                          <strong>
                            IMPS
                          </strong>

                          <small>
                            Instant transfer
                          </small>

                        </div>

                      </label>

                      <label
                        className={
                          formData.transferType === "NEFT"
                            ? "type-option selected"
                            : "type-option"
                        }
                      >

                        <input
                          type="radio"
                          name="transferType"
                          value="NEFT"
                          checked={
                            formData.transferType === "NEFT"
                          }
                          onChange={handleChange}
                        />

                        <div>

                          <strong>
                            NEFT
                          </strong>

                          <small>
                            Bank transfer
                          </small>

                        </div>

                      </label>

                    </div>

                  </div>

                  {/* PURPOSE */}

                  <div className="form-group">

                    <label htmlFor="purpose">
                      Purpose
                    </label>

                    <select
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Select purpose
                      </option>

                      <option value="Personal">
                        Personal
                      </option>

                      <option value="Education">
                        Education
                      </option>

                      <option value="Rent">
                        Rent
                      </option>

                      <option value="Bills">
                        Bills
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* REVIEW BUTTON */}

                  <button
                    type="submit"
                    className="continue-button"
                  >
                    Review Transfer →
                  </button>

                </form>

              </section>

              {/* ================= SIDE INFORMATION ================= */}

              <aside className="transfer-info">

                <div className="info-box">

                  <div className="info-icon">
                    ✓
                  </div>

                  <h3>
                    Before you transfer
                  </h3>

                  <ul>

                    <li>
                      Check the beneficiary account number carefully.
                    </li>

                    <li>
                      Make sure the IFSC code is correct.
                    </li>

                    <li>
                      Verify the amount before confirming.
                    </li>

                    <li>
                      Never share your banking password or OTP.
                    </li>

                  </ul>

                </div>

                <div className="security-note">

                  <span>
                    🔒
                  </span>

                  <div>

                    <strong>
                      Secure banking
                    </strong>

                    <p>
                      Your transaction details are protected
                      by the banking system.
                    </p>

                  </div>

                </div>

              </aside>

            </div>

          </>

        ) : (

          /* ================= SUCCESS SCREEN ================= */

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
              FUND TRANSFER
            </p>

            <h1
              style={{
                marginBottom: "10px",
                fontSize: "28px",
              }}
            >
              Transfer Successful
            </h1>

            <p
              style={{
                marginBottom: "30px",
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Your fund transfer has been successfully submitted.
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
                  Transfer Reference
                </span>

                <strong>
                  {transaction?.transactionReference || "N/A"}
                </strong>
              </div>

              <div className="summary-line">
                <span>
                  Beneficiary Account
                </span>

                <strong>
                  •••• {formData.accountNumber.slice(-4)}
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
                  Transfer Method
                </span>

                <strong>
                  {formData.transferType}
                </strong>
              </div>

              <div className="summary-line">
                <span>
                  Purpose
                </span>

                <strong>
                  {formData.purpose}
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
                  {transaction?.status || "Status unavailable"}
                </strong>
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
              onClick={handleNewTransfer}
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
              Make Another Transfer
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
              CONFIRM TRANSFER
            </p>

            <h2
              style={{
                marginBottom: "8px",
                fontSize: "22px",
              }}
            >
              Review your transfer
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
                  Beneficiary Account
                </span>

                <strong>
                  •••• {formData.accountNumber.slice(-4)}
                </strong>

              </div>

              <div className="summary-line">

                <span>
                  IFSC Code
                </span>

                <strong>
                  {formData.ifsc}
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
                  Transfer Method
                </span>

                <strong>
                  {formData.transferType}
                </strong>

              </div>

              <div className="summary-line">

                <span>
                  Purpose
                </span>

                <strong>
                  {formData.purpose}
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
                onClick={handleConfirmTransfer}
                disabled={loading}
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
                {loading
                  ? "Processing..."
                  : "Confirm Transfer"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Transfer;