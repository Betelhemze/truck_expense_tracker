# 🚚 Truck Expense Tracker
A full-stack web application for managing truck expenses, trips, and drivers with multi-language support and dark/light theme.
---
## ✨ Features
### 🌙 Dark/Light Theme Support
- Toggle between light and dark modes
- Persistent theme selection (localStorage)
- Smooth transitions and theme animations
- Applied to all pages and components
- CSS variables for easy customization
### 🌍 Multi-Language Support
- **English (EN)** - Default language
- **Amharic (አማርኛ)** - Full Amharic translation
- 80+ translated UI labels and messages
- Language selector on login page and settings panel
- Persistent language selection
- Real-time UI translation
### ⚙️ Settings Panel
- Integrated in sidebar (desktop view)
- Theme switcher with visual feedback
- Language selector dropdown
- Quick access to all settings
---
## 🎯 PROJECT STATUS: 95% COMPLETE ✅
### What's Ready
- ✅ Complete authentication system
- ✅ 17 routed pages and components
- ✅ Full CRUD operations for Drivers, Trucks, Trips, Expenses
- ✅ Admin dashboard with analytics and charts
- ✅ Driver dashboard with personal metrics
- ✅ Real-time expense tracking
- ✅ Payment tracking and management
- ✅ Dark/Light theme system
- ✅ Multi-language internationalization
- ✅ Role-based access control
- ✅ Professional UI/UX
---
## 📋 QUICK START
### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn
### Installation
```bash
# Clone the repository
git clone <repo-url>
cd truck_expense_tracker
# Backend Setup
cd server
npm install
# Create .env file with MongoDB URI and JWT secret
npm start
# Frontend Setup (in another terminal)
cd client
npm install
npm run dev
```
### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- API Docs: http://localhost:5000/api/docs
---
## 🏗️ PROJECT STRUCTURE
```
truck_expense_tracker/
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── controller/    # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Auth, validation
│   │   └── validators/    # Input validation
│   ├── test/              # Test files
│   ├── jest.config.js
│   └── package.json
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── styles/        # CSS files
│   │   ├── App.jsx        # Main app component
│   │   ├── api.js         # API client
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx      
│   │   ├── LanguageContext.jsx   
│   │   ├── i18n.js               
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── PROJECT_STATUS.md      # Detailed project status
├── DEMO_GUIDE.md          # Complete demo walkthrough
└── README.md              # This file
```
---
## 🚀 KEY FEATURES
### For Administrators
- 📊 Comprehensive dashboard with analytics
- 👥 Driver management (add, edit, delete)
- 🚛 Truck fleet management
- 🛣️ Trip creation and tracking
- 💰 Expense management and breakdown
- 📈 Reports and profit analysis
- 🎯 Payment tracking per trip
- 🌍 Support for multiple languages
- 🌙 Dark/Light theme support
### For Drivers
- 📱 Personal dashboard with metrics
- 🛣️ View assigned trips
- 💸 Log trip expenses
- ✅ Mark trips as completed
- 📊 View personal profit/loss
- 🌍 Access to multiple languages
- 🌙 Preferred theme selection
---
## 🔐 Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin/Driver)
- Protected routes
- Secure session management
- Token persistence in localStorage
---
## 📊 TECHNOLOGY STACK
### Frontend
- React 18+
- React Router DOM
- Axios (HTTP client)
- Chart.js (Charts)
- CSS3 with CSS Variables
- Context API (State management)
### Backend
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Bcrypt (Password hashing)
- Express validation middleware
- Swagger API documentation
### Database
- MongoDB
- Collections: Users, Trips, Expenses, Trucks
# truck_expense_tracker
### Database
- MongoDB
- Collections: Users, Trips, Expenses, Trucks
# truck_expense_tracker
>>>>>>> d564d586c01056bdadbc2786a6ff1e1265fe5ed6
