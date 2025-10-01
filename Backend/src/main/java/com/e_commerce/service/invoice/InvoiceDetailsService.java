package com.e_commerce.service.invoice;

import com.e_commerce.dto.invoice.invoiceDetailsDTO.InvoiceDetailsDTO;
import com.e_commerce.entity.invoice.Invoice;
import com.e_commerce.entity.invoice.InvoiceDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InvoiceDetailsService {
    List<InvoiceDetails> createInvoiceDetailsFromOrder(Integer orderId, Invoice invoice);

    List<InvoiceDetailsDTO> getInvoiceDetailsDTOByInvoiceId(Integer invoiceId);

    Integer calculateTotalQuantityByInvoiceId(Integer invoiceId);
}
