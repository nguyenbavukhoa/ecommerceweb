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
    @JoinColumn(name = "CartId", nullable = false)
    private Carts cart;

    @ManyToOne
    @JoinColumn(name = "ProductVariantsId", nullable = false)
    private ProductVariants productVariant;

    @ManyToOne
    @JoinColumn(name = "VariantValuesId", nullable = true)
    private VariantValues variantValue;

    @Column(name = "Quantity", nullable = false, columnDefinition = "int default 1")
    private int quantity;

    @Column(name = "Note")
    private String note;

    @Column(name = "Selected", nullable = false, columnDefinition = "boolean default false")
    private boolean selected;
}
