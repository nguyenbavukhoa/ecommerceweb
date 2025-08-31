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
        name = "ProductVariantValues",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"VariantId", "ValueId"})
        }
)
public class ProductVariantValues extends Timestamped {
    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "ValueId")
    private VariantValues variantValues;

    @ManyToOne
    @JoinColumn(name = "VariantId", nullable = false)
    private ProductVariants productVariants;

    @Column(name = "Quantity", nullable = false)
    private int quantity;
}
