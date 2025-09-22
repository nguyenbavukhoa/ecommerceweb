package com.e_commerce.util;

import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.service.account.RedisService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;


@Component
public class LoginAttemptService {
    private final RedisService redisService;
    private final int maxLoginAttempts;
    private final int loginAttemptExpiryMinutes;

    public LoginAttemptService(RedisService redisService, @Value("${login.max-attempts}") int maxLoginAttempts,@Value("${login.attempt-expiry-minutes}") int loginAttemptExpiryMinutes) {
        this.redisService = redisService;
        this.maxLoginAttempts = maxLoginAttempts;
        this.loginAttemptExpiryMinutes = loginAttemptExpiryMinutes;
    }

    public void loginSucceeded(String email) {
        String loginAttemptKey = RedisKeyUtil.loginAttemptKey(email);
        redisService.delete(loginAttemptKey);
    }

    public void loginFailed(String email) {
        String loginAttemptKey = RedisKeyUtil.loginAttemptKey(email);
        Long attempts = redisService.increment(loginAttemptKey);
        if (attempts != null && attempts == 1) {
            redisService.expire(loginAttemptKey, Duration.ofMinutes(loginAttemptExpiryMinutes));
        }
        if (attempts != null && attempts >= maxLoginAttempts) {
            throw new CustomException(ErrorResponse.ACCOUNT_MAX_LOGIN_ATTEMPTS_EXCEEDED);
        }
    }

    public boolean isBlocked(String email) {
        String loginAttemptKey = RedisKeyUtil.loginAttemptKey(email);
        String attemptsStr = redisService.get(loginAttemptKey);
        int attempts = attemptsStr != null ? Integer.parseInt(attemptsStr) : 0;
        return attempts >= maxLoginAttempts;
    }

    public int getRemainingAttempts(String email) {
        String loginAttemptKey = RedisKeyUtil.loginAttemptKey(email);
        String attemptsStr = redisService.get(loginAttemptKey);
        int attempts = attemptsStr != null ? Integer.parseInt(attemptsStr) : 0;
        return Math.max(0, maxLoginAttempts - attempts);
    }
}
