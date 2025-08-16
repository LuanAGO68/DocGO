CREATE DATABASE IF NOT EXISTS docgo_contract_service;
USE docgo_contract_service;

DROP TABLE IF EXISTS contract_attachments;
DROP TABLE IF EXISTS contract_events;
DROP TABLE IF EXISTS contracts;

CREATE TABLE contracts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_number VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    parties_json LONGTEXT,
    start_date DATE,
    end_date DATE,
    system_id VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by VARCHAR(100) DEFAULT NULL,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE contract_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_id BIGINT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSON,
    actor VARCHAR(255),
    event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    CONSTRAINT fk_event_contract FOREIGN KEY (contract_id)
        REFERENCES contracts(id)
        ON DELETE CASCADE
);

CREATE TABLE contract_attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_id BIGINT NOT NULL,
    file_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by VARCHAR(100) DEFAULT NULL,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_contract_attachment_contract
        FOREIGN KEY (contract_id)
        REFERENCES contracts(id)
        ON DELETE CASCADE
);