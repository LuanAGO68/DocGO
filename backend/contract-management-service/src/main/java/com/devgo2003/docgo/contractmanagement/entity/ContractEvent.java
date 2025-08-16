package com.devgo2003.docgo.contractmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "contract_events", indexes = {
        @Index(name = "idx_contract_events_contract_id", columnList = "contract_id")
})
@Getter
@Setter
public class ContractEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // liên kết tới contract (nullable = true nếu event chung hệ thống)
    @Column(name = "contract_id")
    private Long contractId;

    /**
     * Ví dụ: CREATE, UPDATE, DELETE, ATTACHMENT_ADD, ATTACHMENT_REMOVE, STATUS_CHANGE
     */
    @Column(name = "event_type", nullable = false)
    private String eventType;

    /**
     * Dữ liệu chi tiết của event, dạng JSON (what changed, previous values, new values...)
     */
    @Column(name = "event_data", columnDefinition = "JSON")
    private String eventData;

    /**
     * Người thực hiện (actor)
     */
    @Column(name = "actor")
    private String actor;

    /**
     * Thời điểm xảy ra event
     */
    @Column(name = "event_time", nullable = false)
    private LocalDateTime eventTime;

    /**
     * Ghi chú (tuỳ chọn)
     */
    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @PrePersist
    protected void onCreate() {
        if (this.eventTime == null) {
            this.eventTime = LocalDateTime.now();
        }
    }
}
