package com.e_commerce.mapper.order;

import com.e_commerce.dto.order.orderStatusHistoryDTO.OrderStatusHistoryDTO;
import com.e_commerce.entity.order.OrderStatusHistory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderStatusHistoryMapper {
    public OrderStatusHistoryDTO convertEntityToDTO(OrderStatusHistory orderStatusHistory) {
        return OrderStatusHistoryDTO.builder()
                .id(orderStatusHistory.getId())
                .orderId(orderStatusHistory.getOrder().getId())
                .status(orderStatusHistory.getStatus())
                .changedAt(orderStatusHistory.getChangedAt())
                .build();
    }

    public List<OrderStatusHistoryDTO> convertPageToList(List<OrderStatusHistory> histories) {
        return histories.stream()
                .map(this::convertEntityToDTO)
                .toList();
    }
}
