package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.orderItemsDTO.OrderItemsCreateForm;
import com.e_commerce.dto.order.orderItemsDTO.OrderItemsDTO;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.order.OrderItems;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.entity.product.VariantValues;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.order.OrderItemMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.OrderItemsRepository;
import com.e_commerce.service.order.OrderItemsService;
import com.e_commerce.service.product.OptionsValuesService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class OrderItemsServiceImpl implements OrderItemsService {
    private final OrderItemMapper orderItemMapper;
    private final OrderItemsRepository orderItemsRepository;
    private final ProductVariantsService productVariantsService;
    private final OptionsValuesService optionsValuesService;
    private final ProductVariantsValuesService productVariantsValuesService;

    @Override
    public OrderItems getOrderItemsEntityById(Integer id) {
        return orderItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItems not found with id: " + id));
    }

    @Override
    public OrderItemsDTO createOrderItems(OrderItemsCreateForm orderItemsCreateForm) {
        ProductVariants productVariants = productVariantsService.getProductVariantEntityById(orderItemsCreateForm.getProductVariantsId());

        List<VariantValues> variantValues = (orderItemsCreateForm.getVariantValueId() != null && !orderItemsCreateForm.getVariantValueId().isEmpty())
                ? optionsValuesService.getVariantValueEntitiesById(orderItemsCreateForm.getVariantValueId())
                : null;

        OrderItems orderItems = buildOrderItem(
                productVariants,
                variantValues != null ? variantValues : List.of(),
                orderItemsCreateForm.getQuantity(),
                null,
                orderItemsCreateForm.getNote()
        );

        orderItems.setId(IdGenerator.getGenerationId());

        BigDecimal unitPrice = productVariants.getPrice();

        if (variantValues != null && !variantValues.isEmpty()) {
            BigDecimal extraPrice = variantValues.stream()
                    .map(VariantValues::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            unitPrice = unitPrice.add(extraPrice);
        }

        orderItems.setUnitPrice(unitPrice);

        return orderItemMapper.convertEntityToDTO(orderItemsRepository.save(orderItems));
    }

    @Override
    public List<OrderItems> createOrderItemsFromCartItem(List<CartItems> cartItems, Orders order) {
        List<OrderItems> orderItems = new ArrayList<>();
        for (CartItems cartItem : cartItems) {
            OrderItems orderItem = buildOrderItem(
                    cartItem.getProductVariant(),
                    cartItem.getVariantValue(),
                    cartItem.getQuantity(),
                    order,
                    cartItem.getNote()
            );
            orderItems.add(orderItem);
        }

        return orderItemsRepository.saveAll(orderItems);
    }

    @Override
    public void validateCartItemsStock(List<CartItems> cartItems) {
        for (CartItems cartItem : cartItems) {
            ProductVariants productVariant = cartItem.getProductVariant();
            if (productVariant.getStockQuantity() < cartItem.getQuantity()) {
                throw new CustomException(ErrorResponse.PRODUCT_VARIANT_OUT_OF_STOCK);
            }

        }
    }

    private OrderItems buildOrderItem(ProductVariants productVariants, List<VariantValues> variantValues, Integer quantity, Orders order, String note) {
//        int availableQuantity = (variantValues != null)
//                ? productVariantsValuesService.isVariantValueAvailable(productVariants.getId(), variantValues.getId())
//                : productVariantsService.checkProductVariantAvailability(productVariants.getId());

        if (variantValues.isEmpty()) {
            // Không có VariantValues → check trực tiếp stock ProductVariant
            int availableQuantity = productVariantsService.checkProductVariantAvailability(productVariants.getId());

            if (availableQuantity < quantity) {
                String stockInfo = "Available: " + availableQuantity + ", Requested: " + quantity;
                throw new CustomException(List.of(ErrorResponse.CART_ITEM_QUANTITY_EXCEEDS_STOCK), stockInfo);
            }
        }else {
            // Có nhiều VariantValues → check từng cái
            for (VariantValues value : variantValues) {
                int availableQuantity = productVariantsValuesService.isVariantValueAvailable(
                        productVariants.getId(),
                        value.getId()
                );
            }
        }



        BigDecimal price = productVariants.getPrice();
        if (!variantValues.isEmpty()) {
            BigDecimal extraPrice = variantValues.stream()
                    .map(VariantValues::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            price = price.add(extraPrice);
        }

        log.info("Building order item with price: {}", price);
        OrderItems orderItem = new OrderItems();
        orderItem.setId(IdGenerator.getGenerationId());
        orderItem.setOrder(order);
        orderItem.setProductVariant(productVariants);
        orderItem.setVariantValue(variantValues);
        orderItem.setUnitPrice(price);
        orderItem.setQuantity(quantity);
        orderItem.setNote(note);


        return orderItem;
    }
}
