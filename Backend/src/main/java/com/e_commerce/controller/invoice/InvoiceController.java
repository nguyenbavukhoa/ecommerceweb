package com.e_commerce.controller.invoice;


import com.e_commerce.dto.ApiResponse;
import com.e_commerce.dto.PageDTO;
import com.e_commerce.dto.invoice.invoiceDTO.InvoiceCreateForm;
import com.e_commerce.dto.invoice.invoiceDTO.InvoiceDTO;
import com.e_commerce.dto.invoice.invoiceDTO.InvoiceFilter;
import com.e_commerce.service.invoice.InvoiceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService invoiceService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<InvoiceDTO>> createInvoice(@Valid @RequestBody InvoiceCreateForm form, HttpServletRequest request) {
        InvoiceDTO invoiceDTO = invoiceService.createInvoice(form);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Invoice created successfully", invoiceDTO, null, request.getRequestURI()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageDTO<InvoiceDTO>>> getAllInvoices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            InvoiceFilter filter,
            HttpServletRequest request) {
        PageDTO<InvoiceDTO> invoices = invoiceService.getAllInvoices(page, size, filter);
        return ResponseEntity.ok(new ApiResponse<>(true, "Invoices retrieved successfully", invoices, null, request.getRequestURI()));
    }

}
