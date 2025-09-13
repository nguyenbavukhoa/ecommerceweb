package com.e_commerce.service.payment.impl;

import com.e_commerce.dto.payment.PaymentMethodDTO.PaymentMethodDTO;
import com.e_commerce.entity.payment.PaymentMethod;
import com.e_commerce.service.payment.PaymentMethodService;
import org.springframework.stereotype.Service;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {
    @Override
    public PaymentMethodDTO getAllPaymentMethods() {
        return null;
    }

    @Override
    public PaymentMethod getPaymentMethodEntityById(Integer id) {
        return null;
    }

    @Override
    public PaymentMethodDTO createPaymentMethod(PaymentMethodDTO paymentMethodDTO) {
        return null;
    }
}
