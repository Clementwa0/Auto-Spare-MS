# Auto-Spare Management System

A modern, full-stack Auto Spare Management System designed to streamline inventory management, point-of-sale operations, sales tracking, and business reporting for automotive spare parts businesses. The application provides secure authentication, branch management, inventory control, and real-time operational insights through an intuitive web interface.

## Live Demo

**Application:** https://auto-spares.vercel.app/login

## Features

### Authentication & Authorization

* Secure user authentication
* Role-based access control
* Protected routes
* Password hashing
* JWT authentication

### Dashboard

* Business overview
* Inventory statistics
* Sales summary
* Quick insights
* Responsive dashboard

### Inventory Management

* Manage spare parts
* Product categories
* Stock tracking
* Inventory updates
* Product search

### Point of Sale (POS)

* Fast sales processing
* Shopping cart functionality
* Sales calculation
* Receipt generation
* Customer checkout workflow

### Branch Management

* Multi-branch support
* Branch switching
* Branch-specific inventory
* Centralized management

### Sales Management

* Record sales transactions
* Sales history
* Revenue tracking
* Sales reports

### Expense Management

* Record business expenses
* Expense tracking
* Financial reporting

### Reporting

* Business reports
* PDF generation
* Operational summaries

---

# Technology Stack

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* Radix UI
* Lucide React
* Sonner
* jsPDF

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Security

* JWT Authentication
* bcryptjs
* Helmet
* Express Rate Limit
* CORS
* Environment Variables

## Development Tools

* Git
* GitHub
* VS Code
* pnpm

---

# Project Structure

```text
Auto-Spare-MS
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── public/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
└── README.md
```

---

# Installation

## Clone the repository

```bash
git clone https://github.com/Clementwa0/Auto-Spare-MS.git

cd Auto-Spare-MS
```

## Install Frontend

```bash
cd client

pnpm install
```

## Install Backend

```bash
cd ../server

pnpm install
```

---

# Environment Variables

### Backend (.env)

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# Running the Application

### Backend

```bash
cd server

pnpm dev
```

### Frontend

```bash
cd client

pnpm dev
```

Open:

```
http://localhost:5173
```

---

# API Modules

* Authentication
* Users
* Branches
* Categories
* Spare Parts
* Sales
* Expenses

---

# Security Features

* JWT-based authentication
* Password hashing using bcrypt
* Helmet security headers
* API rate limiting
* Protected API routes
* Environment variable configuration

---

# Future Improvements

* Barcode scanning
* Supplier management
* Purchase order management
* Low stock alerts
* Email notifications
* Sales analytics dashboard
* Automated backups
* Docker deployment
* CI/CD with GitHub Actions
* Unit and integration testing

---

# Learning Outcomes

This project strengthened my practical experience in:

* Full-stack software development
* REST API design
* Backend architecture
* Authentication and authorization
* Database modeling
* Business process automation
* Responsive frontend development
* Secure application development
* Version control with Git
* Problem-solving and debugging

---

# Author

**Clement Wambua Muli**

Portfolio: https://codewithmuli.vercel.app

GitHub: https://github.com/Clementwa0

Email: [clementwa01@gmail.com](mailto:clementwa01@gmail.com)

---

# License

This project is available under the MIT License. See the `LICENSE` file for more information.
