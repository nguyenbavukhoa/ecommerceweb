package com.e_commerce.entity.order;

import com.e_commerce.entity.account.Account;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Carts extends Timestamped {
    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "AccountId", nullable = false)
    private Account userId;
}
