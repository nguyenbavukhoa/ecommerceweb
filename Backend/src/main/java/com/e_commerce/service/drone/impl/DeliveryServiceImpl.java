package com.e_commerce.service.drone.impl;

import com.e_commerce.dto.drone.DeliveryDTO;
import com.e_commerce.dto.drone.DroneDTO;
import com.e_commerce.entity.Delivery;
import com.e_commerce.entity.Drone;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.enums.DeliveryStatus;
import com.e_commerce.enums.DroneStatus;
import com.e_commerce.enums.OrderStatus;
import com.e_commerce.mapper.drone.DeliveryMapper;
import com.e_commerce.repository.drone.DeliveryRepository;
import com.e_commerce.repository.drone.DroneRepository;
import com.e_commerce.service.drone.DeliveryService;
import com.e_commerce.service.drone.DroneService;
import com.e_commerce.service.drone.DroneTrackingService;
import com.e_commerce.service.order.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {
    private final DeliveryMapper deliveryMapper;
    private final DeliveryRepository deliveryRepository;
    private final DroneService droneService;
    private final OrderService orderService;
    private final TaskScheduler taskScheduler;
    private static final double EARTH_RADIUS_KM = 6371.0;
    private final DroneRepository droneRepository;
    private final DroneTrackingService droneTrackingService;

    @Override
    public List<DroneDTO> getCandidateDronesForOrder(Integer orderId) {
        Orders order = orderService.getOrderEntityById(orderId);

        double requiredRangeKm = calculateRoundTripDistanceKm(order);

        // Truyền requiredRangeKm vào service tìm drone
        return droneService.findCandidateDrones(requiredRangeKm, order.getRestaurant().getId());
    }

    public static double calculateDistanceKm(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    @Override
    public Delivery getDeliveryById(Integer deliveryId) {
        return deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found: " + deliveryId));
    }

    @Override
    public DeliveryDTO createDelivery(Integer orderId, Integer droneId) {
        Orders order = orderService.getOrderEntityById(orderId);
        Drone drone = droneService.getById(droneId);

        if (drone.getStatus() != DroneStatus.IDLE) {
            throw new RuntimeException("Drone is not available: " + drone.getSerial());
        }

        double requiredRangeKm = calculateRoundTripDistanceKm(order);

        if (drone.getMaxRangeKm() != null && drone.getMaxRangeKm() < requiredRangeKm) {
            throw new RuntimeException("Drone does not have enough range for delivery");
        }

        // Tính thời gian ước tính
        double averageSpeedKmH = drone.getAvgSpeedKmh() != null ? drone.getAvgSpeedKmh() : 30.0; // default 30 km/h
        double hours = requiredRangeKm / averageSpeedKmH;
        long seconds = (long) (hours * 3600);

        LocalDateTime estimatedDeliveryTime = LocalDateTime.now().plusSeconds(seconds);

        Delivery delivery = Delivery.builder()
                .order(order)
                .drone(drone)
                .status(DeliveryStatus.IN_PROGRESS)
                .rangeKm(requiredRangeKm)
                .estimatedDeliveryTime(estimatedDeliveryTime)
                .currentLat(order.getRestaurant().getLat())
                .currentLng(order.getRestaurant().getLng())
                .progressPct(0.0)
                .endLng(order.getUserInformation().getDeliveryLng())
                .endLat(order.getUserInformation().getDeliveryLat())
                .startTime(LocalDateTime.now())
                .build();

        Delivery savedDelivery = deliveryRepository.save(delivery);

        droneService.updateDroneStatus(droneId, DroneStatus.ASSIGNED);

        orderService.updateOrderStatus(orderId, OrderStatus.OUT_FOR_DELIVERY);

        droneTrackingService.startTracking(savedDelivery.getId(), seconds);

        taskScheduler.schedule(() -> completeDelivery(savedDelivery.getId()),
                Instant.now().plusSeconds(seconds));

        return deliveryMapper.convertToDTO(savedDelivery);
    }

    private double calculateRoundTripDistanceKm(Orders order) {
        double restaurantLat = order.getRestaurant().getLat();
        double restaurantLng = order.getRestaurant().getLng();

        double customerLat = order.getUserInformation().getDeliveryLat();
        double customerLng = order.getUserInformation().getDeliveryLng();

        double distanceKm = calculateDistanceKm(restaurantLat, restaurantLng, customerLat, customerLng);
        return distanceKm * 2; // round-trip
    }

    private void completeDelivery(Integer deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found: " + deliveryId));

        double distanceKm = delivery.getRangeKm(); // đã tính round trip

        // Trừ pin
        consumeDroneBattery(delivery.getDrone(), distanceKm);

        // Cập nhật trạng thái delivery
        delivery.setStatus(DeliveryStatus.COMPLETED);
        delivery.setActualDeliveryTime(LocalDateTime.now());
        deliveryRepository.save(delivery);

        // Cập nhật trạng thái drone
        droneService.updateDroneStatus(delivery.getDrone().getId(), DroneStatus.IDLE);

        // Cập nhật trạng thái order
        orderService.updateOrderStatus(delivery.getOrder().getId(), OrderStatus.DELIVERED);
    }

    private void consumeDroneBattery(Drone drone, double distanceKm) {
        if (drone.getBatteryPct() == null) {
            drone.setBatteryPct(100.0);
        }
        double batteryConsumed = distanceKm * 1.0; // 1%/km
        double newBattery = Math.max(drone.getBatteryPct() - batteryConsumed, 0);
        drone.setBatteryPct(newBattery);
        droneRepository.save(drone);
    }

}
