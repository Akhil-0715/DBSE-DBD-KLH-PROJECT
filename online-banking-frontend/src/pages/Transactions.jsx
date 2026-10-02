import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Transactions.css";

function Transactions() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Transactions");
  const [dateFilter, setDateFilter] = useState("All Time");

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

      console.log("Transaction history:", data);

      setTransactions(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error("Transaction loading error:", error);
      setTransactions([]);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "Time unavailable";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionType = (transaction) => {
    if (
      transaction.senderAccount &&
      account &&
      transaction.senderAccount.id === account.id
    ) {
      return "Debit";
    }

    return "Credit";
  };

  const getTransactionName = (transaction) => {
    if (transaction.transactionType === "FUND_TRANSFER") {
      return "Fund Transfer";
    }

    if (transaction.transactionType === "BILL_PAYMENT") {
      return "Bill Payment";
    }

    return transaction.transactionType || "Transaction";
  };

  const getTransactionDescription = (transaction) => {
    if (transaction.transactionType === "BILL_PAYMENT") {
      if (transaction.transferMode) {
        return transaction.transferMode;
      }

      return "Bill payment";
    }

    if (transaction.transferMode) {
      return `${transaction.transferMode} transfer`;
    }

    return "Banking transaction";
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionType =
        getTransactionType(transaction);

      const transactionName =
        getTransactionName(transaction);

      const transactionDescription =
        getTransactionDescription(transaction);

      const searchText = search.toLowerCase();

      const matchesSearch =
        transactionName
          .toLowerCase()
          .includes(searchText) ||
        transactionDescription
          .toLowerCase()
          .includes(searchText) ||
        transactionType
          .toLowerCase()
          .includes(searchText) ||
        transaction.transactionReference
          ?.toLowerCase()
          .includes(searchText);

      const matchesType =
        typeFilter === "All Transactions" ||
        transactionType === typeFilter.slice(0, -1);

      let matchesDate = true;

      if (dateFilter !== "All Time") {
        const transactionDate =
          new Date(transaction.transactionDate);

        const now = new Date();

        if (dateFilter === "This Month") {
          matchesDate =
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear();
        }

        if (dateFilter === "Last Month") {
          const lastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
          );

          matchesDate =
            transactionDate.getMonth() ===
              lastMonth.getMonth() &&
            transactionDate.getFullYear() ===
              lastMonth.getFullYear();
        }

        if (dateFilter === "Last 3 Months") {
          const threeMonthsAgo = new Date();

          threeMonthsAgo.setMonth(
            threeMonthsAgo.getMonth() - 3
          );

          matchesDate =
            transactionDate >= threeMonthsAgo;
        }
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesDate
      );
    });
  }, [
    transactions,
    search,
    typeFilter,
    dateFilter,
    account,
  ]);

  return (
    <div className="transactions-page">

      {/* Header */}

      <header className="transactions-header">

        <div className="transactions-logo">
          <span>🏦</span>
          OnlineBank
        </div>

        <button
          className="transactions-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </header>


      {/* Main */}

      <main className="transactions-main">

        <div className="transactions-heading">

          <div>

            <p>
              TRANSACTION HISTORY
            </p>

            <h1>
              Transactions
            </h1>

            <span>
              View and track your account activity.
            </span>

          </div>

          <div className="account-tag">

            {account?.accountType
              ? `${account.accountType} Account`
              : "Account type unavailable"}

            <strong>
              {account?.accountNumber
                ? `•••• ${account.accountNumber.slice(-4)}`
                : "Account number unavailable"}
            </strong>

          </div>

        </div>


        {/* Filters */}

        <section className="transaction-controls">

          <div className="search-box">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search transactions"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
          >
            <option>
              All Transactions
            </option>

            <option>
              Credits
            </option>

            <option>
              Debits
            </option>

          </select>

          <select
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
          >
            <option>
              All Time
            </option>

            <option>
              This Month
            </option>

            <option>
              Last Month
            </option>

            <option>
              Last 3 Months
            </option>

          </select>

        </section>


        {/* Transactions */}

        <section className="transactions-card">

          <div className="transaction-card-heading">

            <div>

              <h2>
                Recent Transactions
              </h2>

              <p>
                Showing your latest account activity
              </p>

            </div>

            <span>
              {filteredTransactions.length}{" "}
              {filteredTransactions.length === 1
                ? "Transaction"
                : "Transactions"}
            </span>

          </div>


          <div className="transaction-table">

            {/* Header */}

            <div className="table-header">

              <span>
                TRANSACTION
              </span>

              <span>
                DATE & TIME
              </span>

              <span>
                TYPE
              </span>

              <span>
                AMOUNT
              </span>

              <span>
                STATUS
              </span>

            </div>


            {/* Transaction Rows */}

            {filteredTransactions.length > 0 ? (

              filteredTransactions.map(
                (transaction) => {

                  const transactionType =
                    getTransactionType(transaction);

                  return (
                    <div
                      className="transaction-row"
                      key={
                        transaction.id ||
                        transaction.transactionReference
                      }
                    >

                      <div className="transaction-description">

                        <div
                          className={`transaction-icon ${
                            transactionType === "Credit"
                              ? "credit"
                              : "debit"
                          }`}
                        >
                          {transactionType === "Credit"
                            ? "↓"
                            : "↑"}
                        </div>

                        <div>

                          <strong>
                            {getTransactionName(
                              transaction
                            )}
                          </strong>

                          <small>
                            {getTransactionDescription(
                              transaction
                            )}
                          </small>

                        </div>

                      </div>


                      <span>

                        {formatDate(
                          transaction.transactionDate
                        )}

                        <small>
                          {formatTime(
                            transaction.transactionDate
                          )}
                        </small>

                      </span>


                      <span
                        className={
                          transactionType === "Credit"
                            ? "type-credit"
                            : "type-debit"
                        }
                      >
                        {transactionType}
                      </span>


                      <strong
                        className={`transaction-amount ${
                          transactionType === "Credit"
                            ? "credit-amount"
                            : "debit-amount"
                        }`}
                      >

                        {transactionType === "Credit"
                          ? "+ "
                          : "- "}

                        ₹

                        {transaction.amount !== null &&
                        transaction.amount !== undefined
                          ? Number(
                              transaction.amount
                            ).toLocaleString("en-IN")
                          : " —"}

                      </strong>


                      <span className="status completed">

                        {transaction.status ||
                          "Status unavailable"}

                      </span>

                    </div>
                  );
                }
              )

            ) : (

              <div
                style={{
                  padding: "45px 20px",
                  textAlign: "center",
                  color: "#667085",
                }}
              >

                <div
                  style={{
                    fontSize: "28px",
                    marginBottom: "10px",
                  }}
                >
                  🔎
                </div>

                <strong
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#344054",
                  }}
                >
                  No transactions found
                </strong>

                <span
                  style={{
                    fontSize: "13px",
                  }}
                >
                  Try changing your search or filters.
                </span>

              </div>

            )}

          </div>


          {/* Transaction detail note */}

          <div className="transaction-note">

            <span>🔒</span>

            <p>
              Transaction details shown here are available only
              after signing in to your account.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Transactions;