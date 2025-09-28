package com.e_commerce.util;

import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.account.RedisService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;


@Component
public class LoginAttemptService {
    private final RedisService redisService;
    private final int maxLoginAttempts;
    private final int loginAttemptExpiryMinutes;
    private final int lockMinutes;

    public LoginAttemptService(RedisService redisService, @Value("${login.max-attempts}") int maxLoginAttempts,@Value("${login.attempt-expiry-minutes}") int loginAttemptExpiryMinutes, @Value("${login.lock-duration-minutes}") int lockMinutes) {
        this.redisService = redisService;
        this.maxLoginAttempts = maxLoginAttempts;
        this.loginAttemptExpiryMinutes = loginAttemptExpiryMinutes;
        this.lockMinutes = lockMinutes;
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
    }

    public void lockTemporarily(String email) {
        String lockKey = RedisKeyUtil.loginLockKey(email);
        if (!redisService.exists(lockKey)) {
            redisService.set(lockKey, "LOCKED", Duration.ofMinutes(lockMinutes));
            redisService.delete(RedisKeyUtil.loginAttemptKey(email));
        }
    }

    public long incrementFraud(String email) {
        String fraudKey = RedisKeyUtil.loginFraudKey(email);
        long count = redisService.increment(fraudKey);
        if (count == 1) {
            redisService.expire(fraudKey, Duration.ofHours(1));
        }
        return count;
    }


    public boolean isBlocked(String email) {
        String lockKey = RedisKeyUtil.loginLockKey(email);
        return redisService.exists(lockKey);
    }


    public int getRemainingAttempts(String email) {
        String loginAttemptKey = RedisKeyUtil.loginAttemptKey(email);
        String attemptsStr = redisService.get(loginAttemptKey);
        int attempts = attemptsStr != null ? Integer.parseInt(attemptsStr) : 0;
        return Math.max(0, maxLoginAttempts - attempts);
    }

    public long getLockTimeRemaining(String email) {
        String lockKey = RedisKeyUtil.loginLockKey(email);
        Duration duration = redisService.getExpire(lockKey);
        return duration != null ? duration.toMinutes() : 0;
    }

    public void clearLoginState(String email) {
        redisService.delete(RedisKeyUtil.loginAttemptKey(email));
        redisService.delete(RedisKeyUtil.loginLockKey(email));
        redisService.delete(RedisKeyUtil.loginFraudKey(email));
    }

}
