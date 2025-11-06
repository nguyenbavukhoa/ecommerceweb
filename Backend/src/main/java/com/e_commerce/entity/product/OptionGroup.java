package com.e_commerce.entity.product;

import com.e_commerce.enums.SelectionType;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class OptionGroup extends Timestamped {
    @Id
    private Integer id;

    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(name = "selection_type", nullable = false)
    private SelectionType selectionType;

    @OneToMany(mappedBy = "optionGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OptionValues> values;
}
