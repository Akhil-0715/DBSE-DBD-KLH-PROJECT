import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="bank-dashboard">

      {/* ================= HEADER ================= */}

      <header className="bank-header">

        <div className="bank-logo">
          <span>🏦</span>
          OnlineBank
        </div>


        <nav className="bank-nav">

          <button className="nav-active">
            Overview
          </button>

          <button onClick={() => navigate("/account")}>
            Accounts
          </button>

          <button onClick={() => navigate("/transfer")}>
            Payments
          </button>

          <button onClick={() => navigate("/fixed-deposit")}>
            Deposits
          </button>

        </nav>


        <div className="user-area">

          <div className="user-avatar">
            A
          </div>

          <div className="user-details">

            <strong>
              Akhil
            </strong>

            <span>
              Customer
            </span>

          </div>

          <button
            className="logout"
            onClick={() => navigate("/")}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="bank-main">


        {/* INTRO */}

        <div className="dashboard-intro">

          <div>

            <p className="intro-label">
              ACCOUNT OVERVIEW
            </p>

            <h1>
              Good morning, Akhil
            </h1>

            <p>
              Manage your banking activities from one place.
            </p>

          </div>

          <span className="current-date">
            11 September 2026
          </span>

        </div>


        {/* ================= ACCOUNT BANNER ================= */}

        <section className="account-banner">

          <div className="account-main">

            <div className="account-title">

              <span className="account-dot"></span>

              SAVINGS ACCOUNT

            </div>


            <div className="account-number">
              •••• •••• 4582
            </div>


            <p className="balance-label">
              Available Balance
            </p>


            <div className="balance-line">

              <h2>
                {showBalance
                  ? "₹ 50,000.00"
                  : "₹ ••••••"}
              </h2>

              <button
                className="balance-toggle"
                onClick={() =>
                  setShowBalance(!showBalance)
                }
              >
                {showBalance
                  ? "Hide"
                  : "Show balance"}
              </button>

            </div>

          </div>


          <div className="account-status">

            <span>
              ACCOUNT STATUS
            </span>

            <strong>
              <i></i>
              Active
            </strong>

            <small>
              Your account is active
            </small>

          </div>

        </section>


        {/* ================= BANKING SERVICES ================= */}

        <section className="services-section">

          <div className="section-title">

            <h2>
              What would you like to do?
            </h2>

            <p>
              Quickly access your banking services.
            </p>

          </div>


          <div className="actions-row">


            {/* SEND MONEY */}

            <button
              className="bank-action"
              onClick={() => navigate("/transfer")}
            >

              <span className="action-symbol">
                ↗
              </span>

              <span>

                <strong>
                  Send Money
                </strong>

                <small>
                  Transfer funds
                </small>

              </span>

            </button>


            {/* PAY BILLS */}

            <button
              className="bank-action"
              onClick={() => navigate("/transfer")}
            >

              <span className="action-symbol">
                ₹
              </span>

              <span>

                <strong>
                  Pay Bills
                </strong>

                <small>
                  Pay your bills
                </small>

              </span>

            </button>


            {/* FIXED DEPOSIT */}

            <button
              className="bank-action"
              onClick={() => navigate("/fixed-deposit")}
            >

              <span className="action-symbol">
                ＋
              </span>

              <span>

                <strong>
                  Fixed Deposit
                </strong>

                <small>
                  Start a deposit
                </small>

              </span>

            </button>


            {/* TRANSACTIONS */}

            <button
              className="bank-action"
              onClick={() => navigate("/transactions")}
            >

              <span className="action-symbol">
                ▤
              </span>

              <span>

                <strong>
                  Transactions
                </strong>

                <small>
                  View activity
                </small>

              </span>

            </button>

          </div>

        </section>


        {/* ================= BOTTOM SECTION ================= */}

        <div className="dashboard-bottom">


          {/* RECENT ACTIVITY */}

          <section className="activity-section">

            <div className="section-heading">

              <div>

                <h2>
                  Recent Activity
                </h2>

                <p>
                  Your latest account activity
                </p>

              </div>


              <button
                className="text-button"
                onClick={() =>
                  navigate("/transactions")
                }
              >
                View all
              </button>

            </div>


            <div className="activity-table">


              {/* SALARY */}

              <div className="activity-row">

                <div className="activity-name">

                  <span className="activity-icon credit">
                    ↓
                  </span>

                  <div>

                    <strong>
                      Salary Credit
                    </strong>

                    <small>
                      Today · 10:30 AM
                    </small>

                  </div>

                </div>

                <span className="activity-status credit-text">
                  Credited
                </span>

              </div>


              {/* ELECTRICITY */}

              <div className="activity-row">

                <div className="activity-name">

                  <span className="activity-icon debit">
                    ↑
                  </span>

                  <div>

                    <strong>
                      Electricity Bill
                    </strong>

                    <small>
                      Yesterday · 06:15 PM
                    </small>

                  </div>

                </div>

                <span className="activity-status debit-text">
                  Debited
                </span>

              </div>


              {/* ONLINE PURCHASE */}

              <div className="activity-row">

                <div className="activity-name">

                  <span className="activity-icon debit">
                    ↑
                  </span>

                  <div>

                    <strong>
                      Online Purchase
                    </strong>

                    <small>
                      09 Sep · 02:20 PM
                    </small>

                  </div>

                </div>

                <span className="activity-status debit-text">
                  Debited
                </span>

              </div>

            </div>

          </section>


          {/* ACCOUNT SUMMARY */}

          <section className="summary-section">

            <div className="section-heading">

              <div>

                <h2>
                  Account Summary
                </h2>

                <p>
                  Basic account information
                </p>

              </div>

            </div>


            <div className="summary-item">

              <span>
                Account Type
              </span>

              <strong>
                Savings
              </strong>

            </div>


            <div className="summary-item">

              <span>
                Account Number
              </span>

              <strong>
                •••• 4582
              </strong>

            </div>


            <div className="summary-item">

              <span>
                Account Status
              </span>

              <strong className="active-text">
                Active
              </strong>

            </div>


            <button
              className="account-details-button"
              onClick={() =>
                navigate("/account")
              }
            >
              View Account Details →
            </button>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;