package com.e_commerce.util;

import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.service.account.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service

public class RateLimitService {
    private final RedisService redisService;

    private final int otpPerMinute;
    private final int otpPerHour;

    public RateLimitService(RedisService redisService, @Value("${ratelimit.otp.per-minute}") int otpPerMinute,@Value("${ratelimit.otp.per-hour}") int otpPerHour) {
        this.redisService = redisService;
        this.otpPerMinute = otpPerMinute;
        this.otpPerHour = otpPerHour;
    }

    public void checkOtpLimit(String email) {
        boolean minuteAllowed = checkLimit(RedisKeyUtil.otpLimitMinuteKey(email), otpPerMinute, Duration.ofMinutes(1));
        boolean hourAllowed = checkLimit(RedisKeyUtil.otpLimitHourKey(email), otpPerHour, Duration.ofHours(1));

        if (!minuteAllowed || !hourAllowed) {
            throw new CustomException(ErrorResponse.OTP_RATE_LIMIT_EXCEEDED);
        }
    }

    private boolean checkLimit(String key, int maxRequests, Duration ttl) {
        Long count = redisService.increment(key);

        if (count == null) {
            return false; // nếu Redis gặp sự cố → chặn để an toàn
        }

        if (count == 1) {
            redisService.expire(key, ttl);
        }

        return count <= maxRequests;
    }
}
