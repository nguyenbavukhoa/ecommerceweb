package com.e_commerce.dto.payment.PaymentDTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentDTO {
    public String code;
    public String message;
    public String paymentUrl;
}
