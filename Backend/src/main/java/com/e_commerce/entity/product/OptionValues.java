package com.e_commerce.entity.product;

import com.e_commerce.enums.AvailabilityStatus;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class OptionValues extends Timestamped {
    @Id
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "additional_price", nullable = false)
    private BigDecimal additionalPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "options_group_id", nullable = false)
    private OptionGroup optionGroup;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AvailabilityStatus status = AvailabilityStatus.ACTIVE;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;
}
