# 🚗 Vehicle Rental Management System (Backend API)

🌐 Live URL: https://your-live-url.com

A scalable and secure **Vehicle Rental Management System API** built with modern backend technologies.  
It supports authentication, role-based access control, vehicle management, booking system, and full CRUD operations.

---

## ✨ Features

### 🔐 Authentication & Authorization
- User Sign Up / Sign In
- JWT-based authentication
- Role-based access control (admin / customer)
- Password hashing using bcrypt

### 👤 User Management
- Create user (public)
- Login user (public)
- Update user (admin only & customer can update own profile)
- Delete user (admin)
- View user profile (admin can view all user's profile & user can view only own)

### 🚗 Vehicle Management
- Add new vehicle (admin)
- Update vehicle details (admin)
- Delete vehicle (admin)
- Get all available vehicles (public)

### 📅 Booking System
- Create booking (admin & customer)
- Update booking status (role based)
- Cancel booking (who had make a booking)
- View booking history (role based)

### 🛡️ Security
- JWT token verification middleware
- Protected routes
- Password encryption with bcryptjs

---

## 🛠️ Technology Stack

- **Backend Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Token)
- **Password Hashing:** bcryptjs
- **Environment Variables:** dotenv
- **Architecture:** Modular / Layered structure (Controller, Service, Route)

---


---

## ⚙️ Setup & Installation Guide

Follow the steps below to run the project locally:

---

### 1️⃣ Clone the Repository

```bash
git clone <repo_link>
cd project-folder-name
code .
npm install

.env => PORT=5000
        PG_CONNECTIN_STRING=your_postgres_connection_string
        TOKEN_SECRET=your_secret_key

npm run dev
```

### 2️⃣ Admin credentials

- **Email address:** walid.admin@gmail.com
- **Password:** aaBB1!2@
