package com.hotel.room.controller;

import com.hotel.room.model.Room;
import com.hotel.room.repository.RoomRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @PostConstruct
    public void seedRooms() {
        if (roomRepository.count() == 0) {
            Room single = new Room();
            single.setType("Single");
            single.setDescription("Single room for one guest");
            single.setPrice(75.0);
            single.setAvailable(true);
            roomRepository.save(single);

            Room dbl = new Room();
            dbl.setType("Double");
            dbl.setDescription("Double room for two guests");
            dbl.setPrice(120.0);
            dbl.setAvailable(true);
            roomRepository.save(dbl);

            Room suite = new Room();
            suite.setType("Suite");
            suite.setDescription("Spacious suite with premium amenities");
            suite.setPrice(220.0);
            suite.setAvailable(true);
            roomRepository.save(suite);
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<Room>> availableRooms() {
        return ResponseEntity.ok(roomRepository.findByAvailableTrue());
    }
}
