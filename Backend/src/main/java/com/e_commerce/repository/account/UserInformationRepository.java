package com.e_commerce.repository.account;

import com.e_commerce.entity.account.UserInformation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInformationRepository extends JpaRepository<UserInformation, Integer> {
}
