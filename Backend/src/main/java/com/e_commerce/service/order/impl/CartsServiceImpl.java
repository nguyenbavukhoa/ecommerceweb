package com.e_commerce.service.order.impl;

import com.e_commerce.dto.order.cartDTO.CartCreateForm;
import com.e_commerce.dto.order.cartDTO.CartDTO;
import com.e_commerce.entity.account.Account;
import com.e_commerce.entity.order.Carts;
import com.e_commerce.mapper.order.CartsMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.order.CartsRepository;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.order.CartsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class CartsServiceImpl implements CartsService {
    private final CartsRepository cartsRepository;
    private final CartsMapper cartsMapper;
    private final AccountService accountService;

    @Override
    public Carts getCartsEntityById(Integer id) {
        return cartsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carts not found with id: " + id));
    }

    @Override
    public CartDTO createCarts(CartCreateForm cartCreateForm) {
        Account account = accountService.getAccountEntityById(cartCreateForm.getUserId());

        Carts carts = cartsMapper.convertCreateDTOToEntity(cartCreateForm);
        carts.setId(IdGenerator.getGenerationId());
        carts.setAccount(account);

        return cartsMapper.convertEntityToDTO(cartsRepository.save(carts));
    }

    @Override
    public CartDTO getOrCreateCartForUser(Integer userId) {
        return cartsRepository.findByAccountId(userId)
                .map(cartsMapper::convertEntityToDTO)
                .orElseGet(() -> {
                    CartCreateForm cartCreateForm = new CartCreateForm();
                    cartCreateForm.setUserId(userId);
                    return createCarts(cartCreateForm);
                });
    }


}
