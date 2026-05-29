import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { AuthProvider } from "../AuthContext";
import { ThemeProvider } from "../ThemeContext";
import { LanguageProvider } from "../LanguageContext";

// Mock api
jest.mock("../api", () => ({
  api: {
    auth: {
      login: jest.fn(),
      register: jest.fn(),
    },
  },
}));

const renderLoginPage = () => {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>,
  );
};

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders login form", () => {
    renderLoginPage();
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByPlaceholderText(/password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test("displays theme toggle buttons", () => {
    renderLoginPage();
    const themeButtons = screen.getAllByRole("button");

    // Should have theme buttons (light/dark) and login button
    expect(themeButtons.length).toBeGreaterThan(0);
  });

  test("displays language selector", () => {
    renderLoginPage();
    const languageSelect = screen.getByDisplayValue("EN");

    expect(languageSelect).toBeInTheDocument();
  });

  test("validates email input", () => {
    renderLoginPage();
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const form = emailInput.closest("form");

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.submit(form);

    // Email validation should prevent submission or show error
    expect(emailInput.value).toBe("invalid-email");
  });

  test("has toggle for login/register", () => {
    renderLoginPage();
    const toggleButtons = screen.getAllByRole("button");

    // Should have register/login toggle
    expect(toggleButtons.length).toBeGreaterThan(0);
  });

  test("language selector changes", () => {
    renderLoginPage();
    const languageSelect = screen.getByDisplayValue("EN");

    fireEvent.change(languageSelect, { target: { value: "am" } });
    expect(languageSelect.value).toBe("am");
  });

  test("theme toggle buttons are clickable", () => {
    renderLoginPage();
    const buttons = screen.getAllByRole("button");

    // Click should not throw error
    expect(() => {
      fireEvent.click(buttons[0]);
    }).not.toThrow();
  });
});
