package com.e_commerce.repository.drone;

import com.e_commerce.entity.Drone;
import com.e_commerce.enums.DroneStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DroneRepository extends JpaRepository<Drone, Integer> {
    List<Drone> findByStatus(DroneStatus status);

    boolean existsBySerial(String serial);
}
