package com.e_commerce.specification;
import com.e_commerce.dto.voucher.VoucherFilter;
import com.e_commerce.entity.Voucher;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;


public class VoucherSpecification {

    public static Specification<Voucher> filterVoucher(VoucherFilter voucherFilter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter theo code (LIKE, ignore case)
            if (voucherFilter.getCode() != null && !voucherFilter.getCode().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("code")),
                        "%" + voucherFilter.getCode().toLowerCase() + "%"
                ));
            }

            // Filter theo type
            if (voucherFilter.getType() != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), voucherFilter.getType()));
            }

            // Filter theo minOrderValue (>=)
            if (voucherFilter.getMinOrderValue() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("minOrderValue"), voucherFilter.getMinOrderValue()
                ));
            }

            // Filter theo active
            if (voucherFilter.getIsActive() != null) {
                predicates.add(criteriaBuilder.equal(root.get("active"), voucherFilter.getIsActive()));
            }

            // Filter theo startDate (>=)
            if (voucherFilter.getStartDate() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("startDate"), voucherFilter.getStartDate()
                ));
            }

            // Filter theo endDate (<=)
            if (voucherFilter.getEndDate() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("endDate"), voucherFilter.getEndDate()
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
