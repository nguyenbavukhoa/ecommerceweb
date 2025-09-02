package com.e_commerce.entity.order;

import com.e_commerce.entity.product.ProductVariants;
import com.e_commerce.entity.product.VariantValues;
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
public class OrderItems extends Timestamped {
    @Id
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "OrderId", nullable = false)
    private Orders order;

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

    @Column(name = "UnitPrice", nullable = false)
    private BigDecimal unitPrice;

}
