# Contributing to Notes SaaS Application

First off, thank you for considering contributing to Notes SaaS Application! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, browser, Docker version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything works
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

#### Pull Request Guidelines

- Follow the existing code style
- Write clear, descriptive commit messages
- Include tests for new features
- Update documentation as needed
- Ensure all tests pass
- Keep pull requests focused on a single feature or fix

## Development Setup

### Prerequisites

- Docker and Docker Compose
- Git
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/atyakshev0405-star/Notes-SaaS-Application.git
cd Notes-SaaS-Application
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Start the development environment:
```bash
docker-compose up --build
```

4. Run migrations:
```bash
docker-compose exec backend alembic upgrade head
```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - MailHog: http://localhost:8025

### Running Tests

#### Backend Tests
```bash
docker-compose exec backend pytest
```

#### Frontend Tests
```bash
docker-compose exec frontend npm test
```

## Code Style

### Python (Backend)
- Follow PEP 8 guidelines
- Use type hints
- Write docstrings for functions and classes
- Keep functions small and focused

### JavaScript/React (Frontend)
- Use ES6+ features
- Follow React best practices
- Use functional components with hooks
- Keep components small and reusable

## Project Structure

```
.
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── api/      # API routes
│   │   ├── core/     # Configuration
│   │   ├── db/       # Database setup
│   │   ├── models/   # SQLAlchemy models
│   │   ├── schemas/  # Pydantic schemas
│   │   ├── services/ # Business logic
│   │   └── tests/    # Tests
│   └── requirements.txt
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
│   └── package.json
└── docker-compose.yml
```

## Commit Message Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests after the first line

Examples:
```
Add user authentication feature

- Implement JWT token generation
- Add login and registration endpoints
- Create user model and migrations

Fixes #123
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
