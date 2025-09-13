package com.e_commerce.controller.payment;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.payment.PaymentDTO.PaymentDTO;
import com.e_commerce.service.payment.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping("/pay")
    public ResponseEntity<ApiResponse<PaymentDTO>> createPayment(HttpServletRequest request) {
        PaymentDTO paymentDTO = paymentService.createPayment(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Payment URL generated successfully", paymentDTO, null, request.getRequestURI()));
    }
}
