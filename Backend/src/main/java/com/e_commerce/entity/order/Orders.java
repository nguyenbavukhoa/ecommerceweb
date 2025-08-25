package com.e_commerce.entity.order;

import com.e_commerce.entity.account.Account;
import com.e_commerce.enums.OrderStatus;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`Order`")
public class Orders extends Timestamped {
    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "AccountId", nullable = false)
    private Account userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "OrderStatus", nullable = false)
    private OrderStatus orderStatus;

    @Column(name = "OrderTime", nullable = false)
    private LocalDateTime orderTime = LocalDateTime.now();;

    private BigDecimal totalPrice;

    @OneToMany(mappedBy = "order")
    private List<OrderItems> orderItems;
}
