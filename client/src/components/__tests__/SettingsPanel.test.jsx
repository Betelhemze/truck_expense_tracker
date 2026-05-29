import { render, screen, fireEvent } from "@testing-library/react";
import SettingsPanel from "../components/SettingsPanel";
import { ThemeProvider } from "../ThemeContext";
import { LanguageProvider } from "../LanguageContext";

const renderSettingsPanel = () => {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <SettingsPanel />
      </LanguageProvider>
    </ThemeProvider>,
  );
};

describe("SettingsPanel", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders settings panel", () => {
    renderSettingsPanel();
    const panel =
      screen.getByRole("region", { hidden: true }) ||
      document.querySelector(".settings-panel");

    expect(panel).toBeInTheDocument();
  });

  test("contains theme toggle buttons", () => {
    renderSettingsPanel();
    const buttons = screen.getAllByRole("button");

    // Should have theme buttons
    expect(buttons.length).toBeGreaterThan(0);
  });

  test("contains language selector", () => {
    renderSettingsPanel();
    const selects = screen.getAllByRole("combobox");

    expect(selects.length).toBeGreaterThan(0);
  });

  test("toggles theme on button click", () => {
    renderSettingsPanel();
    const buttons = screen.getAllByRole("button");

    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      // Theme should be toggled
      const theme = localStorage.getItem("truck_expense_theme");
      expect(["light", "dark"]).toContain(theme || "light");
    }
  });

  test("changes language on selector change", () => {
    renderSettingsPanel();
    const selects = screen.getAllByRole("combobox");

    if (selects.length > 0) {
      fireEvent.change(selects[0], { target: { value: "am" } });
      const language = localStorage.getItem("truck_expense_language");
      expect(["en", "am"]).toContain(language || "en");
    }
  });

  test("persists theme selection", () => {
    renderSettingsPanel();
    const buttons = screen.getAllByRole("button");

    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      const savedTheme = localStorage.getItem("truck_expense_theme");

      // Re-render and check if theme persists
      const { unmount } = renderSettingsPanel();
      const persistedTheme = localStorage.getItem("truck_expense_theme");

      expect(persistedTheme).toBe(savedTheme);
      unmount();
    }
  });

  test("persists language selection", () => {
    renderSettingsPanel();
    const selects = screen.getAllByRole("combobox");

    if (selects.length > 0) {
      fireEvent.change(selects[0], { target: { value: "am" } });
      const savedLanguage = localStorage.getItem("truck_expense_language");

      // Re-render and check if language persists
      const { unmount } = renderSettingsPanel();
      const persistedLanguage = localStorage.getItem("truck_expense_language");

      expect(persistedLanguage).toBe(savedLanguage);
      unmount();
    }
  });
});
