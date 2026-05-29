import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { useLanguage } from "../LanguageContext";
import { getTranslation } from "../i18n";
import "../styles/auth.css";

export default function LoginPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const t = (key) => getTranslation(key, language);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    licenseNumber: "",
  });
  const [error, setError] = useState(null);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      if (isRegister) {
        await register({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: "driver",
          phone: form.phone,
          licenseNumber: form.licenseNumber,
        });
      } else {
        await login({ email: form.email, password: form.password });
      }
      navigate("/");
    } catch (err) {
      console.error("Auth submit error", err);
      setError(err.response?.data?.message || err.message || "Request failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-top-controls">
        <div className="theme-lang-selector">
          <button
            className={`toggle-btn ${theme === "light" ? "active" : ""}`}
            onClick={() => theme === "dark" && toggleTheme()}
            title={t("light")}
          >
            ☀️
          </button>
          <button
            className={`toggle-btn ${theme === "dark" ? "active" : ""}`}
            onClick={() => theme === "light" && toggleTheme()}
            title={t("dark")}
          >
            🌙
          </button>
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="lang-select"
          >
            <option value="en">EN</option>
            <option value="am">ኢ</option>
          </select>
        </div>
      </div>
      <div className="auth-card">
        <h1>{isRegister ? t("createAccount") : t("signIn")}</h1>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label>
                {t("fullName")}
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                {t("phone")}
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>
              <label>
                {t("licenseNumber")}
                <input
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleChange}
                />
              </label>
            </>
          )}
          <label>
            {t("email")}
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              required
            />
          </label>
          <label>
            {t("password")}
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              required
            />
          </label>
          {error && <div className="alert">{error}</div>}
          <button className="button primary" type="submit">
            {isRegister ? t("signUp") : t("signIn")}
          </button>
        </form>
        <button
          className="link-button"
          onClick={() => setIsRegister((prev) => !prev)}
        >
          {isRegister ? t("haveAccount") : t("noAccount")}
        </button>
      </div>
    </div>
  );
}
