package com.e_commerce.exceptions;

import com.e_commerce.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.List;

@RestControllerAdvice

public class CustomizedResponseEntityExceptionHandler {
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadRequestException(BadRequestException ex, WebRequest request) {
        ApiResponse<Object> response = new ApiResponse<>(false, ex.getMessage(), null, Collections.singletonList(ex.getMessage()),request.getDescription(false));
        return ResponseEntity.badRequest().body(response);
    }


    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Object>> handleCustomException(CustomException ex, WebRequest request) {
        ApiResponse<Object> response = new ApiResponse<>(false, ex.getMessage(), null, ex.getErrorMessagesWithId(), request.getDescription(false));
        return ResponseEntity.status(ex.getStatusCode()).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleAllExceptions(Exception ex, WebRequest request) {
        ApiResponse<Object> response = new ApiResponse<>(false, "Internal server error", null, Collections.singletonList(ex.getMessage()), request.getDescription(false));
        return ResponseEntity.status(500).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .toList();

        ApiResponse<Object> response = new ApiResponse<>(false, "Validation failed", null,errors,request.getDescription(false));
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        ApiResponse<Object> response = new ApiResponse<>(false, "Access denied", null, Collections.singletonList(ex.getMessage()), request.getDescription(false));
        return ResponseEntity.status(403).body(response);
    }
}
