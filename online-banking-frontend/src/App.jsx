import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LoginSelection from "./pages/LoginSelection";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import FixedDeposit from "./pages/FixedDeposit";
import BillPayment from "./pages/BillPayment";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login-selection"
          element={<LoginSelection />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/account"
          element={<Account />}
        />

        <Route
          path="/transfer"
          element={<Transfer />}
        />

        <Route
          path="/transactions"
          element={<Transactions />}
        />

        <Route
          path="/fixed-deposit"
          element={<FixedDeposit />}
        />

        <Route
          path="/bill-payment"
          element={<BillPayment />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;