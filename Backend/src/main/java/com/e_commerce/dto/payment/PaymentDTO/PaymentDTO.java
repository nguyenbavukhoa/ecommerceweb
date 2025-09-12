package com.e_commerce.dto.payment.PaymentDTO;

import lombok.Data;

@Data
public class PaymentDTO {
    public String code;
    public String message;
    public String paymentUrl;
}
