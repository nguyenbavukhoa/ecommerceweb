package com.e_commerce.service.invoice.impl;

import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.invoice.invoiceDTO.InvoiceCreateForm;
import com.e_commerce.dto.invoice.invoiceDTO.InvoiceDTO;
import com.e_commerce.dto.invoice.invoiceDTO.InvoiceFilter;
import com.e_commerce.entity.Voucher;
import com.e_commerce.entity.invoice.Invoice;
import com.e_commerce.entity.invoice.InvoiceDetails;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.entity.payment.Payment;
import com.e_commerce.enums.VoucherType;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.invoice.InvoiceMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.invoice.InvoiceRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.invoice.InvoiceDetailsService;
import com.e_commerce.service.invoice.InvoiceService;
import com.e_commerce.service.order.OrderService;

import com.e_commerce.service.payment.PaymentMethodService;
import com.e_commerce.service.payment.PaymentService;
import com.e_commerce.service.voucher.VoucherService;
import com.e_commerce.specification.InvoiceSpecification;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class InvoiceServiceImpl implements InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;
    private final OrderService orderService;
    private final AccountService accountService;
    private final PaymentMethodService paymentMethodService;
    private final VoucherService voucherService;
    private final InvoiceDetailsService invoiceDetailsService;

    @Override
    public Invoice getInvoiceById(Integer id) {
        return invoiceRepository.findById(id).orElseThrow(() -> new CustomException(ErrorResponse.INVOICE_NOT_FOUND));
    }

    @Override
    @Transactional
    public InvoiceDTO createInvoice(InvoiceCreateForm invoiceCreateForm) {
        Orders order = orderService.getOrderEntityById(invoiceCreateForm.getOrderId());

        if (invoiceRepository.existsByOrder(order)) {
            throw new CustomException(ErrorResponse.INVOICE_ALREADY_EXISTS_FOR_ORDER);
        }
        Invoice invoice = Invoice.builder()
                .id(IdGenerator.getGenerationId())
                .invoiceDate(LocalDateTime.now())
                .invoiceNumber(generateInvoiceNumber())
                .customer(order.getAccount())
                .staff(accountService.getAccountEntityById(invoiceCreateForm.getStaffId()))
                .userInformation(order.getUserInformation())
                .paymentMethod(paymentMethodService.getPaymentMethodEntityById(invoiceCreateForm.getPaymentMethodId()))
                .voucher(invoiceCreateForm.getVoucherId() != null
                        ? voucherService.getVoucherEntityById(invoiceCreateForm.getVoucherId())
                        : null)
                .shippingFee(invoiceCreateForm.getShippingFee() != null
                        ? invoiceCreateForm.getShippingFee()
                        : BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .subTotal(BigDecimal.ZERO)
                .totalAmount(BigDecimal.ZERO)
                .order(order)
                .build();

        invoiceRepository.save(invoice);

        // Tạo chi tiết hóa đơn từ chi tiết đơn hàng
        List<InvoiceDetails> invoiceDetailsList = invoiceDetailsService.createInvoiceDetailsFromOrder(order.getId(), invoice);
        invoice.setInvoiceDetails(invoiceDetailsList);

        // Tính subTotal
        BigDecimal subTotal = invoiceDetailsList.stream()
                .map(InvoiceDetails::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        invoice.setSubTotal(subTotal);

        // Tính discount
        BigDecimal discountAmount = calculateDiscount(subTotal, invoice.getVoucher());
        invoice.setDiscountAmount(discountAmount);

        // Tính totalAmount
        BigDecimal totalAmount = subTotal.subtract(discountAmount).add(invoice.getShippingFee());
        invoice.setTotalAmount(totalAmount);

        Invoice savedInvoice = invoiceRepository.save(invoice);

        InvoiceDTO invoiceDTO = invoiceMapper.convertEntityToDTO(savedInvoice);
        invoiceDTO.setTotalQuantity(
                invoiceDetailsService.calculateTotalQuantityByInvoiceId(savedInvoice.getId())
        );
        invoiceDTO.setItems(
                invoiceDetailsService.getInvoiceDetailsDTOByInvoiceId(savedInvoice.getId())
        );

        log.info("Created invoice: {}", invoiceDTO);
        return invoiceDTO;
    }

    @Override
    public PageDTO<InvoiceDTO> getAllInvoices(int page, int size, InvoiceFilter invoiceFilter) {
        Specification<Invoice> specification = InvoiceSpecification.filterInvoice(invoiceFilter);
        Pageable pageable = PageRequest.of(page-1, size);
        return invoiceMapper.convertEntityPageToDTOPage(invoiceRepository.findAll(specification, pageable));
    }

    private String generateInvoiceNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // Đếm số hóa đơn đã tạo hôm nay
        long countToday = invoiceRepository.countByCreatedAtBetween(
                LocalDate.now().atStartOfDay(),
                LocalDate.now().plusDays(1).atStartOfDay()
        );

        // Tăng thêm 1 để ra số tiếp theo
        long nextNumber = countToday + 1;

        // Format: INV-YYYYMMDD-0001
        return String.format("INV-%s-%04d", datePart, nextNumber);
    }

    private BigDecimal calculateDiscount(BigDecimal subTotal, Voucher voucher) {
        if (voucher == null || !voucher.getActive()) {
            return BigDecimal.ZERO;
        }

        // check min order
        if (voucher.getMinOrderValue() != null && subTotal.compareTo(voucher.getMinOrderValue()) < 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount = switch (voucher.getType()) {
            case FIXED_AMOUNT -> voucher.getAmount();
            case PERCENTAGE -> subTotal.multiply(
                    BigDecimal.valueOf(voucher.getPercent() / 100.0)
            );
        };


        // không cho vượt quá subtotal
        if (discount.compareTo(subTotal) > 0) {
            discount = subTotal;
        }

        return discount;
    }

}
