package com.e_commerce.dto.invoice.invoiceDTO;

import lombok.Data;

@Data
public class InvoiceFilter {
    private String invoiceNumber;

    private String startDate;

    private String endDate;

    private Integer minTotalAmount;

    private Integer maxTotalAmount;

    private String customerName;

    private String staffName;
}
