# Truck Expense Tracker - DEMO GUIDE

## 🎬 Pre-Demo Setup (5 minutes)

### 1. Start Backend Server

```bash
cd server
npm start
# Expected output: Server running on http://localhost:5000
```

### 2. Start Frontend Dev Server

```bash
cd client
npm run dev
# Expected output: Local: http://localhost:5173
```

### 3. Test Data Setup (Optional)

Create test accounts in the database or use the registration page:

- **Admin Account:**
  - Email: admin@test.com
  - Password: admin123
  - Role: admin

- **Driver Account:**
  - Email: driver@test.com
  - Password: driver123
  - Role: driver

---

## 🎯 DEMO SCENARIO 1: Admin Workflow (10-15 minutes)

### Step 1: Login to Admin Account

1. Navigate to http://localhost:5173
2. Click "Sign Up" if no account exists or "Sign In" for existing
3. Enter admin credentials
4. Notice the **theme toggle (☀️🌙) and language selector (EN)** at top-right

### Step 2: Showcase Theme Switching

1. Click the **🌙 (Dark mode)** button
2. **Full UI transforms to dark theme**
3. Show how it affects:
   - Navigation sidebar
   - Forms and cards
   - Charts and tables
4. Click **☀️ (Light mode)** to switch back

### Step 3: Showcase Language Switching

1. Click the **language dropdown (EN)**
2. Select **አማርኛ (Amharic)**
3. **Entire UI translates to Amharic**
4. Show navigation items are now in Amharic
5. Button labels changed to Amharic
6. Switch back to EN (English)

### Step 4: Admin Dashboard Overview

1. Navigate to **Dashboard** (/)
2. Show metrics:
   - Total Revenue
   - Total Expense
   - Net Profit
   - Average Fuel/Trip
3. Show charts:
   - Monthly Revenue & Profit (Line Chart)
   - Expense Breakdown (Pie Chart)
   - Profit by Truck (Bar Chart)

### Step 5: Driver Management

1. Go to **Drivers** page
2. Click **Add Driver**
3. Fill in driver details:
   - Full Name: John Doe
   - Phone: 0911222333
   - License Number: LIC123456
4. Show the driver list with search/filter functionality
5. Show edit and delete capabilities
6. Show **Driver Management** page (different layout)

### Step 6: Truck Management

1. Go to **Trucks** page
2. Click **Add Truck**
3. Fill in truck details:
   - Truck Number: TRK001
   - Model: Volvo FH16
   - License Plate: AA-123-BB
4. Assign the driver created earlier
5. Show truck list and management options

### Step 7: Trip Management

1. Go to **Trips** page
2. Click **Add Trip**
3. Create a new trip:
   - Select Truck: TRK001
   - Select Driver: John Doe
   - Source: Addis Ababa
   - Destination: Dire Dawa
   - Load Type: Electronics
   - Income: $500
   - Departure Date: Today
4. Show trip list with status (Active/Completed)
5. Click on a trip to view **Trip Details**

### Step 8: Trip Details & Expenses

1. Open a trip from the list
2. Show trip information:
   - Route details
   - Income
   - Expense breakdown
   - Payment tracking
3. Show the **Expenses section** with:
   - Fuel expenses
   - Maintenance costs
   - Other expenses
   - Total expense calculation

### Step 9: Expense Tracking

1. Go to **Expenses** page
2. Show existing expenses
3. Create a new expense:
   - Trip: Select a trip
   - Type: Fuel
   - Amount: $50
   - Date: Today
4. Show expense list updates
5. Demonstrate expense filtering

### Step 10: Reports & Analytics

1. Go to **Reports** page (/dashboard/admin/report)
2. Show comprehensive analytics:
   - Summary cards (Revenue, Expense, Profit)
   - Expense breakdown by type
   - Profit by truck table
   - Recent trips table
3. Show **Export to Excel** button (UI ready)

### Step 11: Settings & Preferences

1. Open **Sidebar Settings Panel**
2. Show **Theme Toggle** (Light/Dark)
3. Show **Language Selector** (English/Amharic)
4. Toggle to Amharic to show translations
5. Toggle to Dark mode
6. Verify settings persist on page reload

---

## 🎯 DEMO SCENARIO 2: Driver Workflow (8-10 minutes)

### Step 1: Login as Driver

1. Logout from admin account
2. Login with driver credentials
3. Verify only driver-specific menu items are shown:
   - Dashboard
   - Trips
   - Expenses

### Step 2: Driver Dashboard

1. View **Driver Dashboard**
2. Show personal metrics:
   - Total Trips
   - Active Trips: 1
   - Completed Trips
   - Total Income
   - Net Profit
3. Show **Quick Actions** button

### Step 3: View Assigned Trips

1. Go to **Trips**
2. Show only assigned trips (filtered automatically)
3. Show trip cards with:
   - Route (Source → Destination)
   - Load Type
   - Status (Active/Completed)
   - Total Expenses
   - Net Profit

### Step 4: Log Expense for Active Trip

1. Click on an **active trip**
2. See trip details and current expenses
3. Click **Add Expense**
4. Fill expense form:
   - Type: Fuel
   - Amount: $30
   - Description: Diesel at pump
5. Submit
6. Show expense appears in the list
7. Show profit recalculates

### Step 5: Mark Trip as Completed

1. Go back to active trip
2. Click **Mark as Completed** button
3. Confirm action
4. Trip status changes from "Active" to "Completed"
5. Trip moves to completed list

### Step 6: Settings Access

1. Show SettingsPanel in sidebar
2. Toggle theme (Light/Dark)
3. Switch language to Amharic
4. Show how driver interface translates

---

## 🎨 THEME & LANGUAGE DEMO HIGHLIGHTS

### Light Theme Features

- ✨ Clean white background
- ✨ Clear contrast for readability
- ✨ Professional appearance

### Dark Theme Features

- 🌙 Easy on the eyes
- 🌙 Modern appearance
- 🌙 Persistent across pages

### English (Default)

- Complete UI in English
- Professional terminology
- Clear action labels

### Amharic (አማርኛ)

- Complete UI translation
- All buttons and labels in Amharic
- Navigation items translated
- Dialog messages translated
- Error messages translated

---

## ⏱️ TIMING GUIDE

| Component        | Duration        |
| ---------------- | --------------- |
| Backend Startup  | 2 min           |
| Frontend Startup | 2 min           |
| Theme Demo       | 2 min           |
| Language Demo    | 2 min           |
| Admin Workflow   | 12 min          |
| Driver Workflow  | 8 min           |
| **Total**        | **~30 minutes** |

---

## ✅ DEMO CHECKLIST

### Pre-Demo

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB database accessible
- [ ] Test accounts created (or registration ready)
- [ ] Browser dev tools closed
- [ ] Full screen ready

### During Demo

- [ ] Show login page with theme/language controls
- [ ] Toggle theme successfully
- [ ] Switch language to Amharic successfully
- [ ] Complete admin workflow
- [ ] Complete driver workflow
- [ ] Show theme persistence
- [ ] Show language persistence
- [ ] Demonstrate all CRUD operations
- [ ] Show error handling (optional)
- [ ] Answer questions

### Post-Demo

- [ ] Document feedback
- [ ] Note any issues
- [ ] Plan next updates
- [ ] Thank audience

---

## 🚨 TROUBLESHOOTING

### "Backend not connecting"

```
Solution:
1. Verify backend is running: http://localhost:5000/api
2. Check MongoDB connection string in server/.env
3. Restart backend server
```

### "Theme not changing"

```
Solution:
1. Clear browser cache (Ctrl+Shift+Del)
2. Check browser console for errors
3. Verify theme CSS is loaded
```

### "Language not translating"

```
Solution:
1. Check console for translation errors
2. Verify language context is initialized
3. Reload page and try again
```

### "Page styling broken"

```
Solution:
1. Run: npm install in affected directory
2. Clear node_modules and reinstall
3. Check CSS imports in component
```

---

## 💡 DEMO TIPS

1. **Speak Clearly**: Explain what you're doing
2. **Slow Down**: Give audience time to follow
3. **Highlight**: Point out specific features
4. **Interactive**: Let audience ask questions
5. **Backup Plan**: Have screenshots ready if something breaks
6. **Time Management**: Keep to schedule
7. **Enthusiasm**: Show pride in the project!

---

## 🎊 CONCLUSION STATEMENT

> "This Truck Expense Tracker is a complete, production-ready solution for managing transportation expenses. It features comprehensive admin and driver dashboards, real-time expense tracking, modern dark/light theme support, and multi-language internationalization including Amharic. The system is fully integrated, tested, and ready for deployment."

---

**Happy Presenting! 🚀**
