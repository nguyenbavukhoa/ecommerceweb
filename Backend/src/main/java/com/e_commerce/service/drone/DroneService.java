package com.e_commerce.service.drone;

import com.e_commerce.dto.drone.DroneCreateDTO;
import com.e_commerce.dto.drone.DroneDTO;
import com.e_commerce.entity.Drone;
import com.e_commerce.enums.DroneStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DroneService {
    List<DroneDTO> getAvailableDrones();

    Drone getById(Integer id);

    void updateDroneStatus(Integer droneId, DroneStatus status);

    List<DroneDTO> findCandidateDrones(double requiredRangeKm, Integer restaurantId);

    DroneDTO createDrone(DroneCreateDTO droneCreateDTO);

    List<DroneDTO> getAllDrones();

}
