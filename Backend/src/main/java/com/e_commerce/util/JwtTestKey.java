//package com.e_commerce.util;
//
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.security.Keys;
//import jakarta.annotation.PostConstruct;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.SecretKey;
//import java.time.Instant;
//import java.time.ZoneId;
//import java.time.ZonedDateTime;
//import java.time.temporal.ChronoUnit;
//import java.util.Base64;
//import java.util.Date;
//
//@Component
//public class JwtTestKey {
//    @PostConstruct
//    public void init() {
//        Instant now = Instant.now();
//        ZonedDateTime vnTime = now.atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
//        System.out.println("Thời gian hiện tại: " + vnTime);
//
//        // Cộng thêm 5000 milliseconds (5 giây)
//        Instant after5Seconds = now.plus(5000, ChronoUnit.MILLIS);
//        System.out.println("Sau 5 giây: " + after5Seconds);
//
//        // Cộng thêm 1 ngày = 86400000 milliseconds
//        Instant after1Day = now.plus(86400000, ChronoUnit.MILLIS);
//        System.out.println("Sau 1 ngày: " + after1Day);
//
//        Date nowDate = new Date(System.currentTimeMillis());
//        Date after5SecondsDate = new Date(System.currentTimeMillis() + 5000);
//        Date after1DayDate = new Date(System.currentTimeMillis() + 86400000);
//        System.out.println("Date hiện tại: " + nowDate);
//        System.out.println("Date sau 5 giây: " + after5SecondsDate);
//        System.out.println("Date sau 1 ngày: " + after1DayDate);
//    }
//}
