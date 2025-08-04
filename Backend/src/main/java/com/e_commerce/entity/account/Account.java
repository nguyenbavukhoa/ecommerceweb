package com.e_commerce.entity.account;

import com.e_commerce.enums.AccountRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Account{
    @Id
    private Integer id;
    @NotBlank(message = "Username cannot be blank")
    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @Column(nullable = false, length = 800)
    private String password;

    @Column(name = "CreateTime", nullable = false, updatable = false)
    private LocalDateTime createAt;

    @Column(name = "Status", nullable = false)
    private Boolean status;

    @Column(name = "Active", nullable = false)
    private Boolean active = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false)
    private AccountRole role;

    @OneToOne
    @JoinColumn(name = "user_information_id", nullable = false)
    private UserInformation userInformation;
}
