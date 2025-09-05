package com.e_commerce.repository.account;

import com.e_commerce.entity.account.UserInformation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserInformationRepository extends JpaRepository<UserInformation, Integer> {
    Optional<UserInformation> findByAccount_Id(int accountId);

}
