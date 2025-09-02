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

    @Column(name = "Address")
    private String address;

    @Column(name = "Fullname")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "Gender", length = 6)
    private Gender gender;

    @Column(name = "PhoneNumber", length = 20, unique = true)
    private String phoneNumber;

    @OneToOne
    @JoinColumn(name = "AccountId", nullable = false)
    private Account account;
}
