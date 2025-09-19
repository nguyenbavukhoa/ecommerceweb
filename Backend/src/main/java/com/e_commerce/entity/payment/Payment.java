package com.e_commerce.entity.payment;

import com.e_commerce.entity.order.Orders;
import com.e_commerce.enums.PaymentStatus;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Payment extends Timestamped {
    @Id
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Orders order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "PaymentMethodId", nullable = false)
    private PaymentMethod paymentMethod;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status;

    @Column(name = "payment_time", nullable = false)
    private LocalDateTime paymentTime;
}
