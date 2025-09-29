package com.e_commerce.dto.invoice.invoiceDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvoiceCreateFormOrder {
    private Integer orderId;

    private Integer staffId;

    private Integer paymentMethodId;

    private Integer voucherId;

    private BigDecimal shippingFee = BigDecimal.ZERO;
}
