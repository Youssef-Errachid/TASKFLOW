package com.taskflow.dto.task;

import com.taskflow.enums.Priorite;
import com.taskflow.enums.Statut;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequestDTO {

    @NotBlank(message = "the title is required")
    private String titre;

    @NotBlank(message = "the description is required")
    private String description;

    @NotNull(message = "status is required")
    private Statut statut;

    @NotNull(message = "priorite is required")
    private Priorite priorite;

    @NotNull(message = "dead line is required")
    @Future(message = "deadline must be in the future")
    private LocalDateTime deadline;

}
