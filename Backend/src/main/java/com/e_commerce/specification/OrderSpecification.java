package com.e_commerce.specification;

import com.e_commerce.dto.order.orderDTO.OrderFilter;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.enums.OrderStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

public class OrderSpecification {
    public static Specification<Orders> filterOrder(OrderFilter filter, Integer accountId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter theo accountId
            if (accountId != null) {
                predicates.add(criteriaBuilder.equal(root.get("account").get("id"), accountId));
            }

            // Filter theo status (enum)
            if (filter.getOrderStatus() != null && !filter.getOrderStatus().isEmpty()) {
                try {
                    OrderStatus status = OrderStatus.valueOf(filter.getOrderStatus().toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("orderStatus"), status));
                } catch (IllegalArgumentException ex) {
                    throw new IllegalArgumentException("Invalid order status: " + filter.getOrderStatus());
                }
            }

            // Filter theo startDate - endDate (orderTime)
            if (filter.getStartDate() != null && !filter.getStartDate().isEmpty()) {
                try {
                    LocalDateTime startDate = LocalDateTime.parse(filter.getStartDate());
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("orderTime"), startDate));
                } catch (DateTimeParseException e) {
                    throw new IllegalArgumentException("Invalid startDate format, must be yyyy-MM-ddTHH:mm:ss");
                }
            }

            if (filter.getEndDate() != null && !filter.getEndDate().isEmpty()) {
                try {
                    LocalDateTime endDate = LocalDateTime.parse(filter.getEndDate());
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("orderTime"), endDate));
                } catch (DateTimeParseException e) {
                    throw new IllegalArgumentException("Invalid endDate format, must be yyyy-MM-ddTHH:mm:ss");
                }
            }

            // Filter theo totalPrice (min - max)
            if (filter.getMinTotalPrice() != null && filter.getMaxTotalPrice() != null) {
                predicates.add(criteriaBuilder.between(
                        root.get("totalPrice"),
                        BigDecimal.valueOf(filter.getMinTotalPrice()),
                        BigDecimal.valueOf(filter.getMaxTotalPrice())
                ));
            } else if (filter.getMinTotalPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("totalPrice"), BigDecimal.valueOf(filter.getMinTotalPrice())
                ));
            } else if (filter.getMaxTotalPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("totalPrice"), BigDecimal.valueOf(filter.getMaxTotalPrice())
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
