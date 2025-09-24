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
@Table(
        name = "product_variant_values",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"variant_id", "value_id"})
        }
)
public class ProductVariantValues extends Timestamped {
    @Id
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "value_id")
    private VariantValues variantValues;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariants productVariants;

    @Column(name = "quantity", nullable = false)
    private int quantity;
}
