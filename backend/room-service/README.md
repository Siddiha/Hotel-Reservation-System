# Room Service

Spring Boot service (port 8083).

This service provides room availability and inventory.

## Running

```bash
cd backend/room-service
mvn spring-boot:run
```

## API Endpoints

- GET `/api/rooms/available` - List available rooms

## Notes

- Uses in-memory H2 database (console at `/h2-console`).
- Seeds three rooms (Single, Double, Suite) on startup.
