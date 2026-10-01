import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Transactions.css";

function Transactions() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Transactions");
  const [dateFilter, setDateFilter] = useState("All Time");

  const transactions = [
    {
      id: 1,
      name: "Salary Credit",
      description: "Monthly salary",
      date: "11 Sep 2026",
      time: "10:30 AM",
      type: "Credit",
      amount: 35000,
      status: "Completed",
    },
    {
      id: 2,
      name: "Electricity Bill",
      description: "Utility payment",
      date: "10 Sep 2026",
      time: "06:15 PM",
      type: "Debit",
      amount: 2450,
      status: "Completed",
    },
    {
      id: 3,
      name: "Online Purchase",
      description: "Card payment",
      date: "09 Sep 2026",
      time: "02:20 PM",
      type: "Debit",
      amount: 1200,
      status: "Completed",
    },
    {
      id: 4,
      name: "Money Received",
      description: "Fund transfer",
      date: "08 Sep 2026",
      time: "11:45 AM",
      type: "Credit",
      amount: 5000,
      status: "Completed",
    },
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      const searchText = search.toLowerCase();

      const matchesSearch =
        transaction.name.toLowerCase().includes(searchText) ||
        transaction.description.toLowerCase().includes(searchText) ||
        transaction.type.toLowerCase().includes(searchText);

      // Credit / Debit filter
      const matchesType =
        typeFilter === "All Transactions" ||
        transaction.type === typeFilter.slice(0, -1);

      // Date filter
      let matchesDate = true;

      if (dateFilter === "This Month") {
        matchesDate = transaction.date.includes("Sep 2026");
      }

      if (dateFilter === "Last Month") {
        matchesDate = transaction.date.includes("Aug 2026");
      }

      if (dateFilter === "Last 3 Months") {
        matchesDate =
          transaction.date.includes("Sep 2026") ||
          transaction.date.includes("Aug 2026") ||
          transaction.date.includes("Jul 2026");
      }

      return matchesSearch && matchesType && matchesDate;
    });
  }, [search, typeFilter, dateFilter]);

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
            <p>TRANSACTION HISTORY</p>

            <h1>Transactions</h1>

            <span>
              View and track your account activity.
            </span>
          </div>

          <div className="account-tag">
            Savings Account
            <strong>•••• 4582</strong>
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

            <option>All Transactions</option>
            <option>Credits</option>
            <option>Debits</option>

          </select>


          <select
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
          >

            <option>All Time</option>
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>

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

              <span>TRANSACTION</span>
              <span>DATE & TIME</span>
              <span>TYPE</span>
              <span>AMOUNT</span>
              <span>STATUS</span>

            </div>


            {/* Transaction Rows */}
            {filteredTransactions.length > 0 ? (

              filteredTransactions.map((transaction) => (

                <div
                  className="transaction-row"
                  key={transaction.id}
                >

                  <div className="transaction-description">

                    <div
                      className={`transaction-icon ${
                        transaction.type === "Credit"
                          ? "credit"
                          : "debit"
                      }`}
                    >
                      {transaction.type === "Credit"
                        ? "↓"
                        : "↑"}
                    </div>

                    <div>

                      <strong>
                        {transaction.name}
                      </strong>

                      <small>
                        {transaction.description}
                      </small>

                    </div>

                  </div>


                  <span>

                    {transaction.date}

                    <small>
                      {transaction.time}
                    </small>

                  </span>


                  <span
                    className={
                      transaction.type === "Credit"
                        ? "type-credit"
                        : "type-debit"
                    }
                  >
                    {transaction.type}
                  </span>


                  <strong
                    className={`transaction-amount ${
                      transaction.type === "Credit"
                        ? "credit-amount"
                        : "debit-amount"
                    }`}
                  >

                    {transaction.type === "Credit"
                      ? "+ "
                      : "- "}
                    ₹
                    {transaction.amount.toLocaleString(
                      "en-IN"
                    )}

                  </strong>


                  <span className="status completed">
                    {transaction.status}
                  </span>

                </div>

              ))

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