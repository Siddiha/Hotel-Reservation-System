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


Step 1 — Start WSO2 Identity Server
Open a new terminal:


cd "C:\Users\fathi\Downloads\wso2is-7.2.0.15\wso2is-7.2.0\bin"

.\wso2server.bat
Wait until you see "WSO2 Identity Server started" — takes about 1-2 minutes.

Step 2 — Start WSO2 API Manager
Open another new terminal:


cd "C:\Users\fathi\Downloads\wso2am-4.6.0.17\wso2am-4.6.0\bin"

.\api-manager.bat
Wait until you see "WSO2 API Manager started" — takes about 2-3 minutes.

Step 3 — Tell me when both are started
Once both say started, open these in your browser and confirm you see the login page:

https://localhost:9444/console → Identity Server
https://localhost:9443/publisher → API Manager Publisher
https://localhost:9443/devportal → API Manager Dev Portal
Login for both is admin / admin.

Start IS first then APIM and let me know when they're up