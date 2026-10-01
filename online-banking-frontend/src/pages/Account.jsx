import { useNavigate } from "react-router-dom";
import "./Account.css";

function Account() {
  const navigate = useNavigate();

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
                <h2>Savings Account</h2>
              </div>
            </div>

            <div className="account-active">
              <span></span>
              Active
            </div>

          </div>


          <div className="account-number-box">

            <span>Account Number</span>

            <strong>
              XXXX XXXX 4582
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
              <strong>Akhil</strong>
            </div>

            <div className="detail-item">
              <span>Customer ID</span>
              <strong>CU••••4582</strong>
            </div>

            <div className="detail-item">
              <span>Mobile Number</span>
              <strong>******4582</strong>
            </div>

            <div className="detail-item">
              <span>Email Address</span>
              <strong>a••••@email.com</strong>
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
              <strong>Savings Account</strong>
            </div>

            <div className="detail-item">
              <span>Branch</span>
              <strong>Hyderabad</strong>
            </div>

            <div className="detail-item">
              <span>IFSC Code</span>
              <strong>ONBK0001234</strong>
            </div>

            <div className="detail-item">
              <span>Account Status</span>
              <strong className="status-text">
                Active
              </strong>
            </div>

          </div>

        </section>


        {/* KYC */}
        <section className="kyc-card">

          <div className="kyc-icon">
            ✓
          </div>

          <div>
            <h3>KYC Status</h3>

            <p>
              Your KYC information has been verified.
            </p>
          </div>

          <span className="verified">
            Verified
          </span>

        </section>

      </main>

    </div>
  );
}

export default Account;