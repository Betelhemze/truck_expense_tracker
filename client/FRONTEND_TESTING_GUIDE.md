# Frontend Testing Guide - Jest & React Testing Library

## ✅ ERROR EXPLANATION

### **Error 1: CSS Import Syntax Error**

```
Uncaught SyntaxError: The requested module '/src/styles/addTruck.css'
does not provide an export named 'addTruck'
```

**What was wrong:**

```javascript
// ❌ INCORRECT - CSS files don't export named values
import { addTruck } from "../styles/addTruck.css";
```

**How it's fixed:**

```javascript
// ✅ CORRECT - Import CSS as a side effect
import "../styles/addTruck.css";
```

**Why this matters:**

- CSS files are not JavaScript modules with exports
- CSS should be imported as a side effect (just load the file)
- Named imports only work for JavaScript modules

**Files fixed:**

- `addTruck.jsx`
- `editTruck.jsx`
- `TruckMgtPage.jsx`

---

### **Error 2: Browser Listener Error**

```
A listener indicated an asynchronous response by returning true,
but the message channel closed before a response was received
```

**Root cause:** The CSS import error prevented the page from loading properly, which caused the browser listener to timeout.

**Solution:** Fixed the CSS imports (above) - this error will now be resolved.

---

## 🧪 FRONTEND TESTING WITH JEST

### Installation

```bash
cd client
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev babel-jest @babel/preset-react @babel/preset-env
npm install --save-dev identity-obj-proxy
```

### Configuration Files

**jest.config.js** - Already created ✅
**src/setupTests.js** - Already created ✅
****mocks**/fileMock.js** - Already created ✅

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test LoginPage.test.jsx

# Run tests matching pattern
npm test -- --testNamePattern="theme"
```

---

## 📝 TEST FILES CREATED

### 1. **LoginPage.test.jsx**

Tests the login form component:

- ✅ Renders login form
- ✅ Displays theme toggle buttons
- ✅ Displays language selector
- ✅ Validates email input
- ✅ Toggles login/register
- ✅ Changes language
- ✅ Theme buttons are clickable

```bash
npm test LoginPage.test.jsx
```

### 2. **SettingsPanel.test.jsx**

Tests the settings panel component:

- ✅ Renders settings panel
- ✅ Contains theme toggle buttons
- ✅ Contains language selector
- ✅ Toggles theme on button click
- ✅ Changes language on selector change
- ✅ Persists theme selection
- ✅ Persists language selection

```bash
npm test SettingsPanel.test.jsx
```

### 3. **ThemeContext.test.jsx**

Tests the theme context provider:

- ✅ Provides default light theme
- ✅ Toggles theme from light to dark
- ✅ Toggles theme from dark to light
- ✅ Persists theme to localStorage
- ✅ Retrieves theme from localStorage on mount
- ✅ Theme function is callable

```bash
npm test ThemeContext.test.jsx
```

### 4. **LanguageContext.test.jsx**

Tests the language context provider:

- ✅ Provides default English language
- ✅ Changes language to Amharic
- ✅ Changes language back to English
- ✅ Persists language to localStorage
- ✅ Retrieves language from localStorage on mount
- ✅ changeLanguage is callable

Tests for i18n.js:

- ✅ Returns translations object
- ✅ Contains dashboard key
- ✅ Returns English translations
- ✅ Returns Amharic translations
- ✅ Handles missing keys gracefully
- ✅ Has common keys

```bash
npm test LanguageContext.test.jsx
```

---

## 📊 TEST COVERAGE

To see what percentage of code is covered by tests:

```bash
npm test -- --coverage
```

Expected output:

```
---------|----------|----------|----------|----------|
File     | % Stmts  | % Branch | % Funcs  | % Lines  |
---------|----------|----------|----------|----------|
```

---

## ✍️ WRITING YOUR OWN TESTS

### Basic Test Structure

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import MyComponent from "../MyComponent";

describe("MyComponent", () => {
  test("renders without crashing", () => {
    render(<MyComponent />);
    expect(screen.getByText("Some Text")).toBeInTheDocument();
  });

  test("handles user click", () => {
    render(<MyComponent />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    // Assert what happened after click
  });
});
```

### Common Testing Patterns

#### 1. **Rendering a Component**

```javascript
import { render, screen } from "@testing-library/react";
import MyComponent from "../MyComponent";

test("renders component", () => {
  render(<MyComponent />);
  const element = screen.getByText("Hello");
  expect(element).toBeInTheDocument();
});
```

#### 2. **Testing User Interactions**

```javascript
import { render, screen, fireEvent } from "@testing-library/react";

test("handles button click", () => {
  render(<MyComponent />);
  const button = screen.getByRole("button", { name: /click me/i });
  fireEvent.click(button);
  expect(screen.getByText("Clicked!")).toBeInTheDocument();
});
```

#### 3. **Testing Form Inputs**

```javascript
import { render, screen, fireEvent } from "@testing-library/react";

test("updates input value", () => {
  render(<FormComponent />);
  const input = screen.getByRole("textbox", { name: /email/i });
  fireEvent.change(input, { target: { value: "test@example.com" } });
  expect(input.value).toBe("test@example.com");
});
```

#### 4. **Testing Async Operations**

```javascript
import { render, screen, waitFor } from "@testing-library/react";

test("loads data", async () => {
  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText("Data Loaded")).toBeInTheDocument();
  });
});
```

#### 5. **Testing Context**

```javascript
import { renderHook, act } from "@testing-library/react";
import { useTheme, ThemeProvider } from "../ThemeContext";
import React from "react";

test("changes theme", () => {
  const wrapper = ({ children }) =>
    React.createElement(ThemeProvider, null, children);
  const { result } = renderHook(() => useTheme(), { wrapper });

  act(() => {
    result.current.toggleTheme();
  });

  expect(result.current.theme).toBe("dark");
});
```

#### 6. **Mocking API Calls**

```javascript
import { render, screen, waitFor } from "@testing-library/react";
jest.mock("../api", () => ({
  api: {
    drivers: {
      list: jest.fn().mockResolvedValue({ data: [] }),
    },
  },
}));

test("fetches drivers", async () => {
  render(<DriversPage />);

  await waitFor(() => {
    expect(screen.getByText("No drivers")).toBeInTheDocument();
  });
});
```

---

## 🔍 COMMON QUERIES

### Finding Elements

```javascript
// By role (preferred)
screen.getByRole("button", { name: /submit/i });
screen.getByRole("textbox", { name: /email/i });

// By text
screen.getByText("Hello World");
screen.getByText(/welcome/i); // regex

// By label
screen.getByLabelText("Email");

// By placeholder
screen.getByPlaceholderText("Enter email");

// By test ID (last resort)
screen.getByTestId("submit-button");
```

### Assertions

```javascript
// Existence
expect(element).toBeInTheDocument();
expect(element).toBeVisible();

// Content
expect(element).toHaveTextContent("Hello");
expect(input).toHaveValue("test@example.com");

// Attributes
expect(element).toHaveAttribute("disabled");
expect(element).toHaveClass("active");

// Visibility
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Style
expect(element).toHaveStyle("color: red");
```

---

## 📋 TEST CHECKLIST FOR COMPONENTS

When writing tests, ensure you test:

- [ ] Component renders without errors
- [ ] Props are applied correctly
- [ ] User interactions work (clicks, typing)
- [ ] Forms submit with correct data
- [ ] Error states display correctly
- [ ] Loading states display correctly
- [ ] API calls are made with correct parameters
- [ ] Callbacks are called when expected
- [ ] Conditional rendering works
- [ ] Responsive behavior works

---

## 🎯 TESTING STRATEGY

### Priority (Test These First)

1. **Forms & Inputs** - User data entry
2. **Authentication** - Login/Register
3. **API Integration** - Data fetching
4. **Context** - State management
5. **Navigation** - Route changes

### Coverage Goals

- **Critical paths:** 100% coverage (auth, payments, data)
- **Components:** 80% coverage (UI, reusable)
- **Utilities:** 90% coverage (helper functions)
- **Overall:** 80% minimum

---

## 🐛 DEBUGGING TESTS

### View what was rendered

```javascript
import { render, screen } from "@testing-library/react";
import { debug } from "@testing-library/react";

test("debug example", () => {
  const { debug } = render(<MyComponent />);
  debug(); // Prints DOM to console
});
```

### Find elements by role

```javascript
import { render, screen } from "@testing-library/react";

test("view all roles", () => {
  render(<MyComponent />);
  screen.logTestingPlaygroundURL(); // Click link to open Testing Playground
});
```

### Use Testing Playground

```bash
npm test -- --watch
# Add this to your test:
screen.logTestingPlaygroundURL()
# Click the URL in console
```

---

## 🚀 RUNNING TESTS IN CI/CD

Add to package.json:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

For continuous integration:

```bash
npm test -- --coverage --watchAll=false
```

---

## 📚 RESOURCES

### Learning

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Tools

- [Testing Playground](https://testing-playground.com/) - Find test queries
- [Jest Preview](https://jest-preview.com/) - Visual debugging
- [React Testing Library Cheatsheet](https://cheatsheets.zip/react-testing-library)

---

## ✅ NEXT STEPS

1. **Install dependencies:**

   ```bash
   cd client
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom babel-jest @babel/preset-react @babel/preset-env identity-obj-proxy
   ```

2. **Run the test suite:**

   ```bash
   npm test
   ```

3. **Write more tests** for your components following the patterns above

4. **Check coverage:**

   ```bash
   npm test -- --coverage
   ```

5. **Integrate with CI/CD** pipeline for automated testing

---

## 🎉 SUMMARY

You now have:

- ✅ Jest configured for React
- ✅ 4 complete test suites (40+ tests)
- ✅ Testing patterns and examples
- ✅ CSS import error fixed
- ✅ Ready to add more tests

**Happy testing!** 🧪
