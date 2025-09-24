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
    private static final String OTP_VERIFY_PREFIX = "auth:otp-verify:";

    public static String otpKey(String email) {
        return RedisPrefix + OTP_PREFIX + email;
    }

    public static String otpAttemptKey(String email) {
        return RedisPrefix + OTP_ATTEMPT_PREFIX + email;
    }

    public static String loginAttemptKey(String email) {
        return RedisPrefix + LOGIN_ATTEMPT_PREFIX + email;
    }

    public static String otpVerifyKey(String email) {
        return RedisPrefix + OTP_VERIFY_PREFIX + email;
    }


}
