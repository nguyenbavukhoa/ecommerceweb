package com.e_commerce.entity.order;

import com.e_commerce.entity.product.OptionValues;
import com.e_commerce.entity.product.Product;
import com.e_commerce.orther.Timestamped;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

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
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "cart_item_option_values",
            joinColumns = @JoinColumn(name = "cart_item_id"),
            inverseJoinColumns = @JoinColumn(name = "option_value_id")
    )
    @JsonBackReference
    private List<OptionValues> selectedOptions;

    @Column(name = "quantity", nullable = false, columnDefinition = "int default 1")
    private int quantity;

    @Column(name = "note")
    private String note;

    @Column(name = "selected", nullable = false, columnDefinition = "boolean default true")
    private boolean selected;

    @Column(name = "price", nullable = false)
    private BigDecimal price;
}
