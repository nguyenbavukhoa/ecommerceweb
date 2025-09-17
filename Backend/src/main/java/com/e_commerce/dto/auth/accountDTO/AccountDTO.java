package com.e_commerce.dto.auth.accountDTO;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountDTO {
    private Integer id;
    private String email;
    private String accountName;
    private LocalDateTime createAt;
    private Boolean status;
    private String role;
    private String active;
}
