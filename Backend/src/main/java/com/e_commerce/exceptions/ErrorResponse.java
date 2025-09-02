package com.e_commerce.exceptions;

import lombok.AllArgsConstructor;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@AllArgsConstructor
@Getter
public enum ErrorResponse {
    // Client Error
    NOT_FOUND(404, "Resource not found", HttpStatus.NOT_FOUND),
    BAD_REQUEST(400, "Bad request", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(401, "Unauthorized", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(403, "Forbidden", HttpStatus.FORBIDDEN),
    CONFLICT(409, "Conflict", HttpStatus.CONFLICT),
    METHOD_NOT_ALLOWED(405, "Method not allowed", HttpStatus.METHOD_NOT_ALLOWED),
    TOO_MANY_REQUESTS(429, "Too many requests", HttpStatus.TOO_MANY_REQUESTS),

    // Account Errors
    ACCOUNT_NOT_FOUND(1001, "Account not found", HttpStatus.NOT_FOUND),
    ACCOUNT_ALREADY_EXISTS(1002, "Account already exists", HttpStatus.CONFLICT),
    ACCOUNT_EMAIL_INVALID(1003, "Invalid email format", HttpStatus.BAD_REQUEST),
    ACCOUNT_INVALID_PASSWORD(1004, "Invalid password", HttpStatus.BAD_REQUEST),
    ACCOUNT_PASSWORD_TO_SHORT(1005, "Password account to short", HttpStatus.BAD_REQUEST),
    ACCOUNT_PASSWORD_MISMATCH(1006, "Password and Confirm Password do not match", HttpStatus.BAD_REQUEST),
    ACCOUNT_LOCKED(1008, "Account is locked", HttpStatus.FORBIDDEN),
    ACCOUNT_DISABLED(1010, "Account is disabled", HttpStatus.FORBIDDEN),

    ;
    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
