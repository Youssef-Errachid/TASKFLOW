package com.taskflow.service.impl;

import com.taskflow.dto.task.TaskRequestDTO;
import com.taskflow.dto.task.TaskResponseDTO;
import com.taskflow.entity.Task;
import com.taskflow.enums.Priorite;
import com.taskflow.enums.Statut;
import com.taskflow.exception.BusinessException;
import com.taskflow.mapper.TaskMapper;
import com.taskflow.repository.TaskRepository;
import com.taskflow.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
    public Page<TaskResponseDTO> getAll(Statut statut,String search ,Pageable pageable){

        boolean hasSearch = search != null && !search.isBlank();
        boolean hasStatut = statut != null;

        Page<Task> tasks;

        if (hasSearch && hasStatut) {
            tasks = taskRepository.findByTitreContainingIgnoreCaseAndStatut(search.trim(), statut, pageable);
        } else if (hasSearch) {
            tasks = taskRepository.findAllByTitreContainingIgnoreCase(search.trim(), pageable);
        } else if (hasStatut) {
            tasks = taskRepository.findByStatut(statut,pageable);
        } else {
            tasks = taskRepository.findAll(pageable);
        }

        return tasks.map(taskMapper::toResponse);
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
    @Override
    public Page<TaskResponseDTO> getTaskByStatut(Statut statut,Pageable pageable){
        Page<Task>  tasks = taskRepository.findByStatut(statut,pageable);
       return tasks.map(taskMapper::toResponse);
    }

    @Override
    public List<TaskResponseDTO> getTaskByPriorite(Priorite priorite){
        return taskMapper.toResponseList(taskRepository.findByPriorite(priorite));
    }

    public List<TaskResponseDTO> retardTasks(){
        List<Task> tasks = taskRepository.findRetardTasks(LocalDateTime.now(),Statut.DONE);
        return taskMapper.toResponseList(tasks);
    }

    @Override
    public Long countTodayTasks(){
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);
        Long countTodayTasks = taskRepository.countByDeadlineBetween(start,end);
        return countTodayTasks;
    }

    @Override
    public Long countAllTasks(){
        return taskRepository.count();
    }

    public Long countOverdueTasks(){
        Long numberOfTasks_overdue = taskRepository.countOverdueTasks(LocalDateTime.now(),Statut.DONE);
        return numberOfTasks_overdue;
    }

    public Long countDoneTasks(){
        Long numberOfDoneTasks = taskRepository.countDoneTasks(Statut.DONE);
        return numberOfDoneTasks;
    }


    public List<TaskResponseDTO> getFiveNewTasks() {
        return taskMapper.toResponseList(taskRepository.findTop5ByOrderByDateCreationDesc());
    }

    public List<TaskResponseDTO> getFiveOverdueTasks() {
        List<Task> tasks = taskRepository
                .findTop5ByDeadlineBeforeAndStatutNotOrderByDeadlineAsc(LocalDateTime.now(), Statut.DONE);
        return taskMapper.toResponseList(tasks);
    }

}


