package com.e_commerce.dto.voucher;

import com.e_commerce.enums.VoucherType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class VoucherFilter {
    private String code;

    private Boolean isActive;

    private VoucherType type;

    private BigDecimal minOrderValue;

    private LocalDateTime startDate;

    private LocalDateTime endDate;
}
