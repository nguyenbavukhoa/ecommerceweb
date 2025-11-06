package com.e_commerce.mapper.invoice;

import com.e_commerce.dto.invoice.invoiceDetailsDTO.InvoiceDetailsDTO;
import com.e_commerce.entity.invoice.InvoiceDetails;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class InvoiceDetailsMapper {
    public InvoiceDetailsDTO convertEntityToDTO(InvoiceDetails invoiceDetails) {
        return InvoiceDetailsDTO.builder()
                .id(invoiceDetails.getId())
                .invoiceId(invoiceDetails.getInvoice().getId())
                .productName(invoiceDetails.getProduct().getName())
                .quantity(invoiceDetails.getQuantity())
                .unitPrice(invoiceDetails.getUnitPrice())
                .lineTotal(invoiceDetails.getLineTotal())
                .build();
    }


    public List<InvoiceDetailsDTO> convertPageToList(List<InvoiceDetails> invoiceDetails) {
        return invoiceDetails.stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }
}
