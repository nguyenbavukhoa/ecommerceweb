package com.e_commerce.dto.payment.PaymentDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    public String code;
    public String message;
    public String paymentUrl;
}
