# Hotel Reservation System

This repository contains a sample microservice-based hotel reservation system integrated with WSO2 API Manager, Identity Server, and Enterprise Integrator.

## Structure

- `backend/` – Spring Boot microservices (user, reservation, room, billing)
- `wso2-config/` – WSO2 configuration artifacts (API Manager, Identity Server, Enterprise Integrator)
- `frontend/` – Basic UI placeholder
- `docs/` – Architecture and notes

## Getting Started (Spring Boot Services)

Each backend service runs on its own port:

- User Service: **8081**
- Reservation Service: **8082**
- Room Service: **8083**
- Billing Service: **8084**

To run a service, open a terminal and run:

```bash
cd backend/<service-name>
mvn spring-boot:run
```

## Next Steps

1. Build the WSO2 Identity Server and API Manager configuration (see `wso2-config/`).
2. Add JWT validation to the Spring Boot services and connect them through WSO2 API Manager.
3. Implement the Enterprise Integrator sequence to orchestrate booking flows.
