package com.e_commerce.repository.invoice;

import com.e_commerce.entity.invoice.Invoice;
import com.e_commerce.entity.order.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer>, JpaSpecificationExecutor<Invoice> {
    long countByCreatedAtBetween(LocalDateTime startOfDay, java.time.LocalDateTime endOfDay);

    boolean existsByOrder(Orders order);
}
