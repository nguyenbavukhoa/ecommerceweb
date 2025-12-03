package com.e_commerce.service.drone.impl;

import com.e_commerce.dto.drone.DeliveryDTO;
import com.e_commerce.entity.Delivery;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.enums.DeliveryStatus;
import com.e_commerce.mapper.drone.DeliveryMapper;
import com.e_commerce.repository.drone.DeliveryRepository;
import com.e_commerce.service.drone.DroneTrackingService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@AllArgsConstructor
@Slf4j
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
            log.info("Start tracking delivery {}: total steps {}", deliveryId, numberOfUpdates);

        }
    }

    @Override
    public void updatePosition(Integer deliveryId, int currentStep, long totalSteps) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (delivery.getStatus() != DeliveryStatus.IN_PROGRESS) return;

        double restaurantLat = delivery.getCurrentLat();
        double restaurantLng = delivery.getCurrentLng();
        double customerLat = delivery.getEndLat();
        double customerLng = delivery.getEndLng();

        double progress = (double) currentStep / totalSteps;

        double currentLat = restaurantLat + (customerLat - restaurantLat) * progress;
        double currentLng = restaurantLng + (customerLng - restaurantLng) * progress;

        delivery.setCurrentLat(currentLat);
        delivery.setCurrentLng(currentLng);
        delivery.setProgressPct(progress * 100);

        deliveryRepository.save(delivery);
        log.info("Updating delivery {} step {}/{} - progress: {}%, currentLat: {}, currentLng: {}",
                deliveryId, currentStep, totalSteps, delivery.getProgressPct(),
                delivery.getCurrentLat(), delivery.getCurrentLng());
    }

    @Override
    public DeliveryDTO getTracking(Integer deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        return deliveryMapper.convertToDTO(delivery);
    }
}
