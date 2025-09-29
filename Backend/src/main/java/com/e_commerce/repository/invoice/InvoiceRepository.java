package com.e_commerce.repository.invoice;

import com.e_commerce.entity.invoice.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
}
