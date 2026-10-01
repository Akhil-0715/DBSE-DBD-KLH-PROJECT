import { useNavigate } from "react-router-dom";
import "./LoginSelection.css";

function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="login-selection-page">

      <div className="login-selection-card">

        <div className="selection-icon">
          🏦
        </div>

        <p className="selection-label">
          ONLINE BANKING
        </p>

        <h1>
          Choose Login
        </h1>

        <p className="selection-subtitle">
          Select how you want to access the system.
        </p>


        <div className="login-options">


          {/* Customer */}

          <button
            className="login-option"
            onClick={() =>
              navigate("/login")
            }
          >

            <div className="option-icon">
              👤
            </div>

            <div className="option-content">

              <strong>
                User Login
              </strong>

              <span>
                Access your banking account
              </span>

            </div>

            <span className="option-arrow">
              →
            </span>

          </button>


          {/* Admin */}

          <button
            className="login-option"
            onClick={() =>
              navigate("/admin-login")
            }
          >

            <div className="option-icon admin-option-icon">
              🛡️
            </div>

            <div className="option-content">

              <strong>
                Admin Login
              </strong>

              <span>
                Manage the banking system
              </span>

            </div>

            <span className="option-arrow">
              →
            </span>

          </button>

        </div>


        <button
          className="selection-back"
          onClick={() =>
            navigate("/")
          }
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default LoginSelection;