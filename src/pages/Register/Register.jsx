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
import { registerUser } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      login(data);

      setSuccess("Account created successfully.");

      setTimeout(() => {
        navigate("/discussions");
      }, 700);
    } catch (error) {
      setError(
        error.message ||
          "Unable to create your account."
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

          {/* LEFT PANEL */}
          <div className="auth-editorial-panel register-panel">
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
                  JOIN THE JOURNEY
                </span>

                <h1>
                  Learn.
                  <br />
                  Question.
                  <br />
                  <em>Discover.</em>
                </h1>

                <p>
                  Become part of a growing community
                  committed to thoughtful study and
                  honest questions.
                </p>
              </div>

              <div className="auth-panel-quote">
                <span className="auth-quote-line"></span>

                <p>
                  “Buy the truth, and sell it not.”
                </p>

                <small>
                  Proverbs 23:23
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
                  JOIN THE COMMUNITY
                </span>

                <h2>
                  Begin your
                  <em> journey.</em>
                </h2>

                <p>
                  Create your account and become part
                  of the Pilgrim Truth community.
                </p>
              </div>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              {success && (
                <div className="auth-success">
                  {success}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="auth-form"
              >
                <div className="form-group">
                  <label htmlFor="register-name">
                    Full name
                  </label>

                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-email">
                    Email address
                  </label>

                  <input
                    id="register-email"
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
                  <label htmlFor="register-password">
                    Password
                  </label>

                  <div className="password-field">
                    <input
                      id="register-password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
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

                <div className="form-group">
                  <label htmlFor="register-confirm-password">
                    Confirm password
                  </label>

                  <div className="password-field">
                    <input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
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
                      ? "Creating account..."
                      : "Create Account"}
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
                Already have an account?{" "}
                <Link to="/login">
                  Login
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

export default Register;