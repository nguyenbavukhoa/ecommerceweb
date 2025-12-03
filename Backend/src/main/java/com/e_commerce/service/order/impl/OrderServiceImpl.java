package com.e_commerce.service.order.impl;

import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.order.cartDTO.CheckoutForm;
import com.e_commerce.dto.order.orderDTO.OrderCreateForm;
import com.e_commerce.dto.order.orderDTO.OrderCreateFromCart;
import com.e_commerce.dto.order.orderDTO.OrderDTO;
import com.e_commerce.dto.order.orderDTO.OrderFilter;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.account.UserInformation;
import com.e_commerce.entity.order.CartItems;
import com.e_commerce.entity.order.Carts;
import com.e_commerce.entity.order.OrderItems;
import com.e_commerce.entity.order.Orders;
import com.e_commerce.entity.product.OptionValues;
import com.e_commerce.enums.OrderStatus;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.order.OrdersMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.OrdersRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.account.UserInformationService;
import com.e_commerce.service.email.EmailService;
import com.e_commerce.service.order.CartItemsService;
import com.e_commerce.service.order.CartsService;
import com.e_commerce.service.order.OrderItemsService;
import com.e_commerce.service.order.OrderService;
import com.e_commerce.service.product.OptionsValuesService;
import com.e_commerce.service.product.ProductService;
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
    private final EmailService emailService;
    private final ProductService productService;
    private final OptionsValuesService optionsValuesService;
    private final OrderStatusHistoryServiceImpl orderStatusHistoryService;

    @Override
    public Orders getOrderEntityById(Integer id) {
        return ordersRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.ORDER_NOT_FOUND));
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
            BigDecimal itemPrice = cartItem.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(itemPrice);
        }


        Orders order = ordersMapper.convertCreateDTOToEntity(orderCreateForm);
        order.setId(IdGenerator.getGenerationId());
        order.setAccount(account);
        order.setTotalPrice(total);
        order.setUserInformation(userInformation);
        order.setNote(orderCreateForm.getNote());
        order.setRestaurant(selectedCartItems.get(0).getProduct().getRestaurant());

        order = ordersRepository.save(order);

        // Tạo các OrderItems từ các CartItems đã chọn và liên kết chúng với đơn hàng mới tạo (check ton kho trong day)
        List<OrderItems> orderItems = orderItemsService.createOrderItemsFromCartItem(selectedCartItems, order);

        order.setOrderItems(orderItems);

        order = ordersRepository.save(order);
        cartItemsService.deleteAllCartItemsByAccountId();
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
            productService.decreaseStock(cartItem.getProduct().getId(), cartItem.getQuantity());

            if (cartItem.getSelectedOptions() != null && !cartItem.getSelectedOptions().isEmpty()) {
                for (OptionValues values : cartItem.getSelectedOptions()) {
                    optionsValuesService.decreaseStock(values.getId(), cartItem.getQuantity());
                }
            }
        }

        cartItemsService.deleteAllCartItemsByAccountId();

        order.setOrderStatus(OrderStatus.CONFIRMED);

        ordersRepository.save(order);

        emailService.sendOrderStatusEmail(OrderStatus.CONFIRMED, order.getAccount().getEmail(), order.getAccount().getAccountName(), String.valueOf(order.getId()), order.getTotalPrice());
    }

    @Transactional
    @Override
    public OrderDTO updateOrderStatus(Integer orderId, OrderStatus status) {
        Orders order = getOrderEntityById(orderId);
        order.setOrderStatus(status);
        Orders savedOrder = ordersRepository.save(order);

        switch (status){
            case CONFIRMED -> {
                emailService.sendOrderStatusEmail(OrderStatus.CONFIRMED, order.getAccount().getEmail(), order.getAccount().getAccountName(), String.valueOf(order.getId()), order.getTotalPrice());
            }
            case CANCELLED -> {
                emailService.sendOrderStatusEmail(OrderStatus.CANCELLED, order.getAccount().getEmail(), order.getAccount().getAccountName(), String.valueOf(order.getId()), order.getTotalPrice());
            }
            case IN_PROGRESS -> {
                emailService.sendOrderStatusEmail(OrderStatus.IN_PROGRESS, order.getAccount().getEmail(), order.getAccount().getAccountName(), String.valueOf(order.getId()), order.getTotalPrice());
            }
            case DELIVERED -> {
                emailService.sendOrderStatusEmail(OrderStatus.DELIVERED, order.getAccount().getEmail(), order.getAccount().getAccountName(), String.valueOf(order.getId()), order.getTotalPrice());
            }
            case REJECTED -> {
                emailService.sendOrderStatusEmail(OrderStatus.REJECTED, order.getAccount().getEmail(), order.getAccount().getAccountName(), String.valueOf(order.getId()), order.getTotalPrice());
            }
        }
        orderStatusHistoryService.save(order, "Change status to " + status);

        return ordersMapper.convertEntityToDTO(ordersRepository.save(savedOrder));
    }

    @Override
    public OrderDTO adminUpdateOrderStatus(Integer orderId, OrderStatus newStatus) {
        Orders order = getOrderEntityById(orderId);
        OrderStatus oldStatus = order.getOrderStatus();

        // Không cho sửa trạng thái khi đơn đã hoàn tất hoặc huỷ
        if (oldStatus == OrderStatus.DELIVERED || oldStatus == OrderStatus.CANCELLED) {
            throw new CustomException(ErrorResponse.ORDER_STATUS_NOT_ALLOWED);
        }

        // Validate trạng thái hợp lệ
        validateStatusTransition(oldStatus, newStatus);

        // Nếu admin chuyển sang CONFIRMED => giảm kho
        if (newStatus == OrderStatus.CONFIRMED) {
            confirmStock(order);
        }

        // Cập nhật trạng thái
        order.setOrderStatus(newStatus);
        Orders savedOrder = ordersRepository.save(order);

        // Lưu lịch sử trạng thái
        orderStatusHistoryService.save(order, "Admin changed status from " + oldStatus + " to " + newStatus);

        // Gửi email thông báo
        emailService.sendOrderStatusEmail(
                newStatus,
                order.getAccount().getEmail(),
                order.getAccount().getAccountName(),
                order.getId().toString(),
                order.getTotalPrice()
        );

        return ordersMapper.convertEntityToDTO(savedOrder);
    }

    private void validateStatusTransition(OrderStatus oldStatus, OrderStatus newStatus) {

        switch (oldStatus) {
            case PLACED -> {
                if (newStatus == OrderStatus.DELIVERED)
                    throw new CustomException(ErrorResponse.ORDER_STATUS_NOT_ALLOWED);
            }
            case CONFIRMED -> {
                // Từ Confirmed không thể quay lại Pending
                if (newStatus == OrderStatus.PLACED)
                    throw new CustomException(ErrorResponse.ORDER_STATUS_NOT_ALLOWED);
            }
            case IN_PROGRESS -> {
                // Không thể lùi trạng thái
                if (newStatus == OrderStatus.PLACED || newStatus == OrderStatus.CONFIRMED)
                    throw new CustomException(ErrorResponse.ORDER_STATUS_NOT_ALLOWED);
            }
            default -> {
            }
        }
    }

    private void confirmStock(Orders order) {
        for (OrderItems item : order.getOrderItems()) {
            productService.decreaseStock(item.getProduct().getId(), item.getQuantity());

            if (item.getSelectedOptions() != null) {
                for (OptionValues opt : item.getSelectedOptions()) {
                    optionsValuesService.decreaseStock(opt.getId(), item.getQuantity());
                }
            }
        }
    }

    @Override
    public PageDTO<OrderDTO> getAllOrders(int page, int size, OrderFilter orderFilter) {
        Account account = accountService.getAccountAuth();
        Specification<Orders> specification = OrderSpecification.filterOrder(orderFilter, account.getId());
        Pageable pageable = PageRequest.of(page-1, size);
        return ordersMapper.convertEntityPageToDTOPage(ordersRepository.findAll(specification, pageable));
    }

    @Override
    public PageDTO<OrderDTO> getOrdersByRestaurant(int page, int size, Integer restaurantId) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return ordersMapper.convertEntityPageToDTOPage(ordersRepository.findByRestaurantId(restaurantId, pageable));
    }

    @Override
    public void deleteOrder(Integer orderId) {
        Orders order = getOrderEntityById(orderId);
        ordersRepository.delete(order);
    }


}
