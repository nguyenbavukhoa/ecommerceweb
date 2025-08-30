package com.e_commerce.controller.account;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.auth.accountDTO.AccountDTO;
import com.e_commerce.dto.auth.accountDTO.AuthenticationDTO;
import com.e_commerce.dto.auth.accountDTO.LoginForm;
import com.e_commerce.dto.auth.accountDTO.RegistrationForm;
import com.e_commerce.service.account.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationDTO>> login(@ModelAttribute LoginForm loginForm, HttpServletRequest request){
        AuthenticationDTO login = accountService.signIn(loginForm);
        return ResponseEntity.ok(new ApiResponse<>(true,"Login successfully" ,login ,null ,request.getRequestURI()));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AccountDTO>> register(@ModelAttribute RegistrationForm registrationForm, HttpServletRequest request) {
        AccountDTO register = accountService.createAccount(registrationForm);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Register successfully", register, null, request.getRequestURI()));
    }
}
