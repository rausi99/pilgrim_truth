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

      navigate("/discussions");
    } catch (error) {
      setError(error.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <section className="auth-editorial">

          {/* LEFT PANEL */}
          <div className="auth-editorial-panel">
            <div className="auth-panel-content">

              <div className="auth-panel-brand">
                <div className="auth-panel-mark">
                  <BookOpen size={20} />
                </div>

                <div>
                  <strong>PILGRIM</strong>
                  <span>TRUTH</span>
                </div>
              </div>

              <div className="auth-panel-main">
                <span className="auth-panel-label">
                  SEEKING TRUTH
                </span>

                <h1>
                  Continue your
                  <em> journey.</em>
                </h1>

                <p>
                  A place to study Scripture carefully,
                  ask meaningful questions, and grow in
                  understanding.
                </p>
              </div>

              <div className="auth-panel-quote">
                <span className="auth-quote-line"></span>

                <p>
                  “Search the Scriptures.”
                </p>

                <small>
                  John 5:39
                </small>
              </div>

            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="auth-form-panel">
            <div className="auth-form-container">

              <div className="auth-mobile-brand">
                <div className="auth-panel-mark">
                  <BookOpen size={20} />
                </div>

                <div>
                  <strong>PILGRIM</strong>
                  <span>TRUTH</span>
                </div>
              </div>

              <div className="auth-header">
                <span className="section-label">
                  WELCOME BACK
                </span>

                <h2>
                  Sign in to your
                  <em> account.</em>
                </h2>

                <p>
                  Continue exploring Scripture and join
                  thoughtful conversations.
                </p>
              </div>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="auth-form"
              >
                <div className="form-group">
                  <label htmlFor="login-email">
                    Email address
                  </label>

                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="form-label-row">
                    <label htmlFor="login-password">
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
                      id="login-password"
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
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  <span>
                    {loading
                      ? "Signing in..."
                      : "Sign In"}
                  </span>

                  {!loading && (
                    <ArrowRight size={18} />
                  )}
                </button>
              </form>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <p className="auth-switch">
                Don't have an account?{" "}
                <Link to="/register">
                  Create one
                </Link>
              </p>

            </div>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}

export default Login;