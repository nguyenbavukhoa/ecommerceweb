package com.e_commerce.entity.order;

import com.e_commerce.entity.product.ProductVariants;
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
    @JoinColumn(name = "CardId", nullable = false)
    private Carts cartId;

    @ManyToOne
    @JoinColumn(name = "ProductVariantsId", nullable = false)
    private ProductVariants productVariantsId;

    @Column(name = "Quantity", nullable = false, columnDefinition = "int default 1")
    private int quantity;
}
