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
    ACCOUNT_LOCKED(1007, "Account is locked", HttpStatus.FORBIDDEN),
    ACCOUNT_DISABLED(1008, "Account is disabled", HttpStatus.FORBIDDEN),

    // Category Errors
    CATEGORY_NOT_FOUND(2001, "Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_ALREADY_EXISTS(2002, "Category already exists", HttpStatus.CONFLICT),

    // Product Categories Errors
    PRODUCT_CATEGORY_NOT_FOUND(2101, "Product category not found", HttpStatus.NOT_FOUND),
    PRODUCT_CATEGORY_ALREADY_EXISTS(2102, "Product category already exists", HttpStatus.CONFLICT),
    PRODUCT_CATEGORY_NAME_INVALID(2103, "Invalid product category name", HttpStatus.BAD_REQUEST),
    PRODUCT_CATEGORY_IN_USE(2104, "Product category is in use and cannot be deleted", HttpStatus.CONFLICT),

    // Product Errors
    PRODUCT_NOT_FOUND(3001, "Product not found", HttpStatus.NOT_FOUND),
    PRODUCT_ALREADY_EXISTS(3002, "Product already exists", HttpStatus.CONFLICT),
    PRODUCT_NAME_INVALID(3003, "Invalid product name", HttpStatus.BAD_REQUEST),
    PRODUCT_PRICE_INVALID(3004, "Invalid product price", HttpStatus.BAD_REQUEST),
    PRODUCT_INACTIVE(3005, "Product is inactive", HttpStatus.BAD_REQUEST),
    PRODUCT_DESCRIPTION_INVALID(3006, "Invalid product description", HttpStatus.BAD_REQUEST),
    PRODUCT_IMAGE_INVALID(3007, "Invalid product image", HttpStatus.BAD_REQUEST),

    // Product Variants Errors
    PRODUCT_VARIANT_NOT_FOUND(3101, "Product variant not found", HttpStatus.NOT_FOUND),
    PRODUCT_VARIANT_ALREADY_EXISTS(3102, "Product variant already exists", HttpStatus.CONFLICT),
    PRODUCT_VARIANT_SKU_INVALID(3103, "Invalid product variant SKU", HttpStatus.BAD_REQUEST),
    PRODUCT_VARIANT_STOCK_INVALID(3104, "Invalid product variant stock quantity", HttpStatus.BAD_REQUEST),
    PRODUCT_VARIANT_PRICE_INVALID(3105, "Invalid product variant price", HttpStatus.BAD_REQUEST),
    PRODUCT_VARIANT_OUT_OF_STOCK(3106, "Product variant is out of stock", HttpStatus.CONFLICT),
    PRODUCT_VARIANT_INACTIVE(3107, "Product variant is inactive", HttpStatus.BAD_REQUEST),

    // Variant Options Errors
    VARIANT_OPTION_NOT_FOUND(4001, "Variant option not found", HttpStatus.NOT_FOUND),
    VARIANT_OPTION_ALREADY_EXISTS(4002, "Variant option already exists", HttpStatus.CONFLICT),
    VARIANT_OPTION_NAME_INVALID(4003, "Invalid variant option name", HttpStatus.BAD_REQUEST),
    VARIANT_OPTION_IN_USE(4004, "Variant option is in use and cannot be deleted", HttpStatus.CONFLICT),

    // Variant Values Errors
    VARIANT_VALUE_NOT_FOUND(4101, "Variant value not found", HttpStatus.NOT_FOUND),
    VARIANT_VALUE_ALREADY_EXISTS(4102, "Variant value already exists", HttpStatus.CONFLICT),
    VARIANT_VALUE_INVALID(4103, "Invalid variant value", HttpStatus.BAD_REQUEST),
    VARIANT_VALUE_PRICE_INVALID(4104, "Invalid variant value price", HttpStatus.BAD_REQUEST),
    VARIANT_VALUE_STOCK_INVALID(4105, "Invalid variant value stock quantity", HttpStatus.BAD_REQUEST),
    VARIANT_VALUE_OUT_OF_STOCK(4106, "Variant value is out of stock", HttpStatus.CONFLICT),

    // Product Variant Values Errors
    PRODUCT_VARIANT_VALUE_NOT_FOUND(4201, "Product variant value not found", HttpStatus.NOT_FOUND),
    PRODUCT_VARIANT_VALUE_ALREADY_EXISTS(4202, "Product variant value already exists", HttpStatus.CONFLICT),
    PRODUCT_VARIANT_VALUE_QUANTITY_INVALID(4203, "Invalid product variant value quantity", HttpStatus.BAD_REQUEST),
    PRODUCT_VARIANT_VALUE_DUPLICATE_COMBINATION(4204, "Duplicate variant value combination", HttpStatus.CONFLICT),

    ;
    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
