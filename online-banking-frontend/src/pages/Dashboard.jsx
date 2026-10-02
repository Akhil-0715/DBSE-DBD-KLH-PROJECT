import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [showBalance, setShowBalance] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

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

  const loadAccount = async (customerId) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/accounts"
      );

      if (!response.ok) {
        throw new Error("Unable to load accounts");
      }

      const accounts = await response.json();

      const customerAccount = accounts.find(
        (item) => item.customer?.id === customerId
      );

      if (customerAccount) {
        setAccount(customerAccount);
        loadTransactions(customerAccount.id);
      }
    } catch (error) {
      console.error("Account loading error:", error);
    }
  };

  const loadTransactions = async (accountId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/transactions/account/${accountId}`
      );

      if (!response.ok) {
        throw new Error("Unable to load transactions");
      }

      const data = await response.json();

      setTransactions(data);
    } catch (error) {
      console.error("Transaction loading error:", error);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) {
      return "₹ —";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return "•••• •••• ••••";

    const lastFour = accountNumber.slice(-4);

    return `•••• •••• ${lastFour}`;
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTransactionType = (transaction) => {
    if (
      transaction.senderAccount &&
      account &&
      transaction.senderAccount.id === account.id
    ) {
      return "Debited";
    }

    return "Credited";
  };

  const getTransactionClass = (transaction) => {
    return getTransactionType(transaction) === "Credited"
      ? "credit"
      : "debit";
  };

  const handleLogout = () => {
    localStorage.removeItem("customer");
    navigate("/");
  };

  if (!customer) {
    return null;
  }

  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  const accountType = account?.accountType
    ? `${account.accountType} ACCOUNT`
    : "ACCOUNT TYPE UNAVAILABLE";

  const accountStatus =
    account?.status || "Unavailable";

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
            {customer.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="user-details">

            <strong>
              {customer.fullName}
            </strong>

            <span>
              Customer
            </span>

          </div>

          <button
            className="logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="bank-main">

        {/* ================= INTRO ================= */}

        <div className="dashboard-intro">

          <div>

            <p className="intro-label">
              ACCOUNT OVERVIEW
            </p>

            <h1>
              {greeting}, {customer.fullName}
            </h1>

            <p>
              Manage your banking activities from one place.
            </p>

          </div>

          <span className="current-date">
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>

        </div>


        {/* ================= ACCOUNT BANNER ================= */}

        <section className="account-banner">

          <div className="account-main">

            <div className="account-title">

              <span className="account-dot"></span>

              {accountType}

            </div>

            <div className="account-number">
              {formatAccountNumber(account?.accountNumber)}
            </div>

            <p className="balance-label">
              Available Balance
            </p>

            <div className="balance-line">

              <h2>
                {showBalance
                  ? formatCurrency(account?.balance)
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
              {accountStatus}
            </strong>

            <small>
              {account?.status
                ? `Your account is ${account.status.toLowerCase()}`
                : "Account status unavailable"}
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
              onClick={() => navigate("/bill-payment")}
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

          {/* ================= RECENT ACTIVITY ================= */}

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

              {transactions.length === 0 ? (

                <div className="activity-row">

                  <div className="activity-name">

                    <span className="activity-icon">
                      —
                    </span>

                    <div>

                      <strong>
                        No recent transactions
                      </strong>

                      <small>
                        Your latest activity will appear here
                      </small>

                    </div>

                  </div>

                </div>

              ) : (

                transactions
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.transactionDate) -
                      new Date(a.transactionDate)
                  )
                  .slice(0, 3)
                  .map((transaction) => {

                    const type =
                      getTransactionType(transaction);

                    const transactionClass =
                      getTransactionClass(transaction);

                    return (

                      <div
                        className="activity-row"
                        key={transaction.id}
                      >

                        <div className="activity-name">

                          <span
                            className={`activity-icon ${transactionClass}`}
                          >
                            {type === "Credited"
                              ? "↓"
                              : "↑"}
                          </span>

                          <div>

                            <strong>
                              {transaction.transactionType ||
                                "Transaction"}
                            </strong>

                            <small>
                              {formatDate(
                                transaction.transactionDate
                              )}
                            </small>

                          </div>

                        </div>


                        <span
                          className={`activity-status ${
                            type === "Credited"
                              ? "credit-text"
                              : "debit-text"
                          }`}
                        >
                          {type}
                        </span>

                      </div>

                    );

                  })

              )}

            </div>

          </section>


          {/* ================= ACCOUNT SUMMARY ================= */}

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
                {account?.accountType || "Unavailable"}
              </strong>

            </div>


            <div className="summary-item">

              <span>
                Account Number
              </span>

              <strong>
                {formatAccountNumber(
                  account?.accountNumber
                )}
              </strong>

            </div>


            <div className="summary-item">

              <span>
                Account Status
              </span>

              <strong className="active-text">
                {accountStatus}
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