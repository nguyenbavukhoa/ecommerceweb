package com.e_commerce.service.voucher;

import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.voucher.*;
import com.e_commerce.entity.Voucher;
import org.springframework.stereotype.Service;

@Service
public interface VoucherService {
    VoucherDTO createVoucher(VoucherCreateForm voucherCreateForm);

    Voucher getVoucherEntityById(Integer id);

    void deleteVoucher(Integer id);

    PageDTO<VoucherDTO> getAllVouchers(int page, int size, VoucherFilter voucherFilter);

    VoucherCheck checkVoucher(String voucherCode);

}
