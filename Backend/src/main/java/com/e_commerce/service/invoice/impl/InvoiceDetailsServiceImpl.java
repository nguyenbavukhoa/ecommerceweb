package com.e_commerce.service.invoice.impl;

import com.e_commerce.dto.invoice.invoiceDetailsDTO.InvoiceDetailsDTO;
import com.e_commerce.entity.invoice.Invoice;
import com.e_commerce.entity.invoice.InvoiceDetails;
import com.e_commerce.entity.order.OrderItems;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.invoice.InvoiceDetailsMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.invoice.InvoiceDetailsRepository;
import com.e_commerce.service.invoice.InvoiceDetailsService;
import com.e_commerce.service.order.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class InvoiceDetailsServiceImpl implements InvoiceDetailsService {
    private final InvoiceDetailsMapper invoiceDetailsMapper;
    private final InvoiceDetailsRepository invoiceDetailsRepository;
    private final OrderService orderService;

    @Override
    public List<InvoiceDetails> createInvoiceDetailsFromOrder(Integer orderId, Invoice invoice) {
        Orders order = orderService.getOrderEntityById(orderId);

        List<OrderItems> orderItems = order.getOrderItems();

        List<InvoiceDetails> invoiceDetailsList = new ArrayList<>();

        for (OrderItems item : orderItems) {
            BigDecimal unitPrice = item.getProduct().getPriceBase();
            if (item.getSelectedOptions() != null && !item.getSelectedOptions().isEmpty()) {
                BigDecimal extraPrice = item.getSelectedOptions().stream()
                        .map(v -> v.getAdditionalPrice() != null ? v.getAdditionalPrice() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                unitPrice = unitPrice.add(extraPrice);
            }
////            BigDecimal unitPrice = item.getVariantValue() != null
//                    ? item.getProductVariant().getPrice().add(item.getVariantValue().getPrice())
//                    : item.getProductVariant().getPrice();

            InvoiceDetails invoiceDetails = InvoiceDetails.builder()
                    .id(IdGenerator.getGenerationId())
                    .invoice(invoice)
                    .product(item.getProduct())
                    .selectedOptions(item.getSelectedOptions())
                    .quantity(item.getQuantity())
                    .unitPrice(unitPrice)
                    .lineTotal(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())))
                    .build();

            invoiceDetailsList.add(invoiceDetails);
        }
        return invoiceDetailsRepository.saveAll(invoiceDetailsList);
    }

    @Override
    public List<InvoiceDetailsDTO> getInvoiceDetailsDTOByInvoiceId(Integer invoiceId) {
        List<InvoiceDetails> invoiceDetails = invoiceDetailsRepository.findByInvoiceId(invoiceId);

        if (invoiceDetails.isEmpty()) {
            throw new CustomException(ErrorResponse.INVOICE_DETAILS_NOT_FOUND);
        }
        return invoiceDetailsMapper.convertPageToList(invoiceDetails);
    }

    @Override
    public Integer calculateTotalQuantityByInvoiceId(Integer invoiceId) {
        List<InvoiceDetailsDTO> invoiceDetails = getInvoiceDetailsDTOByInvoiceId(invoiceId);
        return invoiceDetails.stream().mapToInt(InvoiceDetailsDTO::getQuantity).sum();
    }
}
