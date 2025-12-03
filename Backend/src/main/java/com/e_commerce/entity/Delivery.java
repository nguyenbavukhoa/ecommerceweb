package com.e_commerce.entity;

import com.e_commerce.entity.order.Orders;
import com.e_commerce.enums.DeliveryStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "order_id", unique = true)
    @JsonBackReference
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "drone_id")
    private Drone drone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private DeliveryStatus status;

    @Column(name = "range_km")
    private Double rangeKm;

    @Column(name = "estimated_delivery_time")
    private LocalDateTime estimatedDeliveryTime; // Thời gian giao hàng ước tính

    @Column(name = "actual_delivery_time")
    private LocalDateTime actualDeliveryTime; // Thời gian giao hàng thực tế

    @Column(name = "current_lat")
    private Double currentLat;

    @Column(name = "current_lng")
    private Double currentLng;

    @Column(name = "end_lat")
    private Double endLat;

    @Column(name = "end_lng")
    private Double endLng;

    @Column(name = "progress_pct") // % hoàn thành hành trình
    private Double progressPct;

    @Column(name = "start_time")
    private LocalDateTime startTime;
}
