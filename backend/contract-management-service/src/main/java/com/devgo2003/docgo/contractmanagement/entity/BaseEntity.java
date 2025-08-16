package com.devgo2003.docgo.contractmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Base entity chứa các trường audit cơ bản (created_at, created_by),
 * soft-delete và version. Các thay đổi/updates sẽ được lưu vào bảng audit riêng (contract_events).
 */
@MappedSuperclass
public abstract class BaseEntity {

    /**
     * Thời gian tạo bản ghi
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Người tạo bản ghi
     */
    @Column(name = "created_by")
    private String createdBy;

    /**
     * Thời gian xóa (null nếu chưa xóa)
     */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    /**
     * Người xóa
     */
    @Column(name = "deleted_by")
    private String deletedBy;

    /**
     * Trạng thái xóa: false = chưa xóa, true = đã xóa
     */
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    /**
     * Phiên bản bản ghi cho optimistic locking
     */
    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Getters / Setters
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public String getCreatedBy() {
        return createdBy;
    }
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }
    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
    public String getDeletedBy() {
        return deletedBy;
    }
    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }
    public Boolean getIsDeleted() {
        return isDeleted;
    }
    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
    public Long getVersion() {
        return version;
    }
    public void setVersion(Long version) {
        this.version = version;
    }

    /**
     * Đánh dấu soft-delete — không xóa vật lý, chỉ cập nhật cờ và thời gian.
     */
    public void markAsDeleted(String deletedBy) {
        this.isDeleted = true;
        this.deletedAt = LocalDateTime.now();
        this.deletedBy = deletedBy;
    }

    /**
     * Khôi phục bản ghi đã xóa (soft-restore)
     */
    public void restore() {
        this.isDeleted = false;
        this.deletedAt = null;
        this.deletedBy = null;
    }
}
