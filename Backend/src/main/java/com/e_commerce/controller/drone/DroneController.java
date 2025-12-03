package com.e_commerce.controller.drone;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.drone.DroneCreateDTO;
import com.e_commerce.dto.drone.DroneDTO;
import com.e_commerce.enums.DroneStatus;
import com.e_commerce.service.drone.DroneService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drone")
@RequiredArgsConstructor
public class DroneController {
    private final DroneService droneService;

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<DroneDTO>>> getAvailableDrones(HttpServletRequest request) {
        List<DroneDTO> drones = droneService.getAvailableDrones();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Available drones fetched successfully", drones, null, request.getRequestURI())
        );
    }

    @PutMapping("/{droneId}/status")
    public ResponseEntity<ApiResponse<String>> updateDroneStatus(
            @PathVariable Integer droneId,
            @RequestParam DroneStatus status,
            HttpServletRequest request
    ) {
        droneService.updateDroneStatus(droneId, status);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Drone status updated successfully", null, null, request.getRequestURI())
        );
    }

    @GetMapping("/candidates")
    public ResponseEntity<ApiResponse<List<DroneDTO>>> findCandidateDrones(
            @RequestParam double requiredRangeKm,
            @RequestParam Integer restaurantId,
            HttpServletRequest request
    ) {
        List<DroneDTO> drones = droneService.findCandidateDrones(requiredRangeKm,restaurantId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Candidate drones fetched successfully", drones, null, request.getRequestURI())
        );
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<DroneDTO>> createDrone(@RequestBody DroneCreateDTO droneCreateDTO, HttpServletRequest request) {
        DroneDTO createdDrone = droneService.createDrone(droneCreateDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Drone created successfully", createdDrone, null, request.getRequestURI()));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<DroneDTO>>> getAllDrones(HttpServletRequest request) {
        List<DroneDTO> drones = droneService.getAllDrones();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "All drones fetched successfully", drones, null, request.getRequestURI())
        );
    }
}
