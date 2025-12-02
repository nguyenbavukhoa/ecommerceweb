package com.e_commerce.enums;

public enum DroneStatus {
    OFFLINE,              // Drone không hoạt động
    IDLE,                 // Drone rảnh, sẵn sàng nhận nhiệm vụ
    ASSIGNED,             // Drone được gán đơn hàng
    EN_ROUTE_TO_STORE,    // Drone đang bay đến cửa hàng (W0→W1)
    AT_STORE,             // Drone đang ở cửa hàng (pickup)
    EN_ROUTE_TO_CUSTOMER, // Drone đang bay đến khách hàng (W1→W2)
    ARRIVING,             // Drone đang tiếp cận khách hàng
    RETURN_TO_BASE,       // Drone đang quay về base (W2→W3)
    MAINTENANCE           // Drone đang bảo trì
}