package com.e_commerce.mapper.payment;

import com.e_commerce.dto.payment.PaymentMethodDTO.PaymentMethodCreateDTO;
import com.e_commerce.dto.payment.PaymentMethodDTO.PaymentMethodDTO;
import com.e_commerce.dto.payment.PaymentMethodDTO.PaymentMethodUpdateDTO;
import com.e_commerce.entity.payment.PaymentMethod;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PaymentMethodMapper {
    public PaymentMethodDTO convertEntityToDTO(PaymentMethod paymentMethod) {
        return PaymentMethodDTO.builder()
                .id(paymentMethod.getId())
                .name(paymentMethod.getName())
                .code(paymentMethod.getCode())
                .description(paymentMethod.getDescription())
                .isActive(paymentMethod.getIsActive())
                .build();
    }

    public PaymentMethod convertCreateDTOToEntity(PaymentMethodCreateDTO paymentMethodCreateDTO) {
        return PaymentMethod.builder()
                .name(paymentMethodCreateDTO.getName())
                .code(paymentMethodCreateDTO.getCode())
                .description(paymentMethodCreateDTO.getDescription())
                .isActive(paymentMethodCreateDTO.getIsActive())
                .build();
    }

    public PaymentMethod convertUpdateDTOToEntity(PaymentMethodUpdateDTO paymentMethodUpdateDTO) {
        return PaymentMethod.builder()
                .name(paymentMethodUpdateDTO.getName())
                .code(paymentMethodUpdateDTO.getCode())
                .description(paymentMethodUpdateDTO.getDescription())
                .isActive(paymentMethodUpdateDTO.getIsActive())
                .build();
    }

    public List<PaymentMethodDTO> convertPageToListDTO(List<PaymentMethod> paymentMethodList) {
        return paymentMethodList.stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }
}
