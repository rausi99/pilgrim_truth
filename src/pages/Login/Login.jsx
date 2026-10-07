import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { loginUser } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      login(data);

      const isAdmin =
        data.user?.role === "admin" ||
        data.user?.role === "administrator";

      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/discussions");
      }
    } catch (error) {
      setError(
        error.message || "Unable to log in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <section className="auth-editorial">
          {/* LEFT EDITORIAL PANEL */}
          <div className="auth-editorial-panel">
            <div className="auth-panel-content">
              <div className="auth-panel-brand">
                <div className="auth-panel-mark">
                  <BookOpen size={24} strokeWidth={1.8} />
                </div>

                <span>PILGRIM TRUTH</span>
              </div>

              <div className="auth-panel-main">
                <span className="auth-panel-label">
                  WELCOME BACK
                </span>

                <h1>
                  Continue your
                  <em> journey.</em>
                </h1>

                <p>
                  Return to a place where faith,
                  Scripture, and meaningful
                  conversations come together.
                </p>
              </div>

              <div className="auth-panel-quote">
                <span className="auth-quote-line"></span>

                <blockquote>
                  "Your word is a lamp for my feet,
                  a light on my path."
                </blockquote>

                <cite>
                  — Psalm 119:105
                </cite>
              </div>
            </div>
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="auth-form-panel">
            <div className="auth-form-container">
              {/* MOBILE BRAND */}
              <div className="auth-mobile-brand">
                <div className="auth-panel-mark">
                  <BookOpen size={22} strokeWidth={1.8} />
                </div>

                <span>PILGRIM TRUTH</span>
              </div>

              {/* HEADER */}
              <div className="auth-header">
                <span className="section-label">
                  ACCOUNT
                </span>

                <h2>
                  Sign in to your
                  <em> account.</em>
                </h2>

                <p>
                  Enter your details below to
                  continue your journey with
                  Pilgrim Truth.
                </p>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div
                  className="auth-error"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* LOGIN FORM */}
              <form
                className="auth-form"
                onSubmit={handleSubmit}
              >
                {/* EMAIL */}
                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor="email"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label
                      className="form-label"
                      htmlFor="password"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="forgot-password"
                      onClick={() =>
                        alert(
                          "Password recovery will be available soon."
                        )
                      }
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="password-field">
                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  <span>
                    {loading
                      ? "Signing in..."
                      : "Sign in"}
                  </span>

                  {!loading && (
                    <ArrowRight
                      size={19}
                      strokeWidth={2}
                    />
                  )}
                </button>
              </form>

              {/* DIVIDER */}
              <div className="auth-divider">
                <span>OR</span>
              </div>

              {/* REGISTER LINK */}
              <div className="auth-switch">
                <span>
                  Don't have an account?
                </span>

                <Link to="/register">
                  Create Account
                  
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Login;
