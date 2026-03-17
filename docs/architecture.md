# Hotel Reservation System Architecture

This document describes the high-level architecture of the Hotel Reservation System.

## Services
- **user-service** (Spring Boot, port 8081)
- **reservation-service** (Spring Boot, port 8082)
- **room-service** (Spring Boot, port 8083)
- **billing-service** (Spring Boot, port 8084)

## Integration
- WSO2 API Manager exposes APIs defined in `wso2-config/api-manager/hotel-api.yaml`.
- WSO2 Enterprise Integrator provides mediation flows in `wso2-config/enterprise-integrator/`.
- WSO2 Identity Server handles authentication/authorization using `wso2-config/identity-server/`.
