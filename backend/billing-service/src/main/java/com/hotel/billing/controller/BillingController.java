package com.hotel.billing.controller;

import com.hotel.billing.model.Invoice;
import com.hotel.billing.repository.InvoiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/billing")
public class BillingController {

    private final InvoiceRepository invoiceRepository;

    public BillingController(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<Invoice> getInvoiceByReservation(@PathVariable Long reservationId) {
        return invoiceRepository.findByReservationId(reservationId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/generate")
    public ResponseEntity<Invoice> generateInvoice(@RequestBody Invoice invoice) {
        invoice.setStatus("PENDING");
        Invoice saved = invoiceRepository.save(invoice);
        return ResponseEntity.status(201).body(saved);
    }
}
