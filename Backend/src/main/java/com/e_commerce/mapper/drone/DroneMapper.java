package com.e_commerce.mapper.drone;

import com.e_commerce.dto.drone.DroneDTO;
import com.e_commerce.entity.Drone;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DroneMapper {
    public DroneDTO convertToDTO(Drone drone) {
        return DroneDTO.builder()
                .id(drone.getId())
                .model(drone.getModel())
                .serial(drone.getSerial())
                .batteryPct(drone.getBatteryPct())
                .maxRangeKm(drone.getMaxRangeKm())
                .status(drone.getStatus())
                .avgSpeedKmh(drone.getAvgSpeedKmh())
                .restaurantId(drone.getRestaurant() != null ? drone.getRestaurant().getId() : null)
                .build();
    }

    public Drone convertToEntity(DroneDTO droneDTO) {
        return Drone.builder()
                .model(droneDTO.getModel())
                .serial(droneDTO.getSerial())
                .batteryPct(droneDTO.getBatteryPct())
                .maxRangeKm(droneDTO.getMaxRangeKm())
                .status(droneDTO.getStatus())
                .avgSpeedKmh(droneDTO.getAvgSpeedKmh())
                .build();
    }

    public List<DroneDTO> convertListEntityToListDTO(List<Drone> drones) {
        return drones.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
