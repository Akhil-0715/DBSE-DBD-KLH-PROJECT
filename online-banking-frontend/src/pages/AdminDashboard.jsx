import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");
  const [reviewedAlerts, setReviewedAlerts] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);

  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    totalFraudAlerts: 0,
  });

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOAD ADMIN DATA =================

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");

    if (!storedAdmin) {
      navigate("/admin-login");
      return;
    }

    try {
      setAdmin(JSON.parse(storedAdmin));
    } catch (error) {
      console.error("Invalid admin session:", error);
      localStorage.removeItem("admin");
      navigate("/admin-login");
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);

    try {
      const [
        dashboardResponse,
        customersResponse,
        transactionsResponse,
        fraudResponse,
      ] = await Promise.all([
        fetch("http://localhost:8080/api/admin/dashboard"),
        fetch("http://localhost:8080/api/customers"),
        fetch("http://localhost:8080/api/transactions"),
        fetch("http://localhost:8080/api/fraud-alerts"),
      ]);

      if (
        !dashboardResponse.ok ||
        !customersResponse.ok ||
        !transactionsResponse.ok ||
        !fraudResponse.ok
      ) {
        throw new Error("Unable to load admin data");
      }

      const dashboardData = await dashboardResponse.json();
      const customerData = await customersResponse.json();
      const transactionData = await transactionsResponse.json();
      const fraudData = await fraudResponse.json();

      setDashboardStats(dashboardData);
      setCustomers(customerData);
      setTransactions(transactionData);
      setFraudAlerts(fraudData);
    } catch (error) {
      console.error("Admin dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= SECTION =================

  const toggleSection = (section) => {
    setActiveSection(section);
  };

  // ================= KYC APPROVAL =================

  const approveKyc = async (customerId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/customers/${customerId}/kyc`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kycStatus: "Verified",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve KYC");
      }

      const updatedCustomer = await response.json();

      setCustomers((previousCustomers) =>
        previousCustomers.map((customer) =>
          customer.id === customerId
            ? {
                ...customer,
                ...updatedCustomer,
              }
            : customer
        )
      );

      alert("KYC approved successfully");
    } catch (error) {
      console.error("KYC approval error:", error);
      alert("Failed to approve KYC");
    }
  };

  // ================= FRAUD REVIEW =================

  const markReviewed = (alertId) => {
    setReviewedAlerts((previous) => {
      if (previous.includes(alertId)) {
        return previous;
      }

      return [...previous, alertId];
    });
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  // ================= HELPERS =================

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === "") {
      return "₹ —";
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
      return "₹ —";
    }

    return `₹ ${numericAmount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) {
      return "Account number unavailable";
    }

    return `•••• ${accountNumber.slice(-4)}`;
  };

  const getCustomerName = (transaction) => {
    if (transaction.senderAccount?.customer?.fullName) {
      return transaction.senderAccount.customer.fullName;
    }

    if (transaction.receiverAccount?.customer?.fullName) {
      return transaction.receiverAccount.customer.fullName;
    }

    return "Customer unavailable";
  };

  const getTransactionType = (transaction) => {
    if (transaction.transactionType === "FUND_TRANSFER") {
      return "Transfer";
    }

    return transaction.transactionType || "Transaction type unavailable";
  };

  const getTransactionStatus = (transaction) => {
    return transaction.status || "Status unavailable";
  };

  const getTransactionId = (transaction) => {
    if (transaction.transactionReference) {
      return transaction.transactionReference;
    }

    if (transaction.id !== null && transaction.id !== undefined) {
      return `TXN-${transaction.id}`;
    }

    return "Transaction reference unavailable";
  };

  const getAlertCustomer = (alert) => {
    if (alert.transaction?.senderAccount?.customer?.fullName) {
      return alert.transaction.senderAccount.customer.fullName;
    }

    if (alert.transaction?.receiverAccount?.customer?.fullName) {
      return alert.transaction.receiverAccount.customer.fullName;
    }

    return "Customer unavailable";
  };

  const getAlertTransaction = (alert) => {
    if (alert.transaction?.transactionReference) {
      return alert.transaction.transactionReference;
    }

    return "Transaction reference unavailable";
  };

  const getAlertAmount = (alert) => {
    return alert.transaction?.amount ?? null;
  };

  const getAlertTime = (alert) => {
    if (!alert.alertDate) {
      return "Alert time unavailable";
    }

    return new Date(alert.alertDate).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPendingAlertsCount = () => {
    return Math.max(
      dashboardStats.totalFraudAlerts - reviewedAlerts.length,
      0
    );
  };

  const getAdminName = () => {
    if (admin?.fullName) {
      return admin.fullName;
    }

    if (admin?.name) {
      return admin.name;
    }

    if (admin?.email) {
      return admin.email;
    }

    return "Administrator";
  };

  const getAdminInitial = () => {
    const name = getAdminName();

    return name
      ? name.charAt(0).toUpperCase()
      : "A";
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          color: "#475467",
        }}
      >
        Loading admin dashboard...
      </div>
    );
  }

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
            {getAdminInitial()}
          </div>

          <div>
            <strong>{getAdminName()}</strong>
            <small>System Admin</small>
          </div>

          <button
            onClick={handleLogout}
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
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
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
              <strong>
                {dashboardStats.totalCustomers}
              </strong>
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
              <strong>
                {dashboardStats.totalAccounts}
              </strong>
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
              <small>Total Transactions</small>
              <strong>
                {dashboardStats.totalTransactions}
              </strong>
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
              <strong>
                {getPendingAlertsCount()}
              </strong>
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
                    Customer records loaded
                  </strong>

                  <small>
                    {dashboardStats.totalCustomers} customers in the system
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
                    Transaction monitoring active
                  </strong>

                  <small>
                    {dashboardStats.totalTransactions} transactions recorded
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
                    Fraud monitoring
                  </strong>

                  <small>
                    {getPendingAlertsCount()} alerts currently require review
                  </small>

                </div>

                <span>
                  {getPendingAlertsCount() > 0
                    ? "Review Required"
                    : "No Pending Alerts"}
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


              {customers.map((customer) => {

                const customerAccount =
                  customer.accounts?.[0] || null;

                return (

                  <div
                    className="admin-table-row"
                    key={customer.id}
                  >

                    <div className="admin-customer">

                      <div className="customer-avatar">
                        {customer.fullName
                          ?.charAt(0)
                          ?.toUpperCase() || "C"}
                      </div>

                      <strong>
                        {customer.fullName || "Customer name unavailable"}
                      </strong>

                    </div>

                    <span>
                      {customer.id ?? "Customer ID unavailable"}
                    </span>

                    <span>
                      {formatAccountNumber(
                        customerAccount?.accountNumber
                      )}
                    </span>

                    <span
                      className={
                        customer.kycStatus === "Verified"
                          ? "verified-status"
                          : "pending-status"
                      }
                    >
                      {customer.kycStatus || "KYC status unavailable"}
                    </span>

                    <span className="active-status">

                      {customerAccount?.status ? (
                        customerAccount.status
                      ) : (
                        customer.kycStatus === "Verified" ? (
                          "Account status unavailable"
                        ) : (
                          <button
                            className="view-page-button"
                            onClick={() =>
                              approveKyc(customer.id)
                            }
                          >
                            Approve KYC
                          </button>
                        )
                      )}

                    </span>

                  </div>

                );
              })}

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
                      {getTransactionId(transaction)}
                    </strong>

                  </div>

                  <span>
                    {getCustomerName(transaction)}
                  </span>

                  <span
                    className={
                      transaction.transactionType === "FUND_TRANSFER"
                        ? "credit-admin"
                        : "debit-admin"
                    }
                  >
                    {getTransactionType(transaction)}
                  </span>

                  <strong>
                    {formatCurrency(transaction.amount)}
                  </strong>

                  <span
                    className={
                      getTransactionStatus(transaction) === "SUCCESS"
                        ? "completed-status"
                        : "review-status"
                    }
                  >
                    {getTransactionStatus(transaction)}
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
                {getPendingAlertsCount()} Pending
              </span>

            </div>


            <div className="fraud-list">

              {fraudAlerts.length === 0 ? (

                <div
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#667085",
                  }}
                >
                  No fraud alerts found.
                </div>

              ) : (

                fraudAlerts.map((alert) => {

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
                          {alert.description ||
                            alert.alertType ||
                            "Fraud alert information unavailable"}
                        </strong>

                        <span>
                          {getAlertCustomer(alert)} ·{" "}
                          {getAlertTransaction(alert)}
                        </span>

                        <small>
                          {getAlertTime(alert)}
                        </small>

                      </div>


                      <div className="fraud-amount">

                        <strong>
                          {formatCurrency(
                            getAlertAmount(alert)
                          )}
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
                })
              )}

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default AdminDashboard;