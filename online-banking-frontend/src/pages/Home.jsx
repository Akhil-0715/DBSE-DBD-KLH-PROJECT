import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* Navbar */}

      <nav className="navbar">

        <div className="logo">
          <span>🏦</span>
          <span>OnlineBank</span>
        </div>

        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#services">
            Services
          </a>

          <a href="#about">
            About
          </a>

          <button
            onClick={() =>
              navigate("/login-selection")
            }
          >
            Login
          </button>

        </div>

      </nav>


      {/* Hero */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <p className="hero-label">
            WELCOME TO ONLINE BANKING
          </p>

          <h1>
            Banking made
            <br />
            <span>
              simple and secure.
            </span>
          </h1>

          <p className="hero-description">
            Manage your account, transfer money, create
            fixed deposits, and track your transactions —
            all in one place.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/login-selection")
            }
          >
            Get Started
          </button>

        </div>

      </section>


      {/* Services */}

      <section
        className="services"
        id="services"
      >

        <p className="section-label">
          OUR SERVICES
        </p>

        <h2>
          Banking services in one place
        </h2>


        <div className="service-grid">


          <div className="service-card">

            <div className="service-icon">
              💳
            </div>

            <h3>
              Account Management
            </h3>

            <p>
              Manage customer accounts and view
              account information.
            </p>

          </div>


          <div className="service-card">

            <div className="service-icon">
              💸
            </div>

            <h3>
              Fund Transfer
            </h3>

            <p>
              Transfer money between accounts and
              keep track of transfers.
            </p>

          </div>


          <div className="service-card">

            <div className="service-icon">
              🏦
            </div>

            <h3>
              Fixed Deposit
            </h3>

            <p>
              Create fixed deposits and manage
              interest information.
            </p>

          </div>


          <div className="service-card">

            <div className="service-icon">
              📄
            </div>

            <h3>
              Transactions
            </h3>

            <p>
              View transaction history and track
  account activity.
            </p>

          </div>

        </div>

      </section>


      {/* About */}

      <section
        className="about"
        id="about"
      >

        <p className="section-label">
          ABOUT THE PROJECT
        </p>

        <h2>
          Simple online banking simulation
        </h2>

        <p>
          The Online Banking System Simulation brings
          essential banking operations together into one
          platform. It helps manage accounts, fund transfers,
          fixed deposits, and transaction records in an
          organized manner.
        </p>

      </section>


      {/* Footer */}

      <footer>

        <p>
          © 2026 Online Banking System Simulation
        </p>

      </footer>

    </div>
  );
}

export default Home;