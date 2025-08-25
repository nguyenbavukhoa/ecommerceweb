package com.e_commerce.dto.order.orderItemsDTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItemsCreateForm {
    @NotNull(message = "OrderId cannot be null")
    private Integer orderId;

    @NotNull(message = "ProductVariantsId cannot be null")
    private Integer productVariantsId;

    @NotNull(message = "Quantity cannot be null")
    private Integer quantity;

}
