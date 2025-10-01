package com.e_commerce.dto.voucher;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VoucherCheck {
    private boolean valid;
    private String message;
    private VoucherDTO voucher;
}
