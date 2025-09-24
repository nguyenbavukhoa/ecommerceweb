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

    @Column(name = "value")
    private String value;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "stock_quantity", nullable = false, columnDefinition = "int default 0")
    private int stockQuantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_options_id", nullable = false)
    private VariantOptions variantOptions;
}
