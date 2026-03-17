# Reservation Service

Spring Boot service (port 8082).

This service manages room reservations.

## Running

```bash
cd backend/reservation-service
mvn spring-boot:run
```

## API Endpoints

- POST `/api/reservations/book` - Book a room (requires `X-Guest-Id` header for now)
- PUT `/api/reservations/cancel/{id}` - Cancel a booking
- GET `/api/reservations/my` - View bookings for the current guest (requires `X-Guest-Id`)
- PUT `/api/reservations/checkin/{reservationId}` - Check in a guest
- PUT `/api/reservations/checkout/{reservationId}` - Check out a guest

## Notes

- Uses in-memory H2 database (console at `/h2-console`).
- This is a minimal prototype; real authentication/authorization will be added later.
