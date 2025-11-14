package com.e_commerce.controller.product;

import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesCreateDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesDTO;
import com.e_commerce.dto.product.optionValuesDTO.OptionValuesUpdateDTO;
import com.e_commerce.service.product.OptionsValuesService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/options-values")
@RequiredArgsConstructor
public class OptionsValuesController {
    private final OptionsValuesService optionsValuesService;

    @GetMapping("/variant-option/{optionId}")
    public ResponseEntity<ApiResponse<List<OptionValuesDTO>>> getVariantValuesByVariantOptionId(@PathVariable Integer optionId, HttpServletRequest request) {
        List<OptionValuesDTO> variantValues = optionsValuesService.getVariantValuesByVariantOptionId(optionId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse<>(true, "Variant values retrieved successfully", variantValues, null, request.getRequestURI()));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<OptionValuesDTO>> createOptionsValues(@RequestBody OptionValuesCreateDTO optionValuesCreateDTO, HttpServletRequest request) {
        OptionValuesDTO createdOptionsValues = optionsValuesService.createOptionValues(optionValuesCreateDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Options values created successfully", createdOptionsValues, null, request.getRequestURI()));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<OptionValuesDTO>> updateOptionsValues(@RequestBody OptionValuesUpdateDTO updateDTO, @PathVariable Integer id, HttpServletRequest request) {
        OptionValuesDTO updatedOptionsValues = optionsValuesService.updateVariantValue(updateDTO, id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse<>(true, "Options values updated successfully", updatedOptionsValues, null, request.getRequestURI()));
    }
}
