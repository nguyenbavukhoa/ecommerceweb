package com.e_commerce.dto.order.orderDTO;


import com.e_commerce.dto.order.orderItemsDTO.OrderItemsCreateForm;
import com.e_commerce.enums.OrderStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderCreateForm {
    @NotNull(message = "Order status cannot be null")
    private OrderStatus orderStatus;

    @NotNull(message = "Order items must not be null")
    @NotEmpty(message = "Order must have at least one item")
    private List<OrderItemsCreateForm> listOrderItems;

    private String note;

    private Integer userInfoId;
}
