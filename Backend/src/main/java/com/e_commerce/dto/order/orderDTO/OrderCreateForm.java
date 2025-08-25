package com.e_commerce.dto.order.orderDTO;


import com.e_commerce.dto.order.orderItemsDTO.OrderItemsCreateForm;
import com.e_commerce.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderCreateForm {
    @NotNull(message = "User ID cannot be null")
    private Integer userId;

    @NotNull(message = "Order status cannot be null")
    private OrderStatus orderStatus;

    @NotNull(message = "Total price cannot be null")
    private BigDecimal totalPrice;

    List<OrderItemsCreateForm> listOrderItems;
}
