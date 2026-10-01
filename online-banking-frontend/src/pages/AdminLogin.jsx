import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    if (email === "admin@onlinebank.com" && password === "admin123") {
      navigate("/admin-dashboard");
    } else {
      alert("Invalid admin email or password.");
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-icon">
          🛡️
        </div>

        <p className="admin-label">
          ADMIN PORTAL
        </p>

        <h1>
          Admin Login
        </h1>

        <p className="admin-subtitle">
          Sign in to manage the banking system.
        </p>


        <form onSubmit={handleLogin}>

          <div className="admin-input-group">

            <label>
              Admin Email
            </label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

          </div>


          <div className="admin-input-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />

          </div>


          <button
            type="submit"
            className="admin-login-button"
          >
            Login as Admin
          </button>

        </form>


        <button
          className="customer-login-link"
          onClick={() => navigate("/login")}
        >
          ← Back to Customer Login
        </button>

      </div>

    </div>
  );
}

export default AdminLogin;