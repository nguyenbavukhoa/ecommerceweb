package com.e_commerce.event;

import com.e_commerce.service.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class ForgotPasswordListener implements ApplicationListener<ForgotPasswordEvent> {
    private final EmailService emailService;
    private final int otpExpirationMinutes;

    public ForgotPasswordListener(EmailService emailService, @Value("${spring.otp.attempt-expiry-minutes}") int otpExpirationMinutes) {
        this.emailService = emailService;
        this.otpExpirationMinutes = otpExpirationMinutes;
    }


    @Override
    public void onApplicationEvent(ForgotPasswordEvent event) {
        emailService.sendEmailOTP(event.getEmail(), event.getOtp(), otpExpirationMinutes);
    }
}
