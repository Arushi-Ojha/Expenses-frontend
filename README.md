# 💸 Expense Calculator App

A full-stack expense management application with user authentication, budget tracking, Google login integration, dynamic charts (bar + pie), OTP-based registration, and personalized dashboards — all wrapped in a clean and intuitive UI.

---

## 🧩 Features

- 🔐 **Secure User Authentication**
  - Email + OTP-based signup
  - Google Sign-In via OAuth2
  - Passwords are securely hashed using `bcrypt`

- 📊 **Expense Management**
  - Add, edit, delete expenses
  - Filter by date range
  - Sort by ascending or descending date
  - Track remaining monthly budget

- 📉 **Data Visualization**
  - Bar chart of spending trends
  - Pie chart breakdown by category

- 🧾 **User Dashboard**
  - View and edit user profile (email, budget, password)
  - Track real-time expenses and balance

---

## ⚙️ Tech Stack

### 💻 Frontend
- React + Vite
- Axios
- Recharts (BarChart + PieChart)
- React OAuth Google (`@react-oauth/google`)

### 🧠 Backend
- Node.js + Express.js
- MySQL (Relational DB)
- `bcrypt` for password hashing
- `nodemailer` for sending OTPs
- `google-auth-library` for verifying Google credentials
- `dotenv` for environment variables

---

## 🏗️ Folder Structure

