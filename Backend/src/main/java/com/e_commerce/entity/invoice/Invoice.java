package com.e_commerce.entity.invoice;

import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.orther.Timestamped;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@EqualsAndHashCode(callSuper = false)
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Invoice extends Timestamped {
    @Id
    private Integer id;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @Column(name = "invoice_date", nullable = false)
    private LocalDateTime invoiceDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Orders order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Account customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = true)
    private Account staff;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "sub_total", nullable = false)
    private BigDecimal subTotal;

    @Column(name = "discount_amount", nullable = false)
    private BigDecimal discountAmount;

    @Column(name = "shipping_fee", nullable = false)
    private BigDecimal shippingFee;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<InvoiceDetails> invoiceDetails;
}
