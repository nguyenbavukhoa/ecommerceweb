package com.e_commerce.mapper.drone;

import com.e_commerce.dto.drone.DeliveryDTO;
import com.e_commerce.entity.Delivery;
import org.springframework.stereotype.Component;

@Component
public class DeliveryMapper {
    public DeliveryDTO convertToDTO(Delivery delivery) {
        return DeliveryDTO.builder()
                .id(delivery.getId())
                .status(delivery.getStatus())
                .rangeKm(delivery.getRangeKm())
                .estimatedDeliveryTime(delivery.getEstimatedDeliveryTime())
                .actualDeliveryTime(delivery.getActualDeliveryTime())
                .build();
    }

    public Delivery convertToEntity(DeliveryDTO deliveryDTO) {
        return Delivery.builder()
                .status(deliveryDTO.getStatus())
                .rangeKm(deliveryDTO.getRangeKm())
                .estimatedDeliveryTime(deliveryDTO.getEstimatedDeliveryTime())
                .actualDeliveryTime(deliveryDTO.getActualDeliveryTime())
                .build();
    }
}
