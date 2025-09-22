package com.e_commerce.mapper.order;

import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.order.orderDTO.OrderCreateForm;
import com.e_commerce.dto.order.orderDTO.OrderDTO;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.entity.product.Product;
import com.e_commerce.enums.OrderStatus;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class OrdersMapper {
    private final OrderItemMapper OrderItemMapper;

    public OrderDTO convertEntityToDTO(Orders order) {
        return OrderDTO.builder()
                .id(order.getId())
                .orderStatus(order.getOrderStatus().name())
                .totalPrice(order.getTotalPrice())
                .orderTime(order.getOrderTime())
                .note(order.getNote())
                .orderItems(OrderItemMapper.convertPageToList(order.getOrderItems()))
                .build();
    }

        public Orders convertCreateDTOToEntity(OrderCreateForm orderDTO) {
        return Orders.builder()
                .orderStatus(OrderStatus.PLACED)
                .orderTime(LocalDateTime.now())
                .note(orderDTO.getNote())
                .build();
    }

    public List<OrderDTO> convertEntityListToDTOList(List<Orders> orders) {
        return orders.stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }

    public PageDTO<OrderDTO> convertEntityPageToDTOPage(Page<Orders> ordersPage) {
        return PageDTO.<OrderDTO>builder()
                .content(convertEntityListToDTOList(ordersPage.getContent()))
                .page(ordersPage.getNumber())
                .size(ordersPage.getSize())
                .totalElements(ordersPage.getTotalElements())
                .totalPages(ordersPage.getTotalPages())
                .build();
    }
}
