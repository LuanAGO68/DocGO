package com.devgo2003.docgo.contractmanagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "contract_attachments")
@Getter
@Setter
public class ContractAttachment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contract_id", nullable = false)
    private Long contractId;

    @Column(name = "file_id", nullable = false)
    private String fileId;

    @Column(name = "file_name")
    private String fileName;
}
