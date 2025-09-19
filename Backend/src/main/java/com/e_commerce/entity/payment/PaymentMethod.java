package com.e_commerce.entity.payment;

import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class PaymentMethod extends Timestamped {
    @Id
    private Integer id;

    @Column(name = "Name")
    private String name;

    @Column(name = "Description")
    private String description;

    @Column(name = "IsActive")
    private Boolean isActive;

    @Column(name = "Code")
    private String code;

    @OneToMany(mappedBy = "paymentMethod", fetch = FetchType.LAZY)
    private List<Payment> payment;
}
