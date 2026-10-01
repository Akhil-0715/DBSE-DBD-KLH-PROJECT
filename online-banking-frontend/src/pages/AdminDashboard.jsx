import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");
  const [reviewedAlerts, setReviewedAlerts] = useState([]);

  const customers = [
    {
      id: "CU1048",
      name: "Akhil",
      account: "•••• 4582",
      kyc: "Verified",
      status: "Active",
    },
    {
      id: "CU1049",
      name: "Rahul",
      account: "•••• 6214",
      kyc: "Verified",
      status: "Active",
    },
    {
      id: "CU1050",
      name: "Priya",
      account: "•••• 7391",
      kyc: "Pending",
      status: "Active",
    },
  ];

  const transactions = [
    {
      id: "TXN7842",
      customer: "Akhil",
      type: "Credit",
      amount: "₹35,000",
      status: "Completed",
    },
    {
      id: "TXN7841",
      customer: "Rahul",
      type: "Debit",
      amount: "₹2,450",
      status: "Completed",
    },
    {
      id: "TXN7839",
      customer: "Priya",
      type: "Debit",
      amount: "₹1,200",
      status: "Completed",
    },
    {
      id: "TXN7835",
      customer: "Akhil",
      type: "Debit",
      amount: "₹25,000",
      status: "Review",
    },
  ];

  const fraudAlerts = [
    {
      id: "ALR001",
      transaction: "TXN7835",
      customer: "Akhil",
      reason: "Unusual transaction amount",
      amount: "₹25,000",
      time: "42 minutes ago",
    },
    {
      id: "ALR002",
      transaction: "TXN7829",
      customer: "Rahul",
      reason: "Multiple transfers in short time",
      amount: "₹18,000",
      time: "1 hour ago",
    },
    {
      id: "ALR003",
      transaction: "TXN7818",
      customer: "Priya",
      reason: "Unusual transaction pattern",
      amount: "₹12,500",
      time: "2 hours ago",
    },
  ];

  const toggleSection = (section) => {
    setActiveSection(section);
  };

  const markReviewed = (alertId) => {
    setReviewedAlerts((previous) => [
      ...previous,
      alertId,
    ]);
  };

  return (
    <div className="admin-dashboard">

      {/* ================= HEADER ================= */}

      <header className="admin-header">

        <div className="admin-logo">
          <span>🏦</span>
          OnlineBank
        </div>

        <div className="admin-title">
          <span>ADMIN PORTAL</span>
        </div>

        <div className="admin-user">

          <div className="admin-avatar">
            A
          </div>

          <div>
            <strong>Administrator</strong>
            <small>System Admin</small>
          </div>

          <button
            onClick={() => navigate("/")}
            className="admin-logout"
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="admin-main">

        <div className="admin-welcome">

          <div>

            <p>ADMINISTRATION</p>

            <h1>
              Banking System Overview
            </h1>

            <span>
              Monitor and manage banking operations from one place.
            </span>

          </div>

          <div className="admin-date">
            11 September 2026
          </div>

        </div>


        {/* ================= STATISTICS ================= */}

        <section className="admin-stats">

          <button
            className="admin-stat-card"
            onClick={() => toggleSection("customers")}
          >

            <span className="stat-icon">
              👥
            </span>

            <div>
              <small>Total Customers</small>
              <strong>1,248</strong>
            </div>

          </button>


          <button
            className="admin-stat-card"
            onClick={() => toggleSection("customers")}
          >

            <span className="stat-icon">
              🏦
            </span>

            <div>
              <small>Active Accounts</small>
              <strong>1,156</strong>
            </div>

          </button>


          <button
            className="admin-stat-card"
            onClick={() => toggleSection("transactions")}
          >

            <span className="stat-icon">
              💸
            </span>

            <div>
              <small>Today's Transactions</small>
              <strong>384</strong>
            </div>

          </button>


          <button
            className="admin-stat-card"
            onClick={() => toggleSection("fraud")}
          >

            <span className="stat-icon">
              ⚠️
            </span>

            <div>
              <small>Fraud Alerts</small>
              <strong>{3 - reviewedAlerts.length}</strong>
            </div>

          </button>

        </section>


        {/* ================= NAVIGATION ================= */}

        <div className="admin-tabs">

          <button
            className={
              activeSection === "overview"
                ? "admin-tab active"
                : "admin-tab"
            }
            onClick={() => toggleSection("overview")}
          >
            Overview
          </button>

          <button
            className={
              activeSection === "customers"
                ? "admin-tab active"
                : "admin-tab"
            }
            onClick={() => toggleSection("customers")}
          >
            Customers & KYC
          </button>

          <button
            className={
              activeSection === "transactions"
                ? "admin-tab active"
                : "admin-tab"
            }
            onClick={() => toggleSection("transactions")}
          >
            Transactions
          </button>

          <button
            className={
              activeSection === "fraud"
                ? "admin-tab active"
                : "admin-tab"
            }
            onClick={() => toggleSection("fraud")}
          >
            Fraud Alerts
          </button>

        </div>


        {/* ================= OVERVIEW ================= */}

        {activeSection === "overview" && (

          <section className="admin-section">

            <div className="admin-section-heading">

              <div>

                <p>MONITORING</p>

                <h2>
                  Recent System Activity
                </h2>

              </div>

            </div>


            <div className="admin-activity">

              <div className="admin-activity-row">

                <span className="activity-status-dot"></span>

                <div>

                  <strong>
                    New customer registration
                  </strong>

                  <small>
                    Customer ID CU1048 · 10 minutes ago
                  </small>

                </div>

                <span>
                  Completed
                </span>

              </div>


              <div className="admin-activity-row">

                <span className="activity-status-dot"></span>

                <div>

                  <strong>
                    Fund transfer processed
                  </strong>

                  <small>
                    Transaction TXN7842 · 25 minutes ago
                  </small>

                </div>

                <span>
                  Completed
                </span>

              </div>


              <div className="admin-activity-row alert-row">

                <span className="activity-status-dot alert"></span>

                <div>

                  <strong>
                    Unusual transaction detected
                  </strong>

                  <small>
                    Transaction TXN7835 · 42 minutes ago
                  </small>

                </div>

                <span>
                  Review Required
                </span>

              </div>

            </div>

          </section>

        )}


        {/* ================= CUSTOMERS ================= */}

        {activeSection === "customers" && (

          <section className="admin-section">

            <div className="admin-section-heading">

              <div>

                <p>CUSTOMER MANAGEMENT</p>

                <h2>
                  Customers & KYC
                </h2>

              </div>

              <span className="section-count">
                {customers.length} Customers
              </span>

            </div>


            <div className="admin-table">

              <div className="admin-table-header">

                <span>Customer</span>
                <span>Customer ID</span>
                <span>Account</span>
                <span>KYC</span>
                <span>Status</span>

              </div>


              {customers.map((customer) => (

                <div
                  className="admin-table-row"
                  key={customer.id}
                >

                  <div className="admin-customer">

                    <div className="customer-avatar">
                      {customer.name.charAt(0)}
                    </div>

                    <strong>
                      {customer.name}
                    </strong>

                  </div>

                  <span>
                    {customer.id}
                  </span>

                  <span>
                    {customer.account}
                  </span>

                  <span
                    className={
                      customer.kyc === "Verified"
                        ? "verified-status"
                        : "pending-status"
                    }
                  >
                    {customer.kyc}
                  </span>

                  <span className="active-status">
                    {customer.status}
                  </span>

                </div>

              ))}

            </div>

          </section>

        )}


        {/* ================= TRANSACTIONS ================= */}

        {activeSection === "transactions" && (

          <section className="admin-section">

            <div className="admin-section-heading">

              <div>

                <p>TRANSACTION MONITORING</p>

                <h2>
                  Recent Transactions
                </h2>

              </div>

              <button
                className="view-page-button"
                onClick={() => navigate("/transactions")}
              >
                Customer View →
              </button>

            </div>


            <div className="admin-table">

              <div className="admin-table-header transaction-admin-header">

                <span>Transaction</span>
                <span>Customer</span>
                <span>Type</span>
                <span>Amount</span>
                <span>Status</span>

              </div>


              {transactions.map((transaction) => (

                <div
                  className="admin-table-row transaction-admin-row"
                  key={transaction.id}
                >

                  <div>

                    <strong>
                      {transaction.id}
                    </strong>

                  </div>

                  <span>
                    {transaction.customer}
                  </span>

                  <span
                    className={
                      transaction.type === "Credit"
                        ? "credit-admin"
                        : "debit-admin"
                    }
                  >
                    {transaction.type}
                  </span>

                  <strong>
                    {transaction.amount}
                  </strong>

                  <span
                    className={
                      transaction.status === "Review"
                        ? "review-status"
                        : "completed-status"
                    }
                  >
                    {transaction.status}
                  </span>

                </div>

              ))}

            </div>

          </section>

        )}


        {/* ================= FRAUD ALERTS ================= */}

        {activeSection === "fraud" && (

          <section className="admin-section">

            <div className="admin-section-heading">

              <div>

                <p>SECURITY MONITORING</p>

                <h2>
                  Fraud Alerts
                </h2>

              </div>

              <span className="alert-count">
                {3 - reviewedAlerts.length} Pending
              </span>

            </div>


            <div className="fraud-list">

              {fraudAlerts.map((alert) => {

                const isReviewed =
                  reviewedAlerts.includes(alert.id);

                return (

                  <div
                    className={
                      isReviewed
                        ? "fraud-card reviewed"
                        : "fraud-card"
                    }
                    key={alert.id}
                  >

                    <div className="fraud-icon">
                      ⚠️
                    </div>


                    <div className="fraud-details">

                      <strong>
                        {alert.reason}
                      </strong>

                      <span>
                        {alert.customer} · {alert.transaction}
                      </span>

                      <small>
                        {alert.time}
                      </small>

                    </div>


                    <div className="fraud-amount">

                      <strong>
                        {alert.amount}
                      </strong>

                      {isReviewed ? (

                        <span className="reviewed-text">
                          ✓ Reviewed
                        </span>

                      ) : (

                        <button
                          onClick={() =>
                            markReviewed(alert.id)
                          }
                        >
                          Mark Reviewed
                        </button>

                      )}

                    </div>

                  </div>

                );
              })}

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default AdminDashboard;