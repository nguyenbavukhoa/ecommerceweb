package com.e_commerce.service.email;

import com.e_commerce.enums.OrderStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public interface EmailService {
    void sendEmailOTP(String email, String otp, int otpExpirationMinutes);

    void sendPaymentSuccessEmail(String customerEmail, String customerName, String orderId, String transactionId, BigDecimal amount);

    void sendPaymentFailedEmail(String customerEmail, String customerName, String orderId, String transactionId);

    void sendOrderStatusEmail(OrderStatus status,String customerEmail,String customerName,String orderId, BigDecimal amount);

    void sendRegistrationUserConfirm(String email);
}
