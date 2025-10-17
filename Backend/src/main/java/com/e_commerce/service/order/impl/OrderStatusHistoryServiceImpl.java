package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.orderStatusHistoryDTO.OrderStatusHistoryDTO;
import com.e_commerce.entity.order.OrderStatusHistory;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.mapper.order.OrderStatusHistoryMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.OrderStatusHistoryRepository;
import com.e_commerce.service.order.OrderStatusHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderStatusHistoryServiceImpl implements OrderStatusHistoryService {
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final OrderStatusHistoryMapper orderStatusHistoryMapper;

    @Override
    public List<OrderStatusHistoryDTO> getHistoryByOrderId(Integer orderId) {
        return orderStatusHistoryMapper.convertPageToList(
                orderStatusHistoryRepository.findByOrder_Id(orderId)
        );
    }

    @Override
    public void save(Orders order, String note) {
        orderStatusHistoryMapper.convertEntityToDTO(orderStatusHistoryRepository.save(
                OrderStatusHistory.builder()
                        .id(IdGenerator.getGenerationId())
                        .order(order)
                        .status(order.getOrderStatus())
                        .changedAt(LocalDateTime.now())
                        .build()
        ));
    }

}
