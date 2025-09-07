package com.e_commerce.repository.account;

import com.e_commerce.entity.account.UserInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserInformationRepository extends JpaRepository<UserInformation, Integer> {
    Optional<UserInformation> findByAccount_Id(int accountId);

    @Query("SELECT u FROM UserInformation u WHERE u.account.id = :accountId ORDER BY u.isDefault DESC, u.createdAt DESC")
    List<UserInformation> findByAccount_IdOrderByIsDefaultDesc(@Param("accountId") Integer accountId);

    @Query("SELECT u FROM UserInformation u WHERE u.account.id = :accountId AND TRIM(LOWER(u.address)) = TRIM(LOWER(:address)) AND u.phoneNumber = :phoneNumber")
    Optional<UserInformation> findByAccount_IdAndAddressAndPhoneNumber(
            @Param("accountId") Integer accountId,
            @Param("address") String address,
            @Param("phoneNumber") String phoneNumber);

    @Modifying
    @Query("UPDATE UserInformation ui SET ui.isDefault = :defaultStatus WHERE ui.account.id = :accountId")
    void updateDefaultStatusByAccountId(@Param("accountId") Integer accountId,
            @Param("defaultStatus") Boolean defaultStatus);

    @Query(value = """
                        SELECT if(count(*) > 0, TRUE, FALSE)
            FROM account a JOIN user_information ui ON a.id = ui.account_id
            WHERE a.id = :accountId
              AND ui.fullname IS NOT NULL
                AND ui.phone_number IS NOT NULL
                AND ui.address IS NOT NULL""", nativeQuery = true)
    Boolean validateForCheckout(@Param("accountId") int accountId);

}
