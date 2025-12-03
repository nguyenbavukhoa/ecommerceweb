package com.e_commerce.dto.drone;

import com.e_commerce.enums.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeliveryDTO {
    private Integer id;
    private Integer orderId;
    private Integer droneId;
    private DeliveryStatus status;

    private Double currentLat;
    private Double currentLng;
    private Double progressPct;
    private Double endLat;
    private Double endLng;

    private Double rangeKm;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;
    private LocalDateTime startTime;
}

