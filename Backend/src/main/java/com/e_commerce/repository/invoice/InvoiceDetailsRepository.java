package com.e_commerce.repository.invoice;

import com.e_commerce.entity.invoice.InvoiceDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceDetailsRepository extends JpaRepository<InvoiceDetails, Integer> {
}
