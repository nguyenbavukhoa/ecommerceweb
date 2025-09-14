package com.e_commerce.dto.payment.PaymentMethodDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentMethodUpdateDTO {
    private String name;

    private String code;

    private String description;

    private Boolean isActive;
}
