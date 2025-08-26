package com.e_commerce.repository.payment;

import com.e_commerce.entity.payment.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Integer> {
}
