package com.e_commerce.dto.product.optionValuesDTO;

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
public class OptionValuesCreateDTO {
    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "StockQuantity is required")
    private Integer stockQuantity;

    @NotNull(message = "OptionsGroupId is required")
    private Integer optionsGroupId;
}
