package com.e_commerce.service.voucher.impl;

import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.voucher.VoucherCheck;
import com.e_commerce.dto.voucher.VoucherCreateForm;
import com.e_commerce.dto.voucher.VoucherDTO;
import com.e_commerce.dto.voucher.VoucherFilter;
import com.e_commerce.entity.Voucher;
import com.e_commerce.entity.product.Product;
import com.e_commerce.enums.VoucherType;
import com.e_commerce.exceptions.CustomException;
import com.e_commerce.exceptions.ErrorResponse;
import com.e_commerce.mapper.voucher.VoucherMapper;
import com.e_commerce.orther.IdGenerator;
import com.e_commerce.repository.voucher.VoucherRepository;
import com.e_commerce.service.voucher.VoucherService;
import com.e_commerce.specification.VoucherSpecification;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private final VoucherMapper voucherMapper;
    private final VoucherRepository voucherRepository;

    @Override
    public VoucherDTO createVoucher(VoucherCreateForm voucherCreateForm) {
        Voucher voucher = voucherMapper.convertCreateDTOToEntity(voucherCreateForm);
        voucher.setId(IdGenerator.getGenerationId());

        if (voucherRepository.existsByCode(voucher.getCode())) {
            throw new CustomException(ErrorResponse.VOUCHER_ALREADY_EXISTS);
        }
        if(voucher.getEndDate().isBefore(voucher.getStartDate())) {
            throw new CustomException(ErrorResponse.VOUCHER_ENDDATE_BEFORE_STARTDATE);
        }

        if (voucherCreateForm.getType() == VoucherType.PERCENTAGE) {
            voucher.setPercent(voucherCreateForm.getValue());
            voucher.setAmount(null);
        } else if (voucherCreateForm.getType() == VoucherType.FIXED_AMOUNT) {
            voucher.setAmount(BigDecimal.valueOf(voucherCreateForm.getValue()));
            voucher.setPercent(null);
        }

        return voucherMapper.convertEntityToDTO(voucherRepository.save(voucher));
    }

    @Override
    public Voucher getVoucherEntityById(Integer id) {
        return voucherRepository.findById(id).orElseThrow(() -> new CustomException(ErrorResponse.VOUCHER_NOT_FOUND));
    }

    @Override
    public void deleteVoucher(Integer id) {
        Voucher voucher = getVoucherEntityById(id);
        voucherRepository.delete(voucher);
    }

    @Override
    public PageDTO<VoucherDTO> getAllVouchers(int page, int size, VoucherFilter voucherFilter) {
        Specification<Voucher> specification = VoucherSpecification.filterVoucher(voucherFilter);
        Pageable pageable = PageRequest.of(page-1, size);
        return voucherMapper.convertEntityPageToDTOPage(voucherRepository.findAll(specification, pageable));
    }

    @Override
    public VoucherCheck checkVoucher(String voucherCode) {
        Voucher voucher = voucherRepository.findByCode(voucherCode)
                        .orElseThrow(() -> new CustomException(ErrorResponse.VOUCHER_NOT_FOUND));

        if (!voucher.getActive()) {
            return VoucherCheck.builder()
                    .valid(false)
                    .message("Voucher is inactive")
                    .build();
        }

        if (voucher.getStartDate() != null && LocalDateTime.now().isBefore(voucher.getStartDate())) {
            return VoucherCheck.builder()
                    .valid(false)
                    .message("Voucher is not valid yet")
                    .build();
        }

        if (voucher.getEndDate().isBefore(LocalDateTime.now())) {
            return VoucherCheck.builder()
                    .valid(false)
                    .message("Voucher has expired")
                    .build();
        }


        return VoucherCheck.builder()
                .valid(true)
                .message("Voucher is valid")
                .voucher(voucherMapper.convertEntityToDTO(voucher))
                .build();
    }
}
