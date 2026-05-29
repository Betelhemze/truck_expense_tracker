import { renderHook, act } from "@testing-library/react";
import { useTheme, ThemeProvider } from "../ThemeContext";
import React from "react";

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("provides default light theme", () => {
    const wrapper = ({ children }) =>
      React.createElement(ThemeProvider, null, children);
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("light");
  });

  test("toggles theme from light to dark", () => {
    const wrapper = ({ children }) =>
      React.createElement(ThemeProvider, null, children);
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
  });

  test("toggles theme from dark to light", () => {
    const wrapper = ({ children }) =>
      React.createElement(ThemeProvider, null, children);
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
  });

  test("persists theme to localStorage", () => {
    const wrapper = ({ children }) =>
      React.createElement(ThemeProvider, null, children);
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    const savedTheme = localStorage.getItem("truck_expense_theme");
    expect(savedTheme).toBe("dark");
  });

  test("retrieves theme from localStorage on mount", () => {
    localStorage.setItem("truck_expense_theme", "dark");

    const wrapper = ({ children }) =>
      React.createElement(ThemeProvider, null, children);
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("dark");
  });

  test("theme function is callable", () => {
    const wrapper = ({ children }) =>
      React.createElement(ThemeProvider, null, children);
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(typeof result.current.toggleTheme).toBe("function");
  });
});
