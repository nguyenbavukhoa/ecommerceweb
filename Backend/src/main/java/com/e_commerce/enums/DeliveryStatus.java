package com.e_commerce.enums;

public enum DeliveryStatus {
    PENDING,     // Chờ gán drone
    ASSIGNED,    // Đã gán drone
    IN_PROGRESS, // Drone đang thực hiện delivery
    COMPLETED,   // Hoàn thành giao hàng
    FAILED       // Thất bại
}