package com.e_commerce.controller.payment;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.payment.PaymentDTO.PaymentDTO;
import com.e_commerce.service.payment.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/callback")
    public ResponseEntity<ApiResponse<PaymentDTO>> paymentCallback(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");

        if ("00".equals(status)) {
            PaymentDTO paymentDTO = new PaymentDTO(
                    "00",
                    "Payment successful",
                    request.getParameter("vnp_TxnRef") // hoặc thêm orderId/paymentId tuỳ bạn cần
            );

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Payment successful", paymentDTO, null, request.getRequestURI())
            );
        } else {
            PaymentDTO paymentDTO = new PaymentDTO(
                    status,
                    "Payment failed",
                    request.getParameter("vnp_TxnRef")
            );

            return ResponseEntity.ok(
                    new ApiResponse<>(false, "Payment failed", paymentDTO, null, request.getRequestURI())
            );
        }
    }

}
