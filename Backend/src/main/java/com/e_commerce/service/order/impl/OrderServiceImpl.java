package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.orderDTO.OrderCreateForm;
import com.e_commerce.dto.order.orderDTO.OrderCreateFromCart;
import com.e_commerce.dto.order.orderDTO.OrderDTO;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.order.Carts;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.order.OrdersMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.OrdersRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.order.CartItemsService;
import com.e_commerce.service.order.CartsService;
import com.e_commerce.service.order.OrderItemsService;
import com.e_commerce.service.order.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrdersMapper ordersMapper;
    private final OrdersRepository ordersRepository;
    private final AccountService accountService;
    private final CartsService cartsService;
    private final CartItemsService cartItemsService;
    private final OrderItemsService orderItemsService;

    @Override
    public Orders getOrderEntityById(Integer id) {
        return ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Override
    public Orders createOrder(OrderCreateForm orderCreateForm) {
        Account account = accountService.getAccountAuth();

        Carts carts = cartsService.getCartByAccountId(account.getId());

        List<CartItems> selectedCartItems  = cartItemsService.getCartItemsByCartId(carts.getId());

        if (selectedCartItems  == null || selectedCartItems .isEmpty()) {
            throw new CustomException(ErrorResponse.CART_EMPTY);
        }

        // Check số lượng tồn kho của từng sản phẩm trong giỏ hàng đã chọn

        // Tính toán tổng tiền những sản phẩm trong giỏ hàng đã chọn



        Orders order = ordersMapper.convertCreateDTOToEntity(orderCreateForm);
        order.setId(IdGenerator.getGenerationId());
        order.setAccount(account);
        order = ordersRepository.save(order);

        // Tạo các OrderItems từ các CartItems đã chọn và liên kết chúng với đơn hàng mới tạo
        orderItemsService.createOrderItemsFromCartItem(selectedCartItems, order);

        // Cập nhật số lượng tồn kho của từng sản phẩm trong giỏ hàng đã chọn

        // Xóa các CartItems đã chọn khỏi giỏ hàng
        cartItemsService.deleteCartItems(selectedCartItems.stream().map(CartItems::getId).collect(Collectors.toList()));

        return order;
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
}
