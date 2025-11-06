package com.e_commerce.entity.invoice;

import com.e_commerce.entity.product.OptionValues;
import com.e_commerce.entity.product.Product;
import com.e_commerce.orther.Timestamped;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "invoice_detail_option_values",
            joinColumns = @JoinColumn(name = "invoice_detail_id"),
            inverseJoinColumns = @JoinColumn(name = "option_value_id")
    )
    @JsonBackReference
    private List<OptionValues> selectedOptions;

    @Column(name = "quantity", nullable = false, columnDefinition = "int default 1")
    private int quantity;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "line_total", nullable = false)
    private BigDecimal lineTotal;
}
