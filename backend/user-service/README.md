# User Service

Spring Boot service (port 8081).

This service handles user management (authentication, profiles, roles).

## Running

```bash
cd backend/user-service
mvn spring-boot:run
```

## API Endpoints

- POST `/api/auth/register` - Register new guest (role = GUEST)
- POST `/api/auth/login` - Login and receive a mock JWT token

## Notes

- Uses in-memory H2 database (console at `/h2-console`).
- Passwords are stored in plain text in this prototype (replace with bcrypt for production).
