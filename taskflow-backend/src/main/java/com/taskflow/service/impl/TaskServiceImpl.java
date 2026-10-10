package com.taskflow.service.impl;

import com.taskflow.dto.task.TaskRequestDTO;
import com.taskflow.dto.task.TaskResponseDTO;
import com.taskflow.entity.Task;
import com.taskflow.exception.BusinessException;
import com.taskflow.mapper.TaskMapper;
import com.taskflow.repository.TaskRepository;
import com.taskflow.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

   private final TaskRepository taskRepository;
   private final TaskMapper taskMapper;

    @Override
    public TaskResponseDTO create(TaskRequestDTO dto){
        Task task = taskMapper.toEntity(dto);
        Task taskSaved = taskRepository.save(task);

        return taskMapper.toResponse(taskSaved);
    }

    @Override
    public List<TaskResponseDTO> getAll(){
        List<Task> tasks = taskRepository.findAll();
        List<TaskResponseDTO> dtoList = taskMapper.toResponseList(tasks);
        return dtoList;
    }

    @Override
    public TaskResponseDTO getById(Long id){
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Task with Id : " + id + " not found"));
        TaskResponseDTO dto = taskMapper.toResponse(task);
        return dto;
    }

    @Override
    public TaskResponseDTO update(Long id, TaskRequestDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Task with Id : " + id + " not found"));
        taskMapper.updateTaskFromRequest(dto, task);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    public void deleteTask(Long id){

        if(!taskRepository.existsTaskById(id)){
            throw new BusinessException("Task with Id : "  + id + " not found");
        }

        taskRepository.deleteById(id);
        }
}


