package com.e_commerce.mapper.voucher;

import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.voucher.VoucherCreateForm;
import com.e_commerce.dto.voucher.VoucherDTO;
import com.e_commerce.entity.Voucher;
import com.e_commerce.enums.VoucherType;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;


import java.util.List;
import java.util.stream.Collectors;

@Component
public class VoucherMapper {
    public VoucherDTO convertEntityToDTO(Voucher voucher) {
        return VoucherDTO.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .type(voucher.getType())
                .minOrderValue(voucher.getMinOrderValue())
                .isActive(voucher.getActive())
                .startDate(voucher.getStartDate())
                .endDate(voucher.getEndDate())
                .value(voucher.getType() == null ? null : (voucher.getType() == VoucherType.PERCENTAGE ? voucher.getPercent() : voucher.getAmount().doubleValue()))
                .build();
    }

    public Voucher convertCreateDTOToEntity(VoucherCreateForm voucherCreateForm) {
        return Voucher.builder()
                .code(voucherCreateForm.getCode())
                .type(voucherCreateForm.getType())
                .minOrderValue(voucherCreateForm.getMinOrderValue())
                .startDate(voucherCreateForm.getStartDate())
                .endDate(voucherCreateForm.getEndDate())
                .active(voucherCreateForm.getIsActive())
                .build();
    }

    public List<VoucherDTO> convertEntityListToDTOList(List<Voucher> vouchers) {
        return vouchers.stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }

    public PageDTO<VoucherDTO> convertEntityPageToDTOPage(Page<Voucher> voucherPage) {
        return PageDTO.<VoucherDTO>builder()
                .content(convertEntityListToDTOList(voucherPage.getContent()))
                .page(voucherPage.getNumber())
                .size(voucherPage.getSize())
                .totalElements(voucherPage.getTotalElements())
                .totalPages(voucherPage.getTotalPages())
                .build();
    }
}
