package com.e_commerce.entity.product;

import com.e_commerce.enums.AvailabilityStatus;
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
public class Product extends Timestamped {
    @Id
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AvailabilityStatus status = AvailabilityStatus.ACTIVE;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "img_main")
    private String imgMain;

    @Column(name = "price_base", nullable = false)
    private BigDecimal priceBase;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
