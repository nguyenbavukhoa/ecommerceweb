package com.e_commerce.entity.account;

import com.e_commerce.enums.AccountRole;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Account extends Timestamped implements UserDetails {
    @Id
    private Integer id;

    @NotBlank(message = "Username cannot be blank")
    @Column(name = "Username",nullable = false, unique = true, length = 100)
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @Column(name = "Password",nullable = false, length = 800)
    private String password;

    @Column(name = "Status", nullable = false)
    private Boolean status = true;

    @Column(name = "Active", nullable = false)
    private Boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false)
    private AccountRole role;

    @OneToOne
    @JoinColumn(name = "UserInformationId", nullable = false)
    private UserInformation userInformation;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status;
    }
}
