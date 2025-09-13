package com.e_commerce.service.payment;

import com.e_commerce.dto.payment.PaymentDTO.PaymentDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public interface PaymentService {
    PaymentDTO createPayment(HttpServletRequest request);
}
