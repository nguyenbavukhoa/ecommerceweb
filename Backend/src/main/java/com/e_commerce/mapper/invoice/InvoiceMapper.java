package com.e_commerce.mapper.invoice;

import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.invoice.invoiceDTO.InvoiceCreateForm;
import com.e_commerce.dto.invoice.invoiceDTO.InvoiceDTO;
import com.e_commerce.entity.invoice.Invoice;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class InvoiceMapper {
    public InvoiceDTO convertEntityToDTO(Invoice invoice) {
        return InvoiceDTO.builder()
                .id(invoice.getId())
                .invoiceCode(invoice.getInvoiceNumber())
                .customerName(invoice.getCustomer().getAccountName())
                .phoneNumber(invoice.getUserInformation().getFullName())
                .address(invoice.getUserInformation().getAddress())
                .staffName(invoice.getStaff().getAccountName())
                .paymentMethod(invoice.getPaymentMethod().getName())
                .shippingFee(invoice.getShippingFee())
                .voucherCode(invoice.getVoucher().getCode())
                .totalAmount(invoice.getTotalAmount())
                .build();
    }

    public List<InvoiceDTO> convertEntityListToDTOList(List<Invoice> invoices) {
        return invoices.stream()
                .map(this::convertEntityToDTO)
                .toList();
    }

    public PageDTO<InvoiceDTO> convertEntityPageToDTOPage(Page<Invoice> invoicePage) {
        return PageDTO.<InvoiceDTO>builder()
                .content(convertEntityListToDTOList(invoicePage.getContent()))
                .page(invoicePage.getNumber())
                .size(invoicePage.getSize())
                .totalElements(invoicePage.getTotalElements())
                .totalPages(invoicePage.getTotalPages())
                .build();
    }
}
