# Billing Service

Spring Boot service (port 8084).

This service handles invoicing and payment processing.

## Running

```bash
cd backend/billing-service
mvn spring-boot:run
```

## API Endpoints

- GET `/api/billing/{id}` - View invoice by ID
- POST `/api/billing/generate` - Generate a new invoice (includes reservationId, guestId, amount)

## Notes

- Uses in-memory H2 database (console at `/h2-console`).
