package com.e_commerce.service.drone;

import com.e_commerce.dto.drone.DeliveryDTO;
import org.springframework.stereotype.Service;

@Service
public interface DroneTrackingService {
    void startTracking(Integer deliveryId, long totalSeconds); // tracking cho một delivery

    void updatePosition(Integer deliveryId, int currentStep, long totalSteps);// cập nhật vị trí hiện tại của drone trong quá trình giao hàng

    DeliveryDTO getTracking(Integer deliveryId); // lấy thông tin tracking hiện tại của một delivery
}
