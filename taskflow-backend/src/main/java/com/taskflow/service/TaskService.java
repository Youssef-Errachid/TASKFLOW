package com.taskflow.service;

import com.taskflow.dto.task.TaskRequestDTO;
import com.taskflow.dto.task.TaskResponseDTO;

import java.util.List;

public interface TaskService {
    TaskResponseDTO create(TaskRequestDTO dto);
    List<TaskResponseDTO> getAll();
    TaskResponseDTO getById(Long id);
    TaskResponseDTO update(Long id, TaskRequestDTO dto);
    void deleteTask(Long id);
}
