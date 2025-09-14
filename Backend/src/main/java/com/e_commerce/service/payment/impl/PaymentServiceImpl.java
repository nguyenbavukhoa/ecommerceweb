package com.e_commerce.service.payment.impl;

import com.e_commerce.configuration.VNPAYConfig;
import com.e_commerce.dto.payment.PaymentDTO.PaymentDTO;
import com.e_commerce.service.payment.PaymentService;
import com.e_commerce.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {
    private final VNPAYConfig vnPayConfig;

    @Override
    public PaymentDTO createPayment(HttpServletRequest request) {
        long amount = Integer.parseInt(request.getParameter("amount")) * 100L;
        String bankCode = request.getParameter("bankCode");
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
        //build query url
        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true); // Có Encode ký tự
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false); // Không Encode ký tự
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getVnp_SecretKey()  , hashData);

        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_Url() + "?" + queryUrl;

        log.info("Payment URL: {}", paymentUrl);
        log.info("Hash Data: {}", hashData);
        log.info("VNPay vnp_SecureHash: {}", vnpSecureHash);

        return PaymentDTO.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl).build();
    }
}
