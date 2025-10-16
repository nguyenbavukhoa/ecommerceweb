package com.e_commerce.dto.voucher;

import com.e_commerce.enums.VoucherType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VoucherDTO {
    private Integer id;

    private String code;

    private VoucherType type;

    private Double value;

    private BigDecimal minOrderValue;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Boolean isActive;
}
