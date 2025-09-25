package com.e_commerce.controller.payment;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.payment.PaymentDTO.PaymentDTO;
import com.e_commerce.service.payment.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping("/pay" )
    public ResponseEntity<ApiResponse<PaymentDTO>> createPayment(HttpServletRequest request) {
        PaymentDTO paymentDTO = paymentService.createPayment(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Payment URL generated successfully", paymentDTO, null,
                request.getRequestURI()));
    }

    @RequestMapping(value = "/vnpay/callback", method = { RequestMethod.GET, RequestMethod.POST })
    public ResponseEntity<ApiResponse<PaymentDTO>> paymentCallback(HttpServletRequest request) {
        log.info(">>> VNPay IPN CALLED <<<");
        log.info("VNPay callback called: {}", request.getQueryString());
        try {
            log.info("Processing VNPay payment callback");
            paymentService.paymentCallback(request);
            return ResponseEntity
                    .ok(new ApiResponse<>(true, "Payment processed successfully", null, null, request.getRequestURI()));
        } catch (Exception e) {
            log.info("Error processing VNPay payment callback: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null, null, request.getRequestURI()));
        }
    }

    @GetMapping("/vnpay/return")
    public ResponseEntity<ApiResponse<PaymentDTO>> paymentReturn(HttpServletRequest request) {
        log.info("VNPay returnUrl called: {}", request.getQueryString());
        String responseCode = request.getParameter("vnp_ResponseCode");
        String txnRef = request.getParameter("vnp_TxnRef");

        if ("00".equals(responseCode)) {

            PaymentDTO paymentDTO = new PaymentDTO(
                    "00",
                    "Payment successful",
                    "Payment ID: " + txnRef);

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Payment successful", paymentDTO, null, request.getRequestURI()));
        } else {
            PaymentDTO paymentDTO = new PaymentDTO(
                    responseCode,
                    "Payment failed",
                    "Payment ID: " + txnRef);

            return ResponseEntity.ok(
                    new ApiResponse<>(false, "Payment failed", paymentDTO, null, request.getRequestURI()));
        }
    }

}
