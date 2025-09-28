package com.e_commerce.util;

import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.service.account.RedisService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@Getter
@Slf4j
public class OtpUtil {
    private final RedisService redisService;

    private final int otpExpirationMinutes;
    private final int maxOtpAttempts;
    private final int otpLength;
    private final int otpAttemptExpiryMinutes;
    private final RateLimitService rateLimitService;

    public OtpUtil(RedisService redisService, @Value("${spring.otp.expiration-minutes}") int otpExpirationMinutes,@Value("${spring.otp.max-attempts}") int maxOtpAttempts,@Value("${spring.otp.length}") int otpLength,@Value("${spring.otp.attempt-expiry-minutes}") int otpAttemptExpiryMinutes, RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
        this.redisService = redisService;
        this.otpExpirationMinutes = otpExpirationMinutes;
        this.maxOtpAttempts = maxOtpAttempts;
        this.otpLength = otpLength;
        this.otpAttemptExpiryMinutes = otpAttemptExpiryMinutes;
    }

    public String generateOtp(String email) {

        String otp = generateRandomOtp();
        String otpKey = RedisKeyUtil.otpKey(email);
        String otpAttemptKey = RedisKeyUtil.otpAttemptKey(email);
        String otpVerifyKey = RedisKeyUtil.otpVerifyKey(email);

        redisService.set(otpKey, otp, Duration.ofMinutes(otpExpirationMinutes));

        redisService.delete(otpAttemptKey);

        redisService.delete(otpVerifyKey);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        String otpKey = RedisKeyUtil.otpKey(email); // Lấy khóa OTP từ email
        String otpAttemptKey = RedisKeyUtil.otpAttemptKey(email); // Lấy khóa số lần thử OTP từ email

        String storedOtp = redisService.get(otpKey); // Lấy OTP đã lưu trong Redis
        if (storedOtp == null) {
            throw new CustomException(ErrorResponse.OTP_EXPIRED_OR_INVALID);
        }

        // So sánh OTP nhập vào với OTP trong Redis
        if (storedOtp.equals(otp)) { // OTP đúng
            redisService.set(RedisKeyUtil.otpVerifyKey(email), "true", Duration.ofMinutes(otpExpirationMinutes));
            return true;
        } else { // OTP sai
            Long attempts = redisService.increment(otpAttemptKey); // Tăng số lần thử OTP
            if (attempts != null && attempts == 1) { // Nếu là lần thử đầu tiên, đặt thời gian hết hạn cho khóa số lần thử OTP
                redisService.expire(otpAttemptKey, Duration.ofMinutes(otpAttemptExpiryMinutes));
            }
            if (attempts != null && attempts >= maxOtpAttempts) { // Nếu vượt quá số lần thử tối đa, xóa OTP và khóa số lần thử
                clearOtp(email);
                throw new CustomException(ErrorResponse.OTP_MAX_ATTEMPTS_EXCEEDED);
            }
            return false;
        }
    }

    public void clearOtp(String email) {
        String otpKey = RedisKeyUtil.otpKey(email);
        String otpAttemptKey = RedisKeyUtil.otpAttemptKey(email);
        String otpVerifyKey = RedisKeyUtil.otpVerifyKey(email);

        redisService.delete(otpKey);
        redisService.delete(otpAttemptKey);
        redisService.delete(otpVerifyKey);
    }

    public boolean isOtpExists(String email) {
        String otpKey = RedisKeyUtil.otpKey(email);
        return redisService.exists(otpKey);
    }

    public int getRemainingAttempts(String email) {
        String otpAttemptKey = RedisKeyUtil.otpAttemptKey(email);
        String attemptsStr = redisService.get(otpAttemptKey);
        int attempts = attemptsStr != null ? Integer.parseInt(attemptsStr) : 0;
        return Math.max(0, maxOtpAttempts - attempts);
    }

    public boolean isOtpVerified(String email) {
        String otpVerifyKey = RedisKeyUtil.otpVerifyKey(email);
        return "true".equals(redisService.get(otpVerifyKey));
    }

    private String generateRandomOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();

        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }

        return otp.toString();
    }

    public Duration getOtpTtl(String email) {
        String otpKey = RedisKeyUtil.otpKey(email);
        return redisService.getExpire(otpKey);
    }
}
