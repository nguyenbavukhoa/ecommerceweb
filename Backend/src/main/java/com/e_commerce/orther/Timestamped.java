package com.e_commerce.orther;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor
@Data
    public abstract class Timestamped {
        @CreatedDate
        @Column(name = "created_at", nullable = false, updatable = false)
        private LocalDateTime createdAt;

        @LastModifiedDate
        @Column(name = "updated_at", nullable = false)
            private LocalDateTime updatedAt;
    }
