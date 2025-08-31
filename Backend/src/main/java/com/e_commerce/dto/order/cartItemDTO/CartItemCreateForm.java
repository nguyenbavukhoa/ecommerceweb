package com.e_commerce.dto.order.cartItemDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemCreateForm {
    @NotNull(message = "CartId cannot be null")
    private Integer accountId;

    @NotNull(message = "ProductVariantsId cannot be null")
    private Integer productVariantsId;

    @NotNull(message = "VariantValuesId cannot be null")
    private Integer variantValuesId;

    @NotNull(message = "Quantity cannot be null")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}
