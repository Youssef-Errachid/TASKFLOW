package com.taskflow.controller;

import com.taskflow.dto.task.TaskRequestDTO;
import com.taskflow.dto.task.TaskResponseDTO;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponseDTO> addTask(@Valid @RequestBody TaskRequestDTO dto){
        TaskResponseDTO createdTask = taskService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks(){
        List<TaskResponseDTO> tasks = taskService.getAll();
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
}
