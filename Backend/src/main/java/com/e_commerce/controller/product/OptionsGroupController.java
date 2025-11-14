package com.e_commerce.controller.product;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupCreateDTO;
import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupDTO;
import com.e_commerce.dto.product.optionGroupDTO.OptionsGroupUpdateDTO;
import com.e_commerce.service.product.OptionsGroupService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/options-group")
@RequiredArgsConstructor
public class OptionsGroupController {
    private final OptionsGroupService optionsGroupService;

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<OptionsGroupDTO>>> getVariantOptionsByCategoryId(@PathVariable Integer categoryId, HttpServletRequest request) {
        List<OptionsGroupDTO> variantOptions = optionsGroupService.getOptionGroupsByProductId(categoryId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse<>(true, "Variant options retrieved successfully", variantOptions, null, request.getRequestURI()));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<OptionsGroupDTO>> createOptionsGroup(@RequestBody OptionsGroupCreateDTO optionsGroupCreateDTO, HttpServletRequest request) {
        OptionsGroupDTO createdOptionsGroup = optionsGroupService.createOptionGroup(optionsGroupCreateDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Options group created successfully", createdOptionsGroup, null, request.getRequestURI()));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<OptionsGroupDTO>> updateOptionsGroup(@RequestBody OptionsGroupUpdateDTO updateDTO, @PathVariable Integer id, HttpServletRequest request) {
        OptionsGroupDTO updatedOptionsGroup = optionsGroupService.updateVariantOption(updateDTO, id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse<>(true, "Options group updated successfully", updatedOptionsGroup, null, request.getRequestURI()));
    }
}
