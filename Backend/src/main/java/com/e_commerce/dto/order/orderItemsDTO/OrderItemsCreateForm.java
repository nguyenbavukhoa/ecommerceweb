package com.e_commerce.dto.order.orderItemsDTO;

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
public class OrderItemsCreateForm {

    @NotNull(message = "ProductId cannot be null")
    private Integer productId;

    @NotNull(message = "Quantity cannot be null")
    private Integer quantity;

    private String note;

    private List<Integer> optionValueId;
}
