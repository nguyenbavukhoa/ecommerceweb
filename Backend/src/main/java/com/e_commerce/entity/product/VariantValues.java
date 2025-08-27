package com.e_commerce.entity.product;

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
public class VariantValues extends Timestamped {
    @Id
    private Integer id;

    @Column(name = "Value")
    private String value;

    @Column(name = "Price", nullable = false)
    private BigDecimal price;

    @Column(name = "StockQuantity", nullable = false, columnDefinition = "int default 0")
    private int stockQuantity;

    @ManyToOne
    @JoinColumn(name = "VariantOptionsId", nullable = false)
    private VariantOptions variantOptions;
}
