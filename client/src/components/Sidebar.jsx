import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import { getTranslation } from "../i18n";
import SettingsPanel from "./SettingsPanel";

const items = [
  { path: "/", labelKey: "dashboard" },
  { path: "/drivers", labelKey: "drivers" },
  { path: "/trucks", labelKey: "trucks" },
  { path: "/trips", labelKey: "trips" },
  { path: "/expenses", labelKey: "expenses" },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const { language } = useLanguage();
  const t = (key) => getTranslation(key, language);

  const filteredItems = items.filter((item) => {
    if (user?.role === "driver") {
      return (
        item.path === "/" || item.path === "/trips" || item.path === "/expenses"
      );
    }
    return true;
  });

  return (
    <aside className="sidebar">
      <div className="brand">Truck Expense</div>
      <nav>
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-content">
        <SettingsPanel />
      </div>
      <div className="sidebar-footer">
        <div className="user-label">{user?.fullName}</div>
        <button className="button secondary" onClick={logout}>
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}
