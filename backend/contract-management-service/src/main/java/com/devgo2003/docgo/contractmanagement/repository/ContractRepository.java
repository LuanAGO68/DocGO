package com.devgo2003.docgo.contractmanagement.repository;

import com.devgo2003.docgo.contractmanagement.entity.Contract;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByIsDeletedFalse();

    Page<Contract> findByIsDeletedFalse(Pageable pageable);

    List<Contract> findByStatusAndIsDeletedFalse(Contract.ContractStatus status);
}
