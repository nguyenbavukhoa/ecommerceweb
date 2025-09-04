package com.e_commerce.entity.order;

import com.e_commerce.entity.product.ProductVariants;
import com.e_commerce.entity.product.VariantValues;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class CartItems extends Timestamped {
    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Carts cart;

    @ManyToOne
    @JoinColumn(name = "product_variants_id", nullable = false)
    private ProductVariants productVariant;

    @ManyToOne
    @JoinColumn(name = "variant_values_id", nullable = true)
    private VariantValues variantValue;

    @Column(name = "quantity", nullable = false, columnDefinition = "int default 1")
    private int quantity;

    @Column(name = "note")
    private String note;

    @Column(name = "selected", nullable = false, columnDefinition = "boolean default true")
    private boolean selected;
}
