package com.e_commerce.controller.drone;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.drone.DeliveryDTO;
import com.e_commerce.dto.drone.DroneDTO;
import com.e_commerce.service.drone.DeliveryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/delivery")
@RequiredArgsConstructor
public class DeliveryController {
    private final DeliveryService deliveryService;

    @GetMapping("/candidates/{orderId}")
    public ResponseEntity<ApiResponse<List<DroneDTO>>> getCandidateDrones(
            @PathVariable Integer orderId,
            HttpServletRequest request
    ) {
        List<DroneDTO> drones = deliveryService.getCandidateDronesForOrder(orderId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Candidate drones fetched successfully", drones, null, request.getRequestURI())
        );
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<DeliveryDTO>> createDelivery(
            @RequestParam Integer orderId,
            @RequestParam Integer droneId,
            HttpServletRequest request
    ) {
        DeliveryDTO deliveryDTO = deliveryService.createDelivery(orderId, droneId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Delivery created successfully", deliveryDTO, null, request.getRequestURI()));
    }
}
