package com.e_commerce.service.payment;

import com.e_commerce.dto.payment.PaymentMethodDTO.PaymentMethodCreateDTO;
import com.e_commerce.dto.payment.PaymentMethodDTO.PaymentMethodDTO;
import com.e_commerce.entity.payment.PaymentMethod;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PaymentMethodService {
    List<PaymentMethodDTO> getAllPaymentMethods();

    PaymentMethod getPaymentMethodEntityById(Integer id);

    PaymentMethodDTO createPaymentMethod(PaymentMethodCreateDTO paymentMethodCreateDTO);

    PaymentMethodDTO updatePaymentMethod(Integer id, PaymentMethodCreateDTO paymentMethodCreateDTO);
}
