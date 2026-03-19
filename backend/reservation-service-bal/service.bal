import ballerina/http;
import ballerina/time;

// ── Types ─────────────────────────────────────────────────────────────────────

type ReservationRequest record {
    int roomId;
    string? checkIn  = ();
    string? checkOut = ();
    string? guestId  = ();
};

type Reservation record {|
    readonly int id;
    string guestId;
    int    roomId;
    string checkIn;
    string checkOut;
    string status;
|};

// ── In-memory store ───────────────────────────────────────────────────────────

table<Reservation> key(id) reservations = table [];
int nextId = 1;

// ── Service ───────────────────────────────────────────────────────────────────

@http:ServiceConfig {
    cors: {
        allowOrigins:    ["*"],
        allowMethods:    ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders:    ["Authorization", "Content-Type", "X-Guest-Id"],
        allowCredentials: false
    }
}
service /api/reservations on new http:Listener(8082) {

    // POST /api/reservations/book
    resource function post book(
        @http:Header {name: "X-Guest-Id"} string? xGuestId,
        @http:Payload ReservationRequest req
    ) returns http:Created|http:BadRequest {

        lock {
            string today = time:utcToString(time:utcNow()).substring(0, 10);
            string gid   = xGuestId ?: req.guestId ?: "";

            Reservation r = {
                id:       nextId,
                guestId:  gid,
                roomId:   req.roomId,
                checkIn:  req.checkIn  ?: today,
                checkOut: req.checkOut ?: today,
                status:   "BOOKED"
            };

            reservations.add(r);
            nextId += 1;
            return <http:Created>{body: r};
        }
    }

    // GET /api/reservations/my
    resource function get my(
        @http:Header {name: "X-Guest-Id"} string? xGuestId
    ) returns Reservation[]|http:BadRequest {

        if xGuestId is () || xGuestId == "" {
            return <http:BadRequest>{body: {message: "X-Guest-Id header is required"}};
        }

        lock {
            Reservation[] result = from var r in reservations
                                   where r.guestId == xGuestId
                                   select r;
            return result;
        }
    }

    // PUT /api/reservations/cancel/{id}
    resource function put cancel/[int id](
        @http:Header {name: "X-Guest-Id"} string? xGuestId
    ) returns Reservation|http:NotFound|http:Forbidden {

        lock {
            Reservation? existing = reservations[id];

            if existing is () {
                return <http:NotFound>{body: {message: "Reservation not found"}};
            }

            if xGuestId is string && xGuestId != "" && xGuestId != existing.guestId {
                return <http:Forbidden>{body: {message: "Reservation belongs to a different guest"}};
            }

            Reservation updated = {
                id:       existing.id,
                guestId:  existing.guestId,
                roomId:   existing.roomId,
                checkIn:  existing.checkIn,
                checkOut: existing.checkOut,
                status:   "CANCELLED"
            };
            reservations.put(updated);
            return updated;
        }
    }

    // PUT /api/reservations/checkin/{id}  — Staff/Manager only (enforced by WSO2 API Manager)
    resource function put checkin/[int id]() returns Reservation|http:NotFound {

        lock {
            Reservation? existing = reservations[id];

            if existing is () {
                return <http:NotFound>{body: {message: "Reservation not found"}};
            }

            Reservation updated = {
                id:       existing.id,
                guestId:  existing.guestId,
                roomId:   existing.roomId,
                checkIn:  existing.checkIn,
                checkOut: existing.checkOut,
                status:   "CHECKED_IN"
            };
            reservations.put(updated);
            return updated;
        }
    }

    // PUT /api/reservations/checkout/{id}  — Staff/Manager only (enforced by WSO2 API Manager)
    resource function put checkout/[int id]() returns Reservation|http:NotFound {

        lock {
            Reservation? existing = reservations[id];

            if existing is () {
                return <http:NotFound>{body: {message: "Reservation not found"}};
            }

            Reservation updated = {
                id:       existing.id,
                guestId:  existing.guestId,
                roomId:   existing.roomId,
                checkIn:  existing.checkIn,
                checkOut: existing.checkOut,
                status:   "CHECKED_OUT"
            };
            reservations.put(updated);
            return updated;
        }
    }
}
