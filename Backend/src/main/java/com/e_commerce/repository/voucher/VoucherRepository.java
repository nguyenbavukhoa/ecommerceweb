package com.e_commerce.repository.voucher;

import com.e_commerce.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Integer>, JpaSpecificationExecutor<Voucher> {
    Boolean existsByCode(String code);

    Optional<Voucher> findByCode(String code);
}
