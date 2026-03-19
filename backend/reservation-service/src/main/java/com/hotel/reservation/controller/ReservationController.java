package com.hotel.reservation.controller;

import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.repository.ReservationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationRepository reservationRepository;

    public ReservationController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @PostMapping("/book")
    public ResponseEntity<Reservation> bookRoom(@Validated @RequestBody Reservation reservation,
                                                @RequestHeader(value = "X-Guest-Id", required = false) String guestId) {
        // In a real system, guestId comes from JWT claims (sub)
        if (guestId != null && !guestId.isBlank()) {
            reservation.setGuestId(guestId);
        }
        reservation.setStatus("BOOKED");
        if (reservation.getCheckIn() == null) {
            reservation.setCheckIn(LocalDate.now());
        }
        if (reservation.getCheckOut() == null) {
            reservation.setCheckOut(LocalDate.now().plusDays(1));
        }
        Reservation saved = reservationRepository.save(reservation);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<Reservation> cancelBooking(@PathVariable Long id,
                                                     @RequestHeader(value = "X-Guest-Id", required = false) String guestId) {
        Optional<Reservation> existing = reservationRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Reservation reservation = existing.get();
        if (guestId != null && !guestId.isBlank() && !guestId.equals(reservation.getGuestId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        reservation.setStatus("CANCELLED");
        reservationRepository.save(reservation);
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Reservation>> myBookings(@RequestHeader(value = "X-Guest-Id", required = false) String guestId) {
        if (guestId == null || guestId.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reservationRepository.findByGuestId(guestId));
    }

    @PutMapping("/checkin/{reservationId}")
    public ResponseEntity<Reservation> checkIn(@PathVariable Long reservationId) {
        Optional<Reservation> existing = reservationRepository.findById(reservationId);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Reservation reservation = existing.get();
        reservation.setStatus("CHECKED_IN");
        reservationRepository.save(reservation);
        return ResponseEntity.ok(reservation);
    }

    @PutMapping("/checkout/{reservationId}")
    public ResponseEntity<Reservation> checkOut(@PathVariable Long reservationId) {
        Optional<Reservation> existing = reservationRepository.findById(reservationId);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Reservation reservation = existing.get();
        reservation.setStatus("CHECKED_OUT");
        reservationRepository.save(reservation);
        return ResponseEntity.ok(reservation);
    }
}
