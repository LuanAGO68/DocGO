package com.devgo2003.docgo.contractmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "contracts")
@Getter
@Setter
public class Contract extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contract_number", nullable = false, unique = true)
    private String contractNumber;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractStatus status;

    @Column(name = "parties_json", columnDefinition = "JSON")
    private String partiesJson;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "system_id")
    private String systemId;

    public enum ContractStatus {
        DRAFT, PENDING_APPROVAL, ACTIVE, EXPIRED, ARCHIVED
    }
}
