package com.e_commerce.repository.account;

import com.e_commerce.entity.account.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.e_commerce.enums.AccountRole;

import java.util.List;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT a FROM Account a WHERE a.role = :role")
    List<Account> findByRole(@Param("role") AccountRole role);
}
