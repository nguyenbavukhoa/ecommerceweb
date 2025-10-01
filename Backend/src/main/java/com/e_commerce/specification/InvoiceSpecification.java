package com.e_commerce.specification;

import com.e_commerce.dto.invoice.invoiceDTO.InvoiceFilter;
import com.e_commerce.entity.invoice.Invoice;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class InvoiceSpecification {
    public static Specification<Invoice> filterInvoice(InvoiceFilter invoiceFilter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter theo invoiceNumber (LIKE, ignore case)
            if (invoiceFilter.getInvoiceNumber() != null && !invoiceFilter.getInvoiceNumber().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("invoiceNumber")),
                        "%" + invoiceFilter.getInvoiceNumber().toLowerCase() + "%"
                ));
            }

            // Filter theo ngày xuất hóa đơn (startDate, endDate)
            if (invoiceFilter.getStartDate() != null && !invoiceFilter.getStartDate().isEmpty()) {
                LocalDateTime startDate = LocalDateTime.parse(invoiceFilter.getStartDate());
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("invoiceDate"), startDate
                ));
            }

            if (invoiceFilter.getEndDate() != null && !invoiceFilter.getEndDate().isEmpty()) {
                LocalDateTime endDate = LocalDateTime.parse(invoiceFilter.getEndDate());
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("invoiceDate"), endDate
                ));
            }

            // Filter theo tổng tiền (>= minTotalAmount)
            if (invoiceFilter.getMinTotalAmount() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("totalAmount"), BigDecimal.valueOf(invoiceFilter.getMinTotalAmount())
                ));
            }

            // Filter theo tổng tiền (<= maxTotalAmount)
            if (invoiceFilter.getMaxTotalAmount() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("totalAmount"), BigDecimal.valueOf(invoiceFilter.getMaxTotalAmount())
                ));
            }

            // Filter theo tên khách hàng
            if (invoiceFilter.getCustomerName() != null && !invoiceFilter.getCustomerName().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("customer").get("accountName")),
                        "%" + invoiceFilter.getCustomerName().toLowerCase() + "%"
                ));
            }

            // Filter theo tên nhân viên
            if (invoiceFilter.getStaffName() != null && !invoiceFilter.getStaffName().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("staff").get("accountName")),
                        "%" + invoiceFilter.getStaffName().toLowerCase() + "%"
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
