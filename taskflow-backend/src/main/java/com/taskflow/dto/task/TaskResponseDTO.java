package com.taskflow.dto.task;

import com.taskflow.enums.Priorite;
import com.taskflow.enums.Statut;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponseDTO {
    private String titre;
    private String description;
    private Statut statut;
    private Priorite priorite;
    private LocalDateTime deadline;
    private LocalDateTime dateCreation;
}
