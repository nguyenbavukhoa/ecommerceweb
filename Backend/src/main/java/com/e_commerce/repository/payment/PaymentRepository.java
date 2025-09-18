package com.e_commerce.repository.payment;

import com.e_commerce.entity.payment.Payment;
import com.e_commerce.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByStatus(PaymentStatus status);
}
