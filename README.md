# Notes SaaS Application

A full-stack SaaS application for managing notes with user authentication, roles, and access control.

## Features

- **User Authentication**: Registration, login, email confirmation, password recovery
- **Role-Based Access Control**: Admin and User roles
- **Notes Management**: Create, read, update, delete notes with access levels (private, public, shared)
- **Admin Panel**: Manage users and view audit logs
- **Audit Logging**: Track user actions
- **Responsive UI**: Built with React and Tailwind CSS

## Tech Stack

### Backend
- **FastAPI**: High-performance web framework
- **SQLAlchemy**: ORM for database interactions
- **Alembic**: Database migrations
- **PostgreSQL**: Primary database (SQLite for development)
- **bcrypt**: Password hashing
- **JWT**: Token-based authentication
- **aiosmtplib**: Email sending

### Frontend
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client

## Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL (optional, SQLite for development)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables (create `.env` file):
   ```
   DATABASE_URL=sqlite:///./app.db
   SECRET_KEY=your-secret-key-here
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Demo Accounts

- **Admin User**:
  - Email: admin@example.com
  - Password: admin123
  - Role: Admin

- **Regular User**:
  - Email: user@example.com
  - Password: user123
  - Role: User

## Testing

Run the test suite:

```bash
cd backend
python -m pytest tests/ -v
```

## Deployment

### Using Docker Compose

1. Ensure Docker and Docker Compose are installed
2. Run the application:
   ```bash
   docker-compose up --build
   ```

This will start both backend and frontend services.

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Email confirmation required for account activation
- Role-based access control
- Audit logging for security monitoring
- CORS protection
- Input validation and sanitization

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── database.py      # Database configuration
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── config.py        # Configuration settings
│   │   └── routers/         # API endpoints
│   │       ├── auth.py      # Authentication endpoints
│   │       ├── notes.py     # Notes CRUD endpoints
│   │       └── admin.py     # Admin panel endpoints
│   └── tests/               # Test files
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   └── index.js         # Application entry point
│   └── public/              # Static assets
└── docker-compose.yml       # Docker configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
