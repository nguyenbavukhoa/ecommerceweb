package com.e_commerce.dto.product.variantValuesDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VariantValuesCreateDTO {
    @NotBlank(message = "Value is mandatory")
    private String value;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "StockQuantity is required")
    private Integer stockQuantity;

    @NotNull(message = "VariantOptionsId is required")
    private Integer variantOptionsId;
}
