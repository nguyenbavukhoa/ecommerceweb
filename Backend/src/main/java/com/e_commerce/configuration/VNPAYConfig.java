package com.e_commerce.configuration;

import com.e_commerce.util.VNPayUtil;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

@Configuration
@Data
public class VNPAYConfig {
    private final String vnp_TmnCode;
    private final String vnp_SecretKey;
    private final String vnp_Url;
    private final String vnp_ReturnUrl;
    private final String vnp_Version;
    private final String vnp_Command;
    private final String vnp_CurrCode;
    private final String vnp_OrderType;

    public VNPAYConfig(
            @Value("${vnpay.tmnCode}") String vnp_TmnCode,
            @Value("${vnpay.secretKey}") String vnp_SecretKey,
            @Value("${vnpay.url}") String vnp_Url,
            @Value("${vnpay.returnUrl}") String vnp_ReturnUrl,
            @Value("${vnpay.version}") String vnp_Version,
            @Value("${vnpay.command}") String vnp_Command,
            @Value("${vnpay.currCode}") String vnp_CurrCode,
            @Value("${vnpay.orderType}") String vnp_OrderType) {
        this.vnp_TmnCode = vnp_TmnCode;
        this.vnp_SecretKey = vnp_SecretKey;
        this.vnp_Url = vnp_Url;
        this.vnp_ReturnUrl = vnp_ReturnUrl;
        this.vnp_Version = vnp_Version;
        this.vnp_Command = vnp_Command;
        this.vnp_CurrCode = vnp_CurrCode;
        this.vnp_OrderType = vnp_OrderType;
    }

    public Map<String, String> getVNPayConfig() {
        Map<String, String> configMap = new HashMap<>();
        configMap.put("vnp_Version", vnp_Version);
        configMap.put("vnp_Command", vnp_Command);
        configMap.put("vnp_TmnCode", vnp_TmnCode);
        configMap.put("vnp_CurrCode", vnp_CurrCode);
        configMap.put("vnp_OrderType", vnp_OrderType);
        configMap.put("vnp_Locale", "vn");
        configMap.put("vnp_ReturnUrl", vnp_ReturnUrl);

        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(calendar.getTime());
        configMap.put("vnp_CreateDate", vnpCreateDate);
        calendar.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(calendar.getTime());
        configMap.put("vnp_ExpireDate", vnp_ExpireDate);

        return configMap;
    }
}
