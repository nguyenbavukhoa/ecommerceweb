package com.e_commerce.service.order.impl;

import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.order.Carts;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.order.CartsMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.CartsRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.order.CartsService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class CartsServiceImpl implements CartsService {
    private final CartsRepository cartsRepository;
    private final CartsMapper cartsMapper;
    private final AccountService accountService;

    @Override
    public Carts getCartsEntityById(Integer id) {
        return cartsRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorResponse.CART_NOT_FOUND));
    }

    @Override
    public Carts createCarts() {
        
        Account account = accountService.getAccountAuth();

        Optional<Carts> existingCarts = cartsRepository.findByAccountId(account.getId());
        if (existingCarts.isPresent()) {
            return existingCarts.get();
        }

        Carts carts = new Carts();
        carts.setId(IdGenerator.getGenerationId());
        carts.setAccount(account);

        return cartsRepository.save(carts);
    }

    @Override
    public Carts getCartByAccountId(Integer accountId) {
        log.info("Fetching cart for account ID: {}", accountId);
        return cartsRepository.findByAccountId(accountId)
                .orElseThrow(() -> new CustomException(ErrorResponse.CART_NOT_FOUND));

    }


}
