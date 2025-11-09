<div align="center">
  <img src="./freepik__-saas-notesapp-adminuser-it-favicon-tech-vercel-no__60669.png" alt="Notes App Logo" width="120" height="120">
  
  # 📝 Notes SaaS Application
  
  ### A Modern, Production-Ready Full-Stack Notes Management Platform
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
  [![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=flat&logo=React&logoColor=white)](https://reactjs.org)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=flat&logo=Docker&logoColor=white)](https://www.docker.com)
  
  [Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation) • [Contributing](#-contributing)
  
</div>

---

## ✨ Features

### 🔐 Authentication & Security
- **User Registration** with email verification
- **JWT-based Authentication** with access & refresh tokens
- **Token Rotation** for enhanced security
- **Password Reset** via email
- **Bcrypt Password Hashing**
- **Role-Based Access Control (RBAC)** - User & Admin roles

### 📄 Notes Management
- **Full CRUD Operations** - Create, Read, Update, Delete notes
- **Visibility Levels**:
  - 🔒 **Private** - Only you can see
  - 🌍 **Public** - Everyone can see
  - 🔗 **Unlisted** - Only with link
- **Draft Mode** - Save work in progress
- **Tagging System** - Organize with tags
- **Rich Text Support** - Format your notes
- **Search & Filter** - Find notes quickly

### 👨‍💼 Admin Features
- **User Management Dashboard**
  - View all users
  - Change user roles
  - Activate/Deactivate accounts
- **Audit Logging**
  - Track all system activities
  - Monitor user actions
  - View detailed logs with IP & User Agent
- **System Statistics**
  - User metrics
  - Activity tracking
  - Real-time insights

### 🎨 Modern UI/UX
- **Ultra-Modern Design** with glassmorphism effects
- **Animated Backgrounds** - Aurora & particle effects
- **Smooth Animations** - Framer Motion powered
- **Dark/Light Mode** support
- **Responsive Design** - Works on all devices
- **Gradient Accents** - Beautiful color schemes
- **Interactive Components** - Hover effects & micro-interactions

## 🖼️ Demo

### Screenshots

<div align="center">
  <img src="./screenshots/login.png" alt="Login Page" width="45%">
  <img src="./screenshots/register.png" alt="Register Page" width="45%">
  <img src="./screenshots/notes-list.png" alt="Notes List" width="45%">
  <img src="./screenshots/note-editor.png" alt="Note Editor" width="45%">
  <img src="./screenshots/admin-panel.png" alt="Admin Panel" width="45%">
  <img src="./screenshots/audit-log.png" alt="Audit Log" width="45%">
</div>

### Demo Accounts

| Role  | Email | Password |
|-------|-------|----------|
| 👑 Admin | `admin@example.com` | `AdminPass123!` |
| 👤 User | `user@example.com` | `UserPass123!` |

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Git](https://git-scm.com/downloads)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/atyakshev0405-star/Notes-SaaS-Application.git
cd Notes-SaaS-Application
```

2. **Copy environment configuration**
```bash
cp .env.example .env
```

3. **Start the application**
```bash
docker-compose up --build
```

4. **Run database migrations**
```bash
docker-compose exec backend alembic upgrade head
```

5. **Access the application**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8000
- 📚 **API Documentation**: http://localhost:8000/docs
- 📧 **MailHog** (Email Testing): http://localhost:8025

That's it! The application is now running with demo accounts ready to use. 🎉

## 🛠️ Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web framework
- **[SQLAlchemy](https://www.sqlalchemy.org/)** - SQL toolkit and ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Redis](https://redis.io/)** - In-memory data store for tokens
- **[Alembic](https://alembic.sqlalchemy.org/)** - Database migrations
- **[Pydantic](https://docs.pydantic.dev/)** - Data validation
- **[PyJWT](https://pyjwt.readthedocs.io/)** - JWT implementation
- **[Bcrypt](https://github.com/pyca/bcrypt/)** - Password hashing
- **[Pytest](https://pytest.org/)** - Testing framework

### Frontend
- **[React 18](https://react.dev/)** - UI library
- **[Vite](https://vitejs.dev/)** - Build tool
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[React Router](https://reactrouter.com/)** - Routing
- **[React Query](https://tanstack.com/query/)** - Data fetching
- **[Axios](https://axios-http.com/)** - HTTP client
- **[shadcn/ui](https://ui.shadcn.com/)** - UI components
- **[Lucide Icons](https://lucide.dev/)** - Icon library

### DevOps
- **[Docker](https://www.docker.com/)** - Containerization
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container orchestration
- **[MailHog](https://github.com/mailhog/MailHog)** - Email testing tool

## 📚 Documentation

### API Endpoints

#### Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/verify-email/{token}` | Verify email address | ❌ |
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/refresh` | Refresh access token | ❌ |
| POST | `/auth/logout` | User logout | ✅ |
| POST | `/auth/forgot-password` | Request password reset | ❌ |
| POST | `/auth/reset-password` | Reset password with token | ❌ |

#### Notes (`/notes`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notes` | Get user's notes | ✅ |
| POST | `/notes` | Create new note | ✅ |
| GET | `/notes/{id}` | Get note by ID | ✅ |
| PUT | `/notes/{id}` | Update note | ✅ |
| DELETE | `/notes/{id}` | Delete note | ✅ |
| GET | `/notes/public` | Get all public notes | ❌ |

#### Admin (`/admin`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/users` | Get all users | ✅ Admin |
| PUT | `/admin/users/{id}/role` | Change user role | ✅ Admin |
| PUT | `/admin/users/{id}/status` | Activate/deactivate user | ✅ Admin |
| GET | `/admin/audit` | Get audit logs | ✅ Admin |

### Interactive API Documentation

Visit http://localhost:8000/docs for the full interactive Swagger UI documentation.

## 💻 Development

### Local Development Setup

#### Backend Development
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Development
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Tests

#### Backend Tests
```bash
# Run all tests
docker-compose exec backend pytest

# Run with coverage
docker-compose exec backend pytest --cov=app --cov-report=html

# Run specific test file
docker-compose exec backend pytest app/tests/test_auth.py
```

#### Frontend Tests
```bash
# Run tests
docker-compose exec frontend npm test

# Run tests in watch mode
docker-compose exec frontend npm test -- --watch
```

### Database Migrations

```bash
# Create a new migration
docker-compose exec backend alembic revision --autogenerate -m "Description"

# Apply migrations
docker-compose exec backend alembic upgrade head

# Rollback migration
docker-compose exec backend alembic downgrade -1
```

## 📁 Project Structure

```
Notes-SaaS-Application/
├── 📂 backend/                 # FastAPI Backend
│   ├── 📂 app/
│   │   ├── 📂 api/            # API Routes
│   │   │   ├── __init__.py
│   │   │   ├── auth.py        # Authentication endpoints
│   │   │   ├── notes.py       # Notes CRUD endpoints
│   │   │   ├── admin.py       # Admin endpoints
│   │   │   └── deps.py        # Dependencies
│   │   ├── 📂 core/           # Core Configuration
│   │   │   ├── config.py      # Settings
│   │   │   └── security.py    # JWT & Security
│   │   ├── 📂 db/             # Database
│   │   │   ├── session.py     # DB Session
│   │   │   ├── init_db.py     # DB Initialization
│   │   │   └── 📂 migrations/ # Alembic Migrations
│   │   ├── 📂 models/         # SQLAlchemy Models
│   │   │   ├── user.py
│   │   │   ├── note.py
│   │   │   └── audit_log.py
│   │   ├── 📂 schemas/        # Pydantic Schemas
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── note.py
│   │   │   └── audit_log.py
│   │   ├── 📂 services/       # Business Logic
│   │   │   ├── auth.py
│   │   │   ├── email.py
│   │   │   └── audit.py
│   │   ├── 📂 tests/          # Tests
│   │   │   ├── conftest.py
│   │   │   ├── test_auth.py
│   │   │   └── test_notes.py
│   │   └── main.py            # FastAPI App
│   ├── Dockerfile
│   ├── requirements.txt
│   └── alembic.ini
│
├── 📂 frontend/                # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/     # Reusable Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── 📂 ui/         # UI Components
│   │   ├── 📂 pages/          # Page Components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── NotesList.jsx
│   │   │   ├── NoteEditor.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── AuditLog.jsx
│   │   ├── 📂 hooks/          # Custom Hooks
│   │   │   └── useAuth.jsx
│   │   ├── 📂 contexts/       # React Contexts
│   │   │   └── ThemeContext.jsx
│   │   ├── 📂 lib/            # Utilities
│   │   │   └── utils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 📂 screenshots/             # Application Screenshots
├── docker-compose.yml          # Docker Compose Configuration
├── .env.example                # Environment Variables Template
├── .gitignore                  # Git Ignore Rules
├── LICENSE                     # MIT License
├── CONTRIBUTING.md             # Contribution Guidelines
└── README.md                   # This File
```

## 🔒 Security Features

- ✅ **Password Hashing** - Bcrypt with salt
- ✅ **JWT Authentication** - Access & Refresh tokens
- ✅ **Token Rotation** - Automatic refresh token rotation
- ✅ **RBAC** - Role-based access control
- ✅ **Input Validation** - Pydantic schemas
- ✅ **CORS Protection** - Configured origins
- ✅ **SQL Injection Prevention** - SQLAlchemy ORM
- ✅ **XSS Protection** - React's built-in protection
- ✅ **Audit Logging** - Track all sensitive operations
- ✅ **Email Verification** - Confirm user emails
- ✅ **Rate Limiting** - Redis-based (ready for production)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💻 Make your changes
4. ✅ Run tests
5. 📝 Commit your changes (`git commit -m 'Add amazing feature'`)
6. 🚀 Push to the branch (`git push origin feature/amazing-feature`)
7. 🎉 Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) for the amazing Python framework
- [React](https://react.dev/) for the powerful UI library
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

<div align="center">
  Made with ❤️ by the Notes SaaS Team
  
  ⭐ Star us on GitHub — it motivates us a lot!
</div>
