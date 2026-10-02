import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";

function Account() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");

    if (!storedCustomer) {
      navigate("/login");
      return;
    }

    const loggedInCustomer = JSON.parse(storedCustomer);
    setCustomer(loggedInCustomer);

    const fetchAccount = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/accounts"
        );

        if (!response.ok) {
          throw new Error("Unable to fetch accounts");
        }

        const accounts = await response.json();

        const customerAccount = accounts.find(
          (item) =>
            item.customer &&
            item.customer.id === loggedInCustomer.customerId
        );

        if (!customerAccount) {
          setError("No bank account found for this customer.");
          return;
        }

        setAccount(customerAccount);
      } catch (err) {
        setError(
          "Unable to connect to the banking server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [navigate]);

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "XXXX XXXX XXXX";

    const lastFour = accountNumber.slice(-4);

    return `XXXX XXXX ${lastFour}`;
  };

  const maskMobileNumber = (mobileNumber) => {
    if (!mobileNumber) return "**********";

    return `******${mobileNumber.slice(-4)}`;
  };

  const maskEmail = (email) => {
    if (!email) return "********";

    const [name, domain] = email.split("@");

    if (!domain) return email;

    const firstCharacter = name.charAt(0);

    return `${firstCharacter}••••@${domain}`;
  };

  if (loading) {
    return (
      <div className="account-page">
        <header className="account-header">
          <div className="account-logo">
            <span>🏦</span>
            OnlineBank
          </div>
        </header>

        <main className="account-content">
          <div className="account-heading">
            <p>MY ACCOUNT</p>
            <h1>Account Details</h1>
            <span>Loading your account information...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error || !account || !customer) {
    return (
      <div className="account-page">
        <header className="account-header">
          <div className="account-logo">
            <span>🏦</span>
            OnlineBank
          </div>

          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </header>

        <main className="account-content">
          <div className="account-heading">
            <p>MY ACCOUNT</p>
            <h1>Account Details</h1>
            <span>
              {error || "Account information unavailable."}
            </span>
          </div>
        </main>
      </div>
    );
  }

  const accountType =
    account.accountType === "SAVINGS"
      ? "Savings Account"
      : account.accountType;

  const accountStatus =
    account.status || "Unavailable";

const kycStatus =
    customer.kycStatus || "Unavailable";

  const isVerified =
    kycStatus.toLowerCase() === "verified";

  return (
    <div className="account-page">

      {/* Header */}
      <header className="account-header">

        <div className="account-logo">
          <span>🏦</span>
          OnlineBank
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

      </header>


      {/* Main */}
      <main className="account-content">

        <div className="account-heading">
          <p>MY ACCOUNT</p>

          <h1>Account Details</h1>

          <span>
            View and manage your account information.
          </span>
        </div>


        {/* Account overview */}
        <section className="account-overview">

          <div className="account-overview-top">

            <div className="account-type">
              <span className="account-symbol">🏦</span>

              <div>
                <p>ACCOUNT TYPE</p>
                <h2>{accountType}</h2>
              </div>
            </div>

            <div className="account-active">
              <span></span>
              {accountStatus}
            </div>

          </div>


          <div className="account-number-box">

            <span>Account Number</span>

            <strong>
              {maskAccountNumber(account.accountNumber)}
            </strong>

          </div>

        </section>


        {/* Personal information */}
        <section className="details-card">

          <div className="card-heading">
            <div>
              <h2>Personal Information</h2>
              <p>Registered customer information</p>
            </div>
          </div>


          <div className="details-grid">

            <div className="detail-item">
              <span>Full Name</span>
              <strong>{customer.fullName}</strong>
            </div>

            <div className="detail-item">
              <span>Customer ID</span>
              <strong>
                CU••••{String(customer.customerId).padStart(4, "0")}
              </strong>
            </div>

            <div className="detail-item">
              <span>Mobile Number</span>
              <strong>
                {maskMobileNumber(customer.mobileNumber)}
              </strong>
            </div>

            <div className="detail-item">
              <span>Email Address</span>
              <strong>
                {maskEmail(customer.email)}
              </strong>
            </div>

          </div>

        </section>


        {/* Bank information */}
        <section className="details-card">

          <div className="card-heading">
            <div>
              <h2>Banking Information</h2>
              <p>Details associated with your account</p>
            </div>
          </div>


          <div className="details-grid">

            <div className="detail-item">
              <span>Account Type</span>
              <strong>{accountType}</strong>
            </div>

            <div className="detail-item">
              <span>Branch</span>
              <strong>{account.branch}</strong>
            </div>

            <div className="detail-item">
              <span>IFSC Code</span>
              <strong>{account.ifscCode}</strong>
            </div>

            <div className="detail-item">
              <span>Account Status</span>
              <strong className="status-text">
                {accountStatus}
              </strong>
            </div>

          </div>

        </section>


        {/* KYC */}
        <section className="kyc-card">

          <div className="kyc-icon">
            {isVerified ? "✓" : "!"}
          </div>

          <div>
            <h3>KYC Status</h3>

            <p>
              {isVerified
                ? "Your KYC information has been verified."
                : "Your KYC information is currently pending verification."}
            </p>
          </div>

          <span className="verified">
            {kycStatus}
          </span>

        </section>

      </main>

    </div>
  );
}

export default Account;