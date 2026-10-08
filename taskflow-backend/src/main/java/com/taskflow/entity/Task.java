package com.taskflow.entity;

import com.taskflow.enums.Priorite;
import com.taskflow.enums.Statut;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "the title is required")
    private String titre;

    @NotBlank(message = "the description is required")
    private String description;

    @NotNull(message = "status is required")
    @Enumerated(EnumType.STRING)
    private Statut statut;

    @NotNull(message = "priorite is required")
    @Enumerated(EnumType.STRING)
    private Priorite priorite;

    @NotNull(message = "dead line is required")
    private LocalDateTime deadline;

    @Builder.Default
    @NotNull(message = "creation date is required")
    private LocalDateTime dateCreation = LocalDateTime.now();

}
