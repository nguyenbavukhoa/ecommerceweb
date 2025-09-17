package com.e_commerce.repository.account;

import com.e_commerce.entity.account.UserInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserInformationRepository extends JpaRepository<UserInformation, Integer> {

    @Query("SELECT u FROM UserInformation u WHERE u.account.id = :accountId ORDER BY u.isDefault DESC, u.createdAt DESC")
    List<UserInformation> findByAccount_IdOrderByIsDefaultDesc(@Param("accountId") Integer accountId);

    @Query(value = """
    SELECT EXISTS(
        SELECT 1
        FROM account a
        JOIN user_information ui ON a.id = ui.account_id
        WHERE a.id = :accountId
    )
""", nativeQuery = true)
    boolean validateForCheckout(@Param("accountId") int accountId);

    List<UserInformation> findByAccount_Id(Integer accountId);

}
