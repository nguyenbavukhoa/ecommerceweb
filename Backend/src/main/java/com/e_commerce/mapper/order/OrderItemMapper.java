package com.e_commerce.mapper.order;

import com.e_commerce.dto.order.orderItemsDTO.OrderItemsCreateForm;
import com.e_commerce.dto.order.orderItemsDTO.OrderItemsDTO;
import com.e_commerce.entity.order.OrderItems;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderItemMapper {
    public OrderItemsDTO convertEntityToDTO(OrderItems orderItem) {
        return OrderItemsDTO.builder()
                .id(orderItem.getId())
                .productVariantsId(orderItem.getProductVariantsId().getId())
                .quantity(orderItem.getQuantity())
                .orderId(orderItem.getOrderId().getId())
                .build();
    }

    public OrderItems convertCreateDTOToEntity(OrderItemsCreateForm orderItemDTO) {
        return OrderItems.builder()
                .quantity(orderItemDTO.getQuantity())
                .build();
    }

    public OrderItemsCreateForm convertEntityToCreateDTO(OrderItems orderItem) {
        return OrderItemsCreateForm.builder()
                .orderId(orderItem.getOrderId().getId())
                .productVariantsId(orderItem.getProductVariantsId().getId())
                .quantity(orderItem.getQuantity())
                .build();
    }

    public List<OrderItemsDTO> convertPageToList(List<OrderItems> orderItems) {
        return orderItems.stream()
                .map(this::convertEntityToDTO)
                .toList();
    }

    public List<OrderItems> convertCreateDTOListToEntityList(List<OrderItemsCreateForm> orderItemDTOs) {
        return orderItemDTOs.stream()
                .map(this::convertCreateDTOToEntity)
                .toList();
    }
}
