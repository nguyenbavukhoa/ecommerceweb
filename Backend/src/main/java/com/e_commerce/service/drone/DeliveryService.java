package com.e_commerce.service.drone;

import com.e_commerce.dto.drone.DeliveryDTO;
import com.e_commerce.dto.drone.DroneDTO;
import com.e_commerce.entity.Delivery;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DeliveryService {

    List<DroneDTO> getCandidateDronesForOrder(Integer orderId);

    Delivery getDeliveryById(Integer deliveryId);

    DeliveryDTO createDelivery(Integer orderId, Integer droneId);
}
