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

    @NotNull(message = "ProductVariantsId cannot be null")
    private Integer productVariantsId;

    @NotNull(message = "Quantity cannot be null")
    private Integer quantity;

    private String note;
}
