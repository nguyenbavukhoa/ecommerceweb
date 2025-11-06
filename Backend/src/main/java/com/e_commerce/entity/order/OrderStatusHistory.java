package com.e_commerce.entity.order;

import com.e_commerce.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "order_status_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusHistory {
    @Id
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Orders order;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;
}
