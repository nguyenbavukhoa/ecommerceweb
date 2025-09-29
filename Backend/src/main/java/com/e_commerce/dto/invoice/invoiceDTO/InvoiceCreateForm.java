package com.e_commerce.dto.invoice.invoiceDTO;

import com.e_commerce.dto.invoice.invoiceDetailsDTO.InvoiceDetailsCreateForm;
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
    private Integer customerId;

    private Integer staffId;

    private Integer paymentMethodId;

    private BigDecimal shippingFee = BigDecimal.ZERO;

    private Integer voucherId;

    private List<InvoiceDetailsCreateForm> items;
}
