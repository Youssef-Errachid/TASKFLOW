package com.taskflow.controller;

import com.taskflow.dto.task.TaskRequestDTO;
import com.taskflow.dto.task.TaskResponseDTO;
import com.taskflow.enums.Priorite;
import com.taskflow.enums.Statut;
import com.taskflow.service.TaskService;
import com.taskflow.service.impl.TaskServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    private final TaskServiceImpl taskServiceImpl;

    @PostMapping
    public ResponseEntity<TaskResponseDTO> addTask(@Valid @RequestBody TaskRequestDTO dto){
        TaskResponseDTO createdTask = taskService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @GetMapping
    public ResponseEntity<Page<TaskResponseDTO>> getAllTasks(@RequestParam(required = false)Statut statut, @RequestParam(required = false) String search ,@PageableDefault(page = 0,size = 10,sort = "id", direction = Sort.Direction.ASC)Pageable pageable){
        Page<TaskResponseDTO> tasks = taskService.getAll(statut,search,pageable);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id){
        TaskResponseDTO task = taskService.getById(id);
        return ResponseEntity.ok(task);
    }

    @PutMapping ("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long id,@Valid @RequestBody TaskRequestDTO dto){
        TaskResponseDTO updatedTask = taskService.update(id,dto);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask( @PathVariable Long id){
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/statut/{statut}")
    public ResponseEntity<Page<TaskResponseDTO>>getTaskByStatut(@PathVariable Statut statut, Pageable pageable){
        return ResponseEntity.ok(taskService.getTaskByStatut(statut,pageable));
    }

    @GetMapping("/search/priorite/{priorite}")
    public ResponseEntity<List<TaskResponseDTO>>getTaskByPriorite(@PathVariable Priorite priorite){
        return ResponseEntity.ok(taskService.getTaskByPriorite(priorite));
    }

    @GetMapping("/retardtasks")
    public ResponseEntity<List<TaskResponseDTO>> retardTasks(){
      List<TaskResponseDTO> tasks = taskServiceImpl.retardTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/counttodaytasks")
    public Long countTasksOfToday(){
        Long tasks = taskServiceImpl.countTodayTasks();
        return tasks;
    }

    @GetMapping("/countalltasks")
    public Long countAllTasks(){
        Long tasks = taskServiceImpl.countAllTasks();
        return tasks;
    }

    @GetMapping("/countoverduetasks")
    public Long countOverdueTasks(){
        Long tasks = taskServiceImpl.countOverdueTasks();
        return tasks;
    }

    @GetMapping("/countdonetasks")
    public Long countOfDoneTasks(){
        Long tasks = taskServiceImpl.countDoneTasks();
        return tasks;
    }

    @GetMapping("/fivecurrenttasks")
    public ResponseEntity<List<TaskResponseDTO>> fiveCurrentTasks(){
        List<TaskResponseDTO>  tasks = taskServiceImpl.getFiveNewTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/fivetopoverduetasks")
    public ResponseEntity<List<TaskResponseDTO>> topOverdueTasks(){
        List<TaskResponseDTO>  tasks = taskServiceImpl.getFiveOverdueTasks();
        return ResponseEntity.ok(tasks);
    }
}
