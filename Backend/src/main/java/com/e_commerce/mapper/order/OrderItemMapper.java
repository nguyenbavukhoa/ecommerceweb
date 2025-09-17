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
                .productVariantsId(orderItem.getProductVariant().getId())
                .quantity(orderItem.getQuantity())
                .orderId(orderItem.getOrder().getId())
                .imgUrl(orderItem.getProductVariant().getImgUrl())
                .productName(orderItem.getProductVariant().getProduct().getName())
                .price(orderItem.getProductVariant().getPrice())
                .note(orderItem.getNote())
                .build();
    }

    public OrderItems convertCreateDTOToEntity(OrderItemsCreateForm orderItemDTO) {
        return OrderItems.builder()
                .note(orderItemDTO.getNote())
                .build();
    }

    public OrderItemsCreateForm convertEntityToCreateDTO(OrderItems orderItem) {
        return OrderItemsCreateForm.builder()
                .productVariantsId(orderItem.getProductVariant().getId())
                .quantity(orderItem.getQuantity())
                .note(orderItem.getNote())
                .variantValueId(orderItem.getVariantValue() != null ? orderItem.getVariantValue().getId() : null)
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
