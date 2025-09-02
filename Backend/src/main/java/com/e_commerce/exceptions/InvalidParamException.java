package com.e_commerce.exceptions;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvalidParamException extends RuntimeException {
    public InvalidParamException(String message) {
        super(message);
    }
}
