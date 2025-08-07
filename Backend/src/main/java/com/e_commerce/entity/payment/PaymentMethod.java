package com.e_commerce.entity.payment;

import com.e_commerce.orther.Timestamped;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.*;

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

    @OneToOne(mappedBy = "paymentMethod")
    private Payment payment;
}
