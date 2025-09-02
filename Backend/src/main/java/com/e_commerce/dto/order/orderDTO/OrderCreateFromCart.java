package com.e_commerce.dto.order.orderDTO;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderCreateFromCart {
    @NotNull(message = "User ID cannot be null")
    private Integer userId;

    @NotEmpty(message = "Selected cart items cannot be empty")
    private List<Integer> selectedCartItemIds;

    @Size(max = 1000, message = "Order note cannot exceed 1000 characters")
    private String orderNote;
}
