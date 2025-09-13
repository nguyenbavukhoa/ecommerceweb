package com.e_commerce.service.payment;

import com.e_commerce.dto.payment.PaymentMethodDTO.PaymentMethodDTO;
import com.e_commerce.entity.payment.PaymentMethod;
import org.springframework.stereotype.Service;

@Service
public interface PaymentMethodService {
    PaymentMethodDTO getAllPaymentMethods();

    PaymentMethod getPaymentMethodEntityById(Integer id);

    PaymentMethodDTO createPaymentMethod(PaymentMethodDTO paymentMethodDTO);


}
