package com.e_commerce.entity.order;

import com.e_commerce.entity.account.Account;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;

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
    private Account account;

    @OneToMany(mappedBy = "cart")
    List<CartItems> cartItems;

    @Column(name = "Note")
    private String note;
}
