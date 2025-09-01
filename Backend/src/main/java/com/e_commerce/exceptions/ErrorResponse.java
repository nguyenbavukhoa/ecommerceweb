package com.e_commerce.exceptions;

import lombok.AllArgsConstructor;

import lombok.Getter;
import org.springframework.http.HttpStatusCode;

@AllArgsConstructor
@Getter
public enum ErrorResponse {
    ;
    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
