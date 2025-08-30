package com.e_commerce.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;


@Component
public class JwtUtil {
    private final SecretKey accessTokenSecret;
    private final SecretKey refreshTokenSecret;

    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtUtil(
            @Value("${jwt.access-token.secret}") String accessTokenSecret,
            @Value("${jwt.access-token.expiration:900000}") long accessTokenExpiration,
            @Value("${jwt.refresh-token.expiration:604800000}") long refreshTokenExpiration
    ) {
        this.accessTokenSecret = Keys.hmacShaKeyFor(accessTokenSecret.getBytes(StandardCharsets.UTF_8));
        this.refreshTokenSecret = Jwts.SIG.HS256.key().build(); // có thể dùng Refresh Token Rotation
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    private Map<String, Object> buildClaims(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        claims.put("roles", roles);
        return claims;
    }

    private String buildToken(UserDetails userDetails, boolean isAccessToken) {
        long expiration = isAccessToken ? accessTokenExpiration : refreshTokenExpiration;
        SecretKey key = isAccessToken ? accessTokenSecret : refreshTokenSecret;

        return Jwts.builder()
                .claims(buildClaims(userDetails))
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    public String generateToken(UserDetails userDetails) {
        return buildToken(userDetails, true);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(userDetails, false);
    }

    private <T> T extractClaims(String token, boolean isAccessToken, Function<Claims, T> claimsResolver) {
        try {
            SecretKey key = isAccessToken ? accessTokenSecret : refreshTokenSecret;

            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claimsResolver.apply(claims);
        } catch (ExpiredJwtException e) {
            throw new JwtException("Token expired", e);
        } catch (IllegalArgumentException e) {
            throw new JwtException("Invalid token", e);
        }
    }

    public String extractUsername(String token, boolean isAccessToken) {
        return extractClaims(token, isAccessToken, Claims::getSubject);
    }

    public Date extractExpiration(String token, boolean isAccessToken) {
        return extractClaims(token, isAccessToken, Claims::getExpiration);
    }

    public boolean isTokenValid(String token, UserDetails userDetails, boolean isAccessToken) {
        String username = extractUsername(token, isAccessToken);
        return username != null && (username.equals(userDetails.getUsername())) && !isTokenExpired(token, isAccessToken);
    }

    public boolean isTokenExpired(String token, boolean isAccessToken) {
        Date expiration = extractExpiration(token, isAccessToken);
        return expiration.before(new Date());
    }
}
