package com.e_commerce.dto.drone;

import com.e_commerce.entity.Restaurant;
import com.e_commerce.enums.DroneStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DroneDTO {
    private Integer id;

    private String serial;

    private String model;

    private Double maxRangeKm;

    private DroneStatus status = DroneStatus.IDLE;

    private Double batteryPct;

    private Double avgSpeedKmh = 30.0;

}
