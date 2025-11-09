# 🚀 Deployment Guide

This guide will help you deploy the Notes SaaS Application to GitHub and prepare it for production.

## 📋 Pre-Deployment Checklist

### 1. Clean Up Development Files

```bash
# Remove test files (already done)
rm -f test_*.py test_*.json test_*.html
rm -f check_*.py debug_*.py fix_*.py verify_*.py

# Remove development databases
rm -rf postgres_data/
```

### 2. Update Environment Variables

Create a production `.env` file with secure values:

```bash
# Generate a secure secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Update .env with production values
SECRET_KEY=<generated-secret-key>
DEBUG=False
DATABASE_URL=<production-database-url>
REDIS_URL=<production-redis-url>
SMTP_SERVER=<production-smtp-server>
SMTP_PORT=587
SMTP_USERNAME=<your-smtp-username>
SMTP_PASSWORD=<your-smtp-password>
EMAIL_FROM=<your-email>
```

### 3. Security Hardening

- [ ] Change default admin credentials
- [ ] Enable HTTPS in production
- [ ] Configure CORS for production domains
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Configure logging and monitoring

## 🐙 GitHub Deployment

### Step 1: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Notes SaaS Application"
```

### Step 2: Connect to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/atyakshev0405-star/Notes-SaaS-Application.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Create GitHub Actions Workflow (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      - name: Run tests
        run: |
          cd frontend
          npm test
```

## ☁️ Production Deployment Options

### Option 1: Docker Compose (VPS/Cloud Server)

1. **Provision a server** (DigitalOcean, AWS EC2, etc.)

2. **Install Docker and Docker Compose**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Clone and deploy**
```bash
git clone https://github.com/atyakshev0405-star/Notes-SaaS-Application.git
cd Notes-SaaS-Application
cp .env.example .env
# Edit .env with production values
docker-compose up -d
```

4. **Set up Nginx reverse proxy**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option 2: Heroku

#### Backend (FastAPI)

1. Create `Procfile` in backend directory:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

2. Deploy:
```bash
heroku create your-app-backend
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
git subtree push --prefix backend heroku main
```

#### Frontend (React)

1. Deploy to Vercel/Netlify:
```bash
# Vercel
cd frontend
vercel --prod

# Netlify
cd frontend
netlify deploy --prod
```

### Option 3: AWS (ECS/Fargate)

1. Push Docker images to ECR
2. Create ECS task definitions
3. Set up Application Load Balancer
4. Configure RDS for PostgreSQL
5. Configure ElastiCache for Redis

### Option 4: Kubernetes

1. Create Kubernetes manifests
2. Deploy to GKE, EKS, or AKS
3. Set up Ingress controller
4. Configure persistent volumes

## 🔐 Production Security Checklist

- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Set secure SECRET_KEY
- [ ] Disable DEBUG mode
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable database encryption
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Use environment variables for secrets
- [ ] Enable audit logging
- [ ] Set up WAF (Web Application Firewall)

## 📊 Monitoring and Logging

### Recommended Tools

- **Application Monitoring**: Sentry, New Relic, Datadog
- **Log Management**: ELK Stack, Papertrail, Loggly
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance**: Google Analytics, Mixpanel

### Set up Sentry (Example)

```python
# backend/app/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0,
)
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)

See `.github/workflows/ci.yml` above.

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test-backend:
  stage: test
  image: python:3.11
  script:
    - cd backend
    - pip install -r requirements.txt
    - pytest

test-frontend:
  stage: test
  image: node:18
  script:
    - cd frontend
    - npm install
    - npm test

deploy:
  stage: deploy
  only:
    - main
  script:
    - echo "Deploy to production"
```

## 📝 Post-Deployment

1. **Test all endpoints**
```bash
# Health check
curl https://your-domain.com/api/health

# Test authentication
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"AdminPass123!"}'
```

2. **Monitor logs**
```bash
# Docker logs
docker-compose logs -f

# Application logs
tail -f /var/log/notes-app/app.log
```

3. **Set up backups**
```bash
# Database backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
aws s3 cp backup_$(date +%Y%m%d).sql s3://your-backup-bucket/
```

4. **Configure monitoring alerts**

## 🆘 Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check DATABASE_URL
   - Verify network connectivity
   - Check firewall rules

2. **Redis connection errors**
   - Verify REDIS_URL
   - Check Redis service status

3. **Email not sending**
   - Verify SMTP credentials
   - Check email service logs
   - Test with MailHog first

4. **CORS errors**
   - Update CORS origins in backend
   - Check frontend API URL

## 📚 Additional Resources

- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)

## 🤝 Support

For deployment issues, please:
1. Check the [Issues](https://github.com/atyakshev0405-star/Notes-SaaS-Application/issues) page
2. Create a new issue with deployment logs
3. Join our community discussions

---

Good luck with your deployment! 🚀
