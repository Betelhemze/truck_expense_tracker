import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeContext";
import { useLanguage } from "../LanguageContext";
import { getTranslation } from "../i18n";
import "../styles/settings.css";

export default function SettingsPanel() {
  const { theme, toggleTheme } = useTheme();

  const { language, changeLanguage } = useLanguage();

  const t = (key) => getTranslation(key, language);

  return (
    <div className="top-settings">
      {/* THEME TOGGLE */}
      <button className="theme-circle" onClick={toggleTheme}>
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* LANGUAGE SWITCH */}
      <div className="language-switch">
        <button
          className={language === "en" ? "lang-btn active" : "lang-btn"}
          onClick={() => changeLanguage("en")}
        >
          EN
        </button>

        <button
          className={language === "am" ? "lang-btn active" : "lang-btn"}
          onClick={() => changeLanguage("am")}
        >
          አማ
        </button>
      </div>
    </div>
  );
}
