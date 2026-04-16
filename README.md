# The Grand Hotel — Reservation System

A full-stack microservices-based hotel reservation system integrated with **WSO2 API Manager** and **WSO2 Identity Server** for enterprise-grade authentication, API gateway, and security.

---

## 📐 Architecture Overview

```text
Frontend (React + Vite)  →  WSO2 API Manager (Gateway)  →  Microservices
                                     ↑
                         WSO2 Identity Server (JWT Auth)
```

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, Bootstrap 5 |
| API Gateway | WSO2 API Manager 4.6.0 |
| Identity & Auth | WSO2 Identity Server 7.2.0 |
| User Service | Spring Boot 3.1.3, Java 17, H2 DB |
| Room Service | Spring Boot 3.1.3, Java 17, H2 DB |
| Billing Service | Spring Boot 3.1.3, Java 17, H2 DB |
| Reservation Service | Ballerina 2201.8.0 |

---

## 🔢 Service Ports

| Service | Port | URL |
| --- | --- | --- |
| Frontend | 5173 | <http://localhost:5173> |
| User Service | 8081 | <http://localhost:8081> |
| Reservation Service | 8082 | <http://localhost:8082> |
| Room Service | 8083 | <http://localhost:8083> |
| Billing Service | 8084 | <http://localhost:8084> |
| APIM Gateway (HTTP) | 8280 | <http://localhost:8280> |
| APIM Gateway (HTTPS) | 8243 | <https://localhost:8243> |
| APIM Publisher | 9443 | <https://localhost:9443/publisher> |
| APIM Dev Portal | 9443 | <https://localhost:9443/devportal> |
| Identity Server | 9444 | <https://localhost:9444/console> |

---

## ✅ Prerequisites

Make sure these are installed before running:

- **Java 17** → <https://adoptium.net>
- **Maven 3.8+** → <https://maven.apache.org/download.cgi>
- **Ballerina 2201.8.0** → <https://ballerina.io/downloads>
- **Node.js 18+** → <https://nodejs.org>
- **WSO2 Identity Server 7.2.0** → Downloaded at `C:\Users\fathi\Downloads\wso2is-7.2.0.15\`
- **WSO2 API Manager 4.6.0** → Downloaded at `C:\Users\fathi\Downloads\wso2am-4.6.0.17\`

Check versions:

```bash
java -version        # should show 17
mvn -version         # should show 3.8+
bal version          # should show 2201.8.0
node -version        # should show 18+
```

---

## 🚀 How to Run (Step by Step)

Open **7 separate terminals** and run each step.

---

### Step 1 — Start WSO2 Identity Server

```bash
cd "C:\Users\fathi\Downloads\wso2is-7.2.0.15\wso2is-7.2.0\bin"
.\wso2server.bat
```

⏳ Wait **1-2 minutes** until you see:

```text
[IS] WSO2 Identity Server started
```

Verify at: **<https://localhost:9444/console>** (login: `admin` / `admin`)

---

### Step 2 — Start WSO2 API Manager

```bash
cd "C:\Users\fathi\Downloads\wso2am-4.6.0.17\wso2am-4.6.0\bin"
.\api-manager.bat
```

⏳ Wait **2-3 minutes** until you see:

```text
[APIM] WSO2 API Manager started
```

Verify at: **<https://localhost:9443/publisher>** (login: `admin` / `admin`)

---

### Step 3 — Start User Service

```bash
cd "Hotel-Reservation-System/backend/user-service"
mvn spring-boot:run
```

✅ Ready when you see: `Started UserServiceApplication on port 8081`

---

### Step 4 — Start Room Service

```bash
cd "Hotel-Reservation-System/backend/room-service"
mvn spring-boot:run
```

✅ Ready when you see: `Started RoomServiceApplication on port 8083`

---

### Step 5 — Start Billing Service

```bash
cd "Hotel-Reservation-System/backend/billing-service"
mvn spring-boot:run
```

✅ Ready when you see: `Started BillingServiceApplication on port 8084`

---

### Step 6 — Start Reservation Service (Ballerina)

```bash
cd "Hotel-Reservation-System/backend/reservation-service-bal"
bal run
```

✅ Ready when you see: `Ballerina service started on port 8082`

---

### Step 7 — Start Frontend

```bash
cd "Hotel-Reservation-System/frontend/hotel-ui"
npm install
npm run dev
```

✅ Open your browser at: **<http://localhost:5173>**

> Note: `npm install` only needed the first time.

---

## ⚙️ WSO2 One-Time Setup (Do this once)

### A. Identity Server — Create Application

1. Go to **<https://localhost:9444/console>** → login `admin/admin`
2. Click **Applications** → **New Application** → **Standard-Based Application**
3. Name: `HotelReservationApp` → click **Register**
4. Go to **Protocol** tab:
   - Note down **Client ID** and **Client Secret**
   - **Allowed grant types:** check `Client Credential`, `Password`, `Refresh Token`
   - **Access Token → Token type:** select `JWT`
   - Click **Update**

### B. Identity Server — Create Roles

1. Left sidebar → **User Management** → **Roles** → **New Role**
2. Create 3 roles (Role audience: `Application`, Assigned app: `HotelReservationApp`):
   - `GUEST`
   - `STAFF`
   - `MANAGER`

### C. Identity Server — Create Test Users

1. Left sidebar → **User Management** → **Users** → **Add User**
2. Create users and assign roles:

| Username | Password | Role |
| --- | --- | --- |
| testguest | Test@123 | GUEST |
| teststaff | Test@123 | STAFF |
| testmanager | Test@123 | MANAGER |

### D. API Manager — Import API

1. Go to **<https://localhost:9443/publisher>** → login `admin/admin`
2. Click **Create API** → **Import Open API**
3. Upload file: `wso2-config/api-manager/hotel-api.yaml`
4. Set endpoint to `http://localhost:8081` → click **Create**
5. Go to **Deployments** tab → **Deploy New Revision** → deploy to **Default** gateway
6. Go to **Lifecycle** tab → click **Publish**

---

## 🧪 Testing the Application

1. Open **<http://localhost:5173>**
2. Click **Register** and create an account
3. Login with your credentials
4. Browse available rooms
5. Select **Check-in** and **Check-out** dates
6. Click **Book Now**
7. Go to **My Reservations** to see your booking
8. Click **Check In** → **Check Out**
9. Click **View Invoice** to see the bill

---

## 🗄️ H2 Database Consoles (for debugging)

| Service | URL | JDBC URL |
| --- | --- | --- |
| User Service | <http://localhost:8081/h2-console> | `jdbc:h2:mem:userdb` |
| Room Service | <http://localhost:8083/h2-console> | `jdbc:h2:mem:roomdb` |
| Billing Service | <http://localhost:8084/h2-console> | `jdbc:h2:mem:billingdb` |

> Username: `sa` | Password: *(leave blank)*

---

## 📁 Project Structure

```text
Hotel-Reservation-System/
├── backend/
│   ├── user-service/            # Spring Boot — port 8081
│   ├── reservation-service-bal/ # Ballerina  — port 8082
│   ├── room-service/            # Spring Boot — port 8083
│   └── billing-service/         # Spring Boot — port 8084
├── frontend/
│   └── hotel-ui/                # React + Vite — port 5173
├── wso2-config/
│   ├── api-manager/             # hotel-api.yaml, jwt-validation.xml
│   └── identity-server/         # oauth2-config.xml, roles.xml, sp-config.xml
└── docs/
    ├── architecture.md
    └── api-docs.md
```

---

## ⚠️ Common Issues

| Problem | Fix |
| --- | --- |
| `Book Now` not working | Make sure Ballerina service is running on port 8082 |
| Rooms not loading | Make sure Room Service is running on port 8083 |
| Login fails | Use Register page first — app has its own user store separate from WSO2 IS |
| WSO2 slow to start | Normal — IS needs 1-2 min, APIM needs 2-3 min |
| `bal run` not found | Install Ballerina 2201.8.0 and restart terminal |
| `mvn` not found | Install Maven and add to PATH |

---

## 👤 Author

Built with WSO2 API Manager, Identity Server, Spring Boot, Ballerina, and React.
