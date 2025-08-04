package com.e_commerce.entity.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ProductVariantValues {
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
