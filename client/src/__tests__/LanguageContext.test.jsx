import { renderHook, act } from "@testing-library/react";
import { useLanguage, LanguageProvider } from "../LanguageContext";
import { useTranslation } from "../i18n";
import React from "react";

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("provides default English language", () => {
    const wrapper = ({ children }) =>
      React.createElement(LanguageProvider, null, children);
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe("en");
  });

  test("changes language to Amharic", () => {
    const wrapper = ({ children }) =>
      React.createElement(LanguageProvider, null, children);
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.changeLanguage("am");
    });

    expect(result.current.language).toBe("am");
  });

  test("changes language back to English", () => {
    const wrapper = ({ children }) =>
      React.createElement(LanguageProvider, null, children);
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.changeLanguage("am");
      result.current.changeLanguage("en");
    });

    expect(result.current.language).toBe("en");
  });

  test("persists language to localStorage", () => {
    const wrapper = ({ children }) =>
      React.createElement(LanguageProvider, null, children);
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.changeLanguage("am");
    });

    const savedLanguage = localStorage.getItem("truck_expense_language");
    expect(savedLanguage).toBe("am");
  });

  test("retrieves language from localStorage on mount", () => {
    localStorage.setItem("truck_expense_language", "am");

    const wrapper = ({ children }) =>
      React.createElement(LanguageProvider, null, children);
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.language).toBe("am");
  });

  test("changeLanguage is callable", () => {
    const wrapper = ({ children }) =>
      React.createElement(LanguageProvider, null, children);
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(typeof result.current.changeLanguage).toBe("function");
  });
});

describe("i18n Translation Hook", () => {
  test("returns translations object", () => {
    const { result } = renderHook(() => useTranslation("en"));

    expect(typeof result.current).toBe("object");
    expect(result.current).not.toBeNull();
  });

  test("contains dashboard key", () => {
    const { result } = renderHook(() => useTranslation("en"));

    expect(result.current.dashboard).toBeDefined();
  });

  test("returns English translations", () => {
    const { result } = renderHook(() => useTranslation("en"));

    expect(result.current.dashboard).toBe("Dashboard");
    expect(result.current.drivers).toBe("Drivers");
    expect(result.current.trucks).toBe("Trucks");
  });

  test("returns Amharic translations", () => {
    const { result } = renderHook(() => useTranslation("am"));

    expect(result.current.dashboard).toBe("ዳሽቦርድ");
    expect(result.current.drivers).toBe("ስሪት");
    expect(result.current.trucks).toBe("ትራክ");
  });

  test("handles missing keys gracefully", () => {
    const { result } = renderHook(() => useTranslation("en"));

    // Non-existent keys should be undefined
    expect(result.current.nonExistentKey).toBeUndefined();
  });

  test("has common keys", () => {
    const { result } = renderHook(() => useTranslation("en"));

    // These keys should exist
    expect(result.current.logout).toBeDefined();
    expect(result.current.theme).toBeDefined();
    expect(result.current.language).toBeDefined();
  });
});
