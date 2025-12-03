package com.e_commerce.service.drone.impl;

import com.e_commerce.dto.drone.DroneCreateDTO;
import com.e_commerce.dto.drone.DroneDTO;
import com.e_commerce.entity.Drone;
import com.e_commerce.entity.Restaurant;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.enums.DroneStatus;
import com.e_commerce.mapper.drone.DroneMapper;
import com.e_commerce.repository.drone.DroneRepository;
import com.e_commerce.service.drone.DroneService;
import com.e_commerce.service.drone.DroneTrackingService;
import com.e_commerce.service.order.OrderService;
import com.e_commerce.service.retaurant.RestaurantService;
import lombok.AllArgsConstructor;
import org.apache.logging.log4j.util.PropertySource;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@AllArgsConstructor
public class DroneServiceImpl implements DroneService {
    private final DroneRepository droneRepository;
    private final DroneMapper droneMapper;
    private final OrderService orderService;
    private final RestaurantService restaurantService;



    @Override
    public List<DroneDTO> getAvailableDrones() {
        return droneMapper.convertListEntityToListDTO(droneRepository.findByStatus(DroneStatus.IDLE));
    }

    @Override
    public Drone getById(Integer id) {
        return droneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drone not found: " + id));
    }

    @Override
    public void updateDroneStatus(Integer droneId, DroneStatus status) {
        Drone drone = getById(droneId);
        drone.setStatus(status);
        droneRepository.save(drone);
    }

    @Override
    public List<DroneDTO> findCandidateDrones(double requiredRangeKm, Integer restaurantId) {
        return droneRepository.findByStatus(DroneStatus.IDLE)
                .stream()
                .filter(d -> d.getRestaurant() != null && d.getRestaurant().getId().equals(restaurantId)) // lọc theo nhà hàng
                .filter(d -> d.getBatteryPct() != null && d.getBatteryPct() >= 40)
                .filter(d -> d.getMaxRangeKm() == null || d.getMaxRangeKm() >= requiredRangeKm)
                .map(droneMapper::convertToDTO)
                .toList();
    }

    @Override
    public DroneDTO createDrone(DroneCreateDTO droneCreateDTO) {
        // Kiểm tra serial đã tồn tại chưa
        if (droneRepository.existsBySerial(droneCreateDTO.getSerial())) {
            throw new RuntimeException("Drone serial already exists: " + droneCreateDTO.getSerial());
        }

        // Lấy nhà hàng
        Restaurant restaurant = restaurantService.getById(droneCreateDTO.getRestaurantId());

        Drone drone = Drone.builder()
                .serial(droneCreateDTO.getSerial())
                .model(droneCreateDTO.getModel())
                .maxRangeKm(droneCreateDTO.getMaxRangeKm())
                .batteryPct(droneCreateDTO.getBatteryPct() != null ? droneCreateDTO.getBatteryPct() : 100.0)
                .avgSpeedKmh(droneCreateDTO.getAvgSpeedKmh() != null ? droneCreateDTO.getAvgSpeedKmh() : 30.0)
                .status(DroneStatus.IDLE)
                .restaurant(restaurant)
                .build();

        Drone savedDrone = droneRepository.save(drone);

        return droneMapper.convertToDTO(savedDrone);
    }

    @Override
    public List<DroneDTO> getAllDrones() {
        return droneMapper.convertListEntityToListDTO(droneRepository.findAll());
    }

}
