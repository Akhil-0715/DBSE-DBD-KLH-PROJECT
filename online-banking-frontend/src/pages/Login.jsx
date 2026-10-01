import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-icon">
          🏦
        </div>

        <h1>Welcome Back</h1>

        <p>
          Login to your online banking account
        </p>


        <form onSubmit={handleLogin}>

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              required
            />

          </div>


          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              required
            />

          </div>


          <button
            type="submit"
            className="login-submit"
          >
            Login
          </button>

        </form>


        <p className="register-text">
          Don't have an account?{" "}
          <span>Register</span>
        </p>

      </div>

    </div>
  );
}

export default Login;