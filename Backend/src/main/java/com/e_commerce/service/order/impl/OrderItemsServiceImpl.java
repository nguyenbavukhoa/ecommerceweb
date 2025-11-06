package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.orderItemsDTO.OrderItemsCreateForm;
import com.e_commerce.dto.order.orderItemsDTO.OrderItemsDTO;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.order.OrderItems;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.entity.product.OptionValues;
import com.e_commerce.entity.product.Product;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.order.OrderItemMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.OrderItemsRepository;
import com.e_commerce.service.order.OrderItemsService;
import com.e_commerce.service.product.OptionsValuesService;
import com.e_commerce.service.product.ProductService;
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
    private final ProductService productService;
    private final OptionsValuesService optionsValuesService;

    @Override
    public OrderItems getOrderItemsEntityById(Integer id) {
        return orderItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItems not found with id: " + id));
    }

    @Override
    public OrderItemsDTO createOrderItems(OrderItemsCreateForm orderItemsCreateForm) {
        Product product = productService.getProductEntityById(orderItemsCreateForm.getProductId());

        List<OptionValues> selectedOptions = (orderItemsCreateForm.getOptionValueId() != null && !orderItemsCreateForm.getOptionValueId().isEmpty())
                ? optionsValuesService.getVariantValueEntitiesById(orderItemsCreateForm.getOptionValueId())
                : null;

        OrderItems orderItems = buildOrderItem(
                product,
                selectedOptions,
                orderItemsCreateForm.getQuantity(),
                null,
                orderItemsCreateForm.getNote()
        );

        orderItems.setId(IdGenerator.getGenerationId());

        BigDecimal unitPrice = calculateTotalUnitPrice(product, selectedOptions);
        orderItems.setUnitPrice(unitPrice);

        return orderItemMapper.convertEntityToDTO(orderItemsRepository.save(orderItems));
    }

    @Override
    public List<OrderItems> createOrderItemsFromCartItem(List<CartItems> cartItems, Orders order) {
        List<OrderItems> orderItems = new ArrayList<>();
        for (CartItems cartItem : cartItems) {
            OrderItems orderItem = buildOrderItem(
                    cartItem.getProduct(),
                    cartItem.getSelectedOptions(),
                    cartItem.getQuantity(),
                    order,
                    cartItem.getNote()
            );
            orderItems.add(orderItem);
        }

        return orderItemsRepository.saveAll(orderItems);
    }

    private OrderItems buildOrderItem(Product product, List<OptionValues> selectedOptions, Integer quantity, Orders order, String note) {

        if (selectedOptions.isEmpty()) {

            if (product.getId() < quantity) {
                String stockInfo = "Available: " + product.getId() + ", Requested: " + quantity;
                throw new CustomException(List.of(ErrorResponse.CART_ITEM_QUANTITY_EXCEEDS_STOCK), stockInfo);
            }
        }else {
            for (OptionValues option : selectedOptions) {
                if (option.getStockQuantity() < quantity) {
                    String stockInfo = "Option '" + option.getName() + "' available: " + option.getStockQuantity() +
                            ", requested: " + quantity;
                    throw new CustomException(List.of(ErrorResponse.CART_ITEM_QUANTITY_EXCEEDS_STOCK), stockInfo);
                }
            }
        }


        BigDecimal price = calculateTotalUnitPrice(product, selectedOptions);

        log.info("Building order item with price: {}", price);
        OrderItems orderItem = new OrderItems();
        orderItem.setId(IdGenerator.getGenerationId());
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setSelectedOptions(selectedOptions);
        orderItem.setUnitPrice(price);
        orderItem.setQuantity(quantity);
        orderItem.setNote(note);


        return orderItem;
    }

    private BigDecimal calculateTotalUnitPrice(Product product, List<OptionValues> selectedOptions) {
        BigDecimal price = product.getPriceBase();

        if (selectedOptions == null || selectedOptions.isEmpty()) {
            return price;
        }

        BigDecimal extra = selectedOptions.stream()
                .map(OptionValues::getAdditionalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        price = price.add(extra);


        return price;
    }
}
