package com.e_commerce.dto.invoice.invoiceDTO;

import com.e_commerce.dto.invoice.invoiceDetailsDTO.InvoiceDetailsDTO;
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
public class InvoiceDTO {
    private Integer id;

    private String invoiceCode;

    private String customerName;
    private String phoneNumber;
    private String address;

    private String staffName;
    private String paymentMethod;

    private Integer totalQuantity;
    private String voucherCode;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;

    private List<InvoiceDetailsDTO> items;
}
