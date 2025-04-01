# Cash Flow

Cash Flow is an interactive and intuitive personal finance management application designed to help individuals track income, manage expenses, and set achievable financial goals. The backend is powered by FastAPI and PostgreSQL, while the frontend leverages Next.js, TypeScript, and Sass, offering a modern and fast user experience. The application supports authentication, localization visual data analysis, and CRUD operations for all major financial entities.

## Table of Contents
- [Project Architecture](#project-architecture)
- [Pre-required Installation](#pre-required-installation)
- [Installation Guide](#installation-guide)
- [Features](#features)
- [Libraries and Tools](#libraries-and-tools)

## Project Architecture

### Backend Structure

```
api/
└── app/                                 # Core backend folder
    ├── core/                            # Core settings (security, auth helpers)
    │   └── security.py                  # Password hashing, JWT encoding/decoding
    │
    ├── db/                              # Database configuration
    │   └── database.py                  # SQLAlchemy async DB engine & session
    │
    ├── models/                          # SQLAlchemy ORM models
    │   ├── expense.py                   # Expense model
    │   ├── goal.py                      # Goal model
    │   ├── income.py                    # Income model
    │   ├── password_reset.py           # Model for password reset tokens
    │   └── user.py                      # User model
    │
    ├── routes/                          # FastAPI route definitions (endpoints)
    │   ├── auth.py                      # Auth routes (login, register, reset password)
    │   ├── expense.py                   # Expense routes (CRUD)
    │   ├── goal.py                      # Goal routes (CRUD)
    │   ├── income.py                    # Income routes (CRUD)
    │   └── profile.py                   # User profile routes (get/update, password change)
    │
    ├── schemas/                         # Pydantic schemas (request/response models)
    │   ├── expense.py                   # Expense request/response models
    │   ├── goal.py                      # Goal request/response models
    │   ├── income.py                    # Income request/response models
    │   ├── token.py                     # Token schema (JWT)
    │   └── user.py                      # User and auth-related schemas
    │
    ├── services/                        # Business logic (service layer)
    │   ├── email_service.py             # Sending emails (welcome, reset password)
    │   ├── expense_service.py           # Expense logic (CRUD)
    │   ├── goal_service.py              # Goal logic (CRUD)
    │   ├── income_service.py            # Income logic (CRUD)
    │   └── user_service.py              # User logic (auth, profile, password)
    │
    ├── templates/                       # Email templates (Jinja2)
    │   ├── reset_password_template.html # Template for reset password email
    │   └── welcome_email_template.html  # Template for welcome email
    │
    ├── tests/                           # Pytest unit tests for routes
    │   ├── conftest.py                  # Test setup and fixtures
    │   ├── test_auth.py                 # Tests for auth routes
    │   ├── test_expense.py              # Tests for expense routes
    │   ├── test_goal.py                 # Tests for goal routes
    │   ├── test_income.py               # Tests for income routes
    │   └── test_profile.py              # Tests for profile routes
    │
    └── main.py                          # FastAPI app instance and router mounting
requirements.txt                         # Python dependencies
pytest.ini                               # Pytest configuration
```

### Frontend Architecture
```
app/
│
├── public/                                      # Static assets (logo, images, etc.)
│
├── src/                                         # Application source folder
│
├── components/                                     # Reusable and modular UI components used across the app
│   ├── ConfirmModal/                               # Generic modal for confirm/cancel actions
│   ├── ExpenseLineChart/                           # Line chart for visualizing expense trends over time
│   ├── FAQ/                                        # Section displaying frequently asked questions
│   ├── FAQCard/                                    # Individual card displaying a question and its answer
│   ├── Footer/                                     # Footer component with links and branding
│   ├── ForgotPassword/                             # Modal for sending password reset email
│   ├── Functionalities/                            # Landing page section highlighting core app features
│   ├── GoalAdd/                                    # Button component for adding a new financial goal
│   ├── GoalDelete/                                 # Component to handle goal deletion with confirmation
│   ├── GoalEdit/                                   # Button/modal for editing an existing goal
│   ├── GoalItem/                                   # Card representing a single financial goal
│   ├── GoalList/                                   # List view of all user goals
│   ├── GoalModal/                                  # Main modal for creating or updating a goal
│   ├── GoTop/                                      # "Scroll to top" floating button
│   ├── HamburgerMenu/                              # Mobile sidebar menu for authenticated users
│   ├── HeroSection/                                # Hero banner on landing page with title and image
│   ├── IncomeBarChart/                             # Bar chart visualizing income by date
│   ├── Language/                                   # Dropdown to switch between supported languages (en/bs)
│   ├── Loading/                                    # Spinner with animated dots used during loading states
│   ├── Login/                                      # Login modal with email/password and forgot password link
│   ├── Logout/                                     # Logout button to clear auth and redirect to home
│   ├── NotFound/                                   # 404 page for invalid routes
│   ├── Notification/                               # Toast notifications (success, error, info)
│   ├── ProfileChangePassword/                      # Modal to change current user's password
│   ├── ProfileEdit/                                # Modal to update user profile information
│   ├── ProfileOverview/                            # Profile page showing user details and action buttons
│   ├── ProtectedRoute/                             # Route wrapper to protect private pages (dashboard, profile)
│   ├── PublicRoute/                                # Wrapper to redirect authenticated users from public pages
│   ├── Register/                                   # Registration modal with user input fields
│   ├── ResetPassword/                              # Page for resetting password using email token
│   ├── Theme/                                      # Theme switcher (light/dark mode)
│   ├── TopBar/                                     # Top navigation bar (logo, language, theme, auth actions)
│   ├── TransactionAdd/                             # Button for adding a new income/expense transaction
│   ├── TransactionDelete/                          # Button to delete a transaction with confirmation
│   ├── TransactionDownload/                        # Export filtered transactions as CSV
│   ├── TransactionEdit/                            # Button/modal for editing a transaction
│   ├── TransactionList/                            # Filterable and categorized list of transactions
│   ├── TransactionModal/                           # Modal form for creating or editing transactions
│   └── Unauthorized/                               # Page shown when user tries to access restricted route
│   │
│   ├── locales/                                 # Localization files
│   │   ├── bs/
│   │   │   └── global.json                      # Bosnian translations
│   │   └── en/
│   │       └── global.json                      # English translations
│
│   ├── pages/                                   # Next.js routing pages
│   │   ├── dashboard/                           # Dashboard page
│   │   ├── expense/                             # Expense page
│   │   ├── goal/                                # Goal page
│   │   ├── income/                              # Income page
│   │   ├── profile/                             # Profile page
│   │   ├── reset-password/                      # Password reset page
│   │   └── unauthorized/                        # Unauthorized access page
│   │   ├── _app.tsx                             # Custom App wrapper
│   │   ├── _error.tsx                           # Error page
│   │   └── index.tsx                            # Landing page
│
│   ├── providers/
│   │   └── I18nProvider.tsx                     # Internationalization provider (next-intl)
│
│   ├── store/                                   # Zustand store for global state
│   │   ├── useLanguageStore.ts                  # Language state
│   │   └── useThemeStore.ts                     # Theme state
│
│   ├── styles/
│   │   └── globals.scss                         # Global SCSS styles and theme variables
│
│   ├── types/                                   # Global TypeScript interfaces
│   │   ├── Goal.ts                              # Goal type definitions
│   │   └── TransactionItem.ts                   # Transaction type definitions
│
│   ├── utils/                                   # Utility helper functions
│   │   ├── auth.ts                              # Token decoding and auth check
│   │   └── categoryIcons.tsx                    # Category-icon mapping for transactions
│
├── .gitignore                                   # Files to ignore in Git
├── package.json                                 # NPM dependencies and scripts
├── package-lock.json                            # Exact dependency versions
├── tsconfig.json                                # TypeScript configuration
├── next.config.js                               # Next.js configuration
├── next-env.d.ts                                # Next.js type declarations
├── eslint.config.mjs                            # ESLint configuration

```

### Pre-required Installation

#### Backend:
1) Python 3.10+ - https://www.python.org/downloads/
2) PostgreSQL 13+ - https://www.postgresql.org/download/
3) Recommended: virtualenv

#### Backend:
1) Node.js v18+ - https://nodejs.org/en/download

### Installation Guide

#### Backend Installation:
1) Clone the repository:
```
git clone https://github.com/Kalaba01/cash-flow.git
cd cash-flow/api
```
2) Setup and activate environment
```
python -m venv venv
source venv/bin/activate
```
3) Install dependencies:
```
pip install -r requirements.txt
```
4) Configure environment variables in .env:
```
DATABASE_URL=you_url

EMAIL_SERVICE=your_service
EMAIL_PORT=your_port
EMAIL_USER=your_user
EMAIL_PASS=your_pass
SMTP_FROM=your_from

SECRET_KEY=your_key
ALGORITHM=your_algorithm
ACCESS_TOKEN_EXPIRE_MINUTES=your_minutes
```
5) Run the backend server:
```
uvicorn app.main:app --reload
```
The backend API will be available at http://localhost:8000

#### Frontend Installation:
1) Navigate to the frontend directory:
```
cd ../app
```
2) Install dependencies:
```
npm install
```
3) Start the frontend server:
```
npm run dev
```
The application will be available at http://localhost:3000

## Features

### Authentication
- JWT-based login, register, logout
- Forgot/reset password via email

### Income & Expenses
- Add, edit, delete transactions
- Visualized with Recharts (Bar, Line)
- Filter by category/date

### Financial Goals
- Set saving/spending targets
- Track progress in real-time

### Dashboard
- Visual insights (charts, trends)
- Combined income, expense, goal data

### Multi-language support
- English & Bosnian (i18n with next-intl)

### Theme
- Light/dark mode

## Libraries and Tools

| Libary/Tool       | Version  | Purpose                                             |
|-------------------|----------|-----------------------------------------------------|
| Backend           |          |                                                     |
| FastAPI           | 0.115.11 | Web framework for building APIs                     |
| SQLAlchemy        | 2.0.39   | ORM for database interaction                        |
| asyncpg           | 0.30.0   | Async PostgreSQL driver                             |
| psycopg2          | 2.9.10   | PostgreSQL driver                                   |
| aiosmtplib        | 4.0.0    | Async email sending via SMTP                        |
| email_validator   | 2.2.0    | Email validation library                            |
| python-jose       | 3.4.0    | JWT creation and verification                       |
| passlib           | 1.7.4    | Password hashing and security                       |
| bcrypt            | 4.3.0    | Password hashing backend                            |
| python-dotenv     | 1.1.0    | Environment variable loading                        |
| pydantic          | 2.10.6   | Data validation and settings management             |
| pydantic-settings | 2.8.1    | Environment-based config management                 |
| Jinja2            | 3.1.6    | Email templating engine                             |
| uvicorn           | 0.34.0   | ASGI server for running FastAPI                     |
| orjson            | 3.10.16  | Fast JSON parsing                                   |
| pytest            | 8.3.5    | Testing framework                                   |
| pytest-asyncio    | 0.26.0   | Async test support for pytest                       |
| httpx             | 0.28.1   | HTTP client for async testing                       |
| starlette         | 0.46.1   | ASGI toolkit used by FastAPI                        |
| Frontend          |          |                                                     |
| Next.js           | 15.2.3   | React framework for SSR, routing, and app structure |
| React             | 19.0.0   | JavaScript library for building user interfaces     |
| React DOM         | 19.0.0   | DOM rendering for React components                  |
| axios             | 1.8.4    | HTTP client for API communication                   |
| recharts          | 2.15.1   | Data visualization and chart rendering              |
| framer-motion     | 12.5.0   | Animations and transitions for React                |
| jwt-decode        | 4.0.0    | Decode JWT tokens on the client side                |
| next-intl         | 4.0.2    | Internationalization (i18n) support for Next.js     |
| react-icons       | 5.5.0    | Icon library for React apps                         |
| react-toastify    | 11.0.5   | Toast notifications for user feedback               |
| react-typed       | 2.0.12   | Typewriter animation effect                         |
| sass              | 1.86.0   | Styling with SCSS preprocessor                      |
| zustand           | 5.0.3    | Lightweight state management solution               |
