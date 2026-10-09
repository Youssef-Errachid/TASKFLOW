package com.taskflow.mapper;

import com.taskflow.dto.task.TaskRequestDTO;
import com.taskflow.dto.task.TaskResponseDTO;
import com.taskflow.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    Task toEntity(TaskRequestDTO requestDTO);

    TaskResponseDTO toResponse(Task task);

    List<TaskResponseDTO> toResponseList(List<Task> tasks);

    void updateTaskFromRequest(TaskRequestDTO requestDTO, @MappingTarget Task task);
}
