package com.e_commerce.event;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

import java.io.Serial;

@Getter
@Setter
public class RegistrationCompleteEvent extends ApplicationEvent {
    @Serial
    private static final long serialVersionUID = 1L;
    private final String email;

    public RegistrationCompleteEvent(Object source, String email) {
        super(source);
        this.email = email;
    }
}
