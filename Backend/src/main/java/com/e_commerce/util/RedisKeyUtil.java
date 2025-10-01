package com.e_commerce.util;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RedisKeyUtil {
    @Value("${spring.redis.key-prefix}")
    private static String RedisPrefix;

    public RedisKeyUtil(@Value("${spring.redis.key-prefix}") String redisPrefix) {
        RedisPrefix = redisPrefix.endsWith(":") ? redisPrefix : redisPrefix + ":";
    }

    // OTP Keys
    private static final String OTP_PREFIX = "auth:otp:";
    private static final String OTP_ATTEMPT_PREFIX = "auth:otp-attempt:";
    private static final String LOGIN_ATTEMPT_PREFIX = "auth:login-attempt:";
    private static final String LOGIN_LOCK_PREFIX = "auth:login-lock:";
    private static final String LOGIN_FRAUD_PREFIX  = "auth:login-fraud:";
    private static final String OTP_VERIFY_PREFIX = "auth:otp-verify:";
    private static final String OTP_LIMIT_MINUTE_PREFIX = "auth:otp-limit-minute:";
    private static final String OTP_LIMIT_HOUR_PREFIX = "auth:otp-limit-hour:";


    public static String otpKey(String email) {
        return RedisPrefix + OTP_PREFIX + email;
    }

    public static String otpAttemptKey(String email) {
        return RedisPrefix + OTP_ATTEMPT_PREFIX + email;
    }

    public static String loginAttemptKey(String email) {
        return RedisPrefix + LOGIN_ATTEMPT_PREFIX + email;
    }

    public static String loginLockKey(String email) {
        return RedisPrefix + LOGIN_LOCK_PREFIX + email;
    }

    public static String otpVerifyKey(String email) {
        return RedisPrefix + OTP_VERIFY_PREFIX + email;
    }

    public static String otpLimitMinuteKey(String email) {
        return RedisPrefix + OTP_LIMIT_MINUTE_PREFIX + email;
    }

    public static String otpLimitHourKey(String email) {
        return RedisPrefix + OTP_LIMIT_HOUR_PREFIX + email;
    }

    public static String loginFraudKey(String email) {
        return RedisPrefix + LOGIN_FRAUD_PREFIX + email;
    }
}
