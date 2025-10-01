package com.e_commerce.entity.invoice;

import com.e_commerce.entity.product.ProductVariants;
import com.e_commerce.entity.product.VariantValues;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = false)
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceDetails extends Timestamped {
    @Id
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variants_id", nullable = false)
    private ProductVariants productVariant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_values_id", nullable = true)
    private VariantValues variantValue;

    @Column(name = "quantity", nullable = false, columnDefinition = "int default 1")
    private int quantity;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "line_total", nullable = false)
    private BigDecimal lineTotal;
}
