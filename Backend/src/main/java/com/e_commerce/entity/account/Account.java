package com.e_commerce.entity.account;

import com.e_commerce.enums.AccountRole;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Account extends Timestamped {
    @Id
    private Integer id;

    @NotBlank(message = "Username cannot be blank")
    @Column(name = "Username",nullable = false, unique = true, length = 100)
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @Column(name = "Password",nullable = false, length = 800)
    private String password;

    @Column(name = "Status", nullable = false)
    private Boolean status;

    @Column(name = "Active", nullable = false)
    private Boolean active = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false)
    private AccountRole role;

    @OneToOne
    @JoinColumn(name = "UserInformationId", nullable = false)
    private UserInformation userInformation;

}
