package com.e_commerce.service.account;

import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public interface RedisService {
    void set(String key, Object value, Duration timeout);

    String get(String key);

    void delete(String key);

    boolean exists(String key);

    void expire(String key, Duration timeout);

    Long increment(String key);

    Duration getExpire(String key);

}
