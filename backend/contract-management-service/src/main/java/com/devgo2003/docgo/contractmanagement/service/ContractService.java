package com.devgo2003.docgo.contractmanagement.service;

import com.devgo2003.docgo.contractmanagement.entity.Contract;
import com.devgo2003.docgo.contractmanagement.entity.ContractAttachment;
import com.devgo2003.docgo.contractmanagement.entity.ContractEvent;
import com.devgo2003.docgo.contractmanagement.repository.ContractRepository;
import com.devgo2003.docgo.contractmanagement.repository.ContractAttachmentRepository;
import com.devgo2003.docgo.contractmanagement.repository.ContractEventRepository;
import com.devgo2003.docgo.contractmanagement.service.event.ContractEventPublisher;
import com.devgo2003.docgo.contractmanagement.service.event.ContractEventPayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class ContractService {
    private final ContractRepository contractRepository;
    private final ContractAttachmentRepository attachmentRepository;
    private final ContractEventRepository eventRepository;
    private final ContractEventPublisher eventPublisher;

    @Autowired
    public ContractService(ContractRepository contractRepository,
                           ContractAttachmentRepository attachmentRepository,
                           ContractEventRepository eventRepository,
                           ContractEventPublisher eventPublisher) {
        this.contractRepository = contractRepository;
        this.attachmentRepository = attachmentRepository;
        this.eventRepository = eventRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public Contract createContract(Contract contract) {
        contract.setContractNumber("CONTRACT-" + System.currentTimeMillis());
        contract.setStatus(Contract.ContractStatus.DRAFT);
        // BaseEntity sẽ tự động xử lý created_at và is_deleted

        Contract savedContract = contractRepository.save(contract);
        
        ContractEvent event = new ContractEvent();
        event.setContractId(savedContract.getId());
        event.setEventType("CREATE");
        event.setEventData("{\"message\": \"Tạo hợp đồng mới\"}");
        event.setActor("system"); // Placeholder

        eventRepository.save(event);
        eventPublisher.publishEvent(new ContractEventPayload(savedContract, "created"));
        return savedContract;
    }

    public Optional<Contract> getContract(Long id) {
        return contractRepository.findById(id);
    }

    public Page<Contract> getAllContracts(int pageNumber, int pageSize, String sortBy, String sortDirection, boolean includeDeleted) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        if (includeDeleted) {
            return contractRepository.findAll(pageable);
        } else {
            return contractRepository.findByIsDeletedFalse(pageable);
        }
    }

    public List<Contract> getActiveContracts() {
        return contractRepository.findByIsDeletedFalse();
    }

    public List<Contract> getContractsByStatus(String status) {
        try {
            Contract.ContractStatus contractStatus = Contract.ContractStatus.valueOf(status.toUpperCase());
            return contractRepository.findByStatusAndIsDeletedFalse(contractStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Trạng thái hợp đồng không hợp lệ: " + status);
        }
    }

    @Transactional
    public Contract updateContract(Long id, Contract updatedContract) {
        Contract existingContract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng với ID: " + id));

        if (existingContract.getIsDeleted()) {
            throw new RuntimeException("Không thể cập nhật hợp đồng đã bị xóa");
        }
        
        // Cập nhật các trường
        existingContract.setTitle(updatedContract.getTitle());
        existingContract.setStatus(updatedContract.getStatus());
        existingContract.setPartiesJson(updatedContract.getPartiesJson());
        existingContract.setStartDate(updatedContract.getStartDate());
        existingContract.setEndDate(updatedContract.getEndDate());
        existingContract.setSystemId(updatedContract.getSystemId());
        
        Contract savedContract = contractRepository.save(existingContract);
        
        ContractEvent event = new ContractEvent();
        event.setContractId(savedContract.getId());
        event.setEventType("UPDATE");
        event.setEventData("{\"message\": \"Cập nhật hợp đồng\"}");
        event.setActor("system"); // Placeholder
        eventRepository.save(event);

        eventPublisher.publishEvent(new ContractEventPayload(savedContract, "updated"));
        return savedContract;
    }

    @Transactional
    public void softDeleteContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng với ID: " + id));

        if (contract.getIsDeleted()) {
            throw new RuntimeException("Hợp đồng đã bị xóa trước đó");
        }

        // Thực hiện soft delete bằng cách gọi phương thức đã có trong BaseEntity
        contract.markAsDeleted("system"); // Placeholder cho người xóa
        contract.setStatus(Contract.ContractStatus.EXPIRED); // Cập nhật trạng thái
        contractRepository.save(contract);
        
        ContractEvent event = new ContractEvent();
        event.setContractId(contract.getId());
        event.setEventType("SOFT_DELETE");
        event.setEventData("{\"message\": \"Xóa mềm hợp đồng\"}");
        event.setActor("system");
        eventRepository.save(event);

        eventPublisher.publishEvent(new ContractEventPayload(contract, "soft_deleted"));
    }

    @Transactional
    public void restoreContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng với ID: " + id));
        
        if (!contract.getIsDeleted()) {
            throw new RuntimeException("Hợp đồng chưa bị xóa");
        }

        contract.restore();
        contract.setStatus(Contract.ContractStatus.DRAFT); // Khôi phục trạng thái về DRAFT
        contractRepository.save(contract);
        
        ContractEvent event = new ContractEvent();
        event.setContractId(contract.getId());
        event.setEventType("RESTORE");
        event.setEventData("{\"message\": \"Khôi phục hợp đồng\"}");
        event.setActor("system");
        eventRepository.save(event);
        
        eventPublisher.publishEvent(new ContractEventPayload(contract, "restored"));
    }

    @Transactional
    public ContractAttachment addAttachment(Long contractId, ContractAttachment attachment) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng với ID: " + contractId));

        if (contract.getIsDeleted()) {
            throw new RuntimeException("Không thể thêm file đính kèm cho hợp đồng đã bị xóa");
        }

        attachment.setContractId(contractId);
        // BaseEntity sẽ tự động xử lý created_at và is_deleted
        
        ContractAttachment savedAttachment = attachmentRepository.save(attachment);
        
        ContractEvent event = new ContractEvent();
        event.setContractId(contractId);
        event.setEventType("ATTACHMENT_ADD");
        event.setEventData("{\"file_id\": \"" + savedAttachment.getFileId() + "\", \"file_name\": \"" + savedAttachment.getFileName() + "\"}");
        event.setActor("system");
        eventRepository.save(event);

        return savedAttachment;
    }

    public List<ContractAttachment> getAttachments(Long contractId) {
        // Sử dụng repository method thay vì Java Stream để tối ưu hơn
        return attachmentRepository.findByContractIdAndIsDeletedFalse(contractId);
    }
    
    public List<ContractEvent> getContractEvents(Long contractId) {
        // Sử dụng repository method thay vì Java Stream để tối ưu hơn
        return eventRepository.findByContractIdOrderByEventTimeDesc(contractId);
    }
}
