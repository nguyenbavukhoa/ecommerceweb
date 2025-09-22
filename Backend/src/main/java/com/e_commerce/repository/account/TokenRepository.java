package com.e_commerce.repository.account;

import com.e_commerce.entity.account.Token;
import com.e_commerce.enums.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    @Query("SELECT t FROM Token t WHERE t.token = :token AND t.tokenType = :tokenType")
    Optional<Token> findByTokenAndTokenType(@Param("token") String token,
                                            @Param("tokenType") TokenType tokenType);


    @Query("SELECT t FROM Token t WHERE t.account.id = :accountId AND t.tokenType = :tokenType")
    Optional<Token> findByAccountIdAndTokenType(@Param("accountId") int accountId,
                                                @Param("tokenType") TokenType tokenType);


    void deleteByTokenAndTokenType(String token, TokenType tokenType);
}
