package com.e_commerce.entity;

import com.e_commerce.enums.DroneStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Drone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String serial;

    private String model;

    @Column(name = "max_range_km")
    private Double maxRangeKm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private DroneStatus status = DroneStatus.IDLE;

    @Column(name = "battery_pct")
    private Double batteryPct;

    @Column(name = "avg_speed_kmh")
    private Double avgSpeedKmh = 30.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
}
