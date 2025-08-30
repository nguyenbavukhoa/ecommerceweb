package com.e_commerce.entity.account;

import com.e_commerce.enums.AccountRole;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
    @Email(message = "Invalid email format")
    private String email;

    @Column(name = "Displayname" , nullable = false, length = 150)
    private String displayName;

    @NotBlank(message = "Password cannot be blank")
    @Column(name = "Password",nullable = false, length = 800)
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @Column(name = "Status", nullable = false)
    private Boolean status = false;

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
        return email;
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
