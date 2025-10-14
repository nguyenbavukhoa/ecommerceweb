package com.e_commerce.dto.invoice.invoiceDetailsDTO;

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
public class InvoiceDetailsCreateForm {
    @NotNull(message = "ProductId cannot be null")
    private Integer productId;

    @NotNull(message = "OptionValueId cannot be null")
    private Integer optionValueId;

    @NotNull(message = "Quantity cannot be null")
    private Integer quantity;

    @NotNull(message = "UnitPrice cannot be null")
    private BigDecimal unitPrice;
}
