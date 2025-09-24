package com.e_commerce.service.account.impl;

import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.account.Token;
import com.e_commerce.enums.TokenType;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.repository.account.TokenRepository;
import com.e_commerce.service.account.TokenService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service

public class TokenServiceImpl implements TokenService {
    private final TokenRepository tokenRepository;
    private final int refreshTokenExpirationDays;
    private final int verificationTokenExpirationMinutes;

    public TokenServiceImpl(TokenRepository tokenRepository, @Value("${token.refresh.expiration-days}") int refreshTokenExpirationDays,@Value("${token.email-verification.expiration-minutes}") int verificationTokenExpirationMinutes) {
        this.tokenRepository = tokenRepository;
        this.refreshTokenExpirationDays = refreshTokenExpirationDays;
        this.verificationTokenExpirationMinutes = verificationTokenExpirationMinutes;
    }


    @Override
    public Token generateToken(Account account) {
        return tokenRepository.save(Token.builder()
                .account(account)
                .token(UUID.randomUUID().toString())
                .tokenType(TokenType.EMAIL_VERIFICATION)
                .expirationTime(LocalDateTime.now().plusMinutes(verificationTokenExpirationMinutes))
                .build());
    }

    @Transactional(readOnly = false)
    @Override
    public Token generateRefreshToken(Account account, String token) {
        return tokenRepository.save(Token.builder()
                .account(account)
                .token(token)
                .tokenType(TokenType.REFRESH_TOKEN)
                .expirationTime(LocalDateTime.now().plusDays(refreshTokenExpirationDays))
                .build());
    }

    @Override
    public Optional<Token> getTokenByTokenAndTokenType(String token, String tokenType) {
        return tokenRepository.findByTokenAndTokenType(token, TokenType.valueOf(tokenType));
    }

    @Override
    public Token getTokenByAccountIdAndTokenType(int accountId, String tokenType) {
        return tokenRepository.findByAccountIdAndTokenType(accountId, TokenType.valueOf(tokenType))
                .orElseThrow(() -> new CustomException(ErrorResponse.TOKEN_NOT_FOUND));
    }

    @Override
    public Token getTokenEntityById(int id) {
        return tokenRepository.findById(id).orElseThrow(() -> new CustomException(ErrorResponse.TOKEN_NOT_FOUND));
    }

    @Override
    public void deleteToken(String token, String tokenType) {
        tokenRepository.deleteByTokenAndTokenType(token, TokenType.valueOf(tokenType));
    }
}
