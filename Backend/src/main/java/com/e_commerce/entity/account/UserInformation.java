package com.e_commerce.entity.account;

import com.e_commerce.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class UserInformation {
    @Id
    private Integer id;

    @Column(name = "Email", unique = true)
    private String email;

    @Column(name = "Address")
    private String address;

    @Column(name = "Fullname")
    private String fullname;

    @Enumerated(EnumType.STRING)
    @Column(name = "Gender", length = 6)
    private Gender gender;

    @Column(name = "PhoneNumber", length = 20, unique = true)
    private String phoneNumber;

    @OneToOne(mappedBy = "userInformation")
    private Account account;
}
