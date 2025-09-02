package com.e_commerce.exceptions;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvalidInputException extends RuntimeException {
    public InvalidInputException(String message) {
        super(message);
    }
}
