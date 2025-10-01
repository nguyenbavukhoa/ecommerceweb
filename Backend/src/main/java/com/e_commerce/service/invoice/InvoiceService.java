package com.e_commerce.service.invoice;

import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.invoice.invoiceDTO.InvoiceCreateForm;
import com.e_commerce.dto.invoice.invoiceDTO.InvoiceDTO;
import com.e_commerce.dto.invoice.invoiceDTO.InvoiceFilter;
import com.e_commerce.entity.invoice.Invoice;
import org.springframework.stereotype.Service;

@Service
public interface InvoiceService {
    Invoice getInvoiceById(Integer id);

    InvoiceDTO createInvoice(InvoiceCreateForm invoiceCreateForm);

    PageDTO<InvoiceDTO> getAllInvoices(int page, int size, InvoiceFilter invoiceFilter);
}
