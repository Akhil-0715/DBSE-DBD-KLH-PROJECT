import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          typeof data === "string"
            ? data
            : data?.message ||
                "Invalid admin email or password."
        );
        return;
      }

      if (!data) {
        setError(
          "Invalid response received from the server."
        );
        return;
      }

      localStorage.setItem(
        "admin",
        JSON.stringify(data)
      );

      navigate("/admin-dashboard");

    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
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


          {error && (
            <p
              style={{
                color: "#d92d20",
                marginTop: "10px",
                marginBottom: "10px",
                fontSize: "13px",
              }}
            >
              {error}
            </p>
          )}


          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login as Admin"}
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