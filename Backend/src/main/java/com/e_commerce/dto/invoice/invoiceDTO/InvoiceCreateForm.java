package com.e_commerce.dto.invoice.invoiceDTO;

import com.e_commerce.dto.invoice.invoiceDetailsDTO.InvoiceDetailsCreateForm;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvoiceCreateForm {
    @NotNull(message = "Order ID is required")
    private Integer orderId;

    private Integer staffId;

    private Integer paymentMethodId;

    @NotNull(message = "Shipping fee cannot be null")
    @DecimalMin(value = "0.0", inclusive = true, message = "Shipping fee cannot be negative")
    private BigDecimal shippingFee = BigDecimal.ZERO;

    private Integer voucherId;

    @NotEmpty(message = "Invoice must have at least 1 item")
    private List<@Valid InvoiceDetailsCreateForm> items;
}
