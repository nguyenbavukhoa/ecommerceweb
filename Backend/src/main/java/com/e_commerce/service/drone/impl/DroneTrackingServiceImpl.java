package com.e_commerce.service.drone.impl;

import com.e_commerce.dto.drone.DeliveryDTO;
import com.e_commerce.entity.Delivery;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.enums.DeliveryStatus;
import com.e_commerce.mapper.drone.DeliveryMapper;
import com.e_commerce.repository.drone.DeliveryRepository;
import com.e_commerce.service.drone.DroneTrackingService;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@AllArgsConstructor
public class DroneTrackingServiceImpl implements DroneTrackingService {
    private final DeliveryRepository deliveryRepository;
    private final TaskScheduler taskScheduler;
    private final DeliveryMapper deliveryMapper;


    @Override
    public void startTracking(Integer deliveryId, long totalSeconds) {
        long updateIntervalSeconds = 5; // update mỗi 5s
        long numberOfUpdates = totalSeconds / updateIntervalSeconds;

        for (int i = 1; i <= numberOfUpdates; i++) {
            final int step = i;
            taskScheduler.schedule(
                    () -> updatePosition(deliveryId, step, numberOfUpdates),
                    Instant.now().plusSeconds(updateIntervalSeconds * step)
            );
        }
    }

    @Override
    public void updatePosition(Integer deliveryId, int currentStep, long totalSteps) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (delivery.getStatus() != DeliveryStatus.IN_PROGRESS) return;

        Orders order = delivery.getOrder();
        double restaurantLat = order.getRestaurant().getLat();
        double restaurantLng = order.getRestaurant().getLng();
        double customerLat = order.getUserInformation().getDeliveryLat();
        double customerLng = order.getUserInformation().getDeliveryLng();

        double progress = (double) currentStep / totalSteps;

        double currentLat = restaurantLat + (customerLat - restaurantLat) * progress;
        double currentLng = restaurantLng + (customerLng - restaurantLng) * progress;

        delivery.setCurrentLat(currentLat);
        delivery.setCurrentLng(currentLng);
        delivery.setProgressPct(progress * 100);

        deliveryRepository.save(delivery);
    }

    @Override
    public DeliveryDTO getTracking(Integer deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        return deliveryMapper.convertToDTO(delivery);
    }
}
