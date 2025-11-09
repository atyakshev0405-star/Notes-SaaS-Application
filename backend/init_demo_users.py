from app.db.init_db import init_db

if __name__ == "__main__":
    print("Initializing demo users...")
    init_db()
    print("Demo users created successfully!")
    print("Admin: admin@example.com / AdminPass123!")
    print("User: user@example.com / UserPass123!")
