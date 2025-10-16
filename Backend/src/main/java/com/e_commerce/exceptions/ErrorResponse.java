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
    ACCOUNT_PASSWORD_MISMATCH(1006, "Password do not match", HttpStatus.BAD_REQUEST),
    ACCOUNT_LOCKED(1007, "Account locked due to entering wrong password too many times", HttpStatus.FORBIDDEN),
    ACCOUNT_DISABLED(1008, "Account is disabled", HttpStatus.FORBIDDEN),
    ACCOUNT_MAX_LOGIN_ATTEMPTS_EXCEEDED(1009, "Maximum login attempts exceeded. Please try again later.", HttpStatus.FORBIDDEN),
    ACCOUNT_LOCKED_TOO_MANY_ATTEMPTS(1010, "Account is locked due to too many failed login attempts. Please try again later.", HttpStatus.FORBIDDEN),
    FRAUDULENT_LOGIN_DETECTED(1011, "Multiple failed login attempts from different IP addresses detected. Please try again later.", HttpStatus.FORBIDDEN),

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
    PRODUCT_STATUS_INVALID(3008, "Invalid product status", HttpStatus.BAD_REQUEST),
    PRODUCT_INSUFFICIENT_STOCK(3009, "Insufficient product stock", HttpStatus.CONFLICT),

    // Options Groups Errors
    OPTIONS_GROUP_NOT_FOUND(4001, "Variant option not found", HttpStatus.NOT_FOUND),
    OPTIONS_GROUP_ALREADY_EXISTS(4002, "Variant option already exists", HttpStatus.CONFLICT),
    OPTIONS_GROUP_NAME_INVALID(4003, "Invalid variant option name", HttpStatus.BAD_REQUEST),
    OPTIONS_GROUP_IN_USE(4004, "Variant option is in use and cannot be deleted", HttpStatus.CONFLICT),

    // Options Values Errors
    OPTIONS_VALUE_NOT_FOUND(4101, "Variant value not found", HttpStatus.NOT_FOUND),
    OPTIONS_VALUE_ALREADY_EXISTS(4102, "Variant value already exists", HttpStatus.CONFLICT),
    OPTIONS_VALUE_INVALID(4103, "Invalid variant value", HttpStatus.BAD_REQUEST),
    OPTIONS_VALUE_PRICE_INVALID(4104, "Invalid variant value price", HttpStatus.BAD_REQUEST),
    OPTIONS_VALUE_STOCK_INVALID(4105, "Invalid variant value stock quantity", HttpStatus.BAD_REQUEST),
    OPTIONS_VALUE_OUT_OF_STOCK(4106, "Variant value is out of stock", HttpStatus.CONFLICT),

    // Product Variant Values Errors
    PRODUCT_VARIANT_VALUE_NOT_FOUND(4201, "Product variant value not found", HttpStatus.NOT_FOUND),
    PRODUCT_VARIANT_VALUE_ALREADY_EXISTS(4202, "Product variant value already exists", HttpStatus.CONFLICT),
    PRODUCT_VARIANT_VALUE_QUANTITY_INVALID(4203, "Invalid product variant value quantity", HttpStatus.BAD_REQUEST),
    PRODUCT_VARIANT_VALUE_DUPLICATE_COMBINATION(4204, "Duplicate variant value combination", HttpStatus.CONFLICT),
    PRODUCT_VARIANT_VALUE_OUT_OF_STOCK(4205, "Product variant or variant value is out of stock", HttpStatus.CONFLICT),

    // Cart Errors
    CART_NOT_FOUND(5001, "Cart not found", HttpStatus.NOT_FOUND),
    CART_ALREADY_EXISTS(5002, "Cart already exists for this account", HttpStatus.CONFLICT),
    CART_EMPTY(5003, "Cart is empty", HttpStatus.BAD_REQUEST),
    CART_ACCESS_DENIED(5004, "Access denied to cart", HttpStatus.FORBIDDEN),
    CART_NOTE_INVALID(5005, "Invalid cart note", HttpStatus.BAD_REQUEST),

    // Cart Items Errors
    CART_ITEM_NOT_FOUND(5101, "Cart item not found", HttpStatus.NOT_FOUND),
    CART_ITEM_ALREADY_EXISTS(5102, "Cart item already exists", HttpStatus.CONFLICT),
    CART_ITEM_QUANTITY_INVALID(5103, "Invalid cart item quantity", HttpStatus.BAD_REQUEST),
    CART_ITEM_QUANTITY_EXCEEDS_STOCK(5104, "Cart item quantity exceeds available stock .", HttpStatus.CONFLICT),
    CART_ITEM_PRODUCT_UNAVAILABLE(5105, "Product variant is unavailable", HttpStatus.BAD_REQUEST),

    // Order Errors
    ORDER_NOT_FOUND(6001, "Order not found", HttpStatus.NOT_FOUND),
    ORDER_ALREADY_EXISTS(6002, "Order already exists", HttpStatus.CONFLICT),
    ORDER_STATUS_INVALID(6003, "Invalid order status", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_BE_MODIFIED(6004, "Order cannot be modified", HttpStatus.CONFLICT),
    ORDER_CANNOT_BE_CANCELLED(6005, "Order cannot be cancelled", HttpStatus.CONFLICT),
    ORDER_TOTAL_PRICE_INVALID(6006, "Invalid order total price", HttpStatus.BAD_REQUEST),
    ORDER_ACCESS_DENIED(6007, "Access denied to order", HttpStatus.FORBIDDEN),
    ORDER_TIME_INVALID(6008, "Invalid order time", HttpStatus.BAD_REQUEST),

    // Order Items Errors
    ORDER_ITEM_NOT_FOUND(6101, "Order item not found", HttpStatus.NOT_FOUND),
    ORDER_ITEM_ALREADY_EXISTS(6102, "Order item already exists", HttpStatus.CONFLICT),
    ORDER_ITEM_QUANTITY_INVALID(6103, "Invalid order item quantity", HttpStatus.BAD_REQUEST),
    ORDER_ITEM_QUANTITY_EXCEEDS_STOCK(6104, "Order item quantity exceeds available stock", HttpStatus.CONFLICT),
    ORDER_ITEM_PRODUCT_UNAVAILABLE(6105, "Product variant is unavailable for order", HttpStatus.BAD_REQUEST),
    ORDER_ITEM_CANNOT_BE_MODIFIED(6106, "Order item cannot be modified", HttpStatus.CONFLICT),

    // USER INFORMATION ERRORS
    USER_INFO_NOT_FOUND(7001, "User information not found", HttpStatus.NOT_FOUND),

    // Payment Errors
    PAYMENT_NOT_FOUND(8001, "Payment not found", HttpStatus.NOT_FOUND),
    PAYMENT_ALREADY_EXISTS(8002, "Payment already exists", HttpStatus.CONFLICT),

    // Payment Method Errors
    PAYMENT_METHOD_NOT_FOUND(8101, "Payment method not found", HttpStatus.NOT_FOUND),
    PAYMENT_METHOD_ALREADY_EXISTS(8102, "Payment method already exists", HttpStatus.CONFLICT),

    // Token Errors
    REFRESH_TOKEN_EXPIRED(9001, "Refresh token has expired", HttpStatus.UNAUTHORIZED),
    INVALID_REFRESH_TOKEN(9002, "Invalid refresh token", HttpStatus.UNAUTHORIZED),
    TOKEN_NOT_FOUND(9005, "Token not found", HttpStatus.NOT_FOUND),
    TOKEN_EXPIRED(9006, "Token has expired", HttpStatus.UNAUTHORIZED),

    // OTP Errors
    OTP_EXPIRED_OR_INVALID(10001, "OTP is expired or invalid", HttpStatus.BAD_REQUEST),
    OTP_MAX_ATTEMPTS_EXCEEDED(10002, "Maximum OTP attempts exceeded", HttpStatus.FORBIDDEN),
    OTP_ALREADY_SENT(10004, "OTP has already been sent. Please wait before requesting a new one.", HttpStatus.TOO_MANY_REQUESTS),
    OTP_REQUIRED(10005, "OTP is required", HttpStatus.BAD_REQUEST),
    OTP_RATE_LIMIT_EXCEEDED(10006, "OTP request rate limit exceeded. Please try again later.", HttpStatus.TOO_MANY_REQUESTS),

    // Voucher Errors
    VOUCHER_NOT_FOUND(11001, "Voucher not found", HttpStatus.NOT_FOUND),
    VOUCHER_ALREADY_EXISTS(11002, "Voucher already exists", HttpStatus.CONFLICT),
    VOUCHER_CODE_INVALID(11003, "Invalid voucher code", HttpStatus.BAD_REQUEST),
    VOUCHER_ENDDATE_BEFORE_STARTDATE(11004, "Voucher end date is before start date", HttpStatus.BAD_REQUEST),

    // Invoice Errors
    INVOICE_NOT_FOUND(12001, "Invoice not found", HttpStatus.NOT_FOUND),
    INVOICE_ALREADY_EXISTS(12002, "Invoice already exists", HttpStatus.CONFLICT),
    INVOICE_ALREADY_EXISTS_FOR_ORDER(12003, "Invoice already exists for this order", HttpStatus.CONFLICT),

    // Invoice Details Errors
    INVOICE_DETAILS_NOT_FOUND(12101, "Invoice details not found", HttpStatus.NOT_FOUND),
    ;
    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
