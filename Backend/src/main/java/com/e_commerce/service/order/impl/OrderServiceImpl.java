package com.e_commerce.service.order.impl;

import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.order.cartDTO.CheckoutForm;
import com.e_commerce.dto.order.orderDTO.OrderCreateForm;
import com.e_commerce.dto.order.orderDTO.OrderCreateFromCart;
import com.e_commerce.dto.order.orderDTO.OrderDTO;
import com.e_commerce.dto.order.orderDTO.OrderFilter;
import com.e_commerce.dto.product.productDTO.ProductFilter;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.account.UserInformation;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.order.Carts;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.enums.OrderStatus;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.order.OrdersMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.OrdersRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.account.UserInformationService;
import com.e_commerce.service.order.CartItemsService;
import com.e_commerce.service.order.CartsService;
import com.e_commerce.service.order.OrderItemsService;
import com.e_commerce.service.order.OrderService;
import com.e_commerce.service.product.ProductVariantsService;
import com.e_commerce.service.product.ProductVariantsValuesService;
import com.e_commerce.specification.OrderSpecification;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {
    private final OrdersMapper ordersMapper;
    private final OrdersRepository ordersRepository;
    private final AccountService accountService;
    private final CartsService cartsService;
    private final CartItemsService cartItemsService;
    private final OrderItemsService orderItemsService;
    private final UserInformationService userInformationService;
    private final ProductVariantsService productVariantsService;
    private final ProductVariantsValuesService productVariantsValuesService;

    @Override
    public Orders getOrderEntityById(Integer id) {
        return ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Override
    public OrderDTO createOrder(OrderCreateForm orderCreateForm) {

        Account account = accountService.getAccountAuth();

        UserInformation userInformation = userInformationService.getUserInformationEntityById(orderCreateForm.getUserInfoId());

        Carts carts = cartsService.getCartByAccountId(account.getId());

        List<CartItems> selectedCartItems  = cartItemsService.getCartItemsByCartId(carts.getId());


        if (selectedCartItems .isEmpty()) {
            throw new CustomException(ErrorResponse.CART_EMPTY);
        }

        // Tính toán tổng tiền những sản phẩm trong giỏ hàng đã chọn
        BigDecimal total = BigDecimal.ZERO;
        for (CartItems cartItem : selectedCartItems ) {
            BigDecimal itemPrice = cartItem.getProductVariant().getPrice();

            if (cartItem.getVariantValue() != null) {
                itemPrice = itemPrice.add(cartItem.getVariantValue().getPrice());
            }
            total = total.add(itemPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }


        Orders order = ordersMapper.convertCreateDTOToEntity(orderCreateForm);
        order.setId(IdGenerator.getGenerationId());
        order.setAccount(account);
        order.setTotalPrice(total);
        order.setNote(orderCreateForm.getNote());
        order.setUserInformation(userInformation);

        order = ordersRepository.save(order);

        // Tạo các OrderItems từ các CartItems đã chọn và liên kết chúng với đơn hàng mới tạo (check ton kho trong day)
        orderItemsService.createOrderItemsFromCartItem(selectedCartItems, order);

        // Cập nhật số lượng tồn kho của từng sản phẩm trong giỏ hàng đã chọn
//        for (CartItems cartItem : selectedCartItems) {
//            productVariantsService.decreaseStock(cartItem.getProductVariant().getId(), cartItem.getQuantity());
//
//            if (cartItem.getVariantValue() != null) {
//                productVariantsValuesService.decreaseStock(cartItem.getProductVariant().getId(), cartItem.getVariantValue().getId(), cartItem.getQuantity());
//            }
//        }

        // Xóa các CartItems đã chọn khỏi giỏ hàng
//        cartItemsService.deleteCartItems(selectedCartItems.stream().map(CartItems::getId).collect(Collectors.toList()));

        return ordersMapper.convertEntityToDTO(order);
    }

    @Override
    public Orders createOrderFromEntireCart(String orderNote) {
        Account account = accountService.getAccountAuth();

        Carts carts = cartsService.getCartByAccountId(account.getId());

        List<CartItems> cartItems = cartItemsService.getCartItemsByCartId(carts.getId());

        if (cartItems == null || cartItems.isEmpty()) {
            throw new CustomException(ErrorResponse.CART_EMPTY);
        }

        OrderCreateFromCart form = OrderCreateFromCart.builder()
                .userId(account.getId())
                .selectedCartItemIds(cartItems.stream().map(CartItems::getId).collect(Collectors.toList()))
                .orderNote(orderNote)
                .build();
        return null;
    }

    @Override
    @Transactional
    public OrderDTO checkout(CheckoutForm checkoutForm) {
        Account account = accountService.getAccountAuth();
//        userInformationService.updateUserInfo(checkoutForm.getUserInfo());
        return createOrder(checkoutForm.getOrderForm());
    }

    @Override
    public Orders getOrder() {
        Account account = accountService.getAccountAuth();
        return ordersRepository.findTopByAccount_IdOrderByOrderTimeDesc(account.getId()).orElseThrow(() -> new RuntimeException("Order not found for account id: " + account.getId()));
    }

    @Transactional
    @Override
    public void confirmOrderAfterPayment(Orders order) {
        Carts carts = cartsService.getCartByAccountId(order.getAccount().getId());
        List<CartItems> cartItems = cartItemsService.getCartItemsByCartId(carts.getId());

        for (CartItems cartItem : cartItems) {
            productVariantsService.decreaseStock(cartItem.getProductVariant().getId(), cartItem.getQuantity());

            if (cartItem.getVariantValue() != null) {
                productVariantsValuesService.decreaseStock(cartItem.getProductVariant().getId(), cartItem.getVariantValue().getId(), cartItem.getQuantity());
            }
        }

        cartItemsService.deleteAllCartItemsByAccountId(order.getAccount().getId());

        order.setOrderStatus(OrderStatus.CONFIRMED);
        ordersRepository.save(order);
    }

    @Override
    public OrderDTO updateOrderStatus(Integer orderId, OrderStatus status) {
        Orders order = getOrderEntityById(orderId);
        order.setOrderStatus(status);
        return ordersMapper.convertEntityToDTO(ordersRepository.save(order));
    }

    @Override
    public PageDTO<OrderDTO> getAllOrders(int page, int size, OrderFilter orderFilter) {
        Account account = accountService.getAccountAuth();
        Specification<Orders> specification = OrderSpecification.filterOrder(orderFilter, account.getId());
        Pageable pageable = PageRequest.of(page-1, size);
        return ordersMapper.convertEntityPageToDTOPage(ordersRepository.findAll(specification, pageable));
    }


}
