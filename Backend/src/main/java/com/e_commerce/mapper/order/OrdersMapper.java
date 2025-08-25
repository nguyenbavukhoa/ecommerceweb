package com.e_commerce.mapper.order;

import com.e_commerce.dto.order.orderDTO.OrderCreateForm;
import com.e_commerce.dto.order.orderDTO.OrderDTO;
import com.e_commerce.entity.order.Orders;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrdersMapper {
    private final OrderItemMapper OrderItemMapper;

    public OrdersMapper(OrderItemMapper orderItemMapper) {
        OrderItemMapper = orderItemMapper;
    }

    public OrderDTO convertEntityToDTO(Orders order) {
        return OrderDTO.builder()
                .orderStatus(order.getOrderStatus().name())
                .totalPrice(order.getTotalPrice())
                .orderTime(order.getOrderTime())
                .build();
    }

    public Orders convertCreateDTOToEntity(OrderCreateForm orderDTO) {
        return Orders.builder()
                .orderStatus(orderDTO.getOrderStatus())
                .totalPrice(orderDTO.getTotalPrice())
                .orderItems(OrderItemMapper.convertCreateDTOListToEntityList(orderDTO.getListOrderItems()))
                .build();
    }

    public List<OrderDTO> convertEntityListToDTOList(List<Orders> orders) {
        return orders.stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }
}
