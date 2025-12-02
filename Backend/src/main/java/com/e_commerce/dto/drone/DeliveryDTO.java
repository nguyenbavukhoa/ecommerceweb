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

    private DeliveryStatus status;

    private Double rangeKm;

    private LocalDateTime estimatedDeliveryTime;

    private LocalDateTime actualDeliveryTime;
}

