package com.e_commerce.dto;

import lombok.*;

import java.time.Instant;
import java.util.List;

@Data
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private List<String> errors;
    private String timestamp;
    private String path;

    public ApiResponse() {
        this.timestamp = Instant.now().toString();
    }

    public ApiResponse(boolean success, String message, T data, List<String> errors, String path) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errors = errors;
        this.timestamp = Instant.now().toString();
        this.path = path;
    }
}
