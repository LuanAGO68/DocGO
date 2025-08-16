package com.devgo2003.docgo.contractmanagement.controller;

import com.devgo2003.docgo.contractmanagement.entity.Contract;
import com.devgo2003.docgo.contractmanagement.entity.ContractAttachment;
import com.devgo2003.docgo.contractmanagement.entity.ContractEvent;
import com.devgo2003.docgo.contractmanagement.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/v1/contract-management-service/contracts")
@Tag(name = "API Quản lý Hợp đồng", description = "Các API để tạo, đọc, cập nhật và xóa hợp đồng")
public class ContractController {

    private final ContractService contractService;

    @Autowired
    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @Operation(summary = "Tạo hợp đồng mới", description = "Tạo hợp đồng mới với trạng thái DRAFT")
    @PostMapping
    public ResponseEntity<Contract> createContract(@Valid @RequestBody Contract contract) {
        Contract created = contractService.createContract(contract);
        return ResponseEntity.ok(created);
    }

    @Operation(summary = "Lấy danh sách hợp đồng với phân trang và sắp xếp", description = "Lấy danh sách hợp đồng với phân trang và sắp xếp")
    @GetMapping
    public ResponseEntity<Page<Contract>> getAllContracts( // Changed List to Page
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection,
            @RequestParam(defaultValue = "false") boolean includeDeleted) {
        return ResponseEntity.ok(contractService.getAllContracts(pageNumber, pageSize, sortBy, sortDirection, includeDeleted));
    }

    @Operation(summary = "Lấy hợp đồng theo ID", description = "Lấy thông tin chi tiết hợp đồng theo ID")
    @GetMapping("/{id}")
    public ResponseEntity<Contract> getContract(@PathVariable Long id) {
        Optional<Contract> contract = contractService.getContract(id);
        return contract.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Cập nhật hợp đồng", description = "Cập nhật thông tin hợp đồng")
    @PutMapping("/{id}")
    public ResponseEntity<Contract> updateContract(@PathVariable Long id, @Valid @RequestBody Contract contract) {
        return ResponseEntity.ok(contractService.updateContract(id, contract));
    }

    @Operation(summary = "Xóa mềm hợp đồng", description = "Thay đổi trạng thái hợp đồng thành EXPIRED thay vì xóa vật lý")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteContract(@PathVariable Long id) {
                contractService.softDeleteContract(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Khôi phục hợp đồng", description = "Khôi phục hợp đồng đã bị xóa")
    @PutMapping("/{id}/restore")
    public ResponseEntity<Void> restoreContract(@PathVariable Long id) {
        contractService.restoreContract(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Lấy lịch sử sự kiện của hợp đồng", description = "Lấy lịch sử sự kiện của hợp đồng")
    @GetMapping("/{id}/events")
    public ResponseEntity<List<ContractEvent>> getContractEvents(@PathVariable Long id) {
        return ResponseEntity.ok(contractService.getContractEvents(id));
    }

    @Operation(summary = "Lấy file đính kèm của hợp đồng", description = "Lấy file đính kèm của hợp đồng")
    @GetMapping("/{id}/attachments")
    public ResponseEntity<List<ContractAttachment>> getAttachments(@PathVariable Long id) {
        return ResponseEntity.ok(contractService.getAttachments(id));
    }
}