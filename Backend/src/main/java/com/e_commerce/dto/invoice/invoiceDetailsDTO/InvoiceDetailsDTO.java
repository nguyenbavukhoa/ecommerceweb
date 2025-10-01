package com.e_commerce.dto.invoice.invoiceDetailsDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvoiceDetailsDTO {
    private Integer id;

    private Integer invoiceId;

    private Integer quantity;

    private String productName;

    private BigDecimal unitPrice;

    private BigDecimal lineTotal;
}
