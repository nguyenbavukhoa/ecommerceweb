package com.e_commerce.entity.product;

import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ProductVariantValues extends Timestamped {
    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "ValueId", nullable = false)
    private VariantValues valueId;

    @ManyToOne
    @JoinColumn(name = "VariantId", nullable = false)
    private ProductVariants variantId;

    @Column(name = "Quantity", nullable = false)
    private int quantity;
}
