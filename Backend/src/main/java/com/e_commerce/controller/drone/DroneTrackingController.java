package com.e_commerce.controller.drone;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.drone.DeliveryDTO;
import com.e_commerce.service.drone.DroneTrackingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drone/tracking")
@RequiredArgsConstructor
public class DroneTrackingController {
    private final DroneTrackingService droneTrackingService;

    @GetMapping("/{deliveryId}")
    public ResponseEntity<ApiResponse<DeliveryDTO>> getDeliveryTracking(
            @PathVariable Integer deliveryId,
            HttpServletRequest request
    ) {
        DeliveryDTO deliveryTracking = droneTrackingService.getTracking(deliveryId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Delivery tracking fetched successfully",
                        deliveryTracking, null, request.getRequestURI())
        );
    }

    @PostMapping("/{deliveryId}/start")
    public ResponseEntity<ApiResponse<String>> startDeliveryTracking(
            @PathVariable Integer deliveryId,
            @RequestParam long totalSeconds,
            HttpServletRequest request
    ) {
        droneTrackingService.startTracking(deliveryId, totalSeconds);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Drone tracking started successfully",
                        null, null, request.getRequestURI()));
    }
}
