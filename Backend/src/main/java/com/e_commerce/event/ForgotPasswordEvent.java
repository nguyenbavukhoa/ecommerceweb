package com.e_commerce.event;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

@Getter
@Setter
public class ForgotPasswordEvent extends ApplicationEvent {
    private final String email;
    private final String otp;

    public ForgotPasswordEvent(Object source, String email, String otp) {
        super(source);
        this.email = email;
        this.otp = otp;
    }
}
