package com.e_commerce.entity.order;

import com.e_commerce.entity.product.ProductVariants;
import com.e_commerce.entity.product.VariantValues;
import com.e_commerce.orther.Timestamped;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class CartItems extends Timestamped {
    @Id
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cart_id", nullable = false)
    private Carts cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_variants_id", nullable = false)
    private ProductVariants productVariant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_values_id", nullable = true)
    @JsonBackReference
    private VariantValues variantValue;

    @Column(name = "quantity", nullable = false, columnDefinition = "int default 1")
    private int quantity;

    @Column(name = "note")
    private String note;

    @Column(name = "selected", nullable = false, columnDefinition = "boolean default true")
    private boolean selected;

    @Column(name = "price", nullable = false)
    private BigDecimal price;
}
