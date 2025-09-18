package com.e_commerce.service.payment;

import com.e_commerce.dto.payment.PaymentDTO.PaymentDTO;
import com.e_commerce.entity.payment.Payment;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public interface PaymentService {
    Payment getPaymentEntityById(Integer id);
    PaymentDTO createPayment(HttpServletRequest request);

    void paymentCallback(HttpServletRequest request);

//    void checkPendingPayments();
}
