package com.taskflow.service;

import com.taskflow.dto.task.TaskRequestDTO;
import com.taskflow.dto.task.TaskResponseDTO;
import com.taskflow.enums.Priorite;
import com.taskflow.enums.Statut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskService {
    TaskResponseDTO create(TaskRequestDTO dto);
    Page<TaskResponseDTO> getAll(Statut statut,String search,Pageable pageable);
    TaskResponseDTO getById(Long id);
    TaskResponseDTO update(Long id, TaskRequestDTO dto);
    void deleteTask(Long id);
    Page<TaskResponseDTO> getTaskByStatut(Statut statut,Pageable pageable);
    List<TaskResponseDTO> getTaskByPriorite(Priorite priorite);
    Long countTodayTasks();
    Long countAllTasks();
}
