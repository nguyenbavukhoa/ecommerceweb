package com.e_commerce.dto.drone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DroneCreateDTO {
    private String serial;
    private String model;
    private Double maxRangeKm;
    private Double batteryPct;
    private Double avgSpeedKmh;
    private Integer restaurantId;
}
