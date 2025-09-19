package com.e_commerce.entity.account;

import com.e_commerce.enums.Gender;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class UserInformation extends Timestamped {
    @Id
    private Integer id;

    @Column(name = "address")
    private String address;

    @Column(name = "fullname")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 6)
    private Gender gender;

    @Column(name = "phone_number", length = 20, unique = true)
    private String phoneNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;
}
