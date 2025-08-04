package com.e_commerce.entity.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class VariantValues {
    @Id
    private Integer id;

    @Column(name = "Value")
    private String value;

    @Column(name = "Price", nullable = false)
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "VariantOptionsId", nullable = false)
    private VariantOptions variantOptions;
}
