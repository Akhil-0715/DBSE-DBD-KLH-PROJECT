import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showTerms, setShowTerms] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim(),
            mobileNumber: mobileNumber,
            password: password,
            kycStatus: "Pending",
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          typeof data === "string"
            ? data
            : data?.message ||
                "Registration failed. Please try again."
        );
        return;
      }

      if (!data) {
        setError(
          "Registration completed, but no confirmation was received from the server."
        );
        return;
      }

      alert(
        "Registration successful! Your customer profile and bank account have been created."
      );

      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-icon">
          🏦
        </div>

        <h1>
          Create Account
        </h1>

        <p>
          Register for your online banking account
        </p>

        <form onSubmit={handleRegister}>

          <div className="input-group">
            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              required
            />
          </div>


          <div className="input-group">
            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>


          <div className="input-group">
            <label>
              Mobile Number
            </label>

            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={mobileNumber}
              onChange={(event) =>
                setMobileNumber(event.target.value)
              }
              maxLength="10"
              inputMode="numeric"
              required
            />
          </div>


          <div className="input-group">
            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>


          <div className="input-group">
            <label>
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
            />
          </div>


          {/* Terms & Conditions */}

          <div
            style={{
              marginTop: "10px",
              marginBottom: "15px",
            }}
          >

            <label
              style={{
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >

              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) =>
                  setTermsAccepted(event.target.checked)
                }
              />

              <span>
                I agree to the{" "}
                <span
                  onClick={(event) => {
                    event.preventDefault();
                    setShowTerms(true);
                  }}
                  style={{
                    color: "#2563eb",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Terms & Conditions
                </span>
              </span>

            </label>

          </div>


          {error && (
            <p
              style={{
                color: "red",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              {error}
            </p>
          )}


          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>


        <p className="register-text">
          Already have an account?{" "}

          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            Login
          </span>
        </p>

      </div>


      {/* Terms & Conditions Modal */}

      {showTerms && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
            boxSizing: "border-box",
          }}
          onClick={() => setShowTerms(false)}
        >

          <div
            style={{
              backgroundColor: "#ffffff",
              width: "100%",
              maxWidth: "550px",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "25px",
              boxSizing: "border-box",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
            onClick={(event) => event.stopPropagation()}
          >

            <h2
              style={{
                marginTop: 0,
                marginBottom: "15px",
              }}
            >
              Terms & Conditions
            </h2>

            <p>
              By registering for the Online Banking System
              Simulation, you agree to the following terms:
            </p>

            <ol
              style={{
                lineHeight: "1.7",
                paddingLeft: "22px",
              }}
            >

              <li>
                The information provided during registration
                must be accurate and complete.
              </li>

              <li>
                You are responsible for keeping your login
                credentials confidential.
              </li>

              <li>
                Fund transfers can only be performed when
                the account satisfies the required banking
                conditions, including KYC verification.
              </li>

              <li>
                Transactions require sufficient available
                account balance.
              </li>

              <li>
                Fixed deposits are created according to the
                amount, tenure, interest rate, and payout
                option selected during the FD creation process.
              </li>

              <li>
                Bill payments are processed using the bill
                type, consumer number, and payment amount
                provided by the customer.
              </li>

              <li>
                Customers should review transaction details
                before confirming banking operations.
              </li>

              <li>
                This application is an academic Online Banking
                System Simulation developed for educational
                purposes and does not represent a real banking
                service.
              </li>

            </ol>

            <button
              type="button"
              onClick={() => setShowTerms(false)}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                backgroundColor: "#2563eb",
                color: "#ffffff",
              }}
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Register;