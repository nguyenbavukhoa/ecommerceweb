package com.e_commerce.dto.voucher;

import com.e_commerce.enums.VoucherType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class VoucherCreateForm {
    @NotBlank(message = "Voucher code cannot be blank")
    @Size(max = 50, message = "Voucher code must not exceed 50 characters")
    private String code;

    @NotNull(message = "Voucher type is required")
    private VoucherType type;

    @NotNull(message = "Value is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Value must be greater than 0")
    private Double value;

    @DecimalMin(value = "0.0", inclusive = false, message = "Minimum order value must be greater than 0")
    private BigDecimal minOrderValue;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    @NotNull(message = "Active status is required")
    private Boolean isActive;
}
