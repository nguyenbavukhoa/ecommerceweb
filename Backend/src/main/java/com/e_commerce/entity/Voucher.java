package com.e_commerce.entity;

import com.e_commerce.enums.VoucherType;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = false)
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Voucher extends Timestamped {
    @Id
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoucherType type;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "percent")
    private Double percent;

    @Column(name = "min_order_value")
    private BigDecimal minOrderValue;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "active", nullable = false)
    private Boolean active = true;
}