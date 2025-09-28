package com.e_commerce.controller.otp;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.event.ForgotPasswordEvent;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.util.OtpUtil;
import com.e_commerce.util.RateLimitService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
public class OTPController {
    private final OtpUtil otpUtil;
    private final RateLimitService rateLimitService;
    private final ApplicationEventPublisher applicationEventPublisher;

    @PostMapping("/resend")
    public ResponseEntity<ApiResponse<String>> resendOtp(@RequestParam String email) {
        rateLimitService.checkOtpLimit(email);
        String otp = otpUtil.generateOtp(email);
        applicationEventPublisher.publishEvent(new ForgotPasswordEvent(this,email, otp));
        return ResponseEntity.ok(new ApiResponse<>(true, "OTP resent successfully", otp, null, "/otp/resend"));
    }
}
