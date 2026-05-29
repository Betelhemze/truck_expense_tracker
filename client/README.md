# Truck Expense Tracker — Frontend

This folder contains the React frontend for the Truck Expense Tracker app.

## Setup

Install dependencies:

```bash
cd client
npm install
```

Create a `.env` file in `client/` with the backend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## Start

```bash
cd client
npm run dev
```

Open the displayed address in your browser.

## Pages included

- `/login` — login or register
- `/` — dashboard summary
- `/drivers` — create and list drivers
- `/trucks` — create and list trucks
- `/trips` — create and list trips
- `/expenses` — add and list expenses

## Backend integration

Frontend calls the backend at `VITE_API_URL`.

The app uses JWT authentication and stores the token in `localStorage`.

## Notes

- The current UI is a functional scaffold for your Figma design.
- Use the `client/src/styles.css` file to refine fonts, spacing, and component styles.
- Customize cards, tables, and forms to match your design system.
