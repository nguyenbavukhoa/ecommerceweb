package com.e_commerce.service.payment.impl;

import com.e_commerce.configuration.VNPAYConfig;
import com.e_commerce.dto.payment.PaymentDTO.PaymentDTO;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.entity.payment.Payment;
import com.e_commerce.entity.payment.PaymentMethod;
import com.e_commerce.enums.OrderStatus;
import com.e_commerce.enums.PaymentStatus;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.payment.PaymentRepository;
import com.e_commerce.service.order.OrderService;
import com.e_commerce.service.payment.PaymentMethodService;
import com.e_commerce.service.payment.PaymentService;
import com.e_commerce.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {
    private final VNPAYConfig vnPayConfig;
    private final OrderService orderService;
    private final PaymentRepository paymentRepository;
    private final PaymentMethodService paymentMethodService;

    @Override
    public PaymentDTO createPayment(HttpServletRequest request) {
        Orders order = orderService.getOrder();
        String paymentType = request.getParameter("paymentType");

        Payment payment = new Payment();
        payment.setId(IdGenerator.getGenerationId());
        payment.setOrder(order);
        payment.setAmount(orderService.getOrder().getTotalPrice());
        payment.setPaymentTime(new Date().toInstant().atZone(TimeZone.getDefault().toZoneId()).toLocalDateTime());

        if(paymentType.equals("CASH")) {
            PaymentMethod paymentMethod = paymentMethodService.getPaymentMethodEntityById(2); // 2 is COD
            payment.setPaymentMethod(paymentMethod);
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setTransactionId("CASH-" + order.getId());
            paymentRepository.save(payment);

            order.setOrderStatus(OrderStatus.PLACED);
            return PaymentDTO.builder()
                    .code("ok")
                    .message("success")
                    .paymentUrl(null).build();
        }

        PaymentMethod paymentMethod = paymentMethodService.getPaymentMethodEntityById(1); // 1 is VNPAY
        payment.setPaymentMethod(paymentMethod);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setTransactionId(null);
        paymentRepository.save(payment);

        long amount = orderService.getOrder().getTotalPrice().multiply(new BigDecimal(100)).longValue();
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        String txnRef = String.valueOf(orderService.getOrder().getId());

        vnpParamsMap.put("vnp_TxnRef", txnRef);
        vnpParamsMap.put("vnp_OrderInfo", "Thanh toan don hang: " + txnRef);
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));

        log.info("Amount: {}", amount);

        String bankCode = request.getParameter("bankCode");
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
