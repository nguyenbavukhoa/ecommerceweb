package com.e_commerce.service.payment.impl;

import com.e_commerce.dto.payment.PaymentMethodDTO.PaymentMethodCreateDTO;
import com.e_commerce.dto.payment.PaymentMethodDTO.PaymentMethodDTO;
import com.e_commerce.entity.payment.PaymentMethod;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.payment.PaymentMethodMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.payment.PaymentMethodRepository;
import com.e_commerce.service.payment.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentMethodServiceImpl implements PaymentMethodService {
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentMethodMapper paymentMethodMapper;


    @Override
    public List<PaymentMethodDTO> getAllPaymentMethods() {
        List<PaymentMethod> paymentMethods = paymentMethodRepository.findAll();
        return paymentMethodMapper.convertPageToListDTO(paymentMethods);
    }

    @Override
    public PaymentMethod getPaymentMethodEntityById(Integer id) {
        return paymentMethodRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.PAYMENT_METHOD_NOT_FOUND));
    }

    @Override
    public PaymentMethodDTO createPaymentMethod(PaymentMethodCreateDTO paymentMethodCreateDTO) {
        PaymentMethod paymentMethod = paymentMethodMapper.convertCreateDTOToEntity(paymentMethodCreateDTO);
        paymentMethod.setId(IdGenerator.getGenerationId());
        return paymentMethodMapper.convertEntityToDTO(paymentMethodRepository.save(paymentMethod));
    }

    @Override
    public PaymentMethodDTO updatePaymentMethod(Integer id, PaymentMethodCreateDTO paymentMethodCreateDTO) {
        PaymentMethod existingPaymentMethod = getPaymentMethodEntityById(id);

        if(paymentMethodCreateDTO.getName() != null) {
            existingPaymentMethod.setName(paymentMethodCreateDTO.getName());
        }

        if(paymentMethodCreateDTO.getCode() != null) {
            existingPaymentMethod.setCode(paymentMethodCreateDTO.getCode());
        }

        if(paymentMethodCreateDTO.getDescription() != null) {
            existingPaymentMethod.setDescription(paymentMethodCreateDTO.getDescription());
        }

        if(paymentMethodCreateDTO.getIsActive() != null) {
            existingPaymentMethod.setIsActive(paymentMethodCreateDTO.getIsActive());
        }
        return paymentMethodMapper.convertEntityToDTO(paymentMethodRepository.save(existingPaymentMethod));
    }
}
