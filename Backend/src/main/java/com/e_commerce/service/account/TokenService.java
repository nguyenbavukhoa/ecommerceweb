package com.e_commerce.service.account;

import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.account.Token;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface TokenService {
    Token generateToken(Account account);

    Token generateRefreshToken(Account account, String token);

    Optional<Token> getTokenByTokenAndTokenType(String token, String tokenType);

    Token getTokenByAccountIdAndTokenType(int accountId, String tokenType);

    Token getTokenEntityById(int id);

    void deleteToken(String token, String tokenType);
}
